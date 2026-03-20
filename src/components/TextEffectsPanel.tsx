import { useState, useRef, useEffect } from 'react';
import {
  Type, Sparkles, Wand2, Palette, Circle, Square, Triangle,
  ArrowRight, Minus, Plus, X, Check, Sliders, RotateCw, Move,
  AlignLeft, AlignCenter, AlignRight, Layers, Download, Upload,
  Copy, Eye, EyeOff, Lock, Unlock, ZoomIn, ZoomOut, Settings,
  Image as ImageIcon, Brush, PenTool, Droplet, Sun, Moon,
  Star, Heart, Zap, Crown, Diamond, Hexagon, Pentagon, Octagon
} from 'lucide-react';

// Types
interface TextEffectsPanelProps {
  selectedElement: any;
  onApplyEffect: (effect: TextEffect) => void;
  onClose: () => void;
}

interface TextEffect {
  id: string;
  name: string;
  type: 'curved' | '3d' | 'gradient' | 'outline' | 'shadow' | 'glow' | 'neon' | 'metallic';
  settings: TextEffectSettings;
}

interface TextEffectSettings {
  // Curved text
  curvature?: number;
  radius?: number;
  
  // 3D effect
  depth?: number;
  perspective?: number;
  lightAngle?: number;
  
  // Gradient
  gradientType?: 'linear' | 'radial' | 'conic';
  gradientAngle?: number;
  gradientColors?: string[];
  
  // Outline
  outlineWidth?: number;
  outlineColor?: string;
  outlineStyle?: 'solid' | 'dashed' | 'dotted';
  
  // Shadow
  shadowX?: number;
  shadowY?: number;
  shadowBlur?: number;
  shadowColor?: string;
  
  // Glow
  glowIntensity?: number;
  glowColor?: string;
  glowSpread?: number;
  
  // Neon
  neonColor?: string;
  neonIntensity?: number;
  neonFlicker?: boolean;
  
  // Metallic
  metallicType?: 'gold' | 'silver' | 'bronze' | 'chrome';
  metallicShine?: number;
  
  // Animation
  animated?: boolean;
  animationType?: string;
}

interface EffectPreset {
  id: string;
  name: string;
  type: TextEffect['type'];
  preview: string;
  gradient?: string;
  settings: TextEffectSettings;
}

