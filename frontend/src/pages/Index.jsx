import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Star, Loader } from "lucide-react";

const APIBASEURL = "https://boltfit-backend-r4no.onrender.com/api/v1";

const heroImages = [
  "https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=800&h=1000&fit=crop",
  "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&h=1000&fit=crop",
  "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=1000&fit=crop",
];

export default function Index() {
  const [offerItems, setOfferItems] = useState([]);
  const [bestPriceItems, setBestPriceItems] = useState([]);
  const [shirtItems, setShirtItems] = useState([]);
  const [loading, setLoading] = useState(true);

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
            discount: product.originalprice ? Math.round(((product.originalprice - product.price) / product.originalprice) * 100) : 0,
            image: product.images && product.images.length > 0 ? product.images[0] : heroImages[2],
            rating: 4.5,
          }));
        };
        setOfferItems(transform(filterDuplicates(offersData.products || [])));
        setBestPriceItems(transform(filterDuplicates(bestPriceData.products || [])));
        setShirtItems(transform(filterDuplicates(shirtsData.products || [])));
      } catch (error) {
        setOfferItems([]);
        setBestPriceItems([]);
        setShirtItems([]);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  // Navigation handlers
  const handleNavigate = (path) => {
    // Replace with your router logic
    console.log("Navigate to:", path);
  };

  // Scroll section for side-scroll product lists
  const ScrollableSection = ({ title, items }) => {
    const scrollRef = useRef(null);
    const scroll = (direction) => {
      if (scrollRef.current) {
        const scrollAmount = 320;
        scrollRef.current.scrollBy({
          left: direction === "left" ? -scrollAmount : scrollAmount,
          behavior: "smooth",
        });
      }
    };
    return (
      <section className="scroll-section">
        <h2 className="section-title">{title}</h2>
        <div className="scroll-container-wrapper">
          <button
            aria-label="Scroll Left"
            className="scroll-arrow scroll-left"
            onClick={() => scroll("left")}
            type="button"
          >
            <ChevronLeft size={32} />
          </button>
          <div className="scroll-container" ref={scrollRef}>
            {items.map((product) => (
              <div key={product.id} className="product-card">
                <img src={product.image} alt={product.title} className="product-img" />
                <div className="product-info">
                  <span className="product-title">{product.title}</span>
                  <div className="product-rating">
                    <Star size={16} color="#6366f1" />
                    <span>{product.rating}</span>
                  </div>
                  <span className="product-price">
                    ₹{product.price}
                  </span>
                  {product.discount > 0 && (
                    <span className="product-discount">{product.discount}% OFF</span>
                  )}
                </div>
              </div>
            ))}
          </div>
          <button
            aria-label="Scroll Right"
            className="scroll-arrow scroll-right"
            onClick={() => scroll("right")}
            type="button"
          >
            <ChevronRight size={32} />
          </button>
        </div>
      </section>
    );
  };

  // Grid section for 8 products
  const GridSection = ({ title, items }) => (
    <section className="grid-section">
      <h2 className="section-title">{title}</h2>
      <div className="grid-container">
        {items.slice(0, 8).map((product) => (
          <div key={product.id} className="product-card">
            <img src={product.image} alt={product.title} className="product-img" />
            <div className="product-info">
              <span className="product-title">{product.title}</span>
              <span className="product-price">
                ₹{product.price}
              </span>
              {product.discount > 0 && (
                <span className="product-discount">{product.discount}% OFF</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );

  return (
    <main className="index-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-images">
          {heroImages.map((img, idx) => (
            <div className="hero-image" key={idx} style={{ backgroundImage: `url(${img})` }}>
              {/* Buttons on center image only for clarity */}
              {idx === 1 && (
                <div className="hero-buttons">
                  <button
                    className="hero-btn"
                    onClick={() => handleNavigate("top-wear")}
                  >
                    Top Wear
                  </button>
                  <button
                    className="hero-btn"
                    onClick={() => handleNavigate("bottom-wear")}
                  >
                    Bottom Wear
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
      {/* Product Sections */}
      {loading ? (
        <div className="loading-spinner">
          <Loader size={48} /> Loading products...
        </div>
      ) : (
        <>
          <ScrollableSection title="Trending Products" items={offerItems} />
          <ScrollableSection title="Lowest Price Products" items={bestPriceItems} />
          <GridSection title="Shirts and Pants" items={shirtItems} />
        </>
      )}

      {/* Info Section */}
      <section className="info-section">
        <div className="info-text">
          <p>Lightning-fast delivery to your doorstep. Get your fashion fix in no time!</p>
          <p>Top-notch quality products. Every item is carefully selected and inspected.</p>
          <p>25K+ happy customers trust us. Join our community of satisfied shoppers!</p>
        </div>
      </section>
    </main>
  );
}
