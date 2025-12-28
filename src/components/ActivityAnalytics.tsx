import React, { useState } from 'react';
import { 
  BarChart3, PieChart, TrendingUp, Activity, Users, Clock, 
  Calendar, Target, Zap, Globe, Database, Shield 
} from 'lucide-react';

interface AnalyticsData {
  byType: { [key: string]: number };
  byEntity: { [key: string]: number };
  bySeverity: { [key: string]: number };
  byHour: { hour: number; count: number }[];
  byDay: { day: string; count: number }[];
  topUsers: { name: string; count: number; avatar: string }[];
  trends: { metric: string; current: number; previous: number; change: number }[];
}

interface ActivityAnalyticsProps {
  data: AnalyticsData;
}

export function ActivityAnalytics({ data }: ActivityAnalyticsProps) {
  const [selectedMetric, setSelectedMetric] = useState<'type' | 'entity' | 'severity'>('type');

  // Mock comprehensive analytics data
  const mockData: AnalyticsData = {
    byType: {
      create: 234,
      update: 456,
      delete: 45,
      view: 789,
      publish: 123,
      login: 234,
      upload: 89,
      download: 156,
    },
    byEntity: {
      article: 567,
      user: 234,
      category: 123,
      media: 345,
      comment: 234,
    },
    bySeverity: {
      success: 890,
      info: 456,
      warning: 123,
      error: 34,
    },
    byHour: Array.from({ length: 24 }, (_, hour) => ({
      hour,
      count: Math.floor(Math.random() * 100) + 20,
    })),
    byDay: [
      { day: 'Mon', count: 234 },
      { day: 'Tue', count: 345 },
      { day: 'Wed', count: 456 },
      { day: 'Thu', count: 389 },
      { day: 'Fri', count: 412 },
      { day: 'Sat', count: 178 },
      { day: 'Sun', count: 156 },
    ],
    topUsers: [
      { name: 'Nguyễn Văn A', count: 234, avatar: 'https://i.pravatar.cc/150?img=1' },
      { name: 'Trần Thị B', count: 189, avatar: 'https://i.pravatar.cc/150?img=2' },
      { name: 'Lê Văn C', count: 156, avatar: 'https://i.pravatar.cc/150?img=3' },
      { name: 'Phạm Thị D', count: 134, avatar: 'https://i.pravatar.cc/150?img=4' },
      { name: 'Hoàng Văn E', count: 112, avatar: 'https://i.pravatar.cc/150?img=5' },
    ],
    trends: [
      { metric: 'Total Events', current: 2134, previous: 1876, change: 13.7 },
      { metric: 'Active Users', current: 324, previous: 298, change: 8.7 },
      { metric: 'Avg Response Time', current: 145, previous: 189, change: -23.3 },
      { metric: 'Success Rate', current: 99.2, previous: 98.1, change: 1.1 },
    ],
  };

  const analytics = data || mockData;

  const getDataByMetric = () => {
    switch (selectedMetric) {
      case 'type': return analytics.byType;
      case 'entity': return analytics.byEntity;
      case 'severity': return analytics.bySeverity;
      default: return analytics.byType;
    }
  };

  const currentData = getDataByMetric();
  const maxValue = Math.max(...Object.values(currentData));
  const total = Object.values(currentData).reduce((sum, val) => sum + val, 0);

  const getColorForMetric = (key: string, index: number) => {
    const colors = [
      '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
      '#EC4899', '#14B8A6', '#F97316', '#6366F1', '#84CC16'
    ];
    
    if (selectedMetric === 'severity') {
      const severityColors: { [key: string]: string } = {
        success: '#10B981',
        info: '#3B82F6',
        warning: '#F59E0B',
        error: '#EF4444',
      };
      return severityColors[key] || colors[index];
    }
    
    return colors[index % colors.length];
  };

  const maxHourCount = Math.max(...analytics.byHour.map(h => h.count));
  const maxDayCount = Math.max(...analytics.byDay.map(d => d.count));

  return (
    <div className="space-y-6">
      {/* Trends Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {analytics.trends.map((trend, idx) => {
          const icons = [Activity, Users, Clock, Target];
          const Icon = icons[idx];
          const isPositive = trend.change > 0;
          const isNegative = trend.change < 0;
          
          return (
            <div key={trend.metric} className="bg-card rounded-2xl border border-border/60 p-5">
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2.5 rounded-xl ${
                  idx === 0 ? 'bg-blue-100 dark:bg-blue-900/30' :
                  idx === 1 ? 'bg-green-100 dark:bg-green-900/30' :
                  idx === 2 ? 'bg-purple-100 dark:bg-purple-900/30' :
                  'bg-orange-100 dark:bg-orange-900/30'
                }`}>
                  <Icon className={`w-5 h-5 ${
                    idx === 0 ? 'text-blue-600 dark:text-blue-400' :
                    idx === 1 ? 'text-green-600 dark:text-green-400' :
                    idx === 2 ? 'text-purple-600 dark:text-purple-400' :
                    'text-orange-600 dark:text-orange-400'
                  }`} />
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${
                  isPositive ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' :
                  isNegative ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' :
                  'bg-gray-100 dark:bg-gray-900/30 text-gray-600 dark:text-gray-400'
                }`}>
                  <TrendingUp className={`w-3 h-3 ${isNegative ? 'rotate-180' : ''}`} />
                  {isPositive ? '+' : ''}{trend.change}%
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-1">{trend.metric}</p>
              <p className="text-3xl font-bold">{trend.current.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Previous: {trend.previous.toLocaleString()}
              </p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Distribution Chart */}
        <div className="lg:col-span-2">
          <div className="bg-card rounded-2xl border border-border/60 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-semibold text-lg mb-1">Phân bố hoạt động</h3>
                <p className="text-sm text-muted-foreground">Breakdown theo {
                  selectedMetric === 'type' ? 'loại hành động' :
                  selectedMetric === 'entity' ? 'đối tượng' : 'mức độ'
                }</p>
              </div>
              <div className="flex items-center gap-1 p-1 bg-secondary rounded-xl">
                {['type', 'entity', 'severity'].map((metric) => (
                  <button
                    key={metric}
                    onClick={() => setSelectedMetric(metric as any)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      selectedMetric === metric
                        ? 'bg-blue-500 text-white shadow-lg'
                        : 'hover:bg-muted/50'
                    }`}
                  >
                    {metric === 'type' ? 'Loại' : metric === 'entity' ? 'Đối tượng' : 'Mức độ'}
                  </button>
                ))}
              </div>
            </div>

            {/* Bar Chart */}
            <div className="space-y-3">
              {Object.entries(currentData).map(([key, value], idx) => {
                const percentage = ((value / total) * 100).toFixed(1);
                const color = getColorForMetric(key, idx);
                
                return (
                  <div key={key} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium capitalize flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-sm"
                          style={{ backgroundColor: color }}
                        />
                        {key}
                      </span>
                      <div className="flex items-center gap-3">
                        <span className="text-muted-foreground">{percentage}%</span>
                        <span className="font-semibold min-w-[60px] text-right">{value.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-3 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700 ease-out relative group"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: color
                        }}
                      >
                        <div className="absolute inset-0 bg-white/20 group-hover:bg-white/30 transition-colors" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Total */}
            <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
              <span className="font-semibold">Tổng cộng</span>
              <span className="text-xl font-bold">{total.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Top Users */}
        <div className="bg-card rounded-2xl border border-border/60 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 bg-orange-100 dark:bg-orange-900/30 rounded-xl">
              <Users className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Top Users</h3>
              <p className="text-sm text-muted-foreground">Người dùng hoạt động nhiều nhất</p>
            </div>
          </div>

          <div className="space-y-3">
            {analytics.topUsers.map((user, idx) => (
              <div
                key={user.name}
                className="flex items-center gap-3 p-3 bg-secondary rounded-xl hover:bg-secondary/80 transition-colors group"
              >
                <div className="relative">
                  <img 
                    src={user.avatar} 
                    alt={user.name}
                    className="w-10 h-10 rounded-full ring-2 ring-border"
                  />
                  <div className={`absolute -top-1 -left-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                    idx === 0 ? 'bg-yellow-500' :
                    idx === 1 ? 'bg-gray-400' :
                    idx === 2 ? 'bg-orange-600' :
                    'bg-blue-500'
                  }`}>
                    #{idx + 1}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.count} hoạt động</p>
                </div>
                <div className="text-right opacity-0 group-hover:opacity-100 transition-opacity">
                  <Zap className="w-4 h-4 text-yellow-500" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Hourly Activity */}
      <div className="bg-card rounded-2xl border border-border/60 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
            <Clock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">Hoạt động theo giờ</h3>
            <p className="text-sm text-muted-foreground">Phân bố 24 giờ trong ngày</p>
          </div>
        </div>

        <div className="flex items-end justify-between gap-1 h-48">
          {analytics.byHour.map((item) => (
            <div key={item.hour} className="flex-1 flex flex-col items-center gap-2">
              <div
                className="w-full bg-gradient-to-t from-purple-500 to-purple-400 rounded-t-lg transition-all duration-500 hover:from-purple-600 hover:to-purple-500 cursor-pointer group relative"
                style={{ height: `${(item.count / maxHourCount) * 100}%` }}
              >
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
                  {item.count} events
                </div>
              </div>
              {item.hour % 3 === 0 && (
                <span className="text-xs text-muted-foreground">{item.hour}h</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Weekly Trend */}
      <div className="bg-card rounded-2xl border border-border/60 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 bg-green-100 dark:bg-green-900/30 rounded-xl">
            <Calendar className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">Xu hướng tuần</h3>
            <p className="text-sm text-muted-foreground">So sánh hoạt động 7 ngày</p>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-4">
          {analytics.byDay.map((item, idx) => {
            const isToday = idx === 3; // Thursday as today
            return (
              <div key={item.day} className="flex flex-col items-center gap-3">
                <div className={`w-full aspect-square rounded-2xl flex flex-col items-center justify-center ${
                  isToday 
                    ? 'bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg shadow-green-500/30' 
                    : 'bg-secondary hover:bg-secondary/80'
                } transition-all cursor-pointer`}>
                  <p className="text-2xl font-bold">{item.count}</p>
                  <p className="text-xs opacity-80">events</p>
                </div>
                <p className={`text-sm font-medium ${isToday ? 'text-green-600 dark:text-green-400' : ''}`}>
                  {item.day}
                </p>
                <div className="w-full bg-secondary rounded-full h-1.5">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-green-400 to-green-600 transition-all duration-700"
                    style={{ width: `${(item.count / maxDayCount) * 100}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
