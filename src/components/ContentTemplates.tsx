import { useState } from 'react';
import { 
  FileText, Copy, Edit3, Trash2, Star, Search, Plus,
  Eye, Download, Upload, Folder, Tag, Clock, User,
  CheckCircle2, Sparkles, Layout, Code, Image, Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';

export interface ContentTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  type: 'article' | 'page' | 'email' | 'social';
  thumbnail?: string;
  content: string;
  fields: TemplateField[];
  tags: string[];
  author: string;
  createdAt: Date;
  updatedAt: Date;
  usageCount: number;
  isFavorite: boolean;
  isPublic: boolean;
}

export interface TemplateField {
  id: string;
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'rich-text' | 'image' | 'select' | 'checkbox';
  placeholder?: string;
  defaultValue?: string;
  required: boolean;
  options?: string[];
}

interface ContentTemplatesProps {
  onSelectTemplate?: (template: ContentTemplate) => void;
  onCreateFromTemplate?: (template: ContentTemplate) => void;
}

export function ContentTemplates({
  onSelectTemplate,
  onCreateFromTemplate,
}: ContentTemplatesProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<ContentTemplate | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const { t } = useLanguage();

  // Mock templates
  const templates: ContentTemplate[] = [
    {
      id: '1',
      name: 'Tutorial Article',
      description: 'Step-by-step tutorial template with code examples',
      category: 'Tutorial',
      type: 'article',
      content: '<h1>{{title}}</h1><p>{{introduction}}</p><h2>Prerequisites</h2><p>{{prerequisites}}</p>',
      fields: [
        { id: 'f1', name: 'title', label: 'Title', type: 'text', required: true, placeholder: 'Enter tutorial title' },
        { id: 'f2', name: 'introduction', label: 'Introduction', type: 'textarea', required: true, placeholder: 'Brief introduction' },
        { id: 'f3', name: 'prerequisites', label: 'Prerequisites', type: 'rich-text', required: false },
      ],
      tags: ['tutorial', 'code', 'guide'],
      author: 'Admin',
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      usageCount: 45,
      isFavorite: true,
      isPublic: true,
    },
    {
      id: '2',
      name: 'Product Review',
      description: 'Comprehensive product review with pros/cons',
      category: 'Review',
      type: 'article',
      content: '<h1>{{product_name}} Review</h1><p>{{summary}}</p>',
      fields: [
        { id: 'f1', name: 'product_name', label: 'Product Name', type: 'text', required: true },
        { id: 'f2', name: 'summary', label: 'Summary', type: 'textarea', required: true },
        { id: 'f3', name: 'rating', label: 'Rating', type: 'select', required: true, options: ['1', '2', '3', '4', '5'] },
      ],
      tags: ['review', 'product'],
      author: 'Editor',
      createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      usageCount: 32,
      isFavorite: true,
      isPublic: true,
    },
    {
      id: '3',
      name: 'News Article',
      description: 'Breaking news template with 5W1H structure',
      category: 'News',
      type: 'article',
      content: '<h1>{{headline}}</h1><p class="lead">{{lead}}</p>',
      fields: [
        { id: 'f1', name: 'headline', label: 'Headline', type: 'text', required: true },
        { id: 'f2', name: 'lead', label: 'Lead Paragraph', type: 'textarea', required: true },
        { id: 'f3', name: 'body', label: 'Body', type: 'rich-text', required: true },
      ],
      tags: ['news', 'breaking'],
      author: 'News Team',
      createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      usageCount: 128,
      isFavorite: false,
      isPublic: true,
    },
    {
      id: '4',
      name: 'Interview',
      description: 'Q&A interview format',
      category: 'Interview',
      type: 'article',
      content: '<h1>Interview: {{interviewee}}</h1><p>{{introduction}}</p>',
      fields: [
        { id: 'f1', name: 'interviewee', label: 'Interviewee Name', type: 'text', required: true },
        { id: 'f2', name: 'introduction', label: 'Introduction', type: 'textarea', required: true },
      ],
      tags: ['interview', 'q&a'],
      author: 'Content Team',
      createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      usageCount: 18,
      isFavorite: false,
      isPublic: true,
    },
    {
      id: '5',
      name: 'Case Study',
      description: 'Business case study with metrics',
      category: 'Business',
      type: 'article',
      content: '<h1>{{company}} Case Study</h1><p>{{challenge}}</p>',
      fields: [
        { id: 'f1', name: 'company', label: 'Company Name', type: 'text', required: true },
        { id: 'f2', name: 'challenge', label: 'Challenge', type: 'textarea', required: true },
        { id: 'f3', name: 'solution', label: 'Solution', type: 'rich-text', required: true },
      ],
      tags: ['case-study', 'business'],
      author: 'Marketing',
      createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      usageCount: 23,
      isFavorite: true,
      isPublic: false,
    },
    {
      id: '6',
      name: 'Listicle',
      description: 'Top 10 list format',
      category: 'List',
      type: 'article',
      content: '<h1>Top {{count}}: {{topic}}</h1>',
      fields: [
        { id: 'f1', name: 'count', label: 'Number of Items', type: 'text', required: true, defaultValue: '10' },
        { id: 'f2', name: 'topic', label: 'Topic', type: 'text', required: true },
      ],
      tags: ['list', 'top-10'],
      author: 'Editor',
      createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      usageCount: 67,
      isFavorite: false,
      isPublic: true,
    },
  ];

  const categories = ['all', ...Array.from(new Set(templates.map(t => t.category)))];

  const filteredTemplates = templates.filter(template => {
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const toggleFavorite = (id: string) => {
    // In real app, this would call API
    console.log('Toggle favorite:', id);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20">
            <Layout className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h1 className="text-3xl mb-1">Content Templates</h1>
            <p className="text-sm text-muted-foreground">
              {filteredTemplates.length} templates available
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-muted/60 hover:bg-muted transition-all border border-border/40">
            <Download className="w-4 h-4" />
            Import
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg shadow-purple-500/30">
            <Plus className="w-4 h-4" />
            Create Template
          </button>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search templates..."
            className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-background/50 border border-border/40 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all outline-none"
          />
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`
                px-4 py-2 rounded-xl transition-all text-sm font-medium capitalize
                ${selectedCategory === category
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                  : 'bg-muted/40 hover:bg-muted/60'
                }
              `}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredTemplates.map((template, idx) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: idx * 0.05 }}
              className="glass-card p-6 hover:shadow-lg transition-all cursor-pointer group"
              onClick={() => {
                setSelectedTemplate(template);
                setShowPreview(true);
              }}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium mb-1 line-clamp-1">{template.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {template.description}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(template.id);
                  }}
                  className="flex-shrink-0 ml-2"
                >
                  <Star
                    className={`w-5 h-5 transition-all ${
                      template.isFavorite
                        ? 'fill-yellow-500 text-yellow-500'
                        : 'text-muted-foreground hover:text-yellow-500'
                    }`}
                  />
                </button>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {template.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-600 text-xs"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Stats */}
              <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                <div className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  <span>{template.author}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Copy className="w-3 h-3" />
                  <span>{template.usageCount} uses</span>
                </div>
              </div>

              {/* Preview Thumbnail */}
              <div className="h-32 rounded-lg bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 mb-4 flex items-center justify-center overflow-hidden">
                <FileText className="w-12 h-12 text-purple-600/30" />
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedTemplate(template);
                    setShowPreview(true);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-muted/60 hover:bg-muted transition-all text-sm"
                >
                  <Eye className="w-3 h-3" />
                  Preview
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onCreateFromTemplate?.(template);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-purple-500/10 text-purple-600 hover:bg-purple-500/20 transition-all text-sm border border-purple-500/20"
                >
                  <Zap className="w-3 h-3" />
                  Use
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredTemplates.length === 0 && (
        <div className="glass-card p-12 text-center">
          <Layout className="w-12 h-12 mx-auto mb-3 text-muted-foreground/50" />
          <p className="text-muted-foreground">No templates found</p>
          <p className="text-sm text-muted-foreground mt-1">
            Try adjusting your filters or search query
          </p>
        </div>
      )}

      {/* Preview Modal */}
      <AnimatePresence>
        {showPreview && selectedTemplate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPreview(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl max-h-[90vh] glass-strong rounded-2xl border border-border/40 shadow-2xl overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="p-6 border-b border-border/40 bg-gradient-to-br from-purple-500/5 to-pink-500/5">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h2 className="text-2xl">{selectedTemplate.name}</h2>
                      {selectedTemplate.isFavorite && (
                        <Star className="w-5 h-5 fill-yellow-500 text-yellow-500" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {selectedTemplate.description}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowPreview(false)}
                    className="p-2 rounded-xl hover:bg-muted/60 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Template Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-muted/30">
                    <div className="text-sm text-muted-foreground mb-1">Category</div>
                    <div className="font-medium">{selectedTemplate.category}</div>
                  </div>
                  <div className="p-4 rounded-xl bg-muted/30">
                    <div className="text-sm text-muted-foreground mb-1">Type</div>
                    <div className="font-medium capitalize">{selectedTemplate.type}</div>
                  </div>
                  <div className="p-4 rounded-xl bg-muted/30">
                    <div className="text-sm text-muted-foreground mb-1">Author</div>
                    <div className="font-medium">{selectedTemplate.author}</div>
                  </div>
                  <div className="p-4 rounded-xl bg-muted/30">
                    <div className="text-sm text-muted-foreground mb-1">Usage</div>
                    <div className="font-medium">{selectedTemplate.usageCount} times</div>
                  </div>
                </div>

                {/* Fields */}
                <div>
                  <h3 className="text-lg mb-4">Template Fields</h3>
                  <div className="space-y-3">
                    {selectedTemplate.fields.map((field) => (
                      <div
                        key={field.id}
                        className="p-4 rounded-xl bg-muted/30 border border-border/40"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{field.label}</span>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 text-xs capitalize">
                              {field.type}
                            </span>
                            {field.required && (
                              <span className="px-2 py-0.5 rounded bg-red-500/10 text-red-600 text-xs">
                                Required
                              </span>
                            )}
                          </div>
                        </div>
                        {field.placeholder && (
                          <p className="text-sm text-muted-foreground">
                            Placeholder: {field.placeholder}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Content Preview */}
                <div>
                  <h3 className="text-lg mb-4">Content Structure</h3>
                  <div className="p-4 rounded-xl bg-muted/30 border border-border/40">
                    <code className="text-sm text-muted-foreground">
                      {selectedTemplate.content}
                    </code>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-border/40 bg-muted/20">
                <div className="flex items-center justify-end gap-3">
                  <button
                    onClick={() => setShowPreview(false)}
                    className="px-4 py-2 rounded-xl bg-muted/60 hover:bg-muted transition-all"
                  >
                    Close
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-muted/60 hover:bg-muted transition-all border border-border/40">
                    <Edit3 className="w-4 h-4" />
                    Edit Template
                  </button>
                  <button
                    onClick={() => {
                      onCreateFromTemplate?.(selectedTemplate);
                      setShowPreview(false);
                    }}
                    className="flex items-center gap-2 px-6 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg shadow-purple-500/30"
                  >
                    <Zap className="w-4 h-4" />
                    Use This Template
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}