import { useState } from 'react';
import { 
  Download, X, FileImage, File as FileIcon, Check, Loader2,
  Image as ImageIcon, FileText, Video, Package, Settings, Info,
  ChevronDown, ChevronRight, Monitor, Smartphone, Tablet, Square
} from 'lucide-react';

// Export Options Panel - Canva-style export interface
// Multiple formats, quality settings, size presets

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

interface ExportOptionsPanelProps {
  onExport: (options: ExportOptions) => Promise<void>;
  onClose: () => void;
  canvasWidth?: number;
  canvasHeight?: number;
}

const FORMAT_OPTIONS = [
  {
    id: 'png',
    name: 'PNG',
    icon: FileImage,
    description: 'Tốt nhất cho đồ họa web có nền trong suốt',
    extension: '.png',
    supports: ['transparency', 'highQuality'],
    recommended: true,
  },
  {
    id: 'jpg',
    name: 'JPG',
    icon: ImageIcon,
    description: 'Tốt nhất cho ảnh và in ấn',
    extension: '.jpg',
    supports: ['highQuality', 'compression'],
    recommended: false,
  },
  {
    id: 'svg',
    name: 'SVG',
    icon: Package,
    description: 'Đồ họa vector có thể mở rộng',
    extension: '.svg',
    supports: ['scalable', 'editableText'],
    recommended: false,
  },
  {
    id: 'pdf',
    name: 'PDF',
    icon: FileText,
    description: 'Tốt nhất cho in ấn và tài liệu',
    extension: '.pdf',
    supports: ['highQuality', 'multiPage', 'embedFonts'],
    recommended: false,
  },
  {
    id: 'mp4',
    name: 'MP4 Video',
    icon: Video,
    description: 'Xuất video động',
    extension: '.mp4',
    supports: ['animation'],
    recommended: false,
  },
  {
    id: 'gif',
    name: 'GIF',
    icon: ImageIcon,
    description: 'Ảnh động cho web',
    extension: '.gif',
    supports: ['animation', 'transparency'],
    recommended: false,
  },
];

const QUALITY_OPTIONS = [
  { id: 'low', name: 'Thấp', description: 'Kích thước tệp nhỏ', size: '~100KB' },
  { id: 'medium', name: 'Trung bình', description: 'Chất lượng cân bằng', size: '~500KB' },
  { id: 'high', name: 'Cao', description: 'Chất lượng in ấn', size: '~2MB' },
  { id: 'ultra', name: 'Siêu cao', description: 'Chất lượng tối đa', size: '~5MB' },
];

const SIZE_PRESETS = [
  { id: 'social-instagram-post', name: 'Bài đăng Instagram', width: 1080, height: 1080, icon: Square },
  { id: 'social-instagram-story', name: 'Story Instagram', width: 1080, height: 1920, icon: Smartphone },
  { id: 'social-facebook-post', name: 'Bài đăng Facebook', width: 1200, height: 630, icon: Monitor },
  { id: 'social-twitter-header', name: 'Ảnh bìa Twitter', width: 1500, height: 500, icon: Monitor },
  { id: 'social-linkedin-banner', name: 'Banner LinkedIn', width: 1584, height: 396, icon: Monitor },
  { id: 'presentation-hd', name: 'Thuyết trình HD', width: 1920, height: 1080, icon: Monitor },
  { id: 'presentation-4k', name: 'Thuyết trình 4K', width: 3840, height: 2160, icon: Monitor },
  { id: 'print-a4', name: 'Giấy A4', width: 2480, height: 3508, icon: FileText },
  { id: 'print-letter', name: 'Giấy US Letter', width: 2550, height: 3300, icon: FileText },
  { id: 'custom', name: 'Kích thước tùy chỉnh', width: 0, height: 0, icon: Settings },
];

