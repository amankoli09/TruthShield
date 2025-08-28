import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Eye, EyeOff, Mail, Lock, User, ArrowRight, Sparkles, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import authService from '../services/authService';

const Auth = () => {
  const navigate = useNavigate();
  const { login, signup, isLoading } = useAuth();
  const { actualTheme } = useTheme();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState('');
  const [isGoogleOAuthAvailable, setIsGoogleOAuthAvailable] = useState(false);

  const floatingElements = [
    { icon: Shield, delay: 0, x: 15, y: 20 },
    { icon: Eye, delay: 1000, x: 85, y: 15 },
    { icon: Lock, delay: 2000, x: 10, y: 70 },
    { icon: Mail, delay: 1500, x: 90, y: 80 },
    { icon: Sparkles, delay: 500, x: 50, y: 10 }
  ];

  useEffect(() => {
    setIsVisible(true);
    
    // Check if Google OAuth is available
    const checkGoogleOAuth = async () => {
      const available = await authService.isGoogleOAuthAvailable();
      setIsGoogleOAuthAvailable(available);
    };
    
    checkGoogleOAuth();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!isLogin && !formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!isLogin && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setApiError('');

    try {
      let result;
      if (isLogin) {
        result = await login(formData.email, formData.password);
      } else {
        result = await signup(formData.name, formData.email, formData.password);
      }

      if (result.success) {
        navigate('/dashboard');
      } else {
        setApiError(result.message || 'Authentication failed');
      }
    } catch (error) {
      setApiError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
    setErrors({});
    setApiError('');
  };

  const handleGoogleLogin = async () => {
    setIsSubmitting(true);
    setApiError('');
    
    try {
      const result = await authService.initiateGoogleLogin();
      if (!result.success) {
        if (result.message?.includes('Google OAuth credentials not configured')) {
          setApiError('Google login is not configured yet. Please use email/password login or contact support.');
        } else {
          setApiError(result.message || 'Failed to initiate Google login');
        }
      }
      // If successful, Google OAuth window opens and user will be redirected via callback
    } catch (error) {
      console.error('Google login error:', error);
      setApiError('Google login is currently unavailable. Please use email/password login.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`min-h-screen relative overflow-hidden transition-colors duration-300 ${
      actualTheme === 'dark' 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
        : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'
    }`}>
      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {floatingElements.map((element, index) => {
          const Icon = element.icon;
          return (
            <div
              key={index}
              className="absolute opacity-5"
              style={{
                left: `${element.x}%`,
                top: `${element.y}%`,
                animation: `float 8s ease-in-out infinite`,
                animationDelay: `${element.delay}ms`
              }}
            >
              <Icon className={`w-12 h-12 ${
                actualTheme === 'dark' ? 'text-gray-200' : 'text-gray-800'
              }`} />
            </div>
          );
        })}
      </div>

      {/* Animated Background Gradient */}
      <div className={`absolute inset-0 animate-pulse ${
        actualTheme === 'dark'
          ? 'bg-gradient-to-r from-gray-600/10 via-gray-500/10 to-gray-400/10'
          : 'bg-gradient-to-r from-gray-200/10 via-gray-300/10 to-gray-400/10'
      }`}></div>

      <div className="relative flex items-center justify-center min-h-screen px-4 py-12">
        <div className={`w-full max-w-md transform transition-all duration-1000 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          {/* Logo Section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-gray-800 to-black rounded-full mb-4 shadow-2xl animate-bounce">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className={`text-3xl font-bold text-transparent bg-clip-text ${
              actualTheme === 'dark'
                ? 'bg-gradient-to-r from-white via-gray-100 to-gray-200'
                : 'bg-gradient-to-r from-black via-gray-800 to-gray-900'
            }`}>
              TruthShield
            </h1>
            <p className={`mt-2 ${
              actualTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}>
              {isLogin ? 'Welcome back!' : 'Join the fight against misinformation'}
            </p>
          </div>

          {/* Auth Form */}
          <div className={`backdrop-blur-sm rounded-2xl shadow-2xl p-8 border ${
            actualTheme === 'dark'
              ? 'bg-gray-800/90 border-gray-700'
              : 'bg-white/90 border-gray-200'
          }`}>
            {/* Toggle Buttons */}
            <div className={`flex mb-8 rounded-xl p-1 ${
              actualTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
            }`}>
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-300 ${
                  isLogin
                    ? actualTheme === 'dark'
                      ? 'bg-gray-600 text-white shadow-md transform scale-105'
                      : 'bg-white text-gray-900 shadow-md transform scale-105'
                    : actualTheme === 'dark'
                      ? 'text-gray-300 hover:text-white'
                      : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-300 ${
                  !isLogin
                    ? actualTheme === 'dark'
                      ? 'bg-gray-600 text-white shadow-md transform scale-105'
                      : 'bg-white text-gray-900 shadow-md transform scale-105'
                    : actualTheme === 'dark'
                      ? 'text-gray-300 hover:text-white'
                      : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* API Error Display */}
            {apiError && (
              <div className={`mb-4 p-4 border rounded-xl ${
                actualTheme === 'dark'
                  ? 'bg-red-900/30 border-red-700'
                  : 'bg-red-50 border-red-200'
              }`}>
                <p className={`text-sm font-medium ${
                  actualTheme === 'dark' ? 'text-red-300' : 'text-red-600'
                }`}>{apiError}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field (Sign Up Only) */}
              {!isLogin && (
                <div className={`transform transition-all duration-500 ${
                  !isLogin ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'
                }`}>
                  <label className={`block text-sm font-medium mb-2 ${
                    actualTheme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                  }`}>
                    Full Name
                  </label>
                  <div className="relative">
                    <User className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${
                      actualTheme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                    }`} />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-300 ${
                        errors.name 
                          ? 'border-red-500' 
                          : actualTheme === 'dark'
                            ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400'
                            : 'border-gray-300 bg-white text-gray-900'
                      }`}
                      placeholder="Enter your full name"
                    />
                  </div>
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1 animate-pulse">{errors.name}</p>
                  )}
                </div>
              )}

              {/* Email Field */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  actualTheme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                }`}>
                  Email Address
                </label>
                <div className="relative">
                  <Mail className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${
                    actualTheme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                  }`} />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-300 ${
                      errors.email 
                        ? 'border-red-500' 
                        : actualTheme === 'dark'
                          ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400'
                          : 'border-gray-300 bg-white text-gray-900'
                    }`}
                    placeholder="Enter your email"
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1 animate-pulse">{errors.email}</p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-300 ${
                      errors.password ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1 animate-pulse">{errors.password}</p>
                )}
              </div>

              {/* Confirm Password Field (Sign Up Only) */}
              {!isLogin && (
                <div className={`transform transition-all duration-500 ${
                  !isLogin ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'
                }`}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-300 ${
                        errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Confirm your password"
                    />
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1 animate-pulse">{errors.confirmPassword}</p>
                  )}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || isLoading}
                className="group relative w-full bg-gradient-to-r from-gray-800 to-black text-white py-3 px-4 rounded-xl font-medium hover:from-gray-900 hover:to-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 hover:-translate-y-1 flex items-center justify-center overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                style={{
                  background: 'linear-gradient(45deg, #1f2937, #111827, #1f2937)',
                  backgroundSize: '200% 200%',
                  animation: 'shimmer 3s ease-in-out infinite'
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
                {isSubmitting || isLoading ? (
                  <>
                    <Loader2 className="relative z-10 mr-2 h-5 w-5 animate-spin" />
                    <span className="relative z-10">Processing...</span>
                  </>
                ) : (
                  <>
                    <span className="relative z-10">{isLogin ? 'Sign In' : 'Create Account'}</span>
                    <ArrowRight className="relative z-10 ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center">
              <div className="flex-1 border-t border-gray-300"></div>
              <span className="px-4 text-sm text-gray-500 bg-white">or</span>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>

            {/* Google Sign In - Only show if available */}
            {isGoogleOAuthAvailable && (
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isSubmitting || isLoading}
                className="group relative w-full bg-gradient-to-r from-gray-700 to-gray-900 border-2 border-gray-600 text-white py-3 px-4 rounded-xl font-medium hover:from-gray-600 hover:to-gray-800 hover:border-gray-500 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 hover:-translate-y-1 flex items-center justify-center overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              style={{
                background: 'linear-gradient(45deg, #1f2937, #111827, #1f2937)',
                backgroundSize: '200% 200%',
                animation: 'shimmer 3s ease-in-out infinite'
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
              
              <div className="relative z-10 flex items-center">
                <div className="mr-3 p-1.5 bg-white rounded-lg shadow-sm group-hover:shadow-md transition-all duration-300 group-hover:scale-110">
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                </div>
                <span className="font-medium text-white group-hover:text-gray-100 transition-colors duration-300">
                  Continue with Google
                </span>
              </div>
            </button>
            )}

            {/* Footer */}
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button
                  onClick={toggleMode}
                  className="text-gray-900 font-medium hover:underline transition-all duration-200"
                >
                  {isLogin ? 'Sign up' : 'Sign in'}
                </button>
              </p>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="mt-8 text-center">
            <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
              <div className="flex items-center">
                <Shield className="h-4 w-4 mr-1" />
                <span>Secure</span>
              </div>
              <div className="flex items-center">
                <Lock className="h-4 w-4 mr-1" />
                <span>Encrypted</span>
              </div>
              <div className="flex items-center">
                <Eye className="h-4 w-4 mr-1" />
                <span>Private</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(3deg); }
        }
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
};

export default Auth;
