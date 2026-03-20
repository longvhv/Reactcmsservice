/**
 * Section System - Registry, Utils, Defaults
 */

import type {
  ContentSection,
  ContentSectionType,
  HtmlSectionData,
  ImageSectionData,
  DividerSectionData,
  QuoteSectionData,
  CalloutSectionData,
  AlertSectionData,
  SlideshowSectionData,
  GallerySectionData,
  VideoSectionData,
  AudioSectionData,
  EmbedSectionData,
  ChartSectionData,
  TimelineSectionData,
  TableSectionData,
  PollSectionData,
  AccordionSectionData,
  TabsSectionData,
  StepsSectionData,
  ComparisonSectionData,
  NumbersSectionData,
  CTASectionData,
  ToggleListSectionData,
  CodeSectionData,
  FileDownloadSectionData,
} from '@/src/types/content-section';

// ==================== ID GENERATOR ====================

let counter = 0;
export function generateSectionId(): string {
  counter++;
  return `sec_${Date.now()}_${counter}_${Math.random().toString(36).substr(2, 6)}`;
}

// ==================== DEFAULT SECTION FACTORIES ====================

export function createDefaultSection(type: ContentSectionType, order: number = 0): ContentSection {
  const base = {
    id: generateSectionId(),
    order,
    isVisible: true,
    spacing: 'medium' as const,
  };

  switch (type) {
    case 'html':
      return { ...base, type: 'html', content: '' } as HtmlSectionData;

    case 'image':
      return { ...base, type: 'image', imageUrl: '', alt: '', width: 'full', alignment: 'center', lightbox: true } as ImageSectionData;

    case 'divider':
      return { ...base, type: 'divider', style: 'solid', dividerWidth: 'full' } as DividerSectionData;

    case 'quote':
      return { ...base, type: 'quote', text: '', author: '', quoteStyle: 'simple' } as QuoteSectionData;

    case 'callout':
      return { ...base, type: 'callout', variant: 'info', calloutTitle: '', content: '', dismissible: false } as CalloutSectionData;

    case 'alert':
      return { ...base, type: 'alert', variant: 'info', alertTitle: '', message: '' } as AlertSectionData;

    case 'slideshow':
      return {
        ...base, type: 'slideshow', slides: [], autoPlay: true, interval: 5,
        transition: 'slide', showDots: true, showArrows: true,
      } as SlideshowSectionData;

    case 'gallery':
      return {
        ...base, type: 'gallery', images: [], layout: 'grid', columns: 3,
        gap: 'medium', enableLightbox: true,
      } as GallerySectionData;

    case 'video':
      return { ...base, type: 'video', source: 'youtube', url: '', aspectRatio: '16:9' } as VideoSectionData;

    case 'audio':
      return { ...base, type: 'audio', source: 'url', url: '', audioTitle: '' } as AudioSectionData;

    case 'embed':
      return { ...base, type: 'embed', embedType: 'youtube', url: '', aspectRatio: '16:9' } as EmbedSectionData;

    case 'chart':
      return {
        ...base, type: 'chart', chartType: 'bar',
        data: [
          { label: 'Item A', value: 40, color: '#3b82f6' },
          { label: 'Item B', value: 65, color: '#8b5cf6' },
          { label: 'Item C', value: 30, color: '#10b981' },
          { label: 'Item D', value: 80, color: '#f59e0b' },
        ],
        showLegend: true, showGrid: true, showValues: true, animate: true,
        colorScheme: ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899'],
        chartHeight: 300,
      } as ChartSectionData;

    case 'timeline':
      return {
        ...base, type: 'timeline',
        events: [
          { id: generateSectionId(), date: '2024-01', eventTitle: 'Sự kiện 1', description: 'Mô tả sự kiện', color: '#3b82f6' },
          { id: generateSectionId(), date: '2024-06', eventTitle: 'Sự kiện 2', description: 'Mô tả sự kiện', color: '#8b5cf6' },
        ],
        layout: 'left', showConnector: true,
      } as TimelineSectionData;

    case 'table':
      return {
        ...base, type: 'table',
        headers: ['Cột 1', 'Cột 2', 'Cột 3'],
        rows: [['Dữ liệu 1', 'Dữ liệu 2', 'Dữ liệu 3']],
        striped: true, bordered: true, hoverable: true, compact: false,
      } as TableSectionData;

    case 'poll':
      return {
        ...base, type: 'poll', question: '',
        options: [
          { id: generateSectionId(), text: 'Lựa chọn 1', votes: 0 },
          { id: generateSectionId(), text: 'Lựa chọn 2', votes: 0 },
        ],
        allowMultiple: false, showResults: false,
      } as PollSectionData;

    case 'accordion':
      return {
        ...base, type: 'accordion',
        items: [{ id: generateSectionId(), accordionTitle: '', content: '' }],
        allowMultipleOpen: false, defaultOpenFirst: true, accordionStyle: 'bordered',
      } as AccordionSectionData;

    case 'tabs':
      return {
        ...base, type: 'tabs',
        tabs: [
          { id: generateSectionId(), tabTitle: 'Tab 1', content: '' },
          { id: generateSectionId(), tabTitle: 'Tab 2', content: '' },
        ],
        tabStyle: 'default',
      } as TabsSectionData;

    case 'steps':
      return {
        ...base, type: 'steps',
        steps: [{ id: generateSectionId(), stepTitle: 'Bước 1', description: '' }],
        layout: 'vertical', showNumbers: true, stepsStyle: 'cards',
      } as StepsSectionData;

    case 'comparison':
      return {
        ...base, type: 'comparison', comparisonLayout: 'table',
        items: [
          { id: generateSectionId(), name: 'Sản phẩm A', values: {} },
          { id: generateSectionId(), name: 'Sản phẩm B', values: {} },
        ],
        criteria: [{ id: generateSectionId(), name: 'Tiêu chí 1', criteriaType: 'text' }],
      } as ComparisonSectionData;

    case 'numbers':
      return {
        ...base, type: 'numbers',
        items: [
          { id: generateSectionId(), value: 100, label: 'Khách hàng', suffix: '+' },
          { id: generateSectionId(), value: 50, label: 'Dự án', suffix: '+' },
          { id: generateSectionId(), value: 99, label: 'Hài lòng', suffix: '%' },
        ],
        columns: 3, animate: true, numbersStyle: 'card',
      } as NumbersSectionData;

    case 'cta':
      return {
        ...base, type: 'cta', ctaTitle: '', buttonText: 'Tìm hiểu thêm',
        buttonUrl: '#', buttonStyle: 'primary', ctaLayout: 'centered',
      } as CTASectionData;

    case 'toggle-list':
      return {
        ...base, type: 'toggle-list', variant: 'pros-cons', columns: 2,
        items: [
          { id: generateSectionId(), text: '', itemType: 'pro' },
          { id: generateSectionId(), text: '', itemType: 'con' },
        ],
      } as ToggleListSectionData;

    case 'code':
      return {
        ...base, type: 'code', language: 'javascript', code: '',
        showLineNumbers: true, theme: 'dark',
      } as CodeSectionData;

    case 'file-download':
      return {
        ...base, type: 'file-download', files: [], downloadLayout: 'list',
      } as FileDownloadSectionData;

    default:
      return { ...base, type: 'html', content: '' } as HtmlSectionData;
  }
}

