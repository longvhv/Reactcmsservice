/**
 * Category Domain Types
 * Type definitions for categories and taxonomy
 */

import type { ArticleType } from '../constants/article-types';

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  parentId?: number;
  type: ArticleType; // Each category is bound to one article type
  
  // Hierarchy
  level: number;
  path: string; // e.g., "/1/5/12"
  children?: Category[];
  parent?: Category;
  
  // Metadata
  icon?: string;
  color?: string;
  featuredImage?: string;
  
  // SEO
  metaTitle?: string;
  metaDescription?: string;
  
  // Stats
  articleCount?: number;
  isActive?: boolean;
  displayOrder?: number;
  
  // Dates
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
}

export interface CategoryTreeNode extends Category {
  children: CategoryTreeNode[];
  isExpanded?: boolean;
  isSelected?: boolean;
}

export interface CategoryFormData {
  name: string;
  slug?: string;
  description?: string;
  parentId?: number;
  type: ArticleType;
  icon?: string;
  color?: string;
  featuredImage?: string;
  metaTitle?: string;
  metaDescription?: string;
  isActive?: boolean;
  displayOrder?: number;
}

export interface CategoryFilters {
  search?: string;
  type?: ArticleType | 'all';
  parentId?: number | 'root'; // 'root' means top-level categories
  isActive?: boolean;
}

export interface CategoryMoveOperation {
  categoryId: number;
  newParentId?: number;
  newPosition?: number;
}
