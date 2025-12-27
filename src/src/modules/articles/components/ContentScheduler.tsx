import React, { useState } from 'react';
import { useFetch, useMutate } from '@longvhv/query';
import { useNotifications } from '@longvhv/notifications';
import { 
  Calendar, 
  Clock, 
  Plus, 
  Trash2,
  Edit,
  Play,
  Pause,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Eye
} from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';

interface ScheduledArticle {
  id: string;
  articleId: string;
  title: string;
  scheduledDate: string;
  scheduledTime: string;
  status: 'pending' | 'published' | 'failed' | 'cancelled';
  action: 'publish' | 'unpublish' | 'archive';
  author: {
    id: string;
    name: string;
  };
  createdAt: string;
  error?: string;
}

interface ContentSchedulerProps {
  articleId?: string;
  articleTitle?: string;
}

export const ContentScheduler: React.FC<ContentSchedulerProps> = ({
  articleId,
  articleTitle,
}) => {
  const notifications = useNotifications();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<ScheduledArticle | null>(null);

  const [formData, setFormData] = useState({
    articleId: articleId || '',
    scheduledDate: '',
    scheduledTime: '',
    action: 'publish' as 'publish' | 'unpublish' | 'archive',
    timezone: 'UTC+7',
    notifyAuthor: true,
  });

  // Fetch scheduled articles
  const { data: scheduled, isLoading, refetch } = useFetch<ScheduledArticle[]>(
    ['scheduled-articles', articleId],
    async () => {
      // Mock data
      return [
        {
          id: '1',
          articleId: '1',
          title: 'Introduction to React Hooks',
          scheduledDate: '2024-12-28',
          scheduledTime: '09:00',
          status: 'pending',
          action: 'publish',
          author: { id: '1', name: 'John Doe' },
          createdAt: new Date().toISOString(),
        },
        {
          id: '2',
          articleId: '2',
          title: 'TypeScript Best Practices',
          scheduledDate: '2024-12-29',
          scheduledTime: '14:30',
          status: 'pending',
          action: 'publish',
          author: { id: '2', name: 'Jane Smith' },
          createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: '3',
          articleId: '3',
          title: 'Database Design Patterns',
          scheduledDate: '2024-12-27',
          scheduledTime: '10:00',
          status: 'published',
          action: 'publish',
          author: { id: '1', name: 'John Doe' },
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: '4',
          articleId: '4',
          title: 'Modern CSS Techniques',
          scheduledDate: '2024-12-26',
          scheduledTime: '15:00',
          status: 'failed',
          action: 'publish',
          author: { id: '3', name: 'Mike Johnson' },
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          error: 'Article not found',
        },
      ];
    }
  );

  // Schedule mutation
  const { mutate: scheduleArticle, isPending: isScheduling } = useMutate(
    async (data: typeof formData) => {
      await new Promise(resolve => setTimeout(resolve, 1500));
      return { success: true };
    },
    {
      onSuccess: () => {
        notifications.success('Article scheduled successfully');
        setShowAddModal(false);
        setEditingSchedule(null);
        setFormData({
          articleId: articleId || '',
          scheduledDate: '',
          scheduledTime: '',
          action: 'publish',
          timezone: 'UTC+7',
          notifyAuthor: true,
        });
        refetch();
      },
    }
  );

  // Cancel mutation
  const { mutate: cancelSchedule } = useMutate(
    async (id: string) => {
      await new Promise(resolve => setTimeout(resolve, 500));
      return { success: true };
    },
    {
      onSuccess: () => {
        notifications.success('Schedule cancelled');
        refetch();
      },
    }
  );

  // Retry mutation
  const { mutate: retrySchedule } = useMutate(
    async (id: string) => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { success: true };
    },
    {
      onSuccess: () => {
        notifications.success('Schedule retried');
        refetch();
      },
    }
  );

  const handleSubmit = () => {
    scheduleArticle(formData);
  };

  const handleEdit = (schedule: ScheduledArticle) => {
    setEditingSchedule(schedule);
    setFormData({
      articleId: schedule.articleId,
      scheduledDate: schedule.scheduledDate,
      scheduledTime: schedule.scheduledTime,
      action: schedule.action,
      timezone: 'UTC+7',
      notifyAuthor: true,
    });
    setShowAddModal(true);
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    const configs = {
      pending: { 
        bg: 'bg-yellow-100 dark:bg-yellow-900/30', 
        text: 'text-yellow-600 dark:text-yellow-400',
        icon: Clock 
      },
      published: { 
        bg: 'bg-green-100 dark:bg-green-900/30', 
        text: 'text-green-600 dark:text-green-400',
        icon: CheckCircle 
      },
      failed: { 
        bg: 'bg-red-100 dark:bg-red-900/30', 
        text: 'text-red-600 dark:text-red-400',
        icon: AlertCircle 
      },
      cancelled: { 
        bg: 'bg-gray-100 dark:bg-gray-800', 
        text: 'text-gray-600 dark:text-gray-400',
        icon: Pause 
      },
    };
    const config = configs[status as keyof typeof configs];
    const Icon = config.icon;
    
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        <Icon className="w-3 h-3" />
        {status}
      </span>
    );
  };

  // Get action badge
  const getActionBadge = (action: string) => {
    const configs = {
      publish: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-600 dark:text-blue-400' },
      unpublish: { bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-600 dark:text-orange-400' },
      archive: { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-600 dark:text-purple-400' },
    };
    const config = configs[action as keyof typeof configs];
    
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${config.bg} ${config.text}`}>
        {action}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Calendar className="w-6 h-6" />
            Content Scheduler
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Schedule articles for automatic publishing
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Schedule Article
        </button>
      </div>

      {/* Scheduled List */}
      <div className="space-y-3">
        {scheduled && scheduled.length > 0 ? (
          scheduled.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {/* Title & Status */}
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-medium">{item.title}</h3>
                    {getStatusBadge(item.status)}
                    {getActionBadge(item.action)}
                  </div>

                  {/* Schedule Info */}
                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {format(new Date(item.scheduledDate), 'MMM dd, yyyy')}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {item.scheduledTime}
                    </div>
                    <div className="flex items-center gap-1">
                      <span>By {item.author.name}</span>
                    </div>
                  </div>

                  {/* Error Message */}
                  {item.status === 'failed' && item.error && (
                    <div className="mt-2 p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
                      <p className="text-sm text-red-600 dark:text-red-400">
                        <AlertCircle className="w-4 h-4 inline mr-1" />
                        {item.error}
                      </p>
                    </div>
                  )}

                  {/* Time Until */}
                  {item.status === 'pending' && (
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Scheduled {formatDistanceToNow(new Date(`${item.scheduledDate}T${item.scheduledTime}`), { addSuffix: true })}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <a
                    href={`/articles/${item.articleId}`}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    title="View article"
                  >
                    <Eye className="w-4 h-4" />
                  </a>

                  {item.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleEdit(item)}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        title="Edit schedule"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => cancelSchedule(item.id)}
                        className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 rounded-lg transition-colors"
                        title="Cancel schedule"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  )}

                  {item.status === 'failed' && (
                    <button
                      onClick={() => retrySchedule(item.id)}
                      className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 rounded-lg transition-colors"
                      title="Retry"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            <Calendar className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
            <p className="text-gray-600 dark:text-gray-400">No scheduled articles</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="mt-4 text-blue-600 dark:text-blue-400 hover:underline"
            >
              Schedule your first article
            </button>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6">
            <h3 className="text-xl font-bold mb-4">
              {editingSchedule ? 'Edit Schedule' : 'Schedule Article'}
            </h3>

            <div className="space-y-4">
              {/* Article Selection (if not pre-selected) */}
              {!articleId && (
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Select Article
                  </label>
                  <select
                    value={formData.articleId}
                    onChange={(e) => setFormData({ ...formData, articleId: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl"
                  >
                    <option value="">Choose an article...</option>
                    <option value="1">Introduction to React Hooks</option>
                    <option value="2">TypeScript Best Practices</option>
                    <option value="3">Database Design Patterns</option>
                  </select>
                </div>
              )}

              {articleId && (
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                  <p className="text-sm text-blue-600 dark:text-blue-400">
                    Article: <strong>{articleTitle}</strong>
                  </p>
                </div>
              )}

              {/* Date & Time */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Schedule Date
                  </label>
                  <input
                    type="date"
                    value={formData.scheduledDate}
                    onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Schedule Time
                  </label>
                  <input
                    type="time"
                    value={formData.scheduledTime}
                    onChange={(e) => setFormData({ ...formData, scheduledTime: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl"
                  />
                </div>
              </div>

              {/* Action */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Action
                </label>
                <select
                  value={formData.action}
                  onChange={(e) => setFormData({ ...formData, action: e.target.value as any })}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl"
                >
                  <option value="publish">Publish</option>
                  <option value="unpublish">Unpublish</option>
                  <option value="archive">Archive</option>
                </select>
              </div>

              {/* Timezone */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Timezone
                </label>
                <select
                  value={formData.timezone}
                  onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl"
                >
                  <option value="UTC+7">UTC+7 (Vietnam)</option>
                  <option value="UTC+0">UTC+0 (GMT)</option>
                  <option value="UTC-5">UTC-5 (EST)</option>
                  <option value="UTC-8">UTC-8 (PST)</option>
                </select>
              </div>

              {/* Notify Author */}
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.notifyAuthor}
                  onChange={(e) => setFormData({ ...formData, notifyAuthor: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <span className="text-sm">Notify author when action is executed</span>
              </label>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingSchedule(null);
                }}
                className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={isScheduling || !formData.scheduledDate || !formData.scheduledTime}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {isScheduling ? 'Scheduling...' : editingSchedule ? 'Update Schedule' : 'Schedule'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
