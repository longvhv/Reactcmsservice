// Central type definitions for the CMS application
// Export all shared types here for easy import

export type PageState = 
  | { page: 'dashboard' }
  | { page: 'articles' }
  | { page: 'article-detail'; id: number }
  | { page: 'categories' }
  | { page: 'category-detail'; id: number }
  | { page: 'permissions' }
  | { page: 'permission-group-detail'; id: number }
  | { page: 'event-series' }
  | { page: 'event-stream-form'; id?: string }
  | { page: 'event-stream-detail'; id: string }
  | { page: 'media' }
  | { page: 'crawler'; subPage?: string }
  | { page: 'campaign-detail'; campaignId: string }
  | { page: 'source-detail'; sourceId: string; campaignId: string }
  | { page: 'stats'; reportId?: string }
  | { page: 'users' }
  | { page: 'user-detail'; id: number }
  | { page: 'user-roles' }
  | { page: 'user-groups' }
  | { page: 'user-access-logs' }
  | { page: 'user-security-settings' }
  | { page: 'activity' }
  | { page: 'settings'; subPage?: string }
  | { page: 'approval-workflow' }
  | { page: 'approval-dashboard' }
  | { page: 'content-moderation' }
  | { page: 'advanced-search' }
  | { page: 'workflow-manager' }
  | { page: 'activity-log' }
  | { page: 'analytics' }
  | { page: 'ai-tools' }
  | { page: 'royalty-management' }
  | { page: 'royalty-integration' }
  | { page: 'reporter-portal' };

// Add more shared types as needed
export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

export interface Article {
  id: number;
  title: string;
  content: string;
  status: 'draft' | 'pending' | 'published' | 'archived';
  author: User;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  parentId?: number;
  articleType?: string;
}
