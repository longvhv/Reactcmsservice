/**
 * API Service Layer
 * 
 * This file simulates API calls with mock data.
 * When real API is ready, replace the mock implementations with actual fetch calls.
 * 
 * Pattern:
 * - All functions are async and return Promises
 * - Include artificial delays to simulate network latency
 * - Use proper TypeScript types
 * - Easy to swap with real API endpoints
 */

import { mockArticles, mockUsers } from '../utils/mockData';

// Simulate network delay
const delay = (ms: number = 300) => new Promise(resolve => setTimeout(resolve, ms));

// Types
export interface Article {
  id: number;
  title: string;
  type: string;
  status: string;
  category: string;
  author?: string;
  authorId?: number;
  authorName?: string;
  views: number;
  comments?: number;
  publishDate: string;
  updatedDate?: string;
  featured?: boolean;
  excerpt?: string;
  content?: string;
  thumbnail?: string;
  // Type-specific fields
  duration?: number | string;
  videoUrl?: string;
  imageCount?: number;
  pageCount?: number;
  downloads?: number;
  attendees?: number;
  applications?: number;
  wordCount?: number;
  tags?: string[];
  relatedArticles?: number[];
  // Multi-section content
  contentMode?: 'legacy' | 'sections';
  sections?: any[];
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  articleType: string;
  parentId?: number;
  description?: string;
  color?: string;
  icon?: string;
  articleCount?: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  department?: string;
  avatar?: string;
  royaltyPercentage?: number;
}

// Mock categories data
const mockCategories: Category[] = [
  { id: 1, name: 'Công nghệ', slug: 'cong-nghe', articleType: 'news', articleCount: 12 },
  { id: 2, name: 'Kinh doanh', slug: 'kinh-doanh', articleType: 'news', articleCount: 8 },
  { id: 3, name: 'Giải trí', slug: 'giai-tri', articleType: 'news', articleCount: 15 },
  { id: 4, name: 'Thể thao', slug: 'the-thao', articleType: 'news', articleCount: 20 },
  { id: 5, name: 'Sức khỏe', slug: 'suc-khoe', articleType: 'news', articleCount: 10 },
  { id: 6, name: 'Du lịch', slug: 'du-lich', articleType: 'gallery', articleCount: 25 },
  { id: 7, name: 'Ẩm thực', slug: 'am-thuc', articleType: 'gallery', articleCount: 18 },
  { id: 8, name: 'Tutorial', slug: 'tutorial', articleType: 'video', articleCount: 30 },
  { id: 9, name: 'Review', slug: 'review', articleType: 'video', articleCount: 22 },
  { id: 10, name: 'Podcast Tech', slug: 'podcast-tech', articleType: 'podcast', articleCount: 15 },
];

// Local storage for mock data persistence (optional)
let articlesStore = [...mockArticles];
let categoriesStore = [...mockCategories];
let usersStore = [...mockUsers];

// ==================== ARTICLES API ====================

/**
 * Get all articles with optional filters
 */
export async function getArticles(params?: {
  type?: string;
  status?: string;
  category?: string;
  search?: string;
  limit?: number;
  offset?: number;
}): Promise<{ articles: Article[]; total: number }> {
  await delay();

  let filtered = [...articlesStore];

  // Apply filters
  if (params?.type) {
    filtered = filtered.filter(a => a.type === params.type);
  }
  if (params?.status) {
    filtered = filtered.filter(a => a.status === params.status);
  }
  if (params?.category) {
    filtered = filtered.filter(a => a.category === params.category);
  }
  if (params?.search) {
    const searchLower = params.search.toLowerCase();
    filtered = filtered.filter(a => 
      a.title.toLowerCase().includes(searchLower) ||
      a.authorName?.toLowerCase().includes(searchLower) ||
      a.category?.toLowerCase().includes(searchLower)
    );
  }

  const total = filtered.length;

  // Apply pagination
  if (params?.limit !== undefined) {
    const offset = params.offset || 0;
    filtered = filtered.slice(offset, offset + params.limit);
  }

  return { articles: filtered, total };
}

