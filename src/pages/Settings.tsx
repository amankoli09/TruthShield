import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { 
  User, 
  Bell, 
  Lock, 
  Palette, 
  Monitor, 
  Sun, 
  Moon, 
  Check,
  Save,
  Loader2
} from 'lucide-react';

const Settings = () => {
  const { user } = useAuth();
  const { theme, setTheme, actualTheme } = useTheme();
  const [isVisible, setIsVisible] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  // Settings state
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: false,
      factCheckAlerts: true,
      weeklyDigest: true
    },
    privacy: {
      profileVisible: true,
      shareStats: false,
      dataCollection: true
    },
    preferences: {
      autoVerify: false,
      saveHistory: true,
      defaultView: 'dashboard'
    }
  });

  useEffect(() => {
    setIsVisible(true);
    // Load saved settings from localStorage
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
  };

  const handleSettingChange = (category: string, setting: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [setting]: value
      }
    }));
  };

  const saveSettings = async () => {
    setIsSaving(true);
    setSaveMessage('');
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Save to localStorage
      localStorage.setItem('userSettings', JSON.stringify(settings));
      
      setSaveMessage('Settings saved successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      setSaveMessage('Failed to save settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const themeOptions = [
    { value: 'light', label: 'Light', icon: Sun, description: 'Light theme' },
    { value: 'dark', label: 'Dark', icon: Moon, description: 'Dark theme' },
    { value: 'system', label: 'System', icon: Monitor, description: 'Follow system preference' }
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      actualTheme === 'dark' 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
        : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'
    }`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className={`transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className={`text-3xl font-bold ${actualTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Settings
              </h1>
              <p className={`mt-1 ${actualTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                Manage your account preferences and privacy settings
              </p>
            </div>
            <button
              onClick={saveSettings}
              disabled={isSaving}
              className={`inline-flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 ${
                actualTheme === 'dark'
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-gradient-to-r from-gray-800 to-black text-white hover:from-gray-900 hover:to-gray-800'
              } disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>

        {/* Save Message */}
        {saveMessage && (
          <div className={`mb-6 p-4 rounded-lg flex items-center ${
            saveMessage.includes('successfully') 
              ? actualTheme === 'dark' ? 'bg-green-900/50 text-green-300 border border-green-700' : 'bg-green-50 text-green-700 border border-green-200'
              : actualTheme === 'dark' ? 'bg-red-900/50 text-red-300 border border-red-700' : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            <Check className="h-5 w-5 mr-2" />
            {saveMessage}
          </div>
        )}

        <div className="space-y-8">
          {/* Theme Settings */}
          <div className={`transform transition-all duration-1000 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className={`rounded-xl shadow-lg border ${
              actualTheme === 'dark' 
                ? 'bg-gray-800 border-gray-700' 
                : 'bg-white border-gray-200'
            }`}>
              <div className={`p-6 border-b ${actualTheme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex items-center">
                  <Palette className={`h-6 w-6 mr-3 ${actualTheme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
                  <div>
                    <h3 className={`text-lg font-semibold ${actualTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      Appearance
                    </h3>
                    <p className={`text-sm ${actualTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      Choose your preferred theme
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {themeOptions.map((option) => {
                    const Icon = option.icon;
                    const isSelected = theme === option.value;
                    return (
                      <button
                        key={option.value}
                        onClick={() => handleThemeChange(option.value as any)}
                        className={`relative p-4 rounded-lg border-2 transition-all duration-200 ${
                          isSelected
                            ? actualTheme === 'dark' 
                              ? 'border-blue-500 bg-blue-900/30' 
                              : 'border-blue-500 bg-blue-50'
                            : actualTheme === 'dark'
                              ? 'border-gray-600 hover:border-gray-500 bg-gray-700/50'
                              : 'border-gray-200 hover:border-gray-300 bg-gray-50'
                        }`}
                      >
                        <div className="flex flex-col items-center text-center">
                          <Icon className={`h-8 w-8 mb-2 ${
                            isSelected 
                              ? actualTheme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                              : actualTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                          }`} />
                          <h4 className={`font-medium ${
                            actualTheme === 'dark' ? 'text-white' : 'text-gray-900'
                          }`}>
                            {option.label}
                          </h4>
                          <p className={`text-sm ${
                            actualTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            {option.description}
                          </p>
                        </div>
                        {isSelected && (
                          <div className={`absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center ${
                            actualTheme === 'dark' ? 'bg-blue-500' : 'bg-blue-600'
                          }`}>
                            <Check className="h-3 w-3 text-white" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Profile Settings */}
          <div className={`transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className={`rounded-xl shadow-lg border ${
              actualTheme === 'dark' 
                ? 'bg-gray-800 border-gray-700' 
                : 'bg-white border-gray-200'
            }`}>
              <div className={`p-6 border-b ${actualTheme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex items-center">
                  <User className={`h-6 w-6 mr-3 ${actualTheme === 'dark' ? 'text-green-400' : 'text-green-600'}`} />
                  <div>
                    <h3 className={`text-lg font-semibold ${actualTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      Profile
                    </h3>
                    <p className={`text-sm ${actualTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      Manage your profile information
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className={`font-medium ${actualTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        Name
                      </h4>
                      <p className={`text-sm ${actualTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        {user?.name || 'Not set'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className={`font-medium ${actualTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        Email
                      </h4>
                      <p className={`text-sm ${actualTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        {user?.email || 'Not set'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className={`transform transition-all duration-1000 delay-400 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className={`rounded-xl shadow-lg border ${
              actualTheme === 'dark' 
                ? 'bg-gray-800 border-gray-700' 
                : 'bg-white border-gray-200'
            }`}>
              <div className={`p-6 border-b ${actualTheme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex items-center">
                  <Bell className={`h-6 w-6 mr-3 ${actualTheme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'}`} />
                  <div>
                    <h3 className={`text-lg font-semibold ${actualTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      Notifications
                    </h3>
                    <p className={`text-sm ${actualTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      Control how you receive notifications
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {Object.entries(settings.notifications).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <div>
                        <h4 className={`font-medium ${actualTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                        </h4>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={value}
                          onChange={(e) => handleSettingChange('notifications', key, e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className={`relative w-11 h-6 rounded-full peer transition-colors duration-200 ${
                          value 
                            ? actualTheme === 'dark' ? 'bg-blue-600' : 'bg-blue-600'
                            : actualTheme === 'dark' ? 'bg-gray-600' : 'bg-gray-200'
                        } peer-focus:outline-none peer-focus:ring-4 ${
                          actualTheme === 'dark' ? 'peer-focus:ring-blue-800' : 'peer-focus:ring-blue-300'
                        }`}>
                          <div className={`absolute top-[2px] left-[2px] bg-white border border-gray-300 rounded-full h-5 w-5 transition-transform duration-200 ${
                            value ? 'translate-x-full' : ''
                          }`}></div>
                        </div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Privacy Settings */}
          <div className={`transform transition-all duration-1000 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className={`rounded-xl shadow-lg border ${
              actualTheme === 'dark' 
                ? 'bg-gray-800 border-gray-700' 
                : 'bg-white border-gray-200'
            }`}>
              <div className={`p-6 border-b ${actualTheme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex items-center">
                  <Lock className={`h-6 w-6 mr-3 ${actualTheme === 'dark' ? 'text-red-400' : 'text-red-600'}`} />
                  <div>
                    <h3 className={`text-lg font-semibold ${actualTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      Privacy
                    </h3>
                    <p className={`text-sm ${actualTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      Control your privacy and data sharing
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {Object.entries(settings.privacy).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <div>
                        <h4 className={`font-medium ${actualTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                        </h4>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={value}
                          onChange={(e) => handleSettingChange('privacy', key, e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className={`relative w-11 h-6 rounded-full peer transition-colors duration-200 ${
                          value 
                            ? actualTheme === 'dark' ? 'bg-blue-600' : 'bg-blue-600'
                            : actualTheme === 'dark' ? 'bg-gray-600' : 'bg-gray-200'
                        } peer-focus:outline-none peer-focus:ring-4 ${
                          actualTheme === 'dark' ? 'peer-focus:ring-blue-800' : 'peer-focus:ring-blue-300'
                        }`}>
                          <div className={`absolute top-[2px] left-[2px] bg-white border border-gray-300 rounded-full h-5 w-5 transition-transform duration-200 ${
                            value ? 'translate-x-full' : ''
                          }`}></div>
                        </div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
