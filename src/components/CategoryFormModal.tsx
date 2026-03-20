import { useState, useEffect } from 'react';
import { X, Save, Plus, AlertCircle, Link as LinkIcon, Eye, EyeOff, Folder, Tag } from 'lucide-react';
import { Card } from './Card';
import { useLanguage } from '../contexts/LanguageContext';

interface CategoryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (category: CategoryFormData, saveAndContinue?: boolean) => void;
  editingCategory?: Category | null;
  categories: Category[];
}

interface CategoryFormData {
  name: string;
  slug: string;
  description: string;
  parent: number | null;
  articleTypes: string[];
  active: boolean;
  order: number;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];
}

interface Category {
  id: number;
  name: string;
  slug: string;
  parent: number | null;
  articleTypes: string[];
  active: boolean;
  order: number;
  articleCount: number;
  children?: Category[];
}

const articleTypeOptions = [
  { value: 'news', label: 'Tin tức' },
  { value: 'video', label: 'Video' },
  { value: 'gallery', label: 'Thư viện ảnh' },
  { value: 'legal', label: 'Văn bản pháp luật' },
  { value: 'job', label: 'Tuyển dụng' },
  { value: 'podcast', label: 'Podcast' },
  { value: 'event', label: 'Sự kiện' },
  { value: 'staff', label: 'Nhân sự' },
  { value: 'download', label: 'Tải xuống' },
];

