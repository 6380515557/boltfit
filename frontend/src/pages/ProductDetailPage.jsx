import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Heart, Star, Check, ShoppingCart, Plus, Minus, Send, 
  Shield, Truck, RotateCcw, AlertTriangle, ChevronRight, Info,
  Package, Award, Zap, TrendingUp, Clock, MapPin
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import './ProductDetailPage.css';

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
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [allCategoryProducts, setAllCategoryProducts] = useState([]);
  const [activeTab, setActiveTab] = useState('description');
  const [pincode, setPincode] = useState('');
  const [deliveryInfo, setDeliveryInfo] = useState(null);
  const [categoryLoading, setCategoryLoading] = useState(false);

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
          'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600',
          'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=600'
        ],
        description: apiProduct.description || 'Premium quality product with exceptional craftsmanship and timeless design. Perfect for everyday wear with superior comfort.',
        features: apiProduct.features || ['Premium Materials', 'Expert Craftsmanship', 'Lifetime Durability', 'Modern Design'],
        specifications: [
          { label: 'Material', value: '100% Cotton' },
          { label: 'Fit', value: 'Regular Fit' },
          { label: 'Pattern', value: 'Solid' },
          { label: 'Occasion', value: 'Casual' },
          { label: 'Care', value: 'Machine Wash' }
        ],
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
        brand: apiProduct.brand || 'PRESTIGE',
        category: apiProduct.category || 'Shirts'
      };

      setProduct(transformedProduct);
      setMainImage(transformedProduct.images[0]);
      setSelectedSize('M');
      setSelectedColor(transformedProduct.colors[0].name);

      // Fetch related products for horizontal scroll
      fetchRelatedProducts(transformedProduct.category);
      // Fetch all category products
      fetchAllCategoryProducts(transformedProduct.category);

    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message);

      const fallback = {
        id, title: 'Premium Collection', price: 1299, originalPrice: 1899,
        images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600'],
        description: 'Premium quality with exceptional design.',
        features: ['Quality Assured', 'Fast Delivery', 'Easy Returns'],
        specifications: [
          { label: 'Material', value: '100% Cotton' },
          { label: 'Fit', value: 'Regular Fit' }
        ],
        sizes: ['S', 'M', 'L', 'XL'], rating: 4.5, reviewsCount: 156, brand: 'PRESTIGE',
        colors: [{ name: 'Black', hex: '#000000', stock: 10 }],
        category: 'Shirts'
      };

      if (err.message !== 'Product not found') {
        setProduct(fallback);
        setMainImage(fallback.images[0]);
        setSelectedSize('M');
        setSelectedColor('Black');
        fetchAllCategoryProducts('Shirts');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedProducts = async (category) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/products/?category=${encodeURIComponent(category)}&is_active=true&per_page=12`
      );
      
      if (response.ok) {
        const data = await response.json();
        const transformed = data.products.slice(0, 6).map((p, i) => ({
          id: p.id,
          title: p.name,
          price: p.price,
          originalPrice: p.original_price || (p.price + 200),
          image: p.images?.[0] || `https://images.unsplash.com/photo-${1520000000000 + i}?w=300`,
          rating: (Math.random() * 1.5 + 3.5).toFixed(1),
          discount: p.original_price 
            ? Math.round(((p.original_price - p.price) / p.original_price) * 100)
            : 20
        }));
        setRelatedProducts(transformed);
      }
    } catch (err) {
      console.error('Error fetching related products:', err);
      const mockProducts = Array.from({ length: 6 }, (_, i) => ({
        id: `related-${i + 1}`,
        title: `Premium ${category} ${i + 1}`,
        price: Math.floor(Math.random() * 2000) + 699,
        originalPrice: Math.floor(Math.random() * 3000) + 1200,
        image: `https://images.unsplash.com/photo-${1520000000000 + i}?w=300`,
        rating: (Math.random() * 1.5 + 3.5).toFixed(1),
        discount: Math.floor(Math.random() * 40) + 15
      }));
      setRelatedProducts(mockProducts);
    }
  };

  const fetchAllCategoryProducts = async (category) => {
    try {
      setCategoryLoading(true);
      const response = await fetch(
        `${API_BASE_URL}/products/?category=${encodeURIComponent(category)}&is_active=true&per_page=100`
      );
      
      if (response.ok) {
        const data = await response.json();
        const transformed = data.products
          .filter(p => p.id !== id) // Exclude current product
          .map((p, i) => ({
            id: p.id,
            title: p.name,
            price: p.price,
            originalPrice: p.original_price || (p.price + 200),
            image: p.images?.[0] || `https://images.unsplash.com/photo-${1530000000000 + i}?w=400`,
            rating: (Math.random() * 1.5 + 3.5).toFixed(1),
            reviewsCount: Math.floor(Math.random() * 500) + 25,
            discount: p.original_price 
              ? Math.round(((p.original_price - p.price) / p.original_price) * 100)
              : 20,
            brand: p.brand || 'BOLT FIT',
            inStock: true
          }));
        setAllCategoryProducts(transformed);
      }
    } catch (err) {
      console.error('Error fetching all category products:', err);
      // Generate fallback products
      const moreMock = Array.from({ length: 20 }, (_, i) => ({
        id: `category-${i + 1}`,
        title: `${category} Collection ${i + 1}`,
        price: Math.floor(Math.random() * 2000) + 699,
        originalPrice: Math.floor(Math.random() * 3000) + 1200,
        image: `https://images.unsplash.com/photo-${1530000000000 + i}?w=400`,
        rating: (Math.random() * 1.5 + 3.5).toFixed(1),
        reviewsCount: Math.floor(Math.random() * 500) + 25,
        discount: Math.floor(Math.random() * 40) + 15,
        brand: 'BOLT FIT',
        inStock: true
      }));
      setAllCategoryProducts(moreMock);
    } finally {
      setCategoryLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
    window.scrollTo(0, 0);
  }, [id]);

  const { addToCart } = useCart();

  function handleAddToCart() {
    if (!selectedSize || !selectedColor) {
      setError("Please select size and color");
      return;
    }
    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      image: mainImage,
      selectedSize,
      selectedColor,
      quantity
    });
    setShowSuccess("Added to cart successfully!");
    setTimeout(() => setShowSuccess(null), 3000);
  }

  const handleBuyNow = () => {
    if (!selectedSize || !selectedColor) {
      setError('Please select size and color');
      return;
    }
    
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

  const checkDelivery = () => {
    if (pincode.length === 6) {
      setDeliveryInfo({
        available: true,
        date: 'Tomorrow, Oct 12',
        time: 'Before 9:00 PM'
      });
    } else {
      setDeliveryInfo({ available: false });
    }
  };

  const getCurrentColorStock = () => {
    const colorData = product?.colors?.find(c => c.name === selectedColor);
    return colorData?.stock || 0;
  };

  if (loading) {
    return (
      <div className="pdp-container">
        <div className="pdp-loading">
          <div className="pdp-spinner"></div>
          <h3>Loading Premium Product...</h3>
        </div>
      </div>
    );
  }

  if (error && !product) {
    return (
      <div className="pdp-container">
        <div className="pdp-error">
          <AlertTriangle size={18} />
          {error}
          <button onClick={fetchProduct} className="pdp-retry-btn">
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!product) return null;

  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  return (
    <div className="pdp-container">
      {showSuccess && (
        <div className="pdp-success-toast">
          <Check size={16} />
          {showSuccess}
        </div>
      )}

      {/* Breadcrumb Navigation */}
      <nav className="pdp-breadcrumb">
        <span onClick={() => navigate('/')} className="pdp-breadcrumb-link">Home</span>
        <ChevronRight size={14} />
        <span onClick={() => navigate(`/category/${product.category}`)} className="pdp-breadcrumb-link">{product.category}</span>
        <ChevronRight size={14} />
        <span className="pdp-breadcrumb-current">{product.title}</span>
      </nav>

      <div className="pdp-layout">
        {/* Left Section - Images */}
        <div className="pdp-left-section">
          <div className="pdp-image-gallery">
            <div className="pdp-thumbnails-vertical">
              {product.images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`View ${idx + 1}`}
                  className={`pdp-thumbnail ${mainImage === img ? 'active' : ''}`}
                  onClick={() => setMainImage(img)}
                  onError={(e) => e.target.style.display = 'none'}
                />
              ))}
            </div>
            <div className="pdp-main-image-wrapper">
              <img
                src={mainImage}
                alt={product.title}
                className="pdp-main-image"
                onError={(e) => e.target.src = 'https://via.placeholder.com/600x600?text=Image+Not+Available'}
              />
              <button 
                className={`pdp-wishlist-btn ${isWishlisted ? 'active' : ''}`}
                onClick={() => setIsWishlisted(!isWishlisted)}
              >
                <Heart 
                  size={20} 
                  fill={isWishlisted ? '#ff6b6b' : 'none'}
                  color={isWishlisted ? '#ff6b6b' : '#666'}
                />
              </button>
            </div>
          </div>

          {/* Action Buttons - Desktop */}
          <div className="pdp-action-buttons-desktop">
            <button className="pdp-add-cart-btn" onClick={handleAddToCart}>
              <ShoppingCart size={20} />
              ADD TO CART
            </button>
            
            <button className="pdp-buy-now-btn" onClick={handleBuyNow}>
              <Zap size={20} />
              BUY NOW
            </button>
          </div>
        </div>

        {/* Right Section - Product Info */}
        <div className="pdp-right-section">
          <div className="pdp-product-header">
            <div className="pdp-brand-tag">{product.brand}</div>
            <h1 className="pdp-product-title">{product.title}</h1>

            <div className="pdp-rating-row">
              <div className="pdp-rating-box">
                <span className="pdp-rating-num">{product.rating}</span>
                <Star size={12} fill="#fff" color="#fff" />
              </div>
              <span className="pdp-rating-text">
                {product.reviewsCount.toLocaleString()} Ratings & {Math.floor(product.reviewsCount * 0.7).toLocaleString()} Reviews
              </span>
            </div>

            <div className="pdp-price-row">
              <div className="pdp-special-price">
                <span className="pdp-label">Special Price</span>
                <div className="pdp-price-main">
                  <span className="pdp-price">₹{product.price.toLocaleString()}</span>
                  <span className="pdp-original">₹{product.originalPrice.toLocaleString()}</span>
                  <span className="pdp-discount-tag">{discount}% off</span>
                </div>
              </div>
            </div>

            {/* Offer Tags */}
            <div className="pdp-offers-section">
              <h3 className="pdp-section-heading">Available Offers</h3>
              <div className="pdp-offers-list">
                <div className="pdp-offer-item">
                  <Award size={16} className="pdp-offer-icon" />
                  <span>Bank Offer: 10% instant discount on HDFC Bank Cards</span>
                </div>
                <div className="pdp-offer-item">
                  <Award size={16} className="pdp-offer-icon" />
                  <span>No Cost EMI on orders above ₹3000</span>
                </div>
                <div className="pdp-offer-item">
                  <Award size={16} className="pdp-offer-icon" />
                  <span>Get extra 5% off (price inclusive of cashback)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Size Selection */}
          <div className="pdp-variant-section">
            <div className="pdp-variant-header">
              <span className="pdp-variant-label">Select Size</span>
              <button className="pdp-size-guide">Size Guide</button>
            </div>
            <div className="pdp-size-grid">
              {product.sizes.map(size => (
                <button
                  key={size}
                  className={`pdp-size-option ${selectedSize === size ? 'active' : ''}`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Color Selection */}
          <div className="pdp-variant-section">
            <div className="pdp-variant-header">
              <span className="pdp-variant-label">Select Color</span>
              <span className="pdp-variant-value">{selectedColor}</span>
            </div>
            <div className="pdp-color-grid">
              {product.colors.map(color => (
                <button
                  key={color.name}
                  className={`pdp-color-option ${selectedColor === color.name ? 'active' : ''}`}
                  style={{ backgroundColor: color.hex }}
                  onClick={() => setSelectedColor(color.name)}
                  title={`${color.name} - ${color.stock} available`}
                >
                  {selectedColor === color.name && <Check size={16} className="pdp-color-check" />}
                </button>
              ))}
            </div>
            <div className="pdp-stock-status">
              <Package size={14} />
              <span>{getCurrentColorStock()} items in stock</span>
            </div>
          </div>

          {/* Quantity Selection */}
          <div className="pdp-variant-section">
            <div className="pdp-variant-header">
              <span className="pdp-variant-label">Quantity</span>
            </div>
            <div className="pdp-quantity-selector">
              <button 
                className="pdp-quantity-btn"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                <Minus size={16} />
              </button>
              <input 
                type="number" 
                className="pdp-quantity-input"
                value={quantity}
                onChange={(e) => {
                  const val = parseInt(e.target.value) || 1;
                  setQuantity(Math.min(Math.max(1, val), getCurrentColorStock()));
                }}
                min="1"
                max={getCurrentColorStock()}
              />
              <button 
                className="pdp-quantity-btn"
                onClick={() => setQuantity(Math.min(getCurrentColorStock(), quantity + 1))}
                disabled={quantity >= getCurrentColorStock()}
              >
                <Plus size={16} />
              </button>
            </div>
            {quantity >= getCurrentColorStock() && (
              <span className="pdp-quantity-warning">Maximum stock reached</span>
            )}
          </div>

          {/* Delivery Check */}
          <div className="pdp-delivery-check">
            <h3 className="pdp-section-heading">Delivery Options</h3>
            <div className="pdp-pincode-input">
              <MapPin size={18} />
              <input
                type="text"
                placeholder="Enter Delivery Pincode"
                value={pincode}
                onChange={(e) => setPincode(e.target.value.slice(0, 6))}
                maxLength="6"
              />
              <button onClick={checkDelivery}>Check</button>
            </div>
            {deliveryInfo && (
              <div className="pdp-delivery-result">
                {deliveryInfo.available ? (
                  <>
                    <Truck size={16} className="pdp-delivery-icon" />
                    <div>
                      <strong>Delivery by {deliveryInfo.date}</strong>
                      <span>{deliveryInfo.time}</span>
                    </div>
                  </>
                ) : (
                  <span className="pdp-delivery-unavailable">Please enter valid pincode</span>
                )}
              </div>
            )}
          </div>

          {/* Services */}
          <div className="pdp-services-grid">
            <div className="pdp-service-card">
              <Truck size={20} />
              <div>
                <strong>Free Delivery</strong>
                <span>On orders above ₹999</span>
              </div>
            </div>
            <div className="pdp-service-card">
              <RotateCcw size={20} />
              <div>
                <strong>7 Days Return</strong>
                <span>Easy return policy</span>
              </div>
            </div>
            <div className="pdp-service-card">
              <Shield size={20} />
              <div>
                <strong>Secure Payment</strong>
                <span>100% safe & secure</span>
              </div>
            </div>
            <div className="pdp-service-card">
              <Award size={20} />
              <div>
                <strong>Warranty</strong>
                <span>1 year brand warranty</span>
              </div>
            </div>
          </div>

          {/* Seller Info */}
          <div className="pdp-seller-info">
            <div className="pdp-seller-header">
              <span className="pdp-seller-label">Sold by</span>
              <span className="pdp-seller-name">{shopInfo.name}</span>
            </div>
            <div className="pdp-seller-rating">
              <span className="pdp-seller-rating-badge">{shopInfo.rating} ★</span>
              <span className="pdp-seller-reviews">{shopInfo.reviews} ratings</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Action Buttons */}
      <div className="pdp-mobile-actions">
        <button className="pdp-mobile-cart-btn" onClick={handleAddToCart}>
          <ShoppingCart size={20} />
          ADD TO CART
        </button>
        <button className="pdp-mobile-buy-btn" onClick={handleBuyNow}>
          <Zap size={20} />
          BUY NOW
        </button>
      </div>

      {/* Product Details Tabs */}
      <div className="pdp-details-section">
        <div className="pdp-tabs">
          <button
            className={`pdp-tab ${activeTab === 'description' ? 'active' : ''}`}
            onClick={() => setActiveTab('description')}
          >
            Description
          </button>
          <button
            className={`pdp-tab ${activeTab === 'specifications' ? 'active' : ''}`}
            onClick={() => setActiveTab('specifications')}
          >
            Specifications
          </button>
          <button
            className={`pdp-tab ${activeTab === 'reviews' ? 'active' : ''}`}
            onClick={() => setActiveTab('reviews')}
          >
            Reviews ({product.reviewsCount})
          </button>
        </div>

        <div className="pdp-tab-content">
          {activeTab === 'description' && (
            <div className="pdp-description-content">
              <h3>Product Description</h3>
              <p>{product.description}</p>
              <h4>Key Features</h4>
              <ul className="pdp-features-list">
                {product.features.map((feature, idx) => (
                  <li key={idx}>
                    <Check size={16} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {activeTab === 'specifications' && (
            <div className="pdp-specifications-content">
              <h3>Product Specifications</h3>
              <table className="pdp-specs-table">
                <tbody>
                  {product.specifications.map((spec, idx) => (
                    <tr key={idx}>
                      <td className="pdp-spec-label">{spec.label}</td>
                      <td className="pdp-spec-value">{spec.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="pdp-reviews-content">
              <div className="pdp-reviews-summary">
                <div className="pdp-reviews-score">
                  <div className="pdp-reviews-rating">{product.rating}</div>
                  <div className="pdp-reviews-stars">
                    {[1,2,3,4,5].map(star => (
                      <Star key={star} size={16} fill={star <= Math.floor(product.rating) ? '#FFB800' : 'none'} color="#FFB800" />
                    ))}
                  </div>
                  <div className="pdp-reviews-count">{product.reviewsCount.toLocaleString()} ratings</div>
                </div>
              </div>

              <div className="pdp-write-review">
                <h4>Write a Review</h4>
                <input
                  type="text"
                  placeholder="Your name"
                  value={feedback.name}
                  onChange={(e) => setFeedback({...feedback, name: e.target.value})}
                  className="pdp-review-input"
                />
                <div className="pdp-review-rating">
                  <span>Your Rating:</span>
                  <div className="pdp-rating-stars">
                    {[1,2,3,4,5].map(star => (
                      <Star
                        key={star}
                        size={24}
                        fill={star <= feedback.rating ? "#FFB800" : "none"}
                        color="#FFB800"
                        className="pdp-star-clickable"
                        onClick={() => setFeedback({...feedback, rating: star})}
                      />
                    ))}
                  </div>
                </div>
                <textarea
                  placeholder="Share your experience..."
                  value={feedback.comment}
                  onChange={(e) => setFeedback({...feedback, comment: e.target.value})}
                  className="pdp-review-textarea"
                  rows="4"
                />
                <button className="pdp-review-submit" onClick={handleSubmitFeedback}>
                  <Send size={16} />
                  Submit Review
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Similar Products - Horizontal Scroll */}
      {relatedProducts.length > 0 && (
        <div className="pdp-similar-section">
          <div className="pdp-similar-header">
            <h2>Similar Products</h2>
            <button className="pdp-view-all" onClick={() => navigate(`/category/${product.category}`)}>
              View All <ChevronRight size={16} />
            </button>
          </div>
          <div className="pdp-similar-scroll">
            {relatedProducts.map((item) => (
              <div
                key={item.id}
                className="pdp-similar-card"
                onClick={() => navigate(`/product/${item.id}`)}
              >
                <div className="pdp-similar-image">
                  <img src={item.image} alt={item.title} />
                  {item.discount > 0 && (
                    <span className="pdp-similar-discount">{item.discount}% OFF</span>
                  )}
                </div>
                <div className="pdp-similar-info">
                  <h4>{item.title}</h4>
                  <div className="pdp-similar-price">
                    <span className="pdp-similar-current">₹{item.price.toLocaleString()}</span>
                    <span className="pdp-similar-original">₹{item.originalPrice.toLocaleString()}</span>
                  </div>
                  <div className="pdp-similar-rating">
                    <span>{item.rating}</span>
                    <Star size={12} fill="#FFB800" color="#FFB800" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Category Products - Full Grid */}
      {allCategoryProducts.length > 0 && (
        <div className="pdp-all-category-section">
          <div className="pdp-all-category-header">
            <div>
              <h2>All Products in {product.category}</h2>
              <p className="pdp-all-category-subtitle">
                Explore our complete collection of {allCategoryProducts.length} products
              </p>
            </div>
          </div>

          {categoryLoading ? (
            <div className="pdp-category-loading">
              <div className="pdp-spinner"></div>
              <p>Loading more products...</p>
            </div>
          ) : (
            <div className="pdp-all-category-grid">
              {allCategoryProducts.map((item) => (
                <div
                  key={item.id}
                  className="pdp-all-category-card"
                  onClick={() => {
                    navigate(`/product/${item.id}`);
                    window.scrollTo(0, 0);
                  }}
                >
                  <div className="pdp-all-category-image">
                    <img src={item.image} alt={item.title} loading="lazy" />
                    {item.discount > 0 && (
                      <span className="pdp-all-category-discount">{item.discount}% OFF</span>
                    )}
                    <button 
                      className="pdp-all-category-wishlist"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsWishlisted(!isWishlisted);
                      }}
                    >
                      <Heart size={18} />
                    </button>
                  </div>
                  
                  <div className="pdp-all-category-info">
                    <div className="pdp-all-category-brand">{item.brand}</div>
                    <h4 className="pdp-all-category-title">{item.title}</h4>
                    
                    <div className="pdp-all-category-rating">
                      <div className="pdp-all-category-rating-badge">
                        <span>{item.rating}</span>
                        <Star size={12} fill="#FFB800" color="#FFB800" />
                      </div>
                      <span className="pdp-all-category-reviews">
                        ({item.reviewsCount?.toLocaleString() || 0})
                      </span>
                    </div>
                    
                    <div className="pdp-all-category-price">
                      <span className="pdp-all-category-current">₹{item.price.toLocaleString()}</span>
                      <span className="pdp-all-category-original">₹{item.originalPrice.toLocaleString()}</span>
                    </div>
                    
                    <div className="pdp-all-category-save">
                      Save ₹{(item.originalPrice - item.price).toLocaleString()}
                    </div>
                    
                    <button 
                      className="pdp-all-category-add-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart({
                          id: item.id,
                          title: item.title,
                          price: item.price,
                          image: item.image,
                          selectedSize: 'M',
                          selectedColor: 'Black',
                          quantity: 1
                        });
                        setShowSuccess(`${item.title} added to cart!`);
                        setTimeout(() => setShowSuccess(''), 2000);
                      }}
                    >
                      <ShoppingCart size={16} />
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div className="pdp-all-category-footer">
            <button 
              className="pdp-view-all-category-btn"
              onClick={() => navigate(`/category/${product.category}`)}
            >
              View All {product.category} Products
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}