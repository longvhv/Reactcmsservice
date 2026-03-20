import { useState, useRef, useEffect } from 'react';
import { Palette, Droplet, Plus, Check, X } from 'lucide-react';

interface ColorStop {
  color: string;
  position: number;
}

interface GradientConfig {
  enabled: boolean;
  type: 'linear' | 'radial' | 'conic';
  angle: number;
  stops: ColorStop[];
}

interface AdvancedColorPickerProps {
  color: string;
  gradient?: GradientConfig;
  onChange: (color: string) => void;
  onGradientChange?: (gradient: GradientConfig) => void;
  showGradient?: boolean;
  label?: string;
}

const colorPresets = [
  // Neutrals
  '#000000', '#1e293b', '#334155', '#64748b', '#94a3b8', '#cbd5e1', '#e2e8f0', '#f1f5f9', '#ffffff',
  // Blues
  '#1e40af', '#2563eb', '#3b82f6', '#60a5fa', '#93c5fd',
  // Purples
  '#6b21a8', '#7c3aed', '#8b5cf6', '#a78bfa', '#c4b5fd',
  // Pinks
  '#be185d', '#db2777', '#ec4899', '#f472b6', '#fbcfe8',
  // Reds
  '#b91c1c', '#dc2626', '#ef4444', '#f87171', '#fca5a5',
  // Oranges
  '#c2410c', '#ea580c', '#f97316', '#fb923c', '#fdba74',
  // Yellows
  '#ca8a04', '#eab308', '#facc15', '#fde047', '#fef08a',
  // Greens
  '#15803d', '#16a34a', '#22c55e', '#4ade80', '#86efac',
  // Teals
  '#0f766e', '#14b8a6', '#2dd4bf', '#5eead4', '#99f6e4',
  // Cyans
  '#0e7490', '#0891b2', '#06b6d4', '#22d3ee', '#67e8f9',
];

const gradientPresets = [
  { name: 'Sunset', stops: [{ color: '#ff6b6b', position: 0 }, { color: '#feca57', position: 100 }] },
  { name: 'Ocean', stops: [{ color: '#4facfe', position: 0 }, { color: '#00f2fe', position: 100 }] },
  { name: 'Forest', stops: [{ color: '#11998e', position: 0 }, { color: '#38ef7d', position: 100 }] },
  { name: 'Purple', stops: [{ color: '#8e2de2', position: 0 }, { color: '#4a00e0', position: 100 }] },
  { name: 'Fire', stops: [{ color: '#ee0979', position: 0 }, { color: '#ff6a00', position: 100 }] },
  { name: 'Ice', stops: [{ color: '#667eea', position: 0 }, { color: '#764ba2', position: 100 }] },
  { name: 'Rose', stops: [{ color: '#f093fb', position: 0 }, { color: '#f5576c', position: 100 }] },
  { name: 'Mint', stops: [{ color: '#4facfe', position: 0 }, { color: '#00f2fe', position: 100 }] },
];

