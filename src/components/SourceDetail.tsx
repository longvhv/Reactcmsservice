import React, { useState } from 'react';
import {
  ArrowLeft,
  Globe,
  Activity,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Play,
  Pause,
  RefreshCw,
  Settings,
  Archive,
  TrendingUp,
  Download,
  Search,
  Filter,
  BarChart3,
  Calendar,
  Eye
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface SourceDetailProps {
  sourceId: string;
  campaignId: string;
  onNavigate: (page: any) => void;
}

interface CrawlerArticle {
  id: string;
  title: string;
  url: string;
  collectedAt: string;
  status: 'pending' | 'processed' | 'published' | 'rejected';
  author?: string;
  publishedDate?: string;
  excerpt?: string;
}

const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
  console.log(`[${type.toUpperCase()}] ${message}`);
  alert(`${type.toUpperCase()}: ${message}`);
};

export function SourceDetail({ sourceId, campaignId, onNavigate }: SourceDetailProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'articles'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isRunning, setIsRunning] = useState(false);

  // Mock source data
  const source = {
    id: sourceId,
    name: 'VnExpress Technology',
    url: 'https://vnexpress.net/rss/tin-moi-nhat.rss',
    type: 'rss',
    status: 'active',
    lastRun: '5 minutes ago',
    nextRun: 'in 10 minutes',
    articlesCollected: 547,
    successRate: 98.5,
    errorRate: 1.5,
    schedule: 'Every 15 minutes',
    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
  };

  // Mock articles
  const articles: CrawlerArticle[] = [
    {
      id: '1',
      title: 'AI Revolution: How Machine Learning is Transforming Industries',
      url: 'https://example.com/article-1',
      collectedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      status: 'published',
      author: 'John Doe',
      publishedDate: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      excerpt: 'Artificial Intelligence and Machine Learning are revolutionizing how businesses operate...',
    },
    {
      id: '2',
      title: 'The Future of Quantum Computing: What You Need to Know',
      url: 'https://example.com/article-2',
      collectedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      status: 'processed',
      author: 'Jane Smith',
      publishedDate: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
      excerpt: 'Quantum computing promises to solve problems that are currently impossible...',
    },
    {
      id: '3',
      title: 'Blockchain Technology Beyond Cryptocurrency',
      url: 'https://example.com/article-3',
      collectedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
      status: 'pending',
      author: 'Mike Johnson',
      publishedDate: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      excerpt: 'Blockchain has applications far beyond cryptocurrency, including supply chain...',
    },
    {
      id: '4',
      title: '5G Technology and Its Impact on IoT Devices',
      url: 'https://example.com/article-4',
      collectedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      status: 'published',
      author: 'Sarah Wilson',
      publishedDate: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      excerpt: 'The rollout of 5G networks is enabling a new generation of IoT applications...',
    },
    {
      id: '5',
      title: 'Cybersecurity Threats in 2024: What to Watch For',
      url: 'https://example.com/article-5',
      collectedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      status: 'rejected',
      author: 'Tom Brown',
      publishedDate: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      excerpt: 'As technology evolves, so do the threats. Here are the top cybersecurity...',
    },
  ];

  // Mock chart data
  const chartData = [
    { time: '00:00', collected: 12, success: 11, failed: 1 },
    { time: '04:00', collected: 15, success: 15, failed: 0 },
    { time: '08:00', collected: 23, success: 22, failed: 1 },
    { time: '12:00', collected: 28, success: 27, failed: 1 },
    { time: '16:00', collected: 19, success: 19, failed: 0 },
    { time: '20:00', collected: 16, success: 15, failed: 1 },
  ];

  const statusDistribution = [
    { name: 'Published', value: 267, color: '#10b981' },
    { name: 'Processed', value: 156, color: '#8b5cf6' },
    { name: 'Pending', value: 89, color: '#3b82f6' },
    { name: 'Rejected', value: 35, color: '#ef4444' },
  ];

  const handleStartCrawl = async () => {
    setIsRunning(true);
    showNotification('Starting crawler...', 'info');
    
    // Simulate crawl
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsRunning(false);
    showNotification('Crawler completed successfully!', 'success');
  };

  const handleStopCrawl = () => {
    showNotification('Crawler stopped', 'info');
  };

  const formatDateTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString('vi-VN', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'active':
        return { color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-900/30', icon: Activity, label: 'Active' };
      case 'paused':
        return { color: 'text-yellow-600', bg: 'bg-yellow-100 dark:bg-yellow-900/30', icon: Pause, label: 'Paused' };
      case 'error':
        return { color: 'text-red-600', bg: 'bg-red-100 dark:bg-red-900/30', icon: XCircle, label: 'Error' };
      case 'pending':
        return { color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/30', label: 'Pending' };
      case 'processed':
        return { color: 'text-purple-600', bg: 'bg-purple-100 dark:bg-purple-900/30', label: 'Processed' };
      case 'published':
        return { color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-900/30', label: 'Published' };
      case 'rejected':
        return { color: 'text-red-600', bg: 'bg-red-100 dark:bg-red-900/30', label: 'Rejected' };
      default:
        return { color: 'text-gray-600', bg: 'bg-gray-100 dark:bg-gray-900/30', label: status };
    }
  };

  const statusConfig = getStatusConfig(source.status);
  const StatusIcon = statusConfig.icon;

  const filteredArticles = articles.filter(article => {
    if (searchTerm && !article.title.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    if (filterStatus !== 'all' && article.status !== filterStatus) {
      return false;
    }
    return true;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <button
            onClick={() => onNavigate({ page: 'campaign-detail', campaignId })}
            className="p-2 hover:bg-secondary rounded-lg transition-colors mt-1"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold">{source.name}</h1>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.color} flex items-center gap-1`}>
                <StatusIcon className="w-3 h-3" />
                {statusConfig.label}
              </span>
              <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-xs rounded-full font-medium">
                {source.type.toUpperCase()}
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Globe className="w-4 h-4" />
                <span className="truncate max-w-md">{source.url}</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{source.schedule}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {source.status === 'active' ? (
            <>
              <button
                onClick={handleStartCrawl}
                disabled={isRunning}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {isRunning ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    Running...
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5" />
                    Start Crawl
                  </>
                )}
              </button>
              
              <button
                onClick={handleStopCrawl}
                className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-xl hover:bg-yellow-700 transition-colors"
              >
                <Pause className="w-5 h-5" />
                Pause
              </button>
            </>
          ) : (
            <button
              onClick={handleStartCrawl}
              disabled={isRunning}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              <Play className="w-5 h-5" />
              Resume
            </button>
          )}

          <button
            onClick={() => showNotification('Settings coming soon!', 'info')}
            className="p-2 hover:bg-secondary rounded-lg transition-colors"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-card rounded-xl p-4 border border-border">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-muted-foreground">Last Run</p>
            <Clock className="w-4 h-4 text-blue-600" />
          </div>
          <p className="font-semibold">{source.lastRun}</p>
        </div>

        <div className="bg-card rounded-xl p-4 border border-border">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-muted-foreground">Next Run</p>
            <Calendar className="w-4 h-4 text-purple-600" />
          </div>
          <p className="font-semibold">{source.nextRun}</p>
        </div>

        <div className="bg-card rounded-xl p-4 border border-border">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-muted-foreground">Articles</p>
            <Archive className="w-4 h-4 text-green-600" />
          </div>
          <p className="font-semibold">{source.articlesCollected}</p>
        </div>

        <div className="bg-card rounded-xl p-4 border border-border">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-muted-foreground">Success Rate</p>
            <CheckCircle className="w-4 h-4 text-green-600" />
          </div>
          <p className="font-semibold">{source.successRate}%</p>
        </div>

        <div className="bg-card rounded-xl p-4 border border-border">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-muted-foreground">Error Rate</p>
            <XCircle className="w-4 h-4 text-red-600" />
          </div>
          <p className="font-semibold">{source.errorRate}%</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-card rounded-xl border border-border">
        <div className="border-b border-border">
          <div className="flex gap-1 p-2">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'overview'
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-600'
                  : 'hover:bg-secondary'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <BarChart3 className="w-4 h-4" />
                <span className="font-medium">Overview</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('articles')}
              className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'articles'
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-600'
                  : 'hover:bg-secondary'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Archive className="w-4 h-4" />
                <span className="font-medium">Articles ({articles.length})</span>
              </div>
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Collection Activity Chart */}
              <div>
                <h3 className="font-semibold mb-4">Collection Activity (Last 24 Hours)</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="colorCollected" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Area 
                        type="monotone" 
                        dataKey="collected" 
                        stroke="#10b981" 
                        fillOpacity={1} 
                        fill="url(#colorCollected)"
                        name="Articles Collected"
                      />
                      <Line type="monotone" dataKey="success" stroke="#3b82f6" name="Successful" />
                      <Line type="monotone" dataKey="failed" stroke="#ef4444" name="Failed" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Status Distribution */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-4">Article Status Distribution</h3>
                  <div className="space-y-3">
                    {statusDistribution.map(item => (
                      <div key={item.name}>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span>{item.name}</span>
                          <span className="font-semibold">{item.value}</span>
                        </div>
                        <div className="w-full bg-secondary rounded-full h-2">
                          <div
                            className="h-2 rounded-full transition-all"
                            style={{ 
                              width: `${(item.value / source.articlesCollected) * 100}%`,
                              backgroundColor: item.color
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Performance Stats */}
                <div>
                  <h3 className="font-semibold mb-4">Performance Metrics</h3>
                  <div className="space-y-4">
                    <div className="bg-secondary rounded-xl p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                          <TrendingUp className="w-5 h-5 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-muted-foreground">Avg Articles/Day</p>
                          <p className="text-xl font-bold">18.2</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-secondary rounded-xl p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                          <Clock className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-muted-foreground">Avg Collection Time</p>
                          <p className="text-xl font-bold">2.3s</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-secondary rounded-xl p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                          <Activity className="w-5 h-5 text-purple-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-muted-foreground">Uptime</p>
                          <p className="text-xl font-bold">99.7%</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div>
                <h3 className="font-semibold mb-4">Recent Activity</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 p-3 bg-secondary rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Crawl completed successfully</p>
                      <p className="text-xs text-muted-foreground">15 articles collected • 5 minutes ago</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-secondary rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Crawl completed successfully</p>
                      <p className="text-xs text-muted-foreground">12 articles collected • 20 minutes ago</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-secondary rounded-lg">
                    <AlertCircle className="w-5 h-5 text-yellow-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Partial success</p>
                      <p className="text-xs text-muted-foreground">10 collected, 2 failed • 35 minutes ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Articles Tab */}
          {activeTab === 'articles' && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex-1 max-w-md">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="search"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search articles..."
                      className="w-full pl-10 pr-4 py-2 bg-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20"
                    />
                  </div>
                </div>

                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 bg-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="processed">Processed</option>
                  <option value="published">Published</option>
                  <option value="rejected">Rejected</option>
                </select>

                <button
                  onClick={() => showNotification('Export feature coming soon!', 'info')}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
                >
                  <Download className="w-5 h-5" />
                  Export
                </button>
              </div>

              <div className="space-y-3">
                {filteredArticles.length === 0 ? (
                  <div className="text-center py-12">
                    <Archive className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No articles found</p>
                  </div>
                ) : (
                  filteredArticles.map(article => {
                    const articleStatusConfig = getStatusConfig(article.status);
                    return (
                      <div key={article.id} className="bg-secondary rounded-xl p-4 hover:shadow-md transition-all">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h4 className="font-semibold mb-1">{article.title}</h4>
                            <p className="text-sm text-muted-foreground mb-2">{article.excerpt}</p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span>{article.author}</span>
                              <span>•</span>
                              <span>Collected: {formatDateTime(article.collectedAt)}</span>
                              {article.publishedDate && (
                                <>
                                  <span>•</span>
                                  <span>Published: {formatDateTime(article.publishedDate)}</span>
                                </>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground mt-2 truncate">{article.url}</p>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className={`px-3 py-1 rounded-full text-xs ${articleStatusConfig.bg} ${articleStatusConfig.color}`}>
                              {articleStatusConfig.label}
                            </span>
                            <button
                              onClick={() => window.open(article.url, '_blank')}
                              className="p-2 hover:bg-card rounded-lg transition-colors"
                              title="View Article"
                            >
                              <Eye className="w-4 h-4 text-blue-600" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
