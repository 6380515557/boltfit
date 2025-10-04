import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  Star,
  ShoppingBag,
  Users,
  Award,
  Truck,
  ArrowRight,
  Shirt,
  Package,
} from 'lucide-react';
import './styles.css';  // Importing extracted CSS file

const APIBASEURL = "https://boltfit-backend-r4no.onrender.com/api/v1";

export default function Index() {
  const navigate = useNavigate();

  const newShirts = Array.from({ length: 8 }, (_, i) => ({
    id: i + 1,
    title: `Premium Shirt ${i + 1}`,
    price: 899 + i * 100,
    originalPrice: 1299 + i * 150,
    image: `https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop&randi=${i}`,
    rating: 4.5,
    discount: 30,
  }));

  const tshirtCollections = Array.from({ length: 8 }, (_, i) => ({
    id: i + 1,
    title: `Premium T-Shirt ${i + 1}`,
    price: 599 + i * 75,
    originalPrice: 899 + i * 100,
    image: `https://images.unsplash.com/photo-1583743814966-8936f37f1173?w=300&h=300&fit=crop&randi=${i}`,
    rating: 4.6,
    discount: 35,
  }));

  const newPants = Array.from({ length: 8 }, (_, i) => ({
    id: i + 1,
    title: `Premium Pants ${i + 1}`,
    price: 1299 + i * 200,
    originalPrice: 1899 + i * 250,
    image: `https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=300&h=300&fit=crop&randi=${i}`,
    rating: 4.3,
    discount: 25,
  }));

  const [apiProducts, setApiProducts] = useState({
    shirts: newShirts,
    tshirts: tshirtCollections,
    pants: newPants,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const [shirtsRes, tshirtsRes, pantsRes] = await Promise.all([
          fetch(`${APIBASEURL}/products?category=Shirts&perpage=8&isactive=true`),
          fetch(`${APIBASEURL}/products?category=T-Shirts&perpage=8&isactive=true`),
          fetch(`${APIBASEURL}/products?category=Pants&perpage=8&isactive=true`),
        ]);
        const shirtsData = shirtsRes.ok ? await shirtsRes.json() : { products: [] };
        const tshirtsData = tshirtsRes.ok ? await tshirtsRes.json() : { products: [] };
        const pantsData = pantsRes.ok ? await pantsRes.json() : { products: [] };

        const filterDuplicates = (products) => {
          const seenIds = new Set();
          return products.filter(product => {
            if (seenIds.has(product.id)) return false;
            seenIds.add(product.id);
            return true;
          });
        };

        const filteredShirts = filterDuplicates(shirtsData.products);
        const filteredTshirts = filterDuplicates(tshirtsData.products);
        const filteredPants = filterDuplicates(pantsData.products);

        const transform = (products, fallback) => (products.length > 0 ? products.map((product, i) => ({
          id: product.id,
          title: product.name,
          price: product.price,
          originalPrice: product.originalprice,
          discount: product.originalprice ? Math.round((product.originalprice - product.price) / product.originalprice * 100) : 30,
          image: product.images && product.images.length > 0 ? product.images[0] : fallback[i]?.image || fallback[0].image,
          rating: 4.5,
        })) : fallback);

        setApiProducts({
          shirts: transform(filteredShirts, newShirts),
          tshirts: transform(filteredTshirts, tshirtCollections),
          pants: transform(filteredPants, newPants),
        });
      } catch (error) {
        console.error("Error fetching products", error);
        setApiProducts({
          shirts: newShirts,
          tshirts: tshirtCollections,
          pants: newPants,
        });
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  // ScrollableSection Component
  const ScrollableSection = ({ title, items, delay = 0 }) => {
    const scrollContainer = useRef(null);

    const scroll = (direction) => {
      const container = scrollContainer.current;
      const scrollAmount = 320;
      if (container) {
        container.scrollBy({
          left: direction === 'left' ? -scrollAmount : scrollAmount,
          behavior: 'smooth',
        });
      }
    };

    return (
      <div className="scroll-section" style={{ animationDelay: `${delay}s` }}>
        <div className="scroll-header">
          <h3 className="scroll-title">{title}</h3>
          <div className="scroll-controls">
            <button onClick={() => scroll('left')} className="scroll-btn">
              <ChevronLeft size={20} />
            </button>
            <button onClick={() => scroll('right')} className="scroll-btn">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
        <div ref={scrollContainer} className="scroll-container">
          {items.map((product, index) => (
            <div
              key={product.id}
              className="product-card"
              style={{ animationDelay: `${delay + index * 0.1}s` }}
              onClick={() => navigate(`/product/${product.id}`)}
            >
              <div className="product-image-container">
                <img src={product.image} alt={product.title} className="product-image" />
                <div className="product-discount">{product.discount} OFF</div>
              </div>
              <div className="product-info">
                <h4 className="product-title">{product.title}</h4>
                <div className="product-rating">
                  <Star size={12} fill="#fbbf24" color="#fbbf24" />
                  <span className="rating-text">{product.rating}</span>
                </div>
                <div className="product-pricing">
                  <span className="product-price">${product.price}</span>
                  <span className="product-original-price">${product.originalPrice}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // PassionSection Component
  const PassionSection = ({ text, delay = 0 }) => (
    <div className="passion-section" style={{ animationDelay: `${delay}s` }}>
      <div className="passion-container">
        <div className="passion-line"></div>
        <h2 className="passion-text">{text}</h2>
        <div className="passion-line"></div>
      </div>
      <p className="passion-subtext">Crafted with love, designed for excellence</p>
    </div>
  );

  // StatsSection Component
  const StatsSection = () => (
    <div className="stats-section">
      <div className="stats-container">
        <h2 className="stats-title">Why Choose BOLT FIT?</h2>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon"><ShoppingBag size={32} /></div>
            <div className="stat-number">50K</div>
            <div className="stat-label">Products Sold</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon"><Users size={32} /></div>
            <div className="stat-number">25K</div>
            <div className="stat-label">Happy Customers</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon"><Award size={32} /></div>
            <div className="stat-number">4.8</div>
            <div className="stat-label">Average Rating</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon"><Truck size={32} /></div>
            <div className="stat-number">99</div>
            <div className="stat-label">On-Time Delivery</div>
          </div>
        </div>
      </div>
    </div>
  );

  // AnimatedDesign Component
  const AnimatedDesign = () => (
    <div className="animated-container">
      {/* Floating Icons */}
      <div className="floating-icon-1"><Shirt size={40} color="#3b82f6" /></div>
      <div className="floating-icon-2"><Package size={32} color="#8b5cf6" /></div>
      <div className="floating-icon-3"><ShoppingBag size={36} color="#06b6d4" /></div>
      {/* Animated Circles */}
      <div className="animated-circle-1"></div>
      <div className="animated-circle-2"></div>
      <div className="animated-circle-3"></div>
      {/* Central Design Elements */}
      <div className="central-element">
        <div className="inner-circle">
          <Star size={60} fill="#3b82f6" color="#3b82f6"/>
        </div>
      </div>
      {/* Animated Shapes */}
      <div className="shape-1"></div>
      <div className="shape-2"></div>
      <div className="shape-3"></div>
      {/* Gradient Orbs */}
      <div className="gradient-orb-1"></div>
      <div className="gradient-orb-2"></div>
    </div>
  );

  return (
    <>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="background-shapes">
          <div className="circle1"></div>
          <div className="circle2"></div>
        </div>
        <div className="left-content">
          <div className="badge"><Star size={16} fill="currentColor" /> Premium Mens Fashion</div>
          <h1 className="main-heading">
            <span className="elevate-text">Elevate Your</span><br />
            <span className="style-game-text">Style Game</span>
          </h1>
          <p className="description">
            Discover premium mens clothing that combines comfort, style, and affordability. From casual wear to trending fashion.
          </p>
          <div className="button-container">
            <button
              className="shop-now-button"
              onClick={() => navigate('category/trending')}
            >
              Shop Now <ArrowRight size={16} />
            </button>
            <button
              className="view-collection-button"
              onClick={() => {
                const collectionsSection = document.getElementById('collections');
                if (collectionsSection) {
                  collectionsSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              View Collection
            </button>
          </div>
          <div className="stats-container">
            <div className="stat-item">
              <Star className="stat-icon" size={20} fill="currentColor" />
              <span className="stat-text">4.85 Rating</span>
            </div>
            <div className="stat-item">
              <Users className="stat-icon" size={20} color="#10b981" />
              <span className="stat-text">1000 Happy Customers</span>
            </div>
            <div className="stat-item">
              <Truck className="stat-icon" size={20} color="#3b82f6" />
              <span className="stat-text">Fast Delivery</span>
            </div>
          </div>
        </div>
        <div className="right-content">
          <AnimatedDesign />
        </div>
      </section>

      {/* Collections Section */}
      <section id="collections" className="collections-section">
        <div className="collections-container">
          <ScrollableSection title="New Arrivals - Shirts" items={apiProducts.shirts} delay={0} />
          <PassionSection text="Style Meets Passion" delay={0.3} />
          <ScrollableSection title="T-Shirt Collections" items={apiProducts.tshirts} delay={0.6} />
          <PassionSection text="Comfort Redefined" delay={0.9} />
          <ScrollableSection title="Premium Pants Collection" items={apiProducts.pants} delay={1.2} />
        </div>
      </section>

      {/* Stats Section */}
      <StatsSection />
    </>
  );
}