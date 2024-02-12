using Microsoft.Net.Http.Headers;
using System.IdentityModel.Tokens.Jwt;

namespace Auctioneer.Server.Middleware
{
    public class TestMiddleware : IMiddleware
    {
        private readonly ILogger<TestMiddleware> _logger;
        private readonly IConfiguration _configuration;
        public TestMiddleware(ILogger<TestMiddleware> logger, IConfiguration configuration)
        {
            _logger = logger;
            _configuration = configuration;
        }

        public static bool ValidateToken(string token)
        {
            if (token == null)
            {
                return false;
            }

            var tokenHandler = new JwtSecurityTokenHandler();
            return false;
   
        }

        public async Task InvokeAsync(HttpContext context, RequestDelegate next)
        {
            var x = context.Request.Headers[HeaderNames.Authorization].ToString().Replace("Bearer ", "");
            Console.WriteLine("middleware called");
            await next(context);
        }
    }
}
