import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { LogOut, User, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminHeader = () => {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
      navigate('/');
    }
  };

  return (
    <header style={{
      backgroundColor: 'white',
      padding: '16px 24px',
      borderBottom: '1px solid #e5e7eb',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px'
      }}>
        <div style={{
          fontSize: '24px',
          fontWeight: '900',
          background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          BOLT FIT Admin
        </div>
        
        <button
          onClick={() => navigate('/')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 12px',
            backgroundColor: '#f3f4f6',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            color: '#374151'
          }}
        >
          <Home size={16} />
          View Site
        </button>
      </div>
      
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '8px 16px',
          backgroundColor: '#eff6ff',
          borderRadius: '12px'
        }}>
          <User size={20} color="#3b82f6" />
          <div>
            <div style={{
              fontSize: '14px',
              fontWeight: '600',
              color: '#1f2937'
            }}>
              {admin?.name}
            </div>
            <div style={{
              fontSize: '12px',
              color: '#6b7280'
            }}>
              {admin?.email}
            </div>
          </div>
        </div>
        
        <button 
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            backgroundColor: '#fee2e2',
            color: '#991b1b',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600'
          }}
          onClick={handleLogout}
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </header>
  );
};

export default AdminHeader;
