import { useState } from 'react';
import { Search, X, Layout, Briefcase, Share2, Monitor, BarChart3, TrendingUp, BookOpen } from 'lucide-react';

interface Template {
  id: string;
  name: string;
  category: string;
  thumbnail: string;
  elements: any[];
  description?: string;
  tags?: string[];
}

interface TemplateCategoryItem {
  id: string;
  name: string;
  icon: any;
}

interface CanvaTemplatesPanelProps {
  templates: Template[];
  onSelectTemplate: (template: Template) => void;
  onClose: () => void;
}

const categories: TemplateCategoryItem[] = [
  { id: 'all', name: 'Tất cả mẫu', icon: Layout },
  { id: 'business', name: 'Doanh nghiệp', icon: Briefcase },
  { id: 'social', name: 'Mạng xã hội', icon: Share2 },
  { id: 'presentation', name: 'Thuyết trình', icon: Monitor },
  { id: 'infographic', name: 'Infographic', icon: BarChart3 },
  { id: 'marketing', name: 'Marketing', icon: TrendingUp },
  { id: 'education', name: 'Giáo dục', icon: BookOpen },
];

export function CanvaTemplatesPanel({ templates, onSelectTemplate, onClose }: CanvaTemplatesPanelProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="w-full max-w-6xl h-[90vh] bg-background rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-border">
        {/* Header */}
        <div className="border-b border-border bg-card/50 backdrop-blur-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold">Thư viện mẫu</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Chọn từ các mẫu chuyên nghiệp để bắt đầu
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm mẫu..."
              className="w-full pl-10 pr-4 py-2.5 bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Categories Sidebar */}
          <div className="w-56 border-r border-border bg-card/30 p-4 overflow-y-auto">
            <div className="space-y-1">
              {categories.map(category => {
                const Icon = category.icon;
                const isActive = selectedCategory === category.id;
                
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all ${
                      isActive
                        ? 'bg-blue-100 text-blue-600 font-medium'
                        : 'hover:bg-muted/50 text-muted-foreground'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm">{category.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Templates Grid */}
          <div className="flex-1 overflow-y-auto p-6">
            {filteredTemplates.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <Layout className="w-16 h-16 text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-medium text-muted-foreground">Không tìm thấy mẫu</h3>
                <p className="text-sm text-muted-foreground/75 mt-1">
                  Thử điều chỉnh tìm kiếm hoặc bộ lọc
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTemplates.map(template => (
                  <div
                    key={template.id}
                    onClick={() => onSelectTemplate(template)}
                    className="group cursor-pointer"
                  >
                    <div className="aspect-[4/5] bg-gradient-to-br from-muted to-muted/50 rounded-xl overflow-hidden mb-3 relative border border-border hover:border-blue-500 transition-all hover:shadow-xl">
                      {/* Thumbnail Preview */}
                      <div className="absolute inset-0 flex items-center justify-center text-6xl bg-gradient-to-br from-blue-50 to-purple-50 group-hover:from-blue-100 group-hover:to-purple-100 transition-colors">
                        {template.thumbnail}
                      </div>
                      
                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium">
                            Sử dụng mẫu
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-sm mb-1 group-hover:text-blue-600 transition-colors">
                        {template.name}
                      </h3>
                      {template.description && (
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {template.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}