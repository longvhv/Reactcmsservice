import { useState } from 'react';
import { X, Crop, Sliders, Wand2, Save, RotateCw, ZoomIn, ZoomOut, Download } from 'lucide-react';

interface GalleryImage {
  id: number;
  url: string;
  caption: string;
  alt?: string;
  photographer?: string;
  location?: string;
  dateTaken?: string;
  tags?: string[];
  isCover: boolean;
  dimensions?: { width: number; height: number };
  fileSize?: number;
  exif?: {
    camera?: string;
    lens?: string;
    focalLength?: string;
    aperture?: string;
    iso?: string;
    shutterSpeed?: string;
  };
  filters?: any;
  crop?: any;
  optimized?: boolean;
}

interface GalleryImageEditorProps {
  image: GalleryImage;
  onClose: () => void;
  onSave: (imageId: number, updates: Partial<GalleryImage>) => void;
  onGenerateAICaption: (imageId: number) => void;
  onOptimize: (imageId: number) => void;
  generatingCaption: boolean;
}

export function GalleryImageEditor({
  image,
  onClose,
  onSave,
  onGenerateAICaption,
  onOptimize,
  generatingCaption
}: GalleryImageEditorProps) {
  const [activeTab, setActiveTab] = useState<'crop' | 'filters' | 'info'>('info');
  const [caption, setCaption] = useState(image.caption);
  
  // Filters
  const [filters, setFilters] = useState({
    brightness: 100,
    contrast: 100,
    saturation: 100,
    blur: 0,
    sepia: 0,
    grayscale: 0,
  });

  // Crop
  const [cropAspect, setCropAspect] = useState<'free' | '16:9' | '4:3' | '1:1' | '9:16'>('free');

  const handleSave = () => {
    onSave(image.id, {
      caption,
      filters: activeTab === 'filters' ? filters : image.filters,
    });
    onClose();
  };

  const getFilterStyle = () => {
    return {
      filter: `brightness(${filters.brightness}%) contrast(${filters.contrast}%) saturate(${filters.saturation}%) blur(${filters.blur}px) sepia(${filters.sepia}%) grayscale(${filters.grayscale}%)`,
    };
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border/60">
          <h2 className="text-xl font-semibold">Chỉnh sửa ảnh</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Image Preview */}
          <div className="flex-1 bg-gray-100 flex items-center justify-center p-8">
            <div className="max-w-full max-h-full">
              <img
                src={image.url}
                alt={image.caption}
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                style={activeTab === 'filters' ? getFilterStyle() : undefined}
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-96 border-l border-border/60 flex flex-col">
            {/* Tabs */}
            <div className="flex border-b border-border/60">
              <button
                onClick={() => setActiveTab('info')}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === 'info'
                    ? 'bg-purple-50 text-purple-700 border-b-2 border-purple-500'
                    : 'text-muted-foreground hover:bg-muted'
                }`}
              >
                Thông tin
              </button>
              <button
                onClick={() => setActiveTab('crop')}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === 'crop'
                    ? 'bg-purple-50 text-purple-700 border-b-2 border-purple-500'
                    : 'text-muted-foreground hover:bg-muted'
                }`}
              >
                <Crop className="w-4 h-4 inline mr-2" />
                Cắt ảnh
              </button>
              <button
                onClick={() => setActiveTab('filters')}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === 'filters'
                    ? 'bg-purple-50 text-purple-700 border-b-2 border-purple-500'
                    : 'text-muted-foreground hover:bg-muted'
                }`}
              >
                <Sliders className="w-4 h-4 inline mr-2" />
                Bộ lọc
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {activeTab === 'info' && (
                <>
                  {/* Caption with AI */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium">Mô tả ảnh</label>
                      <button
                        onClick={() => onGenerateAICaption(image.id)}
                        disabled={generatingCaption}
                        className="px-3 py-1 text-xs bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:opacity-90 transition-opacity flex items-center gap-1 disabled:opacity-50"
                      >
                        {generatingCaption ? (
                          <>
                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                            Đang tạo...
                          </>
                        ) : (
                          <>
                            <Wand2 className="w-3 h-3" />
                            AI Caption
                          </>
                        )}
                      </button>
                    </div>
                    <textarea
                      value={caption}
                      onChange={(e) => setCaption(e.target.value)}
                      placeholder="Nhập mô tả cho ảnh..."
                      className="w-full px-3 py-2 border border-border/60 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                      rows={3}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {caption.length} ký tự
                    </p>
                  </div>

                  {/* Image Stats */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium">Thông tin kỹ thuật</h4>
                    <div className="space-y-2 text-sm">
                      {image.dimensions && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Kích thước:</span>
                          <span>{image.dimensions.width} × {image.dimensions.height}px</span>
                        </div>
                      )}
                      {image.fileSize && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Dung lượng:</span>
                          <span>{(image.fileSize / 1024).toFixed(0)} KB</span>
                        </div>
                      )}
                      {image.optimized && (
                        <div className="flex justify-between text-green-600">
                          <span>Tối ưu hóa:</span>
                          <span>✓ Đã tối ưu</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Optimization */}
                  {!image.optimized && (
                    <button
                      onClick={() => onOptimize(image.id)}
                      className="w-full px-4 py-2 bg-green-50 text-green-700 border border-green-200 rounded-lg hover:bg-green-100 transition-colors flex items-center justify-center gap-2"
                    >
                      <ZoomIn className="w-4 h-4" />
                      Tối ưu hóa ảnh
                      <span className="text-xs">(Giảm ~40% dung lượng)</span>
                    </button>
                  )}
                </>
              )}

              {activeTab === 'crop' && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-3">Tỷ lệ khung hình</label>
                    <div className="grid grid-cols-2 gap-2">
                      {(['free', '16:9', '4:3', '1:1', '9:16'] as const).map((aspect) => (
                        <button
                          key={aspect}
                          onClick={() => setCropAspect(aspect)}
                          className={`px-4 py-2 rounded-lg border-2 transition-all ${
                            cropAspect === aspect
                              ? 'border-purple-500 bg-purple-50 text-purple-700'
                              : 'border-border/60 hover:border-purple-300'
                          }`}
                        >
                          {aspect === 'free' ? 'Tự do' : aspect}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-900">
                      💡 <strong>Hướng dẫn:</strong> Click và kéo trên ảnh để chọn vùng cắt. Sử dụng các góc để điều chỉnh kích thước.
                    </p>
                  </div>
                </>
              )}

              {activeTab === 'filters' && (
                <>
                  {/* Brightness */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Độ sáng: {filters.brightness}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="200"
                      value={filters.brightness}
                      onChange={(e) => setFilters({ ...filters, brightness: Number(e.target.value) })}
                      className="w-full"
                    />
                  </div>

                  {/* Contrast */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Độ tương phản: {filters.contrast}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="200"
                      value={filters.contrast}
                      onChange={(e) => setFilters({ ...filters, contrast: Number(e.target.value) })}
                      className="w-full"
                    />
                  </div>

                  {/* Saturation */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Độ bão hòa: {filters.saturation}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="200"
                      value={filters.saturation}
                      onChange={(e) => setFilters({ ...filters, saturation: Number(e.target.value) })}
                      className="w-full"
                    />
                  </div>

                  {/* Blur */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Làm mờ: {filters.blur}px
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      value={filters.blur}
                      onChange={(e) => setFilters({ ...filters, blur: Number(e.target.value) })}
                      className="w-full"
                    />
                  </div>

                  {/* Sepia */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Sepia: {filters.sepia}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={filters.sepia}
                      onChange={(e) => setFilters({ ...filters, sepia: Number(e.target.value) })}
                      className="w-full"
                    />
                  </div>

                  {/* Grayscale */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Đen trắng: {filters.grayscale}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={filters.grayscale}
                      onChange={(e) => setFilters({ ...filters, grayscale: Number(e.target.value) })}
                      className="w-full"
                    />
                  </div>

                  <button
                    onClick={() => setFilters({
                      brightness: 100,
                      contrast: 100,
                      saturation: 100,
                      blur: 0,
                      sepia: 0,
                      grayscale: 0,
                    })}
                    className="w-full px-4 py-2 border border-border/60 rounded-lg hover:bg-muted transition-colors flex items-center justify-center gap-2"
                  >
                    <RotateCw className="w-4 h-4" />
                    Reset bộ lọc
                  </button>
                </>
              )}
            </div>

            {/* Footer Actions */}
            <div className="border-t border-border/60 p-4 flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-border/60 rounded-lg hover:bg-muted transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleSave}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                Lưu thay đổi
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
