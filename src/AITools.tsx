import React, { useState, useEffect } from 'react';
import { 
  Wand2, Languages, CheckCircle, Sparkles, FileText, Zap, Brain, 
  Image as ImageIcon, Tag, TrendingUp, Eye, Copy, ArrowRight, 
  AlertCircle, Loader2, X, Download, RefreshCw, Settings, MessageSquare,
  History, Star, Plus, Trash2, Save, BookmarkPlus, ChevronDown, BarChart2,
  Sliders, Type, Target, Palette, Volume2, Clock, Award, Info, 
  ChevronRight, FileDown, Share2, Code, Maximize2, Minimize2, Lock,
  Unlock, Zap as Lightning, Check, Filter, Search, Grid, List
} from 'lucide-react';
import { PageWrapper } from './PageWrapper';
import { PageHeader } from './PageHeader';
import { Card } from './Card';

interface AIToolsProps {
  onNavigate?: (page: any) => void;
}

interface AITool {
  id: string;
  name: string;
  description: string;
  icon: any;
  color: string;
  gradient: string;
  category: 'content' | 'translation' | 'seo' | 'media' | 'analysis';
  usageCount?: number;
  features?: string[];
}

export function AITools({ onNavigate }: AIToolsProps) {
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const aiTools: AITool[] = [
    {
      id: 'translate',
      name: 'Dịch tự động',
      description: 'Dịch nội dung sang nhiều ngôn ngữ với AI',
      icon: Languages,
      color: 'text-blue-600',
      gradient: 'from-blue-500 to-cyan-500',
      category: 'translation',
      usageCount: 245,
      features: ['12 ngôn ngữ', 'Giữ format', 'Context-aware', 'Glossary support'],
    },
    {
      id: 'grammar',
      name: 'Kiểm tra chính tả & Ngữ pháp',
      description: 'Phát hiện và sửa lỗi ngữ pháp, chính tả',
      icon: CheckCircle,
      color: 'text-green-600',
      gradient: 'from-green-500 to-emerald-500',
      category: 'content',
      usageCount: 189,
      features: ['Auto-fix', 'Style guide', 'Detailed reports', '3 dialects'],
    },
    {
      id: 'seo',
      name: 'Tối ưu SEO',
      description: 'Tối ưu nội dung cho công cụ tìm kiếm',
      icon: TrendingUp,
      color: 'text-purple-600',
      gradient: 'from-purple-500 to-pink-500',
      category: 'seo',
      usageCount: 312,
      features: ['Keyword analysis', 'Meta tags', 'Structured data', 'Competitor analysis'],
    },
    {
      id: 'summarize',
      name: 'Tóm tắt nội dung',
      description: 'Tạo tóm tắt ngắn gọn từ văn bản dài',
      icon: FileText,
      color: 'text-orange-600',
      gradient: 'from-orange-500 to-red-500',
      category: 'content',
      usageCount: 156,
      features: ['3 độ dài', 'Extract keywords', 'Bullet/Paragraph', 'Key quotes'],
    },
    {
      id: 'expand',
      name: 'Mở rộng nội dung',
      description: 'Phát triển ý tưởng và mở rộng văn bản',
      icon: Zap,
      color: 'text-yellow-600',
      gradient: 'from-yellow-500 to-orange-500',
      category: 'content',
      usageCount: 98,
      features: ['Smart expansion', 'Add examples', 'Context building', 'Multi-angle'],
    },
    {
      id: 'paraphrase',
      name: 'Viết lại nội dung',
      description: 'Diễn đạt lại văn bản với cách khác',
      icon: RefreshCw,
      color: 'text-indigo-600',
      gradient: 'from-indigo-500 to-purple-500',
      category: 'content',
      usageCount: 134,
      features: ['3 versions', 'Plagiarism check', 'Tone adjustment', 'Simplification'],
    },
    {
      id: 'tags',
      name: 'Gợi ý Tags',
      description: 'Tự động tạo tags phù hợp cho bài viết',
      icon: Tag,
      color: 'text-pink-600',
      gradient: 'from-pink-500 to-rose-500',
      category: 'seo',
      usageCount: 201,
      features: ['Relevance score', 'Volume data', 'Platform-specific', 'Trending tags'],
    },
    {
      id: 'title',
      name: 'Tạo tiêu đề hấp dẫn',
      description: 'Generate tiêu đề thu hút người đọc',
      icon: Sparkles,
      color: 'text-cyan-600',
      gradient: 'from-cyan-500 to-blue-500',
      category: 'content',
      usageCount: 287,
      features: ['Multiple styles', 'SEO scoring', 'A/B testing', 'Character limit'],
    },
    {
      id: 'sentiment',
      name: 'Phân tích cảm xúc',
      description: 'Đánh giá tone và cảm xúc của nội dung',
      icon: MessageSquare,
      color: 'text-red-600',
      gradient: 'from-red-500 to-pink-500',
      category: 'analysis',
      usageCount: 76,
      features: ['Emotion breakdown', 'Tone detection', 'Audience fit', 'Visualization'],
    },
    {
      id: 'readability',
      name: 'Đánh giá độ dễ đọc',
      description: 'Kiểm tra và cải thiện khả năng đọc',
      icon: Eye,
      color: 'text-teal-600',
      gradient: 'from-teal-500 to-green-500',
      category: 'analysis',
      usageCount: 92,
      features: ['5 metrics', 'Grade level', 'Reading time', 'Improvement tips'],
    },
    {
      id: 'image-caption',
      name: 'Tạo caption ảnh',
      description: 'AI tạo mô tả tự động cho hình ảnh',
      icon: ImageIcon,
      color: 'text-violet-600',
      gradient: 'from-violet-500 to-purple-500',
      category: 'media',
      usageCount: 54,
      features: ['Multiple styles', 'Platform-specific', 'SEO alt text', 'Hashtags'],
    },
    {
      id: 'content-ideas',
      name: 'Gợi ý ý tưởng',
      description: 'Brainstorm ý tưởng nội dung mới',
      icon: Brain,
      color: 'text-fuchsia-600',
      gradient: 'from-fuchsia-500 to-pink-500',
      category: 'content',
      usageCount: 167,
      features: ['Multi-format', 'Content calendar', 'Trend analysis', 'Keyword research'],
    },
  ];

  const handleProcessAI = async (toolId: string) => {
    setIsProcessing(true);
    setOutputText('');

    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    const result = `AI processed result for ${toolId}:\n\n${inputText}\n\n[Simulated AI output would appear here]`;
    setOutputText(result);
    setIsProcessing(false);
  };

  return (
    <PageWrapper>
      <PageHeader
        title="AI Tools"
        description="Công cụ AI hỗ trợ tạo và tối ưu nội dung"
        icon={Wand2}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {aiTools.map((tool) => {
          const Icon = tool.icon;
          return (
            <Card
              key={tool.id}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setSelectedTool(tool.id)}
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-lg bg-gradient-to-br ${tool.gradient}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{tool.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">{tool.description}</p>
                  {tool.features && (
                    <div className="flex flex-wrap gap-1">
                      {tool.features.slice(0, 2).map((feature, idx) => (
                        <span
                          key={idx}
                          className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {selectedTool && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">
                  {aiTools.find(t => t.id === selectedTool)?.name}
                </h2>
                <button
                  onClick={() => setSelectedTool(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Input
                  </label>
                  <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    className="w-full h-32 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your text here..."
                  />
                </div>

                <button
                  onClick={() => handleProcessAI(selectedTool)}
                  disabled={isProcessing || !inputText}
                  className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-5 h-5" />
                      Process with AI
                    </>
                  )}
                </button>

                {outputText && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Output
                    </label>
                    <div className="w-full min-h-32 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50">
                      <pre className="whitespace-pre-wrap text-sm">{outputText}</pre>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </PageWrapper>
  );
}
