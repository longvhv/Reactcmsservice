import { useState, useRef, useEffect } from 'react';
import {
  Crop, RotateCw, FlipHorizontal, FlipVertical, Scissors, Sparkles,
  Sliders, Eraser, Wand2, Maximize2, Minimize2, ZoomIn, ZoomOut,
  CornerDownLeft, Check, X, Download, Upload, Grid, Circle,
  Square, Image as ImageIcon, Layers, Eye, EyeOff, Lock, Unlock,
  Move, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, RotateCcw,
  Droplet, Sun, Moon, Contrast, Filter, Palette, Brush, PenTool,
  Pipette, Trash2, Copy, Save, Undo2, Redo2, Settings, Info
} from 'lucide-react';

// Types
interface PhotoEditorProps {
  imageUrl: string;
  imageWidth: number;
  imageHeight: number;
  onSave: (editedImage: EditedImage) => void;
  onClose: () => void;
}

interface EditedImage {
  url: string;
  width: number;
  height: number;
  crop?: CropData;
  rotation: number;
  flipH: boolean;
  flipV: boolean;
  filters: ImageFilters;
  adjustments: ImageAdjustments;
}

interface CropData {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface ImageFilters {
  brightness: number;
  contrast: number;
  saturation: number;
  hue: number;
  blur: number;
  grayscale: number;
  sepia: number;
  invert: number;
}

interface ImageAdjustments {
  temperature: number;
  tint: number;
  exposure: number;
  highlights: number;
  shadows: number;
  vibrance: number;
  clarity: number;
  vignette: number;
  grain: number;
}

interface CropPreset {
  name: string;
  ratio: number | 'free';
  icon: React.ComponentType<any>;
}

const cropPresets: CropPreset[] = [
  { name: 'Free', ratio: 'free', icon: Maximize2 },
  { name: 'Square', ratio: 1, icon: Square },
  { name: '16:9', ratio: 16/9, icon: ImageIcon },
  { name: '4:3', ratio: 4/3, icon: ImageIcon },
  { name: '3:2', ratio: 3/2, icon: ImageIcon },
  { name: '9:16', ratio: 9/16, icon: ImageIcon },
  { name: '1:2', ratio: 1/2, icon: ImageIcon },
  { name: 'Circle', ratio: 1, icon: Circle },
];

export function PhotoEditorPanel({
  imageUrl,
  imageWidth,
  imageHeight,
  onSave,
  onClose,
}: PhotoEditorProps) {
  const [activeTab, setActiveTab] = useState<'crop' | 'adjust' | 'filters' | 'effects'>('crop');
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
  
  // Crop state
  const [isCropping, setIsCropping] = useState(false);
  const [cropData, setCropData] = useState<CropData | null>(null);
  const [cropRatio, setCropRatio] = useState<number | 'free'>('free');
  const [isDraggingCrop, setIsDraggingCrop] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  // Filters
  const [filters, setFilters] = useState<ImageFilters>({
    brightness: 100,
    contrast: 100,
    saturation: 100,
    hue: 0,
    blur: 0,
    grayscale: 0,
    sepia: 0,
    invert: 0,
  });
  
  // Adjustments
  const [adjustments, setAdjustments] = useState<ImageAdjustments>({
    temperature: 0,
    tint: 0,
    exposure: 0,
    highlights: 0,
    shadows: 0,
    vibrance: 0,
    clarity: 0,
    vignette: 0,
    grain: 0,
  });
  
  // Background removal
  const [removingBg, setRemovingBg] = useState(false);
  const [bgRemoved, setBgRemoved] = useState(false);
  
  // History
  const [history, setHistory] = useState<any[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Load image
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imageUrl;
    img.onload = () => {
      if (imageRef.current) {
        imageRef.current = img;
        renderCanvas();
      }
    };
  }, [imageUrl]);

