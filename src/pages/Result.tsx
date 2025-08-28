import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Clock, Shield, AlertTriangle, CheckCircle, X } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import verificationService, { VerificationResult } from '../services/verificationService';

const Result = () => {
  const { actualTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const searchText = location.state?.searchText;
  const verificationResult = location.state?.verificationResult;
  const errorFromVerify = location.state?.error;

  useEffect(() => {
    if (!searchText) {
      navigate('/verify');
      return;
    }

    // If we already have a result from the Verify page, use it
    if (verificationResult) {
      setResult(verificationResult);
      setLoading(false);
      return;
    }

    // If there was an error from the Verify page, show it
    if (errorFromVerify) {
      setError(errorFromVerify);
      setLoading(false);
      return;
    }

    // Otherwise, perform verification (fallback)
    const performVerification = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Frontend: Starting verification for:', searchText);
        
        const isUrl = searchText.startsWith('http://') || searchText.startsWith('https://');
        const result = await verificationService.verifyContent(
          searchText,
          isUrl ? 'url' : 'text'
        );
        
        console.log('Frontend: Received result:', result);
        setResult(result);
      } catch (err) {
        console.error('Frontend: Verification error:', err);
        setError(err instanceof Error ? err.message : 'Failed to verify content');
      } finally {
        setLoading(false);
      }
    };

    performVerification();
  }, [searchText, verificationResult, errorFromVerify, navigate]);

  const getStatusConfig = (result: string) => {
    switch (result) {
      case 'true':
        return {
          icon: CheckCircle,
          color: actualTheme === 'dark' ? 'text-green-400' : 'text-green-600',
          bgColor: actualTheme === 'dark' ? 'bg-green-900/20' : 'bg-green-50',
          borderColor: actualTheme === 'dark' ? 'border-green-700' : 'border-green-200',
          label: 'Verified as True'
        };
      case 'false':
        return {
          icon: X,
          color: actualTheme === 'dark' ? 'text-red-400' : 'text-red-600',
          bgColor: actualTheme === 'dark' ? 'bg-red-900/20' : 'bg-red-50',
          borderColor: actualTheme === 'dark' ? 'border-red-700' : 'border-red-200',
          label: 'Identified as False'
        };
      case 'partially-false':
        return {
          icon: AlertTriangle,
          color: actualTheme === 'dark' ? 'text-orange-400' : 'text-orange-600',
          bgColor: actualTheme === 'dark' ? 'bg-orange-900/20' : 'bg-orange-50',
          borderColor: actualTheme === 'dark' ? 'border-orange-700' : 'border-orange-200',
          label: 'Partially False'
        };
      default:
        return {
          icon: AlertTriangle,
          color: actualTheme === 'dark' ? 'text-blue-400' : 'text-blue-600',
          bgColor: actualTheme === 'dark' ? 'bg-blue-900/20' : 'bg-blue-50',
          borderColor: actualTheme === 'dark' ? 'border-blue-700' : 'border-blue-200',
          label: 'Unverified'
        };
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen transition-colors duration-300 ${
        actualTheme === 'dark'
          ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900'
          : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'
      }`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className={`rounded-2xl shadow-lg p-8 border ${
            actualTheme === 'dark'
              ? 'bg-gray-800 border-gray-700'
              : 'bg-white border-gray-100'
          }`}>
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <h2 className={`text-xl font-semibold mb-2 ${
                actualTheme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>Analyzing Content</h2>
              <p className={`${
                actualTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}>Please wait while we verify the information...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen transition-colors duration-300 ${
        actualTheme === 'dark'
          ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900'
          : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'
      }`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className={`rounded-2xl shadow-lg p-8 border ${
            actualTheme === 'dark'
              ? 'bg-gray-800 border-gray-700'
              : 'bg-white border-gray-100'
          }`}>
            <div className="text-center">
              <X className={`h-12 w-12 mx-auto mb-4 ${
                actualTheme === 'dark' ? 'text-red-400' : 'text-red-600'
              }`} />
              <h2 className={`text-xl font-semibold mb-2 ${
                actualTheme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>Verification Failed</h2>
              <p className={`mb-4 ${
                actualTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}>{error}</p>
              <button
                onClick={() => navigate('/verify')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!result) {
    return null;
  }

  const statusConfig = getStatusConfig(result.result);
  const StatusIcon = statusConfig.icon;

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      actualTheme === 'dark'
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900'
        : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'
    }`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/verify')}
            className={`flex items-center gap-2 mb-4 px-4 py-2 rounded-lg transition-colors ${
              actualTheme === 'dark'
                ? 'text-gray-300 hover:text-white hover:bg-gray-700'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Verify
          </button>
          
          <h1 className={`text-3xl font-bold ${
            actualTheme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Verification Results
          </h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Results */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status Card */}
            <div className={`rounded-2xl shadow-lg p-6 border ${
              actualTheme === 'dark'
                ? 'bg-gray-800 border-gray-700'
                : 'bg-white border-gray-100'
            }`}>
              <div className={`p-4 rounded-xl ${statusConfig.bgColor} border ${statusConfig.borderColor} mb-6`}>
                <div className="flex items-center gap-4">
                  <StatusIcon className={`h-8 w-8 ${statusConfig.color}`} />
                  <div>
                    <h2 className={`text-xl font-bold ${statusConfig.color}`}>
                      {statusConfig.label}
                    </h2>
                    <p className={`text-sm ${
                      actualTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      Confidence: {Math.round(result.confidence * 100)}%
                    </p>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className={`font-semibold mb-2 ${
                  actualTheme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  Content Analyzed:
                </h3>
                <p className={`p-4 rounded-lg border ${
                  actualTheme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-gray-200'
                    : 'bg-gray-50 border-gray-200 text-gray-700'
                }`}>
                  {result.content}
                </p>
              </div>

              <div>
                <h3 className={`font-semibold mb-2 ${
                  actualTheme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  Explanation:
                </h3>
                <p className={`${
                  actualTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {result.explanation}
                </p>
              </div>
            </div>

            {/* Fact Checks */}
            {result.factChecks && result.factChecks.length > 0 && (
              <div className={`rounded-2xl shadow-lg p-6 border ${
                actualTheme === 'dark'
                  ? 'bg-gray-800 border-gray-700'
                  : 'bg-white border-gray-100'
              }`}>
                <h3 className={`text-lg font-bold mb-4 ${
                  actualTheme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  Fact Check Sources
                </h3>
                <div className="space-y-4">
                  {result.factChecks.map((factCheck, index) => (
                    <div key={index} className={`p-4 rounded-lg border ${
                      actualTheme === 'dark'
                        ? 'bg-gray-700 border-gray-600'
                        : 'bg-gray-50 border-gray-200'
                    }`}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className={`font-medium mb-1 ${
                            actualTheme === 'dark' ? 'text-white' : 'text-gray-900'
                          }`}>
                            {factCheck.title}
                          </h4>
                          <p className={`text-sm mb-2 ${
                            actualTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                          }`}>
                            {factCheck.snippet}
                          </p>
                          <p className={`text-xs ${
                            actualTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                          }`}>
                            Source: {factCheck.source}
                          </p>
                        </div>
                        <a
                          href={factCheck.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`ml-4 p-2 rounded-lg transition-colors ${
                            actualTheme === 'dark'
                              ? 'text-gray-400 hover:text-blue-400 hover:bg-gray-600'
                              : 'text-gray-500 hover:text-blue-600 hover:bg-gray-100'
                          }`}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Related News */}
            {result.relatedNews && result.relatedNews.length > 0 && (
              <div className={`rounded-2xl shadow-lg p-6 border ${
                actualTheme === 'dark'
                  ? 'bg-gray-800 border-gray-700'
                  : 'bg-white border-gray-100'
              }`}>
                <h3 className={`text-lg font-bold mb-4 ${
                  actualTheme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  Related News Coverage
                </h3>
                <div className="space-y-4">
                  {result.relatedNews.map((news, index) => (
                    <div key={index} className={`p-4 rounded-lg border ${
                      actualTheme === 'dark'
                        ? 'bg-gray-700 border-gray-600'
                        : 'bg-gray-50 border-gray-200'
                    }`}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className={`font-medium mb-1 ${
                            actualTheme === 'dark' ? 'text-white' : 'text-gray-900'
                          }`}>
                            {news.title}
                          </h4>
                          <p className={`text-sm mb-2 ${
                            actualTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                          }`}>
                            {news.description}
                          </p>
                          <div className="flex items-center gap-4 text-xs">
                            <span className={`${
                              actualTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                            }`}>
                              {news.source}
                            </span>
                            <span className={`${
                              actualTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                            }`}>
                              {new Date(news.publishedAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <a
                          href={news.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`ml-4 p-2 rounded-lg transition-colors ${
                            actualTheme === 'dark'
                              ? 'text-gray-400 hover:text-blue-400 hover:bg-gray-600'
                              : 'text-gray-500 hover:text-blue-600 hover:bg-gray-100'
                          }`}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Analysis Details */}
            <div className={`rounded-2xl shadow-lg p-6 border ${
              actualTheme === 'dark'
                ? 'bg-gray-800 border-gray-700'
                : 'bg-white border-gray-100'
            }`}>
              <h3 className={`text-lg font-bold mb-4 ${
                actualTheme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Analysis Details
              </h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className={`font-medium mb-2 ${
                    actualTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Processing Time
                  </h4>
                  <div className="flex items-center gap-2">
                    <Clock className={`h-4 w-4 ${
                      actualTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`} />
                    <span className={`text-sm ${
                      actualTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {result.processingTime}ms
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className={`font-medium mb-2 ${
                    actualTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Credibility Score
                  </h4>
                  <div className="flex items-center gap-2">
                    <Shield className={`h-4 w-4 ${
                      actualTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`} />
                    <span className={`text-sm ${
                      actualTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {Math.round(result.details.credibilityScore * 100)}%
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className={`font-medium mb-2 ${
                    actualTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Sources Checked
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {result.sources.map((source, index) => (
                      <span
                        key={index}
                        className={`px-2 py-1 text-xs rounded-full ${
                          actualTheme === 'dark'
                            ? 'bg-gray-700 text-gray-300'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {source}
                      </span>
                    ))}
                  </div>
                </div>

                {result.details.keywords.length > 0 && (
                  <div>
                    <h4 className={`font-medium mb-2 ${
                      actualTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Key Terms
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {result.details.keywords.map((keyword, index) => (
                        <span
                          key={index}
                          className={`px-2 py-1 text-xs rounded-full ${
                            actualTheme === 'dark'
                              ? 'bg-blue-900/30 text-blue-300'
                              : 'bg-blue-100 text-blue-700'
                          }`}
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className={`rounded-2xl shadow-lg p-6 border ${
              actualTheme === 'dark'
                ? 'bg-gray-800 border-gray-700'
                : 'bg-white border-gray-100'
            }`}>
              <h3 className={`text-lg font-bold mb-4 ${
                actualTheme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Actions
              </h3>
              
              <div className="space-y-3">
                <button
                  onClick={() => navigate('/verify')}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
                >
                  Verify Another
                </button>
                
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    // You could add a toast notification here
                  }}
                  className={`w-full py-2 px-4 rounded-lg transition-colors border ${
                    actualTheme === 'dark'
                      ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Share Results
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Result;
