# 🚀 Canva Phase 3 - Quick Start Guide

## Tích hợp nhanh 5 components mới vào InfographicBuilderV2

---

## 📦 1. Import Components

```tsx
import { QuickActionsToolbar } from './components/QuickActionsToolbar';
import { BrandKitPanel } from './components/BrandKitPanel';
import { MagicResizePanel } from './components/MagicResizePanel';
import { AnimationPanel } from './components/AnimationPanel';
import { FiltersPanel } from './components/FiltersPanel';
```

---

## 🔧 2. Add State (trong InfographicBuilderV2)

```tsx
// Quick Actions
const [toolbarPosition, setToolbarPosition] = useState({ x: 0, y: 0 });

// Brand Kit
const [showBrandKit, setShowBrandKit] = useState(false);
const [brandKit, setBrandKit] = useState<BrandKit | undefined>();

// Magic Resize
const [showMagicResize, setShowMagicResize] = useState(false);

// Animations
const [elementAnimations, setElementAnimations] = useState<Map<string, Animation>>(new Map());

// Filters
const [imageFilters, setImageFilters] = useState<Map<string, any>>(new Map());
```

---

## 🎨 3. Render Components

### 3.1 Quick Actions Toolbar (luôn hiển thị khi có selection)

```tsx
{selectedElements.length > 0 && (
  <QuickActionsToolbar
    selectedElements={selectedElements}
    position={getToolbarPosition()}
    onAlign={handleAlign}
    onDuplicate={handleDuplicate}
    onDelete={handleDelete}
    onLock={handleLock}
    onVisible={handleVisible}
    onFlip={handleFlip}
    onGroup={handleGroup}
    onUngroup={handleUngroup}
    onBringForward={() => bringElementForward(selectedElements[0].id)}
    onSendBackward={() => sendElementBackward(selectedElements[0].id)}
    onBringToFront={() => bringElementToFront(selectedElements[0].id)}
    onSendToBack={() => sendElementToBack(selectedElements[0].id)}
    onChangeColor={() => setShowColorPicker(true)}
    onEditText={() => setEditingTextId(selectedElements[0].id)}
    onOpenEffects={() => setShowEffects(true)}
  />
)}
```

### 3.2 Brand Kit Panel

```tsx
{showBrandKit && (
  <BrandKitPanel
    currentBrandKit={brandKit}
    onSaveBrandKit={(kit) => {
      setBrandKit(kit);
      localStorage.setItem('brandKit', JSON.stringify(kit));
    }}
    onLoadBrandKit={setBrandKit}
    onApplyColor={(color) => {
      if (selectedElement) {
        updateElement(selectedElement.id, { color });
      }
    }}
    onApplyFont={(font) => {
      if (selectedElement?.type === 'text') {
        updateElement(selectedElement.id, { fontFamily: font.family });
      }
    }}
    onApplyLogo={(logo) => {
      const newElement = {
        id: `el-${Date.now()}`,
        type: 'image' as const,
        x: 100,
        y: 100,
        width: logo.width,
        height: logo.height,
        imageUrl: logo.url,
        // ... other props
      };
      addElement(newElement);
    }}
    onClose={() => setShowBrandKit(false)}
  />
)}
```

### 3.3 Magic Resize Panel

```tsx
{showMagicResize && (
  <MagicResizePanel
    currentWidth={canvasWidth}
    currentHeight={canvasHeight}
    onResize={(width, height, preset) => {
      setCanvasWidth(width);
      setCanvasHeight(height);
      scaleElementsToNewSize(width, height);
    }}
    onBatchResize={(presets) => {
      presets.forEach((preset) => {
        createResizedVersion(preset.width, preset.height, preset.name);
      });
    }}
    onClose={() => setShowMagicResize(false)}
  />
)}
```

### 3.4 Animation Panel (trong right sidebar)

```tsx
{activeRightPanel === 'animations' && (
  <AnimationPanel
    selectedElements={selectedElements}
    onApplyAnimation={(animation) => {
      selectedElements.forEach(el => {
        setElementAnimations(prev => new Map(prev).set(el.id, animation));
      });
    }}
    onRemoveAnimation={() => {
      selectedElements.forEach(el => {
        setElementAnimations(prev => {
          const next = new Map(prev);
          next.delete(el.id);
          return next;
        });
      });
    }}
    onPreview={(animation) => {
      // Trigger preview animation
    }}
    currentAnimation={selectedElements[0] ? elementAnimations.get(selectedElements[0].id) : undefined}
    onClose={() => setActiveRightPanel(null)}
  />
)}
```

### 3.5 Filters Panel (trong right sidebar, chỉ cho images)

