using Auctioneer.Server.Data;
using Auctioneer.Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Auctioneer.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {

        public static User user = new User();
        private readonly AppDbContext _appDbContext;
        private readonly IConfiguration _configuration;

        public AuthController(AppDbContext appDbContext, IConfiguration configuration)
        { 
            _appDbContext = appDbContext;
            _configuration = configuration;
        }

        public class AuthResponseData
        {
            public bool Error { get; set; }
            public User? User { get; set; }
            public string? Message { get; set; }
            public string? Jwt { get; set; }
        }

        private string GenerateToken(User user)
        {
            List<Claim> claims = new List<Claim>()
            {
                new Claim(ClaimTypes.Name, user.Id.ToString()),
                new Claim(ClaimTypes.Role, "User")
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration.GetSection("AppSettings:JWTSecret").Value!));

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            var token = new JwtSecurityToken(
                    claims: claims,
                    expires: DateTime.UtcNow.AddDays(1),
                    signingCredentials: creds
                );

            var jwt = new JwtSecurityTokenHandler().WriteToken(token);

            return jwt;
        }


        [Route("register")]
        [HttpPost]
        public async Task<ActionResult<AuthResponseData>> Register(UserDto request)
        {

            try
            {
                var userFound = await _appDbContext.Users.FirstOrDefaultAsync(user => user.Username == request.Username.ToLower());

                AuthResponseData res = new AuthResponseData(); 

                if (userFound == null)
                {
                    string passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);

                    User newUser = new User();

                    newUser.Username = request.Username.ToLower();
                    newUser.HashedPassword = passwordHash;
                    newUser.CreatedTimestamp = DateTime.UtcNow;
                    newUser.Currency = 50000;

                    _appDbContext.Users.Add(newUser);
                    _appDbContext.SaveChanges();


                    // automatically log in user

                    string jwt = GenerateToken(newUser);

                    res.Message = "User created!";
                    res.User = newUser;
                    res.Error = false;
                    res.Jwt = jwt;

                    return Ok(res);
                } else
                {
                    res.Message = "Username already in use!";
                    res.Error = true;
              
                    return Ok(res);
                }
            }
            catch (Exception err)
            {
                Console.WriteLine(err.Message);
                throw;
            }
        }


        // POST api/<AuthController>
        [Route("login")]
        [HttpPost]
        public async Task<ActionResult<AuthResponseData>> Login(UserDto request)
        {

            try
            {
                AuthResponseData res = new AuthResponseData();
                var userFound = await _appDbContext.Users.Include(u => u.Artworks).FirstOrDefaultAsync(user => user.Username == request.Username.ToLower());

                if (userFound != null)
                {
                    var comparePW = BCrypt.Net.BCrypt.Verify(request.Password, userFound.HashedPassword);
                    if (comparePW)
                    {
                        string jwt = GenerateToken(userFound);

                        res.Message = "User created!";
                        res.User = userFound;
                        res.Error = false;
                        res.Jwt = jwt;
                        return Ok(res);
                    }
                    else
                    {
                        res.Message = "Invalid credentials!";
                        res.Error = true;
                        return Ok(res);
                    }
                }
                else
                {
                    res.Message = "Invalid credentials!";
                    res.Error = true;
                    return Ok(res);

                }
            }
            catch (Exception err)
            {
                Console.WriteLine(err.Message);
                return BadRequest(err);
                throw;
            }

        }


        [Route("autologin")]
        [HttpGet]
        public async Task<ActionResult<AuthResponseData>> AutoLogin()
        {

            try
            {
                //var userFound = await _appDbContext.Users.FirstOrDefaultAsync(user => user.Username == request.Username.ToLower());

                AuthResponseData res = new AuthResponseData();
                return Ok(res);
            }
            catch (Exception err)
            {
                Console.WriteLine(err.Message);
                throw;
            }
        }

    }
}
