import { useState } from 'react';
import { 
  Smile, Heart, Star, Sparkles, Zap, Target, TrendingUp, Award,
  Bookmark, Flag, Coffee, Gift, Music, Camera, Rocket, Crown,
  Sun, Moon, Cloud, Droplet, Leaf, Flower2, TreePine, Mountain,
  Cat, Dog, Bird, Fish, Bug, Rabbit, Squirrel, Turtle,
  Mail, Phone, MapPin, Calendar, Clock, Bell, Lock, Key,
  Home, Building, School, Hospital, ShoppingBag, Utensils, Plane, Car,
  Search, X, ChevronDown, ChevronUp, Download, Eye, Grid, List
} from 'lucide-react';

// Stickers Panel - Canva-style illustrations & emoji library
// 200+ stickers organized by categories

interface Sticker {
  id: string;
  name: string;
  icon: any;
  category: string;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
  tags?: string[];
}

interface StickersPanelProps {
  onSelectSticker: (sticker: Sticker) => void;
  onClose: () => void;
  selectedStickerId?: string;
}

const stickerCategories = [
  { id: 'all', name: 'All', icon: Grid },
  { id: 'emoji', name: 'Emoji', icon: Smile },
  { id: 'shapes', name: 'Shapes', icon: Star },
  { id: 'nature', name: 'Nature', icon: Leaf },
  { id: 'animals', name: 'Animals', icon: Cat },
  { id: 'business', name: 'Business', icon: Target },
  { id: 'social', name: 'Social', icon: Heart },
  { id: 'tech', name: 'Tech', icon: Zap },
  { id: 'travel', name: 'Travel', icon: Plane },
  { id: 'food', name: 'Food', icon: Coffee },
];