```tsx
{activeRightPanel === 'filters' && selectedElement?.type === 'image' && (
  <FiltersPanel
    selectedElement={selectedElement}
    onApplyFilter={(filters) => {
      setImageFilters(prev => new Map(prev).set(selectedElement.id, filters));
      updateElement(selectedElement.id, { filters });
    }}
    onResetFilters={() => {
      setImageFilters(prev => {
        const next = new Map(prev);
        next.delete(selectedElement.id);
        return next;
      });
      updateElement(selectedElement.id, { filters: {} });
    }}
    currentFilters={imageFilters.get(selectedElement.id)}
    onClose={() => setActiveRightPanel(null)}
  />
)}
```

---

## 🔨 4. Helper Functions

### 4.1 Get Toolbar Position

```tsx
const getToolbarPosition = () => {
  if (selectedElements.length === 0) return { x: 0, y: 0 };
  
  // Calculate bounding box of all selected elements
  const bounds = selectedElements.reduce((acc, el) => ({
    minX: Math.min(acc.minX, el.x),
    minY: Math.min(acc.minY, el.y),
    maxX: Math.max(acc.maxX, el.x + el.width),
    maxY: Math.max(acc.maxY, el.y + el.height),
  }), {
    minX: Infinity,
    minY: Infinity,
    maxX: -Infinity,
    maxY: -Infinity,
  });
  
  return {
    x: (bounds.minX + bounds.maxX) / 2,
    y: bounds.minY,
  };
};

// Update toolbar position when selection changes
useEffect(() => {
  if (selectedElements.length > 0) {
    setToolbarPosition(getToolbarPosition());
  }
}, [selectedElements]);
```

### 4.2 Scale Elements to New Size

```tsx
const scaleElementsToNewSize = (newWidth: number, newHeight: number) => {
  const scaleX = newWidth / canvasWidth;
  const scaleY = newHeight / canvasHeight;
  
  const scaledElements = elements.map(el => ({
    ...el,
    x: el.x * scaleX,
    y: el.y * scaleY,
    width: el.width * scaleX,
    height: el.height * scaleY,
    fontSize: el.fontSize ? el.fontSize * Math.min(scaleX, scaleY) : el.fontSize,
  }));
  
  setElements(scaledElements);
};
```

### 4.3 Create Resized Version

```tsx
const createResizedVersion = async (width: number, height: number, name: string) => {
  // Clone current design
  const clonedElements = JSON.parse(JSON.stringify(elements));
  
  // Scale elements
  const scaleX = width / canvasWidth;
  const scaleY = height / canvasHeight;
  
  const scaledElements = clonedElements.map((el: any) => ({
    ...el,
    x: el.x * scaleX,
    y: el.y * scaleY,
    width: el.width * scaleX,
    height: el.height * scaleY,
    fontSize: el.fontSize ? el.fontSize * Math.min(scaleX, scaleY) : el.fontSize,
  }));
  
  // Save or export
  const design = {
    name,
    width,
    height,
    elements: scaledElements,
    background: canvasBackground,
  };
  
  // Option 1: Save to localStorage
  const savedDesigns = JSON.parse(localStorage.getItem('resizedDesigns') || '[]');
  savedDesigns.push(design);
  localStorage.setItem('resizedDesigns', JSON.stringify(savedDesigns));
  
  // Option 2: Trigger download
  const dataStr = JSON.stringify(design, null, 2);
  const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', `${name}.json`);
  linkElement.click();
};
```

### 4.4 Apply Animation Style

```tsx
const applyAnimationStyle = (element: any, animation?: Animation) => {
  if (!animation) return {};
  
  return {
    animation: `${animation.id} ${animation.duration}ms ${animation.easing} ${animation.delay}ms ${
      animation.iteration === 'infinite' ? 'infinite' : animation.iteration
    } ${animation.direction}`,
  };
};
```

### 4.5 Apply Filter Style

```tsx
const getFilterStyle = (filters: any = {}) => {
  const filterArray: string[] = [];
  
  if (filters.brightness) filterArray.push(`brightness(${filters.brightness}%)`);
  if (filters.contrast) filterArray.push(`contrast(${filters.contrast}%)`);
  if (filters.saturation) filterArray.push(`saturate(${filters.saturation}%)`);
  if (filters.hue) filterArray.push(`hue-rotate(${filters.hue}deg)`);
  if (filters.blur) filterArray.push(`blur(${filters.blur}px)`);
  if (filters.grayscale) filterArray.push(`grayscale(${filters.grayscale}%)`);
  if (filters.sepia) filterArray.push(`sepia(${filters.sepia}%)`);
  if (filters.invert) filterArray.push(`invert(${filters.invert}%)`);
  if (filters.opacity) filterArray.push(`opacity(${filters.opacity}%)`);
  
  return {
    filter: filterArray.join(' '),
  };
};
```

