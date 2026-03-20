/**
 * Content Section Type Definitions
 * Multi-section content system for CMS articles
 */

// ==================== BASE TYPES ====================

export type ContentSectionType =
  | 'html'
  | 'image'
  | 'gallery'
  | 'slideshow'
  | 'video'
  | 'audio'
  | 'embed'
  | 'chart'
  | 'timeline'
  | 'poll'
  | 'quote'
  | 'code'
  | 'table'
  | 'accordion'
  | 'tabs'
  | 'steps'
  | 'comparison'
  | 'numbers'
  | 'cta'
  | 'callout'
  | 'alert'
  | 'toggle-list'
  | 'divider'
  | 'file-download';

export type SectionSpacing = 'none' | 'small' | 'medium' | 'large';

export interface BaseSectionData {
  id: string;
  type: ContentSectionType;
  order: number;
  isVisible: boolean;
  title?: string;
  spacing: SectionSpacing;
  cssClass?: string;
  background?: string;
}

// ==================== BASIC SECTIONS ====================

export interface HtmlSectionData extends BaseSectionData {
  type: 'html';
  content: string;
}

export interface ImageSectionData extends BaseSectionData {
  type: 'image';
  imageUrl: string;
  alt: string;
  caption?: string;
  credit?: string;
  width: 'full' | 'wide' | 'medium' | 'small';
  alignment: 'left' | 'center' | 'right';
  link?: string;
  lightbox: boolean;
}

export interface DividerSectionData extends BaseSectionData {
  type: 'divider';
  style: 'solid' | 'dashed' | 'dotted' | 'gradient' | 'ornamental';
  dividerWidth: 'full' | '3/4' | '1/2' | '1/4';
  color?: string;
  withText?: string;
}

export interface QuoteSectionData extends BaseSectionData {
  type: 'quote';
  text: string;
  author: string;
  source?: string;
  avatar?: string;
  quoteStyle: 'simple' | 'boxed' | 'bordered' | 'gradient' | 'full-width';
}

export interface CalloutSectionData extends BaseSectionData {
  type: 'callout';
  variant: 'info' | 'warning' | 'success' | 'error' | 'tip' | 'note';
  calloutTitle: string;
  content: string;
  dismissible: boolean;
}

export interface AlertSectionData extends BaseSectionData {
  type: 'alert';
  variant: 'info' | 'warning' | 'error' | 'success' | 'breaking';
  alertTitle: string;
  message: string;
  link?: { text: string; url: string };
}

// ==================== MEDIA SECTIONS ====================

export interface SlideshowSlide {
  id: string;
  imageUrl: string;
  caption?: string;
  alt: string;
  link?: string;
}

export interface SlideshowSectionData extends BaseSectionData {
  type: 'slideshow';
  slides: SlideshowSlide[];
  autoPlay: boolean;
  interval: number;
  transition: 'fade' | 'slide' | 'zoom';
  showDots: boolean;
  showArrows: boolean;
}

export interface GalleryImageItem {
  id: string;
  url: string;
  alt: string;
  caption?: string;
}

export interface GallerySectionData extends BaseSectionData {
  type: 'gallery';
  images: GalleryImageItem[];
  layout: 'grid' | 'masonry' | 'carousel';
  columns: 2 | 3 | 4;
  gap: 'small' | 'medium' | 'large';
  enableLightbox: boolean;
}

export interface VideoSectionData extends BaseSectionData {
  type: 'video';
  source: 'youtube' | 'vimeo' | 'url';
  url: string;
  poster?: string;
  aspectRatio: '16:9' | '4:3' | '21:9';
  caption?: string;
}

export interface AudioSectionData extends BaseSectionData {
  type: 'audio';
  source: 'url' | 'spotify' | 'soundcloud';
  url: string;
  audioTitle: string;
  artist?: string;
  coverImage?: string;
}

export interface EmbedSectionData extends BaseSectionData {
  type: 'embed';
  embedType: 'youtube' | 'vimeo' | 'twitter' | 'facebook' | 'instagram' | 'codepen' | 'figma' | 'custom';
  url: string;
  embedCode?: string;
  aspectRatio: '16:9' | '4:3' | '1:1' | 'auto';
}

// ==================== DATA SECTIONS ====================

export interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

export interface ChartSectionData extends BaseSectionData {
  type: 'chart';
  chartType: 'bar' | 'line' | 'pie' | 'area' | 'donut' | 'radar';
  data: ChartDataPoint[];
  chartTitle?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  showLegend: boolean;
  showGrid: boolean;
  showValues: boolean;
  animate: boolean;
  colorScheme: string[];
  chartHeight: number;
}

export interface TimelineEvent {
  id: string;
  date: string;
  eventTitle: string;
  description: string;
  icon?: string;
  color?: string;
  media?: string;
}

export interface TimelineSectionData extends BaseSectionData {
  type: 'timeline';
  events: TimelineEvent[];
  layout: 'left' | 'right' | 'alternating';
  showConnector: boolean;
}

