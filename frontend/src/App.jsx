import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Layout Components
import Header from './components/Header';
import Footer from './components/Footer';

// Page Components
import Index from './pages/Index';
import CollectionsPage from './pages/CollectionsPage';
import CategoryPage from './pages/CategoryPage';
import ProductDetailPage from './pages/ProductDetailPage'; // ✅ ADD THIS IMPORT
import CustomerDetailsPage from './pages/CustomerDetailsPage';
import AddToCartPage from './pages/AddToCartPage';

// Add spinner CSS
const spinnerCSS = `
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
`;

if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = spinnerCSS;
  document.head.appendChild(style);
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider> {/* Wrap the whole app here */}
        <Router>
          <Header />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/collections" element={<CollectionsPage />} />
            <Route path="/category/:name" element={<CategoryPage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="/customer-details" element={<CustomerDetailsPage />} />
            <Route path="/cart" element={<AddToCartPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Footer />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}
