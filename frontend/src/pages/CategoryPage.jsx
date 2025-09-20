import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Filter, Grid, List, ChevronDown, Search, SlidersHorizontal, ArrowLeft, Star, Heart, ShoppingBag, Sparkles, X } from 'lucide-react';

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

  // Mobile detection with window resize handler
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const cardWidth = isMobile ? Math.min(windowWidth * 0.44, 160) : 280;

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

  // Classic Professional Product Card Component
  const ProductCard = ({ product, index }) => (
    <div
      key={product.id}
      style={{
        width: cardWidth,
        background: '#ffffff',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e5e7eb',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        position: 'relative',
        margin: isMobile ? '4px' : '8px',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
      }}
      onMouseEnter={(e) => {
        if (!isMobile) {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
          e.currentTarget.style.borderColor = '#d1d5db';
        }
      }}
      onMouseLeave={(e) => {
        if (!isMobile) {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
          e.currentTarget.style.borderColor = '#e5e7eb';
        }
      }}
      onClick={() => navigate(`/product/${product.id}`)}
    >
      {/* Image Container */}
      <div style={{
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#f8fafc'
      }}>
        <img
          src={product.images[0]}
          alt={product.title}
          style={{
            width: '100%',
            height: isMobile ? '200px' : '280px',
            objectFit: 'cover',
            transition: 'transform 0.3s ease'
          }}
          loading="lazy"
          onMouseEnter={(e) => {
            if (!isMobile) {
              e.target.style.transform = 'scale(1.05)';
            }
          }}
          onMouseLeave={(e) => {
            if (!isMobile) {
              e.target.style.transform = 'scale(1)';
            }
          }}
        />
        
        {/* Classic Discount Badge */}
        {product.discount > 0 && (
          <div style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            background: '#dc2626',
            color: '#ffffff',
            padding: isMobile ? '4px 8px' : '6px 10px',
            borderRadius: '4px',
            fontSize: isMobile ? '10px' : '12px',
            fontWeight: '600',
            letterSpacing: '0.5px'
          }}>
            -{product.discount}%
          </div>
        )}
        
        {/* Professional Trending Badge */}
        {product.isTrending && (
          <div style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            background: '#059669',
            color: '#ffffff',
            padding: isMobile ? '4px 8px' : '6px 10px',
            borderRadius: '4px',
            fontSize: isMobile ? '9px' : '11px',
            fontWeight: '600',
            letterSpacing: '0.5px'
          }}>
            TRENDING
          </div>
        )}
        
        {/* Wishlist Button */}
        {!isMobile && (
          <button style={{
            position: 'absolute',
            bottom: '12px',
            right: '12px',
            padding: '8px',
            borderRadius: '4px',
            background: 'rgba(255, 255, 255, 0.95)',
            border: '1px solid #e5e7eb',
            cursor: 'pointer',
            opacity: 0,
            transition: 'all 0.3s ease',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}
          onMouseEnter={(e) => {
            e.stopPropagation();
            e.target.style.background = '#f3f4f6';
            e.target.style.opacity = '1';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'rgba(255, 255, 255, 0.95)';
            e.target.style.opacity = '0';
          }}>
            <Heart style={{ width: '16px', height: '16px', color: '#6b7280' }} />
          </button>
        )}
      </div>
      
      {/* Content Section */}
      <div style={{
        padding: isMobile ? '14px' : '18px',
        background: '#ffffff'
      }}>
        {/* Title */}
        <h3 style={{
          fontWeight: '600',
          fontSize: isMobile ? '14px' : '16px',
          color: '#1f2937',
          marginBottom: '8px',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          lineHeight: 1.4,
          letterSpacing: '0.3px'
        }}>
          {product.title}
        </h3>
        
        {/* Rating */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2px', marginRight: '8px' }}>
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                style={{
                  width: isMobile ? '12px' : '14px',
                  height: isMobile ? '12px' : '14px',
                  color: i < Math.floor(parseFloat(product.rating)) ? '#fbbf24' : '#e5e7eb',
                  fill: i < Math.floor(parseFloat(product.rating)) ? '#fbbf24' : '#e5e7eb'
                }}
              />
            ))}
          </div>
          <span style={{
            fontSize: isMobile ? '12px' : '13px',
            color: '#6b7280',
            fontWeight: '500'
          }}>
            ({product.rating})
          </span>
        </div>

        {/* Price Section */}
        <div style={{
          marginBottom: isMobile ? '8px' : '12px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span style={{
              fontSize: isMobile ? '18px' : '22px',
              fontWeight: '700',
              color: '#1f2937'
            }}>
              ₹{product.price.toLocaleString()}
            </span>
            {product.originalPrice > product.price && (
              <span style={{
                fontSize: isMobile ? '14px' : '16px',
                color: '#9ca3af',
                textDecoration: 'line-through',
                fontWeight: '500'
              }}>
                ₹{product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>
        </div>

        {/* Add to Cart Button - Mobile */}
        {isMobile && (
          <button style={{
            width: '100%',
            marginTop: '8px',
            padding: '10px',
            background: '#1f2937',
            color: '#ffffff',
            border: 'none',
            borderRadius: '6px',
            fontSize: '13px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}
          onMouseDown={(e) => {
            e.target.style.background = '#111827';
          }}
          onMouseUp={(e) => {
            e.target.style.background = '#1f2937';
          }}
          onClick={(e) => {
            e.stopPropagation();
            // Add to cart functionality
          }}>
            Add to Cart
          </button>
        )}
      </div>
    </div>
  );

  // Mobile Filter Modal
  const MobileFilterModal = () => (
    showFilters && isMobile && (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.5)',
        zIndex: 999,
        display: 'flex',
        alignItems: 'flex-end'
      }}>
        <div style={{
          width: '100%',
          background: '#ffffff',
          borderRadius: '12px 12px 0 0',
          padding: '20px',
          maxHeight: '80vh',
          overflow: 'auto'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px'
          }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#1f2937',
              margin: 0
            }}>
              Filters & Sort
            </h3>
            <button
              onClick={() => setShowFilters(false)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '8px',
                borderRadius: '4px'
              }}
            >
              <X size={20} color="#6b7280" />
            </button>
          </div>
          
          <div style={{ color: '#6b7280' }}>
            <p>Filter options will be implemented here...</p>
            <button
              onClick={() => setShowFilters(false)}
              style={{
                width: '100%',
                padding: '12px',
                background: '#374151',
                color: '#ffffff',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                marginTop: '20px'
              }}
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    )
  );

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f8fafc',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      position: 'relative',
      paddingTop: isMobile ? '0' : '0'
    }}>
      {/* Professional Glass Header */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        borderBottom: '1px solid #e5e7eb',
        position: 'sticky',
        top: 0,
        zIndex: isMobile ? 100 : 1000,
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 15px'
        }}>
          {/* Desktop Header */}
          {!isMobile && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              height: '70px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <button
                  onClick={() => navigate(-1)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    background: '#ffffff',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    padding: '10px 16px',
                    color: '#374151',
                    cursor: 'pointer',
                    marginRight: '20px',
                    transition: 'all 0.3s ease',
                    fontWeight: '500',
                    fontSize: '14px',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = '#f9fafb';
                    e.target.style.borderColor = '#9ca3af';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = '#ffffff';
                    e.target.style.borderColor = '#d1d5db';
                  }}
                >
                  <ArrowLeft style={{ width: '16px', height: '16px', marginRight: '8px' }} />
                  Back
                </button>
                <div>
                  <h1 style={{
                    fontSize: '28px',
                    fontWeight: '700',
                    color: '#111827',
                    textTransform: 'capitalize',
                    margin: '0',
                    letterSpacing: '0.3px'
                  }}>
                    {name} Collection
                  </h1>
                  <p style={{
                    fontSize: '14px',
                    color: '#6b7280',
                    margin: '4px 0 0 0',
                    fontWeight: '400'
                  }}>
                    {filteredProducts.length} products available
                  </p>
                </div>
              </div>
              
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                {/* Professional View Toggle */}
                <div style={{
                  display: 'flex',
                  background: '#ffffff',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  padding: '2px',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                }}>
                  <button
                    onClick={() => setViewMode('grid')}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '4px',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      background: viewMode === 'grid' ? '#374151' : 'transparent',
                      color: viewMode === 'grid' ? '#ffffff' : '#6b7280'
                    }}
                  >
                    <Grid style={{ width: '16px', height: '16px' }} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '4px',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      background: viewMode === 'list' ? '#374151' : 'transparent',
                      color: viewMode === 'list' ? '#ffffff' : '#6b7280'
                    }}
                  >
                    <List style={{ width: '16px', height: '16px' }} />
                  </button>
                </div>

                {/* Professional Sort Dropdown */}
                <div style={{ position: 'relative' }}>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    style={{
                      appearance: 'none',
                      background: '#ffffff',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      padding: '10px 35px 10px 16px',
                      outline: 'none',
                      cursor: 'pointer',
                      color: '#374151',
                      fontWeight: '500',
                      fontSize: '14px',
                      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                    }}
                  >
                    {sortOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown style={{
                    width: '16px',
                    height: '16px',
                    color: '#6b7280',
                    position: 'absolute',
                    right: '12px',
                    top: '12px',
                    pointerEvents: 'none'
                  }} />
                </div>

                {/* Professional Filter Button */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 20px',
                    background: '#374151',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: '500',
                    fontSize: '14px',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = '#1f2937';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = '#374151';
                  }}
                >
                  <SlidersHorizontal style={{ width: '16px', height: '16px' }} />
                  Filters
                </button>
              </div>
            </div>
          )}

          {/* Mobile Header */}
          {isMobile && (
            <div style={{ paddingTop: '15px', paddingBottom: '15px' }}>
              {/* Top Row */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '15px'
              }}>
                <button
                  onClick={() => navigate(-1)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    background: '#ffffff',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    padding: '8px 12px',
                    color: '#374151',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    fontWeight: '500',
                    fontSize: '12px',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  <ArrowLeft style={{ width: '14px', height: '14px', marginRight: '6px' }} />
                  Back
                </button>

                <div style={{ textAlign: 'center', flex: 1, margin: '0 10px' }}>
                  <h1 style={{
                    fontSize: '18px',
                    fontWeight: '700',
                    color: '#111827',
                    textTransform: 'capitalize',
                    margin: '0',
                    letterSpacing: '0.3px'
                  }}>
                    {name}
                  </h1>
                  <p style={{
                    fontSize: '12px',
                    color: '#6b7280',
                    margin: '2px 0 0 0',
                    fontWeight: '400'
                  }}>
                    {filteredProducts.length} products
                  </p>
                </div>

                <div style={{ position: 'relative' }}>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    style={{
                      appearance: 'none',
                      background: '#ffffff',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      padding: '8px 25px 8px 12px',
                      outline: 'none',
                      cursor: 'pointer',
                      color: '#374151',
                      fontWeight: '500',
                      fontSize: '12px',
                      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                      minWidth: '80px'
                    }}
                  >
                    {sortOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown style={{
                    width: '12px',
                    height: '12px',
                    color: '#6b7280',
                    position: 'absolute',
                    right: '8px',
                    top: '10px',
                    pointerEvents: 'none'
                  }} />
                </div>
              </div>

              {/* Search Bar - Mobile */}
              <div style={{
                position: 'relative',
                marginBottom: '15px'
              }}>
                <Search style={{
                  width: '16px',
                  height: '16px',
                  color: '#6b7280',
                  position: 'absolute',
                  left: '12px',
                  top: '12px'
                }} />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    paddingLeft: '40px',
                    paddingRight: '12px',
                    paddingTop: '12px',
                    paddingBottom: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    outline: 'none',
                    fontSize: '14px',
                    background: '#ffffff',
                    color: '#374151',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => {
                    e.target.style.border = '1px solid #3b82f6';
                    e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.border = '1px solid #d1d5db';
                    e.target.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
                  }}
                />
              </div>

              {/* Filter Button - Mobile */}
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                marginBottom: '10px'
              }}>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 20px',
                    background: '#374151',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '12px',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                    zIndex: 50
                  }}
                >
                  <SlidersHorizontal style={{ width: '14px', height: '14px' }} />
                  Filters & Sort
                </button>
              </div>
            </div>
          )}

          {/* Desktop Professional Search Bar */}
          {!isMobile && (
            <div style={{ paddingBottom: '20px' }}>
              <div style={{
                position: 'relative',
                maxWidth: '500px',
                margin: '0 auto'
              }}>
                <Search style={{
                  width: '18px',
                  height: '18px',
                  color: '#6b7280',
                  position: 'absolute',
                  left: '16px',
                  top: '14px'
                }} />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    paddingLeft: '45px',
                    paddingRight: '16px',
                    paddingTop: '12px',
                    paddingBottom: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    outline: 'none',
                    fontSize: '14px',
                    background: '#ffffff',
                    color: '#374151',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                  }}
                  onFocus={(e) => {
                    e.target.style.border = '1px solid #3b82f6';
                    e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.border = '1px solid #d1d5db';
                    e.target.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Professional Hero Section - Desktop only */}
      {!isMobile && (
        <div style={{
          padding: '40px 20px',
          textAlign: 'center',
          background: '#ffffff',
          borderBottom: '1px solid #e5e7eb'
        }}>
          <h1 style={{
            fontSize: '3rem',
            fontWeight: '700',
            color: '#111827',
            marginBottom: '16px',
            textTransform: 'capitalize',
            letterSpacing: '0.5px'
          }}>
            {name} Collection
          </h1>
          <p style={{
            fontSize: '16px',
            color: '#6b7280',
            fontWeight: '400',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Discover our curated selection of premium {name} designed for style and comfort
          </p>
        </div>
      )}

      {/* Mobile Professional Hero Section */}
      {isMobile && (
        <div style={{
          padding: '16px 20px',
          textAlign: 'center',
          background: '#ffffff',
          borderBottom: '1px solid #e5e7eb'
        }}>
          <h1 style={{
            fontSize: '1.75rem',
            fontWeight: '700',
            color: '#111827',
            marginBottom: '8px',
            textTransform: 'capitalize',
            letterSpacing: '0.3px'
          }}>
            {name} Collection
          </h1>
          <p style={{
            fontSize: '14px',
            color: '#6b7280',
            fontWeight: '400'
          }}>
            Premium quality, curated for you
          </p>
        </div>
      )}

      {/* Products Grid */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: isMobile ? '0 10px 60px' : '0 20px 80px'
      }}>
        {loading ? (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: isMobile ? '60px 0' : '100px 0',
            flexDirection: 'column'
          }}>
            <div style={{
              width: isMobile ? '40px' : '50px',
              height: isMobile ? '40px' : '50px',
              border: '3px solid #e5e7eb',
              borderTop: '3px solid #374151',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              marginBottom: '20px'
            }}></div>
            <h2 style={{
              color: '#1f2937',
              fontSize: isMobile ? '16px' : '20px',
              fontWeight: '600',
              marginBottom: '8px'
            }}>
              Loading products...
            </h2>
            <p style={{
              color: '#6b7280',
              fontSize: isMobile ? '14px' : '16px',
              margin: 0,
              textAlign: 'center'
            }}>
              Please wait while we fetch the latest {name} collection
            </p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: isMobile ? '60px 20px' : '100px 20px',
            color: '#1f2937'
          }}>
            <div style={{ marginBottom: '25px' }}>
              <Grid style={{
                width: isMobile ? '50px' : '70px',
                height: isMobile ? '50px' : '70px',
                margin: '0 auto',
                color: '#9ca3af'
              }} />
            </div>
            <h3 style={{
              fontSize: isMobile ? '18px' : '24px',
              fontWeight: '600',
              marginBottom: '12px',
              color: '#1f2937'
            }}>
              No products found
            </h3>
            <p style={{
              fontSize: isMobile ? '14px' : '16px',
              color: '#6b7280'
            }}>
              Try adjusting your search or filters to find what you're looking for
            </p>
          </div>
        ) : (
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: isMobile ? 'space-around' : 'center',
            gap: isMobile ? '8px' : '15px',
            padding: '20px 0'
          }}>
            {filteredProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        )}
      </div>

      {/* Mobile Filter Modal */}
      <MobileFilterModal />

      {/* Professional CSS Animations */}
      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        * {
          -webkit-tap-highlight-color: transparent;
          box-sizing: border-box;
        }

        /* Mobile specific styles */
        @media (max-width: 768px) {
          .category-page {
            padding-top: 0;
          }
          
          /* Touch-friendly buttons */
          button {
            min-height: 40px;
            min-width: 40px;
          }
          
          /* Better text readability on mobile */
          input, select {
            font-size: 16px; /* Prevents zoom on iOS */
          }
        }

        /* Scrollbar styling */
        ::-webkit-scrollbar {
          width: 6px;
        }
        
        ::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 3px;
        }
        
        ::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 3px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  );
}