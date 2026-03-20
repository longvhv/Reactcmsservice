import { useState, useMemo } from 'react';
import { 
  Search, X, Star, Download, Eye, Sparkles, Grid3x3, List,
  TrendingUp, Heart, Clock, Zap, Filter, ChevronDown, Image as ImageIcon,
  FileText, PieChart, BarChart3, Calendar, ShoppingCart, Users, Mail,
  Globe, Megaphone, Briefcase, GraduationCap, Music, Video, Camera, Palette
} from 'lucide-react';

export interface Template {
  id: string;
  name: string;
  category: string;
  width: number;
  height: number;
  thumbnail: string;
  elements: any[];
  tags: string[];
  isPremium: boolean;
  downloads: number;
  rating: number;
  createdAt: Date;
  author?: string;
  description?: string;
}

interface TemplateLibraryProps {
  onSelectTemplate: (template: Template) => void;
  onClose: () => void;
}

const TEMPLATE_CATEGORIES = [
  { id: 'all', name: 'Tất cả mẫu', icon: Grid3x3, color: 'blue' },
  { id: 'social', name: 'Mạng xã hội', icon: Heart, color: 'pink' },
  { id: 'presentation', name: 'Thuyết trình', icon: FileText, color: 'purple' },
  { id: 'infographic', name: 'Infographic', icon: PieChart, color: 'green' },
  { id: 'report', name: 'Báo cáo', icon: BarChart3, color: 'indigo' },
  { id: 'poster', name: 'Poster', icon: ImageIcon, color: 'orange' },
  { id: 'flyer', name: 'Tờ rơi', icon: Calendar, color: 'red' },
  { id: 'business', name: 'Danh thiếp', icon: Briefcase, color: 'gray' },
  { id: 'invitation', name: 'Thiệp mời', icon: Mail, color: 'yellow' },
  { id: 'marketing', name: 'Marketing', icon: Megaphone, color: 'teal' },
];

const MOCK_TEMPLATES: Template[] = [
  {
    id: 'tmpl-1',
    name: 'Modern Instagram Post',
    category: 'social',
    width: 1080,
    height: 1080,
    thumbnail: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400',
    elements: [],
    tags: ['instagram', 'modern', 'gradient', 'minimal'],
    isPremium: false,
    downloads: 15420,
    rating: 4.8,
    createdAt: new Date('2024-01-15'),
    author: 'Design Studio',
    description: 'Eye-catching Instagram post with gradient background'
  },
  {
    id: 'tmpl-2',
    name: 'Business Presentation',
    category: 'presentation',
    width: 1920,
    height: 1080,
    thumbnail: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400',
    elements: [],
    tags: ['presentation', 'corporate', 'professional', 'charts'],
    isPremium: true,
    downloads: 8930,
    rating: 4.9,
    createdAt: new Date('2024-02-01'),
    author: 'Pro Designs',
    description: 'Professional presentation template with data charts'
  },
  {
    id: 'tmpl-3',
    name: 'Data Infographic',
    category: 'infographic',
    width: 800,
    height: 2000,
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400',
    elements: [],
    tags: ['infographic', 'data', 'statistics', 'charts'],
    isPremium: false,
    downloads: 12340,
    rating: 4.7,
    createdAt: new Date('2024-01-20'),
    author: 'Data Viz Team',
    description: 'Vertical infographic perfect for data visualization'
  },
  {
    id: 'tmpl-4',
    name: 'Event Poster',
    category: 'poster',
    width: 1200,
    height: 1600,
    thumbnail: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400',
    elements: [],
    tags: ['poster', 'event', 'colorful', 'bold'],
    isPremium: false,
    downloads: 9870,
    rating: 4.6,
    createdAt: new Date('2024-01-25'),
    author: 'Event Masters',
    description: 'Bold and colorful event poster template'
  },
  {
    id: 'tmpl-5',
    name: 'Marketing Flyer',
    category: 'marketing',
    width: 1080,
    height: 1920,
    thumbnail: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400',
    elements: [],
    tags: ['flyer', 'marketing', 'promotion', 'modern'],
    isPremium: true,
    downloads: 11200,
    rating: 4.8,
    createdAt: new Date('2024-02-05'),
    author: 'Marketing Pro',
    description: 'Modern marketing flyer with call-to-action'
  },
  {
    id: 'tmpl-6',
    name: 'Annual Report',
    category: 'report',
    width: 2480,
    height: 3508,
    thumbnail: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400',
    elements: [],
    tags: ['report', 'annual', 'corporate', 'data'],
    isPremium: true,
    downloads: 6540,
    rating: 4.9,
    createdAt: new Date('2024-02-10'),
    author: 'Corporate Suite',
    description: 'Professional annual report template with charts'
  },
];

