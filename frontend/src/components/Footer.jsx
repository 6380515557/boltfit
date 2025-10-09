import React, { useState, useEffect } from 'react';
import {
  Facebook,
  Instagram,
  Twitter,
  Mail,
  Phone,
  MapPin,
  Heart,
  ArrowUp,
  Send
} from 'lucide-react';
import './Footer.css';

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

  const isMobile = windowWidth <= 768;

  return (
    <footer className="bf-footer">
      <div className="bf-footer-background" />
      <section className="bf-footer-main">
        <div className="bf-footer-content">
          <div className="bf-brand-section">
            <h2 className="bf-brand-logo">BOLDFIT</h2>
            {!isMobile && (
              <p className="bf-brand-description">
                Premium activewear designed for the bold and unstoppable. Quality, style, and comfort in every stitch.
              </p>
            )}
            <div className="bf-social-links">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bf-social-link facebook"
                aria-label="Facebook"
              >
                <Facebook size={24} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bf-social-link instagram"
                aria-label="Instagram"
              >
                <Instagram size={24} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bf-social-link twitter"
                aria-label="Twitter"
              >
                <Twitter size={24} />
              </a>
              <a
                href="mailto:support@boldfit.com"
                className="bf-social-link email"
                aria-label="Email"
              >
                <Mail size={24} />
              </a>
            </div>
          </div>

          {/* Links Sections */}
          {!isMobile && (
            <>
              <div className="bf-links-section">
                <h3>Customer Service</h3>
                <ul>
                  <li><a href="/help">Help Center</a></li>
                  <li><a href="/returns">Returns</a></li>
                  <li><a href="/shipping">Shipping Info</a></li>
                  <li><a href="/contact">Contact Us</a></li>
                </ul>
              </div>
              <div className="bf-links-section">
                <h3>Company</h3>
                <ul>
                  <li><a href="/about">About BoldFit</a></li>
                  <li><a href="/careers">Careers</a></li>
                  <li><a href="/press">Press</a></li>
                  <li><a href="/blog">Blog</a></li>
                </ul>
              </div>
              <div className="bf-links-section">
                <h3>Policies</h3>
                <ul>
                  <li><a href="/privacy">Privacy Policy</a></li>
                  <li><a href="/terms">Terms of Service</a></li>
                  <li><a href="/security">Security</a></li>
                </ul>
              </div>
            </>
          )}

          <div className="bf-newsletter-section">
            <h3>Subscribe to our Newsletter</h3>
            {!isMobile && (
              <p>Get the latest news, offers and styles delivered to your inbox.</p>
            )}
            <form onSubmit={handleNewsletterSubmit} className="bf-newsletter-form">
              <input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                aria-label="Email Address"
                className="bf-email-input"
              />
              <button type="submit" className="bf-subscribe-button" aria-label="Subscribe">
                <Send size={20} />
              </button>
            </form>
          </div>
        </div>
      </section>

      <section className="bf-footer-bottom">
        <div className="bf-footer-bottom-content">
          <p className="bf-copyright">
            &copy; {new Date().getFullYear()} BoldFit. All rights reserved.
          </p>
          {!isMobile && (
            <nav className="bf-legal-links">
              <a href="/privacy">Privacy Policy</a>
              <a href="/terms">Terms of Service</a>
              <a href="/cookies">Cookie Policy</a>
            </nav>
          )}
        </div>
      </section>

      {showBackToTop && (
        <button 
          className="bf-back-to-top" 
          onClick={scrollToTop} 
          aria-label="Back to Top"
          title="Back to Top"
        >
          <ArrowUp size={28} />
        </button>
      )}
    </footer>
  );
}
