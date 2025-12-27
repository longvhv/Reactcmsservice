import React, { useState } from 'react';
import { useFetch, useMutate } from '@longvhv/query';
import { useNotifications } from '@longvhv/notifications';
import { 
  FileText, 
  Plus, 
  Edit,
  Trash2,
  Copy,
  Eye,
  Download,
  Upload,
  Star,
  Grid,
  List,
  Search,
  Filter
} from 'lucide-react';

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  type: 'news' | 'video' | 'gallery' | 'podcast' | 'event' | 'job' | 'document';
  thumbnail?: string;
  content: string;
  fields: TemplateField[];
  isDefault: boolean;
  isFavorite: boolean;
  usage: number;
  author: {
    id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface TemplateField {
  id: string;
  name: string;
  type: 'text' | 'textarea' | 'richtext' | 'image' | 'select' | 'checkbox' | 'date';
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
}

interface TemplateManagementProps {
  onSelectTemplate?: (template: Template) => void;
}

export const TemplateManagement: React.FC<TemplateManagementProps> = ({
  onSelectTemplate,
}) => {
  const notifications = useNotifications();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);

  // Fetch templates
  const { data: templates, isLoading, refetch } = useFetch<Template[]>(
    ['templates', { category: categoryFilter, search: searchTerm }],
    async () => {
      // Mock data
      return [
        {
          id: '1',
          name: 'Standard News Article',
          description: 'Basic news article template with title, content, and featured image',
          category: 'News',
          type: 'news',
          thumbnail: 'https://via.placeholder.com/400x300/3B82F6/FFFFFF?text=News',
          content: '<h1>{{title}}</h1><p>{{content}}</p>',
          fields: [
            { id: '1', name: 'title', type: 'text', label: 'Title', required: true },
            { id: '2', name: 'subtitle', type: 'text', label: 'Subtitle', required: false },
            { id: '3', name: 'content', type: 'richtext', label: 'Content', required: true },
            { id: '4', name: 'featuredImage', type: 'image', label: 'Featured Image', required: true },
          ],
          isDefault: true,
          isFavorite: false,
          usage: 245,
          author: { id: '1', name: 'System' },
          createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: '2',
          name: 'Video Article',
          description: 'Template for video content with embedded player and transcript',
          category: 'Media',
          type: 'video',
          thumbnail: 'https://via.placeholder.com/400x300/8B5CF6/FFFFFF?text=Video',
          content: '<div class="video-wrapper">{{videoEmbed}}</div><p>{{transcript}}</p>',
          fields: [
            { id: '1', name: 'title', type: 'text', label: 'Video Title', required: true },
            { id: '2', name: 'videoUrl', type: 'text', label: 'Video URL', placeholder: 'https://youtube.com/...', required: true },
            { id: '3', name: 'duration', type: 'text', label: 'Duration', placeholder: '10:30', required: false },
            { id: '4', name: 'transcript', type: 'richtext', label: 'Video Transcript', required: false },
            { id: '5', name: 'thumbnail', type: 'image', label: 'Video Thumbnail', required: true },
          ],
          isDefault: false,
          isFavorite: true,
          usage: 128,
          author: { id: '2', name: 'Jane Smith' },
          createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: '3',
          name: 'Photo Gallery',
          description: 'Gallery template with multiple images and captions',
          category: 'Media',
          type: 'gallery',
          thumbnail: 'https://via.placeholder.com/400x300/10B981/FFFFFF?text=Gallery',
          content: '<div class="gallery">{{images}}</div>',
          fields: [
            { id: '1', name: 'title', type: 'text', label: 'Gallery Title', required: true },
            { id: '2', name: 'description', type: 'textarea', label: 'Description', required: false },
            { id: '3', name: 'images', type: 'image', label: 'Gallery Images', required: true },
          ],
          isDefault: false,
          isFavorite: false,
          usage: 89,
          author: { id: '3', name: 'Mike Johnson' },
          createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: '4',
          name: 'Job Posting',
          description: 'Template for job listings with requirements and benefits',
          category: 'Jobs',
          type: 'job',
          thumbnail: 'https://via.placeholder.com/400x300/F59E0B/FFFFFF?text=Job',
          content: '<div class="job-posting">{{content}}</div>',
          fields: [
            { id: '1', name: 'jobTitle', type: 'text', label: 'Job Title', required: true },
            { id: '2', name: 'company', type: 'text', label: 'Company Name', required: true },
            { id: '3', name: 'location', type: 'text', label: 'Location', required: true },
            { id: '4', name: 'jobType', type: 'select', label: 'Job Type', options: ['Full-time', 'Part-time', 'Contract', 'Internship'], required: true },
            { id: '5', name: 'salary', type: 'text', label: 'Salary Range', required: false },
            { id: '6', name: 'description', type: 'richtext', label: 'Job Description', required: true },
            { id: '7', name: 'requirements', type: 'richtext', label: 'Requirements', required: true },
            { id: '8', name: 'benefits', type: 'richtext', label: 'Benefits', required: false },
          ],
          isDefault: false,
          isFavorite: true,
          usage: 67,
          author: { id: '1', name: 'John Doe' },
          createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ];
    }
  );

  // Create/Update template mutation
  const { mutate: saveTemplate, isPending: isSaving } = useMutate(
    async (data: Partial<Template>) => {
      await new Promise(resolve => setTimeout(resolve, 1500));
      return { success: true };
    },
    {
      onSuccess: () => {
        notifications.success('Template saved successfully');
        setShowCreateModal(false);
        setEditingTemplate(null);
        refetch();
      },
    }
  );

  // Delete template mutation
  const { mutate: deleteTemplate } = useMutate(
    async (id: string) => {
      await new Promise(resolve => setTimeout(resolve, 500));
      return { success: true };
    },
    {
      onSuccess: () => {
        notifications.success('Template deleted');
        refetch();
      },
    }
  );

  // Duplicate template mutation
  const { mutate: duplicateTemplate } = useMutate(
    async (id: string) => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { success: true };
    },
    {
      onSuccess: () => {
        notifications.success('Template duplicated');
        refetch();
      },
    }
  );

  // Toggle favorite
  const { mutate: toggleFavorite } = useMutate(
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

  // Filter templates
  const filteredTemplates = templates?.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         t.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || t.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Get unique categories
  const categories = ['all', ...Array.from(new Set(templates?.map(t => t.category) || []))];

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
            Template Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Create and manage article templates
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg"
        >
          <Plus className="w-5 h-5" />
          Create Template
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Templates', value: templates?.length || 0, icon: '📄' },
          { label: 'Favorites', value: templates?.filter(t => t.isFavorite).length || 0, icon: '⭐' },
          { label: 'Default', value: templates?.filter(t => t.isDefault).length || 0, icon: '✅' },
          { label: 'Total Usage', value: templates?.reduce((sum, t) => sum + t.usage, 0) || 0, icon: '📊' },
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

      {/* Filters & View Toggle */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex flex-wrap items-center gap-4">
          {/* Search */}
          <div className="flex-1 min-w-[300px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search templates..."
                className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors capitalize ${
                  categoryFilter === cat
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                    : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 p-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-gray-800 shadow'
                  : 'hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded transition-colors ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-gray-800 shadow'
                  : 'hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Templates Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates?.map((template) => (
            <div
              key={template.id}
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all group"
            >
              {/* Thumbnail */}
              <div className="relative aspect-video bg-gradient-to-br from-blue-500 to-purple-500">
                {template.thumbnail ? (
                  <img src={template.thumbnail} alt={template.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <FileText className="w-16 h-16 text-white/50" />
                  </div>
                )}
                
                {/* Badges */}
                <div className="absolute top-3 left-3 flex gap-2">
                  {template.isDefault && (
                    <span className="px-2 py-1 bg-green-500 text-white rounded text-xs font-medium">
                      Default
                    </span>
                  )}
                  <span className="px-2 py-1 bg-black/50 backdrop-blur-sm text-white rounded text-xs font-medium capitalize">
                    {template.type}
                  </span>
                </div>

                {/* Favorite */}
                <button
                  onClick={() => toggleFavorite(template.id)}
                  className="absolute top-3 right-3 p-2 bg-black/50 backdrop-blur-sm rounded-lg hover:bg-black/70 transition-colors"
                >
                  <Star className={`w-4 h-4 ${template.isFavorite ? 'fill-yellow-400 text-yellow-400' : 'text-white'}`} />
                </button>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-1">{template.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                  {template.description}
                </p>

                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-4">
                  <span>{template.fields.length} fields</span>
                  <span>{template.usage} uses</span>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => onSelectTemplate?.(template)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    <FileText className="w-4 h-4" />
                    Use Template
                  </button>
                  <button
                    onClick={() => setPreviewTemplate(template)}
                    className="p-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                    title="Preview"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setEditingTemplate(template);
                      setShowCreateModal(true);
                    }}
                    className="p-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => duplicateTemplate(template.id)}
                    className="p-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                    title="Duplicate"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  {!template.isDefault && (
                    <button
                      onClick={() => deleteTemplate(template.id)}
                      className="p-2 bg-red-50 dark:bg-red-900/20 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTemplates?.map((template) => (
            <div
              key={template.id}
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-all"
            >
              <div className="flex items-start gap-4">
                {/* Thumbnail */}
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex-shrink-0 overflow-hidden">
                  {template.thumbnail ? (
                    <img src={template.thumbnail} alt={template.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <FileText className="w-8 h-8 text-white/50" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-lg">{template.name}</h3>
                        {template.isDefault && (
                          <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded text-xs">
                            Default
                          </span>
                        )}
                        {template.isFavorite && (
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {template.description}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                        <span className="capitalize">{template.type}</span>
                        <span>•</span>
                        <span>{template.fields.length} fields</span>
                        <span>•</span>
                        <span>{template.usage} uses</span>
                        <span>•</span>
                        <span>By {template.author.name}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => onSelectTemplate?.(template)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                      >
                        Use
                      </button>
                      <button onClick={() => setPreviewTemplate(template)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button onClick={() => { setEditingTemplate(template); setShowCreateModal(true); }} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => duplicateTemplate(template.id)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                        <Copy className="w-4 h-4" />
                      </button>
                      {!template.isDefault && (
                        <button onClick={() => deleteTemplate(template.id)} className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {filteredTemplates?.length === 0 && (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <FileText className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
          <p className="text-gray-600 dark:text-gray-400 mb-4">No templates found</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            Create your first template
          </button>
        </div>
      )}

      {/* Preview Modal */}
      {previewTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-3xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-2xl font-bold">{previewTemplate.name}</h3>
                <p className="text-gray-600 dark:text-gray-400 mt-1">{previewTemplate.description}</p>
              </div>
              <button
                onClick={() => setPreviewTemplate(null)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Fields */}
              <div>
                <h4 className="font-semibold mb-3">Template Fields ({previewTemplate.fields.length})</h4>
                <div className="space-y-3">
                  {previewTemplate.fields.map((field) => (
                    <div key={field.id} className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium">{field.label}</span>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded text-xs">
                            {field.type}
                          </span>
                          {field.required && (
                            <span className="px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded text-xs">
                              Required
                            </span>
                          )}
                        </div>
                      </div>
                      {field.placeholder && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Placeholder: {field.placeholder}
                        </p>
                      )}
                      {field.options && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Options: {field.options.join(', ')}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    onSelectTemplate?.(previewTemplate);
                    setPreviewTemplate(null);
                  }}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                >
                  Use This Template
                </button>
                <button
                  onClick={() => setPreviewTemplate(null)}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
