import { 
  TrendingUp, 
  Users, 
  FileText, 
  Eye, 
  Calendar, 
  Clock, 
  Activity, 
  ArrowUp, 
  ArrowDown, 
  MoreVertical, 
  Bell, 
  Search, 
  Plus, 
  Heart, 
  Video, 
  Image, 
  Briefcase, 
  Zap, 
  ArrowUpRight, 
  Sparkles,
  MessageSquare
} from 'lucide-react';
import { PageWrapper } from './PageWrapper';
import { useLanguage } from '../contexts/LanguageContext';

interface DashboardProps {
  onNavigate: (page: any) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const { t } = useLanguage();
  const stats = [
    { 
      label: t('dashboard.totalArticles'), 
      value: '2,543', 
      icon: FileText, 
      change: '+12.5%', 
      trend: 'up',
      color: 'blue',
      gradient: 'from-blue-500 to-cyan-500'
    },
    { 
      label: t('dashboard.totalViews'), 
      value: '1.2M', 
      icon: Eye, 
      change: '+23.1%', 
      trend: 'up',
      color: 'green',
      gradient: 'from-green-500 to-emerald-500'
    },
    { 
      label: t('dashboard.totalComments'), 
      value: '8,432', 
      icon: MessageSquare, 
      change: '+8.3%', 
      trend: 'up',
      color: 'purple',
      gradient: 'from-purple-500 to-pink-500'
    },
    { 
      label: t('dashboard.totalLikes'), 
      value: '12.5K', 
      icon: Heart, 
      change: '+15.7%', 
      trend: 'up',
      color: 'red',
      gradient: 'from-red-500 to-rose-500'
    },
  ];

  const recentArticles = [
    { id: 1, title: 'Hướng dẫn sử dụng CMS mới', status: 'published', views: 1234, date: '2 giờ trước', author: 'Nguyễn Văn A' },
    { id: 2, title: 'Cập nhật tính năng AI Translation', status: 'draft', views: 0, date: '5 giờ trước', author: 'Trần Thị B' },
    { id: 3, title: 'Giới thiệu về Media Service', status: 'review', views: 432, date: '1 ngày trước', author: 'Lê Văn C' },
    { id: 4, title: 'Best practices cho SEO 2024', status: 'published', views: 2156, date: '2 ngày trước', author: 'Phạm Thị D' },
    { id: 5, title: 'Video hướng dẫn React hooks', status: 'scheduled', views: 0, date: '3 ngày trước', author: 'Nguyễn Văn A' },
  ];

  const quickActions = [
    { id: 1, icon: FileText, label: t('dashboard.createArticle'), color: 'blue', action: () => onNavigate('articles') },
    { id: 2, icon: Video, label: t('articleTypes.video'), color: 'red', action: () => onNavigate('articles') },
    { id: 3, icon: Image, label: t('articleTypes.gallery'), color: 'purple', action: () => onNavigate('articles') },
    { id: 4, icon: Briefcase, label: t('articleTypes.job'), color: 'green', action: () => onNavigate('articles') },
    { id: 5, icon: Calendar, label: t('articleTypes.event'), color: 'orange', action: () => onNavigate('articles') },
  ];

  const notifications = [
    { id: 1, type: 'comment', message: '5 bình luận mới cần duyệt', time: '5 phút trước', unread: true },
    { id: 2, type: 'approval', message: '3 bài viết đang chờ phê duyệt', time: '1 giờ trước', unread: true },
    { id: 3, type: 'crawler', message: 'Crawler VnExpress hoàn thành: 12 bài mới', time: '2 giờ trước', unread: false },
    { id: 4, type: 'system', message: 'Backup tự động đã hoàn tất', time: '3 giờ trước', unread: false },
  ];

  const activityLog = [
    { id: 1, user: 'Nguyễn Văn A', action: 'đã xuất bản', target: 'Hướng dẫn React Hooks', time: '10 phút trước' },
    { id: 2, user: 'Trần Thị B', action: 'đã chỉnh sửa', target: 'Best practices SEO', time: '25 phút trước' },
    { id: 3, user: 'Lê Văn C', action: 'đã upload', target: '5 ảnh mới', time: '45 phút trước' },
    { id: 4, user: 'Phạm Thị D', action: 'đã xóa', target: 'Video demo cũ', time: '1 giờ trước' },
  ];

