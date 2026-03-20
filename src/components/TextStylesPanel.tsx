import { useState } from 'react';
import { X, Type, Search } from 'lucide-react';
import { TextStylePreset } from './InfographicBuilderData';

interface TextStylesPanelProps {
  presets: TextStylePreset[];
  onSelectPreset: (preset: TextStylePreset) => void;
  onClose: () => void;
}

export function TextStylesPanel({ presets, onSelectPreset, onClose }: TextStylesPanelProps) {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'heading' | 'title' | 'body' | 'quote' | 'caption'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all' as const, name: 'Tất cả' },
    { id: 'heading' as const, name: 'Tiêu đề' },
    { id: 'title' as const, name: 'Tên' },
    { id: 'body' as const, name: 'Nội dung' },
    { id: 'quote' as const, name: 'Trích dẫn' },
    { id: 'caption' as const, name: 'Chú thích' },
  ];

  const filteredPresets = presets.filter(preset => {
    const matchesCategory = selectedCategory === 'all' || preset.category === selectedCategory;
    const matchesSearch = preset.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="absolute right-0 top-0 bottom-0 w-96 bg-card border-l border-border shadow-xl flex flex-col z-40">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Type className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold">Kiểu chữ</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-muted rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm kiểu chữ..."
            className="w-full pl-10 pr-4 py-2 bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2">
          {categories.map(category => {
            const isActive = selectedCategory === category.id;
            
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-blue-100 text-blue-600'
                    : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                }`}
              >
                {category.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Presets List */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-3">
          {filteredPresets.map(preset => (
            <button
              key={preset.id}
              onClick={() => onSelectPreset(preset)}
              className="w-full p-4 bg-muted/30 hover:bg-muted/50 border border-border hover:border-blue-500 rounded-xl transition-all text-left group"
            >
              <div className="mb-2">
                <span className="text-xs font-medium text-muted-foreground capitalize">
                  {preset.category}
                </span>
              </div>
              
              <div
                className="transition-colors"
                style={{
                  fontSize: `${Math.min(preset.fontSize, 28)}px`,
                  fontWeight: preset.fontWeight,
                  fontFamily: preset.fontFamily,
                  color: preset.color,
                  lineHeight: preset.lineHeight || 1.5,
                  letterSpacing: preset.letterSpacing ? `${preset.letterSpacing}px` : undefined,
                  textAlign: preset.textAlign || 'left',
                }}
              >
                {preset.name}
              </div>
              
              <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                <span>{preset.fontSize}px</span>
                <span>•</span>
                <span className="capitalize">{preset.fontWeight}</span>
                <span>•</span>
                <span>{preset.fontFamily}</span>
              </div>
              
              <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-xs text-blue-600 font-medium">
                  Nhấn để áp dụng →
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}