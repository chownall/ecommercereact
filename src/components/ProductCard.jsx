import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addCart } from '../redux/action';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { isOutOfStock, getStockMessage, getStockStatus, getStockLevel } from '../utils/stockSimulator';
import { addToWishlist, removeFromWishlist, isInWishlist } from '../utils/wishlistManager';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [showVariants, setShowVariants] = useState(false);
  const [buttonState, setButtonState] = useState('idle');
  const [isWishlisted, setIsWishlisted] = useState(false);

  const outOfStock = isOutOfStock(product);
  const stockMessage = getStockMessage(product);
  const stockStatus = getStockStatus(product);

  // Check wishlist status on component mount
  useEffect(() => {
    setIsWishlisted(isInWishlist(product.id));
  }, [product.id]);

  // Simulated product variants
  const sizes = ['S', 'M', 'L', 'XL'];
  const colors = [
    { name: 'Red', code: '#ff4444', stock: 5 },
    { name: 'Blue', code: '#4444ff', stock: 8 },
    { name: 'Green', code: '#44ff44', stock: 3 },
    { name: 'Black', code: '#000000', stock: 12 }
  ];

  const handleAddToCart = async () => {
    if (outOfStock) return;

    // Validate variants if needed
    if (product.category === "men's clothing" || product.category === "women's clothing") {
      if (!selectedSize) {
        toast.error('Please select a size');
        return;
      }
    }

    setIsAdding(true);
    setButtonState('loading');

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));

    const productWithVariants = {
      ...product,
      selectedSize,
      selectedColor,
      stockStatus
    };

    dispatch(addCart(productWithVariants));
    
    setButtonState('success');
    toast.success('Added to cart! 🛒');

    // Reset button state after animation
    setTimeout(() => {
      setButtonState('idle');
      setIsAdding(false);
    }, 2000);
  };

  const handleWishlistToggle = () => {
    if (isWishlisted) {
      removeFromWishlist(product.id);
      setIsWishlisted(false);
      toast.success('Removed from wishlist');
    } else {
      const success = addToWishlist(product);
      if (success) {
        setIsWishlisted(true);
        toast.success('Added to wishlist! ❤️');
      } else {
        toast.error('Already in wishlist');
      }
    }
  };

  const getButtonContent = () => {
    switch (buttonState) {
      case 'loading':
        return (
          <>
            <div className="spinner"></div>
            <span>Adding...</span>
          </>
        );
      case 'success':
        return (
          <>
            <i className="fa fa-check"></i>
            <span>Added!</span>
          </>
        );
      default:
        return (
          <>
            <i className="fa fa-shopping-cart"></i>
            <span>Add to Cart</span>
          </>
        );
    }
  };

  const getStockBadgeClass = () => {
    switch (stockStatus) {
      case 'out_of_stock':
        return 'stock-badge out-of-stock';
      case 'low_stock':
        return 'stock-badge low-stock';
      case 'medium_stock':
        return 'stock-badge medium-stock';
      default:
        return 'stock-badge in-stock';
    }
  };

  return (
    <div className={`product-card ${outOfStock ? 'out-of-stock' : ''}`}>
      {/* Product Image Container */}
      <div className="product-image-container">
        <Link to={`/product/${product.id}`}>
          <img 
            src={product.image} 
            alt={product.title}
            className="product-image"
            loading="lazy"
          />
        </Link>
        
        {/* Stock Badge */}
        <div className={getStockBadgeClass()}>
          {stockMessage}
        </div>

        {/* Out of Stock Overlay */}
        {outOfStock && (
          <div className="out-of-stock-overlay">
            <i className="fa fa-times-circle"></i>
            <span>Out of Stock</span>
          </div>
        )}

        {/* Quick Actions */}
        <div className="quick-actions">
          <button 
            className={`quick-action-btn wishlist-btn ${isWishlisted ? 'active' : ''}`}
            title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
            onClick={handleWishlistToggle}
          >
            <i className={`fa ${isWishlisted ? 'fa-heart' : 'fa-heart-o'}`}></i>
          </button>
        </div>

        {/* Rating Badge */}
        {product.rating && (
          <div className="rating-badge">
            <i className="fa fa-star"></i>
            <span>{product.rating.rate}</span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="product-info">
        <Link to={`/product/${product.id}`} className="product-title">
          {product.title.length > 50 
            ? `${product.title.substring(0, 50)}...` 
            : product.title
          }
        </Link>
        
        <div className="product-category">
          {product.category}
        </div>

        <div className="product-price">
          <span className="current-price">${product.price}</span>
          {product.price > 50 && (
            <span className="original-price">${(product.price * 1.2).toFixed(2)}</span>
          )}
        </div>

        {/* Variant Selectors */}
        {(product.category === "men's clothing" || product.category === "women's clothing") && (
          <div className="variant-selectors">
            <div className="size-selector">
              <label>Size:</label>
              <div className="size-options">
                {sizes.map(size => (
                  <button
                    key={size}
                    className={`size-option ${selectedSize === size ? 'selected' : ''}`}
                    onClick={() => setSelectedSize(size)}
                    disabled={outOfStock}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="color-selector">
              <label>Color:</label>
              <div className="color-options">
                {colors.map(color => (
                  <button
                    key={color.name}
                    className={`color-option ${selectedColor === color.name ? 'selected' : ''}`}
                    style={{ backgroundColor: color.code }}
                    onClick={() => setSelectedColor(color.name)}
                    disabled={outOfStock}
                    title={color.name}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Add to Cart Button */}
        <button
          className={`add-to-cart-btn ${buttonState} ${outOfStock ? 'disabled' : ''}`}
          onClick={handleAddToCart}
          disabled={outOfStock || isAdding}
        >
          {outOfStock ? (
            <>
              <i className="fa fa-times"></i>
              <span>Out of Stock</span>
            </>
          ) : (
            getButtonContent()
          )}
        </button>

        {/* Stock Indicator */}
        {!outOfStock && stockStatus === 'low_stock' && (
          <div className="stock-indicator">
            <div className="stock-bar">
              <div 
                className="stock-fill low" 
                style={{ width: `${(getStockLevel(product) / 50) * 100}%` }}
              ></div>
            </div>
            <span className="stock-text">Low stock!</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard; 