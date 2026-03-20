/**
 * SectionTemplates - Pre-built section template presets
 * Users can insert entire groups of sections with one click
 */

import React, { useState } from 'react';
import {
  X, Search, FileText, LayoutGrid, BarChart3, Quote, Image as ImageIcon,
  ListOrdered, Layers, Newspaper, BookOpen, ShoppingBag, Presentation,
  Sparkles, ChevronRight, Check
} from 'lucide-react';
import type { ContentSection, ContentSectionType } from '@/src/types/content-section';
import { createDefaultSection, generateSectionId } from '../sections/index';

interface SectionTemplate {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  category: 'article' | 'marketing' | 'technical' | 'media' | 'data';
  sections: Partial<ContentSection>[];
  preview?: string;
}

const TEMPLATE_CATEGORIES = [
  { id: 'all', label: 'Tất cả', icon: Layers },
  { id: 'article', label: 'Bài viết', icon: Newspaper },
  { id: 'marketing', label: 'Marketing', icon: ShoppingBag },
  { id: 'technical', label: 'Kỹ thuật', icon: FileText },
  { id: 'media', label: 'Media', icon: ImageIcon },
  { id: 'data', label: 'Dữ liệu', icon: BarChart3 },
];

const SECTION_TEMPLATES: SectionTemplate[] = [
  // ==================== ARTICLE TEMPLATES ====================
  {
    id: 'basic-article',
    name: 'Bài viết cơ bản',
    description: 'Văn bản mở đầu, nội dung chính, trích dẫn, và CTA',
    icon: FileText,
    category: 'article',
    sections: [
      { type: 'html', title: 'Mở đầu', content: '<h2>Giới thiệu</h2><p>Nhập nội dung giới thiệu bài viết tại đây...</p>' },
      { type: 'callout', title: 'Điểm nổi bật', variant: 'tip', calloutTitle: 'Điểm chính', content: 'Tóm tắt điểm quan trọng nhất của bài viết', dismissible: false },
      { type: 'html', title: 'Nội dung chính', content: '<h2>Nội dung chi tiết</h2><p>Phần thân bài viết với nội dung chi tiết...</p>' },
      { type: 'quote', text: 'Thêm trích dẫn nổi bật tại đây', author: 'Tên tác giả', quoteStyle: 'bordered' },
      { type: 'html', title: 'Kết luận', content: '<h2>Kết luận</h2><p>Tổng kết các điểm chính trong bài viết...</p>' },
    ] as Partial<ContentSection>[],
  },
  {
    id: 'news-article',
    name: 'Tin tức / Báo chí',
    description: 'Alert tin nóng, hình ảnh, nội dung, timeline',
    icon: Newspaper,
    category: 'article',
    sections: [
      { type: 'alert', variant: 'breaking', alertTitle: 'Tin nóng', message: 'Tóm tắt tin tức quan trọng' },
      { type: 'image', title: 'Ảnh đại diện', imageUrl: '', alt: '', width: 'full', alignment: 'center', lightbox: true },
      { type: 'html', title: 'Nội dung tin', content: '<p><strong>Địa điểm, Ngày tháng</strong> — Nhập nội dung tin tức...</p>' },
      { type: 'timeline', title: 'Diễn biến sự kiện', events: [
        { id: generateSectionId(), date: 'Hôm nay', eventTitle: 'Sự kiện diễn ra', description: 'Mô tả chi tiết', color: '#3b82f6' },
      ], layout: 'left', showConnector: true },
      { type: 'html', title: 'Phân tích', content: '<h3>Phân tích & Nhận định</h3><p>Ý kiến chuyên gia về sự kiện...</p>' },
    ] as Partial<ContentSection>[],
  },
  {
    id: 'review-article',
    name: 'Bài đánh giá / Review',
    description: 'Ưu nhược điểm, bảng so sánh, số liệu, kết luận',
    icon: BookOpen,
    category: 'article',
    sections: [
      { type: 'html', title: 'Tổng quan', content: '<h2>Tổng quan sản phẩm</h2><p>Giới thiệu ngắn gọn về sản phẩm đánh giá...</p>' },
      { type: 'gallery', title: 'Hình ảnh sản phẩm', images: [], layout: 'grid', columns: 3, gap: 'medium', enableLightbox: true },
      { type: 'numbers', title: 'Điểm đánh giá', items: [
        { id: generateSectionId(), value: 8.5, label: 'Thiết kế', suffix: '/10' },
        { id: generateSectionId(), value: 9, label: 'Hiệu năng', suffix: '/10' },
        { id: generateSectionId(), value: 7.5, label: 'Giá trị', suffix: '/10' },
        { id: generateSectionId(), value: 8, label: 'Tổng thể', suffix: '/10' },
      ], columns: 4, animate: true, numbersStyle: 'card' },
      { type: 'toggle-list', title: 'Ưu & Nhược điểm', variant: 'pros-cons', columns: 2, items: [
        { id: generateSectionId(), text: 'Ưu điểm 1', itemType: 'pro' },
        { id: generateSectionId(), text: 'Ưu điểm 2', itemType: 'pro' },
        { id: generateSectionId(), text: 'Nhược điểm 1', itemType: 'con' },
        { id: generateSectionId(), text: 'Nhược điểm 2', itemType: 'con' },
      ] },
      { type: 'comparison', title: 'So sánh với đối thủ', comparisonLayout: 'table', items: [
        { id: generateSectionId(), name: 'Sản phẩm A', values: {} },
        { id: generateSectionId(), name: 'Sản phẩm B', values: {} },
      ], criteria: [
        { id: generateSectionId(), name: 'Giá', criteriaType: 'text' },
        { id: generateSectionId(), name: 'Hiệu năng', criteriaType: 'rating' },
      ] },
      { type: 'cta', ctaTitle: 'Mua ngay với ưu đãi đặc biệt', description: 'Giảm giá 20% cho đọc giả', buttonText: 'Xem giá tốt nhất', buttonUrl: '#', buttonStyle: 'gradient', ctaLayout: 'centered' },
    ] as Partial<ContentSection>[],
  },

  // ==================== MARKETING TEMPLATES ====================
  {
    id: 'landing-page',
    name: 'Landing Page',
    description: 'Hero section, số liệu, tính năng, testimonial, CTA',
    icon: Presentation,
    category: 'marketing',
    sections: [
      { type: 'html', title: 'Hero', content: '<h1 style="text-align:center">Tiêu đề ấn tượng</h1><p style="text-align:center">Mô tả ngắn gọn giá trị sản phẩm/dịch vụ của bạn</p>' },
      { type: 'numbers', title: 'Số liệu ấn tượng', items: [
        { id: generateSectionId(), value: 10000, label: 'Khách hàng', suffix: '+', color: '#3b82f6' },
        { id: generateSectionId(), value: 99, label: 'Hài lòng', suffix: '%', color: '#10b981' },
        { id: generateSectionId(), value: 24, label: 'Hỗ trợ', suffix: '/7', color: '#8b5cf6' },
      ], columns: 3, animate: true, numbersStyle: 'gradient' },
      { type: 'steps', title: 'Cách hoạt động', steps: [
        { id: generateSectionId(), stepTitle: 'Bước 1: Đăng ký', description: 'Tạo tài khoản chỉ trong 30 giây' },
        { id: generateSectionId(), stepTitle: 'Bước 2: Cài đặt', description: 'Thiết lập theo nhu cầu của bạn' },
        { id: generateSectionId(), stepTitle: 'Bước 3: Sử dụng', description: 'Bắt đầu trải nghiệm ngay' },
      ], layout: 'vertical', showNumbers: true, stepsStyle: 'cards' },
      { type: 'quote', text: 'Sản phẩm tuyệt vời! Đã giúp chúng tôi tăng 300% hiệu suất.', author: 'CEO Công ty ABC', quoteStyle: 'gradient' },
      { type: 'accordion', title: 'Câu hỏi thường gặp', items: [
        { id: generateSectionId(), accordionTitle: 'Làm sao để bắt đầu?', content: 'Bạn chỉ cần đăng ký tài khoản miễn phí...' },
        { id: generateSectionId(), accordionTitle: 'Giá cả như thế nào?', content: 'Chúng tôi có gói miễn phí và các gói trả phí...' },
        { id: generateSectionId(), accordionTitle: 'Hỗ trợ kỹ thuật?', content: 'Đội ngũ support 24/7 sẵn sàng hỗ trợ bạn...' },
      ], allowMultipleOpen: false, defaultOpenFirst: true, accordionStyle: 'bordered' },
      { type: 'cta', ctaTitle: 'Sẵn sàng bắt đầu?', description: 'Dùng thử miễn phí 14 ngày, không cần thẻ tín dụng', buttonText: 'Bắt đầu miễn phí', buttonUrl: '#', buttonStyle: 'gradient', ctaLayout: 'centered' },
    ] as Partial<ContentSection>[],
  },
  {
    id: 'product-comparison',
    name: 'So sánh sản phẩm',
    description: 'Bảng so sánh chi tiết, ưu nhược điểm, CTA',
    icon: LayoutGrid,
    category: 'marketing',
    sections: [
      { type: 'html', title: 'Giới thiệu', content: '<h2>So sánh chi tiết</h2><p>Phân tích và so sánh đầy đủ để giúp bạn đưa ra quyết định...</p>' },
      { type: 'comparison', title: 'Bảng so sánh', comparisonLayout: 'table', items: [
        { id: generateSectionId(), name: 'Gói cơ bản', values: {} },
        { id: generateSectionId(), name: 'Gói chuyên nghiệp', values: {} },
        { id: generateSectionId(), name: 'Gói doanh nghiệp', values: {} },
      ], criteria: [
        { id: generateSectionId(), name: 'Giá', criteriaType: 'text' },
        { id: generateSectionId(), name: 'Dung lượng', criteriaType: 'text' },
        { id: generateSectionId(), name: 'Hỗ trợ 24/7', criteriaType: 'boolean' },
        { id: generateSectionId(), name: 'API Access', criteriaType: 'boolean' },
        { id: generateSectionId(), name: 'Đánh giá', criteriaType: 'rating' },
      ] },
      { type: 'cta', ctaTitle: 'Chọn gói phù hợp', buttonText: 'Xem bảng giá', buttonUrl: '#', buttonStyle: 'primary', ctaLayout: 'centered' },
    ] as Partial<ContentSection>[],
  },

  // ==================== TECHNICAL TEMPLATES ====================
  {
    id: 'tutorial',
    name: 'Hướng dẫn / Tutorial',
    description: 'Các bước hướng dẫn, code mẫu, alert, tài liệu tải',
    icon: ListOrdered,
    category: 'technical',
    sections: [
      { type: 'html', title: 'Giới thiệu', content: '<h2>Hướng dẫn</h2><p>Bài hướng dẫn này sẽ giúp bạn...</p>' },
      { type: 'callout', variant: 'warning', calloutTitle: 'Yêu cầu', content: 'Đảm bảo bạn đã cài đặt các công cụ cần thiết trước khi bắt đầu.', dismissible: false },
      { type: 'steps', title: 'Các bước thực hiện', steps: [
        { id: generateSectionId(), stepTitle: 'Bước 1: Chuẩn bị', description: 'Cài đặt môi trường phát triển', duration: '5 phút' },
        { id: generateSectionId(), stepTitle: 'Bước 2: Viết code', description: 'Triển khai tính năng', duration: '15 phút' },
        { id: generateSectionId(), stepTitle: 'Bước 3: Test', description: 'Kiểm thử và fix bug', duration: '10 phút' },
      ], layout: 'vertical', showNumbers: true, stepsStyle: 'connected' },
      { type: 'code', title: 'Code mẫu', language: 'typescript', code: '// Thêm code mẫu tại đây\nconst example = "Hello World";\nconsole.log(example);', showLineNumbers: true, theme: 'dark', filename: 'example.ts' },
      { type: 'alert', variant: 'info', alertTitle: 'Lưu ý', message: 'Đảm bảo thay thế các giá trị mẫu bằng giá trị thực tế của bạn.' },
      { type: 'file-download', title: 'Tài liệu & Source code', files: [
        { id: generateSectionId(), name: 'Source code mẫu', url: '#', size: '2.1 MB', fileType: 'zip', description: 'Download toàn bộ source code' },
      ], downloadLayout: 'list' },
    ] as Partial<ContentSection>[],
  },
  {
    id: 'api-docs',
    name: 'API Documentation',
    description: 'Endpoint, code sample, bảng tham số, alert',
    icon: FileText,
    category: 'technical',
    sections: [
      { type: 'html', title: 'Mô tả API', content: '<h2>API Endpoint</h2><p><code>GET /api/v1/resource</code></p><p>Mô tả chức năng của endpoint này...</p>' },
      { type: 'table', title: 'Tham số', headers: ['Tham số', 'Kiểu', 'Bắt buộc', 'Mô tả'],
        rows: [
          ['id', 'string', 'Có', 'ID của resource'],
          ['page', 'number', 'Không', 'Số trang (mặc định: 1)'],
          ['limit', 'number', 'Không', 'Số lượng kết quả (mặc định: 20)'],
        ], striped: true, bordered: true, hoverable: true, compact: false },
      { type: 'code', title: 'Request', language: 'bash', code: 'curl -X GET "https://api.example.com/v1/resource?page=1&limit=10" \\\n  -H "Authorization: Bearer YOUR_TOKEN"', showLineNumbers: false, theme: 'dark', filename: 'Request' },
      { type: 'code', title: 'Response', language: 'json', code: '{\n  "data": [],\n  "pagination": {\n    "page": 1,\n    "limit": 10,\n    "total": 100\n  }\n}', showLineNumbers: true, theme: 'dark', filename: 'Response (200 OK)' },
      { type: 'callout', variant: 'error', calloutTitle: 'Lỗi thường gặp', content: '401 Unauthorized: Token không hợp lệ hoặc đã hết hạn.', dismissible: false },
    ] as Partial<ContentSection>[],
  },

  // ==================== MEDIA TEMPLATES ====================
  {
    id: 'photo-story',
    name: 'Photo Story',
    description: 'Gallery ảnh, audio, mô tả, embed social',
    icon: ImageIcon,
    category: 'media',
    sections: [
      { type: 'html', title: 'Mở đầu', content: '<h2>Câu chuyện qua ảnh</h2><p>Bộ ảnh ghi lại những khoảnh khắc đặc biệt...</p>' },
      { type: 'gallery', title: 'Bộ ảnh chính', images: [], layout: 'grid', columns: 3, gap: 'small', enableLightbox: true },
      { type: 'divider', style: 'gradient', dividerWidth: '3/4' },
      { type: 'html', title: 'Mô tả', content: '<p>Chia sẻ câu chuyện đằng sau bộ ảnh...</p>' },
      { type: 'audio', title: 'Nhạc nền', source: 'url', url: '', audioTitle: 'Background Music', artist: '' },
      { type: 'embed', title: 'Chia sẻ trên mạng xã hội', embedType: 'instagram', url: '', aspectRatio: '1:1' },
    ] as Partial<ContentSection>[],
  },
  {
    id: 'podcast-episode',
    name: 'Podcast Episode',
    description: 'Audio player, timeline, show notes, file download',
    icon: Sparkles,
    category: 'media',
    sections: [
      { type: 'html', title: 'Giới thiệu tập', content: '<h2>Tập XX: Tiêu đề</h2><p>Mô tả ngắn gọn nội dung tập podcast...</p>' },
      { type: 'audio', title: 'Nghe ngay', source: 'url', url: '', audioTitle: 'Podcast Episode', artist: 'Host Name' },
      { type: 'timeline', title: 'Timeline nội dung', events: [
        { id: generateSectionId(), date: '00:00', eventTitle: 'Mở đầu', description: 'Giới thiệu chủ đề', color: '#3b82f6' },
        { id: generateSectionId(), date: '05:30', eventTitle: 'Phần 1', description: 'Nội dung chính', color: '#8b5cf6' },
        { id: generateSectionId(), date: '25:00', eventTitle: 'Q&A', description: 'Trả lời câu hỏi', color: '#10b981' },
        { id: generateSectionId(), date: '40:00', eventTitle: 'Kết', description: 'Tổng kết và preview', color: '#f59e0b' },
      ], layout: 'left', showConnector: true },
      { type: 'html', title: 'Show Notes', content: '<h3>Show Notes</h3><ul><li>Liên kết 1</li><li>Liên kết 2</li></ul>' },
      { type: 'file-download', title: 'Download', files: [
        { id: generateSectionId(), name: 'Transcript PDF', url: '#', size: '500 KB', fileType: 'pdf', description: 'Bản ghi chép toàn bộ nội dung' },
      ], downloadLayout: 'compact' },
    ] as Partial<ContentSection>[],
  },

  // ==================== DATA TEMPLATES ====================
  {
    id: 'data-report',
    name: 'Báo cáo dữ liệu',
    description: 'Biểu đồ, bảng số liệu, key metrics, phân tích',
    icon: BarChart3,
    category: 'data',
    sections: [
      { type: 'html', title: 'Tóm tắt', content: '<h2>Báo cáo tổng quan</h2><p>Tóm tắt các điểm chính trong báo cáo...</p>' },
      { type: 'numbers', title: 'Chỉ số chính', items: [
        { id: generateSectionId(), value: 0, label: 'Doanh thu', prefix: '', suffix: ' tỷ', color: '#10b981' },
        { id: generateSectionId(), value: 0, label: 'Tăng trưởng', suffix: '%', color: '#3b82f6' },
        { id: generateSectionId(), value: 0, label: 'Người dùng', suffix: 'K+', color: '#8b5cf6' },
      ], columns: 3, animate: true, numbersStyle: 'card' },
      { type: 'chart', title: 'Biểu đồ xu hướng', chartType: 'line', data: [
        { label: 'T1', value: 0, color: '#3b82f6' },
        { label: 'T2', value: 0, color: '#3b82f6' },
        { label: 'T3', value: 0, color: '#3b82f6' },
        { label: 'T4', value: 0, color: '#3b82f6' },
      ], showLegend: true, showGrid: true, showValues: true, animate: true,
        colorScheme: ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899'], chartHeight: 300 },
      { type: 'table', title: 'Chi tiết số liệu', headers: ['Hạng mục', 'Kỳ trước', 'Kỳ này', 'Thay đổi'],
        rows: [['Hạng mục 1', '100', '120', '+20%']], striped: true, bordered: true, hoverable: true, compact: false },
      { type: 'html', title: 'Phân tích', content: '<h3>Phân tích chi tiết</h3><p>Nhận xét về xu hướng và dự báo...</p>' },
      { type: 'file-download', title: 'Tải báo cáo đầy đủ', files: [
        { id: generateSectionId(), name: 'Báo cáo chi tiết', url: '#', size: '5.2 MB', fileType: 'pdf' },
        { id: generateSectionId(), name: 'Dữ liệu nguồn', url: '#', size: '1.3 MB', fileType: 'xlsx' },
      ], downloadLayout: 'grid' },
    ] as Partial<ContentSection>[],
  },
  {
    id: 'survey-results',
    name: 'Kết quả khảo sát',
    description: 'Biểu đồ tròn, poll, phân tích, key insights',
    icon: BarChart3,
    category: 'data',
    sections: [
      { type: 'html', title: 'Tổng quan khảo sát', content: '<h2>Kết quả khảo sát</h2><p>Khảo sát được thực hiện với X người tham gia...</p>' },
      { type: 'chart', title: 'Phân bổ kết quả', chartType: 'pie', data: [
        { label: 'Rất hài lòng', value: 45, color: '#10b981' },
        { label: 'Hài lòng', value: 30, color: '#3b82f6' },
        { label: 'Bình thường', value: 15, color: '#f59e0b' },
        { label: 'Không hài lòng', value: 10, color: '#ef4444' },
      ], showLegend: true, showGrid: false, showValues: true, animate: true,
        colorScheme: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'], chartHeight: 300 },
      { type: 'poll', question: 'Bạn đánh giá trải nghiệm tổng thể như thế nào?', options: [
        { id: generateSectionId(), text: 'Xuất sắc', votes: 45 },
        { id: generateSectionId(), text: 'Tốt', votes: 30 },
        { id: generateSectionId(), text: 'Trung bình', votes: 15 },
        { id: generateSectionId(), text: 'Cần cải thiện', votes: 10 },
      ], allowMultiple: false, showResults: true },
      { type: 'callout', variant: 'success', calloutTitle: 'Key Insight', content: '75% người tham gia khảo sát đánh giá tích cực về dịch vụ.', dismissible: false },
    ] as Partial<ContentSection>[],
  },
];

interface SectionTemplatePickerProps {
  onInsert: (sections: ContentSection[]) => void;
  onClose: () => void;
}

export function SectionTemplatePicker({ onInsert, onClose }: SectionTemplatePickerProps) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [previewTemplate, setPreviewTemplate] = useState<string | null>(null);

  const filtered = SECTION_TEMPLATES.filter(t => {
    if (activeCategory !== 'all' && t.category !== activeCategory) return false;
    if (search) {
      const q = search.toLowerCase();
      return t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q);
    }
    return true;
  });

  const handleInsert = (template: SectionTemplate) => {
    const sections = template.sections.map((partial, index) => {
      const base = createDefaultSection(partial.type as ContentSectionType, index);
      return { ...base, ...partial, id: generateSectionId(), order: index } as ContentSection;
    });
    onInsert(sections);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full max-w-3xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200/60 dark:border-gray-700/60 max-h-[85vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700">
          <div>
            <h3 className="text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-500" />
              Section Templates
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">Chèn bộ template sections được thiết kế sẵn</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="px-4 pt-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Tìm template..."
              className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-400 transition-all"
              autoFocus
            />
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-1 px-4 pt-3 pb-2 overflow-x-auto">
          {TEMPLATE_CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs whitespace-nowrap transition-colors ${
                activeCategory === cat.id
                  ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <cat.icon className="w-3.5 h-3.5" />
              {cat.label}
            </button>
          ))}
        </div>

        {/* Template List */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filtered.map(template => {
              const Icon = template.icon;
              const isExpanded = previewTemplate === template.id;
              return (
                <div
                  key={template.id}
                  className={`rounded-xl border transition-all cursor-pointer group ${
                    isExpanded
                      ? 'border-purple-400/60 bg-purple-50/50 dark:bg-purple-900/10 dark:border-purple-500/40 col-span-full'
                      : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 hover:shadow-md'
                  }`}
                >
                  <div
                    className="flex items-start gap-3 p-4"
                    onClick={() => setPreviewTemplate(isExpanded ? null : template.id)}
                  >
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <Icon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-gray-900 dark:text-gray-100">{template.name}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{template.description}</div>
                      <div className="flex items-center gap-1 mt-2">
                        <span className="text-xs px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-gray-500">
                          {template.sections.length} sections
                        </span>
                        <ChevronRight className={`w-3.5 h-3.5 text-gray-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                      </div>
                    </div>
                  </div>

                  {/* Expanded Preview */}
                  {isExpanded && (
                    <div className="px-4 pb-4 border-t border-gray-100 dark:border-gray-700/50 pt-3">
                      <div className="space-y-1.5 mb-4">
                        {template.sections.map((s, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                            <div className="w-5 h-5 rounded bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-400 flex-shrink-0">
                              {i + 1}
                            </div>
                            <span className="px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                              {s.type}
                            </span>
                            {s.title && <span className="text-gray-500 truncate">{s.title}</span>}
                          </div>
                        ))}
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleInsert(template); }}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg shadow-purple-500/20 text-sm"
                      >
                        <Check className="w-4 h-4" /> Chèn template này
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-sm text-gray-500">Không tìm thấy template phù hợp</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SectionTemplatePicker;
