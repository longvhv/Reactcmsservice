import { useState } from 'react';
import { Settings as SettingsIcon, Globe, Bell, Shield, Palette, Database, Mail, Code, Zap, Save, DollarSign, Coins, ToggleLeft, ToggleRight } from 'lucide-react';
import { PageWrapper } from './PageWrapper';
import { PageHeader } from './PageHeader';
import { Card } from './Card';
import { useLanguage } from '../contexts/LanguageContext';
import { useSystemSettings } from '../contexts/SystemSettingsContext';

export function Settings() {
  const { t } = useLanguage();
  const { settings, updateSetting, isRoyaltyEnabled } = useSystemSettings();
  const [activeTab, setActiveTab] = useState('general');

  const tabs = [
    { id: 'general', label: t('settings.general'), icon: SettingsIcon },
    { id: 'features', label: t('settings.features'), icon: Zap },
    { id: 'appearance', label: t('settings.appearance'), icon: Palette },
    { id: 'notifications', label: t('settings.notifications'), icon: Bell },
    { id: 'security', label: t('settings.security'), icon: Shield },
    { id: 'email', label: t('settings.email'), icon: Mail },
    { id: 'api', label: t('settings.api_webhooks'), icon: Code },
    { id: 'database', label: t('settings.database'), icon: Database },
  ];

  return (
    <PageWrapper>
      <div className="space-y-6">
        <PageHeader
          title={t('settings.systemSettings')}
          description={t('settings.systemSettingsDesc')}
        />

        <div className="grid grid-cols-4 gap-6">
          <div className="bg-card rounded-2xl border border-border/60 p-4">
            <div className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 flex items-center gap-3 ${
                      activeTab === tab.id
                        ? 'bg-blue-100 text-blue-700'
                        : 'hover:bg-muted/50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="col-span-3 bg-card rounded-2xl border border-border/60 p-6">
            {activeTab === 'general' && (
              <div className="space-y-6">
                <h3 className="text-foreground mb-4">{t('settings.generalSettings')}</h3>
                
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">{t('settings.websiteName')}</label>
                  <input
                    type="text"
                    defaultValue="CMS Admin"
                    className="w-full px-4 py-3 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div>
                  <label className="block text-sm text-muted-foreground mb-2">{t('settings.websiteDescription')}</label>
                  <textarea
                    rows={3}
                    defaultValue="Hệ thống quản lý nội dung chuyên nghiệp"
                    className="w-full px-4 py-3 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">{t('settings.defaultLanguage')}</label>
                    <select className="w-full px-4 py-3 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20">
                      <option>Tiếng Việt</option>
                      <option>English</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">{t('settings.timezone')}</label>
                    <select className="w-full px-4 py-3 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20">
                      <option>GMT+7 (Hà Nội)</option>
                      <option>GMT+0 (UTC)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'features' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-foreground mb-2">{t('settings.featureManagement')}</h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    {t('settings.featureManagementDesc')}
                  </p>
                </div>

                {/* Debug Info */}
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Code className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-900">{t('settings.debugInfo')}</span>
                    </div>
                    <button
                      onClick={() => {
                        localStorage.removeItem('systemSettings');
                        window.location.reload();
                      }}
                      className="px-3 py-1 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      {t('settings.resetAllSettings')}
                    </button>
                  </div>
                  <div className="text-xs text-blue-700 font-mono space-y-1">
                    <div>{t('settings.royaltyEnabled')}: <strong>{isRoyaltyEnabled ? 'YES ✅' : 'NO ❌'}</strong></div>
                    <div>{t('settings.mediaEnabled')}: {settings.mediaLibraryEnabled ? 'YES' : 'NO'}</div>
                    <div>{t('settings.crawlerEnabled')}: {settings.crawlerEnabled ? 'YES' : 'NO'}</div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {/* Royalty Management Toggle */}
                  <div className="flex items-start justify-between p-5 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl hover:shadow-lg transition-all duration-200">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-green-500 rounded-xl">
                        <Coins className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="font-medium text-foreground flex items-center gap-2">
                          {t('settings.royaltyManagement')}
                          {settings.royaltyEnabled && (
                            <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                              {t('settings.enabled')}
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                          {t('settings.royaltyManagementDesc')}
                        </div>
                        <div className="text-xs text-muted-foreground mt-2 space-y-1">
                          <div>• Ẩn menu "Quản lý nhuận bút" trong Sidebar</div>
                          <div>• Ẩn cột "Nhuận bút" trong danh sách Người dùng</div>
                          <div>• Ẩn thông tin nhuận bút trong Bài viết</div>
                          <div>• Ẩn ước tính nhuận bút trong Kiểm duyệt</div>
                        </div>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={settings.royaltyEnabled}
                        onChange={(e) => updateSetting('royaltyEnabled', e.target.checked)}
                      />
                      <div className="w-14 h-7 bg-gray-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-green-500 shadow-inner"></div>
                    </label>
                  </div>

                  {/* Media Library Toggle */}
                  <div className="flex items-start justify-between p-5 bg-muted/50 rounded-xl">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-blue-500 rounded-xl">
                        <Database className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="font-medium text-foreground flex items-center gap-2">
                          {t('settings.mediaLibrary')}
                          {settings.mediaLibraryEnabled && (
                            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                              {t('settings.enabled')}
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                          {t('settings.mediaLibraryDesc')}
                        </div>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={settings.mediaLibraryEnabled}
                        onChange={(e) => updateSetting('mediaLibraryEnabled', e.target.checked)}
                      />
                      <div className="w-14 h-7 bg-gray-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-500 shadow-inner"></div>
                    </label>
                  </div>

                  {/* Crawler Toggle */}
                  <div className="flex items-start justify-between p-5 bg-muted/50 rounded-xl">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-purple-500 rounded-xl">
                        <Globe className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="font-medium text-foreground flex items-center gap-2">
                          {t('settings.crawlerSystem')}
                          {settings.crawlerEnabled && (
                            <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full">
                              {t('settings.enabled')}
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                          {t('settings.crawlerSystemDesc')}
                        </div>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={settings.crawlerEnabled}
                        onChange={(e) => updateSetting('crawlerEnabled', e.target.checked)}
                      />
                      <div className="w-14 h-7 bg-gray-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-purple-500 shadow-inner"></div>
                    </label>
                  </div>

                  {/* Multi-language Toggle */}
                  <div className="flex items-start justify-between p-5 bg-muted/50 rounded-xl">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-orange-500 rounded-xl">
                        <Globe className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="font-medium text-foreground flex items-center gap-2">
                          {t('settings.multiLanguage')}
                          {settings.multiLanguageEnabled && (
                            <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-xs rounded-full">
                              {t('settings.enabled')}
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                          {t('settings.multiLanguageDesc')}
                        </div>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={settings.multiLanguageEnabled}
                        onChange={(e) => updateSetting('multiLanguageEnabled', e.target.checked)}
                      />
                      <div className="w-14 h-7 bg-gray-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-orange-500 shadow-inner"></div>
                    </label>
                  </div>

                  {/* Comments Toggle */}
                  <div className="flex items-start justify-between p-5 bg-muted/50 rounded-xl">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-pink-500 rounded-xl">
                        <Bell className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="font-medium text-foreground flex items-center gap-2">
                          {t('settings.commentsSystem')}
                          {settings.commentsEnabled && (
                            <span className="px-2 py-0.5 bg-pink-100 text-pink-700 text-xs rounded-full">
                              {t('settings.enabled')}
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                          {t('settings.commentsSystemDesc')}
                        </div>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={settings.commentsEnabled}
                        onChange={(e) => updateSetting('commentsEnabled', e.target.checked)}
                      />
                      <div className="w-14 h-7 bg-gray-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-pink-500 shadow-inner"></div>
                    </label>
                  </div>
                </div>

                {/* Warning message when royalty is disabled */}
                {!settings.royaltyEnabled && (
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                    <div className="flex items-start gap-3">
                      <Shield className="w-5 h-5 text-yellow-600 mt-0.5" />
                      <div>
                        <div className="font-medium text-yellow-900">Tính năng Nhuận bút đã tắt</div>
                        <div className="text-sm text-yellow-700 mt-1">
                          Tất cả thông tin liên quan đến nhuận bút sẽ bị ẩn khỏi giao diện. 
                          Dữ liệu hiện có vẫn được giữ nguyên và sẽ hiển thị lại khi bật tính năng.
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'appearance' && (
              <div className="space-y-6">
                <h3 className="text-foreground mb-4">Giao diện</h3>
                
                <div>
                  <label className="block text-sm text-muted-foreground mb-3">Theme</label>
                  <div className="grid grid-cols-3 gap-4">
                    {['Light', 'Dark', 'Auto'].map((theme) => (
                      <div key={theme} className="border-2 border-blue-500 rounded-xl p-4 cursor-pointer hover:shadow-lg transition-all">
                        <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg mb-3" />
                        <div className="text-center font-medium">{theme}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-muted-foreground mb-3">Màu chủ đạo</label>
                  <div className="flex gap-3">
                    {['blue', 'purple', 'green', 'red', 'orange'].map((color) => (
                      <div key={color} className={`w-12 h-12 bg-${color}-500 rounded-xl cursor-pointer hover:scale-110 transition-transform`} />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <h3 className="text-foreground mb-4">Bảo mật</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
                    <div>
                      <div className="font-medium text-foreground">Two-Factor Authentication</div>
                      <div className="text-sm text-muted-foreground">Xác thực 2 lớp cho admin</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
                    <div>
                      <div className="font-medium text-foreground">Tự động đăng xuất</div>
                      <div className="text-sm text-muted-foreground">Tự động đăng xuất sau 30 phút không hoạt động</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end pt-6 border-t border-border/60 mt-8">
              <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-200">
                <Save className="w-4 h-4" />
                <span>{t('settings.saveChanges')}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}