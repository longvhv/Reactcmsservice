import React, { useState } from 'react';
import { 
  TrendingUp, 
  Eye, 
  Heart, 
  MessageCircle, 
  Share2,
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  ArrowUp,
  ArrowDown,
  Filter
} from 'lucide-react';
import { BarChart, Bar, LineChart, Line, PieChart as RechartsPieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { mockArticles } from '../utils/mockData';

interface ReporterAnalyticsProps {
  currentUserId: number;
}

export function ReporterAnalytics({ currentUserId }: ReporterAnalyticsProps) {
  const [selectedPeriod, setSelectedPeriod] = useState('30days');
  const [selectedMetric, setSelectedMetric] = useState('all');

  // Filter articles by current user
  const userArticles = mockArticles.filter(article => article.authorId === currentUserId);

  // Calculate analytics data
  const totalViews = userArticles.reduce((sum, article) => sum + (article.views || 0), 0);
  const totalLikes = userArticles.reduce((sum, article) => sum + (article.likes || 0), 0);
  const totalComments = userArticles.reduce((sum, article) => sum + (article.comments || 0), 0);
  const totalShares = userArticles.reduce((sum, article) => sum + (article.shares || 0), 0);

  const avgViews = Math.round(totalViews / Math.max(userArticles.length, 1));
  const avgLikes = Math.round(totalLikes / Math.max(userArticles.length, 1));
  const avgComments = Math.round(totalComments / Math.max(userArticles.length, 1));
  const avgShares = Math.round(totalShares / Math.max(userArticles.length, 1));

  // Mock data for charts
  const viewsOverTime = [
    { date: '01/12', views: 1200, likes: 45 },
    { date: '05/12', views: 2400, likes: 89 },
    { date: '10/12', views: 1800, likes: 67 },
    { date: '15/12', views: 3200, likes: 134 },
    { date: '20/12', views: 2800, likes: 98 },
    { date: '25/12', views: 4100, likes: 167 },
    { date: '30/12', views: 3600, likes: 142 },
  ];

  const articleTypeDistribution = [
    { name: 'Tin tức', value: userArticles.filter(a => a.type === 'news').length, color: '#8b5cf6' },
    { name: 'Video', value: userArticles.filter(a => a.type === 'video').length, color: '#ec4899' },
    { name: 'Phóng sự', value: userArticles.filter(a => a.type === 'interview').length, color: '#3b82f6' },
    { name: 'PDF', value: userArticles.filter(a => a.type === 'pdf').length, color: '#ef4444' },
    { name: 'Tải xuống', value: userArticles.filter(a => a.type === 'download').length, color: '#14b8a6' },
  ].filter(item => item.value > 0);

  const topPerformingArticles = [...userArticles]
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 5);

  const engagementRate = totalViews > 0 ? ((totalLikes + totalComments + totalShares) / totalViews * 100).toFixed(2) : '0';

  const stats = [
    {
      icon: Eye,
      label: 'Tổng lượt xem',
      value: totalViews.toLocaleString(),
      change: '+12.5%',
      positive: true,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    {
      icon: Heart,
      label: 'Tổng lượt thích',
      value: totalLikes.toLocaleString(),
      change: '+8.3%',
      positive: true,
      color: 'from-pink-500 to-rose-500',
      bgColor: 'bg-pink-50',
      iconColor: 'text-pink-600'
    },
    {
      icon: MessageCircle,
      label: 'Tổng bình luận',
      value: totalComments.toLocaleString(),
      change: '+15.7%',
      positive: true,
      color: 'from-purple-500 to-indigo-500',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600'
    },
    {
      icon: Share2,
      label: 'Tổng chia sẻ',
      value: totalShares.toLocaleString(),
      change: '+6.2%',
      positive: true,
      color: 'from-emerald-500 to-teal-500',
      bgColor: 'bg-emerald-50',
      iconColor: 'text-emerald-600'
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2 flex items-center gap-3">
                <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                  <BarChart3 className="w-8 h-8" />
                </div>
                Thống kê hiệu suất
              </h1>
              <p className="text-slate-600">Phân tích chi tiết về bài viết của bạn</p>
            </div>
            <div className="flex gap-3">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-4 py-2.5 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                <option value="7days">7 ngày qua</option>
                <option value="30days">30 ngày qua</option>
                <option value="90days">90 ngày qua</option>
                <option value="year">Năm nay</option>
                <option value="all">-- Thời gian --</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group"
            >
              <div className={`h-1.5 bg-gradient-to-r ${stat.color}`} />
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                    <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
                  </div>
                  <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                    stat.positive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                  }`}>
                    {stat.positive ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                    {stat.change}
                  </div>
                </div>
                <div className="text-2xl font-bold text-slate-900 mb-1">{stat.value}</div>
                <div className="text-sm text-slate-500">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Views Over Time */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Lượt xem theo thời gian</h3>
                <p className="text-sm text-slate-500">Xu hướng 30 ngày qua</p>
              </div>
              <Activity className="w-5 h-5 text-blue-600" />
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={viewsOverTime}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '12px', 
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="views" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  name="Lượt xem"
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="likes" 
                  stroke="#ec4899" 
                  strokeWidth={3}
                  name="Lượt thích"
                  dot={{ fill: '#ec4899', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Article Type Distribution */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Phân bố loại bài viết</h3>
                <p className="text-sm text-slate-500">Tổng {userArticles.length} bài viết</p>
              </div>
              <PieChart className="w-5 h-5 text-purple-600" />
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Pie
                  data={articleTypeDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {articleTypeDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Average Metrics */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-6">Chỉ số trung bình</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <Eye className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-slate-700">TB lượt xem/bài</span>
                </div>
                <span className="text-xl font-bold text-blue-600">{avgViews.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-pink-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <Heart className="w-5 h-5 text-pink-600" />
                  <span className="font-medium text-slate-700">TB lượt thích/bài</span>
                </div>
                <span className="text-xl font-bold text-pink-600">{avgLikes.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-purple-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <MessageCircle className="w-5 h-5 text-purple-600" />
                  <span className="font-medium text-slate-700">TB bình luận/bài</span>
                </div>
                <span className="text-xl font-bold text-purple-600">{avgComments.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <Share2 className="w-5 h-5 text-emerald-600" />
                  <span className="font-medium text-slate-700">TB chia sẻ/bài</span>
                </div>
                <span className="text-xl font-bold text-emerald-600">{avgShares.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Engagement Rate */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-6">Tỷ lệ tương tác</h3>
            <div className="flex flex-col items-center justify-center h-[calc(100%-2rem)]">
              <div className="relative">
                <div className="w-48 h-48 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <div className="w-40 h-40 rounded-full bg-white flex flex-col items-center justify-center">
                    <div className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      {engagementRate}%
                    </div>
                    <div className="text-sm text-slate-500 mt-2">Tỷ lệ tương tác</div>
                  </div>
                </div>
              </div>
              <p className="text-sm text-slate-600 mt-6 text-center max-w-xs">
                Tỷ lệ người dùng tương tác (thích, bình luận, chia sẻ) trên tổng số lượt xem
              </p>
            </div>
          </div>
        </div>

        {/* Top Performing Articles */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Bài viết hiệu suất cao</h3>
              <p className="text-sm text-slate-500">Top 5 bài viết có lượt xem cao nhất</p>
            </div>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <div className="space-y-3">
            {topPerformingArticles.map((article, index) => (
              <div
                key={article.id}
                className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-slate-900 truncate">{article.title}</h4>
                  <div className="flex items-center gap-4 mt-1 text-sm text-slate-500">
                    <span className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {(article.views || 0).toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="w-4 h-4" />
                      {(article.likes || 0).toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="w-4 h-4" />
                      {(article.comments || 0).toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                  article.status === 'published' ? 'bg-green-100 text-green-700' :
                  article.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-slate-100 text-slate-700'
                }`}>
                  {article.status === 'published' ? 'Đã xuất bản' :
                   article.status === 'pending' ? 'Chờ duyệt' : 'Nháp'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}