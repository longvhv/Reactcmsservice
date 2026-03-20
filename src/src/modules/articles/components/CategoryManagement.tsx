import React, { useState, useEffect, useRef } from 'react';
import { useFetch, useMutate } from '@longvhv/query';
import { useNotifications } from '@longvhv/notifications';
import { 
  FolderOpen,
  Plus,
  Edit,
  Trash2,
  ChevronRight,
  ChevronDown,
  GripVertical,
  Eye,
  EyeOff,
  Copy,
  Settings,
  BarChart3,
  FileText,
  Search,
  Filter,
  Download,
  Upload,
  AlertCircle,
  X,
  Check
} from 'lucide-react';

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  articleType: 'news' | 'video' | 'gallery' | 'podcast' | 'event' | 'job' | 'document' | 'legal' | 'download' | 'person' | 'tutorial' | 'review' | 'interview' | 'opinion';
  parentId: string | null;
  order: number;
  isActive: boolean;
  isPublic: boolean;
  articleCount: number;
  icon?: string;
  color?: string;
  seoTitle?: string;
  seoDescription?: string;
  children?: Category[];
  createdAt: string;
  updatedAt: string;
}

const ARTICLE_TYPES = [
  { value: 'news', label: 'News Article', icon: '📰', color: '#3B82F6' },
  { value: 'video', label: 'Video Content', icon: '🎥', color: '#8B5CF6' },
  { value: 'gallery', label: 'Photo Gallery', icon: '🖼️', color: '#10B981' },
  { value: 'podcast', label: 'Podcast', icon: '🎙️', color: '#F59E0B' },
  { value: 'event', label: 'Event', icon: '📅', color: '#EF4444' },
  { value: 'job', label: 'Job Posting', icon: '💼', color: '#06B6D4' },
  { value: 'document', label: 'Document', icon: '📄', color: '#6366F1' },
  { value: 'legal', label: 'Legal Document', icon: '⚖️', color: '#84CC16' },
  { value: 'download', label: 'Download', icon: '📥', color: '#EC4899' },
  { value: 'person', label: 'Person Profile', icon: '👤', color: '#14B8A6' },
  { value: 'tutorial', label: 'Tutorial', icon: '📚', color: '#F97316' },
  { value: 'review', label: 'Review', icon: '⭐', color: '#A855F7' },
  { value: 'interview', label: 'Interview', icon: '🎤', color: '#0EA5E9' },
  { value: 'opinion', label: 'Opinion', icon: '💭', color: '#F43F5E' },
];

