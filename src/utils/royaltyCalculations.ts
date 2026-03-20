// Royalty calculation utilities

// Royalty tiers configuration (sync with RoyaltyManagementV2)
export const royaltyConfig = {
  news: {
    baseRate: 500, // VND per word
    viewBonus: 50, // VND per view
    tiers: [
      { minWords: 0, maxWords: 500, rate: 500 },
      { minWords: 501, maxWords: 1000, rate: 600 },
      { minWords: 1001, maxWords: 2000, rate: 700 },
      { minWords: 2001, maxWords: 999999, rate: 800 },
    ]
  },
  video: {
    baseRate: 50000, // VND per video
    viewBonus: 100, // VND per view
    durationBonus: 5000, // VND per minute
  },
  gallery: {
    baseRate: 20000, // VND per image
    viewBonus: 30, // VND per view
  },
  document: {
    baseRate: 1000, // VND per page
    downloadBonus: 500, // VND per download
  },
  podcast: {
    baseRate: 80000, // VND per episode
    viewBonus: 80, // VND per listen
  },
  event: {
    baseRate: 100000, // VND per event
    attendeeBonus: 1000, // VND per attendee
  },
  job: {
    baseRate: 50000, // VND per job posting
    applicationBonus: 2000, // VND per application
  },
  person: {
    baseRate: 30000, // VND per profile
    viewBonus: 40,
  },
  download: {
    baseRate: 40000, // VND per downloadable
    downloadBonus: 800,
  },
  infographic: {
    baseRate: 150000, // VND per infographic
    viewBonus: 120,
  }
};

export interface ArticleData {
  id: number;
  title: string;
  type: 'news' | 'video' | 'gallery' | 'document' | 'podcast' | 'event' | 'job' | 'person' | 'download' | 'infographic';
  status: 'published' | 'draft' | 'pending' | 'approved';
  authorId: number;
  authorName: string;
  wordCount?: number;
  views: number;
  publishDate: string;
  category: string;
  thumbnail?: string;
  // Type-specific fields
  duration?: number; // for video/podcast (minutes)
  imageCount?: number; // for gallery
  pageCount?: number; // for document
  downloads?: number; // for document/download
  attendees?: number; // for event
  applications?: number; // for job
  // Multi-section content
  contentMode?: 'legacy' | 'sections';
  sections?: any[];
}

export interface UserData {
  id: number;
  name: string;
  email: string;
  role: string;
  department?: string;
  avatar?: string;
  royaltyPercentage?: number; // Custom percentage (0-100), if null use default
}

export interface CalculatedRoyalty {
  articleId: number;
  authorId: number;
  baseAmount: number;
  bonusAmount: number;
  totalAmount: number;
  calculation: string; // Explain how it was calculated
}

