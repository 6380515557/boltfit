import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Star, ShoppingBag, Users, Award, Truck, ArrowRight, Shirt, Package } from 'lucide-react';
const API_BASE_URL = "http://localhost:8000/api/v1";

export default function Index() {
  const navigate = useNavigate();

  // Collections Data
  const newShirts = Array.from({ length: 8 }, (_, i) => ({
    id: i + 1,
    title: `Premium Shirt ${i + 1}`,
    price: 899 + i * 100,
    originalPrice: 1299 + i * 150,
    image: `https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop&rand=${i}`,
    rating: 4.5,
    discount: 30 + i * 2,
  }));

  const tshirtCollections = Array.from({ length: 8 }, (_, i) => ({
    id: i + 1,
    title: `Premium T-Shirt ${i + 1}`,
    price: 599 + i * 75,
    originalPrice: 899 + i * 100,
    image: `https://images.unsplash.com/photo-1583743814966-8936f37f1173?w=300&h=300&fit=crop&rand=${i}`,
    rating: 4.6,
    discount: 35 + i * 2,
  }));

  const newPants = Array.from({ length: 8 }, (_, i) => ({
    id: i + 1,
    title: `Premium Pants ${i + 1}`,
    price: 1299 + i * 200,
    originalPrice: 1899 + i * 250,
    image: `https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=300&h=300&fit=crop&rand=${i}`,
    rating: 4.3,
    discount: 25 + i * 3,
  }));


  // API products state
  const [apiProducts, setApiProducts] = useState({ shirts: [], tshirts: [], pants: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  // Fetch products with duplicate removal
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const [shirtsRes, tshirtsRes, pantsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/products/?category=Shirts&per_page=8&is_active=true`),
        fetch(`${API_BASE_URL}/products/?category=T-Shirts&per_page=8&is_active=true`),
        fetch(`${API_BASE_URL}/products/?category=Pants&per_page=8&is_active=true`)
      ]);

      const shirtsData = shirtsRes.ok ? await shirtsRes.json() : { products: [] };
      const tshirtsData = tshirtsRes.ok ? await tshirtsRes.json() : { products: [] };
      const pantsData = pantsRes.ok ? await pantsRes.json() : { products: [] };

      const seenIds = new Set();
      const filterDuplicates = (products) => {
        return products.filter(product => {
          if (seenIds.has(product.id)) return false;
          seenIds.add(product.id);
          return true;
        });
      };

      const filteredShirts = filterDuplicates(shirtsData.products);
      const filteredTshirts = filterDuplicates(tshirtsData.products);
      const filteredPants = filterDuplicates(pantsData.products);

      const transform = (products, fallback) =>
        products.length > 0
          ? products.map((product, i) => ({
              id: product.id,
              title: product.name,
              price: product.price,
              originalPrice: product.original_price || (product.price + 400),
              image:
                product.images && product.images.length > 0
                  ? product.images[0]
                  : fallback[i]?.image || fallback[0].image,
              rating: 4.5,
              discount: product.original_price
                ? Math.round(
                    ((product.original_price - product.price) / product.original_price) * 100
                  )
                : 30 + i * 2,
            }))
          : fallback;

      setApiProducts({
        shirts: transform(filteredShirts, newShirts),
        tshirts: transform(filteredTshirts, tshirtCollections),
        pants: transform(filteredPants, newPants),
      });
    } catch (error) {
      console.error("Error fetching products:", error);
      setApiProducts({ shirts: newShirts, tshirts: tshirtCollections, pants: newPants });
    } finally {
      setLoading(false);
    }
  };


  // Collections Components
  const ScrollableSection = ({ title, items, delay = 0 }) => {
    const scrollContainer = React.useRef(null);

    const scroll = (direction) => {
      const container = scrollContainer.current;
      const scrollAmount = 320;
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    };

    return (
      <div style={{...collectionsStyles.scrollSection, animationDelay: `${delay}s`}} className="scroll-section">
        <div style={collectionsStyles.scrollHeader}>
          <h3 style={collectionsStyles.scrollTitle}>{title}</h3>
          <div style={collectionsStyles.scrollControls}>
            <button onClick={() => scroll('left')} style={collectionsStyles.scrollButton} className="scroll-btn">
              <ChevronLeft size={20} />
            </button>
            <button onClick={() => scroll('right')} style={collectionsStyles.scrollButton} className="scroll-btn">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
        
        <div ref={scrollContainer} style={collectionsStyles.scrollContainer} className="scroll-container">
          {items.map((product, index) => (
            <div key={product.id} style={{...collectionsStyles.productCard, animationDelay: `${delay + index * 0.1}s`}} className="product-card"
                 onClick={() => navigate(`/product/${product.id}`)}>
              <div style={collectionsStyles.productImageContainer}>
                <img src={product.image} alt={product.title} style={collectionsStyles.productImage} />
                <div style={collectionsStyles.productDiscount}>{product.discount}% OFF</div>
              </div>
              <div style={collectionsStyles.productInfo}>
                <h4 style={collectionsStyles.productTitle}>{product.title}</h4>
                <div style={collectionsStyles.productRating}>
                  <Star size={12} fill="#fbbf24" color="#fbbf24" />
                  <span style={collectionsStyles.ratingText}>{product.rating}</span>
                </div>
                <div style={collectionsStyles.productPricing}>
                  <span style={collectionsStyles.productPrice}>₹{product.price}</span>
                  <span style={collectionsStyles.productOriginalPrice}>₹{product.originalPrice}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const PassionSection = ({ text, delay = 0 }) => {
    return (
      <div style={{...collectionsStyles.passionSection, animationDelay: `${delay}s`}} className="passion-section">
        <div style={collectionsStyles.passionContainer}>
          <div style={collectionsStyles.passionLine}></div>
          <h2 style={collectionsStyles.passionText} className="passion-text">
            {text}
          </h2>
          <div style={collectionsStyles.passionLine}></div>
        </div>
        <p style={collectionsStyles.passionSubtext} className="passion-subtext">
          Crafted with love, designed for excellence
        </p>
      </div>
    );
  };

  const StatsSection = () => {
    return (
      <div style={collectionsStyles.statsSection}>
        <div style={collectionsStyles.statsContainer}>
          <h2 style={collectionsStyles.statsTitle}>Why Choose BOLT FIT?</h2>
          <div style={collectionsStyles.statsGrid}>
            <div style={collectionsStyles.statCard} className="stat-card">
              <div style={collectionsStyles.statIcon}>
                <ShoppingBag size={32} />
              </div>
              <div style={collectionsStyles.statNumber}>50K+</div>
              <div style={collectionsStyles.statLabel}>Products Sold</div>
            </div>
            
            <div style={collectionsStyles.statCard} className="stat-card">
              <div style={collectionsStyles.statIcon}>
                <Users size={32} />
              </div>
              <div style={collectionsStyles.statNumber}>25K+</div>
              <div style={collectionsStyles.statLabel}>Happy Customers</div>
            </div>
            
            <div style={collectionsStyles.statCard} className="stat-card">
              <div style={collectionsStyles.statIcon}>
                <Award size={32} />
              </div>
              <div style={collectionsStyles.statNumber}>4.8★</div>
              <div style={collectionsStyles.statLabel}>Average Rating</div>
            </div>
            
            <div style={collectionsStyles.statCard} className="stat-card">
              <div style={collectionsStyles.statIcon}>
                <Truck size={32} />
              </div>
              <div style={collectionsStyles.statNumber}>99%</div>
              <div style={collectionsStyles.statLabel}>On-Time Delivery</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Animated Design Component
  const AnimatedDesign = () => {
    return (
      <div style={styles.animatedContainer}>
        {/* Floating Icons */}
        <div style={styles.floatingIcon1} className="floating-icon-1">
          <Shirt size={40} color="#3b82f6" />
        </div>
        <div style={styles.floatingIcon2} className="floating-icon-2">
          <Package size={32} color="#8b5cf6" />
        </div>
        <div style={styles.floatingIcon3} className="floating-icon-3">
          <ShoppingBag size={36} color="#06b6d4" />
        </div>

        {/* Animated Circles */}
        <div style={styles.animatedCircle1} className="animated-circle-1"></div>
        <div style={styles.animatedCircle2} className="animated-circle-2"></div>
        <div style={styles.animatedCircle3} className="animated-circle-3"></div>

        {/* Central Design Element */}
        <div style={styles.centralElement} className="central-element">
          <div style={styles.innerCircle} className="inner-circle">
            <div style={styles.brandIcon}>
              <Star size={60} fill="#3b82f6" color="#3b82f6" />
            </div>
          </div>
        </div>

        {/* Animated Shapes */}
        <div style={styles.shape1} className="shape-1"></div>
        <div style={styles.shape2} className="shape-2"></div>
        <div style={styles.shape3} className="shape-3"></div>

        {/* Gradient Orbs */}
        <div style={styles.gradientOrb1} className="gradient-orb-1"></div>
        <div style={styles.gradientOrb2} className="gradient-orb-2"></div>
      </div>
    );
  };

  // Original Homepage Styles
  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      fontFamily: "'Inter', 'Poppins', sans-serif"
    },

    heroSection: {
      maxWidth: '1400px',
      margin: '0 auto',
      padding: '120px 20px 80px',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '80px',
      alignItems: 'center',
      position: 'relative'
    },

    backgroundShapes: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      overflow: 'hidden',
      zIndex: 1
    },

    circle1: {
      position: 'absolute',
      width: '200px',
      height: '200px',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      borderRadius: '50%',
      top: '10%',
      right: '10%',
      animation: 'float 6s ease-in-out infinite'
    },

    circle2: {
      position: 'absolute',
      width: '150px',
      height: '150px',
      backgroundColor: 'rgba(147, 51, 234, 0.1)',
      borderRadius: '50%',
      bottom: '20%',
      right: '5%',
      animation: 'float 8s ease-in-out infinite reverse'
    },

    leftContent: {
      zIndex: 10,
      position: 'relative'
    },

    badge: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      backgroundColor: '#3b82f6',
      color: 'white',
      padding: '8px 16px',
      borderRadius: '50px',
      fontSize: '14px',
      fontWeight: '600',
      marginBottom: '32px',
      animation: 'slideInLeft 1s ease-out'
    },

    mainHeading: {
      fontSize: '64px',
      fontWeight: '900',
      lineHeight: '1.1',
      marginBottom: '24px',
      fontFamily: "'Poppins', sans-serif",
      letterSpacing: '-0.02em'
    },

    elevateText: {
      color: '#1f2937'
    },

    styleGameText: {
      background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text'
    },

    description: {
      fontSize: '18px',
      color: '#6b7280',
      lineHeight: '1.7',
      marginBottom: '40px',
      fontFamily: "'Inter', sans-serif",
      animation: 'slideInLeft 1s ease-out 0.3s both'
    },

    buttonContainer: {
      display: 'flex',
      gap: '16px',
      marginBottom: '60px',
      animation: 'slideInLeft 1s ease-out 0.6s both'
    },

    shopNowButton: {
      backgroundColor: '#3b82f6',
      color: 'white',
      border: 'none',
      padding: '16px 32px',
      borderRadius: '12px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      boxShadow: '0 8px 25px rgba(59, 130, 246, 0.3)'
    },

    viewCollectionButton: {
      backgroundColor: 'transparent',
      color: '#374151',
      border: '2px solid #e5e7eb',
      padding: '16px 32px',
      borderRadius: '12px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease'
    },

    statsContainer: {
      display: 'flex',
      gap: '40px',
      animation: 'slideInLeft 1s ease-out 0.9s both'
    },

    statItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },

    statIcon: {
      color: '#fbbf24'
    },

    statText: {
      fontSize: '14px',
      color: '#6b7280',
      fontWeight: '500'
    },

    // Animated Design Styles
    rightContent: {
      position: 'relative',
      zIndex: 10,
      animation: 'slideInRight 1s ease-out 0.5s both',
      height: '500px',
      width: '100%'
    },

    animatedContainer: {
      position: 'relative',
      width: '100%',
      height: '100%',
      overflow: 'hidden'
    },

    // Floating Icons
    floatingIcon1: {
      position: 'absolute',
      top: '10%',
      left: '20%',
      animation: 'floatUpDown 4s ease-in-out infinite',
      zIndex: 5
    },

    floatingIcon2: {
      position: 'absolute',
      top: '60%',
      right: '10%',
      animation: 'floatUpDown 5s ease-in-out infinite reverse',
      zIndex: 5
    },

    floatingIcon3: {
      position: 'absolute',
      bottom: '15%',
      left: '15%',
      animation: 'floatUpDown 6s ease-in-out infinite',
      zIndex: 5
    },

    // Animated Circles
    animatedCircle1: {
      position: 'absolute',
      width: '120px',
      height: '120px',
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
      top: '5%',
      right: '15%',
      animation: 'rotateScale 8s ease-in-out infinite',
      opacity: 0.8
    },

    animatedCircle2: {
      position: 'absolute',
      width: '80px',
      height: '80px',
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
      bottom: '20%',
      right: '25%',
      animation: 'rotateScale 6s ease-in-out infinite reverse',
      opacity: 0.7
    },

    animatedCircle3: {
      position: 'absolute',
      width: '60px',
      height: '60px',
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #10b981, #3b82f6)',
      top: '40%',
      left: '10%',
      animation: 'rotateScale 10s ease-in-out infinite',
      opacity: 0.6
    },

    // Central Element
    centralElement: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '200px',
      height: '200px',
      borderRadius: '50%',
      background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1))',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      animation: 'pulse 4s ease-in-out infinite',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10
    },

    innerCircle: {
      width: '120px',
      height: '120px',
      borderRadius: '50%',
      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(248, 250, 252, 0.8))',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      animation: 'counterRotate 8s linear infinite'
    },

    brandIcon: {
      animation: 'glow 3s ease-in-out infinite alternate'
    },

    // Animated Shapes
    shape1: {
      position: 'absolute',
      width: '40px',
      height: '40px',
      backgroundColor: '#f59e0b',
      top: '25%',
      right: '5%',
      clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
      animation: 'rotate 12s linear infinite',
      opacity: 0.7
    },

    shape2: {
      position: 'absolute',
      width: '30px',
      height: '30px',
      backgroundColor: '#ef4444',
      bottom: '10%',
      left: '40%',
      borderRadius: '4px',
      animation: 'rotate 15s linear infinite reverse',
      opacity: 0.8
    },

    shape3: {
      position: 'absolute',
      width: '35px',
      height: '35px',
      backgroundColor: '#10b981',
      top: '15%',
      left: '45%',
      clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
      animation: 'rotate 10s linear infinite',
      opacity: 0.6
    },

    // Gradient Orbs
    gradientOrb1: {
      position: 'absolute',
      width: '150px',
      height: '150px',
      borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(59, 130, 246, 0.2), transparent)',
      top: '0%',
      right: '0%',
      animation: 'moveOrb1 20s ease-in-out infinite',
      filter: 'blur(1px)'
    },

    gradientOrb2: {
      position: 'absolute',
      width: '100px',
      height: '100px',
      borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(139, 92, 246, 0.2), transparent)',
      bottom: '0%',
      left: '0%',
      animation: 'moveOrb2 25s ease-in-out infinite',
      filter: 'blur(1px)'
    }
  };

  // Collections Styles (same as before)
  const collectionsStyles = {
    collectionsSection: {
      backgroundColor: '#ffffff',
      padding: '80px 0',
      marginTop: '40px',
      borderTop: '1px solid #e2e8f0'
    },

    collectionsContainer: {
      maxWidth: '1400px',
      margin: '0 auto',
      padding: '0 20px'
    },

    scrollSection: {
      marginBottom: '60px',
      animation: 'slideUp 0.8s ease-out both'
    },

    scrollHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '32px'
    },

    scrollTitle: {
      fontSize: '36px',
      fontWeight: '800',
      color: '#1f2937',
      margin: 0,
      fontFamily: "'Poppins', sans-serif",
      background: 'linear-gradient(135deg, #1f2937, #3b82f6)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text'
    },

    scrollControls: {
      display: 'flex',
      gap: '12px'
    },

    scrollButton: {
      width: '48px',
      height: '48px',
      borderRadius: '50%',
      border: '2px solid #e5e7eb',
      backgroundColor: 'white',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.3s ease',
      color: '#6b7280',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07)'
    },

    scrollContainer: {
      display: 'flex',
      gap: '24px',
      overflowX: 'auto',
      scrollbarWidth: 'none',
      msOverflowStyle: 'none',
      paddingBottom: '16px'
    },

    productCard: {
      minWidth: '300px',
      backgroundColor: 'white',
      borderRadius: '20px',
      overflow: 'hidden',
      boxShadow: '0 8px 25px rgba(0, 0, 0, 0.08)',
      border: '1px solid #f1f5f9',
      transition: 'all 0.4s ease',
      cursor: 'pointer',
      animation: 'fadeInUp 0.6s ease-out both'
    },

    productImageContainer: {
      position: 'relative',
      width: '100%',
      height: '220px',
      overflow: 'hidden'
    },

    productImage: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      transition: 'transform 0.5s ease'
    },

    productDiscount: {
      position: 'absolute',
      top: '16px',
      right: '16px',
      backgroundColor: '#ef4444',
      color: 'white',
      padding: '6px 12px',
      borderRadius: '16px',
      fontSize: '12px',
      fontWeight: '700',
      boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)'
    },

    productInfo: {
      padding: '20px'
    },

    productTitle: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#1f2937',
      marginBottom: '10px',
      fontFamily: "'Poppins', sans-serif"
    },

    productRating: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      marginBottom: '12px'
    },

    ratingText: {
      fontSize: '14px',
      color: '#6b7280',
      fontWeight: '500'
    },

    productPricing: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    },

    productPrice: {
      fontSize: '20px',
      fontWeight: '700',
      color: '#1f2937',
      fontFamily: "'Poppins', sans-serif"
    },

    productOriginalPrice: {
      fontSize: '16px',
      color: '#9ca3af',
      textDecoration: 'line-through'
    },

    // Passion Section
    passionSection: {
      margin: '80px 0',
      textAlign: 'center',
      animation: 'slideUp 1s ease-out both'
    },

    passionContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '40px',
      marginBottom: '20px'
    },

    passionLine: {
      width: '120px',
      height: '2px',
      background: 'linear-gradient(90deg, transparent, #3b82f6, transparent)',
      animation: 'expandLine 2s ease-out infinite alternate'
    },

    passionText: {
      fontSize: '44px',
      fontWeight: '800',
      background: 'linear-gradient(135deg, #3b82f6, #1d4ed8, #7c3aed)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      margin: 0,
      animation: 'textShimmer 3s ease-in-out infinite',
      backgroundSize: '200% 200%',
      fontFamily: "'Poppins', sans-serif"
    },

    passionSubtext: {
      fontSize: '18px',
      color: '#6b7280',
      fontWeight: '500',
      opacity: '0.8',
      fontStyle: 'italic'
    },

    // Stats Section
    statsSection: {
      backgroundColor: '#f8fafc',
      padding: '80px 0',
      marginTop: '60px'
    },

    statsContainer: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 20px',
      textAlign: 'center'
    },

    statsTitle: {
      fontSize: '48px',
      fontWeight: '900',
      color: '#1f2937',
      marginBottom: '60px',
      fontFamily: "'Poppins', sans-serif"
    },

    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '32px',
      maxWidth: '1000px',
      margin: '0 auto'
    },

    statCard: {
      padding: '20px 16px',
      background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 50%, #1d4ed8 100%)',
      borderRadius: '20px',
      transition: 'all 0.4s ease',
      boxShadow: '0 8px 20px rgba(59, 130, 246, 0.3)',
      color: 'white',
      textAlign: 'center'
    },

    statIcon: {
      width: '48px',
      height: '48px',
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      borderRadius: '16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 16px',
      color: 'white'
    },

    statNumber: {
      fontSize: '32px',
      fontWeight: '800',
      marginBottom: '8px',
      fontFamily: "'Poppins', sans-serif"
    },

    statLabel: {
      fontSize: '14px',
      fontWeight: '500'
    }
  };

  const animations = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Poppins:wght@300;400;500;600;700;800;900&display=swap');

    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-20px); }
    }

    @keyframes slideInLeft {
      from {
        opacity: 0;
        transform: translateX(-50px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    @keyframes slideInRight {
      from {
        opacity: 0;
        transform: translateX(50px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    @keyframes floatUpDown {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      50% { transform: translateY(-30px) rotate(10deg); }
    }

    @keyframes rotateScale {
      0%, 100% { 
        transform: rotate(0deg) scale(1); 
        opacity: 0.5;
      }
      50% { 
        transform: rotate(180deg) scale(1.2); 
        opacity: 0.8;
      }
    }

    @keyframes pulse {
      0%, 100% { 
        transform: translate(-50%, -50%) scale(1);
        box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
      }
      50% { 
        transform: translate(-50%, -50%) scale(1.05);
        box-shadow: 0 0 40px rgba(59, 130, 246, 0.5);
      }
    }

    @keyframes counterRotate {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(-360deg); }
    }

    @keyframes glow {
      0%, 100% { 
        filter: drop-shadow(0 0 10px rgba(59, 130, 246, 0.5));
        transform: scale(1);
      }
      50% { 
        filter: drop-shadow(0 0 20px rgba(59, 130, 246, 0.8));
        transform: scale(1.1);
      }
    }

    @keyframes rotate {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    @keyframes moveOrb1 {
      0%, 100% { transform: translate(0, 0); }
      25% { transform: translate(-30px, -40px); }
      50% { transform: translate(20px, -20px); }
      75% { transform: translate(-10px, 30px); }
    }

    @keyframes moveOrb2 {
      0%, 100% { transform: translate(0, 0); }
      33% { transform: translate(40px, -30px); }
      66% { transform: translate(-20px, -40px); }
    }

    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(50px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
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

    @keyframes textShimmer {
      0%, 100% { background-position: -200% 0; }
      50% { background-position: 200% 0; }
    }

    @keyframes expandLine {
      0% { transform: scaleX(0.5); opacity: 0.5; }
      100% { transform: scaleX(1); opacity: 1; }
    }

    .scroll-container::-webkit-scrollbar {
      display: none;
    }

    .shop-now-button:hover {
      background-color: #2563eb;
      transform: translateY(-2px);
      box-shadow: 0 12px 30px rgba(59, 130, 246, 0.4);
    }

    .view-collection-button:hover {
      background-color: #f9fafb;
      border-color: #3b82f6;
      color: #3b82f6;
    }

    .scroll-btn:hover {
      background-color: #3b82f6;
      color: white;
      border-color: #3b82f6;
      transform: scale(1.1);
    }

    .product-card:hover {
      transform: translateY(-12px) scale(1.02);
      box-shadow: 0 20px 50px rgba(59, 130, 246, 0.15);
    }

    .product-card:hover .product-image {
      transform: scale(1.08);
    }

    .stat-card:hover {
      transform: translateY(-12px);
      box-shadow: 0 25px 50px rgba(59, 130, 246, 0.4);
    }

    @media (max-width: 1024px) {
      .hero-section {
        grid-template-columns: 1fr;
        gap: 40px;
        text-align: center;
      }
      
      .main-heading {
        font-size: 48px;
      }
      
      .stats-container {
        justify-content: center;
        flex-wrap: wrap;
      }
    }

    @media (max-width: 768px) {
      .hero-section {
        padding: 80px 20px 60px;
      }
      
      .main-heading {
        font-size: 36px;
      }
      
      .button-container {
        flex-direction: column;
        align-items: center;
      }
      
      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 20px;
      }
      
      .stats-container {
        gap: 20px;
      }
      
      .right-content {
        height: 300px;
      }
    }
  `;

  return (
    <>
      <style>{animations}</style>
      <div style={styles.container}>
        {/* HERO SECTION WITH ANIMATED DESIGN */}
        <section style={styles.heroSection} className="hero-section">
          <div style={styles.backgroundShapes}>
            <div style={styles.circle1}></div>
            <div style={styles.circle2}></div>
          </div>

          <div style={styles.leftContent}>
            <div style={styles.badge}>
              <Star size={16} fill="currentColor" />
              Premium Men's Fashion
            </div>

            <h1 style={styles.mainHeading}>
              <span style={styles.elevateText}>Elevate Your</span><br />
              <span style={styles.styleGameText}>Style Game</span>
            </h1>

            <p style={styles.description}>
              Discover premium men's clothing that combines comfort, style, and affordability. From casual wear to trending fashion.
            </p>

            <div style={styles.buttonContainer}>
              <button 
                style={styles.shopNowButton} 
                className="shop-now-button"
                onClick={() => navigate('/category/trending')}
              >
                Shop Now
                <ArrowRight size={16} />
              </button>
              <button 
                style={styles.viewCollectionButton} 
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

            <div style={styles.statsContainer} className="stats-container">
              <div style={styles.statItem}>
                <Star style={styles.statIcon} size={20} fill="currentColor" />
                <span style={styles.statText}>4.8/5 Rating</span>
              </div>
              <div style={styles.statItem}>
                <Users style={{color: '#10b981'}} size={20} />
                <span style={styles.statText}>1000+ Happy Customers</span>
              </div>
              <div style={styles.statItem}>
                <Truck style={{color: '#3b82f6'}} size={20} />
                <span style={styles.statText}>Fast Delivery</span>
              </div>
            </div>
          </div>

          <div style={styles.rightContent} className="right-content">
            <AnimatedDesign />
          </div>
        </section>

        {/* COLLECTIONS SECTION */}
        <section id="collections" style={collectionsStyles.collectionsSection}>
          <div style={collectionsStyles.collectionsContainer}>
            <ScrollableSection title="New Arrivals - Shirts" items={apiProducts.shirts} delay={0} />
            
            <PassionSection text="Style Meets Passion" delay={0.3} />
            
            <ScrollableSection title="T-Shirt Collections" items={apiProducts.tshirts} delay={0.6} />
            
            <PassionSection text="Comfort Redefined" delay={0.9} />
            
            <ScrollableSection title="Premium Pants Collection" items={apiProducts.pants} delay={1.2} />
          </div>
        </section>

        <StatsSection />
      </div>
    </>
  );
}
