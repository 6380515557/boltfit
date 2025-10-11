import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowLeft, 
  Tag, 
  Truck,
  Shield,
  Gift,
  Heart,
  Share2
} from 'lucide-react';
import './AddToCartPage.css';

export default function AddToCartPage() {
  const { items, addToCart, removeFromCart } = useCart();
  const navigate = useNavigate();
  const [removingItem, setRemovingItem] = useState(null);

  const handleIncrease = (item) => {
    addToCart({ ...item, quantity: 1 });
  };

  const handleDecrease = (item) => {
    if (item.quantity === 1) {
      setRemovingItem(item.id);
      setTimeout(() => {
        removeFromCart(item.id, item.selectedSize, item.selectedColor);
        setRemovingItem(null);
      }, 300);
    } else {
      addToCart({ ...item, quantity: -1 });
    }
  };

  const handleRemove = (item) => {
    setRemovingItem(item.id);
    setTimeout(() => {
      removeFromCart(item.id, item.selectedSize, item.selectedColor);
      setRemovingItem(null);
    }, 300);
  };

  const goToProductDetails = (productId) => {
    navigate(`/product/${productId}`);
  };

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discount = Math.floor(subtotal * 0.1); // 10% discount
  const deliveryCharge = subtotal >= 999 ? 0 : 50;
  const total = subtotal - discount + deliveryCharge;
  const savings = discount;

  // Updated checkout handler to navigate to customer details page
  const handleCheckout = () => {
    if (!items || items.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    
    // Navigate to customer details page with cart items
    navigate('/customer-details', { 
      state: { 
        cartItems: items,
        isFromCart: true 
      } 
    });
  };

  if (!items || items.length === 0) {
    return (
      <div className="cart-page">
        <div className="cart-header">
          <button className="back-btn" onClick={() => navigate(-1)}>
            <ArrowLeft size={20} />
            Back
          </button>
          <h1 className="cart-title">Shopping Cart</h1>
        </div>

        <div className="empty-cart">
          <div className="empty-cart-icon">
            <ShoppingBag size={80} />
          </div>
          <h2 className="empty-cart-title">Your Cart is Empty</h2>
          <p className="empty-cart-subtitle">
            Add items to your cart to see them here
          </p>
          <button className="continue-shopping-btn" onClick={() => navigate('/')}>
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      {/* Header */}
      <div className="cart-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
          Back
        </button>
        <div className="cart-header-info">
          <h1 className="cart-title">Shopping Cart</h1>
          <p className="cart-item-count">{items.length} {items.length === 1 ? 'item' : 'items'}</p>
        </div>
      </div>

      {/* Delivery Info Banner */}
      <div className="delivery-banner">
        <Truck size={20} />
        <span>
          {deliveryCharge === 0 ? (
            <strong>FREE Delivery</strong>
          ) : (
            <>Add ₹{999 - subtotal} more for <strong>FREE Delivery</strong></>
          )}
        </span>
      </div>

      <div className="cart-container">
        {/* Cart Items Section */}
        <div className="cart-items-section">
          {items.map((item, index) => (
            <div
              key={`${item.id}-${item.selectedSize}-${item.selectedColor}-${index}`}
              className={`cart-item ${removingItem === item.id ? 'removing' : ''}`}
            >
              <div className="cart-item-image" onClick={() => goToProductDetails(item.id)}>
                <img src={item.image} alt={item.title} />
              </div>

              <div className="cart-item-details">
                <div className="cart-item-header">
                  <h3 className="cart-item-title" onClick={() => goToProductDetails(item.id)}>
                    {item.title}
                  </h3>
                  <button
                    className="wishlist-icon-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log('Added to wishlist');
                    }}
                    aria-label="Add to wishlist"
                  >
                    <Heart size={18} />
                  </button>
                </div>

                <div className="cart-item-seller">
                  Seller: <span>{item.seller || 'BOLDFIT'}</span>
                </div>

                <div className="cart-item-attributes">
                  <span className="attribute-badge">Size: {item.selectedSize || 'M'}</span>
                  <span className="attribute-badge">Color: {item.selectedColor || 'Black'}</span>
                </div>

                <div className="cart-item-footer">
                  <div className="cart-item-price">
                    <span className="current-price">₹{(item.price * item.quantity).toLocaleString()}</span>
                    <span className="original-price">₹{((item.price * 1.3) * item.quantity).toLocaleString()}</span>
                    <span className="discount-percentage">30% off</span>
                  </div>

                  <div className="quantity-controls">
                    <button
                      className="quantity-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDecrease(item);
                      }}
                      aria-label="Decrease quantity"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="quantity-value">{item.quantity}</span>
                    <button
                      className="quantity-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleIncrease(item);
                      }}
                      aria-label="Increase quantity"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>

                <div className="cart-item-actions">
                  <button
                    className="remove-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemove(item);
                    }}
                  >
                    <Trash2 size={16} />
                    Remove
                  </button>
                  <button
                    className="share-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log('Share product');
                    }}
                  >
                    <Share2 size={16} />
                    Share
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Suggested Products */}
          <div className="suggested-section">
            <h3 className="suggested-title">You May Also Like</h3>
            <p className="suggested-subtitle">Complete your look</p>
          </div>
        </div>

        {/* Price Summary Section */}
        <div className="price-summary-section">
          <div className="price-summary-card">
            <h3 className="summary-title">Price Details</h3>
            
            <div className="summary-row">
              <span>Price ({items.length} {items.length === 1 ? 'item' : 'items'})</span>
              <span>₹{subtotal.toLocaleString()}</span>
            </div>
            
            <div className="summary-row discount">
              <span>Discount</span>
              <span className="discount-amount">−₹{discount.toLocaleString()}</span>
            </div>
            
            <div className="summary-row">
              <span>Delivery Charges</span>
              <span className={deliveryCharge === 0 ? 'free-delivery' : ''}>
                {deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}
              </span>
            </div>
            
            <div className="summary-divider"></div>
            
            <div className="summary-row total">
              <span>Total Amount</span>
              <span>₹{total.toLocaleString()}</span>
            </div>
            
            {savings > 0 && (
              <div className="savings-badge">
                <Gift size={16} />
                You will save ₹{savings.toLocaleString()} on this order
              </div>
            )}
            
            {/* Updated Checkout Button */}
            <button className="checkout-btn" onClick={handleCheckout}>
              Proceed to Checkout
            </button>

            {/* Trust Badges */}
            <div className="trust-badges">
              <div className="trust-badge">
                <Shield size={18} />
                <span>Safe & Secure Payments</span>
              </div>
              <div className="trust-badge">
                <Truck size={18} />
                <span>Fast Delivery</span>
              </div>
            </div>
          </div>

          {/* Offer Card */}
          <div className="offer-card">
            <div className="offer-icon">
              <Tag size={20} />
            </div>
            <div className="offer-content">
              <h4>Apply Coupon</h4>
              <p>Save extra with coupons</p>
            </div>
            <button className="apply-coupon-btn">Apply</button>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Footer */}
      <div className="mobile-sticky-footer">
        <div className="mobile-footer-price">
          <div className="mobile-price-label">Total</div>
          <div className="mobile-price-value">₹{total.toLocaleString()}</div>
        </div>
        {/* Updated Mobile Checkout Button */}
        <button className="mobile-checkout-btn" onClick={handleCheckout}>
          Checkout
        </button>
      </div>
    </div>
  );
}