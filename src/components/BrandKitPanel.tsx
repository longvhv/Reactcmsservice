import { useState, useEffect } from 'react';
import {
  Palette, Type, Image as ImageIcon, Plus, X, Check,
  Download, Upload, Save, Trash2, Edit3, Star, Copy,
  ChevronRight, Lock, Unlock, Eye, EyeOff, Search,
  Grid3x3, List, MoreVertical, Sparkles, Crown
} from 'lucide-react';

interface BrandColor {
  id: string;
  name: string;
  hex: string;
  isPrimary?: boolean;
  category: 'primary' | 'secondary' | 'accent' | 'neutral';
}

interface BrandFont {
  id: string;
  name: string;
  family: string;
  weights: string[];
  isPrimary?: boolean;
  category: 'heading' | 'body' | 'accent';
}

interface BrandLogo {
  id: string;
  name: string;
  url: string;
  type: 'primary' | 'secondary' | 'icon' | 'watermark';
  width: number;
  height: number;
}

interface BrandKit {
  id: string;
  name: string;
  colors: BrandColor[];
  fonts: BrandFont[];
  logos: BrandLogo[];
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface BrandKitPanelProps {
  currentBrandKit?: BrandKit;
  onSaveBrandKit: (kit: BrandKit) => void;
  onLoadBrandKit: (kit: BrandKit) => void;
  onApplyColor: (color: string) => void;
  onApplyFont: (font: BrandFont) => void;
  onApplyLogo: (logo: BrandLogo) => void;
  onClose: () => void;
}

export function BrandKitPanel({
  currentBrandKit,
  onSaveBrandKit,
  onLoadBrandKit,
  onApplyColor,
  onApplyFont,
  onApplyLogo,
  onClose,
}: BrandKitPanelProps) {
  const [activeTab, setActiveTab] = useState<'colors' | 'fonts' | 'logos'>('colors');
  const [brandKit, setBrandKit] = useState<BrandKit>(
    currentBrandKit || {
      id: `kit-${Date.now()}`,
      name: 'My Brand Kit',
      colors: [],
      fonts: [],
      logos: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  );
  const [isEditingName, setIsEditingName] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showAddColor, setShowAddColor] = useState(false);
  const [newColor, setNewColor] = useState({ name: '', hex: '#000000', category: 'primary' as const });

  // Predefined brand color palettes for inspiration
  const brandPalettes = [
    {
      name: 'Tech Startup',
      colors: ['#0066FF', '#00C4FF', '#FF6B6B', '#4ECDC4', '#1A1A2E'],
    },
    {
      name: 'Eco Friendly',
      colors: ['#52B788', '#95D5B2', '#D8F3DC', '#74C69D', '#40916C'],
    },
    {
      name: 'Luxury Brand',
      colors: ['#000000', '#FFD700', '#C0C0C0', '#2C2C2C', '#FFFFFF'],
    },
    {
      name: 'Creative Agency',
      colors: ['#FF006E', '#8338EC', '#3A86FF', '#FFBE0B', '#FB5607'],
    },
  ];

  // Common brand fonts
  const commonFonts = [
    { name: 'Inter', family: 'Inter, sans-serif', weights: ['400', '500', '600', '700', '900'] },
    { name: 'Helvetica', family: 'Helvetica, Arial, sans-serif', weights: ['400', '700'] },
    { name: 'Poppins', family: 'Poppins, sans-serif', weights: ['300', '400', '500', '600', '700'] },
    { name: 'Roboto', family: 'Roboto, sans-serif', weights: ['300', '400', '500', '700', '900'] },
    { name: 'Playfair Display', family: 'Playfair Display, serif', weights: ['400', '700', '900'] },
    { name: 'Montserrat', family: 'Montserrat, sans-serif', weights: ['400', '500', '600', '700'] },
  ];

  const addColor = () => {
    if (!newColor.name || !newColor.hex) return;

    const color: BrandColor = {
      id: `color-${Date.now()}`,
      name: newColor.name,
      hex: newColor.hex,
      category: newColor.category,
    };

    setBrandKit({
      ...brandKit,
      colors: [...brandKit.colors, color],
      updatedAt: new Date(),
    });

    setNewColor({ name: '', hex: '#000000', category: 'primary' });
    setShowAddColor(false);
  };

  const removeColor = (colorId: string) => {
    setBrandKit({
      ...brandKit,
      colors: brandKit.colors.filter(c => c.id !== colorId),
      updatedAt: new Date(),
    });
  };

  const addFont = (font: typeof commonFonts[0], category: BrandFont['category']) => {
    const brandFont: BrandFont = {
      id: `font-${Date.now()}`,
      name: font.name,
      family: font.family,
      weights: font.weights,
      category,
    };

    setBrandKit({
      ...brandKit,
      fonts: [...brandKit.fonts, brandFont],
      updatedAt: new Date(),
    });
  };

  const removeFont = (fontId: string) => {
    setBrandKit({
      ...brandKit,
      fonts: brandKit.fonts.filter(f => f.id !== fontId),
      updatedAt: new Date(),
    });
  };

  const uploadLogo = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const logo: BrandLogo = {
          id: `logo-${Date.now()}`,
          name: file.name,
          url: e.target?.result as string,
          type: 'primary',
          width: img.width,
          height: img.height,
        };

        setBrandKit({
          ...brandKit,
          logos: [...brandKit.logos, logo],
          updatedAt: new Date(),
        });
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const removeLogo = (logoId: string) => {
    setBrandKit({
      ...brandKit,
      logos: brandKit.logos.filter(l => l.id !== logoId),
      updatedAt: new Date(),
    });
  };

  const handleSave = () => {
    onSaveBrandKit(brandKit);
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(brandKit, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = `${brandKit.name.replace(/\s/g, '-')}-brand-kit.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-background border border-border rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="relative px-8 py-6 border-b border-border bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-orange-500/10">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
              <Crown className="w-6 h-6 text-white" />
            </div>
            {isEditingName ? (
              <input
                type="text"
                value={brandKit.name}
                onChange={(e) => setBrandKit({ ...brandKit, name: e.target.value })}
                onBlur={() => setIsEditingName(false)}
                onKeyDown={(e) => e.key === 'Enter' && setIsEditingName(false)}
                className="text-3xl font-bold bg-transparent border-b-2 border-primary outline-none"
                autoFocus
              />
            ) : (
              <h2
                className="text-3xl font-bold cursor-pointer hover:text-primary transition-colors"
                onClick={() => setIsEditingName(true)}
              >
                {brandKit.name}
              </h2>
            )}
            <button
              onClick={() => setIsEditingName(true)}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
            >
              <Edit3 className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>

          <p className="text-sm text-muted-foreground">
            {brandKit.colors.length} colors · {brandKit.fonts.length} fonts · {brandKit.logos.length} logos
          </p>

          {/* Actions */}
          <div className="flex items-center gap-2 mt-4">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Save className="w-4 h-4" />
              <span className="text-sm font-medium">Lưu bộ nhận diện</span>
            </button>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span className="text-sm font-medium">Xuất</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 px-6 pt-6 border-b border-border">
          {[
            { id: 'colors' as const, label: 'Màu thương hiệu', icon: Palette, count: brandKit.colors.length },
            { id: 'fonts' as const, label: 'Phông chữ', icon: Type, count: brandKit.fonts.length },
            { id: 'logos' as const, label: 'Logo & Tài nguyên', icon: ImageIcon, count: brandKit.logos.length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center gap-2 px-4 py-3 rounded-t-lg transition-all
                ${activeTab === tab.id
                  ? 'bg-background border-x border-t border-border -mb-px'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }
              `}
            >
              <tab.icon className="w-4 h-4" />
              <span className="text-sm font-medium">{tab.label}</span>
              <span className={`
                text-xs px-2 py-0.5 rounded-full
                ${activeTab === tab.id ? 'bg-primary text-primary-foreground' : 'bg-muted'}
              `}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Colors Tab */}
          {activeTab === 'colors' && (
            <div className="space-y-6">
              {/* Add Color */}
              {showAddColor ? (
                <div className="p-4 bg-muted/50 rounded-xl border border-border">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Tên màu</label>
                      <input
                        type="text"
                        value={newColor.name}
                        onChange={(e) => setNewColor({ ...newColor, name: e.target.value })}
                        placeholder="VD: Xanh chủ đạo"
                        className="w-full px-3 py-2 bg-background border border-border rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Mã màu Hex</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={newColor.hex}
                          onChange={(e) => setNewColor({ ...newColor, hex: e.target.value })}
                          className="w-12 h-10 rounded-lg cursor-pointer"
                        />
                        <input
                          type="text"
                          value={newColor.hex}
                          onChange={(e) => setNewColor({ ...newColor, hex: e.target.value })}
                          className="flex-1 px-3 py-2 bg-background border border-border rounded-lg"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium mb-2">Danh mục</label>
                    <div className="flex gap-2">
                      {(['primary', 'secondary', 'accent', 'neutral'] as const).map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setNewColor({ ...newColor, category: cat })}
                          className={`
                            px-4 py-2 rounded-lg text-sm font-medium transition-colors
                            ${newColor.category === cat
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-background border border-border hover:bg-muted'
                            }
                          `}
                        >
                          {cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-4">
                    <button
                      onClick={addColor}
                      className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      <Check className="w-4 h-4" />
                      <span className="text-sm font-medium">Thêm màu</span>
                    </button>
                    <button
                      onClick={() => setShowAddColor(false)}
                      className="px-4 py-2 bg-muted rounded-lg hover:bg-muted/80 transition-colors text-sm font-medium"
                    >
                      Hủy
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowAddColor(true)}
                  className="w-full flex items-center justify-center gap-2 p-4 bg-muted/50 rounded-xl border-2 border-dashed border-border hover:border-primary hover:bg-primary/5 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  <span className="text-sm font-medium">Thêm màu thương hiệu</span>
                </button>
              )}

              {/* Brand Colors Grid */}
              {brandKit.colors.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold mb-3">Màu thương hiệu của bạn</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {brandKit.colors.map((color) => (
                      <div
                        key={color.id}
                        className="group relative p-4 bg-muted/30 rounded-xl border border-border hover:border-primary hover:shadow-lg transition-all"
                      >
                        <div
                          className="w-full h-24 rounded-lg mb-3 shadow-inner cursor-pointer"
                          style={{ backgroundColor: color.hex }}
                          onClick={() => onApplyColor(color.hex)}
                        />
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{color.name}</p>
                            <p className="text-xs text-muted-foreground font-mono">{color.hex}</p>
                            <span className="inline-block mt-1 px-2 py-0.5 text-xs bg-background rounded-full">
                              {color.category}
                            </span>
                          </div>
                          <button
                            onClick={() => removeColor(color.id)}
                            className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-destructive/10 text-destructive transition-all"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Color Palette Inspiration */}
              <div>
                <h3 className="text-sm font-semibold mb-3">Bảng màu gợi ý</h3>
                <div className="grid gap-3">
                  {brandPalettes.map((palette, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-muted/30 rounded-xl border border-border hover:border-primary transition-colors"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-sm">{palette.name}</h4>
                        <button className="text-xs text-muted-foreground hover:text-foreground">
                          Sử dụng
                        </button>
                      </div>
                      <div className="flex gap-2">
                        {palette.colors.map((color, colorIdx) => (
                          <div
                            key={colorIdx}
                            className="flex-1 h-12 rounded-lg cursor-pointer hover:scale-105 transition-transform"
                            style={{ backgroundColor: color }}
                            onClick={() => onApplyColor(color)}
                            title={color}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Fonts Tab */}
          {activeTab === 'fonts' && (
            <div className="space-y-6">
              {/* Add Font */}
              <div>
                <h3 className="text-sm font-semibold mb-3">Thêm từ phông chữ phổ biến</h3>
                <div className="grid gap-3">
                  {commonFonts.map((font, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-muted/30 rounded-xl border border-border hover:border-primary transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-medium mb-1" style={{ fontFamily: font.family }}>
                            {font.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Weights: {font.weights.join(', ')}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          {(['heading', 'body', 'accent'] as const).map((cat) => (
                            <button
                              key={cat}
                              onClick={() => addFont(font, cat)}
                              className="px-3 py-1.5 text-xs bg-background border border-border rounded-lg hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
                            >
                              Thêm {cat === 'heading' ? 'tiêu đề' : cat === 'body' ? 'nội dung' : 'nhấn mạnh'}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Brand Fonts */}
              {brandKit.fonts.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold mb-3">Phông chữ thương hiệu của bạn</h3>
                  <div className="grid gap-3">
                    {brandKit.fonts.map((font) => (
                      <div
                        key={font.id}
                        className="group p-4 bg-muted/30 rounded-xl border border-border hover:border-primary transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <p className="text-2xl font-medium" style={{ fontFamily: font.family }}>
                                {font.name}
                              </p>
                              <span className="px-2 py-0.5 text-xs bg-background rounded-full">
                                {font.category}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground font-mono">
                              {font.family}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => onApplyFont(font)}
                              className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                            >
                              Áp dụng
                            </button>
                            <button
                              onClick={() => removeFont(font.id)}
                              className="opacity-0 group-hover:opacity-100 p-2 rounded-lg hover:bg-destructive/10 text-destructive transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Logos Tab */}
          {activeTab === 'logos' && (
            <div className="space-y-6">
              {/* Upload Logo */}
              <div>
                <label className="block w-full cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files?.[0] && uploadLogo(e.target.files[0])}
                    className="hidden"
                  />
                  <div className="flex items-center justify-center gap-3 p-8 bg-muted/50 rounded-xl border-2 border-dashed border-border hover:border-primary hover:bg-primary/5 transition-colors">
                    <Upload className="w-6 h-6" />
                    <div className="text-center">
                      <p className="text-sm font-medium">Tải logo lên</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        PNG, JPG, SVG tối đa 10MB
                      </p>
                    </div>
                  </div>
                </label>
              </div>

              {/* Logos Grid */}
              {brandKit.logos.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold mb-3">Logo của bạn</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {brandKit.logos.map((logo) => (
                      <div
                        key={logo.id}
                        className="group relative p-4 bg-muted/30 rounded-xl border border-border hover:border-primary hover:shadow-lg transition-all"
                      >
                        <div className="aspect-video bg-white rounded-lg mb-3 flex items-center justify-center p-4 overflow-hidden">
                          <img
                            src={logo.url}
                            alt={logo.name}
                            className="max-w-full max-h-full object-contain cursor-pointer"
                            onClick={() => onApplyLogo(logo)}
                          />
                        </div>
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{logo.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {logo.width} × {logo.height}px
                            </p>
                            <span className="inline-block mt-1 px-2 py-0.5 text-xs bg-background rounded-full">
                              {logo.type}
                            </span>
                          </div>
                          <button
                            onClick={() => removeLogo(logo.id)}
                            className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-destructive/10 text-destructive transition-all"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}