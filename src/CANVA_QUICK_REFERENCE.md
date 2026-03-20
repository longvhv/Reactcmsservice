# 🚀 Canva Advanced Features - Quick Reference

## 📦 5 New Components

### 1. DragDropManager
```tsx
import { DragDropManager } from './components/DragDropManager';

<DragDropManager
  canvasRef={canvasRef}
  onDrop={(item, position) => {
    // item: { type, data, preview, icon, label }
    // position: { x, y }
    addElementToCanvas(item, position);
  }}
/>
```

### 2. StickersPanel
```tsx
import { StickersPanel } from './components/StickersPanel';

<StickersPanel
  onSelectSticker={(sticker) => {
    // sticker: { id, name, icon, category, color }
    addStickerToCanvas(sticker);
  }}
  onClose={() => setShowStickers(false)}
  selectedStickerId={currentStickerId}
/>
```

### 3. UploadPanel
```tsx
import { UploadPanel } from './components/UploadPanel';

<UploadPanel
  onSelectFile={(file) => {
    // file: { id, name, size, type, url, category }
    addFileToCanvas(file);
  }}
  onClose={() => setShowUpload(false)}
  uploadedFiles={files}
  onUpload={async (files) => {
    // Handle file upload
    const urls = await uploadToServer(files);
    setUploadedFiles([...uploadedFiles, ...urls]);
  }}
  maxFileSize={50} // MB
  allowedTypes={['image/*', 'video/*']}
/>
```

### 4. ExportOptionsPanel
```tsx
import { ExportOptionsPanel } from './components/ExportOptionsPanel';

<ExportOptionsPanel
  onExport={async (options) => {
    // options: { format, quality, scale, width, height, etc. }
    await exportCanvas(canvasRef.current, options);
  }}
  onClose={() => setShowExport(false)}
  canvasWidth={1920}
  canvasHeight={1080}
/>
```

### 5. PositionPanel
```tsx
import { PositionPanel } from './components/PositionPanel';

<PositionPanel
  selectedElements={selectedElements}
  onUpdatePosition={(ids, updates) => {
    // Update elements with { x, y, width, height, rotation }
  }}
  onAlign={(type) => {
    // type: 'left', 'center-x', 'right', 'top', 'center-y', 'bottom'
  }}
  onDistribute={(type) => {
    // type: 'distribute-horizontal', 'distribute-vertical'
  }}
  onFlip={(direction) => {
    // direction: 'horizontal' | 'vertical'
  }}
  onRotate={(angle) => {}}
  onLock={(lock) => {}}
  onVisible={(visible) => {}}
  onGroup={() => {}}
  onUngroup={() => {}}
  onDuplicate={() => {}}
  onDelete={() => {}}
  canvasWidth={1920}
  canvasHeight={1080}
  showPanel={true}
/>
```

---

## 🎯 Common Use Cases

### Add Sticker to Canvas
```tsx
const addSticker = (sticker: Sticker) => {
  const element = {
    id: `sticker-${Date.now()}`,
    type: 'sticker',
    x: canvasWidth / 2 - 50,
    y: canvasHeight / 2 - 50,
    width: 100,
    height: 100,
    rotation: 0,
    stickerData: sticker,
  };
  setElements([...elements, element]);
};
```

### Upload and Add Image
```tsx
const handleUpload = async (files: File[]) => {
  const uploaded = await Promise.all(
    files.map(async (file) => ({
      id: Date.now() + Math.random(),
      name: file.name,
      url: URL.createObjectURL(file),
      type: file.type,
      size: file.size,
      category: getFileCategory(file.type),
      uploadedAt: new Date(),
    }))
  );
  setUploadedFiles([...uploadedFiles, ...uploaded]);
};
```

### Export Canvas
```tsx
const exportCanvas = async (options: ExportOptions) => {
  // Using html2canvas (install: npm install html2canvas)
  const html2canvas = (await import('html2canvas')).default;
  
  const canvas = await html2canvas(canvasRef.current!, {
    scale: options.scale,
    backgroundColor: options.transparent ? null : '#ffffff',
  });
  
  const dataUrl = canvas.toDataURL(
    `image/${options.format}`,
    options.quality === 'high' ? 0.95 : 0.7
  );
  
  downloadFile(dataUrl, `design.${options.format}`);
};

const downloadFile = (dataUrl: string, filename: string) => {
  const link = document.createElement('a');
  link.download = filename;
  link.href = dataUrl;
  link.click();
};
```

### Align Elements
```tsx
const alignElements = (type: string) => {
  const newElements = elements.map(el => {
    if (!selectedIds.includes(el.id)) return el;
    
    switch (type) {
      case 'left':
        return { ...el, x: 0 };
      case 'center-x':
        return { ...el, x: (canvasWidth - el.width) / 2 };
      case 'right':
        return { ...el, x: canvasWidth - el.width };
      case 'top':
        return { ...el, y: 0 };
      case 'center-y':
        return { ...el, y: (canvasHeight - el.height) / 2 };
      case 'bottom':
        return { ...el, y: canvasHeight - el.height };
      default:
        return el;
    }
  });
  
  setElements(newElements);
};
```

