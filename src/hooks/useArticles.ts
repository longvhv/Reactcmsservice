import { useState, useEffect } from 'react';

export interface Article {
  id: number;
  title: string;
  type: string;
  status: 'published' | 'draft' | 'pending' | 'review' | 'scheduled' | 'archived';
  category: string;
  author: string;
  authorId: number;
  views: number;
  comments: number;
  publishDate: string;
  updatedDate: string;
  featured?: boolean;
  thumbnail?: string;
  excerpt?: string;
  content?: string;
  // Type-specific fields
  duration?: string;
  videoUrl?: string;
  imageCount?: number;
  documentNumber?: string;
  position?: string;
  location?: string;
  deadline?: string;
  episode?: number;
  audioUrl?: string;
  eventDate?: string;
  eventTime?: string;
  registrationCount?: number;
  maxParticipants?: number;
  department?: string;
  joinDate?: string;
  fileSize?: string;
  fileType?: string;
  downloadCount?: number;
  // Royalty fields
  wordCount?: number;
  royaltyAmount?: number;
  royaltyStatus?: 'pending' | 'calculated' | 'paid';
  royaltyConfig?: string;
}

const MOCK_ARTICLES: Article[] = [
  {
    id: 1,
    title: 'AI Revolution: Xu huong tri tue nhan tao nam 2026',
    type: 'news',
    status: 'published',
    category: 'Cong nghe',
    author: 'Nguyen Van A',
    authorId: 1,
    views: 5234,
    comments: 89,
    publishDate: '2026-02-20',
    updatedDate: '2026-02-22',
    featured: true,
    excerpt: 'Kham pha nhung xu huong AI moi nhat dang dinh hinh tuong lai cong nghe.',
    wordCount: 1500,
    royaltyAmount: 750000,
    royaltyStatus: 'paid',
  },
  {
    id: 2,
    title: 'Cloud Infrastructure: Best Practices cho doanh nghiep',
    type: 'news',
    status: 'published',
    category: 'Ha tang',
    author: 'Tran Thi B',
    authorId: 2,
    views: 4876,
    comments: 72,
    publishDate: '2026-02-18',
    updatedDate: '2026-02-19',
    featured: false,
    excerpt: 'Huong dan trien khai ha tang cloud hieu qua va toi uu chi phi.',
    wordCount: 2200,
    royaltyAmount: 1100000,
    royaltyStatus: 'calculated',
  },
  {
    id: 3,
    title: 'Blockchain & Web3: Co hoi va thach thuc',
    type: 'news',
    status: 'draft',
    category: 'Blockchain',
    author: 'Le Van C',
    authorId: 3,
    views: 4123,
    comments: 65,
    publishDate: '2026-02-15',
    updatedDate: '2026-02-17',
    featured: false,
    excerpt: 'Phan tich sau ve tuong lai cua blockchain va web3 trong nam 2026.',
    wordCount: 1800,
    royaltyAmount: 900000,
    royaltyStatus: 'pending',
  },
  {
    id: 4,
    title: 'Machine Learning trong thuc te: Case studies tu Viet Nam',
    type: 'news',
    status: 'review',
    category: 'AI/ML',
    author: 'Pham Thi D',
    authorId: 4,
    views: 3987,
    comments: 58,
    publishDate: '2026-02-12',
    updatedDate: '2026-02-14',
    featured: true,
    excerpt: 'Nhung ung dung thuc te cua ML tai cac doanh nghiep Viet Nam.',
    wordCount: 2500,
    royaltyAmount: 1250000,
    royaltyStatus: 'calculated',
  },
  {
    id: 5,
    title: 'DevOps: Automation va CI/CD Pipeline',
    type: 'news',
    status: 'published',
    category: 'DevOps',
    author: 'Hoang Van E',
    authorId: 5,
    views: 3654,
    comments: 52,
    publishDate: '2026-02-10',
    updatedDate: '2026-02-11',
    featured: false,
    excerpt: 'Xay dung pipeline CI/CD hien dai voi cac cong cu ma nguon mo.',
    wordCount: 1200,
    royaltyAmount: 600000,
    royaltyStatus: 'paid',
  },
  {
    id: 6,
    title: 'Huong dan su dung Kubernetes cho nguoi moi',
    type: 'video',
    status: 'published',
    category: 'Tutorial',
    author: 'Nguyen Van A',
    authorId: 1,
    views: 8921,
    comments: 134,
    publishDate: '2026-02-08',
    updatedDate: '2026-02-09',
    featured: true,
    duration: '45:30',
    videoUrl: 'https://example.com/video1',
    excerpt: 'Video huong dan chi tiet ve Kubernetes tu co ban den nang cao.',
    wordCount: 0,
    royaltyAmount: 500000,
    royaltyStatus: 'paid',
  },
  {
    id: 7,
    title: 'Bo anh: Hoi nghi Tech Summit Vietnam 2026',
    type: 'gallery',
    status: 'published',
    category: 'Su kien',
    author: 'Tran Thi B',
    authorId: 2,
    views: 2345,
    comments: 28,
    publishDate: '2026-02-05',
    updatedDate: '2026-02-06',
    featured: false,
    imageCount: 48,
    excerpt: 'Hinh anh noi bat tu hoi nghi cong nghe lon nhat Viet Nam.',
    wordCount: 300,
    royaltyAmount: 200000,
    royaltyStatus: 'pending',
  },
  {
    id: 8,
    title: 'Podcast: Tuong lai cua Remote Work',
    type: 'podcast',
    status: 'scheduled',
    category: 'Workplace',
    author: 'Le Van C',
    authorId: 3,
    views: 1567,
    comments: 41,
    publishDate: '2026-03-01',
    updatedDate: '2026-02-25',
    featured: false,
    episode: 15,
    audioUrl: 'https://example.com/podcast1',
    excerpt: 'Thao luan ve xu huong lam viec tu xa va hybrid workplace.',
    wordCount: 0,
    royaltyAmount: 400000,
    royaltyStatus: 'pending',
  },
];

let mockArticlesState = [...MOCK_ARTICLES];

export function useArticles() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      setError(null);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      setArticles([...mockArticlesState]);
    } catch (err) {
      console.error('Error fetching articles:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  const createArticle = async (articleData: Omit<Article, 'id'>) => {
    const newId = Math.max(...mockArticlesState.map(a => a.id), 0) + 1;
    const newArticle = { ...articleData, id: newId } as Article;
    mockArticlesState = [...mockArticlesState, newArticle];
    await fetchArticles();
    return newArticle;
  };

  const updateArticle = async (id: number, articleData: Partial<Article>) => {
    mockArticlesState = mockArticlesState.map(a =>
      a.id === id ? { ...a, ...articleData } : a
    );
    await fetchArticles();
    return mockArticlesState.find(a => a.id === id);
  };

  const deleteArticle = async (id: number) => {
    mockArticlesState = mockArticlesState.filter(a => a.id !== id);
    await fetchArticles();
    return true;
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  return {
    articles,
    loading,
    error,
    refetch: fetchArticles,
    createArticle,
    updateArticle,
    deleteArticle,
  };
}