export function ExportOptionsPanel({
  onExport,
  onClose,
  canvasWidth = 1920,
  canvasHeight = 1080,
}: ExportOptionsPanelProps) {
  const [selectedFormat, setSelectedFormat] = useState<ExportOptions['format']>('png');
  const [quality, setQuality] = useState<ExportOptions['quality']>('high');
  const [scale, setScale] = useState(1);
  const [selectedPreset, setSelectedPreset] = useState<string>('');
  const [customWidth, setCustomWidth] = useState(canvasWidth);
  const [customHeight, setCustomHeight] = useState(canvasHeight);
  const [transparent, setTransparent] = useState(true);
  const [compressImages, setCompressImages] = useState(false);
  const [embedFonts, setEmbedFonts] = useState(true);
  const [flattenLayers, setFlattenLayers] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  const selectedFormatInfo = FORMAT_OPTIONS.find(f => f.id === selectedFormat);
  const supportsTransparency = selectedFormatInfo?.supports.includes('transparency');
  const supportsQuality = !['svg'].includes(selectedFormat);

  const handleExport = async () => {
    setIsExporting(true);
    setExportProgress(0);

    // Simulate export progress
    const progressInterval = setInterval(() => {
      setExportProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 150);

    const options: ExportOptions = {
      format: selectedFormat,
      quality,
      scale,
      width: selectedPreset && selectedPreset !== 'custom' 
        ? SIZE_PRESETS.find(p => p.id === selectedPreset)?.width 
        : customWidth,
      height: selectedPreset && selectedPreset !== 'custom'
        ? SIZE_PRESETS.find(p => p.id === selectedPreset)?.height
        : customHeight,
      preset: selectedPreset,
      transparent: supportsTransparency ? transparent : false,
      compressImages,
      embedFonts,
      flattenLayers,
    };

    try {
      await onExport(options);
      clearInterval(progressInterval);
      setExportProgress(100);
      
      setTimeout(() => {
        setIsExporting(false);
        setExportProgress(0);
        onClose();
      }, 1000);
    } catch (error) {
      clearInterval(progressInterval);
      setIsExporting(false);
      setExportProgress(0);
      alert('Xuất thất bại. Vui lòng thử lại.');
    }
  };

  const estimatedFileSize = () => {
    const baseSize = (customWidth * customHeight * scale * scale) / 1000;
    const qualityMultiplier = {
      low: 0.1,
      medium: 0.5,
      high: 2,
      ultra: 5,
    }[quality];
    
    const sizeKB = baseSize * qualityMultiplier;
    if (sizeKB < 1024) return `~${Math.round(sizeKB)}KB`;
    return `~${(sizeKB / 1024).toFixed(1)}MB`;
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-green-600 via-emerald-500 to-teal-500 p-8 text-white">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 hover:bg-white/20 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-3 mb-4">
            <Download className="w-8 h-8" />
            <h2 className="text-3xl font-bold">Xuất thiết kế</h2>
          </div>
          
          <p className="text-white/90 text-lg">
            Chọn định dạng, chất lượng và cài đặt tải xuống
          </p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8">
          {isExporting ? (
            <div className="flex flex-col items-center justify-center h-full gap-6">
              <Loader2 className="w-16 h-16 text-green-600 animate-spin" />
              <h3 className="text-2xl font-bold text-gray-800">Đang xuất...</h3>
              <div className="w-full max-w-md bg-gray-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-green-600 to-teal-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${exportProgress}%` }}
                />
              </div>
              <p className="text-lg text-gray-600">{exportProgress}%</p>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Format Selection */}
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <FileIcon className="w-6 h-6 text-green-600" />
                  Định dạng tệp
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  {FORMAT_OPTIONS.map((format) => {
                    const Icon = format.icon;
                    const isSelected = selectedFormat === format.id;
                    
                    return (
                      <button
                        key={format.id}
                        onClick={() => setSelectedFormat(format.id as any)}
                        className={`relative p-6 rounded-xl border-2 transition-all text-left ${
                          isSelected
                            ? 'border-green-500 bg-green-50 shadow-lg scale-105'
                            : 'border-gray-200 hover:border-green-300 hover:shadow-md'
                        }`}
                      >
                        {format.recommended && (
                          <span className="absolute top-2 right-2 px-2 py-1 bg-green-600 text-white text-xs font-semibold rounded-full">
                            Đề xuất
                          </span>
                        )}
                        <Icon className={`w-10 h-10 mb-3 ${isSelected ? 'text-green-600' : 'text-gray-600'}`} />
                        <h4 className="font-bold text-lg text-gray-800 mb-1">{format.name}</h4>
                        <p className="text-sm text-gray-600">{format.description}</p>
                        {isSelected && (
                          <Check className="absolute bottom-4 right-4 w-6 h-6 text-green-600" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Size Presets */}
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Monitor className="w-6 h-6 text-green-600" />
                  Kích thước mẫu
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {SIZE_PRESETS.map((preset) => {
                    const Icon = preset.icon;
                    const isSelected = selectedPreset === preset.id;
                    
                    return (
                      <button
                        key={preset.id}
                        onClick={() => {
                          setSelectedPreset(preset.id);
                          if (preset.id !== 'custom') {
                            setCustomWidth(preset.width);
                            setCustomHeight(preset.height);
                          }
                        }}
                        className={`flex items-center gap-3 p-4 rounded-lg border transition-all ${
                          isSelected
                            ? 'border-green-500 bg-green-50 shadow-md'
                            : 'border-gray-200 hover:border-green-300'
                        }`}
                      >
                        <Icon className={`w-6 h-6 ${isSelected ? 'text-green-600' : 'text-gray-500'}`} />
                        <div className="flex-1 text-left">
                          <p className="font-semibold text-gray-800">{preset.name}</p>
                          {preset.width > 0 && (
                            <p className="text-sm text-gray-500">{preset.width} × {preset.height}px</p>
                          )}
                        </div>
                        {isSelected && <Check className="w-5 h-5 text-green-600" />}
                      </button>
                    );
                  })}
                </div>

                {/* Custom Size Input */}
                {selectedPreset === 'custom' && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-xl">
                    <p className="font-semibold text-gray-700 mb-3">Kích thước tùy chỉnh</p>
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <label className="block text-sm text-gray-600 mb-2">Chiều rộng (px)</label>
                        <input
                          type="number"
                          value={customWidth}
                          onChange={(e) => setCustomWidth(parseInt(e.target.value) || 0)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-sm text-gray-600 mb-2">Chiều cao (px)</label>
                        <input
                          type="number"
                          value={customHeight}
                          onChange={(e) => setCustomHeight(parseInt(e.target.value) || 0)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Quality Settings */}
              {supportsQuality && (
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Settings className="w-6 h-6 text-green-600" />
                    Chất lượng
                  </h3>
                  <div className="grid grid-cols-4 gap-3">
                    {QUALITY_OPTIONS.map((option) => {
                      const isSelected = quality === option.id;
                      
                      return (
                        <button
                          key={option.id}
                          onClick={() => setQuality(option.id as any)}
                          className={`p-4 rounded-lg border transition-all ${
                            isSelected
                              ? 'border-green-500 bg-green-50 shadow-md'
                              : 'border-gray-200 hover:border-green-300'
                          }`}
                        >
                          <p className="font-bold text-gray-800 mb-1">{option.name}</p>
                          <p className="text-xs text-gray-600 mb-2">{option.description}</p>
                          <p className="text-xs font-semibold text-green-600">{option.size}</p>
                          {isSelected && <Check className="w-5 h-5 text-green-600 mx-auto mt-2" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Advanced Options */}
              <div>
                <button
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="flex items-center gap-2 text-lg font-bold text-gray-800 hover:text-green-600 transition-colors mb-4"
                >
                  {showAdvanced ? <ChevronDown className="w-6 h-6" /> : <ChevronRight className="w-6 h-6" />}
                  Tùy chọn nâng cao
                </button>
                
                {showAdvanced && (
                  <div className="space-y-4 pl-8">
                    {supportsTransparency && (
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={transparent}
                          onChange={(e) => setTransparent(e.target.checked)}
                          className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
                        />
                        <div>
                          <p className="font-semibold text-gray-800">Nền trong suốt</p>
                          <p className="text-sm text-gray-600">Xóa màu nền</p>
                        </div>
                      </label>
                    )}

                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={compressImages}
                        onChange={(e) => setCompressImages(e.target.checked)}
                        className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
                      />
                      <div>
                        <p className="font-semibold text-gray-800">Nén hình ảnh</p>
                        <p className="text-sm text-gray-600">Giảm kích thước tệp</p>
                      </div>
                    </label>

                    {selectedFormat === 'pdf' && (
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={embedFonts}
                          onChange={(e) => setEmbedFonts(e.target.checked)}
                          className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
                        />
                        <div>
                          <p className="font-semibold text-gray-800">Nhúng phông chữ</p>
                          <p className="text-sm text-gray-600">Bao gồm phông chữ trong PDF</p>
                        </div>
                      </label>
                    )}

                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={flattenLayers}
                        onChange={(e) => setFlattenLayers(e.target.checked)}
                        className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
                      />
                      <div>
                        <p className="font-semibold text-gray-800">Gộp lớp</p>
                        <p className="text-sm text-gray-600">Gộp tất cả lớp thành một</p>
                      </div>
                    </label>
                  </div>
                )}
              </div>

              {/* Export Info */}
              <div className="p-6 bg-gradient-to-br from-green-50 to-teal-50 rounded-xl border border-green-200">
                <div className="flex items-start gap-3">
                  <Info className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-gray-800 mb-2">Tóm tắt xuất</h4>
                    <div className="space-y-1 text-sm text-gray-700">
                      <p><span className="font-semibold">Định dạng:</span> {selectedFormatInfo?.name} ({selectedFormatInfo?.extension})</p>
                      <p><span className="font-semibold">Kích thước:</span> {customWidth} × {customHeight}px</p>
                      {supportsQuality && (
                        <p><span className="font-semibold">Chất lượng:</span> {quality.charAt(0).toUpperCase() + quality.slice(1)}</p>
                      )}
                      <p><span className="font-semibold">Kích thước tệp ước tính:</span> {estimatedFileSize()}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {!isExporting && (
          <div className="bg-gray-100 px-8 py-6 border-t border-gray-200 flex items-center justify-between">
            <button
              onClick={onClose}
              className="px-6 py-3 text-gray-700 hover:bg-gray-200 rounded-lg font-semibold transition-colors"
            >
              Hủy
            </button>
            <button
              onClick={handleExport}
              className="px-8 py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-xl font-bold hover:shadow-lg transition-all flex items-center gap-2"
            >
              <Download className="w-5 h-5" />
              Tải xuống {selectedFormatInfo?.name}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Export types
export type { ExportOptions, ExportOptionsPanelProps };