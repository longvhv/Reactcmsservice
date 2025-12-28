/**
 * Article Domain Types
 * Type definitions for articles and related entities
 */

import type { ArticleType } from '../constants/article-types';
import type { StatusType } from '../constants/status-types';

export interface Article {
  id: number;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  type: ArticleType;
  status: StatusType;
  
  // Media
  featuredImage?: string;
  gallery?: GalleryImage[];
  videoUrl?: string;
  audioUrl?: string;
  
  // Taxonomy
  categoryId?: number;
  categories?: string[];
  tags?: string[];
  
  // Author & Dates
  author: string;
  authorId?: number;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  scheduledAt?: string;
  
  // Engagement
  views?: number;
  likes?: number;
  comments?: number;
  shares?: number;
  
  // SEO
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  canonicalUrl?: string;
  
  // Type-specific fields
  videoData?: VideoData;
  podcastData?: PodcastData;
  eventData?: EventData;
  recruitmentData?: RecruitmentData;
  downloadData?: DownloadData;
  
  // Workflow
  approvalStatus?: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
  approvedAt?: string;
  rejectionReason?: string;
  
  // Advanced
  isSticky?: boolean;
  isFeatured?: boolean;
  allowComments?: boolean;
  language?: string;
  translations?: Record<string, number>; // languageCode -> articleId
}

export interface GalleryImage {
  id: number;
  url: string;
  caption: string;
  alt?: string;
  file?: File;
}

export interface VideoData {
  url: string;
  embedCode?: string;
  duration?: number;
  thumbnail?: string;
  platform?: 'youtube' | 'vimeo' | 'custom';
}

export interface PodcastData {
  audioUrl: string;
  duration: number;
  episodeNumber?: number;
  season?: number;
  hosts?: string[];
  guests?: string[];
  transcript?: string;
  albumArt?: string;
}

export interface EventData {
  startDate: string;
  endDate: string;
  location: string;
  locationUrl?: string;
  organizer?: string;
  maxAttendees?: number;
  currentAttendees?: number;
  registrationUrl?: string;
  isVirtual?: boolean;
  virtualUrl?: string;
}

export interface RecruitmentData {
  position: string;
  department?: string;
  jobType: 'full-time' | 'part-time' | 'contract' | 'internship';
  location: string;
  salary?: string;
  requirements?: string[];
  benefits?: string[];
  deadline: string;
  applyUrl?: string;
  contactEmail?: string;
}

export interface DownloadData {
  fileUrl: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  version?: string;
  downloadCount?: number;
  requiresLogin?: boolean;
}

// Form Data Types
export interface ArticleFormData {
  title: string;
  content: string;
  type: ArticleType;
  status: StatusType;
  excerpt?: string;
  featuredImage?: string;
  categoryId?: number;
  tags?: string[];
  author?: string;
  scheduledAt?: string;
  metaTitle?: string;
  metaDescription?: string;
  
  // Type-specific
  videoData?: Partial<VideoData>;
  podcastData?: Partial<PodcastData>;
  eventData?: Partial<EventData>;
  recruitmentData?: Partial<RecruitmentData>;
  downloadData?: Partial<DownloadData>;
}

// Filter Types
export interface ArticleFilters {
  search?: string;
  type?: ArticleType | 'all';
  status?: StatusType | 'all';
  categoryId?: number;
  author?: string;
  dateFrom?: string;
  dateTo?: string;
  tags?: string[];
}

// Sort Types
export type ArticleSortField = 'title' | 'createdAt' | 'updatedAt' | 'publishedAt' | 'views';
export type ArticleSortOrder = 'asc' | 'desc';

export interface ArticleSortConfig {
  field: ArticleSortField;
  order: ArticleSortOrder;
}

// List Response
export interface ArticleListResponse {
  articles: Article[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
