// Authentication service for handling login/signup API calls
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
  message?: string;
}

// Base API URL - replace with your actual backend URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

class AuthService {
  // Login user
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // Real API implementation
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (response.ok) {
        // Store token in localStorage
        if (data.token) {
          localStorage.setItem('authToken', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
        }
        return {
          success: true,
          token: data.token,
          user: data.user,
        };
      } else {
        return {
          success: false,
          message: data.message || 'Login failed',
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: 'Network error. Please check your connection.',
      };
    }
  }

  // Register new user
  async signup(credentials: SignupCredentials): Promise<AuthResponse> {
    // Clear any existing auth data first
    this.logout();
    
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (response.ok) {
        // Store token in localStorage
        if (data.token) {
          localStorage.setItem('authToken', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
        }
        return {
          success: true,
          token: data.token,
          user: data.user,
        };
      } else {
        return {
          success: false,
          message: data.message || 'Signup failed',
        };
      }
    } catch (error) {
      console.error('Signup error details:', error);
      console.error('Error type:', error instanceof Error ? error.constructor.name : typeof error);
      console.error('Error message:', error instanceof Error ? error.message : String(error));
      return {
        success: false,
        message: `Network error: ${error instanceof Error ? error.message : 'Unknown error'}. Please check your connection.`,
      };
    }
  }

  // Logout user
  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  }

  // Get current user from localStorage
  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  // Get auth token
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token;
  }

  // Verify token with backend
  async verifyToken(): Promise<boolean> {
    const token = this.getToken();
    if (!token) return false;

    // Real API implementation
    try {
      const response = await fetch(`${API_BASE_URL}/auth/verify`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
        }
        return true;
      }
      return false;
    } catch (error) {
      console.error('Token verification error:', error);
      return false;
    }
  }

  // Initiate Google OAuth login
  async initiateGoogleLogin(): Promise<{ success: boolean; authUrl?: string; message?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/google`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok && data.authUrl) {
        // Open Google OAuth page in new window
        window.open(data.authUrl, '_blank', 'width=500,height=600');
        return {
          success: true,
          authUrl: data.authUrl,
        };
      } else {
        return {
          success: false,
          message: data.message || 'Failed to initiate Google login',
        };
      }
    } catch (error) {
      console.error('Google login initiation error:', error);
      return {
        success: false,
        message: 'Network error. Please check your connection.',
      };
    }
  }

  // Handle Google OAuth callback
  handleGoogleCallback(token: string, userInfo: string): void {
    try {
      const user = JSON.parse(decodeURIComponent(userInfo));
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Redirect to dashboard
      window.location.href = '/dashboard';
    } catch (error) {
      console.error('Error handling Google callback:', error);
      window.location.href = '/auth?error=google_callback_failed';
    }
  }

  // Google OAuth login (legacy method for token exchange)
  async googleLogin(googleToken: string): Promise<AuthResponse> {
    // Real API implementation
    try {
      const response = await fetch(`${API_BASE_URL}/auth/google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: googleToken }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store token in localStorage
        if (data.token) {
          localStorage.setItem('authToken', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
        }
        return {
          success: true,
          token: data.token,
          user: data.user,
        };
      } else {
        return {
          success: false,
          message: data.message || 'Google login failed',
        };
      }
    } catch (error) {
      console.error('Google login error:', error);
      return {
        success: false,
        message: 'Network error. Please check your connection.',
      };
    }
  }
}

const authService = new AuthService();
export { authService };
export default authService;
