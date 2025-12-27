import React, { useState } from 'react';
import { 
  Activity,
  Clock,
  User,
  FileText,
  Edit,
  Trash2,
  Plus,
  Eye,
  Download,
  Upload,
  Settings,
  LogIn,
  LogOut,
  UserPlus,
  Star,
  MessageSquare,
  Share2,
  Lock,
  Unlock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Calendar,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  ExternalLink,
  MoreVertical,
  TrendingUp
} from 'lucide-react';

interface ActivityEvent {
  id: string;
  action: 'create' | 'update' | 'delete' | 'publish' | 'unpublish' | 'login' | 'logout' | 'view' | 'download' | 'upload' | 'share' | 'comment' | 'like' | 'archive' | 'restore';
  entityType: 'article' | 'category' | 'user' | 'media' | 'comment' | 'setting' | 'role' | 'permission';
  entityId: string;
  entityName: string;
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  metadata?: {
    oldValue?: any;
    newValue?: any;
    changes?: string[];
    ip?: string;
    userAgent?: string;
    duration?: number;
  };
  timestamp: string;
  severity: 'info' | 'warning' | 'error' | 'success';
}

interface ActivityFilter {
  action?: string;
  entityType?: string;
  userId?: string;
  severity?: string;
  dateFrom?: string;
  dateTo?: string;
}

const ACTION_CONFIG = {
  create: { icon: Plus, color: '#10B981', label: 'Created' },
  update: { icon: Edit, color: '#3B82F6', label: 'Updated' },
  delete: { icon: Trash2, color: '#EF4444', label: 'Deleted' },
  publish: { icon: CheckCircle, color: '#10B981', label: 'Published' },
  unpublish: { icon: XCircle, color: '#F59E0B', label: 'Unpublished' },
  login: { icon: LogIn, color: '#8B5CF6', label: 'Logged In' },
  logout: { icon: LogOut, color: '#6B7280', label: 'Logged Out' },
  view: { icon: Eye, color: '#06B6D4', label: 'Viewed' },
  download: { icon: Download, color: '#EC4899', label: 'Downloaded' },
  upload: { icon: Upload, color: '#14B8A6', label: 'Uploaded' },
  share: { icon: Share2, color: '#A855F7', label: 'Shared' },
  comment: { icon: MessageSquare, color: '#F59E0B', label: 'Commented' },
  like: { icon: Star, color: '#FBBF24', label: 'Liked' },
  archive: { icon: Lock, color: '#6B7280', label: 'Archived' },
  restore: { icon: Unlock, color: '#10B981', label: 'Restored' },
};

const ENTITY_CONFIG = {
  article: { icon: FileText, color: '#3B82F6', label: 'Article' },
  category: { icon: FileText, color: '#8B5CF6', label: 'Category' },
  user: { icon: User, color: '#10B981', label: 'User' },
  media: { icon: Upload, color: '#EC4899', label: 'Media' },
  comment: { icon: MessageSquare, color: '#F59E0B', label: 'Comment' },
  setting: { icon: Settings, color: '#6B7280', label: 'Setting' },
  role: { icon: Lock, color: '#8B5CF6', label: 'Role' },
  permission: { icon: Lock, color: '#EF4444', label: 'Permission' },
};

// Helper function to format relative time
const formatRelativeTime = (timestamp: string): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks}w ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
};

