import React, { useState } from 'react';
import {
  TrendingUp, TrendingDown, Eye, Heart, MessageSquare, Share2,
  Users, Clock, Target, Zap, Calendar, Download, Filter,
  BarChart3, PieChart, Activity, ArrowUp, ArrowDown, Minus
} from 'lucide-react';
import { Card } from './Card';
import { PageWrapper } from './PageWrapper';
import { PageHeader } from './PageHeader';
import { useLanguage } from '../contexts/LanguageContext';

interface AnalyticsMetric {
  label: string;
  value: number | string;
  change: number;
  trend: 'up' | 'down' | 'neutral';
  icon: any;
  color: string;
}

export function EventStreamAnalytics({ streamId, streamColor }: { streamId: string; streamColor: string }) {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d');
  const [chartType, setChartType] = useState<'views' | 'engagement' | 'growth'>('views');

  // Mock data
  const metrics: AnalyticsMetric[] = [
    {
      label: 'Tổng lượt xem',
      value: '45.8K',
      change: 12.5,
      trend: 'up',
      icon: Eye,
      color: '#3B82F6',
    },
    {
      label: 'Tương tác',
      value: '8.5%',
      change: 2.3,
      trend: 'up',
      icon: Zap,
      color: '#10B981',
    },
    {
      label: 'Lượt thích',
      value: '2.3K',
      change: -3.2,
      trend: 'down',
      icon: Heart,
      color: '#EF4444',
    },
    {
      label: 'Bình luận',
      value: '567',
      change: 18.7,
      trend: 'up',
      icon: MessageSquare,
      color: '#8B5CF6',
    },
    {
      label: 'Chia sẻ',
      value: '342',
      change: 8.4,
      trend: 'up',
      icon: Share2,
      color: '#F59E0B',
    },
    {
      label: 'Người theo dõi',
      value: '1.2K',
      change: 24.1,
      trend: 'up',
      icon: Users,
      color: '#EC4899',
    },
    {
      label: 'Thời gian đọc TB',
      value: '7.2m',
      change: 0.8,
      trend: 'neutral',
      icon: Clock,
      color: '#14B8A6',
    },
    {
      label: 'Tỷ lệ hoàn thành',
      value: '68%',
      change: 5.2,
      trend: 'up',
      icon: Target,
      color: '#6366F1',
    },
  ];

  // Chart data for 30 days
  const viewsData = Array.from({ length: 30 }, (_, i) => ({
    day: i + 1,
    views: Math.floor(Math.random() * 2000) + 1000,
    likes: Math.floor(Math.random() * 200) + 50,
    comments: Math.floor(Math.random() * 50) + 10,
  }));

  const maxViews = Math.max(...viewsData.map(d => d.views));

  // Top performing articles
  const topArticles = [
    { id: '1', title: 'AI Revolution: Xu hướng AI năm 2024', views: 5234, engagement: 9.8, growth: 34 },
    { id: '2', title: 'Tech Summit 2024 - Thông báo chính thức', views: 4532, engagement: 9.2, growth: 28 },
    { id: '3', title: 'Blockchain & Web3: Cơ hội và thách thức', views: 4123, engagement: 8.9, growth: 22 },
    { id: '4', title: 'Cloud Infrastructure: Best Practices', views: 3876, engagement: 8.1, growth: 18 },
    { id: '5', title: 'Cybersecurity Trends 2024', views: 3542, engagement: 7.8, growth: 15 },
  ];

  // Audience demographics
  const demographics = {
    devices: [
      { name: 'Desktop', value: 45, color: '#3B82F6' },
      { name: 'Mobile', value: 40, color: '#10B981' },
      { name: 'Tablet', value: 15, color: '#F59E0B' },
    ],
    locations: [
      { name: 'Hà Nội', value: 35 },
      { name: 'TP.HCM', value: 42 },
      { name: 'Đà Nẵng', value: 12 },
      { name: 'Khác', value: 11 },
    ],
    ageGroups: [
      { name: '18-24', value: 25 },
      { name: '25-34', value: 45 },
      { name: '35-44', value: 20 },
      { name: '45+', value: 10 },
    ],
  };

  const getTrendIcon = (trend: string) => {
    if (trend === 'up') return <ArrowUp className="w-3 h-3" />;
    if (trend === 'down') return <ArrowDown className="w-3 h-3" />;
    return <Minus className="w-3 h-3" />;
  };

  const getTrendColor = (trend: string) => {
    if (trend === 'up') return 'text-green-600 dark:text-green-400';
    if (trend === 'down') return 'text-red-600 dark:text-red-400';
    return 'text-gray-600 dark:text-gray-400';
  };

  return (
    <PageWrapper>
      <PageHeader
        title="Phân tích chi tiết"
        description="Insights và metrics cho dòng sự kiện"
        action={
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-secondary hover:bg-secondary/80 rounded-xl transition-colors flex items-center gap-2">
              <Download className="w-4 h-4" />
              Xuất báo cáo
            </button>
            <button className="px-4 py-2 bg-secondary hover:bg-secondary/80 rounded-xl transition-colors">
              <Filter className="w-4 h-4" />
            </button>
          </div>
        }
      />

      {/* Time Range Selector */}
      <div className="flex gap-2 mb-6">
        {[
          { key: '7d', label: '7 ngày' },
          { key: '30d', label: '30 ngày' },
          { key: '90d', label: '90 ngày' },
          { key: 'all', label: 'Tất cả' },
        ].map((range) => (
          <button
            key={range.key}
            onClick={() => setTimeRange(range.key as any)}
            className={`px-4 py-2 rounded-xl font-medium transition-all ${
              timeRange === range.key
                ? 'text-white shadow-lg'
                : 'bg-secondary hover:bg-secondary/80'
            }`}
            style={timeRange === range.key ? { backgroundColor: streamColor } : {}}
          >
            {range.label}
          </button>
        ))}
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <Card key={metric.label} className="p-5 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div 
                  className="p-2.5 rounded-xl"
                  style={{ backgroundColor: `${metric.color}20` }}
                >
                  <Icon className="w-5 h-5" style={{ color: metric.color }} />
                </div>
                <div className={`flex items-center gap-1 text-sm font-semibold ${getTrendColor(metric.trend)}`}>
                  {getTrendIcon(metric.trend)}
                  {Math.abs(metric.change)}%
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-1">{metric.label}</p>
              <p className="text-2xl font-bold">{metric.value}</p>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 space-y-6">
          {/* Performance Chart */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Hiệu suất theo thời gian</h3>
              <div className="flex gap-2">
                {[
                  { key: 'views', label: 'Lượt xem' },
                  { key: 'engagement', label: 'Tương tác' },
                  { key: 'growth', label: 'Tăng trưởng' },
                ].map((type) => (
                  <button
                    key={type.key}
                    onClick={() => setChartType(type.key as any)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      chartType === type.key
                        ? 'text-white'
                        : 'bg-secondary hover:bg-secondary/80'
                    }`}
                    style={chartType === type.key ? { backgroundColor: streamColor } : {}}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Chart */}
            <div className="h-80 flex items-end justify-between gap-1">
              {viewsData.map((data, index) => {
                const height = (data.views / maxViews) * 100;
                return (
                  <div key={index} className="flex-1 flex flex-col items-center group relative">
                    {/* Tooltip */}
                    <div className="absolute -top-20 left-1/2 -translate-x-1/2 bg-black text-white px-3 py-2 rounded-lg text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 whitespace-nowrap">
                      <p className="font-semibold mb-1">Ngày {data.day}</p>
                      <p>Views: {data.views}</p>
                      <p>Likes: {data.likes}</p>
                      <p>Comments: {data.comments}</p>
                    </div>
                    
                    {/* Bar */}
                    <div 
                      className="w-full rounded-t-lg transition-all cursor-pointer hover:opacity-80"
                      style={{ 
                        height: `${height}%`,
                        backgroundColor: streamColor,
                        minHeight: '4px',
                      }}
                    />
                    
                    {/* Date label - show every 5 days */}
                    {data.day % 5 === 0 && (
                      <span className="text-xs text-muted-foreground mt-2">
                        {data.day}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-6 mt-6 pt-6 border-t border-border">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: streamColor }} />
                <span className="text-sm text-muted-foreground">Lượt xem</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-sm text-muted-foreground">Tương tác</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-purple-500" />
                <span className="text-sm text-muted-foreground">Tăng trưởng</span>
              </div>
            </div>
          </Card>

          {/* Top Performing Articles */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Bài viết hiệu quả nhất</h3>
            <div className="space-y-3">
              {topArticles.map((article, index) => (
                <div key={article.id} className="flex items-center gap-4 p-4 bg-secondary rounded-xl hover:shadow-md transition-shadow">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold flex-shrink-0"
                    style={{ backgroundColor: streamColor }}
                  >
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate mb-1">{article.title}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {article.views.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Zap className="w-3 h-3" />
                        {article.engagement}%
                      </span>
                      <span className="flex items-center gap-1 text-green-600">
                        <TrendingUp className="w-3 h-3" />
                        +{article.growth}%
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">{article.engagement}%</p>
                    <p className="text-xs text-muted-foreground">Tương tác</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Engagement Timeline */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Tương tác theo giờ</h3>
            <div className="grid grid-cols-24 gap-1 mb-4">
              {Array.from({ length: 24 }, (_, i) => {
                const value = Math.floor(Math.random() * 100);
                return (
                  <div key={i} className="flex flex-col items-center gap-1">
                    <div 
                      className="w-full rounded-sm cursor-pointer hover:opacity-80 transition-opacity"
                      style={{ 
                        height: `${value}px`,
                        backgroundColor: streamColor,
                        opacity: value / 100,
                      }}
                      title={`${i}:00 - ${value}%`}
                    />
                    {i % 4 === 0 && (
                      <span className="text-xs text-muted-foreground">{i}h</span>
                    )}
                  </div>
                );
              })}
            </div>
            <p className="text-sm text-muted-foreground text-center">
              Giờ hoạt động cao nhất: <span className="font-semibold">14:00 - 16:00</span>
            </p>
          </Card>
        </div>

        {/* Sidebar Analytics */}
        <div className="space-y-6">
          {/* Devices */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-5 h-5" style={{ color: streamColor }} />
              <h3 className="font-semibold">Thiết bị</h3>
            </div>
            <div className="space-y-4">
              {demographics.devices.map((device) => (
                <div key={device.name}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">{device.name}</span>
                    <span className="text-sm font-semibold">{device.value}%</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ 
                        width: `${device.value}%`,
                        backgroundColor: device.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Locations */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-5 h-5" style={{ color: streamColor }} />
              <h3 className="font-semibold">Vị trí địa lý</h3>
            </div>
            <div className="space-y-3">
              {demographics.locations.map((location) => (
                <div key={location.name} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                  <span className="text-sm font-medium">{location.name}</span>
                  <span className="text-sm font-bold">{location.value}%</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Age Groups */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5" style={{ color: streamColor }} />
              <h3 className="font-semibold">Độ tuổi</h3>
            </div>
            <div className="space-y-3">
              {demographics.ageGroups.map((group) => (
                <div key={group.name}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">{group.name}</span>
                    <span className="text-sm font-semibold">{group.value}%</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ 
                        width: `${group.value}%`,
                        backgroundColor: streamColor,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Growth Rate */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5" style={{ color: streamColor }} />
              <h3 className="font-semibold">Tăng trưởng</h3>
            </div>
            <div className="space-y-4">
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                <p className="text-3xl font-bold text-green-600 dark:text-green-400 mb-1">+24%</p>
                <p className="text-sm text-muted-foreground">So với tháng trước</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-3 bg-secondary rounded-lg">
                  <p className="text-xl font-bold mb-1">+12%</p>
                  <p className="text-xs text-muted-foreground">Tuần này</p>
                </div>
                <div className="text-center p-3 bg-secondary rounded-lg">
                  <p className="text-xl font-bold mb-1">+8%</p>
                  <p className="text-xs text-muted-foreground">Hôm nay</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Benchmarks */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-5 h-5" style={{ color: streamColor }} />
              <h3 className="font-semibold">So sánh ngành</h3>
            </div>
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">Engagement rate</span>
                  <span className="text-sm font-semibold text-green-600">+2.3%</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-secondary rounded-full h-2">
                    <div
                      className="h-full rounded-full bg-green-500"
                      style={{ width: '85%' }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground">85%</span>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">Read completion</span>
                  <span className="text-sm font-semibold text-yellow-600">-1.2%</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-secondary rounded-full h-2">
                    <div
                      className="h-full rounded-full bg-yellow-500"
                      style={{ width: '68%' }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground">68%</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </PageWrapper>
  );
}