/**
 * Get single article by ID
 */
export async function getArticle(id: number): Promise<Article | null> {
  await delay();

  const article = articlesStore.find(a => a.id === id);
  
  if (!article) {
    return null;
  }

  // Add full content for detail view with multi-section support
  return {
    ...article,
    contentMode: 'sections',
    content: `<h1>${article.title}</h1><p>Nội dung chi tiết...</p>`,
    sections: [
      { id: 'sec_1', type: 'html', order: 0, isVisible: true, spacing: 'medium', content: `<h2>Giới thiệu</h2><p>${article.title} - đây là nội dung chi tiết của bài viết. Trong thực tế, nội dung này sẽ được lấy từ database.</p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>` },
      { id: 'sec_2', type: 'callout', order: 1, isVisible: true, spacing: 'medium', variant: 'tip', calloutTitle: 'Lưu ý quan trọng', content: 'Bài viết này sử dụng hệ thống nội dung đa section, cho phép kết hợp nhiều loại nội dung khác nhau.', dismissible: false },
      { id: 'sec_3', type: 'chart', order: 2, isVisible: true, spacing: 'medium', chartType: 'bar', chartTitle: 'Thống kê lượt xem theo tháng', data: [{ label: 'T1', value: 120, color: '#3b82f6' }, { label: 'T2', value: 200, color: '#8b5cf6' }, { label: 'T3', value: 180, color: '#10b981' }, { label: 'T4', value: 350, color: '#f59e0b' }, { label: 'T5', value: 280, color: '#ef4444' }, { label: 'T6', value: 420, color: '#ec4899' }], showLegend: true, showGrid: true, showValues: true, animate: true, colorScheme: ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899'], chartHeight: 300 },
      { id: 'sec_4', type: 'timeline', order: 3, isVisible: true, spacing: 'medium', layout: 'left', showConnector: true, events: [{ id: 'ev1', date: '01/2024', eventTitle: 'Khởi đầu dự án', description: 'Bắt đầu nghiên cứu và lên ý tưởng', color: '#3b82f6' }, { id: 'ev2', date: '03/2024', eventTitle: 'Ra mắt Beta', description: 'Phiên bản beta được phát hành cho nhóm testers', color: '#8b5cf6' }, { id: 'ev3', date: '06/2024', eventTitle: 'Ra mắt chính thức', description: 'Version 1.0 chính thức ra mắt công chúng', color: '#10b981' }] },
      { id: 'sec_5', type: 'quote', order: 4, isVisible: true, spacing: 'medium', text: 'Công nghệ tốt nhất là công nghệ mà bạn không nhận thấy nó đang hoạt động.', author: 'Nguyễn Văn A', source: 'Tech Summit 2024', quoteStyle: 'gradient' },
      { id: 'sec_6', type: 'numbers', order: 5, isVisible: true, spacing: 'medium', columns: 3, animate: true, numbersStyle: 'card', items: [{ id: 'n1', value: 1500, label: 'Người dùng', suffix: '+' }, { id: 'n2', value: 99, label: 'Uptime', suffix: '%' }, { id: 'n3', value: 50, label: 'Tính năng', suffix: '+' }] },
      { id: 'sec_7', type: 'html', order: 6, isVisible: true, spacing: 'medium', content: '<h2>Kết luận</h2><p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.</p>' },
      { id: 'sec_8', type: 'cta', order: 7, isVisible: true, spacing: 'medium', ctaTitle: 'Bắt đầu sử dụng ngay', description: 'Trải nghiệm hệ thống CMS hiện đại với nhiều tính năng vượt trội', buttonText: 'Dùng thử miễn phí', buttonUrl: '#', buttonStyle: 'primary', ctaLayout: 'centered' },
    ],
    tags: ['công nghệ', 'AI', 'machine learning'],
    relatedArticles: [2, 3, 4],
  };
}

/**
 * Create new article
 */
export async function createArticle(data: Partial<Article>): Promise<Article> {
  await delay(500);

  const newArticle: Article = {
    id: Math.max(...articlesStore.map(a => a.id), 0) + 1,
    title: data.title || 'Untitled',
    type: data.type || 'news',
    status: data.status || 'draft',
    category: data.category || 'Uncategorized',
    author: data.author,
    authorId: data.authorId,
    authorName: data.authorName,
    views: 0,
    comments: 0,
    publishDate: data.publishDate || new Date().toISOString().split('T')[0],
    updatedDate: new Date().toISOString().split('T')[0],
    featured: data.featured || false,
    excerpt: data.excerpt,
    content: data.content,
    thumbnail: data.thumbnail,
    duration: data.duration,
    videoUrl: data.videoUrl,
    imageCount: data.imageCount,
    pageCount: data.pageCount,
    downloads: data.downloads || 0,
    attendees: data.attendees,
    applications: data.applications || 0,
    wordCount: data.wordCount,
    tags: data.tags || [],
    relatedArticles: data.relatedArticles || [],
    contentMode: data.contentMode || 'legacy',
    sections: data.sections || [],
  };

  articlesStore.push(newArticle);
  
  return newArticle;
}

/**
 * Update existing article
 */
export async function updateArticle(id: number, data: Partial<Article>): Promise<Article | null> {
  await delay(500);

  const index = articlesStore.findIndex(a => a.id === id);
  
  if (index === -1) {
    return null;
  }

  articlesStore[index] = {
    ...articlesStore[index],
    ...data,
    updatedDate: new Date().toISOString().split('T')[0],
  };

  return articlesStore[index];
}

/**
 * Delete article
 */
export async function deleteArticle(id: number): Promise<boolean> {
  await delay(500);

  const index = articlesStore.findIndex(a => a.id === id);
  
  if (index === -1) {
    return false;
  }

  articlesStore.splice(index, 1);
  return true;
}

/**
 * Bulk delete articles
 */
export async function bulkDeleteArticles(ids: number[]): Promise<number> {
  await delay(500);

  let deletedCount = 0;
  
  ids.forEach(id => {
    const index = articlesStore.findIndex(a => a.id === id);
    if (index !== -1) {
      articlesStore.splice(index, 1);
      deletedCount++;
    }
  });

  return deletedCount;
}

/**
 * Bulk update article status
 */
export async function bulkUpdateStatus(ids: number[], status: string): Promise<number> {
  await delay(500);

  let updatedCount = 0;
  
  ids.forEach(id => {
    const article = articlesStore.find(a => a.id === id);
    if (article) {
      article.status = status;
      article.updatedDate = new Date().toISOString().split('T')[0];
      updatedCount++;
    }
  });

  return updatedCount;
}

// ==================== CATEGORIES API ====================

/**
 * Get all categories with optional filters
 */
export async function getCategories(params?: {
  articleType?: string;
  parentId?: number | null;
}): Promise<Category[]> {
  await delay();

  let filtered = [...categoriesStore];

  if (params?.articleType) {
    filtered = filtered.filter(c => c.articleType === params.articleType);
  }

  if (params?.parentId !== undefined) {
    filtered = filtered.filter(c => c.parentId === params.parentId);
  }

  return filtered;
}

/**
 * Get single category by ID
 */
export async function getCategory(id: number): Promise<Category | null> {
  await delay();

  return categoriesStore.find(c => c.id === id) || null;
}

/**
 * Create new category
 */
export async function createCategory(data: Partial<Category>): Promise<Category> {
  await delay(500);

  const newCategory: Category = {
    id: Math.max(...categoriesStore.map(c => c.id), 0) + 1,
    name: data.name || 'Untitled Category',
    slug: data.slug || data.name?.toLowerCase().replace(/\s+/g, '-') || 'untitled',
    articleType: data.articleType || 'news',
    parentId: data.parentId,
    description: data.description,
    color: data.color,
    icon: data.icon,
    articleCount: 0,
  };

  categoriesStore.push(newCategory);
  
  return newCategory;
}

/**
 * Update existing category
 */
export async function updateCategory(id: number, data: Partial<Category>): Promise<Category | null> {
  await delay(500);

  const index = categoriesStore.findIndex(c => c.id === id);
  
  if (index === -1) {
    return null;
  }

  categoriesStore[index] = {
    ...categoriesStore[index],
    ...data,
  };

  return categoriesStore[index];
}

/**
 * Delete category
 */
export async function deleteCategory(id: number): Promise<boolean> {
  await delay(500);

  const index = categoriesStore.findIndex(c => c.id === id);
  
  if (index === -1) {
    return false;
  }

  categoriesStore.splice(index, 1);
  return true;
}

// ==================== USERS API ====================

/**
 * Get all users with optional filters
 */
export async function getUsers(params?: {
  role?: string;
  department?: string;
  search?: string;
}): Promise<User[]> {
  await delay();

  let filtered = [...usersStore];

  if (params?.role) {
    filtered = filtered.filter(u => u.role === params.role);
  }

  if (params?.department) {
    filtered = filtered.filter(u => u.department === params.department);
  }

  if (params?.search) {
    const searchLower = params.search.toLowerCase();
    filtered = filtered.filter(u => 
      u.name.toLowerCase().includes(searchLower) ||
      u.email.toLowerCase().includes(searchLower) ||
      u.role.toLowerCase().includes(searchLower)
    );
  }

  return filtered;
}

/**
 * Get single user by ID
 */
export async function getUser(id: number): Promise<User | null> {
  await delay();

  return usersStore.find(u => u.id === id) || null;
}

/**
 * Create new user
 */
export async function createUser(data: Partial<User>): Promise<User> {
  await delay(500);

  const newUser: User = {
    id: Math.max(...usersStore.map(u => u.id), 0) + 1,
    name: data.name || 'Unknown',
    email: data.email || '',
    role: data.role || 'User',
    department: data.department,
    avatar: data.avatar,
    royaltyPercentage: data.royaltyPercentage || 100,
  };

  usersStore.push(newUser);
  
  return newUser;
}

/**
 * Update existing user
 */
export async function updateUser(id: number, data: Partial<User>): Promise<User | null> {
  await delay(500);

  const index = usersStore.findIndex(u => u.id === id);
  
  if (index === -1) {
    return null;
  }

  usersStore[index] = {
    ...usersStore[index],
    ...data,
  };

  return usersStore[index];
}

/**
 * Delete user
 */
export async function deleteUser(id: number): Promise<boolean> {
  await delay(500);

  const index = usersStore.findIndex(u => u.id === id);
  
  if (index === -1) {
    return false;
  }

  usersStore.splice(index, 1);
  return true;
}

// ==================== SEED DATA (for DevTools) ====================

/**
 * Reset all data to initial mock data
 */
export async function seedDatabase(): Promise<{ success: boolean; message: string }> {
  await delay(1000);

  articlesStore = [...mockArticles];
  categoriesStore = [...mockCategories];
  usersStore = [...mockUsers];

  return {
    success: true,
    message: `Database seeded with ${articlesStore.length} articles, ${categoriesStore.length} categories, and ${usersStore.length} users`,
  };
}

// ==================== STATS API ====================

/**
 * Get dashboard statistics
 */
export async function getStats(): Promise<{
  totalArticles: number;
  publishedArticles: number;
  draftArticles: number;
  totalViews: number;
  totalComments: number;
}> {
  await delay();

  const stats = {
    totalArticles: articlesStore.length,
    publishedArticles: articlesStore.filter(a => a.status === 'published').length,
    draftArticles: articlesStore.filter(a => a.status === 'draft').length,
    totalViews: articlesStore.reduce((sum, a) => sum + a.views, 0),
    totalComments: articlesStore.reduce((sum, a) => sum + (a.comments || 0), 0),
  };

  return stats;
}

/**
 * When ready to integrate real API, replace implementations like this:
 * 
 * export async function getArticles(params) {
 *   const queryString = new URLSearchParams(params).toString();
 *   const response = await fetch(`/api/articles?${queryString}`);
 *   if (!response.ok) throw new Error('Failed to fetch articles');
 *   return response.json();
 * }
 */