  const performanceData = [
    { day: 'T2', value: 85 },
    { day: 'T3', value: 92 },
    { day: 'T4', value: 78 },
    { day: 'T5', value: 95 },
    { day: 'T6', value: 88 },
    { day: 'T7', value: 102 },
    { day: 'CN', value: 98 },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-700';
      case 'draft': return 'bg-gray-100 text-gray-700';
      case 'review': return 'bg-yellow-100 text-yellow-700';
      case 'scheduled': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'published': return t('status.published');
      case 'draft': return t('status.draft');
      case 'review': return t('status.review');
      case 'scheduled': return t('status.scheduled');
      default: return status;
    }
  };

  return (
    <PageWrapper>
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-foreground mb-2">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {t('dashboard.welcome')}, Admin! 👋
            </span>
          </h1>
          <p className="text-muted-foreground">{t('dashboard.overview')}</p>
        </div>

        {/* Real-time Indicator */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-green-100 border border-green-200 rounded-xl">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <span className="text-sm text-green-700 font-medium">{t('dashboard.systemHealthy')}</span>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 bg-blue-100 border border-blue-200 rounded-xl">
            <Activity className="w-4 h-4 text-blue-600" />
            <span className="text-sm text-blue-700 font-medium">1,234 online</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${stat.gradient} p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer`}
            >
              <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-white/10 blur-2xl group-hover:bg-white/20 transition-all duration-300" />
              
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm group-hover:scale-110 transition-transform duration-200">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-sm ${
                    stat.trend === 'up' ? 'bg-white/20' : 'bg-red-500/20'
                  }`}>
                    {stat.trend === 'up' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                    <span>{stat.change}</span>
                  </div>
                </div>
                
                <div className="text-3xl font-bold mb-1">{stat.value}</div>
                <div className="text-white/80 text-sm">{stat.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-card rounded-2xl border border-border/60 p-6">
        <h3 className="text-foreground mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-500" />
          <span>Thao tác nhanh</span>
        </h3>
        
        <div className="grid grid-cols-5 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.id}
                onClick={action.action}
                className={`flex flex-col items-center gap-3 p-6 rounded-xl border-2 border-border/60 hover:border-${action.color}-500 hover:bg-${action.color}-50 transition-all duration-200 group`}
              >
                <div className={`p-4 bg-${action.color}-100 rounded-xl group-hover:bg-${action.color}-500 transition-colors duration-200`}>
                  <Icon className={`w-8 h-8 text-${action.color}-600 group-hover:text-white transition-colors duration-200`} />
                </div>
                <span className="text-sm font-medium text-foreground">{action.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-3 gap-6">
        {/* Performance Chart */}
        <div className="col-span-2 bg-card rounded-2xl border border-border/60 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-foreground flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-500" />
              <span>Hiệu suất 7 ngày qua</span>
            </h3>
            <div className="flex items-center gap-2 text-sm text-green-600">
              <ArrowUp className="w-4 h-4" />
              <span>+18.2%</span>
            </div>
          </div>

          <div className="h-64 flex items-end gap-3">
            {performanceData.map((item, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-xl relative group cursor-pointer hover:from-blue-600 hover:to-blue-500 transition-all duration-200" style={{ height: `${item.value}%` }}>
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg whitespace-nowrap font-medium">
                    {(item.value * 50).toLocaleString()} views
                  </div>
                </div>
                <span className="text-sm font-medium text-muted-foreground">{item.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-card rounded-2xl border border-border/60 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-foreground flex items-center gap-2">
              <Bell className="w-5 h-5 text-orange-500" />
              <span>Thông báo</span>
            </h3>
            <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
              2 mới
            </span>
          </div>

          <div className="space-y-3">
            {notifications.map((notif) => (
              <div 
                key={notif.id}
                className={`p-3 rounded-xl border transition-all duration-200 cursor-pointer ${
                  notif.unread 
                    ? 'bg-blue-50 border-blue-200 hover:bg-blue-100' 
                    : 'border-border/60 hover:bg-muted/50'
                }`}
              >
                <div className="flex items-start gap-3">
                  {notif.unread && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground font-medium mb-1">{notif.message}</p>
                    <p className="text-xs text-muted-foreground">{notif.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button className="w-full mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium">
            Xem tất cả thông báo
          </button>
        </div>
      </div>

      {/* Recent Articles & Activity */}
      <div className="grid grid-cols-2 gap-6">
        {/* Recent Articles */}
        <div className="bg-card rounded-2xl border border-border/60 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-foreground flex items-center gap-2">
              <Clock className="w-5 h-5 text-purple-500" />
              <span>Bài viết gần đây</span>
            </h3>
            <button 
              onClick={() => onNavigate('articles')}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
            >
              <span>Xem tất cả</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3">
            {recentArticles.map((article) => (
              <div
                key={article.id}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer group"
              >
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-foreground truncate mb-1 group-hover:text-blue-600 transition-colors">
                    {article.title}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{article.author}</span>
                    <span>•</span>
                    <span>{article.date}</span>
                    {article.views > 0 && (
                      <>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {article.views}
                        </span>
                      </>
                    )}
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(article.status)}`}>
                  {getStatusLabel(article.status)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Log */}
        <div className="bg-card rounded-2xl border border-border/60 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-foreground flex items-center gap-2">
              <Users className="w-5 h-5 text-green-500" />
              <span>Hoạt động gần đây</span>
            </h3>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              Xem chi tiết
            </button>
          </div>

          <div className="space-y-4">
            {activityLog.map((log) => (
              <div key={log.id} className="flex items-start gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Activity className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground">
                    <span className="font-medium">{log.user}</span>
                    {' '}{log.action}{' '}
                    <span className="font-medium">{log.target}</span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">{log.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Insights */}
      <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-white/20 rounded-xl backdrop-blur-sm">
              <Sparkles className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-1">AI Insights & Gợi ý</h3>
              <p className="text-white/80 text-sm">Phân tích thông minh từ AI</p>
            </div>
          </div>
          <button className="px-6 py-3 bg-white text-purple-600 rounded-xl hover:bg-white/90 transition-colors font-medium">
            Xem chi tiết
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="text-2xl font-bold mb-1">94.2%</div>
            <div className="text-sm text-white/80">Tỷ lệ nội dung chất lượng</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="text-2xl font-bold mb-1">4:32</div>
            <div className="text-sm text-white/80">Thời gian đọc trung bình</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="text-2xl font-bold mb-1">87.5%</div>
            <div className="text-sm text-white/80">Tỷ lệ engagement</div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}