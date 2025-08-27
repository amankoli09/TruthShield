import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Bookmark, 
  RefreshCw,
  Clock,
  Shield,
  BarChart3,
  Loader2,
  Sun,
  Moon
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { dashboardService, DashboardData, FactCheck, UserStats } from '../services/dashboardService';

const Dashboard = () => {
  const { user } = useAuth();
  const { actualTheme, toggleTheme } = useTheme();
  const [isVisible, setIsVisible] = useState(false);
  const [credibilityScore, setCredibilityScore] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [, setDashboardData] = useState<DashboardData | null>(null);
  const [recentChecks, setRecentChecks] = useState<FactCheck[]>([]);
  const [stats, setStats] = useState<UserStats>({
    totalChecks: 0,
    verifiedCount: 0,
    fakeCount: 0,
    warningCount: 0,
    savedCount: 0,
    credibilityScore: 0
  });

  // Fetch dashboard data
  const fetchDashboardData = async (showRefresh = false) => {
    if (showRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setError('');

    try {
      const result = await dashboardService.getDashboardData();
      if (result.success && result.data) {
        setDashboardData(result.data);
        setStats(result.data.stats);
        setRecentChecks(result.data.recentChecks);
        
        // Animate credibility score
        animateCredibilityScore(result.data.stats.credibilityScore);
      } else {
        setError(result.message || 'Failed to load dashboard data');
      }
    } catch (error) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // Animate credibility score
  const animateCredibilityScore = (targetScore: number) => {
    let currentScore = 0;
    const increment = targetScore / 50; // Animate over 50 steps
    
    const timer = setInterval(() => {
      currentScore += increment;
      if (currentScore >= targetScore) {
        setCredibilityScore(targetScore);
        clearInterval(timer);
      } else {
        setCredibilityScore(Math.round(currentScore));
      }
    }, 20);
  };

  useEffect(() => {
    setIsVisible(true);
    fetchDashboardData();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'fake':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      default:
        return <Clock className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    if (actualTheme === 'dark') {
      switch (status) {
        case 'verified':
          return 'bg-green-900/30 text-green-300 border-green-700';
        case 'fake':
          return 'bg-red-900/30 text-red-300 border-red-700';
        case 'warning':
          return 'bg-yellow-900/30 text-yellow-300 border-yellow-700';
        default:
          return 'bg-gray-700/30 text-gray-300 border-gray-600';
      }
    } else {
      switch (status) {
        case 'verified':
          return 'bg-green-50 text-green-700 border-green-200';
        case 'fake':
          return 'bg-red-50 text-red-700 border-red-200';
        case 'warning':
          return 'bg-yellow-50 text-yellow-700 border-yellow-200';
        default:
          return 'bg-gray-50 text-gray-700 border-gray-200';
      }
    }
  };

  if (isLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        actualTheme === 'dark'
          ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900'
          : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'
      }`}>
        <div className="text-center">
          <Loader2 className={`w-8 h-8 animate-spin mx-auto mb-4 ${
            actualTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`} />
          <p className={actualTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        actualTheme === 'dark'
          ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900'
          : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'
      }`}>
        <div className="text-center max-w-md">
          <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className={`text-xl font-semibold mb-2 ${
            actualTheme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>Error Loading Dashboard</h2>
          <p className={`mb-4 ${
            actualTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`}>{error}</p>
          <button
            onClick={() => fetchDashboardData()}
            className={`inline-flex items-center px-4 py-2 text-white rounded-lg transition-colors duration-200 ${
              actualTheme === 'dark'
                ? 'bg-gray-700 hover:bg-gray-600'
                : 'bg-gray-800 hover:bg-gray-900'
            }`}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      actualTheme === 'dark' 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
        : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className={`transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className={`text-3xl font-bold ${
                actualTheme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Welcome back, {user?.name || 'User'}!
              </h1>
              <p className={`mt-1 ${
                actualTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Here's your fact-checking dashboard
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                className={`inline-flex items-center px-3 py-2 rounded-lg transition-all duration-200 ${
                  actualTheme === 'dark'
                    ? 'text-gray-300 hover:text-white hover:bg-gray-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
                title={`Switch to ${actualTheme === 'dark' ? 'light' : 'dark'} mode`}
              >
                {actualTheme === 'dark' ? (
                  <Sun className="h-4 w-4 mr-2" />
                ) : (
                  <Moon className="h-4 w-4 mr-2" />
                )}
                {actualTheme === 'dark' ? 'Light' : 'Dark'}
              </button>
              <button
                onClick={() => fetchDashboardData(true)}
                disabled={isRefreshing}
                className={`inline-flex items-center px-3 py-2 rounded-lg transition-all duration-200 ${
                  actualTheme === 'dark'
                    ? 'text-gray-300 hover:text-white hover:bg-gray-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              <button
                onClick={() => fetchDashboardData(true)}
                disabled={isRefreshing}
                className={`inline-flex items-center px-4 py-2 text-white rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
                  actualTheme === 'dark'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                    : 'bg-gradient-to-r from-gray-800 to-black hover:from-gray-900 hover:to-gray-800'
                }`}
              >
                New Check
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 transform transition-all duration-1000 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className={`rounded-xl shadow-lg border p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105 ${
            actualTheme === 'dark'
              ? 'bg-gray-800 border-gray-700'
              : 'bg-white border-gray-200'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${
                  actualTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>Total Checks</p>
                <p className={`text-2xl font-bold ${
                  actualTheme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>{stats.totalChecks}</p>
              </div>
              <div className={`p-3 rounded-full ${
                actualTheme === 'dark' ? 'bg-blue-900/50' : 'bg-blue-100'
              }`}>
                <Shield className={`h-6 w-6 ${
                  actualTheme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                }`} />
              </div>
            </div>
          </div>

          <div className={`rounded-xl shadow-lg border p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105 ${
            actualTheme === 'dark'
              ? 'bg-gray-800 border-gray-700'
              : 'bg-white border-gray-200'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${
                  actualTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>Verified</p>
                <p className="text-2xl font-bold text-green-600">{stats.verifiedCount}</p>
              </div>
              <div className={`p-3 rounded-full ${
                actualTheme === 'dark' ? 'bg-green-900/50' : 'bg-green-100'
              }`}>
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className={`rounded-xl shadow-lg border p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105 ${
            actualTheme === 'dark'
              ? 'bg-gray-800 border-gray-700'
              : 'bg-white border-gray-200'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${
                  actualTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>Fake News</p>
                <p className="text-2xl font-bold text-red-600">{stats.fakeCount}</p>
              </div>
              <div className={`p-3 rounded-full ${
                actualTheme === 'dark' ? 'bg-red-900/50' : 'bg-red-100'
              }`}>
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className={`rounded-xl shadow-lg border p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105 ${
            actualTheme === 'dark'
              ? 'bg-gray-800 border-gray-700'
              : 'bg-white border-gray-200'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${
                  actualTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>Saved Items</p>
                <p className={`text-2xl font-bold ${
                  actualTheme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>{stats.savedCount}</p>
              </div>
              <div className={`p-3 rounded-full ${
                actualTheme === 'dark' ? 'bg-blue-900/50' : 'bg-blue-100'
              }`}>
                <Bookmark className={`h-6 w-6 ${
                  actualTheme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                }`} />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Credibility Score */}
          <div className={`lg:col-span-1 transform transition-all duration-1000 delay-400 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className={`rounded-xl shadow-lg border p-6 ${
              actualTheme === 'dark'
                ? 'bg-gray-800 border-gray-700'
                : 'bg-white border-gray-200'
            }`}>
              <h3 className={`text-lg font-semibold mb-4 ${
                actualTheme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>Your Credibility Score</h3>
              <div className="flex items-center justify-center mb-4">
                <div className="relative w-32 h-32">
                  <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      className={actualTheme === 'dark' ? 'text-gray-600' : 'text-gray-200'}
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      strokeDasharray={`${2 * Math.PI * 40}`}
                      strokeDashoffset={`${2 * Math.PI * 40 * (1 - credibilityScore / 100)}`}
                      className={`transition-all duration-1000 ease-out ${
                        actualTheme === 'dark' ? 'text-green-400' : 'text-green-500'
                      }`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className={`text-2xl font-bold ${
                      actualTheme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>{credibilityScore}%</span>
                  </div>
                </div>
              </div>
              <p className={`text-sm text-center ${
                actualTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Excellent! You have a high accuracy rate in identifying reliable information.
              </p>
            </div>
          </div>

          {/* Recent Fact-Checks */}
          <div className={`lg:col-span-2 transform transition-all duration-1000 delay-600 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className={`rounded-xl shadow-lg border ${
              actualTheme === 'dark'
                ? 'bg-gray-800 border-gray-700'
                : 'bg-white border-gray-200'
            }`}>
              <div className={`p-6 border-b ${
                actualTheme === 'dark' ? 'border-gray-700' : 'border-gray-200'
              }`}>
                <div className="flex items-center justify-between">
                  <h3 className={`text-lg font-semibold ${
                    actualTheme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>Recent Fact-Checks</h3>
                  <Link
                    to="/my-checks"
                    className={`text-sm transition-colors duration-200 ${
                      actualTheme === 'dark'
                        ? 'text-gray-300 hover:text-white'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    View All
                  </Link>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {recentChecks.map((check, index) => (
                    <div
                      key={check.id}
                      className={`flex items-center justify-between p-4 rounded-lg border transition-all duration-300 hover:shadow-md ${getStatusColor(check.status)}`}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex items-center space-x-3 flex-1 min-w-0">
                        {getStatusIcon(check.status)}
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium truncate ${
                            actualTheme === 'dark' ? 'text-white' : 'text-gray-900'
                          }`}>
                            {check.title}
                          </p>
                          <p className={`text-xs truncate ${
                            actualTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                          }`}>
                            {check.url}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className={`text-sm font-medium ${
                            actualTheme === 'dark' ? 'text-white' : 'text-gray-900'
                          }`}>
                            {check.credibility}% credible
                          </p>
                          <p className={`text-xs ${
                            actualTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                          }`}>{check.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className={`mt-8 transform transition-all duration-1000 delay-800 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className={`rounded-xl shadow-lg border p-6 ${
            actualTheme === 'dark'
              ? 'bg-gray-800 border-gray-700'
              : 'bg-white border-gray-200'
          }`}>
            <h3 className={`text-lg font-semibold mb-4 ${
              actualTheme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Link
                to="/my-checks"
                className={`flex items-center p-4 rounded-lg border transition-all duration-200 hover:shadow-md group ${
                  actualTheme === 'dark'
                    ? 'border-gray-600 hover:border-gray-500 hover:bg-gray-700/30'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <BarChart3 className={`h-8 w-8 mr-3 ${
                  actualTheme === 'dark'
                    ? 'text-gray-400 group-hover:text-gray-200'
                    : 'text-gray-600 group-hover:text-gray-900'
                }`} />
                <div>
                  <p className={`font-medium ${
                    actualTheme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>My Checks</p>
                  <p className={`text-sm ${
                    actualTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                  }`}>View all submissions</p>
                </div>
              </Link>

              <Link
                to="/saved"
                className={`flex items-center p-4 rounded-lg border transition-all duration-200 hover:shadow-md group ${
                  actualTheme === 'dark'
                    ? 'border-gray-600 hover:border-gray-500 hover:bg-gray-700/30'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Bookmark className={`h-8 w-8 mr-3 ${
                  actualTheme === 'dark'
                    ? 'text-gray-400 group-hover:text-gray-200'
                    : 'text-gray-600 group-hover:text-gray-900'
                }`} />
                <div>
                  <p className={`font-medium ${
                    actualTheme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>Saved</p>
                  <p className={`text-sm ${
                    actualTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                  }`}>Bookmarked results</p>
                </div>
              </Link>

              <Link
                to="/analytics"
                className={`flex items-center p-4 rounded-lg border transition-all duration-200 hover:shadow-md group ${
                  actualTheme === 'dark'
                    ? 'border-gray-600 hover:border-gray-500 hover:bg-gray-700/30'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <TrendingUp className={`h-8 w-8 mr-3 ${
                  actualTheme === 'dark'
                    ? 'text-gray-400 group-hover:text-gray-200'
                    : 'text-gray-600 group-hover:text-gray-900'
                }`} />
                <div>
                  <p className={`font-medium ${
                    actualTheme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>Analytics</p>
                  <p className={`text-sm ${
                    actualTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                  }`}>View statistics</p>
                </div>
              </Link>

              <Link
                to="/settings"
                className={`flex items-center p-4 rounded-lg border transition-all duration-200 hover:shadow-md group ${
                  actualTheme === 'dark'
                    ? 'border-gray-600 hover:border-gray-500 hover:bg-gray-700/30'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Shield className={`h-8 w-8 mr-3 ${
                  actualTheme === 'dark'
                    ? 'text-gray-400 group-hover:text-gray-200'
                    : 'text-gray-600 group-hover:text-gray-900'
                }`} />
                <div>
                  <p className={`font-medium ${
                    actualTheme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>Settings</p>
                  <p className={`text-sm ${
                    actualTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                  }`}>Preferences</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
