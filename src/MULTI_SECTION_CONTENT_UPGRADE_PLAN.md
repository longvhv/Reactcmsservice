# KE HOACH NANG CAP NOI DUNG BAI VIET - MULTI-SECTION CONTENT SYSTEM

## TONG QUAN

**Muc tieu:** Chuyen doi noi dung bai viet tu 1 truong HTML duy nhat sang he thong nhieu section, moi section co the la 1 loai noi dung khac nhau (HTML, slideshow, chart, timeline, poll, v.v.), ho tro keo tha sap xep, va preview tung loai section.

**Trang thai hien tai:**
- `Article.content: string` - 1 truong HTML duy nhat
- `RichTextEditor` - 1 editor WYSIWYG duy nhat
- `ArticlePreview` - render HTML bang `dangerouslySetInnerHTML`
- `ArticleDetail` - tuong tu

**Trang thai muc tieu:**
- `Article.sections: ContentSection[]` - mang cac section
- Moi section co `type`, `data`, `order`, `settings`
- Editor: them/xoa/sap xep/chinh sua tung section
- Preview: render tung section theo type tuong ung

---

## PHASE 1: KIEN TRUC & TYPES (Buoc 1-45)

### 1.1 Dinh nghia Content Section Types (Buoc 1-15)

**Buoc 1:** Tao file `/src/types/content-section.ts`
- Dinh nghia `ContentSectionType` enum voi tat ca loai section

**Buoc 2:** Dinh nghia `BaseSectionData` interface
- `id: string` (UUID)
- `type: ContentSectionType`
- `order: number`
- `isVisible: boolean`
- `title?: string` (tieu de tuy chon cua section)
- `cssClass?: string`
- `spacing: 'none' | 'small' | 'medium' | 'large'`
- `background?: string`
- `createdAt: string`
- `updatedAt: string`

**Buoc 3:** Dinh nghia `HtmlSectionData` interface
- extends `BaseSectionData`
- `type: 'html'`
- `content: string` (HTML content)

**Buoc 4:** Dinh nghia `SlideshowSectionData` interface
- extends `BaseSectionData`
- `type: 'slideshow'`
- `slides: SlideshowSlide[]`
- `settings: SlideshowSettings` (autoPlay, interval, transition, showDots, showArrows, height)
- Sub-interface `SlideshowSlide`: `id, imageUrl, caption, alt, link?, overlay?`

**Buoc 5:** Dinh nghia `ChartSectionData` interface
- extends `BaseSectionData`
- `type: 'chart'`
- `chartType: 'bar' | 'line' | 'pie' | 'area' | 'donut' | 'radar' | 'scatter' | 'heatmap'`
- `data: ChartDataPoint[]`
- `settings: ChartSettings` (title, xAxis, yAxis, colors, legend, gridLines, animate)
- Sub-interface `ChartDataPoint`: `label, value, color?, category?`
- Sub-interface `ChartSettings`: `showLegend, showGrid, showValues, animate, height, colorScheme`

**Buoc 6:** Dinh nghia `TimelineSectionData` interface
- extends `BaseSectionData`
- `type: 'timeline'`
- `events: TimelineEvent[]`
- `settings: TimelineSettings` (layout, style, showConnector, alternating)
- Sub-interface `TimelineEvent`: `id, date, title, description, icon?, color?, media?`

**Buoc 7:** Dinh nghia `PollSectionData` interface
- extends `BaseSectionData`
- `type: 'poll'`
- `question: string`
- `options: PollOption[]`
- `settings: PollSettings` (allowMultiple, showResults, endDate, requireAuth)
- Sub-interface `PollOption`: `id, text, votes, color?`

**Buoc 8:** Dinh nghia `QuoteSectionData` interface
- extends `BaseSectionData`
- `type: 'quote'`
- `text: string`
- `author: string`
- `source?: string`
- `avatar?: string`
- `style: 'simple' | 'boxed' | 'bordered' | 'gradient' | 'full-width'`

**Buoc 9:** Dinh nghia `EmbedSectionData` interface
- extends `BaseSectionData`
- `type: 'embed'`
- `embedType: 'youtube' | 'vimeo' | 'twitter' | 'facebook' | 'instagram' | 'tiktok' | 'spotify' | 'codepen' | 'figma' | 'custom'`
- `url: string`
- `embedCode?: string`
- `aspectRatio: '16:9' | '4:3' | '1:1' | 'auto'`
- `maxWidth?: number`

**Buoc 10:** Dinh nghia `CodeSectionData` interface
- extends `BaseSectionData`
- `type: 'code'`
- `language: string`
- `code: string`
- `filename?: string`
- `showLineNumbers: boolean`
- `highlightLines?: number[]`
- `theme: 'dark' | 'light'`

**Buoc 11:** Dinh nghia `TableSectionData` interface
- extends `BaseSectionData`
- `type: 'table'`
- `headers: string[]`
- `rows: string[][]`
- `settings: TableSettings` (striped, bordered, hoverable, compact, sortable, searchable)

**Buoc 12:** Dinh nghia `ImageSectionData` interface
- extends `BaseSectionData`
- `type: 'image'`
- `imageUrl: string`
- `alt: string`
- `caption?: string`
- `credit?: string`
- `width: 'full' | 'wide' | 'medium' | 'small'`
- `alignment: 'left' | 'center' | 'right'`
- `link?: string`
- `lightbox: boolean`

**Buoc 13:** Dinh nghia `AccordionSectionData` (FAQ) interface
- extends `BaseSectionData`
- `type: 'accordion'`
- `items: AccordionItem[]`
- `settings: AccordionSettings` (allowMultipleOpen, defaultOpen, style, showNumbers)
- Sub-interface `AccordionItem`: `id, title, content (HTML), icon?`

**Buoc 14:** Dinh nghia `CalloutSectionData` interface
- extends `BaseSectionData`
- `type: 'callout'`
- `variant: 'info' | 'warning' | 'success' | 'error' | 'tip' | 'note'`
- `title: string`
- `content: string`
- `icon?: string`
- `dismissible: boolean`

**Buoc 15:** Dinh nghia `DividerSectionData` interface
- extends `BaseSectionData`
- `type: 'divider'`
- `style: 'solid' | 'dashed' | 'dotted' | 'gradient' | 'ornamental'`
- `width: 'full' | '3/4' | '1/2' | '1/4'`
- `color?: string`
- `withText?: string`

### 1.2 Cac loai Section nang cao (Buoc 16-30)

**Buoc 16:** Dinh nghia `ComparisonSectionData` interface
- extends `BaseSectionData`
- `type: 'comparison'`
- `layout: 'side-by-side' | 'slider' | 'table'`
- `items: ComparisonItem[]`
- `criteria: ComparisonCriteria[]`
- Sub-interface `ComparisonItem`: `id, name, image?, description, values: Record<string, string>`
- Sub-interface `ComparisonCriteria`: `id, name, type: 'text' | 'rating' | 'boolean' | 'number'`

**Buoc 17:** Dinh nghia `GallerySectionData` interface
- extends `BaseSectionData`
- `type: 'gallery'`
- `images: GalleryImage[]`
- `layout: 'grid' | 'masonry' | 'carousel' | 'justified'`
- `columns: 2 | 3 | 4 | 5`
- `gap: 'small' | 'medium' | 'large'`
- `enableLightbox: boolean`
- Sub-interface `GalleryImage`: `id, url, thumbnail?, alt, caption?, width?, height?`

**Buoc 18:** Dinh nghia `VideoSectionData` interface
- extends `BaseSectionData`
- `type: 'video'`
- `source: 'upload' | 'youtube' | 'vimeo' | 'url'`
- `url: string`
- `poster?: string`
- `autoplay: boolean`
- `muted: boolean`
- `loop: boolean`
- `aspectRatio: '16:9' | '4:3' | '21:9'`
- `caption?: string`

**Buoc 19:** Dinh nghia `AudioSectionData` interface
- extends `BaseSectionData`
- `type: 'audio'`
- `source: 'upload' | 'url' | 'spotify' | 'soundcloud'`
- `url: string`
- `title: string`
- `artist?: string`
- `coverImage?: string`
- `duration?: number`
- `showWaveform: boolean`
- `transcript?: string`

**Buoc 20:** Dinh nghia `MapSectionData` interface
- extends `BaseSectionData`
- `type: 'map'`
- `latitude: number`
- `longitude: number`
- `zoom: number`
- `markers: MapMarker[]`
- `style: 'roadmap' | 'satellite' | 'terrain'`
- `height: number`
- Sub-interface `MapMarker`: `lat, lng, title, description?, icon?`

**Buoc 21:** Dinh nghia `NumbersSectionData` (Key Stats/Counters) interface
- extends `BaseSectionData`
- `type: 'numbers'`
- `items: NumberItem[]`
- `layout: 'row' | 'grid'`
- `columns: 2 | 3 | 4`
- `animate: boolean`
- `style: 'simple' | 'card' | 'gradient'`
- Sub-interface `NumberItem`: `id, value: number, label: string, prefix?, suffix?, icon?, color?`

