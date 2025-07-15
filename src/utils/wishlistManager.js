// Wishlist Manager Utility
// Handles adding/removing products from wishlist with localStorage persistence

const WISHLIST_KEY = 'ecommerce_wishlist';

export const getWishlist = () => {
  try {
    const wishlist = localStorage.getItem(WISHLIST_KEY);
    return wishlist ? JSON.parse(wishlist) : [];
  } catch (error) {
    console.error('Error reading wishlist from localStorage:', error);
    return [];
  }
};

export const addToWishlist = (product) => {
  try {
    const wishlist = getWishlist();
    const existingProduct = wishlist.find(item => item.id === product.id);
    
    if (!existingProduct) {
      const updatedWishlist = [...wishlist, { ...product, addedAt: new Date().toISOString() }];
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(updatedWishlist));
      return true; // Successfully added
    }
    
    return false; // Already in wishlist
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    return false;
  }
};

export const removeFromWishlist = (productId) => {
  try {
    const wishlist = getWishlist();
    const updatedWishlist = wishlist.filter(item => item.id !== productId);
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(updatedWishlist));
    return true;
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    return false;
  }
};

export const isInWishlist = (productId) => {
  try {
    const wishlist = getWishlist();
    return wishlist.some(item => item.id === productId);
  } catch (error) {
    console.error('Error checking wishlist status:', error);
    return false;
  }
};

export const clearWishlist = () => {
  try {
    localStorage.removeItem(WISHLIST_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing wishlist:', error);
    return false;
  }
};

export const getWishlistCount = () => {
  try {
    const wishlist = getWishlist();
    return wishlist.length;
  } catch (error) {
    console.error('Error getting wishlist count:', error);
    return 0;
  }
}; 