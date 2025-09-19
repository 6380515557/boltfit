import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Filter, Grid, List, ChevronDown, Search, SlidersHorizontal, ArrowLeft, Star, Heart, ShoppingBag, Sparkles } from 'lucide-react';

const API_BASE_URL = "http://localhost:8000/api/v1";

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

  // Mobile detection
  const isMobile = window.innerWidth < 768;
  const cardWidth = isMobile ? 160 : 280;

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
            // ✅ FIXED: Use ImgBB URLs directly without concatenation
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
        // Fallback to mock data
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

  // Filter and sort logic
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

  // Advanced Product Card Component
  const ProductCard = ({ product, index }) => (
    <div
      key={product.id}
      style={{
        width: cardWidth,
        background: 'linear-gradient(145deg, #ffffff, #f8fafc)',
        borderRadius: '24px',
        boxShadow: '0 4px 20px rgba(79, 172, 254, 0.08), 0 1px 3px rgba(0, 0, 0, 0.05)',
        border: '1px solid rgba(79, 172, 254, 0.1)',
        overflow: 'hidden',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: 'pointer',
        position: 'relative',
        animationDelay: `${index * 150}ms`,
        opacity: 0,
        animation: 'slideInUp 0.8s ease-out forwards',
        margin: isMobile ? '8px' : '12px',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
        e.currentTarget.style.boxShadow = '0 20px 40px rgba(79, 172, 254, 0.15), 0 8px 16px rgba(0, 0, 0, 0.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0) scale(1)';
        e.currentTarget.style.boxShadow = '0 4px 20px rgba(79, 172, 254, 0.08), 0 1px 3px rgba(0, 0, 0, 0.05)';
      }}
      onClick={() => navigate(`/product/${product.id}`)}
    >
      {/* Floating Animation Particles */}
      <div style={{
        cursor: 'pointer',
        position: 'absolute',
        top: '15px',
        right: '15px',
        width: '8px',
        height: '8px',
        background: 'linear-gradient(135deg, #4facfe, #00f2fe)',
        borderRadius: '50%',
        animation: 'float 4s ease-in-out infinite',
        opacity: 0.6
      }} />
      
      <div style={{
        position: 'absolute',
        top: '30px',
        right: '25px',
        width: '6px',
        height: '6px',
        background: 'linear-gradient(135deg, #ffecd2, #fcb69f)',
        borderRadius: '50%',
        animation: 'float 3s ease-in-out infinite 0.5s',
        opacity: 0.7
      }} />

      {/* Image Container with Advanced Effects */}
      <div style={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: '20px 20px 0 0',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        {/* Shimmer Loading Effect */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: '-100%',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
          animation: 'shimmer 3s infinite',
          zIndex: 1
        }} />
        
        <img
          src={product.images[0]}
          alt={product.title}
          style={{
            width: '100%',
            height: isMobile ? '140px' : '200px',
            objectFit: 'cover',
            transition: 'transform 0.6s ease, filter 0.3s ease',
            filter: 'brightness(1.05) saturate(1.1)'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'scale(1.1) rotate(1deg)';
            e.target.style.filter = 'brightness(1.15) saturate(1.2)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'scale(1) rotate(0deg)';
            e.target.style.filter = 'brightness(1.05) saturate(1.1)';
          }}
          loading="lazy"
        />
        
        {/* Advanced Badges */}
        {product.discount > 0 && (
          <div style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            background: 'linear-gradient(135deg, #ff6b6b, #ee5a52)',
            color: '#ffffff',
            padding: '6px 12px',
            borderRadius: '20px',
            fontSize: isMobile ? '10px' : '12px',
            fontWeight: '700',
            animation: 'bounce 2s infinite',
            boxShadow: '0 4px 15px rgba(255, 107, 107, 0.4)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)'
          }}>
            <Sparkles size={10} style={{ marginRight: 4, display: 'inline' }} />
            -{product.discount}%
          </div>
        )}
        
        {product.isTrending && (
          <div style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            background: 'linear-gradient(135deg, #ffeaa7, #fdcb6e)',
            color: '#2d3436',
            padding: '6px 12px',
            borderRadius: '20px',
            fontSize: isMobile ? '10px' : '12px',
            fontWeight: '700',
            animation: 'glow 2s ease-in-out infinite alternate',
            boxShadow: '0 4px 15px rgba(253, 203, 110, 0.4)'
          }}>
            🔥 Trending
          </div>
        )}
        
        {/* Interactive Heart Button */}
        <button style={{
          position: 'absolute',
          bottom: '12px',
          right: '12px',
          padding: '10px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.9)',
          border: 'none',
          cursor: 'pointer',
          opacity: 0,
          transition: 'all 0.4s ease',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          transform: 'scale(0.8)'
        }}
        onMouseEnter={(e) => {
          e.stopPropagation();
          e.target.style.transform = 'scale(1.1)';
          e.target.style.background = 'linear-gradient(135deg, #ff6b6b, #ee5a52)';
          e.target.querySelector('svg').style.color = '#ffffff';
          e.target.style.opacity = '1';
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'scale(0.8)';
          e.target.style.background = 'rgba(255, 255, 255, 0.9)';
          e.target.querySelector('svg').style.color = '#6b7280';
          e.target.style.opacity = '0';
        }}>
          <Heart style={{ width: '16px', height: '16px', color: '#6b7280', transition: 'color 0.3s ease' }} />
        </button>
      </div>
      
      {/* Enhanced Content Section */}
      <div style={{
        padding: isMobile ? '16px' : '20px',
        background: 'linear-gradient(145deg, #ffffff, #f8fafc)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '8px'
        }}>
          <div style={{
            padding: '4px 8px',
            background: 'linear-gradient(135deg, #a8edea, #fed6e3)',
            borderRadius: '12px',
            fontSize: isMobile ? '9px' : '10px',
            fontWeight: '600',
            color: '#2d3436',
            marginRight: '8px'
          }}>
            {product.brand}
          </div>
          <div style={{
            padding: '4px 8px',
            background: 'linear-gradient(135deg, #d299c2, #fef9d7)',
            borderRadius: '12px',
            fontSize: isMobile ? '9px' : '10px',
            fontWeight: '600',
            color: '#2d3436'
          }}>
            {product.category}
          </div>
        </div>

        <h3 style={{
          fontWeight: '700',
          fontSize: isMobile ? '14px' : '18px',
          background: 'linear-gradient(135deg, #667eea, #764ba2)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          marginBottom: '10px',
          transition: 'all 0.3s ease',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          letterSpacing: '0.3px',
          lineHeight: 1.3
        }}>
          {product.title}
        </h3>
        
        {/* Animated Star Rating */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '12px',
          padding: '8px 12px',
          background: 'linear-gradient(135deg, #ffeaa7, #fab1a0)',
          borderRadius: '15px',
          boxShadow: '0 2px 10px rgba(255, 234, 167, 0.3)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                style={{
                  width: isMobile ? '12px' : '14px',
                  height: isMobile ? '12px' : '14px',
                  color: i < Math.floor(parseFloat(product.rating)) ? '#fdcb6e' : '#ddd',
                  fill: i < Math.floor(parseFloat(product.rating)) ? '#fdcb6e' : '#ddd',
                  transition: 'all 0.3s ease',
                  animation: `starTwinkle 1s ease-in-out ${i * 0.2}s infinite alternate`
                }}
              />
            ))}
          </div>
          <span style={{
            fontSize: isMobile ? '11px' : '12px',
            color: '#2d3436',
            marginLeft: '8px',
            fontWeight: '600'
          }}>
            ({product.rating}) • {product.reviewsCount}
          </span>
        </div>

        {/* Advanced Price Display */}
        <div style={{
          padding: '15px',
          borderRadius: '18px',
          background: 'linear-gradient(135deg, #667eea, #764ba2)',
          color: '#ffffff',
          marginBottom: '12px',
          boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Price Background Animation */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: '-100%',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
            animation: 'priceShimmer 4s infinite',
          }} />
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'relative',
            zIndex: 1
          }}>
            <div>
              <span style={{
                fontSize: isMobile ? '18px' : '22px',
                fontWeight: '800',
                textShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}>
                ₹{product.price}
              </span>
              {product.originalPrice > product.price && (
                <span style={{
                  fontSize: isMobile ? '12px' : '14px',
                  opacity: 0.8,
                  textDecoration: 'line-through',
                  marginLeft: '10px'
                }}>
                  ₹{product.originalPrice}
                </span>
              )}
            </div>
            <ShoppingBag style={{
              width: isMobile ? '16px' : '20px',
              height: isMobile ? '16px' : '20px',
              opacity: 0.8
            }} />
          </div>
        </div>

        {/* Stock and Size Info */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: isMobile ? '11px' : '12px',
          color: '#636e72',
          fontWeight: '500'
        }}>
          <span style={{
            padding: '4px 10px',
            background: product.inStock ? 'linear-gradient(135deg, #00b894, #00cec9)' : '#fab1a0',
            color: '#ffffff',
            borderRadius: '10px',
            fontSize: isMobile ? '9px' : '10px',
            fontWeight: '600'
          }}>
            {product.inStock ? '✓ In Stock' : '⚠ Low Stock'}
          </span>
          <span>📏 {product.sizes.length} sizes</span>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 25%, #a8edea 50%, #fed6e3 75%, #d299c2 100%)',
      fontFamily: "'Inter', 'Segoe UI', sans-serif",
      position: 'relative'
    }}>
      {/* Floating Background Decorations */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '5%',
        width: '120px',
        height: '120px',
        background: 'linear-gradient(45deg, rgba(255,255,255,0.2), rgba(255,255,255,0.1))',
        borderRadius: '50%',
        animation: 'float 8s ease-in-out infinite',
        filter: 'blur(2px)'
      }} />
      
      <div style={{
        position: 'absolute',
        top: '50%',
        right: '8%',
        width: '80px',
        height: '80px',
        background: 'linear-gradient(45deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))',
        borderRadius: '50%',
        animation: 'float 6s ease-in-out infinite reverse',
        filter: 'blur(1px)'
      }} />

      {/* Advanced Glass Header */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.25)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.3)',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 20px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '80px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <button
                onClick={() => navigate(-1)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: 'rgba(255, 255, 255, 0.4)',
                  border: 'none',
                  borderRadius: '20px',
                  padding: '12px 20px',
                  color: '#2d3436',
                  cursor: 'pointer',
                  marginRight: '25px',
                  transition: 'all 0.3s ease',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  fontWeight: '600',
                  fontSize: '14px',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.6)';
                  e.target.style.transform = 'translateX(-3px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.4)';
                  e.target.style.transform = 'translateX(0)';
                }}
              >
                <ArrowLeft style={{ width: '18px', height: '18px', marginRight: '8px' }} />
                Back
              </button>
              <div>
                <h1 style={{
                  fontSize: isMobile ? '24px' : '32px',
                  fontWeight: '800',
                  color: '#2d3436',
                  textTransform: 'capitalize',
                  margin: '0',
                  letterSpacing: '0.5px'
                }}>
                  {name} Collection
                </h1>
                <p style={{
                  fontSize: '14px',
                  color: '#636e72',
                  margin: '4px 0 0 0',
                  fontWeight: '500'
                }}>
                  {filteredProducts.length} amazing products found
                </p>
              </div>
            </div>
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '15px'
            }}>
              {/* Advanced View Toggle */}
              <div style={{
                display: isMobile ? 'none' : 'flex',
                background: 'rgba(255, 255, 255, 0.4)',
                borderRadius: '20px',
                padding: '6px',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
              }}>
                <button
                  onClick={() => setViewMode('grid')}
                  style={{
                    padding: '10px 16px',
                    borderRadius: '16px',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    background: viewMode === 'grid' 
                      ? 'linear-gradient(135deg, #667eea, #764ba2)' 
                      : 'transparent',
                    color: viewMode === 'grid' ? '#ffffff' : '#636e72'
                  }}
                >
                  <Grid style={{ width: '18px', height: '18px' }} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  style={{
                    padding: '10px 16px',
                    borderRadius: '16px',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    background: viewMode === 'list' 
                      ? 'linear-gradient(135deg, #667eea, #764ba2)' 
                      : 'transparent',
                    color: viewMode === 'list' ? '#ffffff' : '#636e72'
                  }}
                >
                  <List style={{ width: '18px', height: '18px' }} />
                </button>
              </div>

              {/* Premium Sort Dropdown */}
              <div style={{ position: 'relative' }}>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  style={{
                    appearance: 'none',
                    background: 'rgba(255, 255, 255, 0.4)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: '20px',
                    padding: '12px 40px 12px 20px',
                    outline: 'none',
                    cursor: 'pointer',
                    color: '#2d3436',
                    fontWeight: '600',
                    fontSize: '14px',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown style={{
                  width: '18px',
                  height: '18px',
                  color: '#636e72',
                  position: 'absolute',
                  right: '15px',
                  top: '15px',
                  pointerEvents: 'none'
                }} />
              </div>

              {/* Premium Filter Button */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '12px 24px',
                  background: 'linear-gradient(135deg, #ff6b6b, #feca57)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '20px',
                  cursor: 'pointer',
                  fontWeight: '700',
                  fontSize: '14px',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 8px 25px rgba(255, 107, 107, 0.3)',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px) scale(1.05)';
                  e.target.style.boxShadow = '0 12px 35px rgba(255, 107, 107, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0) scale(1)';
                  e.target.style.boxShadow = '0 8px 25px rgba(255, 107, 107, 0.3)';
                }}
              >
                <SlidersHorizontal style={{ width: '18px', height: '18px' }} />
                Filters
              </button>
            </div>
          </div>

          {/* Premium Search Bar */}
          <div style={{ paddingBottom: '25px' }}>
            <div style={{
              position: 'relative',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              <Search style={{
                width: '22px',
                height: '22px',
                color: '#636e72',
                position: 'absolute',
                left: '25px',
                top: '18px'
              }} />
              <input
                type="text"
                placeholder="Search for amazing products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  paddingLeft: '65px',
                  paddingRight: '25px',
                  paddingTop: '18px',
                  paddingBottom: '18px',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '30px',
                  outline: 'none',
                  fontSize: '16px',
                  background: 'rgba(255, 255, 255, 0.4)',
                  color: '#2d3436',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)'
                }}
                onFocus={(e) => {
                  e.target.style.border = '2px solid rgba(102, 126, 234, 0.5)';
                  e.target.style.background = 'rgba(255, 255, 255, 0.6)';
                  e.target.style.transform = 'scale(1.02)';
                }}
                onBlur={(e) => {
                  e.target.style.border = '2px solid rgba(255, 255, 255, 0.3)';
                  e.target.style.background = 'rgba(255, 255, 255, 0.4)';
                  e.target.style.transform = 'scale(1)';
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div style={{
        padding: '60px 20px',
        textAlign: 'center',
        position: 'relative'
      }}>
        <h1 style={{
          fontSize: isMobile ? '2.5rem' : '4rem',
          fontWeight: '900',
          background: 'linear-gradient(135deg, #667eea, #764ba2)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          marginBottom: '20px',
          textTransform: 'capitalize',
          letterSpacing: '1px',
          animation: 'titleFloat 3s ease-in-out infinite alternate'
        }}>
          Discover {name}
        </h1>
        <p style={{
          fontSize: isMobile ? '16px' : '20px',
          color: '#636e72',
          fontWeight: '500',
          animation: 'fadeInUp 1s ease-out 0.5s both'
        }}>
          Curated collection of premium {name} just for you ✨
        </p>
      </div>

      {/* Products Grid */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '0 20px 80px'
      }}>
        {loading ? (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '100px 0',
            flexDirection: 'column'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              border: '6px solid rgba(102, 126, 234, 0.2)',
              borderTop: '6px solid #667eea',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              marginBottom: '25px'
            }}></div>
            <h2 style={{
              color: '#2d3436',
              fontSize: '24px',
              fontWeight: '700',
              marginBottom: '10px'
            }}>
              Fetching amazing products...
            </h2>
            <p style={{
              color: '#636e72',
              fontSize: '16px',
              margin: 0
            }}>
              Please wait while we curate the best {name} for you! 🛍️
            </p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '100px 20px',
            color: '#2d3436'
          }}>
            <div style={{ marginBottom: '30px' }}>
              <Grid style={{
                width: '80px',
                height: '80px',
                margin: '0 auto',
                opacity: 0.5,
                animation: 'float 3s ease-in-out infinite'
              }} />
            </div>
            <h3 style={{
              fontSize: '28px',
              fontWeight: '700',
              marginBottom: '15px'
            }}>
              No products found 😔
            </h3>
            <p style={{
              fontSize: '18px',
              opacity: 0.8
            }}>
              Try adjusting your search or filters to discover amazing products!
            </p>
          </div>
        ) : (
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: isMobile ? '8px' : '15px',
            padding: '20px 0'
          }}>
            {filteredProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        )}
      </div>

      {/* Advanced CSS Animations */}
      <style jsx>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(60px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-15px) rotate(5deg); }
          66% { transform: translateY(-8px) rotate(-3deg); }
        }

        @keyframes shimmer {
          0% { left: -100%; }
          100% { left: 100%; }
        }

        @keyframes bounce {
          0%, 100% { transform: scale(1) rotate(0deg); opacity: 1; }
          50% { transform: scale(1.1) rotate(5deg); opacity: 0.8; }
        }

        @keyframes glow {
          0% { box-shadow: 0 4px 15px rgba(253, 203, 110, 0.4); }
          100% { box-shadow: 0 8px 30px rgba(253, 203, 110, 0.8); }
        }

        @keyframes starTwinkle {
          0% { transform: scale(1) rotate(0deg); opacity: 1; }
          100% { transform: scale(1.2) rotate(180deg); opacity: 0.7; }
        }

        @keyframes priceShimmer {
          0% { left: -100%; }
          50% { left: 100%; }
          100% { left: -100%; }
        }

        @keyframes titleFloat {
          0% { transform: translateY(0px); }
          100% { transform: translateY(-10px); }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        * {
          -webkit-tap-highlight-color: transparent;
        }
      `}</style>
    </div>
  );
}
