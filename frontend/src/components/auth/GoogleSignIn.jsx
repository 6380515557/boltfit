import React, { useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';

const GOOGLE_CLIENT_ID = "762069684819-ad2l01051u8ophvbttbl1m5rirc81qt8.apps.googleusercontent.com";

const GoogleSignIn = ({ onSuccess, onError }) => {
  const { login } = useAuth();
  const googleButtonRef = useRef(null);
  const [isLoading, setIsLoading] = React.useState(false);

  useEffect(() => {
    if (window.google) {
      initializeGoogleSignIn();
    } else {
      const checkGoogle = setInterval(() => {
        if (window.google) {
          clearInterval(checkGoogle);
          initializeGoogleSignIn();
        }
      }, 100);
    }
  }, []);

  const initializeGoogleSignIn = () => {
    try {
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse,
        auto_select: false,
        cancel_on_tap_outside: true
      });

      if (googleButtonRef.current) {
        window.google.accounts.id.renderButton(
          googleButtonRef.current,
          {
            theme: "filled_blue",
            size: "large",
            text: "signin_with",
            shape: "rectangular",
            logo_alignment: "left",
            width: 300
          }
        );
      }
    } catch (error) {
      onError?.('Failed to initialize Google Sign-In');
    }
  };

  const handleCredentialResponse = async (response) => {
    try {
      setIsLoading(true);
      const loginResponse = await login(response.credential);
      onSuccess?.(loginResponse);
    } catch (error) {
      let errorMessage = 'Login failed';
      if (error.message.includes('Access denied')) {
        errorMessage = 'Access denied. Only authorized admin can login.';
      }
      onError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ textAlign: 'center' }}>
      {isLoading ? (
        <div style={{ color: '#666' }}>
          <div style={{
            width: '24px',
            height: '24px',
            border: '2px solid #f3f3f3',
            borderTop: '2px solid #3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 12px'
          }}></div>
          <p>Verifying admin credentials...</p>
        </div>
      ) : (
        <div ref={googleButtonRef}></div>
      )}
    </div>
  );
};

export default GoogleSignIn;
