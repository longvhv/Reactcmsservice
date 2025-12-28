import { useState } from 'react';
import {
  TrendingUp, TrendingDown, Clock, CheckCircle2, XCircle,
  Users, FileText, AlertCircle, BarChart3, PieChart,
  Calendar, Filter, Download, RefreshCw
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface ApprovalStats {
  pending: number;
  approved: number;
  rejected: number;
  requestChanges: number;
  avgApprovalTime: number; // in hours
  approvalRate: number; // percentage
  totalThisWeek: number;
  totalThisMonth: number;
}

interface ReviewerPerformance {
  id: string;
  name: string;
  avatar?: string;
  reviewed: number;
  approved: number;
  rejected: number;
  avgTime: number; // hours
  rating: number; // 1-5
}

export function ApprovalDashboard() {
  const { t } = useLanguage();
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter'>('week');

  // Mock data
  const stats: ApprovalStats = {
    pending: 23,
    approved: 156,
    rejected: 12,
    requestChanges: 8,
    avgApprovalTime: 4.5,
    approvalRate: 87.5,
    totalThisWeek: 45,
    totalThisMonth: 199,
  };

  const reviewers: ReviewerPerformance[] = [
    {
      id: '1',
      name: 'Nguyễn Editor A',
      reviewed: 45,
      approved: 38,
      rejected: 5,
      avgTime: 3.2,
      rating: 4.8,
    },
    {
      id: '2',
      name: 'Trần Editor B',
      reviewed: 38,
      approved: 32,
      rejected: 4,
      avgTime: 4.1,
      rating: 4.6,
    },
    {
      id: '3',
      name: 'Lê Editor C',
      reviewed: 32,
      approved: 28,
      rejected: 3,
      avgTime: 3.8,
      rating: 4.7,
    },
  ];

  const categoryStats = [
    { name: 'Công nghệ', pending: 8, approved: 45, rejected: 3 },
    { name: 'Marketing', pending: 6, approved: 32, rejected: 2 },
    { name: 'Design', pending: 5, approved: 28, rejected: 1 },
    { name: 'Business', pending: 4, approved: 25, rejected: 4 },
  ];

  const timeSeriesData = [
    { date: 'T2', approved: 12, rejected: 2, pending: 5 },
    { date: 'T3', approved: 15, rejected: 1, pending: 6 },
    { date: 'T4', approved: 18, rejected: 3, pending: 4 },
    { date: 'T5', approved: 14, rejected: 2, pending: 7 },
    { date: 'T6', approved: 20, rejected: 1, pending: 8 },
    { date: 'T7', approved: 16, rejected: 2, pending: 3 },
    { date: 'CN', approved: 11, rejected: 1, pending: 2 },
  ];

  const maxValue = Math.max(...timeSeriesData.flatMap(d => [d.approved, d.rejected, d.pending]));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-2">Dashboard Kiểm duyệt</h1>
          <p className="text-muted-foreground">
            Theo dõi hiệu suất và trạng thái kiểm duyệt nội dung
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Time Range Selector */}
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="px-4 py-2 rounded-xl bg-background/50 border border-border/40 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
          >
            <option value="week">7 ngày qua</option>
            <option value="month">30 ngày qua</option>
            <option value="quarter">90 ngày qua</option>
          </select>

          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-muted/60 hover:bg-muted transition-all">
            <Download className="w-4 h-4" />
            Export
          </button>

          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg shadow-blue-500/30">
            <RefreshCw className="w-4 h-4" />
            Làm mới
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-4 gap-6">
        {/* Pending */}
        <div className="glass-card p-6 relative overflow-hidden group hover:shadow-lg transition-all">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-yellow-500/10">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="flex items-center gap-1 text-sm">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="text-green-600">+12%</span>
              </div>
            </div>
            <div className="text-3xl mb-1">{stats.pending}</div>
            <div className="text-sm text-muted-foreground">Chờ duyệt</div>
          </div>
        </div>

        {/* Approved */}
        <div className="glass-card p-6 relative overflow-hidden group hover:shadow-lg transition-all">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-green-500/10">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex items-center gap-1 text-sm">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="text-green-600">+8%</span>
              </div>
            </div>
            <div className="text-3xl mb-1">{stats.approved}</div>
            <div className="text-sm text-muted-foreground">Đã duyệt</div>
          </div>
        </div>

        {/* Rejected */}
        <div className="glass-card p-6 relative overflow-hidden group hover:shadow-lg transition-all">
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-rose-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-red-500/10">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
              <div className="flex items-center gap-1 text-sm">
                <TrendingDown className="w-4 h-4 text-red-600" />
                <span className="text-red-600">-3%</span>
              </div>
            </div>
            <div className="text-3xl mb-1">{stats.rejected}</div>
            <div className="text-sm text-muted-foreground">Từ chối</div>
          </div>
        </div>

        {/* Approval Rate */}
        <div className="glass-card p-6 relative overflow-hidden group hover:shadow-lg transition-all">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-blue-500/10">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex items-center gap-1 text-sm">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="text-green-600">+2.5%</span>
              </div>
            </div>
            <div className="text-3xl mb-1">{stats.approvalRate}%</div>
            <div className="text-sm text-muted-foreground">Tỷ lệ duyệt</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Trend Chart */}
        <div className="col-span-2 glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg mb-1">Xu hướng kiểm duyệt</h3>
              <p className="text-sm text-muted-foreground">7 ngày gần nhất</p>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-green-500" />
                <span className="text-muted-foreground">Đã duyệt</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-red-500" />
                <span className="text-muted-foreground">Từ chối</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-yellow-500" />
                <span className="text-muted-foreground">Chờ duyệt</span>
              </div>
            </div>
          </div>

          {/* Simple Bar Chart */}
          <div className="space-y-4">
            {timeSeriesData.map((data) => (
              <div key={data.date} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground w-8">{data.date}</span>
                  <span className="text-xs text-muted-foreground">
                    {data.approved + data.rejected + data.pending} bài
                  </span>
                </div>
                <div className="flex gap-1 h-8">
                  <div
                    className="bg-gradient-to-r from-green-600 to-green-500 rounded transition-all hover:opacity-80"
                    style={{ width: `${(data.approved / maxValue) * 100}%` }}
                    title={`Đã duyệt: ${data.approved}`}
                  />
                  <div
                    className="bg-gradient-to-r from-red-600 to-red-500 rounded transition-all hover:opacity-80"
                    style={{ width: `${(data.rejected / maxValue) * 100}%` }}
                    title={`Từ chối: ${data.rejected}`}
                  />
                  <div
                    className="bg-gradient-to-r from-yellow-600 to-yellow-500 rounded transition-all hover:opacity-80"
                    style={{ width: `${(data.pending / maxValue) * 100}%` }}
                    title={`Chờ duyệt: ${data.pending}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Average Time & Stats */}
        <div className="space-y-6">
          {/* Avg Approval Time */}
          <div className="glass-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-purple-500/10">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
              <div className="flex-1">
                <div className="text-2xl">{stats.avgApprovalTime}h</div>
                <div className="text-sm text-muted-foreground">Thời gian TB</div>
              </div>
            </div>
            <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
              <div className="h-full w-3/4 bg-gradient-to-r from-purple-600 to-purple-500" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Nhanh hơn 25% so với tháng trước
            </p>
          </div>

          {/* This Week */}
          <div className="glass-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-blue-500/10">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <div className="text-2xl">{stats.totalThisWeek}</div>
                <div className="text-sm text-muted-foreground">Tuần này</div>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Trung bình/ngày</span>
                <span className="font-medium">{Math.round(stats.totalThisWeek / 7)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">So với tuần trước</span>
                <span className="text-green-600 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  +15%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviewer Performance & Category Stats */}
      <div className="grid grid-cols-2 gap-6">
        {/* Top Reviewers */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg">Hiệu suất Reviewer</h3>
            <Users className="w-5 h-5 text-muted-foreground" />
          </div>

          <div className="space-y-3">
            {reviewers.map((reviewer, idx) => (
              <div
                key={reviewer.id}
                className="p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-all cursor-pointer border border-border/40"
              >
                <div className="flex items-center gap-4">
                  {/* Rank */}
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center font-medium text-sm
                    ${idx === 0 ? 'bg-gradient-to-br from-yellow-500 to-yellow-600 text-white' : ''}
                    ${idx === 1 ? 'bg-gradient-to-br from-gray-400 to-gray-500 text-white' : ''}
                    ${idx === 2 ? 'bg-gradient-to-br from-orange-600 to-orange-700 text-white' : ''}
                    ${idx > 2 ? 'bg-muted text-muted-foreground' : ''}
                  `}>
                    #{idx + 1}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{reviewer.name}</h4>
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-500">★</span>
                        <span className="text-sm font-medium">{reviewer.rating}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3 text-xs text-muted-foreground">
                      <div>
                        <div className="font-medium text-foreground">{reviewer.reviewed}</div>
                        <div>Đã xem</div>
                      </div>
                      <div>
                        <div className="font-medium text-green-600">{reviewer.approved}</div>
                        <div>Duyệt</div>
                      </div>
                      <div>
                        <div className="font-medium text-foreground">{reviewer.avgTime}h</div>
                        <div>TB thời gian</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category Stats */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg">Theo danh mục</h3>
            <PieChart className="w-5 h-5 text-muted-foreground" />
          </div>

          <div className="space-y-4">
            {categoryStats.map((cat) => {
              const total = cat.pending + cat.approved + cat.rejected;
              const approvalRate = Math.round((cat.approved / total) * 100);

              return (
                <div key={cat.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{cat.name}</span>
                    <span className="text-sm text-muted-foreground">{total} bài</span>
                  </div>

                  {/* Progress Bar */}
                  <div className="flex gap-1 h-2">
                    <div
                      className="bg-green-500 rounded-full transition-all"
                      style={{ width: `${(cat.approved / total) * 100}%` }}
                      title={`Đã duyệt: ${cat.approved}`}
                    />
                    <div
                      className="bg-yellow-500 rounded-full transition-all"
                      style={{ width: `${(cat.pending / total) * 100}%` }}
                      title={`Chờ duyệt: ${cat.pending}`}
                    />
                    <div
                      className="bg-red-500 rounded-full transition-all"
                      style={{ width: `${(cat.rejected / total) * 100}%` }}
                      title={`Từ chối: ${cat.rejected}`}
                    />
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      <span>{cat.approved}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-yellow-500" />
                      <span>{cat.pending}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-red-500" />
                      <span>{cat.rejected}</span>
                    </div>
                    <div className="ml-auto">
                      <span className="text-green-600 font-medium">{approvalRate}%</span> tỷ lệ duyệt
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}