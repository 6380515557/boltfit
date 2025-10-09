import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Filter, Grid, List, ChevronDown, Search, ArrowLeft, 
  Star, Heart, ShoppingBag, X, TrendingUp, 
  Award, Truck, Shield, Zap, Check 
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import './CategoryPage.css';

const API_BASE_URL = "https://boltfit-backend-r4no.onrender.com/api/v1";

export default function CategoryPage() {
  const { name } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('featured');
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [addedToCart, setAddedToCart] = useState({});
  const [showSuccess, setShowSuccess] = useState('');
  const [filters, setFilters] = useState({
    priceRange: [0, 5000],
    sizes: [],
    colors: [],
    rating: 0
  });
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch products
  useEffect(() => {
    setLoading(true);
    const fetchProducts = async () => {
      try {
        const categoryMap = {
          'shirts': 'Shirts',
          'pants': 'Pants',
          'trending': 'Trending',
          't-shirts': 'T-Shirts'
        };
        
        const categoryName = categoryMap[name.toLowerCase()] || 
          name.charAt(0).toUpperCase() + name.slice(1);
        
        const response = await fetch(
          `${API_BASE_URL}/products/?category=${encodeURIComponent(categoryName)}&is_active=true&per_page=50`
        );
        
        if (response.ok) {
          const data = await response.json();
          const transformedProducts = data.products.map((product, i) => ({
            id: product.id,
            title: product.name,
            price: product.price,
            originalPrice: product.original_price || (product.price + Math.floor(Math.random() * 500) + 200),
            images: product.images && product.images.length > 0 
              ? product.images 
              : [`https://images.unsplash.com/photo-${1520000000000 + i}?w=400&h=400&fit=crop&auto=format&q=80`],
            rating: (Math.random() * 1.5 + 3.5).toFixed(1),
            reviewsCount: Math.floor(Math.random() * 500) + 25,
            isTrending: product.is_featured || Math.random() > 0.6,
            discount: product.original_price 
              ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
              : Math.floor(Math.random() * 40) + 15,
            sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
            colors: ['Black', 'White', 'Navy', 'Gray', 'Blue'],
            category: name,
            inStock: true, // Always show as in stock
            brand: product.brand || 'BOLT FIT'
          }));
          
          setProducts(transformedProducts);
          setFilteredProducts(transformedProducts);
        } else {
          throw new Error('API failed');
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        
        // Fallback mock data
        const mockProducts = Array.from({ length: 16 }, (_, i) => ({
          id: `${name}-${i + 1}`,
          title: `${name.charAt(0).toUpperCase() + name.slice(1)} Premium ${['Classic', 'Modern', 'Luxury', 'Sport'][i % 4]} ${i + 1}`,
          price: Math.floor(Math.random() * 2500) + 599,
          originalPrice: Math.floor(Math.random() * 3500) + 1200,
          images: [`https://images.unsplash.com/photo-${1520000000000 + i}?w=400&h=400&fit=crop&auto=format&q=80`],
          rating: (Math.random() * 1.5 + 3.5).toFixed(1),
          reviewsCount: Math.floor(Math.random() * 500) + 25,
          isTrending: Math.random() > 0.6,
          discount: Math.floor(Math.random() * 40) + 15,
          sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
          colors: ['Black', 'White', 'Navy', 'Gray', 'Blue'],
          category: name,
          inStock: true, // Always show as in stock
          brand: 'BOLT FIT'
        }));
        
        setProducts(mockProducts);
        setFilteredProducts(mockProducts);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, [name]);

  // Filter and sort products
  useEffect(() => {
    let filtered = [...products];
    
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    filtered = filtered.filter(product =>
      product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1]
    );
    
    if (filters.sizes.length > 0) {
      filtered = filtered.filter(product =>
        product.sizes.some(size => filters.sizes.includes(size))
      );
    }
    
    if (filters.colors.length > 0) {
      filtered = filtered.filter(product =>
        product.colors.some(color => filters.colors.includes(color))
      );
    }
    
    if (filters.rating > 0) {
      filtered = filtered.filter(product => parseFloat(product.rating) >= filters.rating);
    }
    
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
        break;
      case 'newest':
        filtered.reverse();
        break;
      default:
        break;
    }
    
    setFilteredProducts(filtered);
  }, [products, searchQuery, filters, sortBy]);

  // Handle Add to Cart
  const handleAddToCart = (product, e) => {
    e.stopPropagation();
    
    // Add to cart with default selections
    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.images[0],
      selectedSize: 'M', // Default size
      selectedColor: product.colors[0], // Default color
      quantity: 1
    });
    
    // Show success feedback
    setAddedToCart(prev => ({ ...prev, [product.id]: true }));
    setShowSuccess(`${product.title} added to cart!`);
    
    // Reset feedback after 2 seconds
    setTimeout(() => {
      setAddedToCart(prev => ({ ...prev, [product.id]: false }));
      setShowSuccess('');
    }, 2000);
  };

  const sortOptions = [
    { value: 'featured', label: 'Featured' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Customer Rating' },
    { value: 'newest', label: 'Newest First' }
  ];

  // Product Card Component
 // Product Card Component - SIMPLIFIED
 const ProductCard = ({ product }) => (
  <div className="product-card" onClick={() => navigate(`/product/${product.id}`)}>
    <div className="product-image-wrapper">
      <img 
        src={product.images[0]} 
        alt={product.title} 
        className="product-image"
        loading="lazy"
      />
      
      {product.discount > 0 && (
        <div className="discount-badge">-{product.discount}%</div>
      )}
      
      <button 
        className="wishlist-btn"
        onClick={(e) => {
          e.stopPropagation();
          console.log('Added to wishlist:', product.id);
        }}
      >
        <Heart className="icon-sm" />
      </button>
    </div>
    
    <div className="product-content">
      <h3 className="product-title">{product.title}</h3>
      
      <div className="product-price">
          <span className="current-price">₹{product.price.toLocaleString()}</span>
          <span className="original-price">₹{product.originalPrice.toLocaleString()}</span>
          <span className="save-badge">Save ₹{(product.originalPrice - product.price).toLocaleString()}</span>
      </div>
      
      <button 
        className={`add-to-cart-btn ${addedToCart[product.id] ? 'added' : ''}`}
        onClick={(e) => handleAddToCart(product, e)}
      >
        {addedToCart[product.id] ? (
          <>
            <Check className="icon-sm" />
            Added
          </>
        ) : (
          <>
            <ShoppingBag className="icon-sm" />
            Add to Cart
          </>
        )}
      </button>
    </div>
  </div>
);


  // Filter Modal Component
  const FilterModal = () => (
    <>
      {showFilters && (
        <div className="filter-overlay" onClick={() => setShowFilters(false)}>
          <div className="filter-modal" onClick={(e) => e.stopPropagation()}>
            <div className="filter-header">
              <h3>Filters</h3>
              <button className="close-btn" onClick={() => setShowFilters(false)}>
                <X className="icon-md" />
              </button>
            </div>
            
            <div className="filter-content">
              <div className="filter-group">
                <h4>Price Range</h4>
                <div className="price-range-inputs">
                  <input 
                    type="number" 
                    className="price-input"
                    placeholder="Min"
                    value={filters.priceRange[0]}
                    onChange={(e) => setFilters({
                      ...filters, 
                      priceRange: [parseInt(e.target.value) || 0, filters.priceRange[1]]
                    })}
                  />
                  <span>to</span>
                  <input 
                    type="number" 
                    className="price-input"
                    placeholder="Max"
                    value={filters.priceRange[1]}
                    onChange={(e) => setFilters({
                      ...filters, 
                      priceRange: [filters.priceRange[0], parseInt(e.target.value) || 5000]
                    })}
                  />
                </div>
              </div>
              
              <div className="filter-group">
                <h4>Minimum Rating</h4>
                <select
                  className="filter-select"
                  value={filters.rating}
                  onChange={(e) => setFilters({...filters, rating: parseFloat(e.target.value)})}
                >
                  <option value="0">All Ratings</option>
                  <option value="4">4★ & above</option>
                  <option value="3">3★ & above</option>
                  <option value="2">2★ & above</option>
                </select>
              </div>
              
              <button 
                className="apply-filters-btn"
                onClick={() => setShowFilters(false)}
              >
                Apply Filters
              </button>
              
              <button 
                className="clear-filters-btn"
                onClick={() => {
                  setFilters({
                    priceRange: [0, 5000],
                    sizes: [],
                    colors: [],
                    rating: 0
                  });
                }}
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );

  return (
    <div className="category-page">
      {/* Success Notification */}
      {showSuccess && (
        <div className="success-notification">
          <Check className="icon-sm" />
          {showSuccess}
        </div>
      )}

      {/* Header */}
      <header className="header-wrapper">
        <div className="header-container">
          {!isMobile ? (
            // Desktop Header
            <div className="desktop-header">
              <div className="header-left">
                <button className="back-btn" onClick={() => navigate(-1)}>
                  <ArrowLeft className="icon-sm" />
                  Back
                </button>
                
                <div className="title-section">
                  <h1 className="page-title">{name}</h1>
                  <p className="products-count">{filteredProducts.length} products</p>
                </div>
              </div>
              
              <div className="header-right">
                <div className="view-toggle">
                  <button
                    className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                    onClick={() => setViewMode('grid')}
                    title="Grid View"
                  >
                    <Grid className="icon-sm" />
                  </button>
                  <button
                    className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                    onClick={() => setViewMode('list')}
                    title="List View"
                  >
                    <List className="icon-sm" />
                  </button>
                </div>
                
                <div className="sort-wrapper">
                  <select
                    className="sort-select"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    {sortOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="select-icon" />
                </div>
              </div>
            </div>
          ) : (
            // Mobile Header
            <div className="mobile-header">
              <div className="mobile-header-top">
                <button className="back-btn mobile" onClick={() => navigate(-1)}>
                  <ArrowLeft className="icon-sm" />
                </button>
                
                <div className="mobile-title-section">
                  <h1 className="page-title mobile">{name}</h1>
                  <p className="products-count mobile">{filteredProducts.length} items</p>
                </div>
                
                <button 
                  className="filters-btn mobile"
                  onClick={() => setShowFilters(true)}
                >
                  <Filter className="icon-sm" />
                </button>
              </div>
              
              <div className="search-wrapper mobile">
                <Search className="search-icon" />
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="mobile-controls">
                <div className="sort-wrapper">
                  <select
                    className="sort-select mobile"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    {sortOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="select-icon mobile" />
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Search Bar - Desktop Only */}
      {!isMobile && (
        <div className="search-wrapper desktop">
          <Search className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      )}

      {/* Products Section */}
      <main className="products-container">
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <h2 className="loading-title">Loading Products</h2>
            <p className="loading-subtitle">Please wait while we fetch the latest collection</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="empty-state">
            <ShoppingBag className="empty-icon" />
            <h2 className="empty-title">No Products Found</h2>
            <p className="empty-subtitle">Try adjusting your search or filters</p>
          </div>
        ) : (
          <>
            <div className={`products-grid ${viewMode}`}>
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
              
              {/* Marketing Section */}
              {filteredProducts.length >= 8 && (
                <div className="marketing-section-wrapper">
                  <div className="marketing-section section-features">
                    <div className="features-grid">
                      <div className="feature-card">
                        <div className="feature-icon">
                          <Truck />
                        </div>
                        <h3>Free Delivery</h3>
                        <p>On orders above ₹999</p>
                      </div>
                      
                      <div className="feature-card">
                        <div className="feature-icon">
                          <Shield />
                        </div>
                        <h3>Secure Payment</h3>
                        <p>100% secure transactions</p>
                      </div>
                      
                      <div className="feature-card">
                        <div className="feature-icon">
                          <Award />
                        </div>
                        <h3>Premium Quality</h3>
                        <p>Top-notch materials</p>
                      </div>
                      
                      <div className="feature-card">
                        <div className="feature-icon">
                          <Zap />
                        </div>
                        <h3>Fast Delivery</h3>
                        <p>Express shipping available</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </main>

      {/* Filter Modal */}
      <FilterModal />
    </div>
  );
}
