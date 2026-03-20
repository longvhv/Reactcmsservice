/**
 * Article-Royalty Integration Component
 * Component này tích hợp giữa Article Management và Royalty Management
 * Sử dụng để hiển thị thông tin nhuận bút trong danh sách bài viết
 */

import React, { useMemo } from 'react';
import { Article } from './ArticleListView';
import { RoyaltyBadge, RoyaltyInfo } from './RoyaltyBadge';
import { DollarSign, TrendingUp, Eye, FileText, Coins } from 'lucide-react';
import { formatCurrency, calculateEstimatedRoyalty, isEligibleForRoyalty } from '../utils/royaltyHelpers';

interface ArticleRoyaltyStatsProps {
  articles: Article[];
}

/**
 * Hiển thị thống kê tổng quan về nhuận bút của danh sách bài viết
 */
export function ArticleRoyaltyStats({ articles }: ArticleRoyaltyStatsProps) {
  const stats = useMemo(() => {
    const eligibleArticles = articles.filter(a => isEligibleForRoyalty(a.status));
    const totalRoyalty = articles.reduce((sum, a) => sum + (a.royaltyAmount || 0), 0);
    const paidRoyalty = articles.filter(a => a.royaltyStatus === 'paid').reduce((sum, a) => sum + (a.royaltyAmount || 0), 0);
    const pendingRoyalty = articles.filter(a => a.royaltyStatus === 'pending' || a.royaltyStatus === 'calculated').reduce((sum, a) => sum + (a.royaltyAmount || 0), 0);
    
    return {
      total: totalRoyalty,
      paid: paidRoyalty,
      pending: pendingRoyalty,
      eligibleCount: eligibleArticles.length,
      totalCount: articles.length
    };
  }, [articles]);

  if (stats.total === 0) return null;

  return (
    <div className="grid grid-cols-4 gap-4 mb-6">
      <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-green-600 font-medium">Tổng nhuận bút</span>
          <DollarSign className="w-4 h-4 text-green-500" />
        </div>
        <div className="text-2xl font-bold text-green-700">{formatCurrency(stats.total)}</div>
        <div className="text-xs text-green-600 mt-1">{stats.totalCount} bài viết</div>
      </div>

      <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-blue-600 font-medium">Đã thanh toán</span>
          <Coins className="w-4 h-4 text-blue-500" />
        </div>
        <div className="text-2xl font-bold text-blue-700">{formatCurrency(stats.paid)}</div>
        <div className="text-xs text-blue-600 mt-1">
          {Math.round((stats.paid / stats.total) * 100)}% tổng nhuận bút
        </div>
      </div>

      <div className="p-4 bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl border border-yellow-100">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-yellow-600 font-medium">Chờ thanh toán</span>
          <TrendingUp className="w-4 h-4 text-yellow-500" />
        </div>
        <div className="text-2xl font-bold text-yellow-700">{formatCurrency(stats.pending)}</div>
        <div className="text-xs text-yellow-600 mt-1">
          {Math.round((stats.pending / stats.total) * 100)}% tổng nhuận bút
        </div>
      </div>

      <div className="p-4 bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl border border-purple-100">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-purple-600 font-medium">Bài đủ điều kiện</span>
          <FileText className="w-4 h-4 text-purple-500" />
        </div>
        <div className="text-2xl font-bold text-purple-700">{stats.eligibleCount}</div>
        <div className="text-xs text-purple-600 mt-1">
          {Math.round((stats.eligibleCount / stats.totalCount) * 100)}% tổng bài viết
        </div>
      </div>
    </div>
  );
}

/**
 * Hiển thị royalty info cho từng article trong list/grid view
 */
interface ArticleRoyaltyCardProps {
  article: Article;
  onViewDetails?: () => void;
}

