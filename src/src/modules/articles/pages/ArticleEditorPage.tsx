import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form@7.55.0';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useFetch, useMutate } from '@longvhv/query';
import { useNotifications } from '@longvhv/notifications';
import { useTranslation } from '@longvhv/i18n';
import { 
  Save, 
  X, 
  Eye, 
  Upload, 
  Image as ImageIcon,
  Calendar,
  Tag as TagIcon,
  FolderTree,
  Globe,
  AlertCircle,
  Loader2,
  Plus,
  Trash2,
  Link as LinkIcon
} from 'lucide-react';
import { articleService } from '../services/articleService';
import { Article, ArticleType, ArticleCreateInput } from '@/types/article';
import { RichTextEditor } from '../components/RichTextEditor';
import { CategorySelector } from '../components/CategorySelector';
import { TagInput } from '../components/TagInput';
import { MediaPicker } from '../components/MediaPicker';

// Validation schema
const articleSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  slug: z.string().optional(),
  summary: z.string().optional(),
  content: z.string().min(50, 'Content must be at least 50 characters'),
  type: z.enum(['news', 'video', 'gallery', 'podcast', 'event', 'job', 'document', 'legal', 'person', 'download', 'infographic', 'live', 'qa', 'tutorial']),
  categoryIds: z.array(z.string()).min(1, 'Select at least one category'),
  tagIds: z.array(z.string()).optional(),
  featuredImage: z.string().optional(),
  isFeatured: z.boolean().default(false),
  isBreaking: z.boolean().default(false),
  isPinned: z.boolean().default(false),
  allowComments: z.boolean().default(true),
  scheduledAt: z.string().optional(),
  seo: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    keywords: z.array(z.string()).optional(),
    ogImage: z.string().optional(),
    noIndex: z.boolean().optional(),
  }).optional(),
});

type ArticleFormData = z.infer<typeof articleSchema>;

const ArticleEditorPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const notifications = useNotifications();
  const isEditMode = !!id;

  const [showPreview, setShowPreview] = useState(false);
  const [activeTab, setActiveTab] = useState<'content' | 'seo' | 'settings'>('content');
  const [showMediaPicker, setShowMediaPicker] = useState(false);

  // Form setup
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm<ArticleFormData>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      type: 'news',
      categoryIds: [],
      tagIds: [],
      isFeatured: false,
      isBreaking: false,
      isPinned: false,
      allowComments: true,
    },
  });

  // Fetch article for editing
  const { data: article, isLoading } = useFetch<Article>(
    ['article', id],
    () => articleService.getById(id!),
    {
      enabled: isEditMode,
    }
  );

  // Load article data into form
  useEffect(() => {
    if (article) {
      setValue('title', article.title);
      setValue('slug', article.slug);
      setValue('summary', article.summary || '');
      setValue('content', article.content);
      setValue('type', article.type);
      setValue('categoryIds', article.categories.map(c => c.id));
      setValue('tagIds', article.tags?.map(t => t.id) || []);
      setValue('featuredImage', article.featuredImage);
      setValue('isFeatured', article.isFeatured);
      setValue('isBreaking', article.isBreaking);
      setValue('isPinned', article.isPinned);
      setValue('allowComments', article.allowComments);
      if (article.seo) {
        setValue('seo', article.seo);
      }
    }
  }, [article, setValue]);

  // Auto-generate slug from title
  const titleValue = watch('title');
  useEffect(() => {
    if (!isEditMode && titleValue) {
      const slug = titleValue
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      setValue('slug', slug);
    }
  }, [titleValue, isEditMode, setValue]);

  // Create/Update mutations
  const { mutate: createArticle, isPending: isCreating } = useMutate(
    (data: ArticleCreateInput) => articleService.create(data),
    {
      onSuccess: () => {
        notifications.success(t('article.created') || 'Article created successfully!');
        navigate('/articles');
      },
      onError: (error: any) => {
        notifications.error(error.message || 'Failed to create article');
      },
    }
  );

  const { mutate: updateArticle, isPending: isUpdating } = useMutate(
    (data: Partial<ArticleFormData>) => articleService.update(id!, data),
    {
      onSuccess: () => {
        notifications.success(t('article.updated') || 'Article updated successfully!');
        navigate('/articles');
      },
      onError: (error: any) => {
        notifications.error(error.message || 'Failed to update article');
      },
    }
  );

  // Form submission
  const onSubmit = (data: ArticleFormData) => {
    if (isEditMode) {
      updateArticle(data);
    } else {
      createArticle(data as ArticleCreateInput);
    }
  };

  // Save as draft
  const handleSaveDraft = () => {
    const data = watch();
    if (isEditMode) {
      updateArticle({ ...data, status: 'draft' } as any);
    } else {
      createArticle({ ...data, status: 'draft' } as any);
    }
  };

  // Publish
  const handlePublish = () => {
    handleSubmit((data) => {
      if (isEditMode) {
        updateArticle({ ...data, status: 'published' } as any);
      } else {
        createArticle({ ...data, status: 'published' } as any);
      }
    })();
  };

  const articleTypes = [
    { value: 'news', label: 'News', icon: '📰' },
    { value: 'video', label: 'Video', icon: '🎥' },
    { value: 'gallery', label: 'Gallery', icon: '🖼️' },
    { value: 'podcast', label: 'Podcast', icon: '🎙️' },
    { value: 'event', label: 'Event', icon: '📅' },
    { value: 'job', label: 'Job', icon: '💼' },
    { value: 'document', label: 'Document', icon: '📑' },
    { value: 'legal', label: 'Legal', icon: '⚖️' },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {isEditMode ? 'Edit Article' : 'Create New Article'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {isEditMode ? 'Update your article' : 'Write and publish your content'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/articles')}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <Eye className="w-5 h-5" />
            {showPreview ? 'Edit' : 'Preview'}
          </button>

          <button
            type="button"
            onClick={handleSaveDraft}
            disabled={isCreating || isUpdating}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
          >
            {(isCreating || isUpdating) && <Loader2 className="w-5 h-5 animate-spin" />}
            Save Draft
          </button>

          <button
            type="button"
            onClick={handlePublish}
            disabled={isCreating || isUpdating}
            className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg disabled:opacity-50"
          >
            {(isCreating || isUpdating) && <Loader2 className="w-5 h-5 animate-spin" />}
            <Save className="w-5 h-5" />
            Publish
          </button>
        </div>
      </div>

      {/* Unsaved changes warning */}
      {isDirty && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            <p className="text-sm text-yellow-600 dark:text-yellow-400">
              You have unsaved changes
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tabs */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="flex border-b border-gray-200 dark:border-gray-700">
              {[
                { id: 'content', label: 'Content', icon: '📝' },
                { id: 'seo', label: 'SEO', icon: '🔍' },
                { id: 'settings', label: 'Settings', icon: '⚙️' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 px-6 py-3 font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-b-2 border-blue-600'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="p-6 space-y-6">
              {/* Content Tab */}
              {activeTab === 'content' && (
                <>
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      {...register('title')}
                      type="text"
                      placeholder="Enter article title..."
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all text-lg"
                    />
                    {errors.title && (
                      <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>
                    )}
                  </div>

                  {/* Slug */}
                  <div>
                    <label className="block text-sm font-medium mb-2">URL Slug</label>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        /articles/
                      </span>
                      <input
                        {...register('slug')}
                        type="text"
                        placeholder="auto-generated-from-title"
                        className="flex-1 px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all"
                      />
                    </div>
                  </div>

                  {/* Summary */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Summary</label>
                    <textarea
                      {...register('summary')}
                      rows={3}
                      placeholder="Brief summary of your article..."
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all resize-none"
                    />
                  </div>

                  {/* Rich Text Editor */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Content <span className="text-red-500">*</span>
                    </label>
                    <RichTextEditor
                      value={watch('content') || ''}
                      onChange={(value) => setValue('content', value, { shouldDirty: true })}
                    />
                    {errors.content && (
                      <p className="mt-1 text-sm text-red-500">{errors.content.message}</p>
                    )}
                  </div>
                </>
              )}

              {/* SEO Tab */}
              {activeTab === 'seo' && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-2">SEO Title</label>
                    <input
                      {...register('seo.title')}
                      type="text"
                      placeholder="Leave empty to use article title"
                      className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Meta Description</label>
                    <textarea
                      {...register('seo.description')}
                      rows={3}
                      placeholder="Description for search engines..."
                      className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all resize-none"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Recommended: 150-160 characters
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">OG Image URL</label>
                    <div className="flex gap-2">
                      <input
                        {...register('seo.ogImage')}
                        type="url"
                        placeholder="https://example.com/image.jpg"
                        className="flex-1 px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowMediaPicker(true)}
                        className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                      >
                        <Upload className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      {...register('seo.noIndex')}
                      type="checkbox"
                      id="noIndex"
                      className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500/20"
                    />
                    <label htmlFor="noIndex" className="text-sm">
                      Prevent search engines from indexing this article
                    </label>
                  </div>
                </>
              )}

              {/* Settings Tab */}
              {activeTab === 'settings' && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-2">Schedule Publish</label>
                    <input
                      {...register('scheduledAt')}
                      type="datetime-local"
                      className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all"
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <input
                        {...register('isFeatured')}
                        type="checkbox"
                        id="isFeatured"
                        className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500/20"
                      />
                      <label htmlFor="isFeatured" className="text-sm font-medium">
                        ⭐ Featured Article
                      </label>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        {...register('isBreaking')}
                        type="checkbox"
                        id="isBreaking"
                        className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500/20"
                      />
                      <label htmlFor="isBreaking" className="text-sm font-medium">
                        🚨 Breaking News
                      </label>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        {...register('isPinned')}
                        type="checkbox"
                        id="isPinned"
                        className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500/20"
                      />
                      <label htmlFor="isPinned" className="text-sm font-medium">
                        📌 Pin to Top
                      </label>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        {...register('allowComments')}
                        type="checkbox"
                        id="allowComments"
                        className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500/20"
                      />
                      <label htmlFor="allowComments" className="text-sm font-medium">
                        💬 Allow Comments
                      </label>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Article Type */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Article Type
            </h3>
            <select
              {...register('type')}
              className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all"
            >
              {articleTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.icon} {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Featured Image */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <ImageIcon className="w-5 h-5" />
              Featured Image
            </h3>
            {watch('featuredImage') ? (
              <div className="relative group">
                <img
                  src={watch('featuredImage')}
                  alt="Featured"
                  className="w-full h-48 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => setValue('featuredImage', '')}
                  className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowMediaPicker(true)}
                className="w-full h-48 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex flex-col items-center justify-center gap-2 hover:border-blue-500 transition-colors"
              >
                <Upload className="w-8 h-8 text-gray-400" />
                <span className="text-sm text-gray-500">Upload Image</span>
              </button>
            )}
          </div>

          {/* Categories */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <FolderTree className="w-5 h-5" />
              Categories <span className="text-red-500">*</span>
            </h3>
            <CategorySelector
              selectedIds={watch('categoryIds') || []}
              onChange={(ids) => setValue('categoryIds', ids, { shouldDirty: true })}
            />
            {errors.categoryIds && (
              <p className="mt-2 text-sm text-red-500">{errors.categoryIds.message}</p>
            )}
          </div>

          {/* Tags */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <TagIcon className="w-5 h-5" />
              Tags
            </h3>
            <TagInput
              selectedIds={watch('tagIds') || []}
              onChange={(ids) => setValue('tagIds', ids, { shouldDirty: true })}
            />
          </div>
        </div>
      </div>

      {/* Media Picker Modal */}
      {showMediaPicker && (
        <MediaPicker
          onSelect={(url) => {
            setValue('featuredImage', url, { shouldDirty: true });
            setShowMediaPicker(false);
          }}
          onClose={() => setShowMediaPicker(false)}
        />
      )}
    </form>
  );
};

export default ArticleEditorPage;
