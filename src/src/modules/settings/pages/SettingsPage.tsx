import React, { useState } from 'react';
import { useNotifications } from '@longvhv/notifications';
import { useTranslation } from '@longvhv/i18n';
import { useTheme } from '@longvhv/theme';
import { 
  Save,
  Globe,
  Bell,
  Shield,
  Database,
  Mail,
  Palette,
  Code,
  Key,
  Zap
} from 'lucide-react';

const SettingsPage: React.FC = () => {
  const { t, language, setLanguage } = useTranslation();
  const { mode, setMode } = useTheme();
  const notifications = useNotifications();

  const [activeTab, setActiveTab] = useState<'general' | 'appearance' | 'notifications' | 'security' | 'api'>('general');

  const handleSave = () => {
    notifications.success('Settings saved successfully!');
  };

  const tabs = [
    { id: 'general', label: 'General', icon: Globe },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'api', label: 'API & Integration', icon: Code },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Configure your application
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Tabs Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    activeTab === tab.id
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium text-sm">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-6">
            {/* General Settings */}
            {activeTab === 'general' && (
              <>
                <div>
                  <h2 className="text-xl font-bold mb-4">General Settings</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Site Name</label>
                      <input
                        type="text"
                        defaultValue="VHV CMS"
                        className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Site Description</label>
                      <textarea
                        rows={3}
                        defaultValue="Enterprise Content Management System"
                        className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Default Language</label>
                      <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value as any)}
                        className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      >
                        <option value="vi">🇻🇳 Tiếng Việt</option>
                        <option value="en">🇬🇧 English</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Timezone</label>
                      <select
                        defaultValue="Asia/Ho_Chi_Minh"
                        className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      >
                        <option value="Asia/Ho_Chi_Minh">Asia/Ho Chi Minh (GMT+7)</option>
                        <option value="America/New_York">America/New York (GMT-5)</option>
                        <option value="Europe/London">Europe/London (GMT+0)</option>
                        <option value="Asia/Tokyo">Asia/Tokyo (GMT+9)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Appearance Settings */}
            {activeTab === 'appearance' && (
              <>
                <div>
                  <h2 className="text-xl font-bold mb-4">Appearance Settings</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Theme Mode</label>
                      <div className="grid grid-cols-3 gap-3">
                        <button
                          onClick={() => setMode('light')}
                          className={`px-4 py-3 rounded-xl border-2 transition-all ${
                            mode === 'light'
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600'
                              : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
                          }`}
                        >
                          ☀️ Light
                        </button>
                        <button
                          onClick={() => setMode('dark')}
                          className={`px-4 py-3 rounded-xl border-2 transition-all ${
                            mode === 'dark'
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600'
                              : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
                          }`}
                        >
                          🌙 Dark
                        </button>
                        <button
                          onClick={() => setMode('system')}
                          className={`px-4 py-3 rounded-xl border-2 transition-all ${
                            mode === 'system'
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600'
                              : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
                          }`}
                        >
                          💻 System
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Primary Color</label>
                      <div className="flex gap-2">
                        {['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'].map(color => (
                          <button
                            key={color}
                            className="w-12 h-12 rounded-lg border-2 border-gray-200 dark:border-gray-700"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Font Family</label>
                      <select
                        defaultValue="inter"
                        className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      >
                        <option value="inter">Inter</option>
                        <option value="system">System</option>
                        <option value="roboto">Roboto</option>
                        <option value="opensans">Open Sans</option>
                      </select>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Notification Settings */}
            {activeTab === 'notifications' && (
              <>
                <div>
                  <h2 className="text-xl font-bold mb-4">Notification Settings</h2>
                  
                  <div className="space-y-4">
                    {[
                      { label: 'Email Notifications', description: 'Receive email updates' },
                      { label: 'Push Notifications', description: 'Browser push notifications' },
                      { label: 'Article Comments', description: 'Notify on new comments' },
                      { label: 'Workflow Updates', description: 'Article status changes' },
                      { label: 'Weekly Reports', description: 'Weekly analytics summary' },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
                        <div>
                          <div className="font-medium">{item.label}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">{item.description}</div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" defaultChecked className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Security Settings */}
            {activeTab === 'security' && (
              <>
                <div>
                  <h2 className="text-xl font-bold mb-4">Security Settings</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Change Password</label>
                      <input
                        type="password"
                        placeholder="Current password"
                        className="w-full px-4 py-2 mb-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      />
                      <input
                        type="password"
                        placeholder="New password"
                        className="w-full px-4 py-2 mb-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      />
                      <input
                        type="password"
                        placeholder="Confirm password"
                        className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      />
                    </div>

                    <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">Two-Factor Authentication</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">Add extra security layer</div>
                        </div>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                          Enable
                        </button>
                      </div>
                    </div>

                    <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
                      <div className="font-medium mb-2">Active Sessions</div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>💻 Chrome on Windows • Current session</span>
                          <span className="text-green-600">Active now</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* API Settings */}
            {activeTab === 'api' && (
              <>
                <div>
                  <h2 className="text-xl font-bold mb-4">API & Integration Settings</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">API Endpoint</label>
                      <input
                        type="text"
                        defaultValue={import.meta.env.VITE_API_URL}
                        className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      />
                    </div>

                    <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
                      <div className="flex items-center justify-between mb-3">
                        <div className="font-medium">API Keys</div>
                        <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
                          + Generate New
                        </button>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg">
                          <div className="flex items-center gap-3">
                            <Key className="w-4 h-4 text-gray-400" />
                            <code className="text-sm">pk_live_••••••••••••••••1234</code>
                          </div>
                          <button className="text-red-600 hover:text-red-700">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Webhooks</label>
                      <input
                        type="url"
                        placeholder="https://example.com/webhook"
                        className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Save Button */}
            <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg"
              >
                <Save className="w-5 h-5" />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
