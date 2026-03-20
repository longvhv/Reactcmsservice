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
import { useLanguage } from '../contexts/LanguageContext';

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
  const { t } = useLanguage();
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
      name: 'Mẫu thông cáo báo chí',
      toolId: 'content-ideas',
      content: 'Công ty công bố ra mắt sản phẩm mới...',
      description: 'Mẫu thông cáo báo chí chuẩn',
    },
    {
      id: '2',
      name: 'Cấu trúc bài SEO',
      toolId: 'seo',
      content: 'H1: Từ khóa chính...\nH2: Chủ đề liên quan...',
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
      description: 'Tạo tiêu đề thu hút người đọc',
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
        result += `✨ Bản dịch (Giọng ${translationTone}, Mức trang trọng ${formalityLevel}):\n`;
        result += `[AI sẽ dịch văn bản tại đây với giọng điệu và mức trang trọng đã chọn]\n\n`;
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
        result += `• Phương ngữ: ${dialectPreference}\n\n`;
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
        result += `📊 Điểm SEO: ${seoScore}/100\n`;
        result += `Đối tượng mục tiêu: ${targetAudience}\n`;
        result += `Loại nội dung: ${contentType}\n`;
        result += `Từ khóa: ${seoKeywords || 'Chưa chỉ định'}\n\n`;
        result += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
        result += `📝 Nội dung đã tối ưu:\n\n`;
        result += `${inputText}\n\n`;
        result += `[AI sẽ thêm nội dung tối ưu với vị trí từ khóa phù hợp]\n\n`;
        result += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
        result += `✅ Điểm mạnh:\n`;
        result += `• ✓ Mật độ từ khóa: 2.3% (Tối ưu: 1-3%)\n`;
        result += `• ✓ Cấu trúc heading rõ ràng\n`;
        result += `• ✓ Độ dài nội dung phù hợp (${wordCount} từ)\n`;
        result += `• ✓ Điểm dễ đọc: Tốt\n`;
        result += `• ✓ Meta description có sẵn\n\n`;
        result += `⚠️ Cần cải thiện:\n`;
        result += `• ⚡ Thêm 2-3 internal links\n`;
        result += `• ⚡ Bổ sung LSI keywords: [AI, machine learning, automation]\n`;
        result += `• ⚡ Tối ưu hóa alt text cho hình ảnh\n`;
        result += `• ⚡ Thêm phần Câu hỏi thường gặp cho featured snippets\n`;
        result += `• ⚡ Cải thiện cấu trúc URL\n\n`;
        result += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
        result += `🔍 Phân tích từ khóa:\n`;
        result += `Từ khóa chính: "${seoKeywords || 'Công cụ AI'}"\n`;
        result += `• Tần suất: 8 lần\n`;
        result += `• Vị trí: Tiêu đề ✓, H1 ✓, Đoạn đầu ✓\n`;
        result += `• Mức nổi bật: 95%\n\n`;
        result += `Từ khóa LSI phát hiện:\n`;
        result += `• "trí tuệ nhân tạo" (4 lần)\n`;
        result += `• "sáng tạo nội dung" (3 lần)\n`;
        result += `• "tự động hóa" (2 lần)\n\n`;
        result += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
        result += `📈 Dự đoán hiệu suất:\n`;
        result += `• Khả năng xếp hạng: Cao (85%)\n`;
        result += `• Mức cạnh tranh: Trung bình\n`;
        result += `• Lượt truy cập tự nhiên ước tính: 500-800/tháng\n`;
        result += `• Tỷ lệ nhấp: 3.2%\n\n`;
        result += `💡 Khuyến nghị:\n`;
        result += `• Đăng vào thứ 3 hoặc thứ 4 để tối ưu tương tác\n`;
        result += `• Tạo cụm nội dung liên quan\n`;
        result += `• Xây dựng backlinks từ tên miền uy tín cao`;
        break;

      case 'summarize':
        const targetWords = summaryLength === 'short' ? 50 : summaryLength === 'medium' ? 100 : 150;
        result = `📝 Tóm tắt nội dung (${summaryLength})\n\n`;
        result += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
        if (summaryStyle === 'bullet') {
          result += `📌 Tóm tắt theo gạch đầu dòng:\n\n`;
          result += `🎯 Ý chính:\n`;
          result += `• ${inputText.split('.')[0] || inputText.slice(0, 100)}\n`;
          result += `• [AI sẽ trích xuất ý chính 2]\n`;
          result += `• [AI sẽ trích xuất ý chính 3]\n\n`;
          result += `💡 Chi tiết quan trọng:\n`;
          result += `• Khái niệm 1: [Mô tả]\n`;
          result += `• Khái niệm 2: [Mô tả]\n`;
          result += `• Khái niệm 3: [Mô tả]\n\n`;
          result += `🎯 Kết luận:\n`;
          result += `• [Điểm mấu chốt từ nội dung]\n`;
        } else {
          result += `📄 Tóm tắt dạng đoạn văn:\n\n`;
          result += `${inputText.split(' ').slice(0, 30).join(' ')}... [AI sẽ tạo bản tóm tắt mạch lạc tại đây]\n\n`;
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
        result += `• Độ súc tích: Cao\n`;
        result += `• Khả năng đọc: Cải thiện`;
        break;

      case 'expand':
        result = `✨ Mở rộng nội dung\n\n`;
        result += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
        result += `📝 Nội dung gốc:\n${inputText}\n\n`;
        result += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
        result += `🚀 Nội dung đã mở rộng:\n\n`;
        result += `${inputText}\n\n`;
        result += `Bối cảnh và Nền tảng:\n`;
        result += `Chủ đề này đặc biệt phù hợp trong bối cảnh kỹ thuật số ngày nay. [AI sẽ mở rộng bối cảnh, thêm thông tin nền tảng liên quan và xác lập tầm quan trọng của chủ đề.]\n\n`;
        result += `Giải thích chi tiết:\n`;
        result += `[AI sẽ cung cấp giải thích toàn diện với nhiều đoạn văn, ví dụ và phân tích sâu các điểm chính trong nội dung gốc.]\n\n`;
        result += `Ứng dụng thực tế:\n`;
        result += `[AI sẽ bao gồm các ví dụ thực tế, nghiên cứu tình huống và kịch bản thực tế minh họa các khái niệm đã thảo luận.]\n\n`;
        result += `Góc nhìn chuyên gia:\n`;
        result += `[AI sẽ thêm nhận định từ chuyên gia ngành và các nhà tư tưởng để tăng tính uy tín và chiều sâu.]\n\n`;
        result += `Xu hướng tương lai:\n`;
        result += `[AI sẽ thảo luận về xu hướng tương lai, dự đoán và các phát triển tiềm năng liên quan đến chủ đề.]\n\n`;
        result += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
        result += `📊 Thống kê mở rộng:\n`;
        result += `• Gốc: ${wordCount} từ\n`;
        result += `• Mở rộng: ~${wordCount * 4} từ\n`;
        result += `• Phần thêm: 5\n`;
        result += `• Giọng điệu: ${contentTone}\n`;
        result += `• Độ sáng tạo: ${creativityLevel}%`;
        break;

      case 'paraphrase':
        result = `🔄 Viết lại nội dung\n\n`;
        result += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
        result += `📝 Văn bản gốc:\n${inputText}\n\n`;
        result += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
        result += `✨ Phiên bản 1 (Giọng ${contentTone}):\n`;
        result += `[AI sẽ viết lại nội dung với cách diễn đạt khác nhưng vẫn giữ nguyên ý nghĩa]\n\n`;
        result += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
        result += `✨ Phiên bản 2 (Phong cách khác):\n`;
        result += `[AI sẽ cung cấp biến thể khác với cách tiếp cận khác nhau]\n\n`;
        result += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
        result += `✨ Phiên bản 3 (Đơn giản hóa):\n`;
        result += `[AI sẽ cung cấp phiên bản đơn giản dễ hiểu hơn]\n\n`;
        result += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
        result += `📊 So sánh:\n`;
        result += `• Độ tương đồng nghĩa: 95%\n`;
        result += `• Từ vựng thay đổi: 78%\n`;
        result += `• Cấu trúc câu mới: 85%\n`;
        result += `• Điểm đạo văn: 0%\n`;
        result += `• Cải thiện khả năng đọc: +15%`;
        break;

      case 'tags':
        result = `🏷️ Gợi ý Tags cho nội dung\n\n`;
        result += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
        result += `🎯 Tags chính (Độ liên quan cao):\n`;
        result += `#AI #TríTuệNhânTạo #HọcMáy #CôngNghệ #ĐổiMới\n\n`;
        result += `📌 Tags phụ (Độ liên quan trung bình):\n`;
        result += `#SángTạoNộiDung #TựĐộngHóa #ChuyểnĐổiSố #Tech #TươngLai\n\n`;
        result += `🔍 Tags dài (Long-tail):\n`;
        result += `#CôngCụNộiDungAI #TựĐộngNộiDung #AIViếtBài #NộiDungThôngMinh\n\n`;
        result += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
        result += `📊 Phân tích chi tiết:\n\n`;
        result += `Top 10 Tags theo độ liên quan:\n\n`;
        result += `1. #AI - Liên quan: 98% | Lượng tìm: Cao | Cạnh tranh: Cao\n`;
        result += `2. #CôngNghệ - Liên quan: 95% | Lượng tìm: Rất cao | Cạnh tranh: Cao\n`;
        result += `3. #HọcMáy - Liên quan: 92% | Lượng tìm: Cao | Cạnh tranh: TB\n`;
        result += `4. #ĐổiMới - Liên quan: 88% | Lượng tìm: Cao | Cạnh tranh: Cao\n`;
        result += `5. #SángTạoNộiDung - Liên quan: 85% | Lượng tìm: TB | Cạnh tranh: TB\n`;
        result += `6. #TựĐộngHóa - Liên quan: 82% | Lượng tìm: TB | Cạnh tranh: TB\n`;
        result += `7. #KỹThuậtSố - Liên quan: 78% | Lượng tìm: Rất cao | Cạnh tranh: Cao\n`;
        result += `8. #TươngLai - Liên quan: 75% | Lượng tìm: Cao | Cạnh tranh: Cao\n`;
        result += `9. #Tech - Liên quan: 72% | Lượng tìm: Rất cao | Cạnh tranh: Cao\n`;
        result += `10. #ThôngMinh - Liên quan: 68% | Lượng tìm: TB | Cạnh tranh: Thấp\n\n`;
        result += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
        result += `💡 Khuyến nghị:\n`;
        result += `• Sử dụng 5-7 tags chính cho tối ưu\n`;
        result += `• Kết hợp giữa tags phổ biến và tags chuyên biệt\n`;
        result += `• Cập nhật tags theo xu hướng mới\n`;
        result += `• Tránh spam tags (quá nhiều tags không liên quan)\n\n`;
        result += `🎯 Chiến lược Hashtag:\n`;
        result += `• Instagram: 20-30 tags\n`;
        result += `• Twitter: 1-2 tags\n`;
        result += `• LinkedIn: 3-5 tags\n`;
        result += `• Facebook: 1-2 tags`;
        break;

      case 'title':
        result = `✨ ${titleCount} Tiêu đề được tạo (Phong cách ${titleStyle})\n\n`;
        result += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
        
        const titleVariants = [
          { emoji: '🚀', template: `${inputText.slice(0, 50)}: Hướng dẫn toàn diện 2026`, score: 92 },
          { emoji: '💡', template: `Tất cả những gì bạn cần biết về ${inputText.slice(0, 40)}`, score: 88 },
          { emoji: '🔥', template: `${inputText.slice(0, 45)}: Mẹo, Thủ thuật & Thực hành tốt nhất`, score: 90 },
          { emoji: '✨', template: `Thành thạo ${inputText.slice(0, 40)} trong 5 bước đơn giản`, score: 85 },
          { emoji: '🎯', template: `Cẩm nang ${inputText.slice(0, 35)} toàn diện: Phiên bản chuyên gia`, score: 87 },
          { emoji: '⚡', template: `${inputText.slice(0, 40)}: Con đường nhanh đến thành công`, score: 83 },
          { emoji: '📈', template: `Nâng tầm ${inputText.slice(0, 40)} của bạn ngay hôm nay`, score: 81 },
          { emoji: '🌟', template: `Khám phá sức mạnh của ${inputText.slice(0, 40)}`, score: 86 },
        ];

        titleVariants.slice(0, titleCount).forEach((variant, i) => {
          result += `${i + 1}. ${variant.emoji} "${variant.template}"\n`;
          result += `   Điểm: ${variant.score}/100 | Tương tác: ${variant.score > 85 ? 'Cao' : 'Trung bình'}\n\n`;
        });

        result += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
        result += `📊 Phân tích tiêu đề:\n\n`;
        result += `Yếu tố tối ưu:\n`;
        result += `• Độ dài ký tự: 50-60 (Tối ưu)\n`;
        result += `• Từ mạnh: ✓ (Toàn diện, Cẩm nang, Thành thạo)\n`;
        result += `• Số liệu: ✓ (2026, 5 bước đơn giản)\n`;
        result += `• Kích thích cảm xúc: ✓ (Tiềm năng tương tác cao)\n`;
        result += `• Thân thiện SEO: ✓ (Chứa từ khóa mục tiêu)\n\n`;
        result += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
        result += `💡 Thực hành tốt nhất:\n`;
        result += `• Giữ tiêu đề dưới 60 ký tự cho SEO\n`;
        result += `• Sử dụng số cụ thể (5 mẹo, 10 cách)\n`;
        result += `• Thêm năm hiện tại để tăng tính cập nhật\n`;
        result += `• Sử dụng từ mạnh: Toàn diện, Cẩm nang, Thiết yếu\n`;
        result += `• Thử nghiệm A/B nhiều biến thể để tìm hiệu quả nhất`;
        break;

      case 'sentiment':
        const positiveScore = Math.floor(Math.random() * 30) + 60;
        const negativeScore = Math.floor(Math.random() * 15) + 5;
        const neutralScore = 100 - positiveScore - negativeScore;
        
        result = `😊 Phân tích cảm xúc & Tone\n\n`;
        result += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
        result += `📊 Tổng quan Sentiment:\n\n`;
        result += `Cảm xúc tổng thể: ${positiveScore > 60 ? '😊 Tích cực' : positiveScore > 40 ? '😐 Trung lập' : '😔 Tiêu cực'}\n`;
        result += `Độ tin cậy: ${positiveScore + 10}%\n\n`;
        result += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
        result += `📈 Phân tích chi tiết:\n\n`;
        result += `Tích cực:  ${positiveScore}% ${'█'.repeat(Math.floor(positiveScore / 5))}\n`;
        result += `Trung lập: ${neutralScore}% ${'█'.repeat(Math.floor(neutralScore / 5))}\n`;
        result += `Tiêu cực:  ${negativeScore}% ${'█'.repeat(Math.floor(negativeScore / 5))}\n\n`;
        result += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
        result += `🎭 Phân tích giọng điệu:\n`;
        result += `• Giọng chính: Chuyên nghiệp, Thông tin\n`;
        result += `• Giọng phụ: Nhiệt huyết\n`;
        result += `• Phong cách viết: Trang trọng\n`;
        result += `• Tính khách quan: 75%\n`;
        result += `• Tính thuyết phục: 68%\n\n`;
        result += `😊 Phân tích cảm xúc:\n`;
        result += `• Vui vẻ: 45%\n`;
        result += `• Tin tưởng: 32%\n`;
        result += `• Kỳ vọng: 28%\n`;
        result += `• Ngạc nhiên: 15%\n`;
        result += `• Lo lắng: 8%\n`;
        result += `• Buồn: 5%\n\n`;
        result += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
        result += `🔍 Từ khóa cảm xúc:\n\n`;
        result += `Từ tích cực: xuất sắc, tuyệt vời, tuyệt hảo, tốt, đổi mới\n`;
        result += `Từ tiêu cực: khó khăn, thách thức, vấn đề\n`;
        result += `Từ trung lập: tuy nhiên, do đó, ngoài ra\n\n`;
        result += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
        result += `💡 Khuyến nghị:\n`;
        result += `• Giọng điệu phù hợp cho: ${positiveScore > 60 ? 'Marketing, Quảng cáo' : 'Báo cáo thực tế, Tin tức'}\n`;
        result += `• Đối tượng mục tiêu: ${positiveScore > 60 ? 'Đại chúng' : 'Chuyên gia'}\n`;
        result += `• Cải thiện đề xuất: Thêm ${positiveScore < 50 ? 'ngôn ngữ tích cực hơn' : 'quan điểm cân bằng hơn'}`;
        break;

      case 'readability':
        const readabilityScore = Math.floor(Math.random() * 30) + 60;
        const gradeLevel = Math.floor(readabilityScore / 10);
        
        result = `📖 Đánh giá độ dễ đọc\n\n`;
        result += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
        result += `📊 Điểm tổng: ${readabilityScore}/100\n`;
        result += `Xếp hạng: ${readabilityScore > 80 ? 'Xuất sắc' : readabilityScore > 60 ? 'Tốt' : 'Cần cải thiện'}\n\n`;
        result += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
        result += `📈 Chỉ số chi tiết:\n\n`;
        result += `Chỉ số Flesch: ${readabilityScore + 5}/100\n`;
        result += `• 90-100: Rất dễ (Lớp 5)\n`;
        result += `• 60-70: Chuẩn (Lớp 8-9) ← Nội dung của bạn\n`;
        result += `• 0-30: Rất khó (Đại học)\n\n`;
        result += `Cấp độ Flesch-Kincaid: Lớp ${gradeLevel}\n`;
        result += `Chỉ số SMOG: ${gradeLevel + 1}\n`;
        result += `Chỉ số Coleman-Liau: ${gradeLevel}\n`;
        result += `Chỉ số đọc tự động: ${gradeLevel}\n\n`;
        result += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
        result += `📝 Thống kê văn bản:\n\n`;
        result += `• Tổng số từ: ${wordCount}\n`;
        result += `• Số câu: ${Math.floor(wordCount / 15)}\n`;
        result += `• Số đoạn: ${Math.floor(wordCount / 80)}\n`;
        result += `• Độ dài câu TB: ${Math.floor(wordCount / Math.floor(wordCount / 15))} từ\n`;
        result += `• Độ dài từ TB: 4.8 ký tự\n`;
        result += `• Từ phức tạp: ${Math.floor(wordCount * 0.12)} (12%)\n`;
        result += `• Câu dài (>25 từ): ${Math.floor(wordCount / 100)}\n\n`;
        result += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
        result += `✅ Điểm mạnh:\n`;
        result += `• Cấu trúc câu rõ ràng\n`;
        result += `• Độ dài đoạn phù hợp\n`;
        result += `• Sử dụng tốt các cụm từ chuyển tiếp\n`;
        result += `• Giọng điệu nhất quán xuyên suốt\n\n`;
        result += `⚠️ Cần cải thiện:\n`;
        result += `• Rút ngắn câu (mục tiêu 15-20 từ)\n`;
        result += `• Thay thế ${Math.floor(wordCount * 0.08)} từ phức tạp bằng từ đơn giản hơn\n`;
        result += `• Chia ${Math.floor(wordCount / 100)} câu dài thành câu ngắn hơn\n`;
        result += `• Thêm tiêu đề phụ để dễ quét nội dung\n`;
        result += `• Sử dụng gạch đầu dòng để phân tách văn bản dày\n\n`;
        result += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
        result += `🎯 Phù hợp đối tượng:\n`;
        result += `• Mức hiện tại: Lớp ${gradeLevel} (${readabilityScore > 70 ? 'Đại chúng' : 'Độc giả có học vấn'})\n`;
        result += `• Phù hợp cho: ${readabilityScore > 70 ? 'Bài blog, Marketing' : 'Tài liệu kỹ thuật, Học thuật'}\n`;
        result += `• Thời gian đọc: ${Math.ceil(wordCount / 200)} phút`;
        break;

      case 'image-caption':
        result = `📸 Tạo Caption & Alt Text cho ảnh\n\n`;
        result += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
        result += `✨ Gợi ý Caption:\n\n`;
        result += `1. Phong cách Thu hút:\n`;
        result += `   "${inputText} - Hình ảnh tuyệt đẹp thể hiện\n`;
        result += `    tinh thần đổi mới hiện đại" 🚀\n\n`;
        result += `2. Phong cách Chuyên nghiệp:\n`;
        result += `   "${inputText} chuyên nghiệp thể hiện\n`;
        result += `    sự xuất sắc trong truyền thông thị giác"\n\n`;
        result += `3. Phong cách Sáng tạo:\n`;
        result += `   "🌟 Khám phá ${inputText} qua bức ảnh cuốn hút\n`;
        result += `    kể lên ngàn câu chuyện"\n\n`;
        result += `4. Phong cách Tối giản:\n`;
        result += `   "${inputText} | Thanh lịch thuần khiết"\n\n`;
        result += `5. Phong cách Mạng xã hội:\n`;
        result += `   "💡 ${inputText} ✨ #NhiếpẢnh #ThiếtKế #SángTạo"\n\n`;
        result += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
        result += `🔍 Alt Text tối ưu SEO:\n\n`;
        result += `Phiên bản ngắn:\n`;
        result += `"${inputText} - Hình ảnh chất lượng chuyên nghiệp"\n\n`;
        result += `Phiên bản chi tiết:\n`;
        result += `"${inputText} độ phân giải cao thể hiện nguyên tắc thiết kế hiện đại\n`;
        result += `với sự nhấn mạnh vào độ rõ ràng và tác động thị giác"\n\n`;
        result += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
        result += `📱 Gợi ý theo nền tảng:\n\n`;
        result += `Instagram:\n`;
        result += `"${inputText} ✨ Nhấn đúp nếu bạn đồng ý! 👇\n`;
        result += `#${inputText.replace(/\s+/g, '')} #ThiếtKế #SángTạo #NhiếpẢnh"\n\n`;
        result += `Facebook:\n`;
        result += `"Xem ${inputText} tuyệt vời này! Bạn nghĩ sao? 💭"\n\n`;
        result += `LinkedIn:\n`;
        result += `"${inputText} chuyên nghiệp thể hiện sức mạnh của\n`;
        result += `kể chuyện bằng hình ảnh trong truyền thông doanh nghiệp."\n\n`;
        result += `Twitter:\n`;
        result += `"${inputText} 🚀 #ThiếtKế #ĐổiMới"\n\n`;
        result += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
        result += `💡 Thực hành tốt nhất cho Caption:\n`;
        result += `• Giữ dưới 150 ký tự để tối đa tác động\n`;
        result += `• Sử dụng hashtag liên quan (3-5 cho hầu hết nền tảng)\n`;
        result += `• Thêm lời kêu gọi hành động khi phù hợp\n`;
        result += `• Dùng emoji có chiến lược (1-3 mỗi caption)\n`;
        result += `• Luôn thêm alt text mô tả để hỗ trợ truy cập`;
        break;

      case 'content-ideas':
        result = `💡 Brainstorm ý tưởng nội dung\n\n`;
        result += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
        result += `🚀 Chủ đề: ${inputText}\n\n`;
        result += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
        result += `📝 Ý tưởng bài viết:\n\n`;
        result += `1. "Top 10 xu hướng ${inputText} định hình năm 2026"\n`;
        result += `   Định dạng: Danh sách | Độ dài ước tính: 1500 từ\n`;
        result += `   Góc tiếp cận: Phân tích dữ liệu kèm ý kiến chuyên gia\n\n`;
        result += `2. "Cách thành thạo ${inputText}: Hướng dẫn toàn diện cho người mới"\n`;
        result += `   Định dạng: Hướng dẫn | Độ dài ước tính: 2000 từ\n`;
        result += `   Góc tiếp cận: Từng bước với ảnh minh họa\n\n`;
        result += `3. "Mẹo từ chuyên gia để thành công với ${inputText}"\n`;
        result += `   Định dạng: Phỏng vấn/Mẹo | Độ dài ước tính: 1200 từ\n`;
        result += `   Góc tiếp cận: Góc nhìn chuyên gia trong ngành\n\n`;
        result += `4. "Nghiên cứu tình huống ${inputText}: 5 câu chuyện thành công thực tế"\n`;
        result += `   Định dạng: Nghiên cứu tình huống | Độ dài ước tính: 1800 từ\n`;
        result += `   Góc tiếp cận: Ví dụ thực tế với số liệu\n\n`;
        result += `5. "Những sai lầm phổ biến về ${inputText} cần tránh (Và cách khắc phục)"\n`;
        result += `   Định dạng: Vấn đề-Giải pháp | Độ dài ước tính: 1400 từ\n`;
        result += `   Góc tiếp cận: Hướng dẫn xử lý sự cố\n\n`;
        result += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
        result += `🎥 Ý tưởng Video:\n\n`;
        result += `1. "${inputText} giải thích trong 5 phút" (Dạng ngắn)\n`;
        result += `2. "Một ngày làm việc với ${inputText}" (Vlog)\n`;
        result += `3. "Loạt hướng dẫn ${inputText}" (Giáo dục)\n`;
        result += `4. "Trước và Sau: Chuyển đổi ${inputText}" (So sánh)\n`;
        result += `5. "Hỏi đáp ${inputText} với chuyên gia" (Phỏng vấn)\n\n`;
        result += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
        result += `📱 Ý tưởng chiến dịch Mạng xã hội:\n\n`;
        result += `1. "#${inputText}Challenge" - Chiến dịch nội dung từ người dùng\n`;
        result += `2. "30 ngày ${inputText}" - Loạt mẹo hàng ngày\n`;
        result += `3. "Giải mã ${inputText}" - Bài kiểm chứng hàng tuần\n`;
        result += `4. "Hỏi gì cũng được: ${inputText}" - Tương tác cộng đồng\n`;
        result += `5. "Câu chuyện thành công ${inputText}" - Chia sẻ từ người dùng\n\n`;
        result += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
        result += `🎙️ Ý tưởng Podcast:\n\n`;
        result += `1. "Tương lai của ${inputText}: Dự đoán từ chuyên gia"\n`;
        result += `2. "Hậu trường: ${inputText} hoạt động thế nào"\n`;
        result += `3. "Câu chuyện thành công ${inputText}: Phỏng vấn"\n`;
        result += `4. "Giải đáp câu hỏi phổ biến về ${inputText}"\n`;
        result += `5. "Tin tức & Cập nhật ngành ${inputText}"\n\n`;
        result += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
        result += `📧 Ý tưởng chuỗi Email:\n\n`;
        result += `1. "Bộ khởi đầu ${inputText}" - Chuỗi 5 email giới thiệu\n`;
        result += `2. "Mẹo ${inputText} hàng tuần" - Chuỗi bản tin\n`;
        result += `3. "Lớp học ${inputText}" - Chiến dịch email giáo dục\n`;
        result += `4. "Cập nhật & Tin tức ${inputText}" - Tóm tắt hàng tháng\n\n`;
        result += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
        result += `📊 Gợi ý lịch nội dung:\n\n`;
        result += `Tuần 1: Giới thiệu & kiến thức cơ bản (bài viết)\n`;
        result += `Tuần 2: Hướng dẫn thực hành (video)\n`;
        result += `Tuần 3: Nghiên cứu tình huống (bài viết)\n`;
        result += `Tuần 4: Phỏng vấn chuyên gia (podcast)\n`;
        result += `Tuần 5: Tổng hợp & xu hướng (bài viết)\n\n`;
        result += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
        result += `🎯 Từ khóa SEO mục tiêu:\n\n`;
        result += `Chính: "${inputText}"\n`;
        result += `Phụ: "hướng dẫn ${inputText}", "${inputText} tốt nhất",\n`;
        result += `"mẹo ${inputText}", "cách ${inputText}"\n`;
        result += `Dài: "${inputText} là gì và hoạt động thế nào",\n`;
        result += `"${inputText} cho người mới", "thực hành tốt nhất ${inputText} 2026"`;
        break;

      default:
        result = 'Xử lý AI hoàn tất!';
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
                  <label className="block text-sm mb-2">Giọng điệu</label>
                  <select
                    value={translationTone}
                    onChange={(e) => setTranslationTone(e.target.value)}
                    className="w-full px-4 py-2.5 bg-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="neutral">Trung lập</option>
                    <option value="casual">Thân mật</option>
                    <option value="formal">Trang trọng</option>
                    <option value="friendly">Thân thiện</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-sm mb-2">Mức độ trang trọng</label>
                  <select
                    value={formalityLevel}
                    onChange={(e) => setFormalityLevel(e.target.value)}
                    className="w-full px-4 py-2.5 bg-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="low">Thấp (Rất thân mật)</option>
                    <option value="medium">Trung bình (Chuẩn)</option>
                    <option value="high">Cao (Rất trang trọng)</option>
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
                  <label className="block text-sm mb-2">Đối tượng mục tiêu</label>
                  <select
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    className="w-full px-4 py-2.5 bg-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="general">Đại chúng</option>
                    <option value="professional">Chuyên gia</option>
                    <option value="technical">Kỹ thuật chuyên sâu</option>
                    <option value="beginner">Người mới bắt đầu</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-sm mb-2">Loại nội dung</label>
                  <select
                    value={contentType}
                    onChange={(e) => setContentType(e.target.value)}
                    className="w-full px-4 py-2.5 bg-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="article">Bài viết/Blog</option>
                    <option value="product">Mô tả sản phẩm</option>
                    <option value="landing">Trang đích</option>
                    <option value="news">Tin tức/Thông cáo</option>
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
              <label className="block text-sm mb-2">Mức ngữ pháp</label>
              <select
                value={grammarLevel}
                onChange={(e) => setGrammarLevel(e.target.value)}
                className="w-full px-4 py-2.5 bg-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="basic">Cơ bản</option>
                <option value="standard">Chuẩn</option>
                <option value="advanced">Nâng cao</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm mb-2">Phương ngữ</label>
              <select
                value={dialectPreference}
                onChange={(e) => setDialectPreference(e.target.value)}
                className="w-full px-4 py-2.5 bg-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="american">Tiếng Anh Mỹ</option>
                <option value="british">Tiếng Anh Anh</option>
                <option value="australian">Tiếng Anh Úc</option>
              </select>
            </div>
          </>
        ) : null;

      case 'summarize':
        return (
          <>
            <div className="mb-4">
              <label className="block text-sm mb-2">Độ dài tóm tắt</label>
              <select
                value={summaryLength}
                onChange={(e) => setSummaryLength(e.target.value)}
                className="w-full px-4 py-2.5 bg-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="short">Ngắn (~50 từ)</option>
                <option value="medium">Trung bình (~100 từ)</option>
                <option value="long">Dài (~150 từ)</option>
              </select>
            </div>
            {showAdvanced && (
              <div className="mb-4">
                <label className="block text-sm mb-2">Kiểu trình bày</label>
                <select
                  value={summaryStyle}
                  onChange={(e) => setSummaryStyle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="bullet">Gạch đầu dòng</option>
                  <option value="paragraph">Đoạn văn</option>
                  <option value="executive">Tóm tắt điều hành</option>
                </select>
              </div>
            )}
          </>
        );

      case 'title':
        return (
          <>
            <div className="mb-4">
              <label className="block text-sm mb-2">Số lượng tiêu đề: {titleCount}</label>
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
                <label className="block text-sm mb-2">Phong cách</label>
                <select
                  value={titleStyle}
                  onChange={(e) => setTitleStyle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="engaging">Thu hút</option>
                  <option value="professional">Chuyên nghiệp</option>
                  <option value="clickbait">Gây tò mò</option>
                  <option value="seo">Tối ưu SEO</option>
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
              <label className="block text-sm mb-2">Giọng điệu</label>
              <select
                value={contentTone}
                onChange={(e) => setContentTone(e.target.value)}
                className="w-full px-4 py-2.5 bg-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="professional">Chuyên nghiệp</option>
                <option value="casual">Thân mật</option>
                <option value="friendly">Thân thiện</option>
                <option value="academic">Học thuật</option>
                <option value="creative">Sáng tạo</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm mb-2">Độ sáng tạo: {creativityLevel}%</label>
              <input
                type="range"
                min="0"
                max="100"
                value={creativityLevel}
                onChange={(e) => setCreativityLevel(Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>Bảo thủ</span>
                <span>Cân bằng</span>
                <span>Sáng tạo</span>
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
        title="Công cụ AI"
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
              Mẫu
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
              <div className="text-sm text-muted-foreground">Mẫu</div>
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
              Mẫu có sẵn
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
                        title="Yêu thích"
                      >
                        <Star className={`w-4 h-4 ${item.isFavorite ? 'text-yellow-500 fill-yellow-500' : 'text-muted-foreground'}`} />
                      </button>
                      <button
                        onClick={() => loadFromHistory(item)}
                        className="p-1.5 hover:bg-background rounded-lg transition-colors"
                        title="Tải lại"
                      >
                        <RefreshCw className="w-4 h-4 text-blue-600" />
                      </button>
                      <button
                        onClick={() => deleteHistoryItem(item.id)}
                        className="p-1.5 hover:bg-background rounded-lg transition-colors"
                        title="Xóa"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </div>
                  <div className="text-sm">
                    <div className="text-xs text-muted-foreground mb-1">Đầu vào:</div>
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
                    title="Sao chép"
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
                    title="Tải xuống"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                    title="Lưu vào mẫu"
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
              <li>• Sử dụng Lịch sử và Mẫu để làm việc hiệu quả hơn</li>
              <li>• Bật "Tùy chọn nâng cao" để có nhiều options tùy chỉnh hơn</li>
            </ul>
          </div>
        </div>
      </Card>
    </PageWrapper>
  );
}
