import { apiClient } from '@/services/api';
import type {
  Article,
  ArticleCreateInput,
  ArticleUpdateInput,
  ArticleQueryParams,
  ArticleListResponse,
  ArticleStatsResponse,
  ArticleStatus,
} from '@/types/article';

/**
 * Article Service - API integration using @longvhv/api-client
 * Compatible with go-cms-service backend
 */
class ArticleService {
  private readonly baseUrl = '/api/v1/articles';

  /**
   * Get all articles with filtering and pagination
   */
  async getAll(params?: ArticleQueryParams): Promise<Article[]> {
    try {
      const response = await apiClient.get<ArticleListResponse>(this.baseUrl, {
        params: {
          page: params?.page || 1,
          limit: params?.limit || 20,
          status: params?.status !== 'all' ? params?.status : undefined,
          type: params?.type !== 'all' ? params?.type : undefined,
          search: params?.search,
          sortBy: params?.sortBy || 'createdAt',
          sortOrder: params?.sortOrder || 'desc',
          categoryId: params?.categoryId,
          tagId: params?.tagId,
          authorId: params?.authorId,
          isFeatured: params?.isFeatured,
          isBreaking: params?.isBreaking,
        },
      });

      return response.data.data;
    } catch (error) {
      console.error('Failed to fetch articles:', error);
      // Return mock data for development
      return this.getMockArticles();
    }
  }

  /**
   * Get single article by ID
   */
  async getById(id: string): Promise<Article> {
    try {
      const response = await apiClient.get<Article>(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch article ${id}:`, error);
      return this.getMockArticle(id);
    }
  }

  /**
   * Create new article
   */
  async create(data: ArticleCreateInput): Promise<Article> {
    try {
      const response = await apiClient.post<Article>(this.baseUrl, data);
      return response.data;
    } catch (error) {
      console.error('Failed to create article:', error);
      throw error;
    }
  }

  /**
   * Update existing article
   */
  async update(id: string, data: Partial<ArticleUpdateInput>): Promise<Article> {
    try {
      const response = await apiClient.put<Article>(`${this.baseUrl}/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Failed to update article ${id}:`, error);
      throw error;
    }
  }

  /**
   * Delete article
   */
  async delete(id: string): Promise<void> {
    try {
      await apiClient.delete(`${this.baseUrl}/${id}`);
    } catch (error) {
      console.error(`Failed to delete article ${id}:`, error);
      throw error;
    }
  }

  /**
   * Update article status (workflow)
   */
  async updateStatus(id: string, status: ArticleStatus, comment?: string): Promise<Article> {
    try {
      const response = await apiClient.patch<Article>(`${this.baseUrl}/${id}/status`, {
        status,
        comment,
      });
      return response.data;
    } catch (error) {
      console.error(`Failed to update article status ${id}:`, error);
      throw error;
    }
  }

  /**
   * Get article statistics
   */
  async getStats(): Promise<ArticleStatsResponse> {
    try {
      const response = await apiClient.get<ArticleStatsResponse>(`${this.baseUrl}/stats`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch article stats:', error);
      return this.getMockStats();
    }
  }

  /**
   * Get related articles
   */
  async getRelated(id: string, limit = 5): Promise<Article[]> {
    try {
      const response = await apiClient.get<Article[]>(`${this.baseUrl}/${id}/related`, {
        params: { limit },
      });
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch related articles for ${id}:`, error);
      return [];
    }
  }

  /**
   * Duplicate article
   */
  async duplicate(id: string): Promise<Article> {
    try {
      const response = await apiClient.post<Article>(`${this.baseUrl}/${id}/duplicate`);
      return response.data;
    } catch (error) {
      console.error(`Failed to duplicate article ${id}:`, error);
      throw error;
    }
  }

