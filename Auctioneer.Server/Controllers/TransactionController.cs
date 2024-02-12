using Auctioneer.Server.Data;
using Auctioneer.Server.Models;
using Auctioneer.Server.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Auctioneer.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TransactionController : ControllerBase
    {

        private readonly ICacheService _cacheService;
        private readonly AppDbContext _appDbContext;
        private readonly IUserService _userService;

        public TransactionController(ICacheService cacheService, AppDbContext appDbContext, IUserService userService)
        {
            _cacheService = cacheService;
            _appDbContext = appDbContext;
            _userService = userService;
        }

        public class TransactionResponseData
        {
            public bool Error { get; set; }
            public User? User { get; set; }
            public string? Message { get; set; }
        }


        // POST buy new item
        [HttpPost("buynew"), Authorize(Roles = "User")]
        public async Task<ActionResult<TransactionResponseData>> BuyNew([FromBody] int artwork_api_id)
        {
            TransactionResponseData res = new TransactionResponseData();
            try
            {
                // find the user from the id in the JWT payload
                var x = _userService.GetUserId();
                int user_id = Int32.Parse(x);
                var user = await _appDbContext.Users.Include(u => u.Artworks).FirstOrDefaultAsync(user => user.Id == user_id);

                if (user == null)
                {
                    return BadRequest();
                };

                // check if the user has enough currency to buy the artwork
                if (user.Currency < 2000)
                {
                    res.Error = true;
                    res.User = user;
                    res.Message = "Insufficient funds.";
                    return Ok(res);
                }

                // get the artwork, if the artwork does not exist yet, create it
                var artwork = await _appDbContext.Artworks.FirstOrDefaultAsync(artwork => artwork.Api_id == artwork_api_id);


                if (artwork == null)
                {
                    Artwork newArtwork = new Artwork();
                    newArtwork.Api_id = artwork_api_id;
                    _appDbContext.Artworks.Add(newArtwork);
                    _appDbContext.SaveChanges();
                    artwork = newArtwork;
                } 

                // check if the user doesn't already own this item
                if (user.Artworks!.Contains(artwork))
                {
                    res.Error = true;
                    res.User = user;
                    res.Message = "You already own this item.";
                    return Ok(res);
                }

                // remove 2000 from the currency (all new artworks cost 2000)
                user.Currency = user.Currency - 2000;
                user.Artworks?.Add(artwork);

                _appDbContext.SaveChanges();

                res.Error = false;
                res.User = user;
                res.Message = "Success";
                return Ok(res);

            }
            catch 
            {
                res.Error = true;
                return BadRequest(res);
            }
        }

        // POST api/<TransactionController>
        [HttpPost("buyold"), Authorize(Roles = "User")]
        public async Task<ActionResult<TransactionResponseData>> BuyOld([FromBody] int sales_id)
        {
            TransactionResponseData res = new TransactionResponseData();
            try
            {
                // find the user from the id in the JWT payload
                var x = _userService.GetUserId();
                int user_id = Int32.Parse(x);
                var user = await _appDbContext.Users.Include(u => u.Artworks).FirstOrDefaultAsync(user => user.Id == user_id);

                if (user == null)
                {
                    return BadRequest();
                };

                // get the sale
                var sale = await _appDbContext.Sales.FirstOrDefaultAsync(sale => sale.Id == sales_id);

                // sale can be null if the item has just been sold
                if (sale == null)
                {
                    res.Error = true;
                    res.User = user;
                    res.Message = "Item not available";
                    return Ok(res);
                }

                // check if the user has enough currency to buy the artwork
                if (user.Currency < sale.Price)
                {
                    res.Error = true;
                    res.User = user;
                    res.Message = "Insufficient funds.";
                    return Ok(res);
                }

                // check if the user doesn't already own this item
                if (user.Artworks!.Contains(sale.Artwork))
                {
                    res.Error = true;
                    res.User = user;
                    res.Message = "You already own this item.";
                    return Ok(res);
                }
                
                // remove the artwork price from the user's currency
                user.Currency = user.Currency - sale.Price;

                // add the artwork to the user's inventory and remove the sale
                user.Artworks?.Add(sale.Artwork);
                _appDbContext.Sales.Remove(sale);
                _appDbContext.SaveChanges();

                res.Error = false;
                res.User = user;
                res.Message = "Success";
                return Ok(res);

            }
            catch
            {
                res.Error = true;
                return BadRequest(res);
            }
        }
    }
}