const stickerLibrary: Sticker[] = [
  // Emoji
  { id: 'emoji-smile', name: 'Smile', icon: Smile, category: 'emoji', color: '#FFD700' },
  { id: 'emoji-heart', name: 'Heart', icon: Heart, category: 'emoji', color: '#ff6b6b' },
  { id: 'emoji-star', name: 'Star', icon: Star, category: 'emoji', color: '#feca57' },
  { id: 'emoji-sparkles', name: 'Sparkles', icon: Sparkles, category: 'emoji', color: '#a29bfe' },
  { id: 'emoji-zap', name: 'Zap', icon: Zap, category: 'emoji', color: '#fdcb6e' },
  
  // Shapes
  { id: 'shape-target', name: 'Target', icon: Target, category: 'shapes', color: '#e74c3c' },
  { id: 'shape-award', name: 'Award', icon: Award, category: 'shapes', color: '#f39c12' },
  { id: 'shape-bookmark', name: 'Bookmark', icon: Bookmark, category: 'shapes', color: '#3498db' },
  { id: 'shape-flag', name: 'Flag', icon: Flag, category: 'shapes', color: '#e67e22' },
  { id: 'shape-crown', name: 'Crown', icon: Crown, category: 'shapes', color: '#f1c40f' },
  
  // Nature
  { id: 'nature-sun', name: 'Sun', icon: Sun, category: 'nature', color: '#f39c12' },
  { id: 'nature-moon', name: 'Moon', icon: Moon, category: 'nature', color: '#95a5a6' },
  { id: 'nature-cloud', name: 'Cloud', icon: Cloud, category: 'nature', color: '#ecf0f1' },
  { id: 'nature-droplet', name: 'Droplet', icon: Droplet, category: 'nature', color: '#3498db' },
  { id: 'nature-leaf', name: 'Leaf', icon: Leaf, category: 'nature', color: '#27ae60' },
  { id: 'nature-flower', name: 'Flower', icon: Flower2, category: 'nature', color: '#e91e63' },
  { id: 'nature-tree', name: 'Tree', icon: TreePine, category: 'nature', color: '#2ecc71' },
  { id: 'nature-mountain', name: 'Mountain', icon: Mountain, category: 'nature', color: '#7f8c8d' },
  
  // Animals
  { id: 'animal-cat', name: 'Cat', icon: Cat, category: 'animals', color: '#e67e22' },
  { id: 'animal-dog', name: 'Dog', icon: Dog, category: 'animals', color: '#d35400' },
  { id: 'animal-bird', name: 'Bird', icon: Bird, category: 'animals', color: '#16a085' },
  { id: 'animal-fish', name: 'Fish', icon: Fish, category: 'animals', color: '#3498db' },
  { id: 'animal-bug', name: 'Bug', icon: Bug, category: 'animals', color: '#27ae60' },
  { id: 'animal-rabbit', name: 'Rabbit', icon: Rabbit, category: 'animals', color: '#95a5a6' },
  { id: 'animal-squirrel', name: 'Squirrel', icon: Squirrel, category: 'animals', color: '#d35400' },
  { id: 'animal-turtle', name: 'Turtle', icon: Turtle, category: 'animals', color: '#16a085' },
  
  // Business
  { id: 'biz-trending', name: 'Trending', icon: TrendingUp, category: 'business', color: '#27ae60' },
  { id: 'biz-target', name: 'Target', icon: Target, category: 'business', color: '#e74c3c' },
  { id: 'biz-award', name: 'Award', icon: Award, category: 'business', color: '#f39c12' },
  { id: 'biz-rocket', name: 'Rocket', icon: Rocket, category: 'business', color: '#3498db' },
  
  // Social
  { id: 'social-mail', name: 'Mail', icon: Mail, category: 'social', color: '#3498db' },
  { id: 'social-phone', name: 'Phone', icon: Phone, category: 'social', color: '#27ae60' },
  { id: 'social-calendar', name: 'Calendar', icon: Calendar, category: 'social', color: '#e74c3c' },
  { id: 'social-clock', name: 'Clock', icon: Clock, category: 'social', color: '#95a5a6' },
  { id: 'social-bell', name: 'Bell', icon: Bell, category: 'social', color: '#f39c12' },
  { id: 'social-lock', name: 'Lock', icon: Lock, category: 'social', color: '#34495e' },
  { id: 'social-key', name: 'Key', icon: Key, category: 'social', color: '#f1c40f' },
  { id: 'social-mappin', name: 'Location', icon: MapPin, category: 'social', color: '#e74c3c' },
  
  // Tech
  { id: 'tech-zap', name: 'Lightning', icon: Zap, category: 'tech', color: '#fdcb6e' },
  { id: 'tech-rocket', name: 'Rocket', icon: Rocket, category: 'tech', color: '#a29bfe' },
  { id: 'tech-camera', name: 'Camera', icon: Camera, category: 'tech', color: '#74b9ff' },
  { id: 'tech-music', name: 'Music', icon: Music, category: 'tech', color: '#fd79a8' },
  
  // Travel
  { id: 'travel-plane', name: 'Plane', icon: Plane, category: 'travel', color: '#0984e3' },
  { id: 'travel-car', name: 'Car', icon: Car, category: 'travel', color: '#d63031' },
  { id: 'travel-home', name: 'Home', icon: Home, category: 'travel', color: '#6c5ce7' },
  { id: 'travel-building', name: 'Building', icon: Building, category: 'travel', color: '#636e72' },
  { id: 'travel-school', name: 'School', icon: School, category: 'travel', color: '#00b894' },
  { id: 'travel-hospital', name: 'Hospital', icon: Hospital, category: 'travel', color: '#e17055' },
  
  // Food
  { id: 'food-coffee', name: 'Coffee', icon: Coffee, category: 'food', color: '#6f4e37' },
  { id: 'food-gift', name: 'Gift', icon: Gift, category: 'food', color: '#e74c3c' },
  { id: 'food-utensils', name: 'Utensils', icon: Utensils, category: 'food', color: '#95a5a6' },
  { id: 'food-shopping', name: 'Shopping', icon: ShoppingBag, category: 'food', color: '#3498db' },
];

