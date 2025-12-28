import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

interface TestResult {
  category: string;
  key: string;
  value: string;
  status: 'pass' | 'fail' | 'warning';
}

export function I18nTestSuite() {
  const { t, language } = useLanguage();
  const [results, setResults] = useState<TestResult[]>([]);
  const [testing, setTesting] = useState(false);

  // All placeholder keys to test
  const placeholderKeys = [
    'searchCommand',
    'searchMedia',
    'searchCrawler',
    'searchHistory',
    'searchArticles',
    'searchEventStream',
    'dateFrom',
    'dateTo',
    'sizeMin',
    'sizeMax',
    'uploaderName',
    'fileDescription',
    'webhookUrl',
    'crawlerName',
    'rssUrl',
    'startWriting',
    'shortDescription',
    'readingTime',
    'videoUrl',
    'timestamp',
    'timestamps',
    'galleryDescription',
    'documentNumber',
    'issuingAuthority',
    'jobPosition',
    'years',
    'eventName',
    'eventDescription',
    'numberOfPositions',
    'salary',
    'location',
    'contactEmail',
    'contactPhone',
    'minYears',
    'maxYears',
    'duration',
    'guests',
    'imageCaption',
    'searchCategories',
    'addTag',
    'addAuthor',
    'fullName',
    'email',
    'phone',
    'password',
    'confirmPassword',
    'searchCMS',
    'seoUrl',
    'seoTitleExample',
    'seoDescriptionExample',
    'categoryNameExample',
    'categorySlugExample',
    'searchTypes',
    'categoryDescription',
    'categoryIcon',
    'campaignNameExample',
    'campaignDescription',
    'targetArticles',
    'searchSources',
    'sourceNameExample',
    'sourceUrl',
    'minViewsExample',
    'minCommentsExample',
    'writeReply',
    'addComment',
    'searchTemplates',
    'eventStreamNameExample',
    'eventStreamSlug',
    'eventStreamDescription',
    'thumbnailUrl',
    'enterTag',
    'searchArticleStream',
    'ruleNameExample',
    'ruleDescription',
    'addNewTag',
    'addCommentWorkflow',
    'categoryNamePlaceholder',
    'categorySlugPlaceholder',
    'categoryDescPlaceholder',
    'enterKeyword',
    'permissionGroupName',
    'permissionGroupDesc',
    'seoKeywords',
    'contentToProcess',
    'articleTitle',
    'articleSlug',
    'articleSummary',
    'seoMetaTitle',
    'seoMetaDescription',
    'ogImageUrl',
    'searchComments',
    'writeYourReply',
    'crawlerSourceExample',
    'crawlerUrlExample',
    'cssSelector',
    'titleSelector',
    'searchFiles',
    'folderName',
    'searchUsers',
    'searchRoles',
    'roleNameExample',
    'roleKeyExample',
    'roleDescription',
    'currentPassword',
    'newPassword',
    'translatedTitle',
    'translatedSummary',
    'translatedContent',
    'translatedSlug',
    'tagsExample',
    'searchByTitle',
    'seoTitleOptimized',
    'seoDescOptimized',
  ];

  // All tooltip keys to test
  const tooltipKeys = [
    'delete',
    'edit',
    'editItem',
    'view',
    'viewDetail',
    'add',
    'addNew',
    'changePassword',
    'more',
    'runNow',
    'pause',
    'resume',
    'restart',
    'download',
    'share',
    'restore',
    'deletePermanently',
    'deselect',
    'approve',
    'markAsSpam',
    'tableView',
    'listView',
    'gridView',
    'bold',
    'italic',
    'underline',
    'bulletList',
    'numberedList',
    'insertLink',
    'insertImage',
    'insertVideo',
    'codeBlock',
    'quote',
    'undo',
    'redo',
  ];

  const runTests = () => {
    setTesting(true);
    const testResults: TestResult[] = [];

    // Test placeholders
    placeholderKeys.forEach(key => {
      const fullKey = `placeholders.${key}`;
      const value = t(fullKey);
      
      testResults.push({
        category: 'Placeholder',
        key: fullKey,
        value,
        status: value === fullKey ? 'fail' : value.trim() === '' ? 'warning' : 'pass',
      });
    });

    // Test tooltips
    tooltipKeys.forEach(key => {
      const fullKey = `tooltips.${key}`;
      const value = t(fullKey);
      
      testResults.push({
        category: 'Tooltip',
        key: fullKey,
        value,
        status: value === fullKey ? 'fail' : value.trim() === '' ? 'warning' : 'pass',
      });
    });

    setResults(testResults);
    setTesting(false);
  };

  const stats = {
    total: results.length,
    passed: results.filter(r => r.status === 'pass').length,
    failed: results.filter(r => r.status === 'fail').length,
    warnings: results.filter(r => r.status === 'warning').length,
  };

  const passRate = stats.total > 0 ? ((stats.passed / stats.total) * 100).toFixed(1) : '0';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-slate-700/50 p-8 mb-6 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                🧪 i18n Test Suite
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Comprehensive testing for all translation keys
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">
                Current Language: <span className="font-semibold">{language.toUpperCase()}</span>
              </p>
            </div>
            <button
              onClick={runTests}
              disabled={testing}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50"
            >
              {testing ? 'Testing...' : 'Run Tests'}
            </button>
          </div>

          {/* Stats */}
          {stats.total > 0 && (
            <div className="grid grid-cols-4 gap-4 mt-6">
              <div className="bg-slate-100 dark:bg-slate-700 rounded-xl p-4">
                <div className="text-2xl font-bold text-slate-900 dark:text-white">{stats.total}</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Total Tests</div>
              </div>
              <div className="bg-green-100 dark:bg-green-900/30 rounded-xl p-4">
                <div className="text-2xl font-bold text-green-700 dark:text-green-400">{stats.passed}</div>
                <div className="text-sm text-green-600 dark:text-green-500">Passed</div>
              </div>
              <div className="bg-red-100 dark:bg-red-900/30 rounded-xl p-4">
                <div className="text-2xl font-bold text-red-700 dark:text-red-400">{stats.failed}</div>
                <div className="text-sm text-red-600 dark:text-red-500">Failed</div>
              </div>
              <div className="bg-yellow-100 dark:bg-yellow-900/30 rounded-xl p-4">
                <div className="text-2xl font-bold text-yellow-700 dark:text-yellow-400">{stats.warnings}</div>
                <div className="text-sm text-yellow-600 dark:text-yellow-500">Warnings</div>
              </div>
            </div>
          )}

          {/* Pass Rate */}
          {stats.total > 0 && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Pass Rate: {passRate}%
                </span>
                <span className={`text-sm font-bold ${
                  parseFloat(passRate) >= 90 ? 'text-green-600' :
                  parseFloat(passRate) >= 70 ? 'text-yellow-600' :
                  'text-red-600'
                }`}>
                  {parseFloat(passRate) >= 90 ? '✅ Excellent' :
                   parseFloat(passRate) >= 70 ? '⚠️ Good' :
                   '❌ Needs Improvement'}
                </span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all duration-500 ${
                    parseFloat(passRate) >= 90 ? 'bg-green-600' :
                    parseFloat(passRate) >= 70 ? 'bg-yellow-600' :
                    'bg-red-600'
                  }`}
                  style={{ width: `${passRate}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        {results.length > 0 && (
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-slate-700/50 shadow-xl overflow-hidden">
            {/* Filters */}
            <div className="border-b border-slate-200 dark:border-slate-700 p-4 bg-slate-50/50 dark:bg-slate-800/50">
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-slate-200 dark:bg-slate-700 rounded-lg text-sm font-medium">
                  All ({results.length})
                </button>
                <button className="px-4 py-2 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg text-sm font-medium text-green-700 dark:text-green-400">
                  Passed ({stats.passed})
                </button>
                <button className="px-4 py-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg text-sm font-medium text-red-700 dark:text-red-400">
                  Failed ({stats.failed})
                </button>
                <button className="px-4 py-2 hover:bg-yellow-100 dark:hover:bg-yellow-900/30 rounded-lg text-sm font-medium text-yellow-700 dark:text-yellow-400">
                  Warnings ({stats.warnings})
                </button>
              </div>
            </div>

            {/* Results Table */}
            <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
              <table className="w-full">
                <thead className="bg-slate-100 dark:bg-slate-700/50 sticky top-0">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Key
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Translated Value
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                  {results.map((result, idx) => (
                    <tr
                      key={idx}
                      className={`hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors ${
                        result.status === 'fail' ? 'bg-red-50/50 dark:bg-red-900/10' :
                        result.status === 'warning' ? 'bg-yellow-50/50 dark:bg-yellow-900/10' :
                        ''
                      }`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        {result.status === 'pass' && (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        )}
                        {result.status === 'fail' && (
                          <XCircle className="w-5 h-5 text-red-600" />
                        )}
                        {result.status === 'warning' && (
                          <AlertTriangle className="w-5 h-5 text-yellow-600" />
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                          result.category === 'Placeholder' 
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                            : 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                        }`}>
                          {result.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <code className="text-sm font-mono text-slate-700 dark:text-slate-300">
                          {result.key}
                        </code>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-slate-900 dark:text-slate-100">
                          {result.value}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* No Results */}
        {results.length === 0 && (
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-slate-700/50 p-12 text-center shadow-xl">
            <div className="text-6xl mb-4">🧪</div>
            <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Ready to Test
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              Click "Run Tests" to validate all {placeholderKeys.length + tooltipKeys.length} translation keys
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
