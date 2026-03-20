import { useState } from 'react';
import {
  Image as ImageIcon, X, Wand2, Sparkles, Sun, Moon,
  Droplet, Contrast, Palette, Filter, Circle, Square,
  Star, Heart, Zap, Wind, CloudRain, Sunrise, Sunset,
  Camera, Film, Music, Paintbrush, Eye, EyeOff,
  RotateCw, Check, Download, Upload, Sliders
} from 'lucide-react';

interface FilterPreset {
  id: string;
  name: string;
  category: 'classic' | 'artistic' | 'mood' | 'vintage' | 'modern';
  icon: any;
  thumbnail?: string;
  filters: {
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
  };
}

interface FiltersPanelProps {
  selectedElement: any;
  onApplyFilter: (filters: FilterPreset['filters']) => void;
  onResetFilters: () => void;
  currentFilters?: FilterPreset['filters'];
  onClose?: () => void;
}

export function FiltersPanel({
  selectedElement,
  onApplyFilter,
  onResetFilters,
  currentFilters = {},
  onClose,
}: FiltersPanelProps) {
  const [activeCategory, setActiveCategory] = useState<string>('classic');
  const [customFilters, setCustomFilters] = useState<FilterPreset['filters']>(currentFilters);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const filterPresets: FilterPreset[] = [
    // Classic Filters
    {
      id: 'original',
      name: 'Original',
      category: 'classic',
      icon: ImageIcon,
      filters: {},
    },
    {
      id: 'vivid',
      name: 'Vivid',
      category: 'classic',
      icon: Sparkles,
      filters: {
        brightness: 110,
        contrast: 120,
        saturation: 140,
      },
    },
    {
      id: 'dramatic',
      name: 'Dramatic',
      category: 'classic',
      icon: Contrast,
      filters: {
        brightness: 95,
        contrast: 150,
        saturation: 110,
      },
    },
    {
      id: 'bright',
      name: 'Bright',
      category: 'classic',
      icon: Sun,
      filters: {
        brightness: 130,
        contrast: 105,
        saturation: 110,
      },
    },
    {
      id: 'dark',
      name: 'Dark',
      category: 'classic',
      icon: Moon,
      filters: {
        brightness: 70,
        contrast: 120,
        saturation: 90,
      },
    },
    {
      id: 'cool',
      name: 'Cool',
      category: 'classic',
      icon: Droplet,
      filters: {
        temperature: -20,
        tint: 10,
        saturation: 105,
      },
    },
    {
      id: 'warm',
      name: 'Warm',
      category: 'classic',
      icon: Sunrise,
      filters: {
        temperature: 20,
        tint: -10,
        saturation: 105,
      },
    },
    // Artistic Filters
    {
      id: 'bw',
      name: 'Black & White',
      category: 'artistic',
      icon: Circle,
      filters: {
        grayscale: 100,
        contrast: 110,
      },
    },
    {
      id: 'sepia',
      name: 'Sepia',
      category: 'artistic',
      icon: Camera,
      filters: {
        sepia: 100,
        brightness: 105,
      },
    },
    {
      id: 'invert',
      name: 'Invert',
      category: 'artistic',
      icon: RotateCw,
      filters: {
        invert: 100,
      },
    },
    {
      id: 'blur',
      name: 'Blur',
      category: 'artistic',
      icon: Wind,
      filters: {
        blur: 5,
      },
    },
    {
      id: 'sharpen',
      name: 'Sharpen',
      category: 'artistic',
      icon: Star,
      filters: {
        contrast: 130,
        brightness: 105,
      },
    },
    {
      id: 'sketch',
      name: 'Sketch',
      category: 'artistic',
      icon: Paintbrush,
      filters: {
        grayscale: 100,
        contrast: 200,
        brightness: 120,
      },
    },
    // Mood Filters
    {
      id: 'sunrise',
      name: 'Sunrise',
      category: 'mood',
      icon: Sunrise,
      filters: {
        temperature: 25,
        brightness: 110,
        saturation: 115,
        tint: -5,
      },
    },
    {
      id: 'sunset',
      name: 'Sunset',
      category: 'mood',
      icon: Sunset,
      filters: {
        temperature: 30,
        brightness: 95,
        saturation: 125,
        tint: -10,
      },
    },
    {
      id: 'rain',
      name: 'Rainy',
      category: 'mood',
      icon: CloudRain,
      filters: {
        brightness: 85,
        saturation: 80,
        temperature: -10,
        contrast: 95,
      },
    },
    {
      id: 'dreamy',
      name: 'Dreamy',
      category: 'mood',
      icon: Heart,
      filters: {
        brightness: 115,
        saturation: 90,
        blur: 2,
        opacity: 95,
      },
    },
    {
      id: 'electric',
      name: 'Electric',
      category: 'mood',
      icon: Zap,
      filters: {
        contrast: 140,
        saturation: 150,
        hue: 10,
      },
    },
    // Vintage Filters
    {
      id: 'vintage',
      name: 'Vintage',
      category: 'vintage',
      icon: Film,
      filters: {
        sepia: 40,
        brightness: 95,
        contrast: 110,
        saturation: 85,
        vignette: 30,
      },
    },
    {
      id: 'retro',
      name: 'Retro',
      category: 'vintage',
      icon: Music,
      filters: {
        temperature: 15,
        saturation: 120,
        contrast: 115,
        grain: 20,
      },
    },
    {
      id: '70s',
      name: '70s',
      category: 'vintage',
      icon: Circle,
      filters: {
        temperature: 20,
        saturation: 130,
        brightness: 105,
        tint: -5,
        vignette: 20,
      },
    },
    {
      id: 'polaroid',
      name: 'Polaroid',
      category: 'vintage',
      icon: Camera,
      filters: {
        brightness: 110,
        saturation: 90,
        temperature: 10,
        vignette: 25,
        grain: 15,
      },
    },
    // Modern Filters
    {
      id: 'minimal',
      name: 'Minimal',
      category: 'modern',
      icon: Square,
      filters: {
        saturation: 70,
        contrast: 105,
        brightness: 105,
      },
    },
    {
      id: 'clean',
      name: 'Clean',
      category: 'modern',
      icon: Sparkles,
      filters: {
        brightness: 115,
        saturation: 95,
        contrast: 100,
      },
    },
    {
      id: 'vibrant',
      name: 'Vibrant',
      category: 'modern',
      icon: Palette,
      filters: {
        saturation: 160,
        contrast: 115,
        brightness: 105,
      },
    },
    {
      id: 'matte',
      name: 'Matte',
      category: 'modern',
      icon: Eye,
      filters: {
        contrast: 85,
        saturation: 90,
        brightness: 105,
      },
    },
  ];

  const categories = [
    { id: 'classic', label: 'Cơ bản', icon: Filter },
    { id: 'artistic', label: 'Nghệ thuật', icon: Paintbrush },
    { id: 'mood', label: 'Tâm trạng', icon: Heart },
    { id: 'vintage', label: 'Cổ điển', icon: Film },
    { id: 'modern', label: 'Hiện đại', icon: Sparkles },
  ];

  const filteredPresets = filterPresets.filter(p => p.category === activeCategory);

  const handleApplyPreset = (preset: FilterPreset) => {
    setCustomFilters(preset.filters);
    onApplyFilter(preset.filters);
  };

  const handleCustomFilterChange = (key: string, value: number) => {
    const newFilters = { ...customFilters, [key]: value };
    setCustomFilters(newFilters);
    onApplyFilter(newFilters);
  };

  const handleReset = () => {
    setCustomFilters({});
    onResetFilters();
  };

  const filterControls = [
    { key: 'brightness', label: 'Brightness', min: 0, max: 200, default: 100, icon: Sun },
    { key: 'contrast', label: 'Contrast', min: 0, max: 200, default: 100, icon: Contrast },
    { key: 'saturation', label: 'Saturation', min: 0, max: 200, default: 100, icon: Palette },
    { key: 'hue', label: 'Hue', min: -180, max: 180, default: 0, icon: Palette },
    { key: 'blur', label: 'Blur', min: 0, max: 20, default: 0, icon: Wind },
    { key: 'grayscale', label: 'Grayscale', min: 0, max: 100, default: 0, icon: Circle },
    { key: 'sepia', label: 'Sepia', min: 0, max: 100, default: 0, icon: Camera },
    { key: 'invert', label: 'Invert', min: 0, max: 100, default: 0, icon: RotateCw },
    { key: 'opacity', label: 'Opacity', min: 0, max: 100, default: 100, icon: EyeOff },
    { key: 'temperature', label: 'Temperature', min: -50, max: 50, default: 0, icon: Sun, advanced: true },
    { key: 'tint', label: 'Tint', min: -50, max: 50, default: 0, icon: Droplet, advanced: true },
    { key: 'vignette', label: 'Vignette', min: 0, max: 100, default: 0, icon: Circle, advanced: true },
    { key: 'grain', label: 'Grain', min: 0, max: 100, default: 0, icon: Sparkles, advanced: true },
  ];

  if (!selectedElement || selectedElement.type !== 'image') {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <div className="flex items-center justify-center w-20 h-20 bg-muted rounded-full mb-4">
          <ImageIcon className="w-10 h-10 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Chưa chọn hình ảnh</h3>
        <p className="text-sm text-muted-foreground max-w-md">
          Chọn một phần tử hình ảnh trên canvas để áp dụng bộ lọc
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Wand2 className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">Bộ lọc</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="p-1.5 rounded-lg hover:bg-muted transition-colors text-sm"
              title="Đặt lại bộ lọc"
            >
              <RotateCw className="w-4 h-4" />
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-muted transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Categories */}
        <div className="flex gap-1 overflow-x-auto pb-2">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`
                  flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap text-xs font-medium transition-all
                  ${activeCategory === cat.id
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
                  }
                `}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter Presets */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <div className="grid grid-cols-2 gap-3 mb-6">
            {filteredPresets.map((preset) => {
              const Icon = preset.icon;
              const isActive = JSON.stringify(customFilters) === JSON.stringify(preset.filters);
              
              return (
                <button
                  key={preset.id}
                  onClick={() => handleApplyPreset(preset)}
                  className={`
                    relative p-3 rounded-xl border-2 transition-all text-left
                    ${isActive
                      ? 'bg-primary/10 border-primary shadow-lg'
                      : 'bg-muted/30 border-border hover:border-primary/50 hover:shadow-md'
                    }
                  `}
                >
                  {/* Preview */}
                  <div className="flex items-center justify-center h-20 mb-3 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg">
                    <Icon className={`w-8 h-8 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                  </div>

                  {/* Name */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold">{preset.name}</span>
                    {isActive && (
                      <Check className="w-4 h-4 text-primary" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Custom Filters */}
          <div className="border-t border-border pt-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-semibold">Tùy chỉnh</h4>
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-muted rounded-lg hover:bg-muted/80 transition-colors"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>{showAdvanced ? 'Ẩn' : 'Hiện'} nâng cao</span>
              </button>
            </div>

            <div className="space-y-4">
              {filterControls.map((control) => {
                if (control.advanced && !showAdvanced) return null;
                
                const Icon = control.icon;
                const value = customFilters[control.key as keyof typeof customFilters] ?? control.default;

                return (
                  <div key={control.key}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4 text-muted-foreground" />
                        <label className="text-xs font-medium">{control.label}</label>
                      </div>
                      <span className="text-xs font-mono text-muted-foreground">
                        {value}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={control.min}
                      max={control.max}
                      value={value}
                      onChange={(e) => handleCustomFilterChange(control.key, Number(e.target.value))}
                      className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider-thumb"
                    />
                    <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
                      <span>{control.min}</span>
                      <span>{control.max}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-border bg-muted/30">
        <div className="flex gap-2">
          <button
            onClick={handleReset}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-background border border-border rounded-lg hover:bg-muted transition-colors"
          >
            <RotateCw className="w-4 h-4" />
            <span className="text-sm font-medium">Đặt lại</span>
          </button>
          <button
            onClick={() => {
              // Export/download functionality
              console.log('Export with filters:', customFilters);
            }}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span className="text-sm font-medium">Áp dụng & Xuất</span>
          </button>
        </div>
      </div>
    </div>
  );
}