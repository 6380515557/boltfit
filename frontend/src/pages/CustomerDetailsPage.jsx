import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  User, 
  Phone, 
  MapPin, 
  Mail, 
  MessageSquare, 
  Edit, 
  Check,
  Shield,
  Truck,
  Gift,
  Tag
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import './CustomerDetailsPage.css';

export default function CustomerDetailsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { clearCart } = useCart();
  
  const { productData, cartItems, isFromCart } = location.state || {};

  const [customerDetails, setCustomerDetails] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    pincode: '',
    state: '',
    additionalInfo: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isReturningUser, setIsReturningUser] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);

  const WHATSAPP_NUMBER = "918778146987";

  useEffect(() => {
    if (!productData && !cartItems) {
      navigate('/');
      return;
    }

    const savedDetails = localStorage.getItem('customerDetails');
    if (savedDetails) {
      const parsedDetails = JSON.parse(savedDetails);
      setCustomerDetails(prev => ({ ...prev, ...parsedDetails }));
      setIsReturningUser(true);
    }
  }, [productData, cartItems, navigate]);

  const validateForm = () => {
    const newErrors = {};

    if (!customerDetails.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!customerDetails.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(customerDetails.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    if (!customerDetails.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerDetails.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!customerDetails.address.trim()) {
      newErrors.address = 'Address is required';
    }

    if (!customerDetails.city.trim()) {
      newErrors.city = 'City is required';
    }

    if (!customerDetails.pincode.trim()) {
      newErrors.pincode = 'Pincode is required';
    } else if (!/^\d{6}$/.test(customerDetails.pincode)) {
      newErrors.pincode = 'Please enter a valid 6-digit pincode';
    }

    if (!customerDetails.state.trim()) {
      newErrors.state = 'State is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setCustomerDetails(prev => ({
      ...prev,
      [field]: value
    }));

    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const saveCustomerDetails = () => {
    const detailsToSave = { ...customerDetails };
    delete detailsToSave.additionalInfo;
    localStorage.setItem('customerDetails', JSON.stringify(detailsToSave));
  };

  const formatWhatsAppMessage = () => {
    let message = '';
    let total = 0;
    let subtotal = 0;
    let discount = 0;
    let deliveryCharge = 0;

    if (isFromCart && cartItems) {
      const itemsList = cartItems.map((item, idx) => 
        `${idx + 1}. ${item.title}\n   • Size: ${item.selectedSize} | Color: ${item.selectedColor}\n   • Qty: ${item.quantity} | Price: ₹${item.price} each\n   • Subtotal: ₹${item.price * item.quantity}\n   • Image: ${item.image}`
      ).join('\n\n');

      subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
      discount = Math.floor(subtotal * 0.1);
      deliveryCharge = subtotal >= 999 ? 0 : 50;
      total = subtotal - discount + deliveryCharge;

      message = `
🛒 *NEW ORDER - ${cartItems.length} ITEM${cartItems.length > 1 ? 'S' : ''}*

📦 *ORDER ITEMS:*
${itemsList}

💰 *PRICE BREAKDOWN:*
• Subtotal: ₹${subtotal.toLocaleString()}
• Discount (10%): −₹${discount.toLocaleString()}
• Delivery: ${deliveryCharge === 0 ? 'FREE' : '₹' + deliveryCharge}
• *TOTAL AMOUNT: ₹${total.toLocaleString()}*

👤 *CUSTOMER DETAILS:*
• Name: ${customerDetails.name}
• Phone: ${customerDetails.phone}
• Email: ${customerDetails.email}

📍 *DELIVERY ADDRESS:*
${customerDetails.address}
${customerDetails.city}, ${customerDetails.state}
Pincode: ${customerDetails.pincode}

${customerDetails.additionalInfo ? `📝 *ADDITIONAL INFO:*\n${customerDetails.additionalInfo}\n` : ''}
Please confirm this order. Thank you!
      `.trim();
    } else if (productData) {
      total = productData.price * productData.quantity;

      message = `
🛒 *New Order Details*

📦 *Product Information:*
• Product: ${productData.title}
• Price: ₹${productData.price}
• Size: ${productData.selectedSize}
• Color: ${productData.selectedColor}
• Quantity: ${productData.quantity}
• Total: ₹${total}

🖼️ *Product Image:*
${productData.image}

👤 *Customer Details:*
• Name: ${customerDetails.name}
• Phone: ${customerDetails.phone}
• Email: ${customerDetails.email}

📍 *Delivery Address:*
${customerDetails.address}
${customerDetails.city}, ${customerDetails.state}
Pincode: ${customerDetails.pincode}

${customerDetails.additionalInfo ? `📝 *Additional Info:*\n${customerDetails.additionalInfo}` : ''}

Please confirm this order. Thank you!
      `.trim();
    }

    return encodeURIComponent(message);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    saveCustomerDetails();

    setTimeout(() => {
      const whatsappMessage = formatWhatsAppMessage();
      const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`;
      
      window.open(whatsappUrl, '_blank');
      
      setIsSubmitting(false);
      
      const successMessage = isFromCart
        ? `✅ Order details sent to WhatsApp!\n💾 Your details have been saved for future orders!\n\nThe message includes all ${cartItems.length} items with images.`
        : `✅ Order details sent to WhatsApp!\n💾 Your details have been saved for future orders!\n\nThe message includes complete order information and product image link.`;
      
      alert(successMessage);
      
      if (isFromCart) {
        clearCart();
      }
      
      navigate('/');
    }, 1000);
  };

  const handleDirectWhatsApp = () => {
    setIsSubmitting(true);

    setTimeout(() => {
      const whatsappMessage = formatWhatsAppMessage();
      const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`;
      
      window.open(whatsappUrl, '_blank');
      
      setIsSubmitting(false);
      
      alert(`✅ Order sent to WhatsApp with your saved details!`);
      
      if (isFromCart) {
        clearCart();
      }
      
      navigate('/');
    }, 1000);
  };

  const handleEditDetails = () => {
    setShowEditForm(true);
  };

  const handleUpdateDetails = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    saveCustomerDetails();
    setShowEditForm(false);
    
    alert('✅ Your details have been updated successfully!');
  };

  const handleClearDetails = () => {
    if (window.confirm('Are you sure you want to clear your saved details?')) {
      localStorage.removeItem('customerDetails');
      setCustomerDetails({
        name: '',
        phone: '',
        email: '',
        address: '',
        city: '',
        pincode: '',
        state: '',
        additionalInfo: ''
      });
      setIsReturningUser(false);
      setShowEditForm(false);
    }
  };

  const calculateTotals = () => {
    if (isFromCart && cartItems) {
      const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
      const discount = Math.floor(subtotal * 0.1);
      const deliveryCharge = subtotal >= 999 ? 0 : 50;
      const total = subtotal - discount + deliveryCharge;
      return { subtotal, discount, deliveryCharge, total };
    } else if (productData) {
      const total = productData.price * productData.quantity;
      return { subtotal: total, discount: 0, deliveryCharge: 0, total };
    }
    return { subtotal: 0, discount: 0, deliveryCharge: 0, total: 0 };
  };

  const { subtotal, discount, deliveryCharge, total } = calculateTotals();

  if (!productData && !cartItems) {
    return <div className="loading-container">Loading...</div>;
  }

  const itemsToDisplay = isFromCart ? cartItems : [productData];

  return (
    <div className="customer-details-page">
      {/* Header */}
      <div className="customer-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
          <span>{isFromCart ? 'Back to Cart' : 'Back to Product'}</span>
        </button>
        <div className="header-trust-badges">
          <Shield size={16} />
          <span>Safe & Secure Checkout</span>
        </div>
      </div>

      <div className="customer-container">
        {/* Left Side - Order Summary */}
        <div className="order-summary-wrapper">
          <div className="order-summary-card">
            <h2 className="section-heading">
              <Tag size={22} />
              Order Summary
            </h2>
            
            <div className="products-list">
              {itemsToDisplay.map((item, idx) => (
                <div key={idx} className="summary-product-card">
                  <div className="summary-product-image">
                    <img src={item.image} alt={item.title} />
                  </div>
                  <div className="summary-product-info">
                    <h3 className="summary-product-title">{item.title}</h3>
                    <div className="summary-product-meta">
                      <span className="meta-badge">Size: {item.selectedSize}</span>
                      <span className="meta-badge">Color: {item.selectedColor}</span>
                    </div>
                    <div className="summary-product-quantity">
                      Qty: <strong>{item.quantity}</strong>
                    </div>
                    <div className="summary-product-price">
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Price Breakdown */}
            <div className="price-breakdown">
              <h3 className="breakdown-title">Price Details</h3>
              
              {isFromCart && (
                <>
                  <div className="price-row">
                    <span>Subtotal ({cartItems.length} items)</span>
                    <span>₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="price-row discount-row">
                    <span>Discount (10%)</span>
                    <span className="discount-value">−₹{discount.toLocaleString()}</span>
                  </div>
                  <div className="price-row">
                    <span>Delivery Charges</span>
                    <span className={deliveryCharge === 0 ? 'free-text' : ''}>
                      {deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}
                    </span>
                  </div>
                </>
              )}
              
              <div className="price-divider"></div>
              
              <div className="price-row total-row">
                <span>Total Amount</span>
                <span className="total-amount">₹{total.toLocaleString()}</span>
              </div>

              {discount > 0 && (
                <div className="savings-info">
                  <Gift size={16} />
                  <span>You will save ₹{discount.toLocaleString()} on this order</span>
                </div>
              )}
            </div>

            {/* Delivery Benefits */}
            <div className="delivery-benefits">
              <div className="benefit-item">
                <Truck size={18} />
                <span>Fast & Safe Delivery</span>
              </div>
              <div className="benefit-item">
                <Shield size={18} />
                <span>Secure Payments</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Customer Details Form */}
        <div className="customer-form-wrapper">
          <div className="customer-form-card">
            <h2 className="section-heading">
              <User size={24} />
              {isReturningUser ? 'Welcome Back!' : 'Delivery Details'}
            </h2>
            
            {isReturningUser && !showEditForm ? (
              <div>
                {/* Saved Details Display */}
                <div className="saved-details-card">
                  <div className="saved-details-header">
                    <Check size={20} />
                    <span>Your Saved Details</span>
                  </div>
                  
                  <div className="saved-detail-row">
                    <span className="detail-label">Name:</span>
                    <span className="detail-value">{customerDetails.name}</span>
                  </div>
                  <div className="saved-detail-row">
                    <span className="detail-label">Phone:</span>
                    <span className="detail-value">{customerDetails.phone}</span>
                  </div>
                  <div className="saved-detail-row">
                    <span className="detail-label">Email:</span>
                    <span className="detail-value">{customerDetails.email}</span>
                  </div>
                  <div className="saved-detail-row">
                    <span className="detail-label">Address:</span>
                    <span className="detail-value">{customerDetails.address}</span>
                  </div>
                  <div className="saved-detail-row">
                    <span className="detail-label">City:</span>
                    <span className="detail-value">{customerDetails.city}</span>
                  </div>
                  <div className="saved-detail-row">
                    <span className="detail-label">State:</span>
                    <span className="detail-value">{customerDetails.state}</span>
                  </div>
                  <div className="saved-detail-row">
                    <span className="detail-label">Pincode:</span>
                    <span className="detail-value">{customerDetails.pincode}</span>
                  </div>
                </div>

                {/* Additional Info Section */}
                <div className="form-section">
                  <div className="form-section-header">
                    <MessageSquare size={20} />
                    <span>Additional Information (Optional)</span>
                  </div>
                  <textarea
                    className="form-textarea"
                    value={customerDetails.additionalInfo}
                    onChange={(e) => handleInputChange('additionalInfo', e.target.value)}
                    placeholder="Any special delivery instructions, preferred time, etc."
                    rows="3"
                  />
                </div>

                {/* Action Buttons for Returning Users */}
                <div className="action-buttons-group">
                  <button
                    className="whatsapp-button primary"
                    onClick={handleDirectWhatsApp}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="button-spinner"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <MessageSquare size={20} />
                        Send to WhatsApp
                      </>
                    )}
                  </button>
                  
                  <button
                    className="edit-button secondary"
                    onClick={handleEditDetails}
                  >
                    <Edit size={16} />
                    Edit Details
                  </button>
                  
                  <button
                    className="clear-button danger"
                    onClick={handleClearDetails}
                  >
                    Clear Saved Details
                  </button>
                </div>
              </div>
            ) : (
              // Form for New Users or Editing
              <form className="customer-form" onSubmit={showEditForm ? handleUpdateDetails : handleSubmit}>
                {/* Personal Information */}
                <div className="form-section">
                  <div className="form-section-header">
                    <User size={20} />
                    <span>Personal Information</span>
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Full Name *</label>
                    <input
                      type="text"
                      className={`form-input ${errors.name ? 'error' : ''}`}
                      value={customerDetails.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Enter your full name"
                    />
                    {errors.name && <span className="error-text">{errors.name}</span>}
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Phone Number *</label>
                      <div className="input-with-icon">
                        <Phone size={18} />
                        <input
                          type="tel"
                          className={`form-input ${errors.phone ? 'error' : ''}`}
                          value={customerDetails.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          placeholder="10-digit mobile number"
                        />
                      </div>
                      {errors.phone && <span className="error-text">{errors.phone}</span>}
                    </div>

                    <div className="form-group">
                      <label className="form-label">Email Address *</label>
                      <div className="input-with-icon">
                        <Mail size={18} />
                        <input
                          type="email"
                          className={`form-input ${errors.email ? 'error' : ''}`}
                          value={customerDetails.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          placeholder="your.email@example.com"
                        />
                      </div>
                      {errors.email && <span className="error-text">{errors.email}</span>}
                    </div>
                  </div>
                </div>

                {/* Delivery Address */}
                <div className="form-section">
                  <div className="form-section-header">
                    <MapPin size={20} />
                    <span>Delivery Address</span>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Street Address *</label>
                    <textarea
                      className={`form-textarea ${errors.address ? 'error' : ''}`}
                      value={customerDetails.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      placeholder="House/Flat no, Building name, Street, Area"
                      rows="3"
                    />
                    {errors.address && <span className="error-text">{errors.address}</span>}
                  </div>

                  <div className="form-row three-col">
                    <div className="form-group">
                      <label className="form-label">City *</label>
                      <input
                        type="text"
                        className={`form-input ${errors.city ? 'error' : ''}`}
                        value={customerDetails.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        placeholder="City"
                      />
                      {errors.city && <span className="error-text">{errors.city}</span>}
                    </div>

                    <div className="form-group">
                      <label className="form-label">State *</label>
                      <input
                        type="text"
                        className={`form-input ${errors.state ? 'error' : ''}`}
                        value={customerDetails.state}
                        onChange={(e) => handleInputChange('state', e.target.value)}
                        placeholder="State"
                      />
                      {errors.state && <span className="error-text">{errors.state}</span>}
                    </div>

                    <div className="form-group">
                      <label className="form-label">Pincode *</label>
                      <input
                        type="text"
                        className={`form-input ${errors.pincode ? 'error' : ''}`}
                        value={customerDetails.pincode}
                        onChange={(e) => handleInputChange('pincode', e.target.value)}
                        placeholder="6-digit pincode"
                      />
                      {errors.pincode && <span className="error-text">{errors.pincode}</span>}
                    </div>
                  </div>
                </div>

                {/* Additional Information */}
                <div className="form-section">
                  <div className="form-section-header">
                    <MessageSquare size={20} />
                    <span>Additional Information (Optional)</span>
                  </div>
                  <textarea
                    className="form-textarea"
                    value={customerDetails.additionalInfo}
                    onChange={(e) => handleInputChange('additionalInfo', e.target.value)}
                    placeholder="Any special delivery instructions, preferred time, etc."
                    rows="3"
                  />
                </div>

                {/* Submit Buttons */}
                <div className="form-submit-group">
                  <button
                    type="submit"
                    className="whatsapp-button primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="button-spinner"></div>
                        {showEditForm ? 'Updating...' : 'Processing...'}
                      </>
                    ) : (
                      <>
                        <MessageSquare size={20} />
                        {showEditForm ? 'Update & Send to WhatsApp' : 'Send to WhatsApp'}
                      </>
                    )}
                  </button>

                  {showEditForm && (
                    <button
                      type="button"
                      className="edit-button secondary"
                      onClick={() => setShowEditForm(false)}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}