// Calculate royalty for a single article
export function calculateArticleRoyalty(article: ArticleData): CalculatedRoyalty {
  let baseAmount = 0;
  let bonusAmount = 0;
  let calculation = '';

  switch (article.type) {
    case 'news': {
      const wordCount = article.wordCount || 0;
      // Find applicable tier
      const tier = royaltyConfig.news.tiers.find(
        t => wordCount >= t.minWords && wordCount <= t.maxWords
      ) || royaltyConfig.news.tiers[0];
      
      baseAmount = wordCount * tier.rate;
      bonusAmount = article.views * royaltyConfig.news.viewBonus;
      calculation = `${wordCount} từ × ${tier.rate}đ + ${article.views} views × ${royaltyConfig.news.viewBonus}đ`;
      break;
    }
    
    case 'video': {
      const duration = article.duration || 5; // Default 5 minutes
      baseAmount = royaltyConfig.video.baseRate + (duration * royaltyConfig.video.durationBonus);
      bonusAmount = article.views * royaltyConfig.video.viewBonus;
      calculation = `${royaltyConfig.video.baseRate}đ base + ${duration}min × ${royaltyConfig.video.durationBonus}đ + ${article.views} views × ${royaltyConfig.video.viewBonus}đ`;
      break;
    }
    
    case 'gallery': {
      const imageCount = article.imageCount || 10;
      baseAmount = imageCount * royaltyConfig.gallery.baseRate;
      bonusAmount = article.views * royaltyConfig.gallery.viewBonus;
      calculation = `${imageCount} ảnh × ${royaltyConfig.gallery.baseRate}đ + ${article.views} views × ${royaltyConfig.gallery.viewBonus}đ`;
      break;
    }
    
    case 'document': {
      const pageCount = article.pageCount || 1;
      const downloads = article.downloads || 0;
      baseAmount = pageCount * royaltyConfig.document.baseRate;
      bonusAmount = downloads * royaltyConfig.document.downloadBonus;
      calculation = `${pageCount} trang × ${royaltyConfig.document.baseRate}đ + ${downloads} downloads × ${royaltyConfig.document.downloadBonus}đ`;
      break;
    }
    
    case 'podcast': {
      const duration = article.duration || 20; // Default 20 minutes
      baseAmount = royaltyConfig.podcast.baseRate;
      bonusAmount = article.views * royaltyConfig.podcast.viewBonus;
      calculation = `${royaltyConfig.podcast.baseRate}đ base + ${article.views} listens × ${royaltyConfig.podcast.viewBonus}đ`;
      break;
    }
    
    case 'event': {
      const attendees = article.attendees || 0;
      baseAmount = royaltyConfig.event.baseRate;
      bonusAmount = attendees * royaltyConfig.event.attendeeBonus;
      calculation = `${royaltyConfig.event.baseRate}đ base + ${attendees} attendees × ${royaltyConfig.event.attendeeBonus}đ`;
      break;
    }
    
    case 'job': {
      const applications = article.applications || 0;
      baseAmount = royaltyConfig.job.baseRate;
      bonusAmount = applications * royaltyConfig.job.applicationBonus;
      calculation = `${royaltyConfig.job.baseRate}đ base + ${applications} ứng tuyển × ${royaltyConfig.job.applicationBonus}đ`;
      break;
    }
    
    case 'person': {
      baseAmount = royaltyConfig.person.baseRate;
      bonusAmount = article.views * royaltyConfig.person.viewBonus;
      calculation = `${royaltyConfig.person.baseRate}đ base + ${article.views} views × ${royaltyConfig.person.viewBonus}đ`;
      break;
    }
    
    case 'download': {
      const downloads = article.downloads || 0;
      baseAmount = royaltyConfig.download.baseRate;
      bonusAmount = downloads * royaltyConfig.download.downloadBonus;
      calculation = `${royaltyConfig.download.baseRate}đ base + ${downloads} downloads × ${royaltyConfig.download.downloadBonus}đ`;
      break;
    }
    
    case 'infographic': {
      baseAmount = royaltyConfig.infographic.baseRate;
      bonusAmount = article.views * royaltyConfig.infographic.viewBonus;
      calculation = `${royaltyConfig.infographic.baseRate}đ base + ${article.views} views × ${royaltyConfig.infographic.viewBonus}đ`;
      break;
    }
  }

  return {
    articleId: article.id,
    authorId: article.authorId,
    baseAmount,
    bonusAmount,
    totalAmount: baseAmount + bonusAmount,
    calculation
  };
}

// Aggregate royalties by author
export function aggregateRoyaltiesByAuthor(
  articles: ArticleData[],
  users: UserData[]
): {
  userId: number;
  userName: string;
  userEmail: string;
  userRole: string;
  articlesCount: number;
  totalViews: number;
  totalWords: number;
  totalRoyalty: number;
  paidRoyalty: number;
  pendingRoyalty: number;
  articles: (ArticleData & { royalty: CalculatedRoyalty })[];
}[] {
  const userMap = new Map(users.map(u => [u.id, u]));
  const royaltyByAuthor = new Map<number, {
    articles: (ArticleData & { royalty: CalculatedRoyalty })[];
    totalRoyalty: number;
  }>();

  // Calculate royalty for each published article
  const publishedArticles = articles.filter(a => a.status === 'published');
  
  publishedArticles.forEach(article => {
    const royalty = calculateArticleRoyalty(article);
    
    if (!royaltyByAuthor.has(article.authorId)) {
      royaltyByAuthor.set(article.authorId, {
        articles: [],
        totalRoyalty: 0
      });
    }
    
    const authorData = royaltyByAuthor.get(article.authorId)!;
    authorData.articles.push({ ...article, royalty });
    authorData.totalRoyalty += royalty.totalAmount;
  });

  // Build final result
  return Array.from(royaltyByAuthor.entries()).map(([userId, data]) => {
    const user = userMap.get(userId);
    if (!user) return null;

    const totalViews = data.articles.reduce((sum, a) => sum + a.views, 0);
    const totalWords = data.articles.reduce((sum, a) => sum + (a.wordCount || 0), 0);
    
    // For demo: assume 70% is paid, 30% is pending
    const paidRoyalty = Math.floor(data.totalRoyalty * 0.7);
    const pendingRoyalty = data.totalRoyalty - paidRoyalty;

    return {
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      userRole: user.role,
      articlesCount: data.articles.length,
      totalViews,
      totalWords,
      totalRoyalty: data.totalRoyalty,
      paidRoyalty,
      pendingRoyalty,
      articles: data.articles
    };
  }).filter(Boolean) as any[];
}

