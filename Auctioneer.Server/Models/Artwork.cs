namespace Auctioneer.Server.Models
{
    public class Artwork

    {
        public int Id { get; set; }
        public int Api_id { get; set; }
        public List<User>? Users { get; set; } = [];
    }
}
