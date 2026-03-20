import React, { useState } from 'react';
import { 
  Eye, 
  Monitor, 
  Smartphone, 
  Tablet,
  X,
  ExternalLink,
  Share2,
  Code,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { format } from 'date-fns';
import { SectionPreviewRenderer } from './sections/renderers/SectionPreviewRenderer';
import type { ContentSection } from '@/src/types/content-section';

interface ArticlePreviewProps {
  article: {
    title: string;
    content: string;
    excerpt?: string;
    featuredImage?: string;
    category?: string;
    tags?: string[];
    author?: {
      name: string;
      avatar?: string;
    };
    publishedAt?: string;
    articleType?: string;
    contentMode?: 'html' | 'sections';
    sections?: ContentSection[];
  };
  onClose?: () => void;
}

type DeviceType = 'desktop' | 'tablet' | 'mobile';
type ViewMode = 'preview' | 'html' | 'split';

export const ArticlePreview: React.FC<ArticlePreviewProps> = ({
  article,
  onClose,
}) => {
  const [device, setDevice] = useState<DeviceType>('desktop');
  const [viewMode, setViewMode] = useState<ViewMode>('preview');
  const [isFullscreen, setIsFullscreen] = useState(false);

  const deviceWidths = {
    desktop: '100%',
    tablet: '768px',
    mobile: '375px',
  };

  const getArticleTypeColor = (type?: string) => {
    const colors: Record<string, string> = {
      news: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      video: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
      gallery: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      podcast: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
      job: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',
    };
    return colors[type || 'news'] || colors.news;
  };

  return (
    <div className={`fixed inset-0 z-50 bg-black/50 backdrop-blur-sm ${isFullscreen ? 'p-0' : 'p-4'}`}>
      <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-2xl flex flex-col ${
        isFullscreen ? 'h-full' : 'h-[90vh] max-w-7xl mx-auto'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <Eye className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold">Xem trước bài viết</h3>
            {article.articleType && (
              <span className={`px-2 py-1 rounded text-xs font-medium capitalize ${getArticleTypeColor(article.articleType)}`}>
                {article.articleType}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 p-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <button
                onClick={() => setViewMode('preview')}
                className={`px-3 py-1.5 rounded text-sm transition-colors ${
                  viewMode === 'preview'
                    ? 'bg-white dark:bg-gray-800 shadow'
                    : 'hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
                title="Preview"
              >
                <Eye className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('html')}
                className={`px-3 py-1.5 rounded text-sm transition-colors ${
                  viewMode === 'html'
                    ? 'bg-white dark:bg-gray-800 shadow'
                    : 'hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
                title="HTML Code"
              >
                <Code className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('split')}
                className={`px-3 py-1.5 rounded text-sm transition-colors ${
                  viewMode === 'split'
                    ? 'bg-white dark:bg-gray-800 shadow'
                    : 'hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
                title="Split View"
              >
                <Monitor className="w-4 h-4" />
              </button>
            </div>

            {/* Device Toggle */}
            <div className="flex items-center gap-1 p-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <button
                onClick={() => setDevice('desktop')}
                className={`p-2 rounded transition-colors ${
                  device === 'desktop'
                    ? 'bg-white dark:bg-gray-800 shadow'
                    : 'hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
                title="Desktop"
              >
                <Monitor className="w-4 h-4" />
              </button>
              <button
                onClick={() => setDevice('tablet')}
                className={`p-2 rounded transition-colors ${
                  device === 'tablet'
                    ? 'bg-white dark:bg-gray-800 shadow'
                    : 'hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
                title="Tablet"
              >
                <Tablet className="w-4 h-4" />
              </button>
              <button
                onClick={() => setDevice('mobile')}
                className={`p-2 rounded transition-colors ${
                  device === 'mobile'
                    ? 'bg-white dark:bg-gray-800 shadow'
                    : 'hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
                title="Mobile"
              >
                <Smartphone className="w-4 h-4" />
              </button>
            </div>

            {/* Actions */}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? (
                <Minimize2 className="w-4 h-4" />
              ) : (
                <Maximize2 className="w-4 h-4" />
              )}
            </button>

            <button
              onClick={() => window.open('/preview', '_blank')}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title="Open in New Tab"
            >
              <ExternalLink className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Preview Content */}
        <div className="flex-1 overflow-hidden bg-gray-50 dark:bg-gray-900 p-6">
          <div className={`flex gap-4 h-full ${viewMode === 'split' ? '' : 'justify-center'}`}>
            {/* Preview Panel */}
            {(viewMode === 'preview' || viewMode === 'split') && (
              <div 
                className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-all ${
                  viewMode === 'split' ? 'flex-1' : ''
                }`}
                style={{ 
                  maxWidth: viewMode === 'split' ? '50%' : deviceWidths[device],
                  width: '100%'
                }}
              >
                <div className="h-full overflow-y-auto custom-scrollbar">
                  {/* Article Header */}
                  <div className="relative">
                    {article.featuredImage && (
                      <div className="aspect-video bg-gray-200 dark:bg-gray-700">
                        <img 
                          src={article.featuredImage} 
                          alt={article.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    
                    <div className="p-6 md:p-8">
                      {/* Category & Tags */}
                      {(article.category || article.tags) && (
                        <div className="flex flex-wrap items-center gap-2 mb-4">
                          {article.category && (
                            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm font-medium">
                              {article.category}
                            </span>
                          )}
                          {article.tags?.map((tag, index) => (
                            <span 
                              key={index}
                              className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Title */}
                      <h1 className="text-3xl md:text-4xl font-bold mb-4">
                        {article.title || 'Untitled Article'}
                      </h1>

                      {/* Excerpt */}
                      {article.excerpt && (
                        <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                          {article.excerpt}
                        </p>
                      )}

                      {/* Author & Date */}
                      <div className="flex items-center gap-4 pb-6 border-b border-gray-200 dark:border-gray-700 mb-6">
                        {article.author && (
                          <div className="flex items-center gap-3">
                            {article.author.avatar ? (
                              <img 
                                src={article.author.avatar} 
                                alt={article.author.name}
                                className="w-10 h-10 rounded-full"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-medium">
                                {article.author.name.charAt(0).toUpperCase()}
                              </div>
                            )}
                            <div>
                              <p className="font-medium text-sm">{article.author.name}</p>
                              {article.publishedAt && (
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  {format(new Date(article.publishedAt), 'MMM dd, yyyy')}
                                </p>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      {article.contentMode === 'sections' && article.sections && article.sections.length > 0 ? (
                        <SectionPreviewRenderer sections={article.sections} />
                      ) : (
                        <div 
                          className="prose dark:prose-invert max-w-none"
                          dangerouslySetInnerHTML={{ __html: article.content || '<p class="text-gray-400">No content yet...</p>' }}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* HTML Code Panel */}
            {(viewMode === 'html' || viewMode === 'split') && (
              <div 
                className={`bg-gray-900 rounded-xl shadow-lg overflow-hidden ${
                  viewMode === 'split' ? 'flex-1' : 'w-full max-w-4xl'
                }`}
              >
                <div className="flex items-center justify-between p-3 border-b border-gray-700">
                  <span className="text-sm text-gray-400 font-mono">HTML Source</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(generateHTML());
                      alert('HTML copied to clipboard!');
                    }}
                    className="px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded text-xs text-gray-300 transition-colors"
                  >
                    Copy HTML
                  </button>
                </div>
                <div className="h-full overflow-y-auto custom-scrollbar p-4">
                  <pre className="text-sm text-gray-300 font-mono whitespace-pre-wrap">
                    {generateHTML()}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Preview mode: <span className="font-medium capitalize">{device}</span>
            {' • '}
            <span className="font-medium">{deviceWidths[device]}</span>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => {
                const printWindow = window.open('', '_blank');
                printWindow?.document.write(generateHTML());
                printWindow?.print();
              }}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-sm transition-colors"
            >
              Print Preview
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              Đóng xem trước
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  function generateHTML(): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${article.title || 'Untitled Article'}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }
    img { max-width: 100%; height: auto; }
    .article-header { margin-bottom: 2rem; }
    .article-title { font-size: 2.5rem; font-weight: bold; margin-bottom: 1rem; }
    .article-meta { color: #666; margin-bottom: 1rem; }
    .article-content { font-size: 1.1rem; }
  </style>
</head>
<body>
  <article>
    <header class="article-header">
      ${article.featuredImage ? `<img src="${article.featuredImage}" alt="${article.title}" />` : ''}
      <h1 class="article-title">${article.title || 'Untitled Article'}</h1>
      ${article.excerpt ? `<p class="article-excerpt">${article.excerpt}</p>` : ''}
      <div class="article-meta">
        ${article.author ? `<span>By ${article.author.name}</span>` : ''}
        ${article.publishedAt ? ` • <time>${format(new Date(article.publishedAt), 'MMM dd, yyyy')}</time>` : ''}
      </div>
    </header>
    <div class="article-content">
      ${article.content || '<p>No content yet...</p>'}
    </div>
  </article>
</body>
</html>`;
  }
};