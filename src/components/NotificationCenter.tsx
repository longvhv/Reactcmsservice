import React, { useState } from 'react';
import {
  Bell, Check, X, Eye, MessageSquare, UserPlus, FileText, AlertCircle,
  CheckCircle, XCircle, Clock, Settings, Filter, Archive, Trash2,
  Star, TrendingUp, Calendar, Tag, Users
} from 'lucide-react';
import { Card } from './Card';
import { useLanguage } from '../contexts/LanguageContext';

interface Notification {
  id: string;
  type: 'comment' | 'mention' | 'approval' | 'publish' | 'system' | 'warning' | 'success' | 'assignment';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  user?: {
    name: string;
    avatar: string;
  };
  metadata?: {
    articleTitle?: string;
    articleId?: number;
    commentCount?: number;
  };
}

export function NotificationCenter({ onNavigate }: { onNavigate?: (page: any) => void }) {
  const { t } = useLanguage();
  const [showPanel, setShowPanel] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'comment',
      title: 'Bình luận mới',
      message: 'Nguyễn Văn A đã bình luận về bài viết "AI Revolution"',
      timestamp: '2024-12-27T10:30:00',
      read: false,
      user: {
        name: 'Nguyễn Văn A',
        avatar: 'https://i.pravatar.cc/150?img=1',
      },
      metadata: {
        articleTitle: 'AI Revolution: Xu hướng AI năm 2024',
        articleId: 101,
        commentCount: 1,
      },
    },
    {
      id: '2',
      type: 'approval',
      title: 'Bài viết được phê duyệt',
      message: 'Bài viết "Cloud Infrastructure" đã được Admin phê duyệt',
      timestamp: '2024-12-27T09:45:00',
      read: false,
      metadata: {
        articleTitle: 'Cloud Infrastructure: Best Practices',
        articleId: 102,
      },
    },
    {
      id: '3',
      type: 'mention',
      title: 'Được nhắc đến',
      message: 'Trần Thị B đã nhắc đến bạn trong một bình luận',
      timestamp: '2024-12-27T09:15:00',
      read: false,
      user: {
        name: 'Trần Thị B',
        avatar: 'https://i.pravatar.cc/150?img=2',
      },
      metadata: {
        articleTitle: 'Blockchain & Web3',
        articleId: 103,
      },
    },
    {
      id: '4',
      type: 'publish',
      title: 'Bài viết đã xuất bản',
      message: 'Bài viết "Machine Learning" đã được xuất bản thành công',
      timestamp: '2024-12-27T08:50:00',
      read: true,
      metadata: {
        articleTitle: 'Machine Learning trong thực tế',
        articleId: 104,
      },
    },
    {
      id: '5',
      type: 'warning',
      title: 'Cảnh báo: Bài viết sắp hết hạn',
      message: 'Bài viết "Sự kiện Workshop" sẽ hết hạn trong 2 ngày',
      timestamp: '2024-12-27T08:30:00',
      read: true,
      metadata: {
        articleTitle: 'Workshop AI trong phát triển phần mềm',
        articleId: 105,
      },
    },
    {
      id: '6',
      type: 'assignment',
      title: 'Công việc mới',
      message: 'Bạn được giao nhiệm vụ review bài viết "DevOps Guide"',
      timestamp: '2024-12-26T16:30:00',
      read: true,
      user: {
        name: 'Admin',
        avatar: 'https://i.pravatar.cc/150?img=5',
      },
      metadata: {
        articleTitle: 'DevOps: Automation và CI/CD',
        articleId: 106,
      },
    },
    {
      id: '7',
      type: 'success',
      title: 'Mục tiêu hoàn thành',
      message: 'Bạn đã đạt 100 bài viết được xuất bản!',
      timestamp: '2024-12-26T15:00:00',
      read: true,
    },
    {
      id: '8',
      type: 'system',
      title: 'Cập nhật hệ thống',
      message: 'Hệ thống CMS đã được nâng cấp lên phiên bản 2.5.0',
      timestamp: '2024-12-26T14:00:00',
      read: true,
    },
  ]);

  const notificationConfig = {
    comment: { icon: MessageSquare, color: '#3B82F6', bgColor: 'bg-blue-100 dark:bg-blue-900/30' },
    mention: { icon: Tag, color: '#8B5CF6', bgColor: 'bg-purple-100 dark:bg-purple-900/30' },
    approval: { icon: CheckCircle, color: '#10B981', bgColor: 'bg-green-100 dark:bg-green-900/30' },
    publish: { icon: FileText, color: '#6366F1', bgColor: 'bg-indigo-100 dark:bg-indigo-900/30' },
    system: { icon: Settings, color: '#6B7280', bgColor: 'bg-gray-100 dark:bg-gray-900/30' },
    warning: { icon: AlertCircle, color: '#F59E0B', bgColor: 'bg-yellow-100 dark:bg-yellow-900/30' },
    success: { icon: Star, color: '#10B981', bgColor: 'bg-green-100 dark:bg-green-900/30' },
    assignment: { icon: Users, color: '#EC4899', bgColor: 'bg-pink-100 dark:bg-pink-900/30' },
  };

  const filteredNotifications = notifications.filter((notif) => {
    if (filter === 'unread') return !notif.read;
    if (filter === 'read') return notif.read;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
    setShowPanel(false);
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'Vừa xong';
    if (minutes < 60) return `${minutes} phút trước`;
    if (hours < 24) return `${hours} giờ trước`;
    if (days < 7) return `${days} ngày trước`;
    return date.toLocaleDateString('vi-VN');
  };

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={() => setShowPanel(!showPanel)}
        className="relative p-2 hover:bg-secondary rounded-xl transition-colors"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Panel */}
      {showPanel && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setShowPanel(false)}
          />

          {/* Panel */}
          <div className="absolute right-0 top-12 w-96 max-h-[600px] bg-background border border-border rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-border bg-secondary/50">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-lg">Thông báo</h3>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-xs text-blue-500 hover:text-blue-600 transition-colors"
                    >
                      Đánh dấu đã đọc
                    </button>
                  )}
                  <button
                    onClick={() => setShowPanel(false)}
                    className="p-1.5 hover:bg-muted rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Filter Tabs */}
              <div className="flex gap-2">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    filter === 'all'
                      ? 'bg-blue-500 text-white shadow-lg'
                      : 'bg-muted hover:bg-muted/80'
                  }`}
                >
                  Tất cả ({notifications.length})
                </button>
                <button
                  onClick={() => setFilter('unread')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    filter === 'unread'
                      ? 'bg-blue-500 text-white shadow-lg'
                      : 'bg-muted hover:bg-muted/80'
                  }`}
                >
                  Chưa đọc ({unreadCount})
                </button>
                <button
                  onClick={() => setFilter('read')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    filter === 'read'
                      ? 'bg-blue-500 text-white shadow-lg'
                      : 'bg-muted hover:bg-muted/80'
                  }`}
                >
                  Đã đọc ({notifications.length - unreadCount})
                </button>
              </div>
            </div>

            {/* Notification List */}
            <div className="flex-1 overflow-y-auto">
              {filteredNotifications.length > 0 ? (
                <div className="divide-y divide-border">
                  {filteredNotifications.map((notification) => {
                    const config = notificationConfig[notification.type];
                    const Icon = config.icon;

                    return (
                      <div
                        key={notification.id}
                        className={`p-4 hover:bg-secondary/50 transition-colors relative group ${
                          !notification.read ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''
                        }`}
                      >
                        {!notification.read && (
                          <div className="absolute left-2 top-1/2 -translate-y-1/2 w-2 h-2 bg-blue-500 rounded-full" />
                        )}

                        <div className="flex gap-3 ml-4">
                          {/* Icon or Avatar */}
                          {notification.user ? (
                            <img
                              src={notification.user.avatar}
                              alt={notification.user.name}
                              className="w-10 h-10 rounded-full flex-shrink-0"
                            />
                          ) : (
                            <div className={`p-2 ${config.bgColor} rounded-xl flex-shrink-0`}>
                              <Icon className="w-5 h-5" style={{ color: config.color }} />
                            </div>
                          )}

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <h4 className="font-semibold text-sm">{notification.title}</h4>
                              <button
                                onClick={() => deleteNotification(notification.id)}
                                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-muted rounded transition-all"
                              >
                                <Trash2 className="w-3 h-3 text-red-500" />
                              </button>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              {notification.message}
                            </p>
                            <div className="flex items-center gap-3">
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {formatTimestamp(notification.timestamp)}
                              </span>
                              {notification.metadata?.articleTitle && onNavigate && (
                                <button
                                  onClick={() => {
                                    onNavigate({ 
                                      page: 'article-detail', 
                                      id: notification.metadata!.articleId! 
                                    });
                                    markAsRead(notification.id);
                                    setShowPanel(false);
                                  }}
                                  className="text-xs text-blue-500 hover:text-blue-600 transition-colors"
                                >
                                  Xem bài viết →
                                </button>
                              )}
                              {!notification.read && (
                                <button
                                  onClick={() => markAsRead(notification.id)}
                                  className="text-xs text-blue-500 hover:text-blue-600 transition-colors flex items-center gap-1"
                                >
                                  <Check className="w-3 h-3" />
                                  Đánh dấu đã đọc
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-12 text-center">
                  <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                  <p className="text-muted-foreground">
                    {filter === 'unread' && 'Không có thông báo chưa đọc'}
                    {filter === 'read' && 'Không có thông báo đã đọc'}
                    {filter === 'all' && 'Không có thông báo'}
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="p-3 border-t border-border bg-secondary/50 flex gap-2">
                <button
                  onClick={() => {
                    // Navigate to full notification page
                    setShowPanel(false);
                  }}
                  className="flex-1 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
                >
                  Xem tất cả
                </button>
                <button
                  onClick={clearAll}
                  className="px-3 py-2 bg-secondary hover:bg-muted rounded-lg transition-colors text-sm flex items-center gap-2"
                >
                  <Archive className="w-4 h-4" />
                  Xóa tất cả
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}