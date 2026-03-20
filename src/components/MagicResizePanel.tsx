import { useState } from 'react';
import {
  Maximize2, Smartphone, Monitor, Layout, Instagram,
  Facebook, Twitter, Linkedin, Youtube, X, Loader2,
  Check, Sparkles, Wand2, Image as ImageIcon,
  FileText, Presentation, Download, ArrowRight
} from 'lucide-react';

interface ResizePreset {
  id: string;
  name: string;
  width: number;
  height: number;
  category: 'social' | 'presentation' | 'print' | 'web' | 'video';
  icon: any;
  description: string;
  aspectRatio?: string;
}

interface MagicResizePanelProps {
  currentWidth: number;
  currentHeight: number;
  onResize: (width: number, height: number, preset: ResizePreset) => void;
  onBatchResize: (presets: ResizePreset[]) => void;
  onClose: () => void;
}

export function MagicResizePanel({
  currentWidth,
  currentHeight,
  onResize,
  onBatchResize,
  onClose,
}: MagicResizePanelProps) {
  const [selectedPresets, setSelectedPresets] = useState<string[]>([]);
  const [isResizing, setIsResizing] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [customWidth, setCustomWidth] = useState(currentWidth);
  const [customHeight, setCustomHeight] = useState(currentHeight);
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);

  const resizePresets: ResizePreset[] = [
    // Social Media
    {
      id: 'instagram-post',
      name: 'Instagram Post',
      width: 1080,
      height: 1080,
      category: 'social',
      icon: Instagram,
      description: 'Square post',
      aspectRatio: '1:1',
    },
    {
      id: 'instagram-story',
      name: 'Instagram Story',
      width: 1080,
      height: 1920,
      category: 'social',
      icon: Instagram,
      description: 'Vertical story',
      aspectRatio: '9:16',
    },
    {
      id: 'instagram-reel',
      name: 'Instagram Reel',
      width: 1080,
      height: 1920,
      category: 'social',
      icon: Instagram,
      description: 'Vertical video',
      aspectRatio: '9:16',
    },
    {
      id: 'facebook-post',
      name: 'Facebook Post',
      width: 1200,
      height: 630,
      category: 'social',
      icon: Facebook,
      description: 'Landscape post',
      aspectRatio: '1.91:1',
    },
    {
      id: 'facebook-cover',
      name: 'Facebook Cover',
      width: 820,
      height: 312,
      category: 'social',
      icon: Facebook,
      description: 'Profile banner',
      aspectRatio: '2.63:1',
    },
    {
      id: 'twitter-post',
      name: 'Twitter Post',
      width: 1200,
      height: 675,
      category: 'social',
      icon: Twitter,
      description: 'Landscape image',
      aspectRatio: '16:9',
    },
    {
      id: 'twitter-header',
      name: 'Twitter Header',
      width: 1500,
      height: 500,
      category: 'social',
      icon: Twitter,
      description: 'Profile banner',
      aspectRatio: '3:1',
    },
    {
      id: 'linkedin-post',
      name: 'LinkedIn Post',
      width: 1200,
      height: 627,
      category: 'social',
      icon: Linkedin,
      description: 'Shared image',
      aspectRatio: '1.91:1',
    },
    {
      id: 'linkedin-banner',
      name: 'LinkedIn Banner',
      width: 1584,
      height: 396,
      category: 'social',
      icon: Linkedin,
      description: 'Profile cover',
      aspectRatio: '4:1',
    },
    {
      id: 'youtube-thumbnail',
      name: 'YouTube Thumbnail',
      width: 1280,
      height: 720,
      category: 'social',
      icon: Youtube,
      description: 'Video thumbnail',
      aspectRatio: '16:9',
    },
    // Presentation
    {
      id: 'presentation-hd',
      name: 'Presentation HD',
      width: 1920,
      height: 1080,
      category: 'presentation',
      icon: Presentation,
      description: 'Full HD slides',
      aspectRatio: '16:9',
    },
    {
      id: 'presentation-4k',
      name: 'Presentation 4K',
      width: 3840,
      height: 2160,
      category: 'presentation',
      icon: Presentation,
      description: 'Ultra HD slides',
      aspectRatio: '16:9',
    },
    {
      id: 'presentation-43',
      name: 'Presentation 4:3',
      width: 1024,
      height: 768,
      category: 'presentation',
      icon: Presentation,
      description: 'Classic slides',
      aspectRatio: '4:3',
    },
    // Print
    {
      id: 'print-a4',
      name: 'A4 Print',
      width: 2480,
      height: 3508,
      category: 'print',
      icon: FileText,
      description: '210 × 297mm',
      aspectRatio: 'A4',
    },
    {
      id: 'print-letter',
      name: 'US Letter',
      width: 2550,
      height: 3300,
      category: 'print',
      icon: FileText,
      description: '8.5 × 11in',
      aspectRatio: 'Letter',
    },
    {
      id: 'print-poster',
      name: 'Poster A3',
      width: 3508,
      height: 4961,
      category: 'print',
      icon: FileText,
      description: '297 × 420mm',
      aspectRatio: 'A3',
    },
    // Web
    {
      id: 'web-desktop',
      name: 'Desktop HD',
      width: 1920,
      height: 1080,
      category: 'web',
      icon: Monitor,
      description: 'Full HD screen',
      aspectRatio: '16:9',
    },
    {
      id: 'web-laptop',
      name: 'Laptop',
      width: 1366,
      height: 768,
      category: 'web',
      icon: Monitor,
      description: 'Standard laptop',
      aspectRatio: '16:9',
    },
    {
      id: 'web-tablet',
      name: 'Tablet',
      width: 1024,
      height: 768,
      category: 'web',
      icon: Layout,
      description: 'iPad landscape',
      aspectRatio: '4:3',
    },
    {
      id: 'web-mobile',
      name: 'Mobile',
      width: 375,
      height: 667,
      category: 'web',
      icon: Smartphone,
      description: 'iPhone portrait',
      aspectRatio: '9:16',
    },
    // Video
    {
      id: 'video-hd',
      name: 'Video HD',
      width: 1920,
      height: 1080,
      category: 'video',
      icon: Youtube,
      description: '1080p video',
      aspectRatio: '16:9',
    },
    {
      id: 'video-4k',
      name: 'Video 4K',
      width: 3840,
      height: 2160,
      category: 'video',
      icon: Youtube,
      description: '2160p video',
      aspectRatio: '16:9',
    },
    {
      id: 'video-vertical',
      name: 'Vertical Video',
      width: 1080,
      height: 1920,
      category: 'video',
      icon: Smartphone,
      description: 'Mobile video',
      aspectRatio: '9:16',
    },
  ];

  const categories = [
    { id: 'all', label: 'Tất cả', icon: Layout },
    { id: 'social', label: 'Mạng xã hội', icon: Instagram },
    { id: 'presentation', label: 'Trình chiếu', icon: Presentation },
    { id: 'print', label: 'In ấn', icon: FileText },
    { id: 'web', label: 'Web', icon: Monitor },
    { id: 'video', label: 'Video', icon: Youtube },
  ];

  const filteredPresets = activeCategory === 'all'
    ? resizePresets
    : resizePresets.filter(p => p.category === activeCategory);

  const togglePreset = (presetId: string) => {
    setSelectedPresets(prev =>
      prev.includes(presetId)
        ? prev.filter(id => id !== presetId)
        : [...prev, presetId]
    );
  };

  const handleSingleResize = (preset: ResizePreset) => {
    setIsResizing(true);
    setTimeout(() => {
      onResize(preset.width, preset.height, preset);
      setIsResizing(false);
      onClose();
    }, 500);
  };

  const handleBatchResize = () => {
    const presets = resizePresets.filter(p => selectedPresets.includes(p.id));
    setIsResizing(true);
    setTimeout(() => {
      onBatchResize(presets);
      setIsResizing(false);
    }, 1000);
  };

  const handleCustomResize = () => {
    const customPreset: ResizePreset = {
      id: 'custom',
      name: 'Custom Size',
      width: customWidth,
      height: customHeight,
      category: 'web',
      icon: Maximize2,
      description: 'Custom dimensions',
    };
    handleSingleResize(customPreset);
  };

  const updateCustomWidth = (width: number) => {
    setCustomWidth(width);
    if (maintainAspectRatio) {
      const aspectRatio = currentWidth / currentHeight;
      setCustomHeight(Math.round(width / aspectRatio));
    }
  };

  const updateCustomHeight = (height: number) => {
    setCustomHeight(height);
    if (maintainAspectRatio) {
      const aspectRatio = currentWidth / currentHeight;
      setCustomWidth(Math.round(height * aspectRatio));
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-background border border-border rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="relative px-8 py-6 border-b border-border bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-cyan-500/10">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold">Thay đổi kích thước</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Thay đổi kích thước thiết kế sang nhiều định dạng ngay lập tức
              </p>
            </div>
          </div>

          {/* Current Size Badge */}
          <div className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-background/80 border border-border rounded-lg">
            <Maximize2 className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">
              Hiện tại: {currentWidth} × {currentHeight}px
            </span>
          </div>
        </div>

        {/* Categories */}
        <div className="flex items-center gap-2 px-6 py-4 border-b border-border overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all
                ${activeCategory === cat.id
                  ? 'bg-primary text-primary-foreground shadow-lg'
                  : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
                }
              `}
            >
              <cat.icon className="w-4 h-4" />
              <span className="text-sm font-medium">{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid gap-6">
            {/* Custom Size */}
            <div className="p-6 bg-gradient-to-br from-primary/10 to-purple-500/10 rounded-xl border border-primary/20">
              <div className="flex items-center gap-3 mb-4">
                <Wand2 className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-bold">Kích thước tùy chỉnh</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Chiều rộng (px)</label>
                  <input
                    type="number"
                    value={customWidth}
                    onChange={(e) => updateCustomWidth(Number(e.target.value))}
                    className="w-full px-4 py-2 bg-background border border-border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Chiều cao (px)</label>
                  <input
                    type="number"
                    value={customHeight}
                    onChange={(e) => updateCustomHeight(Number(e.target.value))}
                    className="w-full px-4 py-2 bg-background border border-border rounded-lg"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={maintainAspectRatio}
                    onChange={(e) => setMaintainAspectRatio(e.target.checked)}
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-sm font-medium">Giữ nguyên tỷ lệ</span>
                </label>

                <button
                  onClick={handleCustomResize}
                  disabled={isResizing}
                  className="flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors"
                >
                  {isResizing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-sm font-medium">Đang thay đổi...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span className="text-sm font-medium">Áp dụng kích thước</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Preset Sizes */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">
                  {activeCategory === 'all' ? 'Tất cả mẫu' : categories.find(c => c.id === activeCategory)?.label}
                </h3>
                
                {selectedPresets.length > 0 && (
                  <button
                    onClick={handleBatchResize}
                    disabled={isResizing}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors"
                  >
                    {isResizing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="text-sm font-medium">Đang tạo {selectedPresets.length} kích thước...</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4" />
                        <span className="text-sm font-medium">
                          Tạo {selectedPresets.length} kích thước
                        </span>
                      </>
                    )}
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredPresets.map((preset) => {
                  const isSelected = selectedPresets.includes(preset.id);
                  const Icon = preset.icon;

                  return (
                    <div
                      key={preset.id}
                      className={`
                        group relative p-4 rounded-xl border-2 transition-all cursor-pointer
                        ${isSelected
                          ? 'bg-primary/10 border-primary shadow-lg'
                          : 'bg-muted/30 border-border hover:border-primary/50 hover:shadow-md'
                        }
                      `}
                      onClick={() => togglePreset(preset.id)}
                    >
                      {/* Selection Checkbox */}
                      <div className={`
                        absolute top-3 right-3 flex items-center justify-center w-5 h-5 rounded border-2 transition-all
                        ${isSelected
                          ? 'bg-primary border-primary'
                          : 'bg-background border-border group-hover:border-primary/50'
                        }
                      `}>
                        {isSelected && <Check className="w-3 h-3 text-primary-foreground" />}
                      </div>

                      {/* Preview */}
                      <div className="relative mb-3">
                        <div
                          className="bg-background/50 border-2 border-dashed border-border rounded-lg mx-auto"
                          style={{
                            width: '100%',
                            aspectRatio: `${preset.width}/${preset.height}`,
                            maxHeight: '120px',
                          }}
                        >
                          <div className="w-full h-full flex items-center justify-center">
                            <Icon className="w-8 h-8 text-muted-foreground" />
                          </div>
                        </div>
                      </div>

                      {/* Info */}
                      <div className="space-y-1">
                        <h4 className="font-semibold text-sm">{preset.name}</h4>
                        <p className="text-xs text-muted-foreground">{preset.description}</p>
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-mono text-muted-foreground">
                            {preset.width} × {preset.height}
                          </span>
                          {preset.aspectRatio && (
                            <span className="px-2 py-0.5 bg-background rounded-full text-muted-foreground">
                              {preset.aspectRatio}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Quick Apply Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSingleResize(preset);
                        }}
                        className="mt-3 w-full flex items-center justify-center gap-2 px-3 py-2 bg-primary/10 text-primary rounded-lg opacity-0 group-hover:opacity-100 hover:bg-primary hover:text-primary-foreground transition-all"
                      >
                        <ArrowRight className="w-3.5 h-3.5" />
                        <span className="text-xs font-medium">Thay đổi ngay</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border bg-muted/30">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {selectedPresets.length > 0
                ? `Đã chọn ${selectedPresets.length} kích thước`
                : 'Chọn nhiều kích thước để thay đổi hàng loạt'}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelectedPresets([])}
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Bỏ chọn
              </button>
              <button
                onClick={() => setSelectedPresets(filteredPresets.map(p => p.id))}
                className="px-4 py-2 text-sm font-medium bg-muted rounded-lg hover:bg-muted/80 transition-colors"
              >
                Chọn tất cả
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}