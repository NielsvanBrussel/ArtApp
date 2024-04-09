using Auctioneer.Server.Services;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;


// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Auctioneer.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HourlySalesController : ControllerBase
    {

        private readonly ICacheService _cacheService;

        public HourlySalesController(ICacheService cacheService)
        {
            _cacheService = cacheService;
        }

        public class HourlySalesResponseData
        {
            public bool Error { get; set; }
            public string? Data { get; set; }
        }


        private async Task<int> GetRandomArtworkID(HttpClient client)
        {
            try 
            {
                Random rnd = new Random();
                int pageNumber = rnd.Next(1, 10300);
                var uriString = $"https://api.artic.edu/api/v1/artworks?&page={pageNumber}&fields=id";
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
                    var artworkIDArray = dataParsed.data;
                    var rndm = rnd.Next(0, artworkIDArray.Count);
                    var artworkID = artworkIDArray[rndm].id.ToObject<int>();
                    return artworkID;
                }
            }
            catch
            {
                return 0;
            }
        }

        private async Task<int[]> GetRandomArtworkIDs()
        {
            var client = new HttpClient();

            var tasks = new List<Task<int>>();

            for (int i = 0; i < 5; i++)
            {
                tasks.Add(GetRandomArtworkID(client));
            }

            var responses = await Task.WhenAll(tasks);

            return responses;
        }

        private async Task<string> CreateNewHourlySales(int[] idArray)
        {

            // fetch the new data based on the random ID's generated
            var client = new HttpClient();
            var data = "";
            var uriString = $"https://api.artic.edu/api/v1/artworks?ids={idArray[0]},{idArray[1]},{idArray[2]},{idArray[3]},{idArray[4]}&fields=id,title,date_display,artist_display,artwork_type_title,category_titles,image_id,medium_display,term_titles";
            var request = new HttpRequestMessage
            {
                Method = HttpMethod.Get,
                RequestUri = new Uri(uriString),
                Headers = { },
            };
            using (var response = await client.SendAsync(request))
            {
                response.EnsureSuccessStatusCode();
                data = await response.Content.ReadAsStringAsync();
            }

            //store the data in cache for 1 day
            var expiryTime = DateTimeOffset.Now.AddHours(1);
            _cacheService.SetData<string>("hourlysales", data, expiryTime, false);

            return data;
        }


        // GET: api/<HourlySalesController>
        [HttpGet]
        public async Task<ActionResult<HourlySalesResponseData>> Get()
        {
            HourlySalesResponseData res = new HourlySalesResponseData();

            try
            {
                //check the cache for data, if the cachedata has expired create new hourlysales
                var cacheData = _cacheService.GetData<string>("hourlysales");
                if (cacheData != null)
                {
                    res.Data = cacheData;
                    res.Error = false;
                    return Ok(res);
                }
                else
                {
                    var idArray = await GetRandomArtworkIDs();
                    var newSales = await CreateNewHourlySales(idArray);
                    res.Data = newSales;
                    res.Error = false;
                    return Ok(res);
                }
            }
            catch (Exception)
            {
                res.Data = null;
                res.Error = true;
                return BadRequest(res);
                throw;
            }

        }
    }
}