export function TemplateLibrary({ onSelectTemplate, onClose }: TemplateLibraryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'popular' | 'recent' | 'rating'>('popular');
  const [showPremiumOnly, setShowPremiumOnly] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);

  const filteredTemplates = useMemo(() => {
    let filtered = MOCK_TEMPLATES;

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(t => t.category === selectedCategory);
    }

    // Premium filter
    if (showPremiumOnly) {
      filtered = filtered.filter(t => t.isPremium);
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(t => 
        t.name.toLowerCase().includes(query) ||
        t.tags.some(tag => tag.toLowerCase().includes(query)) ||
        t.description?.toLowerCase().includes(query)
      );
    }

    // Sort
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'popular':
          return b.downloads - a.downloads;
        case 'recent':
          return b.createdAt.getTime() - a.createdAt.getTime();
        case 'rating':
          return b.rating - a.rating;
        default:
          return 0;
      }
    });

    return filtered;
  }, [searchQuery, selectedCategory, sortBy, showPremiumOnly]);

  const handleUseTemplate = (template: Template) => {
    onSelectTemplate(template);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-7xl h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Thư viện mẫu</h2>
              <p className="text-sm text-gray-500">Chọn từ {MOCK_TEMPLATES.length} mẫu chuyên nghiệp</p>
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
          {/* Sidebar - Categories */}
          <div className="w-64 border-r border-gray-200 p-4 overflow-y-auto">
            <div className="space-y-1">
              {TEMPLATE_CATEGORIES.map(category => {
                const Icon = category.icon;
                const isActive = selectedCategory === category.id;
                const count = category.id === 'all' 
                  ? MOCK_TEMPLATES.length 
                  : MOCK_TEMPLATES.filter(t => t.category === category.id).length;
                
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all ${
                      isActive
                        ? `bg-${category.color}-50 text-${category.color}-700 font-medium`
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? `text-${category.color}-600` : 'text-gray-400'}`} />
                    <span className="flex-1 text-left">{category.name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      isActive ? `bg-${category.color}-100` : 'bg-gray-100 text-gray-600'
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Filter Premium */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showPremiumOnly}
                  onChange={(e) => setShowPremiumOnly(e.target.checked)}
                  className="w-4 h-4 text-purple-600 rounded"
                />
                <Star className="w-4 h-4 text-yellow-500" />
                <span className="text-sm text-gray-700">Chỉ Premium</span>
              </label>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Toolbar */}
            <div className="p-4 border-b border-gray-200 space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm kiếm mẫu, thẻ hoặc từ khóa..."
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full hover:bg-gray-200 flex items-center justify-center"
                  >
                    <X className="w-3 h-3 text-gray-500" />
                  </button>
                )}
              </div>

              {/* View Controls */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === 'grid' 
                        ? 'bg-purple-100 text-purple-700' 
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Grid3x3 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === 'list' 
                        ? 'bg-purple-100 text-purple-700' 
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600">Sắp xếp:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="popular">Phổ biến nhất</option>
                    <option value="recent">Mới nhất</option>
                    <option value="rating">Đánh giá cao nhất</option>
                  </select>
                </div>
              </div>

              {/* Results count */}
              <div className="text-sm text-gray-600">
                {filteredTemplates.length} mẫu được tìm thấy
              </div>
            </div>

            {/* Templates Grid/List */}
            <div className="flex-1 overflow-y-auto p-6">
              {filteredTemplates.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <Search className="w-16 h-16 text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy mẫu</h3>
                  <p className="text-sm text-gray-500">Thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm</p>
                </div>
              ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredTemplates.map(template => (
                    <div
                      key={template.id}
                      className="group bg-white rounded-xl border-2 border-gray-200 hover:border-purple-400 hover:shadow-xl transition-all cursor-pointer overflow-hidden"
                      onClick={() => setSelectedTemplate(template)}
                    >
                      {/* Thumbnail */}
                      <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
                        <img
                          src={template.thumbnail}
                          alt={template.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {template.isPremium && (
                          <div className="absolute top-3 right-3 px-2 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center gap-1">
                            <Star className="w-3 h-3 text-white fill-white" />
                            <span className="text-xs font-medium text-white">Premium</span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedTemplate(template);
                              }}
                              className="flex-1 px-3 py-2 bg-white rounded-lg flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                              <span className="text-sm font-medium">Xem trước</span>
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleUseTemplate(template);
                              }}
                              className="flex-1 px-3 py-2 bg-purple-600 text-white rounded-lg flex items-center justify-center gap-2 hover:bg-purple-700 transition-colors"
                            >
                              <Download className="w-4 h-4" />
                              <span className="text-sm font-medium">Dùng</span>
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Info */}
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-1 truncate">{template.name}</h3>
                        <p className="text-xs text-gray-500 mb-3">{template.width} x {template.height}px</p>
                        
                        <div className="flex items-center justify-between text-xs text-gray-600">
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                            <span>{template.rating}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Download className="w-3 h-3" />
                            <span>{(template.downloads / 1000).toFixed(1)}k</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredTemplates.map(template => (
                    <div
                      key={template.id}
                      className="flex items-center gap-4 p-4 bg-white rounded-xl border-2 border-gray-200 hover:border-purple-400 hover:shadow-lg transition-all cursor-pointer"
                      onClick={() => setSelectedTemplate(template)}
                    >
                      {/* Thumbnail */}
                      <div className="relative w-32 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                        <img
                          src={template.thumbnail}
                          alt={template.name}
                          className="w-full h-full object-cover"
                        />
                        {template.isPremium && (
                          <div className="absolute top-2 right-2">
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 mb-1">{template.name}</h3>
                        <p className="text-sm text-gray-600 mb-2 line-clamp-1">{template.description}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>{template.width} x {template.height}px</span>
                          <span className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                            {template.rating}
                          </span>
                          <span className="flex items-center gap-1">
                            <Download className="w-3 h-3" />
                            {(template.downloads / 1000).toFixed(1)}k
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTemplate(template);
                          }}
                          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUseTemplate(template);
                          }}
                          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                        >
                          Sử dụng mẫu
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Template Preview Modal */}
        {selectedTemplate && (
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-8 z-10"
            onClick={() => setSelectedTemplate(null)}
          >
            <div 
              className="bg-white rounded-2xl max-w-4xl w-full max-h-full overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Preview Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-xl font-bold text-gray-900">{selectedTemplate.name}</h3>
                    {selectedTemplate.isPremium && (
                      <div className="px-2 py-0.5 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center gap-1">
                        <Star className="w-3 h-3 text-white fill-white" />
                        <span className="text-xs font-medium text-white">Premium</span>
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{selectedTemplate.description}</p>
                </div>
                <button
                  onClick={() => setSelectedTemplate(null)}
                  className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Preview Content */}
              <div className="p-6">
                <div className="relative bg-gray-100 rounded-xl overflow-hidden mb-4">
                  <img
                    src={selectedTemplate.thumbnail}
                    alt={selectedTemplate.name}
                    className="w-full"
                  />
                </div>

                {/* Template Details */}
                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div>
                    <span className="text-gray-600">Kích thước:</span>
                    <span className="ml-2 font-medium">{selectedTemplate.width} x {selectedTemplate.height}px</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Danh mục:</span>
                    <span className="ml-2 font-medium capitalize">{selectedTemplate.category}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Đánh giá:</span>
                    <span className="ml-2 font-medium flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      {selectedTemplate.rating}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Lượt tải:</span>
                    <span className="ml-2 font-medium">{selectedTemplate.downloads.toLocaleString()}</span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {selectedTemplate.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Actions */}
                <button
                  onClick={() => handleUseTemplate(selectedTemplate)}
                  className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Sử dụng mẫu này
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}