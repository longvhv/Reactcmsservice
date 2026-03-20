import { useState, useMemo } from 'react';
import { X, Sparkles, Star, Search, Copy, Check, Eye, Zap } from 'lucide-react';

export interface FontPair {
  id: string;
  name: string;
  heading: {
    family: string;
    weight: string;
    size: string;
    example: string;
  };
  body: {
    family: string;
    weight: string;
    size: string;
    example: string;
  };
  category: string;
  mood: string[];
  useCase: string[];
  rating: number;
  isPremium: boolean;
}

interface FontPairingPanelProps {
  selectedElement?: any;
  onApplyFonts: (headingFont: string, bodyFont: string) => void;
  onClose: () => void;
}

const FONT_PAIRS: FontPair[] = [
  {
    id: 'pair-1',
    name: 'Modern Professional',
    heading: { family: 'Inter', weight: '700', size: '48px', example: 'The Future is Here' },
    body: { family: 'Inter', weight: '400', size: '16px', example: 'Clean and professional design for modern businesses' },
    category: 'modern',
    mood: ['professional', 'clean', 'minimal'],
    useCase: ['corporate', 'tech', 'startup'],
    rating: 4.9,
    isPremium: false
  },
  {
    id: 'pair-2',
    name: 'Classic Elegance',
    heading: { family: 'Playfair Display', weight: '700', size: '56px', example: 'Timeless Beauty' },
    body: { family: 'Source Sans Pro', weight: '400', size: '16px', example: 'Elegant serif headings paired with clean sans-serif body text' },
    category: 'classic',
    mood: ['elegant', 'sophisticated', 'luxury'],
    useCase: ['fashion', 'magazine', 'portfolio'],
    rating: 4.8,
    isPremium: true
  },
  {
    id: 'pair-3',
    name: 'Bold Impact',
    heading: { family: 'Montserrat', weight: '800', size: '52px', example: 'MAKE IT BOLD' },
    body: { family: 'Open Sans', weight: '400', size: '16px', example: 'Strong geometric headings for maximum impact and readability' },
    category: 'bold',
    mood: ['powerful', 'confident', 'dynamic'],
    useCase: ['marketing', 'poster', 'announcement'],
    rating: 4.7,
    isPremium: false
  },
  {
    id: 'pair-4',
    name: 'Friendly Approachable',
    heading: { family: 'Poppins', weight: '600', size: '44px', example: 'Welcome Friend!' },
    body: { family: 'Lato', weight: '400', size: '16px', example: 'Warm and inviting font combination perfect for community-focused designs' },
    category: 'friendly',
    mood: ['friendly', 'approachable', 'warm'],
    useCase: ['social', 'community', 'education'],
    rating: 4.8,
    isPremium: false
  },
  {
    id: 'pair-5',
    name: 'Tech Forward',
    heading: { family: 'Space Grotesk', weight: '700', size: '50px', example: 'Innovation Hub' },
    body: { family: 'IBM Plex Sans', weight: '400', size: '16px', example: 'Futuristic and technical fonts for cutting-edge technology brands' },
    category: 'tech',
    mood: ['futuristic', 'technical', 'innovative'],
    useCase: ['tech', 'ai', 'crypto'],
    rating: 4.9,
    isPremium: true
  },
  {
    id: 'pair-6',
    name: 'Creative Artistic',
    heading: { family: 'Libre Baskerville', weight: '700', size: '48px', example: 'Creative Vision' },
    body: { family: 'Raleway', weight: '400', size: '16px', example: 'Artistic serif paired with elegant sans-serif for creative projects' },
    category: 'creative',
    mood: ['artistic', 'creative', 'expressive'],
    useCase: ['design', 'art', 'creative'],
    rating: 4.7,
    isPremium: false
  },
  {
    id: 'pair-7',
    name: 'Minimal Zen',
    heading: { family: 'Work Sans', weight: '500', size: '42px', example: 'Less is More' },
    body: { family: 'Work Sans', weight: '300', size: '16px', example: 'Ultra-minimal monochrome pairing for zen-like simplicity' },
    category: 'minimal',
    mood: ['minimal', 'zen', 'calm'],
    useCase: ['wellness', 'meditation', 'lifestyle'],
    rating: 4.6,
    isPremium: false
  },
  {
    id: 'pair-8',
    name: 'Vintage Retro',
    heading: { family: 'Bebas Neue', weight: '400', size: '54px', example: 'RETRO VIBES' },
    body: { family: 'Roboto', weight: '400', size: '16px', example: 'Classic condensed headlines with modern body text for vintage appeal' },
    category: 'vintage',
    mood: ['retro', 'vintage', 'nostalgic'],
    useCase: ['vintage', 'retro', 'event'],
    rating: 4.5,
    isPremium: true
  },
  {
    id: 'pair-9',
    name: 'Editorial Premium',
    heading: { family: 'Merriweather', weight: '700', size: '46px', example: 'Editorial Excellence' },
    body: { family: 'PT Sans', weight: '400', size: '16px', example: 'Premium serif headings for high-end editorial and publishing' },
    category: 'editorial',
    mood: ['premium', 'editorial', 'authoritative'],
    useCase: ['publishing', 'news', 'blog'],
    rating: 4.8,
    isPremium: true
  },
  {
    id: 'pair-10',
    name: 'Playful Fun',
    heading: { family: 'Nunito', weight: '800', size: '48px', example: 'Let\'s Play!' },
    body: { family: 'Nunito', weight: '400', size: '16px', example: 'Rounded and friendly fonts perfect for playful and fun designs' },
    category: 'playful',
    mood: ['playful', 'fun', 'energetic'],
    useCase: ['kids', 'games', 'entertainment'],
    rating: 4.6,
    isPremium: false
  },
];

