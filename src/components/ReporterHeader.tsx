import { 
  Search, Command, Bell, Settings, User, LogOut, HelpCircle, Moon, Sun, 
  Plus, Upload, TrendingUp, ChevronDown, MessageSquare, CheckCircle, 
  Zap, Repeat, Shield, FileText, Video, Image as ImageIcon, Headphones
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';

interface ReporterHeaderProps {
  currentUser?: any;
  onSwitchRole?: () => void;
  onNavigate?: (page: string) => void;
}

export function ReporterHeader({ currentUser, onSwitchRole, onNavigate }: ReporterHeaderProps) {
  const { t } = useLanguage();
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
        setShowNotifications(false);
        setShowProfile(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.dropdown-container')) {
        setShowNotifications(false);
        setShowProfile(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const notifications = [
    { 
      id: 1, 
      type: 'comment', 
      message: 'Bài viết "Xu hướng AI 2024" có 5 bình luận mới', 
      time: '5 phút trước', 
      unread: true, 
      icon: MessageSquare, 
      color: 'blue' 
    },
    { 
      id: 2, 
      type: 'approval', 
      message: 'Bài "Video Marketing Tips" đã được duyệt', 
      time: '1 giờ trước', 
      unread: true, 
      icon: CheckCircle, 
      color: 'green' 
    },
    { 
      id: 3, 
      type: 'royalty', 
      message: 'Nhuận bút tháng 12 đã được tính: 3.5M VND', 
      time: '2 giờ trước', 
      unread: false, 
      icon: Zap, 
      color: 'yellow' 
    },
  ];

  const quickActions = [
    { label: 'Tạo tin tức', shortcut: '⌘N', icon: FileText, color: 'blue', action: 'create-article?type=news' },
    { label: 'Tạo video', shortcut: '⌘V', icon: Video, color: 'red', action: 'create-article?type=video' },
    { label: 'Tạo gallery', shortcut: '⌘G', icon: ImageIcon, color: 'green', action: 'create-article?type=gallery' },
    { label: 'Tạo podcast', shortcut: '⌘P', icon: Headphones, color: 'purple', action: 'create-article?type=podcast' },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <>
      <header className="sticky top-0 z-40 glass-strong border-b border-border/40 backdrop-blur-xl bg-white/80">
        {/* Gradient accent line */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
        
        <div className="flex items-center justify-between px-6 py-3.5">
          {/* Left: Logo + Search */}
          <div className="flex items-center gap-4 flex-1 max-w-2xl">
            {/* Logo/Title */}
            <div className="hidden lg:flex items-center gap-2 mr-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
                <FileText className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-lg bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Cổng Phóng viên
              </span>
            </div>

            {/* Global Search */}
            <div className="flex-1 relative">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300" />
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-muted-foreground group-hover:text-blue-500 transition-all duration-200 z-10" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm kiếm bài viết của tôi..."
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

              {/* Search Dropdown */}
              {showSearch && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-card/95 backdrop-blur-xl border border-border/60 rounded-xl shadow-2xl shadow-black/10 animate-slide-in-top overflow-hidden">
                  <div className="h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
                  
                  <div className="p-4">
                    <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                      Tìm kiếm nhanh
                    </div>
                    <div className="space-y-2">
                      {quickActions.map((action) => {
                        const Icon = action.icon;
                        return (
                          <button
                            key={action.action}
                            onClick={() => {
                              onNavigate?.(action.action);
                              setShowSearch(false);
                            }}
                            className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-muted/60 transition-all duration-200 group"
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 bg-${action.color}-100 rounded-lg flex items-center justify-center`}>
                                <Icon className={`w-4 h-4 text-${action.color}-600`} />
                              </div>
                              <span className="text-sm">{action.label}</span>
                            </div>
                            <kbd className="px-2 py-1 bg-background/80 border border-border/70 rounded-md text-xs text-muted-foreground font-mono">
                              {action.shortcut}
                            </kbd>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-1.5 ml-6">
            {/* Quick Action Button */}
            <button 
              onClick={() => onNavigate?.('create-article')}
              className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-200 active:scale-95 group"
            >
              <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" />
              <span className="text-sm font-medium">Tạo bài mới</span>
            </button>

            {/* Divider */}
            <div className="h-6 w-px bg-border/60 mx-1.5" />

            {/* Theme Toggle */}
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

            {/* Help */}
            <button className="p-2.5 rounded-xl hover:bg-muted/60 transition-all duration-200 group relative">
              <HelpCircle className="w-5 h-5 text-muted-foreground group-hover:text-blue-500 transition-colors" />
            </button>

            {/* Notifications */}
            <div className="relative dropdown-container">
              <button 
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowProfile(false);
                }}
                className="p-2.5 rounded-xl hover:bg-muted/60 transition-all duration-200 group relative"
              >
                <Bell className="w-5 h-5 text-muted-foreground group-hover:text-blue-500 transition-colors" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-[10px] font-bold text-white shadow-lg shadow-red-500/50">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute top-full right-0 mt-2 w-96 bg-card/95 backdrop-blur-xl border border-border/60 rounded-xl shadow-2xl shadow-black/10 animate-slide-in-top overflow-hidden">
                  <div className="h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
                  
                  <div className="p-4 border-b border-border/60">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-foreground">Thông báo</h3>
                      <span className="text-xs text-muted-foreground">{unreadCount} chưa đọc</span>
                    </div>
                  </div>

                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map((notif) => {
                      const Icon = notif.icon;
                      return (
                        <div
                          key={notif.id}
                          className={`p-4 border-b border-border/40 hover:bg-muted/40 transition-colors cursor-pointer ${
                            notif.unread ? 'bg-blue-50/50' : ''
                          }`}
                        >
                          <div className="flex gap-3">
                            <div className={`w-10 h-10 bg-${notif.color}-100 rounded-lg flex items-center justify-center flex-shrink-0`}>
                              <Icon className={`w-5 h-5 text-${notif.color}-600`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-foreground mb-1">{notif.message}</p>
                              <p className="text-xs text-muted-foreground">{notif.time}</p>
                            </div>
                            {notif.unread && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1.5" />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="p-3 border-t border-border/60">
                    <button className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium">
                      Xem tất cả thông báo
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="h-6 w-px bg-border/60 mx-1.5" />

            {/* User Profile */}
            <div className="relative dropdown-container">
              <button 
                onClick={() => {
                  setShowProfile(!showProfile);
                  setShowNotifications(false);
                }}
                className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl hover:bg-muted/60 transition-all duration-200 group"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold shadow-lg relative">
                    {currentUser?.name?.charAt(0) || 'U'}
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white shadow-sm" />
                </div>
                <div className="text-left hidden lg:block">
                  <div className="text-sm font-medium text-foreground">{currentUser?.name || 'Người dùng'}</div>
                  <div className="text-xs text-muted-foreground">{currentUser?.role || 'Phóng viên'}</div>
                </div>
                <ChevronDown className="w-4 h-4 text-muted-foreground group-hover:rotate-180 transition-transform duration-300" />
              </button>

              {/* Profile Dropdown */}
              {showProfile && (
                <div className="absolute top-full right-0 mt-2 w-72 bg-card/95 backdrop-blur-xl border border-border/60 rounded-xl shadow-2xl shadow-black/10 animate-slide-in-top overflow-hidden">
                  <div className="h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
                  
                  <div className="p-4 border-b border-border/60 bg-gradient-to-br from-blue-50/50 to-purple-50/50">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="relative">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-lg shadow-lg">
                          {currentUser?.name?.charAt(0) || 'U'}
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-sm" />
                      </div>
                      <div>
                        <div className="font-semibold text-foreground">{currentUser?.name || 'Tên người dùng'}</div>
                        <div className="text-xs text-muted-foreground">{currentUser?.email || 'user@email.com'}</div>
                      </div>
                    </div>
                    <div className="px-3 py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg text-white shadow-lg">
                      <div className="flex items-center justify-between mb-1">
                        <div className="text-xs font-semibold opacity-90">Phóng viên</div>
                        <div className="px-2 py-0.5 bg-white/20 rounded text-[10px] font-medium">REPORTER</div>
                      </div>
                      <div className="text-xs opacity-80">24 bài viết · 35.8M nhuận bút</div>
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
                    <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted/60 transition-all duration-200 text-sm group">
                      <TrendingUp className="w-4 h-4 group-hover:scale-110 transition-transform" />
                      <span>Thống kê của tôi</span>
                    </button>
                    
                    {/* Switch Role Button - HIGHLIGHT */}
                    <div className="my-2 h-px bg-border/60" />
                    <button 
                      onClick={() => {
                        onSwitchRole?.();
                        setShowProfile(false);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-gradient-to-r from-purple-50 to-indigo-50 hover:from-purple-100 hover:to-indigo-100 border border-purple-200 transition-all duration-200 text-sm group"
                    >
                      <div className="w-7 h-7 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center">
                        <Repeat className="w-4 h-4 text-white group-hover:rotate-180 transition-transform duration-300" />
                      </div>
                      <div className="flex-1 text-left">
                        <div className="font-semibold text-purple-900">Chuyển sang Admin</div>
                        <div className="text-xs text-purple-600">Truy cập trang quản trị</div>
                      </div>
                      <Shield className="w-4 h-4 text-purple-600" />
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
    </>
  );
}