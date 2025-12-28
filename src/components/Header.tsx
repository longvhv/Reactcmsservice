import { Search, Command, Bell, Settings, User, LogOut, HelpCircle, Moon, Sun, Menu, Clock, Plus, Upload, TrendingUp, Layout, MessageSquare, CheckCircle, Zap, ChevronDown, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { NotificationCenter } from './NotificationCenter';

interface HeaderProps {
  onToggleSidebar?: () => void;
  onNavigate?: (page: any) => void;
}

export function Header({ onToggleSidebar, onNavigate }: HeaderProps) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowCommandPalette(true);
      }
      if (e.key === 'Escape') {
        setShowCommandPalette(false);
        setShowSearch(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const notifications = [
    { id: 1, type: 'comment', message: '5 bình luận mới cần duyệt', time: '5 phút trước', unread: true, icon: MessageSquare, color: 'blue' },
    { id: 2, type: 'approval', message: '3 bài viết chờ phê duyệt', time: '1 giờ trước', unread: true, icon: CheckCircle, color: 'green' },
    { id: 3, type: 'crawler', message: 'Crawler thu thập 15 bài mới', time: '2 giờ trước', unread: false, icon: Zap, color: 'purple' },
    { id: 4, type: 'system', message: 'Backup hoàn tất thành công', time: '3 giờ trước', unread: false, icon: CheckCircle, color: 'gray' },
  ];

  const recentSearches = [
    { query: 'Bài viết về AI', type: 'Bài viết' },
    { query: 'Video hướng dẫn React', type: 'Media' },
    { query: 'Thư viện ảnh 2024', type: 'Gallery' },
  ];

  const quickActions = [
    { label: 'Tạo bài viết mới', shortcut: '⌘N', icon: Plus, color: 'blue' },
    { label: 'Upload media', shortcut: '⌘U', icon: Upload, color: 'purple' },
    { label: 'Xem thống kê', shortcut: '⌘S', icon: TrendingUp, color: 'green' },
    { label: 'Quản lý danh mục', shortcut: '⌘D', icon: Layout, color: 'orange' },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <>
      <header className="sticky top-0 z-40 glass-strong border-b border-border/40 backdrop-blur-xl">
        {/* Gradient accent line */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
        
        <div className="flex items-center justify-between px-6 py-3.5">
          {/* Left: Search */}
          <div className="flex items-center gap-4 flex-1 max-w-2xl">
            {/* Global Search with Enhanced UI */}
            <div className="flex-1 relative">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300" />
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-muted-foreground group-hover:text-blue-500 transition-all duration-200 z-10" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm kiếm nhanh..."
                  onFocus={() => setShowSearch(true)}
                  onBlur={() => setTimeout(() => setShowSearch(false), 200)}
                  className="w-full pl-11 pr-24 py-2.5 bg-muted/40 border border-border/60 rounded-xl 
                    focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/60 focus:bg-card/80
                    transition-all duration-200 placeholder:text-muted-foreground relative z-10
                    hover:bg-muted/50 hover:border-border/80"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 z-10">
                  <kbd className="px-2 py-1 bg-background/80 border border-border/70 rounded-md text-xs text-muted-foreground font-mono shadow-sm">
                    <Command className="w-3 h-3 inline" />
                  </kbd>
                  <kbd className="px-2 py-1 bg-background/80 border border-border/70 rounded-md text-xs text-muted-foreground font-mono shadow-sm">
                    K
                  </kbd>
                </div>
              </div>

              {/* Search Dropdown with Enhanced Design */}
              {showSearch && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-card/95 backdrop-blur-xl border border-border/60 rounded-xl shadow-2xl shadow-black/10 animate-slide-in-top overflow-hidden">
                  {/* Gradient header */}
                  <div className="h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
                  
                  <div className="p-3">
                    <div className="text-xs text-muted-foreground mb-2 px-2 flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5" />
                      Tìm kiếm gần đây
                    </div>
                    {recentSearches.map((search, idx) => (
                      <button
                        key={idx}
                        className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200 text-sm group flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <Search className="w-4 h-4 text-muted-foreground group-hover:text-blue-500 transition-colors" />
                          <div>
                            <div className="text-foreground">{search.query}</div>
                            <div className="text-xs text-muted-foreground">{search.type}</div>
                          </div>
                        </div>
                        <ChevronDown className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity rotate-[-90deg]" />
                      </button>
                    ))}
                  </div>
                  
                  <div className="border-t border-border/60 p-3 bg-muted/20">
                    <div className="text-xs text-muted-foreground mb-2 px-2 flex items-center gap-2">
                      <Zap className="w-3.5 h-3.5" />
                      Thao tác nhanh
                    </div>
                    {quickActions.map((action, idx) => {
                      const Icon = action.icon;
                      return (
                        <button
                          key={idx}
                          className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-card transition-all duration-200 text-sm group"
                        >
                          <div className="flex items-center gap-3">
                            <div className={`p-1.5 rounded-lg bg-${action.color}-100 group-hover:bg-${action.color}-200 transition-colors`}>
                              <Icon className={`w-3.5 h-3.5 text-${action.color}-600`} />
                            </div>
                            <span className="text-foreground">{action.label}</span>
                          </div>
                          <kbd className="px-2 py-1 bg-background/80 border border-border/70 rounded-md text-xs text-muted-foreground font-mono">
                            {action.shortcut}
                          </kbd>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right: Actions with Enhanced UI */}
          <div className="flex items-center gap-1.5 ml-6">
            {/* Quick Action Button */}
            <button className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-200 active:scale-95 group">
              <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" />
              <span className="text-sm font-medium">Tạo mới</span>
            </button>

            {/* Divider */}
            <div className="h-6 w-px bg-border/60 mx-1.5" />

            {/* Theme Toggle with Animation */}
            <button 
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className="p-2.5 rounded-xl hover:bg-muted/60 transition-all duration-200 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-orange-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              {theme === 'light' ? (
                <Moon className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-all duration-200 group-hover:rotate-[-20deg] relative z-10" />
              ) : (
                <Sun className="w-5 h-5 text-muted-foreground group-hover:text-amber-500 transition-all duration-200 group-hover:rotate-45 relative z-10" />
              )}
            </button>

            {/* Help with Indicator */}
            <button className="p-2.5 rounded-xl hover:bg-muted/60 transition-all duration-200 group relative">
              <HelpCircle className="w-5 h-5 text-muted-foreground group-hover:text-blue-500 transition-colors" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full animate-pulse shadow-lg shadow-blue-500/50" />
            </button>

            {/* Notifications with Enhanced Badge */}
            <NotificationCenter onNavigate={onNavigate} />

            {/* Divider */}
            <div className="h-6 w-px bg-border/60 mx-1.5" />

            {/* User Profile with Enhanced Design */}
            <div className="relative">
              <button 
                onClick={() => setShowProfile(!showProfile)}
                className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl hover:bg-muted/60 transition-all duration-200 group"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold shadow-lg relative">
                    A
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white shadow-sm" />
                </div>
                <div className="text-left hidden lg:block">
                  <div className="text-sm font-medium text-foreground">Admin User</div>
                  <div className="text-xs text-muted-foreground">admin@cms.com</div>
                </div>
                <ChevronDown className="w-4 h-4 text-muted-foreground group-hover:rotate-180 transition-transform duration-300" />
              </button>

              {/* Profile Dropdown with Enhanced Design */}
              {showProfile && (
                <div className="absolute top-full right-0 mt-2 w-72 bg-card/95 backdrop-blur-xl border border-border/60 rounded-xl shadow-2xl shadow-black/10 animate-slide-in-top overflow-hidden">
                  {/* Gradient header */}
                  <div className="h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
                  
                  <div className="p-4 border-b border-border/60 bg-gradient-to-br from-blue-50/50 to-purple-50/50">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="relative">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-lg shadow-lg">
                          A
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-sm" />
                      </div>
                      <div>
                        <div className="font-semibold text-foreground">Admin User</div>
                        <div className="text-xs text-muted-foreground">admin@cms.com</div>
                      </div>
                    </div>
                    <div className="px-3 py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg text-white shadow-lg">
                      <div className="flex items-center justify-between mb-1">
                        <div className="text-xs font-semibold opacity-90">Premium Plan</div>
                        <div className="px-2 py-0.5 bg-white/20 rounded text-[10px] font-medium">PRO</div>
                      </div>
                      <div className="text-xs opacity-80">Expires in 30 days</div>
                    </div>
                  </div>

                  <div className="p-2">
                    <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted/60 transition-all duration-200 text-sm group">
                      <User className="w-4 h-4 group-hover:scale-110 transition-transform" />
                      <span>Hồ sơ của tôi</span>
                    </button>
                    <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted/60 transition-all duration-200 text-sm group">
                      <Settings className="w-4 h-4 group-hover:rotate-90 transition-transform" />
                      <span>Cài đặt</span>
                    </button>
                  </div>

                  <div className="border-t border-border/60 p-2">
                    <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-red-50 text-red-600 transition-all duration-200 text-sm group">
                      <LogOut className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                      <span>Đăng xuất</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom gradient accent */}
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-border/60 to-transparent" />
      </header>

      {/* Command Palette Overlay */}
      {showCommandPalette && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center pt-32 animate-in">
          <div className="w-full max-w-2xl mx-4 bg-card/95 backdrop-blur-xl rounded-xl shadow-2xl border border-border/60 animate-slide-in-top overflow-hidden">
            {/* Search Input */}
            <div className="relative p-4 border-b border-border/60">
              <Search className="absolute left-7 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Tìm kiếm lệnh..."
                autoFocus
                className="w-full pl-12 pr-12 py-3 bg-transparent border-none focus:outline-none text-foreground placeholder:text-muted-foreground"
              />
              <button 
                onClick={() => setShowCommandPalette(false)}
                className="absolute right-7 top-1/2 -translate-y-1/2 p-1 hover:bg-muted/60 rounded-lg transition-colors"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            {/* Commands List */}
            <div className="p-2 max-h-96 overflow-y-auto">
              <div className="text-xs text-muted-foreground px-3 py-2">Thao tác nhanh</div>
              {quickActions.map((action, idx) => {
                const Icon = action.icon;
                return (
                  <button
                    key={idx}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-muted/60 transition-all duration-200 group"
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4 text-muted-foreground group-hover:text-foreground" />
                      <span className="text-sm">{action.label}</span>
                    </div>
                    <kbd className="px-2 py-1 bg-muted border border-border/60 rounded text-xs text-muted-foreground font-mono">
                      {action.shortcut}
                    </kbd>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}