import { useFetch, useMutate } from '@longvhv/query';
import { useNotifications } from '@longvhv/notifications';
import { useQueryClient } from '@tanstack/react-query';
import { articleService } from '@/modules/articles/services/articleService';
import type { Article, ArticleQueryParams, ArticleCreateInput, ArticleUpdateInput } from '@/types/article';

/**
 * Custom hook for article operations
 * Combines @longvhv/query with article service
 */
export function useArticles(params?: ArticleQueryParams) {
  const notifications = useNotifications();
  const queryClient = useQueryClient();

  // Fetch articles
  const {
    data: articles,
    isLoading,
    error,
    refetch,
  } = useFetch<Article[]>(
    ['articles', params],
    () => articleService.getAll(params)
  );

  // Create article mutation
  const { mutate: createArticle, isPending: isCreating } = useMutate(
    (data: ArticleCreateInput) => articleService.create(data),
    {
      onSuccess: () => {
        notifications.success('Article created successfully');
        queryClient.invalidateQueries({ queryKey: ['articles'] });
      },
      onError: (error: any) => {
        notifications.error(error.message || 'Failed to create article');
      },
    }
  );

  // Update article mutation
  const { mutate: updateArticle, isPending: isUpdating } = useMutate(
    ({ id, data }: { id: string; data: Partial<ArticleUpdateInput> }) =>
      articleService.update(id, data),
    {
      onSuccess: () => {
        notifications.success('Article updated successfully');
        queryClient.invalidateQueries({ queryKey: ['articles'] });
      },
      onError: (error: any) => {
        notifications.error(error.message || 'Failed to update article');
      },
    }
  );

  // Delete article mutation
  const { mutate: deleteArticle, isPending: isDeleting } = useMutate(
    (id: string) => articleService.delete(id),
    {
      onSuccess: () => {
        notifications.success('Article deleted successfully');
        queryClient.invalidateQueries({ queryKey: ['articles'] });
      },
      onError: (error: any) => {
        notifications.error(error.message || 'Failed to delete article');
      },
    }
  );

  // Publish article mutation
  const { mutate: publishArticle, isPending: isPublishing } = useMutate(
    (id: string) => articleService.updateStatus(id, 'published'),
    {
      onSuccess: () => {
        notifications.success('Article published successfully');
        queryClient.invalidateQueries({ queryKey: ['articles'] });
      },
      onError: (error: any) => {
        notifications.error(error.message || 'Failed to publish article');
      },
    }
  );

  return {
    // Data
    articles,
    isLoading,
    error,
    
    // Actions
    createArticle,
    updateArticle,
    deleteArticle,
    publishArticle,
    refetch,
    
    // Loading states
    isCreating,
    isUpdating,
    isDeleting,
    isPublishing,
  };
}

/**
 * Hook for single article
 */
export function useArticle(id: string) {
  const notifications = useNotifications();

  const {
    data: article,
    isLoading,
    error,
    refetch,
  } = useFetch<Article>(
    ['article', id],
    () => articleService.getById(id),
    {
      enabled: !!id,
    }
  );

  return {
    article,
    isLoading,
    error,
    refetch,
  };
}

/**
 * Hook for article stats
 */
export function useArticleStats() {
  const {
    data: stats,
    isLoading,
    error,
  } = useFetch(
    ['article-stats'],
    () => articleService.getStats()
  );

  return {
    stats,
    isLoading,
    error,
  };
}
