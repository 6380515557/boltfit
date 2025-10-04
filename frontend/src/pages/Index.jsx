import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Star,
  ShoppingBag,
  Truck,
  Shield,
  Award,
  Instagram,
  ArrowRight,
  Loader,
} from 'lucide-react';

const APIBASEURL = "https://boltfit-backend-r4no.onrender.com/api/v1";

export default function Index() {
  const [offerItems, setOfferItems] = useState([]);
  const [bestPriceItems, setBestPriceItems] = useState([]);
  const [shirtItems, setShirtItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Hero images
  const heroImages = [
    'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=800&h=1000&fit=crop',
    'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&h=1000&fit=crop',
    'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=1000&fit=crop',
  ];

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const [offersRes, bestPriceRes, shirtsRes] = await Promise.all([
          fetch(`${APIBASEURL}/products?category=T-Shirts&perpage=8&isactive=true`),
          fetch(`${APIBASEURL}/products?category=Pants&perpage=8&isactive=true`),
          fetch(`${APIBASEURL}/products?category=Shirts&perpage=8&isactive=true`),
        ]);

        const offersData = offersRes.ok ? await offersRes.json() : { products: [] };
        const bestPriceData = bestPriceRes.ok ? await bestPriceRes.json() : { products: [] };
        const shirtsData = shirtsRes.ok ? await shirtsRes.json() : { products: [] };

        const filterDuplicates = (products) => {
          const seenIds = new Set();
          return products.filter(product => {
            if (seenIds.has(product.id)) return false;
            seenIds.add(product.id);
            return true;
          });
        };

        const transform = (products) => {
          return products.map((product) => ({
            id: product.id,
            title: product.name,
            price: product.price,
            originalPrice: product.originalprice,
            discount: product.originalprice 
              ? Math.round(((product.originalprice - product.price) / product.originalprice) * 100) 
              : 0,
            image: product.images && product.images.length > 0 
              ? product.images[0] 
              : 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop',
            rating: 4.5,
          }));
        };

        setOfferItems(transform(filterDuplicates(offersData.products || [])));
        setBestPriceItems(transform(filterDuplicates(bestPriceData.products || [])));
        setShirtItems(transform(filterDuplicates(shirtsData.products || [])));
      } catch (error) {
        console.error("Error fetching products", error);
        setOfferItems([]);
        setBestPriceItems([]);
        setShirtItems([]);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const handleNavigate = (path) => {
    console.log('Navigate to:', path);
  };

  const ScrollableSection = ({ title, items, showViewAll = false }) => {
    const scrollRef = useRef(null);

    const scroll = (direction) => {
      if (scrollRef.current) {
        const scrollAmount = 320;
        scrollRef.current.scrollBy({
          left: direction === 'left' ? -scrollAmount : scrollAmount,
          behavior: 'smooth',
        });
      }
    };

    if (items.length === 0) {
      return (
        <div className="mb-12 px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">{title}</h2>
          <div className="text-center py-12 text-gray-500">No products available</div>
        </div>
      );
    }

    return (
      <div className="mb-12">
        <div className="flex justify-between items-center mb-6 px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{title}</h2>
          <div className="flex items-center gap-3">
            {showViewAll && (
              <button className="text-sm text-blue-600 font-semibold hover:text-blue-700 transition-colors">
                View All
              </button>
            )}
            <div className="hidden md:flex gap-2">
              <button
                onClick={() => scroll('left')}
                className="w-10 h-10 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center hover:border-blue-500 hover:text-blue-600 transition-all shadow-md hover:shadow-lg"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={() => scroll('right')}
                className="w-10 h-10 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center hover:border-blue-500 hover:text-blue-600 transition-all shadow-md hover:shadow-lg"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto px-4 pb-4"
          style={{ 
            scrollbarWidth: 'none', 
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          {items.map((product) => (
            <div
              key={product.id}
              onClick={() => handleNavigate(`/product/${product.id}`)}
              className="min-w-[160px] md:min-w-[280px] bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer hover:scale-105 flex-shrink-0"
            >
              <div className="relative w-full pt-[100%]">
                <img
                  src={product.image}
                  alt={product.title}
                  className="absolute top-0 left-0 w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop';
                  }}
                />
                {product.discount > 0 && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                    {product.discount}% OFF
                  </div>
                )}
              </div>
              <div className="p-3 md:p-4">
                <h3 className="text-sm md:text-base font-semibold text-gray-900 truncate mb-2">
                  {product.title}
                </h3>
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center gap-1">
                    <Star size={14} fill="#fbbf24" color="#fbbf24" />
                    <span className="text-xs md:text-sm text-gray-600">{product.rating}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg md:text-xl font-bold text-gray-900">
                    ₹{product.price}
                  </span>
                  {product.originalPrice && (
                    <span className="text-xs md:text-sm text-gray-500 line-through">
                      ₹{product.originalPrice}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const GridSection = ({ title, items }) => {
    if (items.length === 0) {
      return (
        <div className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">{title}</h2>
          <div className="text-center py-12 text-gray-500">No products available</div>
        </div>
      );
    }

    // Show only 8 items (4 per row on desktop, 2 per row on mobile)
    const displayItems = items.slice(0, 8);

    return (
      <div className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">{title}</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {displayItems.map((product) => (
            <div
              key={product.id}
              onClick={() => handleNavigate(`/product/${product.id}`)}
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer hover:scale-105"
            >
              <div className="relative w-full pt-[100%]">
                <img
                  src={product.image}
                  alt={product.title}
                  className="absolute top-0 left-0 w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop';
                  }}
                />
                {product.discount > 0 && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                    {product.discount}% OFF
                  </div>
                )}
              </div>
              <div className="p-3 md:p-4">
                <h3 className="text-sm md:text-base font-semibold text-gray-900 truncate mb-1">
                  {product.title}
                </h3>
                <div className="flex items-center gap-1 mb-2">
                  <Star size={14} fill="#fbbf24" color="#fbbf24" />
                  <span className="text-xs md:text-sm text-gray-600">{product.rating}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-base md:text-xl font-bold text-gray-900">
                    ₹{product.price}
                  </span>
                  {product.originalPrice && (
                    <span className="text-xs md:text-sm text-gray-500 line-through">
                      ₹{product.originalPrice}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading amazing products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4">
          {/* Hero Images */}
          <div className="grid grid-cols-3 gap-3 md:gap-4 mb-6 md:mb-8">
            {heroImages.map((img, idx) => (
              <div
                key={idx}
                className="relative w-full pt-[133%] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105"
              >
                <img
                  src={img}
                  alt={`Fashion ${idx + 1}`}
                  className="absolute top-0 left-0 w-full h-full object-cover"
                />
              </div>
            ))}
          </div>

          {/* Category Buttons */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <button
              onClick={() => handleNavigate('/category/topwear')}
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 md:py-5 px-6 rounded-xl font-bold text-base md:text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <ShoppingBag size={24} />
              Top Wear
            </button>
            <button
              onClick={() => handleNavigate('/category/bottomwear')}
              className="bg-gradient-to-r from-purple-600 to-purple-700 text-white py-4 md:py-5 px-6 rounded-xl font-bold text-base md:text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <ShoppingBag size={24} />
              Bottom Wear
            </button>
          </div>

          {/* Instagram Section */}
          <div className="text-center mb-8">
            <a
              href="https://instagram.com/boltfit"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white px-6 md:px-8 py-3 md:py-4 rounded-full font-semibold text-base md:text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              <Instagram size={24} />
              Follow us on Instagram
              <ArrowRight size={20} />
            </a>
          </div>
        </div>
      </section>

      {/* Offer Items - Scrollable */}
      <section className="py-8 md:py-12">
        <div className="max-w-7xl mx-auto">
          <ScrollableSection title="🔥 Special Offers" items={offerItems} showViewAll={true} />
        </div>
      </section>

      {/* Best Price Items - Scrollable */}
      <section className="py-8 md:py-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <ScrollableSection title="💰 Best Lowest Price" items={bestPriceItems} showViewAll={true} />
        </div>
      </section>

      {/* Shirt Collection - Grid (8 items: 4x2 on desktop, 2x4 on mobile) */}
      <section className="py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4">
          <GridSection title="👔 Premium Shirt Collection" items={shirtItems} />
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-12 md:py-16 bg-gradient-to-br from-blue-600 to-purple-700">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl md:text-4xl font-bold text-white text-center mb-10 md:mb-12">
            Why Choose BOLT FIT?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 md:p-8 text-center hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                <Truck size={32} className="text-white" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-white mb-2 md:mb-3">
                Fast Delivery
              </h3>
              <p className="text-sm md:text-base text-white/90">
                Lightning-fast delivery to your doorstep. Get your fashion fix in no time!
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 md:p-8 text-center hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                <Shield size={32} className="text-white" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-white mb-2 md:mb-3">
                Premium Quality
              </h3>
              <p className="text-sm md:text-base text-white/90">
                Top-notch quality products. Every item is carefully selected and inspected.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 md:p-8 text-center hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                <Award size={32} className="text-white" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-white mb-2 md:mb-3">
                100% Trustable
              </h3>
              <p className="text-sm md:text-base text-white/90">
                25K+ happy customers trust us. Join our community of satisfied shoppers!
              </p>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        div[style*="scrollbarWidth"] {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        div[style*="scrollbarWidth"]::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}