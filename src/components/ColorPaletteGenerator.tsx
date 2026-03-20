import { useState, useEffect } from 'react';
import { X, Sparkles, Upload, Eye, Copy, Check, Shuffle, Lock, Unlock, Download, Palette as PaletteIcon } from 'lucide-react';

export interface ColorPalette {
  id: string;
  name: string;
  colors: string[];
  source?: 'image' | 'ai' | 'manual';
  locked?: boolean[];
}

interface ColorPaletteGeneratorProps {
  onApplyPalette: (colors: string[]) => void;
  onClose: () => void;
}

const PREDEFINED_PALETTES: ColorPalette[] = [
  {
    id: 'pal-1',
    name: 'Ocean Breeze',
    colors: ['#0077BE', '#4A90E2', '#87CEEB', '#B0E0E6', '#E0F6FF'],
    source: 'ai'
  },
  {
    id: 'pal-2',
    name: 'Sunset Vibes',
    colors: ['#FF6B6B', '#FFB366', '#FFE66D', '#FFA07A', '#FF7F50'],
    source: 'ai'
  },
  {
    id: 'pal-3',
    name: 'Forest Dream',
    colors: ['#2D5016', '#4A7C2C', '#6B9B37', '#8FBC4C', '#B8E986'],
    source: 'ai'
  },
  {
    id: 'pal-4',
    name: 'Royal Purple',
    colors: ['#4A148C', '#6A1B9A', '#8E24AA', '#AB47BC', '#CE93D8'],
    source: 'ai'
  },
  {
    id: 'pal-5',
    name: 'Monochrome',
    colors: ['#000000', '#404040', '#808080', '#BFBFBF', '#FFFFFF'],
    source: 'ai'
  },
  {
    id: 'pal-6',
    name: 'Coral Reef',
    colors: ['#FF6F61', '#FFA07A', '#FFB6C1', '#FFC0CB', '#FFE4E1'],
    source: 'ai'
  },
  {
    id: 'pal-7',
    name: 'Mint Fresh',
    colors: ['#00BFA5', '#26C6DA', '#4DD0E1', '#80DEEA', '#B2EBF2'],
    source: 'ai'
  },
  {
    id: 'pal-8',
    name: 'Earthy Tones',
    colors: ['#8B4513', '#A0522D', '#CD853F', '#DEB887', '#F5DEB3'],
    source: 'ai'
  },
];

