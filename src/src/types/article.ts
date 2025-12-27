// Article Types - Based on go-cms-service schema

export type ArticleStatus = 'draft' | 'pending' | 'published' | 'rejected' | 'archived';

export type ArticleType = 
  | 'news'           // Tin tức
  | 'video'          // Video
  | 'gallery'        // Gallery ảnh
  | 'podcast'        // Podcast
  | 'event'          // Sự kiện
  | 'job'            // Tuyển dụng
  | 'document'       // Văn bản
  | 'legal'          // Văn bản pháp luật
  | 'person'         // Nhân sự
  | 'download'       // Tải xuống
  | 'infographic'    // Infographic
  | 'live'           // Sự kiện trực tuyến
  | 'qa'             // Hỏi đáp
  | 'tutorial';      // Hướng dẫn

export interface Author {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  parentId?: string;
  order: number;
  description?: string;
  children?: Category[];
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface Media {
  id: string;
  url: string;
  type: 'image' | 'video' | 'audio' | 'document';
  title?: string;
  caption?: string;
  alt?: string;
  size: number;
  mimeType: string;
  width?: number;
  height?: number;
  duration?: number; // For video/audio
}

export interface SEO {
  title?: string;
  description?: string;
  keywords?: string[];
  ogImage?: string;
  ogTitle?: string;
  ogDescription?: string;
  canonicalUrl?: string;
  noIndex?: boolean;
  noFollow?: boolean;
}

export interface ArticleStats {
  views: number;
  likes: number;
  shares: number;
  comments: number;
  avgReadTime: number; // in seconds
}

export interface RelatedArticle {
  id: string;
  title: string;
  slug: string;
  featuredImage?: string;
  publishedAt?: string;
}

export interface WorkflowHistory {
  id: string;
  status: ArticleStatus;
  comment?: string;
  createdBy: Author;
  createdAt: string;
}

// Main Article Interface
export interface Article {
  id: string;
  title: string;
  slug: string;
  summary?: string;
  content: string; // HTML from CKEditor
  
  // Classification
  type: ArticleType;
  status: ArticleStatus;
  categories: Category[];
  tags: Tag[];
  
  // Media
  featuredImage?: string;
  gallery?: Media[];
  videos?: Media[];
  audios?: Media[];
  documents?: Media[];
  
  // Authorship
  author: Author;
  contributors?: Author[];
  
  // SEO
  seo?: SEO;
  
  // Stats
  stats?: ArticleStats;
  
  // Relationships
  relatedArticles?: RelatedArticle[];
  
  // Workflow
  workflowHistory?: WorkflowHistory[];
  
  // Scheduling
  publishedAt?: string;
  scheduledAt?: string;
  expiresAt?: string;
  
  // Metadata
  isFeatured: boolean;
  isBreaking: boolean;
  isPinned: boolean;
  allowComments: boolean;
  
  // Type-specific fields
  eventDate?: string;         // For events
  eventLocation?: string;     // For events
  jobPosition?: string;       // For jobs
  jobCompany?: string;        // For jobs
  jobDeadline?: string;       // For jobs
  documentNumber?: string;    // For legal documents
  documentType?: string;      // For legal documents
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

// API Request/Response Types
export interface ArticleCreateInput {
  title: string;
  content: string;
  type: ArticleType;
  summary?: string;
  categoryIds: string[];
  tagIds?: string[];
  featuredImage?: string;
  seo?: SEO;
  scheduledAt?: string;
  isFeatured?: boolean;
  allowComments?: boolean;
}

export interface ArticleUpdateInput extends Partial<ArticleCreateInput> {
  id: string;
}

export interface ArticleQueryParams {
  page?: number;
  limit?: number;
  status?: ArticleStatus | 'all';
  type?: ArticleType | 'all';
  categoryId?: string;
  tagId?: string;
  search?: string;
  sortBy?: 'createdAt' | 'updatedAt' | 'publishedAt' | 'views' | 'title';
  sortOrder?: 'asc' | 'desc';
  authorId?: string;
  isFeatured?: boolean;
  isBreaking?: boolean;
}

export interface ArticleListResponse {
  data: Article[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ArticleStatsResponse {
  totalArticles: number;
  publishedArticles: number;
  draftArticles: number;
  pendingArticles: number;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  articlesByType: Record<ArticleType, number>;
  articlesByStatus: Record<ArticleStatus, number>;
  recentArticles: Article[];
  trendingArticles: Article[];
}
