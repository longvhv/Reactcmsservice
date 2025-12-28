import React, { useState } from 'react';
import {
  Search, Star, TrendingUp, Briefcase, Rocket, Calendar,
  Zap, Trophy, Book, Code, Globe, Heart, Plus, Check,
  Eye, Copy, Sparkles, Filter, Grid, List
} from 'lucide-react';
import { Card } from './Card';
import { PageWrapper } from './PageWrapper';
import { PageHeader } from './PageHeader';

interface StreamTemplate {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  color: string;
  category: string;
  icon: any;
  articles: number;
  timeline: string;
  tags: string[];
  popularity: number;
  featured: boolean;
  preview: {
    structure: string[];
    features: string[];
  };
}

export function EventStreamTemplates({ onNavigate, onUseTemplate }: { 
  onNavigate: (page: any) => void;
  onUseTemplate?: (template: StreamTemplate) => void;
}) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedTemplate, setSelectedTemplate] = useState<StreamTemplate | null>(null);

  const categories = [
    { key: 'all', label: 'Tất cả', icon: Grid },
    { key: 'marketing', label: 'Marketing', icon: TrendingUp },
    { key: 'product', label: 'Sản phẩm', icon: Rocket },
    { key: 'event', label: 'Sự kiện', icon: Calendar },
    { key: 'content', label: 'Nội dung', icon: Book },
    { key: 'tech', label: 'Công nghệ', icon: Code },
  ];

  const templates: StreamTemplate[] = [
    {
      id: 't1',
      name: 'Product Launch Campaign',
      description: 'Template hoàn chỉnh cho chiến dịch ra mắt sản phẩm mới với timeline từ teaser đến post-launch.',
      thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=500&fit=crop',
      color: '#8B5CF6',
      category: 'product',
      icon: Rocket,
      articles: 12,
      timeline: '3 tháng',
      tags: ['Product', 'Marketing', 'Launch'],
      popularity: 95,
      featured: true,
      preview: {
        structure: [
          'Pre-launch Teaser (Tuần 1-2)',
          'Product Announcement (Tuần 3)',
          'Feature Highlights (Tuần 4-6)',
          'Customer Stories (Tuần 7-8)',
          'Launch Event (Tuần 9)',
          'Post-launch Review (Tuần 10-12)',
        ],
        features: [
          'Timeline có cấu trúc rõ ràng',
          'Templates bài viết sẵn có',
          'Checklist đầy đủ',
          'Email automation',
        ],
      },
    },
    {
      id: 't2',
      name: 'Tech Conference Series',
      description: 'Quản lý sự kiện công nghệ từ A-Z với các bài viết trước, trong và sau sự kiện.',
      thumbnail: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=500&fit=crop',
      color: '#3B82F6',
      category: 'event',
      icon: Calendar,
      articles: 18,
      timeline: '6 tháng',
      tags: ['Event', 'Conference', 'Tech'],
      popularity: 88,
      featured: true,
      preview: {
        structure: [
          'Event Announcement',
          'Speaker Spotlights',
          'Agenda & Sessions',
          'Pre-event Workshops',
          'Live Coverage',
          'Post-event Highlights',
          'Session Recordings',
        ],
        features: [
          'Schedule integration',
          'Speaker management',
          'Live updates',
          'Video embeds',
        ],
      },
    },
    {
      id: 't3',
      name: 'Content Marketing Series',
      description: 'Chuỗi nội dung marketing với focus vào SEO và engagement dài hạn.',
      thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=500&fit=crop',
      color: '#10B981',
      category: 'marketing',
      icon: TrendingUp,
      articles: 15,
      timeline: '3 tháng',
      tags: ['Content', 'Marketing', 'SEO'],
      popularity: 82,
      featured: false,
      preview: {
        structure: [
          'Pillar Content',
          'Supporting Articles',
          'Case Studies',
          'Expert Interviews',
          'Data Reports',
          'How-to Guides',
        ],
        features: [
          'SEO optimization',
          'Content calendar',
          'Internal linking',
          'Analytics tracking',
        ],
      },
    },
    {
      id: 't4',
      name: 'Startup Journey Blog',
      description: 'Ghi lại hành trình khởi nghiệp từ ý tưởng đến thành công.',
      thumbnail: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&h=500&fit=crop',
      color: '#F59E0B',
      category: 'content',
      icon: Briefcase,
      articles: 20,
      timeline: '12 tháng',
      tags: ['Startup', 'Journey', 'Story'],
      popularity: 76,
      featured: false,
      preview: {
        structure: [
          'The Idea',
          'Early Challenges',
          'First Milestone',
          'Team Building',
          'Pivot Stories',
          'Success Metrics',
          'Lessons Learned',
        ],
        features: [
          'Milestone tracking',
          'Photo gallery',
          'Team profiles',
          'Progress charts',
        ],
      },
    },
    {
      id: 't5',
      name: 'Educational Course Series',
      description: 'Xây dựng khóa học online với các bài học có cấu trúc logic.',
      thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=500&fit=crop',
      color: '#EC4899',
      category: 'content',
      icon: Book,
      articles: 24,
      timeline: '4 tháng',
      tags: ['Education', 'Course', 'Learning'],
      popularity: 90,
      featured: true,
      preview: {
        structure: [
          'Course Introduction',
          'Module 1-4 Lessons',
          'Practical Exercises',
          'Quizzes & Tests',
          'Case Studies',
          'Final Project',
          'Certification',
        ],
        features: [
          'Progress tracking',
          'Quiz integration',
          'Certificate generator',
          'Student dashboard',
        ],
      },
    },
    {
      id: 't6',
      name: 'Developer Documentation',
      description: 'Template cho tài liệu kỹ thuật và API documentation chuyên nghiệp.',
      thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=500&fit=crop',
      color: '#6366F1',
      category: 'tech',
      icon: Code,
      articles: 30,
      timeline: 'Ongoing',
      tags: ['Documentation', 'API', 'Tech'],
      popularity: 85,
      featured: false,
      preview: {
        structure: [
          'Getting Started',
          'API Reference',
          'Code Examples',
          'SDK Guides',
          'Best Practices',
          'Troubleshooting',
          'Changelog',
        ],
        features: [
          'Code syntax highlighting',
          'Interactive API explorer',
          'Version control',
          'Search functionality',
        ],
      },
    },
  ];

  const filteredTemplates = templates.filter(template => {
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleUseTemplate = (template: StreamTemplate) => {
    if (onUseTemplate) {
      onUseTemplate(template);
    } else {
      onNavigate({ page: 'event-stream-form', templateId: template.id });
    }
  };

  return (
    <PageWrapper>
      <PageHeader
        title="Thư viện Templates"
        description="Khởi tạo nhanh dòng sự kiện với các templates có sẵn"
        action={
          <button 
            onClick={() => onNavigate({ page: 'event-stream-form' })}
            className="px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Tạo từ đầu
          </button>
        }
      />

      {/* Categories */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <button
              key={category.key}
              onClick={() => setSelectedCategory(category.key)}
              className={`px-4 py-2 rounded-xl font-medium transition-all flex items-center gap-2 ${
                selectedCategory === category.key
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'bg-secondary hover:bg-secondary/80'
              }`}
            >
              <Icon className="w-4 h-4" />
              {category.label}
            </button>
          );
        })}
      </div>

      {/* Search & View Mode */}
      <Card className="p-4 mb-6">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Tìm kiếm template..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-all ${
                viewMode === 'grid' ? 'bg-blue-500 text-white' : 'bg-secondary hover:bg-secondary/80'
              }`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-all ${
                viewMode === 'list' ? 'bg-blue-500 text-white' : 'bg-secondary hover:bg-secondary/80'
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>
      </Card>

      {/* Templates Grid */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => {
            const Icon = template.icon;
            return (
              <Card key={template.id} className="overflow-hidden hover:shadow-xl transition-all group cursor-pointer">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={template.thumbnail}
                    alt={template.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div 
                    className="absolute inset-0 mix-blend-multiply opacity-60"
                    style={{ backgroundColor: template.color }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  
                  {/* Badges */}
                  <div className="absolute top-3 right-3 flex flex-col gap-2">
                    {template.featured && (
                      <span className="px-3 py-1 bg-yellow-500 text-white rounded-full text-xs font-semibold flex items-center gap-1">
                        <Star className="w-3 h-3" />
                        Featured
                      </span>
                    )}
                    <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white rounded-full text-xs font-semibold">
                      {template.popularity}% match
                    </span>
                  </div>

                  {/* Icon & Title */}
                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="flex items-center gap-2 mb-2">
                      <div 
                        className="p-2 rounded-lg text-white"
                        style={{ backgroundColor: `${template.color}CC` }}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <h3 className="text-white font-semibold text-lg flex-1">{template.name}</h3>
                    </div>
                  </div>
                </div>

                <div className="p-5">
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {template.description}
                  </p>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="text-center p-2 bg-secondary rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">Bài viết</p>
                      <p className="font-semibold">{template.articles}</p>
                    </div>
                    <div className="text-center p-2 bg-secondary rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">Timeline</p>
                      <p className="font-semibold text-xs">{template.timeline}</p>
                    </div>
                    <div className="text-center p-2 bg-secondary rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">Rating</p>
                      <p className="font-semibold">{template.popularity}%</p>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {template.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="px-2 py-1 bg-secondary text-xs rounded-lg">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedTemplate(template)}
                      className="flex-1 px-4 py-2 bg-secondary hover:bg-secondary/80 rounded-xl transition-colors flex items-center justify-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      Xem trước
                    </button>
                    <button
                      onClick={() => handleUseTemplate(template)}
                      className="flex-1 px-4 py-2 text-white rounded-xl transition-all hover:shadow-lg flex items-center justify-center gap-2"
                      style={{ backgroundColor: template.color }}
                    >
                      <Check className="w-4 h-4" />
                      Sử dụng
                    </button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTemplates.map((template) => {
            const Icon = template.icon;
            return (
              <Card key={template.id} className="overflow-hidden hover:shadow-lg transition-all group">
                <div className="flex gap-4 p-5">
                  {/* Thumbnail */}
                  <div className="relative w-48 h-32 flex-shrink-0 rounded-lg overflow-hidden">
                    <img
                      src={template.thumbnail}
                      alt={template.name}
                      className="w-full h-full object-cover"
                    />
                    <div 
                      className="absolute inset-0 mix-blend-multiply opacity-60"
                      style={{ backgroundColor: template.color }}
                    />
                    <div className="absolute top-2 right-2">
                      {template.featured && (
                        <span className="px-2 py-1 bg-yellow-500 text-white rounded-full text-xs font-semibold flex items-center gap-1">
                          <Star className="w-3 h-3" />
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex items-center gap-2">
                        <div 
                          className="p-2 rounded-lg text-white"
                          style={{ backgroundColor: template.color }}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{template.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {template.articles} bài viết • {template.timeline}
                          </p>
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-secondary rounded-full text-sm font-semibold">
                        {template.popularity}%
                      </span>
                    </div>

                    <p className="text-sm text-muted-foreground mb-3">
                      {template.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-2">
                        {template.tags.map((tag) => (
                          <span key={tag} className="px-2 py-1 bg-secondary text-xs rounded-lg">
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedTemplate(template)}
                          className="px-4 py-2 bg-secondary hover:bg-secondary/80 rounded-xl transition-colors flex items-center gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          Xem trước
                        </button>
                        <button
                          onClick={() => handleUseTemplate(template)}
                          className="px-4 py-2 text-white rounded-xl transition-all hover:shadow-lg flex items-center gap-2"
                          style={{ backgroundColor: template.color }}
                        >
                          <Check className="w-4 h-4" />
                          Sử dụng
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Preview Modal */}
      {selectedTemplate && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="relative h-64">
              <img
                src={selectedTemplate.thumbnail}
                alt={selectedTemplate.name}
                className="w-full h-full object-cover"
              />
              <div 
                className="absolute inset-0 mix-blend-multiply opacity-60"
                style={{ backgroundColor: selectedTemplate.color }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent" />
              
              <button
                onClick={() => setSelectedTemplate(null)}
                className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-xl transition-all"
              >
                ✕
              </button>

              <div className="absolute bottom-6 left-6 right-6">
                <div className="flex items-center gap-3 mb-3">
                  <div 
                    className="p-3 rounded-xl text-white"
                    style={{ backgroundColor: `${selectedTemplate.color}CC` }}
                  >
                    {React.createElement(selectedTemplate.icon, { className: 'w-6 h-6' })}
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-white">{selectedTemplate.name}</h2>
                    <p className="text-white/80">{selectedTemplate.description}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-2 gap-6 mb-6">
                {/* Structure */}
                <div>
                  <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <Sparkles className="w-5 h-5" style={{ color: selectedTemplate.color }} />
                    Cấu trúc
                  </h3>
                  <ul className="space-y-2">
                    {selectedTemplate.preview.structure.map((item, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <Check className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: selectedTemplate.color }} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Features */}
                <div>
                  <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <Zap className="w-5 h-5" style={{ color: selectedTemplate.color }} />
                    Tính năng
                  </h3>
                  <ul className="space-y-2">
                    {selectedTemplate.preview.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <Check className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: selectedTemplate.color }} />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Tags */}
              <div className="mb-6">
                <h3 className="font-semibold mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedTemplate.tags.map((tag) => (
                    <span 
                      key={tag} 
                      className="px-3 py-1 rounded-lg text-sm text-white"
                      style={{ backgroundColor: selectedTemplate.color }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => handleUseTemplate(selectedTemplate)}
                  className="flex-1 px-6 py-3 text-white rounded-xl font-semibold transition-all hover:shadow-lg flex items-center justify-center gap-2"
                  style={{ backgroundColor: selectedTemplate.color }}
                >
                  <Check className="w-5 h-5" />
                  Sử dụng template này
                </button>
                <button
                  className="px-6 py-3 bg-secondary hover:bg-secondary/80 rounded-xl font-semibold transition-colors flex items-center gap-2"
                >
                  <Copy className="w-5 h-5" />
                  Sao chép
                </button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </PageWrapper>
  );
}
