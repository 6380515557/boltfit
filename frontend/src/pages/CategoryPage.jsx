import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Filter, Grid, List, ChevronDown, Search, SlidersHorizontal, ArrowLeft, Star, Heart, ShoppingBag, Eye, X, TrendingUp, Award, Truck, Shield } from 'lucide-react';
import './CategoryPage.css';

const API_BASE_URL = "https://boltfit-backend-r4no.onrender.com/api/v1";

export default function CategoryPage() {
  const { name } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('featured');
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    priceRange: [0, 5000],
    sizes: [],
    colors: [],
    rating: 0
  });

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
        
        const categoryName = categoryMap[name.toLowerCase()] || name.charAt(0).toUpperCase() + name.slice(1);
        const response = await fetch(`${API_BASE_URL}/products/?category=${encodeURIComponent(categoryName)}&is_active=true&per_page=50`);
        
        if (response.ok) {
          const data = await response.json();
          const transformedProducts = data.products.map((product, i) => ({
            id: product.id,
            title: product.name,
            price: product.price,
            originalPrice: product.original_price || (product.price + Math.floor(Math.random() * 500) + 200),
            images: product.images && product.images.length > 0 ? 
              product.images : 
              [`https://images.unsplash.com/photo-${1520000000000 + i}?w=400&h=400&fit=crop&auto=format&q=80`],
            rating: (Math.random() * 1.5 + 3.5).toFixed(1),
            reviewsCount: Math.floor(Math.random() * 500) + 25,
            isTrending: product.is_featured || Math.random() > 0.6,
            discount: product.original_price ? 
              Math.round(((product.original_price - product.price) / product.original_price) * 100) : 
              Math.floor(Math.random() * 40) + 15,
            sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
            colors: ['Black', 'White', 'Navy', 'Gray', 'Blue'],
            category: name,
            inStock: Math.random() > 0.1,
            brand: product.brand || 'BOLT FIT'
          }));

          setProducts(transformedProducts);
          setFilteredProducts(transformedProducts);
        } else {
          throw new Error('API failed');
        }
      } catch (error) {
        console.error('Error fetching products:', error);
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
          inStock: Math.random() > 0.1,
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

  const sortOptions = [
    { value: 'featured', label: 'Featured' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Customer Rating' },
    { value: 'newest', label: 'Newest First' }
  ];

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
          <div className="discount-badge">{product.discount}% OFF</div>
        )}
        
        {!product.inStock && (
          <div className="out-of-stock-badge">Out of Stock</div>
        )}
        
        <button 
          className="wishlist-btn"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <Heart className="icon-sm" />
        </button>

        <button 
          className="quick-view-btn"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <Eye className="icon-sm" />
        </button>
      </div>
      
      <div className="product-content">
        <div className="product-brand">{product.brand}</div>
        <h3 className="product-title">{product.title}</h3>
        
        <div className="product-rating">
          <div className="stars">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`star ${i < Math.floor(parseFloat(product.rating)) ? 'filled' : ''}`}
              />
            ))}
          </div>
          <span className="rating-text">{product.rating} ({product.reviewsCount})</span>
        </div>

        <div className="product-price">
          <span className="current-price">₹{product.price.toLocaleString()}</span>
          {product.originalPrice > product.price && (
            <span className="original-price">₹{product.originalPrice.toLocaleString()}</span>
          )}
        </div>
        
        <button className="add-to-cart-btn" onClick={(e) => e.stopPropagation()}>
          <ShoppingBag className="icon-xs" />
          Add to Cart
        </button>
      </div>
    </div>
  );

  const MarketingSection = ({ type }) => {
    if (type === 1) {
      return (
        <div className="marketing-section section-features">
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <Truck />
              </div>
              <h3>Free Shipping</h3>
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
                <TrendingUp />
              </div>
              <h3>Trending Styles</h3>
              <p>Latest fashion trends</p>
            </div>
          </div>
        </div>
      );
    }
    
    if (type === 2) {
      return (
        <div className="marketing-section section-cta">
          <div className="cta-content">
            <h2>Elevate Your Style</h2>
            <p>Discover the perfect blend of comfort and fashion with our premium collection</p>
            <button className="cta-button">Shop Best Sellers</button>
          </div>
        </div>
      );
    }
    
    return null;
  };

  const renderProductsWithSections = () => {
    const items = [];
    const productsPerRow = isMobile ? 2 : 3;
    
    filteredProducts.forEach((product, index) => {
      items.push(<ProductCard key={product.id} product={product} />);
      
      // Add marketing section after every 6 products (3 rows on desktop, 6 rows on mobile)
      if ((index + 1) % (productsPerRow * (isMobile ? 3 : 2)) === 0 && index < filteredProducts.length - 1) {
        const sectionType = Math.floor((index + 1) / (productsPerRow * (isMobile ? 3 : 2))) % 2 === 1 ? 1 : 2;
        items.push(
          <div key={`section-${index}`} className="marketing-section-wrapper">
            <MarketingSection type={sectionType} />
          </div>
        );
      }
    });
    
    return items;
  };

  const MobileFilterModal = () => (
    showFilters && isMobile && (
      <div className="filter-overlay" onClick={() => setShowFilters(false)}>
        <div className="filter-modal" onClick={(e) => e.stopPropagation()}>
          <div className="filter-header">
            <h3>Filters & Sort</h3>
            <button onClick={() => setShowFilters(false)} className="close-btn">
              <X size={20} />
            </button>
          </div>
          
          <div className="filter-content">
            <div className="filter-group">
              <h4>Price Range</h4>
              <p>₹{filters.priceRange[0]} - ₹{filters.priceRange[1]}</p>
            </div>
            
            <div className="filter-group">
              <h4>Sort By</h4>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="filter-select"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            
            <button
              onClick={() => setShowFilters(false)}
              className="apply-filters-btn"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    )
  );

  return (
    <div className="category-page">
      <div className="header-wrapper">
        <div className="header-container">
          {!isMobile ? (
            <div className="desktop-header">
              <div className="header-left">
                <button onClick={() => navigate(-1)} className="back-btn">
                  <ArrowLeft className="icon-sm" />
                  Back
                </button>
                <div>
                  <h1 className="page-title">{name} Collection</h1>
                  <p className="products-count">{filteredProducts.length} products</p>
                </div>
              </div>
              
              <div className="header-right">
                <div className="view-toggle">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                  >
                    <Grid className="icon-sm" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                  >
                    <List className="icon-sm" />
                  </button>
                </div>

                <div className="sort-wrapper">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="sort-select"
                  >
                    {sortOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="select-icon" />
                </div>

                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="filters-btn"
                >
                  <SlidersHorizontal className="icon-sm" />
                  Filters
                </button>
              </div>
            </div>
          ) : (
            <div className="mobile-header">
              <div className="mobile-header-top">
                <button onClick={() => navigate(-1)} className="back-btn mobile">
                  <ArrowLeft className="icon-xs" />
                </button>

                <div className="mobile-title-section">
                  <h1 className="page-title mobile">{name}</h1>
                  <p className="products-count mobile">{filteredProducts.length} items</p>
                </div>

                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="filters-btn mobile"
                >
                  <SlidersHorizontal className="icon-xs" />
                </button>
              </div>

              <div className="search-wrapper mobile">
                <Search className="search-icon" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
              </div>
            </div>
          )}

          {!isMobile && (
            <div className="search-wrapper desktop">
              <Search className="search-icon" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
          )}
        </div>
      </div>

      <div className="products-container">
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <h2 className="loading-title">Loading products...</h2>
            <p className="loading-subtitle">Please wait while we fetch the latest collection</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="empty-state">
            <Grid className="empty-icon" />
            <h3 className="empty-title">No products found</h3>
            <p className="empty-subtitle">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="products-grid">
            {renderProductsWithSections()}
          </div>
        )}
      </div>

      <MobileFilterModal />
    </div>
  );
}