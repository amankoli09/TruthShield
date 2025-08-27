import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Shield, Menu, X, User, LogOut, ChevronDown, Settings, Moon, Sun } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const { actualTheme, toggleTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  const isActive = (path: string) => location.pathname === path;
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? actualTheme === 'dark' 
          ? 'bg-gray-900/95 backdrop-blur-md border-b border-gray-700 shadow-lg' 
          : 'bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-lg'
        : actualTheme === 'dark'
          ? 'bg-gray-900/90 backdrop-blur-sm border-b border-gray-800'
          : 'bg-white/90 backdrop-blur-sm border-b border-gray-100'
    }`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Enhanced Logo */}
          <Link to="/" className="group flex items-center space-x-3 relative">
            <div className="relative">
              <div className="relative p-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full group-hover:scale-110 transition-transform duration-300">
                <Shield className="h-7 w-7 text-white" strokeWidth={1.5} />
              </div>
            </div>
            <span className={`text-2xl font-bold text-transparent bg-clip-text transition-all duration-300 ${
              actualTheme === 'dark'
                ? 'bg-gradient-to-r from-gray-100 via-white to-gray-200 group-hover:from-blue-400 group-hover:to-purple-400'
                : 'bg-gradient-to-r from-gray-800 via-gray-900 to-black group-hover:from-blue-600 group-hover:to-purple-600'
            }`}>
              TruthShield
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-2">
            {[
              { path: '/', label: 'Home' },
              { path: '/alerts', label: 'Alerts' },
              { path: '/about', label: 'About' }
            ].map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`relative px-5 py-2.5 text-sm font-medium rounded-xl transition-all duration-300 group ${
                  isActive(item.path) 
                    ? actualTheme === 'dark'
                      ? 'text-blue-400 bg-blue-900/50 shadow-md'
                      : 'text-blue-600 bg-blue-50 shadow-md'
                    : actualTheme === 'dark'
                      ? 'text-gray-300 hover:text-blue-400 hover:bg-blue-900/30'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50/50'
                }`}
              >
                <span className="relative z-10">{item.label}</span>
                {isActive(item.path) && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl"></div>
                )}
              </Link>
            ))}
            
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-all duration-200 ${
                actualTheme === 'dark'
                  ? 'text-yellow-400 hover:text-yellow-300 bg-gray-800 hover:bg-gray-700'
                  : 'text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200'
              }`}
              title={`Switch to ${actualTheme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {actualTheme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {/* Auth Section */}
            {isAuthenticated ? (
              <div className="relative ml-4">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    actualTheme === 'dark'
                      ? 'text-gray-300 hover:text-blue-400 bg-gray-800 hover:bg-gray-700'
                      : 'text-gray-700 hover:text-blue-600 bg-gray-50 hover:bg-blue-50'
                  }`}
                >
                  <User className="h-4 w-4" />
                  <span>{user?.name}</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
                {showUserMenu && (
                  <div className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg border py-1 z-50 ${
                    actualTheme === 'dark'
                      ? 'bg-gray-800 border-gray-700'
                      : 'bg-white border-gray-200'
                  }`}>
                    <Link
                      to="/dashboard"
                      className={`block px-4 py-2 text-sm transition-colors ${
                        actualTheme === 'dark'
                          ? 'text-gray-300 hover:bg-gray-700'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                      onClick={() => setShowUserMenu(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/settings"
                      className={`flex items-center px-4 py-2 text-sm transition-colors ${
                        actualTheme === 'dark'
                          ? 'text-gray-300 hover:bg-gray-700'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                      onClick={() => setShowUserMenu(false)}
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setShowUserMenu(false);
                        navigate('/');
                      }}
                      className={`flex items-center w-full px-4 py-2 text-sm transition-colors ${
                        actualTheme === 'dark'
                          ? 'text-gray-300 hover:bg-gray-700'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/auth"
                className={`ml-4 px-6 py-3 text-sm font-medium text-white rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 ${
                  actualTheme === 'dark'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                    : 'bg-gradient-to-r from-gray-800 to-black hover:from-gray-900 hover:to-gray-800'
                }`}
              >
                Login
              </Link>
            )}
          </nav>

          {/* Enhanced Mobile Menu Button */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="group relative p-2 text-gray-700 hover:text-blue-600 rounded-xl hover:bg-blue-50 transition-all duration-300"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6 relative z-10 transform rotate-0 group-hover:rotate-90 transition-transform duration-300" />
              ) : (
                <Menu className="h-6 w-6 relative z-10 group-hover:scale-110 transition-transform duration-300" />
              )}
            </button>
          </div>
        </div>
        
        {/* Enhanced Mobile Menu */}
        {isMobileMenuOpen && (
          <div className={`md:hidden absolute top-full left-0 right-0 backdrop-blur-md border-b shadow-xl animate-fade-in-down ${
            actualTheme === 'dark'
              ? 'bg-gray-900/95 border-gray-700'
              : 'bg-white/95 border-gray-200'
          }`}>
            <div className="px-6 py-4 space-y-2">
              {[
                { path: '/', label: 'Home' },
                { path: '/alerts', label: 'Alerts' },
                { path: '/about', label: 'About' }
              ].map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 ${
                    isActive(item.path) 
                      ? actualTheme === 'dark'
                        ? 'text-blue-400 bg-blue-900/50 shadow-md'
                        : 'text-blue-600 bg-blue-50 shadow-md'
                      : actualTheme === 'dark'
                        ? 'text-gray-300 hover:text-blue-400 hover:bg-blue-900/30'
                        : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              {isAuthenticated ? (
                <>
                  <Link
                    to="/dashboard"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-4 py-3 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-300"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                      navigate('/');
                    }}
                    className="block w-full text-left px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-all duration-300 mt-2"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/auth"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-3 text-sm font-medium text-white bg-gradient-to-r from-gray-800 to-black rounded-xl hover:from-gray-900 hover:to-gray-800 transition-all duration-300 shadow-md hover:shadow-lg mt-4"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
      
    </header>
  );
};

export default Header;