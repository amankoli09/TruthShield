import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, TrendingUp, X, AlertTriangle, CheckCircle, Shield, Sparkles, Zap, Eye, Clock } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import verificationService from '../services/verificationService';

const Verify = () => {
  const { actualTheme } = useTheme();
  const [searchText, setSearchText] = useState('');
  const [placeholderText, setPlaceholderText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const placeholders = [
    "Paste a news link here...",
    "Paste a YouTube video link...",
    "Paste a tweet URL...",
    "Paste suspicious text content...",
    "Paste social media posts..."
  ];

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    const currentText = placeholders[currentIndex];
    const typingSpeed = isDeleting ? 50 : 100;
    const pauseTime = isDeleting ? 500 : 2000;

    const timeout = setTimeout(() => {
      if (!isDeleting && placeholderText === currentText) {
        setTimeout(() => setIsDeleting(true), pauseTime);
      } else if (isDeleting && placeholderText === '') {
        setIsDeleting(false);
        setCurrentIndex((prev) => (prev + 1) % placeholders.length);
      } else if (isDeleting) {
        setPlaceholderText(currentText.substring(0, placeholderText.length - 1));
      } else {
        setPlaceholderText(currentText.substring(0, placeholderText.length + 1));
      }
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [placeholderText, currentIndex, isDeleting]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchText.trim()) {
      setIsLoading(true);
      try {
        // Call the verification service
        const result = await verificationService.verifyContent(searchText.trim());
        navigate('/result', { state: { searchText, verificationResult: result } });
      } catch (error) {
        console.error('Verification failed:', error);
        // Navigate with error state
        navigate('/result', { state: { searchText, error: error instanceof Error ? error.message : 'Verification failed' } });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const getTrendingAlertStyles = (status: string) => {
    const baseStyles = {
      fake: {
        bgColor: actualTheme === 'dark' 
          ? 'bg-gradient-to-br from-red-900/30 to-red-800/30' 
          : 'bg-gradient-to-br from-red-50 to-red-100',
        textColor: actualTheme === 'dark' ? 'text-red-300' : 'text-red-700',
        iconColor: actualTheme === 'dark' ? 'text-red-400' : 'text-red-500',
        borderColor: actualTheme === 'dark' ? 'border-red-800' : 'border-red-200'
      },
      warning: {
        bgColor: actualTheme === 'dark' 
          ? 'bg-gradient-to-br from-yellow-900/30 to-yellow-800/30' 
          : 'bg-gradient-to-br from-yellow-50 to-yellow-100',
        textColor: actualTheme === 'dark' ? 'text-yellow-300' : 'text-yellow-700',
        iconColor: actualTheme === 'dark' ? 'text-yellow-400' : 'text-yellow-500',
        borderColor: actualTheme === 'dark' ? 'border-yellow-800' : 'border-yellow-200'
      },
      unverified: {
        bgColor: actualTheme === 'dark' 
          ? 'bg-gradient-to-br from-blue-900/30 to-blue-800/30' 
          : 'bg-gradient-to-br from-blue-50 to-blue-100',
        textColor: actualTheme === 'dark' ? 'text-blue-300' : 'text-blue-700',
        iconColor: actualTheme === 'dark' ? 'text-blue-400' : 'text-blue-500',
        borderColor: actualTheme === 'dark' ? 'border-blue-800' : 'border-blue-200'
      },
      verified: {
        bgColor: actualTheme === 'dark' 
          ? 'bg-gradient-to-br from-green-900/30 to-green-800/30' 
          : 'bg-gradient-to-br from-green-50 to-green-100',
        textColor: actualTheme === 'dark' ? 'text-green-300' : 'text-green-700',
        iconColor: actualTheme === 'dark' ? 'text-green-400' : 'text-green-500',
        borderColor: actualTheme === 'dark' ? 'border-green-800' : 'border-green-200'
      }
    };
    return baseStyles[status as keyof typeof baseStyles];
  };

  const trendingAlerts = [
    {
      id: 1,
      text: "Floods in Mumbai caused by dam burst",
      status: "fake",
      icon: X
    },
    {
      id: 2,
      text: "New COVID variant spreads via packaged food",
      status: "warning",
      icon: AlertTriangle
    },
    {
      id: 3,
      text: "Election results rigged against candidate",
      status: "unverified",
      icon: AlertTriangle
    },
    {
      id: 4,
      text: "Earthquake early warning system activated",
      status: "verified",
      icon: CheckCircle
    }
  ];

  const howItWorksSteps = [
    {
      icon: Search,
      title: "Paste Content",
      description: "Submit any suspicious content, link, or text"
    },
    {
      icon: Zap,
      title: "AI Analysis",
      description: "Our AI analyzes multiple fact-checking sources"
    },
    {
      icon: Eye,
      title: "Instant Results",
      description: "Get verification with confidence scores"
    },
    {
      icon: Shield,
      title: "Detailed Report",
      description: "See explanations and source citations"
    }
  ];

  return (
    <div 
      className={`min-h-screen transition-colors duration-300 ${
        actualTheme === 'dark'
          ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900'
          : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'
      }`}
      style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro", "Segoe UI", Roboto, sans-serif' }}
    >
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        
        @keyframes shimmer-fast {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        
        @keyframes pulse-glow {
          0%, 100% { 
            box-shadow: 0 0 20px rgba(59, 130, 246, 0.3), 0 0 40px rgba(99, 102, 241, 0.2);
          }
          50% { 
            box-shadow: 0 0 30px rgba(59, 130, 246, 0.5), 0 0 60px rgba(99, 102, 241, 0.3);
          }
        }
        
        .shimmer-text {
          background: linear-gradient(
            90deg,
            ${actualTheme === 'dark' ? '#f3f4f6' : '#1f2937'} 0%,
            #3b82f6 20%,
            #6366f1 40%,
            #3b82f6 60%,
            ${actualTheme === 'dark' ? '#f3f4f6' : '#1f2937'} 80%,
            ${actualTheme === 'dark' ? '#f3f4f6' : '#1f2937'} 100%
          );
          background-size: 200% 100%;
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 4s ease-in-out infinite;
          transition: all 0.3s ease;
        }
        
        .shimmer-text:hover {
          animation: shimmer-fast 2s ease-in-out infinite;
        }
        
        .gradient-button {
          background: linear-gradient(135deg, #3b82f6, #6366f1);
          transition: all 0.3s ease;
        }
        
        .gradient-button:hover {
          background: linear-gradient(135deg, #2563eb, #4f46e5);
          transform: translateY(-2px) scale(1.02);
          box-shadow: 0 10px 25px rgba(59, 130, 246, 0.4);
        }
        
        .gradient-button:active {
          transform: translateY(0) scale(0.98);
        }
        
        .input-glow:focus {
          animation: pulse-glow 2s ease-in-out infinite;
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className={`text-center mb-16 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="flex justify-center mb-8">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full blur-lg opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
              <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 p-4 rounded-full">
                <Shield className="h-12 w-12 text-white" />
              </div>
            </div>
          </div>
          
          <h1 
            className="text-5xl font-bold mb-6 cursor-pointer shimmer-text"
            style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif' }}
          >
            Verify Information
          </h1>
          
          <p className={`text-xl max-w-3xl mx-auto leading-relaxed ${
            actualTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Paste any news link, tweet, or text to check its authenticity with{' '}
            <span className="font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              TruthShield AI
            </span>
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Verification Area */}
          <div className={`lg:col-span-2 transform transition-all duration-1000 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className={`rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 border ${
              actualTheme === 'dark'
                ? 'bg-gray-800 border-gray-700'
                : 'bg-white border-gray-100'
            }`}>
              <form onSubmit={handleVerify} className="space-y-6">
                <div className="relative">
                  <textarea
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    placeholder={placeholderText}
                    rows={4}
                    className={`w-full px-6 py-4 border rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg resize-none input-glow transition-all duration-300 ${
                      actualTheme === 'dark'
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 hover:border-gray-500'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 hover:border-gray-400'
                    }`}
                    style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro", "Segoe UI", Roboto, sans-serif' }}
                  />
                  <div className={`absolute bottom-4 right-4 text-sm ${
                    actualTheme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                  }`}>
                    {searchText.length}/1000
                  </div>
                </div>
                
                <button
                  type="submit"
                  disabled={isLoading || !searchText.trim()}
                  className="w-full gradient-button text-white py-4 px-8 rounded-2xl font-semibold text-lg flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Search className="h-5 w-5" />
                      Verify with AI
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className={`text-sm ${
                  actualTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  Powered by advanced AI • Cross-platform verification • Instant results
                </p>
              </div>
            </div>

            {/* How It Works Section */}
            <div className={`mt-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 border transform transition-all duration-1000 delay-400 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'} ${
              actualTheme === 'dark'
                ? 'bg-gray-800 border-gray-700'
                : 'bg-white border-gray-100'
            }`}>
              <div className="flex items-center gap-3 mb-6">
                <div className={`p-2 rounded-xl ${
                  actualTheme === 'dark'
                    ? 'bg-gradient-to-r from-blue-900/50 to-indigo-900/50'
                    : 'bg-gradient-to-r from-blue-100 to-indigo-100'
                }`}>
                  <Sparkles className="h-6 w-6 text-blue-600" />
                </div>
                <h3 
                  className={`text-2xl font-bold ${
                    actualTheme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}
                  style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif' }}
                >
                  How It Works
                </h3>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                {howItWorksSteps.map((step, index) => {
                  const IconComponent = step.icon;
                  return (
                    <div 
                      key={step.title}
                      className={`flex items-start gap-4 p-4 rounded-xl transition-colors duration-200 ${
                        actualTheme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                      }`}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl">
                        <IconComponent className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h4 className={`font-semibold mb-1 ${
                          actualTheme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>{step.title}</h4>
                        <p className={`text-sm leading-relaxed ${
                          actualTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                        }`}>{step.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Trending Alerts Sidebar */}
          <div className={`lg:col-span-1 transform transition-all duration-1000 delay-600 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className={`rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border sticky top-8 ${
              actualTheme === 'dark'
                ? 'bg-gray-800 border-gray-700'
                : 'bg-white border-gray-100'
            }`}>
              <div className="flex items-center gap-3 mb-6">
                <div className={`p-2 rounded-xl ${
                  actualTheme === 'dark'
                    ? 'bg-gradient-to-r from-red-900/50 to-orange-900/50'
                    : 'bg-gradient-to-r from-red-100 to-orange-100'
                }`}>
                  <TrendingUp className="h-5 w-5 text-red-600" />
                </div>
                <h2 
                  className={`text-xl font-bold ${
                    actualTheme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}
                  style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif' }}
                >
                  🔥 Trending Alerts
                </h2>
              </div>

              <div className="space-y-4">
                {trendingAlerts.map((alert, index) => {
                  const Icon = alert.icon;
                  const styles = getTrendingAlertStyles(alert.status);
                  return (
                    <div
                      key={alert.id}
                      className={`p-4 rounded-2xl ${styles.bgColor} border ${styles.borderColor} hover:shadow-md transition-all duration-200 hover:scale-102 cursor-pointer`}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-1.5 rounded-full shadow-sm ${
                          actualTheme === 'dark' ? 'bg-gray-700' : 'bg-white'
                        }`}>
                          <Icon className={`h-4 w-4 ${styles.iconColor}`} />
                        </div>
                        <div className="flex-1">
                          <p className={`text-sm font-medium ${styles.textColor} leading-relaxed mb-2`}>
                            {alert.text}
                          </p>
                          <div className="flex items-center gap-2">
                            <span className={`text-xs ${styles.textColor} font-medium px-2 py-1 rounded-full ${
                              actualTheme === 'dark' ? 'bg-gray-800 bg-opacity-50' : 'bg-white bg-opacity-50'
                            }`}>
                              {alert.status === 'fake' && '❌ False'}
                              {alert.status === 'warning' && '⚠️ Warning'}
                              {alert.status === 'unverified' && '🔵 Unverified'}
                              {alert.status === 'verified' && '✅ Verified'}
                            </span>
                            <Clock className={`h-3 w-3 ${
                              actualTheme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                            }`} />
                            <span className={`text-xs ${
                              actualTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                            }`}>2h ago</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className={`mt-6 p-4 rounded-2xl border ${
                actualTheme === 'dark'
                  ? 'bg-gradient-to-r from-gray-700 to-gray-600 border-gray-600'
                  : 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200'
              }`}>
                <p className={`text-xs text-center ${
                  actualTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  <strong>💡 Tip:</strong> Always verify information from multiple sources during crisis situations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Verify;