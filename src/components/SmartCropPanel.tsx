import { useState, useRef, useEffect } from 'react';
import { X, Check, RotateCw, Maximize2, Minimize2, Square, Crop as CropIcon, Sparkles, Zap } from 'lucide-react';

export interface CropPreset {
  id: string;
  name: string;
  ratio: number | 'free';
  width?: number;
  height?: number;
  category: 'social' | 'print' | 'web' | 'custom';
}

interface SmartCropPanelProps {
  imageUrl: string;
  imageWidth: number;
  imageHeight: number;
  onCrop: (croppedData: { x: number; y: number; width: number; height: number; imageData: string }) => void;
  onClose: () => void;
}

const CROP_PRESETS: CropPreset[] = [
  // Mạng xã hội
  { id: 'instagram-square', name: 'Instagram Vuông', ratio: 1, width: 1080, height: 1080, category: 'social' },
  { id: 'instagram-portrait', name: 'Instagram Dọc', ratio: 4/5, width: 1080, height: 1350, category: 'social' },
  { id: 'instagram-story', name: 'Instagram Story', ratio: 9/16, width: 1080, height: 1920, category: 'social' },
  { id: 'facebook-cover', name: 'Ảnh bìa Facebook', ratio: 820/312, width: 820, height: 312, category: 'social' },
  { id: 'twitter-post', name: 'Bài đăng Twitter', ratio: 16/9, width: 1200, height: 675, category: 'social' },
  { id: 'linkedin-post', name: 'Bài đăng LinkedIn', ratio: 1.91, width: 1200, height: 627, category: 'social' },
  { id: 'youtube-thumb', name: 'Thumbnail YouTube', ratio: 16/9, width: 1280, height: 720, category: 'social' },
  
  // In ấn
  { id: 'print-a4', name: 'A4 Dọc', ratio: 210/297, width: 2480, height: 3508, category: 'print' },
  { id: 'print-a4-land', name: 'A4 Ngang', ratio: 297/210, width: 3508, height: 2480, category: 'print' },
  { id: 'print-letter', name: 'Khổ Letter', ratio: 8.5/11, width: 2550, height: 3300, category: 'print' },
  { id: 'print-business', name: 'Danh thiếp', ratio: 3.5/2, width: 1050, height: 600, category: 'print' },
  
  // Web
  { id: 'web-banner', name: 'Banner Web', ratio: 728/90, width: 728, height: 90, category: 'web' },
  { id: 'web-hero', name: 'Ảnh Hero', ratio: 16/9, width: 1920, height: 1080, category: 'web' },
  { id: 'web-og', name: 'Open Graph', ratio: 1200/630, width: 1200, height: 630, category: 'web' },
  
  // Tùy chỉnh
  { id: 'free', name: 'Tự do', ratio: 'free', category: 'custom' },
  { id: 'square', name: 'Vuông', ratio: 1, category: 'custom' },
  { id: '16-9', name: '16:9', ratio: 16/9, category: 'custom' },
  { id: '4-3', name: '4:3', ratio: 4/3, category: 'custom' },
  { id: '3-2', name: '3:2', ratio: 3/2, category: 'custom' },
];

const CATEGORIES = [
  { id: 'all', name: 'Tất cả', color: 'gray' },
  { id: 'social', name: 'Mạng xã hội', color: 'pink' },
  { id: 'print', name: 'In ấn', color: 'blue' },
  { id: 'web', name: 'Web', color: 'green' },
  { id: 'custom', name: 'Tùy chỉnh', color: 'purple' },
];

