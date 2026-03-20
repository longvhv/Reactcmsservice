import { useState, useEffect } from 'react';
import { getCategories, createCategory as apiCreateCategory, updateCategory as apiUpdateCategory, deleteCategory as apiDeleteCategory, type Category as APICategory } from '../services/api';

interface Category {
  id: number;
  name: string;
  slug: string;
  parent: number | null;
  articleTypes: string[];
  active: boolean;
  order: number;
  articleCount: number;
  children?: Category[];
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await getCategories();
      
      // Convert API categories to component format
      const formattedCategories: Category[] = data.map((cat: APICategory) => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        parent: cat.parentId || null,
        articleTypes: [cat.articleType],
        active: true,
        order: cat.id,
        articleCount: cat.articleCount || 0,
      }));
      
      setCategories(formattedCategories);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const createCategory = async (categoryData: Omit<Category, 'id' | 'articleCount' | 'children'>) => {
    try {
      const result = await apiCreateCategory({
        name: categoryData.name,
        slug: categoryData.slug,
        articleType: categoryData.articleTypes[0] || 'news',
        parentId: categoryData.parent || undefined,
      });
      
      await fetchCategories(); // Refresh list
      return result;
    } catch (err) {
      console.error('Error creating category:', err);
      throw err;
    }
  };

  const updateCategory = async (id: number, categoryData: Partial<Category>) => {
    try {
      const result = await apiUpdateCategory(id, {
        name: categoryData.name,
        slug: categoryData.slug,
        articleType: categoryData.articleTypes?.[0],
        parentId: categoryData.parent || undefined,
      });
      
      await fetchCategories(); // Refresh list
      return result;
    } catch (err) {
      console.error('Error updating category:', err);
      throw err;
    }
  };

  const deleteCategory = async (id: number) => {
    try {
      const success = await apiDeleteCategory(id);
      
      if (success) {
        await fetchCategories(); // Refresh list
        return true;
      }
      throw new Error('Failed to delete category');
    } catch (err) {
      console.error('Error deleting category:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return {
    categories,
    loading,
    error,
    refetch: fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
  };
}
