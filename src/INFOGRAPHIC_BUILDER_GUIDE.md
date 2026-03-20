# 📊 Infographic Builder - Hướng dẫn Sử dụng

## Tổng quan

Infographic Builder là công cụ kéo thả (drag & drop) tích hợp AI để tạo infographic trực quan và chuyên nghiệp ngay trong CMS. Công cụ này được tích hợp hoàn toàn vào ArticleEditor khi chọn loại bài viết "Infographic".

## Tính năng Chính

### 🎨 Canvas & Elements
- **Canvas workspace**: Không gian làm việc 800x1000px (có thể zoom từ 25% - 200%)
- **Drag & Drop**: Kéo thả các elements để sắp xếp
- **Multi-layer support**: Quản lý layers với z-index tự động

### 🧩 Loại Elements

1. **Text** (Văn bản)
   - Font size tùy chỉnh
   - Căn chỉnh: trái, giữa, phải
   - Màu chữ và nền
   - Font weight

2. **Shape** (Hình)
   - Rectangle (hình chữ nhật)
   - Circle (hình tròn)
   - Arrow (mũi tên)
   - Màu nền tùy chỉnh

3. **Chart** (Biểu đồ)
   - Bar chart (biểu đồ cột)
   - Pie chart (biểu đồ tròn)
   - Line chart (biểu đồ đường)
   - Data visualization

4. **Image** (Hình ảnh)
   - Upload từ máy tính
   - Từ thư viện media

### 🤖 AI Assistant

**Tính năng AI**:
- Generate infographic từ text prompt
- Suggest layouts tự động
- Auto-arrange elements
- Gợi ý templates phổ biến

**Cách sử dụng**:
1. Click nút "AI Assistant" trên toolbar
2. Nhập mô tả infographic muốn tạo
3. Chọn từ các gợi ý có sẵn hoặc nhập custom prompt
4. Click "Tạo với AI" để tự động generate

**Ví dụ prompts**:
- "Timeline 5 năm phát triển"
- "So sánh 3 sản phẩm"
- "Thống kê doanh số theo quý"
- "Quy trình 5 bước phát triển sản phẩm"

### 🛠️ Toolbar Functions

#### Thêm Elements
- Text icon: Thêm văn bản
- Square icon: Thêm hình
- Chart icon: Thêm biểu đồ
- Image icon: Thêm hình ảnh

#### Element Actions (khi đã chọn element)
- **Copy**: Nhân bản element
- **Lock/Unlock**: Khóa element để không thể di chuyển
- **Delete**: Xóa element

#### Zoom Controls
- Zoom Out: Thu nhỏ (min 25%)
- Zoom In: Phóng to (max 200%)
- Hiển thị % zoom hiện tại

### 📋 Properties Panel

Khi chọn một element, panel bên phải hiển thị các thuộc tính:

**Text Properties**:
- Nội dung (textarea)
- Font size (number)
- Màu chữ (color picker)
- Căn chỉnh (left/center/right)

**Shape Properties**:
- Loại hình (rectangle/circle/arrow)
- Màu nền (color picker)

**Chart Properties**:
- Loại biểu đồ (bar/pie/line)
- Dữ liệu chart

**Common Properties** (tất cả elements):
- Chiều rộng (width)
- Chiều cao (height)
- Góc xoay (0-360°)

### 🎭 Layers Panel

**Quản lý layers**:
- Hiển thị tất cả elements theo thứ tự z-index
- Click để chọn element
- Toggle visibility (show/hide)
- Hiển thị trạng thái locked

**Layer info**:
- Icon type (text/shape/chart/image)
- Tên element hoặc nội dung
- Visibility toggle
- Lock indicator

### 💾 Export & Save

- **Export**: Xuất infographic dạng PNG/SVG
- **Auto-save**: Tự động lưu vào article data
- Elements được lưu dưới dạng JSON để có thể edit sau

## Workflow Sử dụng

### Cách 1: Tạo thủ công

1. Chọn loại bài viết "Infographic" trong ArticleEditor
2. Thêm elements từ toolbar
3. Drag & drop để sắp xếp
4. Chỉnh sửa properties trong panel bên phải
5. Quản lý layers và visibility
6. Export hoặc lưu

### Cách 2: Sử dụng AI

1. Chọn loại bài viết "Infographic"
2. Click "AI Assistant"
3. Nhập prompt mô tả infographic
4. AI tự động generate layout và elements
5. Chỉnh sửa, tinh chỉnh theo ý muốn
6. Export hoặc lưu

## Keyboard Shortcuts

- **Delete**: Xóa element đang chọn
- **Ctrl/Cmd + D**: Nhân bản element
- **Ctrl/Cmd + L**: Lock/Unlock element
- **Ctrl/Cmd + +**: Zoom in
- **Ctrl/Cmd + -**: Zoom out

## Tips & Best Practices

### 🎯 Layout
- Sử dụng grid mental để căn chỉnh elements
- Giữ khoảng cách đồng đều giữa các elements
- Hierarchy rõ ràng: tiêu đề lớn, nội dung nhỏ hơn

### 🎨 Design
- Giới hạn 2-3 màu chính cho consistency
- Sử dụng contrast để làm nổi bật thông tin quan trọng
- Font size: Tiêu đề 24-32px, nội dung 14-18px

### 📊 Data Visualization
- Chọn loại chart phù hợp với dữ liệu
- Bar chart: so sánh số liệu
- Pie chart: tỷ lệ phần trăm
- Line chart: xu hướng theo thời gian

### 🤖 AI Prompts
- Càng cụ thể càng tốt
- Nêu rõ số lượng bước/items
- Chỉ định màu sắc nếu muốn
- Ví dụ tốt: "Tạo timeline 5 bước quy trình tuyển dụng với màu xanh dương"

## Kích thước Template

- **Chuẩn**: 800x1000px (blog post)
- **Instagram**: 1080x1080px (square)
- **Facebook**: 1200x628px (landscape)
- **LinkedIn**: 1024x512px (banner)

## Technical Details

### Data Structure

```typescript
interface InfographicElement {
  id: string;
  type: 'text' | 'shape' | 'chart' | 'image' | 'icon';
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  locked: boolean;
  visible: boolean;
  zIndex: number;
  // Type-specific properties
  content?: string;
  fontSize?: number;
  color?: string;
  backgroundColor?: string;
  shapeType?: 'rectangle' | 'circle' | 'arrow';
  chartType?: 'bar' | 'pie' | 'line';
  chartData?: any;
}
```

### Integration với ArticleEditor

- Component: `/components/InfographicBuilder.tsx`
- Integration: `/components/ArticleEditor.tsx`
- Hiển thị khi `articleType === 'infographic'`
- Data được lưu trong `infographicElements` array

### Future Enhancements

- [ ] Thêm templates có sẵn
- [ ] Import từ Figma
- [ ] Collaboration real-time
- [ ] Export đa format (SVG, PDF, PNG)
- [ ] Animation support
- [ ] Icon library integration
- [ ] Image filters & effects
- [ ] Undo/Redo functionality
- [ ] Group elements
- [ ] Alignment guides
- [ ] Smart snap to grid

## Support

Nếu gặp vấn đề hoặc có góp ý, vui lòng liên hệ team phát triển.

---

**Version**: 1.0.0  
**Last Updated**: 2024  
**Design System**: Modern & Elegant (Stripe/Vercel/Linear style)