**Buoc 22:** Dinh nghia `CTASectionData` (Call to Action) interface
- extends `BaseSectionData`
- `type: 'cta'`
- `title: string`
- `description?: string`
- `buttonText: string`
- `buttonUrl: string`
- `buttonStyle: 'primary' | 'secondary' | 'outline' | 'gradient'`
- `layout: 'centered' | 'left' | 'split'`
- `backgroundImage?: string`
- `backgroundGradient?: string`

**Buoc 23:** Dinh nghia `AlertSectionData` interface
- extends `BaseSectionData`
- `type: 'alert'`
- `variant: 'info' | 'warning' | 'error' | 'success' | 'breaking'`
- `title: string`
- `message: string`
- `link?: { text: string; url: string }`
- `autoClose?: number`

**Buoc 24:** Dinh nghia `RelatedContentSectionData` interface
- extends `BaseSectionData`
- `type: 'related-content'`
- `articleIds: string[]`
- `layout: 'grid' | 'list' | 'carousel'`
- `showExcerpt: boolean`
- `showThumbnail: boolean`
- `showDate: boolean`
- `maxItems: number`

**Buoc 25:** Dinh nghia `SocialEmbedSectionData` interface
- extends `BaseSectionData`
- `type: 'social-embed'`
- `platform: 'twitter' | 'facebook' | 'instagram' | 'tiktok' | 'linkedin'`
- `postUrl: string`
- `embedHtml?: string`

**Buoc 26:** Dinh nghia `FileDownloadSectionData` interface
- extends `BaseSectionData`
- `type: 'file-download'`
- `files: DownloadFile[]`
- `layout: 'list' | 'grid' | 'compact'`
- Sub-interface `DownloadFile`: `id, name, url, size, type, icon?, description?, downloadCount?`

**Buoc 27:** Dinh nghia `ToggleListSectionData` (Pros/Cons) interface
- extends `BaseSectionData`
- `type: 'toggle-list'`
- `variant: 'pros-cons' | 'checklist' | 'feature-list'`
- `columns: 1 | 2`
- `items: ToggleItem[]`
- Sub-interface `ToggleItem`: `id, text, type: 'pro' | 'con' | 'neutral', checked?: boolean`

**Buoc 28:** Dinh nghia `StepsSectionData` (How-to/Process) interface
- extends `BaseSectionData`
- `type: 'steps'`
- `steps: StepItem[]`
- `layout: 'vertical' | 'horizontal'`
- `showNumbers: boolean`
- `style: 'simple' | 'cards' | 'connected'`
- Sub-interface `StepItem`: `id, title, description, image?, icon?, duration?`

**Buoc 29:** Dinh nghia `TabsSectionData` interface
- extends `BaseSectionData`
- `type: 'tabs'`
- `tabs: TabItem[]`
- `style: 'default' | 'pills' | 'underline' | 'vertical'`
- Sub-interface `TabItem`: `id, title, icon?, content: string (HTML)`

**Buoc 30:** Dinh nghia Union Type `ContentSection`
- `ContentSection = HtmlSectionData | SlideshowSectionData | ChartSectionData | TimelineSectionData | PollSectionData | ...` (tat ca 25+ types)
- Export `SECTION_TYPE_CONFIG`: Record voi ten, icon, description, defaultData cho moi type
- Export `createDefaultSection(type): ContentSection` factory function

### 1.3 Cap nhat Article Types (Buoc 31-38)

**Buoc 31:** Sua `/src/types/article.ts`
- Import `ContentSection` tu `content-section.ts`
- Them truong `sections?: ContentSection[]` vao `Article` interface
- Giu lai `content: string` de backward compatible (legacy HTML)

**Buoc 32:** Them `contentMode` vao Article
- `contentMode: 'legacy' | 'sections'` - de biet bai viet dung kieu cu hay moi

**Buoc 33:** Sua `ArticleCreateInput` interface
- Them `sections?: ContentSection[]`
- Them `contentMode?: 'legacy' | 'sections'`

**Buoc 34:** Sua `ArticleUpdateInput` interface
- Them `sections?: ContentSection[]`

**Buoc 35:** Tao utility function `sectionsToHtml(sections: ContentSection[]): string`
- Convert sections array thanh chuoi HTML cho backward compatibility
- Moi section type co logic render rieng

**Buoc 36:** Tao utility function `htmlToSections(html: string): ContentSection[]`
- Parse HTML thanh array cac HtmlSectionData
- Moi block-level element (h1, h2, p, blockquote...) tro thanh 1 HTML section
- Dung cho migration tu bai viet cu

**Buoc 37:** Cap nhat `/services/api.ts` - Article interface
- Them `sections?: any[]` vao Article type
- Them `contentMode?: string`

**Buoc 38:** Cap nhat mock data trong `getArticle()`
- Tra ve article voi `sections` array mau thay vi chi `content` string
- Tao 2-3 bai viet mau voi sections da dang

### 1.4 Tao Section Registry & Factory (Buoc 39-45)

**Buoc 39:** Tao `/src/modules/articles/sections/registry.ts`
- `SectionRegistry` class: quan ly tat ca section types
- `registerSection(type, config)`: dang ky 1 section type
- `getSectionConfig(type)`: lay config
- `getAvailableSections(): SectionTypeConfig[]`
- `createSection(type): ContentSection`

**Buoc 40:** Tao config cho moi section type trong registry
- Icon (Lucide icon name)
- Label (tieng Viet & tieng Anh)
- Description
- Category: 'basic' | 'media' | 'data' | 'interactive' | 'layout' | 'advanced'
- defaultData: du lieu mac dinh khi tao moi

**Buoc 41:** Tao `/src/modules/articles/sections/section-utils.ts`
- `generateSectionId(): string` - UUID generator
- `reorderSections(sections, fromIndex, toIndex): ContentSection[]`
- `duplicateSection(section): ContentSection`
- `insertSectionAfter(sections, afterId, newSection): ContentSection[]`
- `removeSectionById(sections, id): ContentSection[]`
- `updateSectionById(sections, id, updates): ContentSection[]`
- `moveSectionUp(sections, id): ContentSection[]`
- `moveSectionDown(sections, id): ContentSection[]`

**Buoc 42:** Tao `/src/modules/articles/sections/section-validators.ts`
- `validateSection(section): ValidationResult`
- Moi type co logic validate rieng (vd: chart can it nhat 1 data point)
- `validateSections(sections): ValidationResult[]`

**Buoc 43:** Tao `/src/modules/articles/sections/section-defaults.ts`
- Default data cho moi section type
- `getDefaultHtmlSection(): HtmlSectionData`
- `getDefaultSlideshowSection(): SlideshowSectionData`
- ... cho tat ca types

**Buoc 44:** Tao `/src/modules/articles/sections/section-icons.ts`
- Map moi section type voi Lucide icon tuong ung
- `getSectionIcon(type): LucideIcon`
- `getSectionColor(type): string`
- `getSectionLabel(type): string`

**Buoc 45:** Tao `/src/modules/articles/sections/index.ts`
- Export tat ca tu cac file tren
- Central import point cho section system

---

## PHASE 2: SECTION EDITORS - CO BAN (Buoc 46-95)

### 2.1 Section Editor Infrastructure (Buoc 46-55)

**Buoc 46:** Tao `/src/modules/articles/components/sections/SectionEditorWrapper.tsx`
- Wrapper component cho moi section editor
- Header: drag handle, section type label, icon, collapse toggle
- Actions: move up/down, duplicate, delete, visibility toggle
- Body: render editor tuong ung voi type
- Footer: spacing selector, background color (optional)
- Style: glassmorphism card, rounded-2xl, subtle shadow, gradient border on hover

**Buoc 47:** Tao `/src/modules/articles/components/sections/SectionEditorFactory.tsx`
- Nhan `section: ContentSection` va return editor component tuong ung
- Switch/map theo `section.type`
- Lazy loading cho cac editor nang

**Buoc 48:** Tao `/src/modules/articles/components/sections/SectionAddButton.tsx`
- Button "+" giua cac section de them section moi
- On click: mo SectionTypePicker
- Animation: fade in tren hover giua 2 section

**Buoc 49:** Tao `/src/modules/articles/components/sections/SectionTypePicker.tsx`
- Modal/Popover hien thi tat ca section types co san
- Grouped by category (Basic, Media, Data, Interactive, Layout, Advanced)
- Search/filter function
- Each type card: icon, name, description, preview thumbnail
- Style: glassmorphism modal, grid layout, micro-animations on hover
- Quick insert: favorite/recent section types o tren cung

**Buoc 50:** Tao `/src/modules/articles/components/sections/SectionDragList.tsx`
- Chua danh sach cac section editors
- Drag & drop de sap xep lai (react-dnd)
- Drop zone indicators
- Placeholder khi keo
- SectionAddButton giua moi section

