import { useState } from 'react';
import { Settings as SettingsIcon, Globe, Bell, Shield, Palette, Database, Mail, Code, Zap, Save } from 'lucide-react';
import { PageWrapper } from './PageWrapper';
import { PageHeader } from './PageHeader';
import { Card } from './Card';

export function Settings() {
  const [activeTab, setActiveTab] = useState('general');

  const tabs = [
    { id: 'general', label: 'Cài đặt chung', icon: SettingsIcon },
    { id: 'appearance', label: 'Giao diện', icon: Palette },
    { id: 'notifications', label: 'Thông báo', icon: Bell },
    { id: 'security', label: 'Bảo mật', icon: Shield },
    { id: 'email', label: 'Email', icon: Mail },
    { id: 'api', label: 'API & Webhooks', icon: Code },
    { id: 'database', label: 'Database', icon: Database },
  ];

  return (
    <PageWrapper>
      <div className="space-y-6">
        <PageHeader
          title="Cài đặt hệ thống"
          description="Quản lý cấu hình CMS"
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
                <h3 className="text-foreground mb-4">Cài đặt chung</h3>
                
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">Tên website</label>
                  <input
                    type="text"
                    defaultValue="CMS Admin"
                    className="w-full px-4 py-3 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div>
                  <label className="block text-sm text-muted-foreground mb-2">Mô tả</label>
                  <textarea
                    rows={3}
                    defaultValue="Hệ thống quản lý nội dung chuyên nghiệp"
                    className="w-full px-4 py-3 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">Ngôn ngữ mặc định</label>
                    <select className="w-full px-4 py-3 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20">
                      <option>Tiếng Việt</option>
                      <option>English</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">Múi giờ</label>
                    <select className="w-full px-4 py-3 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20">
                      <option>GMT+7 (Hà Nội)</option>
                      <option>GMT+0 (UTC)</option>
                    </select>
                  </div>
                </div>
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
                      <div className="font-medium text-foreground">Auto Logout</div>
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
                <span>Lưu thay đổi</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}