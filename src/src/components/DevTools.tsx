import React, { useState } from 'react';
import { useAuth } from '@longvhv/auth';
import { useTheme } from '@longvhv/theme';
import { useTranslation } from '@longvhv/i18n';
import { useQueryClient } from '@tanstack/react-query';
import { Settings, Database, Moon, Sun, Globe, Zap, RefreshCw, X } from 'lucide-react';

/**
 * Development Tools Panel
 * Only visible in development mode
 */
export const DevTools: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const { isDark, mode, setMode } = useTheme();
  const { language, setLanguage } = useTranslation();
  const queryClient = useQueryClient();

  // Only show in development
  if (!import.meta.env.DEV) {
    return null;
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 w-12 h-12 bg-purple-600 text-white rounded-full shadow-lg hover:bg-purple-700 transition-colors z-50 flex items-center justify-center"
        title="Open Dev Tools"
      >
        <Settings className="w-5 h-5 animate-spin-slow" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-96 bg-white dark:bg-gray-800 border-2 border-purple-500 rounded-xl shadow-2xl z-50 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-white">
          <Zap className="w-5 h-5" />
          <h3 className="font-bold">Dev Tools</h3>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="p-1 hover:bg-white/20 rounded transition-colors"
        >
          <X className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
        {/* Environment Info */}
        <div className="space-y-2">
          <h4 className="font-semibold text-sm flex items-center gap-2">
            <Database className="w-4 h-4" />
            Environment
          </h4>
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 text-xs space-y-1">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Mode:</span>
              <span className="font-mono font-medium">{import.meta.env.MODE}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">API URL:</span>
              <span className="font-mono font-medium truncate ml-2">
                {import.meta.env.VITE_API_URL || 'Not set'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">App Name:</span>
              <span className="font-mono font-medium">
                {import.meta.env.VITE_APP_NAME || 'VHV CMS'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Version:</span>
              <span className="font-mono font-medium">
                {import.meta.env.VITE_APP_VERSION || '1.0.0'}
              </span>
            </div>
          </div>
        </div>

        {/* Auth Info */}
        <div className="space-y-2">
          <h4 className="font-semibold text-sm">Authentication</h4>
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 text-xs space-y-1">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Status:</span>
              <span className={`font-medium ${isAuthenticated ? 'text-green-600' : 'text-red-600'}`}>
                {isAuthenticated ? '✅ Authenticated' : '❌ Not Authenticated'}
              </span>
            </div>
            {user && (
              <>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">User:</span>
                  <span className="font-medium">{user.firstName} {user.lastName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Role:</span>
                  <span className="font-medium">{user.role}</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Theme Controls */}
        <div className="space-y-2">
          <h4 className="font-semibold text-sm flex items-center gap-2">
            {isDark ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            Theme
          </h4>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setMode('light')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                mode === 'light'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-900 hover:bg-gray-200 dark:hover:bg-gray-800'
              }`}
            >
              ☀️ Light
            </button>
            <button
              onClick={() => setMode('dark')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                mode === 'dark'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-900 hover:bg-gray-200 dark:hover:bg-gray-800'
              }`}
            >
              🌙 Dark
            </button>
            <button
              onClick={() => setMode('system')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                mode === 'system'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-900 hover:bg-gray-200 dark:hover:bg-gray-800'
              }`}
            >
              💻 System
            </button>
          </div>
        </div>

        {/* Language Controls */}
        <div className="space-y-2">
          <h4 className="font-semibold text-sm flex items-center gap-2">
            <Globe className="w-4 h-4" />
            Language
          </h4>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setLanguage('vi')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                language === 'vi'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-900 hover:bg-gray-200 dark:hover:bg-gray-800'
              }`}
            >
              🇻🇳 Tiếng Việt
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                language === 'en'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-900 hover:bg-gray-200 dark:hover:bg-gray-800'
              }`}
            >
              🇬🇧 English
            </button>
          </div>
        </div>

        {/* Cache Controls */}
        <div className="space-y-2">
          <h4 className="font-semibold text-sm flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            Cache
          </h4>
          <div className="space-y-2">
            <button
              onClick={() => {
                queryClient.invalidateQueries();
                console.log('✅ All React Query cache invalidated');
              }}
              className="w-full px-3 py-2 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-lg text-sm font-medium hover:bg-orange-200 dark:hover:bg-orange-900/50 transition-colors"
            >
              Clear React Query Cache
            </button>
            <button
              onClick={() => {
                localStorage.clear();
                sessionStorage.clear();
                console.log('✅ LocalStorage & SessionStorage cleared');
              }}
              className="w-full px-3 py-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg text-sm font-medium hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
            >
              Clear All Storage
            </button>
          </div>
        </div>

        {/* Framework Info */}
        <div className="space-y-2">
          <h4 className="font-semibold text-sm">Framework Packages</h4>
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 text-xs space-y-1">
            {[
              '@longvhv/core',
              '@longvhv/auth',
              '@longvhv/query',
              '@longvhv/theme',
              '@longvhv/notifications',
              '@longvhv/i18n',
            ].map((pkg) => (
              <div key={pkg} className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span className="font-mono text-gray-600 dark:text-gray-400">{pkg}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-50 dark:bg-gray-900 px-4 py-2 border-t border-gray-200 dark:border-gray-700">
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
          Development Tools • Press ESC to close
        </p>
      </div>
    </div>
  );
};

// CSS for slow spin animation
const style = document.createElement('style');
style.textContent = `
  @keyframes spin-slow {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  .animate-spin-slow {
    animation: spin-slow 3s linear infinite;
  }
`;
document.head.appendChild(style);
