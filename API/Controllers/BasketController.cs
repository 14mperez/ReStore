using System;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class BasketController : BaseApiController
    {
        private readonly StoreContext _context;
        public BasketController(StoreContext context)
        {
            _context = context;
        }

        // Using HttpGet to get items in basket
        [HttpGet(Name = "GetBasket")]
        public async Task<ActionResult<BasketDto>> GetBasket()
        {
            var basket = await RetrieveBasket();

            // If basket is empty return NotFound method
            if (basket == null) return NotFound();
            return MapBasketToDto(basket);
        }

        // HttpPost to create a resource on the server
        [HttpPost]
        public async Task<ActionResult<BasketDto>> AddItemToBasket(int productId, int quantity)
        {
            // Get Basket or create Basket
            var basket = await RetrieveBasket();
            if (basket == null) basket = CreateBasket();

            // Get Product
            var product = await _context.Products.FindAsync(productId);
            if (product == null) return NotFound(); // If there is no product, exit and return not found

            // Add Item
            basket.AddItem(product, quantity);

            // Save Changes
            var result = await _context.SaveChangesAsync() > 0;

            // If the results were successful, return ok status code
            if (result) return CreatedAtRoute("GetBasket", MapBasketToDto(basket));
            
            // If results were not successful, return bad request code
            return BadRequest(new ProblemDetails{Title = "Problem saving item to basket"});
        }



        // HttpDelete to remove basket item
        [HttpDelete]
        public async Task<ActionResult> RemoveBasketItem(int productId, int quantity)
        {
            // Get basket
            var basket = await RetrieveBasket();
            if(basket == null) return NotFound(); // Checking to see if basket is empty
            // Remove item or reduce quantity
            basket.RemoveItem(productId, quantity);
            // Save changes
            var result = await _context.SaveChangesAsync() > 0;
            // Return ok if results came out true
            if (result) return Ok();
            // Return error if results did not return ok
            return BadRequest(new ProblemDetails{Title = "Problem saving item to basket"});
        }

        // Method to retrieve item in basket
        private async Task<Basket> RetrieveBasket()
        {
            // Retrieve item or null
            return await _context.Baskets
                .Include(i => i.Items)
                .ThenInclude(p => p.Product)
                .FirstOrDefaultAsync(x => x.BuyerId == Request.Cookies["buyerId"]); 
        }

        private Basket CreateBasket()
        {
            // Creating global unique identifier for userId to not have duplicates
            var buyerId = Guid.NewGuid().ToString();
            // Essential cookie in order for web app to work
            var cookieOptions = new CookieOptions{IsEssential = true, Expires = DateTime.Now.AddDays(30)};
            // Using string of buyerId to retrieve cookie
            Response.Cookies.Append("buyerId", buyerId, cookieOptions);
            var basket = new Basket{BuyerId = buyerId};
            _context.Baskets.Add(basket);
            return basket;
        }

        private BasketDto MapBasketToDto(Basket basket)
        {
            return new BasketDto
            {
                Id = basket.Id,
                BuyerId = basket.BuyerId,
                Items = basket.Items.Select(item => new BasketItemDto
                {
                    ProductId = item.ProductId,
                    Name = item.Product.Name,
                    Price = item.Product.Price,
                    PictureUrl = item.Product.PictureUrl,
                    Type = item.Product.Type,
                    Brand = item.Product.Brand,
                    Quantity = item.Quantity
                }).ToList()
            };
        }
    }
}