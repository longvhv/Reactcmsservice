import React, { useState } from 'react';
import { useFetch } from '@longvhv/query';
import { ChevronRight, ChevronDown, Folder, FolderOpen, Check, AlertCircle } from 'lucide-react';
import { Category } from '@/types/article';

interface CategorySelectorProps {
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  multiSelect?: boolean;
  articleType?: string; // NEW: Filter categories by article type
  showArticleType?: boolean; // NEW: Show article type in selector
}

/**
 * Category Selector with Tree Structure
 * Supports multi-select, hierarchical categories, and article type filtering
 */
export const CategorySelector: React.FC<CategorySelectorProps> = ({
  selectedIds,
  onChange,
  multiSelect = true,
  articleType, // NEW
  showArticleType = false, // NEW
}) => {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  // Fetch categories (mock data for now)
  const { data: categories, isLoading } = useFetch<Category[]>(
    ['categories', articleType],
    async () => {
      // Mock hierarchical categories with article types
      const allCategories = [
        {
          id: '1',
          name: 'Technology News',
          slug: 'technology',
          order: 1,
          articleType: 'news', // NEW
          icon: '💻', // NEW
          color: '#3B82F6', // NEW
          children: [
            { id: '11', name: 'Web Development', slug: 'web-dev', order: 1, articleType: 'news', icon: '🌐' },
            { id: '12', name: 'Mobile Apps', slug: 'mobile', order: 2, articleType: 'news', icon: '📱' },
            { id: '13', name: 'AI & ML', slug: 'ai-ml', order: 3, articleType: 'news', icon: '🤖' },
          ],
        },
        {
          id: '2',
          name: 'Video Tutorials',
          slug: 'video-tutorials',
          order: 2,
          articleType: 'video', // NEW
          icon: '🎥', // NEW
          color: '#8B5CF6', // NEW
          children: [
            { id: '21', name: 'React Tutorials', slug: 'react-tutorials', order: 1, articleType: 'video', icon: '⚛️' },
            { id: '22', name: 'Vue Tutorials', slug: 'vue-tutorials', order: 2, articleType: 'video', icon: '🟢' },
          ],
        },
        {
          id: '3',
          name: 'Photo Galleries',
          slug: 'galleries',
          order: 3,
          articleType: 'gallery', // NEW
          icon: '📸', // NEW
          color: '#10B981', // NEW
          children: [
            { id: '31', name: 'Travel', slug: 'travel', order: 1, articleType: 'gallery', icon: '✈️' },
            { id: '32', name: 'Nature', slug: 'nature', order: 2, articleType: 'gallery', icon: '🌿' },
          ],
        },
        {
          id: '4',
          name: 'Job Listings',
          slug: 'jobs',
          order: 4,
          articleType: 'job', // NEW
          icon: '💼', // NEW
          color: '#F59E0B', // NEW
        },
        {
          id: '5',
          name: 'Podcasts',
          slug: 'podcasts',
          order: 5,
          articleType: 'podcast', // NEW
          icon: '🎙️', // NEW
          color: '#EF4444', // NEW
        },
      ];

      // NEW: Filter by article type if specified
      if (articleType) {
        return allCategories.filter(cat => {
          const matchesType = cat.articleType === articleType;
          // Also filter children
          if (cat.children) {
            cat.children = cat.children.filter(child => child.articleType === articleType);
          }
          return matchesType;
        });
      }

      return allCategories;
    }
  );

  // Toggle category expansion
  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expandedIds);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedIds(newExpanded);
  };

  // Toggle category selection
  const toggleSelect = (id: string) => {
    if (multiSelect) {
      const newIds = selectedIds.includes(id)
        ? selectedIds.filter((i) => i !== id)
        : [...selectedIds, id];
      onChange(newIds);
    } else {
      onChange([id]);
    }
  };

  // Render category tree item
  const renderCategory = (category: Category, level = 0) => {
    const hasChildren = category.children && category.children.length > 0;
    const isExpanded = expandedIds.has(category.id);
    const isSelected = selectedIds.includes(category.id);

    return (
      <div key={category.id}>
        <div
          className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
            isSelected
              ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
              : 'hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
          style={{ paddingLeft: `${level * 1.5 + 0.75}rem` }}
        >
          {/* Expand/Collapse icon */}
          {hasChildren ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleExpand(category.id);
              }}
              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>
          ) : (
            <div className="w-6" />
          )}

          {/* Icon - NEW: Use custom icon if available */}
          {category.icon ? (
            <span className="text-lg">{category.icon}</span>
          ) : hasChildren ? (
            isExpanded ? (
              <FolderOpen className="w-4 h-4 text-yellow-500" />
            ) : (
              <Folder className="w-4 h-4 text-yellow-500" />
            )
          ) : (
            <Folder className="w-4 h-4 text-gray-400" />
          )}

          {/* Category name */}
          <div
            className="flex-1 flex items-center gap-2"
            onClick={() => toggleSelect(category.id)}
          >
            <span className="text-sm font-medium">{category.name}</span>
            
            {/* NEW: Show article type badge */}
            {showArticleType && category.articleType && (
              <span 
                className="px-2 py-0.5 rounded text-xs font-medium text-white"
                style={{ backgroundColor: category.color || '#6B7280' }}
              >
                {category.articleType}
              </span>
            )}
          </div>

          {/* Checkbox/Check icon */}
          {isSelected && (
            <Check className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          )}
        </div>

        {/* Render children */}
        {hasChildren && isExpanded && (
          <div>
            {category.children!.map((child) => renderCategory(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // NEW: Show warning if filtering by article type and no categories found
  if (articleType && (!categories || categories.length === 0)) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="w-12 h-12 mx-auto text-yellow-500 mb-3" />
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          No categories found for article type: <strong>{articleType}</strong>
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-500">
          Please create a category for this article type first
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-1 max-h-80 overflow-y-auto custom-scrollbar">
      {/* NEW: Show article type filter info */}
      {articleType && (
        <div className="mb-3 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-xs text-blue-600 dark:text-blue-400">
            ℹ️ Showing only <strong>{articleType}</strong> categories
          </p>
        </div>
      )}

      {categories?.map((category) => renderCategory(category))}

      {/* Selected count */}
      {selectedIds.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {selectedIds.length} categor{selectedIds.length === 1 ? 'y' : 'ies'} selected
          </p>
        </div>
      )}
    </div>
  );
};