export function SmartCropPanel({ imageUrl, imageWidth, imageHeight, onCrop, onClose }: SmartCropPanelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedPreset, setSelectedPreset] = useState<CropPreset | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cropArea, setCropArea] = useState({ x: 0, y: 0, width: imageWidth, height: imageHeight });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [resizeHandle, setResizeHandle] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [aiDetecting, setAiDetecting] = useState(false);

  useEffect(() => {
    drawCanvas();
  }, [imageUrl, cropArea, zoom]);

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      // Set canvas size
      const maxWidth = 800;
      const maxHeight = 600;
      let displayWidth = img.width;
      let displayHeight = img.height;
      
      if (displayWidth > maxWidth || displayHeight > maxHeight) {
        const ratio = Math.min(maxWidth / displayWidth, maxHeight / displayHeight);
        displayWidth *= ratio;
        displayHeight *= ratio;
      }

      canvas.width = displayWidth * zoom;
      canvas.height = displayHeight * zoom;

      // Draw image
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Draw overlay
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Clear crop area
      const scaleX = canvas.width / imageWidth;
      const scaleY = canvas.height / imageHeight;
      const cropX = cropArea.x * scaleX;
      const cropY = cropArea.y * scaleY;
      const cropW = cropArea.width * scaleX;
      const cropH = cropArea.height * scaleY;

      ctx.clearRect(cropX, cropY, cropW, cropH);
      ctx.drawImage(img, 
        cropArea.x, cropArea.y, cropArea.width, cropArea.height,
        cropX, cropY, cropW, cropH
      );

      // Draw crop border
      ctx.strokeStyle = '#8B5CF6';
      ctx.lineWidth = 3;
      ctx.strokeRect(cropX, cropY, cropW, cropH);

      // Draw grid (rule of thirds)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 5]);
      
      // Vertical lines
      ctx.beginPath();
      ctx.moveTo(cropX + cropW / 3, cropY);
      ctx.lineTo(cropX + cropW / 3, cropY + cropH);
      ctx.moveTo(cropX + (cropW * 2) / 3, cropY);
      ctx.lineTo(cropX + (cropW * 2) / 3, cropY + cropH);
      
      // Horizontal lines
      ctx.moveTo(cropX, cropY + cropH / 3);
      ctx.lineTo(cropX + cropW, cropY + cropH / 3);
      ctx.moveTo(cropX, cropY + (cropH * 2) / 3);
      ctx.lineTo(cropX + cropW, cropY + (cropH * 2) / 3);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw resize handles
      const handleSize = 12;
      ctx.fillStyle = '#8B5CF6';
      const handles = [
        { x: cropX, y: cropY }, // top-left
        { x: cropX + cropW, y: cropY }, // top-right
        { x: cropX, y: cropY + cropH }, // bottom-left
        { x: cropX + cropW, y: cropY + cropH }, // bottom-right
        { x: cropX + cropW / 2, y: cropY }, // top-center
        { x: cropX + cropW / 2, y: cropY + cropH }, // bottom-center
        { x: cropX, y: cropY + cropH / 2 }, // left-center
        { x: cropX + cropW, y: cropY + cropH / 2 }, // right-center
      ];

      handles.forEach(handle => {
        ctx.fillRect(
          handle.x - handleSize / 2,
          handle.y - handleSize / 2,
          handleSize,
          handleSize
        );
      });
    };
    img.src = imageUrl;
  };

  const handlePresetSelect = (preset: CropPreset) => {
    setSelectedPreset(preset);
    
    if (preset.ratio === 'free') {
      setCropArea({ x: 0, y: 0, width: imageWidth, height: imageHeight });
      return;
    }

    // Calculate crop area based on preset ratio
    const targetRatio = preset.ratio as number;
    const imageRatio = imageWidth / imageHeight;
    
    let width, height, x, y;
    
    if (imageRatio > targetRatio) {
      // Image is wider than target
      height = imageHeight;
      width = height * targetRatio;
      x = (imageWidth - width) / 2;
      y = 0;
    } else {
      // Image is taller than target
      width = imageWidth;
      height = width / targetRatio;
      x = 0;
      y = (imageHeight - height) / 2;
    }
    
    setCropArea({ x, y, width, height });
  };

  const handleAIDetect = () => {
    setAiDetecting(true);
    
    // Simulate AI subject detection
    setTimeout(() => {
      // For demo, center crop with some padding
      const padding = 0.1;
      const x = imageWidth * padding;
      const y = imageHeight * padding;
      const width = imageWidth * (1 - 2 * padding);
      const height = imageHeight * (1 - 2 * padding);
      
      setCropArea({ x, y, width, height });
      setAiDetecting(false);
    }, 1500);
  };

  const handleCropConfirm = () => {
    const canvas = document.createElement('canvas');
    canvas.width = cropArea.width;
    canvas.height = cropArea.height;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      ctx.drawImage(
        img,
        cropArea.x, cropArea.y, cropArea.width, cropArea.height,
        0, 0, cropArea.width, cropArea.height
      );
      
      const croppedImageData = canvas.toDataURL('image/png');
      onCrop({
        x: cropArea.x,
        y: cropArea.y,
        width: cropArea.width,
        height: cropArea.height,
        imageData: croppedImageData,
      });
    };
    img.src = imageUrl;
  };

  const filteredPresets = selectedCategory === 'all'
    ? CROP_PRESETS
    : CROP_PRESETS.filter(p => p.category === selectedCategory);

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-7xl h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center">
              <CropIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Cắt ảnh thông minh</h2>
              <p className="text-sm text-gray-500">Cắt ảnh bằng AI với các mẫu có sẵn</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleAIDetect}
              disabled={aiDetecting}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {aiDetecting ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>Đang phát hiện...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  <span>AI Phát hiện chủ thể</span>
                </>
              )}
            </button>
            
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar - Presets */}
          <div className="w-72 border-r border-gray-200 overflow-y-auto">
            {/* Categories */}
            <div className="p-4 border-b border-gray-200">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Danh mục
              </div>
              <div className="space-y-1">
                {CATEGORIES.map(category => {
                  const isActive = selectedCategory === category.id;
                  const count = category.id === 'all'
                    ? CROP_PRESETS.length
                    : CROP_PRESETS.filter(p => p.category === category.id).length;

                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all ${
                        isActive
                          ? `bg-${category.color}-50 text-${category.color}-700 font-medium`
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <span>{category.name}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        isActive ? `bg-${category.color}-100` : 'bg-gray-100 text-gray-600'
                      }`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Presets */}
            <div className="p-4">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Mẫu cắt có sẵn
              </div>
              <div className="space-y-2">
                {filteredPresets.map(preset => {
                  const isActive = selectedPreset?.id === preset.id;
                  
                  return (
                    <button
                      key={preset.id}
                      onClick={() => handlePresetSelect(preset)}
                      className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
                        isActive
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="font-medium text-sm text-gray-900 mb-1">
                        {preset.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {preset.ratio === 'free' 
                          ? 'Tỷ lệ tự do'
                          : preset.width && preset.height
                            ? `${preset.width} × ${preset.height}px`
                            : `Tỷ lệ ${typeof preset.ratio === 'number' ? preset.ratio.toFixed(2) : preset.ratio}`
                        }
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Main Canvas Area */}
          <div className="flex-1 flex flex-col">
            {/* Canvas */}
            <div ref={containerRef} className="flex-1 bg-gray-900 flex items-center justify-center p-8 overflow-auto">
              <canvas
                ref={canvasRef}
                className="max-w-full max-h-full cursor-move"
              />
            </div>

            {/* Bottom Controls */}
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between mb-4">
                {/* Zoom */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
                    className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    <Minimize2 className="w-4 h-4" />
                  </button>
                  <span className="text-sm font-medium text-gray-700 w-16 text-center">
                    {Math.round(zoom * 100)}%
                  </span>
                  <button
                    onClick={() => setZoom(Math.min(2, zoom + 0.1))}
                    className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Crop Info */}
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>
                    {Math.round(cropArea.width)} × {Math.round(cropArea.height)}px
                  </span>
                  {selectedPreset && selectedPreset.ratio !== 'free' && (
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded">
                      {selectedPreset.name}
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCropArea({ x: 0, y: 0, width: imageWidth, height: imageHeight })}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-white transition-colors"
                  >
                    Đặt lại
                  </button>
                  <button
                    onClick={handleCropConfirm}
                    className="px-6 py-2 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    <span>Áp dụng cắt</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}