import React, { useState, useEffect } from 'react';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, Heart, ArrowUp, Send } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    alert(`Thank you for subscribing with email: ${email}`);
    setEmail('');
  };

  // Responsive breakpoints
  const isMobile = windowWidth <= 768;
  const isTablet = windowWidth > 768 && windowWidth <= 1024;
  const isDesktop = windowWidth > 1024;

  const styles = {
    footer: {
      background: 'linear-gradient(135deg, #1f1f1f 0%, #2d2d2d 50%, #1a1a1a 100%)',
      color: 'white',
      position: 'relative',
      overflow: 'hidden'
    },

    backgroundPattern: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundImage: `
        radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.05) 0%, transparent 50%),
        radial-gradient(circle at 75% 75%, rgba(255, 255, 255, 0.03) 0%, transparent 50%)
      `,
      pointerEvents: 'none'
    },

    mainSection: {
      padding: isMobile ? '40px 0' : isTablet ? '60px 0' : '80px 0',
      position: 'relative',
      zIndex: 10
    },

    mainContent: {
      maxWidth: '1400px',
      margin: '0 auto',
      padding: isMobile ? '0 16px' : '0 20px',
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : '2fr 1fr 1fr 1fr 1.5fr',
      gap: isMobile ? '40px' : isTablet ? '40px' : '50px'
    },

    // Brand Section
    brandSection: {
      animation: 'fadeIn 1s ease-out',
      gridColumn: isMobile ? '1' : isTablet ? 'span 2' : 'auto',
      textAlign: isMobile ? 'center' : 'left'
    },

    brandLogo: {
      fontSize: isMobile ? '28px' : isTablet ? '36px' : '42px',
      fontWeight: '900',
      marginBottom: isMobile ? '16px' : '24px',
      background: 'linear-gradient(135deg, #60a5fa, #3b82f6)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      fontFamily: "'Poppins', sans-serif"
    },

    brandDescription: {
      fontSize: isMobile ? '16px' : '18px',
      lineHeight: '1.8',
      opacity: '0.9',
      marginBottom: isMobile ? '24px' : '32px',
      color: '#e0e7ff',
      fontFamily: "'Inter', sans-serif"
    },

    socialLinks: {
      display: 'flex',
      gap: isMobile ? '16px' : '20px',
      marginBottom: isMobile ? '24px' : '28px',
      justifyContent: isMobile ? 'center' : 'flex-start',
      flexWrap: 'wrap'
    },

    socialLink: {
      width: isMobile ? '44px' : '52px',
      height: isMobile ? '44px' : '52px',
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      borderRadius: '18px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#e0e7ff',
      textDecoration: 'none',
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      border: '1px solid rgba(255, 255, 255, 0.2)'
    },

    contactInfo: {
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      alignItems: isMobile ? 'center' : 'flex-start',
      gap: isMobile ? '8px' : '12px',
      fontSize: isMobile ? '14px' : '16px',
      color: '#e0e7ff',
      fontFamily: "'Inter', sans-serif"
    },

    // Link Sections
    linkSection: {
      animation: 'slideUp 0.8s ease-out 0.2s both',
      textAlign: isMobile ? 'center' : 'left'
    },

    sectionTitle: {
      fontSize: isMobile ? '18px' : '22px',
      fontWeight: '700',
      marginBottom: isMobile ? '20px' : '28px',
      color: '#60a5fa',
      fontFamily: "'Poppins', sans-serif"
    },

    linkList: {
      listStyle: 'none',
      padding: 0,
      margin: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: isMobile ? 'center' : 'flex-start'
    },

    linkItem: {
      marginBottom: isMobile ? '14px' : '18px'
    },

    link: {
      color: '#e0e7ff',
      textDecoration: 'none',
      fontSize: isMobile ? '15px' : '16px',
      transition: 'all 0.3s ease',
      fontFamily: "'Inter', sans-serif"
    },

    // Newsletter Section
    newsletterSection: {
      animation: 'slideUp 0.8s ease-out 0.4s both',
      gridColumn: isMobile ? '1' : isTablet ? 'span 2' : 'auto',
      textAlign: isMobile ? 'center' : 'left'
    },

    newsletterTitle: {
      fontSize: isMobile ? '18px' : '22px',
      fontWeight: '700',
      marginBottom: isMobile ? '12px' : '16px',
      color: '#60a5fa',
      fontFamily: "'Poppins', sans-serif"
    },

    newsletterDescription: {
      fontSize: isMobile ? '14px' : '16px',
      opacity: '0.9',
      marginBottom: isMobile ? '20px' : '24px',
      color: '#e0e7ff',
      fontFamily: "'Inter', sans-serif"
    },

    newsletterForm: {
      display: 'flex',
      flexDirection: 'column',
      gap: isMobile ? '16px' : '20px',
      maxWidth: isMobile ? '100%' : '400px',
      margin: isMobile ? '0 auto' : '0'
    },

    emailInput: {
      padding: isMobile ? '14px 20px' : '18px 24px',
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      borderRadius: '18px',
      color: 'white',
      fontSize: isMobile ? '14px' : '16px',
      outline: 'none',
      transition: 'all 0.3s ease',
      fontFamily: "'Inter', sans-serif",
      width: '100%',
      boxSizing: 'border-box'
    },

    subscribeButton: {
      padding: isMobile ? '14px 24px' : '18px 28px',
      backgroundColor: '#3b82f6',
      color: 'white',
      border: 'none',
      borderRadius: '18px',
      fontSize: isMobile ? '14px' : '16px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.4s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px',
      fontFamily: "'Inter', sans-serif",
      width: '100%'
    },

    // Bottom Section
    bottomSection: {
      backgroundColor: 'rgba(0, 0, 0, 0.2)',
      padding: isMobile ? '30px 0' : '40px 0',
      borderTop: '1px solid rgba(255, 255, 255, 0.1)',
      position: 'relative',
      zIndex: 10
    },

    bottomContent: {
      maxWidth: '1400px',
      margin: '0 auto',
      padding: isMobile ? '0 16px' : '0 20px',
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: isMobile ? '20px' : '0',
      textAlign: isMobile ? 'center' : 'left'
    },

    copyright: {
      fontSize: isMobile ? '14px' : '16px',
      opacity: '0.8',
      display: 'flex',
      alignItems: 'center',
      justifyContent: isMobile ? 'center' : 'flex-start',
      gap: '8px',
      color: '#e0e7ff',
      fontFamily: "'Inter', sans-serif"
    },

    legalLinks: {
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      gap: isMobile ? '12px' : '40px',
      alignItems: 'center'
    },

    legalLink: {
      color: '#e0e7ff',
      textDecoration: 'none',
      fontSize: isMobile ? '14px' : '16px',
      transition: 'color 0.3s ease',
      fontFamily: "'Inter', sans-serif"
    },

    backToTopButton: {
      position: 'fixed',
      bottom: isMobile ? '20px' : '32px',
      right: isMobile ? '20px' : '32px',
      width: isMobile ? '52px' : '64px',
      height: isMobile ? '52px' : '64px',
      backgroundColor: '#3b82f6',
      border: 'none',
      borderRadius: '50%',
      color: 'white',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 16px 32px rgba(59, 130, 246, 0.4)',
      transition: 'all 0.4s ease',
      zIndex: 1000,
      opacity: showBackToTop ? 1 : 0,
      visibility: showBackToTop ? 'visible' : 'hidden'
    }
  };

  const animations = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Poppins:wght@300;400;500;600;700;800;900&display=swap');

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .social-link:hover {
      background-color: rgba(96, 165, 250, 0.2);
      transform: translateY(-4px) scale(1.05);
      color: #60a5fa;
      box-shadow: 0 8px 20px rgba(96, 165, 250, 0.3);
    }

    .social-link.facebook:hover { background-color: #1877f2; color: white; }
    .social-link.instagram:hover { background: linear-gradient(45deg, #f09433, #e6683c, #dc2743); color: white; }
    .social-link.twitter:hover { background-color: #1da1f2; color: white; }
    .social-link.email:hover { background-color: #ea4335; color: white; }

    .link:hover {
      color: #60a5fa;
      transform: translateX(4px);
    }

    .email-input:focus {
      border-color: rgba(96, 165, 250, 0.6);
      background-color: rgba(255, 255, 255, 0.15);
      box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
    }

    .email-input::placeholder {
      color: rgba(255, 255, 255, 0.6);
    }

    .subscribe-button:hover {
      background-color: #2563eb;
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(59, 130, 246, 0.4);
    }

    .legal-link:hover {
      color: #60a5fa;
    }

    .back-to-top:hover {
      background-color: #2563eb;
      transform: translateY(-4px) scale(1.1);
      box-shadow: 0 20px 40px rgba(59, 130, 246, 0.5);
    }

    /* Ensure proper touch targets on mobile */
    @media (max-width: 768px) {
      .social-link, .subscribe-button, .back-to-top {
        min-height: 44px;
        min-width: 44px;
      }
    }

    /* Hide scrollbar but keep functionality */
    * {
      scrollbar-width: thin;
      scrollbar-color: rgba(96, 165, 250, 0.3) transparent;
    }

    *::-webkit-scrollbar {
      width: 6px;
    }

    *::-webkit-scrollbar-track {
      background: transparent;
    }

    *::-webkit-scrollbar-thumb {
      background-color: rgba(96, 165, 250, 0.3);
      border-radius: 3px;
    }
  `;

  return (
    <>
      <style>{animations}</style>
      <footer style={styles.footer}>
        <div style={styles.backgroundPattern}></div>

        <div style={styles.mainSection}>
          <div style={styles.mainContent}>
            {/* Brand Section */}
            <div style={styles.brandSection}>
              <div style={styles.brandLogo}>BOLT FIT</div>
              <p style={styles.brandDescription}>
                Your premium destination for high-quality men's fashion. Style, comfort, and excellence in every piece.
              </p>
              
              <div style={styles.socialLinks}>
                <a href="#" style={styles.socialLink} className="social-link facebook">
                  <Facebook size={isMobile ? 20 : 24} />
                </a>
                <a href="#" style={styles.socialLink} className="social-link instagram">
                  <Instagram size={isMobile ? 20 : 24} />
                </a>
                <a href="#" style={styles.socialLink} className="social-link twitter">
                  <Twitter size={isMobile ? 20 : 24} />
                </a>
                <a href="#" style={styles.socialLink} className="social-link email">
                  <Mail size={isMobile ? 20 : 24} />
                </a>
              </div>

              <div style={styles.contactInfo}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Phone size={16} />
                  +91 98765 43210
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MapPin size={16} />
                  Mumbai, Maharashtra, India
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div style={styles.linkSection}>
              <h3 style={styles.sectionTitle}>Quick Links</h3>
              <ul style={styles.linkList}>
                <li style={styles.linkItem}>
                  <a href="#" style={styles.link} className="link">Home</a>
                </li>
                <li style={styles.linkItem}>
                  <a href="#" style={styles.link} className="link">Shirts</a>
                </li>
                <li style={styles.linkItem}>
                  <a href="#" style={styles.link} className="link">Pants</a>
                </li>
                <li style={styles.linkItem}>
                  <a href="#" style={styles.link} className="link">Trending</a>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div style={styles.linkSection}>
              <h3 style={styles.sectionTitle}>Support</h3>
              <ul style={styles.linkList}>
                <li style={styles.linkItem}>
                  <a href="#" style={styles.link} className="link">Contact Us</a>
                </li>
                <li style={styles.linkItem}>
                  <a href="#" style={styles.link} className="link">Size Guide</a>
                </li>
                <li style={styles.linkItem}>
                  <a href="#" style={styles.link} className="link">Returns</a>
                </li>
                <li style={styles.linkItem}>
                  <a href="#" style={styles.link} className="link">FAQ</a>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div style={styles.linkSection}>
              <h3 style={styles.sectionTitle}>Company</h3>
              <ul style={styles.linkList}>
                <li style={styles.linkItem}>
                  <a href="#" style={styles.link} className="link">About Us</a>
                </li>
                <li style={styles.linkItem}>
                  <a href="#" style={styles.link} className="link">Careers</a>
                </li>
                <li style={styles.linkItem}>
                  <a href="#" style={styles.link} className="link">Blog</a>
                </li>
                <li style={styles.linkItem}>
                  <a href="#" style={styles.link} className="link">Privacy</a>
                </li>
              </ul>
            </div>

            {/* Newsletter */}
            <div style={styles.newsletterSection}>
              <h3 style={styles.newsletterTitle}>Stay Connected</h3>
              <p style={styles.newsletterDescription}>
                Get exclusive offers and updates delivered to your inbox.
              </p>
              
              <form onSubmit={handleNewsletterSubmit} style={styles.newsletterForm}>
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={styles.emailInput}
                  className="email-input"
                  required
                />
                <button type="submit" style={styles.subscribeButton} className="subscribe-button">
                  <Send size={isMobile ? 16 : 20} />
                  Subscribe Now
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div style={styles.bottomSection}>
          <div style={styles.bottomContent}>
            <div style={styles.copyright}>
              © 2025 BOLT FIT. Made with <Heart size={16} fill="currentColor" color="#60a5fa" /> in India.
            </div>
            
            <div style={styles.legalLinks}>
              <a href="#" style={styles.legalLink} className="legal-link">Privacy Policy</a>
              <a href="#" style={styles.legalLink} className="legal-link">Terms of Service</a>
              <a href="#" style={styles.legalLink} className="legal-link">Cookie Policy</a>
            </div>
          </div>
        </div>

        {/* Back to Top Button */}
        <button
          onClick={scrollToTop}
          style={styles.backToTopButton}
          className="back-to-top"
        >
          <ArrowUp size={isMobile ? 20 : 28} />
        </button>
      </footer>
    </>
  );
}
