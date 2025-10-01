import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Star, Check, ShoppingCart, Plus, Minus, Send, Shield, Truck, RotateCcw, AlertTriangle } from 'lucide-react';

const API_BASE_URL = "https://boltfit-backend-r4no.onrender.com/api/v1";

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [mainImage, setMainImage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showSuccess, setShowSuccess] = useState('');
  const [feedback, setFeedback] = useState({ rating: 0, comment: '', name: '' });

  const shopInfo = {
    name: "PRESTIGE COLLECTION",
    rating: 4.8,
    reviews: "50,000+",
    since: "2018",
    features: ["✓ 100% Authentic Products", "✓ 30-Day Return Policy", "✓ Free Shipping Above ₹999", "✓ 24/7 Customer Support"]
  };

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!navigator.onLine) throw new Error('No internet connection');

      const response = await fetch(`${API_BASE_URL}/products/${id}`);

      if (!response.ok) {
        const errors = {
          404: 'Product not found',
          403: 'Access denied', 
          500: 'Server error. Try again later'
        };
        throw new Error(errors[response.status] || 'Something went wrong');
      }

      const apiProduct = await response.json();

      const transformedProduct = {
        id: apiProduct.id || id,
        title: apiProduct.name || 'Premium Classic Collection',
        price: apiProduct.price || 1299,
        originalPrice: apiProduct.original_price || 1899,
        images: apiProduct.images?.length ? apiProduct.images : [
          'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600',
          'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600',
          'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600'
        ],
        description: apiProduct.description || 'Premium quality product with exceptional craftsmanship and timeless design.',
        features: apiProduct.features || ['Premium Materials', 'Expert Craftsmanship', 'Lifetime Durability', 'Modern Design'],
        sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
        colors: [
          { name: 'Black', hex: '#000000', stock: 15 },
          { name: 'Navy', hex: '#1e3a8a', stock: 12 },
          { name: 'Brown', hex: '#8b4513', stock: 8 },
          { name: 'Green', hex: '#166534', stock: 5 },
          { name: 'Gray', hex: '#6b7280', stock: 20 }
        ],
        rating: apiProduct.rating || 4.6,
        reviewsCount: apiProduct.reviewsCount || 2847,
        brand: apiProduct.brand || 'PRESTIGE'
      };

      setProduct(transformedProduct);
      setMainImage(transformedProduct.images[0]);
      setSelectedSize('M');
      setSelectedColor(transformedProduct.colors[0].name);

    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message);

      const fallback = {
        id, title: 'Premium Collection', price: 1299, originalPrice: 1899,
        images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600'],
        description: 'Premium quality with exceptional design.',
        features: ['Quality Assured', 'Fast Delivery', 'Easy Returns'],
        sizes: ['S', 'M', 'L', 'XL'], rating: 4.5, reviewsCount: 156, brand: 'PRESTIGE',
        colors: [{ name: 'Black', hex: '#000000', stock: 10 }]
      };

      if (err.message !== 'Product not found') {
        setProduct(fallback);
        setMainImage(fallback.images[0]);
        setSelectedSize('M');
        setSelectedColor('Black');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      setError('Please select size and color');
      return;
    }
    setShowSuccess('Added to cart successfully!');
    setTimeout(() => setShowSuccess(''), 3000);
  };
  // Add this new function after your existing handleAddToCart function
  const handleBuyNow = () => {
    if (!selectedSize || !selectedColor) {
      setError('Please select size and color');
      return;
    }
    
    // Navigate to customer details page with product info
    const productData = {
      id: product.id,
      title: product.title,
      price: product.price,
      image: mainImage,
      selectedSize,
      selectedColor,
      quantity
    };
    
    navigate('/customer-details', { 
      state: { productData } 
    });
  };

  const handleSubmitFeedback = () => {
    if (!feedback.name.trim() || !feedback.comment.trim() || feedback.rating < 1) {
      setError('Please complete all feedback fields');
      return;
    }
    setShowSuccess('Review submitted successfully!');
    setFeedback({ rating: 0, comment: '', name: '' });
    setTimeout(() => setShowSuccess(''), 3000);
  };

  const getCurrentColorStock = () => {
    const colorData = product?.colors?.find(c => c.name === selectedColor);
    return colorData?.stock || 0;
  };

  const isMobile = window.innerWidth <= 768;
  const isTablet = window.innerWidth > 768 && window.innerWidth <= 1024;

  const styles = {
    container: {
      fontFamily: "'Amazon Ember', Arial, sans-serif",
      background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
      minHeight: '100vh',
      padding: isMobile ? '10px' : '20px',
      animation: 'fadeIn 0.6s ease-out'
    },

    nav: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      marginBottom: '20px',
      padding: '15px 0',
      borderBottom: '2px solid #dee2e6',
      animation: 'slideDown 0.5s ease-out'
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
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      boxShadow: '0 2px 8px rgba(0, 113, 133, 0.15)'
    },

    main: {
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : isTablet ? '1.2fr 1fr' : '1.5fr 1fr',
      gap: isMobile ? '25px' : '30px',
      maxWidth: '1400px',
      margin: '0 auto',
      background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
      borderRadius: '16px',
      padding: isMobile ? '20px' : '30px',
      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
      animation: 'slideUp 0.7s ease-out'
    },

    imageSection: {
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      gap: '15px',
      animation: 'fadeInLeft 0.8s ease-out'
    },

    thumbnails: {
      display: 'flex',
      flexDirection: isMobile ? 'row' : 'column',
      gap: '10px',
      order: isMobile ? 2 : 1,
      maxHeight: isMobile ? 'auto' : '320px',
      overflowY: 'auto'
    },

    thumbnail: {
      width: isMobile ? '60px' : '75px',
      height: isMobile ? '60px' : '75px',
      objectFit: 'cover',
      border: '3px solid transparent',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
    },

    mainImageContainer: {
      order: isMobile ? 1 : 2,
      flex: 1,
      overflow: 'hidden',
      borderRadius: '12px',
      boxShadow: '0 6px 25px rgba(0, 0, 0, 0.15)',
      maxHeight: '380px' // Reduced from 420px to minimize waste space
    },

    mainImage: {
      width: '100%',
      height: '100%',
      objectFit: 'contain', // Changed from cover to contain to avoid cropping
      borderRadius: '12px',
      background: '#f8f9fa', // Light background for transparent images
      transition: 'transform 0.5s ease',
      cursor: 'zoom-in'
    },

    productInfo: {
      animation: 'fadeInRight 0.8s ease-out'
    },

    brand: {
      color: '#007185',
      fontSize: '14px',
      fontWeight: '600',
      marginBottom: '8px',
      textTransform: 'uppercase'
    },

    title: {
      fontSize: isMobile ? '20px' : '26px',
      fontWeight: '600',
      color: '#0f1111',
      lineHeight: '1.3',
      marginBottom: '12px'
    },

    rating: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      marginBottom: '15px'
    },

    price: {
      marginBottom: '20px'
    },

    currentPrice: {
      fontSize: isMobile ? '22px' : '28px',
      color: '#B12704',
      fontWeight: '700'
    },

    originalPrice: {
      fontSize: '15px',
      color: '#565959',
      textDecoration: 'line-through',
      marginLeft: '10px'
    },

    discount: {
      color: '#CC0C39',
      fontSize: '14px',
      fontWeight: '700',
      marginLeft: '10px'
    },

    section: {
      marginBottom: '20px',
      paddingBottom: '20px',
      borderBottom: '1px solid rgba(231, 231, 231, 0.6)'
    },

    sectionTitle: {
      fontSize: '16px',
      fontWeight: '700',
      color: '#0f1111',
      marginBottom: '12px'
    },

    // Vertical layout for size and color - no grid needed
    selectionGroup: {
      marginBottom: '15px'
    },

    selectionLabel: {
      fontSize: '14px',
      marginBottom: '8px',
      fontWeight: '600'
    },

    sizeButtons: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '8px',
      marginBottom: '15px'
    },

    optionBtn: {
      padding: '8px 14px',
      border: '2px solid #d5d9d9',
      borderRadius: '6px',
      background: 'white',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '600',
      minWidth: '45px',
      textAlign: 'center',
      transition: 'all 0.3s ease',
      boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)'
    },

    colorOptions: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '10px'
    },

    colorBtn: {
      width: '35px',
      height: '35px',
      borderRadius: '50%',
      border: '3px solid transparent',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
    },

    stockInfo: {
      fontSize: '12px',
      color: '#007600',
      marginTop: '5px',
      fontWeight: '600'
    },

    quantity: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '20px'
    },

    qtyBtn: {
      width: '35px',
      height: '35px',
      border: '2px solid #d5d9d9',
      background: '#f0f2f2',
      cursor: 'pointer',
      borderRadius: '6px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.3s ease'
    },

    qtyInput: {
      width: '55px',
      height: '35px',
      textAlign: 'center',
      border: '2px solid #d5d9d9',
      borderRadius: '6px',
      fontSize: '14px',
      fontWeight: '600'
    },

    buttons: {
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      gap: '12px',
      marginBottom: '25px'
    },

    addToCartBtn: {
      background: 'linear-gradient(135deg, #ff9900, #ff8800)',
      color: 'white',
      border: 'none',
      padding: '14px 24px',
      borderRadius: '8px',
      fontSize: '15px',
      fontWeight: '600',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      flex: 1,
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 15px rgba(255, 153, 0, 0.4)'
    },

    wishlistBtn: {
      background: 'white',
      border: '2px solid #d5d9d9',
      padding: '14px',
      borderRadius: '8px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.3s ease'
    },

    trustBadges: {
      background: 'linear-gradient(135deg, #e7f5e7, #d4edda)',
      border: '1px solid #c8e6c9',
      borderRadius: '10px',
      padding: '15px',
      marginBottom: '20px'
    },

    trustTitle: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: '15px',
      fontWeight: '700',
      color: '#2e7d32',
      marginBottom: '10px'
    },

    features: {
      listStyle: 'none',
      padding: 0,
      margin: 0
    },

    feature: {
      color: '#0f1111',
      fontSize: '14px',
      marginBottom: '8px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },

    feedback: {
      background: 'white',
      borderRadius: '12px',
      padding: '20px',
      marginTop: '25px',
      boxShadow: '0 6px 20px rgba(0, 0, 0, 0.1)'
    },

    input: {
      width: '100%',
      padding: '10px 14px',
      border: '2px solid #e9ecef',
      borderRadius: '6px',
      marginBottom: '12px',
      fontSize: '14px',
      transition: 'all 0.3s ease'
    },

    textarea: {
      width: '100%',
      padding: '10px 14px',
      border: '2px solid #e9ecef',
      borderRadius: '6px',
      minHeight: '80px',
      fontSize: '14px',
      resize: 'vertical',
      transition: 'all 0.3s ease'
    },

    stars: {
      display: 'flex',
      gap: '6px',
      marginBottom: '12px'
    },

    submitBtn: {
      background: 'linear-gradient(135deg, #007185, #005f63)',
      color: 'white',
      border: 'none',
      padding: '12px 20px',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '600',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      transition: 'all 0.3s ease'
    },

    error: {
      background: 'linear-gradient(135deg, #ffe8e8, #ffeaa7)',
      color: '#d63031',
      padding: '12px 16px',
      borderRadius: '8px',
      marginBottom: '15px',
      fontSize: '14px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      border: '1px solid #fab1a0'
    },

    success: {
      position: 'fixed',
      top: '20px',
      right: '20px',
      background: 'linear-gradient(135deg, #00a650, #00b894)',
      color: 'white',
      padding: '14px 20px',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '600',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      animation: 'slideInRight 0.5s ease',
      boxShadow: '0 6px 20px rgba(0, 166, 80, 0.3)'
    },

    loading: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '60vh',
      flexDirection: 'column',
      gap: '20px'
    },

    spinner: {
      width: '40px',
      height: '40px',
      border: '4px solid #f3f4f6',
      borderTop: '4px solid #ff9900',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    }
  };

  // Reduced CSS animations
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      @keyframes fadeIn { 0% { opacity: 0; } 100% { opacity: 1; } }
      @keyframes slideDown { 0% { transform: translateY(-20px); opacity: 0; } 100% { transform: translateY(0); opacity: 1; } }
      @keyframes slideUp { 0% { transform: translateY(30px); opacity: 0; } 100% { transform: translateY(0); opacity: 1; } }
      @keyframes fadeInLeft { 0% { transform: translateX(-20px); opacity: 0; } 100% { transform: translateX(0); opacity: 1; } }
      @keyframes fadeInRight { 0% { transform: translateX(20px); opacity: 0; } 100% { transform: translateX(0); opacity: 1; } }
      @keyframes slideInRight { 0% { transform: translateX(100%); opacity: 0; } 100% { transform: translateX(0); opacity: 1; } }
      
      .back-btn:hover { background: rgba(0, 113, 133, 0.2) !important; transform: translateY(-2px) !important; }
      .thumb:hover { border-color: #ff9900 !important; transform: scale(1.05) !important; }
      .thumb.active { border-color: #ff9900 !important; }
      .main-image:hover { transform: scale(1.02) !important; }
      .option-btn:hover { border-color: #ff9900 !important; background: #fff3cd !important; }
      .option-btn.active { background: #fff3cd !important; border-color: #ff9900 !important; }
      .color-btn:hover { transform: scale(1.1) !important; }
      .color-btn.active { border-color: #ff9900 !important; transform: scale(1.15) !important; }
      .qty-btn:hover { background: #007185 !important; color: white !important; }
      .add-cart:hover { background: linear-gradient(135deg, #e88900, #cc7700) !important; transform: translateY(-2px) !important; }
      .wishlist:hover { border-color: #e91e63 !important; }
      .submit-btn:hover { background: linear-gradient(135deg, #005f63, #004d50) !important; }
      .input:focus, .textarea:focus { border-color: #ff9900 !important; outline: none !important; }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>
          <div style={styles.spinner}></div>
          <h3 style={{color: '#ff9900', fontSize: '16px', fontWeight: '600'}}>Loading Premium Product...</h3>
        </div>
      </div>
    );
  }

  if (error && !product) {
    return (
      <div style={styles.container}>
        <div style={styles.error}>
          <AlertTriangle size={18} />
          {error}
          <button 
            onClick={fetchProduct} 
            style={{marginLeft: 'auto', padding: '6px 12px', background: '#007185', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer'}}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!product) return null;

  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  return (
    <div style={styles.container}>
      {showSuccess && (
        <div style={styles.success}>
          <Check size={16} />
          {showSuccess}
        </div>
      )}

      <div style={styles.nav}>
        <div style={styles.backBtn} className="back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={16} />
          Back to Products
        </div>
      </div>

      {error && (
        <div style={styles.error}>
          <AlertTriangle size={16} />
          {error}
        </div>
      )}

      <div style={styles.main}>
        {/* Image Section */}
        <div style={styles.imageSection}>
          <div style={styles.thumbnails}>
            {product.images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`View ${idx + 1}`}
                style={styles.thumbnail}
                className={`thumb ${mainImage === img ? 'active' : ''}`}
                onClick={() => setMainImage(img)}
                onError={(e) => e.target.style.display = 'none'}
              />
            ))}
          </div>
          <div style={styles.mainImageContainer}>
            <img
              src={mainImage}
              alt={product.title}
              style={styles.mainImage}
              className="main-image"
              onError={(e) => e.target.src = 'https://via.placeholder.com/400x400?text=Image+Not+Available'}
            />
          </div>
        </div>

        {/* Product Info */}
        <div style={styles.productInfo}>
          <div style={styles.brand}>{product.brand}</div>
          <h1 style={styles.title}>{product.title}</h1>

          <div style={styles.rating}>
            <div style={{display: 'flex', gap: '2px'}}>
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  fill={i < Math.floor(product.rating) ? "#ff9900" : "none"}
                  color="#ff9900"
                />
              ))}
            </div>
            <span style={{fontSize: '14px', color: '#007185'}}>
              {product.rating} ({product.reviewsCount.toLocaleString()} reviews)
            </span>
          </div>

          <div style={styles.price}>
            <span style={styles.currentPrice}>₹{product.price.toLocaleString()}</span>
            <span style={styles.originalPrice}>₹{product.originalPrice.toLocaleString()}</span>
            <span style={styles.discount}>({discount}% off)</span>
          </div>

          <div style={styles.trustBadges}>
            <div style={styles.trustTitle}>
              <Shield size={16} />
              {shopInfo.name} - Trusted Since {shopInfo.since}
            </div>
            <ul style={styles.features}>
              {shopInfo.features.map((feature, idx) => (
                <li key={idx} style={styles.feature}>
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          <p style={{fontSize: '14px', color: '#565959', lineHeight: '1.5', marginBottom: '20px'}}>
            {product.description}
          </p>

          {/* Size & Color Selection - Vertical Layout */}
          <div style={styles.section}>
            <div style={styles.sectionTitle}>Size & Color</div>
            
            {/* Size Selection */}
            <div style={styles.selectionGroup}>
              <div style={styles.selectionLabel}>
                Size: <strong style={{color: '#ff9900'}}>{selectedSize}</strong>
              </div>
              <div style={styles.sizeButtons}>
                {product.sizes.map(size => (
                  <button
                    key={size}
                    style={styles.optionBtn}
                    className={`option-btn ${selectedSize === size ? 'active' : ''}`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selection */}
            <div style={styles.selectionGroup}>
              <div style={styles.selectionLabel}>
                Color: <strong style={{color: '#ff9900'}}>{selectedColor}</strong>
              </div>
              <div style={styles.colorOptions}>
                {product.colors.map(color => (
                  <div
                    key={color.name}
                    style={{...styles.colorBtn, backgroundColor: color.hex}}
                    className={`color-btn ${selectedColor === color.name ? 'active' : ''}`}
                    onClick={() => setSelectedColor(color.name)}
                    title={color.name}
                  />
                ))}
              </div>
              <div style={styles.stockInfo}>
                In Stock: {getCurrentColorStock()} items
              </div>
            </div>
          </div>

          {/* Quantity */}
          <div style={styles.quantity}>
            <span style={{fontSize: '14px', fontWeight: '700'}}>Qty:</span>
            <button
              style={styles.qtyBtn}
              className="qty-btn"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
            >
              <Minus size={14} />
            </button>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              style={styles.qtyInput}
              className="input"
              min="1"
              max="10"
            />
            <button
              style={styles.qtyBtn}
              className="qty-btn"
              onClick={() => setQuantity(quantity + 1)}
            >
              <Plus size={14} />
            </button>
          </div>

          {/* Action Buttons */}
          <div style={styles.buttons}>
            <button
              style={styles.addToCartBtn}
              onClick={handleAddToCart}
              className="add-cart"
            >
              <ShoppingCart size={18} />
              Add to Cart
            </button>
            
            <button
              style={{
                ...styles.addToCartBtn,
                background: 'linear-gradient(135deg, #28a745, #20c997)',
                boxShadow: '0 4px 15px rgba(40, 167, 69, 0.4)'
              }}
              onClick={handleBuyNow}
              className="buy-now"
            >
              <ShoppingCart size={18} />
              Buy Now
            </button>
            
            <button
              style={styles.wishlistBtn}
              onClick={() => setIsWishlisted(!isWishlisted)}
              className="wishlist"
            >
              <Heart 
                size={20} 
                fill={isWishlisted ? '#e91e63' : 'none'}
                color={isWishlisted ? '#e91e63' : '#666'}
              />
            </button>
          </div>


          {/* Product Features */}
          <div style={styles.section}>
            <div style={styles.sectionTitle}>Key Features</div>
            <ul style={styles.features}>
              {product.features.map((feature, idx) => (
                <li key={idx} style={styles.feature}>
                  <Check size={14} color="#00a650" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          {/* Delivery Info */}
          <div style={styles.section}>
            <div style={styles.sectionTitle}>Delivery & Returns</div>
            <div style={styles.feature}>
              <Truck size={14} color="#007185" />
              FREE delivery by tomorrow if you order within 2 hrs
            </div>
            <div style={styles.feature}>
              <RotateCcw size={14} color="#007185" />
              30-day return policy. Easy returns & refunds
            </div>
          </div>
        </div>
      </div>

      {/* Feedback Section */}
      <div style={styles.feedback}>
        <h3 style={{fontSize: '18px', marginBottom: '15px', fontWeight: '700', color: '#0f1111'}}>
          Write a Review
        </h3>

        <input
          type="text"
          placeholder="Your name"
          value={feedback.name}
          onChange={(e) => setFeedback({...feedback, name: e.target.value})}
          style={styles.input}
          className="input"
        />

        <div style={styles.stars}>
          {[1,2,3,4,5].map(star => (
            <Star
              key={star}
              size={20}
              fill={star <= feedback.rating ? "#ff9900" : "none"}
              color="#ff9900"
              style={{cursor: 'pointer'}}
              onClick={() => setFeedback({...feedback, rating: star})}
            />
          ))}
        </div>

        <textarea
          placeholder="Share your experience with this product..."
          value={feedback.comment}
          onChange={(e) => setFeedback({...feedback, comment: e.target.value})}
          style={styles.textarea}
          className="textarea"
        />

        <button
          style={styles.submitBtn}
          className="submit-btn"
          onClick={handleSubmitFeedback}
        >
          <Send size={14} />
          Submit Review
        </button>
      </div>
    </div>
  );
}
