import React, { useState, useEffect } from 'react';
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
  Search,
  Filter,
  AlertCircle,
  X,
  Check,
  BarChart3,
  FileText
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
  articleCount: number;
  icon?: string;
  color?: string;
  children?: Category[];
  createdAt: string;
  updatedAt: string;
}

interface CategoryManagementProps {
  onNavigate: (page: any) => void;
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

// Mock notification system
const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
  // In a real app, this would use a toast library
  console.log(`[${type.toUpperCase()}] ${message}`);
  alert(`${type.toUpperCase()}: ${message}`);
};

export function CategoryManagement({ onNavigate }: CategoryManagementProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [showInactive, setShowInactive] = useState(false);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set(['1', '2']));
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Partial<Category>>({});
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [typeSearchTerm, setTypeSearchTerm] = useState('');
  const [saveAndContinue, setSaveAndContinue] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Load mock data
  useEffect(() => {
    setTimeout(() => {
      setCategories([
        {
          id: '1',
          name: 'Technology News',
          slug: 'technology-news',
          description: 'Latest technology news and updates',
          articleType: 'news',
          parentId: null,
          order: 1,
          isActive: true,
          articleCount: 145,
          icon: '💻',
          color: '#3B82F6',
          createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          children: [
            {
              id: '11',
              name: 'AI & Machine Learning',
              slug: 'ai-machine-learning',
              description: 'Artificial Intelligence and ML news',
              articleType: 'news',
              parentId: '1',
              order: 1,
              isActive: true,
              articleCount: 67,
              icon: '🤖',
              color: '#3B82F6',
              createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
              updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            },
            {
              id: '12',
              name: 'Web Development',
              slug: 'web-development',
              description: 'Web dev tutorials and news',
              articleType: 'news',
              parentId: '1',
              order: 2,
              isActive: true,
              articleCount: 78,
              icon: '🌐',
              color: '#3B82F6',
              createdAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
              updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            }
          ]
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
          articleCount: 89,
          icon: '🎥',
          color: '#8B5CF6',
          createdAt: new Date(Date.now() - 150 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: '3',
          name: 'Photo Galleries',
          slug: 'photo-galleries',
          description: 'Image galleries and photo essays',
          articleType: 'gallery',
          parentId: null,
          order: 3,
          isActive: true,
          articleCount: 56,
          icon: '📸',
          color: '#10B981',
          createdAt: new Date(Date.now() - 100 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        }
      ]);
      setIsLoading(false);
    }, 500);
  }, []);

  // Auto-generate slug from name
  useEffect(() => {
    if (editingCategory.name && !editingCategory.id) {
      const slug = editingCategory.name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setEditingCategory(prev => ({ ...prev, slug }));
    }
  }, [editingCategory.name, editingCategory.id]);

  const handleSave = async () => {
    if (!editingCategory.name || !editingCategory.slug || !editingCategory.articleType) {
      showNotification('Please fill all required fields', 'error');
      return;
    }

    setIsSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const isCreatingNew = !editingCategory.id;
    
    if (isCreatingNew) {
      // Add new category
      const newCategory: Category = {
        id: String(Date.now()),
        name: editingCategory.name!,
        slug: editingCategory.slug!,
        description: editingCategory.description || '',
        articleType: editingCategory.articleType!,
        parentId: editingCategory.parentId || null,
        order: categories.length + 1,
        isActive: editingCategory.isActive !== false,
        articleCount: 0,
        icon: editingCategory.icon,
        color: editingCategory.color,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      setCategories(prev => [...prev, newCategory]);
      showNotification('Category created successfully!', 'success');
      
      if (saveAndContinue) {
        // Clear form but keep modal open
        setEditingCategory({});
        showNotification('Ready to add another category', 'info');
      } else {
        setShowEditModal(false);
        setEditingCategory({});
      }
    } else {
      // Update existing category
      setCategories(prev => prev.map(cat => 
        cat.id === editingCategory.id 
          ? { ...cat, ...editingCategory as Category }
          : cat
      ));
      showNotification('Category updated successfully!', 'success');
      setShowEditModal(false);
      setEditingCategory({});
    }
    
    setIsSaving(false);
    setSaveAndContinue(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    
    setCategories(prev => prev.filter(cat => cat.id !== id));
    showNotification('Category deleted successfully!', 'success');
  };

  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expandedIds);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedIds(newExpanded);
  };

  const getArticleTypeConfig = (type: string) => {
    return ARTICLE_TYPES.find(t => t.value === type) || ARTICLE_TYPES[0];
  };

  const filteredTypes = ARTICLE_TYPES.filter(type => 
    type.label.toLowerCase().includes(typeSearchTerm.toLowerCase())
  );

  const filteredCategories = categories.filter(cat => {
    if (searchTerm && !cat.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    if (filterType !== 'all' && cat.articleType !== filterType) {
      return false;
    }
    if (!showInactive && !cat.isActive) {
      return false;
    }
    return true;
  });

  const renderCategory = (category: Category, level: number = 0) => {
    const typeConfig = getArticleTypeConfig(category.articleType);
    const isExpanded = expandedIds.has(category.id);
    const hasChildren = category.children && category.children.length > 0;

    return (
      <div key={category.id} className="mb-2">
        <div 
          className="flex items-center gap-3 p-3 bg-secondary rounded-xl hover:bg-secondary/80 transition-all group"
          style={{ marginLeft: `${level * 24}px` }}
        >
          {/* Expand/Collapse */}
          {hasChildren && (
            <button
              onClick={() => toggleExpand(category.id)}
              className="p-1 hover:bg-muted rounded transition-colors"
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>
          )}
          {!hasChildren && <div className="w-6" />}

          {/* Icon & Info */}
          <div className="flex-1 flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-lg"
              style={{ backgroundColor: typeConfig.color }}
            >
              {category.icon || typeConfig.icon}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h4 className="font-semibold">{category.name}</h4>
                {!category.isActive && (
                  <span className="px-2 py-0.5 bg-gray-200 dark:bg-gray-700 text-xs rounded">
                    Inactive
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground mt-0.5">
                <span>/{category.slug}</span>
                <span>•</span>
                <span>{typeConfig.icon} {typeConfig.label}</span>
                <span>•</span>
                <span>{category.articleCount} articles</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => {
                setEditingCategory(category);
                setShowEditModal(true);
              }}
              className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
              title="Edit"
            >
              <Edit className="w-4 h-4 text-blue-600" />
            </button>
            
            <button
              onClick={() => handleDelete(category.id)}
              className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
              title="Delete"
            >
              <Trash2 className="w-4 h-4 text-red-600" />
            </button>
          </div>
        </div>

        {/* Children */}
        {hasChildren && isExpanded && (
          <div className="mt-2">
            {category.children!.map(child => renderCategory(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const typeConfig = editingCategory.articleType ? getArticleTypeConfig(editingCategory.articleType) : null;

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Category Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Organize content with article type binding
          </p>
        </div>

        <button
          onClick={() => {
            setEditingCategory({});
            setShowEditModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg shadow-blue-500/30"
        >
          <Plus className="w-5 h-5" />
          Create Category
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card rounded-xl p-6 border border-border">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Total Categories</p>
            <FolderOpen className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-3xl font-bold">{categories.length}</p>
        </div>

        <div className="bg-card rounded-xl p-6 border border-border">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Active</p>
            <Eye className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-3xl font-bold">
            {categories.filter(c => c.isActive).length}
          </p>
        </div>

        <div className="bg-card rounded-xl p-6 border border-border">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Article Types</p>
            <BarChart3 className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-3xl font-bold">
            {new Set(categories.map(c => c.articleType)).size}
          </p>
        </div>

        <div className="bg-card rounded-xl p-6 border border-border">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Total Articles</p>
            <FileText className="w-5 h-5 text-orange-600" />
          </div>
          <p className="text-3xl font-bold">
            {categories.reduce((sum, c) => sum + c.articleCount, 0)}
          </p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-card rounded-xl border border-border p-4">
        <div className="flex flex-wrap items-center gap-4">
          {/* Search */}
          <div className="flex-1 min-w-[250px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search categories..."
                className="w-full pl-10 pr-4 py-2 bg-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          {/* Filter by Type */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 bg-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="all">All Types</option>
            {ARTICLE_TYPES.map(type => (
              <option key={type.value} value={type.value}>
                {type.icon} {type.label}
              </option>
            ))}
          </select>

          {/* Show Inactive */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showInactive}
              onChange={(e) => setShowInactive(e.target.checked)}
              className="w-4 h-4 rounded border-border"
            />
            <span className="text-sm">Show inactive</span>
          </label>
        </div>
      </div>

      {/* Categories List */}
      <div className="bg-card rounded-xl border border-border p-6">
        {filteredCategories.length === 0 ? (
          <div className="text-center py-12">
            <FolderOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No categories found</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredCategories.map(category => renderCategory(category))}
          </div>
        )}
      </div>

      {/* Edit/Create Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-3xl bg-card rounded-2xl shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold">
                  {editingCategory.id ? 'Edit Category' : 'Create Category'}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {editingCategory.id ? 'Update category information' : 'Add a new category to organize your content'}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingCategory({});
                  setSaveAndContinue(false);
                }}
                className="p-2 hover:bg-secondary rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column - Form */}
              <div className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={editingCategory.name || ''}
                    onChange={(e) => setEditingCategory(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Technology News"
                    className="w-full px-4 py-2 bg-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                {/* Slug */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Slug <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={editingCategory.slug || ''}
                    onChange={(e) => setEditingCategory(prev => ({ ...prev, slug: e.target.value }))}
                    placeholder="auto-generated"
                    className="w-full px-4 py-2 bg-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Auto-generated from name</p>
                </div>

                {/* Article Type */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Article Type <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowTypeDropdown(!showTypeDropdown)}
                      className="w-full px-4 py-2 bg-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 flex items-center justify-between"
                    >
                      {typeConfig ? (
                        <span className="flex items-center gap-2">
                          <span>{typeConfig.icon}</span>
                          <span>{typeConfig.label}</span>
                        </span>
                      ) : (
                        <span className="text-muted-foreground">Select type...</span>
                      )}
                      <ChevronDown className="w-4 h-4" />
                    </button>

                    {showTypeDropdown && (
                      <div className="absolute z-10 w-full mt-2 bg-card border border-border rounded-xl shadow-xl max-h-64 overflow-y-auto">
                        <div className="p-2 border-b border-border">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input
                              type="search"
                              value={typeSearchTerm}
                              onChange={(e) => setTypeSearchTerm(e.target.value)}
                              placeholder="Search types..."
                              className="w-full pl-9 pr-3 py-2 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                            />
                          </div>
                        </div>
                        <div className="p-2 space-y-1">
                          {filteredTypes.map(type => (
                            <button
                              key={type.value}
                              onClick={() => {
                                setEditingCategory(prev => ({ 
                                  ...prev, 
                                  articleType: type.value as any,
                                  color: type.color,
                                  icon: type.icon
                                }));
                                setShowTypeDropdown(false);
                                setTypeSearchTerm('');
                              }}
                              className="w-full flex items-center gap-3 px-3 py-2 hover:bg-secondary rounded-lg transition-colors text-left"
                            >
                              <div
                                className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
                                style={{ backgroundColor: type.color }}
                              >
                                {type.icon}
                              </div>
                              <div>
                                <div className="font-medium">{type.label}</div>
                                <div className="text-xs text-muted-foreground">{type.value}</div>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Each category can only have one article type</p>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Description
                  </label>
                  <textarea
                    value={editingCategory.description || ''}
                    onChange={(e) => setEditingCategory(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Category description..."
                    rows={3}
                    className="w-full px-4 py-2 bg-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                {/* Active */}
                <div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingCategory.isActive !== false}
                      onChange={(e) => setEditingCategory(prev => ({ ...prev, isActive: e.target.checked }))}
                      className="w-4 h-4 rounded border-border"
                    />
                    <span className="text-sm font-medium">Active</span>
                  </label>
                </div>
              </div>

              {/* Right Column - Preview */}
              <div>
                <div className="bg-secondary rounded-xl p-6 border-2 border-dashed border-border">
                  <h4 className="text-sm font-medium mb-4 flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    Live Preview
                  </h4>

                  {editingCategory.name && editingCategory.articleType ? (
                    <div className="space-y-4">
                      {/* Preview Card */}
                      <div className="bg-card rounded-xl p-4 border border-border">
                        <div className="flex items-start gap-3">
                          <div
                            className="w-12 h-12 rounded-lg flex items-center justify-center text-white text-xl flex-shrink-0"
                            style={{ backgroundColor: typeConfig?.color }}
                          >
                            {editingCategory.icon || typeConfig?.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h5 className="font-semibold truncate">{editingCategory.name}</h5>
                            <p className="text-sm text-muted-foreground truncate">/{editingCategory.slug || 'slug'}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="px-2 py-0.5 text-xs rounded" style={{ backgroundColor: `${typeConfig?.color}20`, color: typeConfig?.color }}>
                                {typeConfig?.icon} {typeConfig?.label}
                              </span>
                              {editingCategory.isActive !== false ? (
                                <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs rounded">
                                  ⚡ Active
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-xs rounded">
                                  Inactive
                                </span>
                              )}
                            </div>
                            {editingCategory.description && (
                              <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                                {editingCategory.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Info */}
                      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 text-sm">
                        <div className="flex items-start gap-2">
                          <AlertCircle className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                          <p className="text-blue-900 dark:text-blue-100">
                            This category will only accept <strong>{typeConfig?.label}</strong> articles
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <FolderOpen className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Fill the form to see preview</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 mt-6 pt-6 border-t border-border">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingCategory({});
                  setSaveAndContinue(false);
                }}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              
              <div className="flex-1 flex gap-3">
                {/* Only show "Save & Add Another" when creating new */}
                {!editingCategory.id && (
                  <button
                    onClick={() => {
                      setSaveAndContinue(true);
                      handleSave();
                    }}
                    disabled={isSaving || !editingCategory.name || !editingCategory.slug || !editingCategory.articleType}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isSaving && saveAndContinue ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        Save & Add Another
                      </>
                    )}
                  </button>
                )}
                
                <button
                  onClick={() => {
                    setSaveAndContinue(false);
                    handleSave();
                  }}
                  disabled={isSaving || !editingCategory.name || !editingCategory.slug || !editingCategory.articleType}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSaving && !saveAndContinue ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      {editingCategory.id ? 'Update' : 'Save'}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}