const effectPresets: EffectPreset[] = [
  // Curved
  {
    id: 'curve-up',
    name: 'Curve Up',
    type: 'curved',
    preview: 'Curved',
    settings: { curvature: 50, radius: 200 },
  },
  {
    id: 'curve-down',
    name: 'Curve Down',
    type: 'curved',
    preview: 'Curved',
    settings: { curvature: -50, radius: 200 },
  },
  {
    id: 'arc',
    name: 'Arc',
    type: 'curved',
    preview: 'Arc',
    settings: { curvature: 80, radius: 150 },
  },
  
  // 3D
  {
    id: '3d-classic',
    name: '3D Classic',
    type: '3d',
    preview: '3D',
    settings: { depth: 20, perspective: 800, lightAngle: 45 },
  },
  {
    id: '3d-deep',
    name: '3D Deep',
    type: '3d',
    preview: '3D',
    settings: { depth: 40, perspective: 600, lightAngle: 135 },
  },
  {
    id: '3d-isometric',
    name: '3D Isometric',
    type: '3d',
    preview: '3D',
    settings: { depth: 30, perspective: 1000, lightAngle: 90 },
  },
  
  // Gradient
  {
    id: 'gradient-sunset',
    name: 'Sunset',
    type: 'gradient',
    preview: 'Gradient',
    gradient: 'linear-gradient(90deg, #ff6b6b, #feca57, #ff6b6b)',
    settings: {
      gradientType: 'linear',
      gradientAngle: 90,
      gradientColors: ['#ff6b6b', '#feca57', '#ff6b6b'],
    },
  },
  {
    id: 'gradient-ocean',
    name: 'Ocean',
    type: 'gradient',
    preview: 'Gradient',
    gradient: 'linear-gradient(90deg, #00d2ff, #3a47d5)',
    settings: {
      gradientType: 'linear',
      gradientAngle: 90,
      gradientColors: ['#00d2ff', '#3a47d5'],
    },
  },
  {
    id: 'gradient-fire',
    name: 'Fire',
    type: 'gradient',
    preview: 'Gradient',
    gradient: 'linear-gradient(90deg, #ff0844, #ffb199)',
    settings: {
      gradientType: 'linear',
      gradientAngle: 90,
      gradientColors: ['#ff0844', '#ffb199'],
    },
  },
  {
    id: 'gradient-rainbow',
    name: 'Rainbow',
    type: 'gradient',
    preview: 'Gradient',
    gradient: 'linear-gradient(90deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #9400d3)',
    settings: {
      gradientType: 'linear',
      gradientAngle: 90,
      gradientColors: ['#ff0000', '#ff7f00', '#ffff00', '#00ff00', '#0000ff', '#4b0082', '#9400d3'],
    },
  },
  
  // Outline
  {
    id: 'outline-simple',
    name: 'Simple Outline',
    type: 'outline',
    preview: 'Outline',
    settings: { outlineWidth: 2, outlineColor: '#000000', outlineStyle: 'solid' },
  },
  {
    id: 'outline-thick',
    name: 'Thick Outline',
    type: 'outline',
    preview: 'Outline',
    settings: { outlineWidth: 4, outlineColor: '#000000', outlineStyle: 'solid' },
  },
  {
    id: 'outline-double',
    name: 'Double Outline',
    type: 'outline',
    preview: 'Outline',
    settings: { outlineWidth: 6, outlineColor: '#ffffff', outlineStyle: 'solid' },
  },
  
  // Shadow
  {
    id: 'shadow-soft',
    name: 'Soft Shadow',
    type: 'shadow',
    preview: 'Shadow',
    settings: { shadowX: 2, shadowY: 2, shadowBlur: 8, shadowColor: 'rgba(0,0,0,0.3)' },
  },
  {
    id: 'shadow-hard',
    name: 'Hard Shadow',
    type: 'shadow',
    preview: 'Shadow',
    settings: { shadowX: 4, shadowY: 4, shadowBlur: 0, shadowColor: 'rgba(0,0,0,0.5)' },
  },
  {
    id: 'shadow-long',
    name: 'Long Shadow',
    type: 'shadow',
    preview: 'Shadow',
    settings: { shadowX: 10, shadowY: 10, shadowBlur: 2, shadowColor: 'rgba(0,0,0,0.4)' },
  },
  
  // Glow
  {
    id: 'glow-soft',
    name: 'Soft Glow',
    type: 'glow',
    preview: 'Glow',
    settings: { glowIntensity: 50, glowColor: '#ffffff', glowSpread: 10 },
  },
  {
    id: 'glow-neon-blue',
    name: 'Neon Blue',
    type: 'glow',
    preview: 'Glow',
    settings: { glowIntensity: 80, glowColor: '#00d2ff', glowSpread: 15 },
  },
  {
    id: 'glow-neon-pink',
    name: 'Neon Pink',
    type: 'glow',
    preview: 'Glow',
    settings: { glowIntensity: 80, glowColor: '#ff006e', glowSpread: 15 },
  },
  
  // Neon
  {
    id: 'neon-classic',
    name: 'Classic Neon',
    type: 'neon',
    preview: 'Neon',
    settings: { neonColor: '#00ffff', neonIntensity: 80, neonFlicker: false },
  },
  {
    id: 'neon-pink',
    name: 'Pink Neon',
    type: 'neon',
    preview: 'Neon',
    settings: { neonColor: '#ff006e', neonIntensity: 90, neonFlicker: true },
  },
  {
    id: 'neon-green',
    name: 'Green Neon',
    type: 'neon',
    preview: 'Neon',
    settings: { neonColor: '#39ff14', neonIntensity: 85, neonFlicker: false },
  },
  
  // Metallic
  {
    id: 'metallic-gold',
    name: 'Gold',
    type: 'metallic',
    preview: 'Gold',
    gradient: 'linear-gradient(90deg, #ffd700, #ffed4e, #ffd700)',
    settings: { metallicType: 'gold', metallicShine: 80 },
  },
  {
    id: 'metallic-silver',
    name: 'Silver',
    type: 'metallic',
    preview: 'Silver',
    gradient: 'linear-gradient(90deg, #c0c0c0, #e8e8e8, #c0c0c0)',
    settings: { metallicType: 'silver', metallicShine: 70 },
  },
  {
    id: 'metallic-bronze',
    name: 'Bronze',
    type: 'metallic',
    preview: 'Bronze',
    gradient: 'linear-gradient(90deg, #cd7f32, #e8b881, #cd7f32)',
    settings: { metallicType: 'bronze', metallicShine: 75 },
  },
  {
    id: 'metallic-chrome',
    name: 'Chrome',
    type: 'metallic',
    preview: 'Chrome',
    gradient: 'linear-gradient(90deg, #a8a8a8, #ffffff, #a8a8a8)',
    settings: { metallicType: 'chrome', metallicShine: 90 },
  },
];

