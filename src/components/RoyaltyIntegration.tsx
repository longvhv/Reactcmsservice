import React, { useState, useMemo } from 'react';
import {
  DollarSign, TrendingUp, Users, FileText, Calendar, Download,
  Eye, Filter, Search, ChevronDown, Award, BarChart3, Clock,
  CheckCircle, AlertCircle, X, User, ExternalLink, Newspaper,
  Video, Image as ImageIcon, UserCircle, ArrowUpRight, Activity,
  Play, CheckSquare, XCircle, Coins, CreditCard, History,
  TrendingDown, Zap, FileCode, Headphones, Calendar as CalendarIcon,
  Briefcase, UserSquare, Package, ImagePlus, ChevronLeft, ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { mockArticles, mockUsers } from '../utils/mockData';
import {
  calculateArticleRoyalty,
  aggregateRoyaltiesByAuthor,
  generatePaymentRecords,
  calculateRoyaltyAnalytics,
  type ArticleData,
  type CalculatedRoyalty
} from '../utils/royaltyCalculations';

interface RoyaltyIntegrationProps {
  onNavigate?: (page: any) => void;
}

export function RoyaltyIntegration({ onNavigate }: RoyaltyIntegrationProps) {
  const [activeTab, setActiveTab] = useState<'articles' | 'authors' | 'payments' | 'analytics'>('articles');
  const [selectedPeriod, setSelectedPeriod] = useState('current-month');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedArticle, setSelectedArticle] = useState<any>(null);
  const [sortBy, setSortBy] = useState<'title' | 'views' | 'royalty' | 'date'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Calculate real data using utilities
  const articlesWithRoyalty = useMemo(() => {
    return mockArticles
      .filter(a => a.status === 'published')
      .map(article => {
        const royalty = calculateArticleRoyalty(article);
        // Deterministic status based on article ID to keep it consistent
        const statusSeed = article.id % 3;
        let royaltyStatus: 'pending' | 'calculated' | 'paid' = 'pending';
        if (statusSeed === 0) royaltyStatus = 'paid';
        else if (statusSeed === 1) royaltyStatus = 'calculated';
        
        return {
          ...article,
          royaltyAmount: royalty.totalAmount,
          royaltyStatus,
          calculation: royalty.calculation,
          baseAmount: royalty.baseAmount,
          bonusAmount: royalty.bonusAmount
        };
      });
  }, []);

  const authorsRoyalty = useMemo(() => {
    return aggregateRoyaltiesByAuthor(mockArticles, mockUsers);
  }, []);

  const payments = useMemo(() => {
    return generatePaymentRecords(authorsRoyalty);
  }, [authorsRoyalty]);

  const analytics = useMemo(() => {
    return calculateRoyaltyAnalytics(mockArticles);
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: 'Chờ tính', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
      calculated: { label: 'Đã tính', color: 'bg-blue-100 text-blue-700 border-blue-200' },
      paid: { label: 'Đã trả', color: 'bg-green-100 text-green-700 border-green-200' },
      processing: { label: 'Đang xử lý', color: 'bg-purple-100 text-purple-700 border-purple-200' },
      failed: { label: 'Thất bại', color: 'bg-red-100 text-red-700 border-red-200' }
    };
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return (
      <span className={`px-2 py-1 rounded-lg text-xs font-medium border ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const getTypeIcon = (type: string) => {
    const icons: Record<string, any> = {
      news: Newspaper,
      video: Video,
      gallery: ImageIcon,
      document: FileCode,
      podcast: Headphones,
      event: CalendarIcon,
      job: Briefcase,
      person: UserSquare,
      download: Package,
      infographic: ImagePlus
    };
    const Icon = icons[type] || FileText;
    return <Icon className="w-4 h-4" />;
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      news: 'Tin tức',
      video: 'Video',
      gallery: 'Gallery',
      document: 'Tài liệu',
      podcast: 'Podcast',
      event: 'Sự kiện',
      job: 'Tuyển dụng',
      person: 'Nhân sự',
      download: 'Tải xuống',
      infographic: 'Infographic'
    };
    return labels[type] || type;
  };

  const filteredArticles = articlesWithRoyalty.filter(article => {
    const matchSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       article.authorName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter === 'all' || article.royaltyStatus === statusFilter;
    const matchType = typeFilter === 'all' || article.type === typeFilter;
    return matchSearch && matchStatus && matchType;
  }).sort((a, b) => {
    if (sortBy === 'title') {
      return sortOrder === 'asc' ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title);
    } else if (sortBy === 'views') {
      return sortOrder === 'asc' ? a.views - b.views : b.views - a.views;
    } else if (sortBy === 'royalty') {
      return sortOrder === 'asc' ? a.royaltyAmount - b.royaltyAmount : b.royaltyAmount - a.royaltyAmount;
    } else if (sortBy === 'date') {
      return sortOrder === 'asc' 
        ? new Date(a.publishDate).getTime() - new Date(b.publishDate).getTime() 
        : new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime();
    }
    return 0;
  });

  const filteredAuthors = authorsRoyalty.filter(author =>
    author.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    author.userEmail.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPayments = payments.filter(payment => {
    const matchSearch = payment.userName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter === 'all' || payment.status === statusFilter;
    return matchSearch && matchStatus;
  });

  // Calculate total stats
  const totalPendingRoyalty = authorsRoyalty.reduce((sum, author) => sum + author.pendingRoyalty, 0);
  const totalPaidRoyalty = authorsRoyalty.reduce((sum, author) => sum + author.paidRoyalty, 0);
  const totalArticles = articlesWithRoyalty.length;
  const totalAuthors = authorsRoyalty.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-[1400px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Coins className="w-5 h-5 text-white" />
                </div>
                Quản lý & Báo cáo Nhuận bút
              </h1>
              <p className="text-sm text-slate-600 mt-1">
                Tính toán tự động dựa trên cấu hình nhuận bút • {totalArticles} bài viết • {totalAuthors} tác giả
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="current-month">Tháng hiện tại</option>
                <option value="last-month">Tháng trước</option>
                <option value="quarter">Quý này</option>
                <option value="year">Năm nay</option>
              </select>
              
              <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg flex items-center gap-2">
                <Download className="w-4 h-4" />
                Xuất báo cáo
              </button>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-4 gap-4 mt-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-green-600 font-medium mb-1">Đã thanh toán</div>
                  <div className="text-xl font-bold text-green-700">{formatCurrency(totalPaidRoyalty)}</div>
                  <div className="text-xs text-green-600 mt-1">70% tổng nhuận bút</div>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl p-4 border border-yellow-100 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-yellow-600 font-medium mb-1">Chờ thanh toán</div>
                  <div className="text-xl font-bold text-yellow-700">{formatCurrency(totalPendingRoyalty)}</div>
                  <div className="text-xs text-yellow-600 mt-1">30% tổng nhuận bút</div>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-blue-600 font-medium mb-1">T��ng bài viết</div>
                  <div className="text-xl font-bold text-blue-700">{totalArticles}</div>
                  <div className="text-xs text-blue-600 mt-1">Bài đã xuất bản</div>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-4 border border-purple-100 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-purple-600 font-medium mb-1">Tác giả</div>
                  <div className="text-xl font-bold text-purple-700">{totalAuthors}</div>
                  <div className="text-xs text-purple-600 mt-1">Có nhuận bút</div>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-2 mt-6">
            {[
              { id: 'articles', label: 'Bài viết', icon: FileText, count: totalArticles },
              { id: 'authors', label: 'Tác giả', icon: Users, count: totalAuthors },
              { id: 'payments', label: 'Thanh toán', icon: CreditCard, count: payments.length },
              { id: 'analytics', label: 'Phân tích', icon: BarChart3 }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2.5 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'bg-white text-blue-600 shadow-md border border-blue-100'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
                {tab.count !== undefined && (
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                    activeTab === tab.id ? 'bg-blue-100 text-blue-700' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1400px] mx-auto px-6 py-6">
        {/* Search and Filters */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder={`Tìm kiếm ${activeTab === 'articles' ? 'bài viết' : activeTab === 'authors' ? 'tác giả' : 'thanh toán'}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            {activeTab === 'articles' && (
              <>
                <select
                  value={typeFilter}
                  onChange={(e) => {
                    setTypeFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white min-w-[160px]"
                >
                  <option value="all">-- Loại bài viết --</option>
                  <option value="news">Tin tức</option>
                  <option value="video">Video</option>
                  <option value="gallery">Gallery</option>
                  <option value="document">Tài liệu</option>
                  <option value="podcast">Podcast</option>
                  <option value="event">Sự kiện</option>
                  <option value="job">Tuyển dụng</option>
                  <option value="infographic">Infographic</option>
                </select>
                
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white min-w-[160px]"
                >
                  <option value="all">-- Trạng thái nhuận bút --</option>
                  <option value="pending">Chờ tính</option>
                  <option value="calculated">Đã tính</option>
                  <option value="paid">Đã trả</option>
                </select>
              </>
            )}
            
            {activeTab === 'payments' && (
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white min-w-[160px]"
              >
                <option value="all">-- Trạng thái thanh toán --</option>
                <option value="pending">Chờ xử lý</option>
                <option value="processing">Đang xử lý</option>
                <option value="paid">Đã thanh toán</option>
                <option value="failed">Thất bại</option>
              </select>
            )}

            {(searchQuery || typeFilter !== 'all' || statusFilter !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setTypeFilter('all');
                  setStatusFilter('all');
                }}
                className="px-3 py-2.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Xóa bộ lọc
              </button>
            )}
          </div>
        </div>

        {/* Articles Tab */}
        {activeTab === 'articles' && (
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                      Bài viết
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                      Tác giả
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                      Loại
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-slate-600 uppercase tracking-wider">
                      Lượt xem
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-slate-600 uppercase tracking-wider">
                      Số từ
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-slate-600 uppercase tracking-wider">
                      Nhuận bút
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-slate-600 uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-slate-600 uppercase tracking-wider">
                      Chi tiết
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredArticles.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((article, index) => (
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
                              className="w-12 h-12 rounded-lg object-cover border border-slate-200"
                            />
                          )}
                          <div className="min-w-0">
                            <div className="font-medium text-slate-900 line-clamp-1">{article.title}</div>
                            <div className="text-xs text-slate-500">{article.category}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <UserCircle className="w-4 h-4 text-slate-400 flex-shrink-0" />
                          <span className="text-sm text-slate-700">{article.authorName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-slate-600">
                          {getTypeIcon(article.type)}
                          <span className="text-sm">{getTypeLabel(article.type)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Eye className="w-3.5 h-3.5 text-slate-400" />
                          <span className="text-sm font-medium text-slate-700">{article.views.toLocaleString()}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-sm text-slate-700">
                          {article.wordCount ? article.wordCount.toLocaleString() : '-'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex flex-col items-end gap-1">
                          <span className="font-bold text-green-600">
                            {formatCurrency(article.royaltyAmount)}
                          </span>
                          {article.calculation && (
                            <span className="text-xs text-slate-500 max-w-[200px] truncate" title={article.calculation}>
                              {article.calculation}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {getStatusBadge(article.royaltyStatus)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button 
                          className="text-blue-600 hover:text-blue-700 transition-colors opacity-0 group-hover:opacity-100"
                          title="Xem chi tiết"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
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

            {filteredArticles.length > 0 && (
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-200">
                <div className="flex items-center justify-between text-sm text-slate-600">
                  <span>Hiển thị {filteredArticles.length} bài viết</span>
                  <span>Tổng nhuận bút: <strong className="text-green-600">
                    {formatCurrency(filteredArticles.reduce((sum, a) => sum + a.royaltyAmount, 0))}
                  </strong></span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Authors Tab - Continue in next part due to length */}
        {activeTab === 'authors' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredAuthors.map((author, index) => (
              <motion.div
                key={author.userId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-xl transition-all group"
              >
                <div className="flex items-start justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold text-xl">
                        {author.userName.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">{author.userName}</div>
                      <div className="text-sm text-slate-600">{author.userRole}</div>
                      <div className="text-xs text-slate-500">{author.userEmail}</div>
                    </div>
                  </div>
                  <button className="text-blue-600 hover:text-blue-700 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-5">
                  <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                    <div className="text-2xl font-bold text-blue-700">{author.articlesCount}</div>
                    <div className="text-xs text-blue-600 mt-1">Bài viết</div>
                  </div>
                  <div className="text-center p-3 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-100">
                    <div className="text-2xl font-bold text-green-700">{(author.totalViews / 1000).toFixed(1)}K</div>
                    <div className="text-xs text-green-600 mt-1">Lượt xem</div>
                  </div>
                  <div className="text-center p-3 bg-gradient-to-br from-purple-50 to-violet-50 rounded-lg border border-purple-100">
                    <div className="text-2xl font-bold text-purple-700">{(author.totalWords / 1000).toFixed(1)}K</div>
                    <div className="text-xs text-purple-600 mt-1">Từ</div>
                  </div>
                </div>

                <div className="space-y-3 mb-5 p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-700 flex items-center gap-2">
                      <Coins className="w-4 h-4 text-slate-500" />
                      Tổng nhuận bút:
                    </span>
                    <span className="font-bold text-slate-900 text-lg">{formatCurrency(author.totalRoyalty)}</span>
                  </div>
                  <div className="h-px bg-slate-200" />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-green-600 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      Đã thanh toán:
                    </span>
                    <span className="font-medium text-green-600">{formatCurrency(author.paidRoyalty)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-yellow-600 flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Chờ thanh toán:
                    </span>
                    <span className="font-medium text-yellow-600">{formatCurrency(author.pendingRoyalty)}</span>
                  </div>
                </div>

                <button className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 font-medium">
                  <CreditCard className="w-4 h-4" />
                  Thanh toán ngay
                </button>
              </motion.div>
            ))}
          </div>
        )}

        {/* Payments Tab */}
        {activeTab === 'payments' && (
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                      Tác giả
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                      Kỳ thanh toán
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-slate-600 uppercase tracking-wider">
                      Số bài
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-slate-600 uppercase tracking-wider">
                      Số tiền
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-slate-600 uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                      Ngày thanh toán
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                      Ghi chú
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredPayments.map((payment, index) => (
                    <motion.tr
                      key={payment.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <UserCircle className="w-5 h-5 text-slate-400" />
                          <span className="font-medium text-slate-900">{payment.userName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-slate-700">{payment.period}</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                          {payment.articlesCount}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="font-bold text-green-600 text-lg">{formatCurrency(payment.amount)}</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {getStatusBadge(payment.status)}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-slate-700">
                          {payment.paidDate || '-'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-slate-500">{payment.note || '-'}</span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredPayments.length === 0 && (
              <div className="text-center py-16">
                <CreditCard className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500 text-lg">Không có thanh toán nào</p>
              </div>
            )}
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Monthly Trend */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm"
            >
              <h3 className="font-bold text-slate-900 mb-5 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                Nhuận bút theo tháng
              </h3>
              <div className="space-y-3">
                {analytics.byMonth.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                    <span className="text-sm font-medium text-slate-700">{item.month}</span>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-slate-900">{formatCurrency(item.amount)}</span>
                      <span className={`text-xs font-medium flex items-center gap-1 px-2 py-1 rounded-full ${
                        item.growth > 0 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {item.growth > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {Math.abs(item.growth)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* By Type */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm"
            >
              <h3 className="font-bold text-slate-900 mb-5 flex items-center gap-2">
                <Activity className="w-5 h-5 text-purple-600" />
                Nhuận bút theo loại bài viết
              </h3>
              <div className="space-y-4">
                {Object.entries(analytics.byType)
                  .sort(([,a], [,b]) => b.amount - a.amount)
                  .slice(0, 5)
                  .map(([type, data], idx) => {
                    const maxAmount = Math.max(...Object.values(analytics.byType).map(d => d.amount));
                    const percentage = (data.amount / maxAmount) * 100;
                    const colors = ['bg-blue-500', 'bg-red-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500'];
                    
                    return (
                      <div key={type} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {getTypeIcon(type)}
                            <span className="text-sm font-medium text-slate-700">{getTypeLabel(type)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-500">{data.count} bài</span>
                            <span className="font-bold text-slate-900">{formatCurrency(data.amount)}</span>
                          </div>
                        </div>
                        <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ delay: idx * 0.1, duration: 0.5 }}
                            className={`h-full ${colors[idx % colors.length]}`}
                          />
                        </div>
                      </div>
                    );
                  })}
              </div>
            </motion.div>

            {/* Top Authors */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm"
            >
              <h3 className="font-bold text-slate-900 mb-5 flex items-center gap-2">
                <Award className="w-5 h-5 text-green-600" />
                Top tác giả
              </h3>
              <div className="space-y-3">
                {authorsRoyalty
                  .sort((a, b) => b.totalRoyalty - a.totalRoyalty)
                  .slice(0, 5)
                  .map((author, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors group cursor-pointer">
                      <div className="flex-shrink-0 relative">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold">{author.userName.charAt(0)}</span>
                        </div>
                        {idx === 0 && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center">
                            <Award className="w-3 h-3 text-yellow-900" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-slate-900 truncate">{author.userName}</div>
                        <div className="text-xs text-slate-500">{author.articlesCount} bài viết • {(author.totalViews / 1000).toFixed(1)}K views</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-green-600">{formatCurrency(author.totalRoyalty)}</div>
                        <div className="text-xs text-slate-500">{formatCurrency(author.totalRoyalty / author.articlesCount)}/bài</div>
                      </div>
                    </div>
                  ))}
              </div>
            </motion.div>

            {/* Performance Stats */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm"
            >
              <h3 className="font-bold text-slate-900 mb-5 flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-600" />
                Hiệu suất trung bình
              </h3>
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm text-blue-700 font-medium">Nhuận bút / bài</div>
                    <Coins className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="text-2xl font-bold text-blue-900">{formatCurrency(analytics.averageRoyaltyPerArticle)}</div>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm text-green-700 font-medium">Lượt xem / bài</div>
                    <Eye className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="text-2xl font-bold text-green-900">{Math.round(analytics.averageViewsPerArticle).toLocaleString()}</div>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl border border-purple-100">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm text-purple-700 font-medium">Số từ / bài</div>
                    <FileText className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="text-2xl font-bold text-purple-900">{Math.round(analytics.averageWordsPerArticle).toLocaleString()}</div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}