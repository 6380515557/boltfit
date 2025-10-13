import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Heart, 
  ChevronRight, 
  Truck, 
  Award, 
  Shield, 
  TrendingUp, 
  Star,
  ShoppingBag,
  Clock,
  Tag,
  X,
  Zap
} from 'lucide-react';
import './styles.css';

const API_BASE_URL = "https://boltfit-backend-r4no.onrender.com/api/v1";

export default function HomePage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [flashDeals, setFlashDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState([]);
  const [showCookieConsent, setShowCookieConsent] = useState(false);

  // Cookie consent management
  useEffect(() => {
    const cookieConsent = localStorage.getItem('cookieConsent');
    if (!cookieConsent) {
      // Show cookie banner after 1 second delay for better UX
      setTimeout(() => {
        setShowCookieConsent(true);
      }, 1000);
    } else {
      // Load wishlist from cookies if consent given
      const savedWishlist = localStorage.getItem('wishlist');
      if (savedWishlist) {
        setWishlist(JSON.parse(savedWishlist));
      }
    }
  }, []);

  // Handle cookie consent
  const handleAcceptCookies = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    localStorage.setItem('cookieConsentDate', new Date().toISOString());
    setShowCookieConsent(false);
  };

  const handleDeclineCookies = () => {
    localStorage.setItem('cookieConsent', 'declined');
    setShowCookieConsent(false);
  };

  // Fetch products from API
  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        setLoading(true);
        
        // Fetch all products
        const allProductsResponse = await fetch(
          `${API_BASE_URL}/products/?is_active=true&per_page=50`
        );
        
        if (allProductsResponse.ok) {
          const allData = await allProductsResponse.json();
          const transformedProducts = transformProducts(allData.products);
          
          setProducts(transformedProducts);
          
          // Filter best sellers (featured products)
          const featured = transformedProducts.filter(p => p.isFeatured);
          setBestSellers(featured.length > 0 ? featured : transformedProducts.slice(0, 8));
          
          // Filter trending products
          const trending = transformedProducts.filter(p => p.isTrending);
          setTrendingProducts(trending.length > 0 ? trending : transformedProducts.slice(0, 8));
          
          // Set flash deals (products with highest discount)
          const sortedByDiscount = [...transformedProducts].sort((a, b) => b.discount - a.discount);
          setFlashDeals(sortedByDiscount.slice(0, 10));
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        // Fallback to mock data if API fails
        const mockProducts = generateMockProducts();
        setProducts(mockProducts);
        setBestSellers(mockProducts.slice(0, 8));
        setTrendingProducts(mockProducts.slice(8, 16));
        setFlashDeals(mockProducts.slice(0, 10));
      } finally {
        setLoading(false);
      }
    };

    fetchAllProducts();
  }, []);

  // Transform API products to app format
  const transformProducts = (apiProducts) => {
    return apiProducts.map((product, index) => ({
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.original_price || (product.price + Math.floor(Math.random() * 500) + 200),
      images: product.images && product.images.length > 0 
        ? product.images 
        : [`https://images.unsplash.com/photo-${1520000000000 + index}?w=400&h=400&fit=crop&auto=format&q=80`],
      rating: (Math.random() * 1.5 + 3.5).toFixed(1),
      reviewsCount: Math.floor(Math.random() * 500) + 25,
      isFeatured: product.is_featured || Math.random() > 0.7,
      isTrending: Math.random() > 0.6,
      discount: product.original_price 
        ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
        : Math.floor(Math.random() * 40) + 15,
      inStock: Math.random() > 0.1,
      brand: product.brand || 'BOLDFIT',
      category: product.category || 'Shirts'
    }));
  };

  // Generate mock products as fallback
  const generateMockProducts = () => {
    const categories = ['Shirts', 'Pants', 'T-Shirts', 'Jackets'];
    const names = ['Premium', 'Classic', 'Modern', 'Luxury', 'Sport', 'Elite', 'Pro', 'Essential'];
    
    return Array.from({ length: 24 }, (_, i) => ({
      id: `product-${i + 1}`,
      name: `${names[i % names.length]} ${categories[i % categories.length]} ${i + 1}`,
      price: Math.floor(Math.random() * 2000) + 599,
      originalPrice: Math.floor(Math.random() * 2500) + 1200,
      images: [`https://images.unsplash.com/photo-${1520000000000 + i}?w=400&h=400&fit=crop&auto=format&q=80`],
      rating: (Math.random() * 1.5 + 3.5).toFixed(1),
      reviewsCount: Math.floor(Math.random() * 500) + 25,
      isFeatured: Math.random() > 0.6,
      isTrending: Math.random() > 0.5,
      discount: Math.floor(Math.random() * 40) + 15,
      inStock: Math.random() > 0.1,
      brand: 'BOLDFIT',
      category: categories[i % categories.length]
    }));
  };

  // Categories data with enhanced styling
  const categories = [
    {
      name: 'Shirts',
      slug: 'shirts',
      img: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=300&h=200&fit=crop&auto=format&q=80',
      description: 'Premium formal & casual shirts',
      tag: 'Top Rated'
    },
    {
      name: 'Pants',
      slug: 'pants',
      img: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=300&h=200&fit=crop&auto=format&q=80',
      description: 'Comfortable & stylish bottoms',
      tag: 'Bestseller'
    },
    {
      name: 'T-Shirts',
      slug: 't-shirts',
      img: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=200&fit=crop&auto=format&q=80',
      description: 'Casual everyday essentials',
      tag: 'New Arrival'
    },
    {
      name: 'Trending',
      slug: 'trending',
      img: 'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=300&h=200&fit=crop&auto=format&q=80',
      description: 'Latest fashion trends',
      tag: 'Hot Deal'
    }
  ];

  // Toggle wishlist and save to localStorage
  const toggleWishlist = (productId) => {
    const newWishlist = wishlist.includes(productId)
      ? wishlist.filter(id => id !== productId)
      : [...wishlist, productId];
    
    setWishlist(newWishlist);
    
    // Save to localStorage if consent given
    const cookieConsent = localStorage.getItem('cookieConsent');
    if (cookieConsent === 'accepted') {
      localStorage.setItem('wishlist', JSON.stringify(newWishlist));
    }
  };

  // Navigate to category
  const handleCategoryClick = (slug) => {
    navigate(`/category/${slug}`);
  };

  // Navigate to product details
  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  // Navigate to trending category
  const handleShopNowClick = () => {
    navigate('/category/trending');
  };

  // Product Card Component with enhanced design
  const ProductCard = ({ product }) => (
    <div className="product-card" onClick={() => handleProductClick(product.id)}>
      {!product.inStock && (
        <div className="out-of-stock-label">Out of Stock</div>
      )}
      
      {product.discount > 0 && product.inStock && (
        <div className="discount-badge">{product.discount}% OFF</div>
      )}
      
      {product.isTrending && (
        <div className="trending-badge">
          <TrendingUp size={12} />
          <span>Trending</span>
        </div>
      )}
      
      <button
        className={`wishlist-btn ${wishlist.includes(product.id) ? 'active' : ''}`}
        onClick={(e) => {
          e.stopPropagation();
          toggleWishlist(product.id);
        }}
        aria-label="Add to wishlist"
      >
        <Heart size={18} fill={wishlist.includes(product.id) ? 'currentColor' : 'none'} />
      </button>
      
      <div className="product-image-container">
        <img 
          src={product.images[0]} 
          alt={product.name}
          className="product-image"
          loading="lazy"
        />
        {product.inStock && (
          <div className="quick-view-overlay">
            <ShoppingBag size={20} />
            <span>Quick View</span>
          </div>
        )}
      </div>
      
      <div className="product-content">
        <h3 className="product-title">{product.name}</h3>
       
        
        <div className="product-price">
          <span className="current-price">₹{product.price.toLocaleString()}</span>
          <span className="original-price">₹{product.originalPrice.toLocaleString()}</span>
          <span className="save-badge">Save ₹{(product.originalPrice - product.price).toLocaleString()}</span>
        </div>
        
        {product.inStock && (
          <>
            <button className="add-to-cart-btn">
              <ShoppingBag size={16} />
              Add to Cart
            </button>
          </>
        )}
      </div>
    </div>
  );

  // Mobile Flash Deal Card Component
  const MobileFlashDealCard = ({ product }) => (
    <div className="mobile-flash-card" onClick={() => handleProductClick(product.id)}>
      <div className="mobile-flash-image-wrapper">
        <img 
          src={product.images[0]} 
          alt={product.name}
          className="mobile-flash-image"
          loading="lazy"
        />
        <div className="mobile-flash-discount">
          <Zap size={12} />
          {product.discount}%
        </div>
        <button
          className={`mobile-flash-wishlist ${wishlist.includes(product.id) ? 'active' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          aria-label="Add to wishlist"
        >
          <Heart size={12} fill={wishlist.includes(product.id) ? 'currentColor' : 'none'} />
        </button>
      </div>
      <div className="mobile-flash-content">
        <h4 className="mobile-flash-title">{product.name}</h4>
        <div className="mobile-flash-price">
          <span className="mobile-flash-current">₹{product.price.toLocaleString()}</span>
          <span className="mobile-flash-original">₹{product.originalPrice.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );

  // Section Header Component
  const SectionHeader = ({ title, subtitle, showViewAll, onViewAll }) => (
    <div className="section-header">
      <div className="section-header-content">
        <h2 className="section-title">{title}</h2>
        {subtitle && <p className="section-subtitle">{subtitle}</p>}
      </div>
      {showViewAll && (
        <button className="view-all-btn" onClick={onViewAll}>
          View All
          <ChevronRight size={20} />
        </button>
      )}
    </div>
  );

  return (
    <div className="homepage">
      {/* Hero Section */}
      <section className="hero-section">
        <video 
          className="hero-image"
          src="https://res.cloudinary.com/boldfit/video/upload/v1234567890/hero-video.mp4"
          autoPlay
          loop
          muted
          playsInline
          poster="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&h=1080&fit=crop&auto=format&q=80"
        >
          <img 
            src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&h=1080&fit=crop&auto=format&q=80"
            alt="Hero"
            className="hero-image"
          />
        </video>
        <div className="hero-overlay">
          <div className="hero-content">
            <div className="hero-title">
              <h1 className="hero-brand">BOLDFIT</h1>
              <p className="hero-tagline">Unleash Your Potential</p>
            </div>
            <p className="hero-description">
              Premium activewear designed for the bold and unstoppable
            </p>
            <button className="hero-cta" onClick={handleShopNowClick}>
              Shop Now
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      </section>

      {/* Features Banner */}
      <section className="features-banner">
        <div className="features-banner-grid">
          <div className="feature-banner-item">
            <Truck size={24} />
            <div>
              <div className="feature-banner-title">Free Delivery</div>
              <div className="feature-banner-text">On orders above ₹999</div>
            </div>
          </div>
          <div className="feature-banner-item">
            <Shield size={24} />
            <div>
              <div className="feature-banner-title">Secure Payment</div>
              <div className="feature-banner-text">100% protected</div>
            </div>
          </div>
          <div className="feature-banner-item">
            <Award size={24} />
            <div>
              <div className="feature-banner-title">Quality Certified</div>
              <div className="feature-banner-text">Premium products</div>
            </div>
          </div>
          <div className="feature-banner-item">
            <Clock size={24} />
            <div>
              <div className="feature-banner-title">24/7 Support</div>
              <div className="feature-banner-text">Always here to help</div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <div className="section-header-center">
          <h2 className="section-title">Shop by Category</h2>
          <p className="section-subtitle">Discover our curated range of premium products</p>
        </div>
        
        <div className="categories-grid">
          {categories.map((category) => (
            <div
              key={category.slug}
              className="category-card"
              onClick={() => handleCategoryClick(category.slug)}
            >
              <div className="category-image-container">
                <img 
                  src={category.img} 
                  alt={category.name}
                  className="category-image"
                  loading="lazy"
                />
                <div className="category-tag">{category.tag}</div>
                <div className="category-overlay">
                  <button className="category-cta">Explore Now</button>
                </div>
              </div>
              <div className="category-content">
                <h3 className="category-name">{category.name}</h3>
                <p className="category-description">{category.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Best Sellers Section */}
      <section className="product-section best-sellers-section">
        <SectionHeader 
          title="Best Sellers"
          subtitle="Most loved by our customers"
          showViewAll={true}
          onViewAll={() => handleCategoryClick('shirts')}
        />
        
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading products...</p>
          </div>
        ) : (
          <div className="product-grid">
            {bestSellers.slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Mobile-Only Flash Deals Section */}
      <section className="mobile-flash-deals-section">
        <div className="mobile-flash-header">
          <div className="mobile-flash-title-wrapper">
            <Zap size={24} className="mobile-flash-icon" />
            <div>
              <h2 className="mobile-flash-section-title">Flash Deals</h2>
              <p className="mobile-flash-section-subtitle">Limited time offers</p>
            </div>
          </div>
          <button className="mobile-flash-view-all" onClick={() => handleCategoryClick('trending')}>
            View All
          </button>
        </div>
        
        <div className="mobile-flash-scroll-container">
          {flashDeals.map((product) => (
            <MobileFlashDealCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Offer Section */}
      <section className="offer-section">
        <div className="offer-container">
          <div className="offer-badge">LIMITED TIME OFFER</div>
          <h2 className="offer-title">Buy 2, Get 1 FREE!</h2>
          <p className="offer-description">
            Shop any 2 products and get the 3rd absolutely free. Use code:
            <strong> BOLD3FREE</strong>
          </p>
          <button className="offer-cta" onClick={handleShopNowClick}>
            <Tag size={20} />
            Shop Now
          </button>
        </div>
      </section>

      {/* Trending Products Section */}
      <section className="product-section trending-section">
        <SectionHeader 
          title="Trending Now"
          subtitle="What's hot this season"
          showViewAll={true}
          onViewAll={() => handleCategoryClick('trending')}
        />
        
        <div className="product-grid">
          {trendingProducts.slice(0, 8).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Video Section */}
      <section className="video-section">
        <div className="video-container">
          <video 
            className="promo-video"
            src="https://res.cloudinary.com/boldfit/video/upload/v1234567890/promo-video.mp4"
            autoPlay
            loop
            muted
            playsInline
            poster="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1920&h=1080&fit=crop&auto=format&q=80"
          >
            <img 
              src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1920&h=1080&fit=crop&auto=format&q=80"
              alt="Promo"
              className="promo-video"
            />
          </video>
          <div className="video-overlay">
            <h2>Where fitness meets fashion</h2>
            <p>Engineered for performance, designed for style</p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-number">100+</div>
            <div className="stat-label">Products Sold</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">500+</div>
            <div className="stat-label">Happy Customers</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">4.8★</div>
            <div className="stat-label">Average Rating</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">100%</div>
            <div className="stat-label">Satisfaction</div>
          </div>
        </div>
      </section>

      {/* Cookie Consent Banner */}
      {showCookieConsent && (
        <div className="cookie-consent-banner">
          <div className="cookie-content">
            <div className="cookie-icon">🍪</div>
            <div className="cookie-text">
              <h3>We value your privacy</h3>
              <p>
                We use cookies to enhance your browsing experience, serve personalized 
                content, and analyze our traffic. By clicking "Accept All", you consent 
                to our use of cookies.
              </p>
            </div>
          </div>
          <div className="cookie-actions">
            <button className="cookie-btn cookie-btn-secondary" onClick={handleDeclineCookies}>
              Decline
            </button>
            <button className="cookie-btn cookie-btn-primary" onClick={handleAcceptCookies}>
              Accept All
            </button>
          </div>
        </div>
      )}
    </div>
  );
}