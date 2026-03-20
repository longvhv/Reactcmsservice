import { X, Palette, Check } from 'lucide-react';
import { ColorPalette } from './InfographicBuilderData';

interface ColorPalettesPanelProps {
  palettes: ColorPalette[];
  onSelectPalette: (palette: ColorPalette) => void;
  onSelectColor: (color: string) => void;
  onClose: () => void;
}

export function ColorPalettesPanel({ palettes, onSelectPalette, onSelectColor, onClose }: ColorPalettesPanelProps) {
  return (
    <div className="absolute right-0 top-0 bottom-0 w-96 bg-card border-l border-border shadow-xl flex flex-col z-40">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold">Bảng màu</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-muted rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Chọn bảng màu hoặc nhấn vào từng màu riêng lẻ
        </p>
      </div>

      {/* Palettes List */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {palettes.map(palette => (
            <div
              key={palette.id}
              className="group"
            >
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h4 className="text-sm font-medium">{palette.name}</h4>
                  <p className="text-xs text-muted-foreground capitalize">{palette.theme}</p>
                </div>
                <button
                  onClick={() => onSelectPalette(palette)}
                  className="px-3 py-1.5 text-xs bg-blue-100 text-blue-600 hover:bg-blue-200 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                >
                  Áp dụng tất cả
                </button>
              </div>
              
              <div className="flex gap-2">
                {palette.colors.map((color, index) => (
                  <button
                    key={index}
                    onClick={() => onSelectColor(color)}
                    className="flex-1 aspect-square rounded-lg border-2 border-border hover:border-blue-500 transition-all hover:scale-110 relative group/color"
                    style={{ backgroundColor: color }}
                    title={color}
                  >
                    <div className="absolute inset-0 bg-black/0 group-hover/color:bg-black/10 rounded-lg transition-all" />
                    <div className="absolute bottom-1 left-0 right-0 text-center opacity-0 group-hover/color:opacity-100 transition-opacity">
                      <span className="text-[8px] font-mono bg-white/90 px-1 rounded shadow-sm">
                        {color}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Color Picker */}
      <div className="p-4 border-t border-border bg-muted/30">
        <label className="text-xs font-medium text-muted-foreground mb-2 block">
          Màu tùy chỉnh
        </label>
        <input
          type="color"
          onChange={(e) => onSelectColor(e.target.value)}
          className="w-full h-12 rounded-lg cursor-pointer border-2 border-border"
        />
      </div>
    </div>
  );
}