using Auctioneer.Server.Data;
using Auctioneer.Server.Models;
using Auctioneer.Server.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json.Linq;
using System;
using System.Text.Json;
using static System.Runtime.InteropServices.JavaScript.JSType;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Auctioneer.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SalesController : ControllerBase
    {

        private readonly ICacheService _cacheService;
        private readonly AppDbContext _appDbContext;
        private readonly IUserService _userService;

        public SalesController(ICacheService cacheService, AppDbContext appDbContext, IUserService userService)
        {
            _cacheService = cacheService;
            _appDbContext = appDbContext;
            _userService = userService;
        }

        public class SalesResponseData
        {
            public bool Error { get; set; }
            public User User { get; set; }
            public string Message { get; set; }
        }

        public class SaleListItem
        {
            public int Id { get; set; }
            public int User_id { get; set; }
            public int Api_id { get; set; }
            public int Price { get; set; }
        }


        // get all sales
        [HttpGet]
        public async Task<ActionResult<List<SaleListItem>>> GetSales()
        {
            try
            {
                // check cache
                var cachedSales = _cacheService.GetData<List<SaleListItem>>("usersales");
                if (cachedSales != null)
                {
                    return Ok(cachedSales);
                } else
                {
                    var sales = await _appDbContext.Sales
                        .Select(x => new SaleListItem
                        {
                            Id = x.Id,
                            User_id = x.User.Id,
                            Api_id = x.Artwork.Api_id,
                            Price = x.Price
                        })
                        .ToListAsync();
                    var expiryTime = DateTimeOffset.Now.AddHours(1);
                    _cacheService.SetData<List<SaleListItem>>("usersales", sales, expiryTime, false);
                    return Ok(sales);
                }
            }
            catch 
            { 
                return BadRequest();
            }
        }

        // create a sale
        [HttpPost, Authorize(Roles = "User")]
        public async Task<ActionResult<SalesResponseData>> CreateSale(SaleDto request)
        {
            SalesResponseData res = new SalesResponseData();  

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

                // get the artwork from the request
                var artwork = await _appDbContext.Artworks.FirstOrDefaultAsync(artwork => artwork.Api_id == request.Api_id);

                if (artwork == null)
                {
                    res.Error = true;
                    res.Message = "Item does not exist.";
                    return Ok(res);
                };

                // check if the user owns the item 
                bool ownsItem = user.Artworks?.Any(artwork => artwork.Api_id == request.Api_id) ?? false;

                if (!ownsItem)
                {
                    res.Error = true;
                    res.Message = "Item not found in inventory.";
                    return Ok(res);
                };

                // remove the artwork from the users inventory and add it to the sales object

                user.Artworks?.Remove(artwork);

                Sale newSale = new Sale();
                newSale.Price = request.Price;
                newSale.Artwork = artwork;
                newSale.User = user;


                _appDbContext.Sales.Add(newSale);
                _appDbContext.SaveChanges();

                res.Error = false;
                res.User = user;
                res.Message = "Sale created.";

                return Ok(res);
            }
            catch
            {
                // TODO error handling
                res.Error = true;
                res.Message = "Error";
                return BadRequest(res);
            }
        }


        // cancel a sale
        [Route("cancel")]
        [HttpPost, Authorize(Roles = "User")]
        public async Task<ActionResult<SalesResponseData>> CancelSale([FromBody] int sale_id)
        {
            SalesResponseData res = new SalesResponseData();

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

                // get the sale from the request
                var sale = await _appDbContext.Sales.Include(v => v.User).Include(x => x.Artwork).FirstOrDefaultAsync(sale => sale.Id == sale_id);

                if (sale == null)
                {
                    res.Error = true;
                    res.Message = "Item does not exist.";
                    return Ok(res);
                };

                // check if the user matches the sale
                if (sale.User.Id != user_id)
                {
                    res.Error = true;
                    res.Message = "";
                    return Ok(res);
                };

                // remove the sale  and add it back to the users inventory

                user.Sales?.Remove(sale);
                var artwork = await _appDbContext.Artworks.FirstOrDefaultAsync(artwork => artwork.Api_id == sale.Artwork.Api_id);
                user.Artworks?.Add(artwork);

                _appDbContext.SaveChanges();

                res.Error = false;
                res.User = user;
                res.Message = "Sale cancelled.";

                return Ok(res);
            }
            catch
            {
                // TODO error handling
                res.Error = true;
                res.Message = "Error";
                return BadRequest(res);
            }
        }



        // get the sales of a specific user

        [HttpGet("user")]
        public async Task<ActionResult<List<SaleListItem>>> GetUserSales()
        {
            try
            {
                // find the user from the id in the JWT payload
                var x = _userService.GetUserId();
                int user_id = Int32.Parse(x);

                var sales = await _appDbContext.Sales
                    .Where(s => s.User.Id == user_id)
                    .Select(x => new SaleListItem
                    {
                        Id = x.Id,
                        Api_id = x.Artwork.Api_id,
                        Price = x.Price
                    })
                    .ToListAsync();

                return Ok(sales);   
            }
            catch
            {
                return BadRequest();
            }

        }

    }
}
