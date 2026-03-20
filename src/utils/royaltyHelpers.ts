/**
 * Royalty Helper Functions
 * Utilities để sử dụng chung trong các component liên quan đến Royalty
 */

/**
 * Format currency to Vietnamese Dong
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);
}

/**
 * Format currency compact (Triệu, Nghìn)
 */
export function formatCurrencyCompact(amount: number): string {
  if (amount >= 1000000) {
    return `${(amount / 1000000).toFixed(1)} Tr`;
  }
  if (amount >= 1000) {
    return `${(amount / 1000).toFixed(0)} K`;
  }
  return formatCurrency(amount);
}

/**
 * Get royalty status badge config
 */
export function getRoyaltyStatusConfig(status: 'pending' | 'calculated' | 'paid') {
  const configs = {
    pending: {
      label: 'Chờ tính',
      color: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      icon: '⏳'
    },
    calculated: {
      label: 'Đã tính',
      color: 'bg-blue-100 text-blue-700 border-blue-200',
      icon: '💰'
    },
    paid: {
      label: 'Đã trả',
      color: 'bg-green-100 text-green-700 border-green-200',
      icon: '✓'
    }
  };
  return configs[status];
}

/**
 * Calculate estimated royalty based on article data
 * Using simple global config estimation
 */
export function calculateEstimatedRoyalty(
  wordCount: number,
  views: number,
  status?: string
): number {
  const baseAmount = 500000;
  const wordRate = 100;
  const viewRate = 200;
  const qualityBonus = status === 'published' ? 1000000 : 0;

  const wordAmount = wordCount * wordRate;
  const viewAmount = views * viewRate;

  return Math.round(baseAmount + wordAmount + viewAmount + qualityBonus);
}

/**
 * Check if article is eligible for royalty
 */
export function isEligibleForRoyalty(status: string): boolean {
  return ['published', 'approved'].includes(status.toLowerCase());
}

/**
 * Get royalty tier based on amount
 */
export function getRoyaltyTier(amount: number): {
  tier: string;
  color: string;
} {
  if (amount >= 2000000) {
    return { tier: 'Cao', color: 'text-green-600' };
  }
  if (amount >= 1000000) {
    return { tier: 'Trung bình', color: 'text-blue-600' };
  }
  return { tier: 'Thấp', color: 'text-gray-600' };
}