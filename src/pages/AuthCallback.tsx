import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import authService from '../services/authService';

const AuthCallback = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const token = urlParams.get('token');
    const userInfo = urlParams.get('user');
    const error = urlParams.get('error');

    if (error) {
      console.error('Google OAuth error:', error);
      navigate('/auth?error=' + encodeURIComponent(error));
      return;
    }

    if (token && userInfo) {
      authService.handleGoogleCallback(token, userInfo);
    } else {
      navigate('/auth?error=missing_credentials');
    }
  }, [location, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Completing Google login...</p>
      </div>
    </div>
  );
};

export default AuthCallback;
