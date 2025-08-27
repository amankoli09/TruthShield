import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { CheckCircle, X, AlertTriangle, ArrowLeft, Globe, Shield, FileText } from 'lucide-react';

const VerificationResult = () => {
  const location = useLocation();
  const searchText = location.state?.searchText || "Sample misinformation about floods in Mumbai";

  // Mock result - in real app this would come from API
  const result = {
    status: 'fake',
    confidence: 78,
    explanation: "Comments and fact-check sources contradict this claim. No official reports confirm dam burst as cause of Mumbai floods.",
    sources: [
      { name: "Wikipedia", icon: Globe, verified: true },
      { name: "Snopes", icon: Shield, verified: true },
      { name: "FactCheck.org", icon: FileText, verified: true },
      { name: "PolitiFact", icon: CheckCircle, verified: false }
    ],
    timestamp: new Date().toLocaleString()
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'verified':
        return {
          icon: CheckCircle,
          bgColor: 'bg-green-50',
          borderColor: 'border-green-300',
          textColor: 'text-green-800',
          iconColor: 'text-green-600',
          label: '✅ True',
          badgeColor: 'bg-green-100 text-green-800'
        };
      case 'fake':
        return {
          icon: X,
          bgColor: 'bg-red-50',
          borderColor: 'border-red-300',
          textColor: 'text-red-800',
          iconColor: 'text-red-600',
          label: '❌ Fake',
          badgeColor: 'bg-red-100 text-red-800'
        };
      default:
        return {
          icon: AlertTriangle,
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-300',
          textColor: 'text-yellow-800',
          iconColor: 'text-yellow-600',
          label: '⚠️ Unverified',
          badgeColor: 'bg-yellow-100 text-yellow-800'
        };
    }
  };

  const statusConfig = getStatusConfig(result.status);
  const StatusIcon = statusConfig.icon;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-6">
        <Link 
          to="/verify" 
          className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Verify
        </Link>
      </div>

      {/* Main Result Card */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
        {/* Status Header */}
        <div className={`${statusConfig.bgColor} px-6 py-8 text-center border-b-2 ${statusConfig.borderColor}`}>
          <StatusIcon className={`h-16 w-16 ${statusConfig.iconColor} mx-auto mb-4`} />
          <h1 className={`text-3xl font-bold ${statusConfig.textColor} mb-2`}>
            {statusConfig.label}
          </h1>
          <div className={`inline-flex items-center px-4 py-2 rounded-full text-lg font-semibold ${statusConfig.badgeColor}`}>
            {result.confidence}% Confidence
          </div>
        </div>

        <div className="p-6">
          {/* Analyzed Content */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Analyzed Content</h3>
            <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-gray-300">
              <p className="text-gray-700 italic">"{searchText}"</p>
            </div>
          </div>

          {/* Why Section */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Why</h3>
            <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
              <p className="text-gray-800 font-medium">
                {result.explanation}
              </p>
            </div>
          </div>

          {/* Confidence Score Visualization */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Confidence Score</h3>
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <span className="text-lg font-medium text-gray-700">Verification Accuracy</span>
                <span className="text-2xl font-bold text-gray-900">{result.confidence}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
                <div 
                  className={`h-4 rounded-full transition-all duration-500 ${
                    result.confidence >= 80 ? 'bg-green-500' : 
                    result.confidence >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${result.confidence}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600">
                {result.confidence >= 80 ? 'High confidence in verification' : 
                 result.confidence >= 60 ? 'Moderate confidence' : 'Low confidence - needs more verification'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sources */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Sources Consulted</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {result.sources.map((source, index) => {
            const IconComponent = source.icon;
            return (
              <div key={index} className="text-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
                  <IconComponent className={`h-6 w-6 ${source.verified ? 'text-green-600' : 'text-gray-400'}`} />
                </div>
                <p className="font-medium text-gray-900 text-sm">{source.name}</p>
                <div className="mt-2">
                  {source.verified ? (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                      Checking...
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <p className="text-sm text-gray-600 mt-4 text-center">
          Verified against {result.sources.filter(s => s.verified).length} of {result.sources.length} fact-checking sources
        </p>
      </div>
    </div>
  );
};

export default VerificationResult;