import React, { useState } from 'react';
import { 
  Search, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  TrendingUp,
  Eye,
  Link as LinkIcon,
  Image as ImageIcon,
  FileText,
  Hash,
  Globe,
  Zap
} from 'lucide-react';

interface SEOScore {
  overall: number;
  title: number;
  description: number;
  keywords: number;
  readability: number;
  images: number;
}

interface SEOIssue {
  type: 'error' | 'warning' | 'success';
  category: string;
  message: string;
  suggestion?: string;
}

interface SEOToolsProps {
  article: {
    title: string;
    content: string;
    summary?: string;
    slug?: string;
    seo?: {
      title?: string;
      description?: string;
      keywords?: string[];
    };
  };
}

export const SEOTools: React.FC<SEOToolsProps> = ({ article }) => {
  const [activeTab, setActiveTab] = useState<'analysis' | 'preview' | 'keywords'>('analysis');

  // Calculate SEO scores
  const calculateScores = (): SEOScore => {
    const title = article.seo?.title || article.title;
    const description = article.seo?.description || article.summary || '';
    const content = article.content;
    const keywords = article.seo?.keywords || [];

    return {
      overall: 85,
      title: title.length >= 30 && title.length <= 60 ? 100 : 70,
      description: description.length >= 120 && description.length <= 160 ? 100 : 75,
      keywords: keywords.length >= 3 ? 100 : 60,
      readability: 80,
      images: content.includes('<img') ? 100 : 50,
    };
  };

  // Get SEO issues
  const getIssues = (): SEOIssue[] => {
    const issues: SEOIssue[] = [];
    const title = article.seo?.title || article.title;
    const description = article.seo?.description || article.summary || '';
    const keywords = article.seo?.keywords || [];
    const content = article.content;

    // Title checks
    if (title.length < 30) {
      issues.push({
        type: 'warning',
        category: 'Title',
        message: 'Title is too short',
        suggestion: 'Aim for 30-60 characters for optimal SEO',
      });
    } else if (title.length > 60) {
      issues.push({
        type: 'warning',
        category: 'Title',
        message: 'Title is too long',
        suggestion: 'Keep title under 60 characters to avoid truncation',
      });
    } else {
      issues.push({
        type: 'success',
        category: 'Title',
        message: 'Title length is optimal',
      });
    }

    // Meta description checks
    if (!description) {
      issues.push({
        type: 'error',
        category: 'Meta Description',
        message: 'Meta description is missing',
        suggestion: 'Add a meta description (120-160 characters)',
      });
    } else if (description.length < 120) {
      issues.push({
        type: 'warning',
        category: 'Meta Description',
        message: 'Meta description is too short',
        suggestion: 'Aim for 120-160 characters',
      });
    } else if (description.length > 160) {
      issues.push({
        type: 'warning',
        category: 'Meta Description',
        message: 'Meta description is too long',
        suggestion: 'Keep under 160 characters to avoid truncation',
      });
    } else {
      issues.push({
        type: 'success',
        category: 'Meta Description',
        message: 'Meta description length is optimal',
      });
    }

    // Keywords checks
    if (keywords.length === 0) {
      issues.push({
        type: 'warning',
        category: 'Keywords',
        message: 'No keywords defined',
        suggestion: 'Add 3-5 relevant keywords',
      });
    } else if (keywords.length < 3) {
      issues.push({
        type: 'warning',
        category: 'Keywords',
        message: 'Too few keywords',
        suggestion: 'Add at least 3 keywords for better SEO',
      });
    } else {
      issues.push({
        type: 'success',
        category: 'Keywords',
        message: `${keywords.length} keywords defined`,
      });
    }

    // Content checks
    const wordCount = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    if (wordCount < 300) {
      issues.push({
        type: 'error',
        category: 'Content',
        message: 'Content is too short',
        suggestion: 'Aim for at least 300 words for better ranking',
      });
    } else {
      issues.push({
        type: 'success',
        category: 'Content',
        message: `${wordCount} words - Good length`,
      });
    }

    // Image checks
    if (!content.includes('<img')) {
      issues.push({
        type: 'warning',
        category: 'Images',
        message: 'No images found',
        suggestion: 'Add relevant images to improve engagement',
      });
    } else {
      const imgCount = (content.match(/<img/g) || []).length;
      issues.push({
        type: 'success',
        category: 'Images',
        message: `${imgCount} image(s) found`,
      });
    }

    // Headings check
    if (!content.includes('<h1') && !content.includes('<h2')) {
      issues.push({
        type: 'warning',
        category: 'Headings',
        message: 'No headings found',
        suggestion: 'Use H1, H2 tags for better structure',
      });
    } else {
      issues.push({
        type: 'success',
        category: 'Headings',
        message: 'Headings are properly used',
      });
    }

    return issues;
  };

  const scores = calculateScores();
  const issues = getIssues();

  // Get score color
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  // Get issue icon
  const getIssueIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  // Google preview
  const GooglePreview = () => {
    const title = article.seo?.title || article.title;
    const description = article.seo?.description || article.summary || '';
    const url = `example.com/articles/${article.slug || 'article'}`;

    return (
      <div className="border-2 border-gray-300 dark:border-gray-600 rounded-lg p-4 bg-white dark:bg-gray-900">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm">
            <Globe className="w-4 h-4 text-gray-500" />
            <span className="text-green-700 dark:text-green-400">{url}</span>
          </div>
          <h3 className="text-xl text-blue-600 dark:text-blue-400 hover:underline cursor-pointer line-clamp-1">
            {title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
            {description}
          </p>
        </div>
      </div>
    );
  };

  // Keyword suggestions
  const keywordSuggestions = [
    { keyword: 'React', volume: '45K', difficulty: 'Medium', trend: 'up' },
    { keyword: 'TypeScript', volume: '32K', difficulty: 'Medium', trend: 'up' },
    { keyword: 'Hooks', volume: '28K', difficulty: 'Low', trend: 'stable' },
    { keyword: 'JavaScript', volume: '89K', difficulty: 'High', trend: 'up' },
  ];

  return (
    <div className="space-y-6">
      {/* SEO Score Overview */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold mb-1">SEO Score</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Overall optimization score
            </p>
          </div>
          <div className="text-center">
            <div className={`text-5xl font-bold ${getScoreColor(scores.overall)}`}>
              {scores.overall}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">/ 100</div>
          </div>
        </div>

        {/* Score Breakdown */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { label: 'Title', score: scores.title, icon: FileText },
            { label: 'Description', score: scores.description, icon: Eye },
            { label: 'Keywords', score: scores.keywords, icon: Hash },
            { label: 'Readability', score: scores.readability, icon: TrendingUp },
            { label: 'Images', score: scores.images, icon: ImageIcon },
            { label: 'Links', score: 90, icon: LinkIcon },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="bg-white dark:bg-gray-800 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Icon className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">{item.label}</span>
                </div>
                <div className={`text-2xl font-bold ${getScoreColor(item.score)}`}>
                  {item.score}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          {[
            { id: 'analysis', label: 'Analysis', icon: Search },
            { id: 'preview', label: 'Preview', icon: Eye },
            { id: 'keywords', label: 'Keywords', icon: Hash },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-b-2 border-blue-600'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="p-6">
          {/* Analysis Tab */}
          {activeTab === 'analysis' && (
            <div className="space-y-3">
              {issues.map((issue, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-l-4 ${
                    issue.type === 'success'
                      ? 'bg-green-50 dark:bg-green-900/20 border-green-500'
                      : issue.type === 'warning'
                      ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500'
                      : 'bg-red-50 dark:bg-red-900/20 border-red-500'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {getIssueIcon(issue.type)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                          {issue.category}
                        </span>
                      </div>
                      <p className="font-medium mb-1">{issue.message}</p>
                      {issue.suggestion && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          💡 {issue.suggestion}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Preview Tab */}
          {activeTab === 'preview' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Google Search Preview</h3>
                <GooglePreview />
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Social Media Preview</h3>
                <div className="border-2 border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                  <div className="aspect-video bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                    <ImageIcon className="w-16 h-16 text-white opacity-50" />
                  </div>
                  <div className="p-4 bg-white dark:bg-gray-900">
                    <h4 className="font-semibold mb-1 line-clamp-1">
                      {article.seo?.title || article.title}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
                      {article.seo?.description || article.summary}
                    </p>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      example.com
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Keywords Tab */}
          {activeTab === 'keywords' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Current Keywords</h3>
                <div className="flex flex-wrap gap-2">
                  {article.seo?.keywords && article.seo.keywords.length > 0 ? (
                    article.seo.keywords.map((keyword, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm font-medium"
                      >
                        #{keyword}
                      </span>
                    ))
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400">No keywords added yet</p>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Suggested Keywords</h3>
                <div className="space-y-2">
                  {keywordSuggestions.map((kw, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Hash className="w-4 h-4 text-gray-400" />
                        <span className="font-medium">{kw.keyword}</span>
                        <span className={`text-xs px-2 py-0.5 rounded ${
                          kw.difficulty === 'Low' ? 'bg-green-100 text-green-600' :
                          kw.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-600' :
                          'bg-red-100 text-red-600'
                        }`}>
                          {kw.difficulty}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {kw.volume} searches/mo
                        </span>
                        {kw.trend === 'up' && <TrendingUp className="w-4 h-4 text-green-500" />}
                        <button className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors">
                          Add
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold mb-4">Quick SEO Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <button className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <Zap className="w-5 h-5 text-blue-600" />
            <div className="text-left">
              <div className="font-medium">Auto-optimize</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                Apply AI suggestions
              </div>
            </div>
          </button>
          <button className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <FileText className="w-5 h-5 text-purple-600" />
            <div className="text-left">
              <div className="font-medium">Generate sitemap</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                Update XML sitemap
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