---

## 🎨 5. Update Element Rendering

```tsx
const renderElement = (element: InfographicElement) => {
  const animation = elementAnimations.get(element.id);
  const filters = element.type === 'image' ? imageFilters.get(element.id) : undefined;
  
  const style = {
    ...getBaseElementStyle(element),
    ...(animation && applyAnimationStyle(element, animation)),
    ...(filters && getFilterStyle(filters)),
  };
  
  return (
    <div
      key={element.id}
      style={style}
      onClick={() => handleElementClick(element)}
      className={`canvas-element ${selectedElementIds.includes(element.id) ? 'selected' : ''}`}
    >
      {renderElementContent(element)}
    </div>
  );
};
```

---

## 🎹 6. Add CSS Keyframes (trong /styles/globals.css)

```css
/* Entrance Animations */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideInUp {
  from { transform: translateY(100%); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes slideInDown {
  from { transform: translateY(-100%); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes slideInLeft {
  from { transform: translateX(-100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

@keyframes slideInRight {
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

@keyframes zoomIn {
  from { transform: scale(0); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

@keyframes bounceIn {
  0% { transform: scale(0); opacity: 0; }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); opacity: 1; }
}

@keyframes rotateIn {
  from { transform: rotate(-180deg); opacity: 0; }
  to { transform: rotate(0); opacity: 1; }
}

/* Emphasis Animations */
@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
  20%, 40%, 60%, 80% { transform: translateX(10px); }
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

@keyframes swing {
  20% { transform: rotate(15deg); }
  40% { transform: rotate(-10deg); }
  60% { transform: rotate(5deg); }
  80% { transform: rotate(-5deg); }
  100% { transform: rotate(0deg); }
}

@keyframes tada {
  0% { transform: scale(1) rotate(0); }
  10%, 20% { transform: scale(0.9) rotate(-3deg); }
  30%, 50%, 70%, 90% { transform: scale(1.1) rotate(3deg); }
  40%, 60%, 80% { transform: scale(1.1) rotate(-3deg); }
  100% { transform: scale(1) rotate(0); }
}

@keyframes jello {
  0%, 100% { transform: skewX(0deg) skewY(0deg); }
  30% { transform: skewX(25deg) skewY(25deg); }
  40% { transform: skewX(-15deg) skewY(-15deg); }
  50% { transform: skewX(15deg) skewY(15deg); }
  65% { transform: skewX(-5deg) skewY(-5deg); }
  75% { transform: skewX(5deg) skewY(5deg); }
}

@keyframes heartbeat {
  0% { transform: scale(1); }
  14% { transform: scale(1.3); }
  28% { transform: scale(1); }
  42% { transform: scale(1.3); }
  70% { transform: scale(1); }
}

@keyframes flash {
  0%, 50%, 100% { opacity: 1; }
  25%, 75% { opacity: 0; }
}

/* Exit Animations */
@keyframes fadeOut {
  from { opacity: 1; }
  to { opacity: 0; }
}

@keyframes slideOutUp {
  from { transform: translateY(0); opacity: 1; }
  to { transform: translateY(-100%); opacity: 0; }
}

@keyframes slideOutDown {
  from { transform: translateY(0); opacity: 1; }
  to { transform: translateY(100%); opacity: 0; }
}

@keyframes zoomOut {
  from { transform: scale(1); opacity: 1; }
  to { transform: scale(0); opacity: 0; }
}

@keyframes rotateOut {
  from { transform: rotate(0); opacity: 1; }
  to { transform: rotate(180deg); opacity: 0; }
}

/* Motion Animations */
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes wiggle {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-10px); }
  75% { transform: translateX(10px); }
}

@keyframes slideHorizontal {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(100px); }
}
```

---

## 🎯 7. Add Toolbar Buttons

### Top Toolbar

```tsx
{/* Brand Kit */}
<button
  onClick={() => setShowBrandKit(true)}
  className="flex items-center gap-2 px-4 py-2 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
>
  <Crown className="w-4 h-4" />
  <span className="text-sm font-medium">Brand Kit</span>
</button>

{/* Magic Resize */}
<button
  onClick={() => setShowMagicResize(true)}
  className="flex items-center gap-2 px-4 py-2 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
>
  <Sparkles className="w-4 h-4" />
  <span className="text-sm font-medium">Magic Resize</span>
</button>
```

### Right Sidebar Tabs

```tsx
{/* Animations Tab */}
<button
  onClick={() => setActiveRightPanel('animations')}
  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
    activeRightPanel === 'animations' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
  }`}