export interface TableSectionData extends BaseSectionData {
  type: 'table';
  headers: string[];
  rows: string[][];
  striped: boolean;
  bordered: boolean;
  hoverable: boolean;
  compact: boolean;
}

// ==================== INTERACTIVE SECTIONS ====================

export interface PollOption {
  id: string;
  text: string;
  votes: number;
  color?: string;
}

export interface PollSectionData extends BaseSectionData {
  type: 'poll';
  question: string;
  options: PollOption[];
  allowMultiple: boolean;
  showResults: boolean;
  endDate?: string;
}

export interface AccordionItem {
  id: string;
  accordionTitle: string;
  content: string;
}

export interface AccordionSectionData extends BaseSectionData {
  type: 'accordion';
  items: AccordionItem[];
  allowMultipleOpen: boolean;
  defaultOpenFirst: boolean;
  accordionStyle: 'simple' | 'bordered' | 'separated' | 'filled';
}

export interface TabItem {
  id: string;
  tabTitle: string;
  content: string;
}

export interface TabsSectionData extends BaseSectionData {
  type: 'tabs';
  tabs: TabItem[];
  tabStyle: 'default' | 'pills' | 'underline';
}

export interface StepItem {
  id: string;
  stepTitle: string;
  description: string;
  image?: string;
  duration?: string;
}

export interface StepsSectionData extends BaseSectionData {
  type: 'steps';
  steps: StepItem[];
  layout: 'vertical' | 'horizontal';
  showNumbers: boolean;
  stepsStyle: 'simple' | 'cards' | 'connected';
}

export interface ComparisonItem {
  id: string;
  name: string;
  image?: string;
  values: Record<string, string>;
}

export interface ComparisonCriteria {
  id: string;
  name: string;
  criteriaType: 'text' | 'rating' | 'boolean';
}

export interface ComparisonSectionData extends BaseSectionData {
  type: 'comparison';
  comparisonLayout: 'side-by-side' | 'table';
  items: ComparisonItem[];
  criteria: ComparisonCriteria[];
}

export interface NumberItem {
  id: string;
  value: number;
  label: string;
  prefix?: string;
  suffix?: string;
  color?: string;
}

export interface NumbersSectionData extends BaseSectionData {
  type: 'numbers';
  items: NumberItem[];
  columns: 2 | 3 | 4;
  animate: boolean;
  numbersStyle: 'simple' | 'card' | 'gradient';
}

export interface CTASectionData extends BaseSectionData {
  type: 'cta';
  ctaTitle: string;
  description?: string;
  buttonText: string;
  buttonUrl: string;
  buttonStyle: 'primary' | 'secondary' | 'outline' | 'gradient';
  ctaLayout: 'centered' | 'left' | 'split';
  backgroundImage?: string;
}

export interface ToggleItem {
  id: string;
  text: string;
  itemType: 'pro' | 'con' | 'neutral';
}

export interface ToggleListSectionData extends BaseSectionData {
  type: 'toggle-list';
  variant: 'pros-cons' | 'checklist' | 'feature-list';
  columns: 1 | 2;
  items: ToggleItem[];
}

export interface CodeSectionData extends BaseSectionData {
  type: 'code';
  language: string;
  code: string;
  filename?: string;
  showLineNumbers: boolean;
  theme: 'dark' | 'light';
}

export interface DownloadFile {
  id: string;
  name: string;
  url: string;
  size: string;
  fileType: string;
  description?: string;
}

export interface FileDownloadSectionData extends BaseSectionData {
  type: 'file-download';
  files: DownloadFile[];
  downloadLayout: 'list' | 'grid' | 'compact';
}

// ==================== UNION TYPE ====================

export type ContentSection =
  | HtmlSectionData
  | ImageSectionData
  | DividerSectionData
  | QuoteSectionData
  | CalloutSectionData
  | AlertSectionData
  | SlideshowSectionData
  | GallerySectionData
  | VideoSectionData
  | AudioSectionData
  | EmbedSectionData
  | ChartSectionData
  | TimelineSectionData
  | TableSectionData
  | PollSectionData
  | AccordionSectionData
  | TabsSectionData
  | StepsSectionData
  | ComparisonSectionData
  | NumbersSectionData
  | CTASectionData
  | ToggleListSectionData
  | CodeSectionData
  | FileDownloadSectionData;

// ==================== SECTION TYPE CONFIG ====================

export type SectionCategory = 'basic' | 'media' | 'data' | 'interactive' | 'layout';

export interface SectionTypeConfig {
  type: ContentSectionType;
  label: string;
  labelVi: string;
  description: string;
  icon: string; // Lucide icon name
  category: SectionCategory;
  color: string;
}

