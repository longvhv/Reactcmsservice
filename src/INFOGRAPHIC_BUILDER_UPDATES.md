# InfographicBuilderV2 - Cải tiến như Canva

## 📋 Tổng quan

InfographicBuilderV2 đã được cải tiến toàn diện với các tính năng chuyên nghiệp tương tự Canva, mang lại trải nghiệm thiết kế infographic mạnh mẽ và trực quan.

## ✨ Các tính năng mới

### 1. **AdvancedColorPicker Component** (`/components/AdvancedColorPicker.tsx`)

Bộ chọn màu nâng cao với đầy đủ tính năng:

**Chế độ Màu đơn:**
- 45+ màu preset được tổ chức theo bảng màu
- Recent colors (12 màu gần đây, lưu trong localStorage)
- Input màu hex với validation
- Color picker native của browser

**Chế độ Gradient:**
- 3 loại: Linear, Radial, Conic
- Điều chỉnh góc cho Linear gradient (0-360°)
- Quản lý nhiều color stops
- Thêm/xóa color stops
- 8 gradient presets đẹp mắt (Sunset, Ocean, Forest, Purple, Fire, Ice, Rose, Mint)

**Cách sử dụng:**
```tsx
<AdvancedColorPicker
  color="#3b82f6"
  gradient={gradientConfig}
  onChange={(color) => updateColor(color)}
  onGradientChange={(gradient) => updateGradient(gradient)}
  showGradient={true}
  label="Text Color / Gradient"
/>
```

### 2. **CanvasSizePresets Component** (`/components/CanvasSizePresets.tsx`)

Preset kích thước canvas cho nhiều mục đích:

**Social Media:**
- Instagram Post (1080×1080)
- Instagram Story (1080×1920)
- Facebook Post (1200×630)
- Facebook Cover (820×312)
- Twitter Post (1200×675)
- LinkedIn Post (1200×627)
- YouTube Thumbnail (1280×720)

**Web & Digital:**
- Blog Banner (1200×600)
- Email Header (600×200)
- Desktop Wallpaper (1920×1080)
- Mobile Wallpaper (1080×1920)

**Print:**
- A4 Portrait (2480×3508)
- A4 Landscape (3508×2480)
- Letter Portrait (2550×3300)
- Letter Landscape (3300×2550)

**Presentation:**
- 16:9 (1920×1080)
- 4:3 (1024×768)

**Cách sử dụng:**
```tsx
<CanvasSizePresets
  onSelect={(size) => {
    setCanvasWidth(size.width);
    setCanvasHeight(size.height);
  }}
  currentWidth={canvasWidth}
  currentHeight={canvasHeight}
/>
```

### 3. **TransformPanel Component** (`/components/TransformPanel.tsx`)

Panel điều khiển transform chính xác:

**Tính năng:**
- Position (X, Y) với input số
- Size (Width, Height) với validation (min 20px)
- Rotation (0-360°) với slider và input
- Quick rotation presets (0°, 90°, 180°, 270°)
- Lock/Unlock toggle với icon trực quan
- Disabled state khi object bị lock

**Cách sử dụng:**
```tsx
<TransformPanel
  x={element.x}
  y={element.y}
  width={element.width}
  height={element.height}
  rotation={element.rotation}
  locked={element.locked}
  onUpdate={(updates) => updateElement(id, updates)}
/>
```

### 4. **TextStylePresets Component** (`/components/TextStylePresets.tsx`)

17 text style presets chuyên nghiệp:

**Display Styles:**
- Display Large (72px, bold, -2 letter-spacing)
- Display Medium (56px, bold, -1.5 letter-spacing)
- Display Small (48px, bold, -1 letter-spacing)

**Headings:**
- H1 (36px, bold)
- H2 (30px, bold)
- H3 (24px, semibold)
- H4 (20px, semibold)
- H5 (18px, semibold)
- H6 (16px, semibold)

**Body Text:**
- Body Large (18px)
- Body Regular (16px)
- Body Small (14px)
- Caption (12px)

**Special:**
- Overline (12px, semibold, +1.5 letter-spacing)
- Button (14px, semibold)
- Quote (20px, medium)

**Cách sử dụng:**
```tsx
<TextStylePresets
  onSelect={(style) => applyStyle(style)}
  currentStyle={currentTextStyle}
/>
```

