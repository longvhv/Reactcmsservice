import React, { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '@longvhv/auth';
import { useTheme } from '@longvhv/theme';
import { useTranslation } from '@longvhv/i18n';
import { DevTools } from '@/components/DevTools';
import { GlobalSearch } from '@/components/GlobalSearch';
import { NotificationCenter, NotificationBadge } from '@/components/NotificationCenter';
import { 
  LayoutDashboard, 
  FileText, 
  Image, 
  BarChart3, 
  Users, 
  Settings, 
  Menu, 
  X, 
  Moon, 
  Sun,
  Bell,
  Search,
  ChevronDown,
  LogOut
} from 'lucide-react';

export const Layout: React.FC = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleMode } = useTheme();
  const { t, language, setLanguage } = useTranslation();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showProfile, setShowProfile] = useState(false);
  const [showGlobalSearch, setShowGlobalSearch] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const navItems = [
    { path: '/', label: t('dashboard'), icon: LayoutDashboard },
    { path: '/articles', label: t('articles'), icon: FileText },
    { path: '/media', label: t('media'), icon: Image },
    { path: '/analytics', label: t('analytics'), icon: BarChart3 },
    { path: '/users', label: t('users'), icon: Users },
    { path: '/settings', label: t('settings'), icon: Settings },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <aside 
        className={`fixed left-0 top-0 h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 z-40 ${
          sidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          {sidebarOpen && (
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              VHV CMS
            </h1>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        <nav className="p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  active
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                title={!sidebarOpen ? item.label : undefined}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {sidebarOpen && <span className="font-medium">{item.label}</span>}
                {active && sidebarOpen && (
                  <div className="ml-auto w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between px-6 py-4">
            {/* Search Button - Opens Global Search */}
            <div className="flex-1 max-w-2xl">
              <button
                onClick={() => setShowGlobalSearch(true)}
                className="w-full flex items-center gap-2 px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-blue-500/50 transition-all"
              >
                <Search className="w-5 h-5 text-gray-400" />
                <span className="flex-1 text-left text-sm text-gray-600 dark:text-gray-400">
                  Search articles, users, media...
                </span>
                <kbd className="px-2 py-1 bg-white dark:bg-gray-800 rounded text-xs font-mono border border-gray-200 dark:border-gray-700">
                  ⌘K
                </kbd>
              </button>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 ml-6">
              {/* Theme Toggle */}
              <button
                onClick={toggleMode}
                className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              {/* Language Switcher */}
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as any)}
                className="px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm"
              >
                <option value="vi">🇻🇳 VI</option>
                <option value="en">🇬🇧 EN</option>
              </select>

              {/* Notifications */}
              <div className="relative">
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <Bell className="w-5 h-5" />
                  <NotificationBadge count={3} />
                </button>
              </div>

              {/* Divider */}
              <div className="h-6 w-px bg-gray-200 dark:bg-gray-700" />

              {/* User Profile */}
              <div className="relative">
                <button
                  onClick={() => setShowProfile(!showProfile)}
                  className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-medium">
                    {user?.firstName?.charAt(0) || 'A'}
                  </div>
                  <div className="text-left hidden lg:block">
                    <div className="text-sm font-medium">
                      {user?.firstName} {user?.lastName}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {user?.role}
                    </div>
                  </div>
                  <ChevronDown className="w-4 h-4" />
                </button>

                {/* Profile Dropdown */}
                {showProfile && (
                  <div className="absolute top-full right-0 mt-2 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-medium text-lg">
                          {user?.firstName?.charAt(0) || 'A'}
                        </div>
                        <div>
                          <div className="font-medium">
                            {user?.firstName} {user?.lastName}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {user?.email}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-2">
                      <Link
                        to="/settings/profile"
                        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm"
                      >
                        <Users className="w-4 h-4" />
                        <span>{t('profile') || 'Profile'}</span>
                      </Link>
                      <Link
                        to="/settings"
                        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm"
                      >
                        <Settings className="w-4 h-4" />
                        <span>{t('settings') || 'Settings'}</span>
                      </Link>
                    </div>

                    <div className="border-t border-gray-200 dark:border-gray-700 p-2">
                      <button
                        onClick={() => {
                          logout();
                          setShowProfile(false);
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 transition-colors text-sm"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>{t('logout') || 'Logout'}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Dev Tools (only in development) */}
      <DevTools />

      {/* Global Search Modal */}
      {showGlobalSearch && (
        <GlobalSearch 
          isOpen={showGlobalSearch} 
          onClose={() => setShowGlobalSearch(false)} 
        />
      )}

      {/* Notification Center */}
      <NotificationCenter 
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
      />
    </div>
  );
};