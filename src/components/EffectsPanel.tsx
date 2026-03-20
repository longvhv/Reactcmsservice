import { useState } from 'react';
import { 
  Droplet, Sliders, Eye, Blend, Sparkles, Image as ImageIcon,
  Sun, Moon, Contrast, Zap, Wind, Waves, Aperture
} from 'lucide-react';

interface EffectsPanelProps {
  selectedElement: any;
  onUpdateElement: (updates: any) => void;
}

const blendModes = [
  'normal', 'multiply', 'screen', 'overlay', 'darken', 'lighten',
  'color-dodge', 'color-burn', 'hard-light', 'soft-light', 
  'difference', 'exclusion', 'hue', 'saturation', 'color', 'luminosity'
];

const filterPresets = [
  { name: 'Không', filter: '' },
  { name: 'Xám', filter: 'grayscale(100%)' },
  { name: 'Nâu cũ', filter: 'sepia(100%)' },
  { name: 'Cổ điển', filter: 'sepia(50%) contrast(120%) brightness(110%)' },
  { name: 'Ấm', filter: 'sepia(30%) saturate(120%) brightness(105%)' },
  { name: 'Lạnh', filter: 'hue-rotate(180deg) saturate(90%)' },
  { name: 'Tương phản cao', filter: 'contrast(150%) brightness(105%)' },
  { name: 'Sáng', filter: 'brightness(130%) saturate(110%)' },
  { name: 'Tối', filter: 'brightness(70%) contrast(110%)' },
  { name: 'Rực rỡ', filter: 'saturate(200%) contrast(120%)' },
];

