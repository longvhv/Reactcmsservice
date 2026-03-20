/**
 * Royalty Calculation Service
 * Service để tính toán nhuận bút dựa trên cấu hình và bài viết
 * Tích hợp với: Articles, Moderation, Users, Groups
 */

export interface RoyaltyConfig {
  id: string;
  name: string;
  scope: 'global' | 'group' | 'user';
  calculationType: 'fixed_per_article' | 'view_based' | 'word_count' | 'hybrid' | 'revenue_share';
  priority: number;
  status: 'active' | 'inactive';
  
  // Calculation parameters
  fixedAmount?: number;
  baseAmount?: number;
  viewRate?: number;
  wordRate?: number;
  qualityBonus?: number;
  revenuePercentage?: number;
  
  // Scope details
  groupId?: string;
  userId?: string;
  
  // Conditions
  minWords?: number;
  minViews?: number;
  requiredStatus?: 'published' | 'approved';
}

export interface Article {
  id: number;
  title: string;
  authorId: number;
  author: string;
  type: string;
  status: 'draft' | 'pending' | 'approved' | 'published' | 'rejected';
  views: number;
  wordCount: number;
  publishDate: string;
  revenue?: number;
  categoryId?: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  groupIds?: string[];
}

export interface RoyaltyCalculationResult {
  articleId: number;
  authorId: number;
  configId: string;
  configName: string;
  amount: number;
  breakdown: {
    base?: number;
    views?: number;
    words?: number;
    quality?: number;
    revenue?: number;
  };
  calculatedAt: Date;
  status: 'pending' | 'calculated' | 'paid';
}

/**
 * RoyaltyCalculationService
 * Tính toán nhuận bút dựa trên cấu hình và bài viết
 */
export class RoyaltyCalculationService {
  private configs: RoyaltyConfig[] = [];
  
  constructor(configs: RoyaltyConfig[]) {
    this.configs = configs.filter(c => c.status === 'active').sort((a, b) => b.priority - a.priority);
  }
  
  /**
   * Tìm cấu hình phù hợp nhất cho tác giả
   * Priority: User-specific > Group-specific > Global
   */
  findApplicableConfig(user: User, article: Article): RoyaltyConfig | null {
    // 1. Check user-specific config
    const userConfig = this.configs.find(
      c => c.scope === 'user' && c.userId === user.id.toString()
    );
    if (userConfig) return userConfig;
    
    // 2. Check group-specific configs
    if (user.groupIds && user.groupIds.length > 0) {
      const groupConfig = this.configs.find(
        c => c.scope === 'group' && user.groupIds!.includes(c.groupId!)
      );
      if (groupConfig) return groupConfig;
    }
    
    // 3. Check global config
    const globalConfig = this.configs.find(c => c.scope === 'global');
    return globalConfig || null;
  }
  
  /**
   * Kiểm tra bài viết có đủ điều kiện nhận nhuận bút không
   */
  isEligible(article: Article, config: RoyaltyConfig): boolean {
    // Check status requirement (integration with moderation)
    if (config.requiredStatus) {
      // Only approved/published articles are eligible
      if (!['approved', 'published'].includes(article.status)) {
        return false;
      }
    }
    
    // Check minimum words
    if (config.minWords && article.wordCount < config.minWords) {
      return false;
    }
    
    // Check minimum views
    if (config.minViews && article.views < config.minViews) {
      return false;
    }
    
    return true;
  }
  
  /**
   * Tính toán nhuận bút cho một bài viết
   */
  calculateRoyalty(
    article: Article,
    user: User,
    config: RoyaltyConfig
  ): RoyaltyCalculationResult | null {
    // Check eligibility
    if (!this.isEligible(article, config)) {
      return null;
    }
    
    let amount = 0;
    const breakdown: any = {};
    
    switch (config.calculationType) {
      case 'fixed_per_article':
        amount = config.fixedAmount || 0;
        breakdown.base = amount;
        break;
        
      case 'view_based':
        const viewBonus = article.views * (config.viewRate || 0);
        amount = (config.baseAmount || 0) + viewBonus;
        breakdown.base = config.baseAmount || 0;
        breakdown.views = viewBonus;
        break;
        
      case 'word_count':
        const wordBonus = article.wordCount * (config.wordRate || 0);
        amount = (config.baseAmount || 0) + wordBonus;
        breakdown.base = config.baseAmount || 0;
        breakdown.words = wordBonus;
        break;
        
      case 'hybrid':
        const baseAmount = config.baseAmount || 0;
        const viewAmount = article.views * (config.viewRate || 0);
        const wordAmount = article.wordCount * (config.wordRate || 0);
        const qualityAmount = article.status === 'published' ? (config.qualityBonus || 0) : 0;
        
        amount = baseAmount + viewAmount + wordAmount + qualityAmount;
        breakdown.base = baseAmount;
        breakdown.views = viewAmount;
        breakdown.words = wordAmount;
        breakdown.quality = qualityAmount;
        break;
        
      case 'revenue_share':
        if (article.revenue) {
          const revenueAmount = article.revenue * ((config.revenuePercentage || 0) / 100);
          amount = revenueAmount;
          breakdown.revenue = revenueAmount;
        }
        break;
    }
    
    return {
      articleId: article.id,
      authorId: user.id,
      configId: config.id,
      configName: config.name,
      amount: Math.round(amount),
      breakdown,
      calculatedAt: new Date(),
      status: 'calculated'
    };
  }
  
