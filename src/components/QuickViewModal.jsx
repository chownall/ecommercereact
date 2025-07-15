import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addCart } from '../redux/action';
import toast from 'react-hot-toast';
import { isOutOfStock, getStockMessage, getStockStatus, getStockLevel } from '../utils/stockSimulator';
import './QuickViewModal.css';

const QuickViewModal = ({ product, isOpen, onClose }) => {
  const dispatch = useDispatch();
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [buttonState, setButtonState] = useState('idle');

  const outOfStock = isOutOfStock(product);
  const stockMessage = getStockMessage(product);
  const stockStatus = getStockStatus(product);

  // Simulated product variants
  const sizes = ['S', 'M', 'L', 'XL'];
  const colors = [
    { name: 'Red', code: '#ff4444', stock: 5 },
    { name: 'Blue', code: '#4444ff', stock: 8 },
    { name: 'Green', code: '#44ff44', stock: 3 },
    { name: 'Black', code: '#000000', stock: 12 }
  ];

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

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

  if (!isOpen || !product) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="quick-view-backdrop" onClick={onClose} />
      
      {/* Modal */}
      <div className="quick-view-modal">
        <button className="close-modal-btn" onClick={onClose}>
          <i className="fa fa-times"></i>
        </button>

        <div className="modal-content">
          <div className="product-preview">
            <div className="product-image-container">
              <img 
                src={product.image} 
                alt={product.title}
                className="product-image"
              />
              
              {/* Stock Badge */}
              <div className={getStockBadgeClass()}>
                {stockMessage}
              </div>

              {/* Rating Badge */}
              {product.rating && (
                <div className="rating-badge">
                  <i className="fa fa-star"></i>
                  <span>{product.rating.rate}</span>
                </div>
              )}
            </div>
          </div>

          <div className="product-details">
            <div className="product-header">
              <h2 className="product-title">{product.title}</h2>
              <p className="product-category">{product.category}</p>
            </div>

            <div className="product-price">
              <span className="current-price">${product.price}</span>
              {product.price > 50 && (
                <span className="original-price">${(product.price * 1.2).toFixed(2)}</span>
              )}
            </div>

            <p className="product-description">
              {product.description}
            </p>

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

            {/* Actions */}
            <div className="modal-actions">
              <Link to={`/product/${product.id}`} className="view-full-btn">
                View Full Details
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default QuickViewModal; 