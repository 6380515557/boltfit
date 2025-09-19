import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  ChevronLeft, 
  ChevronRight, 
  Star, 
  ShoppingBag, 
  Users, 
  Award, 
  Truck,
  Loader2,
  AlertCircle 
} from 'lucide-react';

const API_BASE_URL = "http://localhost:8000/api/v1";

export default function CollectionsPage() {
  const navigate = useNavigate();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  
  // State for products from API
  const [products, setProducts] = useState({
    shirts: [],
    tshirts: [],
    pants: []
  });
  
  const [loading, setLoading] = useState({
    shirts: true,
    tshirts: true,
    pants: true
  });
  
  const [error, setError] = useState({
    shirts: null,
    tshirts: null,
    pants: null
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch products from API
  useEffect(() => {
    fetchProductsByCategory();
  }, []);

  const fetchProductsByCategory = async () => {
    const categories = [
      { key: 'shirts', name: 'Shirts' },
      { key: 'tshirts', name: 'T-Shirts' },
      { key: 'pants', name: 'Pants' }
    ];

    for (const category of categories) {
      try {
        setLoading(prev => ({ ...prev, [category.key]: true }));
        setError(prev => ({ ...prev, [category.key]: null }));

        const response = await fetch(
          `${API_BASE_URL}/products/?category=${category.name}&per_page=20&is_active=true`
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch ${category.name}`);
        }

        const data = await response.json();
        
        // Transform API data to match UI expectations
        const transformedProducts = data.products.map(product => ({
          id: product.id,
          title: product.name,
          price: product.price,
          originalPrice: product.original_price || product.price,
          image: product.images && product.images.length > 0 
            ? `${API_BASE_URL.replace('/api/v1', '')}${product.images[0]}` 
            : `https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop&rand=${product.id}`,
          rating: 4.5, // You can add rating field to your product model
          discount: product.original_price 
            ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
            : 0,
          category: product.category,
          description: product.description,
          brand: product.brand,
          sizes: product.sizes || [],
          colors: product.colors || [],
          is_featured: product.is_featured
        }));

        setProducts(prev => ({
          ...prev,
          [category.key]: transformedProducts
        }));
      } catch (err) {
        console.error(`Error fetching ${category.name}:`, err);
        setError(prev => ({
          ...prev,
          [category.key]: err.message
        }));
      } finally {
        setLoading(prev => ({ ...prev, [category.key]: false }));
      }
    }
  };

  // Responsive breakpoints
  const isMobile = windowWidth <= 768;
  const isTablet = windowWidth > 768 && windowWidth <= 1024;
  const isDesktop = windowWidth > 1024;

  const ScrollableSection = ({ title, items, delay = 0, categoryKey }) => {
    const scrollContainer = useRef(null);

    const scroll = (direction) => {
      const container = scrollContainer.current;
      const scrollAmount = isMobile ? 280 : isTablet ? 300 : 320;
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    };

    const handleProductClick = (product) => {
      // Navigate to product detail page or handle product selection
      navigate(`/product/${product.id}`);
    };

    // Show loading state
    if (loading[categoryKey]) {
      return (
        <div className="mb-16" style={{ animationDelay: `${delay}ms` }}>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
          </div>
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Loading {title.toLowerCase()}...</span>
          </div>
        </div>
      );
    }

    // Show error state
    if (error[categoryKey]) {
      return (
        <div className="mb-16" style={{ animationDelay: `${delay}ms` }}>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
          </div>
          <div className="flex items-center justify-center py-12 text-red-600">
            <AlertCircle className="w-6 h-6 mr-2" />
            <span>Error loading {title.toLowerCase()}: {error[categoryKey]}</span>
            <button 
              onClick={fetchProductsByCategory}
              className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      );
    }

    // Show empty state
    if (items.length === 0) {
      return (
        <div className="mb-16" style={{ animationDelay: `${delay}ms` }}>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
          </div>
          <div className="flex items-center justify-center py-12 text-gray-500">
            <ShoppingBag className="w-6 h-6 mr-2" />
            <span>No {title.toLowerCase()} available at the moment</span>
          </div>
        </div>
      );
    }

    return (
      <div 
        className="mb-16 opacity-0 animate-fade-in-up" 
        style={{ animationDelay: `${delay}ms` }}
      >
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
          <div className="flex gap-2">
            <button
              onClick={() => scroll('left')}
              className="p-2 rounded-full bg-white shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="p-2 rounded-full bg-white shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        <div
          ref={scrollContainer}
          className="flex gap-6 overflow-x-auto scrollbar-hide pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {items.map((item, index) => (
            <div
              key={item.id}
              className="flex-shrink-0 group cursor-pointer"
              style={{ width: isMobile ? 260 : 280 }}
              onClick={() => handleProductClick(item)}
            >
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-105 hover:-translate-y-1">
                <div className="relative overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                  {item.discount > 0 && (
                    <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      -{item.discount}%
                    </div>
                  )}
                  {item.is_featured && (
                    <div className="absolute top-4 right-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Featured
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                    <ShoppingBag className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100" />
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="font-semibold text-lg text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-1">
                    {item.title}
                  </h3>
                  
                  <div className="flex items-center mb-3">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(item.rating)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600 ml-2">({item.rating})</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xl font-bold text-gray-900">₹{item.price}</span>
                      {item.originalPrice > item.price && (
                        <span className="text-sm text-gray-500 line-through ml-2">₹{item.originalPrice}</span>
                      )}
                    </div>
                  </div>

                  {/* Show brand and sizes if available */}
                  <div className="mt-3 flex items-center justify-between text-sm text-gray-600">
                    <span>{item.brand}</span>
                    {item.sizes && item.sizes.length > 0 && (
                      <span>{item.sizes.length} sizes</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </button>
            <h1 className="text-xl font-semibold text-gray-900">Collections</h1>
            <div className="w-16"></div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative py-20 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 opacity-0 animate-fade-in-up">
            Premium Collections
          </h1>
          <p className="text-xl text-gray-600 mb-8 opacity-0 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            Crafted with love, designed for excellence
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-12 opacity-0 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">50K+</div>
              <div className="text-sm text-gray-600">Happy Customers</div>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <Award className="w-8 h-8 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">Premium</div>
              <div className="text-sm text-gray-600">Quality Products</div>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <Truck className="w-8 h-8 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">Free</div>
              <div className="text-sm text-gray-600">Shipping</div>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <Star className="w-8 h-8 text-blue-600 fill-current" />
              </div>
              <div className="text-2xl font-bold text-gray-900">4.8</div>
              <div className="text-sm text-gray-600">Average Rating</div>
            </div>
          </div>
        </div>
      </div>

      {/* Products Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <ScrollableSection 
          title="New Shirts" 
          items={products.shirts} 
          delay={600}
          categoryKey="shirts"
        />
        <ScrollableSection 
          title="T-Shirt Collections" 
          items={products.tshirts} 
          delay={800}
          categoryKey="tshirts"
        />
        <ScrollableSection 
          title="New Pants" 
          items={products.pants} 
          delay={1000}
          categoryKey="pants"
        />
      </div>

      {/* Add custom styles */}
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