---

## 📊 Data Types

### DragItem
```typescript
interface DragItem {
  type: 'template' | 'background' | 'photo' | 'text-style' | 'sticker' | 'upload' | 'shape' | 'element';
  data: any;
  preview?: string;
  icon?: any;
  label?: string;
}
```

### Sticker
```typescript
interface Sticker {
  id: string;
  name: string;
  icon: LucideIcon;
  category: string;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
  tags?: string[];
}
```

### UploadedFile
```typescript
interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  thumbnail?: string;
  uploadedAt: Date;
  category: 'image' | 'video' | 'audio' | 'document' | 'other';
}
```

### ExportOptions
```typescript
interface ExportOptions {
  format: 'png' | 'jpg' | 'svg' | 'pdf' | 'mp4' | 'gif';
  quality: 'low' | 'medium' | 'high' | 'ultra';
  scale: number;
  width?: number;
  height?: number;
  preset?: string;
  transparent?: boolean;
  compressImages?: boolean;
  embedFonts?: boolean;
  flattenLayers?: boolean;
}
```

---

## 🎨 Styling Classes

All components use consistent Tailwind classes:

### Gradient Headers
```tsx
className="bg-gradient-to-r from-purple-600 to-indigo-600"  // Purple
className="bg-gradient-to-r from-pink-500 to-purple-500"    // Pink
className="bg-gradient-to-r from-blue-600 to-cyan-500"      // Blue
className="bg-gradient-to-r from-green-600 to-teal-500"     // Green
```

### Buttons
```tsx
// Primary
className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 rounded-xl"

// Secondary
className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg"

// Danger
className="bg-red-50 hover:bg-red-100 text-red-600 px-4 py-3 rounded-lg"
```

### Input Fields
```tsx
className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
```

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Ctrl/Cmd + Z` | Undo |
| `Ctrl/Cmd + Shift + Z` | Redo |
| `Ctrl/Cmd + D` | Duplicate |
| `Ctrl/Cmd + G` | Group |
| `Delete` | Delete selected |
| `Arrow Keys` | Nudge 1px |
| `Shift + Arrow` | Nudge 10px |
| `?` | Show shortcuts |

---

## 🔧 Configuration

### Customize Stickers
Edit `StickersPanel.tsx`:
```tsx
const stickerLibrary: Sticker[] = [
  {
    id: 'custom-1',
    name: 'Custom Icon',
    icon: YourIcon,
    category: 'custom',
    color: '#ff0000',
  },
  // Add more...
];
```

### Customize Export Presets
Edit `ExportOptionsPanel.tsx`:
```tsx
const SIZE_PRESETS = [
  {
    id: 'custom-preset',
    name: 'Custom Size',
    width: 2000,
    height: 2000,
    icon: Monitor,
  },
  // Add more...
];
```

### Customize Upload Limits
```tsx
<UploadPanel
  maxFileSize={100} // 100MB
  allowedTypes={['image/*', 'video/*', '.pdf']}
/>
```

---

## 🐛 Common Issues

### Issue: Drag preview not showing
**Solution:** Ensure `canvasRef` is properly set
```tsx
const canvasRef = useRef<HTMLDivElement>(null);
<div ref={canvasRef}>Canvas</div>
```

### Issue: Export produces blank image
**Solution:** Check canvas dimensions and scale
```tsx
const canvas = await html2canvas(element, {
  scale: 2,
  useCORS: true,
});
```

### Issue: Uploaded files not persisting
**Solution:** Store files in state or backend
```tsx
const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
// Save to localStorage or database
```

---

## 📦 Dependencies

Required packages:
```bash
npm install lucide-react
npm install html2canvas  # For export functionality
```

Optional packages:
```bash
npm install react-dnd  # For enhanced drag & drop
npm install file-saver  # For better file downloads
```

---

## 🎯 Performance Tips

1. **Lazy load panels** - Only render when visible
2. **Memoize callbacks** - Use `useCallback` for handlers
3. **Virtual scrolling** - For large sticker/upload lists
4. **Debounce search** - Use debounce for search inputs
5. **Optimize images** - Compress uploaded images

---

## 📚 Full Example

See `/components/CanvaAdvancedDemo.tsx` for a complete working example with all 5 components integrated.

---

## 🤝 Support

For questions or issues:
1. Check `/CANVA_ADVANCED_FEATURES.md` for detailed docs
2. Review `/components/CanvaAdvancedDemo.tsx` for examples
3. Inspect component source code for inline comments

---

**Last Updated:** December 30, 2025  
**Version:** 2.0.0  
**Status:** ✅ Production Ready