// ==================== SECTION ARRAY OPERATIONS ====================

export function reorderSections(sections: ContentSection[], fromIndex: number, toIndex: number): ContentSection[] {
  const result = [...sections];
  const [removed] = result.splice(fromIndex, 1);
  result.splice(toIndex, 0, removed);
  return result.map((s, i) => ({ ...s, order: i }));
}

export function duplicateSection(section: ContentSection): ContentSection {
  return {
    ...JSON.parse(JSON.stringify(section)),
    id: generateSectionId(),
    title: section.title ? `${section.title} (copy)` : undefined,
  };
}

export function insertSectionAfter(sections: ContentSection[], afterId: string | null, newSection: ContentSection): ContentSection[] {
  if (!afterId) {
    return [{ ...newSection, order: 0 }, ...sections.map((s, i) => ({ ...s, order: i + 1 }))];
  }
  const index = sections.findIndex(s => s.id === afterId);
  const result = [...sections];
  result.splice(index + 1, 0, newSection);
  return result.map((s, i) => ({ ...s, order: i }));
}

export function removeSectionById(sections: ContentSection[], id: string): ContentSection[] {
  return sections.filter(s => s.id !== id).map((s, i) => ({ ...s, order: i }));
}

export function updateSectionById(sections: ContentSection[], id: string, updates: Partial<ContentSection>): ContentSection[] {
  return sections.map(s => s.id === id ? { ...s, ...updates } as ContentSection : s);
}

export function moveSectionUp(sections: ContentSection[], id: string): ContentSection[] {
  const index = sections.findIndex(s => s.id === id);
  if (index <= 0) return sections;
  return reorderSections(sections, index, index - 1);
}

