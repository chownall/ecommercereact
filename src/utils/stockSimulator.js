// Utility to simulate product stock status without database
// Uses multiple criteria to determine if a product is out of stock

export const isOutOfStock = (product) => {
  if (!product) return false;

  // Method 1: Based on ID (odd IDs = out of stock)
  const idBased = product.id % 2 === 1;
  
  // Method 2: Based on category
  const outOfStockCategories = ['jewelery'];
  const categoryBased = outOfStockCategories.includes(product.category);
  
  // Method 3: Based on price (expensive products = out of stock)
  const priceBased = product.price > 80;
  
  // Method 4: Based on rating (popular products = more likely out of stock)
  const rating = product.rating?.rate || 0;
  const popularBased = rating > 4.5 && product.price > 30;
  
  // Combine methods (at least 2 criteria = out of stock)
  const criteria = [idBased, categoryBased, priceBased, popularBased];
  const trueCriteria = criteria.filter(Boolean).length;
  
  return trueCriteria >= 2;
};

export const getStockLevel = (product) => {
  if (isOutOfStock(product)) return 0;
  
  // Stock level simulation
  const baseStock = 50;
  const rating = product.rating?.rate || 0;
  const price = product.price || 0;
  
  // Popular products have less stock
  const popularityFactor = Math.max(0.1, 1 - (rating - 3) * 0.2);
  // Expensive products have less stock
  const priceFactor = Math.max(0.1, 1 - (price / 100));
  
  return Math.floor(baseStock * popularityFactor * priceFactor);
};

export const getStockStatus = (product) => {
  const stock = getStockLevel(product);
  
  if (stock === 0) return 'out_of_stock';
  if (stock <= 5) return 'low_stock';
  if (stock <= 15) return 'medium_stock';
  return 'in_stock';
};

export const getStockMessage = (product) => {
  const status = getStockStatus(product);
  const stock = getStockLevel(product);
  
  switch (status) {
    case 'out_of_stock':
      return 'Out of Stock';
    case 'low_stock':
      return `Only ${stock} left!`;
    case 'medium_stock':
      return `${stock} available`;
    default:
      return 'In Stock';
  }
}; 