import React, { useState } from 'react';
import {
  TrendingUp, TrendingDown, Eye, MessageSquare, Users, FileText,
  Calendar, Download, Share2, Clock, Target, Award, Zap, Globe,
  ArrowUp, ArrowDown, Activity, BarChart3, PieChart, LineChart
} from 'lucide-react';
import { Card } from './Card';
import { PageWrapper } from './PageWrapper';
import { PageHeader } from './PageHeader';
import { AreaChart, Area, BarChart, Bar, PieChart as RePieChart, Pie, Cell, LineChart as ReLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useLanguage } from '../contexts/LanguageContext';

export function AnalyticsDashboard({ onNavigate }: { onNavigate: (page: any) => void }) {
  const { t } = useLanguage();
  const [timeRange, setTimeRange] = useState('7days');
  const [compareMode, setCompareMode] = useState(false);

  // Mock data
  const viewsData = [
    { date: '21/12', views: 2400, previousViews: 2000, users: 1200 },
    { date: '22/12', views: 3200, previousViews: 2400, users: 1600 },
    { date: '23/12', views: 2800, previousViews: 2200, users: 1400 },
    { date: '24/12', views: 3800, previousViews: 3000, users: 1900 },
    { date: '25/12', views: 4200, previousViews: 3200, users: 2100 },
    { date: '26/12', views: 3600, previousViews: 2800, users: 1800 },
    { date: '27/12', views: 4800, previousViews: 3600, users: 2400 },
  ];

  const articleTypeData = [
    { name: 'Tin tức', value: 45, color: '#3B82F6' },
    { name: 'Video', value: 25, color: '#8B5CF6' },
    { name: 'Gallery', value: 15, color: '#10B981' },
    { name: 'Podcast', value: 10, color: '#F59E0B' },
    { name: 'Khác', value: 5, color: '#6B7280' },
  ];

  const authorPerformance = [
    { name: 'Nguyễn Văn A', articles: 28, views: 15400, engagement: 8.5 },
    { name: 'Trần Thị B', articles: 24, views: 12800, engagement: 7.2 },
    { name: 'Lê Văn C', articles: 20, views: 10200, engagement: 6.8 },
    { name: 'Phạm Thị D', articles: 18, views: 9500, engagement: 6.5 },
    { name: 'Hoàng Văn E', articles: 15, views: 7800, engagement: 5.9 },
  ];

  const topArticles = [
    {
      id: 1,
      title: 'AI Revolution: Xu hướng AI năm 2024',
      views: 5234,
      comments: 89,
      shares: 156,
      avgTime: '4:32',
      engagement: 9.2,
      trend: 'up',
      trendValue: 15,
    },
    {
      id: 2,
      title: 'Cloud Infrastructure: Best Practices',
      views: 4876,
      comments: 72,
      shares: 134,
      avgTime: '3:48',
      engagement: 8.7,
      trend: 'up',
      trendValue: 12,
    },
    {
      id: 3,
      title: 'Blockchain & Web3: Cơ hội và thách thức',
      views: 4123,
      comments: 65,
      shares: 98,
      avgTime: '5:12',
      engagement: 8.1,
      trend: 'down',
      trendValue: -5,
    },
    {
      id: 4,
      title: 'Machine Learning trong thực tế',
      views: 3987,
      comments: 58,
      shares: 87,
      avgTime: '4:05',
      engagement: 7.8,
      trend: 'up',
      trendValue: 8,
    },
    {
      id: 5,
      title: 'DevOps: Automation và CI/CD',
      views: 3654,
      comments: 52,
      shares: 76,
      avgTime: '3:25',
      engagement: 7.2,
      trend: 'up',
      trendValue: 6,
    },
  ];

  const trafficSources = [
    { source: 'Direct', visits: 45, color: '#3B82F6' },
    { source: 'Social Media', visits: 30, color: '#8B5CF6' },
    { source: 'Search', visits: 15, color: '#10B981' },
    { source: 'Referral', visits: 10, color: '#F59E0B' },
  ];

  const stats = {
    totalViews: {
      current: 28400,
      previous: 24200,
      change: 17.4,
      trend: 'up',
    },
    uniqueUsers: {
      current: 12300,
      previous: 10500,
      change: 17.1,
      trend: 'up',
    },
    avgEngagement: {
      current: 7.8,
      previous: 7.2,
      change: 8.3,
      trend: 'up',
    },
    totalArticles: {
      current: 234,
      previous: 218,
      change: 7.3,
      trend: 'up',
    },
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border rounded-lg shadow-lg p-3">
          <p className="font-semibold mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <PageWrapper>
      <PageHeader
        title="Analytics Dashboard"
        description="Phân tích và thống kê chi tiết"
        action={
          <div className="flex items-center gap-3">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 bg-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="today">Hôm nay</option>
              <option value="7days">7 ngày qua</option>
              <option value="30days">30 ngày qua</option>
              <option value="90days">90 ngày qua</option>
              <option value="year">Năm nay</option>
            </select>
            <button
              onClick={() => setCompareMode(!compareMode)}
              className={`px-4 py-2 rounded-xl transition-all ${
                compareMode
                  ? 'bg-blue-500 text-white'
                  : 'bg-secondary hover:bg-muted'
              }`}
            >
              So sánh
            </button>
            <button className="px-4 py-2 bg-secondary hover:bg-muted rounded-xl transition-colors flex items-center gap-2">
              <Download className="w-4 h-4" />
              Xuất báo cáo
            </button>
          </div>
        }
      />

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full -mr-16 -mt-16" />
          <div className="relative">
            <div className="flex items-center justify-between mb-2">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                <Eye className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-sm font-semibold ${
                stats.totalViews.trend === 'up'
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                  : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
              }`}>
                {stats.totalViews.trend === 'up' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                {stats.totalViews.change}%
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-1">Tổng lượt xem</p>
            <p className="text-3xl font-bold mb-1">{stats.totalViews.current.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">
              +{(stats.totalViews.current - stats.totalViews.previous).toLocaleString()} so với kỳ trước
            </p>
          </div>
        </Card>

        <Card className="p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full -mr-16 -mt-16" />
          <div className="relative">
            <div className="flex items-center justify-between mb-2">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-sm font-semibold ${
                stats.uniqueUsers.trend === 'up'
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                  : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
              }`}>
                {stats.uniqueUsers.trend === 'up' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                {stats.uniqueUsers.change}%
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-1">Người dùng duy nhất</p>
            <p className="text-3xl font-bold mb-1">{stats.uniqueUsers.current.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">
              +{(stats.uniqueUsers.current - stats.uniqueUsers.previous).toLocaleString()} so với kỳ trước
            </p>
          </div>
        </Card>

        <Card className="p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full -mr-16 -mt-16" />
          <div className="relative">
            <div className="flex items-center justify-between mb-2">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
                <Target className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-sm font-semibold ${
                stats.avgEngagement.trend === 'up'
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                  : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
              }`}>
                {stats.avgEngagement.trend === 'up' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                {stats.avgEngagement.change}%
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-1">Tương tác TB</p>
            <p className="text-3xl font-bold mb-1">{stats.avgEngagement.current}/10</p>
            <p className="text-xs text-muted-foreground">
              +{(stats.avgEngagement.current - stats.avgEngagement.previous).toFixed(1)} điểm
            </p>
          </div>
        </Card>

        <Card className="p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full -mr-16 -mt-16" />
          <div className="relative">
            <div className="flex items-center justify-between mb-2">
              <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-xl">
                <FileText className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-sm font-semibold ${
                stats.totalArticles.trend === 'up'
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                  : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
              }`}>
                {stats.totalArticles.trend === 'up' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                {stats.totalArticles.change}%
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-1">Tổng bài viết</p>
            <p className="text-3xl font-bold mb-1">{stats.totalArticles.current}</p>
            <p className="text-xs text-muted-foreground">
              +{stats.totalArticles.current - stats.totalArticles.previous} bài viết mới
            </p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Views Trend */}
        <Card className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold mb-1">Lượt xem theo thời gian</h3>
              <p className="text-sm text-muted-foreground">Theo dõi xu hướng lượt xem</p>
            </div>
            <div className="flex gap-2">
              <button className="p-2 hover:bg-secondary rounded-lg transition-colors">
                <LineChart className="w-5 h-5 text-blue-500" />
              </button>
              <button className="p-2 hover:bg-secondary rounded-lg transition-colors">
                <BarChart3 className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={viewsData}>
              <defs>
                <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                </linearGradient>
                {compareMode && (
                  <linearGradient id="colorPrevious" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                  </linearGradient>
                )}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" opacity={0.3} />
              <XAxis dataKey="date" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="views" 
                stroke="#3B82F6" 
                fillOpacity={1} 
                fill="url(#colorViews)" 
                name="Lượt xem"
                strokeWidth={2}
              />
              {compareMode && (
                <Area 
                  type="monotone" 
                  dataKey="previousViews" 
                  stroke="#8B5CF6" 
                  fillOpacity={1} 
                  fill="url(#colorPrevious)" 
                  name="Kỳ trước"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Article Types Distribution */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-1">Phân bố loại bài viết</h3>
          <p className="text-sm text-muted-foreground mb-6">Tỷ lệ các loại nội dung</p>
          <ResponsiveContainer width="100%" height={250}>
            <RePieChart>
              <Pie
                data={articleTypeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {articleTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </RePieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {articleTypeData.map((type) => (
              <div key={type.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: type.color }} />
                  <span className="text-sm">{type.name}</span>
                </div>
                <span className="text-sm font-semibold">{type.value}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Top Articles */}
      <Card className="mb-6">
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-1">Bài viết hàng đầu</h3>
              <p className="text-sm text-muted-foreground">Top 5 bài viết có hiệu suất tốt nhất</p>
            </div>
            <button 
              onClick={() => onNavigate({ page: 'articles' })}
              className="text-sm text-blue-500 hover:text-blue-600 transition-colors"
            >
              Xem tất cả →
            </button>
          </div>
        </div>
        <div className="divide-y divide-border">
          {topArticles.map((article, index) => (
            <div key={article.id} className="p-5 hover:bg-secondary/50 transition-colors">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 
                    className="font-semibold mb-2 hover:text-blue-500 cursor-pointer transition-colors"
                    onClick={() => onNavigate({ page: 'article-detail', id: article.id })}
                  >
                    {article.title}
                  </h4>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {article.views.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="w-4 h-4" />
                      {article.comments}
                    </span>
                    <span className="flex items-center gap-1">
                      <Share2 className="w-4 h-4" />
                      {article.shares}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {article.avgTime}
                    </span>
                    <span className="flex items-center gap-1">
                      <Target className="w-4 h-4" />
                      {article.engagement}/10
                    </span>
                  </div>
                </div>
                <div className={`flex items-center gap-1 px-3 py-1 rounded-lg font-semibold ${
                  article.trend === 'up'
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                    : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                }`}>
                  {article.trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  {Math.abs(article.trendValue)}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Author Performance */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-1">Hiệu suất tác giả</h3>
          <p className="text-sm text-muted-foreground mb-6">Top 5 tác giả xuất sắc nhất</p>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={authorPerformance} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" opacity={0.3} />
              <XAxis type="number" stroke="#9CA3AF" />
              <YAxis dataKey="name" type="category" width={120} stroke="#9CA3AF" />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="articles" fill="#3B82F6" name="Bài viết" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Traffic Sources */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-1">Nguồn truy cập</h3>
          <p className="text-sm text-muted-foreground mb-6">Phân tích nguồn lưu lượng</p>
          <div className="space-y-4">
            {trafficSources.map((source) => (
              <div key={source.source}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">{source.source}</span>
                  <span className="text-sm font-semibold">{source.visits}%</span>
                </div>
                <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${source.visits}%`, backgroundColor: source.color }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-6 border-t border-border">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-secondary rounded-xl">
                <p className="text-2xl font-bold mb-1">68%</p>
                <p className="text-sm text-muted-foreground">Returning Visitors</p>
              </div>
              <div className="text-center p-4 bg-secondary rounded-xl">
                <p className="text-2xl font-bold mb-1">32%</p>
                <p className="text-sm text-muted-foreground">New Visitors</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </PageWrapper>
  );
}