export const CategoryManagement: React.FC = () => {
  const notifications = useNotifications();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [showInactive, setShowInactive] = useState(false);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set(['1', '2']));
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Partial<Category>>({});
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [typeSearchTerm, setTypeSearchTerm] = useState('');
  const [saveAndContinue, setSaveAndContinue] = useState(false);

  // Fetch categories
  const { data: categories, isLoading, refetch } = useFetch<Category[]>(
    ['categories'],
    async () => {
      // Mock data with tree structure
      return [
        {
          id: '1',
          name: 'Technology News',
          slug: 'technology-news',
          description: 'Latest technology news and updates',
          articleType: 'news',
          parentId: null,
          order: 1,
          isActive: true,
          isPublic: true,
          articleCount: 145,
          icon: '💻',
          color: '#3B82F6',
          seoTitle: 'Technology News - Latest Updates',
          seoDescription: 'Stay updated with the latest technology news',
          createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          children: [
            {
              id: '3',
              name: 'AI & Machine Learning',
              slug: 'ai-machine-learning',
              description: 'Artificial Intelligence news',
              articleType: 'news',
              parentId: '1',
              order: 1,
              isActive: true,
              isPublic: true,
              articleCount: 67,
              icon: '🤖',
              color: '#8B5CF6',
              createdAt: new Date(Date.now() - 150 * 24 * 60 * 60 * 1000).toISOString(),
              updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            },
            {
              id: '4',
              name: 'Web Development',
              slug: 'web-development',
              description: 'Web development tutorials and news',
              articleType: 'news',
              parentId: '1',
              order: 2,
              isActive: true,
              isPublic: true,
              articleCount: 48,
              icon: '🌐',
              color: '#10B981',
              createdAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
              updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            },
          ],
        },
        {
          id: '2',
          name: 'Video Tutorials',
          slug: 'video-tutorials',
          description: 'Educational video content',
          articleType: 'video',
          parentId: null,
          order: 2,
          isActive: true,
          isPublic: true,
          articleCount: 89,
          icon: '🎥',
          color: '#F59E0B',
          seoTitle: 'Video Tutorials - Learn by Watching',
          seoDescription: 'High-quality video tutorials',
          createdAt: new Date(Date.now() - 160 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          children: [
            {
              id: '5',
              name: 'React Tutorials',
              slug: 'react-tutorials',
              description: 'Learn React step by step',
              articleType: 'video',
              parentId: '2',
              order: 1,
              isActive: true,
              isPublic: true,
              articleCount: 34,
              icon: '⚛️',
              color: '#06B6D4',
              createdAt: new Date(Date.now() - 130 * 24 * 60 * 60 * 1000).toISOString(),
              updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            },
          ],
        },
        {
          id: '6',
          name: 'Photo Galleries',
          slug: 'photo-galleries',
          description: 'Curated photo collections',
          articleType: 'gallery',
          parentId: null,
          order: 3,
          isActive: true,
          isPublic: true,
          articleCount: 56,
          icon: '📸',
          color: '#EC4899',
          createdAt: new Date(Date.now() - 140 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: '7',
          name: 'Job Listings',
          slug: 'job-listings',
          description: 'Career opportunities',
          articleType: 'job',
          parentId: null,
          order: 4,
          isActive: true,
          isPublic: true,
          articleCount: 23,
          icon: '💼',
          color: '#14B8A6',
          createdAt: new Date(Date.now() - 100 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: '8',
          name: 'Legal Documents',
          slug: 'legal-documents',
          description: 'Legal texts and regulations',
          articleType: 'legal',
          parentId: null,
          order: 5,
          isActive: false,
          isPublic: true,
          articleCount: 12,
          icon: '⚖️',
          color: '#84CC16',
          createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ];
    }
  );

  // Create/Update category mutation
  const { mutate: saveCategory, isPending: isSaving } = useMutate(
    async (data: Partial<Category>) => {
      await new Promise(resolve => setTimeout(resolve, 1500));
      return { success: true };
    },
    {
      onSuccess: () => {
        const isCreatingNew = !editingCategory.id;
        notifications.success(isCreatingNew ? 'Category created successfully' : 'Category updated successfully');
        
        if (saveAndContinue && isCreatingNew) {
          // Clear form but keep modal open
          setEditingCategory({});
          notifications.info('Sẵn sàng thêm danh mục mới');
        } else {
          // Close modal normally
          setShowEditModal(false);
          setEditingCategory({});
        }
        
        setSaveAndContinue(false);
        refetch();
      },
    }
  );

  // Delete category mutation
  const { mutate: deleteCategory } = useMutate(
    async (id: string) => {
      await new Promise(resolve => setTimeout(resolve, 500));
      return { success: true };
    },
    {
      onSuccess: () => {
        notifications.success('Đã xóa danh mục');
        refetch();
      },
    }
  );

  // Toggle active mutation
  const { mutate: toggleActive } = useMutate(
    async (id: string) => {
      await new Promise(resolve => setTimeout(resolve, 300));
      return { success: true };
    },
    {
      onSuccess: () => {
        refetch();
      },
    }
  );

  // Duplicate category mutation
  const { mutate: duplicateCategory } = useMutate(
    async (id: string) => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { success: true };
    },
    {
      onSuccess: () => {
        notifications.success('Đã nhân bản danh mục');
        refetch();
      },
    }
  );

  // Toggle expand/collapse
  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expandedIds);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedIds(newExpanded);
  };

  // Render category tree item
  const renderCategoryItem = (category: Category, level: number = 0) => {
    const hasChildren = category.children && category.children.length > 0;
    const isExpanded = expandedIds.has(category.id);
    const articleType = ARTICLE_TYPES.find(t => t.value === category.articleType);

    // Filter logic
    const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         category.slug.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || category.articleType === filterType;
    const matchesActive = showInactive || category.isActive;

    if (!matchesSearch || !matchesType || !matchesActive) {
      return null;
    }

    return (
      <div key={category.id}>
        <div
          className={`group flex items-center gap-2 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
            selectedCategory?.id === category.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''
          }`}
          style={{ paddingLeft: `${level * 24 + 12}px` }}
        >
          {/* Expand/Collapse */}
          {hasChildren ? (
            <button
              onClick={() => toggleExpand(category.id)}
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

          {/* Drag Handle */}
          <button className="opacity-0 group-hover:opacity-100 transition-opacity cursor-move">
            <GripVertical className="w-4 h-4 text-gray-400" />
          </button>

          {/* Icon */}
          <div className="flex items-center gap-2">
            <span className="text-xl">{category.icon || articleType?.icon}</span>
          </div>

          {/* Name & Info */}
          <button
            onClick={() => setSelectedCategory(category)}
            className="flex-1 text-left"
          >
            <div className="flex items-center gap-2">
              <span className="font-medium">{category.name}</span>
              
              {/* Article Type Badge - PROMINENT */}
              <span
                className="px-2.5 py-1 rounded-md text-xs font-semibold text-white"
                style={{ backgroundColor: category.color || articleType?.color }}
              >
                {articleType?.icon} {articleType?.label}
              </span>
              
              {!category.isActive && (
                <span className="px-2 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-xs">
                  Inactive
                </span>
              )}
              {!category.isPublic && (
                <EyeOff className="w-4 h-4 text-gray-400" />
              )}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              {category.articleCount} articles • /{category.slug}
            </div>
          </button>

          {/* Actions */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => {
                setShowStatsModal(true);
                setSelectedCategory(category);
              }}
              className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
              title="Statistics"
            >
              <BarChart3 className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                setEditingCategory(category);
                setShowEditModal(true);
              }}
              className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
              title="Edit"
            >
              <Edit className="w-4 h-4" />
            </button>

            <button
              onClick={() => duplicateCategory(category.id)}
              className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
              title="Duplicate"
            >
              <Copy className="w-4 h-4" />
            </button>

            <button
              onClick={() => toggleActive(category.id)}
              className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
              title={category.isActive ? 'Deactivate' : 'Activate'}
            >
              {category.isActive ? (
                <Eye className="w-4 h-4 text-green-600" />
              ) : (
                <EyeOff className="w-4 h-4 text-gray-400" />
              )}
            </button>

            <button
              onClick={() => {
                if (confirm(`Delete "${category.name}"?`)) {
                  deleteCategory(category.id);
                }
              }}
              className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 rounded-lg transition-colors"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Children */}
        {hasChildren && isExpanded && (
          <div>
            {category.children!.map(child => renderCategoryItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  // Calculate stats
  const totalCategories = categories?.length || 0;
  const activeCategories = categories?.filter(c => c.isActive).length || 0;
  const totalArticles = categories?.reduce((sum, c) => {
    const childrenCount = c.children?.reduce((childSum, child) => childSum + child.articleCount, 0) || 0;
    return sum + c.articleCount + childrenCount;
  }, 0) || 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Quản lý danh mục
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Tổ chức nội dung theo danh mục phân cấp
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => {
              setEditingCategory({});
              setShowEditModal(true);
            }}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg"
          >
            <Plus className="w-5 h-5" />
            Add Category
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Tổng danh mục', value: totalCategories, icon: '📁', color: 'blue' },
          { label: 'Hoạt động', value: activeCategories, icon: '✅', color: 'green' },
          { label: 'Tổng bài viết', value: totalArticles, icon: '📄', color: 'purple' },
          { label: 'Loại bài viết', value: ARTICLE_TYPES.length, icon: '🎯', color: 'orange' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{stat.label}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
              <div className="text-3xl">{stat.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters & Search */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex flex-wrap items-center gap-4">
          {/* Search */}
          <div className="flex-1 min-w-[250px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm kiếm danh mục..."
                className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          {/* Article Type Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="all">-- Loại bài viết --</option>
              {ARTICLE_TYPES.map(type => (
                <option key={type.value} value={type.value}>
                  {type.icon} {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Show Inactive Toggle */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showInactive}
              onChange={(e) => setShowInactive(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded"
            />
            <span className="text-sm">Hiện không hoạt động</span>
          </label>

          {/* Expand/Collapse All */}
          <div className="flex gap-2">
            <button
              onClick={() => {
                const allIds = new Set<string>();
                const collectIds = (cats: Category[]) => {
                  cats.forEach(cat => {
                    allIds.add(cat.id);
                    if (cat.children) collectIds(cat.children);
                  });
                };
                if (categories) collectIds(categories);
                setExpandedIds(allIds);
              }}
              className="px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
            >
              Mở rộng tất cả
            </button>
            <button
              onClick={() => setExpandedIds(new Set())}
              className="px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
            >
              Thu gọn tất cả
            </button>
          </div>
        </div>
      </div>

      {/* Category Tree */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
        <div className="space-y-1">
          {categories && categories.length > 0 ? (
            categories.map(category => renderCategoryItem(category))
          ) : (
            <div className="text-center py-12">
              <FolderOpen className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
              <p className="text-gray-600 dark:text-gray-400 mb-4">Chưa có danh mục nào</p>
              <button
                onClick={() => {
                  setEditingCategory({});
                  setShowEditModal(true);
                }}
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Tạo danh mục đầu tiên
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Edit/Create Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 my-8">
            <h3 className="text-xl font-bold mb-4">
              {editingCategory.id ? 'Sửa danh mục' : 'Tạo danh mục'}
            </h3>

            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Category Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={editingCategory.name || ''}
                  onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                  placeholder="e.g., Technology News"
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  URL Slug <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={editingCategory.slug || ''}
                  onChange={(e) => setEditingCategory({ ...editingCategory, slug: e.target.value })}
                  placeholder="e.g., technology-news"
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              {/* Article Type */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Article Type <span className="text-red-500">*</span>
                </label>
                
                {/* Warning about article type binding */}
                <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800 mb-3">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm text-yellow-800 dark:text-yellow-200 font-semibold mb-1">
                        🔒 One Category = One Article Type
                      </p>
                      <p className="text-xs text-yellow-700 dark:text-yellow-300">
                        Each category can only contain <strong>one type</strong> of article. All articles in this category must be of the selected type.
                        {editingCategory.parentId && " This field is automatically set based on parent category."}
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Custom Combobox */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      if (!editingCategory.parentId) {
                        setShowTypeDropdown(!showTypeDropdown);
                      }
                    }}
                    disabled={!!editingCategory.parentId}
                    className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-left focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                      editingCategory.parentId ? 'opacity-60 cursor-not-allowed' : 'hover:border-gray-300 dark:hover:border-gray-600 cursor-pointer'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      {editingCategory.articleType ? (
                        <div className="flex items-center gap-3">
                          <span 
                            className="flex items-center justify-center w-10 h-10 rounded-lg text-xl"
                            style={{ 
                              backgroundColor: ARTICLE_TYPES.find(t => t.value === editingCategory.articleType)?.color + '20'
                            }}
                          >
                            {ARTICLE_TYPES.find(t => t.value === editingCategory.articleType)?.icon}
                          </span>
                          <div>
                            <p className="font-medium">
                              {ARTICLE_TYPES.find(t => t.value === editingCategory.articleType)?.label}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Only this type allowed in category
                            </p>
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-400">Select article type...</span>
                      )}
                      <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${showTypeDropdown ? 'rotate-180' : ''}`} />
                    </div>
                  </button>

                  {/* Dropdown */}
                  {showTypeDropdown && !editingCategory.parentId && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl z-50 overflow-hidden">
                      {/* Search */}
                      <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type="text"
                            value={typeSearchTerm}
                            onChange={(e) => setTypeSearchTerm(e.target.value)}
                            placeholder="Search article types..."
                            className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                            autoFocus
                          />
                        </div>
                      </div>

                      {/* Options */}
                      <div className="max-h-80 overflow-y-auto custom-scrollbar">
                        {ARTICLE_TYPES.filter(type =>
                          type.label.toLowerCase().includes(typeSearchTerm.toLowerCase()) ||
                          type.value.toLowerCase().includes(typeSearchTerm.toLowerCase())
                        ).map(type => (
                          <button
                            key={type.value}
                            type="button"
                            onClick={() => {
                              setEditingCategory({ ...editingCategory, articleType: type.value as any });
                              setShowTypeDropdown(false);
                              setTypeSearchTerm('');
                            }}
                            className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left ${
                              editingCategory.articleType === type.value ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                            }`}
                          >
                            {/* Icon */}
                            <div
                              className="flex items-center justify-center w-10 h-10 rounded-lg text-xl flex-shrink-0"
                              style={{ backgroundColor: type.color + '20' }}
                            >
                              {type.icon}
                            </div>

                            {/* Info */}
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{type.label}</span>
                                {editingCategory.articleType === type.value && (
                                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-600 text-white">
                                    <Check className="w-3 h-3" />
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {type.value}
                              </p>
                            </div>

                            {/* Color badge */}
                            <div
                              className="w-4 h-4 rounded-full flex-shrink-0"
                              style={{ backgroundColor: type.color }}
                            />
                          </button>
                        ))}

                        {/* No results */}
                        {ARTICLE_TYPES.filter(type =>
                          type.label.toLowerCase().includes(typeSearchTerm.toLowerCase()) ||
                          type.value.toLowerCase().includes(typeSearchTerm.toLowerCase())
                        ).length === 0 && (
                          <div className="py-8 text-center text-gray-500 dark:text-gray-400">
                            <Search className="w-12 h-12 mx-auto mb-2 opacity-50" />
                            <p className="text-sm">No article types found</p>
                            <p className="text-xs">Try a different search term</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                
                {editingCategory.parentId && editingCategory.articleType && (
                  <p className="text-xs text-blue-600 dark:text-blue-400 mt-2 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    Article type is inherited from parent category and cannot be changed
                  </p>
                )}
                
                {editingCategory.id && editingCategory.articleCount && editingCategory.articleCount > 0 && (
                  <p className="text-xs text-orange-600 dark:text-orange-400 mt-2 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    This category has {editingCategory.articleCount} article(s). Changing type may cause issues.
                  </p>
                )}
              </div>

              {/* Parent Category */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Parent Category (Optional)
                </label>
                
                {/* Info about parent selection */}
                {!editingCategory.articleType && (
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 mb-3">
                    <p className="text-xs text-blue-800 dark:text-blue-200">
                      💡 Select an article type first, then you can choose a parent category of the same type.
                    </p>
                  </div>
                )}
                
                <select
                  value={editingCategory.parentId || ''}
                  onChange={(e) => {
                    const parentId = e.target.value || null;
                    const parent = categories?.find(c => c.id === parentId);
                    
                    // Auto-set article type from parent
                    if (parent) {
                      setEditingCategory({ 
                        ...editingCategory, 
                        parentId,
                        articleType: parent.articleType // Auto-set from parent
                      });
                    } else {
                      setEditingCategory({ 
                        ...editingCategory, 
                        parentId: null 
                      });
                    }
                  }}
                  disabled={!editingCategory.articleType}
                  className={`w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                    !editingCategory.articleType ? 'opacity-60 cursor-not-allowed' : ''
                  }`}
                >
                  <option value="">None (Top Level)</option>
                  {categories?.filter(c => 
                    c.id !== editingCategory.id && 
                    c.articleType === editingCategory.articleType
                  ).map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.icon} {cat.name} ({cat.articleType})
                    </option>
                  ))}
                </select>
                
                {editingCategory.articleType && categories?.filter(c => 
                  c.id !== editingCategory.id && 
                  c.articleType === editingCategory.articleType
                ).length === 0 && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    No parent categories available for article type: <strong>{editingCategory.articleType}</strong>
                  </p>
                )}
                
                {editingCategory.parentId && (
                  <p className="text-xs text-green-600 dark:text-green-400 mt-2 flex items-center gap-1">
                    ✅ Category will inherit article type from parent
                  </p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Description
                </label>
                <textarea
                  value={editingCategory.description || ''}
                  onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                  rows={3}
                  placeholder="Brief description of this category..."
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              {/* Icon & Color */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Icon (Emoji)
                  </label>
                  <input
                    type="text"
                    value={editingCategory.icon || ''}
                    onChange={(e) => setEditingCategory({ ...editingCategory, icon: e.target.value })}
                    placeholder="📁"
                    maxLength={2}
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Color
                  </label>
                  <input
                    type="color"
                    value={editingCategory.color || '#3B82F6'}
                    onChange={(e) => setEditingCategory({ ...editingCategory, color: e.target.value })}
                    className="w-full h-10 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl cursor-pointer"
                  />
                </div>
              </div>

              {/* SEO */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <h4 className="font-semibold mb-3">SEO Settings</h4>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      SEO Title
                    </label>
                    <input
                      type="text"
                      value={editingCategory.seoTitle || ''}
                      onChange={(e) => setEditingCategory({ ...editingCategory, seoTitle: e.target.value })}
                      placeholder="Optimized title for search engines"
                      className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      SEO Description
                    </label>
                    <textarea
                      value={editingCategory.seoDescription || ''}
                      onChange={(e) => setEditingCategory({ ...editingCategory, seoDescription: e.target.value })}
                      rows={2}
                      placeholder="Meta description for search results"
                      className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                </div>
              </div>

              {/* Settings */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingCategory.isActive !== false}
                    onChange={(e) => setEditingCategory({ ...editingCategory, isActive: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="text-sm">Active (visible to editors)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingCategory.isPublic !== false}
                    onChange={(e) => setEditingCategory({ ...editingCategory, isPublic: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="text-sm">Public (visible on website)</span>
                </label>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingCategory({});
                  setSaveAndContinue(false);
                }}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Hủy
              </button>
              
              <div className="flex-1 flex gap-3">
                {/* Only show "Save & Add Another" when creating new */}
                {!editingCategory.id && (
                  <button
                    onClick={() => {
                      setSaveAndContinue(true);
                      saveCategory(editingCategory);
                    }}
                    disabled={isSaving || !editingCategory.name || !editingCategory.slug || !editingCategory.articleType}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isSaving && saveAndContinue ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Đang lưu...
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        Lưu & thêm tiếp
                      </>
                    )}
                  </button>
                )}
                
                <button
                  onClick={() => {
                    setSaveAndContinue(false);
                    saveCategory(editingCategory);
                  }}
                  disabled={isSaving || !editingCategory.name || !editingCategory.slug || !editingCategory.articleType}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSaving && !saveAndContinue ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      {editingCategory.id ? 'Đang cập nhật...' : 'Đang tạo...'}
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      {editingCategory.id ? 'Cập nhật' : 'Lưu'}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats Modal */}
      {showStatsModal && selectedCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold">{selectedCategory.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Thống kê danh mục</p>
              </div>
              <button
                onClick={() => setShowStatsModal(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                <p className="text-sm text-blue-600 dark:text-blue-400 mb-1">Total Articles</p>
                <p className="text-3xl font-bold">{selectedCategory.articleCount}</p>
              </div>
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                <p className="text-sm text-green-600 dark:text-green-400 mb-1">Article Type</p>
                <p className="text-xl font-bold capitalize">{selectedCategory.articleType}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Status:</span>
                <span className="font-medium">{selectedCategory.isActive ? '✅ Active' : '❌ Inactive'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Visibility:</span>
                <span className="font-medium">{selectedCategory.isPublic ? '👁️ Public' : '🔒 Private'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Created:</span>
                <span className="font-medium">{new Date(selectedCategory.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Last Updated:</span>
                <span className="font-medium">{new Date(selectedCategory.updatedAt).toLocaleDateString()}</span>
              </div>
            </div>

            <button
              onClick={() => setShowStatsModal(false)}
              className="w-full mt-6 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
};