  // Render canvas with all effects
  const renderCanvas = () => {
    const canvas = canvasRef.current;
    const img = imageRef.current;
    if (!canvas || !img) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = imageWidth;
    canvas.height = imageHeight;

    // Apply transformations
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
    ctx.translate(-canvas.width / 2, -canvas.height / 2);

    // Apply filters
    ctx.filter = getFilterString();

    // Draw image
    if (cropData) {
      ctx.drawImage(
        img,
        cropData.x,
        cropData.y,
        cropData.width,
        cropData.height,
        0,
        0,
        canvas.width,
        canvas.height
      );
    } else {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    }

    ctx.restore();
  };

  // Get CSS filter string
  const getFilterString = () => {
    const filterArray: string[] = [];
    
    if (filters.brightness !== 100) filterArray.push(`brightness(${filters.brightness}%)`);
    if (filters.contrast !== 100) filterArray.push(`contrast(${filters.contrast}%)`);
    if (filters.saturation !== 100) filterArray.push(`saturate(${filters.saturation}%)`);
    if (filters.hue !== 0) filterArray.push(`hue-rotate(${filters.hue}deg)`);
    if (filters.blur > 0) filterArray.push(`blur(${filters.blur}px)`);
    if (filters.grayscale > 0) filterArray.push(`grayscale(${filters.grayscale}%)`);
    if (filters.sepia > 0) filterArray.push(`sepia(${filters.sepia}%)`);
    if (filters.invert > 0) filterArray.push(`invert(${filters.invert}%)`);
    
    return filterArray.join(' ');
  };

  // Crop handlers
  const startCrop = () => {
    setIsCropping(true);
    setCropData({
      x: imageWidth * 0.1,
      y: imageHeight * 0.1,
      width: imageWidth * 0.8,
      height: imageHeight * 0.8,
    });
  };

  const applyCrop = () => {
    if (cropData) {
      // Save to history
      saveToHistory();
      setIsCropping(false);
      renderCanvas();
    }
  };

  const cancelCrop = () => {
    setIsCropping(false);
    setCropData(null);
  };

  // Rotation
  const rotate = (degrees: number) => {
    const newRotation = (rotation + degrees) % 360;
    setRotation(newRotation);
    saveToHistory();
  };

  // Flip
  const handleFlipH = () => {
    setFlipH(!flipH);
    saveToHistory();
  };

  const handleFlipV = () => {
    setFlipV(!flipV);
    saveToHistory();
  };

  // Background removal (simulated - would integrate with AI service)
  const removeBackground = async () => {
    setRemovingBg(true);
    
    // Simulate API call
    setTimeout(() => {
      setBgRemoved(true);
      setRemovingBg(false);
      saveToHistory();
    }, 2000);
  };

  // Filter presets
  const applyFilterPreset = (preset: string) => {
    const presets: Record<string, Partial<ImageFilters>> = {
      vivid: { brightness: 110, contrast: 120, saturation: 140 },
      dramatic: { contrast: 130, saturation: 110, brightness: 95 },
      bw: { grayscale: 100, contrast: 110 },
      sepia: { sepia: 80, brightness: 110 },
      cool: { hue: 180, saturation: 110 },
      warm: { hue: 20, saturation: 110, brightness: 105 },
    };
    
    setFilters({ ...filters, ...presets[preset] });
    saveToHistory();
  };

  // History
  const saveToHistory = () => {
    const state = {
      rotation,
      flipH,
      flipV,
      filters,
      adjustments,
      cropData,
    };
    
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(state);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const undo = () => {
    if (historyIndex > 0) {
      const prevState = history[historyIndex - 1];
      applyState(prevState);
      setHistoryIndex(historyIndex - 1);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const nextState = history[historyIndex + 1];
      applyState(nextState);
      setHistoryIndex(historyIndex + 1);
    }
  };

  const applyState = (state: any) => {
    setRotation(state.rotation);
    setFlipH(state.flipH);
    setFlipV(state.flipV);
    setFilters(state.filters);
    setAdjustments(state.adjustments);
    setCropData(state.cropData);
  };

  // Save
  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const editedImage: EditedImage = {
      url: canvas.toDataURL('image/png'),
      width: canvas.width,
      height: canvas.height,
      crop: cropData || undefined,
      rotation,
      flipH,
      flipV,
      filters,
      adjustments,
    };

    onSave(editedImage);
  };