export function EffectsPanel({ selectedElement, onUpdateElement }: EffectsPanelProps) {
  const [activeSection, setActiveSection] = useState<'shadow' | 'blur' | 'blend' | 'filters' | 'advanced'>('shadow');

  if (!selectedElement) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center px-6 text-muted-foreground">
        <Sparkles className="w-12 h-12 mb-3 opacity-30" />
        <p className="text-sm mb-1">Chưa chọn phần tử</p>
        <p className="text-xs">Chọn phần tử để áp dụng hiệu ứng</p>
      </div>
    );
  }

  // Default values
  const shadow = selectedElement.shadow || { enabled: false, x: 0, y: 4, blur: 8, spread: 0, color: 'rgba(0,0,0,0.15)' };
  const blur = selectedElement.blur || 0;
  const opacity = selectedElement.opacity !== undefined ? selectedElement.opacity : 1;
  const blendMode = selectedElement.blendMode || 'normal';
  const filters = selectedElement.filters || '';

  const renderShadowSection = () => (
    <div className="space-y-4">
      {/* Enable/Disable */}
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium flex items-center gap-2">
          <Droplet className="w-4 h-4" />
          Hiệu ứng bóng
        </label>
        <button
          onClick={() => onUpdateElement({
            shadow: { ...shadow, enabled: !shadow.enabled }
          })}
          className={`
            relative w-11 h-6 rounded-full transition-colors duration-200
            ${shadow.enabled ? 'bg-blue-500' : 'bg-muted'}
          `}
        >
          <div className={`
            absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-200
            ${shadow.enabled ? 'translate-x-5' : 'translate-x-0'}
          `} />
        </button>
      </div>

      {shadow.enabled && (
        <div className="space-y-3 pl-6">
          {/* X Offset */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs text-muted-foreground">Dịch chuyển X</label>
              <span className="text-xs font-medium">{shadow.x}px</span>
            </div>
            <input
              type="range"
              min="-50"
              max="50"
              value={shadow.x}
              onChange={(e) => onUpdateElement({
                shadow: { ...shadow, x: Number(e.target.value) }
              })}
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider-thumb"
            />
          </div>

          {/* Y Offset */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs text-muted-foreground">Dịch chuyển Y</label>
              <span className="text-xs font-medium">{shadow.y}px</span>
            </div>
            <input
              type="range"
              min="-50"
              max="50"
              value={shadow.y}
              onChange={(e) => onUpdateElement({
                shadow: { ...shadow, y: Number(e.target.value) }
              })}
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider-thumb"
            />
          </div>

          {/* Blur */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs text-muted-foreground">Làm mờ</label>
              <span className="text-xs font-medium">{shadow.blur}px</span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              value={shadow.blur}
              onChange={(e) => onUpdateElement({
                shadow: { ...shadow, blur: Number(e.target.value) }
              })}
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider-thumb"
            />
          </div>

          {/* Spread */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs text-muted-foreground">Mở rộng</label>
              <span className="text-xs font-medium">{shadow.spread}px</span>
            </div>
            <input
              type="range"
              min="-20"
              max="20"
              value={shadow.spread}
              onChange={(e) => onUpdateElement({
                shadow: { ...shadow, spread: Number(e.target.value) }
              })}
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider-thumb"
            />
          </div>

          {/* Color */}
          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block">Màu sắc</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={shadow.color.includes('rgba') ? '#000000' : shadow.color}
                onChange={(e) => onUpdateElement({
                  shadow: { ...shadow, color: e.target.value }
                })}
                className="w-10 h-10 rounded-lg border border-border/60 cursor-pointer"
              />
              <input
                type="text"
                value={shadow.color}
                onChange={(e) => onUpdateElement({
                  shadow: { ...shadow, color: e.target.value }
                })}
                placeholder="rgba(0,0,0,0.15)"
                className="flex-1 px-3 py-2 bg-background border border-border/60 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          {/* Presets */}
          <div>
            <label className="text-xs text-muted-foreground mb-2 block">Mẫu có sẵn</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { name: 'Nhẹ', shadow: { x: 0, y: 2, blur: 4, spread: 0, color: 'rgba(0,0,0,0.1)' } },
                { name: 'Mềm', shadow: { x: 0, y: 4, blur: 12, spread: 0, color: 'rgba(0,0,0,0.15)' } },
                { name: 'Trung bình', shadow: { x: 0, y: 8, blur: 16, spread: 0, color: 'rgba(0,0,0,0.2)' } },
                { name: 'Mạnh', shadow: { x: 0, y: 12, blur: 24, spread: 0, color: 'rgba(0,0,0,0.3)' } },
              ].map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => onUpdateElement({
                    shadow: { ...shadow, ...preset.shadow, enabled: true }
                  })}
                  className="px-3 py-2 text-xs bg-muted hover:bg-muted/70 rounded-lg transition-colors"
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderBlurSection = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium flex items-center gap-2">
          <Wind className="w-4 h-4" />
          Hiệu ứng làm mờ
        </label>
      </div>

      <div className="pl-6 space-y-3">
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs text-muted-foreground">Mức độ</label>
            <span className="text-xs font-medium">{blur}px</span>
          </div>
          <input
            type="range"
            min="0"
            max="20"
            step="0.5"
            value={blur}
            onChange={(e) => onUpdateElement({ blur: Number(e.target.value) })}
            className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider-thumb"
          />
        </div>

        {/* Quick presets */}
        <div className="flex gap-2">
          {[0, 2, 5, 10].map((amount) => (
            <button
              key={amount}
              onClick={() => onUpdateElement({ blur: amount })}
              className={`
                flex-1 px-3 py-2 text-xs rounded-lg transition-all
                ${blur === amount 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-muted hover:bg-muted/70'
                }
              `}
            >
              {amount === 0 ? 'Không' : `${amount}px`}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderBlendSection = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium flex items-center gap-2">
          <Blend className="w-4 h-4" />
          Hòa trộn & Độ trong suốt
        </label>
      </div>

      <div className="pl-6 space-y-4">
        {/* Opacity */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs text-muted-foreground flex items-center gap-1">
              <Eye className="w-3 h-3" />
              Độ trong suốt
            </label>
            <span className="text-xs font-medium">{Math.round(opacity * 100)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={opacity}
            onChange={(e) => onUpdateElement({ opacity: Number(e.target.value) })}
            className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider-thumb"
          />
        </div>

        {/* Blend Mode */}
        <div>
          <label className="text-xs text-muted-foreground mb-2 block">Chế độ hòa trộn</label>
          <select
            value={blendMode}
            onChange={(e) => onUpdateElement({ blendMode: e.target.value })}
            className="w-full px-3 py-2 bg-background border border-border/60 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            {blendModes.map((mode) => (
              <option key={mode} value={mode}>
                {mode.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );

  const renderFiltersSection = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium flex items-center gap-2">
          <Aperture className="w-4 h-4" />
          Bộ lọc có sẵn
        </label>
      </div>

      <div className="pl-6 space-y-3">
        <div className="grid grid-cols-2 gap-2">
          {filterPresets.map((preset) => (
            <button
              key={preset.name}
              onClick={() => onUpdateElement({ filters: preset.filter })}
              className={`
                px-3 py-2 text-xs rounded-lg transition-all text-left
                ${filters === preset.filter
                  ? 'bg-blue-500 text-white'
                  : 'bg-muted hover:bg-muted/70'
                }
              `}
            >
              {preset.name}
            </button>
          ))}
        </div>

        {/* Custom filter input */}
        <div>
          <label className="text-xs text-muted-foreground mb-1.5 block">Bộ lọc CSS tùy chỉnh</label>
          <textarea
            value={filters}
            onChange={(e) => onUpdateElement({ filters: e.target.value })}
            placeholder="e.g., brightness(110%) contrast(120%)"
            className="w-full px-3 py-2 bg-background border border-border/60 rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
            rows={2}
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-full flex flex-col bg-card border-l border-border/60">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/60">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-muted-foreground" />
          <h3 className="font-medium">Hiệu ứng</h3>
        </div>
      </div>

      {/* Section Tabs */}
      <div className="flex border-b border-border/60 overflow-x-auto">
        {[
          { id: 'shadow', label: 'Bóng', icon: Droplet },
          { id: 'blur', label: 'Mờ', icon: Wind },
          { id: 'blend', label: 'Hòa trộn', icon: Blend },
          { id: 'filters', label: 'Bộ lọc', icon: Aperture },
        ].map((section) => {
          const Icon = section.icon;
          return (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id as any)}
              className={`
                flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-all flex-shrink-0
                ${activeSection === section.id
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50 dark:bg-blue-900/20'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }
              `}
            >
              <Icon className="w-4 h-4" />
              {section.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeSection === 'shadow' && renderShadowSection()}
        {activeSection === 'blur' && renderBlurSection()}
        {activeSection === 'blend' && renderBlendSection()}
        {activeSection === 'filters' && renderFiltersSection()}
      </div>

      {/* Preview Tip */}
      <div className="px-4 py-3 border-t border-border/60 bg-muted/30">
        <p className="text-xs text-muted-foreground">
          💡 Thay đổi được áp dụng trực tiếp trên canvas
        </p>
      </div>
    </div>
  );
}