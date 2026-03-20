import React, { useState, useMemo } from 'react';
import {
  TrendingUp, Eye, FileText, Coins, Award, Clock, CheckCircle,
  AlertCircle, BarChart3, Calendar, Users, ArrowUpRight, ArrowDownRight,
  Newspaper, Video, Image as ImageIcon, Headphones, ChevronRight,
  Sparkles, Target, Zap, Heart, MessageCircle, Share2, Bookmark
} from 'lucide-react';
import { motion } from 'motion/react';
import { mockArticles, mockUsers } from '../utils/mockData';
import { calculateArticleRoyalty, aggregateRoyaltiesByAuthor } from '../utils/royaltyCalculations';

interface ReporterDashboardProps {
  onNavigate?: (page: string) => void;
  currentUserId?: number;
}

export function ReporterDashboard({ onNavigate, currentUserId = 1 }: ReporterDashboardProps) {
  const [selectedPeriod, setSelectedPeriod] = useState('this-month');

  // Get current user
  const currentUser = mockUsers.find(u => u.id === currentUserId);

  // Get user's articles
  const myArticles = useMemo(() => {
    return mockArticles
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
      })
      .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());
  }, [currentUserId]);

  // Calculate stats
  const stats = useMemo(() => {
    const totalArticles = myArticles.length;
    const publishedArticles = myArticles.filter(a => a.status === 'published').length;
    const draftArticles = myArticles.filter(a => a.status === 'draft').length;
    const totalViews = myArticles.reduce((sum, a) => sum + a.views, 0);
    const totalRoyalty = myArticles.reduce((sum, a) => sum + a.royaltyAmount, 0);
    const paidRoyalty = myArticles
      .filter(a => a.royaltyStatus === 'paid')
      .reduce((sum, a) => sum + a.royaltyAmount, 0);
    const pendingRoyalty = totalRoyalty - paidRoyalty;
    
    // Calculate trends (mock)
    const viewsTrend = 12.5;
    const royaltyTrend = 8.3;
    const articlesTrend = 15.2;

    return {
      totalArticles,
      publishedArticles,
      draftArticles,
      totalViews,
      totalRoyalty,
      paidRoyalty,
      pendingRoyalty,
      avgViewsPerArticle: Math.round(totalViews / (publishedArticles || 1)),
      avgRoyaltyPerArticle: Math.round(totalRoyalty / (publishedArticles || 1)),
      viewsTrend,
      royaltyTrend,
      articlesTrend
    };
  }, [myArticles]);

  // Get recent articles
  const recentArticles = myArticles.slice(0, 5);

  // Get top performing articles
  const topArticles = [...myArticles]
    .filter(a => a.status === 'published')
    .sort((a, b) => b.views - a.views)
    .slice(0, 5);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const getStatusBadge = (status: string) => {
    const config: Record<string, { label: string; color: string }> = {
      published: { label: 'Đã xuất bản', color: 'bg-green-100 text-green-700 border-green-200' },
      draft: { label: 'Nháp', color: 'bg-slate-100 text-slate-700 border-slate-200' },
      pending: { label: 'Chờ duyệt', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' }
    };
    const { label, color } = config[status] || config.draft;
    return (
      <span className={`px-2 py-1 rounded-lg text-xs font-medium border ${color}`}>
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
      podcast: Headphones
    };
    const Icon = icons[type] || FileText;
    return Icon;
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      news: 'blue',
      video: 'red',
      gallery: 'green',
      podcast: 'purple'
    };
    return colors[type] || 'slate';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-10">
        <div className="max-w-[1400px] mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Chào mừng trở lại, {currentUser?.name}! 👋
              </h1>
              <p className="text-slate-600 mt-1">
                Đây là tổng quan hoạt động của bạn trong tháng này
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="this-week">Tuần này</option>
                <option value="this-month">Tháng này</option>
                <option value="this-quarter">Quý này</option>
                <option value="this-year">Năm nay</option>
              </select>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-4 gap-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                  stats.articlesTrend > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {stats.articlesTrend > 0 ? (
                    <ArrowUpRight className="w-3 h-3" />
                  ) : (
                    <ArrowDownRight className="w-3 h-3" />
                  )}
                  {Math.abs(stats.articlesTrend)}%
                </div>
              </div>
              <div className="text-3xl font-bold text-blue-900 mb-1">{stats.publishedArticles}</div>
              <div className="text-sm text-blue-700">Bài đã xuất bản</div>
              <div className="text-xs text-blue-600 mt-1">{stats.draftArticles} bài nháp</div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 border border-green-100 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <Eye className="w-6 h-6 text-green-600" />
                </div>
                <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                  stats.viewsTrend > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {stats.viewsTrend > 0 ? (
                    <ArrowUpRight className="w-3 h-3" />
                  ) : (
                    <ArrowDownRight className="w-3 h-3" />
                  )}
                  {Math.abs(stats.viewsTrend)}%
                </div>
              </div>
              <div className="text-3xl font-bold text-green-900 mb-1">
                {(stats.totalViews / 1000).toFixed(1)}K
              </div>
              <div className="text-sm text-green-700">Tổng lượt xem</div>
              <div className="text-xs text-green-600 mt-1">{stats.avgViewsPerArticle.toLocaleString()} TB/bài</div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl p-5 border border-yellow-100 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                  <Coins className="w-6 h-6 text-yellow-600" />
                </div>
                <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                  stats.royaltyTrend > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {stats.royaltyTrend > 0 ? (
                    <ArrowUpRight className="w-3 h-3" />
                  ) : (
                    <ArrowDownRight className="w-3 h-3" />
                  )}
                  {Math.abs(stats.royaltyTrend)}%
                </div>
              </div>
              <div className="text-3xl font-bold text-yellow-900 mb-1">
                {formatCurrency(stats.totalRoyalty)}
              </div>
              <div className="text-sm text-yellow-700">Tổng nhuận bút</div>
              <div className="text-xs text-yellow-600 mt-1">{formatCurrency(stats.avgRoyaltyPerArticle)} TB/bài</div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-5 border border-purple-100 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Award className="w-6 h-6 text-purple-600" />
                </div>
                <div className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                  70% đã trả
                </div>
              </div>
              <div className="text-3xl font-bold text-purple-900 mb-1">
                {formatCurrency(stats.paidRoyalty)}
              </div>
              <div className="text-sm text-purple-700">Đã thanh toán</div>
              <div className="text-xs text-purple-600 mt-1">{formatCurrency(stats.pendingRoyalty)} chờ TT</div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1400px] mx-auto px-6 py-6">
        <div className="grid grid-cols-3 gap-6">
          {/* Left Column - Recent Articles */}
          <div className="col-span-2 space-y-6">
            {/* Recent Articles */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
              <div className="p-6 border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">Bài viết gần đây</h2>
                    <p className="text-sm text-slate-600 mt-1">5 bài viết mới nhất của bạn</p>
                  </div>
                  <button 
                    onClick={() => onNavigate?.('my-articles')}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
                  >
                    Xem tất cả
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="divide-y divide-slate-200">
                {recentArticles.map((article, index) => {
                  const Icon = getTypeIcon(article.type);
                  const color = getTypeColor(article.type);
                  
                  return (
                    <motion.div
                      key={article.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-6 hover:bg-slate-50 transition-colors group cursor-pointer"
                    >
                      <div className="flex items-start gap-4">
                        {article.thumbnail && (
                          <img
                            src={article.thumbnail}
                            alt=""
                            className="w-20 h-20 rounded-lg object-cover border border-slate-200"
                          />
                        )}
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4 mb-2">
                            <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                              {article.title}
                            </h3>
                            {getStatusBadge(article.status)}
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-slate-600 mb-3">
                            <div className="flex items-center gap-1.5">
                              <div className={`w-6 h-6 bg-${color}-100 rounded-lg flex items-center justify-center`}>
                                <Icon className={`w-3.5 h-3.5 text-${color}-600`} />
                              </div>
                              <span>{article.category}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {formatDate(article.publishDate)}
                            </div>
                            <div className="flex items-center gap-1">
                              <Eye className="w-4 h-4" />
                              {article.views.toLocaleString()}
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-green-600">
                                {formatCurrency(article.royaltyAmount)}
                              </span>
                              {getRoyaltyStatusBadge(article.royaltyStatus)}
                            </div>
                            
                            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                              Chỉnh sửa
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Top Performing */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
              <div className="p-6 border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-green-600" />
                      Top bài viết nổi bật
                    </h2>
                    <p className="text-sm text-slate-600 mt-1">Xếp hạng theo lượt xem</p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  {topArticles.map((article, index) => {
                    const Icon = getTypeIcon(article.type);
                    const color = getTypeColor(article.type);
                    
                    return (
                      <div
                        key={article.id}
                        className="flex items-center gap-4 p-4 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors group cursor-pointer"
                      >
                        <div className="flex-shrink-0">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
                            index === 0 ? 'bg-yellow-100 text-yellow-700' :
                            index === 1 ? 'bg-slate-200 text-slate-700' :
                            index === 2 ? 'bg-orange-100 text-orange-700' :
                            'bg-blue-100 text-blue-700'
                          }`}>
                            {index + 1}
                          </div>
                        </div>
                        
                        <div className={`w-8 h-8 bg-${color}-100 rounded-lg flex items-center justify-center flex-shrink-0`}>
                          <Icon className={`w-4 h-4 text-${color}-600`} />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-slate-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
                            {article.title}
                          </div>
                          <div className="text-sm text-slate-600">{formatDate(article.publishDate)}</div>
                        </div>
                        
                        <div className="text-right flex-shrink-0">
                          <div className="flex items-center gap-1 text-green-600 font-bold">
                            <Eye className="w-4 h-4" />
                            {article.views.toLocaleString()}
                          </div>
                          <div className="text-xs text-slate-500">{formatCurrency(article.royaltyAmount)}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Quick Stats & Actions */}
          <div className="space-y-6">
            {/* Monthly Performance */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                Hiệu suất tháng này
              </h3>
              
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-slate-600">Lượt xem</span>
                    <span className="font-bold text-slate-900">{stats.totalViews.toLocaleString()}</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500" style={{ width: '75%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-slate-600">Nhuận bút</span>
                    <span className="font-bold text-slate-900">{formatCurrency(stats.totalRoyalty)}</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-yellow-500 to-amber-500" style={{ width: '82%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-slate-600">Bài viết</span>
                    <span className="font-bold text-slate-900">{stats.publishedArticles}</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500" style={{ width: '60%' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Royalty Breakdown */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Coins className="w-5 h-5 text-yellow-600" />
                Chi tiết nhuận bút
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-100">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-green-700">Đã thanh toán</span>
                  </div>
                  <span className="font-bold text-green-600">
                    {formatCurrency(stats.paidRoyalty)}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-100">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-yellow-600" />
                    <span className="text-sm text-yellow-700">Chờ thanh toán</span>
                  </div>
                  <span className="font-bold text-yellow-600">
                    {formatCurrency(stats.pendingRoyalty)}
                  </span>
                </div>

                <div className="pt-3 border-t border-slate-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-700">Tổng cộng</span>
                    <span className="text-lg font-bold text-slate-900">
                      {formatCurrency(stats.totalRoyalty)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Tips */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-100 p-6">
              <h3 className="font-bold text-purple-900 mb-3 flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Mẹo hữu ích
              </h3>
              <ul className="space-y-2 text-sm text-purple-700">
                <li className="flex items-start gap-2">
                  <Target className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Bài viết 1000+ từ nhận nhuận bút cao hơn</span>
                </li>
                <li className="flex items-start gap-2">
                  <Eye className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Video trên 10k views được thưởng thêm</span>
                </li>
                <li className="flex items-start gap-2">
                  <Award className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Infographic nhận nhuận bút cơ bản 150k</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}