  // Reset all
  const resetAll = () => {
    setRotation(0);
    setFlipH(false);
    setFlipV(false);
    setFilters({
      brightness: 100,
      contrast: 100,
      saturation: 100,
      hue: 0,
      blur: 0,
      grayscale: 0,
      sepia: 0,
      invert: 0,
    });
    setAdjustments({
      temperature: 0,
      tint: 0,
      exposure: 0,
      highlights: 0,
      shadows: 0,
      vibrance: 0,
      clarity: 0,
      vignette: 0,
      grain: 0,
    });
    setCropData(null);
    setIsCropping(false);
    setBgRemoved(false);
    saveToHistory();
  };

  useEffect(() => {
    renderCanvas();
  }, [rotation, flipH, flipV, filters, adjustments, cropData]);

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <ImageIcon className="w-5 h-5 text-white" />
            </div>
            <div className="text-white">
              <h2 className="text-xl font-bold">Photo Editor</h2>
              <p className="text-sm text-white/80">Công cụ chỉnh sửa ảnh chuyên nghiệp</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* History */}
            <button
              onClick={undo}
              disabled={historyIndex <= 0}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              title="Undo (⌘Z)"
            >
              <Undo2 className="w-5 h-5 text-white" />
            </button>
            <button
              onClick={redo}
              disabled={historyIndex >= history.length - 1}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              title="Redo (⌘⇧Z)"
            >
              <Redo2 className="w-5 h-5 text-white" />
            </button>

            <div className="w-px h-6 bg-white/20 mx-2" />

            {/* Reset */}
            <button
              onClick={resetAll}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white text-sm font-medium transition-colors"
            >
              Đặt lại tất cả
            </button>

            {/* Save */}
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-white text-purple-600 rounded-lg hover:bg-gray-100 font-medium text-sm transition-colors flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              Lưu thay đổi
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Tools */}
        <div className="w-80 bg-gray-900 border-r border-gray-800 overflow-y-auto">
          {/* Tabs */}
          <div className="grid grid-cols-4 gap-2 p-4 border-b border-gray-800">
            {[
              { id: 'crop', icon: Crop, label: 'Cắt ảnh' },
              { id: 'adjust', icon: Sliders, label: 'Điều chỉnh' },
              { id: 'filters', icon: Filter, label: 'Bộ lọc' },
              { id: 'effects', icon: Sparkles, label: 'Hiệu ứng' },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-colors ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tool Panels */}
          <div className="p-4">
            {activeTab === 'crop' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-white mb-3">Cắt & Thay đổi kích thước</h3>
                  
                  {!isCropping ? (
                    <button
                      onClick={startCrop}
                      className="w-full px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all font-medium flex items-center justify-center gap-2"
                    >
                      <Crop className="w-4 h-4" />
                      Bắt đầu cắt
                    </button>
                  ) : (
                    <div className="space-y-2">
                      <button
                        onClick={applyCrop}
                        className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium flex items-center justify-center gap-2"
                      >
                        <Check className="w-4 h-4" />
                        Áp dụng cắt
                      </button>
                      <button
                        onClick={cancelCrop}
                        className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium flex items-center justify-center gap-2"
                      >
                        <X className="w-4 h-4" />
                        Hủy bỏ
                      </button>
                    </div>
                  )}
                </div>

                {/* Aspect Ratios */}
                <div>
                  <h4 className="text-xs font-semibold text-gray-400 uppercase mb-2">Tỷ lệ khung hình</h4>
                  <div className="grid grid-cols-4 gap-2">
                    {cropPresets.map((preset) => {
                      const Icon = preset.icon;
                      return (
                        <button
                          key={preset.name}
                          onClick={() => setCropRatio(preset.ratio)}
                          className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
                            cropRatio === preset.ratio
                              ? 'bg-purple-500 text-white'
                              : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          <span className="text-xs">{preset.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Transform */}
                <div>
                  <h4 className="text-xs font-semibold text-gray-400 uppercase mb-2">Biến đổi</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => rotate(90)}
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-white text-sm transition-colors"
                    >
                      <RotateCw className="w-4 h-4" />
                      Xoay phải
                    </button>
                    <button
                      onClick={() => rotate(-90)}
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-white text-sm transition-colors"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Xoay trái
                    </button>
                    <button
                      onClick={handleFlipH}
                      className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-white text-sm transition-colors ${
                        flipH ? 'bg-purple-500' : 'bg-gray-800 hover:bg-gray-700'
                      }`}
                    >
                      <FlipHorizontal className="w-4 h-4" />
                      Lật ngang
                    </button>
                    <button
                      onClick={handleFlipV}
                      className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-white text-sm transition-colors ${
                        flipV ? 'bg-purple-500' : 'bg-gray-800 hover:bg-gray-700'
                      }`}
                    >
                      <FlipVertical className="w-4 h-4" />
                      Lật dọc
                    </button>
                  </div>
                </div>

                {/* Background Removal */}
                <div>
                  <h4 className="text-xs font-semibold text-gray-400 uppercase mb-2">Nền ảnh</h4>
                  <button
                    onClick={removeBackground}
                    disabled={removingBg || bgRemoved}
                    className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium flex items-center justify-center gap-2"
                  >
                    {removingBg ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Đang xóa...
                      </>
                    ) : bgRemoved ? (
                      <>
                        <Check className="w-4 h-4" />
                        Đã xóa nền
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        Xóa nền ảnh
                      </>
                    )}
                  </button>
                  <p className="text-xs text-gray-500 mt-2">
                    Sử dụng AI để tự động xóa nền ảnh
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'adjust' && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-white mb-3">Điều chỉnh hình ảnh</h3>
                
                {/* Basic Adjustments */}
                {Object.entries(filters).map(([key, value]) => (
                  <div key={key}>
                    <div className="flex justify-between text-sm mb-1">
                      <label className="text-gray-400 capitalize">{key}</label>
                      <span className="text-white">{value}{key === 'hue' ? '°' : '%'}</span>
                    </div>
                    <input
                      type="range"
                      min={key === 'hue' ? -180 : 0}
                      max={key === 'hue' ? 180 : key === 'blur' ? 20 : 200}
                      value={value}
                      onChange={(e) => {
                        setFilters({ ...filters, [key]: parseFloat(e.target.value) });
                      }}
                      onMouseUp={saveToHistory}
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-purple-500 [&::-webkit-slider-thumb]:to-pink-500"
                    />
                  </div>
                ))}

                {/* Advanced Adjustments */}
                <div className="pt-4 border-t border-gray-800">
                  <h4 className="text-xs font-semibold text-gray-400 uppercase mb-3">Nâng cao</h4>
                  {Object.entries(adjustments).map(([key, value]) => (
                    <div key={key} className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <label className="text-gray-400 capitalize">{key}</label>
                        <span className="text-white">{value}%</span>
                      </div>
                      <input
                        type="range"
                        min={-100}
                        max={100}
                        value={value}
                        onChange={(e) => {
                          setAdjustments({ ...adjustments, [key]: parseFloat(e.target.value) });
                        }}
                        onMouseUp={saveToHistory}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-purple-500 [&::-webkit-slider-thumb]:to-pink-500"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'filters' && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-white mb-3">Bộ lọc có sẵn</h3>
                
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 'vivid', name: 'Rực rỡ', color: 'from-pink-500 to-orange-500' },
                    { id: 'dramatic', name: 'Kịch tính', color: 'from-gray-700 to-black' },
                    { id: 'bw', name: 'Đen trắng', color: 'from-gray-400 to-gray-600' },
                    { id: 'sepia', name: 'Hoài cổ', color: 'from-amber-600 to-amber-800' },
                    { id: 'cool', name: 'Mát mẻ', color: 'from-blue-500 to-cyan-500' },
                    { id: 'warm', name: 'Ấm áp', color: 'from-orange-500 to-red-500' },
                  ].map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => applyFilterPreset(preset.id)}
                      className={`p-4 rounded-xl bg-gradient-to-br ${preset.color} text-white font-medium hover:scale-105 transition-transform`}
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'effects' && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-white mb-3">Hiệu ứng đặc biệt</h3>
                
                <div className="space-y-3">
                  <button className="w-full p-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-white font-medium hover:from-purple-600 hover:to-pink-600 transition-all">
                    <Sparkles className="w-5 h-5 mx-auto mb-2" />
                    AI Nâng cao
                  </button>
                  <button className="w-full p-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl text-white font-medium hover:from-blue-600 hover:to-cyan-600 transition-all">
                    <Wand2 className="w-5 h-5 mx-auto mb-2" />
                    Tự động điều chỉnh
                  </button>
                  <button className="w-full p-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl text-white font-medium hover:from-green-600 hover:to-emerald-600 transition-all">
                    <Sun className="w-5 h-5 mx-auto mb-2" />
                    Hiệu ứng HDR
                  </button>
                </div>

                <div className="pt-4 border-t border-gray-800">
                  <p className="text-xs text-gray-500">
                    Thêm nhiều hiệu ứng sẽ sớm ra mắt! Bao gồm AI nâng cao, 
                    chế độ chân dung, làm mờ nền, và nhiều hơn nữa.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Center - Canvas */}
        <div
          ref={containerRef}
          className="flex-1 flex items-center justify-center bg-gray-950 p-8 overflow-hidden relative"
        >
          {/* Canvas */}
          <div
            className="relative"
            style={{
              transform: `scale(${zoom})`,
              transition: 'transform 0.2s',
            }}
          >
            <canvas
              ref={canvasRef}
              className="max-w-full max-h-full shadow-2xl"
              style={{
                filter: getFilterString(),
                transform: `rotate(${rotation}deg) scaleX(${flipH ? -1 : 1}) scaleY(${flipV ? -1 : 1})`,
              }}
            />
            
            {/* Crop Overlay */}
            {isCropping && cropData && (
              <div
                className="absolute border-2 border-white shadow-lg"
                style={{
                  left: `${(cropData.x / imageWidth) * 100}%`,
                  top: `${(cropData.y / imageHeight) * 100}%`,
                  width: `${(cropData.width / imageWidth) * 100}%`,
                  height: `${(cropData.height / imageHeight) * 100}%`,
                  cursor: 'move',
                }}
              >
                <div className="absolute inset-0 bg-white/10 backdrop-blur-[1px]" />
                
                {/* Resize handles */}
                {['nw', 'ne', 'sw', 'se'].map((pos) => (
                  <div
                    key={pos}
                    className={`absolute w-3 h-3 bg-white rounded-full ${
                      pos === 'nw' ? '-top-1.5 -left-1.5' :
                      pos === 'ne' ? '-top-1.5 -right-1.5' :
                      pos === 'sw' ? '-bottom-1.5 -left-1.5' :
                      '-bottom-1.5 -right-1.5'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Zoom Controls */}
          <div className="absolute bottom-8 right-8 flex items-center gap-2 bg-gray-900/90 backdrop-blur-sm rounded-xl p-2">
            <button
              onClick={() => setZoom(Math.max(0.1, zoom - 0.1))}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <ZoomOut className="w-4 h-4 text-white" />
            </button>
            <span className="text-white text-sm font-medium min-w-[60px] text-center">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={() => setZoom(Math.min(3, zoom + 0.1))}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <ZoomIn className="w-4 h-4 text-white" />
            </button>
            <div className="w-px h-6 bg-gray-700 mx-1" />
            <button
              onClick={() => setZoom(1)}
              className="px-3 py-2 hover:bg-gray-800 rounded-lg transition-colors text-white text-sm font-medium"
            >
              Vừa vặn
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}