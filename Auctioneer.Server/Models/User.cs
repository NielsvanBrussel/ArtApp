namespace Auctioneer.Server.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string HashedPassword { get; set; } = string.Empty;
        public DateTime CreatedTimestamp { get; set; }
        public int Currency { get; set; } = 30000;
        public List<Artwork>? Artworks { get; set; } = [];
        public List<Sale>? Sales { get; set; } = [];
    }
}