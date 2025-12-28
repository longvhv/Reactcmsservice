import { useState } from 'react';
import { 
  TrendingUp, TrendingDown, Eye, Users, Clock, MousePointer,
  BarChart3, PieChart, Activity, Globe, Share2, Heart,
  Calendar, Filter, Download, RefreshCw, ChevronDown,
  ArrowUp, ArrowDown, Minus, Zap, Target, Award
} from 'lucide-react';
import { motion } from 'motion/react';

interface AnalyticsData {
  overview: {
    pageViews: { value: number; change: number };
    uniqueVisitors: { value: number; change: number };
    avgTimeOnPage: { value: number; change: number };
    bounceRate: { value: number; change: number };
  };
  topArticles: Array<{
    id: string;
    title: string;
    views: number;
    change: number;
  }>;
  trafficSources: Array<{
    source: string;
    visits: number;
    percentage: number;
  }>;
  deviceBreakdown: Array<{
    device: string;
    percentage: number;
    count: number;
  }>;
  engagement: {
    likes: number;
    shares: number;
    comments: number;
    bookmarks: number;
  };
  timeSeriesData: Array<{
    date: string;
    views: number;
    visitors: number;
  }>;
}

export function AdvancedAnalytics() {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [isLoading, setIsLoading] = useState(false);

  // Mock analytics data
  const analytics: AnalyticsData = {
    overview: {
      pageViews: { value: 45280, change: 12.5 },
      uniqueVisitors: { value: 12340, change: 8.3 },
      avgTimeOnPage: { value: 245, change: -3.2 },
      bounceRate: { value: 42.5, change: -5.1 },
    },
    topArticles: [
      { id: '1', title: 'Complete Guide to React Hooks', views: 5420, change: 15.2 },
      { id: '2', title: 'TypeScript Best Practices 2024', views: 4250, change: 8.7 },
      { id: '3', title: 'Modern CSS Techniques', views: 3890, change: -2.3 },
      { id: '4', title: 'Node.js Performance Tips', views: 3560, change: 22.1 },
      { id: '5', title: 'GraphQL vs REST API', views: 3120, change: 5.4 },
    ],
    trafficSources: [
      { source: 'Organic Search', visits: 18750, percentage: 42 },
      { source: 'Direct', visits: 13140, percentage: 29 },
      { source: 'Social Media', visits: 8950, percentage: 20 },
      { source: 'Referral', visits: 4440, percentage: 9 },
    ],
    deviceBreakdown: [
      { device: 'Desktop', percentage: 52, count: 23546 },
      { device: 'Mobile', percentage: 38, count: 17206 },
      { device: 'Tablet', percentage: 10, count: 4528 },
    ],
    engagement: {
      likes: 8450,
      shares: 3200,
      comments: 1890,
      bookmarks: 2340,
    },
    timeSeriesData: [
      { date: '01/12', views: 1200, visitors: 450 },
      { date: '02/12', views: 1450, visitors: 520 },
      { date: '03/12', views: 1680, visitors: 610 },
      { date: '04/12', views: 1520, visitors: 580 },
      { date: '05/12', views: 1890, visitors: 720 },
      { date: '06/12', views: 2100, visitors: 820 },
      { date: '07/12', views: 1950, visitors: 750 },
    ],
  };

  const getTrendIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (change < 0) return <TrendingDown className="w-4 h-4 text-red-600" />;
    return <Minus className="w-4 h-4 text-gray-600" />;
  };

  const getTrendColor = (change: number) => {
    if (change > 0) return 'text-green-600';
    if (change < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const maxViews = Math.max(...analytics.timeSeriesData.map(d => d.views));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20">
            <BarChart3 className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl mb-1">Advanced Analytics</h1>
            <p className="text-sm text-muted-foreground">
              Phân tích chi tiết hiệu suất nội dung
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Time Range */}
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="px-4 py-2 rounded-xl bg-background/50 border border-border/40 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>

          <button
            onClick={() => setIsLoading(true)}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-muted/60 hover:bg-muted transition-all border border-border/40"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>

          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg shadow-blue-500/30">
            <Download className="w-4 h-4" />
            Export Report
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-4 gap-6">
        {[
          {
            label: 'Page Views',
            value: analytics.overview.pageViews.value,
            change: analytics.overview.pageViews.change,
            icon: Eye,
            color: 'blue',
          },
          {
            label: 'Unique Visitors',
            value: analytics.overview.uniqueVisitors.value,
            change: analytics.overview.uniqueVisitors.change,
            icon: Users,
            color: 'purple',
          },
          {
            label: 'Avg. Time on Page',
            value: formatDuration(analytics.overview.avgTimeOnPage.value),
            change: analytics.overview.avgTimeOnPage.change,
            icon: Clock,
            color: 'green',
          },
          {
            label: 'Bounce Rate',
            value: `${analytics.overview.bounceRate.value}%`,
            change: analytics.overview.bounceRate.change,
            icon: MousePointer,
            color: 'orange',
            invertChange: true,
          },
        ].map((metric, idx) => {
          const Icon = metric.icon;
          const change = metric.invertChange ? -metric.change : metric.change;
          
          return (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="glass-card p-6 hover:shadow-lg transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`
                  p-3 rounded-xl
                  ${metric.color === 'blue' ? 'bg-blue-500/10' : ''}
                  ${metric.color === 'purple' ? 'bg-purple-500/10' : ''}
                  ${metric.color === 'green' ? 'bg-green-500/10' : ''}
                  ${metric.color === 'orange' ? 'bg-orange-500/10' : ''}
                `}>
                  <Icon className={`
                    w-6 h-6
                    ${metric.color === 'blue' ? 'text-blue-600' : ''}
                    ${metric.color === 'purple' ? 'text-purple-600' : ''}
                    ${metric.color === 'green' ? 'text-green-600' : ''}
                    ${metric.color === 'orange' ? 'text-orange-600' : ''}
                  `} />
                </div>
                <div className={`flex items-center gap-1 text-sm ${getTrendColor(change)}`}>
                  {getTrendIcon(change)}
                  <span className="font-medium">{Math.abs(change)}%</span>
                </div>
              </div>
              
              <div className="text-3xl font-semibold mb-1">
                {typeof metric.value === 'number' ? formatNumber(metric.value) : metric.value}
              </div>
              <div className="text-sm text-muted-foreground">{metric.label}</div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Chart */}
        <div className="col-span-8 glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg">Traffic Overview</h3>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-blue-500" />
                <span className="text-muted-foreground">Page Views</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-purple-500" />
                <span className="text-muted-foreground">Unique Visitors</span>
              </div>
            </div>
          </div>

          {/* Simple Line Chart */}
          <div className="space-y-3">
            {analytics.timeSeriesData.map((data, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{data.date}</span>
                  <span>{formatNumber(data.views)} views • {formatNumber(data.visitors)} visitors</span>
                </div>
                <div className="flex gap-1 h-8">
                  <div
                    className="bg-gradient-to-r from-blue-600 to-blue-500 rounded transition-all hover:opacity-80"
                    style={{ width: `${(data.views / maxViews) * 100}%` }}
                    title={`${data.views} views`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Traffic Sources */}
        <div className="col-span-4 glass-card p-6">
          <h3 className="text-lg mb-6 flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Traffic Sources
          </h3>

          <div className="space-y-4">
            {analytics.trafficSources.map((source, idx) => (
              <div key={idx}>
                <div className="flex items-center justify-between mb-2 text-sm">
                  <span>{source.source}</span>
                  <span className="font-medium">{source.percentage}%</span>
                </div>
                <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${source.percentage}%` }}
                    transition={{ delay: idx * 0.1, duration: 0.5 }}
                    className={`
                      h-full rounded-full
                      ${idx === 0 ? 'bg-gradient-to-r from-blue-600 to-blue-500' : ''}
                      ${idx === 1 ? 'bg-gradient-to-r from-purple-600 to-purple-500' : ''}
                      ${idx === 2 ? 'bg-gradient-to-r from-pink-600 to-pink-500' : ''}
                      ${idx === 3 ? 'bg-gradient-to-r from-orange-600 to-orange-500' : ''}
                    `}
                  />
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {formatNumber(source.visits)} visits
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Top Articles */}
        <div className="col-span-7 glass-card p-6">
          <h3 className="text-lg mb-6 flex items-center gap-2">
            <Award className="w-5 h-5" />
            Top Performing Articles
          </h3>

          <div className="space-y-3">
            {analytics.topArticles.map((article, idx) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="flex items-center gap-4 p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-all"
              >
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm
                  ${idx === 0 ? 'bg-gradient-to-br from-yellow-500 to-yellow-600 text-white' : ''}
                  ${idx === 1 ? 'bg-gradient-to-br from-gray-400 to-gray-500 text-white' : ''}
                  ${idx === 2 ? 'bg-gradient-to-br from-orange-600 to-orange-700 text-white' : ''}
                  ${idx > 2 ? 'bg-muted text-muted-foreground' : ''}
                `}>
                  #{idx + 1}
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="font-medium line-clamp-1">{article.title}</h4>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                    <span>{formatNumber(article.views)} views</span>
                    <div className={`flex items-center gap-1 ${getTrendColor(article.change)}`}>
                      {getTrendIcon(article.change)}
                      <span>{Math.abs(article.change)}%</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Device & Engagement */}
        <div className="col-span-5 space-y-6">
          {/* Device Breakdown */}
          <div className="glass-card p-6">
            <h3 className="text-lg mb-6 flex items-center gap-2">
              <PieChart className="w-5 h-5" />
              Device Breakdown
            </h3>

            <div className="space-y-3">
              {analytics.deviceBreakdown.map((device, idx) => (
                <div key={idx}>
                  <div className="flex items-center justify-between mb-2 text-sm">
                    <span>{device.device}</span>
                    <span className="font-medium">{device.percentage}%</span>
                  </div>
                  <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${device.percentage}%` }}
                      transition={{ delay: idx * 0.1, duration: 0.5 }}
                      className={`
                        h-full rounded-full
                        ${idx === 0 ? 'bg-gradient-to-r from-blue-600 to-blue-500' : ''}
                        ${idx === 1 ? 'bg-gradient-to-r from-purple-600 to-purple-500' : ''}
                        ${idx === 2 ? 'bg-gradient-to-r from-pink-600 to-pink-500' : ''}
                      `}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Engagement */}
          <div className="glass-card p-6">
            <h3 className="text-lg mb-6 flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Engagement Metrics
            </h3>

            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Likes', value: analytics.engagement.likes, icon: Heart, color: 'red' },
                { label: 'Shares', value: analytics.engagement.shares, icon: Share2, color: 'blue' },
                { label: 'Comments', value: analytics.engagement.comments, icon: Users, color: 'purple' },
                { label: 'Bookmarks', value: analytics.engagement.bookmarks, icon: Target, color: 'green' },
              ].map((metric) => {
                const Icon = metric.icon;
                return (
                  <div
                    key={metric.label}
                    className="p-4 rounded-xl bg-muted/30 text-center"
                  >
                    <Icon className={`
                      w-6 h-6 mx-auto mb-2
                      ${metric.color === 'red' ? 'text-red-600' : ''}
                      ${metric.color === 'blue' ? 'text-blue-600' : ''}
                      ${metric.color === 'purple' ? 'text-purple-600' : ''}
                      ${metric.color === 'green' ? 'text-green-600' : ''}
                    `} />
                    <div className="text-2xl font-semibold mb-1">
                      {formatNumber(metric.value)}
                    </div>
                    <div className="text-xs text-muted-foreground">{metric.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
