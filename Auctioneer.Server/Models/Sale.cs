namespace Auctioneer.Server.Models
{
    public class Sale
    {
        public int Id { get; set; }
        public Artwork Artwork { get; set; }
        public User User { get; set; }
        public int Price { get; set; }
    }
}