export function ColorPaletteGenerator({ onApplyPalette, onClose }: ColorPaletteGeneratorProps) {
  const [palettes, setPalettes] = useState<ColorPalette[]>(PREDEFINED_PALETTES);
  const [selectedPalette, setSelectedPalette] = useState<ColorPalette | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [extractedColors, setExtractedColors] = useState<string[]>([]);
  const [isExtracting, setIsExtracting] = useState(false);
  const [copiedColor, setCopiedColor] = useState<string | null>(null);
  const [customColors, setCustomColors] = useState<string[]>(['#FF5733', '#33FF57', '#3357FF', '#F333FF', '#33FFF3']);
  const [lockedColors, setLockedColors] = useState<boolean[]>([false, false, false, false, false]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string;
        setUploadedImage(imageUrl);
        extractColorsFromImage(imageUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const extractColorsFromImage = (imageUrl: string) => {
    setIsExtracting(true);
    
    // Simulate color extraction (in real app, use canvas API or external library)
    setTimeout(() => {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        // Sample colors from different areas
        const colors: string[] = [];
        const samplePoints = [
          { x: img.width * 0.2, y: img.height * 0.2 },
          { x: img.width * 0.5, y: img.height * 0.3 },
          { x: img.width * 0.8, y: img.height * 0.5 },
          { x: img.width * 0.3, y: img.height * 0.7 },
          { x: img.width * 0.6, y: img.height * 0.8 },
        ];

        samplePoints.forEach(point => {
          const imageData = ctx.getImageData(point.x, point.y, 1, 1);
          const pixel = imageData.data;
          const hex = `#${((1 << 24) + (pixel[0] << 16) + (pixel[1] << 8) + pixel[2]).toString(16).slice(1).toUpperCase()}`;
          colors.push(hex);
        });

        setExtractedColors(colors);
        setIsExtracting(false);

        // Add to palettes
        const newPalette: ColorPalette = {
          id: `palette-${Date.now()}`,
          name: 'From Image',
          colors: colors,
          source: 'image',
        };
        setPalettes([newPalette, ...palettes]);
        setSelectedPalette(newPalette);
      };
      img.src = imageUrl;
    }, 500);
  };

  const generateRandomPalette = () => {
    const newColors = customColors.map((color, index) => {
      if (lockedColors[index]) return color;
      
      const randomHue = Math.floor(Math.random() * 360);
      const randomSat = Math.floor(Math.random() * 40) + 60; // 60-100%
      const randomLight = Math.floor(Math.random() * 40) + 40; // 40-80%
      return hslToHex(randomHue, randomSat, randomLight);
    });
    
    setCustomColors(newColors);
  };

  const hslToHex = (h: number, s: number, l: number): string => {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = (n: number) => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
  };

  const handleCopyColor = (color: string) => {
    navigator.clipboard.writeText(color);
    setCopiedColor(color);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  const toggleColorLock = (index: number) => {
    const newLocked = [...lockedColors];
    newLocked[index] = !newLocked[index];
    setLockedColors(newLocked);
  };

  const handleApplyPalette = (colors: string[]) => {
    onApplyPalette(colors);
    onClose();
  };

  const exportPalette = (palette: ColorPalette) => {
    const data = {
      name: palette.name,
      colors: palette.colors,
      source: palette.source,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${palette.name.replace(/\s+/g, '-').toLowerCase()}-palette.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-orange-500 flex items-center justify-center">
              <PaletteIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Tạo bảng màu</h2>
              <p className="text-sm text-gray-500">Trích xuất màu từ hình ảnh hoặc tạo bảng màu AI</p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Upload Section */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-dashed border-purple-300">
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  <h3 className="font-semibold text-gray-900">Trích xuất từ hình ảnh</h3>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Tải lên hình ảnh và chúng tôi sẽ tự động trích xuất bảng màu
                </p>
                
                <label className="inline-flex items-center gap-2 px-4 py-2 bg-white border-2 border-purple-400 text-purple-700 rounded-lg hover:bg-purple-50 transition-colors cursor-pointer">
                  <Upload className="w-4 h-4" />
                  <span className="font-medium">Tải ảnh lên</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {uploadedImage && (
                <div className="w-48 h-32 rounded-lg overflow-hidden border-2 border-purple-300">
                  <img
                    src={uploadedImage}
                    alt="Uploaded"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>

            {isExtracting && (
              <div className="mt-4 flex items-center gap-2 text-purple-600">
                <Sparkles className="w-4 h-4 animate-spin" />
                <span className="text-sm">Đang trích xuất màu...</span>
              </div>
            )}

            {extractedColors.length > 0 && (
              <div className="mt-4">
                <div className="flex gap-2 mb-3">
                  {extractedColors.map((color, index) => (
                    <button
                      key={index}
                      onClick={() => handleCopyColor(color)}
                      className="relative flex-1 h-16 rounded-lg hover:scale-105 transition-transform group"
                      style={{ backgroundColor: color }}
                    >
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 rounded-lg">
                        {copiedColor === color ? (
                          <Check className="w-5 h-5 text-white" />
                        ) : (
                          <Copy className="w-5 h-5 text-white" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => handleApplyPalette(extractedColors)}
                  className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Áp dụng bảng màu trích xuất
                </button>
              </div>
            )}
          </div>

          {/* AI Generator Section */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-gray-900">Tạo màu AI</h3>
              </div>
              <button
                onClick={generateRandomPalette}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-blue-400 text-blue-700 rounded-lg hover:bg-blue-50 transition-colors"
              >
                <Shuffle className="w-4 h-4" />
                <span className="font-medium">Tạo ngẫu nhiên</span>
              </button>
            </div>

            <div className="space-y-3">
              {customColors.map((color, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div
                    className="w-16 h-16 rounded-lg flex-shrink-0"
                    style={{ backgroundColor: color }}
                  />
                  <input
                    type="text"
                    value={color}
                    onChange={(e) => {
                      const newColors = [...customColors];
                      newColors[index] = e.target.value;
                      setCustomColors(newColors);
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    onClick={() => toggleColorLock(index)}
                    className={`p-2 rounded-lg transition-colors ${
                      lockedColors[index]
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {lockedColors[index] ? (
                      <Lock className="w-4 h-4" />
                    ) : (
                      <Unlock className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={() => handleCopyColor(color)}
                    className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    {copiedColor === color ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4 text-gray-600" />
                    )}
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={() => handleApplyPalette(customColors)}
              className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Áp dụng bảng màu tùy chỉnh
            </button>
          </div>

          {/* Predefined Palettes */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Bảng màu thịnh hành</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {palettes.map(palette => (
                <div
                  key={palette.id}
                  className={`p-4 bg-white rounded-xl border-2 transition-all cursor-pointer ${
                    selectedPalette?.id === palette.id
                      ? 'border-purple-400 shadow-lg'
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                  }`}
                  onClick={() => setSelectedPalette(palette)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900">{palette.name}</h4>
                    <div className="flex items-center gap-2">
                      {palette.source === 'image' && (
                        <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-full">
                          Từ ảnh
                        </span>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          exportPalette(palette);
                        }}
                        className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Download className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-2 mb-3">
                    {palette.colors.map((color, index) => (
                      <button
                        key={index}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopyColor(color);
                        }}
                        className="flex-1 h-12 rounded-lg hover:scale-105 transition-transform relative group"
                        style={{ backgroundColor: color }}
                      >
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 rounded-lg">
                          {copiedColor === color ? (
                            <Check className="w-4 h-4 text-white" />
                          ) : (
                            <Copy className="w-4 h-4 text-white" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleApplyPalette(palette.colors);
                    }}
                    className="w-full px-3 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm"
                  >
                    Áp dụng bảng màu
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}