**Buoc 51:** Tao `/src/modules/articles/components/sections/SectionToolbar.tsx`
- Floating toolbar khi hover/focus 1 section
- Actions: Move Up, Move Down, Duplicate, Delete, Settings, Visibility
- Style: small pill toolbar, backdrop blur

**Buoc 52:** Tao `/src/modules/articles/components/sections/EmptySectionState.tsx`
- Hien thi khi chua co section nao
- CTA button: "Them section dau tien"
- Suggestions: 3-4 section types pho bien de nhanh chong bat dau
- Illustration/icon

**Buoc 53:** Tao `/src/modules/articles/components/sections/SectionSettingsPanel.tsx`
- Panel chung cho cai dat cua bat ky section nao
- Spacing: none | small | medium | large
- Background color / gradient
- CSS class tuy chinh
- Visibility toggle
- Animation on scroll
- Title/Label cua section
- Slide-in panel tu ben phai

**Buoc 54:** Tao `/src/modules/articles/components/sections/SectionMiniMap.tsx`
- Sidebar nho hien thi toan bo sections dang miniature
- Click de scroll den section tuong ung
- Hien thi icon va type cua moi section
- Drag & drop de sap xep nhanh
- Highlight section dang active

**Buoc 55:** Tao hook `/src/modules/articles/hooks/useSections.ts`
- Custom hook quan ly state cua sections array
- `sections, setSections`
- `addSection(type, afterId?)`
- `removeSection(id)`
- `updateSection(id, data)`
- `moveSection(id, direction: 'up' | 'down')`
- `duplicateSection(id)`
- `reorderSections(fromIndex, toIndex)`
- `toggleVisibility(id)`
- `getActiveSectionId, setActiveSectionId`
- Undo/redo support

### 2.2 HTML Section Editor (Buoc 56-60)

**Buoc 56:** Tao `/src/modules/articles/components/sections/editors/HtmlSectionEditor.tsx`
- Su dung lai RichTextEditor component hien tai
- Truyen `value` va `onChange` tu section data
- Them min-height adaptive

**Buoc 57:** Nang cap `RichTextEditor.tsx`
- Them "Source mode" toggle (xem/chinh sua HTML goc)
- Them "Clean paste" tu Word/Google Docs
- Them insert special characters
- Them table insertion
- Them word count, character count

**Buoc 58:** Them toolbar buttons moi cho RichTextEditor
- Subscript, superscript
- Strikethrough
- Text color, background color
- Clear formatting
- Horizontal rule

**Buoc 59:** Them shortcut keys cho RichTextEditor
- Ctrl+B (bold), Ctrl+I (italic), Ctrl+U (underline) - da co
- Ctrl+K (insert link)
- Ctrl+Shift+1 (H1), Ctrl+Shift+2 (H2)
- Tab (indent), Shift+Tab (outdent)

**Buoc 60:** Them "Paste as plain text" option
- Toggle giua paste giu format va paste plain text
- Auto clean HTML khi paste tu Word

### 2.3 Slideshow Section Editor (Buoc 61-68)

**Buoc 61:** Tao `/src/modules/articles/components/sections/editors/SlideshowSectionEditor.tsx`
- List cac slides voi thumbnail preview
- Them/xoa/sap xep slides
- Upload image cho moi slide
- Caption editor cho moi slide

**Buoc 62:** Tao sub-component `SlideEditor.tsx`
- Image upload area (drag & drop hoac click)
- Image URL input (alternative)
- Caption input (rich text nho)
- Alt text input
- Link URL input (optional)
- Overlay text input (optional)
- Remove button

**Buoc 63:** Them SlideshowSettings panel
- Auto play toggle + interval slider (2s - 10s)
- Transition type: 'fade' | 'slide' | 'zoom' | 'flip'
- Show navigation dots toggle
- Show navigation arrows toggle
- Height setting: auto | fixed px
- Infinite loop toggle
- Pause on hover toggle

**Buoc 64:** Them drag & drop de sap xep lai slides
- Drag handle tren moi slide
- Drop zone indicator
- Reorder animation

**Buoc 65:** Them "Bulk upload" cho slides
- Multi-file picker
- Auto-create slides tu cac images duoc chon
- Progress bar khi upload

**Buoc 66:** Them slide preview nho (thumbnail strip)
- Horizontal scrollable strip cac thumbnails
- Click de chon/edit slide
- Active state indicator

**Buoc 67:** Them image crop/resize cho moi slide
- Crop to aspect ratio (16:9, 4:3, 1:1)
- Resize to max dimensions
- Preview truoc khi apply

**Buoc 68:** Them template cho slideshow
- "Before & After" template (2 slides)
- "Product Showcase" template (5 slides)
- "Photo Story" template (10 slides)

### 2.4 Chart Section Editor (Buoc 69-78)

**Buoc 69:** Tao `/src/modules/articles/components/sections/editors/ChartSectionEditor.tsx`
- Chart type selector (bar, line, pie, area, donut, radar)
- Data input area
- Live chart preview
- Settings panel

**Buoc 70:** Tao sub-component `ChartDataEditor.tsx`
- Table-like interface de nhap data
- Add/remove rows
- Add/remove columns (cho multi-series)
- Column headers = labels
- Editable cells cho values
- CSV paste support
- CSV import button

**Buoc 71:** Tao sub-component `ChartTypeSelector.tsx`
- Visual grid cac chart types
- Moi type co icon va ten
- Highlight type dang chon
- Preview thumbnail cho moi type

**Buoc 72:** Tao sub-component `ChartSettingsPanel.tsx`
- Title input
- X-axis label, Y-axis label
- Color scheme selector (pre-defined palettes)
- Custom colors cho tung data series
- Show legend toggle + position
- Show grid lines toggle
- Show data values toggle
- Animate on scroll toggle
- Chart height setting

**Buoc 73:** Tao sub-component `ChartLivePreview.tsx`
- Su dung recharts library
- Render chart theo type va data hien tai
- Auto-update khi data thay doi
- Responsive preview

**Buoc 74:** Them CSV import/export cho chart data
- Upload CSV file
- Parse va map cot
- Preview data truoc khi import
- Export current data as CSV

**Buoc 75:** Them color palette presets
- 8-10 pre-defined palettes (Business, Vibrant, Pastel, Monochrome, etc.)
- Custom palette builder
- Preview palette tren chart

**Buoc 76:** Them chart annotation support
- Them label/note tai 1 data point cu the
- Reference line (horizontal/vertical)
- Highlight zone

**Buoc 77:** Them multi-series support
- Nhieu data series tren 1 chart
- Legend auto-generated
- Series color picker
- Show/hide tung series

**Buoc 78:** Them chart export (in preview)
- Export as PNG
- Export as SVG
- Copy to clipboard

### 2.5 Timeline Section Editor (Buoc 79-85)

**Buoc 79:** Tao `/src/modules/articles/components/sections/editors/TimelineSectionEditor.tsx`
- List cac timeline events
- Them/xoa/sap xep events
- Event editor inline

**Buoc 80:** Tao sub-component `TimelineEventEditor.tsx`
- Date picker (ngay/thang/nam hoac chi nam)
- Title input
- Description input (rich text nho)
- Icon picker (Lucide icons)
- Color picker
- Media attachment (optional image/video)
- Link URL (optional)

**Buoc 81:** Tao TimelineSettings panel
- Layout: 'vertical-left' | 'vertical-right' | 'vertical-alternating' | 'horizontal'
- Style: 'simple' | 'cards' | 'minimal' | 'detailed'
- Show connector line toggle
- Connector style: solid | dashed | dotted
- Event node style: circle | diamond | square
- Date format setting
- Animate on scroll toggle

**Buoc 82:** Them drag & drop de sap xep timeline events

**Buoc 83:** Them auto-sort theo date
- Button "Sort by date" (ascending/descending)
- Toggle auto-sort on add new event

**Buoc 84:** Them media cho timeline events
- Upload image
- Embed video URL
- Image preview nho trong event card

**Buoc 85:** Them template timelines
- "Company History" template
- "Project Milestones" template
- "Personal Journey" template
- Template auto-fill voi sample data

### 2.6 Poll Section Editor (Buoc 86-92)

**Buoc 86:** Tao `/src/modules/articles/components/sections/editors/PollSectionEditor.tsx`
- Question input
- Options list (add/remove/reorder)
- Settings panel
- Live preview

**Buoc 87:** Tao sub-component `PollOptionEditor.tsx`
- Text input cho option
- Color picker (optional, cho result bar)
- Drag handle de reorder
- Delete button
- Min: 2 options, Max: 10 options

**Buoc 88:** Tao PollSettings panel
- Allow multiple selections toggle
- Show results before voting toggle
- End date/time picker
- Require authentication toggle
- Allow change vote toggle
- Show vote count / percentage toggle
- Result display style: bar | pie | numbers

