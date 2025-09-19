import React, { useState, useEffect } from 'react';
import { ShoppingCart, Menu, X, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const categories = [
  { name: 'Shirts', path: '/category/shirts' },
  { name: 'Pants', path: '/category/pants' },
  { name: 'Trending', path: '/category/trending' },
];

function useCart() {
  const [items] = React.useState([{ id: 1, quantity: 2 }, { id: 2, quantity: 1 }]);
  const getTotalItems = () => items.reduce((acc, item) => acc + item.quantity, 0);
  return { getTotalItems };
}

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [screenSize, setScreenSize] = useState(window.innerWidth);
  const { getTotalItems } = useCart();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    const handleResize = () => {
      setScreenSize(window.innerWidth);
      if (window.innerWidth > 768) {
        setIsMenuOpen(false); // Close mobile menu on desktop
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const isActive = (path) => location.pathname === path;

  const isMobile = screenSize <= 768;
  const isTablet = screenSize <= 1024 && screenSize > 768;

  const styles = {
    header: {
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      backgroundColor: isScrolled ? 'rgba(255, 255, 255, 0.98)' : 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      boxShadow: isScrolled ? '0 8px 32px rgba(0, 0, 0, 0.12)' : '0 1px 3px rgba(0, 0, 0, 0.1)',
      borderBottom: `1px solid ${isScrolled ? 'rgba(59, 130, 246, 0.1)' : 'rgba(229, 231, 235, 0.8)'}`,
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      animation: 'slideDown 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
    },

    container: {
      maxWidth: '1400px',
      margin: '0 auto',
      padding: isMobile ? '16px 20px' : '20px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'relative'
    },

    logo: {
      fontSize: isMobile ? '24px' : '32px',
      fontWeight: '900',
      fontFamily: "'Poppins', 'Inter', sans-serif",
      color: '#3b82f6',
      textDecoration: 'none',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      letterSpacing: '-0.02em',
      background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text'
    },

    nav: {
      display: isMobile ? 'none' : 'flex',
      alignItems: 'center',
      gap: isTablet ? '20px' : '32px',
      fontFamily: "'Inter', 'Segoe UI', sans-serif"
    },

    navLink: {
      color: '#374151',
      textDecoration: 'none',
      fontSize: isTablet ? '15px' : '16px',
      fontWeight: '600',
      padding: isTablet ? '10px 16px' : '12px 20px',
      borderRadius: '12px',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      position: 'relative',
      letterSpacing: '0.01em'
    },

    navLinkActive: {
      color: '#3b82f6',
      backgroundColor: '#eff6ff',
      fontWeight: '700',
      boxShadow: '0 4px 12px rgba(59, 130, 246, 0.15)'
    },

    rightSection: {
      display: 'flex',
      alignItems: 'center',
      gap: isMobile ? '12px' : '16px'
    },

    cartButton: {
      position: 'relative',
      padding: isMobile ? '12px' : '14px',
      backgroundColor: 'white',
      border: '2px solid #e5e7eb',
      borderRadius: '14px',
      cursor: 'pointer',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      color: '#374151',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },

    cartBadge: {
      position: 'absolute',
      top: '-6px',
      right: '-6px',
      width: '22px',
      height: '22px',
      backgroundColor: '#ef4444',
      color: 'white',
      borderRadius: '50%',
      fontSize: '11px',
      fontWeight: '700',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      animation: 'bounce 2s infinite',
      boxShadow: '0 4px 8px rgba(239, 68, 68, 0.3)'
    },

    mobileMenuButton: {
      display: isMobile ? 'flex' : 'none',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '12px',
      backgroundColor: 'white',
      border: '2px solid #e5e7eb',
      borderRadius: '12px',
      cursor: 'pointer',
      color: '#374151',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
    },

    mobileMenu: {
      position: 'absolute',
      top: '100%',
      left: 0,
      right: 0,
      backgroundColor: 'rgba(255, 255, 255, 0.98)',
      backdropFilter: 'blur(20px)',
      boxShadow: '0 20px 40px -12px rgba(0, 0, 0, 0.15)',
      border: '1px solid rgba(59, 130, 246, 0.1)',
      borderRadius: '0 0 16px 16px',
      opacity: isMenuOpen ? 1 : 0,
      maxHeight: isMenuOpen ? '400px' : '0',
      overflow: 'hidden',
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      transform: `translateY(${isMenuOpen ? '0' : '-20px'})`,
      visibility: isMenuOpen ? 'visible' : 'hidden'
    },

    mobileNavLink: {
      display: 'block',
      padding: '18px 24px',
      color: '#374151',
      textDecoration: 'none',
      fontSize: '16px',
      fontWeight: '600',
      borderBottom: '1px solid rgba(243, 244, 246, 0.8)',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      fontFamily: "'Inter', 'Segoe UI', sans-serif"
    },

    mobileNavLinkActive: {
      color: '#3b82f6',
      backgroundColor: '#eff6ff',
      fontWeight: '700'
    },

    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
      zIndex: 999,
      opacity: isMenuOpen ? 1 : 0,
      visibility: isMenuOpen ? 'visible' : 'hidden',
      transition: 'all 0.3s ease'
    }
  };

  const animations = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Poppins:wght@400;500;600;700;800;900&display=swap');

    @keyframes slideDown {
      from {
        transform: translateY(-100%);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }

    @keyframes bounce {
      0%, 20%, 53%, 80%, 100% {
        transform: translate3d(0,0,0) scale(1);
      }
      40%, 43% {
        transform: translate3d(0,-8px,0) scale(1.1);
      }
      70% {
        transform: translate3d(0,-4px,0) scale(1.05);
      }
      90% {
        transform: translate3d(0,-2px,0) scale(1.02);
      }
    }

    .logo:hover {
      transform: scale(1.05) translateY(-2px);
      filter: drop-shadow(0 8px 16px rgba(59, 130, 246, 0.3));
    }

    .nav-link:hover {
      color: #3b82f6;
      background-color: #f8fafc;
      transform: translateY(-2px);
      box-shadow: 0 8px 16px rgba(59, 130, 246, 0.15);
    }

    .nav-link::before {
      content: '';
      position: absolute;
      bottom: 6px;
      left: 50%;
      width: 0;
      height: 3px;
      background: linear-gradient(90deg, #3b82f6, #1d4ed8);
      border-radius: 2px;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      transform: translateX(-50%);
    }

    .nav-link:hover::before {
      width: 80%;
    }

    .cart-button:hover {
      background-color: #f0f9ff;
      border-color: #3b82f6;
      color: #3b82f6;
      transform: translateY(-2px) scale(1.05);
      box-shadow: 0 12px 24px rgba(59, 130, 246, 0.25);
    }

    .mobile-menu-button:hover {
      background-color: #f0f9ff;
      border-color: #3b82f6;
      color: #3b82f6;
      transform: translateY(-1px) scale(1.05);
    }

    .mobile-nav-link:hover {
      background-color: #f0f9ff;
      color: #3b82f6;
      transform: translateX(8px);
    }

    .mobile-nav-link:last-child {
      border-bottom: none;
    }

    /* Ensure smooth transitions */
    * {
      -webkit-tap-highlight-color: transparent;
    }

    /* Hide scrollbar on mobile menu */
    .mobile-menu::-webkit-scrollbar {
      display: none;
    }
  `;

  return (
    <>
      <style>{animations}</style>
      
      {/* Overlay for mobile menu */}
      {isMenuOpen && <div style={styles.overlay} onClick={closeMenu} />}
      
      <header style={styles.header}>
        <div style={styles.container}>
          {/* Logo */}
          <Link to="/" style={styles.logo} className="logo" onClick={closeMenu}>
            BOLT FIT
          </Link>

          {/* Desktop/Tablet Navigation */}
          <nav style={styles.nav}>
            <Link
              to="/"
              style={{
                ...styles.navLink,
                ...(isActive('/') ? styles.navLinkActive : {})
              }}
              className="nav-link"
            >
              Home
            </Link>
            
            {categories.map((category) => (
              <Link
                key={category.path}
                to={category.path}
                style={{
                  ...styles.navLink,
                  ...(isActive(category.path) ? styles.navLinkActive : {})
                }}
                className="nav-link"
              >
                {category.name}
              </Link>
            ))}
            
            <Link
              to="/admin"
              style={{
                ...styles.navLink,
                ...(isActive('/admin') ? styles.navLinkActive : {})
              }}
              className="nav-link"
            >
              Admin
            </Link>
          </nav>

          {/* Right Section */}
          <div style={styles.rightSection}>
            {/* Cart Button */}
            <button style={styles.cartButton} className="cart-button">
              <ShoppingCart size={isMobile ? 20 : 24} />
              {getTotalItems() > 0 && (
                <span style={styles.cartBadge}>
                  {getTotalItems()}
                </span>
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              style={styles.mobileMenuButton}
              className="mobile-menu-button"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <nav style={styles.mobileMenu}>
          <Link
            to="/"
            style={{
              ...styles.mobileNavLink,
              ...(isActive('/') ? styles.mobileNavLinkActive : {})
            }}
            className="mobile-nav-link"
            onClick={closeMenu}
          >
            Home
          </Link>
          
          {categories.map((category) => (
            <Link
              key={category.path}
              to={category.path}
              style={{
                ...styles.mobileNavLink,
                ...(isActive(category.path) ? styles.mobileNavLinkActive : {})
              }}
              className="mobile-nav-link"
              onClick={closeMenu}
            >
              {category.name}
            </Link>
          ))}
          
          <Link
            to="/admin"
            style={{
              ...styles.mobileNavLink,
              ...(isActive('/admin') ? styles.mobileNavLinkActive : {})
            }}
            className="mobile-nav-link"
            onClick={closeMenu}
          >
            Admin
          </Link>
        </nav>
      </header>
    </>
  );
}
