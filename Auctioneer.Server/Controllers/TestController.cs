using Auctioneer.Server.Data;
using Auctioneer.Server.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Auctioneer.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TestController : ControllerBase
    {

        private readonly ICacheService _cacheService;
        private readonly AppDbContext _appDbContext;
        private readonly IUserService _userService;

        public TestController(ICacheService cacheService, AppDbContext appDbContext, IUserService userService) 
        { 
            _cacheService = cacheService;
            _appDbContext = appDbContext;
            _userService = userService;
        }
        // GET: api/<TestController>
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var cacheData = _cacheService.GetData<string>("test");
            if(cacheData != null) {
                return Ok(cacheData);            
            } else
            {
                return Ok("ALLO");
            }
        }

        // GET api/<TestController>/5
        [HttpGet("{id}")]
        public string Get(int id)
        {
            return "value";
        }

        // POST api/<TestController>
        [HttpPost, Authorize(Roles = "User")]
        public IActionResult Post([FromBody] string allo)
        {
            Console.WriteLine("called test post");
            Console.WriteLine(allo);
            var x = _userService.GetUserId();
            Console.WriteLine(x);
            return Ok("ALLO");
        }

        // PUT api/<TestController>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<TestController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
