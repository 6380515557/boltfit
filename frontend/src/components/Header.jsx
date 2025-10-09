import logo from "../pages/WhatsApp Image 2025-08-29 at 09.05.04_f275ed70.jpg";
import React, { useState, useEffect } from "react";
import { ShoppingCart, Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";


const categories = [
  { name: "Shirts", path: "/category/shirts" },
  { name: "Pants", path: "/category/pants" },
  { name: "Trending", path: "/category/trending" },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [screenSize, setScreenSize] = useState(window.innerWidth);
  const { getTotalItems } = useCart();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10);
    const onResize = () => {
      setScreenSize(window.innerWidth);
      if (window.innerWidth > 768) setIsMenuOpen(false);
    };
    window.addEventListener("scroll", onScroll);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);
  const isActive = (path) => location.pathname === path;
  const isMobile = screenSize <= 768;

  const palette = {
    white: "#fff",
    yellowLight: "#fffde7",
    yellowMid: "#fff59d",
    orangeLight: "#ffc947", // milder orange start
    orangeMid: "#ffb74d",   // milder orange end
    orangeDark: "#ffa726",
  };

  const styles = {
    header: {
      position: "sticky",
      top: 0,
      zIndex: 1200,
      background: isScrolled
        ? `linear-gradient(90deg, ${palette.yellowMid} 60%, ${palette.orangeMid} 100%)`
        : `linear-gradient(90deg, ${palette.white} 60%, ${palette.yellowLight} 100%)`,
      boxShadow: isScrolled
        ? "0 8px 30px rgba(255, 183, 77, 0.28)"
        : "0 1.5px 6px rgba(255, 241, 118, 0.16)",
      borderBottom: `1.5px solid ${
        isScrolled ? palette.orangeDark : palette.orangeMid
      }`,
      transition: "all 0.35s ease-in-out",
      userSelect: "none",
    },
    container: {
      maxWidth: 1400,
      margin: "0 auto",
      padding: isMobile ? "13px 16px" : "20px 26px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      position: "relative",
    },
    logoLink: {
      textDecoration: "none",
      outline: "none",
      display: "flex",
      alignItems: "center",
      gap: isMobile ? 8 : 12,
    },
    logoText: {
      fontSize: isMobile ? "22px" : "36px",
      fontWeight: 900,
      fontFamily: "'Poppins', 'Inter', sans-serif",
      letterSpacing: "3.5px",
      background: `linear-gradient(45deg, ${palette.orangeLight}, ${palette.orangeMid})`,
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text",
      cursor: "pointer",
      userSelect: "none",
      whiteSpace: "nowrap",
    },
    logoImage: {
      width: isMobile ? 56 : 72,
      height: isMobile ? 56 : 72,
      borderRadius: "50%",
      objectFit: "contain",
      backgroundColor: palette.white,
      border: `2px solid ${palette.orangeMid}`,
      boxShadow: "0 2px 24px rgba(255, 183, 77, 0.30)",
      userSelect: "none",
      marginLeft: isMobile ? 0 : "7px",
    },
    navDesktop: {
      display: isMobile ? "none" : "flex",
      gap: isMobile ? 12 : 26,
      fontFamily: "'Inter', 'Poppins', sans-serif",
    },
    navLink: {
      color: palette.orangeDark,
      fontWeight: 700,
      fontSize: isMobile ? 15 : 18,
      padding: isMobile ? "8px 14px" : "14px 20px",
      borderRadius: 13,
      textDecoration: "none",
      transition: "background-color 0.28s ease, color 0.28s ease",
      userSelect: "none",
      background: "none",
    },
    navLinkActive: {
      backgroundColor: palette.orangeMid,
      color: palette.white,
      fontWeight: 900,
      boxShadow: "0 5px 22px rgba(255, 183, 77, 0.45)",
    },
    headerRight: {
      display: "flex",
      alignItems: "center",
      gap: isMobile ? 16 : 22,
    },
    cartButton: {
      position: "relative",
      padding: isMobile ? 11 : 14,
      background: `linear-gradient(90deg, ${palette.orangeLight}, ${palette.orangeMid})`,
      border: `2px solid ${palette.orangeMid}`,
      borderRadius: 14,
      boxShadow: "0 3px 20px rgba(255, 183, 77, 0.35)",
      color: palette.orangeDark,
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      userSelect: "none",
      transition: "all 0.32s ease",
    },
    cartBadge: {
      position: "absolute",
      top: -6,
      right: -6,
      width: 20,
      height: 20,
      backgroundColor: palette.orangeDark,
      borderRadius: "50%",
      color: palette.white,
      fontSize: 12,
      fontWeight: 700,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: "0 3px 11px rgba(239, 134, 27, 0.3)",
      userSelect: "none",
    },
    mobileMenuButton: {
      display: isMobile ? "flex" : "none",
      alignItems: "center",
      justifyContent: "center",
      padding: 12,
      backgroundColor: palette.orangeMid,
      border: `2px solid ${palette.yellowMid}`,
      borderRadius: 14,
      cursor: "pointer",
      color: palette.white,
      userSelect: "none",
      boxShadow: "0 3px 15px rgba(255, 193, 7, 0.44)",
      transition: "all 0.3s ease",
    },
    mobileMenu: {
      position: "fixed",
      top: "66px",
      left: 0,
      right: 0,
      backgroundColor: palette.white,
      boxShadow: "0 26px 46px -10px rgba(255, 215, 59, 0.48)",
      borderRadius: "0 0 18px 18px",
      opacity: isMenuOpen ? 1 : 0,
      maxHeight: isMenuOpen ? "300px" : "0",
      visibility: isMenuOpen ? "visible" : "hidden",
      overflowY: "auto",
      transition: "opacity 0.33s ease, max-height 0.33s ease, visibility 0.33s ease",
      zIndex: 3000,
      userSelect: "none",
    },
    mobileNavLink: {
      display: "block",
      padding: "20px 28px",
      color: palette.orangeMid,
      fontWeight: 700,
      fontSize: 18,
      borderBottom: `1px solid ${palette.yellowMid}77`,
      textDecoration: "none",
      transition: "background-color 0.3s ease",
      userSelect: "none",
    },
    mobileNavLinkActive: {
      backgroundColor: palette.orangeDark,
      color: palette.white,
    },
    menuCloseButton: {
      position: "absolute",
      top: 12,
      right: 12,
      background: "transparent",
      border: "none",
      color: palette.orangeMid,
      cursor: "pointer",
      padding: 8,
      userSelect: "none",
    },
    overlay: {
      position: "fixed",
      inset: 0,
      backgroundColor: "rgba(255, 215, 59, 0.15)",
      opacity: isMenuOpen ? 1 : 0,
      visibility: isMenuOpen ? "visible" : "hidden",
      transition: "opacity 0.3s ease",
      zIndex: 2999,
      userSelect: "none",
    },
  };

  return (
    <header style={styles.header}>
      <div style={styles.container}>
        <Link to="/" style={styles.logoLink} aria-label="BoldFit Home" tabIndex={0}>
          {isMobile ? (
            <img src={logo} style={styles.logoImage} alt="BoldFit Logo" draggable={false} />
          ) : (
            <span style={styles.logoText}>BOLDFIT</span>
          )}
        </Link>

        {!isMobile && (
          <nav style={styles.navDesktop} aria-label="Main Navigation">
            {categories.map(({ name, path }) => (
              <Link
                key={name}
                to={path}
                style={{
                  ...styles.navLink,
                  ...(isActive(path) ? styles.navLinkActive : {}),
                }}
              >
                {name}
              </Link>
            ))}
          </nav>
        )}

        <div style={styles.headerRight}>
          <Link to="/cart" style={styles.cartButton} aria-label="View cart">
            <ShoppingCart size={24} />
            {getTotalItems() > 0 && (
              <span style={styles.cartBadge}>{getTotalItems()}</span>
            )}
          </Link>

          {isMobile && (
            <button
              style={styles.mobileMenuButton}
              onClick={toggleMenu}
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
            >
              <Menu size={28} />
            </button>
          )}
        </div>
      </div>

      {isMobile && (
        <>
          <nav style={styles.mobileMenu} aria-label="Mobile Navigation">
            <button
              style={styles.menuCloseButton}
              onClick={closeMenu}
              aria-label="Close menu"
            >
              <X size={28} />
            </button>
            {categories.map(({ name, path }) => (
              <Link
                key={name}
                to={path}
                style={{
                  ...styles.mobileNavLink,
                  ...(isActive(path) ? styles.mobileNavLinkActive : {}),
                }}
                onClick={closeMenu}
              >
                {name}
              </Link>
            ))}
          </nav>
          <div
            style={styles.overlay}
            onClick={closeMenu}
            aria-hidden={!isMenuOpen}
            tabIndex={-1}
          />
        </>
      )}
    </header>
  );
}
