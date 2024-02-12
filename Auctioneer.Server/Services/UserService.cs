using System.Security.Claims;

namespace Auctioneer.Server.Services
{
    public class UserService : IUserService
    {
        private readonly IHttpContextAccessor _contextAccessor;

        public UserService(IHttpContextAccessor contextAccessor)
        {
            _contextAccessor = contextAccessor;
        }

        public string? GetUserId()
        {
            var result = string.Empty;
            if(_contextAccessor.HttpContext != null)
            {
                result = _contextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Name);
            }
            return result;
        }
    }
}
