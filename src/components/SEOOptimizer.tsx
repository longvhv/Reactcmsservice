import { useState } from 'react';
import { 
  Search, TrendingUp, Globe, Link2, Image, FileText,
  AlertCircle, CheckCircle2, XCircle, Target, Zap,
  BarChart3, Eye, Edit3, Copy, ExternalLink, Hash,
  MessageSquare, Clock, Users, ThumbsUp, Lightbulb
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';

interface SEOScore {
  overall: number;
  title: number;
  description: number;
  keywords: number;
  readability: number;
  structure: number;
  performance: number;
}

interface SEOAnalysis {
  title: {
    length: number;
    optimal: boolean;
    suggestion?: string;
  };
  metaDescription: {
    length: number;
    optimal: boolean;
    suggestion?: string;
  };
  keywords: {
    count: number;
    density: number;
    optimal: boolean;
    primary: string[];
    secondary: string[];
  };
  headings: {
    h1: number;
    h2: number;
    h3: number;
    structure: 'good' | 'warning' | 'error';
  };
  images: {
    total: number;
    withAlt: number;
    withoutAlt: number;
    optimization: number;
  };
  links: {
    internal: number;
    external: number;
    broken: number;
  };
  readability: {
    score: number;
    grade: string;
    suggestions: string[];
  };
  content: {
    wordCount: number;
    readingTime: number;
    paragraphs: number;
    sentences: number;
  };
}

interface SEOOptimizerProps {
  articleId: string;
  title: string;
  content: string;
  metaDescription?: string;
  onUpdate?: (field: string, value: string) => void;
}

export function SEOOptimizer({
  articleId,
  title,
  content,
  metaDescription = '',
  onUpdate,
}: SEOOptimizerProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'keywords' | 'suggestions'>('overview');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { t } = useLanguage();

  // Mock SEO Analysis
  const analysis: SEOAnalysis = {
    title: {
      length: title.length,
      optimal: title.length >= 40 && title.length <= 60,
      suggestion: title.length < 40 
        ? 'Tiêu đề quá ngắn. Nên có 40-60 ký tự để tối ưu SEO.'
        : title.length > 60 
        ? 'Tiêu đề quá dài. Google có thể cắt bớt trong kết quả tìm kiếm.'
        : undefined,
    },
    metaDescription: {
      length: metaDescription.length,
      optimal: metaDescription.length >= 120 && metaDescription.length <= 160,
      suggestion: metaDescription.length < 120
        ? 'Meta description quá ngắn. Nên có 120-160 ký tự.'
        : metaDescription.length > 160
        ? 'Meta description quá dài. Google sẽ cắt bớt trong search results.'
        : undefined,
    },
    keywords: {
      count: 5,
      density: 2.3,
      optimal: true,
      primary: ['React', 'Hooks', 'Tutorial'],
      secondary: ['JavaScript', 'Web Development', 'Frontend'],
    },
    headings: {
      h1: 1,
      h2: 4,
      h3: 8,
      structure: 'good',
    },
    images: {
      total: 6,
      withAlt: 5,
      withoutAlt: 1,
      optimization: 83,
    },
    links: {
      internal: 8,
      external: 3,
      broken: 0,
    },
    readability: {
      score: 72,
      grade: 'Good',
      suggestions: [
        'Một số đoạn văn hơi dài. Nên chia nhỏ để dễ đọc hơn.',
        'Sử dụng thêm bullet points để tăng tính dễ đọc.',
      ],
    },
    content: {
      wordCount: 1250,
      readingTime: 5,
      paragraphs: 18,
      sentences: 65,
    },
  };

  // Calculate overall score
  const calculateScore = (): SEOScore => {
    const titleScore = analysis.title.optimal ? 100 : 60;
    const descScore = analysis.metaDescription.optimal ? 100 : 50;
    const keywordScore = analysis.keywords.optimal ? 100 : 70;
    const readabilityScore = analysis.readability.score;
    const structureScore = analysis.headings.structure === 'good' ? 100 : 70;
    const performanceScore = analysis.images.optimization;

    return {
      overall: Math.round((titleScore + descScore + keywordScore + readabilityScore + structureScore + performanceScore) / 6),
      title: titleScore,
      description: descScore,
      keywords: keywordScore,
      readability: readabilityScore,
      structure: structureScore,
      performance: performanceScore,
    };
  };

  const scores = calculateScore();

  const getScoreColor = (score: number) => {
    if (score >= 80) return { bg: 'bg-green-500/10', text: 'text-green-600', border: 'border-green-500/20' };
    if (score >= 60) return { bg: 'bg-yellow-500/10', text: 'text-yellow-600', border: 'border-yellow-500/20' };
    return { bg: 'bg-red-500/10', text: 'text-red-600', border: 'border-red-500/20' };
  };

  const getScoreGrade = (score: number) => {
    if (score >= 90) return 'Xuất sắc';
    if (score >= 80) return 'Tốt';
    return 'Cần cải thiện';
  };

  const suggestions = [
    {
      type: 'warning',
      title: 'Độ dài tiêu đề',
      description: analysis.title.suggestion || 'Độ dài tiêu đề đã tối ưu',
      priority: analysis.title.optimal ? 'low' : 'high',
      action: 'Sửa tiêu đề',
    },
    {
      type: analysis.metaDescription.optimal ? 'success' : 'warning',
      title: 'Mô tả Meta',
      description: analysis.metaDescription.suggestion || 'Mô tả Meta đã tối ưu',
      priority: analysis.metaDescription.optimal ? 'low' : 'high',
      action: 'Sửa mô tả',
    },
    {
      type: 'warning',
      title: 'Alt text hình ảnh',
      description: `${analysis.images.withoutAlt} hình ảnh thiếu alt text`,
      priority: 'medium',
      action: 'Thêm Alt Text',
    },
    {
      type: 'info',
      title: 'Liên kết nội bộ',
      description: 'Thêm liên kết nội bộ để cải thiện SEO',
      priority: 'medium',
      action: 'Thêm liên kết',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20">
            <Search className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h2 className="text-2xl mb-1">Tối ưu SEO</h2>
            <p className="text-sm text-muted-foreground">
              Tối ưu hóa nội dung cho công cụ tìm kiếm
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsAnalyzing(true)}
          disabled={isAnalyzing}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg shadow-green-500/30 disabled:opacity-50"
        >
          {isAnalyzing ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Đang phân tích...
            </>
          ) : (
            <>
              <Zap className="w-4 h-4" />
              Phân tích lại
            </>
          )}
        </button>
      </div>

      {/* Overall Score */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg mb-1">Điểm SEO tổng thể</h3>
            <p className="text-sm text-muted-foreground">
              {getScoreGrade(scores.overall)}
            </p>
          </div>
          <div className="text-center">
            <div className={`text-5xl font-bold ${getScoreColor(scores.overall).text}`}>
              {scores.overall}
            </div>
            <div className="text-sm text-muted-foreground mt-1">/ 100</div>
          </div>
        </div>

        {/* Score Breakdown */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Tiêu đề', score: scores.title, icon: FileText },
            { label: 'Mô tả', score: scores.description, icon: MessageSquare },
            { label: 'Từ khóa', score: scores.keywords, icon: Hash },
            { label: 'Khả năng đọc', score: scores.readability, icon: Eye },
            { label: 'Cấu trúc', score: scores.structure, icon: BarChart3 },
            { label: 'Hiệu suất', score: scores.performance, icon: TrendingUp },
          ].map((item) => {
            const Icon = item.icon;
            const color = getScoreColor(item.score);
            return (
              <div
                key={item.label}
                className={`p-4 rounded-xl border ${color.bg} ${color.border}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Icon className={`w-4 h-4 ${color.text}`} />
                  <span className={`text-lg font-semibold ${color.text}`}>
                    {item.score}
                  </span>
                </div>
                <div className="text-sm font-medium">{item.label}</div>
                <div className="h-2 bg-muted/30 rounded-full mt-2 overflow-hidden">
                  <div
                    className={`h-full ${color.text.replace('text-', 'bg-')} transition-all duration-500`}
                    style={{ width: `${item.score}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2">
        {[
          { key: 'overview', label: 'Tổng quan', icon: BarChart3 },
          { key: 'keywords', label: 'Từ khóa', icon: Hash },
          { key: 'suggestions', label: 'Gợi ý', icon: Lightbulb },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-xl transition-all
                ${activeTab === tab.key
                  ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg'
                  : 'bg-muted/40 hover:bg-muted/60'
                }
              `}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Title & Description */}
            <div className="glass-card p-6">
              <h3 className="text-lg mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Tiêu đề & Mô tả Meta
              </h3>

              <div className="space-y-4">
                {/* Title */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium">Tiêu đề SEO</label>
                    <div className={`
                      text-xs px-2 py-1 rounded
                      ${analysis.title.optimal 
                        ? 'bg-green-500/10 text-green-600' 
                        : 'bg-yellow-500/10 text-yellow-600'
                      }
                    `}>
                      {analysis.title.length} / 60 ký tự
                    </div>
                  </div>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => onUpdate?.('title', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-background/50 border border-border/40 focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20 transition-all outline-none"
                  />
                  {analysis.title.suggestion && (
                    <p className="text-sm text-yellow-600 mt-2 flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>{analysis.title.suggestion}</span>
                    </p>
                  )}
                </div>

                {/* Meta Description */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium">Mô tả Meta</label>
                    <div className={`
                      text-xs px-2 py-1 rounded
                      ${analysis.metaDescription.optimal 
                        ? 'bg-green-500/10 text-green-600' 
                        : 'bg-yellow-500/10 text-yellow-600'
                      }
                    `}>
                      {analysis.metaDescription.length} / 160 ký tự
                    </div>
                  </div>
                  <textarea
                    value={metaDescription}
                    onChange={(e) => onUpdate?.('metaDescription', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl bg-background/50 border border-border/40 focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20 transition-all outline-none resize-none"
                  />
                  {analysis.metaDescription.suggestion && (
                    <p className="text-sm text-yellow-600 mt-2 flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>{analysis.metaDescription.suggestion}</span>
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Content Analysis */}
            <div className="grid grid-cols-2 gap-6">
              {/* Structure */}
              <div className="glass-card p-6">
                <h3 className="text-lg mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Cấu trúc nội dung
                </h3>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <span className="text-sm">Tiêu đề H1</span>
                    <span className={`font-semibold ${analysis.headings.h1 === 1 ? 'text-green-600' : 'text-red-600'}`}>
                      {analysis.headings.h1}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <span className="text-sm">Tiêu đề H2</span>
                    <span className="font-semibold">{analysis.headings.h2}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <span className="text-sm">Tiêu đề H3</span>
                    <span className="font-semibold">{analysis.headings.h3}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <span className="text-sm">Đoạn văn</span>
                    <span className="font-semibold">{analysis.content.paragraphs}</span>
                  </div>
                </div>
              </div>

              {/* Links & Images */}
              <div className="glass-card p-6">
                <h3 className="text-lg mb-4 flex items-center gap-2">
                  <Link2 className="w-5 h-5" />
                  Liên kết & Media
                </h3>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <span className="text-sm">Liên kết nội bộ</span>
                    <span className="font-semibold text-blue-600">{analysis.links.internal}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <span className="text-sm">Liên kết ngoài</span>
                    <span className="font-semibold text-purple-600">{analysis.links.external}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <span className="text-sm">Hình ảnh</span>
                    <span className="font-semibold">{analysis.images.total}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <span className="text-sm">Ảnh có Alt</span>
                    <span className={`font-semibold ${analysis.images.withoutAlt === 0 ? 'text-green-600' : 'text-yellow-600'}`}>
                      {analysis.images.withAlt} / {analysis.images.total}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Readability */}
            <div className="glass-card p-6">
              <h3 className="text-lg mb-4 flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Phân tích khả năng đọc
              </h3>

              <div className="grid grid-cols-4 gap-4 mb-4">
                <div className="p-4 rounded-xl bg-muted/30 text-center">
                  <div className="text-2xl font-semibold mb-1">{analysis.content.wordCount}</div>
                  <div className="text-xs text-muted-foreground">Từ</div>
                </div>
                <div className="p-4 rounded-xl bg-muted/30 text-center">
                  <div className="text-2xl font-semibold mb-1">{analysis.content.readingTime}</div>
                  <div className="text-xs text-muted-foreground">Phút đọc</div>
                </div>
                <div className="p-4 rounded-xl bg-muted/30 text-center">
                  <div className="text-2xl font-semibold mb-1">{analysis.content.sentences}</div>
                  <div className="text-xs text-muted-foreground">Câu</div>
                </div>
                <div className="p-4 rounded-xl bg-muted/30 text-center">
                  <div className="text-2xl font-semibold mb-1">{analysis.readability.grade}</div>
                  <div className="text-xs text-muted-foreground">Xếp hạng</div>
                </div>
              </div>

              {analysis.readability.suggestions.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Gợi ý cải thiện:</h4>
                  {analysis.readability.suggestions.map((suggestion, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Lightbulb className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                      <span>{suggestion}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {activeTab === 'keywords' && (
          <motion.div
            key="keywords"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass-card p-6"
          >
            <h3 className="text-lg mb-4 flex items-center gap-2">
              <Hash className="w-5 h-5" />
              Phân tích Từ khóa
            </h3>

            <div className="space-y-6">
              {/* Primary Keywords */}
              <div>
                <h4 className="text-sm font-medium mb-3">Từ khóa chính</h4>
                <div className="flex flex-wrap gap-2">
                  {analysis.keywords.primary.map((keyword) => (
                    <span
                      key={keyword}
                      className="px-3 py-1.5 rounded-lg bg-green-500/10 text-green-600 border border-green-500/20 text-sm font-medium"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>

              {/* Secondary Keywords */}
              <div>
                <h4 className="text-sm font-medium mb-3">Từ khóa phụ</h4>
                <div className="flex flex-wrap gap-2">
                  {analysis.keywords.secondary.map((keyword) => (
                    <span
                      key={keyword}
                      className="px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-600 border border-blue-500/20 text-sm"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>

              {/* Keyword Density */}
              <div className="p-4 rounded-xl bg-muted/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Mật độ từ khóa</span>
                  <span className="text-lg font-semibold text-green-600">
                    {analysis.keywords.density}%
                  </span>
                </div>
                <div className="h-2 bg-muted/50 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-600 to-emerald-600 transition-all duration-500"
                    style={{ width: `${(analysis.keywords.density / 5) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Tối ưu: 1-3% • Hiện tại: {analysis.keywords.density}%
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'suggestions' && (
          <motion.div
            key="suggestions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-3"
          >
            {suggestions.map((suggestion, idx) => {
              const getIcon = () => {
                switch (suggestion.type) {
                  case 'success': return <CheckCircle2 className="w-5 h-5 text-green-600" />;
                  case 'warning': return <AlertCircle className="w-5 h-5 text-yellow-600" />;
                  case 'error': return <XCircle className="w-5 h-5 text-red-600" />;
                  default: return <Lightbulb className="w-5 h-5 text-blue-600" />;
                }
              };

              const getPriorityColor = () => {
                switch (suggestion.priority) {
                  case 'high': return 'border-l-red-500';
                  case 'medium': return 'border-l-yellow-500';
                  default: return 'border-l-blue-500';
                }
              };

              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`glass-card p-4 border-l-4 ${getPriorityColor()}`}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 mt-1">
                      {getIcon()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium mb-1">{suggestion.title}</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        {suggestion.description}
                      </p>
                      <button className="text-sm text-green-600 hover:text-green-700 font-medium transition-colors">
                        {suggestion.action} →
                      </button>
                    </div>
                    <span className={`
                      px-2 py-1 rounded text-xs font-medium flex-shrink-0
                      ${suggestion.priority === 'high' ? 'bg-red-500/10 text-red-600' : ''}
                      ${suggestion.priority === 'medium' ? 'bg-yellow-500/10 text-yellow-600' : ''}
                      ${suggestion.priority === 'low' ? 'bg-blue-500/10 text-blue-600' : ''}
                    `}>
                      {suggestion.priority === 'high' ? 'Cao' : suggestion.priority === 'medium' ? 'Trung bình' : 'Thấp'}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}