**Buoc 89:** Them live result preview
- Mock data de preview result hien thi
- Toggle giua "voting" view va "results" view

**Buoc 90:** Them poll templates
- "Yes/No" template
- "Rating 1-5" template
- "Multiple Choice" template
- "Opinion Scale" template

**Buoc 91:** Them real-time vote tracking logic (mock)
- Simulate votes khi preview
- Animated bar chart khi co vote moi

**Buoc 92:** Them poll result export
- Export results as CSV
- Export results as chart image

### 2.7 Quick Section Editors (Buoc 93-95)

**Buoc 93:** Tao `/src/modules/articles/components/sections/editors/QuoteSectionEditor.tsx`
- Quote text input (textarea)
- Author name input
- Source/title input
- Avatar URL input
- Style selector (5 styles voi visual preview)

**Buoc 94:** Tao `/src/modules/articles/components/sections/editors/DividerSectionEditor.tsx`
- Style selector (solid, dashed, dotted, gradient, ornamental)
- Width selector (full, 3/4, 1/2, 1/4)
- Color picker
- Text in divider input (optional)
- Live preview

**Buoc 95:** Tao `/src/modules/articles/components/sections/editors/CalloutSectionEditor.tsx`
- Variant selector (info, warning, success, error, tip, note)
- Title input
- Content input (rich text)
- Icon picker
- Dismissible toggle
- Live preview voi colors tuong ung

---

## PHASE 3: SECTION EDITORS - NANG CAO (Buoc 96-140)

### 3.1 Embed & Code Editors (Buoc 96-103)

**Buoc 96:** Tao `/src/modules/articles/components/sections/editors/EmbedSectionEditor.tsx`
- Platform selector tabs (YouTube, Vimeo, Twitter, Facebook, Instagram, etc.)
- URL input voi validation
- Auto-detect platform tu URL
- Embed code textarea (cho custom)
- Aspect ratio selector
- Max width setting
- Live preview (iframe)

**Buoc 97:** Them URL auto-parse
- Paste YouTube URL -> auto extract video ID, show thumbnail
- Paste Twitter URL -> show tweet preview
- Validation cho moi platform

**Buoc 98:** Tao `/src/modules/articles/components/sections/editors/CodeSectionEditor.tsx`
- Code textarea voi syntax highlighting basic
- Language selector dropdown (30+ ngon ngu)
- Filename input (optional)
- Show line numbers toggle
- Highlight specific lines input
- Theme selector (dark/light)
- Copy button
- Wrap lines toggle

**Buoc 99:** Them code syntax highlighting preview
- Dung prism-react-renderer hoac highlight.js
- Real-time preview khi type
- Line numbers
- Highlighted lines style

**Buoc 100:** Them code template snippets
- Common code patterns cho moi ngon ngu
- "Hello World" templates
- API call templates
- etc.

**Buoc 101:** Tao `/src/modules/articles/components/sections/editors/TableSectionEditor.tsx`
- Visual table editor
- Add/remove rows va columns
- Editable cells
- Header row toggle
- Drag to reorder rows/columns

**Buoc 102:** Them table settings
- Striped rows toggle
- Bordered toggle
- Hoverable rows toggle
- Compact mode toggle
- Sortable columns toggle (in preview)
- Searchable toggle (in preview)
- Responsive scroll on mobile toggle

**Buoc 103:** Them table import
- Paste from Excel/Google Sheets
- Import CSV
- Auto-detect delimiters
- Preview data truoc khi import

### 3.2 Media Section Editors (Buoc 104-113)

**Buoc 104:** Tao `/src/modules/articles/components/sections/editors/ImageSectionEditor.tsx`
- Image upload area (drag & drop)
- Image URL input
- Alt text input
- Caption input (rich text nho)
- Credit/source input
- Width selector (full, wide, medium, small)
- Alignment selector (left, center, right)
- Link URL input (optional)
- Enable lightbox toggle
- Image preview

**Buoc 105:** Them image optimization options
- Lazy loading toggle
- Quality setting
- Max width/height
- Format conversion (webp)

**Buoc 106:** Tao `/src/modules/articles/components/sections/editors/GallerySectionEditor.tsx`
- Multi-image upload
- Grid preview cac images
- Per-image: alt, caption editing
- Layout selector (grid, masonry, carousel, justified)
- Columns setting
- Gap setting
- Enable lightbox toggle
- Drag & drop de reorder images

**Buoc 107:** Them gallery bulk actions
- Select all / deselect all
- Bulk delete selected
- Bulk edit captions
- Auto-generate captions (mock AI)

**Buoc 108:** Tao `/src/modules/articles/components/sections/editors/VideoSectionEditor.tsx`
- Source selector (upload, YouTube, Vimeo, URL)
- URL input voi auto-detect
- Poster/thumbnail image
- Autoplay toggle
- Muted toggle
- Loop toggle
- Aspect ratio selector
- Caption input

**Buoc 109:** Them YouTube/Vimeo specific options
- Auto-fetch thumbnail tu URL
- Auto-detect video title
- Start time setting
- End time setting
- Show/hide controls

**Buoc 110:** Tao `/src/modules/articles/components/sections/editors/AudioSectionEditor.tsx`
- Source selector (upload, URL, Spotify, SoundCloud)
- URL input
- Title, artist inputs
- Cover image upload
- Duration display
- Show waveform toggle
- Transcript textarea (optional)

**Buoc 111:** Tao `/src/modules/articles/components/sections/editors/FileDownloadSectionEditor.tsx`
- File list manager
- Add file: upload hoac URL
- Per-file: name, description, type, icon
- Layout selector (list, grid, compact)
- Drag reorder files
- File size display
- Download count display (mock)

**Buoc 112:** Tao `/src/modules/articles/components/sections/editors/MapSectionEditor.tsx`
- Lat/Lng input fields
- Search location input (geocoding mock)
- Zoom level slider
- Markers manager (add/remove/edit)
- Map style selector (roadmap, satellite, terrain)
- Height setting
- Static map preview (image)

**Buoc 113:** Them marker editor cho Map
- Click to add marker
- Per-marker: title, description, icon
- Custom marker icons (pre-defined set)
- Marker list with edit/delete

### 3.3 Interactive Section Editors (Buoc 114-125)

**Buoc 114:** Tao `/src/modules/articles/components/sections/editors/AccordionSectionEditor.tsx`
- Items list
- Per-item: title input, content editor (rich text)
- Add/remove/reorder items
- Default open setting
- Style selector

**Buoc 115:** Them Accordion settings
- Allow multiple items open toggle
- Default first item open toggle
- Style: 'simple' | 'bordered' | 'separated' | 'filled'
- Show item numbers toggle
- Icon style: chevron | plus/minus | arrow
- Animation toggle

**Buoc 116:** Tao `/src/modules/articles/components/sections/editors/TabsSectionEditor.tsx`
- Tab list manager
- Per-tab: title, icon selector, content editor (rich text)
- Add/remove/reorder tabs
- Style selector (default, pills, underline, vertical)

**Buoc 117:** Tao `/src/modules/articles/components/sections/editors/StepsSectionEditor.tsx`
- Steps list
- Per-step: title, description (rich text), image upload, icon picker, duration
- Add/remove/reorder steps
- Layout: vertical | horizontal
- Show numbers toggle
- Style: simple | cards | connected

**Buoc 118:** Them step completion tracking (in preview)
- Checkbox per step
- Progress indicator
- "Mark all complete" button

**Buoc 119:** Tao `/src/modules/articles/components/sections/editors/ComparisonSectionEditor.tsx`
- Layout selector (side-by-side, slider, table)
- Items manager (2-4 items de so sanh)
- Criteria manager (add/remove criteria)
- Per-criteria: name, type (text, rating, boolean, number)
- Per-item: name, image, values cho moi criteria
- Live preview

**Buoc 120:** Them comparison table auto-generate
- Tu items & criteria -> auto-generate comparison table
- Highlight best values
- Color coding (green/red)

**Buoc 121:** Tao `/src/modules/articles/components/sections/editors/NumbersSectionEditor.tsx`
- Items list (key stats/counters)
- Per-item: value, label, prefix (vd: $), suffix (vd: %), icon picker, color
- Layout: row | grid
- Columns: 2 | 3 | 4
- Animate counters toggle
- Style: simple | card | gradient

**Buoc 122:** Tao `/src/modules/articles/components/sections/editors/CTASectionEditor.tsx`
- Title input
- Description input
- Button text input
- Button URL input
- Button style selector (primary, secondary, outline, gradient)
- Layout selector (centered, left, split)
- Background image upload (optional)
- Background gradient picker (optional)
- Live preview

**Buoc 123:** Tao `/src/modules/articles/components/sections/editors/AlertSectionEditor.tsx`
- Variant selector (info, warning, error, success, breaking)
- Title input
- Message input
- Link text + URL (optional)
- Auto close time (optional)
- Visual preview voi color coding