### 5. **Distribution Tools**

Phân bố đều các objects:

**Horizontal Distribution:**
- Sắp xếp objects theo trục X
- Tính toán khoảng cách đều giữa các objects
- Yêu cầu tối thiểu 3 objects

**Vertical Distribution:**
- Sắp xếp objects theo trục Y
- Tính toán khoảng cách đều giữa các objects
- Yêu cầu tối thiểu 3 objects

**Shortcuts trong toolbar:**
- Xuất hiện khi chọn 3+ objects
- Icons: AlignHorizontalSpaceAround, AlignVerticalSpaceAround

### 6. **Enhanced Alignment Tools**

Căn chỉnh nâng cao với 6 hướng:

**Horizontal:**
- Align Left
- Align Center
- Align Right

**Vertical:**
- Align Top
- Align Middle
- Align Bottom

**Visual Feedback:**
- Alignment guides (đường kẻ màu xanh)
- Threshold 5px cho snap-to-align
- Guides tự động ẩn sau khi thả chuột

### 7. **Rulers & Grid System**

**Grid Settings:**
- Show/Hide grid lines
- Snap to grid on/off
- Adjustable grid size (10-50px, step 5px)
- Visual grid overlay

**Rulers:**
- Toggle rulers on/off
- Measurement display
- Coordinated with grid

### 8. **Canvas Size Management**

**Dialog với nhiều options:**
- Browse presets theo category
- Input custom size (Width, Height)
- Min: 100px, Max: 5000px
- Real-time preview hiển thị current size
- Apply button để confirm

**Access:**
- Toolbar: Monitor icon
- Canvas tab: "Choose Preset Size" button
- Background panel: Manual width/height inputs

## 🎨 UI/UX Improvements

### Visual Indicators

**Selection Count:**
```tsx
{selectedElementIds.length > 0 && (
  <div className="px-3 py-2 bg-blue-50 text-blue-900 rounded-xl">
    {selectedElementIds.length} object{selectedElementIds.length > 1 ? 's' : ''} selected
  </div>
)}
```

**Drawing Mode:**
```tsx
{drawingMode && (
  <div className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-xl">
    <Pencil className="w-4 h-4" />
    <span>Click to add points. Minimum 3 points required.</span>
    <button>Finish ({drawingPoints.length} points)</button>
    <button>Cancel (Esc)</button>
  </div>
)}
```

**Text Editing:**
```tsx
{editingTextId && (
  <div className="flex items-center gap-2 bg-green-50 px-3 py-2 rounded-xl">
    <Edit3 className="w-4 h-4" />
    <span>Đang sửa text. Nhấn Esc hoặc click ra ngoài để hoàn tất.</span>
  </div>
)}
```

### Toolbar Organization

**Grouped by function:**
1. Add Elements (Text, Shapes, Charts, Icons, Images, Draw)
2. Edit Actions (Undo, Redo)
3. Selection Tools (Copy, Duplicate, Delete)
4. Alignment Tools (Left, Center, Right, Top, Middle, Bottom)
5. Distribution Tools (Horizontal, Vertical)
6. Group/Ungroup
7. Transform (Flip, Lock, Layer Order)
8. View Controls (Zoom, Grid, Rulers, Canvas Size)
9. Import/Export

### Panel Tabs

**5 tabs trong right sidebar:**
1. **Properties**: Element-specific settings
2. **Effects**: Shadows, gradients, filters
3. **Templates**: Pre-made designs
4. **Canvas**: Background, grid, size settings
5. **Styles**: Text style presets (NEW!)

## 🚀 Performance Optimizations

1. **useCallback for expensive functions**: undo, redo, alignment
2. **Lazy loading**: html2canvas only when exporting
3. **Conditional rendering**: Heavy panels only when active
4. **Memoized calculations**: Snap to grid, alignment guides
5. **Debounced updates**: History updates on mouse up

## 🎯 Integration với CMS

### ArticleEditor Integration

InfographicBuilderV2 được tích hợp sẵn trong ArticleEditor:

