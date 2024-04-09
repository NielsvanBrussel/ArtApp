namespace Auctioneer.Server.Services
{
    public interface ICacheService
    {
        T GetData<T>(string key);

        TimeSpan GetTTL<T>(string key);
        bool SetData<T>(string key, T value, DateTimeOffset expirationTime, bool persistent);
        object RemoveData(string key);
    }
}
