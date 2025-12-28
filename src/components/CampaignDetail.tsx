import React, { useState } from 'react';
import {
  ArrowLeft,
  Calendar,
  Target,
  Globe,
  Archive,
  TrendingUp,
  BarChart3,
  Play,
  Pause,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Eye,
  Activity,
  Clock,
  CheckCircle,
  Download,
  RefreshCw
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useLanguage } from '../contexts/LanguageContext';

interface CampaignDetailProps {
  campaignId: string;
  onNavigate: (page: any) => void;
}

interface Source {
  id: string;
  name: string;
  url: string;
  type: 'rss' | 'html' | 'api';
  status: 'active' | 'paused' | 'error';
  lastRun: string;
  articlesCollected: number;
  successRate: number;
  schedule: string;
}

interface CrawlerArticle {
  id: string;
  title: string;
  url: string;
  sourceId: string;
  sourceName: string;
  collectedAt: string;
  status: 'pending' | 'processed' | 'published' | 'rejected';
  author?: string;
  publishedDate?: string;
}

const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
  console.log(`[${type.toUpperCase()}] ${message}`);
  alert(`${type.toUpperCase()}: ${message}`);
};

export function CampaignDetail({ campaignId, onNavigate }: CampaignDetailProps) {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'overview' | 'sources' | 'articles'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock campaign data
  const campaign = {
    id: campaignId,
    name: 'Technology News Q4 2024',
    description: 'Collect technology news from major tech blogs and news sites',
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'active',
    sourcesCount: 8,
    articlesCollected: 2456,
    targetArticles: 5000,
    successRate: 94.5,
  };

  // Mock sources data
  const sources: Source[] = [
    {
      id: '1',
      name: 'VnExpress Technology',
      url: 'https://vnexpress.net/rss/tin-moi-nhat.rss',
      type: 'rss',
      status: 'active',
      lastRun: '5 minutes ago',
      articlesCollected: 547,
      successRate: 98.5,
      schedule: 'Every 15 minutes',
    },
    {
      id: '2',
      name: 'TechCrunch News',
      url: 'https://techcrunch.com/feed/',
      type: 'rss',
      status: 'active',
      lastRun: '10 minutes ago',
      articlesCollected: 432,
      successRate: 96.2,
      schedule: 'Every 30 minutes',
    },
    {
      id: '3',
      name: 'The Verge RSS',
      url: 'https://theverge.com/rss/index.xml',
      type: 'rss',
      status: 'active',
      lastRun: '15 minutes ago',
      articlesCollected: 389,
      successRate: 95.8,
      schedule: 'Every 20 minutes',
    },
    {
      id: '4',
      name: 'Ars Technica',
      url: 'https://arstechnica.com/feed/',
      type: 'rss',
      status: 'paused',
      lastRun: '2 hours ago',
      articlesCollected: 267,
      successRate: 92.1,
      schedule: 'Every 1 hour',
    },
  ];

  // Mock articles data
  const articles: CrawlerArticle[] = [
    {
      id: '1',
      title: 'AI Revolution: How Machine Learning is Transforming Industries',
      url: 'https://example.com/article-1',
      sourceId: '1',
      sourceName: 'VnExpress Technology',
      collectedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      status: 'published',
      author: 'John Doe',
      publishedDate: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '2',
      title: 'The Future of Quantum Computing: What You Need to Know',
      url: 'https://example.com/article-2',
      sourceId: '2',
      sourceName: 'TechCrunch News',
      collectedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      status: 'processed',
      author: 'Jane Smith',
      publishedDate: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '3',
      title: 'Blockchain Technology Beyond Cryptocurrency',
      url: 'https://example.com/article-3',
      sourceId: '3',
      sourceName: 'The Verge RSS',
      collectedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
      status: 'pending',
      author: 'Mike Johnson',
      publishedDate: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    },
  ];

  // Mock chart data
  const chartData = [
    { date: '01/12', articles: 45, success: 43 },
    { date: '02/12', articles: 52, success: 50 },
    { date: '03/12', articles: 48, success: 46 },
    { date: '04/12', articles: 61, success: 58 },
    { date: '05/12', articles: 55, success: 53 },
    { date: '06/12', articles: 67, success: 64 },
    { date: '07/12', articles: 72, success: 69 },
    { date: '08/12', articles: 58, success: 56 },
    { date: '09/12', articles: 64, success: 62 },
    { date: '10/12', articles: 70, success: 67 },
  ];

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
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
        return { color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-900/30', label: 'Active' };
      case 'paused':
        return { color: 'text-yellow-600', bg: 'bg-yellow-100 dark:bg-yellow-900/30', label: 'Paused' };
      case 'error':
        return { color: 'text-red-600', bg: 'bg-red-100 dark:bg-red-900/30', label: 'Error' };
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

  const progress = (campaign.articlesCollected / campaign.targetArticles) * 100;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => onNavigate({ page: 'crawler' })}
          className="p-2 hover:bg-secondary rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold">{campaign.name}</h1>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusConfig(campaign.status).bg} ${getStatusConfig(campaign.status).color}`}>
              {getStatusConfig(campaign.status).label}
            </span>
          </div>
          <p className="text-muted-foreground">{campaign.description}</p>
        </div>

        <button
          onClick={() => showNotification('Campaign exported!', 'success')}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all"
        >
          <Download className="w-5 h-5" />
          Export
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-card rounded-xl p-4 border border-border">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-muted-foreground">Start Date</p>
            <Calendar className="w-4 h-4 text-blue-600" />
          </div>
          <p className="font-semibold">{formatDate(campaign.startDate)}</p>
        </div>

        <div className="bg-card rounded-xl p-4 border border-border">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-muted-foreground">End Date</p>
            <Calendar className="w-4 h-4 text-red-600" />
          </div>
          <p className="font-semibold">{formatDate(campaign.endDate)}</p>
        </div>

        <div className="bg-card rounded-xl p-4 border border-border">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-muted-foreground">Sources</p>
            <Globe className="w-4 h-4 text-green-600" />
          </div>
          <p className="font-semibold">{campaign.sourcesCount}</p>
        </div>

        <div className="bg-card rounded-xl p-4 border border-border">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-muted-foreground">Articles</p>
            <Archive className="w-4 h-4 text-purple-600" />
          </div>
          <p className="font-semibold">{campaign.articlesCollected.toLocaleString()}</p>
        </div>

        <div className="bg-card rounded-xl p-4 border border-border">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-muted-foreground">Success Rate</p>
            <TrendingUp className="w-4 h-4 text-orange-600" />
          </div>
          <p className="font-semibold">{campaign.successRate}%</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-card rounded-xl border border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold">Campaign Progress</h3>
            <p className="text-sm text-muted-foreground">
              {campaign.articlesCollected.toLocaleString()} / {campaign.targetArticles.toLocaleString()} articles
            </p>
          </div>
          <div className="text-2xl font-bold text-purple-600">{progress.toFixed(1)}%</div>
        </div>
        <div className="w-full bg-secondary rounded-full h-3">
          <div
            className="bg-gradient-to-r from-purple-600 to-pink-600 h-3 rounded-full transition-all"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
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
                  ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600'
                  : 'hover:bg-secondary'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <BarChart3 className="w-4 h-4" />
                <span className="font-medium">Overview</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('sources')}
              className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'sources'
                  ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600'
                  : 'hover:bg-secondary'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Globe className="w-4 h-4" />
                <span className="font-medium">Sources ({sources.length})</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('articles')}
              className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'articles'
                  ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600'
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
              {/* Chart */}
              <div>
                <h3 className="font-semibold mb-4">Articles Collected Over Time</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="colorArticles" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorSuccess" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Area 
                        type="monotone" 
                        dataKey="articles" 
                        stroke="#a855f7" 
                        fillOpacity={1} 
                        fill="url(#colorArticles)"
                        name="Total Articles"
                      />
                      <Area 
                        type="monotone" 
                        dataKey="success" 
                        stroke="#10b981" 
                        fillOpacity={1} 
                        fill="url(#colorSuccess)"
                        name="Successful"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-secondary rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                      <Activity className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Avg per Day</p>
                      <p className="text-2xl font-bold">82</p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">articles collected daily</p>
                </div>

                <div className="bg-secondary rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Success Rate</p>
                      <p className="text-2xl font-bold">{campaign.successRate}%</p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">overall collection success</p>
                </div>

                <div className="bg-secondary rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                      <Target className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Remaining</p>
                      <p className="text-2xl font-bold">{(campaign.targetArticles - campaign.articlesCollected).toLocaleString()}</p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">articles to reach goal</p>
                </div>
              </div>

              {/* Top Sources */}
              <div>
                <h3 className="font-semibold mb-4">Top Performing Sources</h3>
                <div className="space-y-3">
                  {sources.slice(0, 3).map((source, idx) => (
                    <div key={source.id} className="flex items-center gap-4 p-4 bg-secondary rounded-xl">
                      <div className="text-2xl font-bold text-muted-foreground">#{idx + 1}</div>
                      <div className="flex-1">
                        <p className="font-semibold">{source.name}</p>
                        <p className="text-sm text-muted-foreground">{source.url}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{source.articlesCollected} articles</p>
                        <p className="text-sm text-green-600">{source.successRate}% success</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Sources Tab */}
          {activeTab === 'sources' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex-1 max-w-md">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="search"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search sources..."
                      className="w-full pl-10 pr-4 py-2 bg-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                    />
                  </div>
                </div>

                <button
                  onClick={() => showNotification('Add source feature coming soon!', 'info')}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  Add Source
                </button>
              </div>

              <div className="space-y-3">
                {sources.map(source => {
                  const statusConfig = getStatusConfig(source.status);
                  return (
                    <div key={source.id} className="bg-secondary rounded-xl p-4 hover:shadow-md transition-all group">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-semibold">{source.name}</h4>
                            <span className={`px-2 py-0.5 rounded-full text-xs ${statusConfig.bg} ${statusConfig.color}`}>
                              {statusConfig.label}
                            </span>
                            <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-xs rounded-full">
                              {source.type.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{source.url}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>Last run: {source.lastRun}</span>
                            <span>•</span>
                            <span>{source.articlesCollected} articles</span>
                            <span>•</span>
                            <span>{source.successRate}% success</span>
                            <span>•</span>
                            <span>{source.schedule}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => onNavigate({ page: 'source-detail', sourceId: source.id, campaignId })}
                            className="p-2 hover:bg-card rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4 text-purple-600" />
                          </button>
                          <button className="p-2 hover:bg-card rounded-lg transition-colors" title="Edit">
                            <Edit2 className="w-4 h-4 text-blue-600" />
                          </button>
                          <button className="p-2 hover:bg-card rounded-lg transition-colors" title="Delete">
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
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
                      className="w-full pl-10 pr-4 py-2 bg-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                    />
                  </div>
                </div>

                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 bg-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="processed">Processed</option>
                  <option value="published">Published</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div className="space-y-3">
                {articles.map(article => {
                  const statusConfig = getStatusConfig(article.status);
                  return (
                    <div key={article.id} className="bg-secondary rounded-xl p-4 hover:shadow-md transition-all">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h4 className="font-semibold mb-1">{article.title}</h4>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                            <span className="font-medium text-purple-600">{article.sourceName}</span>
                            <span>•</span>
                            <span>{article.author}</span>
                            <span>•</span>
                            <span>{formatDateTime(article.collectedAt)}</span>
                          </div>
                          <p className="text-sm text-muted-foreground truncate">{article.url}</p>
                        </div>

                        <span className={`px-3 py-1 rounded-full text-xs ${statusConfig.bg} ${statusConfig.color}`}>
                          {statusConfig.label}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}