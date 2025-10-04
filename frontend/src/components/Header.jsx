import React, { useState, useEffect } from 'react';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './Header.css';

const categories = [
  { name: 'Shirts', path: '/category/shirts' },
  { name: 'Pants', path: '/category/pants' },
  { name: 'Trending', path: '/category/trending' },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [screenSize, setScreenSize] = useState(window.innerWidth);
  const { getTotalItems } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

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

  // Navigate to cart page
  const goToCart = () => {
    closeMenu();
    navigate('/cart');
  };

  return (
    <>
      <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
        <div className="container">
          <Link to="/" className="logo">
            BOLDFIT
          </Link>

          <nav className={`nav ${isMobile ? 'hidden' : ''}`}>
            {categories.map((category) => (
              <Link
                key={category.path}
                to={category.path}
                className={`nav-link ${isActive(category.path) ? 'active' : ''}`}
                onClick={closeMenu}
              >
                {category.name}
              </Link>
            ))}
          </nav>

          <div className="right-section">
            <button className="cart-button" aria-label="Cart" onClick={goToCart}>
              <ShoppingCart size={24} />
              {getTotalItems() > 0 && <span className="cart-badge">{getTotalItems()}</span>}
            </button>

            <button className="mobile-menu-button" onClick={toggleMenu} aria-label="Toggle menu">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
          {categories.map((category) => (
            <Link
              key={category.path}
              to={category.path}
              className={`mobile-nav-link ${isActive(category.path) ? 'active' : ''}`}
              onClick={closeMenu}
            >
              {category.name}
            </Link>
          ))}
        </div>

        {/* Overlay for mobile menu */}
        {isMenuOpen && <div className="overlay" onClick={closeMenu}></div>}
      </header>
    </>
  );
}
