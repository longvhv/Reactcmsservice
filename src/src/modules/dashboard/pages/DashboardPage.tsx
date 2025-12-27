import React from 'react';
import { useAuth } from '@longvhv/auth';
import { useFetch } from '@longvhv/query';
import { useNotifications } from '@longvhv/notifications';
import { FileText, Eye, MessageCircle, Heart, TrendingUp, Clock, ArrowUpRight, Sparkles, Zap, Users, Plus, Video, Image, Briefcase, Calendar, Bell, Activity, ArrowUp, ArrowDown } from 'lucide-react';

interface DashboardStats {
  totalArticles: number;
  totalViews: number;
  totalComments: number;
  totalLikes: number;
}

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const notifications = useNotifications();

  // Using @longvhv/query for data fetching
  const { data: stats, isLoading } = useFetch<DashboardStats>(
    'dashboard-stats',
    async () => {
      // Mock API call - replace with actual API
      return {
        totalArticles: 2543,
        totalViews: 1200000,
        totalComments: 8432,
        totalLikes: 12500,
      };
    }
  );

  const statsCards = [
    { 
      label: 'Tổng bài viết', 
      value: stats?.totalArticles.toLocaleString() || '0', 
      icon: FileText, 
      change: '+12.5%', 
      trend: 'up',
      gradient: 'from-blue-500 to-cyan-500'
    },
    { 
      label: 'Lượt xem', 
      value: stats ? `${(stats.totalViews / 1000000).toFixed(1)}M` : '0', 
      icon: Eye, 
      change: '+23.1%', 
      trend: 'up',
      gradient: 'from-green-500 to-emerald-500'
    },
    { 
      label: 'Bình luận', 
      value: stats?.totalComments.toLocaleString() || '0', 
      icon: MessageCircle, 
      change: '+8.3%', 
      trend: 'up',
      gradient: 'from-purple-500 to-pink-500'
    },
    { 
      label: 'Yêu thích', 
      value: stats ? `${(stats.totalLikes / 1000).toFixed(1)}K` : '0', 
      icon: Heart, 
      change: '+15.7%', 
      trend: 'up',
      gradient: 'from-red-500 to-rose-500'
    },
  ];

  const quickActions = [
    { id: 1, icon: FileText, label: 'Bài viết mới', color: 'blue', path: '/articles/create' },
    { id: 2, icon: Video, label: 'Video mới', color: 'red', path: '/articles/create?type=video' },
    { id: 3, icon: Image, label: 'Gallery mới', color: 'purple', path: '/articles/create?type=gallery' },
    { id: 4, icon: Briefcase, label: 'Tuyển dụng', color: 'green', path: '/articles/create?type=job' },
    { id: 5, icon: Calendar, label: 'Sự kiện', color: 'orange', path: '/articles/create?type=event' },
  ];

  const recentActivity = [
    { id: 1, user: 'Nguyễn Văn A', action: 'đã xuất bản', target: 'Hướng dẫn React Hooks', time: '10 phút trước' },
    { id: 2, user: 'Trần Thị B', action: 'đã chỉnh sửa', target: 'Best practices SEO', time: '25 phút trước' },
    { id: 3, user: 'Lê Văn C', action: 'đã upload', target: '5 ảnh mới', time: '45 phút trước' },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Xin chào, {user?.firstName || 'Admin'}! 👋
            </span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400">Đây là tổng quan hệ thống CMS của bạn</p>
        </div>

        {/* Real-time Indicator */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-green-100 border border-green-200 rounded-xl">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <span className="text-sm text-green-700 font-medium">Hệ thống hoạt động tốt</span>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 bg-blue-100 border border-blue-200 rounded-xl">
            <Activity className="w-4 h-4 text-blue-600" />
            <span className="text-sm text-blue-700 font-medium">1,234 online</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat) => {
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
                  <div className="flex items-center gap-1 px-2 py-1 rounded-lg text-sm bg-white/20">
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
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-500" />
          <span>Thao tác nhanh</span>
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <a
                key={action.id}
                href={action.path}
                className={`flex flex-col items-center gap-3 p-6 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-${action.color}-500 hover:bg-${action.color}-50 dark:hover:bg-${action.color}-900/20 transition-all duration-200 group`}
              >
                <div className={`p-4 bg-${action.color}-100 dark:bg-${action.color}-900/30 rounded-xl group-hover:bg-${action.color}-500 transition-colors duration-200`}>
                  <Icon className={`w-8 h-8 text-${action.color}-600 dark:text-${action.color}-400 group-hover:text-white transition-colors duration-200`} />
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{action.label}</span>
              </a>
            );
          })}
        </div>
      </div>

      {/* Performance Chart & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-500" />
              <span>Hiệu suất 7 ngày qua</span>
            </h3>
            <div className="flex items-center gap-2 text-sm text-green-600">
              <ArrowUp className="w-4 h-4" />
              <span>+18.2%</span>
            </div>
          </div>

          <div className="h-64 flex items-end gap-3">
            {[45, 52, 48, 65, 58, 72, 68].map((height, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-xl relative group cursor-pointer hover:from-blue-600 hover:to-blue-500 transition-all duration-200" style={{ height: `${height}%` }}>
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg whitespace-nowrap font-medium">
                    {(height * 50).toLocaleString()} views
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  T{idx + 2}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Users className="w-5 h-5 text-green-500" />
              <span>Hoạt động gần đây</span>
            </h3>
          </div>

          <div className="space-y-4">
            {recentActivity.map((log) => (
              <div key={log.id} className="flex items-start gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Activity className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 dark:text-gray-100">
                    <span className="font-medium">{log.user}</span>
                    {' '}{log.action}{' '}
                    <span className="font-medium">{log.target}</span>
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{log.time}</p>
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
          <button 
            onClick={() => notifications.info('AI Insights đang được phát triển')}
            className="px-6 py-3 bg-white text-purple-600 rounded-xl hover:bg-white/90 transition-colors font-medium"
          >
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
    </div>
  );
};

export default DashboardPage;
