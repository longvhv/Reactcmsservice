import React, { useState } from 'react';
import { useFetch } from '@longvhv/query';
import { useTranslation } from '@longvhv/i18n';
import { 
  TrendingUp, 
  TrendingDown, 
  Eye, 
  ThumbsUp, 
  MessageCircle, 
  Share2,
  Calendar,
  Download,
  Filter,
  RefreshCw
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell,
  LineChart,
  Line,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

const AnalyticsPage: React.FC = () => {
  const { t } = useTranslation();
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  // Fetch analytics data
  const { data: analytics, isLoading, refetch } = useFetch('analytics', async () => {
    // Mock analytics data
    return {
      summary: {
        totalViews: 125847,
        totalLikes: 8934,
        totalComments: 2341,
        totalShares: 1456,
        viewsChange: 12.5,
        likesChange: -3.2,
        commentsChange: 18.7,
        sharesChange: 7.3,
      },
      viewsOverTime: [
        { date: '2024-01-01', views: 4200, likes: 320, comments: 85 },
        { date: '2024-01-02', views: 4800, likes: 380, comments: 92 },
        { date: '2024-01-03', views: 5200, likes: 410, comments: 105 },
        { date: '2024-01-04', views: 4900, likes: 390, comments: 98 },
        { date: '2024-01-05', views: 5600, likes: 450, comments: 112 },
        { date: '2024-01-06', views: 6100, likes: 480, comments: 128 },
        { date: '2024-01-07', views: 5800, likes: 460, comments: 115 },
      ],
      articlesByType: [
        { name: 'News', value: 850, color: '#3b82f6' },
        { name: 'Video', value: 320, color: '#8b5cf6' },
        { name: 'Gallery', value: 280, color: '#ec4899' },
        { name: 'Podcast', value: 150, color: '#f59e0b' },
        { name: 'Event', value: 200, color: '#10b981' },
        { name: 'Other', value: 243, color: '#6b7280' },
      ],
      topArticles: [
        { id: '1', title: 'Top 10 React Hooks in 2024', views: 12500, likes: 890, type: 'tutorial' },
        { id: '2', title: 'Introduction to TypeScript', views: 9800, likes: 720, type: 'tutorial' },
        { id: '3', title: 'Building Scalable APIs', views: 8600, likes: 650, type: 'news' },
        { id: '4', title: 'Modern CSS Techniques', views: 7400, likes: 580, type: 'tutorial' },
        { id: '5', title: 'Database Design Patterns', views: 6900, likes: 520, type: 'news' },
      ],
      trafficSources: [
        { source: 'Direct', visitors: 45200, percentage: 36 },
        { source: 'Google Search', visitors: 38500, percentage: 31 },
        { source: 'Social Media', visitors: 25100, percentage: 20 },
        { source: 'Referral', visitors: 12800, percentage: 10 },
        { source: 'Email', visitors: 4247, percentage: 3 },
      ],
    };
  });

  const StatCard: React.FC<{
    title: string;
    value: number;
    change: number;
    icon: React.ReactNode;
    color: string;
  }> = ({ title, value, change, icon, color }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl bg-${color}-100 dark:bg-${color}-900/30`}>
          {icon}
        </div>
        <div className={`flex items-center gap-1 text-sm font-medium ${
          change >= 0 
            ? 'text-green-600 dark:text-green-400' 
            : 'text-red-600 dark:text-red-400'
        }`}>
          {change >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          {Math.abs(change)}%
        </div>
      </div>
      <h3 className="text-gray-600 dark:text-gray-400 text-sm mb-1">{title}</h3>
      <p className="text-3xl font-bold">{value.toLocaleString()}</p>
    </div>
  );

  if (isLoading) {
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
            Analytics & Statistics
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track your content performance
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Time range selector */}
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>

          <button
            onClick={() => refetch()}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
            Refresh
          </button>

          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors">
            <Download className="w-5 h-5" />
            Export
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Views"
          value={analytics?.summary.totalViews || 0}
          change={analytics?.summary.viewsChange || 0}
          icon={<Eye className="w-6 h-6 text-blue-600" />}
          color="blue"
        />
        <StatCard
          title="Total Likes"
          value={analytics?.summary.totalLikes || 0}
          change={analytics?.summary.likesChange || 0}
          icon={<ThumbsUp className="w-6 h-6 text-purple-600" />}
          color="purple"
        />
        <StatCard
          title="Total Comments"
          value={analytics?.summary.totalComments || 0}
          change={analytics?.summary.commentsChange || 0}
          icon={<MessageCircle className="w-6 h-6 text-green-600" />}
          color="green"
        />
        <StatCard
          title="Total Shares"
          value={analytics?.summary.totalShares || 0}
          change={analytics?.summary.sharesChange || 0}
          icon={<Share2 className="w-6 h-6 text-orange-600" />}
          color="orange"
        />
      </div>

      {/* Views Over Time Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-xl font-bold mb-6">Views Over Time</h2>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={analytics?.viewsOverTime}>
            <defs>
              <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
            <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} />
            <YAxis stroke="#9ca3af" fontSize={12} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1f2937', 
                border: 'none', 
                borderRadius: '8px',
                color: '#fff'
              }}
            />
            <Legend />
            <Area 
              type="monotone" 
              dataKey="views" 
              stroke="#3b82f6" 
              fillOpacity={1} 
              fill="url(#colorViews)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Articles by Type */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-bold mb-6">Articles by Type</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={analytics?.articlesByType}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {analytics?.articlesByType.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Traffic Sources */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-bold mb-6">Traffic Sources</h2>
          <div className="space-y-4">
            {analytics?.trafficSources.map((source: any) => (
              <div key={source.source}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">{source.source}</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {source.visitors.toLocaleString()} ({source.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${source.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Articles */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold">Top Performing Articles</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Rank
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Article
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Views
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Likes
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {analytics?.topArticles.map((article: any, index: number) => (
                <tr key={article.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50">
                  <td className="px-6 py-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                      index === 0 ? 'bg-yellow-100 text-yellow-600' :
                      index === 1 ? 'bg-gray-100 text-gray-600' :
                      index === 2 ? 'bg-orange-100 text-orange-600' :
                      'bg-blue-100 text-blue-600'
                    }`}>
                      {index + 1}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-medium">{article.title}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-xs">
                      {article.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4 text-gray-400" />
                      {article.views.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <ThumbsUp className="w-4 h-4 text-gray-400" />
                      {article.likes.toLocaleString()}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