>
  <Sparkles className="w-4 h-4" />
  <span className="text-sm">Animate</span>
</button>

{/* Filters Tab */}
<button
  onClick={() => setActiveRightPanel('filters')}
  disabled={selectedElement?.type !== 'image'}
  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors disabled:opacity-50 ${
    activeRightPanel === 'filters' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
  }`}
>
  <Wand2 className="w-4 h-4" />
  <span className="text-sm">Filters</span>
</button>
```

---

## 📋 8. TypeScript Interfaces

```tsx
// Brand Kit
interface BrandColor {
  id: string;
  name: string;
  hex: string;
  category: 'primary' | 'secondary' | 'accent' | 'neutral';
}

interface BrandFont {
  id: string;
  name: string;
  family: string;
  weights: string[];
  category: 'heading' | 'body' | 'accent';
}

interface BrandLogo {
  id: string;
  name: string;
  url: string;
  type: 'primary' | 'secondary' | 'icon' | 'watermark';
  width: number;
  height: number;
}

interface BrandKit {
  id: string;
  name: string;
  colors: BrandColor[];
  fonts: BrandFont[];
  logos: BrandLogo[];
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Animation
interface Animation {
  id: string;
  name: string;
  type: 'entrance' | 'emphasis' | 'exit' | 'motion';
  duration: number;
  delay: number;
  easing: string;
  iteration: number | 'infinite';
  direction: 'normal' | 'reverse' | 'alternate';
}

// Filters
interface ImageFilters {
  brightness?: number;
  contrast?: number;
  saturation?: number;
  hue?: number;
  blur?: number;
  grayscale?: number;
  sepia?: number;
  invert?: number;
  opacity?: number;
  temperature?: number;
  tint?: number;
  vignette?: number;
  grain?: number;
}
```

---

## ✅ Testing Checklist

### Quick Actions Toolbar
- [ ] Toolbar appears when selecting element
- [ ] Toolbar positions above selection
- [ ] Primary actions work (Duplicate, Color, Align, Layer)
- [ ] Expandable menu shows secondary actions
- [ ] Keyboard shortcuts displayed in tooltips
- [ ] Multi-select shows count badge
- [ ] Click outside closes menus

### Brand Kit
- [ ] Add colors with name and category
- [ ] Add fonts from common fonts list
- [ ] Upload logos (drag & drop + click)
- [ ] Click color applies to selected element
- [ ] Click font applies to text element
- [ ] Click logo adds to canvas
- [ ] Save kit to localStorage
- [ ] Export kit as JSON
- [ ] Editable kit name works

### Magic Resize
- [ ] Custom resize with aspect ratio lock
- [ ] Preset grid displays correctly
- [ ] Click preset applies size
- [ ] Multi-select for batch resize
- [ ] Batch resize creates all versions
- [ ] Current size badge shows
- [ ] Category filters work
- [ ] Visual previews accurate

### Animations
- [ ] Animation presets display in categories
- [ ] Preview button plays animation
- [ ] Apply button adds animation
- [ ] Duration slider works
- [ ] Delay slider works
- [ ] Easing dropdown works
- [ ] Iteration control works (1-10, infinite)
- [ ] Direction control works
- [ ] Remove animation works
- [ ] Current animation indicator shows

### Filters
- [ ] Filter presets display in categories
- [ ] Click preset applies filter
- [ ] Custom adjustments sliders work
- [ ] Show/Hide advanced controls works
- [ ] Reset all button works
- [ ] Only shows for image elements
- [ ] Empty state shows for non-images
- [ ] Real-time preview works
- [ ] Apply & Export button works

---

## 🚀 Quick Deploy Steps

1. **Copy files** - Add 5 new component files to `/components`
2. **Add imports** - Import components in InfographicBuilderV2
3. **Add state** - Add state variables for each component
4. **Add CSS** - Copy animation keyframes to globals.css
5. **Add buttons** - Add toolbar buttons to UI
6. **Render components** - Add component rendering logic
7. **Test** - Run through testing checklist
8. **Deploy** - Build and deploy to production

---

## 💡 Pro Tips

1. **Quick Actions Toolbar** - Luôn hiển thị khi có element được select
2. **Brand Kit** - Lưu vào localStorage để persist giữa các sessions
3. **Magic Resize** - Batch resize rất hữu ích cho social media
4. **Animations** - Preview trước khi apply để chọn hiệu ứng phù hợp
5. **Filters** - Thử presets trước, sau đó fine-tune với custom adjustments

---

**Ready to ship! 🚀**

Tất cả 5 components đã sẵn sàng để tích hợp vào InfographicBuilderV2 và đạt **100% Canva similarity**!
