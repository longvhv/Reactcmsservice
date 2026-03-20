import React, { useState, useMemo } from 'react';
import {
  Coins, TrendingUp, Calendar, Download, Eye, FileText, CheckCircle,
  Clock, Award, BarChart3, DollarSign, ArrowUpRight, ArrowDownRight,
  Filter, ChevronDown, AlertCircle, Newspaper, Video, Image as ImageIcon,
  Headphones, Zap, Target, Activity
} from 'lucide-react';
import { motion } from 'motion/react';
import { mockArticles } from '../utils/mockData';
import { calculateArticleRoyalty } from '../utils/royaltyCalculations';

interface ReporterMyRoyaltyProps {
  currentUserId: number;
}

export function ReporterMyRoyalty({ currentUserId }: ReporterMyRoyaltyProps) {
  const [selectedPeriod, setSelectedPeriod] = useState('this-month');
  const [selectedTab, setSelectedTab] = useState<'overview' | 'by-article' | 'history'>('overview');

  // Get user's articles with royalty
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
          calculation: royalty.calculation,
          baseAmount: royalty.baseAmount,
          bonusAmount: royalty.bonusAmount
        };
      })
      .filter(a => a.status === 'published');
  }, [currentUserId]);

  // Calculate stats
  const stats = useMemo(() => {
    const totalRoyalty = myArticles.reduce((sum, a) => sum + a.royaltyAmount, 0);
    const paidRoyalty = myArticles
      .filter(a => a.royaltyStatus === 'paid')
      .reduce((sum, a) => sum + a.royaltyAmount, 0);
    const calculatedRoyalty = myArticles
      .filter(a => a.royaltyStatus === 'calculated')
      .reduce((sum, a) => sum + a.royaltyAmount, 0);
    const pendingRoyalty = myArticles
      .filter(a => a.royaltyStatus === 'pending')
      .reduce((sum, a) => sum + a.royaltyAmount, 0);

    // By type
    const byType: Record<string, { count: number; amount: number }> = {};
    myArticles.forEach(a => {
      if (!byType[a.type]) {
        byType[a.type] = { count: 0, amount: 0 };
      }
      byType[a.type].count++;
      byType[a.type].amount += a.royaltyAmount;
    });

    return {
      totalRoyalty,
      paidRoyalty,
      calculatedRoyalty,
      pendingRoyalty,
      totalArticles: myArticles.length,
      avgPerArticle: Math.round(totalRoyalty / (myArticles.length || 1)),
      byType,
      trend: 8.5 // Mock trend
    };
  }, [myArticles]);

  // Top earning articles
  const topArticles = [...myArticles]
    .sort((a, b) => b.royaltyAmount - a.royaltyAmount)
    .slice(0, 5);

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

  const getTypeIcon = (type: string) => {
    const icons: Record<string, any> = {
      news: Newspaper,
      video: Video,
      gallery: ImageIcon,
      podcast: Headphones
    };
    return icons[type] || FileText;
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

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      news: 'Tin tức',
      video: 'Video',
      gallery: 'Gallery',
      podcast: 'Podcast'
    };
    return labels[type] || type;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-10">
        <div className="max-w-[1400px] mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Coins className="w-6 h-6 text-white" />
                </div>
                Nhuận bút của tôi
              </h1>
              <p className="text-slate-600 mt-1">
                Theo dõi thu nhập từ {stats.totalArticles} bài viết
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="this-month">Tháng này</option>
                <option value="last-month">Tháng trước</option>
                <option value="this-quarter">Quý này</option>
                <option value="this-year">Năm nay</option>
              </select>
              
              <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg flex items-center gap-2">
                <Download className="w-4 h-4" />
                Xuất báo cáo
              </button>
            </div>
          </div>

          {/* Main Stats */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 border border-green-100 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
                <div className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                  <ArrowUpRight className="w-3 h-3" />
                  {stats.trend}%
                </div>
              </div>
              <div className="text-3xl font-bold text-green-900 mb-1">
                {formatCurrency(stats.totalRoyalty)}
              </div>
              <div className="text-sm text-green-700">Tổng nhuận bút</div>
              <div className="text-xs text-green-600 mt-1">{stats.totalArticles} bài viết</div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-xs text-blue-600">70%</div>
              </div>
              <div className="text-3xl font-bold text-blue-900 mb-1">
                {formatCurrency(stats.paidRoyalty)}
              </div>
              <div className="text-sm text-blue-700">Đã thanh toán</div>
              <div className="text-xs text-blue-600 mt-1">Đã chuyển khoản</div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl p-5 border border-yellow-100 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="text-xs text-yellow-600">30%</div>
              </div>
              <div className="text-3xl font-bold text-yellow-900 mb-1">
                {formatCurrency(stats.pendingRoyalty + stats.calculatedRoyalty)}
              </div>
              <div className="text-sm text-yellow-700">Chờ thanh toán</div>
              <div className="text-xs text-yellow-600 mt-1">Sắp được TT</div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-5 border border-purple-100 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-purple-600" />
                </div>
                <div className="text-xs text-purple-600">TB</div>
              </div>
              <div className="text-3xl font-bold text-purple-900 mb-1">
                {formatCurrency(stats.avgPerArticle)}
              </div>
              <div className="text-sm text-purple-700">Trung bình/bài</div>
              <div className="text-xs text-purple-600 mt-1">Hiệu suất tốt</div>
            </motion.div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2">
            {[
              { id: 'overview', label: 'Tổng quan', icon: BarChart3 },
              { id: 'by-article', label: 'Theo bài viết', icon: FileText },
              { id: 'history', label: 'Lịch sử TT', icon: Calendar }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id as any)}
                className={`px-4 py-2.5 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  selectedTab === tab.id
                    ? 'bg-white text-blue-600 shadow-md border border-blue-100'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1400px] mx-auto px-6 py-6">
        {selectedTab === 'overview' && (
          <div className="grid grid-cols-3 gap-6">
            {/* By Article Type */}
            <div className="col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-600" />
                Nhuận bút theo loại bài viết
              </h3>
              
              <div className="space-y-4">
                {Object.entries(stats.byType)
                  .sort(([, a], [, b]) => b.amount - a.amount)
                  .map(([type, data], idx) => {
                    const Icon = getTypeIcon(type);
                    const color = getTypeColor(type);
                    const maxAmount = Math.max(...Object.values(stats.byType).map(d => d.amount));
                    const percentage = (data.amount / maxAmount) * 100;
                    
                    return (
                      <div key={type} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 bg-${color}-100 rounded-lg flex items-center justify-center`}>
                              <Icon className={`w-5 h-5 text-${color}-600`} />
                            </div>
                            <div>
                              <div className="font-medium text-slate-900">{getTypeLabel(type)}</div>
                              <div className="text-xs text-slate-500">{data.count} bài viết</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-slate-900">{formatCurrency(data.amount)}</div>
                            <div className="text-xs text-slate-500">{formatCurrency(Math.round(data.amount / data.count))}/bài</div>
                          </div>
                        </div>
                        <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ delay: idx * 0.1, duration: 0.5 }}
                            className={`h-full bg-gradient-to-r from-${color}-500 to-${color}-600`}
                          />
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Top Earning Articles */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-600" />
                Top bài thu nhập cao
              </h3>
              
              <div className="space-y-3">
                {topArticles.map((article, idx) => {
                  const Icon = getTypeIcon(article.type);
                  const color = getTypeColor(article.type);
                  
                  return (
                    <div key={article.id} className="flex items-start gap-3 p-3 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors">
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                        idx === 0 ? 'bg-yellow-100 text-yellow-700' :
                        idx === 1 ? 'bg-slate-200 text-slate-700' :
                        idx === 2 ? 'bg-orange-100 text-orange-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {idx + 1}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-slate-900 text-sm line-clamp-2 mb-1">
                          {article.title}
                        </div>
                        <div className="flex items-center gap-2">
                          <div className={`w-5 h-5 bg-${color}-100 rounded flex items-center justify-center`}>
                            <Icon className={`w-3 h-3 text-${color}-600`} />
                          </div>
                          <span className="text-xs text-slate-500">{formatDate(article.publishDate)}</span>
                        </div>
                        <div className="font-bold text-green-600 text-sm mt-2">
                          {formatCurrency(article.royaltyAmount)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Performance Tips */}
            <div className="col-span-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100 p-6">
              <h3 className="font-bold text-blue-900 mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Mẹo tăng nhuận bút
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4">
                  <Target className="w-8 h-8 text-blue-600 mb-3" />
                  <div className="font-medium text-blue-900 mb-1">Bài viết dài hơn</div>
                  <div className="text-sm text-blue-700">Tin tức 1000+ từ nhận 700-800đ/từ (tier cao nhất)</div>
                </div>
                <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4">
                  <Eye className="w-8 h-8 text-green-600 mb-3" />
                  <div className="font-medium text-green-900 mb-1">Tăng lượt xem</div>
                  <div className="text-sm text-green-700">Mỗi view được bonus 50-120đ tùy loại bài</div>
                </div>
                <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4">
                  <Award className="w-8 h-8 text-purple-600 mb-3" />
                  <div className="font-medium text-purple-900 mb-1">Infographic premium</div>
                  <div className="text-sm text-purple-700">Base rate cao nhất: 150,000đ + 120đ/view</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'by-article' && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase">Bài viết</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase">Loại</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-slate-600 uppercase">Lượt xem</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-slate-600 uppercase">Nhuận bút</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-slate-600 uppercase">Trạng thái</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase">Ngày</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {myArticles.map((article, idx) => {
                    const Icon = getTypeIcon(article.type);
                    const color = getTypeColor(article.type);
                    
                    return (
                      <motion.tr
                        key={article.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: idx * 0.05 }}
                        className="hover:bg-slate-50"
                      >
                        <td className="px-6 py-4">
                          <div className="font-medium text-slate-900 line-clamp-2">{article.title}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className={`w-8 h-8 bg-${color}-100 rounded-lg flex items-center justify-center`}>
                              <Icon className={`w-4 h-4 text-${color}-600`} />
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className="font-medium">{article.views.toLocaleString()}</span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="font-bold text-green-600">{formatCurrency(article.royaltyAmount)}</div>
                          {article.calculation && (
                            <div className="text-xs text-slate-500 mt-1" title={article.calculation}>
                              {article.calculation.substring(0, 25)}...
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            article.royaltyStatus === 'paid' ? 'bg-green-100 text-green-700' :
                            article.royaltyStatus === 'calculated' ? 'bg-blue-100 text-blue-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                            {article.royaltyStatus === 'paid' ? 'Đã trả' :
                             article.royaltyStatus === 'calculated' ? 'Đã tính' : 'Chờ tính'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-700">{formatDate(article.publishDate)}</td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {selectedTab === 'history' && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 text-center">
            <Calendar className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-900 mb-2">Lịch sử thanh toán</h3>
            <p className="text-slate-600">Tính năng này đang được phát triển...</p>
          </div>
        )}
      </div>
    </div>
  );
}