export const SECTION_TYPE_CONFIGS: SectionTypeConfig[] = [
  // Basic
  { type: 'html', label: 'Rich Text', labelVi: 'Văn bản', description: 'Formatted text with headings, lists, links', icon: 'Type', category: 'basic', color: 'blue' },
  { type: 'image', label: 'Image', labelVi: 'Hình ảnh', description: 'Single image with caption and credit', icon: 'Image', category: 'basic', color: 'green' },
  { type: 'quote', label: 'Quote', labelVi: 'Trích dẫn', description: 'Blockquote with author attribution', icon: 'Quote', category: 'basic', color: 'purple' },
  { type: 'callout', label: 'Callout', labelVi: 'Ghi chú nổi bật', description: 'Highlighted info, warning, or tip box', icon: 'Info', category: 'basic', color: 'cyan' },
  { type: 'alert', label: 'Alert', labelVi: 'Thông báo', description: 'Important alert or notification', icon: 'AlertTriangle', category: 'basic', color: 'red' },
  { type: 'divider', label: 'Divider', labelVi: 'Đường phân cách', description: 'Visual separator between sections', icon: 'Minus', category: 'basic', color: 'gray' },
  // Media
  { type: 'slideshow', label: 'Slideshow', labelVi: 'Trình chiếu', description: 'Image slideshow with auto-play', icon: 'Presentation', category: 'media', color: 'indigo' },
  { type: 'gallery', label: 'Gallery', labelVi: 'Bộ sưu tập ảnh', description: 'Photo gallery with grid/masonry layout', icon: 'LayoutGrid', category: 'media', color: 'pink' },
  { type: 'video', label: 'Video', labelVi: 'Video', description: 'YouTube, Vimeo or custom video', icon: 'Play', category: 'media', color: 'red' },
  { type: 'audio', label: 'Audio', labelVi: 'Âm thanh', description: 'Audio player or podcast embed', icon: 'Music', category: 'media', color: 'orange' },
  { type: 'embed', label: 'Embed', labelVi: 'Nhúng', description: 'Embed external content (social, maps)', icon: 'ExternalLink', category: 'media', color: 'teal' },
  { type: 'file-download', label: 'File Download', labelVi: 'Tải tệp', description: 'Downloadable file attachments', icon: 'Download', category: 'media', color: 'amber' },
  // Data
  { type: 'chart', label: 'Chart', labelVi: 'Biểu đồ', description: 'Bar, line, pie, area charts', icon: 'BarChart3', category: 'data', color: 'emerald' },
  { type: 'timeline', label: 'Timeline', labelVi: 'Dòng thời gian', description: 'Chronological timeline of events', icon: 'Clock', category: 'data', color: 'violet' },
  { type: 'table', label: 'Table', labelVi: 'Bảng', description: 'Data table with headers and rows', icon: 'Table', category: 'data', color: 'slate' },
  { type: 'numbers', label: 'Key Numbers', labelVi: 'Số liệu nổi bật', description: 'Animated counters and statistics', icon: 'Hash', category: 'data', color: 'sky' },
  { type: 'comparison', label: 'Comparison', labelVi: 'So sánh', description: 'Compare items side by side', icon: 'Columns', category: 'data', color: 'lime' },
  // Interactive
  { type: 'poll', label: 'Poll', labelVi: 'Bình chọn', description: 'Interactive poll/survey', icon: 'BarChart2', category: 'interactive', color: 'fuchsia' },
  { type: 'accordion', label: 'Accordion/FAQ', labelVi: 'Accordion/FAQ', description: 'Collapsible Q&A sections', icon: 'ChevronDown', category: 'interactive', color: 'rose' },
  { type: 'tabs', label: 'Tabs', labelVi: 'Tab', description: 'Tabbed content panels', icon: 'Layers', category: 'interactive', color: 'blue' },
  { type: 'steps', label: 'Steps', labelVi: 'Các bước', description: 'Step-by-step guide or process', icon: 'ListOrdered', category: 'interactive', color: 'green' },
  { type: 'toggle-list', label: 'Pros & Cons', labelVi: 'Ưu/Nhược điểm', description: 'Pros/cons or checklist', icon: 'ListChecks', category: 'interactive', color: 'yellow' },
  // Layout
  { type: 'cta', label: 'Call to Action', labelVi: 'Kêu gọi hành động', description: 'Button with compelling message', icon: 'MousePointerClick', category: 'layout', color: 'gradient' },
  { type: 'code', label: 'Code Block', labelVi: 'Khối mã', description: 'Syntax-highlighted code snippet', icon: 'Code', category: 'layout', color: 'zinc' },
];

export const SECTION_CATEGORIES: { id: SectionCategory; label: string; labelVi: string }[] = [
  { id: 'basic', label: 'Basic', labelVi: 'Cơ bản' },
  { id: 'media', label: 'Media', labelVi: 'Đa phương tiện' },
  { id: 'data', label: 'Data & Visualization', labelVi: 'Dữ liệu & Trực quan' },
  { id: 'interactive', label: 'Interactive', labelVi: 'Tương tác' },
  { id: 'layout', label: 'Layout & Code', labelVi: 'Bố cục & Mã' },
];
