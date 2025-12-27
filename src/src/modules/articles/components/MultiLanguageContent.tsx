import React, { useState } from 'react';
import { useFetch, useMutate } from '@longvhv/query';
import { useNotifications } from '@longvhv/notifications';
import { 
  Globe, 
  Plus, 
  Check,
  Edit,
  Trash2,
  Copy,
  AlertCircle,
  Languages
} from 'lucide-react';

interface Translation {
  language: string;
  languageName: string;
  flag: string;
  title: string;
  content: string;
  summary: string;
  slug: string;
  status: 'draft' | 'published';
  translatedBy?: string;
  translatedAt?: string;
  isDefault: boolean;
}

interface MultiLanguageContentProps {
  articleId: string;
  defaultLanguage?: string;
}

export const MultiLanguageContent: React.FC<MultiLanguageContentProps> = ({
  articleId,
  defaultLanguage = 'en',
}) => {
  const notifications = useNotifications();
  const [activeLanguage, setActiveLanguage] = useState(defaultLanguage);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTranslation, setEditingTranslation] = useState<Translation | null>(null);

  const availableLanguages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
    { code: 'ko', name: '한국어', flag: '🇰🇷' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
  ];

  // Fetch translations
  const { data: translations, isLoading, refetch } = useFetch<Translation[]>(
    ['translations', articleId],
    async () => {
      // Mock data
      return [
        {
          language: 'en',
          languageName: 'English',
          flag: '🇬🇧',
          title: 'Introduction to React Hooks',
          content: '<p>React Hooks are a new addition in React 16.8...</p>',
          summary: 'Learn about React Hooks and how to use them effectively.',
          slug: 'introduction-to-react-hooks',
          status: 'published',
          isDefault: true,
        },
        {
          language: 'vi',
          languageName: 'Tiếng Việt',
          flag: '🇻🇳',
          title: 'Giới thiệu về React Hooks',
          content: '<p>React Hooks là một tính năng mới trong React 16.8...</p>',
          summary: 'Tìm hiểu về React Hooks và cách sử dụng chúng hiệu quả.',
          slug: 'gioi-thieu-ve-react-hooks',
          status: 'published',
          translatedBy: 'Jane Smith',
          translatedAt: new Date().toISOString(),
          isDefault: false,
        },
        {
          language: 'ja',
          languageName: '日本語',
          flag: '🇯🇵',
          title: 'React Hooksの紹介',
          content: '<p>React Hooksは、React 16.8の新機能です...</p>',
          summary: 'React Hooksについて学び、効果的に使用する方法。',
          slug: 'react-hooks-no-shoukai',
          status: 'draft',
          translatedBy: 'Mike Johnson',
          translatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          isDefault: false,
        },
      ];
    }
  );

  // Add/Update translation mutation
  const { mutate: saveTranslation, isPending: isSaving } = useMutate(
    async (data: Partial<Translation>) => {
      await new Promise(resolve => setTimeout(resolve, 1500));
      return { success: true };
    },
    {
      onSuccess: () => {
        notifications.success('Translation saved successfully');
        setShowAddModal(false);
        setEditingTranslation(null);
        refetch();
      },
    }
  );

  // Delete translation mutation
  const { mutate: deleteTranslation } = useMutate(
    async (language: string) => {
      await new Promise(resolve => setTimeout(resolve, 500));
      return { success: true };
    },
    {
      onSuccess: () => {
        notifications.success('Translation deleted');
        refetch();
      },
    }
  );

  // Auto-translate mutation
  const { mutate: autoTranslate, isPending: isAutoTranslating } = useMutate(
    async (targetLanguage: string) => {
      await new Promise(resolve => setTimeout(resolve, 2000));
      return { success: true };
    },
    {
      onSuccess: () => {
        notifications.success('Auto-translation completed');
        refetch();
      },
    }
  );

  // Get active translation
  const activeTranslation = translations?.find(t => t.language === activeLanguage);

  // Get missing languages
  const translatedLanguages = translations?.map(t => t.language) || [];
  const missingLanguages = availableLanguages.filter(
    lang => !translatedLanguages.includes(lang.code)
  );

  // Get completion percentage
  const completionPercentage = (translatedLanguages.length / availableLanguages.length) * 100;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Globe className="w-6 h-6" />
            Multi-Language Content
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Manage translations for this article
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Translation
        </button>
      </div>

      {/* Progress */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Translation Progress</span>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {translatedLanguages.length} of {availableLanguages.length} languages
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      </div>

      {/* Language Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="flex overflow-x-auto border-b border-gray-200 dark:border-gray-700">
          {translations?.map((translation) => (
            <button
              key={translation.language}
              onClick={() => setActiveLanguage(translation.language)}
              className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors whitespace-nowrap ${
                activeLanguage === translation.language
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-b-2 border-blue-600'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <span className="text-xl">{translation.flag}</span>
              <span>{translation.languageName}</span>
              {translation.isDefault && (
                <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded text-xs">
                  Default
                </span>
              )}
              {translation.status === 'published' ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <AlertCircle className="w-4 h-4 text-yellow-500" />
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTranslation && (
          <div className="p-6">
            <div className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
                  <p className="text-lg font-medium">{activeTranslation.title}</p>
                </div>
              </div>

              {/* Slug */}
              <div>
                <label className="block text-sm font-medium mb-2">Slug</label>
                <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-xl">
                  <code className="text-sm text-blue-600 dark:text-blue-400">
                    /{activeTranslation.language}/{activeTranslation.slug}
                  </code>
                </div>
              </div>

              {/* Summary */}
              <div>
                <label className="block text-sm font-medium mb-2">Summary</label>
                <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {activeTranslation.summary}
                  </p>
                </div>
              </div>

              {/* Content Preview */}
              <div>
                <label className="block text-sm font-medium mb-2">Content Preview</label>
                <div 
                  className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl prose dark:prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: activeTranslation.content.substring(0, 200) + '...' }}
                />
              </div>

              {/* Meta */}
              {activeTranslation.translatedBy && (
                <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                  <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400">
                    <Languages className="w-4 h-4" />
                    <span>
                      Translated by <strong>{activeTranslation.translatedBy}</strong>
                      {activeTranslation.translatedAt && (
                        <> on {new Date(activeTranslation.translatedAt).toLocaleDateString()}</>
                      )}
                    </span>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setEditingTranslation(activeTranslation);
                    setShowAddModal(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  Edit Translation
                </button>

                {!activeTranslation.isDefault && (
                  <>
                    <button
                      onClick={() => autoTranslate(activeTranslation.language)}
                      disabled={isAutoTranslating}
                      className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors disabled:opacity-50"
                    >
                      <Languages className="w-4 h-4" />
                      {isAutoTranslating ? 'Translating...' : 'Auto-Translate'}
                    </button>

                    <button
                      onClick={() => deleteTranslation(activeTranslation.language)}
                      className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Missing Languages */}
      {missingLanguages.length > 0 && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border border-yellow-200 dark:border-yellow-800 p-6">
          <h3 className="font-semibold mb-3 flex items-center gap-2 text-yellow-800 dark:text-yellow-400">
            <AlertCircle className="w-5 h-5" />
            Missing Translations ({missingLanguages.length})
          </h3>
          <div className="flex flex-wrap gap-2">
            {missingLanguages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  // Pre-fill with language code
                  setShowAddModal(true);
                }}
                className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-gray-800 border border-yellow-300 dark:border-yellow-700 rounded-lg hover:bg-yellow-100 dark:hover:bg-yellow-900/30 transition-colors"
              >
                <span className="text-lg">{lang.flag}</span>
                <span className="text-sm">{lang.name}</span>
                <Plus className="w-3 h-3" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-3xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 my-8">
            <h3 className="text-xl font-bold mb-4">
              {editingTranslation ? 'Edit Translation' : 'Add Translation'}
            </h3>

            <div className="space-y-4">
              {/* Language Selection */}
              {!editingTranslation && (
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Select Language
                  </label>
                  <select className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl">
                    <option value="">Choose language...</option>
                    {missingLanguages.map((lang) => (
                      <option key={lang.code} value={lang.code}>
                        {lang.flag} {lang.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Title */}
              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <input
                  type="text"
                  defaultValue={editingTranslation?.title}
                  placeholder="Translated title..."
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl"
                />
              </div>

              {/* Summary */}
              <div>
                <label className="block text-sm font-medium mb-2">Summary</label>
                <textarea
                  defaultValue={editingTranslation?.summary}
                  rows={3}
                  placeholder="Translated summary..."
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl resize-none"
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium mb-2">Content</label>
                <textarea
                  defaultValue={editingTranslation?.content}
                  rows={8}
                  placeholder="Translated content..."
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl resize-none"
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block text-sm font-medium mb-2">Slug</label>
                <input
                  type="text"
                  defaultValue={editingTranslation?.slug}
                  placeholder="translated-slug"
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl"
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium mb-2">Status</label>
                <select 
                  defaultValue={editingTranslation?.status || 'draft'}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingTranslation(null);
                }}
                className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => saveTranslation({})}
                disabled={isSaving}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : editingTranslation ? 'Update' : 'Add Translation'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
