import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      setLoading(true);
      if (authService.isLoggedIn()) {
        const adminUser = await authService.verifyAdmin();
        setAdmin(adminUser);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      setAdmin(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const login = async (idToken) => {
    try {
      setLoading(true);
      const response = await authService.loginWithGoogle(idToken);
      setAdmin(response.admin);
      setIsAuthenticated(true);
      return response;
    } catch (error) {
      setAdmin(null);
      setIsAuthenticated(false);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setAdmin(null);
    setIsAuthenticated(false);
  };

  // Now this uses the authService method
  const getToken = () => {
    return authService.getToken();
  };

  const value = {
    admin,
    isAuthenticated,
    loading,
    login,
    logout,
    initializeAuth,
    getToken
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
