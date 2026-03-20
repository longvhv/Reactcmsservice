import { useState, useEffect, useCallback } from 'react';
import { RoyaltyCalculationService, RoyaltyCalculationResult, RoyaltyConfig } from '../components/RoyaltyCalculationService';

/**
 * Hook để quản lý royalty cho một bài viết
 */
export function useArticleRoyalty(articleId: number) {
  const [royalty, setRoyalty] = useState<RoyaltyCalculationResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRoyalty = async () => {
      try {
        setLoading(true);
        // Simulate API call
        // const data = await fetch(`/api/royalty/article/${articleId}`).then(r => r.json());
        // setRoyalty(data);
        
        // Mock data for now
        setRoyalty({
          articleId,
          authorId: 1,
          configId: 'cfg-1',
          configName: 'Cấu hình toàn cục',
          amount: 850000,
          breakdown: {
            base: 500000,
            views: 250000,
            words: 100000
          },
          calculatedAt: new Date(),
          status: 'calculated'
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchRoyalty();
  }, [articleId]);

  const recalculate = useCallback(async () => {
    // Trigger recalculation
    setLoading(true);
    try {
      // await fetch(`/api/royalty/article/${articleId}/recalculate`, { method: 'POST' });
      // Refresh data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [articleId]);

  return { royalty, loading, error, recalculate };
}

/**
 * Hook để quản lý royalty summary cho một user
 */
export function useUserRoyalty(userId: number) {
  const [data, setData] = useState({
    totalRoyalty: 0,
    paidRoyalty: 0,
    pendingRoyalty: 0,
    articlesCount: 0,
    appliedConfig: null as RoyaltyConfig | null
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserRoyalty = async () => {
      try {
        setLoading(true);
        // Simulate API call
        // const response = await fetch(`/api/royalty/user/${userId}`).then(r => r.json());
        // setData(response);
        
        // Mock data
        setData({
          totalRoyalty: 35500000,
          paidRoyalty: 28000000,
          pendingRoyalty: 7500000,
          articlesCount: 45,
          appliedConfig: {
            id: 'cfg-1',
            name: 'Cấu hình toàn cục - Hybrid',
            scope: 'global',
            calculationType: 'hybrid',
            priority: 1,
            status: 'active',
            baseAmount: 500000,
            viewRate: 200,
            wordRate: 100,
            qualityBonus: 1000000,
            requiredStatus: 'published'
          }
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserRoyalty();
  }, [userId]);

  return { data, loading };
}

/**
 * Hook để quản lý danh sách royalty records
 */
export function useRoyaltyRecords(filters: {
  userId?: number;
  period?: string;
  status?: string;
} = {}) {
  const [records, setRecords] = useState<RoyaltyCalculationResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        setLoading(true);
        // Simulate API call with filters
        // const params = new URLSearchParams(filters as any);
        // const data = await fetch(`/api/royalty/records?${params}`).then(r => r.json());
        // setRecords(data);
        
        // Mock data
        setRecords([
          {
            articleId: 1,
            authorId: 1,
            configId: 'cfg-1',
            configName: 'Cấu hình toàn cục',
            amount: 850000,
            breakdown: { base: 500000, views: 250000, words: 100000 },
            calculatedAt: new Date('2024-12-15'),
            status: 'calculated'
          },
          {
            articleId: 2,
            authorId: 1,
            configId: 'cfg-1',
            configName: 'Cấu hình toàn cục',
            amount: 920000,
            breakdown: { base: 500000, views: 180000, words: 240000 },
            calculatedAt: new Date('2024-12-18'),
            status: 'paid'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, [filters.userId, filters.period, filters.status]);

  return { records, loading };
}

/**
 * Hook để quản lý royalty analytics
 */
export function useRoyaltyAnalytics(period: string = 'month') {
  const [analytics, setAnalytics] = useState({
    trendData: [] as any[],
    byType: [] as any[],
    byConfig: [] as any[],
    topAuthors: [] as any[]
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        // Simulate API call
        // const data = await fetch(`/api/royalty/analytics?period=${period}`).then(r => r.json());
        // setAnalytics(data);
        
        // Mock data
        setAnalytics({
          trendData: [
            { month: 'T8', amount: 32000000 },
            { month: 'T9', amount: 37000000 },
            { month: 'T10', amount: 35000000 },
            { month: 'T11', amount: 38000000 },
            { month: 'T12', amount: 45000000 }
          ],
          byType: [
            { type: 'Tin tức', amount: 25000000, count: 85 },
            { type: 'Video', amount: 15000000, count: 22 },
            { type: 'Gallery', amount: 3000000, count: 18 },
            { type: 'Tài liệu', amount: 2000000, count: 12 }
          ],
          byConfig: [
            { config: 'Toàn cục', amount: 28000000 },
            { config: 'Biên tập viên', amount: 12000000 },
            { config: 'Đặc biệt', amount: 5000000 }
          ],
          topAuthors: [
            { id: 1, name: 'Nguyễn Văn A', amount: 8500000, articles: 12 },
            { id: 2, name: 'Trần Thị B', amount: 6200000, articles: 9 },
            { id: 3, name: 'Lê Văn C', amount: 5800000, articles: 7 }
          ]
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [period]);

  return { analytics, loading };
}

/**
 * Hook để tính toán royalty estimate (realtime)
 */
export function useRoyaltyEstimate(article: {
  views: number;
  wordCount: number;
  status: string;
}) {
  const [estimate, setEstimate] = useState<number | null>(null);

  useEffect(() => {
    // Simple estimation using global config
    const baseAmount = 500000;
    const viewRate = 200;
    const wordRate = 100;
    const qualityBonus = article.status === 'published' ? 1000000 : 0;

    const calculated = baseAmount + 
                      (article.views * viewRate) + 
                      (article.wordCount * wordRate) + 
                      qualityBonus;

    setEstimate(Math.round(calculated));
  }, [article.views, article.wordCount, article.status]);

  return estimate;
}

/**
 * Hook để quản lý payment processing
 */
export function useRoyaltyPayment() {
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processPayment = useCallback(async (
    userId: number,
    period: string,
    amount: number
  ) => {
    try {
      setProcessing(true);
      setError(null);
      
      // Simulate API call
      // await fetch('/api/royalty/payments/process', {
      //   method: 'POST',
      //   body: JSON.stringify({ userId, period, amount })
      // });
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed');
      return false;
    } finally {
      setProcessing(false);
    }
  }, []);

  const batchPayment = useCallback(async (payments: Array<{
    userId: number;
    period: string;
    amount: number;
  }>) => {
    try {
      setProcessing(true);
      setError(null);
      
      // Process all payments
      const results = await Promise.all(
        payments.map(p => processPayment(p.userId, p.period, p.amount))
      );
      
      return results.every(r => r);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Batch payment failed');
      return false;
    } finally {
      setProcessing(false);
    }
  }, [processPayment]);

  return { processPayment, batchPayment, processing, error };
}

/**
 * Hook để validate royalty config
 */
export function useRoyaltyConfigValidation() {
  const validate = useCallback((config: Partial<RoyaltyConfig>): {
    valid: boolean;
    errors: string[];
  } => {
    const errors: string[] = [];

    if (!config.name || config.name.trim().length === 0) {
      errors.push('Tên cấu hình không được để trống');
    }

    if (!config.scope) {
      errors.push('Phạm vi áp dụng không được để trống');
    }

    if (!config.calculationType) {
      errors.push('Loại tính toán không được để trống');
    }

    // Validate based on calculation type
    switch (config.calculationType) {
      case 'fixed_per_article':
        if (!config.fixedAmount || config.fixedAmount <= 0) {
          errors.push('Số tiền cố định phải lớn hơn 0');
        }
        break;

      case 'view_based':
        if (!config.baseAmount || config.baseAmount < 0) {
          errors.push('Số tiền cơ bản không hợp lệ');
        }
        if (!config.viewRate || config.viewRate <= 0) {
          errors.push('Đơn giá theo view phải lớn hơn 0');
        }
        break;

      case 'word_count':
        if (!config.baseAmount || config.baseAmount < 0) {
          errors.push('Số tiền cơ bản không hợp lệ');
        }
        if (!config.wordRate || config.wordRate <= 0) {
          errors.push('Đơn giá theo từ phải lớn hơn 0');
        }
        break;

      case 'hybrid':
        if (config.baseAmount && config.baseAmount < 0) {
          errors.push('Số tiền cơ bản không hợp lệ');
        }
        if (!config.viewRate && !config.wordRate && !config.qualityBonus) {
          errors.push('Phải có ít nhất một thành phần tính toán');
        }
        break;

      case 'revenue_share':
        if (!config.revenuePercentage || config.revenuePercentage <= 0 || config.revenuePercentage > 100) {
          errors.push('Phần trăm chia sẻ phải từ 1-100');
        }
        break;
    }

    // Validate scope-specific requirements
    if (config.scope === 'group' && !config.groupId) {
      errors.push('Phải chọn nhóm người dùng');
    }

    if (config.scope === 'user' && !config.userId) {
      errors.push('Phải chọn người dùng');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }, []);

  return { validate };
}
