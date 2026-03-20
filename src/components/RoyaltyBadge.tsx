import React from 'react';
import { DollarSign, Coins, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { formatCurrency, formatCurrencyCompact, getRoyaltyStatusConfig } from '../utils/royaltyHelpers';

interface RoyaltyBadgeProps {
  amount?: number;
  status?: 'pending' | 'calculated' | 'paid';
  config?: string;
  compact?: boolean;
  showTooltip?: boolean;
  className?: string;
}

export function RoyaltyBadge({
  amount,
  status,
  config,
  compact = false,
  showTooltip = true,
  className = ''
}: RoyaltyBadgeProps) {
  if (!amount && !status) return null;

  const statusConfig = status ? getRoyaltyStatusConfig(status) : null;

  if (compact) {
    return (
      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-green-50 border border-green-200 ${className}`}>
        <Coins className="w-3 h-3 text-green-600" />
        <span className="text-xs font-medium text-green-700">
          {amount ? formatCurrencyCompact(amount) : statusConfig?.label}
        </span>
      </div>
    );
  }

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border ${
        statusConfig ? statusConfig.color : 'bg-green-50 text-green-700 border-green-200'
      } ${className}`}
      title={showTooltip ? `${config ? `Cấu hình: ${config} - ` : ''}${status ? statusConfig?.label : ''}` : undefined}
    >
      {status === 'paid' && <CheckCircle className="w-4 h-4" />}
      {status === 'calculated' && <DollarSign className="w-4 h-4" />}
      {status === 'pending' && <Clock className="w-4 h-4" />}
      {!status && <Coins className="w-4 h-4" />}
      
      <div className="flex flex-col">
        {amount && (
          <span className="text-sm font-bold">
            {formatCurrency(amount)}
          </span>
        )}
        {status && !amount && (
          <span className="text-xs font-medium">
            {statusConfig?.label}
          </span>
        )}
      </div>
    </div>
  );
}

/**
 * Royalty Info Component - Hiển thị thông tin chi tiết hơn
 */
interface RoyaltyInfoProps {
  article: {
    wordCount?: number;
    views: number;
    royaltyAmount?: number;
    royaltyStatus?: 'pending' | 'calculated' | 'paid';
    royaltyConfig?: string;
  };
  onViewDetails?: () => void;
}

export function RoyaltyInfo({ article, onViewDetails }: RoyaltyInfoProps) {
  const { wordCount, views, royaltyAmount, royaltyStatus, royaltyConfig } = article;
  
  if (!royaltyAmount && !royaltyStatus) return null;

  return (
    <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-100">
      <div className="flex-shrink-0">
        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
          <Coins className="w-5 h-5 text-green-600" />
        </div>
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-medium text-slate-700">Nhuận bút</span>
          {royaltyStatus && (
            <RoyaltyBadge status={royaltyStatus} compact />
          )}
        </div>
        
        {royaltyAmount ? (
          <div className="text-lg font-bold text-green-600">
            {formatCurrency(royaltyAmount)}
          </div>
        ) : (
          <div className="text-sm text-slate-500">
            Chưa tính toán
          </div>
        )}
        
        {royaltyConfig && (
          <div className="text-xs text-slate-500 mt-1">
            {royaltyConfig}
          </div>
        )}
      </div>
      
      {onViewDetails && (
        <button
          onClick={onViewDetails}
          className="flex-shrink-0 px-3 py-1.5 text-xs font-medium text-green-700 hover:text-green-800 hover:bg-green-100 rounded-lg transition-colors"
        >
          Chi tiết
        </button>
      )}
    </div>
  );
}

/**
 * Royalty Quick Stats - Hiển thị stats nhanh
 */
interface RoyaltyQuickStatsProps {
  totalAmount: number;
  paidAmount: number;
  pendingAmount: number;
  articlesCount: number;
}

export function RoyaltyQuickStats({
  totalAmount,
  paidAmount,
  pendingAmount,
  articlesCount
}: RoyaltyQuickStatsProps) {
  return (
    <div className="grid grid-cols-4 gap-4">
      <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100">
        <div className="text-xs text-green-600 font-medium mb-1">Tổng nhuận bút</div>
        <div className="text-xl font-bold text-green-700">{formatCurrencyCompact(totalAmount)}</div>
      </div>
      
      <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
        <div className="text-xs text-blue-600 font-medium mb-1">Đã thanh toán</div>
        <div className="text-xl font-bold text-blue-700">{formatCurrencyCompact(paidAmount)}</div>
      </div>
      
      <div className="p-4 bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl border border-yellow-100">
        <div className="text-xs text-yellow-600 font-medium mb-1">Chờ thanh toán</div>
        <div className="text-xl font-bold text-yellow-700">{formatCurrencyCompact(pendingAmount)}</div>
      </div>
      
      <div className="p-4 bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl border border-purple-100">
        <div className="text-xs text-purple-600 font-medium mb-1">Bài viết</div>
        <div className="text-xl font-bold text-purple-700">{articlesCount}</div>
      </div>
    </div>
  );
}
