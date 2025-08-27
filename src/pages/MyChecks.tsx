import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Clock, Search, Filter, Download, ExternalLink, Bookmark, BookmarkCheck } from 'lucide-react';

const MyChecks = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  // Mock data for submitted checks
  const [checks, setChecks] = useState([
    {
      id: 1,
      url: "https://example.com/news/climate-change-report-2024",
      title: "Climate Change Report Shows Alarming Trends",
      status: "verified",
      credibility: 92,
      date: "2024-01-20",
      time: "14:30",
      saved: true,
      category: "Environment"
    },
    {
      id: 2,
      url: "https://social.com/post/election-fraud-claims",
      title: "Widespread Election Fraud Allegations",
      status: "fake",
      credibility: 15,
      date: "2024-01-20",
      time: "10:15",
      saved: false,
      category: "Politics"
    },
    {
      id: 3,
      url: "https://news.com/health/vaccine-side-effects",
      title: "New Vaccine Research Findings",
      status: "warning",
      credibility: 68,
      date: "2024-01-19",
      time: "16:45",
      saved: true,
      category: "Health"
    },
    {
      id: 4,
      url: "https://tech.com/ai-breakthrough-quantum",
      title: "AI Technology Breakthrough in Quantum Computing",
      status: "verified",
      credibility: 87,
      date: "2024-01-19",
      time: "09:20",
      saved: false,
      category: "Technology"
    },
    {
      id: 5,
      url: "https://finance.com/crypto-market-crash",
      title: "Cryptocurrency Market Faces Major Crash",
      status: "warning",
      credibility: 72,
      date: "2024-01-18",
      time: "11:30",
      saved: true,
      category: "Finance"
    },
    {
      id: 6,
      url: "https://social.com/celebrity-scandal",
      title: "Celebrity Involved in Major Scandal",
      status: "fake",
      credibility: 23,
      date: "2024-01-18",
      time: "20:15",
      saved: false,
      category: "Entertainment"
    },
    {
      id: 7,
      url: "https://science.com/mars-discovery",
      title: "New Discovery on Mars Surface",
      status: "verified",
      credibility: 94,
      date: "2024-01-17",
      time: "13:45",
      saved: true,
      category: "Science"
    },
    {
      id: 8,
      url: "https://news.com/economic-policy-update",
      title: "Government Announces New Economic Policy",
      status: "pending",
      credibility: null,
      date: "2024-01-17",
      time: "08:00",
      saved: false,
      category: "Politics"
    }
  ]);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'fake':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-gray-600" />;
      default:
        return <Clock className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusBadge = (status) => {
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
    switch (status) {
      case 'verified':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'fake':
        return `${baseClasses} bg-red-100 text-red-800`;
      case 'warning':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'pending':
        return `${baseClasses} bg-gray-100 text-gray-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const getCredibilityColor = (credibility) => {
    if (credibility >= 80) return 'text-green-600';
    if (credibility >= 60) return 'text-yellow-600';
    if (credibility >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const toggleSaved = (id) => {
    setChecks(checks.map(check => 
      check.id === id ? { ...check, saved: !check.saved } : check
    ));
  };

  const filteredChecks = checks.filter(check => {
    const matchesSearch = check.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         check.url.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || check.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const sortedChecks = [...filteredChecks].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(b.date + ' ' + b.time) - new Date(a.date + ' ' + a.time);
      case 'credibility':
        return (b.credibility || 0) - (a.credibility || 0);
      case 'title':
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className={`transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Checks</h1>
              <p className="text-gray-600 mt-1">Track all your submitted fact-check requests</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200">
                <Download className="h-4 w-4 mr-2" />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className={`bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-200 transform transition-all duration-1000 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by title or URL..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="verified">Verified</option>
                  <option value="fake">Fake/Misleading</option>
                  <option value="warning">Needs Review</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              >
                <option value="date">Sort by Date</option>
                <option value="credibility">Sort by Credibility</option>
                <option value="title">Sort by Title</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Table */}
        <div className={`bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden transform transition-all duration-1000 delay-400 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Content
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Credibility
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedChecks.map((check, index) => (
                  <tr 
                    key={check.id} 
                    className="hover:bg-gray-50 transition-colors duration-200"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-start space-x-3">
                        {getStatusIcon(check.status)}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {check.title}
                          </p>
                          <div className="flex items-center mt-1">
                            <a
                              href={check.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-blue-600 hover:text-blue-800 truncate flex items-center"
                            >
                              {check.url}
                              <ExternalLink className="h-3 w-3 ml-1 flex-shrink-0" />
                            </a>
                          </div>
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 mt-1">
                            {check.category}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={getStatusBadge(check.status)}>
                        {check.status.charAt(0).toUpperCase() + check.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {check.credibility !== null ? (
                        <div className="flex items-center">
                          <span className={`text-sm font-medium ${getCredibilityColor(check.credibility)}`}>
                            {check.credibility}%
                          </span>
                          <div className="ml-2 w-16 bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                check.credibility >= 80 ? 'bg-green-500' :
                                check.credibility >= 60 ? 'bg-yellow-500' :
                                check.credibility >= 40 ? 'bg-orange-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${check.credibility}%` }}
                            ></div>
                          </div>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">Pending</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>
                        <p>{check.date}</p>
                        <p className="text-xs">{check.time}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => toggleSaved(check.id)}
                          className={`p-1 rounded transition-colors duration-200 ${
                            check.saved 
                              ? 'text-blue-600 hover:text-blue-800' 
                              : 'text-gray-400 hover:text-gray-600'
                          }`}
                        >
                          {check.saved ? (
                            <BookmarkCheck className="h-4 w-4" />
                          ) : (
                            <Bookmark className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary Stats */}
        <div className={`mt-8 grid grid-cols-1 md:grid-cols-4 gap-4 transform transition-all duration-1000 delay-600 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
            <p className="text-sm text-gray-600">Total Checks</p>
            <p className="text-2xl font-bold text-gray-900">{checks.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
            <p className="text-sm text-gray-600">Verified</p>
            <p className="text-2xl font-bold text-green-600">
              {checks.filter(c => c.status === 'verified').length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
            <p className="text-sm text-gray-600">Fake/Misleading</p>
            <p className="text-2xl font-bold text-red-600">
              {checks.filter(c => c.status === 'fake').length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
            <p className="text-sm text-gray-600">Saved Items</p>
            <p className="text-2xl font-bold text-blue-600">
              {checks.filter(c => c.saved).length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyChecks;