// Helper function to format full date
const formatFullDate = (timestamp: string): string => {
  const date = new Date(timestamp);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export function ActivityTimeline() {
  const [filter, setFilter] = useState<ActivityFilter>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [expandedEvents, setExpandedEvents] = useState<Set<string>>(new Set());
  const [selectedEvent, setSelectedEvent] = useState<ActivityEvent | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [isLoading, setIsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Mock data
  const mockEvents: ActivityEvent[] = [
    {
      id: '1',
      action: 'create',
      entityType: 'article',
      entityId: 'a1',
      entityName: 'Introduction to React Hooks',
      user: {
        id: 'u1',
        name: 'John Doe',
        email: 'john@example.com',
        avatar: 'https://i.pravatar.cc/150?img=1',
      },
      metadata: {
        changes: ['title', 'content', 'category'],
      },
      timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      severity: 'success',
    },
    {
      id: '2',
      action: 'update',
      entityType: 'article',
      entityId: 'a2',
      entityName: 'Understanding TypeScript',
      user: {
        id: 'u2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        avatar: 'https://i.pravatar.cc/150?img=2',
      },
      metadata: {
        changes: ['status', 'publishedAt'],
        oldValue: { status: 'draft' },
        newValue: { status: 'published' },
      },
      timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      severity: 'info',
    },
    {
      id: '3',
      action: 'delete',
      entityType: 'comment',
      entityId: 'c1',
      entityName: 'Comment on "React Best Practices"',
      user: {
        id: 'u3',
        name: 'Mike Johnson',
        email: 'mike@example.com',
        avatar: 'https://i.pravatar.cc/150?img=3',
      },
      metadata: {
        oldValue: { content: 'This is spam content...' },
      },
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      severity: 'warning',
    },
    {
      id: '4',
      action: 'publish',
      entityType: 'article',
      entityId: 'a3',
      entityName: 'Advanced CSS Techniques',
      user: {
        id: 'u1',
        name: 'John Doe',
        email: 'john@example.com',
        avatar: 'https://i.pravatar.cc/150?img=1',
      },
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      severity: 'success',
    },
    {
      id: '5',
      action: 'login',
      entityType: 'user',
      entityId: 'u4',
      entityName: 'Admin Login',
      user: {
        id: 'u4',
        name: 'Sarah Wilson',
        email: 'sarah@example.com',
        avatar: 'https://i.pravatar.cc/150?img=4',
      },
      metadata: {
        ip: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      },
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      severity: 'info',
    },
    {
      id: '6',
      action: 'upload',
      entityType: 'media',
      entityId: 'm1',
      entityName: 'hero-banner.jpg',
      user: {
        id: 'u2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        avatar: 'https://i.pravatar.cc/150?img=2',
      },
      metadata: {
        newValue: { size: '2.4 MB', type: 'image/jpeg' },
      },
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
      severity: 'success',
    },
    {
      id: '7',
      action: 'update',
      entityType: 'user',
      entityId: 'u5',
      entityName: 'Bob Anderson',
      user: {
        id: 'u1',
        name: 'John Doe',
        email: 'john@example.com',
        avatar: 'https://i.pravatar.cc/150?img=1',
      },
      metadata: {
        changes: ['role', 'permissions'],
        oldValue: { role: 'author' },
        newValue: { role: 'editor' },
      },
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      severity: 'warning',
    },
    {
      id: '8',
      action: 'create',
      entityType: 'category',
      entityId: 'cat1',
      entityName: 'Technology News',
      user: {
        id: 'u3',
        name: 'Mike Johnson',
        email: 'mike@example.com',
        avatar: 'https://i.pravatar.cc/150?img=3',
      },
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      severity: 'success',
    },
    {
      id: '9',
      action: 'comment',
      entityType: 'article',
      entityId: 'a4',
      entityName: 'React Performance Tips',
      user: {
        id: 'u4',
        name: 'Sarah Wilson',
        email: 'sarah@example.com',
        avatar: 'https://i.pravatar.cc/150?img=4',
      },
      metadata: {
        newValue: { content: 'Great article! Very helpful.' },
      },
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
      severity: 'info',
    },
    {
      id: '10',
      action: 'archive',
      entityType: 'article',
      entityId: 'a5',
      entityName: 'Old Marketing Strategy',
      user: {
        id: 'u2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        avatar: 'https://i.pravatar.cc/150?img=2',
      },
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      severity: 'warning',
    },
  ];

  const activities = {
    events: mockEvents,
    total: 247,
    stats: {
      today: 23,
      thisWeek: 156,
      thisMonth: 247,
      byAction: {
        create: 45,
        update: 89,
        delete: 12,
        publish: 34,
        view: 156,
      },
    },
  };

  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expandedEvents);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedEvents(newExpanded);
  };

  const getActionConfig = (action: string) => {
    return ACTION_CONFIG[action as keyof typeof ACTION_CONFIG] || ACTION_CONFIG.update;
  };

  const getEntityConfig = (entityType: string) => {
    return ENTITY_CONFIG[entityType as keyof typeof ENTITY_CONFIG] || ENTITY_CONFIG.article;
  };

  const getSeverityColor = (severity: string) => {
    const colors = {
      info: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
      warning: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400',
      error: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
      success: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
    };
    return colors[severity as keyof typeof colors] || colors.info;
  };

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      alert('Activity log exported successfully!');
    }, 2000);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Activity Timeline
          </h1>
          <p className="text-muted-foreground mt-1">
            Complete history of all system activities
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setIsLoading(true)}
            className="flex items-center gap-2 px-4 py-2 bg-secondary hover:bg-secondary/80 rounded-xl transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
            Refresh
          </button>
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            {isExporting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="w-5 h-5" />
                Export Log
              </>
            )}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Today', value: activities?.stats.today || 0, icon: '📅', trend: '+12%' },
          { label: 'This Week', value: activities?.stats.thisWeek || 0, icon: '📊', trend: '+8%' },
          { label: 'This Month', value: activities?.stats.thisMonth || 0, icon: '📈', trend: '+15%' },
          { label: 'Total Events', value: activities?.total || 0, icon: '🎯', trend: 'All time' },
        ].map((stat) => (
          <div key={stat.label} className="bg-card rounded-xl p-6 border border-border">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <span className="text-2xl">{stat.icon}</span>
            </div>
            <div className="flex items-end justify-between">
              <p className="text-3xl font-bold">{stat.value}</p>
              <span className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                {stat.trend}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Search & Filters */}
      <div className="bg-card rounded-xl border border-border p-4">
        <div className="flex flex-wrap items-center gap-4">
          {/* Search */}
          <div className="flex-1 min-w-[250px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search activities..."
                className="w-full pl-10 pr-4 py-2 bg-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-colors ${
              showFilters
                ? 'bg-blue-600 text-white'
                : 'bg-secondary hover:bg-secondary/80'
            }`}
          >
            <Filter className="w-5 h-5" />
            Filters
            {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-border">
            <div>
              <label className="block text-sm font-medium mb-2">Action</label>
              <select
                value={filter.action || ''}
                onChange={(e) => setFilter({ ...filter, action: e.target.value })}
                className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="">All Actions</option>
                {Object.entries(ACTION_CONFIG).map(([key, config]) => (
                  <option key={key} value={key}>{config.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Entity Type</label>
              <select
                value={filter.entityType || ''}
                onChange={(e) => setFilter({ ...filter, entityType: e.target.value })}
                className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="">All Types</option>
                {Object.entries(ENTITY_CONFIG).map(([key, config]) => (
                  <option key={key} value={key}>{config.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Severity</label>
              <select
                value={filter.severity || ''}
                onChange={(e) => setFilter({ ...filter, severity: e.target.value })}
                className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="">All Severities</option>
                <option value="info">Info</option>
                <option value="success">Success</option>
                <option value="warning">Warning</option>
                <option value="error">Error</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => setFilter({})}
                className="w-full px-4 py-2 bg-secondary hover:bg-secondary/80 rounded-lg text-sm transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Timeline */}
      <div className="bg-card rounded-xl border border-border p-6">
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-[34px] top-0 bottom-0 w-0.5 bg-border" />

          {/* Events */}
          <div className="space-y-6">
            {activities?.events.map((event) => {
              const actionConfig = getActionConfig(event.action);
              const entityConfig = getEntityConfig(event.entityType);
              const ActionIcon = actionConfig.icon;
              const EntityIcon = entityConfig.icon;
              const isExpanded = expandedEvents.has(event.id);

              return (
                <div key={event.id} className="relative pl-16 group">
                  {/* Timeline Dot */}
                  <div
                    className="absolute left-[18px] w-8 h-8 rounded-full flex items-center justify-center shadow-lg z-10"
                    style={{ backgroundColor: actionConfig.color }}
                  >
                    <ActionIcon className="w-4 h-4 text-white" />
                  </div>

                  {/* Event Card */}
                  <div className="bg-secondary rounded-xl p-4 hover:shadow-md transition-all">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span 
                            className="px-2 py-0.5 rounded text-xs font-semibold text-white"
                            style={{ backgroundColor: actionConfig.color }}
                          >
                            {actionConfig.label}
                          </span>
                          <span className="px-2 py-0.5 bg-secondary rounded text-xs font-medium">
                            <EntityIcon className="w-3 h-3 inline mr-1" />
                            {entityConfig.label}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${getSeverityColor(event.severity)}`}>
                            {event.severity}
                          </span>
                        </div>

                        <h4 className="font-semibold text-lg mb-1">{event.entityName}</h4>
                        
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            {event.user.avatar ? (
                              <img 
                                src={event.user.avatar} 
                                alt={event.user.name}
                                className="w-5 h-5 rounded-full"
                              />
                            ) : (
                              <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs">
                                {event.user.name.charAt(0)}
                              </div>
                            )}
                            <span>{event.user.name}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{formatRelativeTime(event.timestamp)}</span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => toggleExpand(event.id)}
                        className="p-2 hover:bg-secondary rounded-lg transition-colors"
                      >
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5" />
                        ) : (
                          <ChevronDown className="w-5 h-5" />
                        )}
                      </button>
                    </div>

                    {/* Expanded Details */}
                    {isExpanded && event.metadata && (
                      <div className="mt-4 pt-4 border-t border-border space-y-3">
                        {/* Changes */}
                        {event.metadata.changes && (
                          <div>
                            <p className="text-sm font-medium mb-2">Changes:</p>
                            <div className="flex flex-wrap gap-2">
                              {event.metadata.changes.map((change, i) => (
                                <span 
                                  key={i}
                                  className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded text-xs font-medium"
                                >
                                  {change}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Old/New Values */}
                        {(event.metadata.oldValue || event.metadata.newValue) && (
                          <div className="grid grid-cols-2 gap-4">
                            {event.metadata.oldValue && (
                              <div>
                                <p className="text-sm font-medium mb-2 text-red-600 dark:text-red-400">Old Value:</p>
                                <pre className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg text-xs overflow-x-auto">
                                  {JSON.stringify(event.metadata.oldValue, null, 2)}
                                </pre>
                              </div>
                            )}
                            {event.metadata.newValue && (
                              <div>
                                <p className="text-sm font-medium mb-2 text-green-600 dark:text-green-400">New Value:</p>
                                <pre className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg text-xs overflow-x-auto">
                                  {JSON.stringify(event.metadata.newValue, null, 2)}
                                </pre>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Additional Info */}
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Event ID:</span>
                            <span className="ml-2 font-mono">{event.id}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Entity ID:</span>
                            <span className="ml-2 font-mono">{event.entityId}</span>
                          </div>
                          {event.metadata.ip && (
                            <div>
                              <span className="text-muted-foreground">IP Address:</span>
                              <span className="ml-2 font-mono">{event.metadata.ip}</span>
                            </div>
                          )}
                          <div>
                            <span className="text-muted-foreground">Timestamp:</span>
                            <span className="ml-2">{formatFullDate(event.timestamp)}</span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                          <button
                            onClick={() => setSelectedEvent(event)}
                            className="px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg text-sm hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                          >
                            <ExternalLink className="w-4 h-4 inline mr-1" />
                            View Details
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6 pt-6 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Showing {activities?.events.length || 0} of {activities?.total || 0} events
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-secondary hover:bg-secondary/80 rounded-lg disabled:opacity-50 transition-colors"
            >
              Previous
            </button>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page * pageSize >= (activities?.total || 0)}
              className="px-4 py-2 bg-secondary hover:bg-secondary/80 rounded-lg disabled:opacity-50 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Event Detail Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-3xl bg-card rounded-2xl shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold">Event Details</h3>
                <p className="text-sm text-muted-foreground">{selectedEvent.id}</p>
              </div>
              <button
                onClick={() => setSelectedEvent(null)}
                className="p-2 hover:bg-secondary rounded-lg transition-colors"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Full event details here */}
              <pre className="p-4 bg-secondary rounded-xl overflow-x-auto text-sm">
                {JSON.stringify(selectedEvent, null, 2)}
              </pre>
            </div>

            <button
              onClick={() => setSelectedEvent(null)}
              className="w-full mt-4 px-4 py-2 bg-secondary rounded-xl hover:bg-secondary/80 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
