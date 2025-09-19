import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import GoogleSignIn from './GoogleSignIn';
import { Shield, AlertCircle } from 'lucide-react';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  React.useEffect(() => {
    if (isAuthenticated) {
      const redirectTo = location.state?.from?.pathname || '/admin';
      navigate(redirectTo, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const handleLoginSuccess = (response) => {
    setError('');
    setSuccess(`Welcome back, ${response.admin.name}!`);
    
    setTimeout(() => {
      const redirectTo = location.state?.from?.pathname || '/admin';
      navigate(redirectTo, { replace: true });
    }, 1000);
  };

  const handleLoginError = (errorMessage) => {
    setError(errorMessage);
    setSuccess('');
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      fontFamily: "'Inter', sans-serif"
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '20px',
        padding: '48px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)',
        maxWidth: '400px',
        width: '100%',
        textAlign: 'center'
      }}>
        {/* Logo and Title */}
        <div style={{
          fontSize: '36px',
          fontWeight: '900',
          background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          marginBottom: '8px',
          fontFamily: "'Poppins', sans-serif"
        }}>
          BOLT FIT
        </div>
        
        <h1 style={{
          fontSize: '24px',
          fontWeight: '700',
          color: '#1f2937',
          marginBottom: '12px'
        }}>
          Admin Portal
        </h1>
        
        <p style={{
          fontSize: '16px',
          color: '#6b7280',
          marginBottom: '32px',
          lineHeight: '1.5'
        }}>
          Secure access for authorized administrators only
        </p>

        {/* Admin Badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: '#fef3c7',
          color: '#92400e',
          padding: '8px 16px',
          borderRadius: '12px',
          fontSize: '14px',
          fontWeight: '600',
          marginBottom: '32px'
        }}>
          <Shield size={16} />
          Admin Access Required
        </div>

        {/* Error Message */}
        {error && (
          <div style={{
            backgroundColor: '#fee2e2',
            color: '#991b1b',
            padding: '12px 16px',
            borderRadius: '12px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '14px',
            fontWeight: '500'
          }}>
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div style={{
            backgroundColor: '#dcfce7',
            color: '#166534',
            padding: '12px 16px',
            borderRadius: '12px',
            marginBottom: '20px',
            fontSize: '14px',
            fontWeight: '500'
          }}>
            {success}
          </div>
        )}

        {/* Google Sign-In */}
        <div style={{ marginBottom: '32px' }}>
          <GoogleSignIn 
            onSuccess={handleLoginSuccess}
            onError={handleLoginError}
          />
        </div>

        {/* Footer */}
        <div style={{ fontSize: '14px', color: '#9ca3af', lineHeight: '1.5' }}>
          <p>Only authorized admin accounts can access this portal.</p>
          <p>© 2025 BOLT FIT. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