  // Mock data for development
  private getMockArticles(): Article[] {
    return [
      {
        id: '1',
        title: 'Hướng dẫn sử dụng React Hooks trong dự án thực tế',
        slug: 'huong-dan-su-dung-react-hooks',
        summary: 'Tìm hiểu cách sử dụng React Hooks hiệu quả trong các dự án React hiện đại',
        content: '<p>Nội dung chi tiết về React Hooks...</p>',
        type: 'tutorial',
        status: 'published',
        categories: [{ id: '1', name: 'Programming', slug: 'programming', order: 1 }],
        tags: [
          { id: '1', name: 'React', slug: 'react' },
          { id: '2', name: 'JavaScript', slug: 'javascript' },
        ],
        featuredImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
        author: {
          id: '1',
          name: 'Nguyễn Văn A',
          email: 'nguyenvana@example.com',
          role: 'Editor',
        },
        stats: {
          views: 1250,
          likes: 45,
          shares: 12,
          comments: 8,
          avgReadTime: 360,
        },
        isFeatured: true,
        isBreaking: false,
        isPinned: false,
        allowComments: true,
        publishedAt: '2024-01-15T10:00:00Z',
        createdAt: '2024-01-14T15:30:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
      },
      {
        id: '2',
        title: 'Top 10 xu hướng công nghệ năm 2024',
        slug: 'top-10-xu-huong-cong-nghe-2024',
        summary: 'Khám phá những xu hướng công nghệ hàng đầu sẽ thay đổi thế giới trong năm 2024',
        content: '<p>Nội dung về xu hướng công nghệ...</p>',
        type: 'news',
        status: 'published',
        categories: [{ id: '2', name: 'Technology', slug: 'technology', order: 2 }],
        tags: [
          { id: '3', name: 'AI', slug: 'ai' },
          { id: '4', name: 'Technology', slug: 'technology' },
        ],
        featuredImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800',
        author: {
          id: '2',
          name: 'Trần Thị B',
          email: 'tranthib@example.com',
          role: 'Author',
        },
        stats: {
          views: 2340,
          likes: 89,
          shares: 34,
          comments: 15,
          avgReadTime: 480,
        },
        isFeatured: true,
        isBreaking: true,
        isPinned: true,
        allowComments: true,
        publishedAt: '2024-01-16T08:00:00Z',
        createdAt: '2024-01-15T12:00:00Z',
        updatedAt: '2024-01-16T08:00:00Z',
      },
      {
        id: '3',
        title: 'Tuyển dụng Senior Frontend Developer',
        slug: 'tuyen-dung-senior-frontend-developer',
        summary: 'Công ty ABC tuyển dụng Senior Frontend Developer - Lương upto 3000$',
        content: '<p>Chi tiết tuyển dụng...</p>',
        type: 'job',
        status: 'published',
        categories: [{ id: '3', name: 'Jobs', slug: 'jobs', order: 3 }],
        tags: [{ id: '5', name: 'Recruitment', slug: 'recruitment' }],
        featuredImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800',
        author: {
          id: '3',
          name: 'HR Team',
          email: 'hr@example.com',
          role: 'HR',
        },
        jobPosition: 'Senior Frontend Developer',
        jobCompany: 'ABC Technology',
        jobDeadline: '2024-02-29T23:59:59Z',
        stats: {
          views: 890,
          likes: 23,
          shares: 5,
          comments: 3,
          avgReadTime: 240,
        },
        isFeatured: false,
        isBreaking: false,
        isPinned: false,
        allowComments: true,
        publishedAt: '2024-01-17T09:00:00Z',
        createdAt: '2024-01-16T14:00:00Z',
        updatedAt: '2024-01-17T09:00:00Z',
      },
    ];
  }

  private getMockArticle(id: string): Article {
    const articles = this.getMockArticles();
    return articles.find(a => a.id === id) || articles[0];
  }

  private getMockStats(): ArticleStatsResponse {
    return {
      totalArticles: 2543,
      publishedArticles: 1890,
      draftArticles: 420,
      pendingArticles: 233,
      totalViews: 1245000,
      totalLikes: 34500,
      totalComments: 12300,
      articlesByType: {
        news: 850,
        video: 320,
        gallery: 280,
        podcast: 150,
        event: 200,
        job: 180,
        document: 240,
        legal: 120,
        person: 90,
        download: 75,
        infographic: 38,
        live: 0,
        qa: 0,
        tutorial: 0,
      },
      articlesByStatus: {
        draft: 420,
        pending: 233,
        published: 1890,
        rejected: 0,
        archived: 0,
      },
      recentArticles: this.getMockArticles(),
      trendingArticles: this.getMockArticles(),
    };
  }
}

export const articleService = new ArticleService();
export default articleService;
