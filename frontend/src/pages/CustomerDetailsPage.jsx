import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Phone, MapPin, Mail, MessageSquare, Image, Edit } from 'lucide-react';

export default function CustomerDetailsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { productData } = location.state || {};

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

  // Your WhatsApp number - replace with your actual number
  const WHATSAPP_NUMBER = "918778146987"; // Replace with your number

  // Load saved customer details on component mount
  useEffect(() => {
    if (!productData) {
      navigate('/');
      return;
    }

    // Check if user details exist in localStorage
    const savedDetails = localStorage.getItem('customerDetails');
    if (savedDetails) {
      const parsedDetails = JSON.parse(savedDetails);
      setCustomerDetails(parsedDetails);
      setIsReturningUser(true);
    }
  }, [productData, navigate]);

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

    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const saveCustomerDetails = () => {
    // Save customer details to localStorage (excluding additionalInfo for reuse)
    const detailsToSave = { ...customerDetails };
    delete detailsToSave.additionalInfo; // Don't save additional info as it's order-specific
    localStorage.setItem('customerDetails', JSON.stringify(detailsToSave));
  };

  const formatWhatsAppMessage = () => {
    const message = `
🛒 *New Order Details*

📦 *Product Information:*
• Product: ${productData.title}
• Price: ₹${productData.price}
• Size: ${productData.selectedSize}
• Color: ${productData.selectedColor}
• Quantity: ${productData.quantity}
• Total: ₹${productData.price * productData.quantity}

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

${customerDetails.additionalInfo ? `📝 *Additional Info:*
${customerDetails.additionalInfo}` : ''}

Please confirm this order. Thank you!
    `.trim();

    return encodeURIComponent(message);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Save customer details for future use
    saveCustomerDetails();

    // Simulate processing time
    setTimeout(() => {
      const whatsappMessage = formatWhatsAppMessage();
      const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`;
      
      // Open WhatsApp with message including image link
      window.open(whatsappUrl, '_blank');
      
      setIsSubmitting(false);
      
      // Show success message
      alert(`
✅ Order details sent to WhatsApp!
💾 Your details have been saved for future orders!

The message includes:
• Complete order information
• Customer details
• Product image link
      `);
    }, 1000);
  };

  // Direct WhatsApp for returning users
  const handleDirectWhatsApp = () => {
    setIsSubmitting(true);

    setTimeout(() => {
      const whatsappMessage = formatWhatsAppMessage();
      const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`;
      
      window.open(whatsappUrl, '_blank');
      
      setIsSubmitting(false);
      
      alert(`
✅ Order sent to WhatsApp with your saved details!

You can edit your details anytime by clicking "Edit Details" button.
      `);
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

    // Update saved details
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

  const isMobile = window.innerWidth <= 768;

  const styles = {
    container: {
      fontFamily: "'Amazon Ember', Arial, sans-serif",
      background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
      minHeight: '100vh',
      padding: isMobile ? '15px' : '20px'
    },
    nav: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      marginBottom: '20px',
      padding: '15px 0',
      borderBottom: '2px solid #dee2e6'
    },
    backBtn: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      color: '#007185',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '600',
      padding: '10px 16px',
      borderRadius: '8px',
      background: 'rgba(0, 113, 133, 0.1)',
      border: '2px solid transparent',
      transition: 'all 0.3s ease'
    },
    main: {
      maxWidth: '1200px',
      margin: '0 auto',
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
      gap: '30px',
      background: 'white',
      borderRadius: '16px',
      padding: isMobile ? '20px' : '30px',
      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)'
    },
    orderSummary: {
      background: 'linear-gradient(135deg, #f8f9fa, #e9ecef)',
      borderRadius: '12px',
      padding: '20px',
      height: 'fit-content'
    },
    productCard: {
      background: 'white',
      borderRadius: '10px',
      padding: '15px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      marginBottom: '20px'
    },
    productImage: {
      width: '80px',
      height: '80px',
      objectFit: 'cover',
      borderRadius: '8px',
      marginRight: '15px'
    },
    productInfo: {
      flex: 1
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px'
    },
    section: {
      background: 'linear-gradient(135deg, #f8f9fa, #ffffff)',
      borderRadius: '10px',
      padding: '20px',
      border: '1px solid #e9ecef'
    },
    sectionTitle: {
      fontSize: '18px',
      fontWeight: '700',
      color: '#0f1111',
      marginBottom: '15px',
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    },
    inputGroup: {
      marginBottom: '15px'
    },
    label: {
      display: 'block',
      fontSize: '14px',
      fontWeight: '600',
      color: '#333',
      marginBottom: '5px'
    },
    input: {
      width: '100%',
      padding: '12px 15px',
      border: '2px solid #e9ecef',
      borderRadius: '8px',
      fontSize: '14px',
      transition: 'all 0.3s ease',
      boxSizing: 'border-box'
    },
    inputError: {
      borderColor: '#dc3545'
    },
    textarea: {
      width: '100%',
      padding: '12px 15px',
      border: '2px solid #e9ecef',
      borderRadius: '8px',
      fontSize: '14px',
      minHeight: '100px',
      resize: 'vertical',
      transition: 'all 0.3s ease',
      boxSizing: 'border-box'
    },
    error: {
      color: '#dc3545',
      fontSize: '12px',
      marginTop: '5px'
    },
    submitBtn: {
      background: 'linear-gradient(135deg, #28a745, #20c997)',
      color: 'white',
      border: 'none',
      padding: '15px 30px',
      borderRadius: '10px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px',
      marginTop: '20px'
    },
    editBtn: {
      background: 'linear-gradient(135deg, #007185, #005a6b)',
      color: 'white',
      border: 'none',
      padding: '12px 24px',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      margin: '10px 5px'
    },
    clearBtn: {
      background: 'linear-gradient(135deg, #dc3545, #c82333)',
      color: 'white',
      border: 'none',
      padding: '12px 24px',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      margin: '10px 5px'
    },
    loading: {
      background: '#6c757d',
      cursor: 'not-allowed'
    },
    previewImage: {
      width: isMobile ? '120px' : '150px',
      height: isMobile ? '120px' : '150px',
      objectFit: 'cover',
      borderRadius: '10px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      border: '2px solid #e9ecef'
    },
    savedDetails: {
      background: 'linear-gradient(135deg, #e8f5e8, #f0f9f0)',
      borderRadius: '10px',
      padding: '15px',
      border: '2px solid #28a745',
      marginBottom: '20px'
    },
    detailItem: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '5px 0',
      borderBottom: '1px solid #e9ecef'
    }
  };

  if (!productData) {
    return <div>Loading...</div>;
  }

  return (
    <div style={styles.container}>
      {/* Navigation */}
      <nav style={styles.nav}>
        <div 
          style={styles.backBtn}
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={18} />
          Back to Product
        </div>
      </nav>

      <div style={styles.main}>
        {/* Order Summary */}
        <div style={styles.orderSummary}>
          <h2 style={styles.sectionTitle}>
            Order Summary
          </h2>
          
          <div style={styles.productCard}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <img 
                src={productData.image} 
                alt={productData.title}
                style={styles.productImage}
              />
              <div style={styles.productInfo}>
                <h3 style={{ margin: '0 0 5px 0', fontSize: '16px' }}>
                  {productData.title}
                </h3>
                <p style={{ margin: '0', color: '#666', fontSize: '14px' }}>
                  Size: {productData.selectedSize} | Color: {productData.selectedColor}
                </p>
                <p style={{ margin: '5px 0', color: '#666', fontSize: '14px' }}>
                  Quantity: {productData.quantity}
                </p>
                <p style={{ margin: '5px 0 0 0', fontSize: '18px', fontWeight: '700', color: '#B12704' }}>
                  ₹{productData.price * productData.quantity}
                </p>
              </div>
            </div>
          </div>

          <div style={{ background: 'white', borderRadius: '8px', padding: '15px' }}>
            <h4 style={{ margin: '0 0 10px 0' }}>Price Details</h4>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
              <span>Item Total:</span>
              <span>₹{productData.price * productData.quantity}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
              <span>Delivery:</span>
              <span style={{ color: '#28a745' }}>FREE</span>
            </div>
            <hr style={{ margin: '10px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: '700' }}>
              <span>Total:</span>
              <span style={{ color: '#B12704' }}>₹{productData.price * productData.quantity}</span>
            </div>
          </div>
        </div>

        {/* Customer Details Section */}
        <div>
          <h2 style={styles.sectionTitle}>
            <User size={24} />
            {isReturningUser ? 'Welcome Back!' : 'Customer Details'}
          </h2>
          
          {/* Show saved details for returning users */}
          {isReturningUser && !showEditForm ? (
            <div>
              <div style={styles.savedDetails}>
                <h3 style={{ margin: '0 0 15px 0', color: '#28a745', fontSize: '16px' }}>
                  ✅ Your Saved Details
                </h3>
                
                <div style={styles.detailItem}>
                  <span><strong>Name:</strong></span>
                  <span>{customerDetails.name}</span>
                </div>
                <div style={styles.detailItem}>
                  <span><strong>Phone:</strong></span>
                  <span>{customerDetails.phone}</span>
                </div>
                <div style={styles.detailItem}>
                  <span><strong>Email:</strong></span>
                  <span>{customerDetails.email}</span>
                </div>
                <div style={styles.detailItem}>
                  <span><strong>Address:</strong></span>
                  <span>{customerDetails.address}</span>
                </div>
                <div style={styles.detailItem}>
                  <span><strong>City:</strong></span>
                  <span>{customerDetails.city}</span>
                </div>
                <div style={styles.detailItem}>
                  <span><strong>State:</strong></span>
                  <span>{customerDetails.state}</span>
                </div>
                <div style={styles.detailItem}>
                  <span><strong>Pincode:</strong></span>
                  <span>{customerDetails.pincode}</span>
                </div>
              </div>

              {/* Additional Info for current order */}
              <div style={styles.section}>
                <h3 style={styles.sectionTitle}>
                  <MessageSquare size={20} />
                  Additional Information (Optional)
                </h3>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Special Instructions for this order</label>
                  <textarea
                    value={customerDetails.additionalInfo}
                    onChange={(e) => handleInputChange('additionalInfo', e.target.value)}
                    style={styles.textarea}
                    placeholder="Any special delivery instructions, preferred time, etc."
                  />
                </div>
              </div>

              {/* Action buttons for returning users */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '20px' }}>
                <button
                  onClick={handleDirectWhatsApp}
                  disabled={isSubmitting}
                  style={{
                    ...styles.submitBtn,
                    ...(isSubmitting ? styles.loading : {}),
                    flex: 1
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <div style={{ 
                        width: '20px', 
                        height: '20px', 
                        border: '2px solid #fff',
                        borderTop: '2px solid transparent',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                      }} />
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
                  onClick={handleEditDetails}
                  style={styles.editBtn}
                >
                  <Edit size={16} />
                  Edit Details
                </button>
                
                <button
                  onClick={handleClearDetails}
                  style={styles.clearBtn}
                >
                  Clear Details
                </button>
              </div>
            </div>
          ) : (
            // Show form for new users or when editing
            <form style={styles.form} onSubmit={showEditForm ? handleUpdateDetails : handleSubmit}>
              {/* Personal Information */}
              <div style={styles.section}>
                <h3 style={styles.sectionTitle}>
                  <User size={20} />
                  Personal Information
                </h3>
                
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Full Name *</label>
                  <input
                    type="text"
                    value={customerDetails.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    style={{
                      ...styles.input,
                      ...(errors.name ? styles.inputError : {})
                    }}
                    placeholder="Enter your full name"
                  />
                  {errors.name && <div style={styles.error}>{errors.name}</div>}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '15px' }}>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Phone Number *</label>
                    <input
                      type="tel"
                      value={customerDetails.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      style={{
                        ...styles.input,
                        ...(errors.phone ? styles.inputError : {})
                      }}
                      placeholder="10-digit mobile number"
                    />
                    {errors.phone && <div style={styles.error}>{errors.phone}</div>}
                  </div>

                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Email Address *</label>
                    <input
                      type="email"
                      value={customerDetails.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      style={{
                        ...styles.input,
                        ...(errors.email ? styles.inputError : {})
                      }}
                      placeholder="your.email@example.com"
                    />
                    {errors.email && <div style={styles.error}>{errors.email}</div>}
                  </div>
                </div>
              </div>

              {/* Delivery Address */}
              <div style={styles.section}>
                <h3 style={styles.sectionTitle}>
                  <MapPin size={20} />
                  Delivery Address
                </h3>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>Street Address *</label>
                  <textarea
                    value={customerDetails.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    style={{
                      ...styles.textarea,
                      ...(errors.address ? styles.inputError : {}),
                      minHeight: '80px'
                    }}
                    placeholder="House/Flat no, Building name, Street, Area"
                  />
                  {errors.address && <div style={styles.error}>{errors.address}</div>}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr', gap: '15px' }}>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>City *</label>
                    <input
                      type="text"
                      value={customerDetails.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      style={{
                        ...styles.input,
                        ...(errors.city ? styles.inputError : {})
                      }}
                      placeholder="City"
                    />
                    {errors.city && <div style={styles.error}>{errors.city}</div>}
                  </div>

                  <div style={styles.inputGroup}>
                    <label style={styles.label}>State *</label>
                    <input
                      type="text"
                      value={customerDetails.state}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                      style={{
                        ...styles.input,
                        ...(errors.state ? styles.inputError : {})
                      }}
                      placeholder="State"
                    />
                    {errors.state && <div style={styles.error}>{errors.state}</div>}
                  </div>

                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Pincode *</label>
                    <input
                      type="text"
                      value={customerDetails.pincode}
                      onChange={(e) => handleInputChange('pincode', e.target.value)}
                      style={{
                        ...styles.input,
                        ...(errors.pincode ? styles.inputError : {})
                      }}
                      placeholder="6-digit pincode"
                    />
                    {errors.pincode && <div style={styles.error}>{errors.pincode}</div>}
                  </div>
                </div>
              </div>

              {/* Product Image Preview */}
              <div style={styles.section}>
                <h3 style={styles.sectionTitle}>
                  <Image size={20} />
                  Product Image
                </h3>
                
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '15px',
                  alignItems: 'center'
                }}>
                  <img 
                    src={productData.image} 
                    alt={productData.title}
                    style={styles.previewImage}
                  />
                  
                  <p style={{
                    fontSize: '12px',
                    color: '#666',
                    textAlign: 'center',
                    margin: '0',
                    lineHeight: '1.4'
                  }}>
                    📸 Product image link will be included in the WhatsApp message.
                  </p>
                </div>
              </div>

              {/* Additional Information */}
              <div style={styles.section}>
                <h3 style={styles.sectionTitle}>
                  <MessageSquare size={20} />
                  Additional Information
                </h3>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>Special Instructions (Optional)</label>
                  <textarea
                    value={customerDetails.additionalInfo}
                    onChange={(e) => handleInputChange('additionalInfo', e.target.value)}
                    style={styles.textarea}
                    placeholder="Any special delivery instructions, preferred time, etc."
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    ...styles.submitBtn,
                    ...(isSubmitting ? styles.loading : {}),
                    flex: 1
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <div style={{ 
                        width: '20px', 
                        height: '20px', 
                        border: '2px solid #fff',
                        borderTop: '2px solid transparent',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                      }} />
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
                    onClick={() => setShowEditForm(false)}
                    style={styles.editBtn}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Add CSS animation for loading spinner */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
