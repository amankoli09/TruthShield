import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, AlertTriangle, Shield, Zap, Eye, Users, CheckCircle, Globe, TrendingUp } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const Home = () => {
  const { actualTheme } = useTheme();
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [currentStat, setCurrentStat] = useState(0);

  const stats = [
    { number: "10M+", label: "Claims Verified", icon: CheckCircle },
    { number: "99.2%", label: "Accuracy Rate", icon: Shield },
    { number: "24/7", label: "Real-time Monitoring", icon: Eye },
    { number: "150+", label: "Countries Protected", icon: Globe }
  ];

  const floatingElements = [
    { icon: Shield, delay: 0, x: 10, y: 20 },
    { icon: Search, delay: 1000, x: 85, y: 15 },
    { icon: AlertTriangle, delay: 2000, x: 15, y: 70 },
    { icon: Zap, delay: 1500, x: 90, y: 80 },
    { icon: Eye, delay: 500, x: 50, y: 10 },
    { icon: TrendingUp, delay: 2500, x: 75, y: 60 }
  ];

  useEffect(() => {
    setIsVisible(true);
    
    // Cycle through stats
    const interval = setInterval(() => {
      setCurrentStat((prev) => (prev + 1) % stats.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleVerifyClick = () => {
    navigate('/verify');
  };

  return (
    <div className={`min-h-screen overflow-hidden relative transition-colors duration-300 ${
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
                animation: `float 6s ease-in-out infinite`,
                animationDelay: `${element.delay}ms`
              }}
            >
              <Icon className={`w-8 h-8 ${
                actualTheme === 'dark' ? 'text-gray-200' : 'text-gray-800'
              }`} />
            </div>
          );
        })}
      </div>

      {/* Animated Background Gradient */}
      <div className={`absolute inset-0 animate-pulse ${
        actualTheme === 'dark'
          ? 'bg-gradient-to-r from-gray-600/5 via-gray-500/5 to-gray-400/5'
          : 'bg-gradient-to-r from-gray-200/5 via-gray-300/5 to-gray-400/5'
      }`}></div>

      {/* Hero Section */}
      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 pt-20 pb-32">
        <div className="text-center">
          {/* Enhanced Logo/Shield with TruthShield Branding */}
          <div className={`transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="flex flex-col items-center mb-16 relative">
              {/* Floating Particles Background */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className={`absolute w-2 h-2 rounded-full animate-float ${
                      actualTheme === 'dark'
                        ? 'bg-gradient-to-r from-blue-300 to-purple-400 opacity-30'
                        : 'bg-gradient-to-r from-blue-400 to-purple-500 opacity-20'
                    }`}
                    style={{
                      left: `${20 + i * 10}%`,
                      top: `${30 + (i % 3) * 20}%`,
                      animationDelay: `${i * 0.5}s`,
                      animationDuration: `${3 + i * 0.5}s`
                    }}
                  />
                ))}
              </div>

              {/* Animated Shield with Advanced Effects */}
              <div className="relative mb-8">
                {/* Outer Glow Rings */}
                <div className="absolute inset-0 w-40 h-40 -translate-x-4 -translate-y-4">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 via-purple-500/20 to-pink-500/20 rounded-full blur-xl animate-spin-slow"></div>
                  <div className="absolute inset-2 bg-gradient-to-r from-pink-400/15 via-blue-500/15 to-purple-500/15 rounded-full blur-lg animate-spin-reverse"></div>
                </div>
                
                {/* Main Shield Container */}
                <div className="relative inline-flex items-center justify-center w-32 h-32 rounded-full shadow-2xl overflow-hidden"
                     style={{
                       background: 'linear-gradient(135deg, #1f2937 0%, #111827 50%, #1f2937 100%)',
                       boxShadow: '0 0 50px rgba(59, 130, 246, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                     }}>
                  
                  {/* Animated Background Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10 animate-gradient-shift"></div>
                  
                  {/* Reduced Shimmer Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/8 to-transparent -translate-x-full animate-shimmer-subtle rounded-full"></div>
                  
                  {/* Shield Icon */}
                  <Shield className="w-16 h-16 text-white relative z-10 drop-shadow-lg animate-float-gentle" />
                  
                  {/* Inner Glow */}
                  <div className="absolute inset-2 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 rounded-full animate-pulse"></div>
                </div>
              </div>
              
              {/* Enhanced TruthShield Brand Text */}
              <div className="text-center relative">
                {/* Background Text Glow */}
                <div className="absolute inset-0 blur-sm">
                  <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-blue-500/20">
                    TruthShield
                  </h1>
                </div>
                
                {/* Main Text */}
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 relative">
                  <span className={`text-transparent bg-clip-text drop-shadow-sm ${
                    actualTheme === 'dark'
                      ? 'bg-gradient-to-r from-gray-100 via-white to-gray-200'
                      : 'bg-gradient-to-r from-gray-800 via-gray-900 to-black'
                  }`}>
                    Truth
                  </span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 drop-shadow-sm animate-gradient-text">
                    Shield
                  </span>
                </h1>
                
                {/* Animated Underline */}
                <div className="relative mx-auto w-40 h-1 mb-4">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full animate-pulse"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-shimmer-line rounded-full"></div>
                </div>
                
                {/* Tagline */}
                <p className={`text-lg font-medium animate-fade-in-up ${
                  actualTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Defending Truth in the Digital Age
                </p>
              </div>
            </div>
          </div>

          {/* Main Headline with Enhanced Effects */}
          <div className={`transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <h2 className={`text-3xl md:text-4xl lg:text-5xl font-bold text-transparent bg-clip-text mb-8 leading-tight ${
              actualTheme === 'dark'
                ? 'bg-gradient-to-r from-white via-gray-100 to-gray-200'
                : 'bg-gradient-to-r from-black via-gray-800 to-gray-900'
            }`}>
              <span className="inline-block animate-pulse">Truth Matters</span>
              <br />
              <span className="inline-block animate-pulse delay-500">in Crisis</span>
            </h2>
          </div>
          
          {/* Animated Subtext */}
          <div className={`transform transition-all duration-1000 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <p className={`text-xl md:text-2xl mb-4 font-medium animate-fade-in-up ${
              actualTheme === 'dark' ? 'text-gray-200' : 'text-gray-700'
            }`}>
              Verify viral content in <span className={`font-bold animate-pulse ${
                actualTheme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>seconds</span>. Paste a link, get the truth.
            </p>
          </div>
          
          {/* Tagline */}
          <div className={`transform transition-all duration-1000 delay-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <p className={`text-lg mb-12 max-w-2xl mx-auto ${
              actualTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`}>
              Stay safe during critical moments when misinformation spreads fastest
            </p>
          </div>

          {/* Animated Action Buttons */}
          <div className={`transform transition-all duration-1000 delay-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-lg mx-auto">
              <button
                onClick={handleVerifyClick}
                className="group relative flex-1 inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white bg-gradient-to-r from-gray-800 via-gray-700 to-black rounded-xl hover:from-gray-900 hover:via-gray-800 hover:to-gray-700 transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105 hover:-translate-y-1 overflow-hidden"
              >
                {/* Continuous shiny overlay effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 animate-shimmer"></div>
                
                {/* Animated border glow */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-gray-600 via-gray-400 to-gray-600 opacity-10 blur-sm animate-pulse"></div>
                
                <Search className="mr-3 h-5 w-5 group-hover:animate-spin relative z-10" />
                <span className="relative z-10">Verify Information</span>
              </button>
              <Link
                to="/alerts"
                className="group relative flex-1 inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-gray-800 bg-white border-2 border-gray-800 rounded-xl hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 hover:-translate-y-1 overflow-hidden"
              >
                {/* Contained glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-orange-400/10 via-yellow-400/10 to-orange-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                
                {/* Subtle shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer rounded-xl"></div>
                
                <AlertTriangle className="mr-3 h-5 w-5 relative z-10" />
                <span className="relative z-10">View Crisis Updates</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Animated Stats Section */}
        <div className={`transform transition-all duration-1000 delay-1200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              const isActive = currentStat === index;
              return (
                <div
                  key={index}
                  className={`text-center p-6 rounded-xl backdrop-blur-sm shadow-lg transition-all duration-500 transform ${
                    isActive 
                      ? actualTheme === 'dark'
                        ? 'scale-110 bg-blue-900/50 shadow-2xl'
                        : 'scale-110 bg-blue-50 shadow-2xl'
                      : actualTheme === 'dark'
                        ? 'bg-gray-800/80 hover:scale-105'
                        : 'bg-white/80 hover:scale-105'
                  }`}
                >
                  <Icon className={`w-8 h-8 mx-auto mb-3 transition-colors duration-300 ${
                    isActive 
                      ? 'text-blue-600 animate-pulse' 
                      : actualTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                  }`} />
                  <div className={`text-2xl font-bold transition-colors duration-300 ${
                    isActive 
                      ? 'text-blue-600' 
                      : actualTheme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {stat.number}
                  </div>
                  <div className={`text-sm ${
                    actualTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Enhanced Features Section */}
      <div className={`backdrop-blur-sm py-20 relative ${
        actualTheme === 'dark' ? 'bg-gray-800/90' : 'bg-white/90'
      }`}>
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className={`text-center mb-16 transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <h2 className={`text-4xl font-bold mb-4 ${
              actualTheme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>Powered by Advanced AI</h2>
            <p className={`text-xl ${
              actualTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}>Experience the future of fact-checking</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                icon: Search,
                title: "Instant Verification",
                description: "AI-powered fact-checking in real-time with confidence scores and detailed explanations",
                color: "blue",
                delay: 400
              },
              {
                icon: AlertTriangle,
                title: "Crisis Monitoring",
                description: "Track and debunk misinformation during emergencies, natural disasters, and public health crises",
                color: "yellow",
                delay: 600
              },
              {
                icon: Users,
                title: "Community Safety",
                description: "Help protect your community by sharing verified information and stopping the spread of false claims",
                color: "green",
                delay: 800
              }
            ].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className={`group text-center transform transition-all duration-1000 delay-${feature.delay} ${
                    isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                  }`}
                >
                  <div className={`relative w-20 h-20 bg-${feature.color}-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg group-hover:shadow-xl`}>
                    <Icon className={`h-10 w-10 text-${feature.color}-600 group-hover:animate-pulse`} strokeWidth={1.5} />
                    <div className={`absolute inset-0 bg-${feature.color}-200 rounded-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-300`}></div>
                  </div>
                  <h3 className={`text-xl font-semibold mb-4 group-hover:text-blue-600 transition-colors duration-300 ${
                    actualTheme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {feature.title}
                  </h3>
                  <p className={`leading-relaxed ${
                    actualTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className={`py-16 relative overflow-hidden ${
        actualTheme === 'dark' ? 'bg-gray-900' : 'bg-black'
      }`}>
        <div className={`absolute inset-0 ${
          actualTheme === 'dark' ? 'bg-gray-900/10' : 'bg-black/10'
        }`}></div>
        <div className="relative max-w-4xl mx-auto text-center px-6 lg:px-8">
          <div className={`transform transition-all duration-1000 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Fight Misinformation?
            </h2>
            <p className={`text-xl mb-8 ${
              actualTheme === 'dark' ? 'text-gray-200' : 'text-blue-100'
            }`}>
              Join thousands of users who trust TruthShield to keep them informed
            </p>
            <button
              onClick={handleVerifyClick}
              className="group relative inline-flex items-center px-8 py-4 text-lg font-medium text-white bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 rounded-xl hover:from-yellow-300 hover:via-orange-400 hover:to-pink-400 transition-all duration-300 shadow-2xl hover:shadow-[0_0_50px_rgba(251,191,36,0.8)] transform hover:scale-110 hover:-translate-y-2 overflow-hidden animate-pulse"
            >
              {/* Multiple layered glow effects - always visible */}
              <div className="absolute -inset-2 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 rounded-xl blur opacity-60 group-hover:opacity-80 animate-pulse"></div>
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 via-cyan-500 to-green-500 rounded-xl blur-sm opacity-40 group-hover:opacity-60 animate-spin-slow"></div>
              
              {/* Continuous shimmer effects */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/80 to-transparent transform -skew-x-12 animate-shimmer"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-200/60 to-transparent transform skew-x-12 animate-shimmer-continuous"></div>
              
              {/* Continuous ripple effect */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-yellow-300/30 via-orange-300/30 to-pink-300/30 animate-ping"></div>
              
              {/* Enhanced border glow - always visible */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-yellow-300 via-orange-300 to-pink-300 opacity-50 group-hover:opacity-80 blur-sm animate-gradient-shift"></div>
              
              {/* Inner content container */}
              <div className="relative z-10 flex items-center">
                <Zap className="mr-3 h-5 w-5 text-white animate-bounce group-hover:text-yellow-200 transition-colors duration-300 drop-shadow-lg" />
                <span className="font-bold text-white drop-shadow-lg group-hover:text-yellow-100 transition-all duration-300">Start Verifying Now</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        
        @keyframes float-gentle {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
        
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%) skewX(-12deg); }
          100% { transform: translateX(200%) skewX(-12deg); }
        }
        
        @keyframes shimmer-continuous {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        
        @keyframes shimmer-line {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes gradient-text {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes spin-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
        }
        
        .animate-shimmer {
          animation: shimmer 3s ease-in-out infinite;
        }
        
        .animate-shimmer-continuous {
          animation: shimmer-continuous 1.5s ease-in-out infinite;
        }
        
        .animate-shimmer-subtle {
          animation: shimmer-continuous 2.5s ease-in-out infinite;
        }
        
        .animate-shimmer-line {
          animation: shimmer-line 2s ease-in-out infinite;
        }
        
        .animate-float-gentle {
          animation: float-gentle 2s ease-in-out infinite;
        }
        
        .animate-gradient-shift {
          animation: gradient-shift 2.5s ease-in-out infinite;
          background-size: 200% 200%;
        }
        
        .animate-gradient-text {
          animation: gradient-text 2s ease-in-out infinite;
          background-size: 200% 200%;
        }
        
        .animate-spin-slow {
          animation: spin-slow 5s linear infinite;
        }
        
        .animate-spin-reverse {
          animation: spin-reverse 4s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Home;