```tsx
import { InfographicBuilder } from './InfographicBuilderV2';

// State
const [infographicElements, setInfographicElements] = useState<any[]>([]);
const [showInfographicEditor, setShowInfographicEditor] = useState(false);

// Usage
{articleType === 'infographic' && (
  <InfographicBuilder
    onChange={setInfographicElements}
    initialElements={infographicElements}
  />
)}
```

### Saving Infographics

```tsx
const saveArticle = () => {
  const articleData = {
    type: 'infographic',
    elements: infographicElements,
    canvasWidth,
    canvasHeight,
    canvasBackground,
    // ... other fields
  };
  onSave(articleData);
};
```

## 📦 Dependencies

**Đã được thêm:**
- `lucide-react`: Icons (Columns, AlignHorizontalSpaceAround, AlignVerticalSpaceAround, Ruler, Monitor, Type as TypeIcon)
- `recharts`: Charts (đã có sẵn)
- `html2canvas`: Export PNG (lazy loaded)

**Components mới:**
- `/components/AdvancedColorPicker.tsx`
- `/components/CanvasSizePresets.tsx`
- `/components/TransformPanel.tsx`
- `/components/TextStylePresets.tsx`

## 🔧 Configuration

### Default Values

```tsx
const [canvasWidth, setCanvasWidth] = useState(800);
const [canvasHeight, setCanvasHeight] = useState(1000);
const [canvasBackground, setCanvasBackground] = useState('#ffffff');
const [gridSize, setGridSize] = useState(20);
const [showGridLines, setShowGridLines] = useState(true);
const [snapToGrid, setSnapToGrid] = useState(true);
const [showRulers, setShowRulers] = useState(true);
const [zoom, setZoom] = useState(100);
```

### Customization

Dễ dàng customize thông qua:
- Color presets trong `AdvancedColorPicker`
- Gradient presets
- Canvas size presets
- Text style presets
- Grid size range (10-50px)
- Zoom range (25-200%)

## 📱 Responsive Design

- Dialog modals với `max-w-*` classes
- Scrollable content areas với `overflow-y-auto`
- Mobile-friendly touch targets (min 44×44px)
- Responsive grid layouts
- Hide text labels on small screens (`hidden lg:inline`)

## 🌐 Internationalization

Sử dụng `useLanguage()` hook:
- Vietnamese labels
- Contextual hints
- Error messages
- Tooltips

## 🎨 Design System Compliance

**Colors:**
- Primary: Blue (#3b82f6)
- Secondary: Purple (#8b5cf6)
- Accent: Pink (#ec4899)
- Success: Green (#10b981)
- Neutral: Slate scale

**Spacing:**
- 4px grid system
- Consistent gap sizes (1, 2, 3, 4)
- Border radius: 8px, 12px, 16px, 20px

**Typography:**
- Font: Inter
- Weights: normal, medium (500), semibold (600), bold (700)
- Sizes follow T-shirt sizing

## 🐛 Known Issues & Limitations

1. **SVG Export**: Chưa implement (placeholder)
2. **AI Generation**: Mock implementation
3. **Image Filters**: Chưa có (chỉ có blur)
4. **Undo/Redo Limit**: Không giới hạn (có thể tốn memory với designs lớn)
5. **Custom Fonts**: Chỉ hỗ trợ web-safe fonts + Google Fonts cơ bản

## 🔮 Future Enhancements

1. Real AI integration (GPT-4, DALL-E)
2. SVG export implementation
3. More filters (brightness, contrast, saturation)
4. Animation timeline
5. Collaboration features
6. Component library/symbols
7. Brand kit management
8. Magic resize (auto-adjust elements when changing canvas size)
9. Smart guides (suggest alignment)
10. Plugins system

## 📚 Documentation Links

- **Lucide Icons**: https://lucide.dev
- **Recharts**: https://recharts.org
- **Tailwind CSS**: https://tailwindcss.com
- **React**: https://react.dev

## 🎓 Best Practices

1. **Performance**: Sử dụng keyboard shortcuts thay vì mouse clicks
2. **Organization**: Đặt tên layers rõ ràng, group related elements
3. **Consistency**: Sử dụng text style presets thay vì custom styles
4. **Workflow**: Templates → Customize → Save as new template
5. **Export**: Luôn export JSON backup trước khi export PNG/SVG

---

Được phát triển với ❤️ để mang lại trải nghiệm thiết kế infographic tốt nhất!
