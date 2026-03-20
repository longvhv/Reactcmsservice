import React, { useState, useMemo } from 'react';
import {
  FileText, Search, Filter, Calendar, Eye, Coins, Edit, Trash2,
  Plus, ChevronDown, ArrowUpDown, Newspaper, Video, Image as ImageIcon,
  Headphones, Download as DownloadIcon, ExternalLink, BarChart3,
  CheckCircle, Clock, AlertCircle, MoreVertical
} from 'lucide-react';
import { motion } from 'motion/react';
import { useArticles } from '../hooks/useArticles';
import { calculateArticleRoyalty } from '../utils/royaltyCalculations';

interface ReporterMyArticlesProps {
  onNavigate?: (page: string) => void;
  currentUserId: number;
}

export function ReporterMyArticles({ onNavigate, currentUserId }: ReporterMyArticlesProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date-desc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

  // Load articles from database
  const { articles, loading } = useArticles();

  // Get user's articles with royalty calculation
  const myArticles = useMemo(() => {
    return articles
      .filter(a => a.authorId === currentUserId)
      .map(article => {
        const royalty = calculateArticleRoyalty(article);
        const statusSeed = article.id % 3;
        let royaltyStatus: 'pending' | 'calculated' | 'paid' = 'pending';
        if (statusSeed === 0) royaltyStatus = 'paid';
        else if (statusSeed === 1) royaltyStatus = 'calculated';
        
        return {
          ...article,
          royaltyAmount: royalty.totalAmount,
          royaltyStatus,
          calculation: royalty.calculation
        };
      });
  }, [articles, currentUserId]);

  // Filter and sort
  const filteredArticles = useMemo(() => {
    let filtered = myArticles;

    // Search
    if (searchQuery) {
      filtered = filtered.filter(a =>
        a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(a => a.status === statusFilter);
    }

    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(a => a.type === typeFilter);
    }

    // Sort
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'date-desc':
          return new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime();
        case 'date-asc':
          return new Date(a.publishDate).getTime() - new Date(b.publishDate).getTime();
        case 'views-desc':
          return b.views - a.views;
        case 'views-asc':
          return a.views - b.views;
        case 'royalty-desc':
          return b.royaltyAmount - a.royaltyAmount;
        case 'royalty-asc':
          return a.royaltyAmount - b.royaltyAmount;
        case 'title-asc':
          return a.title.localeCompare(b.title);
        case 'title-desc':
          return b.title.localeCompare(a.title);
        default:
          return 0;
      }
    });

    return filtered;
  }, [myArticles, searchQuery, statusFilter, typeFilter, sortBy]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('vi-VN', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
  };

  const getStatusBadge = (status: string) => {
    const config: Record<string, { label: string; color: string; icon: any }> = {
      published: { label: 'Đã xuất bản', color: 'bg-green-100 text-green-700 border-green-200', icon: CheckCircle },
      draft: { label: 'Nháp', color: 'bg-slate-100 text-slate-700 border-slate-200', icon: Edit },
      pending: { label: 'Chờ duyệt', color: 'bg-yellow-100 text-yellow-700 border-yellow-200', icon: Clock }
    };
    const { label, color, icon: Icon } = config[status] || config.draft;
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium border ${color}`}>
        <Icon className="w-3 h-3" />
        {label}
      </span>
    );
  };

  const getRoyaltyStatusBadge = (status: string) => {
    const config: Record<string, { label: string; color: string }> = {
      paid: { label: 'Đã trả', color: 'bg-green-100 text-green-700' },
      calculated: { label: 'Đã tính', color: 'bg-blue-100 text-blue-700' },
      pending: { label: 'Chờ tính', color: 'bg-yellow-100 text-yellow-700' }
    };
    const { label, color } = config[status] || config.pending;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${color}`}>
        {label}
      </span>
    );
  };

  const getTypeIcon = (type: string) => {
    const icons: Record<string, any> = {
      news: Newspaper,
      video: Video,
      gallery: ImageIcon,
      podcast: Headphones,
      download: DownloadIcon
    };
    return icons[type] || FileText;
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      news: 'blue',
      video: 'red',
      gallery: 'green',
      podcast: 'purple',
      download: 'orange'
    };
    return colors[type] || 'slate';
  };

  // Calculate stats
  const stats = {
    total: myArticles.length,
    published: myArticles.filter(a => a.status === 'published').length,
    draft: myArticles.filter(a => a.status === 'draft').length,
    pending: myArticles.filter(a => a.status === 'pending').length,
    totalViews: myArticles.reduce((sum, a) => sum + a.views, 0),
    totalRoyalty: myArticles.reduce((sum, a) => sum + a.royaltyAmount, 0)
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-10">
        <div className="max-w-[1400px] mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                <FileText className="w-8 h-8 text-blue-600" />
                Bài viết của tôi
              </h1>
              <p className="text-slate-600 mt-1">
                Quản lý tất cả {stats.total} bài viết của bạn
              </p>
            </div>
            
            <button 
              onClick={() => onNavigate?.('create-article')}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Tạo bài mới
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-5 gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
              <div className="text-sm text-blue-700 mb-1">Tổng số</div>
              <div className="text-2xl font-bold text-blue-900">{stats.total}</div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
              <div className="text-sm text-green-700 mb-1">Đã xuất bản</div>
              <div className="text-2xl font-bold text-green-900">{stats.published}</div>
            </div>
            <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl p-4 border border-yellow-100">
              <div className="text-sm text-yellow-700 mb-1">Chờ duyệt</div>
              <div className="text-2xl font-bold text-yellow-900">{stats.pending}</div>
            </div>
            <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-4 border border-slate-200">
              <div className="text-sm text-slate-700 mb-1">Nháp</div>
              <div className="text-2xl font-bold text-slate-900">{stats.draft}</div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-4 border border-purple-100">
              <div className="text-sm text-purple-700 mb-1">Lượt xem</div>
              <div className="text-2xl font-bold text-purple-900">{(stats.totalViews / 1000).toFixed(1)}K</div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Tìm kiếm bài viết..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="all">-- Trạng thái --</option>
              <option value="published">Đã xuất bản</option>
              <option value="pending">Chờ duyệt</option>
              <option value="draft">Nháp</option>
            </select>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="all">-- Loại bài viết --</option>
              <option value="news">Tin tức</option>
              <option value="video">Video</option>
              <option value="gallery">Gallery</option>
              <option value="podcast">Podcast</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="date-desc">Mới nhất</option>
              <option value="date-asc">Cũ nhất</option>
              <option value="views-desc">Xem nhiều nhất</option>
              <option value="views-asc">Xem ít nhất</option>
              <option value="royalty-desc">Nhuận bút cao</option>
              <option value="royalty-asc">Nhuận bút thấp</option>
            </select>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1400px] mx-auto px-6 py-6">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
          {/* Table Header */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                    Bài viết
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                    Loại
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-slate-600 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-600 uppercase tracking-wider">
                    Lượt xem
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-600 uppercase tracking-wider">
                    Nhuận bút
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                    Ngày đăng
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-slate-600 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredArticles.map((article, index) => {
                  const Icon = getTypeIcon(article.type);
                  const color = getTypeColor(article.type);
                  
                  return (
                    <motion.tr
                      key={article.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-slate-50 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {article.thumbnail && (
                            <img
                              src={article.thumbnail}
                              alt=""
                              className="w-16 h-16 rounded-lg object-cover border border-slate-200"
                            />
                          )}
                          <div className="min-w-0 flex-1">
                            <div className="font-medium text-slate-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                              {article.title}
                            </div>
                            <div className="text-xs text-slate-500 mt-1">{article.category}</div>
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className={`w-8 h-8 bg-${color}-100 rounded-lg flex items-center justify-center`}>
                            <Icon className={`w-4 h-4 text-${color}-600`} />
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 text-center">
                        <div className="flex flex-col items-center gap-2">
                          {getStatusBadge(article.status)}
                          {article.status === 'published' && getRoyaltyStatusBadge(article.royaltyStatus)}
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Eye className="w-4 h-4 text-slate-400" />
                          <span className="font-medium text-slate-900">
                            {article.views.toLocaleString()}
                          </span>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 text-right">
                        <div className="font-bold text-green-600">
                          {formatCurrency(article.royaltyAmount)}
                        </div>
                        {article.calculation && (
                          <div className="text-xs text-slate-500 mt-1" title={article.calculation}>
                            {article.calculation.substring(0, 20)}...
                          </div>
                        )}
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-sm text-slate-700">
                          <Calendar className="w-4 h-4 text-slate-400" />
                          {formatDate(article.publishDate)}
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button 
                            onClick={() => onNavigate?.(`edit-article?id=${article.id}`)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" 
                            title="Chỉnh sửa"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors" title="Xem chi tiết">
                            <ExternalLink className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Xóa">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredArticles.length === 0 && (
            <div className="text-center py-16">
              <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 text-lg">Không tìm thấy bài viết nào</p>
              <p className="text-slate-400 text-sm mt-1">Thử thay đổi bộ lọc hoặc tìm kiếm</p>
            </div>
          )}

          {/* Footer */}
          {filteredArticles.length > 0 && (
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200">
              <div className="flex items-center justify-between text-sm text-slate-600">
                <span>Hiển thị {filteredArticles.length} / {stats.total} bài viết</span>
                <div className="flex items-center gap-4">
                  <span>Tổng lượt xem: <strong>{stats.totalViews.toLocaleString()}</strong></span>
                  <span>Tổng nhuận bút: <strong className="text-green-600">{formatCurrency(stats.totalRoyalty)}</strong></span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}