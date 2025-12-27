import React, { useState } from 'react';
import { useFetch, useMutate } from '@longvhv/query';
import { useNotifications } from '@longvhv/notifications';
import { 
  Globe, 
  Plus, 
  Play, 
  Pause, 
  Trash2, 
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  FileText,
  Settings,
  Link as LinkIcon,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

interface CrawlerSource {
  id: string;
  name: string;
  url: string;
  status: 'active' | 'paused' | 'error';
  schedule: string;
  lastRun?: string;
  nextRun?: string;
  totalArticles: number;
  successRate: number;
  settings: {
    selector: string;
    titleSelector: string;
    contentSelector: string;
    imageSelector?: string;
    autoPublish: boolean;
    categoryId?: string;
  };
}

interface CrawlerLog {
  id: string;
  sourceId: string;
  sourceName: string;
  status: 'success' | 'error' | 'running';
  articlesFound: number;
  articlesImported: number;
  duration?: number;
  startedAt: string;
  completedAt?: string;
  error?: string;
}

const CrawlerManagementPage: React.FC = () => {
  const notifications = useNotifications();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [selectedSource, setSelectedSource] = useState<CrawlerSource | null>(null);

  // Fetch sources
  const { data: sources, isLoading: sourcesLoading, refetch: refetchSources } = useFetch<CrawlerSource[]>(
    'crawler-sources',
    async () => {
      // Mock data
      return [
        {
          id: '1',
          name: 'TechCrunch',
          url: 'https://techcrunch.com',
          status: 'active',
          schedule: 'Every 6 hours',
          lastRun: '2024-01-20T10:00:00Z',
          nextRun: '2024-01-20T16:00:00Z',
          totalArticles: 1248,
          successRate: 98.5,
          settings: {
            selector: 'article.post',
            titleSelector: 'h1.post-title',
            contentSelector: 'div.post-content',
            imageSelector: 'img.featured-image',
            autoPublish: false,
            categoryId: '1',
          },
        },
        {
          id: '2',
          name: 'The Verge',
          url: 'https://theverge.com',
          status: 'active',
          schedule: 'Every 12 hours',
          lastRun: '2024-01-20T06:00:00Z',
          nextRun: '2024-01-20T18:00:00Z',
          totalArticles: 856,
          successRate: 96.2,
          settings: {
            selector: 'article',
            titleSelector: 'h2.title',
            contentSelector: 'div.body',
            autoPublish: false,
          },
        },
        {
          id: '3',
          name: 'VnExpress',
          url: 'https://vnexpress.net',
          status: 'paused',
          schedule: 'Every 3 hours',
          lastRun: '2024-01-19T15:00:00Z',
          totalArticles: 2341,
          successRate: 94.8,
          settings: {
            selector: 'article.item-news',
            titleSelector: 'h3.title-news',
            contentSelector: 'article.fck_detail',
            autoPublish: true,
            categoryId: '2',
          },
        },
      ];
    }
  );

  // Fetch logs
  const { data: logs, isLoading: logsLoading } = useFetch<CrawlerLog[]>(
    'crawler-logs',
    async () => {
      // Mock data
      return [
        {
          id: '1',
          sourceId: '1',
          sourceName: 'TechCrunch',
          status: 'success',
          articlesFound: 15,
          articlesImported: 14,
          duration: 45,
          startedAt: '2024-01-20T10:00:00Z',
          completedAt: '2024-01-20T10:00:45Z',
        },
        {
          id: '2',
          sourceId: '2',
          sourceName: 'The Verge',
          status: 'success',
          articlesFound: 8,
          articlesImported: 8,
          duration: 32,
          startedAt: '2024-01-20T06:00:00Z',
          completedAt: '2024-01-20T06:00:32Z',
        },
        {
          id: '3',
          sourceId: '1',
          sourceName: 'TechCrunch',
          status: 'error',
          articlesFound: 0,
          articlesImported: 0,
          startedAt: '2024-01-19T16:00:00Z',
          completedAt: '2024-01-19T16:00:15Z',
          error: 'Connection timeout',
        },
      ];
    }
  );

  // Run crawler mutation
  const { mutate: runCrawler, isPending: isRunning } = useMutate(
    async (id: string) => {
      await new Promise(resolve => setTimeout(resolve, 2000));
      return { success: true };
    },
    {
      onSuccess: () => {
        notifications.success('Crawler started successfully');
        refetchSources();
      },
    }
  );

  // Pause crawler
  const { mutate: pauseCrawler } = useMutate(
    async (id: string) => {
      await new Promise(resolve => setTimeout(resolve, 500));
      return { success: true };
    },
    {
      onSuccess: () => {
        notifications.success('Crawler paused');
        refetchSources();
      },
    }
  );

  // Delete crawler
  const { mutate: deleteCrawler } = useMutate(
    async (id: string) => {
      await new Promise(resolve => setTimeout(resolve, 500));
      return { success: true };
    },
    {
      onSuccess: () => {
        notifications.success('Crawler deleted');
        refetchSources();
      },
    }
  );

  // Get status badge
  const getStatusBadge = (status: string) => {
    const configs = {
      active: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-600 dark:text-green-400', icon: CheckCircle },
      paused: { bg: 'bg-gray-100 dark:bg-gray-800', text: 'text-gray-600 dark:text-gray-400', icon: Pause },
      error: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-600 dark:text-red-400', icon: XCircle },
      running: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-600 dark:text-blue-400', icon: RefreshCw },
    };
    const config = configs[status as keyof typeof configs] || configs.paused;
    const Icon = config.icon;
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        <Icon className="w-3 h-3" />
        {status}
      </span>
    );
  };

  if (sourcesLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Crawler Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Automate content collection from external sources
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg"
        >
          <Plus className="w-5 h-5" />
          Add Source
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Active Sources', value: sources?.filter(s => s.status === 'active').length || 0, icon: '🟢' },
          { label: 'Total Articles', value: sources?.reduce((sum, s) => sum + s.totalArticles, 0) || 0, icon: '📄' },
          { label: 'Avg Success Rate', value: `${(sources?.reduce((sum, s) => sum + s.successRate, 0) / (sources?.length || 1)).toFixed(1)}%`, icon: '📈' },
          { label: 'Last 24h', value: logs?.filter(l => l.status === 'success').reduce((sum, l) => sum + l.articlesImported, 0) || 0, icon: '⚡' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{stat.label}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
              <div className="text-3xl">{stat.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Sources List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold">Crawler Sources</h2>
        </div>

        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {sources?.map((source) => (
            <div key={source.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold">{source.name}</h3>
                    {getStatusBadge(source.status)}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <LinkIcon className="w-4 h-4" />
                    <a href={source.url} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 dark:hover:text-blue-400">
                      {source.url}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {source.status === 'active' ? (
                    <button
                      onClick={() => pauseCrawler(source.id)}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      title="Pause"
                    >
                      <Pause className="w-5 h-5" />
                    </button>
                  ) : (
                    <button
                      onClick={() => runCrawler(source.id)}
                      disabled={isRunning}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
                      title="Run Now"
                    >
                      <Play className="w-5 h-5" />
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setSelectedSource(source);
                      setShowSettingsModal(true);
                    }}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    title="Settings"
                  >
                    <Settings className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => deleteCrawler(source.id)}
                    className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Schedule</div>
                  <div className="text-sm font-medium flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {source.schedule}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Total Articles</div>
                  <div className="text-sm font-medium flex items-center gap-1">
                    <FileText className="w-3 h-3" />
                    {source.totalArticles.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Success Rate</div>
                  <div className="text-sm font-medium flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    {source.successRate}%
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Next Run</div>
                  <div className="text-sm font-medium flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {source.nextRun ? new Date(source.nextRun).toLocaleTimeString() : '-'}
                  </div>
                </div>
              </div>

              {source.lastRun && (
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Last run: {new Date(source.lastRun).toLocaleString()}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Recent Logs */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold">Recent Activity</h2>
        </div>

        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {logs?.map((log) => (
            <div key={log.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-medium">{log.sourceName}</span>
                    {getStatusBadge(log.status)}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {log.status === 'success' ? (
                      <span>
                        Found {log.articlesFound} articles, imported {log.articlesImported} ({log.duration}s)
                      </span>
                    ) : log.status === 'error' ? (
                      <span className="text-red-600 dark:text-red-400 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {log.error}
                      </span>
                    ) : (
                      <span>Running...</span>
                    )}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {new Date(log.startedAt).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Source Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6">
            <h3 className="text-xl font-bold mb-4">Add Crawler Source</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Source Name</label>
                <input
                  type="text"
                  placeholder="e.g., TechCrunch"
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">URL</label>
                <input
                  type="url"
                  placeholder="https://example.com"
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Schedule</label>
                <select className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20">
                  <option>Every 3 hours</option>
                  <option>Every 6 hours</option>
                  <option>Every 12 hours</option>
                  <option>Daily</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Article Selector</label>
                  <input
                    type="text"
                    placeholder="article.post"
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Title Selector</label>
                  <input
                    type="text"
                    placeholder="h1.title"
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors">
                Add Source
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CrawlerManagementPage;