**Buoc 124:** Tao `/src/modules/articles/components/sections/editors/ToggleListSectionEditor.tsx`
- Variant selector (pros-cons, checklist, feature-list)
- Columns: 1 | 2
- Items list manager
- Per-item: text, type (pro/con/neutral), checked state
- Drag reorder

**Buoc 125:** Tao `/src/modules/articles/components/sections/editors/RelatedContentSectionEditor.tsx`
- Article picker (search existing articles)
- Layout selector (grid, list, carousel)
- Show excerpt toggle
- Show thumbnail toggle
- Show date toggle
- Max items setting
- Selected articles list voi drag reorder

### 3.4 Nang cao khac (Buoc 126-140)

**Buoc 126:** Tao `/src/modules/articles/components/sections/editors/SocialEmbedSectionEditor.tsx`
- Platform selector
- Post URL input
- Auto-detect platform tu URL
- Preview (mock)
- Embed HTML fallback textarea

**Buoc 127:** Them section clipboard operations
- Copy section to clipboard
- Cut section
- Paste section (from clipboard)
- Keyboard shortcuts: Ctrl+C, Ctrl+X, Ctrl+V (khi section selected)

**Buoc 128:** Them section undo/redo
- Undo stack cho moi section
- Undo stack cho toan bo sections array (reorder, add, delete)
- Ctrl+Z (undo), Ctrl+Y (redo)
- Max 50 undo steps

**Buoc 129:** Them section search & filter
- Search bar o dau section list
- Filter theo type
- Filter theo visibility
- Nhanh chong tim section trong bai viet dai

**Buoc 130:** Them section templates system
- Luu 1 section (hoac nhom sections) lam template
- Template library (modal)
- Load template vao bai viet
- Share template giua bai viet

**Buoc 131:** Them section group/container
- Group nhieu sections lai thanh 1 nhom
- Group co title, background, spacing rieng
- Collapse/expand group
- Drag & drop toan bo group

**Buoc 132:** Them section responsive settings
- An/hien section theo breakpoint (mobile, tablet, desktop)
- Layout thay doi theo breakpoint
- Preview responsive

**Buoc 133:** Them section scheduling
- Schedule khi nao 1 section duoc hien thi
- Start date / End date cho moi section
- "Coming soon" state
- Auto-hide khi het han

**Buoc 134:** Them A/B testing cho sections
- 2 phien ban cua 1 section
- Random hien thi phien ban A hoac B
- Mock analytics cho tung phien ban

**Buoc 135:** Them section anchoring
- Auto-generate anchor ID cho moi section
- Table of Contents tu section titles
- Deep-link den 1 section cu the

**Buoc 136:** Tao "Section Quick Insert" keyboard shortcut
- "/" (slash command) giong Notion
- Go "/" -> hien danh sach section types
- Filter khi type them
- Enter de insert

**Buoc 137:** Them AI section generation (mock)
- Button "AI Generate" cho moi section type
- Vd: AI generate chart data tu description
- AI suggest timeline events
- AI generate poll questions
- Mock responses voi delay

**Buoc 138:** Them section analytics tracking (mock)
- Track section views, engagement
- Heatmap cua content
- Most interacted sections
- Time spent per section

**Buoc 139:** Them section comments/notes
- Internal notes cho moi section (khong hien thi cho readers)
- Useful cho collaboration
- @mention team members
- Resolve/unresolve notes

**Buoc 140:** Them section version history
- Luu version khi co thay doi lon
- So sanh versions
- Restore version cu

---

## PHASE 4: SECTION RENDERERS / PREVIEW (Buoc 141-195)

### 4.1 Renderer Infrastructure (Buoc 141-150)

**Buoc 141:** Tao `/src/modules/articles/components/sections/renderers/SectionRenderer.tsx`
- Nhan `section: ContentSection`
- Return renderer component tuong ung voi type
- Wrapper: spacing, background, css class, visibility check

**Buoc 142:** Tao `/src/modules/articles/components/sections/renderers/SectionRendererFactory.tsx`
- Map moi type -> renderer component
- Lazy load renderers
- Error boundary cho moi renderer
- Fallback renderer cho unknown types

**Buoc 143:** Tao `/src/modules/articles/components/sections/renderers/ContentSectionsRenderer.tsx`
- Nhan `sections: ContentSection[]`
- Render tung section theo order
- Spacing giua cac sections
- Animation on scroll (optional)
- Wrapper cho toan bo noi dung

**Buoc 144:** Cap nhat `ArticlePreview.tsx`
- Kiem tra `contentMode`
- Neu 'sections': dung `ContentSectionsRenderer`
- Neu 'legacy': dung `dangerouslySetInnerHTML` nhu cu
- Smooth transition giua 2 mode

**Buoc 145:** Cap nhat `ArticleDetail.tsx`
- Tuong tu ArticlePreview
- Them support render sections
- Fallback ve HTML cu neu khong co sections

**Buoc 146:** Tao shared style cho tat ca renderers
- Consistent typography
- Consistent spacing
- Dark mode support
- Print-friendly styles

**Buoc 147:** Tao animation presets cho renderers
- Fade in
- Slide up
- Zoom in
- Stagger (cho lists)
- Dung CSS animations hoac motion library

**Buoc 148:** Tao responsive behavior chung
- Mobile-first approach
- Stack columns tren mobile
- Touch-friendly interactions
- Swipe gestures (cho slideshow, carousel)

**Buoc 149:** Tao loading states cho renderers
- Skeleton loading cho moi type
- Lazy load images
- Progressive loading

**Buoc 150:** Tao error handling cho renderers
- Error boundary per section
- Friendly error message
- "Retry" button
- Khong lam crash toan bo page

### 4.2 Basic Section Renderers (Buoc 151-165)

**Buoc 151:** Tao `HtmlSectionRenderer.tsx`
- Render HTML content voi prose styling
- Support tat ca HTML elements
- Image lazy loading
- Link target handling
- Sanitize HTML (prevent XSS)

**Buoc 152:** Tao `SlideshowSectionRenderer.tsx`
- Su dung react-slick library
- Render slides voi images, captions, overlays
- Navigation arrows (neu enabled)
- Dots navigation (neu enabled)
- Auto play voi interval
- Transition effects (fade, slide)
- Responsive: full-width tren mobile
- Touch swipe support
- Thumbnail strip (optional)

**Buoc 153:** Tao sub-component cho Slideshow
- SlideItem: render 1 slide (image, caption, overlay)
- SlideshowControls: arrows, dots, play/pause
- SlideshowThumbnails: thumbnail strip

**Buoc 154:** Tao `ChartSectionRenderer.tsx`
- Su dung recharts library
- Render chart theo type va data
- Responsive container
- Animate on scroll
- Tooltip on hover
- Legend
- Color scheme

**Buoc 155:** Tao chart type components
- BarChartRenderer
- LineChartRenderer
- PieChartRenderer
- AreaChartRenderer
- DonutChartRenderer
- RadarChartRenderer
- ScatterChartRenderer
- Moi component: map data -> recharts format, render voi settings

**Buoc 156:** Tao `TimelineSectionRenderer.tsx`
- Render timeline theo layout setting
- Vertical left/right/alternating
- Horizontal (scrollable)
- Event cards voi date, title, description, media
- Connector lines giua events
- Animate on scroll
- Responsive: vertical-left tren mobile

**Buoc 157:** Tao `PollSectionRenderer.tsx`
- Voting UI: radio/checkbox cho moi option
- Submit vote button
- Results view: animated bars voi percentages
- Toggle giua vote va results
- Total votes counter
- End date display
- Responsive

**Buoc 158:** Tao `QuoteSectionRenderer.tsx`
- 5 styles:
  - simple: blockquote voi left border
  - boxed: card voi shadow
  - bordered: double border
  - gradient: gradient background
  - full-width: full-width banner style