// Generate payment records from royalty data
export function generatePaymentRecords(
  royaltyByAuthor: ReturnType<typeof aggregateRoyaltiesByAuthor>,
  period: string = 'Tháng 12/2024'
): {
  id: number;
  userId: number;
  userName: string;
  amount: number;
  period: string;
  status: 'pending' | 'processing' | 'paid' | 'failed';
  articlesCount: number;
  paidDate?: string;
  note?: string;
}[] {
  return royaltyByAuthor.map((author, index) => {
    // Simulate payment status
    let status: 'pending' | 'processing' | 'paid' = 'pending';
    let paidDate: string | undefined;
    let note: string | undefined;

    if (author.paidRoyalty > 0) {
      status = 'paid';
      paidDate = '2024-12-05';
      note = 'Đã chuyển khoản';
    } else if (index % 3 === 0) {
      status = 'processing';
    }

    return {
      id: index + 1,
      userId: author.userId,
      userName: author.userName,
      amount: status === 'paid' ? author.paidRoyalty : author.pendingRoyalty,
      period,
      status,
      articlesCount: author.articlesCount,
      paidDate,
      note
    };
  });
}

// Calculate analytics
export function calculateRoyaltyAnalytics(articles: ArticleData[]) {
  const publishedArticles = articles.filter(a => a.status === 'published');
  
  // By type
  const byType = publishedArticles.reduce((acc, article) => {
    const royalty = calculateArticleRoyalty(article);
    if (!acc[article.type]) {
      acc[article.type] = { count: 0, amount: 0 };
    }
    acc[article.type].count++;
    acc[article.type].amount += royalty.totalAmount;
    return acc;
  }, {} as Record<string, { count: number; amount: number }>);

  // By month (simulate past months)
  const byMonth = [
    { month: 'Tháng 12', amount: publishedArticles.reduce((sum, a) => sum + calculateArticleRoyalty(a).totalAmount, 0), growth: 12 },
    { month: 'Tháng 11', amount: publishedArticles.reduce((sum, a) => sum + calculateArticleRoyalty(a).totalAmount, 0) * 0.89, growth: 8 },
    { month: 'Tháng 10', amount: publishedArticles.reduce((sum, a) => sum + calculateArticleRoyalty(a).totalAmount, 0) * 0.82, growth: -5 },
    { month: 'Tháng 9', amount: publishedArticles.reduce((sum, a) => sum + calculateArticleRoyalty(a).totalAmount, 0) * 0.87, growth: 15 },
  ];

  // Average stats
  const totalRoyalty = publishedArticles.reduce((sum, a) => sum + calculateArticleRoyalty(a).totalAmount, 0);
  const averageRoyaltyPerArticle = publishedArticles.length > 0 ? totalRoyalty / publishedArticles.length : 0;
  const averageViewsPerArticle = publishedArticles.length > 0 
    ? publishedArticles.reduce((sum, a) => sum + a.views, 0) / publishedArticles.length 
    : 0;
  const averageWordsPerArticle = publishedArticles.length > 0
    ? publishedArticles.reduce((sum, a) => sum + (a.wordCount || 0), 0) / publishedArticles.length
    : 0;

  return {
    byType,
    byMonth,
    averageRoyaltyPerArticle,
    averageViewsPerArticle,
    averageWordsPerArticle
  };
}