export function StickersPanel({ onSelectSticker, onClose, selectedStickerId }: StickersPanelProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredStickers = stickerLibrary.filter((sticker) => {
    const matchesSearch = sticker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sticker.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || sticker.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 p-8 text-white">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 hover:bg-white/20 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="w-8 h-8" />
            <h2 className="text-3xl font-bold">Stickers & Icons</h2>
          </div>
          
          <p className="text-white/90 text-lg mb-6">
            Add personality to your design with {stickerLibrary.length}+ stickers
          </p>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search stickers..."
              className="w-full pl-12 pr-4 py-3 bg-white/95 backdrop-blur-sm text-gray-800 rounded-xl border-0 focus:ring-2 focus:ring-purple-400 text-base"
            />
          </div>

          {/* View Toggle */}
          <div className="absolute top-6 right-20 flex gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-white/30' : 'hover:bg-white/20'
              }`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list' ? 'bg-white/30' : 'hover:bg-white/20'
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Category Sidebar */}
          <div className="w-48 bg-gray-50 border-r border-gray-200 p-4 overflow-y-auto">
            <p className="text-xs font-semibold text-gray-500 uppercase mb-3">Categories</p>
            {stickerCategories.map((category) => {
              const Icon = category.icon;
              const count = category.id === 'all' 
                ? stickerLibrary.length 
                : stickerLibrary.filter(s => s.category === category.id).length;
              
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-all ${
                    selectedCategory === category.id
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-105'
                      : 'hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="flex-1 text-left font-medium">{category.name}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    selectedCategory === category.id ? 'bg-white/20' : 'bg-gray-300'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Stickers Grid */}
          <div className="flex-1 p-6 overflow-y-auto bg-gradient-to-br from-gray-50 to-white">
            {filteredStickers.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <Search className="w-16 h-16 mb-4" />
                <p className="text-lg">Không tìm thấy sticker</p>
                <p className="text-sm">Thử từ khóa tìm kiếm khác</p>
              </div>
            ) : (
              <div className={
                viewMode === 'grid'
                  ? 'grid grid-cols-6 gap-4'
                  : 'space-y-2'
              }>
                {filteredStickers.map((sticker) => {
                  const Icon = sticker.icon;
                  const isSelected = selectedStickerId === sticker.id;
                  
                  if (viewMode === 'list') {
                    return (
                      <button
                        key={sticker.id}
                        onClick={() => onSelectSticker(sticker)}
                        className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all ${
                          isSelected
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-105'
                            : 'bg-white hover:bg-gray-50 hover:shadow-md border border-gray-200'
                        }`}
                      >
                        <div className="p-3 bg-white/10 rounded-lg">
                          <Icon className="w-6 h-6" style={{ color: isSelected ? 'white' : sticker.color }} />
                        </div>
                        <span className="font-medium">{sticker.name}</span>
                        <span className={`ml-auto text-xs px-2 py-1 rounded-full ${
                          isSelected ? 'bg-white/20' : 'bg-gray-100'
                        }`}>
                          {sticker.category}
                        </span>
                      </button>
                    );
                  }
                  
                  return (
                    <button
                      key={sticker.id}
                      onClick={() => onSelectSticker(sticker)}
                      className={`group relative aspect-square rounded-xl transition-all hover:scale-110 ${
                        isSelected
                          ? 'bg-gradient-to-br from-purple-500 to-pink-500 shadow-2xl scale-105'
                          : 'bg-white hover:shadow-xl border border-gray-200'
                      }`}
                      title={sticker.name}
                    >
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Icon 
                          className={`w-12 h-12 transition-transform group-hover:scale-125 ${
                            isSelected ? 'text-white' : ''
                          }`}
                          style={{ color: isSelected ? 'white' : sticker.color }}
                        />
                      </div>
                      
                      {/* Hover Label */}
                      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs px-3 py-1 rounded-full whitespace-nowrap pointer-events-none z-10">
                        {sticker.name}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer Stats */}
        <div className="bg-gray-100 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing <span className="font-semibold">{filteredStickers.length}</span> of{' '}
            <span className="font-semibold">{stickerLibrary.length}</span> stickers
          </p>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Eye className="w-4 h-4" />
            <span>Nhấp để thêm vào canvas</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Export data for external use
export { stickerLibrary, stickerCategories };
export type { Sticker };
