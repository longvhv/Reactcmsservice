import { useState } from 'react';
import { BarChart3, TrendingUp, Users, Eye, Calendar, Download, Filter, ArrowUp, ArrowDown, Clock, FileText, Video, Image as ImageIcon, Briefcase, Mic, Globe, Target } from 'lucide-react';
import { PageWrapper } from './PageWrapper';
import { PageHeader } from './PageHeader';
import { Card } from './Card';
import { useLanguage } from '../contexts/LanguageContext';

export function StatsAnalytics() {
  const { t } = useLanguage();
  const [dateRange, setDateRange] = useState('7days');
  const [selectedMetric, setSelectedMetric] = useState('all');

  const stats = {
    totalViews: 1547892,
    totalArticles: 3456,
    totalUsers: 28934,
    avgReadTime: '4:32',
    viewsChange: 12.5,
    articlesChange: 8.3,
    usersChange: -3.2,
    readTimeChange: 5.1,
  };

  const articleTypeStats = [
    { type: 'news', label: 'Tin tức', count: 1247, views: 524891, icon: FileText, color: 'blue' },
    { type: 'video', label: 'Video', count: 892, views: 423567, icon: Video, color: 'red' },
    { type: 'gallery', label: 'Gallery', count: 456, views: 234123, icon: ImageIcon, color: 'purple' },
    { type: 'job', label: 'Tuyển dụng', count: 234, views: 156234, icon: Briefcase, color: 'green' },
    { type: 'podcast', label: 'Podcast', count: 189, views: 98567, icon: Mic, color: 'pink' },
  ];

  const topArticles = [
    { id: 1, title: 'AI và Machine Learning trong năm 2024', views: 45678, type: 'news', trend: 'up' },
    { id: 2, title: 'Hướng dẫn React 19 chi tiết', views: 38901, type: 'video', trend: 'up' },
    { id: 3, title: 'Top 10 thư viện JavaScript phổ biến', views: 34567, type: 'news', trend: 'down' },
    { id: 4, title: 'Tuyển Senior Frontend Developer', views: 28934, type: 'job', trend: 'up' },
    { id: 5, title: 'Podcast: Phỏng vấn CTO Google', views: 23456, type: 'podcast', trend: 'up' },
  ];

  const categoryStats = [
    { name: 'Công nghệ', articles: 1247, views: 523456, growth: 15.3 },
    { name: 'AI & ML', articles: 892, views: 423789, growth: 22.1 },
    { name: 'Web Dev', articles: 756, views: 356234, growth: 8.7 },
    { name: 'Mobile', articles: 456, views: 245678, growth: -2.3 },
    { name: 'DevOps', articles: 234, views: 156234, growth: 12.8 },
  ];

  const trafficSources = [
    { source: 'Organic Search', visitors: 45678, percentage: 42.3, color: 'green' },
    { source: 'Direct', visitors: 28934, percentage: 26.8, color: 'blue' },
    { source: 'Social Media', visitors: 18567, percentage: 17.2, color: 'purple' },
    { source: 'Referral', visitors: 12456, percentage: 11.5, color: 'orange' },
    { source: 'Email', visitors: 2345, percentage: 2.2, color: 'pink' },
  ];

  return (
    <PageWrapper>
      <div className="space-y-6">
        {/* Header */}
        <PageHeader
          title="Thống kê & Phân tích"
          description="Báo cáo chi tiết về hiệu suất nội dung"
          action={
            <div className="flex items-center gap-3">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-4 py-3 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="24h">24 giờ</option>
                <option value="7days">7 ngày</option>
                <option value="30days">30 ngày</option>
                <option value="90days">90 ngày</option>
                <option value="1year">1 năm</option>
              </select>
              <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-200">
                <Download className="w-4 h-4" />
                <span>Export báo cáo</span>
              </button>
            </div>
          }
        />

        {/* Main Stats Cards */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <Eye className="w-6 h-6" />
              </div>
              <div className={`flex items-center gap-1 px-2 py-1 bg-white/20 rounded-lg text-sm ${
                stats.viewsChange > 0 ? 'text-white' : 'text-red-200'
              }`}>
                {stats.viewsChange > 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                <span>{Math.abs(stats.viewsChange)}%</span>
              </div>
            </div>
            <div className="text-3xl font-bold mb-1">{stats.totalViews.toLocaleString()}</div>
            <div className="text-blue-100 text-sm">Tổng lượt xem</div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <FileText className="w-6 h-6" />
              </div>
              <div className={`flex items-center gap-1 px-2 py-1 bg-white/20 rounded-lg text-sm ${
                stats.articlesChange > 0 ? 'text-white' : 'text-red-200'
              }`}>
                {stats.articlesChange > 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                <span>{Math.abs(stats.articlesChange)}%</span>
              </div>
            </div>
            <div className="text-3xl font-bold mb-1">{stats.totalArticles.toLocaleString()}</div>
            <div className="text-purple-100 text-sm">Tổng bài viết</div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <Users className="w-6 h-6" />
              </div>
              <div className={`flex items-center gap-1 px-2 py-1 bg-white/20 rounded-lg text-sm ${
                stats.usersChange > 0 ? 'text-white' : 'text-red-200'
              }`}>
                {stats.usersChange > 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                <span>{Math.abs(stats.usersChange)}%</span>
              </div>
            </div>
            <div className="text-3xl font-bold mb-1">{stats.totalUsers.toLocaleString()}</div>
            <div className="text-green-100 text-sm">Người dùng</div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <Clock className="w-6 h-6" />
              </div>
              <div className={`flex items-center gap-1 px-2 py-1 bg-white/20 rounded-lg text-sm ${
                stats.readTimeChange > 0 ? 'text-white' : 'text-red-200'
              }`}>
                {stats.readTimeChange > 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                <span>{Math.abs(stats.readTimeChange)}%</span>
              </div>
            </div>
            <div className="text-3xl font-bold mb-1">{stats.avgReadTime}</div>
            <div className="text-orange-100 text-sm">TG đọc TB</div>
          </div>
        </div>

        {/* Charts and Detailed Stats */}
        <div className="grid grid-cols-3 gap-6">
          {/* Views Chart */}
          <div className="col-span-2 bg-card rounded-2xl border border-border/60 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-foreground">Lượt xem theo thời gian</h3>
              <select className="px-3 py-2 border border-border/60 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20">
                <option>Theo ngày</option>
                <option>Theo tuần</option>
                <option>Theo tháng</option>
              </select>
            </div>

            {/* Mock Chart */}
            <div className="h-64 flex items-end gap-2">
              {[45, 52, 48, 65, 58, 72, 68, 78, 85, 92, 88, 95, 102, 98].map((height, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg relative group cursor-pointer hover:from-blue-600 hover:to-blue-500 transition-all duration-200" style={{ height: `${height}%` }}>
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                      {(height * 100).toLocaleString()} views
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">{idx + 1}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Traffic Sources */}
          <div className="bg-card rounded-2xl border border-border/60 p-6">
            <h3 className="text-foreground mb-6">Nguồn truy cập</h3>
            
            <div className="space-y-4">
              {trafficSources.map((source) => (
                <div key={source.source}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-foreground">{source.source}</span>
                    <span className="text-sm font-medium">{source.percentage}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className={`h-full bg-gradient-to-r from-${source.color}-400 to-${source.color}-500 rounded-full transition-all duration-500`}
                      style={{ width: `${source.percentage}%` }}
                    />
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {source.visitors.toLocaleString()} visitors
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Article Types Performance */}
        <div className="bg-card rounded-2xl border border-border/60 p-6">
          <h3 className="text-foreground mb-6">Hiệu suất theo loại bài viết</h3>
          
          <div className="grid grid-cols-5 gap-4">
            {articleTypeStats.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.type} className={`bg-gradient-to-br from-${item.color}-50 to-${item.color}-100 border border-${item.color}-200 rounded-xl p-4`}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`p-2 bg-${item.color}-500 rounded-lg`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className={`text-sm font-medium text-${item.color}-900`}>{item.label}</div>
                    </div>
                  </div>
                  <div className={`text-2xl font-bold text-${item.color}-700 mb-1`}>{item.count}</div>
                  <div className={`text-xs text-${item.color}-600`}>{item.views.toLocaleString()} views</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-2 gap-6">
          {/* Top Articles */}
          <div className="bg-card rounded-2xl border border-border/60 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-foreground">Top bài viết</h3>
              <button className="text-sm text-blue-600 hover:text-blue-700">Xem tất cả</button>
            </div>

            <div className="space-y-3">
              {topArticles.map((article, idx) => (
                <div key={article.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-lg text-sm font-bold ${
                    idx === 0 ? 'bg-yellow-100 text-yellow-700' :
                    idx === 1 ? 'bg-gray-100 text-gray-700' :
                    idx === 2 ? 'bg-orange-100 text-orange-700' :
                    'bg-muted text-muted-foreground'
                  }`}>
                    {idx + 1}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-foreground truncate">{article.title}</div>
                    <div className="text-sm text-muted-foreground">{article.views.toLocaleString()} views</div>
                  </div>

                  <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs ${
                    article.trend === 'up' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {article.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Category Performance */}
          <div className="bg-card rounded-2xl border border-border/60 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-foreground">Hiệu suất danh mục</h3>
              <button className="text-sm text-blue-600 hover:text-blue-700">Xem tất cả</button>
            </div>

            <div className="space-y-4">
              {categoryStats.map((category) => (
                <div key={category.name} className="border border-border/60 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="font-medium text-foreground">{category.name}</div>
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs ${
                      category.growth > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {category.growth > 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                      <span>{Math.abs(category.growth)}%</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <div className="text-muted-foreground">Bài viết</div>
                      <div className="font-medium">{category.articles.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Lượt xem</div>
                      <div className="font-medium">{category.views.toLocaleString()}</div>
                    </div>
                  </div>

                  <div className="mt-3 h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-400 to-blue-500 rounded-full"
                      style={{ width: `${(category.views / 600000) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Real-time Activity */}
        <div className="bg-card rounded-2xl border border-border/60 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-foreground flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              Hoạt động thời gian thực
            </h3>
            <div className="text-sm text-muted-foreground">Cập nhật 5 giây trước</div>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Eye className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-blue-900">Online ngay lúc này</span>
              </div>
              <div className="text-2xl font-bold text-blue-700">1,234</div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-900">Đang đọc</span>
              </div>
              <div className="text-2xl font-bold text-green-700">892</div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-purple-600" />
                <span className="text-sm text-purple-900">Bounce rate</span>
              </div>
              <div className="text-2xl font-bold text-purple-700">34.5%</div>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-orange-600" />
                <span className="text-sm text-orange-900">Avg. session</span>
              </div>
              <div className="text-2xl font-bold text-orange-700">5:42</div>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}