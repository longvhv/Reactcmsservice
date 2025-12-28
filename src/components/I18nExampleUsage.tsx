/**
 * Example Component - Demonstrates how to use i18n translations
 * 
 * This is an example of how to implement multi-language support in your components.
 * Copy this pattern to other components as needed.
 */

import { useLanguage } from '../contexts/LanguageContext';
import { Save, Cancel, Edit } from 'lucide-react';

export function I18nExampleUsage() {
  const { t } = useLanguage();

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">{t('dashboard.welcome')}</h1>
      
      {/* Example: Common actions */}
      <div className="flex gap-2">
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg">
          <Save className="w-4 h-4" />
          {t('common.save')}
        </button>
        
        <button className="flex items-center gap-2 px-4 py-2 border rounded-lg">
          <Cancel className="w-4 h-4" />
          {t('common.cancel')}
        </button>
        
        <button className="flex items-center gap-2 px-4 py-2 border rounded-lg">
          <Edit className="w-4 h-4" />
          {t('common.edit')}
        </button>
      </div>

      {/* Example: Menu items */}
      <div className="space-y-2">
        <h2 className="font-semibold">{t('menu.articles')}</h2>
        <p>{t('articles.searchPlaceholder')}</p>
      </div>

      {/* Example: Article types */}
      <div className="space-y-2">
        <h2 className="font-semibold">Article Types:</h2>
        <ul className="list-disc list-inside">
          <li>{t('articleTypes.news')}</li>
          <li>{t('articleTypes.video')}</li>
          <li>{t('articleTypes.gallery')}</li>
          <li>{t('articleTypes.podcast')}</li>
        </ul>
      </div>

      {/* Example: Status labels */}
      <div className="space-y-2">
        <h2 className="font-semibold">Status:</h2>
        <div className="flex gap-2">
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
            {t('status.published')}
          </span>
          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
            {t('status.draft')}
          </span>
          <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">
            {t('status.review')}
          </span>
        </div>
      </div>

      {/* Example: Form labels */}
      <div className="space-y-2">
        <label className="block">
          <span className="text-sm font-medium">{t('editor.title')}</span>
          <input
            type="text"
            placeholder={t('editor.titlePlaceholder')}
            className="w-full px-3 py-2 border rounded-lg mt-1"
          />
        </label>
      </div>
    </div>
  );
}

/**
 * USAGE INSTRUCTIONS:
 * 
 * 1. Import the useLanguage hook:
 *    import { useLanguage } from '../contexts/LanguageContext';
 * 
 * 2. Get the translation function in your component:
 *    const { t } = useLanguage();
 * 
 * 3. Use t() to translate any text:
 *    t('common.save')           // => 'Save' (English) or 'Lưu' (Vietnamese)
 *    t('menu.dashboard')        // => 'Dashboard' (English) or 'Tổng quan' (Vietnamese)
 *    t('articles.createNew')    // => 'Create New Article' or 'Tạo bài viết mới'
 * 
 * 4. Translation keys use dot notation to access nested values:
 *    - common.save
 *    - menu.dashboard
 *    - articles.title
 *    - editor.titlePlaceholder
 *    - status.published
 * 
 * 5. All translation keys are defined in /locales/*.ts files:
 *    - /locales/vi.ts - Vietnamese
 *    - /locales/en.ts - English
 *    - /locales/es.ts - Spanish
 *    - /locales/zh.ts - Chinese
 *    - /locales/ja.ts - Japanese
 *    - /locales/ko.ts - Korean
 * 
 * 6. To add new translations:
 *    - Add the key-value pair to all language files
 *    - Use the same nested structure in all files
 *    - Keep keys consistent across languages
 */
