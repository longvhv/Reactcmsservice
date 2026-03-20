import React from 'react';
import {
  LayoutDashboard, FileText, PenSquare, Coins, BarChart3,
  Settings, User, LogOut, Bell, ChevronRight, Home, Newspaper,
  Video, Image as ImageIcon, Headphones, Calendar as CalendarIcon,
  Briefcase, Award, TrendingUp, Clock, CheckCircle, Eye
} from 'lucide-react';
import { motion } from 'motion/react';

interface ReporterSidebarProps {
  activePage: string;
  onNavigate: (page: string) => void;
  currentUser?: any;
}

export function ReporterSidebar({ activePage, onNavigate, currentUser }: ReporterSidebarProps) {
  const menuItems = [
    {
      id: 'dashboard',
      label: 'Tổng quan',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'my-articles',
      label: 'Bài viết của tôi',
      icon: FileText,
      badge: '24'
    },
    {
      id: 'create-article',
      label: 'Tạo bài mới',
      icon: PenSquare,
      badge: null,
      highlight: true
    },
    {
      id: 'my-royalty',
      label: 'Nhuận bút',
      icon: Coins,
      badge: 'Mới'
    },
    {
      id: 'analytics',
      label: 'Thống kê',
      icon: BarChart3,
      badge: null
    },
    {
      id: 'notifications',
      label: 'Thông báo',
      icon: Bell,
      badge: '3'
    },
    {
      id: 'help',
      label: 'Trợ giúp',
      icon: Settings,
      badge: null
    },
    {
      id: 'profile',
      label: 'Hồ sơ',
      icon: User,
      badge: null
    }
  ];

  const quickActions = [
    { id: 'news', label: 'Tin tức', icon: Newspaper, color: 'blue' },
    { id: 'video', label: 'Video', icon: Video, color: 'red' },
    { id: 'gallery', label: 'Bộ sưu tập', icon: ImageIcon, color: 'green' },
    { id: 'podcast', label: 'Podcast', icon: Headphones, color: 'purple' }
  ];

  return (
    <div className="w-64 bg-white border-r border-slate-200 flex flex-col h-screen sticky top-0">
      {/* Header */}
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
            <PenSquare className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-slate-900">Cổng Phóng viên</h1>
            <p className="text-xs text-slate-500">Trang phóng viên</p>
          </div>
        </div>

        {/* User Info */}
        {currentUser && (
          <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">
                {currentUser.name.charAt(0)}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-slate-900 text-sm truncate">
                {currentUser.name}
              </div>
              <div className="text-xs text-slate-600">{currentUser.role}</div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          
          return (
            <motion.button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30'
                  : item.highlight
                  ? 'bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 hover:from-green-100 hover:to-emerald-100 border border-green-200'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : ''}`} />
                <span className="font-medium">{item.label}</span>
              </div>
              
              {item.badge && (
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : item.badge === 'New'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-blue-100 text-blue-700'
                }`}>
                  {item.badge}
                </span>
              )}
            </motion.button>
          );
        })}

        {/* Divider */}
        <div className="py-4">
          <div className="h-px bg-slate-200" />
        </div>

        {/* Quick Actions - REMOVED */}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-200 space-y-2">
        <button className="w-full flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-lg transition-all">
          <Settings className="w-5 h-5" />
          <span className="font-medium">Cài đặt</span>
        </button>
        <button className="w-full flex items-center gap-3 px-4 py-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-all">
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Đăng xuất</span>
        </button>
      </div>
    </div>
  );
}