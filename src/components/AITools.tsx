import React, { useState } from 'react';
import { 
  Wand2, Languages, CheckCircle, Sparkles, FileText, Zap, Brain, 
  Image as ImageIcon, Tag, TrendingUp, Eye, Copy, ArrowRight, 
  AlertCircle, Loader2, X, Download, RefreshCw, Settings, MessageSquare,
  History, Star, Plus, Trash2, Save, BookmarkPlus, ChevronDown, BarChart2,
  Sliders, Type, Target, Palette, Volume2, Clock, Award
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
}

interface HistoryItem {
  id: string;
  toolId: string;
  toolName: string;
  input: string;
  output: string;
  timestamp: Date;
  isFavorite?: boolean;
  settings?: any;
}

interface Template {
  id: string;
  name: string;
  toolId: string;
  content: string;
  description: string;
}

export function AITools({ onNavigate }: AIToolsProps) {
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  // Translation settings
  const [targetLanguage, setTargetLanguage] = useState('en');
  const [translationTone, setTranslationTone] = useState('neutral');
  const [formalityLevel, setFormalityLevel] = useState('medium');
  
  // SEO settings
  const [seoKeywords, setSeoKeywords] = useState('');
  const [targetAudience, setTargetAudience] = useState('general');
  const [contentType, setContentType] = useState('article');
  
  // Content generation settings
  const [contentTone, setContentTone] = useState('professional');
  const [contentLength, setContentLength] = useState('medium');
  const [creativityLevel, setCreativityLevel] = useState(50);
  
  // Grammar settings
  const [grammarLevel, setGrammarLevel] = useState('standard');
  const [dialectPreference, setDialectPreference] = useState('american');
  
  // Summary settings
  const [summaryLength, setSummaryLength] = useState('medium');
  const [summaryStyle, setSummaryStyle] = useState('bullet');
  
  // Title generation settings
  const [titleCount, setTitleCount] = useState(5);
  const [titleStyle, setTitleStyle] = useState('engaging');
  
  const [showHistory, setShowHistory] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([
    {
      id: '1',
      toolId: 'translate',
      toolName: 'Dịch tự động',
      input: 'Hello world',
      output: 'Xin chào thế giới',
      timestamp: new Date(Date.now() - 3600000),
    },
    {
      id: '2',
      toolId: 'seo',
      toolName: 'Tối ưu SEO',
      input: 'AI tools for content',
      output: 'SEO optimized content...',
      timestamp: new Date(Date.now() - 7200000),
      isFavorite: true,
    },
  ]);
  const [templates, setTemplates] = useState<Template[]>([
    {
      id: '1',
      name: 'Press Release Template',
      toolId: 'content-ideas',
      content: 'Company announces new product launch...',
      description: 'Mẫu thông cáo báo chí chuẩn',
    },
    {
      id: '2',
      name: 'SEO Article Structure',
      toolId: 'seo',
      content: 'H1: Main keyword...\nH2: Related topics...',
      description: 'Cấu trúc bài viết SEO chuẩn',
    },
  ]);

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
    },
  ];

  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
    { code: 'ko', name: '한국어', flag: '🇰🇷' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'pt', name: 'Português', flag: '🇵🇹' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    { code: 'th', name: 'ไทย', flag: '🇹🇭' },
  ];

  const handleProcessAI = async (toolId: string) => {
    setIsProcessing(true);
    setOutputText('');

    // Simulate AI processing with realistic delay
    await new Promise(resolve => setTimeout(resolve, 2500));

    let result = '';
    const wordCount = inputText.split(' ').filter(w => w).length;
    
    switch (toolId) {
      case 'translate':
        const langName = languages.find(l => l.code === targetLanguage)?.name || 'English';
        result = `🌐 Bản dịch sang ${langName}\n\n`;
        result += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
        result += `📝 Văn bản gốc:\n${inputText}\n\n`;
        result += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
        result += `✨ Bản dịch (${translationTone} tone, ${formalityLevel} formality):\n`;
        result += `[AI would translate the text here with the specified tone and formality level]\n\n`;
        result += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
        result += `📊 Thống kê:\n`;
        result += `• Độ chính xác dự kiến: 95%\n`;
        result += `• Từ đã dịch: ${wordCount}\n`;
        result += `• Thời gian xử lý: 2.3s\n`;
        result += `• Model: GPT-4 Turbo\n\n`;
        result += `💡 Gợi ý:\n`;
        result += `• Bản dịch có thể cần điều chỉnh theo văn hóa địa phương\n`;
        result += `• Xem xét context cụ thể khi sử dụng\n`;
        result += `• Kiểm tra lại các thuật ngữ chuyên ngành`;
        break;

      case 'grammar':
        const errors = Math.floor(Math.random() * 5) + 1;
        result = `✅ Kết quả kiểm tra Ngữ pháp & Chính tả\n\n`;
        result += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
        result += `📝 Văn bản đã kiểm tra:\n${inputText}\n\n`;
        result += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
        result += `📊 Tổng quan:\n`;
        result += `• Tổng số lỗi: ${errors}\n`;
        result += `• Điểm ngữ pháp: ${95 - errors * 5}/100\n`;
        result += `• Độ phức tạp: ${grammarLevel}\n`;
        result += `• Dialect: ${dialectPreference}\n\n`;
        result += `🔍 Chi tiết lỗi:\n\n`;
        result += `1. Dấu câu (Line 1, Col 45)\n`;
        result += `   Hiện tại: "Hello world"\n`;
        result += `   Gợi ý: "Hello, world!"\n`;
        result += `   Lý do: Thiếu dấu phẩy trong lời chào và dấu chấm than\n\n`;
        result += `2. Viết hoa (Line 2, Col 12)\n`;
        result += `   Hiện tại: "ai technology"\n`;
        result += `   Gợi ý: "AI technology"\n`;
        result += `   Lý do: Viết tắt AI nên viết hoa\n\n`;
        result += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
        result += `💡 Gợi ý cải thiện:\n`;
        result += `• Sử dụng câu ngắn hơn để tăng tính rõ ràng\n`;
        result += `• Đa dạng hóa từ vựng: thay "good" bằng "excellent", "outstanding"\n`;
        result += `• Thêm từ nối để văn bản trơn tru hơn\n`;
        result += `• Cân nhắc chia nhỏ đoạn văn dài`;
        break;

      case 'seo':
        const seoScore = Math.floor(Math.random() * 20) + 75;
        result = `🎯 Phân tích & Tối ưu SEO\n\n`;
        result += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
        result += `📊 SEO Score: ${seoScore}/100\n`;
        result += `Target Audience: ${targetAudience}\n`;
        result += `Content Type: ${contentType}\n`;
        result += `Keywords: ${seoKeywords || 'Not specified'}\n\n`;
        result += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
        result += `📝 Nội dung đã tối ưu:\n\n`;
        result += `${inputText}\n\n`;
        result += `[AI would add optimized content with proper keyword placement]\n\n`;
        result += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
        result += `✅ Điểm mạnh:\n`;
        result += `• ✓ Mật độ từ khóa: 2.3% (Optimal: 1-3%)\n`;
        result += `• ✓ Cấu trúc heading rõ ràng\n`;
        result += `• ✓ Độ dài nội dung phù hợp (${wordCount} words)\n`;
        result += `• ✓ Readability score: Good\n`;
        result += `• ✓ Meta description có sẵn\n\n`;
        result += `⚠️ Cần cải thiện:\n`;
        result += `• ⚡ Thêm 2-3 internal links\n`;
        result += `• ⚡ Bổ sung LSI keywords: [AI, machine learning, automation]\n`;
        result += `• ⚡ Tối ưu hóa image alt text\n`;
        result += `• ⚡ Thêm FAQ section cho featured snippets\n`;
        result += `• ⚡ Cải thiện URL structure\n\n`;
        result += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
        result += `🔍 Phân tích từ khóa:\n`;
        result += `Primary Keyword: "${seoKeywords || 'AI Tools'}"\n`;
        result += `• Frequency: 8 times\n`;
        result += `• Placement: Title ✓, H1 ✓, First paragraph ✓\n`;
        result += `• Prominence: 95%\n\n`;
        result += `LSI Keywords detected:\n`;
        result += `• "artificial intelligence" (4x)\n`;
        result += `• "content creation" (3x)\n`;
        result += `• "automation" (2x)\n\n`;
        result += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
        result += `📈 Dự đoán hiệu suất:\n`;
        result += `• Khả năng rank: High (85%)\n`;
        result += `• Competition level: Medium\n`;
        result += `• Est. organic traffic: 500-800/month\n`;
        result += `• Click-through rate: 3.2%\n\n`;
        result += `💡 Khuyến nghị:\n`;
        result += `• Publish vào thứ 3 hoặc thứ 4 để tối ưu engagement\n`;
        result += `• Tạo content cluster liên quan\n`;
        result += `• Build backlinks từ domain authority cao`;
        break;

      case 'summarize':
        const targetWords = summaryLength === 'short' ? 50 : summaryLength === 'medium' ? 100 : 150;
        result = `📝 Tóm tắt nội dung (${summaryLength})\n\n`;
        result += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
        if (summaryStyle === 'bullet') {
          result += `📌 Tóm tắt theo bullet points:\n\n`;
          result += `🎯 Ý chính:\n`;
          result += `• ${inputText.split('.')[0] || inputText.slice(0, 100)}\n`;
          result += `• [AI would extract key point 2]\n`;
          result += `• [AI would extract key point 3]\n\n`;
          result += `💡 Chi tiết quan trọng:\n`;
          result += `• Concept 1: [Description]\n`;
          result += `• Concept 2: [Description]\n`;
          result += `• Concept 3: [Description]\n\n`;
          result += `🎯 Kết luận:\n`;
          result += `• [Main takeaway from the content]\n`;
        } else {
          result += `📄 Tóm tắt dạng đoạn văn:\n\n`;
          result += `${inputText.split(' ').slice(0, 30).join(' ')}... [AI would generate a coherent summary here]\n\n`;
        }
        result += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
        result += `📊 Thống kê:\n`;
        result += `• Văn bản gốc: ${wordCount} từ\n`;
        result += `• Tóm tắt: ~${targetWords} từ\n`;
        result += `• Tỷ lệ nén: ${Math.floor((targetWords / wordCount) * 100)}%\n`;
        result += `• Thời gian đọc gốc: ${Math.ceil(wordCount / 200)} phút\n`;
        result += `• Thời gian đọc tóm tắt: ${Math.ceil(targetWords / 200)} phút\n\n`;
        result += `🎯 Độ chính xác:\n`;
        result += `• Giữ nguyên ý chính: 95%\n`;
        result += `• Độ súc tích: High\n`;
        result += `• Readability: Improved`;
        break;

      case 'expand':
        result = `✨ Mở rộng nội dung\n\n`;
        result += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
        result += `📝 Nội dung gốc:\n${inputText}\n\n`;
        result += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
        result += `🚀 Nội dung đã mở rộng:\n\n`;
        result += `${inputText}\n\n`;
        result += `Context và Background:\n`;
        result += `This topic is particularly relevant in today's digital landscape. [AI would expand on the context here, adding relevant background information and establishing the importance of the topic.]\n\n`;
        result += `Detailed Explanation:\n`;
        result += `[AI would provide a comprehensive explanation with multiple paragraphs, examples, and elaboration on key points mentioned in the original text.]\n\n`;
        result += `Real-world Applications:\n`;
        result += `[AI would include practical examples, case studies, and real-world scenarios that demonstrate the concepts discussed.]\n\n`;
        result += `Expert Perspectives:\n`;
        result += `[AI would add insights from industry experts and thought leaders to add credibility and depth.]\n\n`;
        result += `Future Implications:\n`;
        result += `[AI would discuss future trends, predictions, and potential developments related to the topic.]\n\n`;
        result += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
        result += `📊 Expansion Stats:\n`;
        result += `• Original: ${wordCount} words\n`;
        result += `• Expanded: ~${wordCount * 4} words\n`;
        result += `• Sections added: 5\n`;
        result += `• Tone: ${contentTone}\n`;
        result += `• Creativity level: ${creativityLevel}%`;
        break;

      case 'paraphrase':
        result = `🔄 Viết lại nội dung\n\n`;
        result += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
        result += `📝 Văn bản gốc:\n${inputText}\n\n`;
        result += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
        result += `✨ Phiên bản 1 (${contentTone} tone):\n`;
        result += `[AI would rewrite the content with different wording while maintaining the same meaning]\n\n`;
        result += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
        result += `✨ Phiên bản 2 (Alternative style):\n`;
        result += `[AI would provide another variation with a different approach]\n\n`;
        result += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
        result += `✨ Phiên bản 3 (Simplified):\n`;
        result += `[AI would provide a simplified version easier to understand]\n\n`;
        result += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
        result += `📊 So sánh:\n`;
        result += `• Độ tương đồng nghĩa: 95%\n`;
        result += `• Từ vựng thay đổi: 78%\n`;
        result += `• Cấu trúc câu mới: 85%\n`;
        result += `• Plagiarism score: 0%\n`;
        result += `• Readability improvement: +15%`;
        break;

      case 'tags':
        result = `🏷️ Gợi ý Tags cho nội dung\n\n`;
        result += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
        result += `🎯 Tags chính (High relevance):\n`;
        result += `#AI #ArtificialIntelligence #MachineLearning #Technology #Innovation\n\n`;
        result += `📌 Tags phụ (Medium relevance):\n`;
        result += `#ContentCreation #Automation #DigitalTransformation #Tech #Future\n\n`;
        result += `🔍 Long-tail tags:\n`;
        result += `#AIContentTools #ContentAutomation #AIWriting #SmartContent\n\n`;
        result += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
        result += `📊 Phân tích chi tiết:\n\n`;
        result += `Top 10 Tags theo độ liên quan:\n\n`;
        result += `1. #AI - Relevance: 98% | Volume: High | Competition: High\n`;
        result += `2. #Technology - Relevance: 95% | Volume: Very High | Competition: High\n`;
        result += `3. #MachineLearning - Relevance: 92% | Volume: High | Competition: Medium\n`;
        result += `4. #Innovation - Relevance: 88% | Volume: High | Competition: High\n`;
        result += `5. #ContentCreation - Relevance: 85% | Volume: Medium | Competition: Medium\n`;
        result += `6. #Automation - Relevance: 82% | Volume: Medium | Competition: Medium\n`;
        result += `7. #Digital - Relevance: 78% | Volume: Very High | Competition: High\n`;
        result += `8. #Future - Relevance: 75% | Volume: High | Competition: High\n`;
        result += `9. #Tech - Relevance: 72% | Volume: Very High | Competition: High\n`;
        result += `10. #Smart - Relevance: 68% | Volume: Medium | Competition: Low\n\n`;
        result += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
        result += `💡 Khuyến nghị:\n`;
        result += `• Sử dụng 5-7 tags chính cho tối ưu\n`;
        result += `• Mix giữa high-volume và niche tags\n`;
        result += `• Cập nhật tags theo trending topics\n`;
        result += `• Tránh tag spam (quá nhiều tags không liên quan)\n\n`;
        result += `🎯 Hashtag strategy:\n`;
        result += `• Instagram: 20-30 tags\n`;
        result += `• Twitter: 1-2 tags\n`;
        result += `• LinkedIn: 3-5 tags\n`;
        result += `• Facebook: 1-2 tags`;
        break;

      case 'title':
        result = `✨ ${titleCount} Tiêu đề được tạo (${titleStyle} style)\n\n`;
        result += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
        
        const titleVariants = [
          { emoji: '🚀', template: `${inputText.slice(0, 50)}: Complete Guide for 2024`, score: 92 },
          { emoji: '💡', template: `Everything You Need to Know About ${inputText.slice(0, 40)}`, score: 88 },
          { emoji: '🔥', template: `${inputText.slice(0, 45)}: Tips, Tricks & Best Practices`, score: 90 },
          { emoji: '✨', template: `Master ${inputText.slice(0, 40)} in 5 Easy Steps`, score: 85 },
          { emoji: '🎯', template: `The Ultimate ${inputText.slice(0, 35)} Guide: Expert Edition`, score: 87 },
          { emoji: '⚡', template: `${inputText.slice(0, 40)}: Fast Track to Success`, score: 83 },
          { emoji: '📈', template: `Boost Your ${inputText.slice(0, 40)} Game Today`, score: 81 },
          { emoji: '🌟', template: `Discover the Power of ${inputText.slice(0, 40)}`, score: 86 },
        ];

        titleVariants.slice(0, titleCount).forEach((variant, i) => {
          result += `${i + 1}. ${variant.emoji} "${variant.template}"\n`;
          result += `   Score: ${variant.score}/100 | Engagement: ${variant.score > 85 ? 'High' : 'Medium'}\n\n`;
        });

        result += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
        result += `📊 Phân tích tiêu đề:\n\n`;
        result += `Yếu tố tối ưu:\n`;
        result += `• Character length: 50-60 (Optimal)\n`;
        result += `• Power words: ✓ (Complete, Ultimate, Master)\n`;
        result += `• Numbers: ✓ (2024, 5 Easy Steps)\n`;
        result += `• Emotional trigger: ✓ (High engagement potential)\n`;
        result += `• SEO-friendly: ✓ (Contains target keywords)\n\n`;
        result += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
        result += `💡 Best practices:\n`;
        result += `• Giữ tiêu đề dưới 60 ký tự cho SEO\n`;
        result += `• Sử dụng số cụ thể (5 tips, 10 ways)\n`;
        result += `• Thêm năm hiện tại để tăng tính cập nhật\n`;
        result += `• Bao gồm power words: Ultimate, Complete, Essential\n`;
        result += `• A/B test nhiều variants để tìm best performer`;
        break;

      case 'sentiment':
        const positiveScore = Math.floor(Math.random() * 30) + 60;
        const negativeScore = Math.floor(Math.random() * 15) + 5;
        const neutralScore = 100 - positiveScore - negativeScore;
        
        result = `😊 Phân tích cảm xúc & Tone\n\n`;
        result += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
        result += `📊 Tổng quan Sentiment:\n\n`;
        result += `Overall Sentiment: ${positiveScore > 60 ? '😊 Positive' : positiveScore > 40 ? '😐 Neutral' : '😔 Negative'}\n`;
        result += `Confidence Score: ${positiveScore + 10}%\n\n`;
        result += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
        result += `📈 Phân tích chi tiết:\n\n`;
        result += `Positive: ${positiveScore}% ${'█'.repeat(Math.floor(positiveScore / 5))}\n`;
        result += `Neutral:  ${neutralScore}% ${'█'.repeat(Math.floor(neutralScore / 5))}\n`;
        result += `Negative: ${negativeScore}% ${'█'.repeat(Math.floor(negativeScore / 5))}\n\n`;
        result += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
        result += `🎭 Tone Analysis:\n`;
        result += `• Primary tone: Professional, Informative\n`;
        result += `• Secondary tone: Enthusiastic\n`;
        result += `• Writing style: Formal\n`;
        result += `• Objectivity: 75%\n`;
        result += `• Persuasiveness: 68%\n\n`;
        result += `😊 Emotion Breakdown:\n`;
        result += `• Joy: 45%\n`;
        result += `• Trust: 32%\n`;
        result += `• Anticipation: 28%\n`;
        result += `• Surprise: 15%\n`;
        result += `• Fear: 8%\n`;
        result += `• Sadness: 5%\n\n`;
        result += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
        result += `🔍 Từ khóa cảm xúc:\n\n`;
        result += `Positive words: excellent, amazing, wonderful, great, innovative\n`;
        result += `Negative words: difficult, challenging, problem\n`;
        result += `Neutral words: however, therefore, additionally\n\n`;
        result += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
        result += `💡 Recommendations:\n`;
        result += `• Tone phù hợp cho: ${positiveScore > 60 ? 'Marketing, Sales copy' : 'Factual reporting, News'}\n`;
        result += `• Target audience: ${positiveScore > 60 ? 'General public' : 'Professional audience'}\n`;
        result += `• Suggested improvements: Add more ${positiveScore < 50 ? 'positive language' : 'balanced viewpoints'}`;
        break;

      case 'readability':
        const readabilityScore = Math.floor(Math.random() * 30) + 60;
        const gradeLevel = Math.floor(readabilityScore / 10);
        
        result = `📖 Đánh giá độ dễ đọc (Readability)\n\n`;
        result += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
        result += `📊 Overall Score: ${readabilityScore}/100\n`;
        result += `Grade: ${readabilityScore > 80 ? 'Excellent' : readabilityScore > 60 ? 'Good' : 'Needs Improvement'}\n\n`;
        result += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
        result += `📈 Detailed Metrics:\n\n`;
        result += `Flesch Reading Ease: ${readabilityScore + 5}/100\n`;
        result += `• 90-100: Very Easy (5th grade)\n`;
        result += `• 60-70: Standard (8-9th grade) ← Your content\n`;
        result += `• 0-30: Very Difficult (College graduate)\n\n`;
        result += `Flesch-Kincaid Grade: ${gradeLevel}th grade\n`;
        result += `SMOG Index: ${gradeLevel + 1}\n`;
        result += `Coleman-Liau Index: ${gradeLevel}\n`;
        result += `Automated Readability Index: ${gradeLevel}\n\n`;
        result += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
        result += `📝 Text Statistics:\n\n`;
        result += `• Total words: ${wordCount}\n`;
        result += `• Sentences: ${Math.floor(wordCount / 15)}\n`;
        result += `• Paragraphs: ${Math.floor(wordCount / 80)}\n`;
        result += `• Average sentence length: ${Math.floor(wordCount / Math.floor(wordCount / 15))} words\n`;
        result += `• Average word length: 4.8 characters\n`;
        result += `• Complex words: ${Math.floor(wordCount * 0.12)} (12%)\n`;
        result += `• Long sentences (>25 words): ${Math.floor(wordCount / 100)}\n\n`;
        result += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
        result += `✅ Strengths:\n`;
        result += `• Clear sentence structure\n`;
        result += `• Appropriate paragraph length\n`;
        result += `• Good use of transitional phrases\n`;
        result += `• Consistent tone throughout\n\n`;
        result += `⚠️ Areas for Improvement:\n`;
        result += `• Reduce sentence length (aim for 15-20 words)\n`;
        result += `• Replace ${Math.floor(wordCount * 0.08)} complex words with simpler alternatives\n`;
        result += `• Break ${Math.floor(wordCount / 100)} long sentences into shorter ones\n`;
        result += `• Add more subheadings for better scanning\n`;
        result += `• Use bullet points to break up dense text\n\n`;
        result += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
        result += `🎯 Target Audience Fit:\n`;
        result += `• Current level: ${gradeLevel}th grade (${readabilityScore > 70 ? 'General audience' : 'Educated audience'})\n`;
        result += `• Recommended for: ${readabilityScore > 70 ? 'Blog posts, Marketing' : 'Technical docs, Academic'}\n`;
        result += `• Reading time: ${Math.ceil(wordCount / 200)} minutes`;
        break;

      case 'image-caption':
        result = `📸 Tạo Caption & Alt Text cho ảnh\n\n`;
        result += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
        result += `✨ Caption Suggestions:\n\n`;
        result += `1. Engaging Style:\n`;
        result += `   "${inputText} - A stunning visual representation that captures\n`;
        result += `    the essence of modern innovation" 🚀\n\n`;
        result += `2. Professional Style:\n`;
        result += `   "Professional ${inputText} showcase demonstrating\n`;
        result += `    excellence in visual communication"\n\n`;
        result += `3. Creative Style:\n`;
        result += `   "🌟 Discover ${inputText} in this captivating image that\n`;
        result += `    tells a thousand stories"\n\n`;
        result += `4. Minimalist Style:\n`;
        result += `   "${inputText} | Pure elegance"\n\n`;
        result += `5. Social Media Style:\n`;
        result += `   "💡 ${inputText} vibes ✨ #Photography #Design #Creative"\n\n`;
        result += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
        result += `🔍 SEO-Optimized Alt Text:\n\n`;
        result += `Short version:\n`;
        result += `"${inputText} - Professional quality image"\n\n`;
        result += `Detailed version:\n`;
        result += `"High-resolution ${inputText} showcasing modern design principles\n`;
        result += `with emphasis on clarity and visual impact"\n\n`;
        result += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
        result += `📱 Platform-Specific Suggestions:\n\n`;
        result += `Instagram:\n`;
        result += `"${inputText} ✨ Double tap if you agree! 👇\n`;
        result += `#${inputText.replace(/\s+/g, '')} #Design #Creative #Photography"\n\n`;
        result += `Facebook:\n`;
        result += `"Check out this amazing ${inputText}! What do you think? 💭"\n\n`;
        result += `LinkedIn:\n`;
        result += `"Professional ${inputText} that demonstrates the power of\n`;
        result += `visual storytelling in business communication."\n\n`;
        result += `Twitter:\n`;
        result += `"${inputText} 🚀 #Design #Innovation"\n\n`;
        result += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
        result += `💡 Caption Best Practices:\n`;
        result += `• Keep under 150 characters for maximum impact\n`;
        result += `• Include relevant hashtags (3-5 for most platforms)\n`;
        result += `• Add call-to-action when appropriate\n`;
        result += `• Use emojis strategically (1-3 per caption)\n`;
        result += `• Always include descriptive alt text for accessibility`;
        break;

      case 'content-ideas':
        result = `💡 Brainstorm ý tưởng nội dung\n\n`;
        result += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
        result += `🚀 Topic: ${inputText}\n\n`;
        result += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
        result += `📝 Article Ideas:\n\n`;
        result += `1. "Top 10 ${inputText} Trends Shaping 2024"\n`;
        result += `   Format: Listicle | Est. length: 1500 words\n`;
        result += `   Angle: Data-driven analysis with expert quotes\n\n`;
        result += `2. "How to Master ${inputText}: A Complete Beginner's Guide"\n`;
        result += `   Format: Tutorial | Est. length: 2000 words\n`;
        result += `   Angle: Step-by-step walkthrough with screenshots\n\n`;
        result += `3. "Expert Tips for ${inputText} Success"\n`;
        result += `   Format: Interview/Tips | Est. length: 1200 words\n`;
        result += `   Angle: Industry expert perspectives\n\n`;
        result += `4. "${inputText} Case Studies: 5 Real-World Success Stories"\n`;
        result += `   Format: Case study | Est. length: 1800 words\n`;
        result += `   Angle: Practical examples with metrics\n\n`;
        result += `5. "Common ${inputText} Mistakes to Avoid (And How to Fix Them)"\n`;
        result += `   Format: Problem-solution | Est. length: 1400 words\n`;
        result += `   Angle: Troubleshooting guide\n\n`;
        result += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
        result += `🎥 Video Content Ideas:\n\n`;
        result += `1. "${inputText} Explained in 5 Minutes" (Short-form)\n`;
        result += `2. "Day in the Life: Working with ${inputText}" (Vlog)\n`;
        result += `3. "${inputText} Tutorial Series" (Educational)\n`;
        result += `4. "Before vs After: ${inputText} Transformation" (Comparison)\n`;
        result += `5. "${inputText} Q&A with Industry Leaders" (Interview)\n\n`;
        result += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
        result += `📱 Social Media Campaign Ideas:\n\n`;
        result += `1. "#${inputText}Challenge" - User-generated content campaign\n`;
        result += `2. "30 Days of ${inputText}" - Daily tips series\n`;
        result += `3. "${inputText} Myth Busters" - Weekly fact-checking posts\n`;
        result += `4. "Ask Me Anything: ${inputText}" - Community engagement\n`;
        result += `5. "${inputText} Success Stories" - Customer testimonials\n\n`;
        result += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
        result += `🎙️ Podcast Episode Ideas:\n\n`;
        result += `1. "The Future of ${inputText}: Expert Predictions"\n`;
        result += `2. "Behind the Scenes: How ${inputText} Works"\n`;
        result += `3. "${inputText} Success Stories: Interviews"\n`;
        result += `4. "Common ${inputText} Questions Answered"\n`;
        result += `5. "${inputText} Industry News & Updates"\n\n`;
        result += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
        result += `📧 Email Series Ideas:\n\n`;
        result += `1. "${inputText} Starter Kit" - 5-email onboarding series\n`;
        result += `2. "Weekly ${inputText} Tips" - Newsletter series\n`;
        result += `3. "${inputText} Masterclass" - Educational drip campaign\n`;
        result += `4. "${inputText} Updates & News" - Monthly digest\n\n`;
        result += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
        result += `📊 Content Calendar Suggestion:\n\n`;
        result += `Week 1: Introduction & basics (blog post)\n`;
        result += `Week 2: How-to tutorial (video)\n`;
        result += `Week 3: Case study (blog post)\n`;
        result += `Week 4: Expert interview (podcast)\n`;
        result += `Week 5: Roundup & trends (blog post)\n\n`;
        result += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
        result += `🎯 SEO Keywords to Target:\n\n`;
        result += `Primary: "${inputText}"\n`;
        result += `Secondary: "${inputText} guide", "best ${inputText}",\n`;
        result += `"${inputText} tips", "how to ${inputText}"\n`;
        result += `Long-tail: "what is ${inputText} and how does it work",\n`;
        result += `"${inputText} for beginners", "${inputText} best practices 2024"`;
        break;

      default:
        result = 'AI processing completed!';
    }

    setOutputText(result);
    setIsProcessing(false);

    // Add to history
    const tool = aiTools.find(t => t.id === toolId);
    if (tool) {
      const newItem: HistoryItem = {
        id: Date.now().toString(),
        toolId: toolId,
        toolName: tool.name,
        input: inputText,
        output: result,
        timestamp: new Date(),
        settings: {
          targetLanguage,
          translationTone,
          seoKeywords,
          contentTone,
          contentLength,
        }
      };
      setHistory(prev => [newItem, ...prev]);
    }
  };

  const loadFromHistory = (item: HistoryItem) => {
    setSelectedTool(item.toolId);
    setInputText(item.input);
    setOutputText(item.output);
    if (item.settings) {
      setTargetLanguage(item.settings.targetLanguage || 'en');
      setTranslationTone(item.settings.translationTone || 'neutral');
      setSeoKeywords(item.settings.seoKeywords || '');
      setContentTone(item.settings.contentTone || 'professional');
      setContentLength(item.settings.contentLength || 'medium');
    }
    setShowHistory(false);
  };

  const loadTemplate = (template: Template) => {
    setSelectedTool(template.toolId);
    setInputText(template.content);
    setShowTemplates(false);
  };

  const toggleFavorite = (id: string) => {
    setHistory(prev => prev.map(item =>
      item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
    ));
  };

  const deleteHistoryItem = (id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id));
  };

  const categorizedTools = {
    content: aiTools.filter(t => t.category === 'content'),
    translation: aiTools.filter(t => t.category === 'translation'),
    seo: aiTools.filter(t => t.category === 'seo'),
    media: aiTools.filter(t => t.category === 'media'),
    analysis: aiTools.filter(t => t.category === 'analysis'),
  };

  const categoryLabels = {
    content: 'Xử lý nội dung',
    translation: 'Dịch thuật',
    seo: 'SEO & Marketing',
    media: 'Media',
    analysis: 'Phân tích',
  };

  const totalUsage = aiTools.reduce((sum, tool) => sum + (tool.usageCount || 0), 0);

  // Render settings panel based on selected tool
  const renderToolSettings = () => {
    switch (selectedTool) {
      case 'translate':
        return (
          <>
            <div className="mb-4">
              <label className="block text-sm mb-2">Ngôn ngữ đích</label>
              <select
                value={targetLanguage}
                onChange={(e) => setTargetLanguage(e.target.value)}
                className="w-full px-4 py-2.5 bg-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                {languages.map(lang => (
                  <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.name}
                  </option>
                ))}
              </select>
            </div>
            {showAdvanced && (
              <>
                <div className="mb-4">
                  <label className="block text-sm mb-2">Tone</label>
                  <select
                    value={translationTone}
                    onChange={(e) => setTranslationTone(e.target.value)}
                    className="w-full px-4 py-2.5 bg-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="neutral">Neutral</option>
                    <option value="casual">Casual</option>
                    <option value="formal">Formal</option>
                    <option value="friendly">Friendly</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-sm mb-2">Formality Level</label>
                  <select
                    value={formalityLevel}
                    onChange={(e) => setFormalityLevel(e.target.value)}
                    className="w-full px-4 py-2.5 bg-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="low">Low (Very casual)</option>
                    <option value="medium">Medium (Standard)</option>
                    <option value="high">High (Very formal)</option>
                  </select>
                </div>
              </>
            )}
          </>
        );

      case 'seo':
        return (
          <>
            <div className="mb-4">
              <label className="block text-sm mb-2">Từ khóa chính</label>
              <input
                type="text"
                value={seoKeywords}
                onChange={(e) => setSeoKeywords(e.target.value)}
                placeholder="Nhập từ khóa SEO..."
                className="w-full px-4 py-2.5 bg-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
            {showAdvanced && (
              <>
                <div className="mb-4">
                  <label className="block text-sm mb-2">Target Audience</label>
                  <select
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    className="w-full px-4 py-2.5 bg-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="general">General Public</option>
                    <option value="professional">Professionals</option>
                    <option value="technical">Technical/Expert</option>
                    <option value="beginner">Beginners</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-sm mb-2">Content Type</label>
                  <select
                    value={contentType}
                    onChange={(e) => setContentType(e.target.value)}
                    className="w-full px-4 py-2.5 bg-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="article">Article/Blog Post</option>
                    <option value="product">Product Description</option>
                    <option value="landing">Landing Page</option>
                    <option value="news">News/Press Release</option>
                  </select>
                </div>
              </>
            )}
          </>
        );

      case 'grammar':
        return showAdvanced ? (
          <>
            <div className="mb-4">
              <label className="block text-sm mb-2">Grammar Level</label>
              <select
                value={grammarLevel}
                onChange={(e) => setGrammarLevel(e.target.value)}
                className="w-full px-4 py-2.5 bg-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="basic">Basic</option>
                <option value="standard">Standard</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm mb-2">Dialect</label>
              <select
                value={dialectPreference}
                onChange={(e) => setDialectPreference(e.target.value)}
                className="w-full px-4 py-2.5 bg-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="american">American English</option>
                <option value="british">British English</option>
                <option value="australian">Australian English</option>
              </select>
            </div>
          </>
        ) : null;

      case 'summarize':
        return (
          <>
            <div className="mb-4">
              <label className="block text-sm mb-2">Summary Length</label>
              <select
                value={summaryLength}
                onChange={(e) => setSummaryLength(e.target.value)}
                className="w-full px-4 py-2.5 bg-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="short">Short (~50 words)</option>
                <option value="medium">Medium (~100 words)</option>
                <option value="long">Long (~150 words)</option>
              </select>
            </div>
            {showAdvanced && (
              <div className="mb-4">
                <label className="block text-sm mb-2">Style</label>
                <select
                  value={summaryStyle}
                  onChange={(e) => setSummaryStyle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="bullet">Bullet Points</option>
                  <option value="paragraph">Paragraph</option>
                  <option value="executive">Executive Summary</option>
                </select>
              </div>
            )}
          </>
        );

      case 'title':
        return (
          <>
            <div className="mb-4">
              <label className="block text-sm mb-2">Number of Titles: {titleCount}</label>
              <input
                type="range"
                min="3"
                max="10"
                value={titleCount}
                onChange={(e) => setTitleCount(Number(e.target.value))}
                className="w-full"
              />
            </div>
            {showAdvanced && (
              <div className="mb-4">
                <label className="block text-sm mb-2">Style</label>
                <select
                  value={titleStyle}
                  onChange={(e) => setTitleStyle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="engaging">Engaging</option>
                  <option value="professional">Professional</option>
                  <option value="clickbait">Clickbait</option>
                  <option value="seo">SEO-Optimized</option>
                </select>
              </div>
            )}
          </>
        );

      case 'expand':
      case 'paraphrase':
      case 'content-ideas':
        return showAdvanced ? (
          <>
            <div className="mb-4">
              <label className="block text-sm mb-2">Tone</label>
              <select
                value={contentTone}
                onChange={(e) => setContentTone(e.target.value)}
                className="w-full px-4 py-2.5 bg-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="professional">Professional</option>
                <option value="casual">Casual</option>
                <option value="friendly">Friendly</option>
                <option value="academic">Academic</option>
                <option value="creative">Creative</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm mb-2">Creativity Level: {creativityLevel}%</label>
              <input
                type="range"
                min="0"
                max="100"
                value={creativityLevel}
                onChange={(e) => setCreativityLevel(Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>Conservative</span>
                <span>Balanced</span>
                <span>Creative</span>
              </div>
            </div>
          </>
        ) : null;

      default:
        return null;
    }
  };

  return (
    <PageWrapper>
      <PageHeader
        title="AI Tools"
        description="Công cụ AI hỗ trợ tạo và tối ưu nội dung"
        action={
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowStats(!showStats)}
              className={`px-4 py-2.5 rounded-xl border transition-all flex items-center gap-2 ${
                showStats 
                  ? 'bg-blue-500 text-white border-blue-500' 
                  : 'bg-card border-border/60 hover:bg-muted'
              }`}
            >
              <BarChart2 className="w-4 h-4" />
              Thống kê
            </button>
            <button
              onClick={() => setShowTemplates(!showTemplates)}
              className={`px-4 py-2.5 rounded-xl border transition-all flex items-center gap-2 ${
                showTemplates 
                  ? 'bg-purple-500 text-white border-purple-500' 
                  : 'bg-card border-border/60 hover:bg-muted'
              }`}
            >
              <BookmarkPlus className="w-4 h-4" />
              Templates
            </button>
            <button
              onClick={() => setShowHistory(!showHistory)}
              className={`px-4 py-2.5 rounded-xl border transition-all flex items-center gap-2 ${
                showHistory 
                  ? 'bg-green-500 text-white border-green-500' 
                  : 'bg-card border-border/60 hover:bg-muted'
              }`}
            >
              <History className="w-4 h-4" />
              Lịch sử ({history.length})
            </button>
            {selectedTool && (
              <button
                onClick={() => {
                  setSelectedTool(null);
                  setInputText('');
                  setOutputText('');
                  setShowAdvanced(false);
                }}
                className="px-4 py-2.5 bg-card border border-border/60 rounded-xl hover:bg-muted transition-all flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Đóng
              </button>
            )}
          </div>
        }
      />

      {/* Stats Panel */}
      {showStats && (
        <Card className="p-6 mb-6 bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
          <h3 className="font-medium mb-4 flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-blue-600" />
            Thống kê sử dụng
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl p-4">
              <div className="text-2xl font-semibold text-blue-600">{totalUsage}</div>
              <div className="text-sm text-muted-foreground">Tổng lượt dùng</div>
            </div>
            <div className="bg-white rounded-xl p-4">
              <div className="text-2xl font-semibold text-green-600">{history.length}</div>
              <div className="text-sm text-muted-foreground">Lịch sử</div>
            </div>
            <div className="bg-white rounded-xl p-4">
              <div className="text-2xl font-semibold text-purple-600">{templates.length}</div>
              <div className="text-sm text-muted-foreground">Templates</div>
            </div>
            <div className="bg-white rounded-xl p-4">
              <div className="text-2xl font-semibold text-orange-600">{aiTools.length}</div>
              <div className="text-sm text-muted-foreground">Công cụ</div>
            </div>
          </div>
          <div className="space-y-2">
            <h4 className="text-sm font-medium mb-3">Top 5 công cụ được dùng nhiều nhất:</h4>
            {aiTools
              .sort((a, b) => (b.usageCount || 0) - (a.usageCount || 0))
              .slice(0, 5)
              .map((tool, index) => (
                <div key={tool.id} className="flex items-center gap-3 bg-white rounded-lg p-3">
                  <div className="text-lg font-semibold text-muted-foreground w-6">#{index + 1}</div>
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${tool.gradient} flex items-center justify-center`}>
                    <tool.icon className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{tool.name}</div>
                  </div>
                  <div className="font-semibold text-blue-600">{tool.usageCount}</div>
                </div>
              ))}
          </div>
        </Card>
      )}

      {/* Templates Panel */}
      {showTemplates && (
        <Card className="p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium flex items-center gap-2">
              <BookmarkPlus className="w-5 h-5 text-purple-600" />
              Templates có sẵn
            </h3>
            <button className="px-3 py-1.5 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors flex items-center gap-2 text-sm">
              <Plus className="w-4 h-4" />
              Tạo mới
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.map(template => (
              <div
                key={template.id}
                className="bg-secondary rounded-xl p-4 hover:bg-muted transition-all cursor-pointer group"
                onClick={() => loadTemplate(template)}
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-sm">{template.name}</h4>
                  <ArrowRight className="w-4 h-4 text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <p className="text-xs text-muted-foreground mb-3">{template.description}</p>
                <div className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded inline-block">
                  {aiTools.find(t => t.id === template.toolId)?.name}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* History Panel */}
      {showHistory && (
        <Card className="p-6 mb-6">
          <h3 className="font-medium mb-4 flex items-center gap-2">
            <History className="w-5 h-5 text-green-600" />
            Lịch sử xử lý
          </h3>
          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {history.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <History className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Chưa có lịch sử nào</p>
              </div>
            ) : (
              history.map(item => (
                <div
                  key={item.id}
                  className="bg-secondary rounded-xl p-4 hover:bg-muted transition-all group"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-sm">{item.toolName}</h4>
                        {item.isFavorite && (
                          <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {item.timestamp.toLocaleString('vi-VN')}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => toggleFavorite(item.id)}
                        className="p-1.5 hover:bg-background rounded-lg transition-colors"
                        title="Favorite"
                      >
                        <Star className={`w-4 h-4 ${item.isFavorite ? 'text-yellow-500 fill-yellow-500' : 'text-muted-foreground'}`} />
                      </button>
                      <button
                        onClick={() => loadFromHistory(item)}
                        className="p-1.5 hover:bg-background rounded-lg transition-colors"
                        title="Load"
                      >
                        <RefreshCw className="w-4 h-4 text-blue-600" />
                      </button>
                      <button
                        onClick={() => deleteHistoryItem(item.id)}
                        className="p-1.5 hover:bg-background rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </div>
                  <div className="text-sm">
                    <div className="text-xs text-muted-foreground mb-1">Input:</div>
                    <div className="bg-background rounded p-2 text-xs mb-2 line-clamp-2">
                      {item.input}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      )}

      {!selectedTool ? (
        /* Tools Grid */
        <div className="space-y-8">
          {Object.entries(categorizedTools).map(([category, tools]) => (
            tools.length > 0 && (
              <div key={category}>
                <h3 className="text-lg mb-4 flex items-center gap-2">
                  <Wand2 className="w-5 h-5 text-purple-600" />
                  {categoryLabels[category as keyof typeof categoryLabels]}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {tools.map((tool) => {
                    const Icon = tool.icon;
                    return (
                      <Card
                        key={tool.id}
                        className="p-6 hover:shadow-xl transition-all duration-300 cursor-pointer group"
                        onClick={() => setSelectedTool(tool.id)}
                      >
                        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${tool.gradient} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                          <Icon className="w-7 h-7 text-white" />
                        </div>
                        <h4 className="font-medium mb-2">{tool.name}</h4>
                        <p className="text-sm text-muted-foreground mb-4">
                          {tool.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="text-xs text-muted-foreground">
                            {tool.usageCount} lượt dùng
                          </div>
                          <div className="flex items-center gap-2 text-sm text-blue-600 group-hover:gap-3 transition-all">
                            <span>Sử dụng</span>
                            <ArrowRight className="w-4 h-4" />
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )
          ))}
        </div>
      ) : (
        /* AI Tool Interface */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Panel */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                {(() => {
                  const tool = aiTools.find(t => t.id === selectedTool);
                  const Icon = tool?.icon;
                  return (
                    <>
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tool?.gradient} flex items-center justify-center shadow-lg`}>
                        {Icon && <Icon className="w-6 h-6 text-white" />}
                      </div>
                      <div>
                        <h3 className="font-medium">{tool?.name}</h3>
                        <p className="text-sm text-muted-foreground">{tool?.description}</p>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>

            {/* Advanced Settings Toggle */}
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="w-full mb-4 px-4 py-2 bg-secondary rounded-xl hover:bg-muted transition-all flex items-center justify-between"
            >
              <span className="flex items-center gap-2 text-sm">
                <Sliders className="w-4 h-4" />
                Tùy chọn nâng cao
              </span>
              <ChevronDown className={`w-4 h-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
            </button>

            {/* Tool-specific settings */}
            {renderToolSettings()}

            <div className="mb-4">
              <label className="block text-sm mb-2">Nội dung đầu vào</label>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Nhập nội dung cần xử lý..."
                rows={12}
                className="w-full px-4 py-3 bg-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
              />
              <div className="flex items-center justify-between mt-2 text-sm text-muted-foreground">
                <span>{inputText.split(' ').filter(w => w).length} từ</span>
                <span>{inputText.length} ký tự</span>
              </div>
            </div>

            <button
              onClick={() => handleProcessAI(selectedTool)}
              disabled={isProcessing || !inputText.trim()}
              className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-lg hover:shadow-purple-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                <>
                  <Wand2 className="w-5 h-5" />
                  Xử lý với AI
                </>
              )}
            </button>
          </Card>

          {/* Output Panel */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-medium">Kết quả</h3>
              {outputText && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(outputText);
                      alert('Đã copy vào clipboard!');
                    }}
                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                    title="Copy"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      const blob = new Blob([outputText], { type: 'text/plain' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `ai-result-${Date.now()}.txt`;
                      a.click();
                    }}
                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                    title="Download"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                    title="Save to templates"
                  >
                    <Save className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {isProcessing ? (
              <div className="flex flex-col items-center justify-center h-[400px] text-muted-foreground">
                <Loader2 className="w-12 h-12 animate-spin text-purple-600 mb-4" />
                <p>AI đang xử lý nội dung của bạn...</p>
                <p className="text-sm mt-2">Vui lòng đợi trong giây lát</p>
              </div>
            ) : outputText ? (
              <div className="bg-secondary rounded-xl p-4 min-h-[400px] max-h-[600px] overflow-y-auto">
                <pre className="whitespace-pre-wrap text-sm font-mono">{outputText}</pre>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[400px] text-muted-foreground">
                <Brain className="w-12 h-12 mb-4" />
                <p>Kết quả sẽ hiển thị ở đây</p>
                <p className="text-sm mt-2">Nhập nội dung và nhấn "Xử lý với AI"</p>
              </div>
            )}
          </Card>
        </div>
      )}

      {/* Info Banner */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0">
            <AlertCircle className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h4 className="font-medium mb-2">Lưu ý khi sử dụng AI Tools</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Kết quả AI chỉ mang tính chất tham khảo, cần review trước khi sử dụng</li>
              <li>• Một số công cụ có thể yêu cầu API key hoặc credits</li>
              <li>• Thời gian xử lý phụ thuộc vào độ dài nội dung</li>
              <li>• Dữ liệu được xử lý an toàn và không lưu trữ lâu dài</li>
              <li>• Sử dụng History và Templates để làm việc hiệu quả hơn</li>
              <li>• Bật "Tùy chọn nâng cao" để có nhiều options tùy chỉnh hơn</li>
            </ul>
          </div>
        </div>
      </Card>
    </PageWrapper>
  );
}
