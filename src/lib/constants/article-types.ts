/**
 * Article Type Constants
 * Centralized configuration for all article types in the CMS
 */

import type { LucideIcon } from 'lucide-react';
import {
  FileText,
  Video,
  Image as ImageIcon,
  File,
  Users,
  Briefcase,
  Mic,
  MapPin,
  Download,
  Calendar,
  Newspaper,
  BookOpen,
  Award,
  MessageSquare,
} from 'lucide-react';

export type ArticleType =
  | 'news'
  | 'video'
  | 'gallery'
  | 'document'
  | 'legal'
  | 'recruitment'
  | 'podcast'
  | 'event'
  | 'personnel'
  | 'download'
  | 'blog'
  | 'tutorial'
  | 'press-release'
  | 'interview';

export interface ArticleTypeConfig {
  value: ArticleType;
  label: string;
  labelKey: string; // i18n key
  icon: LucideIcon;
  color: string;
  bgColor: string;
  description: string;
  descriptionKey: string; // i18n key
}

export const ARTICLE_TYPES: Record<ArticleType, ArticleTypeConfig> = {
  news: {
    value: 'news',
    label: 'Tin tức',
    labelKey: 'articleTypes.news',
    icon: FileText,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
    description: 'Bài viết tin tức thông thường',
    descriptionKey: 'articleTypes.newsDesc',
  },
  video: {
    value: 'video',
    label: 'Video',
    labelKey: 'articleTypes.video',
    icon: Video,
    color: 'text-red-600',
    bgColor: 'bg-red-100 dark:bg-red-900/30',
    description: 'Bài viết kèm video',
    descriptionKey: 'articleTypes.videoDesc',
  },
  gallery: {
    value: 'gallery',
    label: 'Gallery',
    labelKey: 'articleTypes.gallery',
    icon: ImageIcon,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100 dark:bg-purple-900/30',
    description: 'Bộ sưu tập hình ảnh',
    descriptionKey: 'articleTypes.galleryDesc',
  },
  document: {
    value: 'document',
    label: 'Văn bản',
    labelKey: 'articleTypes.document',
    icon: File,
    color: 'text-gray-600',
    bgColor: 'bg-gray-100 dark:bg-gray-900/30',
    description: 'Văn bản tài liệu',
    descriptionKey: 'articleTypes.documentDesc',
  },
  legal: {
    value: 'legal',
    label: 'Văn bản pháp luật',
    labelKey: 'articleTypes.legal',
    icon: BookOpen,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-100 dark:bg-indigo-900/30',
    description: 'Văn bản pháp luật, quy định',
    descriptionKey: 'articleTypes.legalDesc',
  },
  recruitment: {
    value: 'recruitment',
    label: 'Tuyển dụng',
    labelKey: 'articleTypes.recruitment',
    icon: Briefcase,
    color: 'text-green-600',
    bgColor: 'bg-green-100 dark:bg-green-900/30',
    description: 'Thông tin tuyển dụng',
    descriptionKey: 'articleTypes.recruitmentDesc',
  },
  podcast: {
    value: 'podcast',
    label: 'Podcast',
    labelKey: 'articleTypes.podcast',
    icon: Mic,
    color: 'text-pink-600',
    bgColor: 'bg-pink-100 dark:bg-pink-900/30',
    description: 'Bài podcast audio',
    descriptionKey: 'articleTypes.podcastDesc',
  },
  event: {
    value: 'event',
    label: 'Sự kiện',
    labelKey: 'articleTypes.event',
    icon: Calendar,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100 dark:bg-orange-900/30',
    description: 'Thông tin sự kiện',
    descriptionKey: 'articleTypes.eventDesc',
  },
  personnel: {
    value: 'personnel',
    label: 'Nhân sự',
    labelKey: 'articleTypes.personnel',
    icon: Users,
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-100 dark:bg-cyan-900/30',
    description: 'Thông tin nhân sự',
    descriptionKey: 'articleTypes.personnelDesc',
  },
  download: {
    value: 'download',
    label: 'Tải xuống',
    labelKey: 'articleTypes.download',
    icon: Download,
    color: 'text-teal-600',
    bgColor: 'bg-teal-100 dark:bg-teal-900/30',
    description: 'File tải xuống',
    descriptionKey: 'articleTypes.downloadDesc',
  },
  blog: {
    value: 'blog',
    label: 'Blog',
    labelKey: 'articleTypes.blog',
    icon: Newspaper,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
    description: 'Bài viết blog',
    descriptionKey: 'articleTypes.blogDesc',
  },
  tutorial: {
    value: 'tutorial',
    label: 'Hướng dẫn',
    labelKey: 'articleTypes.tutorial',
    icon: BookOpen,
    color: 'text-violet-600',
    bgColor: 'bg-violet-100 dark:bg-violet-900/30',
    description: 'Bài hướng dẫn',
    descriptionKey: 'articleTypes.tutorialDesc',
  },
  'press-release': {
    value: 'press-release',
    label: 'Thông cáo báo chí',
    labelKey: 'articleTypes.pressRelease',
    icon: Newspaper,
    color: 'text-rose-600',
    bgColor: 'bg-rose-100 dark:bg-rose-900/30',
    description: 'Thông cáo báo chí',
    descriptionKey: 'articleTypes.pressReleaseDesc',
  },
  interview: {
    value: 'interview',
    label: 'Phỏng vấn',
    labelKey: 'articleTypes.interview',
    icon: MessageSquare,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-100 dark:bg-emerald-900/30',
    description: 'Bài phỏng vấn',
    descriptionKey: 'articleTypes.interviewDesc',
  },
};

export const ARTICLE_TYPE_OPTIONS = Object.values(ARTICLE_TYPES);

export const getArticleTypeConfig = (type: ArticleType): ArticleTypeConfig => {
  return ARTICLE_TYPES[type] || ARTICLE_TYPES.news;
};
