import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Layout Components
import Header from './components/Header';
import Footer from './components/Footer';

// Page Components
import Index from './pages/Index';
import CollectionsPage from './pages/CollectionsPage';
import CategoryPage from './pages/CategoryPage';
import ProductDetailPage from './pages/ProductDetailPage'; // ✅ ADD THIS IMPORT
import CustomerDetailsPage from './pages/CustomerDetailsPage';

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
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<><Header /><Index /><Footer /></>} />
          <Route path="/collections" element={<><Header /><CollectionsPage /><Footer /></>} />
          <Route path="/category/:name" element={<><Header /><CategoryPage /><Footer /></>} />
          
          {/* ✅ ADD THIS ROUTE FOR PRODUCT DETAIL PAGE */}
          <Route path="/product/:id" element={<><Header /><ProductDetailPage /><Footer /></>} />
          <Route path="/customer-details" element={<CustomerDetailsPage />} />
        
          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