const CATEGORIES = [
  { id: 'all', name: 'All Pairs', color: 'gray' },
  { id: 'modern', name: 'Modern', color: 'blue' },
  { id: 'classic', name: 'Classic', color: 'purple' },
  { id: 'bold', name: 'Bold', color: 'red' },
  { id: 'friendly', name: 'Friendly', color: 'green' },
  { id: 'tech', name: 'Tech', color: 'indigo' },
  { id: 'creative', name: 'Creative', color: 'pink' },
  { id: 'minimal', name: 'Minimal', color: 'gray' },
  { id: 'vintage', name: 'Vintage', color: 'orange' },
];

export function FontPairingPanel({ selectedElement, onApplyFonts, onClose }: FontPairingPanelProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [previewPair, setPreviewPair] = useState<FontPair | null>(null);

  const filteredPairs = useMemo(() => {
    let filtered = FONT_PAIRS;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(query) ||
        p.mood.some(m => m.toLowerCase().includes(query)) ||
        p.useCase.some(u => u.toLowerCase().includes(query)) ||
        p.heading.family.toLowerCase().includes(query) ||
        p.body.family.toLowerCase().includes(query)
      );
    }

    return filtered.sort((a, b) => b.rating - a.rating);
  }, [searchQuery, selectedCategory]);

  const handleApplyPair = (pair: FontPair) => {
    onApplyFonts(pair.heading.family, pair.body.family);
    onClose();
  };

  const handleCopyPair = (pair: FontPair) => {
    const text = `Heading: ${pair.heading.family} ${pair.heading.weight}\nBody: ${pair.body.family} ${pair.body.weight}`;
    navigator.clipboard.writeText(text);
    setCopiedId(pair.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl h-[85vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Ghép phông AI</h2>
              <p className="text-sm text-gray-500">Kết hợp phông chữ hoàn hảo do AI thiết kế</p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="w-56 border-r border-gray-200 p-4 overflow-y-auto">
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm kiếm..."
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Danh mục
              </div>
              {CATEGORIES.map(category => {
                const isActive = selectedCategory === category.id;
                const count = category.id === 'all'
                  ? FONT_PAIRS.length
                  : FONT_PAIRS.filter(p => p.category === category.id).length;

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

            {/* AI Suggestions */}
            <div className="mt-6 p-3 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border border-purple-200">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-purple-600" />
                <span className="text-xs font-semibold text-purple-900">Gợi ý AI</span>
              </div>
              <p className="text-xs text-purple-700">
                Dựa trên thiết kế của bạn, chúng tôi gợi ý cặp <span className="font-semibold">Chuyên nghiệp hiện đại</span>
              </p>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {filteredPairs.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <Search className="w-16 h-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy cặp phông</h3>
                <p className="text-sm text-gray-500">Thử điều chỉnh tìm kiếm hoặc bộ lọc</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredPairs.map(pair => (
                  <div
                    key={pair.id}
                    className="bg-white rounded-xl border-2 border-gray-200 hover:border-purple-400 hover:shadow-xl transition-all overflow-hidden group"
                  >
                    {/* Preview */}
                    <div className="relative p-6 bg-gradient-to-br from-gray-50 to-white border-b border-gray-200">
                      {pair.isPremium && (
                        <div className="absolute top-3 right-3">
                          <div className="px-2 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center gap-1">
                            <Star className="w-3 h-3 text-white fill-white" />
                            <span className="text-xs font-medium text-white">Pro</span>
                          </div>
                        </div>
                      )}
                      
                      {/* Heading Preview */}
                      <div className="mb-4">
                        <div
                          className="text-gray-900 mb-1 leading-tight"
                          style={{
                            fontFamily: pair.heading.family,
                            fontWeight: pair.heading.weight,
                            fontSize: '32px',
                          }}
                        >
                          {pair.heading.example}
                        </div>
                        <div className="text-xs text-gray-500">
                          {pair.heading.family} · {pair.heading.weight}
                        </div>
                      </div>

                      {/* Body Preview */}
                      <div>
                        <div
                          className="text-gray-700 mb-1 leading-relaxed"
                          style={{
                            fontFamily: pair.body.family,
                            fontWeight: pair.body.weight,
                            fontSize: '14px',
                          }}
                        >
                          {pair.body.example}
                        </div>
                        <div className="text-xs text-gray-500">
                          {pair.body.family} · {pair.body.weight}
                        </div>
                      </div>

                      {/* Hover Actions */}
                      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-6">
                        <button
                          onClick={() => setPreviewPair(pair)}
                          className="px-4 py-2 bg-white rounded-lg flex items-center gap-2 hover:bg-gray-100 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                          <span className="text-sm font-medium">Xem trước</span>
                        </button>
                        <button
                          onClick={() => handleApplyPair(pair)}
                          className="px-4 py-2 bg-purple-600 text-white rounded-lg flex items-center gap-2 hover:bg-purple-700 transition-colors"
                        >
                          <Check className="w-4 h-4" />
                          <span className="text-sm font-medium">Áp dụng</span>
                        </button>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-gray-900">{pair.name}</h3>
                        <div className="flex items-center gap-1 text-sm">
                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          <span className="text-gray-700">{pair.rating}</span>
                        </div>
                      </div>

                      {/* Mood Tags */}
                      <div className="flex flex-wrap gap-1 mb-3">
                        {pair.mood.map(mood => (
                          <span
                            key={mood}
                            className="px-2 py-0.5 bg-purple-50 text-purple-700 rounded text-xs"
                          >
                            {mood}
                          </span>
                        ))}
                      </div>

                      {/* Use Cases */}
                      <div className="flex flex-wrap gap-1 mb-3">
                        {pair.useCase.map(useCase => (
                          <span
                            key={useCase}
                            className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs"
                          >
                            {useCase}
                          </span>
                        ))}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleCopyPair(pair)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                        >
                          {copiedId === pair.id ? (
                            <>
                              <Check className="w-4 h-4 text-green-600" />
                              <span className="text-sm text-green-600">Đã sao chép!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4" />
                              <span className="text-sm">Sao chép</span>
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => handleApplyPair(pair)}
                          className="flex-1 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
                        >
                          <Check className="w-4 h-4" />
                          <span className="text-sm">Áp dụng</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Preview Modal */}
        {previewPair && (
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-8 z-10"
            onClick={() => setPreviewPair(null)}
          >
            <div
              className="bg-white rounded-2xl max-w-3xl w-full p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">{previewPair.name}</h3>
                <button
                  onClick={() => setPreviewPair(null)}
                  className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Large Heading Preview */}
                <div>
                  <div
                    className="text-gray-900 mb-2"
                    style={{
                      fontFamily: previewPair.heading.family,
                      fontWeight: previewPair.heading.weight,
                      fontSize: previewPair.heading.size,
                      lineHeight: '1.2',
                    }}
                  >
                    {previewPair.heading.example}
                  </div>
                  <div className="text-sm text-gray-600">
                    {previewPair.heading.family} · {previewPair.heading.weight} · {previewPair.heading.size}
                  </div>
                </div>

                {/* Large Body Preview */}
                <div>
                  <div
                    className="text-gray-700 mb-2"
                    style={{
                      fontFamily: previewPair.body.family,
                      fontWeight: previewPair.body.weight,
                      fontSize: '18px',
                      lineHeight: '1.6',
                    }}
                  >
                    {previewPair.body.example}
                  </div>
                  <div className="text-sm text-gray-600">
                    {previewPair.body.family} · {previewPair.body.weight} · {previewPair.body.size}
                  </div>
                </div>

                <button
                  onClick={() => {
                    handleApplyPair(previewPair);
                    setPreviewPair(null);
                  }}
                  className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium hover:shadow-lg transition-all"
                >
                  Áp dụng cặp phông này
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}