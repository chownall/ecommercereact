import React, { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { Link, useParams } from "react-router-dom";
import Marquee from "react-fast-marquee";
import { useDispatch } from "react-redux";
import { addCart } from "../redux/action";
import toast from "react-hot-toast";
import { isOutOfStock, getStockMessage, getStockStatus, getStockLevel } from "../utils/stockSimulator";
import { addToWishlist, removeFromWishlist, isInWishlist } from "../utils/wishlistManager";

import { Footer, Navbar } from "../components";
import "./Product.css";

const Product = () => {
  const { id } = useParams();
  const [product, setProduct] = useState([]);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [buttonState, setButtonState] = useState('idle');
  const [isWishlisted, setIsWishlisted] = useState(false);

  const dispatch = useDispatch();

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

  // Check wishlist status on component mount
  useEffect(() => {
    if (product.id) {
      setIsWishlisted(isInWishlist(product.id));
    }
  }, [product.id]);

  const addProduct = async (productToAdd) => {
    if (outOfStock) return;

    // Validate variants if needed
    if (productToAdd.category === "men's clothing" || productToAdd.category === "women's clothing") {
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
      ...productToAdd,
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

  useEffect(() => {
    const getProduct = async () => {
      setLoading(true);
      setLoading2(true);
      const response = await fetch(`https://fakestoreapi.com/products/${id}`);
      const data = await response.json();
      setProduct(data);
      setLoading(false);
      const response2 = await fetch(
        `https://fakestoreapi.com/products/category/${data.category}`
      );
      const data2 = await response2.json();
      setSimilarProducts(data2);
      setLoading2(false);
    };
    getProduct();
  }, [id]);

  const Loading = () => {
    return (
      <>
        <div className="container my-5 py-2">
          <div className="row">
            <div className="col-md-6 py-3">
              <Skeleton height={400} width={400} />
            </div>
            <div className="col-md-6 py-5">
              <Skeleton height={30} width={250} />
              <Skeleton height={90} />
              <Skeleton height={40} width={70} />
              <Skeleton height={50} width={110} />
              <Skeleton height={120} />
              <Skeleton height={40} width={110} inline={true} />
              <Skeleton className="mx-3" height={40} width={110} />
            </div>
          </div>
        </div>
      </>
    );
  };

  const ShowProduct = () => {
    return (
      <>
        <div className="product-detail-container">
          <div className="product-detail-content">
            {/* Product Image Section */}
            <div className="product-image-section">
              <div className="product-image-container">
                <img
                  className="product-image"
                  src={product.image}
                  alt={product.title}
                />
                
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

                {/* Rating Badge */}
                {product.rating && (
                  <div className="rating-badge">
                    <i className="fa fa-star"></i>
                    <span>{product.rating.rate}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Product Info Section */}
            <div className="product-info-section">
              <div className="product-header">
                <div className="product-category">{product.category}</div>
                <h1 className="product-title">{product.title}</h1>
                
                {/* Wishlist Button */}
                <button 
                  className={`wishlist-btn ${isWishlisted ? 'active' : ''}`}
                  onClick={handleWishlistToggle}
                  title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
                >
                  <i className={`fa ${isWishlisted ? 'fa-heart' : 'fa-heart-o'}`}></i>
                  <span>{isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}</span>
                </button>
              </div>

              <div className="product-price">
                <span className="current-price">${product.price}</span>
                {product.price > 50 && (
                  <span className="original-price">${(product.price * 1.2).toFixed(2)}</span>
                )}
              </div>

              <p className="product-description">{product.description}</p>

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
                onClick={() => addProduct(product)}
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

              {/* Action Buttons */}
              <div className="action-buttons">
                <Link to="/cart" className="view-cart-btn">
                  <i className="fa fa-shopping-cart"></i>
                  <span>View Cart</span>
                </Link>
                <Link to="/product" className="continue-shopping-btn">
                  <i className="fa fa-arrow-left"></i>
                  <span>Continue Shopping</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  const Loading2 = () => {
    return (
      <>
        <div className="my-4 py-4">
          <div className="d-flex">
            <div className="mx-4">
              <Skeleton height={400} width={250} />
            </div>
            <div className="mx-4">
              <Skeleton height={400} width={250} />
            </div>
            <div className="mx-4">
              <Skeleton height={400} width={250} />
            </div>
            <div className="mx-4">
              <Skeleton height={400} width={250} />
            </div>
          </div>
        </div>
      </>
    );
  };

  const ShowSimilarProduct = () => {
    return (
      <>
        <div className="py-4 my-4">
          <div className="d-flex">
            {similarProducts.map((item) => {
              return (
                <div key={item.id} className="similar-product-card">
                  <img
                    className="similar-product-image"
                    src={item.image}
                    alt={item.title}
                  />
                  <div className="similar-product-info">
                    <h5 className="similar-product-title">
                      {item.title.substring(0, 20)}...
                    </h5>
                    <p className="similar-product-price">${item.price}</p>
                  </div>
                  <div className="similar-product-actions">
                    <Link
                      to={"/product/" + item.id}
                      className="view-product-btn"
                    >
                      View Product
                    </Link>
                    <button
                      className="quick-add-btn"
                      onClick={() => addProduct(item)}
                    >
                      Quick Add
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </>
    );
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="row">{loading ? <Loading /> : <ShowProduct />}</div>
        <div className="row my-5 py-5">
          <div className="d-none d-md-block">
            <h2 className="similar-products-title">You may also Like</h2>
            <Marquee
              pauseOnHover={true}
              pauseOnClick={true}
              speed={50}
            >
              {loading2 ? <Loading2 /> : <ShowSimilarProduct />}
            </Marquee>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Product;
