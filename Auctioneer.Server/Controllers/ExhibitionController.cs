using Auctioneer.Server.Models;
using Auctioneer.Server.Services;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using System.Text.Json;


// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Auctioneer.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ExhibitionController : ControllerBase
    {
        private readonly ICacheService _cacheService;

        public ExhibitionController(ICacheService cacheService)
        {
            _cacheService = cacheService;
        }

        public class ExhibitionResponseData
        {
            public bool Error { get; set; }
            public List<Exhibition> Exhibitions { get; set; }
            public double TTL { get; set; }
        }


        public static List<T> Shuffle<T>(List<T> list)
        {

            Random rng = new Random();

            int n = list.Count;
            while (n > 1)
            {
                n--;
                int k = rng.Next(n + 1);
                T value = list[k];
                list[k] = list[n];
                list[n] = value;
            }

            return list;
        }


        private async Task<Exhibition> GetRandomExhibition(HttpClient client)
        {
            try
            {
                Random rnd = new Random();
                int pageNumber = rnd.Next(1, 517);
                var uriString = $"https://api.artic.edu/api/v1/exhibitions?fields=id,title,short_description,web_url,artwork_ids,image_url&page={pageNumber}";
                var request = new HttpRequestMessage
                {
                    Method = HttpMethod.Get,
                    RequestUri = new Uri(uriString),
                    Headers = { },
                };

                using (var response = await client.SendAsync(request))
                {
                    response.EnsureSuccessStatusCode();
                    var body = await response.Content.ReadAsStringAsync();
                    dynamic dataParsed = JObject.Parse(body);
                    List<Exhibition> exhibitionsUnshuffled = dataParsed.data.ToObject<List<Exhibition>>();

                    List<Exhibition> exhibitions = Shuffle(exhibitionsUnshuffled);
                    Exhibition exhibition = new Exhibition();
  

                    bool hasNoNullValues = false;
                    int index = 0;

                    while (hasNoNullValues == false)
                    {
                        exhibition = exhibitions[index];
                        hasNoNullValues = exhibition.Artwork_ids.Count > 2 && exhibition.GetType().GetProperties().All(p => p.GetValue(exhibition, null) != null);
                        if (hasNoNullValues == false)
                        {
                            if (index + 1 == exhibitions.Count)
                            {
                                exhibition = await GetRandomExhibition(client);
                                return exhibition;
                            }
                            index++;
                        }
                    }

                    return exhibition;
                }
            }
            catch
            {
                return null;
            }
        }

        private async Task<List<Exhibition>> GetExhibitions()
        {

            List<Exhibition> exhibitions = new List<Exhibition>(4);
            try
            {
                var client = new HttpClient();

                List<string> cachedData = [
                    _cacheService.GetData<string>("exhibition_1"),
                    _cacheService.GetData<string>("exhibition_2"),
                    _cacheService.GetData<string>("exhibition_3"),
                    _cacheService.GetData<string>("exhibition_4")
                ];


                if (cachedData[0] != null && cachedData[1] != null && cachedData[2] != null && cachedData[3] != null)
                {

                    for (int i = 0; i < cachedData.Count; i++)
                    {
                        Exhibition exhibition = JsonSerializer.Deserialize<Exhibition>(cachedData[i]);
                        exhibitions.Add(exhibition);
                    }

                    return exhibitions;
                }
                else
                {
                    if (cachedData[1] != null & cachedData[2] != null & cachedData[3] != null)
                    {
                        var expiryTime = DateTimeOffset.Now.AddHours(1);


                        for (int i = 1; i < cachedData.Count; i++)
                        {
                            _cacheService.SetData<string>($"exhibition_{i}", cachedData[i], i == 1 ? expiryTime : default, i != 1);
                            Exhibition exhibition = JsonSerializer.Deserialize<Exhibition>(cachedData[i]);
                            exhibitions.Add(exhibition);
                        }

                        Exhibition newExhibition = await GetRandomExhibition(client);
                        exhibitions.Add(newExhibition);
                        string newExhibitionString = JsonSerializer.Serialize(newExhibition);
                        _cacheService.SetData<string>("exhibition_4", newExhibitionString, default, true);

                        return exhibitions;

                    } else
                    {
                        for (int i = 1; i < 5; i++)
                        {
                            Exhibition newExhibition = await GetRandomExhibition(client);
                            exhibitions.Add(newExhibition);
                            var expiryTime = i == 1 ? DateTimeOffset.Now.AddHours(1) : default;
                            bool persistent = i != 1;
                            string newExhibitionString = JsonSerializer.Serialize(newExhibition);
                            _cacheService.SetData<string>($"exhibition_{i}", newExhibitionString, expiryTime, persistent);
                        }
                        return exhibitions;
                    }

                }
            }
            catch
            {
                return null;
            }
        }


        //https://api.artic.edu/api/v1/exhibitions?fields=id,title,short_description,web_url,artwork_ids,image_url
        // GET: api/<ExhibitionController>
        [HttpGet]
        public async Task<ActionResult<ExhibitionResponseData>> Get()
        {
            ExhibitionResponseData res = new ExhibitionResponseData();
            try
            {
                List<Exhibition> exhibitions = await GetExhibitions();
                res.Exhibitions = exhibitions;
                TimeSpan TTL = _cacheService.GetTTL<TimeSpan>("exhibition_1");
                res.TTL = TTL.TotalSeconds;

                return Ok(res);
            } catch
            {
                res.Error = true;
                return Ok(res);
            }
        }
    }
}
