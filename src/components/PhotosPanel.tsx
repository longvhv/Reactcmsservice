import { useState } from 'react';
import { Search, X, ImageIcon, Loader2 } from 'lucide-react';
import { PhotoCategory } from './InfographicBuilderData';

interface PhotosPanelProps {
  categories: PhotoCategory[];
  onSelectPhoto: (url: string) => void;
  onClose: () => void;
}

export function PhotosPanel({ categories, onSelectPhoto, onClose }: PhotosPanelProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    // In a real implementation, this would call Unsplash API or similar
    // For now, we'll use placeholder images
    setTimeout(() => {
      setIsSearching(false);
    }, 1000);
  };

  const handleCategoryClick = (category: PhotoCategory) => {
    setSelectedCategory(category.id);
    setSearchQuery(category.keywords[0]);
  };

  // Placeholder images for demo
  const placeholderImages = Array.from({ length: 12 }, (_, i) => ({
    id: `img-${i}`,
    url: `https://images.unsplash.com/photo-${1600000000000 + i}?w=400&h=300&fit=crop`,
    title: `Photo ${i + 1}`,
  }));

  return (
    <div className="absolute right-0 top-0 bottom-0 w-96 bg-card border-l border-border shadow-xl flex flex-col z-40">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold">Photos</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-muted rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Search free photos..."
            className="w-full pl-10 pr-4 py-2 bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>
        
        <p className="text-xs text-muted-foreground mt-2">
          Powered by Unsplash
        </p>
      </div>

      {/* Categories */}
      <div className="p-4 border-b border-border overflow-x-auto">
        <div className="flex gap-2">
          {categories.map(category => {
            const isActive = selectedCategory === category.id;
            
            return (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
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

      {/* Photos Grid */}
      <div className="flex-1 overflow-y-auto p-4">
        {isSearching ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {placeholderImages.map(image => (
              <button
                key={image.id}
                onClick={() => onSelectPhoto(image.url)}
                className="group relative aspect-[4/3] rounded-lg overflow-hidden border border-border hover:border-blue-500 transition-all hover:scale-105"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-purple-100" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <ImageIcon className="w-8 h-8 text-muted-foreground/50" />
                </div>
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="px-3 py-1.5 bg-white rounded-lg text-xs font-medium">
                      Add to canvas
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Info Footer */}
      <div className="p-4 border-t border-border bg-muted/30">
        <p className="text-xs text-muted-foreground text-center">
          Photos from Unsplash. Click to add to your design.
        </p>
      </div>
    </div>
  );
}
