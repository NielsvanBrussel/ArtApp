using Newtonsoft.Json.Linq;
using System.Xml.Linq;

namespace Auctioneer.Server.Models
{
    public class Exhibition
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Short_description { get; set; }
        public string Web_url { get; set;}
        public string Image_url { get; set; }
        public List<int> Artwork_ids { get; set; }
    }
}