export function TextEffectsPanel({
  selectedElement,
  onApplyEffect,
  onClose,
}: TextEffectsPanelProps) {
  const [activeCategory, setActiveCategory] = useState<TextEffect['type']>('gradient');
  const [selectedPreset, setSelectedPreset] = useState<EffectPreset | null>(null);
  const [customSettings, setCustomSettings] = useState<TextEffectSettings>({});
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [previewText, setPreviewText] = useState(selectedElement?.content || 'Preview Text');

  const categories: Array<{ id: TextEffect['type']; name: string; icon: any }> = [
    { id: 'gradient', name: 'Chuyển màu', icon: Palette },
    { id: 'curved', name: 'Cong', icon: RotateCw },
    { id: '3d', name: '3D', icon: Layers },
    { id: 'outline', name: 'Viền', icon: Circle },
    { id: 'shadow', name: 'Đổ bóng', icon: Copy },
    { id: 'glow', name: 'Phát sáng', icon: Sun },
    { id: 'neon', name: 'Neon', icon: Zap },
    { id: 'metallic', name: 'Kim loại', icon: Crown },
  ];

  const filteredPresets = effectPresets.filter(p => p.type === activeCategory);

  const handleApplyPreset = (preset: EffectPreset) => {
    setSelectedPreset(preset);
    setCustomSettings(preset.settings);
  };

  const handleApplyEffect = () => {
    if (!selectedPreset) return;

    const effect: TextEffect = {
      id: selectedPreset.id,
      name: selectedPreset.name,
      type: selectedPreset.type,
      settings: customSettings,
    };

    onApplyEffect(effect);
  };

  const getCSSForEffect = (preset: EffectPreset) => {
    const settings = { ...preset.settings, ...customSettings };
    let style: React.CSSProperties = {};

    switch (preset.type) {
      case 'gradient':
        if (preset.gradient) {
          style.background = preset.gradient;
          style.WebkitBackgroundClip = 'text';
          style.WebkitTextFillColor = 'transparent';
          style.backgroundClip = 'text';
        }
        break;

      case 'curved':
        // Would need SVG path for actual curved text
        style.transform = `rotate(${settings.curvature || 0}deg)`;
        break;

      case '3d':
        const depth = settings.depth || 20;
        const shadows = Array.from({ length: depth }, (_, i) => 
          `${i}px ${i}px 0 rgba(0,0,0,0.1)`
        ).join(', ');
        style.textShadow = shadows;
        break;

      case 'outline':
        style.WebkitTextStroke = `${settings.outlineWidth || 2}px ${settings.outlineColor || '#000'}`;
        style.paintOrder = 'stroke fill';
        break;

      case 'shadow':
        style.textShadow = `${settings.shadowX}px ${settings.shadowY}px ${settings.shadowBlur}px ${settings.shadowColor}`;
        break;

      case 'glow':
        style.textShadow = `0 0 ${settings.glowSpread}px ${settings.glowColor}`;
        break;

      case 'neon':
        style.color = settings.neonColor;
        style.textShadow = `
          0 0 7px ${settings.neonColor},
          0 0 10px ${settings.neonColor},
          0 0 21px ${settings.neonColor},
          0 0 42px ${settings.neonColor},
          0 0 82px ${settings.neonColor},
          0 0 92px ${settings.neonColor},
          0 0 102px ${settings.neonColor},
          0 0 151px ${settings.neonColor}
        `;
        break;

      case 'metallic':
        if (preset.gradient) {
          style.background = preset.gradient;
          style.WebkitBackgroundClip = 'text';
          style.WebkitTextFillColor = 'transparent';
          style.backgroundClip = 'text';
        }
        break;
    }

    return style;
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Hiệu ứng văn bản nâng cao</h2>
                <p className="text-sm text-white/80">Biến đổi văn bản với hiệu ứng ấn tượng</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center transition-colors backdrop-blur-sm"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar - Categories */}
          <div className="w-64 bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
            <div className="p-4 space-y-2">
              <h3 className="text-xs font-semibold text-gray-500 uppercase mb-3">Loại hiệu ứng</h3>
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      activeCategory === category.id
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                        : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{category.name}</span>
                    <span className="ml-auto text-xs bg-white/20 px-2 py-0.5 rounded-full">
                      {effectPresets.filter(p => p.type === category.id).length}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Middle - Presets Grid */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6">
              {/* Preview */}
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-12 mb-6 flex items-center justify-center min-h-[200px]">
                <div
                  className="text-6xl font-bold"
                  style={selectedPreset ? getCSSForEffect(selectedPreset) : {}}
                >
                  {previewText}
                </div>
              </div>

              {/* Presets Grid */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">
                    Hiệu ứng {categories.find(c => c.id === activeCategory)?.name}
                  </h3>
                  <span className="text-sm text-gray-500">
                    {filteredPresets.length} mẫu có sẵn
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  {filteredPresets.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => handleApplyPreset(preset)}
                      className={`group relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 hover:scale-105 transition-all overflow-hidden ${
                        selectedPreset?.id === preset.id
                          ? 'ring-4 ring-purple-500 shadow-xl'
                          : ''
                      }`}
                    >
                      {/* Preview Text */}
                      <div
                        className="text-3xl font-bold text-center mb-3"
                        style={getCSSForEffect(preset)}
                      >
                        {preset.preview}
                      </div>

                      {/* Name */}
                      <div className="text-sm text-white/80 text-center">
                        {preset.name}
                      </div>

                      {/* Checkmark */}
                      {selectedPreset?.id === preset.id && (
                        <div className="absolute top-2 right-2 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}

                      {/* Hover Effect */}
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-pink-500/0 group-hover:from-purple-500/20 group-hover:to-pink-500/20 transition-all" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar - Settings */}
          {selectedPreset && (
            <div className="w-80 bg-gray-50 dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 overflow-y-auto">
              <div className="p-6 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Cài đặt hiệu ứng</h3>
                  
                  {/* Preview Text Input */}
                  <div className="mb-4">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                      Văn bản xem trước
                    </label>
                    <input
                      type="text"
                      value={previewText}
                      onChange={(e) => setPreviewText(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Nhập văn bản..."
                    />
                  </div>

                  {/* Gradient Settings */}
                  {activeCategory === 'gradient' && (
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                          Kiểu chuyển màu
                        </label>
                        <select
                          value={customSettings.gradientType || 'linear'}
                          onChange={(e) => setCustomSettings({ ...customSettings, gradientType: e.target.value as any })}
                          className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                          <option value="linear">Tuyến tính</option>
                          <option value="radial">Tỏa tròn</option>
                          <option value="conic">Hình nón</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                          Góc: {customSettings.gradientAngle || 90}°
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="360"
                          value={customSettings.gradientAngle || 90}
                          onChange={(e) => setCustomSettings({ ...customSettings, gradientAngle: parseInt(e.target.value) })}
                          className="w-full"
                        />
                      </div>
                    </div>
                  )}

                  {/* Curved Settings */}
                  {activeCategory === 'curved' && (
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                          Độ cong: {customSettings.curvature || 0}
                        </label>
                        <input
                          type="range"
                          min="-100"
                          max="100"
                          value={customSettings.curvature || 0}
                          onChange={(e) => setCustomSettings({ ...customSettings, curvature: parseInt(e.target.value) })}
                          className="w-full"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                          Bán kính: {customSettings.radius || 200}px
                        </label>
                        <input
                          type="range"
                          min="50"
                          max="500"
                          value={customSettings.radius || 200}
                          onChange={(e) => setCustomSettings({ ...customSettings, radius: parseInt(e.target.value) })}
                          className="w-full"
                        />
                      </div>
                    </div>
                  )}

                  {/* 3D Settings */}
                  {activeCategory === '3d' && (
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                          Chiều sâu: {customSettings.depth || 20}px
                        </label>
                        <input
                          type="range"
                          min="5"
                          max="50"
                          value={customSettings.depth || 20}
                          onChange={(e) => setCustomSettings({ ...customSettings, depth: parseInt(e.target.value) })}
                          className="w-full"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                          Phối cảnh: {customSettings.perspective || 800}
                        </label>
                        <input
                          type="range"
                          min="300"
                          max="1500"
                          value={customSettings.perspective || 800}
                          onChange={(e) => setCustomSettings({ ...customSettings, perspective: parseInt(e.target.value) })}
                          className="w-full"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                          Góc chiếu sáng: {customSettings.lightAngle || 45}°
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="360"
                          value={customSettings.lightAngle || 45}
                          onChange={(e) => setCustomSettings({ ...customSettings, lightAngle: parseInt(e.target.value) })}
                          className="w-full"
                        />
                      </div>
                    </div>
                  )}

                  {/* Outline Settings */}
                  {activeCategory === 'outline' && (
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                          Độ rộng: {customSettings.outlineWidth || 2}px
                        </label>
                        <input
                          type="range"
                          min="1"
                          max="10"
                          value={customSettings.outlineWidth || 2}
                          onChange={(e) => setCustomSettings({ ...customSettings, outlineWidth: parseInt(e.target.value) })}
                          className="w-full"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                          Màu sắc
                        </label>
                        <input
                          type="color"
                          value={customSettings.outlineColor || '#000000'}
                          onChange={(e) => setCustomSettings({ ...customSettings, outlineColor: e.target.value })}
                          className="w-full h-10 rounded-lg cursor-pointer"
                        />
                      </div>
                    </div>
                  )}

                  {/* Shadow Settings */}
                  {activeCategory === 'shadow' && (
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                          Lệch X: {customSettings.shadowX || 0}px
                        </label>
                        <input
                          type="range"
                          min="-50"
                          max="50"
                          value={customSettings.shadowX || 0}
                          onChange={(e) => setCustomSettings({ ...customSettings, shadowX: parseInt(e.target.value) })}
                          className="w-full"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                          Lệch Y: {customSettings.shadowY || 0}px
                        </label>
                        <input
                          type="range"
                          min="-50"
                          max="50"
                          value={customSettings.shadowY || 0}
                          onChange={(e) => setCustomSettings({ ...customSettings, shadowY: parseInt(e.target.value) })}
                          className="w-full"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                          Độ mờ: {customSettings.shadowBlur || 0}px
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="50"
                          value={customSettings.shadowBlur || 0}
                          onChange={(e) => setCustomSettings({ ...customSettings, shadowBlur: parseInt(e.target.value) })}
                          className="w-full"
                        />
                      </div>
                    </div>
                  )}

                  {/* Glow Settings */}
                  {activeCategory === 'glow' && (
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                          Cường độ: {customSettings.glowIntensity || 50}%
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={customSettings.glowIntensity || 50}
                          onChange={(e) => setCustomSettings({ ...customSettings, glowIntensity: parseInt(e.target.value) })}
                          className="w-full"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                          Phạm vi: {customSettings.glowSpread || 10}px
                        </label>
                        <input
                          type="range"
                          min="5"
                          max="30"
                          value={customSettings.glowSpread || 10}
                          onChange={(e) => setCustomSettings({ ...customSettings, glowSpread: parseInt(e.target.value) })}
                          className="w-full"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                          Màu sắc
                        </label>
                        <input
                          type="color"
                          value={customSettings.glowColor || '#ffffff'}
                          onChange={(e) => setCustomSettings({ ...customSettings, glowColor: e.target.value })}
                          className="w-full h-10 rounded-lg cursor-pointer"
                        />
                      </div>
                    </div>
                  )}

                  {/* Neon Settings */}
                  {activeCategory === 'neon' && (
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                          Cường độ: {customSettings.neonIntensity || 80}%
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={customSettings.neonIntensity || 80}
                          onChange={(e) => setCustomSettings({ ...customSettings, neonIntensity: parseInt(e.target.value) })}
                          className="w-full"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                          Màu sắc
                        </label>
                        <input
                          type="color"
                          value={customSettings.neonColor || '#00ffff'}
                          onChange={(e) => setCustomSettings({ ...customSettings, neonColor: e.target.value })}
                          className="w-full h-10 rounded-lg cursor-pointer"
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="flicker"
                          checked={customSettings.neonFlicker || false}
                          onChange={(e) => setCustomSettings({ ...customSettings, neonFlicker: e.target.checked })}
                          className="w-4 h-4 text-purple-500 rounded"
                        />
                        <label htmlFor="flicker" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Hiệu ứng nhấp nháy
                        </label>
                      </div>
                    </div>
                  )}

                  {/* Metallic Settings */}
                  {activeCategory === 'metallic' && (
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                          Loại
                        </label>
                        <select
                          value={customSettings.metallicType || 'gold'}
                          onChange={(e) => setCustomSettings({ ...customSettings, metallicType: e.target.value as any })}
                          className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                          <option value="gold">Vàng</option>
                          <option value="silver">Bạc</option>
                          <option value="bronze">Đồng</option>
                          <option value="chrome">Chrome</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                          Độ bóng: {customSettings.metallicShine || 80}%
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={customSettings.metallicShine || 80}
                          onChange={(e) => setCustomSettings({ ...customSettings, metallicShine: parseInt(e.target.value) })}
                          className="w-full"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Apply Button */}
                <button
                  onClick={handleApplyEffect}
                  disabled={!selectedPreset}
                  className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium flex items-center justify-center gap-2"
                >
                  <Check className="w-5 h-5" />
                  Áp dụng hiệu ứng
                </button>

                {/* Info */}
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                  <div className="flex gap-3">
                    <div className="flex-shrink-0">
                      <Info className="w-5 h-5 text-blue-500" />
                    </div>
                    <div className="text-sm text-blue-700 dark:text-blue-300">
                      <p className="font-medium mb-1">Mẹo chuyên nghiệp</p>
                      <p className="text-xs">
                        Kết hợp nhiều hiệu ứng để tạo phong cách độc đáo. Bạn có thể xếp chồng hiệu ứng chuyển màu, đổ bóng và viền.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}