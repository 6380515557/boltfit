import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronLeft, ChevronRight, Star, ShoppingBag, Users, Award, Truck, Loader2, AlertCircle } from 'lucide-react';

const API_BASE_URL = `{import.meta.env.BACKEND_BASE_URL}/api/v1`;

export default function CollectionsPage() {
  const navigate = useNavigate();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Enhanced state management like CategoryPage
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

  // Enhanced API fetching function matching CategoryPage pattern
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
          `${API_BASE_URL}/products/?category=${encodeURIComponent(category.name)}&per_page=20&is_active=true`
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch ${category.name} (${response.status})`);
        }

        const data = await response.json();

        // Enhanced data transformation matching CategoryPage
        const transformedProducts = data.products.map((product, i) => ({
          id: product.id,
          title: product.name,
          price: product.price,
          originalPrice: product.original_price || (product.price + Math.floor(Math.random() * 500) + 200),
          // Use ImgBB URLs directly like CategoryPage
          image: product.images && product.images.length > 0 
            ? product.images[0] 
            : `https://images.unsplash.com/photo-${1520000000000 + i}?w=400&h=400&fit=crop&auto=format&q=80`,
          rating: (Math.random() * 1.5 + 3.5).toFixed(1),
          reviewsCount: Math.floor(Math.random() * 500) + 25,
          discount: product.original_price 
            ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
            : Math.floor(Math.random() * 40) + 15,
          category: product.category,
          description: product.description,
          brand: product.brand || 'BOLT FIT',
          sizes: product.sizes || ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
          colors: product.colors || ['Black', 'White', 'Navy', 'Gray', 'Blue'],
          is_featured: product.is_featured,
          isTrending: product.is_featured || Math.random() > 0.6,
          inStock: Math.random() > 0.1
        }));

        setProducts(prev => ({
          ...prev,
          [category.key]: transformedProducts
        }));

      } catch (err) {
        console.error(`Error fetching ${category.name}:`, err);
        setError(prev => ({ 
          ...prev, 
          [category.key]: `Failed to load ${category.name}. Please try again.`
        }));

        // Fallback to mock data like CategoryPage
        const mockProducts = Array.from({ length: 8 }, (_, i) => ({
          id: `${category.key}-${i + 1}`,
          title: `${category.name} Premium ${['Classic', 'Modern', 'Luxury', 'Sport'][i % 4]} ${i + 1}`,
          price: Math.floor(Math.random() * 2500) + 599,
          originalPrice: Math.floor(Math.random() * 3500) + 1200,
          image: `https://images.unsplash.com/photo-${1520000000000 + i}?w=400&h=400&fit=crop&auto=format&q=80`,
          rating: (Math.random() * 1.5 + 3.5).toFixed(1),
          reviewsCount: Math.floor(Math.random() * 500) + 25,
          discount: Math.floor(Math.random() * 40) + 15,
          category: category.name,
          brand: 'BOLT FIT',
          sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
          colors: ['Black', 'White', 'Navy', 'Gray', 'Blue'],
          isTrending: Math.random() > 0.6,
          inStock: Math.random() > 0.1
        }));

        setProducts(prev => ({
          ...prev,
          [category.key]: mockProducts
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
      navigate(`/product/${product.id}`);
    };

    // Enhanced loading state
    if (loading[categoryKey]) {
      return (
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">{title}</h2>
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="animate-spin h-8 w-8 text-blue-600 mx-auto mb-3" />
              <p className="text-gray-600">Loading {title.toLowerCase()}...</p>
            </div>
          </div>
        </div>
      );
    }

    // Enhanced error state
    if (error[categoryKey]) {
      return (
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">{title}</h2>
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-3" />
              <p className="text-red-600 mb-3">{error[categoryKey]}</p>
              <button 
                onClick={() => fetchProductsByCategory()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="mb-12" style={{ animationDelay: `${delay}ms` }}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
          <button 
            onClick={() => navigate(`/category/${categoryKey}`)}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            View All
          </button>
        </div>

        <div className="relative">
          {/* Left Arrow */}
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-lg hover:bg-white transition-all duration-200"
            style={{ marginLeft: '-20px' }}
          >
            <ChevronLeft size={20} className="text-gray-600" />
          </button>

          {/* Right Arrow */}
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-lg hover:bg-white transition-all duration-200"
            style={{ marginRight: '-20px' }}
          >
            <ChevronRight size={20} className="text-gray-600" />
          </button>

          {/* Products Container */}
          <div
            ref={scrollContainer}
            className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-2"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {items.map((item, index) => (
              <div
                key={item.id}
                onClick={() => handleProductClick(item)}
                className="flex-shrink-0 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 cursor-pointer group overflow-hidden"
                style={{ width: isMobile ? '260px' : '300px' }}
              >
                {/* Product Image */}
                <div className="relative overflow-hidden rounded-t-xl">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.src = `https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&auto=format&q=80`;
                    }}
                  />
                  {/* Discount Badge */}
                  {item.discount > 0 && (
                    <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                      {item.discount}% OFF
                    </div>
                  )}
                  {/* Trending Badge */}
                  {item.isTrending && (
                    <div className="absolute top-3 right-3 bg-gradient-to-r from-pink-500 to-orange-500 text-white text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1">
                      <Truck size={10} />
                      Trending
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 mb-1 line-clamp-2 text-sm">
                    {item.title}
                  </h3>

                  {/* Brand */}
                  <p className="text-xs text-gray-500 mb-2">{item.brand}</p>

                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-2">
                    <div className="flex items-center">
                      <Star size={12} className="fill-yellow-400 text-yellow-400" />
                      <span className="text-xs text-gray-600 ml-1">{item.rating}</span>
                    </div>
                    <span className="text-xs text-gray-400">({item.reviewsCount})</span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg font-bold text-gray-900">₹{item.price}</span>
                    {item.originalPrice > item.price && (
                      <span className="text-sm text-gray-500 line-through">₹{item.originalPrice}</span>
                    )}
                  </div>

                  {/* Stock Status */}
                  {!item.inStock && (
                    <p className="text-xs text-red-500 font-medium">Out of Stock</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft size={20} />
              <span className="font-medium">Back</span>
            </button>

            <h1 className="text-xl font-bold text-gray-900">Collections</h1>

            <button
              onClick={() => navigate('/cart')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ShoppingBag size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 text-white py-16 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fadeIn">
            Premium Collections
          </h1>
          <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto mb-8">
            Crafted with love, designed for excellence
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-lg mx-auto">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Users className="w-6 h-6" />
              </div>
              <div className="text-2xl font-bold">50K+</div>
              <div className="text-sm opacity-80">Happy Customers</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Award className="w-6 h-6" />
              </div>
              <div className="text-2xl font-bold">4.8★</div>
              <div className="text-sm opacity-80">Average Rating</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Truck className="w-6 h-6" />
              </div>
              <div className="text-2xl font-bold">24hr</div>
              <div className="text-sm opacity-80">Fast Delivery</div>
            </div>
          </div>
        </div>
      </div>

      {/* Collections Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ScrollableSection 
          title="Premium Shirts" 
          items={products.shirts} 
          delay={0}
          categoryKey="shirts"
        />

        <ScrollableSection 
          title="Trendy T-Shirts" 
          items={products.tshirts} 
          delay={200}
          categoryKey="tshirts"
        />

        <ScrollableSection 
          title="Stylish Pants" 
          items={products.pants} 
          delay={400}
          categoryKey="pants"
        />
      </div>
    </div>
  );
}