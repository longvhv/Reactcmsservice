import React, { useState } from 'react';
import { useFetch, useMutate } from '@longvhv/query';
import { useNotifications } from '@longvhv/notifications';
import { 
  Bell, 
  X, 
  Check, 
  Trash2,
  FileText,
  MessageSquare,
  Users,
  AlertCircle,
  CheckCircle,
  Clock,
  Eye,
  Settings
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  category: 'article' | 'comment' | 'user' | 'system';
  title: string;
  message: string;
  read: boolean;
  actionUrl?: string;
  createdAt: string;
  meta?: {
    articleId?: string;
    userId?: string;
    commentId?: string;
  };
}

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({ isOpen, onClose }) => {
  const notifications = useNotifications();
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  // Fetch notifications
  const { data: notificationList, isLoading, refetch } = useFetch<Notification[]>(
    'notifications',
    async () => {
      // Mock data
      return [
        {
          id: '1',
          type: 'success',
          category: 'article',
          title: 'Article Published',
          message: 'Your article "Introduction to React Hooks" has been published successfully.',
          read: false,
          actionUrl: '/articles/1',
          createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
          meta: { articleId: '1' },
        },
        {
          id: '2',
          type: 'info',
          category: 'comment',
          title: 'New Comment',
          message: 'John Doe commented on your article "TypeScript Best Practices".',
          read: false,
          actionUrl: '/articles/2#comments',
          createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          meta: { articleId: '2', commentId: '5' },
        },
        {
          id: '3',
          type: 'warning',
          category: 'article',
          title: 'Approval Required',
          message: 'Article "Database Design Patterns" is waiting for your approval.',
          read: true,
          actionUrl: '/articles/3',
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          meta: { articleId: '3' },
        },
        {
          id: '4',
          type: 'info',
          category: 'user',
          title: 'New User Registration',
          message: 'Sarah Williams has registered and is pending approval.',
          read: true,
          actionUrl: '/users/5',
          createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          meta: { userId: '5' },
        },
        {
          id: '5',
          type: 'error',
          category: 'system',
          title: 'Crawler Failed',
          message: 'TechCrunch crawler failed: Connection timeout',
          read: false,
          actionUrl: '/articles/crawler',
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ];
    }
  );

  // Mark as read mutation
  const { mutate: markAsRead } = useMutate(
    async (id: string) => {
      await new Promise(resolve => setTimeout(resolve, 500));
      return { success: true };
    },
    {
      onSuccess: () => refetch(),
    }
  );

  // Mark all as read
  const { mutate: markAllAsRead } = useMutate(
    async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      return { success: true };
    },
    {
      onSuccess: () => {
        notifications.success('Đã đánh dấu tất cả đã đọc');
        refetch();
      },
    }
  );

  // Delete notification
  const { mutate: deleteNotification } = useMutate(
    async (id: string) => {
      await new Promise(resolve => setTimeout(resolve, 500));
      return { success: true };
    },
    {
      onSuccess: () => {
        notifications.success('Đã xóa thông báo');
        refetch();
      },
    }
  );

  // Clear all
  const { mutate: clearAll } = useMutate(
    async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      return { success: true };
    },
    {
      onSuccess: () => {
        notifications.success('Đã xóa tất cả thông báo');
        refetch();
      },
    }
  );

  // Get icon for notification type
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Bell className="w-5 h-5 text-blue-500" />;
    }
  };

  // Get icon for category
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'article':
        return <FileText className="w-4 h-4" />;
      case 'comment':
        return <MessageSquare className="w-4 h-4" />;
      case 'user':
        return <Users className="w-4 h-4" />;
      default:
        return <Settings className="w-4 h-4" />;
    }
  };

  // Filter notifications
  const filteredNotifications = notificationList?.filter(n => 
    filter === 'all' || (filter === 'unread' && !n.read)
  );

  const unreadCount = notificationList?.filter(n => !n.read).length || 0;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end pt-16 px-4 pointer-events-none">
      <div className="w-full max-w-md pointer-events-auto animate-in slide-in-from-right-5 duration-200">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <div>
              <h2 className="text-lg font-bold">Thông báo</h2>
              {unreadCount > 0 && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {unreadCount} chưa đọc
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 p-4 border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              Tất cả
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filter === 'unread'
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              Chưa đọc {unreadCount > 0 && `(${unreadCount})`}
            </button>

            <div className="ml-auto flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={() => markAllAsRead()}
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Đánh dấu tất cả đã đọc
                </button>
              )}
              <button
                onClick={() => clearAll()}
                className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                title="Xóa tất cả"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-[600px] overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : filteredNotifications && filteredNotifications.length > 0 ? (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors ${
                      !notification.read ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Icon */}
                      <div className="flex-shrink-0 mt-1">
                        {getTypeIcon(notification.type)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium text-sm">{notification.title}</h3>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                            )}
                          </div>
                          {getCategoryIcon(notification.category)}
                        </div>

                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          {notification.message}
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                            <Clock className="w-3 h-3" />
                            {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                          </div>

                          <div className="flex items-center gap-1">
                            {notification.actionUrl && (
                              <a
                                href={notification.actionUrl}
                                onClick={onClose}
                                className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                                title="Xem"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </a>
                            )}
                            {!notification.read && (
                              <button
                                onClick={() => markAsRead(notification.id)}
                                className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                                title="Đánh dấu đã đọc"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                            )}
                            <button
                              onClick={() => deleteNotification(notification.id)}
                              className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 rounded transition-colors"
                              title="Xóa"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Bell className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
                <p className="text-gray-600 dark:text-gray-400">
                  {filter === 'unread' ? 'Không có thông báo chưa đọc' : 'Không có thông báo'}
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
            <a
              href="/notifications"
              onClick={onClose}
              className="block text-center text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              Xem tất cả thông báo
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

// Notification Badge Component
export const NotificationBadge: React.FC<{ count: number }> = ({ count }) => {
  if (count === 0) return null;

  return (
    <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1.5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
      {count > 99 ? '99+' : count}
    </span>
  );
};