import React, { useState } from 'react';
import { useFetch } from '@longvhv/query';
import { 
  Activity, 
  FileText, 
  Image, 
  Users, 
  MessageSquare,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  Upload,
  Download,
  Settings,
  Bell,
  Clock,
  Filter
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ActivityItem {
  id: string;
  type: 'article' | 'media' | 'user' | 'comment' | 'system';
  action: 'created' | 'updated' | 'deleted' | 'published' | 'unpublished' | 'approved' | 'rejected' | 'uploaded' | 'downloaded';
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
  target?: {
    id: string;
    type: string;
    title: string;
    url?: string;
  };
  metadata?: Record<string, any>;
  createdAt: string;
}

interface ActivityFeedProps {
  limit?: number;
  userId?: string; // Filter by specific user
  type?: string; // Filter by type
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({ 
  limit = 50, 
  userId,
  type 
}) => {
  const [filter, setFilter] = useState<'all' | 'article' | 'media' | 'user' | 'system'>('all');

  // Fetch activity
  const { data: activities, isLoading } = useFetch<ActivityItem[]>(
    ['activity', { limit, userId, type: filter !== 'all' ? filter : undefined }],
    async () => {
      // Mock data
      return [
        {
          id: '1',
          type: 'article',
          action: 'published',
          user: { id: '1', name: 'John Doe' },
          target: {
            id: '1',
            type: 'article',
            title: 'Introduction to React Hooks',
            url: '/articles/1',
          },
          createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        },
        {
          id: '2',
          type: 'comment',
          action: 'created',
          user: { id: '2', name: 'Jane Smith' },
          target: {
            id: '2',
            type: 'article',
            title: 'TypeScript Best Practices',
            url: '/articles/2',
          },
          metadata: { comment: 'Great article! Very helpful.' },
          createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        },
        {
          id: '3',
          type: 'media',
          action: 'uploaded',
          user: { id: '3', name: 'Mike Johnson' },
          target: {
            id: '3',
            type: 'image',
            title: 'hero-banner.jpg',
            url: '/media/3',
          },
          metadata: { size: '2.4 MB', dimensions: '1920x1080' },
          createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        },
        {
          id: '4',
          type: 'article',
          action: 'updated',
          user: { id: '1', name: 'John Doe' },
          target: {
            id: '4',
            type: 'article',
            title: 'Database Design Patterns',
            url: '/articles/4',
          },
          metadata: { changes: ['title', 'content'] },
          createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
        },
        {
          id: '5',
          type: 'user',
          action: 'created',
          user: { id: '4', name: 'Sarah Williams' },
          target: {
            id: '5',
            type: 'user',
            title: 'New user registered',
          },
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: '6',
          type: 'article',
          action: 'approved',
          user: { id: '2', name: 'Jane Smith' },
          target: {
            id: '6',
            type: 'article',
            title: 'Modern CSS Techniques',
            url: '/articles/6',
          },
          createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: '7',
          type: 'media',
          action: 'deleted',
          user: { id: '3', name: 'Mike Johnson' },
          target: {
            id: '7',
            type: 'image',
            title: 'old-banner.jpg',
          },
          createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: '8',
          type: 'system',
          action: 'updated',
          user: { id: '1', name: 'John Doe' },
          target: {
            id: '8',
            type: 'settings',
            title: 'System settings updated',
          },
          metadata: { category: 'appearance' },
          createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        },
      ];
    }
  );

  // Get icon for activity type
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'article':
        return <FileText className="w-4 h-4" />;
      case 'media':
        return <Image className="w-4 h-4" />;
      case 'user':
        return <Users className="w-4 h-4" />;
      case 'comment':
        return <MessageSquare className="w-4 h-4" />;
      case 'system':
        return <Settings className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  // Get icon for action
  const getActionIcon = (action: string) => {
    switch (action) {
      case 'created':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'updated':
        return <Edit className="w-4 h-4 text-blue-500" />;
      case 'deleted':
        return <Trash2 className="w-4 h-4 text-red-500" />;
      case 'published':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'unpublished':
        return <XCircle className="w-4 h-4 text-gray-500" />;
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'uploaded':
        return <Upload className="w-4 h-4 text-blue-500" />;
      case 'downloaded':
        return <Download className="w-4 h-4 text-purple-500" />;
      default:
        return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  // Get action color
  const getActionColor = (action: string) => {
    switch (action) {
      case 'created':
      case 'published':
      case 'approved':
        return 'text-green-600 dark:text-green-400';
      case 'updated':
      case 'uploaded':
        return 'text-blue-600 dark:text-blue-400';
      case 'deleted':
      case 'rejected':
        return 'text-red-600 dark:text-red-400';
      case 'unpublished':
        return 'text-gray-600 dark:text-gray-400';
      default:
        return 'text-gray-700 dark:text-gray-300';
    }
  };

  // Generate activity description
  const getActivityDescription = (activity: ActivityItem) => {
    const action = activity.action.charAt(0).toUpperCase() + activity.action.slice(1);
    const targetType = activity.target?.type || activity.type;
    
    return (
      <span>
        <span className={`font-medium ${getActionColor(activity.action)}`}>
          {action}
        </span>
        {' '}
        <span className="text-gray-600 dark:text-gray-400">{targetType}</span>
        {activity.target?.title && (
          <>
            {' "'}
            {activity.target.url ? (
              <a 
                href={activity.target.url}
                className="font-medium text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                {activity.target.title}
              </a>
            ) : (
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {activity.target.title}
              </span>
            )}
            {'"'}
          </>
        )}
      </span>
    );
  };

  // Filter activities
  const filteredActivities = activities?.filter(a => 
    filter === 'all' || a.type === filter
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Activity className="w-6 h-6" />
          Recent Activity
        </h2>

        {/* Filters */}
        <div className="flex items-center gap-2">
          {['all', 'article', 'media', 'user', 'system'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors capitalize ${
                filter === f
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Activity List */}
      <div className="space-y-3">
        {filteredActivities && filteredActivities.length > 0 ? (
          filteredActivities.map((activity) => (
            <div
              key={activity.id}
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-3">
                {/* User Avatar */}
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-medium flex-shrink-0">
                  {activity.user.name.charAt(0)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {activity.user.name}
                        </span>
                        <div className="flex items-center gap-1">
                          {getActionIcon(activity.action)}
                        </div>
                      </div>
                      <div className="text-sm">
                        {getActivityDescription(activity)}
                      </div>
                    </div>

                    {/* Type badge */}
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs ${
                      activity.type === 'article' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' :
                      activity.type === 'media' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' :
                      activity.type === 'user' ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' :
                      activity.type === 'comment' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400' :
                      'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                    }`}>
                      {getTypeIcon(activity.type)}
                      <span className="capitalize">{activity.type}</span>
                    </div>
                  </div>

                  {/* Metadata */}
                  {activity.metadata && (
                    <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-900 rounded-lg text-xs">
                      {activity.metadata.comment && (
                        <p className="text-gray-700 dark:text-gray-300 italic">
                          "{activity.metadata.comment}"
                        </p>
                      )}
                      {activity.metadata.changes && (
                        <p className="text-gray-600 dark:text-gray-400">
                          Changed: {activity.metadata.changes.join(', ')}
                        </p>
                      )}
                      {activity.metadata.size && (
                        <p className="text-gray-600 dark:text-gray-400">
                          Size: {activity.metadata.size}
                          {activity.metadata.dimensions && ` • ${activity.metadata.dimensions}`}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Timestamp */}
                  <div className="flex items-center gap-2 mt-2 text-xs text-gray-500 dark:text-gray-400">
                    <Clock className="w-3 h-3" />
                    {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            <Activity className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
            <p className="text-gray-600 dark:text-gray-400">No activity found</p>
          </div>
        )}
      </div>

      {/* Load More */}
      {filteredActivities && filteredActivities.length >= limit && (
        <div className="text-center">
          <button className="px-6 py-2 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
            Load More
          </button>
        </div>
      )}
    </div>
  );
};
