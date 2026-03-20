import { useState } from 'react';
import { Search, X, Palette, Droplet, Grid as GridIcon } from 'lucide-react';
import { BackgroundTemplate } from './InfographicBuilderData';

interface BackgroundsPanelProps {
  backgrounds: BackgroundTemplate[];
  currentBackground: string;
  onSelectBackground: (background: string) => void;
  onClose: () => void;
}

export function BackgroundsPanel({ 
  backgrounds, 
  currentBackground, 
  onSelectBackground, 
  onClose 
}: BackgroundsPanelProps) {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'solid' | 'gradient' | 'pattern'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all' as const, name: 'All', icon: Palette },
    { id: 'solid' as const, name: 'Solid', icon: Droplet },
    { id: 'gradient' as const, name: 'Gradient', icon: Palette },
    { id: 'pattern' as const, name: 'Pattern', icon: GridIcon },
  ];

  const filteredBackgrounds = backgrounds.filter(bg => {
    const matchesCategory = selectedCategory === 'all' || bg.category === selectedCategory;
    const matchesSearch = bg.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="absolute right-0 top-0 bottom-0 w-96 bg-card border-l border-border shadow-xl flex flex-col z-40">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Hình nền</h3>
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
            placeholder="Tìm kiếm nền..."
            className="w-full pl-10 pr-4 py-2 bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2">
          {categories.map(category => {
            const Icon = category.icon;
            const isActive = selectedCategory === category.id;
            
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-blue-100 text-blue-600'
                    : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {category.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Backgrounds Grid */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-3 gap-3">
          {filteredBackgrounds.map(bg => {
            const isSelected = currentBackground === bg.value;
            
            return (
              <button
                key={bg.id}
                onClick={() => onSelectBackground(bg.value)}
                className={`group relative aspect-square rounded-lg overflow-hidden border-2 transition-all hover:scale-105 ${
                  isSelected
                    ? 'border-blue-500 ring-2 ring-blue-500 ring-offset-2'
                    : 'border-border hover:border-blue-300'
                }`}
                title={bg.name}
              >
                <div
                  className="absolute inset-0"
                  style={{
                    background: bg.preview,
                    backgroundSize: bg.category === 'pattern' ? '20px 20px' : 'cover',
                  }}
                />
                
                {/* Checkered pattern for transparency */}
                {bg.value === 'transparent' && (
                  <div className="absolute inset-0 bg-[linear-gradient(45deg,#f0f0f0_25%,transparent_25%,transparent_75%,#f0f0f0_75%,#f0f0f0),linear-gradient(45deg,#f0f0f0_25%,transparent_25%,transparent_75%,#f0f0f0_75%,#f0f0f0)] bg-[length:20px_20px] bg-[position:0_0,10px_10px]" />
                )}
                
                {/* Overlay with name */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
                  <span className="text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    {bg.name}
                  </span>
                </div>
                
                {/* Selected indicator */}
                {isSelected && (
                  <div className="absolute top-1 right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
