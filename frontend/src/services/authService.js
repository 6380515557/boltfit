const API_BASE_URL = 'http://localhost:8000/api/v1';

class AuthService {
  constructor() {
    this.token = localStorage.getItem('admin_token');
    this.adminUser = localStorage.getItem('admin_user') ? 
      JSON.parse(localStorage.getItem('admin_user')) : null;
  }

  async loginWithGoogle(idToken) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/google-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id_token: idToken
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Login failed');
      }

      // Store token and user data
      this.token = data.access_token;
      this.adminUser = data.admin;
      
      localStorage.setItem('admin_token', data.access_token);
      localStorage.setItem('admin_user', JSON.stringify(data.admin));

      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  // CHECK if user is logged in
  isLoggedIn() {
    const token = this.getToken();
    const user = this.getStoredUser();
    return !!(token && user);
  }

  // GET stored token
  getToken() {
    return this.token || localStorage.getItem('admin_token');
  }

  // GET stored user
  getStoredUser() {
    try {
      const storedUser = localStorage.getItem('admin_user');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error('Error parsing stored user:', error);
      return null;
    }
  }

  // VERIFY admin status with backend
  async verifyAdmin() {
    try {
      const token = this.getToken();
      if (!token) {
        throw new Error('No token found');
      }

      const response = await fetch(`${API_BASE_URL}/auth/verify-admin`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();

      if (!response.ok) {
        // If verification fails, clear stored data
        this.logout();
        throw new Error(data.detail || 'Admin verification failed');
      }

      // Update stored user data if needed
      if (data.admin) {
        this.adminUser = data.admin;
        localStorage.setItem('admin_user', JSON.stringify(data.admin));
      }

      return data.admin || this.getStoredUser();
    } catch (error) {
      console.error('Admin verification error:', error);
      throw error;
    }
  }

  // LOGOUT user
  logout() {
    this.token = null;
    this.adminUser = null;
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    
    // Also clear any other possible token storage locations
    localStorage.removeItem('authToken');
    localStorage.removeItem('token');
    sessionStorage.clear();
  }

  // CHECK if current user is admin
  isAdmin() {
    const user = this.getStoredUser();
    return user && user.role === 'admin'; // Adjust based on your user structure
  }

  // GET current admin user
  getCurrentAdmin() {
    return this.adminUser || this.getStoredUser();
  }

  // REFRESH token if needed
  async refreshToken() {
    try {
      const token = this.getToken();
      if (!token) {
        throw new Error('No token to refresh');
      }

      const response = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Token refresh failed');
      }

      // Update token
      this.token = data.access_token;
      localStorage.setItem('admin_token', data.access_token);

      return data.access_token;
    } catch (error) {
      console.error('Token refresh error:', error);
      // If refresh fails, logout user
      this.logout();
      throw error;
    }
  }

  // MAKE authenticated API calls
  async makeAuthenticatedRequest(url, options = {}) {
    try {
      const token = this.getToken();
      if (!token) {
        throw new Error('No authentication token');
      }

      const config = {
        ...options,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          ...options.headers,
        }
      };

      const response = await fetch(url, config);

      // If unauthorized, try to refresh token
      if (response.status === 401) {
        try {
          await this.refreshToken();
          // Retry with new token
          config.headers['Authorization'] = `Bearer ${this.getToken()}`;
          return await fetch(url, config);
        } catch (refreshError) {
          this.logout();
          throw new Error('Authentication expired. Please login again.');
        }
      }

      return response;
    } catch (error) {
      console.error('Authenticated request error:', error);
      throw error;
    }
  }
}

export default new AuthService();