- Author name, source, avatar
- Quote icon (") decoration
- Responsive

**Buoc 159:** Tao `DividerSectionRenderer.tsx`
- 5 styles: solid, dashed, dotted, gradient, ornamental
- Width control
- Color
- Text in center (neu co)
- Ornamental: decorative SVG pattern

**Buoc 160:** Tao `CalloutSectionRenderer.tsx`
- 6 variants voi colors & icons:
  - info: blue, info icon
  - warning: yellow, alert icon
  - success: green, check icon
  - error: red, x icon
  - tip: purple, lightbulb icon
  - note: gray, pencil icon
- Title, content
- Dismissible (X button)
- Rounded corners, shadow

**Buoc 161:** Tao `EmbedSectionRenderer.tsx`
- YouTube: iframe embed
- Vimeo: iframe embed
- Twitter: embedded tweet (oEmbed)
- Facebook: embedded post
- Instagram: embedded post
- Custom: render embedCode truc tiep
- Aspect ratio handling
- Lazy load
- Responsive

**Buoc 162:** Tao `CodeSectionRenderer.tsx`
- Syntax highlighting (CSS-based)
- Line numbers (neu enabled)
- Highlighted lines (neu co)
- Dark/light theme
- Filename header (neu co)
- Copy button
- Language badge
- Horizontal scroll cho long lines

**Buoc 163:** Tao `TableSectionRenderer.tsx`
- Render HTML table voi styling
- Striped rows
- Bordered
- Hoverable
- Compact mode
- Responsive: horizontal scroll wrapper
- Sort by column (neu enabled, client-side)
- Search/filter (neu enabled)
- Sticky header on scroll

**Buoc 164:** Tao `ImageSectionRenderer.tsx`
- Responsive image
- Alt text
- Caption below
- Credit overlay
- Width & alignment
- Lightbox on click (neu enabled)
- Lazy loading
- Blur placeholder

**Buoc 165:** Tao `GallerySectionRenderer.tsx`
- 4 layouts:
  - Grid: CSS grid
  - Masonry: react-responsive-masonry
  - Carousel: react-slick
  - Justified: CSS flexbox voi aspect ratio
- Lightbox overlay khi click image
- Image captions
- Lazy loading
- Columns responsive

### 4.3 Advanced Section Renderers (Buoc 166-185)

**Buoc 166:** Tao `VideoSectionRenderer.tsx`
- Native HTML5 video player (upload/URL)
- YouTube embed (iframe)
- Vimeo embed (iframe)
- Poster image
- Controls
- Aspect ratio
- Caption below
- Responsive

**Buoc 167:** Tao `AudioSectionRenderer.tsx`
- HTML5 audio player
- Spotify embed
- SoundCloud embed
- Custom player UI (waveform optional)
- Cover image, title, artist
- Duration display
- Play/pause, seek, volume

**Buoc 168:** Tao `AccordionSectionRenderer.tsx`
- Expandable items
- Smooth open/close animation
- Multiple open support (neu enabled)
- Default open first item
- 4 styles: simple, bordered, separated, filled
- Icon animation (rotate chevron)
- Rich text content rendering

**Buoc 169:** Tao `TabsSectionRenderer.tsx`
- Tab navigation
- Tab content panels
- 4 styles: default, pills, underline, vertical
- Responsive: vertical -> horizontal tren mobile
- Keyboard navigation (arrow keys)
- URL hash support (#tab-1)

**Buoc 170:** Tao `StepsSectionRenderer.tsx`
- Vertical va horizontal layouts
- Step numbers (neu enabled)
- Step icons
- Step images
- Duration per step
- Connected style: lines giua steps
- Progress tracking (interactive)
- Responsive: horizontal -> vertical tren mobile

**Buoc 171:** Tao `ComparisonSectionRenderer.tsx`
- 3 layouts:
  - Side-by-side: cards
  - Slider: before/after image slider
  - Table: comparison table voi check marks
- Highlight best values
- Responsive
- Sticky header (table mode)

**Buoc 172:** Tao `NumbersSectionRenderer.tsx`
- Animated counter (count up from 0)
- Icons
- Labels
- Prefix/suffix
- Grid layout
- 3 styles: simple, card, gradient
- Animate when scrolled into view (Intersection Observer)

**Buoc 173:** Tao `CTASectionRenderer.tsx`
- Title, description
- Button voi style
- Background image/gradient
- 3 layouts: centered, left-aligned, split (text + button)
- Hover effects tren button
- Responsive

**Buoc 174:** Tao `AlertSectionRenderer.tsx`
- 5 variants voi colors:
  - info: blue
  - warning: amber
  - error: red
  - success: green
  - breaking: red + pulsing animation
- Dismiss button (neu enabled)
- Auto-close timer
- Icon

**Buoc 175:** Tao `ToggleListSectionRenderer.tsx`
- Pros/Cons: green check / red x
- Checklist: checkbox voi strikethrough khi checked
- Feature list: check/x/dash icons
- 1 or 2 columns
- Responsive

**Buoc 176:** Tao `RelatedContentSectionRenderer.tsx`
- Fetch related articles data (mock)
- 3 layouts: grid (cards), list, carousel
- Article card: thumbnail, title, excerpt, date
- Responsive

**Buoc 177:** Tao `SocialEmbedSectionRenderer.tsx`
- Platform-specific embed rendering
- Lazy load
- Loading skeleton
- Error fallback (link to post)

**Buoc 178:** Tao `FileDownloadSectionRenderer.tsx`
- File list voi icons (PDF, DOC, ZIP, etc.)
- File name, description, size
- Download button
- Download count (mock)
- 3 layouts: list, grid, compact
- File type icons

**Buoc 179:** Tao `MapSectionRenderer.tsx`
- Static map image (OpenStreetMap/placeholder)
- Markers display
- Height setting
- Style setting
- "Open in Google Maps" link
- Responsive

**Buoc 180:** Tao `LightboxOverlay.tsx` (shared component)
- Full-screen image viewer
- Navigation arrows
- Close button
- Image counter (3/10)
- Keyboard navigation (arrow keys, ESC)
- Zoom in/out
- Swipe on mobile
- Dark background

**Buoc 181:** Tao renderer cho Table of Contents
- Auto-generate tu section titles
- Numbered list
- Anchor links
- Sticky sidebar option
- Smooth scroll to section
- Active section highlight

**Buoc 182:** Tao `SectionAnchor.tsx`
- Invisible anchor element truoc moi section
- ID = section.id hoac generated slug
- Scroll-to support
- Copy link button (hover)

**Buoc 183:** Them print styles cho tat ca renderers
- Page break handling
- No interactive elements khi print
- Optimized layout cho A4
- Charts render as static images

**Buoc 184:** Them dark mode cho tat ca renderers
- Dark backgrounds
- Inverted colors
- Proper contrast
- Consistent across all types

**Buoc 185:** Them accessibility cho tat ca renderers
- ARIA labels
- Keyboard navigation
- Screen reader support
- Focus indicators
- Alt text cho images
- Role attributes

### 4.4 Preview System Upgrade (Buoc 186-195)

**Buoc 186:** Cap nhat `ArticlePreview.tsx` - Responsive preview
- Desktop/Tablet/Mobile toggle (da co)
- Moi device render sections phu hop
- Sections tu dong adjust layout

**Buoc 187:** Them section outline trong preview
- Sidebar hien thi danh sach sections
- Click de scroll den section
- Highlight section dang xem

**Buoc 188:** Them "Edit this section" button trong preview
- Hover section -> hien "Edit" button
- Click -> scroll den section trong editor
- Hoac open section editor modal

**Buoc 189:** Them reading progress bar
- Progress bar o top cua preview
- Update khi scroll
- Section labels tren progress bar

**Buoc 190:** Them share preview link
- Generate temporary preview URL
- Share voi team de review
- Expiry time setting

**Buoc 191:** Them side-by-side edit/preview mode
- Split view: editor ben trai, preview ben phai
- Sync scroll
- Real-time update preview khi edit

**Buoc 192:** Them section interaction tracking trong preview
- Track which sections user interacts with
- Time spent per section
- Click tracking
- Heatmap visualization

**Buoc 193:** Cap nhat HTML export trong preview
- Xuat HTML tu sections
- Include CSS styles
- Responsive HTML output
- Clean, semantic HTML

**Buoc 194:** Them PDF export tu preview
- "Export as PDF" button
- Include all sections
- Proper page breaks
- Charts as images
- Table of contents

**Buoc 195:** Them preview annotations
- Comment/annotate tren preview
- Pin comments den vi tri cu the
- Useful cho editorial review

---

## PHASE 5: TICH HOP VAO ARTICLE EDITOR (Buoc 196-245)

### 5.1 Sua ArticleEditor Page (Buoc 196-210)

**Buoc 196:** Tao `/src/modules/articles/components/ContentSectionEditor.tsx`
- Main component thay the RichTextEditor trong Article Editor
- Chua: SectionDragList, SectionAddButton, SectionMiniMap, SectionToolbar
- Manage sections state voi useSections hook
- Two-way binding voi article form

**Buoc 197:** Cap nhat `ArticleEditorPage.tsx`
- Thay `RichTextEditor` bang `ContentSectionEditor`
- Them `sections` field vao form schema
- Them `contentMode` toggle (legacy HTML vs sections)
- Keep backward compatibility

**Buoc 198:** Cap nhat form validation schema
- Remove required `content` khi mode = 'sections'
- Add validation cho `sections` array
- Min 1 section required
- Validate moi section theo type

**Buoc 199:** Cap nhat form submission
- Khi save: gui `sections` array
- Auto-generate `content` HTML tu sections (backward compat)
- Save `contentMode` cung article

**Buoc 200:** Cap nhat form loading (edit mode)
- Load `sections` tu article data
- Neu khong co sections, load `content` HTML vao 1 HTML section
- Migration prompt: "Convert HTML to sections?"

**Buoc 201:** Them content mode switcher
- Toggle giua "Rich Text" (legacy) va "Block Editor" (sections)
- Warning khi switch: "Ban co muon chuyen doi? Mot so formatting co the thay doi"
- Auto-migrate khi switch tu legacy -> sections
- Auto-generate HTML khi switch tu sections -> legacy

**Buoc 202:** Sua `/components/ArticleEditor.tsx` (Legacy editor)
- Tuong tu nhu ArticleEditorPage.tsx
- Thay phan content editor
- Them sections support
- Giu lai toan bo fields khac (title, category, tags, etc.)

**Buoc 203:** Cap nhat Save & Continue logic
- "Luu va them tiep" van hoat dong
- Reset sections ve default (1 HTML section rong)
- Giu article type, category settings

**Buoc 204:** Cap nhat Draft auto-save
- Auto-save sections moi 30 giay
- Save sections vao localStorage backup
- Restore tu auto-save khi co crash

**Buoc 205:** Cap nhat "unsaved changes" detection
- Detect thay doi trong bat ky section nao
- Deep comparison cho sections array
- Warning khi navigate away voi unsaved changes

**Buoc 206:** Cap nhat article type switching
- Khi doi article type: suggest relevant section types
- Vd: Type "gallery" -> suggest Gallery section
- Type "video" -> suggest Video section
- Type "podcast" -> suggest Audio section
- Khong tu dong xoa sections hien tai

**Buoc 207:** Them keyboard shortcuts cho editor
- Ctrl+S: Save
- Ctrl+Shift+P: Preview
- Ctrl+Shift+N: Add new section
- Ctrl+Up/Down: Move section
- Ctrl+D: Duplicate section
- Delete: Delete selected section (voi confirm)
- / (slash): Quick insert

**Buoc 208:** Them section statistics trong editor
- Total sections count
- Total word count (tu tat ca text sections)
- Estimated reading time
- Images count
- Videos count
- Interactive elements count

**Buoc 209:** Them AI content assistant (mock)
- Suggest sections based on article title/topic
- Generate section content
- Rephrase text
- Translate text
- Summarize long text

**Buoc 210:** Them import content features
- Import tu Word (.docx) -> auto-create sections
- Import tu Markdown -> parse headings, images, code blocks
- Import tu URL -> scrape content & create sections
- Import tu JSON -> direct sections import

### 5.2 Sua ArticleDetail Page (Buoc 211-220)

**Buoc 211:** Cap nhat `ArticleDetail.tsx`
- Kiem tra `contentMode`
- Neu 'sections': render tung section voi renderers
- Neu 'legacy': giu logic cu
- Smooth transition

**Buoc 212:** Them Table of Contents sidebar cho section view
- Auto-generate tu section titles
- Sticky sidebar
- Smooth scroll
- Active section highlight

**Buoc 213:** Them section navigation
- "Previous Section" / "Next Section" buttons
- Section counter (Section 3/10)
- Progress bar

**Buoc 214:** Them section sharing
- Share link den 1 section cu the (#section-id)
- Copy section link button
- Deep linking support

**Buoc 215:** Them section comments
- Readers co the comment tren 1 section cu the
- Comment thread per section
- Reply, like, report

**Buoc 216:** Them section bookmarking
- Bookmark 1 section cu the
- List bookmarked sections
- Quick jump den bookmarked section

**Buoc 217:** Them interactive section features
- Poll: users co the vote
- Checklist: users co the check items
- Counter: animated count up

**Buoc 218:** Them section lazy loading
- Chi render sections visible trong viewport
- Intersection Observer de lazy load
- Skeleton loading cho sections chua render
- Smooth appear animation

**Buoc 219:** Them section expand/collapse
- Long sections co "Read more" button
- Collapse content > X characters
- Smooth expand animation

**Buoc 220:** Cap nhat meta information
- Hien thi section types used
- Total sections
- Reading time updated (tinh toan tu sections)
- Content richness score

### 5.3 Sua services/api.ts va Mock Data (Buoc 221-235)

**Buoc 221:** Cap nhat Article interface trong `/services/api.ts`
- Them `sections?: ContentSection[]`
- Them `contentMode?: 'legacy' | 'sections'`

**Buoc 222:** Cap nhat `getArticle()` mock response
- Tra ve article voi sections array phong phu
- Bao gom nhieu loai sections khac nhau

**Buoc 223:** Tao mock article "Tech Review" voi sections
- Section 1: HTML (gioi thieu)
- Section 2: Image (featured image voi caption)
- Section 3: HTML (noi dung chinh)
- Section 4: Chart (so sanh hieu nang)
- Section 5: Quote (expert opinion)
- Section 6: Slideshow (hinh anh san pham)
- Section 7: Callout (luu y quan trong)
- Section 8: HTML (ket luan)
- Section 9: CTA (link mua san pham)

**Buoc 224:** Tao mock article "Company History" voi sections
- Section 1: HTML (gioi thieu)
- Section 2: Timeline (lich su cong ty)
- Section 3: Numbers (key stats: nam hoat dong, nhan vien, khach hang)
- Section 4: Gallery (hinh anh van phong)
- Section 5: Quote (CEO quote)
- Section 6: CTA (tuyen dung)

**Buoc 225:** Tao mock article "Product Comparison" voi sections
- Section 1: HTML (gioi thieu)
- Section 2: Comparison (so sanh 3 san pham)
- Section 3: Chart (pricing comparison)
- Section 4: ToggleList (pros/cons)
- Section 5: Poll (readers vote san pham yeu thich)
- Section 6: Accordion (FAQ)
- Section 7: CTA (mua ngay)

**Buoc 226:** Tao mock article "Tutorial" voi sections
- Section 1: HTML (tong quan)
- Section 2: Steps (huong dan tung buoc)
- Section 3: Code (code example)
- Section 4: Image (screenshot)
- Section 5: Callout (tip)
- Section 6: Code (code example 2)
- Section 7: Embed (YouTube video)
- Section 8: Accordion (FAQ)

**Buoc 227:** Tao mock article "Event" voi sections
- Section 1: Alert (breaking: dang dien ra)
- Section 2: HTML (mo ta su kien)
- Section 3: Map (dia diem)
- Section 4: Timeline (agenda)
- Section 5: Gallery (hinh anh su kien)
- Section 6: Video (video highlight)
- Section 7: Numbers (thong ke: dien gia, nguoi tham du, workshops)
- Section 8: Tabs (speakers info, schedule, sponsors)
- Section 9: CTA (dang ky)

**Buoc 228:** Cap nhat `createArticle()` mock
- Nhan va luu sections
- Auto-generate content HTML tu sections

**Buoc 229:** Cap nhat `updateArticle()` mock
- Cap nhat sections
- Keep order

**Buoc 230:** Them mock cho poll voting
- `votePoll(sectionId, optionId)` mock function
- Update vote count
- Return updated results

**Buoc 231:** Them mock cho section analytics
- `getSectionAnalytics(articleId)` mock
- Return mock analytics per section

**Buoc 232:** Them mock cho section comments
- `getSectionComments(articleId, sectionId)` mock
- Return mock comments

**Buoc 233:** Cap nhat `getArticles()` list view
- Hien thi section types used trong article card
- Section count badge

**Buoc 234:** Them migration utility
- `migrateArticle(article)`: convert legacy -> sections
- `batchMigrateArticles(articles)`: convert nhieu bai viet
- Migration report

**Buoc 235:** Them sections validation trong API layer
- Validate sections array truoc khi save
- Check required fields
- Check image URLs
- Return validation errors

### 5.4 UI/UX Polish (Buoc 236-245)

**Buoc 236:** Them section type icons design
- Moi section type co icon Lucide rieng
- Color coding: blue (text), green (media), purple (data), orange (interactive), gray (layout)
- Consistent icon size va style

**Buoc 237:** Them micro-animations
- Section add: slide down + fade in
- Section remove: slide up + fade out
- Section reorder: smooth position transition
- Section expand/collapse: smooth height animation
- Button hover effects
- Loading spinners

**Buoc 238:** Them glassmorphism effects cho section cards
- Frosted glass background
- Subtle border
- Shadow on hover
- Gradient accent colors
- Backdrop blur

**Buoc 239:** Them gradient backgrounds cho section type picker
- Each category co gradient rieng
- Smooth hover transitions
- Selected state glow

**Buoc 240:** Them responsive design cho section editor
- Mobile: single column, simplified toolbar
- Tablet: compact layout
- Desktop: full layout voi sidebar
- Section editor adapts to screen size

**Buoc 241:** Them dark mode cho section editor
- All section editors support dark mode
- Section type picker dark mode
- Section toolbar dark mode
- Consistent voi app theme

**Buoc 242:** Them focus indicators va accessibility
- Tab navigation through sections
- Focus ring on active section
- Screen reader announcements for section operations
- ARIA roles va labels

**Buoc 243:** Them empty states cho moi section type
- Descriptive empty state voi illustration
- CTA button de bat dau
- Helpful tips

**Buoc 244:** Them loading states cho section operations
- Save: progress indicator
- Upload: progress bar
- Generate: loading spinner voi text
- Skeleton loading khi fetch data

**Buoc 245:** Them error states va error recovery
- Section-level error display
- Retry buttons
- Fallback rendering
- Error details (collapsible)

---

## PHASE 6: TESTING & OPTIMIZATION (Buoc 246-270)

### 6.1 Testing (Buoc 246-255)

**Buoc 246:** Test tao bai viet moi voi sections
- Tao bai viet voi tung loai section
- Verify sections duoc luu dung
- Verify preview render dung

**Buoc 247:** Test edit bai viet co sections
- Load bai viet -> sections hien thi dung
- Edit 1 section -> verify thay doi
- Add/remove sections -> verify order
- Reorder sections -> verify positions

**Buoc 248:** Test migration tu legacy -> sections
- Open bai viet legacy
- Click "Convert to sections"
- Verify HTML duoc parse dung
- Verify preview khong thay doi

**Buoc 249:** Test drag & drop
- Drag section tu vi tri A -> B
- Verify order cap nhat
- Verify data khong mat
- Test voi nhieu sections (10+)

**Buoc 250:** Test responsive preview
- Desktop, tablet, mobile views
- All section types render dung
- Layout adjustments correct
- No overflow issues

**Buoc 251:** Test dark mode
- Toggle dark mode
- All sections render dung
- No contrast issues
- Charts, images van dep

**Buoc 252:** Test keyboard shortcuts
- All shortcuts hoat dong
- No conflicts voi browser shortcuts
- Focus management correct

**Buoc 253:** Test save & load
- Save article voi sections
- Reload page
- All sections load dung
- No data loss

**Buoc 254:** Test edge cases
- Bai viet khong co section nao
- Bai viet voi 50+ sections
- Section voi empty data
- Section voi very long content
- Multiple embeds

**Buoc 255:** Test "Save and Continue"
- Save -> form reset dung
- Sections reset ve default
- Article type, category giu lai

### 6.2 Performance (Buoc 256-265)

**Buoc 256:** Implement lazy loading cho section editors
- Chi render editor cua section dang active
- Collapsed sections = minimal render
- Virtualized list cho nhieu sections

**Buoc 257:** Implement lazy loading cho renderers
- Intersection Observer
- Chi render sections trong viewport
- Skeleton loading cho offscreen sections

**Buoc 258:** Optimize re-renders
- React.memo cho section editors
- useMemo cho computed values
- useCallback cho event handlers
- Avoid unnecessary section array copies

**Buoc 259:** Optimize images
- Lazy loading cho tat ca images
- Blur placeholder
- Responsive images (srcset)
- WebP format preference

**Buoc 260:** Optimize chart rendering
- Animate chi khi scroll into view
- Debounce data changes
- Reduce animation frames
- Simple charts cho mobile

**Buoc 261:** Bundle size optimization
- Code splitting per section type
- Dynamic imports cho heavy components (charts, maps)
- Tree shaking
- Analyze bundle size

**Buoc 262:** Debounce section updates
- Debounce content changes (300ms)
- Debounce auto-save
- Batch state updates

**Buoc 263:** Optimize drag & drop
- Use CSS transform instead of reflow
- Smooth 60fps animations
- Reduce DOM operations during drag

**Buoc 264:** Memory management
- Cleanup event listeners
- Cleanup timers
- Cleanup Intersection Observers
- Proper useEffect cleanup

**Buoc 265:** Test performance voi nhieu sections
- 10 sections: smooth
- 20 sections: smooth
- 50 sections: acceptable
- Profile va optimize bottlenecks

### 6.3 Final Polish (Buoc 266-270)

**Buoc 266:** Cap nhat i18n cho tat ca section types
- Vietnamese labels cho tat ca
- English labels cho tat ca
- Error messages
- Placeholder texts

**Buoc 267:** Cap nhat Sidebar/Navigation
- Them "Block Editor" badge
- Them section count trong article list
- Them section type filters

**Buoc 268:** Cap nhat Dashboard
- Hien thi section usage statistics
- Popular section types
- Articles using sections vs legacy

**Buoc 269:** Documentation
- Section types reference
- How to add custom section type
- API documentation cho sections
- Migration guide

**Buoc 270:** Final QA
- Full regression test
- Cross-browser testing
- Accessibility audit
- Performance audit
- Clean up TODO comments
- Remove debug logs

---

## THU TU UU TIEN THUC HIEN

### Sprint 1 (Buoc 1-55): Foundation
- Types, interfaces, registry, factory, hooks
- Section editor infrastructure (wrapper, drag list, type picker, add button)
- Thoi gian uoc tinh: 3-4 ngay

### Sprint 2 (Buoc 56-95): Core Editors
- HTML, Slideshow, Chart, Timeline, Poll, Quote, Divider, Callout editors
- Thoi gian uoc tinh: 5-7 ngay

### Sprint 3 (Buoc 96-140): Advanced Editors
- Embed, Code, Table, Image, Gallery, Video, Audio, Map, Accordion, Tabs, Steps, Comparison, Numbers, CTA, Alert, ToggleList, File Download, Social Embed editors
- Section clipboard, undo/redo, templates, keyboard shortcuts
- Thoi gian uoc tinh: 7-10 ngay

### Sprint 4 (Buoc 141-195): Renderers & Preview
- All section renderers
- Preview system upgrade
- Lightbox, Table of Contents, animations, responsive, accessibility
- Thoi gian uoc tinh: 7-10 ngay

### Sprint 5 (Buoc 196-245): Integration
- ArticleEditor integration
- ArticleDetail integration
- Mock data, API updates
- UI/UX polish, animations, dark mode
- Thoi gian uoc tinh: 5-7 ngay

### Sprint 6 (Buoc 246-270): Testing & Optimization
- Testing, performance optimization, i18n, documentation
- Thoi gian uoc tinh: 3-5 ngay

**TONG THOI GIAN UOC TINH: 30-43 ngay lam viec**

---

## GHI CHU QUAN TRONG

1. **Backward Compatibility**: Luon giu lai `content: string` de bai viet cu van hoat dong
2. **Progressive Enhancement**: Bat dau voi cac section types co ban (HTML, Image, Quote), sau do them cac types phuc tap
3. **Performance First**: Lazy load tat ca editors va renderers
4. **Mobile First**: Moi section type phai responsive
5. **Dark Mode**: Support tu dau, khong de sau
6. **Accessibility**: ARIA, keyboard navigation, screen reader support
7. **i18n**: Tat ca labels/messages phai co ban tieng Viet va tieng Anh
8. **Save & Continue**: Dam bao tinh nang "Luu va them tiep" van hoat dong tot
9. **Content Mode Toggle**: Cho phep chuyen doi giua legacy HTML va sections
10. **No @longvhv packages**: Su dung mock/local implementations

---

## SO DO KIEN TRUC

```
ContentSection (Union Type)
  |
  +-- HtmlSectionData
  +-- SlideshowSectionData  
  +-- ChartSectionData
  +-- TimelineSectionData
  +-- PollSectionData
  +-- QuoteSectionData
  +-- EmbedSectionData
  +-- CodeSectionData
  +-- TableSectionData
  +-- ImageSectionData
  +-- GallerySectionData
  +-- VideoSectionData
  +-- AudioSectionData
  +-- AccordionSectionData
  +-- TabsSectionData
  +-- StepsSectionData
  +-- ComparisonSectionData
  +-- NumbersSectionData
  +-- CTASectionData
  +-- AlertSectionData
  +-- ToggleListSectionData
  +-- RelatedContentSectionData
  +-- SocialEmbedSectionData
  +-- FileDownloadSectionData
  +-- MapSectionData
  +-- DividerSectionData
  +-- CalloutSectionData

Article
  |
  +-- contentMode: 'legacy' | 'sections'
  +-- content: string (legacy HTML, auto-generated tu sections)
  +-- sections: ContentSection[] (new)

Editor Flow:
  ArticleEditorPage
    +-- ContentSectionEditor
          +-- SectionMiniMap (sidebar)
          +-- SectionDragList
          |     +-- SectionEditorWrapper (per section)
          |     |     +-- SectionToolbar
          |     |     +-- [SectionTypeEditor] (dynamic)
          |     +-- SectionAddButton (between sections)
          +-- SectionTypePicker (modal)

Preview Flow:
  ArticlePreview / ArticleDetail
    +-- ContentSectionsRenderer
          +-- SectionRenderer (per section)
                +-- [SectionTypeRenderer] (dynamic)
                      +-- HtmlSectionRenderer
                      +-- SlideshowSectionRenderer
                      +-- ChartSectionRenderer
                      +-- ... (etc)
```