export function ArticleRoyaltyCard({ article, onViewDetails }: ArticleRoyaltyCardProps) {
  const estimated = calculateEstimatedRoyalty({
    views: article.views,
    wordCount: article.wordCount,
    status: article.status
  });

  return (
    <div className="mt-3 pt-3 border-t border-slate-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Coins className="w-4 h-4 text-slate-400" />
          <span className="text-xs text-slate-600">Nhuận bút:</span>
        </div>
        
        {article.royaltyAmount ? (
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-green-600">
              {formatCurrency(article.royaltyAmount)}
            </span>
            {article.royaltyStatus && (
              <RoyaltyBadge status={article.royaltyStatus} compact />
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">
              ≈ {formatCurrency(estimated)}
            </span>
            <span className="text-xs text-slate-400">(Ước tính)</span>
          </div>
        )}
      </div>
      
      {article.wordCount && (
        <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
          <span>{article.wordCount.toLocaleString()} từ</span>
          <span>{article.views.toLocaleString()} lượt xem</span>
        </div>
      )}
    </div>
  );
}

/**
 * Table cell component cho royalty column
 */
interface RoyaltyTableCellProps {
  article: Article;
}

export function RoyaltyTableCell({ article }: RoyaltyTableCellProps) {
  if (!article.royaltyAmount && !article.royaltyStatus) {
    // Hiển thị ước tính nếu bài đủ điều kiện
    if (isEligibleForRoyalty(article.status)) {
      const estimated = calculateEstimatedRoyalty({
        views: article.views,
        wordCount: article.wordCount,
        status: article.status
      });
      
      return (
        <div className="text-sm">
          <div className="text-slate-500">≈ {formatCurrency(estimated)}</div>
          <div className="text-xs text-slate-400">Ước tính</div>
        </div>
      );
    }
    
    return <div className="text-xs text-slate-400">-</div>;
  }

  return (
    <div className="flex flex-col gap-1">
      {article.royaltyAmount && (
        <div className="font-medium text-green-600">
          {formatCurrency(article.royaltyAmount)}
        </div>
      )}
      {article.royaltyStatus && (
        <RoyaltyBadge status={article.royaltyStatus} compact />
      )}
      {article.royaltyConfig && (
        <div className="text-xs text-slate-500 truncate max-w-[150px]" title={article.royaltyConfig}>
          {article.royaltyConfig}
        </div>
      )}
    </div>
  );
}

/**
 * Badge hiển thị royalty status trong article card
 */
interface ArticleRoyaltyBadgeProps {
  article: Article;
  variant?: 'default' | 'minimal';
}

export function ArticleRoyaltyBadge({ article, variant = 'default' }: ArticleRoyaltyBadgeProps) {
  if (!article.royaltyAmount && !isEligibleForRoyalty(article.status)) {
    return null;
  }

  if (variant === 'minimal') {
    return (
      <div className="flex items-center gap-1 px-2 py-1 bg-green-50 rounded-lg">
        <Coins className="w-3 h-3 text-green-600" />
        {article.royaltyAmount && (
          <span className="text-xs font-medium text-green-700">
            {formatCurrency(article.royaltyAmount)}
          </span>
        )}
      </div>
    );
  }

  const estimated = !article.royaltyAmount ? calculateEstimatedRoyalty({
    views: article.views,
    wordCount: article.wordCount,
    status: article.status
  }) : null;

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1 px-2 py-1 bg-green-50 border border-green-200 rounded-lg">
        <DollarSign className="w-3 h-3 text-green-600" />
        <span className="text-xs font-medium text-green-700">
          {article.royaltyAmount ? formatCurrency(article.royaltyAmount) : `≈ ${formatCurrency(estimated!)}`}
        </span>
      </div>
      {article.royaltyStatus && (
        <RoyaltyBadge status={article.royaltyStatus} compact />
      )}
    </div>
  );
}

/**
 * Filter component for royalty status
 */
interface RoyaltyStatusFilterProps {
  value: string;
  onChange: (value: string) => void;
}

export function RoyaltyStatusFilter({ value, onChange }: RoyaltyStatusFilterProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="px-4 py-2.5 bg-card border border-border/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 min-w-[160px]"
    >
      <option value="all">-- Nhuận bút --</option>
      <option value="paid">Đã thanh toán</option>
      <option value="calculated">Đã tính</option>
      <option value="pending">Chờ tính</option>
      <option value="none">Chưa có</option>
      <option value="eligible">Đủ điều kiện</option>
    </select>
  );
}

/**
 * Helper function to filter articles by royalty status
 */
export function filterArticlesByRoyalty(articles: Article[], filter: string): Article[] {
  switch (filter) {
    case 'paid':
      return articles.filter(a => a.royaltyStatus === 'paid');
    case 'calculated':
      return articles.filter(a => a.royaltyStatus === 'calculated');
    case 'pending':
      return articles.filter(a => a.royaltyStatus === 'pending');
    case 'none':
      return articles.filter(a => !a.royaltyAmount && !a.royaltyStatus);
    case 'eligible':
      return articles.filter(a => isEligibleForRoyalty(a.status));
    default:
      return articles;
  }
}

/**
 * Quick action button to navigate to royalty management
 */
interface ViewRoyaltyButtonProps {
  articleId: number;
  onClick?: () => void;
}

export function ViewRoyaltyButton({ articleId, onClick }: ViewRoyaltyButtonProps) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1 px-2 py-1 text-xs text-green-700 hover:text-green-800 hover:bg-green-50 rounded-lg transition-colors"
      title="Xem chi tiết nhuận bút"
    >
      <DollarSign className="w-3 h-3" />
      <span>Nhuận bút</span>
    </button>
  );
}