import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import './MiniCart.css';

const MiniCart = ({ isOpen, onClose, addedProduct }) => {
  const cartItems = useSelector(state => state.handleCart);
  const [isVisible, setIsVisible] = useState(false);
  const [slideIn, setSlideIn] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setTimeout(() => setSlideIn(true), 10);
    } else {
      setSlideIn(false);
      setTimeout(() => setIsVisible(false), 300);
    }
  }, [isOpen]);

  const totalItems = cartItems.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.qty), 0);

  if (!isVisible) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`mini-cart-backdrop ${slideIn ? 'active' : ''}`}
        onClick={onClose}
      />
      
      {/* Mini Cart */}
      <div className={`mini-cart ${slideIn ? 'slide-in' : ''}`}>
        {/* Header */}
        <div className="mini-cart-header">
          <h3>Shopping Cart</h3>
          <button className="close-btn" onClick={onClose}>
            <i className="fa fa-times"></i>
          </button>
        </div>

        {/* Recently Added Product */}
        {addedProduct && (
          <div className="recently-added">
            <div className="added-product">
              <img src={addedProduct.image} alt={addedProduct.title} />
              <div className="added-product-info">
                <h4>{addedProduct.title.substring(0, 30)}...</h4>
                <p className="added-variants">
                  {addedProduct.selectedSize && `Size: ${addedProduct.selectedSize}`}
                  {addedProduct.selectedColor && ` • Color: ${addedProduct.selectedColor}`}
                </p>
                <p className="added-price">${addedProduct.price}</p>
              </div>
              <div className="added-check">
                <i className="fa fa-check"></i>
              </div>
            </div>
          </div>
        )}

        {/* Cart Items */}
        <div className="mini-cart-items">
          {cartItems.length === 0 ? (
            <div className="empty-cart">
              <i className="fa fa-shopping-cart"></i>
              <p>Your cart is empty</p>
              <span>Add some products to get started!</span>
            </div>
          ) : (
            <>
              {cartItems.slice(0, 3).map((item, index) => (
                <div key={`${item.id}-${index}`} className="mini-cart-item">
                  <img src={item.image} alt={item.title} />
                  <div className="item-info">
                    <h4>{item.title.substring(0, 25)}...</h4>
                    <p className="item-variants">
                      {item.selectedSize && `Size: ${item.selectedSize}`}
                      {item.selectedColor && ` • Color: ${item.selectedColor}`}
                    </p>
                    <div className="item-price-qty">
                      <span className="item-price">${item.price}</span>
                      <span className="item-qty">Qty: {item.qty}</span>
                    </div>
                  </div>
                </div>
              ))}
              
              {cartItems.length > 3 && (
                <div className="more-items">
                  <p>+{cartItems.length - 3} more items</p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Cart Summary */}
        {cartItems.length > 0 && (
          <div className="mini-cart-summary">
            <div className="summary-row">
              <span>Subtotal ({totalItems} items)</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
            
            {/* Progress to Free Shipping */}
            {totalPrice < 50 && (
              <div className="free-shipping-progress">
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${(totalPrice / 50) * 100}%` }}
                  ></div>
                </div>
                <p>Add ${(50 - totalPrice).toFixed(2)} more for free shipping!</p>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="mini-cart-actions">
          {cartItems.length > 0 ? (
            <>
              <Link to="/cart" className="view-cart-btn" onClick={onClose}>
                View Full Cart
              </Link>
              <Link to="/checkout" className="checkout-btn" onClick={onClose}>
                Checkout
              </Link>
            </>
          ) : (
            <Link to="/product" className="continue-shopping-btn" onClick={onClose}>
              Continue Shopping
            </Link>
          )}
        </div>
      </div>
    </>
  );
};

export default MiniCart; 