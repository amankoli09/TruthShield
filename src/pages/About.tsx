import { useState, useEffect } from 'react';
import { Shield, Brain, Users, Github, Linkedin, Mail, Target, Zap, Award, Globe, CheckCircle, Star, ArrowRight, Sparkles } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const About = () => {
  const { actualTheme } = useTheme();
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('mission');

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const stats = [
    { label: 'Facts Verified', value: '2.5M+', icon: CheckCircle },
    { label: 'Lives Protected', value: '500K+', icon: Shield },
    { label: 'Countries Served', value: '25+', icon: Globe },
    { label: 'Accuracy Rate', value: '99.2%', icon: Award }
  ];

  const technologies = [
    {
      title: 'Agentic AI',
      description: 'Autonomous AI agents that continuously monitor and verify information across multiple sources in real-time.',
      icon: Brain,
      color: 'from-blue-500 to-purple-600'
    },
    {
      title: 'Natural Language Processing',
      description: 'Advanced NLP models that understand context, sentiment, and credibility patterns in textual content.',
      icon: Zap,
      color: 'from-green-500 to-teal-600'
    },
    {
      title: 'Fact-Checking APIs',
      description: 'Integration with trusted fact-checking organizations and official government data sources.',
      icon: Globe,
      color: 'from-orange-500 to-red-600'
    },
    {
      title: 'Machine Learning',
      description: 'Continuously learning algorithms that improve accuracy through pattern recognition and historical data.',
      icon: Target,
      color: 'from-purple-500 to-pink-600'
    }
  ];

  const teamMembers = [
    {
      role: 'AI Engineers',
      description: 'Building intelligent verification systems',
      icon: Brain,
      color: 'bg-gradient-to-br from-blue-50 to-blue-100',
      iconColor: 'text-blue-600',
      count: '12+'
    },
    {
      role: 'Fact Checkers',
      description: 'Ensuring accuracy and credibility',
      icon: Users,
      color: 'bg-gradient-to-br from-green-50 to-green-100',
      iconColor: 'text-green-600',
      count: '8+'
    },
    {
      role: 'Crisis Experts',
      description: 'Understanding emergency information needs',
      icon: Shield,
      color: 'bg-gradient-to-br from-yellow-50 to-yellow-100',
      iconColor: 'text-yellow-600',
      count: '6+'
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
        
        @keyframes glow-pulse {
          0%, 100% { 
            filter: drop-shadow(0 0 8px rgba(59, 130, 246, 0.3)) drop-shadow(0 0 16px rgba(147, 51, 234, 0.2));
          }
          50% { 
            filter: drop-shadow(0 0 12px rgba(59, 130, 246, 0.5)) drop-shadow(0 0 24px rgba(147, 51, 234, 0.3));
          }
        }
        
        @keyframes glow-pulse-intense {
          0%, 100% { 
            filter: drop-shadow(0 0 12px rgba(59, 130, 246, 0.5)) drop-shadow(0 0 24px rgba(147, 51, 234, 0.3));
          }
          50% { 
            filter: drop-shadow(0 0 20px rgba(59, 130, 246, 0.7)) drop-shadow(0 0 32px rgba(147, 51, 234, 0.5));
          }
        }
        
        .shimmer-shield {
          background: linear-gradient(
            90deg,
            rgba(59, 130, 246, 0.8) 0%,
            rgba(147, 51, 234, 0.9) 25%,
            rgba(59, 130, 246, 1) 50%,
            rgba(147, 51, 234, 0.9) 75%,
            rgba(59, 130, 246, 0.8) 100%
          );
          background-size: 200% 100%;
          animation: shimmer 4s ease-in-out infinite, glow-pulse 3s ease-in-out infinite;
          transition: all 0.3s ease;
        }
        
        .shimmer-shield:hover {
          animation: shimmer-fast 2s ease-in-out infinite, glow-pulse-intense 2s ease-in-out infinite;
        }
        
        .shimmer-text {
          background: linear-gradient(
            90deg,
            #1f2937 0%,
            #3b82f6 20%,
            #9333ea 40%,
            #3b82f6 60%,
            #1f2937 80%,
            #1f2937 100%
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
          text-shadow: 0 0 20px rgba(59, 130, 246, 0.3), 0 0 40px rgba(147, 51, 234, 0.2);
        }
        
        .gradient-text {
          background: linear-gradient(90deg, #3b82f6, #9333ea);
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      `}</style>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className={`text-center mb-16 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="flex justify-center mb-8">
            <div className="relative group cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-lg opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
              <div className="relative shimmer-shield p-6 rounded-full">
                <Shield className="h-16 w-16 text-white relative z-10" />
              </div>
            </div>
          </div>
          <h1 
            className="text-5xl font-bold mb-6 cursor-pointer"
            style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif' }}
          >
            <span className="shimmer-text">About </span>
            <span className="gradient-text">TruthShield</span>
          </h1>
          <p className={`text-xl max-w-3xl mx-auto leading-relaxed ${
            actualTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Fighting misinformation with AI-powered fact-checking to keep communities safe during crises. 
            <span className={`block mt-2 text-lg ${
              actualTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`}>Protecting truth when it matters most.</span>
          </p>
        </div>

        {/* Stats Section */}
        <div className={`grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 transform transition-all duration-1000 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div 
                key={stat.label}
                className={`rounded-2xl shadow-md hover:shadow-xl p-6 text-center transition-all duration-300 hover:scale-105 border ${
                  actualTheme === 'dark'
                    ? 'bg-gray-800 border-gray-700'
                    : 'bg-white border-gray-100'
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 ${
                  actualTheme === 'dark'
                    ? 'bg-gradient-to-r from-blue-900/50 to-purple-900/50'
                    : 'bg-gradient-to-r from-blue-100 to-purple-100'
                }`}>
                  <IconComponent className={`h-6 w-6 ${
                    actualTheme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                  }`} />
                </div>
                <div className={`text-2xl font-bold mb-1 ${
                  actualTheme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>{stat.value}</div>
                <div className={`text-sm ${
                  actualTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>{stat.label}</div>
              </div>
            );
          })}
        </div>

        {/* Tab Navigation */}
        <div className={`flex justify-center mb-12 transform transition-all duration-1000 delay-400 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className={`rounded-2xl shadow-md p-2 border ${
            actualTheme === 'dark'
              ? 'bg-gray-800 border-gray-700'
              : 'bg-white border-gray-200'
          }`}>
            {['mission', 'technology', 'team'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                  activeTab === tab
                    ? actualTheme === 'dark'
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                      : 'bg-gradient-to-r from-gray-800 to-black text-white shadow-md'
                    : actualTheme === 'dark'
                      ? 'text-gray-300 hover:text-white hover:bg-gray-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Mission Section */}
        {activeTab === 'mission' && (
          <div className={`transform transition-all duration-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className={`rounded-2xl shadow-lg p-8 mb-8 border ${
              actualTheme === 'dark'
                ? 'bg-gray-800 border-gray-700'
                : 'bg-white border-gray-100'
            }`}>
              <div className="flex items-center gap-4 mb-6">
                <div className={`p-3 rounded-xl ${
                  actualTheme === 'dark'
                    ? 'bg-gradient-to-r from-blue-900/50 to-purple-900/50'
                    : 'bg-gradient-to-r from-blue-100 to-purple-100'
                }`}>
                  <Target className={`h-8 w-8 ${
                    actualTheme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                  }`} />
                </div>
                <h2 
                  className={`text-3xl font-bold ${
                    actualTheme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}
                  style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif' }}
                >
                  Our Mission
                </h2>
              </div>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <p className={`leading-relaxed mb-6 text-lg ${
                    actualTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    In an era where misinformation spreads faster than facts, TruthShield stands as a guardian of truth during critical moments. 
                    We believe that accurate information saves lives, especially during emergencies, natural disasters, and public health crises.
                  </p>
                  <p className={`leading-relaxed text-lg ${
                    actualTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Our mission is to empower individuals and communities with instant access to verified information, helping them make 
                    informed decisions when it matters most.
                  </p>
                </div>
                <div className={`rounded-xl p-6 border ${
                  actualTheme === 'dark'
                    ? 'bg-gradient-to-br from-blue-900/20 to-purple-900/20 border-blue-700'
                    : 'bg-gradient-to-br from-blue-50 to-purple-50 border-blue-100'
                }`}>
                  <h3 className={`text-xl font-semibold mb-4 flex items-center gap-2 ${
                    actualTheme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    <Sparkles className={`h-5 w-5 ${
                      actualTheme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                    }`} />
                    Core Values
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className={actualTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>Truth above all else</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className={actualTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>Community safety first</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className={actualTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>Transparent processes</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className={actualTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>Continuous innovation</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Technology Section */}
        {activeTab === 'technology' && (
          <div className={`transform transition-all duration-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className={`rounded-2xl shadow-lg p-8 mb-8 border ${
              actualTheme === 'dark'
                ? 'bg-gray-800 border-gray-700'
                : 'bg-white border-gray-100'
            }`}>
              <div className="flex items-center gap-4 mb-8">
                <div className={`p-3 rounded-xl ${
                  actualTheme === 'dark'
                    ? 'bg-gradient-to-r from-green-900/50 to-teal-900/50'
                    : 'bg-gradient-to-r from-green-100 to-teal-100'
                }`}>
                  <Brain className={`h-8 w-8 ${
                    actualTheme === 'dark' ? 'text-green-400' : 'text-green-600'
                  }`} />
                </div>
                <h2 
                  className={`text-3xl font-bold ${
                    actualTheme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}
                  style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif' }}
                >
                  Powered by Advanced Technology
                </h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                {technologies.map((tech, index) => {
                  const IconComponent = tech.icon;
                  return (
                    <div 
                      key={tech.title}
                      className={`group p-6 rounded-2xl border hover:shadow-xl transition-all duration-300 hover:scale-105 ${
                        actualTheme === 'dark'
                          ? 'border-gray-600 bg-gradient-to-br from-gray-700 to-gray-800'
                          : 'border-gray-200 bg-gradient-to-br from-white to-gray-50'
                      }`}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex items-center gap-4 mb-4">
                        <div className={`p-3 rounded-xl bg-gradient-to-r ${tech.color}`}>
                          <IconComponent className="h-6 w-6 text-white" />
                        </div>
                        <h3 className={`text-xl font-semibold ${
                          actualTheme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>{tech.title}</h3>
                      </div>
                      <p className={`leading-relaxed ${
                        actualTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>{tech.description}</p>
                      <div className={`flex items-center gap-2 mt-4 transition-colors ${
                        actualTheme === 'dark'
                          ? 'text-blue-400 group-hover:text-blue-300'
                          : 'text-blue-600 group-hover:text-blue-700'
                      }`}>
                        <span className="text-sm font-medium">Learn more</span>
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Team Section */}
        {activeTab === 'team' && (
          <div className={`transform transition-all duration-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-xl">
                  <Users className="h-8 w-8 text-yellow-600" />
                </div>
                <h2 
                  className="text-3xl font-bold text-gray-900"
                  style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif' }}
                >
                  Our Team
                </h2>
              </div>
              <p className="text-gray-700 leading-relaxed mb-8 text-lg max-w-3xl">
                We are a diverse team of technologists, journalists, and crisis response experts united by a common goal: 
                making reliable information accessible to everyone during critical moments.
              </p>
              
              <div className="grid md:grid-cols-3 gap-6">
                {teamMembers.map((member, index) => {
                  const IconComponent = member.icon;
                  return (
                    <div 
                      key={member.role}
                      className={`text-center p-8 ${member.color} rounded-2xl border border-gray-200 hover:shadow-xl transition-all duration-300 hover:scale-105`}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                        <IconComponent className={`h-8 w-8 ${member.iconColor}`} />
                      </div>
                      <h4 className="font-bold text-gray-900 text-lg mb-2">{member.role}</h4>
                      <p className="text-sm text-gray-600 mb-3">{member.description}</p>
                      <div className="inline-flex items-center gap-2 bg-white px-3 py-1 rounded-full text-sm font-medium text-gray-700">
                        <Star className="h-3 w-3 text-yellow-500" />
                        {member.count} experts
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Contact Section */}
        <div className={`bg-gradient-to-r from-gray-900 to-black rounded-2xl shadow-xl p-8 text-center transform transition-all duration-1000 delay-600 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <h2 
            className="text-3xl font-bold text-white mb-6"
            style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif' }}
          >
            Get In Touch
          </h2>
          <p className="text-gray-300 mb-8 text-lg">
            Ready to join the fight against misinformation? Let's connect.
          </p>
          <div className="flex justify-center space-x-6">
            <a
              href="#"
              className="flex items-center gap-3 bg-white text-gray-900 px-6 py-3 rounded-xl hover:bg-gray-100 transition-all duration-200 hover:scale-105 shadow-md"
            >
              <Mail className="h-5 w-5" />
              <span className="font-medium">Contact Us</span>
            </a>
            <a
              href="#"
              className="flex items-center gap-3 border border-white text-white px-6 py-3 rounded-xl hover:bg-white hover:text-gray-900 transition-all duration-200 hover:scale-105"
            >
              <Github className="h-5 w-5" />
              <span className="font-medium">GitHub</span>
            </a>
            <a
              href="#"
              className="flex items-center gap-3 border border-white text-white px-6 py-3 rounded-xl hover:bg-white hover:text-gray-900 transition-all duration-200 hover:scale-105"
            >
              <Linkedin className="h-5 w-5" />
              <span className="font-medium">LinkedIn</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;