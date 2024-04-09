using StackExchange.Redis;
using System.Text.Json;

namespace Auctioneer.Server.Services;

public class CacheService : ICacheService
{

    protected readonly IConfiguration _configuration;
    private IDatabase _cacheDB;


    public CacheService(IConfiguration configuration)
    {
        _configuration = configuration;
        var redis = ConnectionMultiplexer.Connect(_configuration.GetSection("ConnectionStrings:CacheConnection").Value!);
        _cacheDB = redis.GetDatabase();
    }

    public T GetData<T>(string key)
    {
        var value = _cacheDB.StringGet(key);
        if (!string.IsNullOrEmpty(value))
        {
            var x = JsonSerializer.Deserialize<T>(value!)!;
            return x;
        }
        return default!;
    }

    public TimeSpan GetTTL<T>(string key)
    {
        var value = _cacheDB.KeyTimeToLive(key);
        if (value != null)
        {
      
            return value.Value;
        }
        return default!;
    }

    public object RemoveData(string key)
    {
        var _exists = _cacheDB.KeyExists(key);
        if (_exists)
        {
            return _cacheDB.KeyDelete(key);
        }
        return false;
    }

    public bool SetData<T>(string key, T value, DateTimeOffset expirationTime, bool persistent)
    {
        var expiryTime = expirationTime.DateTime.Subtract(DateTime.Now);
        var x = JsonSerializer.Serialize(value);

        if (persistent)
        {
            return _cacheDB.StringSet(key, x);
        }

        return _cacheDB.StringSet(key, x, expiryTime);
    }
}