export function AdvancedColorPicker({ 
  color, 
  gradient, 
  onChange, 
  onGradientChange,
  showGradient = false,
  label 
}: AdvancedColorPickerProps) {
  const [mode, setMode] = useState<'solid' | 'gradient'>(gradient?.enabled ? 'gradient' : 'solid');
  const [recentColors, setRecentColors] = useState<string[]>([]);
  const [showEyedropper, setShowEyedropper] = useState(false);
  const colorInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Load recent colors from localStorage
    const saved = localStorage.getItem('recentColors');
    if (saved) {
      try {
        setRecentColors(JSON.parse(saved));
      } catch (e) {
        // Ignore
      }
    }
  }, []);

  const handleColorChange = (newColor: string) => {
    onChange(newColor);
    
    // Add to recent colors
    const updated = [newColor, ...recentColors.filter(c => c !== newColor)].slice(0, 12);
    setRecentColors(updated);
    localStorage.setItem('recentColors', JSON.stringify(updated));
  };

  const handleGradientStopChange = (index: number, updates: Partial<ColorStop>) => {
    if (!gradient || !onGradientChange) return;
    
    const newStops = [...gradient.stops];
    newStops[index] = { ...newStops[index], ...updates };
    
    onGradientChange({
      ...gradient,
      stops: newStops
    });
  };

  const addGradientStop = () => {
    if (!gradient || !onGradientChange) return;
    
    const newStop: ColorStop = {
      color: '#000000',
      position: 50
    };
    
    onGradientChange({
      ...gradient,
      stops: [...gradient.stops, newStop].sort((a, b) => a.position - b.position)
    });
  };

  const removeGradientStop = (index: number) => {
    if (!gradient || !onGradientChange || gradient.stops.length <= 2) return;
    
    const newStops = gradient.stops.filter((_, i) => i !== index);
    onGradientChange({
      ...gradient,
      stops: newStops
    });
  };

  const applyGradientPreset = (preset: typeof gradientPresets[0]) => {
    if (!onGradientChange) return;
    
    onGradientChange({
      enabled: true,
      type: 'linear',
      angle: 135,
      stops: preset.stops
    });
    setMode('gradient');
  };

  const toggleGradient = () => {
    if (!onGradientChange) return;
    
    if (mode === 'solid') {
      onGradientChange({
        enabled: true,
        type: 'linear',
        angle: 135,
        stops: [
          { color: color || '#3b82f6', position: 0 },
          { color: '#8b5cf6', position: 100 }
        ]
      });
      setMode('gradient');
    } else {
      onGradientChange({
        ...gradient!,
        enabled: false
      });
      setMode('solid');
    }
  };

  return (
    <div className="space-y-3">
      {label && (
        <label className="text-sm font-medium text-slate-700">
          {label}
        </label>
      )}

      {/* Mode Switcher */}
      {showGradient && onGradientChange && (
        <div className="flex gap-2">
          <button
            onClick={() => setMode('solid')}
            className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              mode === 'solid'
                ? 'bg-blue-100 text-blue-700 border-2 border-blue-300'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Droplet className="inline-block w-4 h-4 mr-1" />
            Màu đơn
          </button>
          <button
            onClick={toggleGradient}
            className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              mode === 'gradient'
                ? 'bg-blue-100 text-blue-700 border-2 border-blue-300'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Palette className="inline-block w-4 h-4 mr-1" />
            Gradient
          </button>
        </div>
      )}

      {mode === 'solid' ? (
        <>
          {/* Current Color Display */}
          <div className="flex items-center gap-2">
            <div
              className="w-12 h-12 rounded-lg border-2 border-slate-300 cursor-pointer hover:scale-105 transition-transform shadow-sm"
              style={{ backgroundColor: color }}
              onClick={() => colorInputRef.current?.click()}
            />
            <div className="flex-1">
              <input
                type="text"
                value={color}
                onChange={(e) => handleColorChange(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono"
                placeholder="#000000"
              />
            </div>
            <input
              ref={colorInputRef}
              type="color"
              value={color}
              onChange={(e) => handleColorChange(e.target.value)}
              className="w-0 h-0 opacity-0"
            />
          </div>

          {/* Color Presets */}
          <div>
            <div className="text-xs font-medium text-slate-600 mb-2">Màu thông dụng</div>
            <div className="grid grid-cols-9 gap-1.5">
              {colorPresets.map((presetColor) => (
                <button
                  key={presetColor}
                  onClick={() => handleColorChange(presetColor)}
                  className="w-full aspect-square rounded-md border-2 hover:scale-110 transition-transform relative group"
                  style={{ 
                    backgroundColor: presetColor,
                    borderColor: color === presetColor ? '#3b82f6' : '#e2e8f0'
                  }}
                  title={presetColor}
                >
                  {color === presetColor && (
                    <Check className="w-3 h-3 text-white absolute inset-0 m-auto drop-shadow" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Recent Colors */}
          {recentColors.length > 0 && (
            <div>
              <div className="text-xs font-medium text-slate-600 mb-2">Màu gần đây</div>
              <div className="grid grid-cols-9 gap-1.5">
                {recentColors.map((recentColor, idx) => (
                  <button
                    key={`${recentColor}-${idx}`}
                    onClick={() => handleColorChange(recentColor)}
                    className="w-full aspect-square rounded-md border-2 hover:scale-110 transition-transform"
                    style={{ 
                      backgroundColor: recentColor,
                      borderColor: color === recentColor ? '#3b82f6' : '#e2e8f0'
                    }}
                    title={recentColor}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          {/* Gradient Type */}
          <div className="flex gap-2">
            <button
              onClick={() => onGradientChange?.({ ...gradient!, type: 'linear' })}
              className={`flex-1 px-2 py-1.5 rounded text-xs font-medium ${
                gradient?.type === 'linear'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              Linear
            </button>
            <button
              onClick={() => onGradientChange?.({ ...gradient!, type: 'radial' })}
              className={`flex-1 px-2 py-1.5 rounded text-xs font-medium ${
                gradient?.type === 'radial'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              Radial
            </button>
            <button
              onClick={() => onGradientChange?.({ ...gradient!, type: 'conic' })}
              className={`flex-1 px-2 py-1.5 rounded text-xs font-medium ${
                gradient?.type === 'conic'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              Conic
            </button>
          </div>

          {/* Gradient Angle */}
          {gradient?.type === 'linear' && (
            <div>
              <label className="text-xs font-medium text-slate-600">
                Góc: {gradient.angle}°
              </label>
              <input
                type="range"
                min="0"
                max="360"
                value={gradient.angle}
                onChange={(e) => onGradientChange?.({ ...gradient, angle: parseInt(e.target.value) })}
                className="w-full"
              />
            </div>
          )}

          {/* Gradient Stops */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-slate-600">Điểm dừng màu</label>
              <button
                onClick={addGradientStop}
                className="p-1 hover:bg-slate-100 rounded"
                title="Thêm color stop"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            
            {gradient?.stops.map((stop, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="color"
                  value={stop.color}
                  onChange={(e) => handleGradientStopChange(idx, { color: e.target.value })}
                  className="w-8 h-8 rounded cursor-pointer"
                />
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={stop.position}
                  onChange={(e) => handleGradientStopChange(idx, { position: parseInt(e.target.value) })}
                  className="flex-1"
                />
                <span className="text-xs text-slate-600 w-10">{stop.position}%</span>
                {gradient.stops.length > 2 && (
                  <button
                    onClick={() => removeGradientStop(idx)}
                    className="p-1 hover:bg-red-100 hover:text-red-700 rounded"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Gradient Presets */}
          <div>
            <div className="text-xs font-medium text-slate-600 mb-2">Gradient thông dụng</div>
            <div className="grid grid-cols-4 gap-2">
              {gradientPresets.map((preset) => {
                const previewGradient = `linear-gradient(135deg, ${preset.stops.map(s => `${s.color} ${s.position}%`).join(', ')})`;
                return (
                  <button
                    key={preset.name}
                    onClick={() => applyGradientPreset(preset)}
                    className="h-12 rounded-lg border-2 border-slate-200 hover:border-blue-400 transition-all hover:scale-105"
                    style={{ background: previewGradient }}
                    title={preset.name}
                  />
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}