export function moveSectionDown(sections: ContentSection[], id: string): ContentSection[] {
  const index = sections.findIndex(s => s.id === id);
  if (index >= sections.length - 1) return sections;
  return reorderSections(sections, index, index + 1);
}

// ==================== CONVERSION UTILITIES ====================

/**
 * Convert sections array to HTML string (backward compatibility)
 */
export function sectionsToHtml(sections: ContentSection[]): string {
  return sections
    .filter(s => s.isVisible)
    .sort((a, b) => a.order - b.order)
    .map(section => {
      switch (section.type) {
        case 'html':
          return section.content;
        case 'image':
          return `<figure><img src="${section.imageUrl}" alt="${section.alt}" />${section.caption ? `<figcaption>${section.caption}</figcaption>` : ''}</figure>`;
        case 'quote':
          return `<blockquote><p>${section.text}</p><cite>— ${section.author}</cite></blockquote>`;
        case 'divider':
          return '<hr />';
        case 'code':
          return `<pre><code class="language-${section.language}">${section.code}</code></pre>`;
        case 'callout':
          return `<div class="callout callout-${section.variant}"><strong>${section.calloutTitle}</strong><p>${section.content}</p></div>`;
        default:
          return `<!-- Section type: ${section.type} -->`;
      }
    })
    .join('\n');
}

/**
 * Convert legacy HTML content to a single HTML section
 */
export function htmlToSections(html: string): ContentSection[] {
  if (!html || html.trim() === '') {
    return [createDefaultSection('html', 0)];
  }
  return [{
    ...createDefaultSection('html', 0),
    content: html,
  } as HtmlSectionData];
}

// ==================== SECTION TYPE HELPERS ====================

export function getSectionLabel(type: ContentSectionType, lang: 'en' | 'vi' = 'vi'): string {
  const labels: Record<ContentSectionType, { en: string; vi: string }> = {
    'html': { en: 'Rich Text', vi: 'Văn bản' },
    'image': { en: 'Image', vi: 'Hình ảnh' },
    'divider': { en: 'Divider', vi: 'Phân cách' },
    'quote': { en: 'Quote', vi: 'Trích dẫn' },
    'callout': { en: 'Callout', vi: 'Ghi chú' },
    'alert': { en: 'Alert', vi: 'Thông báo' },
    'slideshow': { en: 'Slideshow', vi: 'Trình chiếu' },
    'gallery': { en: 'Gallery', vi: 'Bộ ảnh' },
    'video': { en: 'Video', vi: 'Video' },
    'audio': { en: 'Audio', vi: 'Âm thanh' },
    'embed': { en: 'Embed', vi: 'Nhúng' },
    'chart': { en: 'Chart', vi: 'Biểu đồ' },
    'timeline': { en: 'Timeline', vi: 'Dòng thời gian' },
    'table': { en: 'Table', vi: 'Bảng' },
    'poll': { en: 'Poll', vi: 'Bình chọn' },
    'accordion': { en: 'Accordion', vi: 'Accordion' },
    'tabs': { en: 'Tabs', vi: 'Tab' },
    'steps': { en: 'Steps', vi: 'Các bước' },
    'comparison': { en: 'Comparison', vi: 'So sánh' },
    'numbers': { en: 'Key Numbers', vi: 'Số liệu' },
    'cta': { en: 'Call to Action', vi: 'CTA' },
    'toggle-list': { en: 'Pros & Cons', vi: 'Ưu/Nhược' },
    'code': { en: 'Code', vi: 'Mã nguồn' },
    'file-download': { en: 'Files', vi: 'Tệp tin' },
  };
  return labels[type]?.[lang] || type;
}

export function getSectionColor(type: ContentSectionType): string {
  const colors: Record<ContentSectionType, string> = {
    'html': '#3b82f6', 'image': '#10b981', 'divider': '#6b7280',
    'quote': '#8b5cf6', 'callout': '#06b6d4', 'alert': '#ef4444',
    'slideshow': '#6366f1', 'gallery': '#ec4899', 'video': '#ef4444',
    'audio': '#f97316', 'embed': '#14b8a6', 'chart': '#10b981',
    'timeline': '#7c3aed', 'table': '#64748b', 'poll': '#d946ef',
    'accordion': '#f43f5e', 'tabs': '#3b82f6', 'steps': '#22c55e',
    'comparison': '#84cc16', 'numbers': '#0ea5e9', 'cta': '#8b5cf6',
    'toggle-list': '#eab308', 'code': '#71717a', 'file-download': '#f59e0b',
  };
  return colors[type] || '#6b7280';
}