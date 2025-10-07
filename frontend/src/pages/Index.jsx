import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, ChevronRight, Truck, Award, Shield, TrendingUp } from 'lucide-react';
import './styles.css';

const API_BASE_URL = "https://boltfit-backend-r4no.onrender.com/api/v1";

export default function HomePage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState([]);

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
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        // Fallback to mock data if API fails
        const mockProducts = generateMockProducts();
        setProducts(mockProducts);
        setBestSellers(mockProducts.slice(0, 8));
        setTrendingProducts(mockProducts.slice(8, 16));
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

  // Categories data
  const categories = [
    { 
      name: 'Shirts', 
      slug: 'shirts',
      img: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=300&h=200&fit=crop&auto=format&q=80',
      description: 'Premium formal & casual shirts'
    },
    { 
      name: 'Pants', 
      slug: 'pants',
      img: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=300&h=200&fit=crop&auto=format&q=80',
      description: 'Comfortable & stylish bottoms'
    },
    { 
      name: 'T-Shirts', 
      slug: 't-shirts',
      img: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=200&fit=crop&auto=format&q=80',
      description: 'Casual everyday essentials'
    },
    { 
      name: 'Trending', 
      slug: 'trending',
      img: 'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=300&h=200&fit=crop&auto=format&q=80',
      description: 'Latest fashion trends'
    }
  ];

  // Toggle wishlist
  const toggleWishlist = (productId) => {
    setWishlist(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  // Navigate to category
  const handleCategoryClick = (slug) => {
    navigate(`/category/${slug}`);
  };

  // Navigate to product details
  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  // Product Card Component
  const ProductCard = ({ product }) => (
    <div className="product-card" onClick={() => handleProductClick(product.id)}>
      {!product.inStock && <div className="out-of-stock-label">Out of Stock</div>}
      {product.discount > 0 && (
        <div className="discount-badge">-{product.discount}%</div>
      )}
      {product.isTrending && (
        <div className="trending-badge">
          <TrendingUp size={12} /> HOT
        </div>
      )}
      
      <button 
        className={`wishlist-btn ${wishlist.includes(product.id) ? 'active' : ''}`}
        onClick={(e) => {
          e.stopPropagation();
          toggleWishlist(product.id);
        }}
      >
        <Heart size={18} fill={wishlist.includes(product.id) ? 'currentColor' : 'none'} />
      </button>

      <div className="product-image-container">
        <img src={product.images[0]} alt={product.name} className="product-image" />
      </div>

      <div className="product-content">
        <div className="product-brand">{product.brand}</div>
        <h3 className="product-title">{product.name}</h3>
        
        <div className="product-rating">
          <div className="stars">
            {'★'.repeat(Math.floor(parseFloat(product.rating)))}
            {'☆'.repeat(5 - Math.floor(parseFloat(product.rating)))}
          </div>
          <span className="rating-text">({product.rating})</span>
        </div>

        <div className="product-price">
          <span className="current-price">₹{product.price.toLocaleString()}</span>
          {product.originalPrice > product.price && (
            <span className="original-price">₹{product.originalPrice.toLocaleString()}</span>
          )}
        </div>

        <button className="add-to-cart-btn" onClick={(e) => e.stopPropagation()}>
          Add to Cart
        </button>
      </div>
    </div>
  );

  // Product Grid Section Component
  const ProductGridSection = ({ title, subtitle, products, showViewAll = false }) => (
    <section className="product-section">
      <div className="section-header">
        <div>
          <h2 className="section-title">{title}</h2>
          {subtitle && <p className="section-subtitle">{subtitle}</p>}
        </div>
        {showViewAll && (
          <button className="view-all-btn" onClick={() => navigate('/products')}>
            View All <ChevronRight size={20} />
          </button>
        )}
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading products...</p>
        </div>
      ) : (
        <div className="product-grid">
          {products.slice(0, 8).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );

  return (
    <div className="homepage">
      {/* Hero Banner */}
      <section className="hero-section">
        <div className="hero-overlay">
          <div className="hero-content">
            <h1 className="hero-title">
              <span className="hero-brand">BOLDFIT</span>
              <span className="hero-tagline">Where Style Meets Performance</span>
            </h1>
            <p className="hero-description">
              Premium activewear designed for the bold and unstoppable
            </p>
            <button className="hero-cta" onClick={() => navigate('/products')}>
              Shop Collection <ChevronRight size={20} />
            </button>
          </div>
        </div>
        <img 
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1800&h=600&fit=crop&auto=format&q=80" 
          alt="BoldFit Hero" 
          className="hero-image"
        />
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <div className="section-header-center">
          <h2 className="section-title">Explore Collections</h2>
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
                <img src={category.img} alt={category.name} className="category-image" />
                <div className="category-overlay">
                  <span className="category-cta">Shop Now</span>
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

      {/* Style Essentials Section */}
      <ProductGridSection 
        title="Style Essentials"
        subtitle="Refresh your wardrobe with trendy essentials"
        products={products}
        showViewAll={true}
      />

      {/* Video Section */}
      <section className="video-section">
        <div className="video-container">
          <video 
            className="promo-video"
            autoPlay 
            muted 
            loop 
            playsInline
          >
            <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
          </video>
          <div className="video-overlay">
            <h2>Experience BoldFit</h2>
            <p>Where fitness meets fashion</p>
          </div>
        </div>
      </section>

      {/* Best Sellers Section */}
      <ProductGridSection 
        title="Best Sellers"
        subtitle="Wardrobe must-have essentials"
        products={bestSellers}
        showViewAll={true}
      />

      {/* Trending Section */}
      <ProductGridSection 
        title="Trending Now"
        subtitle="What's hot this season"
        products={trendingProducts}
        showViewAll={true}
      />

      {/* Features Bar */}
      <section className="features-section">
        <div className="features-grid">
          <div className="feature-item">
            <div className="feature-icon">
              <Truck size={32} />
            </div>
            <h3 className="feature-title">Free Shipping</h3>
            <p className="feature-description">On orders above ₹999</p>
          </div>
          
          <div className="feature-item">
            <div className="feature-icon">
              <Shield size={32} />
            </div>
            <h3 className="feature-title">Secure Payment</h3>
            <p className="feature-description">100% secure transactions</p>
          </div>
          
          <div className="feature-item">
            <div className="feature-icon">
              <Award size={32} />
            </div>
            <h3 className="feature-title">Premium Quality</h3>
            <p className="feature-description">Certified products</p>
          </div>
          
          <div className="feature-item">
            <div className="feature-icon">
              <TrendingUp size={32} />
            </div>
            <h3 className="feature-title">100k+</h3>
            <p className="feature-description">Happy customers</p>
          </div>
        </div>
      </section>

      {/* Special Offer Section */}
      <section className="offer-section">
        <div className="offer-container">
          <div className="offer-badge">Limited Time Offer</div>
          <h2 className="offer-title">Buy 2 Get 1 Free!</h2>
          <p className="offer-description">
            Shop any 2 products and get the 3rd absolutely free. Use code: <strong>BOLD3FREE</strong>
          </p>
          <button className="offer-cta" onClick={() => navigate('/products')}>
            Shop Now <ChevronRight size={20} />
          </button>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-number">300K+</div>
            <div className="stat-label">Social Media Followers</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">8+</div>
            <div className="stat-label">Years in Industry</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">100K+</div>
            <div className="stat-label">Products Sold</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">4.8★</div>
            <div className="stat-label">Average Rating</div>
          </div>
        </div>
      </section>
    </div>
  );
}