import React, { useState } from 'react';
import {
  Bell,
  CheckCircle,
  AlertCircle,
  Info,
  XCircle,
  Clock,
  FileText,
  DollarSign,
  MessageCircle,
  TrendingUp,
  Award,
  Settings,
  Trash2,
  Check,
  Filter
} from 'lucide-react';
import { motion } from 'motion/react';

interface ReporterNotificationsProps {
  currentUserId: number;
}

interface Notification {
  id: number;
  type: 'success' | 'warning' | 'info' | 'error';
  title: string;
  message: string;
  time: string;
  read: boolean;
  category: 'article' | 'royalty' | 'comment' | 'system';
  actionUrl?: string;
}

export function ReporterNotifications({ currentUserId }: ReporterNotificationsProps) {
  const [filter, setFilter] = useState<'all' | 'unread' | 'article' | 'royalty' | 'comment' | 'system'>('all');
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      type: 'success',
      title: 'Bài viết đã được duyệt',
      message: 'Bài viết "Xu hướng công nghệ AI 2026" đã được phê duyệt và xuất bản.',
      time: '5 phút trước',
      read: false,
      category: 'article'
    },
    {
      id: 2,
      type: 'info',
      title: 'Nhuận bút mới',
      message: 'Bạn nhận được 2.5M VNĐ từ bài viết "Phân tích thị trường chứng khoán".',
      time: '1 giờ trước',
      read: false,
      category: 'royalty'
    },
    {
      id: 3,
      type: 'warning',
      title: 'Bài viết cần chỉnh sửa',
      message: 'Bài viết "Review iPhone 16 Pro" cần chỉnh sửa theo nhận xét của biên tập viên.',
      time: '2 giờ trước',
      read: false,
      category: 'article'
    },
    {
      id: 4,
      type: 'info',
      title: 'Bình luận mới',
      message: 'Có 5 bình luận mới trên bài viết "Top 10 smartphone 2026".',
      time: '3 giờ trước',
      read: true,
      category: 'comment'
    },
    {
      id: 5,
      type: 'success',
      title: 'Bài viết đạt milestone',
      message: 'Bài viết "Hướng dẫn đầu tư crypto" đã đạt 10,000 lượt xem!',
      time: '5 giờ trước',
      read: true,
      category: 'article'
    },
    {
      id: 6,
      type: 'info',
      title: 'Cập nhật hệ thống',
      message: 'Cổng Phóng viên có tính năng mới: Trợ lý viết bài AI. Hãy thử ngay!',
      time: '1 ngày trước',
      read: true,
      category: 'system'
    },
    {
      id: 7,
      type: 'error',
      title: 'Bài viết bị từ chối',
      message: 'Bài viết "Thông tin chưa xác thực" không đáp ứng tiêu chuẩn biên tập.',
      time: '2 ngày trước',
      read: true,
      category: 'article'
    },
    {
      id: 8,
      type: 'info',
      title: 'Thanh toán nhuận bút',
      message: 'Đã chuyển khoản 15.8M VNĐ nhuận bút tháng 12/2025 vào tài khoản của bạn.',
      time: '3 ngày trước',
      read: true,
      category: 'royalty'
    },
  ]);

  const getIcon = (type: string, category: string) => {
    if (category === 'article') return FileText;
    if (category === 'royalty') return DollarSign;
    if (category === 'comment') return MessageCircle;
    
    switch (type) {
      case 'success': return CheckCircle;
      case 'warning': return AlertCircle;
      case 'error': return XCircle;
      default: return Info;
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case 'success': return {
        bg: 'bg-green-50',
        border: 'border-green-200',
        icon: 'text-green-600',
        gradient: 'from-green-500 to-emerald-500'
      };
      case 'warning': return {
        bg: 'bg-yellow-50',
        border: 'border-yellow-200',
        icon: 'text-yellow-600',
        gradient: 'from-yellow-500 to-orange-500'
      };
      case 'error': return {
        bg: 'bg-red-50',
        border: 'border-red-200',
        icon: 'text-red-600',
        gradient: 'from-red-500 to-rose-500'
      };
      default: return {
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        icon: 'text-blue-600',
        gradient: 'from-blue-500 to-indigo-500'
      };
    }
  };

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notif.read;
    return notif.category === filter;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const filterOptions = [
    { value: 'all', label: 'Tất cả', icon: Bell },
    { value: 'unread', label: 'Chưa đọc', icon: Clock, badge: unreadCount },
    { value: 'article', label: 'Bài viết', icon: FileText },
    { value: 'royalty', label: 'Nhuận bút', icon: DollarSign },
    { value: 'comment', label: 'Bình luận', icon: MessageCircle },
    { value: 'system', label: 'Hệ thống', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2 flex items-center gap-3">
                <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white relative">
                  <Bell className="w-8 h-8" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </div>
                Thông báo
              </h1>
              <p className="text-slate-600">
                {unreadCount > 0 ? `Bạn có ${unreadCount} thông báo chưa đọc` : 'Không có thông báo mới'}
              </p>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-all flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                Đánh dấu đã đọc tất cả
              </button>
            )}
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            {filterOptions.map((option) => {
              const Icon = option.icon;
              const isActive = filter === option.value;
              
              return (
                <button
                  key={option.value}
                  onClick={() => setFilter(option.value as any)}
                  className={`px-4 py-2.5 rounded-xl font-medium transition-all flex items-center gap-2 ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {option.label}
                  {option.badge !== undefined && option.badge > 0 && (
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                      isActive ? 'bg-white/20' : 'bg-red-500 text-white'
                    }`}>
                      {option.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {filteredNotifications.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 text-center">
              <Bell className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-900 mb-2">Không có thông báo</h3>
              <p className="text-slate-600">
                {filter === 'unread' 
                  ? 'Bạn đã đọc tất cả thông báo!'
                  : 'Chưa có thông báo nào trong danh mục này.'}
              </p>
            </div>
          ) : (
            filteredNotifications.map((notification) => {
              const Icon = getIcon(notification.type, notification.category);
              const colors = getColor(notification.type);
              
              return (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`bg-white rounded-2xl border shadow-sm hover:shadow-md transition-all overflow-hidden group ${
                    notification.read ? 'border-slate-200' : 'border-blue-300 bg-blue-50/30'
                  }`}
                >
                  <div className={`h-1 bg-gradient-to-r ${colors.gradient}`} />
                  <div className="p-6">
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div className={`p-3 rounded-xl ${colors.bg} border ${colors.border} flex-shrink-0`}>
                        <Icon className={`w-6 h-6 ${colors.icon}`} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <h3 className={`font-bold text-slate-900 ${!notification.read ? 'text-blue-900' : ''}`}>
                            {notification.title}
                            {!notification.read && (
                              <span className="ml-2 inline-block w-2 h-2 bg-blue-600 rounded-full" />
                            )}
                          </h3>
                          <div className="flex items-center gap-2 text-xs text-slate-500">
                            <Clock className="w-3 h-3" />
                            {notification.time}
                          </div>
                        </div>
                        <p className="text-slate-600 mb-3">{notification.message}</p>
                        
                        {/* Actions */}
                        <div className="flex items-center gap-3">
                          {notification.actionUrl && (
                            <button className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                              Xem chi tiết
                            </button>
                          )}
                          {!notification.read && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors text-sm font-medium"
                            >
                              Đánh dấu đã đọc
                            </button>
                          )}
                          <button
                            onClick={() => deleteNotification(notification.id)}
                            className="ml-auto px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium opacity-0 group-hover:opacity-100 flex items-center gap-1"
                          >
                            <Trash2 className="w-4 h-4" />
                            Xóa
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>

        {/* Quick Stats */}
        {filteredNotifications.length > 0 && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Bell className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900">{notifications.length}</div>
                  <div className="text-sm text-slate-600">Tổng thông báo</div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-50 rounded-lg">
                  <Clock className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900">{unreadCount}</div>
                  <div className="text-sm text-slate-600">Chưa đọc</div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-50 rounded-lg">
                  <FileText className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900">
                    {notifications.filter(n => n.category === 'article').length}
                  </div>
                  <div className="text-sm text-slate-600">Bài viết</div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-50 rounded-lg">
                  <DollarSign className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900">
                    {notifications.filter(n => n.category === 'royalty').length}
                  </div>
                  <div className="text-sm text-slate-600">Nhuận bút</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}