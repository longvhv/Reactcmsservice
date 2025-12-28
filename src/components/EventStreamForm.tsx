import React, { useState } from 'react';
import { 
  Save, Plus, X, GripVertical, Search, FileText, Calendar,
  Image, AlertCircle, Tag, Palette, ChevronDown
} from 'lucide-react';
import { PageWrapper } from './PageWrapper';
import { PageHeader } from './PageHeader';
import { Card } from './Card';

interface Article {
  id: string;
  title: string;
  status: 'published' | 'draft';
  type: string;
  publishedAt?: string;
  order: number;
  views: number;
}

interface StreamFormData {
  name: string;
  description: string;
  slug: string;
  thumbnail: string;
  color: string;
  status: 'active' | 'paused' | 'completed' | 'archived';
  type: 'news' | 'campaign' | 'product' | 'event' | 'topic' | 'series';
  articles: Article[];
  tags: string[];
  timeline: {
    startDate: string;
    endDate: string;
  };
  featured: boolean;
  seoTitle: string;
  seoDescription: string;
}

export function EventStreamForm({ onNavigate, streamId }: { onNavigate: (page: any) => void; streamId?: string }) {
  const [formData, setFormData] = useState<StreamFormData>({
    name: '',
    description: '',
    slug: '',
    thumbnail: '',
    color: '#3B82F6',
    status: 'active',
    type: 'news',
    articles: [],
    tags: [],
    timeline: {
      startDate: '',
      endDate: '',
    },
    featured: false,
    seoTitle: '',
    seoDescription: '',
  });

  const [tagInput, setTagInput] = useState('');
  const [showArticleSearch, setShowArticleSearch] = useState(false);
  const [articleSearchTerm, setArticleSearchTerm] = useState('');
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Predefined colors
  const colorOptions = [
    { value: '#3B82F6', label: 'Blue' },
    { value: '#8B5CF6', label: 'Purple' },
    { value: '#10B981', label: 'Green' },
    { value: '#F59E0B', label: 'Orange' },
    { value: '#EF4444', label: 'Red' },
    { value: '#EC4899', label: 'Pink' },
    { value: '#14B8A6', label: 'Teal' },
    { value: '#6366F1', label: 'Indigo' },
  ];

  // Mock available articles
  const availableArticles: Article[] = [
    { id: 'a1', title: 'AI sẽ thay đổi ngành công nghệ như thế nào?', status: 'published', type: 'news', publishedAt: '2024-01-15', order: 0, views: 1234 },
    { id: 'a2', title: 'Top 10 startup Việt Nam được đầu tư nhiều nhất', status: 'published', type: 'news', publishedAt: '2024-01-20', order: 0, views: 987 },
    { id: 'a3', title: 'Cloud Computing: Xu hướng 2024', status: 'published', type: 'analysis', publishedAt: '2024-01-22', order: 0, views: 756 },
    { id: 'a4', title: 'Interview CEO: Hành trình khởi nghiệp', status: 'draft', type: 'interview', order: 0, views: 0 },
    { id: 'a5', title: 'Case study: Chuyển đổi số thành công', status: 'published', type: 'case-study', publishedAt: '2024-01-25', order: 0, views: 543 },
  ];

  const filteredArticles = availableArticles.filter(
    (article) => 
      !formData.articles.find(a => a.id === article.id) &&
      article.title.toLowerCase().includes(articleSearchTerm.toLowerCase())
  );

  const handleInputChange = (field: keyof StreamFormData, value: any) => {
    setFormData({ ...formData, [field]: value });
    // Auto-generate slug from name
    if (field === 'name' && !formData.slug) {
      const slug = value
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[đĐ]/g, 'd')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setFormData(prev => ({ ...prev, slug }));
    }
  };

  const handleTimelineChange = (field: 'startDate' | 'endDate', value: string) => {
    setFormData({
      ...formData,
      timeline: { ...formData.timeline, [field]: value },
    });
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()],
      });
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(t => t !== tag),
    });
  };

  const addArticle = (article: Article) => {
    setFormData({
      ...formData,
      articles: [
        ...formData.articles,
        { ...article, order: formData.articles.length + 1 },
      ],
    });
    setShowArticleSearch(false);
    setArticleSearchTerm('');
  };

  const removeArticle = (articleId: string) => {
    const newArticles = formData.articles
      .filter(a => a.id !== articleId)
      .map((a, index) => ({ ...a, order: index + 1 }));
    setFormData({ ...formData, articles: newArticles });
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newArticles = [...formData.articles];
    const draggedArticle = newArticles[draggedIndex];
    newArticles.splice(draggedIndex, 1);
    newArticles.splice(index, 0, draggedArticle);

    // Update order
    const reorderedArticles = newArticles.map((a, idx) => ({ ...a, order: idx + 1 }));
    setFormData({ ...formData, articles: reorderedArticles });
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!formData.name.trim()) newErrors.name = 'Tên dòng sự kiện là bắt buộc';
    if (!formData.description.trim()) newErrors.description = 'Mô tả là bắt buộc';
    if (!formData.slug.trim()) newErrors.slug = 'Slug là bắt buộc';
    if (!formData.timeline.startDate) newErrors.startDate = 'Ngày bắt đầu là bắt buộc';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (saveAndContinue: boolean = false) => {
    if (!validateForm()) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    console.log('Saving event stream:', formData);
    alert(`Đã lưu dòng sự kiện: ${formData.name}`);

    if (saveAndContinue) {
      // Reset form for new stream
      setFormData({
        name: '',
        description: '',
        slug: '',
        thumbnail: '',
        color: '#3B82F6',
        status: 'active',
        type: 'news',
        articles: [],
        tags: [],
        timeline: { startDate: '', endDate: '' },
        featured: false,
        seoTitle: '',
        seoDescription: '',
      });
      setErrors({});
    } else {
      onNavigate({ page: 'event-series' });
    }
  };

  return (
    <PageWrapper>
      <PageHeader
        title={streamId ? 'Chỉnh sửa dòng sự kiện' : 'Tạo dòng sự kiện mới'}
        description="Tạo và quản lý dòng sự kiện với các bài viết liên quan"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-4">Thông tin cơ bản</h3>

            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Tên dòng sự kiện <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="VD: Tech Summit 2024"
                  className={`w-full px-4 py-2.5 bg-secondary border ${
                    errors.name ? 'border-red-500' : 'border-border'
                  } rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Slug */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Slug (URL) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => handleInputChange('slug', e.target.value)}
                  placeholder="tu-dong-tao-tu-ten"
                  className={`w-full px-4 py-2.5 bg-secondary border ${
                    errors.slug ? 'border-red-500' : 'border-border'
                  } rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                />
                {errors.slug && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.slug}
                  </p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Mô tả <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Mô tả ngắn gọn về dòng sự kiện này..."
                  rows={4}
                  className={`w-full px-4 py-2.5 bg-secondary border ${
                    errors.description ? 'border-red-500' : 'border-border'
                  } rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none`}
                />
                {errors.description && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.description}
                  </p>
                )}
              </div>

              {/* Type & Color */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Loại</label>
                  <select
                    value={formData.type}
                    onChange={(e) => handleInputChange('type', e.target.value)}
                    className="w-full px-4 py-2.5 bg-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="news">Tin tức</option>
                    <option value="campaign">Chiến dịch</option>
                    <option value="product">Sản phẩm</option>
                    <option value="event">Sự kiện</option>
                    <option value="topic">Chủ đề</option>
                    <option value="series">Chuỗi</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Màu chủ đạo</label>
                  <div className="flex gap-2">
                    <div className="flex-1 flex gap-2 flex-wrap">
                      {colorOptions.map((color) => (
                        <button
                          key={color.value}
                          type="button"
                          onClick={() => handleInputChange('color', color.value)}
                          className={`w-8 h-8 rounded-lg transition-all ${
                            formData.color === color.value ? 'ring-2 ring-offset-2 ring-blue-500 scale-110' : ''
                          }`}
                          style={{ backgroundColor: color.value }}
                          title={color.label}
                        />
                      ))}
                    </div>
                    <input
                      type="color"
                      value={formData.color}
                      onChange={(e) => handleInputChange('color', e.target.value)}
                      className="w-12 h-9 rounded-lg cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Thumbnail */}
              <div>
                <label className="block text-sm font-medium mb-2">Ảnh thumbnail</label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={formData.thumbnail}
                    onChange={(e) => handleInputChange('thumbnail', e.target.value)}
                    placeholder="URL ảnh thumbnail..."
                    className="flex-1 px-4 py-2.5 bg-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                  <button className="px-4 py-2.5 bg-secondary hover:bg-secondary/80 border border-border rounded-xl transition-colors flex items-center gap-2">
                    <Image className="w-4 h-4" />
                    Chọn ảnh
                  </button>
                </div>
                {formData.thumbnail && (
                  <div className="mt-3 relative">
                    <img
                      src={formData.thumbnail}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-xl"
                    />
                    <div 
                      className="absolute inset-0 rounded-xl mix-blend-multiply opacity-40"
                      style={{ backgroundColor: formData.color }}
                    />
                  </div>
                )}
              </div>

              {/* Timeline */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Ngày bắt đầu <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.timeline.startDate}
                    onChange={(e) => handleTimelineChange('startDate', e.target.value)}
                    className={`w-full px-4 py-2.5 bg-secondary border ${
                      errors.startDate ? 'border-red-500' : 'border-border'
                    } rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                  />
                  {errors.startDate && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.startDate}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Ngày kết thúc (tùy chọn)</label>
                  <input
                    type="date"
                    value={formData.timeline.endDate}
                    onChange={(e) => handleTimelineChange('endDate', e.target.value)}
                    className="w-full px-4 py-2.5 bg-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium mb-2">Tags</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    placeholder="Nhập tag và nhấn Enter..."
                    className="flex-1 px-4 py-2.5 bg-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                  <button
                    onClick={addTag}
                    className="px-4 py-2.5 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg flex items-center gap-2 text-sm"
                      >
                        <Tag className="w-3 h-3" />
                        {tag}
                        <button
                          onClick={() => removeTag(tag)}
                          className="hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full p-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Articles Management */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-lg">Bài viết trong dòng</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Kéo thả để sắp xếp thứ tự hiển thị
                </p>
              </div>
              <button
                onClick={() => setShowArticleSearch(!showArticleSearch)}
                className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Thêm bài viết
              </button>
            </div>

            {/* Article Search */}
            {showArticleSearch && (
              <div className="mb-4 p-4 bg-secondary rounded-xl">
                <div className="relative mb-3">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={articleSearchTerm}
                    onChange={(e) => setArticleSearchTerm(e.target.value)}
                    placeholder="Tìm kiếm bài viết..."
                    className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <div className="max-h-60 overflow-y-auto space-y-2">
                  {filteredArticles.map((article) => (
                    <button
                      key={article.id}
                      onClick={() => addArticle(article)}
                      className="w-full p-3 bg-card hover:bg-muted rounded-lg text-left transition-colors flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <FileText className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{article.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {article.status === 'published' ? `Đã xuất bản: ${article.publishedAt}` : 'Nháp'} • {article.type}
                          </p>
                        </div>
                      </div>
                      <Plus className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                    </button>
                  ))}
                  {filteredArticles.length === 0 && (
                    <p className="text-center text-sm text-muted-foreground py-4">
                      Không tìm thấy bài viết
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Articles List */}
            {formData.articles.length > 0 ? (
              <div className="space-y-2">
                {formData.articles.map((article, index) => (
                  <div
                    key={article.id}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragEnd={handleDragEnd}
                    className={`p-4 bg-secondary rounded-xl flex items-center gap-3 cursor-move hover:bg-secondary/80 transition-colors ${
                      draggedIndex === index ? 'opacity-50' : ''
                    }`}
                  >
                    <GripVertical className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                    <div 
                      className="w-8 h-8 text-white rounded-lg flex items-center justify-center font-semibold flex-shrink-0"
                      style={{ backgroundColor: formData.color }}
                    >
                      {article.order}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{article.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {article.status === 'published' ? `Đã xuất bản: ${article.publishedAt}` : 'Nháp'} • {article.views} lượt xem
                      </p>
                    </div>
                    <button
                      onClick={() => removeArticle(article.id)}
                      className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors flex-shrink-0"
                    >
                      <X className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-secondary rounded-xl">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">Chưa có bài viết nào</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Nhấn "Thêm bài viết" để bắt đầu
                </p>
              </div>
            )}
          </Card>

          {/* SEO Settings */}
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-4">Cài đặt SEO</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">SEO Title</label>
                <input
                  type="text"
                  value={formData.seoTitle}
                  onChange={(e) => handleInputChange('seoTitle', e.target.value)}
                  placeholder="Tiêu đề SEO (mặc định sẽ dùng tên dòng)"
                  className="w-full px-4 py-2.5 bg-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">SEO Description</label>
                <textarea
                  value={formData.seoDescription}
                  onChange={(e) => handleInputChange('seoDescription', e.target.value)}
                  placeholder="Mô tả SEO (mặc định sẽ dùng mô tả chính)"
                  rows={3}
                  className="w-full px-4 py-2.5 bg-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
                />
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Publish Settings */}
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-4">Cài đặt</h3>
            <div className="space-y-4">
              {/* Status */}
              <div>
                <label className="block text-sm font-medium mb-2">Trạng thái</label>
                <select
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="w-full px-4 py-2.5 bg-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="active">Đang chạy</option>
                  <option value="paused">Tạm dừng</option>
                  <option value="completed">Hoàn thành</option>
                  <option value="archived">Lưu trữ</option>
                </select>
              </div>

              {/* Featured */}
              <div className="flex items-center justify-between p-3 bg-secondary rounded-xl">
                <div>
                  <p className="text-sm font-medium">Dòng nổi bật</p>
                  <p className="text-xs text-muted-foreground">Hiển thị ở vị trí ưu tiên</p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => handleInputChange('featured', e.target.checked)}
                  className="w-5 h-5 rounded cursor-pointer"
                />
              </div>
            </div>
          </Card>

          {/* Summary */}
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-4">Tóm tắt</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Tổng bài viết</span>
                <span className="font-semibold">{formData.articles.length}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Đã xuất bản</span>
                <span className="font-semibold">
                  {formData.articles.filter(a => a.status === 'published').length}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Nháp</span>
                <span className="font-semibold">
                  {formData.articles.filter(a => a.status === 'draft').length}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Tags</span>
                <span className="font-semibold">{formData.tags.length}</span>
              </div>
              {formData.timeline.startDate && (
                <div className="pt-3 border-t border-border">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Thời gian</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {new Date(formData.timeline.startDate).toLocaleDateString('vi-VN')}
                    {formData.timeline.endDate && ` - ${new Date(formData.timeline.endDate).toLocaleDateString('vi-VN')}`}
                  </p>
                </div>
              )}
            </div>
          </Card>

          {/* Actions */}
          <Card className="p-6">
            <div className="space-y-3">
              <button
                onClick={() => handleSubmit(false)}
                className="w-full px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                Lưu
              </button>
              <button
                onClick={() => handleSubmit(true)}
                className="w-full px-4 py-2.5 bg-secondary hover:bg-secondary/80 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Lưu và thêm tiếp
              </button>
              <button
                onClick={() => onNavigate({ page: 'event-series' })}
                className="w-full px-4 py-2.5 border border-border hover:bg-secondary rounded-xl transition-colors"
              >
                Hủy
              </button>
            </div>
          </Card>
        </div>
      </div>
    </PageWrapper>
  );
}
