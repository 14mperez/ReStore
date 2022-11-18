using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Http.Features;

namespace API.Entities
{
    public class Basket
    {
        public int Id { get; set; }
        public string BuyerId { get; set; }
        public List<BasketItem> Items { get; set; } = new();

        // When method is called, track item in memory and update basket in memory
        public void AddItem(Product product, int quantity)
        {
            if (Items.All(item => item.ProductId != product.Id))
            {
                Items.Add(new BasketItem{Product = product, Quantity = quantity});
            }

            var existingItem = Items.FirstOrDefault(item => item.ProductId == product.Id);
            if (existingItem != null) existingItem.Quantity += quantity;
            {
                
            }
        }

        // Method to remove item from basket
        public void RemoveItem(int productId, int quantity)
        {
            var item = Items.FirstOrDefault(item => item.ProductId == productId);
            if (item == null) return; // If item is null, then we can't reduce quantity and exits method
            item.Quantity -= quantity; // If item is not null, remove item quantity from basket
            if (item.Quantity == 0) Items.Remove(item); // If the quantity of the item is 0, remove item from basket
        }

        internal void RemoveItem(ItemsFeature productId, int quantity)
        {
            throw new NotImplementedException();
        }
    }
}