  /**
   * Tính toán nhuận bút cho nhiều bài viết
   */
  calculateBatch(
    articles: Article[],
    users: Map<number, User>
  ): RoyaltyCalculationResult[] {
    const results: RoyaltyCalculationResult[] = [];
    
    for (const article of articles) {
      const user = users.get(article.authorId);
      if (!user) continue;
      
      const config = this.findApplicableConfig(user, article);
      if (!config) continue;
      
      const result = this.calculateRoyalty(article, user, config);
      if (result) {
        results.push(result);
      }
    }
    
    return results;
  }
  
  /**
   * Tính tổng nhuận bút theo tác giả
   */
  aggregateByAuthor(results: RoyaltyCalculationResult[]): Map<number, {
    authorId: number;
    totalAmount: number;
    articlesCount: number;
    results: RoyaltyCalculationResult[];
  }> {
    const aggregated = new Map();
    
    for (const result of results) {
      const existing = aggregated.get(result.authorId) || {
        authorId: result.authorId,
        totalAmount: 0,
        articlesCount: 0,
        results: []
      };
      
      existing.totalAmount += result.amount;
      existing.articlesCount += 1;
      existing.results.push(result);
      
      aggregated.set(result.authorId, existing);
    }
    
    return aggregated;
  }
  
  /**
   * Tính tổng nhuận bút theo khoảng thời gian
   */
  aggregateByPeriod(
    results: RoyaltyCalculationResult[],
    startDate: Date,
    endDate: Date
  ): {
    totalAmount: number;
    articlesCount: number;
    authorsCount: number;
    results: RoyaltyCalculationResult[];
  } {
    const filteredResults = results.filter(r => {
      const calcDate = new Date(r.calculatedAt);
      return calcDate >= startDate && calcDate <= endDate;
    });
    
    const authorIds = new Set(filteredResults.map(r => r.authorId));
    
    return {
      totalAmount: filteredResults.reduce((sum, r) => sum + r.amount, 0),
      articlesCount: filteredResults.length,
      authorsCount: authorIds.size,
      results: filteredResults
    };
  }
}

/**
 * Helper function: Format currency
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);
}

/**
 * Helper function: Get royalty status color
 */
export function getRoyaltyStatusColor(status: string): string {
  const colors = {
    pending: 'yellow',
    calculated: 'blue',
    paid: 'green',
    processing: 'purple',
    failed: 'red'
  };
  return colors[status as keyof typeof colors] || 'gray';
}

/**
 * Example usage and integration guide
 */
export const INTEGRATION_GUIDE = {
  // 1. With Article Management
  articleManagement: `
    // When article is published/approved, trigger royalty calculation
    const calculationService = new RoyaltyCalculationService(configs);
    const result = calculationService.calculateRoyalty(article, user, config);
  `,
  
  // 2. With Content Moderation
  contentModeration: `
    // After article approval, calculate royalty
    onArticleApproved: (article) => {
      if (article.status === 'approved') {
        const royalty = calculateRoyaltyForArticle(article);
        saveRoyaltyRecord(royalty);
      }
    }
  `,
  
  // 3. With User Management
  userManagement: `
    // Get user's total royalty
    const userRoyalties = royaltyResults.filter(r => r.authorId === userId);
    const totalAmount = userRoyalties.reduce((sum, r) => sum + r.amount, 0);
  `,
  
  // 4. With Analytics
  analytics: `
    // Generate royalty reports
    const periodRoyalty = calculationService.aggregateByPeriod(
      results, 
      startDate, 
      endDate
    );
  `
};

/**
 * Mock data for testing integration
 */
export const MOCK_ROYALTY_CONFIGS: RoyaltyConfig[] = [
  {
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
  },
  {
    id: 'cfg-2',
    name: 'Biên tập viên cao cấp',
    scope: 'group',
    groupId: 'group-editors',
    calculationType: 'hybrid',
    priority: 5,
    status: 'active',
    baseAmount: 800000,
    viewRate: 300,
    wordRate: 150,
    qualityBonus: 1500000,
    requiredStatus: 'approved'
  },
  {
    id: 'cfg-3',
    name: 'Tác giả đặc biệt - Nguyễn Văn A',
    scope: 'user',
    userId: '1',
    calculationType: 'revenue_share',
    priority: 10,
    status: 'active',
    revenuePercentage: 25,
    requiredStatus: 'published'
  }
];
