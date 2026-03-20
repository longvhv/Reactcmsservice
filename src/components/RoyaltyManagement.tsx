import React, { useState } from 'react';
import {
  DollarSign, TrendingUp, Users, FileText, Calendar, Download,
  Settings, Plus, Edit, Trash2, Eye, Filter, Search, ChevronDown,
  Award, BarChart3, PieChart, Clock, CheckCircle, AlertCircle
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface RoyaltyConfig {
  id: string;
  name: string;
  type: 'per_article' | 'per_view' | 'per_category' | 'per_type' | 'fixed_monthly';
  articleType?: string;
  category?: string;
  amount: number;
  unit: 'VND' | 'USD';
  conditions?: {
    minViews?: number;
    minWords?: number;
    quality?: 'draft' | 'published' | 'featured';
  };
  active: boolean;
  createdAt: string;
}

interface AuthorRoyalty {
  authorId: string;
  authorName: string;
  authorEmail: string;
  avatar?: string;
  articles: {
    total: number;
    published: number;
    draft: number;
  };
  views: {
    total: number;
    thisMonth: number;
    lastMonth: number;
  };
  royalty: {
    total: number;
    thisMonth: number;
    lastMonth: number;
    pending: number;
    paid: number;
  };
  breakdown: {
    articleCount: number;
    viewCount: number;
    bonuses: number;
  };
}

interface RoyaltyTransaction {
  id: string;
  authorId: string;
  authorName: string;
  amount: number;
  type: 'article' | 'view' | 'bonus' | 'fixed';
  description: string;
  articleId?: string;
  articleTitle?: string;
  date: string;
  status: 'pending' | 'approved' | 'paid';
}

export function RoyaltyManagement() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'overview' | 'configs' | 'authors' | 'transactions' | 'reports'>('overview');
  const [selectedPeriod, setSelectedPeriod] = useState<'thisMonth' | 'lastMonth' | 'thisYear' | 'custom'>('thisMonth');
  const [searchTerm, setSearchTerm] = useState('');
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [editingConfig, setEditingConfig] = useState<RoyaltyConfig | null>(null);

  // Mock data - sẽ fetch từ backend
  const [configs, setConfigs] = useState<RoyaltyConfig[]>([
    {
      id: '1',
      name: 'Nhuận bút tin tức',
      type: 'per_article',
      articleType: 'news',
      amount: 200000,
      unit: 'VND',
      conditions: { minWords: 500, quality: 'published' },
      active: true,
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      name: 'Nhuận bút video',
      type: 'per_article',
      articleType: 'video',
      amount: 500000,
      unit: 'VND',
      conditions: { quality: 'published' },
      active: true,
      createdAt: '2024-01-15'
    },
    {
      id: '3',
      name: 'Thưởng theo lượt xem',
      type: 'per_view',
      amount: 100,
      unit: 'VND',
      conditions: { minViews: 1000 },
      active: true,
      createdAt: '2024-01-15'
    },
    {
      id: '4',
      name: 'Lương cố định biên tập viên',
      type: 'fixed_monthly',
      amount: 5000000,
      unit: 'VND',
      active: true,
      createdAt: '2024-01-15'
    }
  ]);

  const [authors, setAuthors] = useState<AuthorRoyalty[]>([
    {
      authorId: '1',
      authorName: 'Nguyễn Văn A',
      authorEmail: 'nguyenvana@example.com',
      articles: { total: 45, published: 42, draft: 3 },
      views: { total: 125000, thisMonth: 15000, lastMonth: 12000 },
      royalty: {
        total: 18500000,
        thisMonth: 2500000,
        lastMonth: 2200000,
        pending: 500000,
        paid: 18000000
      },
      breakdown: { articleCount: 8, viewCount: 15000, bonuses: 100000 }
    },
    {
      authorId: '2',
      authorName: 'Trần Thị B',
      authorEmail: 'tranthib@example.com',
      articles: { total: 32, published: 30, draft: 2 },
      views: { total: 98000, thisMonth: 11000, lastMonth: 9500 },
      royalty: {
        total: 12800000,
        thisMonth: 1900000,
        lastMonth: 1700000,
        pending: 300000,
        paid: 12500000
      },
      breakdown: { articleCount: 6, viewCount: 11000, bonuses: 50000 }
    },
    {
      authorId: '3',
      authorName: 'Lê Văn C',
      authorEmail: 'levanc@example.com',
      articles: { total: 28, published: 25, draft: 3 },
      views: { total: 76000, thisMonth: 8500, lastMonth: 7200 },
      royalty: {
        total: 9600000,
        thisMonth: 1500000,
        lastMonth: 1300000,
        pending: 200000,
        paid: 9400000
      },
      breakdown: { articleCount: 5, viewCount: 8500, bonuses: 30000 }
    }
  ]);

  const [transactions, setTransactions] = useState<RoyaltyTransaction[]>([
    {
      id: 't1',
      authorId: '1',
      authorName: 'Nguyễn Văn A',
      amount: 200000,
      type: 'article',
      description: 'Nhuận bút tin tức',
      articleId: 'a1',
      articleTitle: 'Breaking News: Important Event',
      date: '2024-12-25',
      status: 'paid'
    },
    {
      id: 't2',
      authorId: '1',
      authorName: 'Nguyễn Văn A',
      amount: 150000,
      type: 'view',
      description: 'Thưởng lượt xem (1500 views)',
      articleId: 'a1',
      articleTitle: 'Breaking News: Important Event',
      date: '2024-12-26',
      status: 'approved'
    },
    {
      id: 't3',
      authorId: '2',
      authorName: 'Trần Thị B',
      amount: 500000,
      type: 'article',
      description: 'Nhuận bút video',
      articleId: 'v1',
      articleTitle: 'Video Review: New Product Launch',
      date: '2024-12-27',
      status: 'pending'
    }
  ]);

  const totalStats = {
    totalAuthors: authors.length,
    totalArticles: authors.reduce((sum, a) => sum + a.articles.total, 0),
    totalRoyaltyThisMonth: authors.reduce((sum, a) => sum + a.royalty.thisMonth, 0),
    totalPending: authors.reduce((sum, a) => sum + a.royalty.pending, 0),
    avgRoyaltyPerAuthor: authors.reduce((sum, a) => sum + a.royalty.thisMonth, 0) / authors.length,
    topAuthor: authors.sort((a, b) => b.royalty.thisMonth - a.royalty.thisMonth)[0]
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const exportReport = () => {
    // Export to CSV/Excel
    const csvData = authors.map(author => ({
      'Tác giả': author.authorName,
      'Email': author.authorEmail,
      'Tổng bài viết': author.articles.total,
      'Bài đã xuất bản': author.articles.published,
      'Lượt xem tháng này': author.views.thisMonth,
      'Nhuận bút tháng này': author.royalty.thisMonth,
      'Đang chờ': author.royalty.pending,
      'Đã thanh toán': author.royalty.paid
    }));

    const csvContent = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `royalty_report_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-40">
        <div className="max-w-[1600px] mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent flex items-center gap-3">
                <DollarSign className="w-8 h-8 text-blue-600" />
                Quản Lý Nhuận Bút
              </h1>
              <p className="text-slate-600 mt-1">Tính toán và quản lý thù lao tác giả</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={exportReport}
                className="px-4 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium transition-all flex items-center gap-2 shadow-lg shadow-green-500/30"
              >
                <Download className="w-4 h-4" />
                Xuất báo cáo
              </button>
              <button
                onClick={() => setShowConfigModal(true)}
                className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-medium transition-all flex items-center gap-2 shadow-lg shadow-blue-500/30"
              >
                <Plus className="w-4 h-4" />
                Cấu hình mới
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mt-6">
            {[
              { id: 'overview', label: 'Tổng quan', icon: BarChart3 },
              { id: 'configs', label: 'Cấu hình', icon: Settings },
              { id: 'authors', label: 'Tác giả', icon: Users },
              { id: 'transactions', label: 'Giao dịch', icon: FileText },
              { id: 'reports', label: 'Báo cáo', icon: PieChart }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'bg-white text-blue-600 shadow-lg'
                    : 'text-slate-600 hover:bg-white/50'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-8 py-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200/60">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <span className="text-2xl">👥</span>
                </div>
                <div className="text-3xl font-bold text-slate-900">{totalStats.totalAuthors}</div>
                <div className="text-sm text-slate-600 mt-1">Tổng số tác giả</div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200/60">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-green-100 rounded-xl">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                  <span className="text-2xl">💰</span>
                </div>
                <div className="text-3xl font-bold text-slate-900">{formatCurrency(totalStats.totalRoyaltyThisMonth)}</div>
                <div className="text-sm text-slate-600 mt-1">Tổng nhuận bút tháng này</div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200/60">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-orange-100 rounded-xl">
                    <Clock className="w-6 h-6 text-orange-600" />
                  </div>
                  <span className="text-2xl">⏳</span>
                </div>
                <div className="text-3xl font-bold text-slate-900">{formatCurrency(totalStats.totalPending)}</div>
                <div className="text-sm text-slate-600 mt-1">Đang chờ thanh toán</div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200/60">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-purple-100 rounded-xl">
                    <Award className="w-6 h-6 text-purple-600" />
                  </div>
                  <span className="text-2xl">⭐</span>
                </div>
                <div className="text-3xl font-bold text-slate-900">{formatCurrency(totalStats.avgRoyaltyPerAuthor)}</div>
                <div className="text-sm text-slate-600 mt-1">Trung bình/tác giả</div>
              </div>
            </div>

            {/* Top Authors */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200/60">
              <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                Top 3 Tác Giả Tháng Này
              </h3>
              <div className="space-y-4">
                {authors
                  .sort((a, b) => b.royalty.thisMonth - a.royalty.thisMonth)
                  .slice(0, 3)
                  .map((author, index) => (
                    <div key={author.authorId} className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                      <div className={`text-2xl ${index === 0 ? 'text-yellow-500' : index === 1 ? 'text-slate-400' : 'text-amber-600'}`}>
                        {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-slate-900">{author.authorName}</div>
                        <div className="text-sm text-slate-600">{author.articles.published} bài viết • {author.views.thisMonth.toLocaleString()} lượt xem</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-green-600">{formatCurrency(author.royalty.thisMonth)}</div>
                        <div className="text-sm text-slate-600">Nhuận bút</div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* Configs Tab */}
        {activeTab === 'configs' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200/60 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Tên cấu hình</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Loại</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Áp dụng cho</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Mức thưởng</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Điều kiện</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Trạng thái</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {configs.map((config) => (
                      <tr key={config.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-medium text-slate-900">{config.name}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                            {config.type === 'per_article' ? 'Theo bài viết' :
                             config.type === 'per_view' ? 'Theo lượt xem' :
                             config.type === 'fixed_monthly' ? 'Cố định hàng tháng' : 'Theo danh mục'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {config.articleType || config.category || 'Tất cả'}
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-semibold text-green-600">{formatCurrency(config.amount)}</div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {config.conditions?.minWords && `≥${config.conditions.minWords} từ`}
                          {config.conditions?.minViews && `≥${config.conditions.minViews} views`}
                          {config.conditions?.quality && ` • ${config.conditions.quality}`}
                        </td>
                        <td className="px-6 py-4">
                          {config.active ? (
                            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium flex items-center gap-1 w-fit">
                              <CheckCircle className="w-3 h-3" />
                              Hoạt động
                            </span>
                          ) : (
                            <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium flex items-center gap-1 w-fit">
                              <AlertCircle className="w-3 h-3" />
                              Tạm dừng
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors" title="Chỉnh sửa">
                              <Edit className="w-4 h-4 text-slate-600" />
                            </button>
                            <button className="p-2 hover:bg-red-50 rounded-lg transition-colors" title="Xóa">
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Authors Tab */}
        {activeTab === 'authors' && (
          <div className="space-y-6">
            {/* Search & Filter */}
            <div className="bg-white rounded-2xl p-4 shadow-lg border border-slate-200/60 flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm tác giả..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <select className="px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Tháng này</option>
                <option>Tháng trước</option>
                <option>Năm nay</option>
                <option>Tùy chỉnh</option>
              </select>
            </div>

            {/* Authors List */}
            <div className="grid gap-6">
              {authors
                .filter(author => author.authorName.toLowerCase().includes(searchTerm.toLowerCase()))
                .map((author) => (
                  <div key={author.authorId} className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200/60">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
                          {author.authorName.charAt(0)}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-slate-900">{author.authorName}</h3>
                          <p className="text-sm text-slate-600">{author.authorEmail}</p>
                        </div>
                      </div>
                      <button className="px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-xl font-medium transition-colors flex items-center gap-2">
                        <Eye className="w-4 h-4" />
                        Chi tiết
                      </button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                      <div>
                        <div className="text-sm text-slate-600 mb-1">Tổng bài viết</div>
                        <div className="text-2xl font-bold text-slate-900">{author.articles.total}</div>
                        <div className="text-xs text-green-600 mt-1">+{author.breakdown.articleCount} tháng này</div>
                      </div>
                      <div>
                        <div className="text-sm text-slate-600 mb-1">Lượt xem</div>
                        <div className="text-2xl font-bold text-slate-900">{author.views.thisMonth.toLocaleString()}</div>
                        <div className="text-xs text-slate-500 mt-1">{author.views.total.toLocaleString()} tổng</div>
                      </div>
                      <div>
                        <div className="text-sm text-slate-600 mb-1">Nhuận bút tháng này</div>
                        <div className="text-2xl font-bold text-green-600">{formatCurrency(author.royalty.thisMonth)}</div>
                      </div>
                      <div>
                        <div className="text-sm text-slate-600 mb-1">Đang chờ</div>
                        <div className="text-2xl font-bold text-orange-600">{formatCurrency(author.royalty.pending)}</div>
                      </div>
                      <div>
                        <div className="text-sm text-slate-600 mb-1">Đã thanh toán</div>
                        <div className="text-2xl font-bold text-blue-600">{formatCurrency(author.royalty.paid)}</div>
                      </div>
                    </div>

                    {/* Breakdown */}
                    <div className="mt-6 pt-6 border-t border-slate-200">
                      <div className="text-sm text-slate-600 mb-3">Chi tiết nhuận bút tháng này:</div>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-blue-600" />
                          <span className="text-sm text-slate-700">Bài viết: <strong>{formatCurrency(author.breakdown.articleCount * 200000)}</strong></span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Eye className="w-4 h-4 text-green-600" />
                          <span className="text-sm text-slate-700">Lượt xem: <strong>{formatCurrency(author.breakdown.viewCount * 100)}</strong></span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Award className="w-4 h-4 text-purple-600" />
                          <span className="text-sm text-slate-700">Thưởng: <strong>{formatCurrency(author.breakdown.bonuses)}</strong></span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Transactions Tab */}
        {activeTab === 'transactions' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200/60 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Ngày</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Tác giả</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Loại</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Mô tả</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Bài viết</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Số tiền</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {transactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 text-sm text-slate-600">{tx.date}</td>
                        <td className="px-6 py-4">
                          <div className="font-medium text-slate-900">{tx.authorName}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            tx.type === 'article' ? 'bg-blue-100 text-blue-700' :
                            tx.type === 'view' ? 'bg-green-100 text-green-700' :
                            tx.type === 'bonus' ? 'bg-purple-100 text-purple-700' :
                            'bg-orange-100 text-orange-700'
                          }`}>
                            {tx.type === 'article' ? '📝 Bài viết' :
                             tx.type === 'view' ? '👁️ Lượt xem' :
                             tx.type === 'bonus' ? '🎁 Thưởng' : '💰 Cố định'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">{tx.description}</td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {tx.articleTitle ? (
                            <span className="text-blue-600 hover:underline cursor-pointer">{tx.articleTitle}</span>
                          ) : '-'}
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-semibold text-green-600">{formatCurrency(tx.amount)}</div>
                        </td>
                        <td className="px-6 py-4">
                          {tx.status === 'paid' ? (
                            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">✓ Đã thanh toán</span>
                          ) : tx.status === 'approved' ? (
                            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">✓ Đã duyệt</span>
                          ) : (
                            <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">⏳ Chờ duyệt</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200/60">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Thống kê nhuận bút theo thời gian</h3>
              <div className="h-64 flex items-center justify-center text-slate-400">
                <BarChart3 className="w-16 h-16" />
                <span className="ml-4">Biểu đồ thống kê (tích hợp Recharts)</span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200/60">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Phân bố theo loại nhuận bút</h3>
                <div className="h-64 flex items-center justify-center text-slate-400">
                  <PieChart className="w-16 h-16" />
                  <span className="ml-4">Biểu đồ tròn</span>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200/60">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Top loại bài viết</h3>
                <div className="space-y-3">
                  {[
                    { type: 'Tin tức', count: 45, amount: 9000000, color: 'blue' },
                    { type: 'Video', count: 12, amount: 6000000, color: 'purple' },
                    { type: 'Gallery', count: 28, amount: 5600000, color: 'green' },
                    { type: 'Sự kiện', count: 15, amount: 3000000, color: 'orange' }
                  ].map((item) => (
                    <div key={item.type} className="flex items-center gap-3">
                      <div className={`w-2 h-12 bg-${item.color}-500 rounded-full`}></div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium text-slate-900">{item.type}</span>
                          <span className="text-sm font-semibold text-green-600">{formatCurrency(item.amount)}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs text-slate-600">
                          <span>{item.count} bài viết</span>
                          <span>{((item.amount / totalStats.totalRoyaltyThisMonth) * 100).toFixed(1)}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Config Modal */}
      {showConfigModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900">Tạo cấu hình nhuận bút mới</h3>
              <button
                onClick={() => setShowConfigModal(false)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Tên cấu hình</label>
                <input
                  type="text"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="VD: Nhuận bút tin tức"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Loại nhuận bút</label>
                <select className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="per_article">Theo bài viết</option>
                  <option value="per_view">Theo lượt xem</option>
                  <option value="per_category">Theo danh mục</option>
                  <option value="per_type">Theo loại bài viết</option>
                  <option value="fixed_monthly">Cố định hàng tháng</option>
                </select>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Số tiền</label>
                  <input
                    type="number"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="200000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Đơn vị</label>
                  <select className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="VND">VND</option>
                    <option value="USD">USD</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Điều kiện (tùy chọn)</label>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm text-slate-600">Số từ tối thiểu:</span>
                    <input type="number" placeholder="500" className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm w-24" />
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm text-slate-600">Lượt xem tối thiểu:</span>
                    <input type="number" placeholder="1000" className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm w-24" />
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm text-slate-600">Chất lượng:</span>
                    <select className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm">
                      <option value="published">Đã xuất bản</option>
                      <option value="featured">Nổi bật</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input type="checkbox" className="rounded" defaultChecked />
                <span className="text-sm text-slate-700">Kích hoạt ngay</span>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white border-t border-slate-200 px-6 py-4 flex gap-3 justify-end">
              <button
                onClick={() => setShowConfigModal(false)}
                className="px-6 py-2.5 border border-slate-200 hover:bg-slate-50 rounded-xl font-medium transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={() => {
                  // Save logic
                  setShowConfigModal(false);
                }}
                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-medium transition-all shadow-lg shadow-blue-500/30"
              >
                Lưu cấu hình
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
