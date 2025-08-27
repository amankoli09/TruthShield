import { useState, useEffect } from 'react';
import { Filter, Clock, X, CheckCircle, AlertTriangle, TrendingUp, ExternalLink, Shield, Eye, Share2, Zap, Globe, Users, Activity } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const Alerts = () => {
  const { actualTheme } = useTheme();
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [isVisible, setIsVisible] = useState(false);
  const [liveCount, setLiveCount] = useState(247);

  useEffect(() => {
    setIsVisible(true);
    
    // Simulate live counter
    const interval = setInterval(() => {
      setLiveCount(prev => prev + Math.floor(Math.random() * 3));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const crisisTypes = [
    { value: 'all', label: 'All Crises', icon: Globe, count: 12 },
    { value: 'flood', label: 'Floods', icon: Activity, count: 3 },
    { value: 'pandemic', label: 'Pandemic', icon: Shield, count: 2 },
    { value: 'election', label: 'Elections', icon: Users, count: 4 },
    { value: 'earthquake', label: 'Earthquakes', icon: Zap, count: 2 },
    { value: 'fire', label: 'Wildfires', icon: TrendingUp, count: 1 }
  ];

  const popularFakeNews = [
    {
      id: 1,
      title: "Breaking: Major earthquake predicted for California next week",
      url: "fakesite.com/earthquake-prediction-2024",
      shares: "45K",
      views: "2.3M",
      platform: "Facebook",
      flagged: "2 hours ago",
      severity: "high",
      category: "Natural Disaster"
    },
    {
      id: 2,
      title: "COVID vaccine causes magnetic attraction in 90% of recipients",
      url: "conspiracytruth.net/magnetic-vaccine-study",
      shares: "32K",
      views: "1.8M",
      platform: "Twitter",
      flagged: "4 hours ago",
      severity: "critical",
      category: "Health"
    },
    {
      id: 3,
      title: "Government secretly adding mind control chemicals to tap water",
      url: "truthexposed.org/water-mind-control-2024",
      shares: "28K",
      views: "1.2M",
      platform: "YouTube",
      flagged: "6 hours ago",
      severity: "high",
      category: "Conspiracy"
    },
    {
      id: 4,
      title: "5G towers cause bird deaths - thousands found dead nationwide",
      url: "naturalnews.fake/5g-bird-deaths-cover-up",
      shares: "19K",
      views: "890K",
      platform: "Instagram", 
      flagged: "8 hours ago",
      severity: "medium",
      category: "Technology"
    }
  ];

  const alerts = [
    {
      id: 1,
      type: 'flood',
      status: 'fake',
      false_claim: "Floods in Mumbai caused by dam burst",
      correction: "No dam burst occurred. Official cause: Heavy rainfall (350mm in 6 hours) combined with high tide conditions.",
      timestamp: "2 hours ago",
      verified_by: "Mumbai Municipal Corporation",
      impact: "High",
      reach: "2.1M people"
    },
    {
      id: 2,
      type: 'pandemic',
      status: 'fake',
      false_claim: "New COVID variant spreads via packaged food",
      correction: "WHO confirms food packaging is safe. No evidence of foodborne transmission of COVID-19 variants.",
      timestamp: "4 hours ago",
      verified_by: "World Health Organization",
      impact: "Critical",
      reach: "5.3M people"
    },
    {
      id: 3,
      type: 'election',
      status: 'warning',
      false_claim: "Voting machines hacked in District 5",
      correction: "Under investigation. Election Commission has deployed technical teams for verification.",
      timestamp: "6 hours ago",
      verified_by: "Election Commission",
      impact: "Medium",
      reach: "850K people"
    },
    {
      id: 4,
      type: 'earthquake',
      status: 'verified',
      false_claim: "Major earthquake predicted for next week",
      correction: "False prediction. Seismological surveys cannot predict exact timing of earthquakes.",
      timestamp: "8 hours ago",
      verified_by: "National Seismological Center",
      impact: "High",
      reach: "3.2M people"
    }
  ];

  const filteredAlerts = selectedFilter === 'all' 
    ? alerts 
    : alerts.filter(alert => alert.type === selectedFilter);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'fake':
        return {
          icon: X,
          bgColor: actualTheme === 'dark' 
            ? 'bg-gradient-to-r from-red-900/30 to-red-800/30' 
            : 'bg-gradient-to-r from-red-50 to-red-100',
          borderColor: actualTheme === 'dark' ? 'border-red-700' : 'border-red-300',
          textColor: actualTheme === 'dark' ? 'text-red-300' : 'text-red-800',
          iconColor: actualTheme === 'dark' ? 'text-red-400' : 'text-red-600',
          label: 'False Information',
          badgeColor: 'bg-red-500'
        };
      case 'verified':
        return {
          icon: CheckCircle,
          bgColor: actualTheme === 'dark' 
            ? 'bg-gradient-to-r from-green-900/30 to-green-800/30' 
            : 'bg-gradient-to-r from-green-50 to-green-100',
          borderColor: actualTheme === 'dark' ? 'border-green-700' : 'border-green-300',
          textColor: actualTheme === 'dark' ? 'text-green-300' : 'text-green-800',
          iconColor: actualTheme === 'dark' ? 'text-green-400' : 'text-green-600',
          label: 'Verified Information',
          badgeColor: 'bg-green-500'
        };
      default:
        return {
          icon: AlertTriangle,
          bgColor: actualTheme === 'dark' 
            ? 'bg-gradient-to-r from-yellow-900/30 to-yellow-800/30' 
            : 'bg-gradient-to-r from-yellow-50 to-yellow-100',
          borderColor: actualTheme === 'dark' ? 'border-yellow-700' : 'border-yellow-300',
          textColor: actualTheme === 'dark' ? 'text-yellow-300' : 'text-yellow-800',
          iconColor: actualTheme === 'dark' ? 'text-yellow-400' : 'text-yellow-600',
          label: 'Under Investigation',
          badgeColor: 'bg-yellow-500'
        };
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-500 text-white';
      case 'high':
        return 'bg-orange-500 text-white';
      case 'medium':
        return 'bg-yellow-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  return (
    <div 
      className={`min-h-screen transition-colors duration-300 ${
        actualTheme === 'dark'
          ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900'
          : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'
      }`}
      style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro", "Segoe UI", Roboto, sans-serif' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className={`transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className={`text-4xl font-bold mb-2 ${
                actualTheme === 'dark' ? 'text-white' : 'text-gray-900'
              }`} style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif' }}>
                Crisis Alert Feed
              </h1>
              <p className={`text-lg ${
                actualTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}>Real-time misinformation flagged with corrections</p>
              <div className={`flex items-center mt-2 text-sm ${
                actualTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
                  <span>Live • {liveCount} alerts monitored</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4 mt-4 md:mt-0">
              <div className="flex items-center gap-2">
                <Filter className={`h-5 w-5 ${
                  actualTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`} />
                <select
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                  className={`px-4 py-2 border rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-transparent shadow-sm hover:shadow-md transition-all duration-200 ${
                    actualTheme === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro", "Segoe UI", Roboto, sans-serif' }}
                >
                  {crisisTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label} ({type.count})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Popular Fake News Section */}
        <div className={`rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-8 mb-8 border transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'} ${
          actualTheme === 'dark'
            ? 'bg-gray-800 border-gray-700'
            : 'bg-white border-gray-100'
        }`} style={{ transitionDelay: '200ms' }}>
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="h-6 w-6 text-red-600" />
            <h2 
              className={`text-2xl font-bold relative ${
                actualTheme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}
              style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif' }}
            >
              🔥 Popular Fake News Flagged Today
              <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 rounded-full"></div>
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {popularFakeNews.map((item, index) => (
              <div 
                key={item.id} 
                className={`border rounded-2xl p-6 hover:shadow-xl hover:scale-105 transition-all duration-300 group cursor-pointer ${
                  actualTheme === 'dark'
                    ? 'bg-gradient-to-br from-red-900/20 to-gray-800 border-red-800'
                    : 'bg-gradient-to-br from-red-50 to-white border-red-200'
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSeverityColor(item.severity)}`}>
                        {item.severity.toUpperCase()}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        actualTheme === 'dark'
                          ? 'bg-red-900/50 text-red-300'
                          : 'bg-red-100 text-red-600'
                      }`}>
                        🚨 Flagged {item.flagged}
                      </span>
                    </div>
                    <h3 className={`font-semibold mb-3 line-clamp-2 group-hover:text-red-700 transition-colors duration-200 ${
                      actualTheme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {item.title}
                    </h3>
                    <div className={`flex items-center gap-3 text-sm mb-3 ${
                      actualTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        actualTheme === 'dark'
                          ? 'bg-gray-700 text-gray-300'
                          : 'bg-gray-100 text-gray-700'
                      }`}>{item.platform}</span>
                      <div className="flex items-center gap-1">
                        <Share2 className="h-3 w-3" />
                        <span>{item.shares} shares</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        <span>{item.views} views</span>
                      </div>
                    </div>
                    <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${
                      actualTheme === 'dark'
                        ? 'bg-blue-900/50 text-blue-300'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {item.category}
                    </span>
                  </div>
                  <ExternalLink className={`h-5 w-5 ml-3 flex-shrink-0 group-hover:text-blue-600 transition-colors duration-200 ${
                    actualTheme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                  }`} />
                </div>
                <div className={`text-xs px-3 py-2 rounded-lg border font-mono ${
                  actualTheme === 'dark'
                    ? 'text-gray-400 bg-gray-700 border-gray-600'
                    : 'text-gray-500 bg-white border-gray-200'
                }`}>
                  {item.url}
                </div>
              </div>
            ))}
          </div>
          
          <div className={`mt-6 p-4 rounded-2xl border ${
            actualTheme === 'dark'
              ? 'bg-gradient-to-r from-yellow-900/30 via-yellow-800/30 to-yellow-900/30 border-yellow-700'
              : 'bg-gradient-to-r from-yellow-50 via-yellow-100 to-yellow-50 border-yellow-200'
          }`}>
            <div className="flex items-start gap-3">
              <AlertTriangle className={`h-5 w-5 flex-shrink-0 mt-0.5 ${
                actualTheme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'
              }`} />
              <p className={`text-sm font-medium ${
                actualTheme === 'dark' ? 'text-yellow-300' : 'text-yellow-800'
              }`}>
                <strong>Warning:</strong> These links contain verified false information. 
                Do not share or click on suspicious links during crisis situations.
              </p>
            </div>
          </div>
        </div>

        {/* Crisis Alerts */}
        <div className="space-y-6">
          {filteredAlerts.map((alert, index) => {
            const statusConfig = getStatusConfig(alert.status);
            const StatusIcon = statusConfig.icon;

            return (
              <div 
                key={alert.id} 
                className={`rounded-2xl shadow-md hover:shadow-xl border-l-4 ${statusConfig.borderColor} hover:scale-102 transition-all duration-300 group transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'} ${
                  actualTheme === 'dark' ? 'bg-gray-800' : 'bg-white'
                }`}
                style={{ transitionDelay: `${400 + index * 100}ms` }}
              >
                <div className="p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-full ${statusConfig.bgColor}`}>
                        <StatusIcon className={`h-6 w-6 ${statusConfig.iconColor}`} />
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <span className={`text-sm font-semibold px-4 py-2 rounded-full ${statusConfig.bgColor} ${statusConfig.textColor} border ${statusConfig.borderColor}`}>
                          {statusConfig.label}
                        </span>
                        <span className={`text-sm capitalize px-4 py-2 rounded-full font-medium ${
                          actualTheme === 'dark'
                            ? 'text-gray-300 bg-gray-700'
                            : 'text-gray-500 bg-gray-100'
                        }`}>
                          {alert.type}
                        </span>
                      </div>
                    </div>
                    <div className={`flex flex-col items-end gap-2 text-sm ${
                      actualTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        {alert.timestamp}
                      </div>
                      <div className={`text-xs ${
                        actualTheme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                      }`}>
                        Impact: {alert.impact} • Reach: {alert.reach}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h3 className={`text-sm font-semibold mb-3 uppercase tracking-wider ${
                        actualTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                      }`}>False Claim:</h3>
                      <p className={`font-medium p-4 rounded-xl border ${
                        actualTheme === 'dark'
                          ? 'text-white bg-gradient-to-r from-gray-700 to-gray-600 border-gray-600'
                          : 'text-gray-900 bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200'
                      }`}>
                        "{alert.false_claim}"
                      </p>
                    </div>

                    <div>
                      <h3 className={`text-sm font-semibold mb-3 uppercase tracking-wider ${
                        actualTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                      }`}>Fact-Check Result:</h3>
                      <p className={`p-4 rounded-xl border ${
                        actualTheme === 'dark'
                          ? 'text-gray-200 bg-gradient-to-r from-blue-900/30 to-blue-800/30 border-blue-700'
                          : 'text-gray-700 bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200'
                      }`}>
                        {alert.correction}
                      </p>
                    </div>

                    <div className={`flex items-center gap-3 text-sm p-3 rounded-xl border ${
                      actualTheme === 'dark'
                        ? 'text-gray-300 bg-green-900/30 border-green-700'
                        : 'text-gray-600 bg-green-50 border-green-200'
                    }`}>
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span>Verified by: <span className={`font-semibold ${
                        actualTheme === 'dark' ? 'text-green-400' : 'text-green-700'
                      }`}>{alert.verified_by}</span></span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredAlerts.length === 0 && (
          <div className="text-center py-16">
            <div className={`rounded-2xl shadow-md p-12 border ${
              actualTheme === 'dark'
                ? 'bg-gray-800 border-gray-700'
                : 'bg-white border-gray-100'
            }`}>
              <AlertTriangle className={`h-16 w-16 mx-auto mb-6 ${
                actualTheme === 'dark' ? 'text-gray-500' : 'text-gray-400'
              }`} />
              <p className={`text-xl font-medium ${
                actualTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}>No alerts found for the selected filter</p>
              <p className={`mt-2 ${
                actualTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}>Try selecting a different crisis type or check back later.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Alerts;