export function CategoryFormModal({ 
  isOpen, 
  onClose, 
  onSave, 
  editingCategory,
  categories 
}: CategoryFormModalProps) {
  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    slug: '',
    description: '',
    parent: null,
    articleTypes: [],
    active: true,
    order: 0,
    seoTitle: '',
    seoDescription: '',
    seoKeywords: [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [autoSlug, setAutoSlug] = useState(true);
  const [keywordInput, setKeywordInput] = useState('');

  useEffect(() => {
    if (editingCategory) {
      setFormData({
        name: editingCategory.name,
        slug: editingCategory.slug,
        description: '',
        parent: editingCategory.parent,
        articleTypes: editingCategory.articleTypes,
        active: editingCategory.active,
        order: editingCategory.order,
        seoTitle: '',
        seoDescription: '',
        seoKeywords: [],
      });
      setAutoSlug(false);
    } else {
      setFormData({
        name: '',
        slug: '',
        description: '',
        parent: null,
        articleTypes: [],
        active: true,
        order: categories.length + 1,
        seoTitle: '',
        seoDescription: '',
        seoKeywords: [],
      });
      setAutoSlug(true);
    }
    setErrors({});
    setTouched({});
  }, [editingCategory, isOpen, categories]);

  const generateSlug = (text: string): string => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleNameChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      name: value,
      slug: autoSlug ? generateSlug(value) : prev.slug,
    }));
    setTouched(prev => ({ ...prev, name: true }));
  };

  const handleSlugChange = (value: string) => {
    setAutoSlug(false);
    setFormData(prev => ({ ...prev, slug: generateSlug(value) }));
    setTouched(prev => ({ ...prev, slug: true }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Vui lòng nhập tên danh mục';
    }

    if (!formData.slug.trim()) {
      newErrors.slug = 'Vui lòng nhập slug';
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      newErrors.slug = 'Slug chỉ được chứa chữ thường, số và dấu gạch ngang';
    }

    if (formData.articleTypes.length === 0) {
      newErrors.articleTypes = 'Vui lòng chọn ít nhất 1 loại bài viết';
    }

    // Check duplicate slug
    const existingCategory = categories.find(
      cat => cat.slug === formData.slug && cat.id !== editingCategory?.id
    );
    if (existingCategory) {
      newErrors.slug = 'Slug này đã tồn tại';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (saveAndContinue: boolean = false) => {
    setTouched({
      name: true,
      slug: true,
      articleTypes: true,
    });

    if (validateForm()) {
      onSave(formData, saveAndContinue);
      if (!saveAndContinue) {
        onClose();
      } else {
        // Reset form for new entry
        setFormData({
          name: '',
          slug: '',
          description: '',
          parent: formData.parent, // Keep parent selection
          articleTypes: formData.articleTypes, // Keep article types
          active: true,
          order: categories.length + 2,
          seoTitle: '',
          seoDescription: '',
          seoKeywords: [],
        });
        setAutoSlug(true);
        setTouched({});
      }
    }
  };

  const toggleArticleType = (type: string) => {
    setFormData(prev => ({
      ...prev,
      articleTypes: prev.articleTypes.includes(type)
        ? prev.articleTypes.filter(t => t !== type)
        : [...prev.articleTypes, type],
    }));
    setTouched(prev => ({ ...prev, articleTypes: true }));
  };

  const addKeyword = () => {
    if (keywordInput.trim() && !formData.seoKeywords.includes(keywordInput.trim())) {
      setFormData(prev => ({
        ...prev,
        seoKeywords: [...prev.seoKeywords, keywordInput.trim()],
      }));
      setKeywordInput('');
    }
  };

  const removeKeyword = (keyword: string) => {
    setFormData(prev => ({
      ...prev,
      seoKeywords: prev.seoKeywords.filter(k => k !== keyword),
    }));
  };

  // Build category tree for parent selection
  const buildCategoryOptions = (cats: Category[], level: number = 0, exclude?: number): any[] => {
    return cats.reduce((acc, cat) => {
      if (cat.id === exclude) return acc; // Don't allow selecting self as parent
      
      acc.push({
        value: cat.id,
        label: '  '.repeat(level) + (level > 0 ? '└─ ' : '') + cat.name,
        level,
      });

      if (cat.children && cat.children.length > 0) {
        acc.push(...buildCategoryOptions(cat.children, level + 1, exclude));
      }

      return acc;
    }, [] as any[]);
  };

  const categoryOptions = [
    { value: null, label: 'Không có (Root)', level: 0 },
    ...buildCategoryOptions(categories, 0, editingCategory?.id),
  ];

  if (!isOpen) return null;

  const { t } = useLanguage();

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl flex items-center gap-2">
              <Folder className="w-5 h-5 text-blue-600" />
              {editingCategory ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {editingCategory ? 'Cập nhật thông tin danh mục' : 'Tạo danh mục mới để tổ chức bài viết'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <div className="p-6 space-y-6">
          {/* Basic Info Section */}
          <div>
            <h3 className="font-medium mb-4 flex items-center gap-2">
              <Folder className="w-4 h-4 text-blue-600" />
              Thông tin cơ bản
            </h3>
            
            {/* Name */}
            <div className="mb-4">
              <label className="block text-sm mb-2">
                Tên danh mục <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                onBlur={() => setTouched(prev => ({ ...prev, name: true }))}
                placeholder="Ví dụ: Tin tức công nghệ"
                className={`w-full px-4 py-2.5 bg-secondary border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                  touched.name && errors.name ? 'border-red-500' : 'border-border'
                }`}
              />
              {touched.name && errors.name && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.name}
                </p>
              )}
            </div>

            {/* Slug */}
            <div className="mb-4">
              <label className="block text-sm mb-2 flex items-center gap-2">
                <LinkIcon className="w-3 h-3" />
                Đường dẫn (Slug) <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => handleSlugChange(e.target.value)}
                  onBlur={() => setTouched(prev => ({ ...prev, slug: true }))}
                  placeholder="tin-tuc-cong-nghe"
                  className={`flex-1 px-4 py-2.5 bg-secondary border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-mono text-sm ${
                    touched.slug && errors.slug ? 'border-red-500' : 'border-border'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => {
                    setAutoSlug(true);
                    setFormData(prev => ({ ...prev, slug: generateSlug(prev.name) }));
                  }}
                  className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all"
                  title="Tạo slug tự động"
                >
                  Auto
                </button>
              </div>
              {touched.slug && errors.slug && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.slug}
                </p>
              )}
              {formData.slug && !errors.slug && (
                <p className="text-xs text-muted-foreground mt-1">
                  URL: <span className="text-blue-600">/{formData.slug}</span>
                </p>
              )}
            </div>

            {/* Description */}
            <div className="mb-4">
              <label className="block text-sm mb-2">Mô tả</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Mô tả ngắn gọn về danh mục này..."
                rows={3}
                className="w-full px-4 py-2.5 bg-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
              />
            </div>

            {/* Parent Category */}
            <div className="mb-4">
              <label className="block text-sm mb-2">Danh mục cha</label>
              <select
                value={formData.parent || ''}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  parent: e.target.value ? Number(e.target.value) : null 
                }))}
                className="w-full px-4 py-2.5 bg-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                {categoryOptions.map(option => (
                  <option key={option.value || 'root'} value={option.value || ''}>
                    {option.label}
                  </option>
                ))}
              </select>
              <p className="text-xs text-muted-foreground mt-1">
                Chọn danh mục cha để tạo cấu trúc phân cấp
              </p>
            </div>

            {/* Order */}
            <div className="mb-4">
              <label className="block text-sm mb-2">Thứ tự sắp xếp</label>
              <input
                type="number"
                value={formData.order}
                onChange={(e) => setFormData(prev => ({ ...prev, order: Number(e.target.value) }))}
                min="0"
                className="w-full px-4 py-2.5 bg-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Số thứ tự để sắp xếp danh mục (số nhỏ hơn sẽ hiển thị trước)
              </p>
            </div>

            {/* Active Status */}
            <div className="flex items-center justify-between p-4 bg-muted/40 rounded-xl">
              <div>
                <h4 className="font-medium flex items-center gap-2">
                  {formData.active ? <Eye className="w-4 h-4 text-green-600" /> : <EyeOff className="w-4 h-4 text-gray-600" />}
                  Hiển thị công khai
                </h4>
                <p className="text-sm text-muted-foreground">
                  Cho phép danh mục hiển thị trên website
                </p>
              </div>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, active: !prev.active }))}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  formData.active ? 'bg-green-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    formData.active ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Article Types Section */}
          <div>
            <h3 className="font-medium mb-4 flex items-center gap-2">
              <Tag className="w-4 h-4 text-purple-600" />
              Loại bài viết <span className="text-red-500">*</span>
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Chọn các loại bài viết được phép trong danh mục này (mỗi danh mục chỉ chứa 1 loại để đảm bảo type safety)
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {articleTypeOptions.map(type => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => toggleArticleType(type.value)}
                  className={`p-3 rounded-xl border-2 transition-all text-left ${
                    formData.articleTypes.includes(type.value)
                      ? 'border-blue-500 bg-blue-50 text-blue-600'
                      : 'border-border hover:border-blue-300 hover:bg-muted/40'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                      formData.articleTypes.includes(type.value)
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-300'
                    }`}>
                      {formData.articleTypes.includes(type.value) && (
                        <div className="w-2 h-2 bg-white rounded-sm" />
                      )}
                    </div>
                    <span className="text-sm font-medium">{type.label}</span>
                  </div>
                </button>
              ))}
            </div>

            {touched.articleTypes && errors.articleTypes && (
              <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.articleTypes}
              </p>
            )}
          </div>

          {/* SEO Section */}
          <div>
            <h3 className="font-medium mb-4 flex items-center gap-2">
              <Tag className="w-4 h-4 text-green-600" />
              Tối ưu hóa SEO (Tùy chọn)
            </h3>

            {/* SEO Title */}
            <div className="mb-4">
              <label className="block text-sm mb-2">Tiêu đề SEO</label>
              <input
                type="text"
                value={formData.seoTitle}
                onChange={(e) => setFormData(prev => ({ ...prev, seoTitle: e.target.value }))}
                placeholder={formData.name || t('placeholders.seoTitle')}
                maxLength={60}
                className="w-full px-4 py-2.5 bg-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
              <p className="text-xs text-muted-foreground mt-1">
                {formData.seoTitle.length}/60 ký tự
              </p>
            </div>

            {/* SEO Description */}
            <div className="mb-4">
              <label className="block text-sm mb-2">Mô tả SEO</label>
              <textarea
                value={formData.seoDescription}
                onChange={(e) => setFormData(prev => ({ ...prev, seoDescription: e.target.value }))}
                placeholder={formData.description || 'Mô tả ngắn gọn cho công cụ tìm kiếm'}
                rows={2}
                maxLength={160}
                className="w-full px-4 py-2.5 bg-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
              />
              <p className="text-xs text-muted-foreground mt-1">
                {formData.seoDescription.length}/160 ký tự
              </p>
            </div>

            {/* SEO Keywords */}
            <div>
              <label className="block text-sm mb-2">Từ khóa SEO</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={keywordInput}
                  onChange={(e) => setKeywordInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addKeyword();
                    }
                  }}
                  placeholder="Nhập từ khóa và nhấn Enter"
                  className="flex-1 px-4 py-2.5 bg-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
                <button
                  type="button"
                  onClick={addKeyword}
                  className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              {formData.seoKeywords.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.seoKeywords.map((keyword, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm flex items-center gap-2"
                    >
                      {keyword}
                      <button
                        type="button"
                        onClick={() => removeKeyword(keyword)}
                        className="hover:text-blue-800"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-card border-t border-border px-6 py-4 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 bg-secondary border border-border rounded-xl hover:bg-muted transition-all"
          >
            Hủy
          </button>
          <div className="flex items-center gap-3">
            {!editingCategory && (
              <button
                type="button"
                onClick={() => handleSubmit(true)}
                className="px-6 py-2.5 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:shadow-lg hover:shadow-purple-500/20 transition-all flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Lưu và thêm tiếp
              </button>
            )}
            <button
              type="button"
              onClick={() => handleSubmit(false)}
              className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/20 transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {editingCategory ? 'Cập nhật' : 'Lưu'}
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}