import { useState } from 'react';
import { Plus, Search, Filter, Edit, Trash2, ChevronRight, ChevronDown, GripVertical, Eye, EyeOff, X, Save } from 'lucide-react';

interface CategoryManagementProps {
  onNavigate: (page: any) => void;
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

export function CategoryManagement({ onNavigate }: CategoryManagementProps) {
  const [expandedCategories, setExpandedCategories] = useState<number[]>([1, 2]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<number | null>(null);
  const [draggedItem, setDraggedItem] = useState<number | null>(null);

  const [categories, setCategories] = useState<Category[]>([
    {
      id: 1,
      name: 'Tin tức',
      slug: 'tin-tuc',
      parent: null,
      articleTypes: ['news', 'video'],
      active: true,
      order: 1,
      articleCount: 234,
      children: [
        {
          id: 11,
          name: 'Công nghệ',
          slug: 'cong-nghe',
          parent: 1,
          articleTypes: ['news', 'video', 'podcast'],
          active: true,
          order: 1,
          articleCount: 156,
        },
        {
          id: 12,
          name: 'Kinh tế',
          slug: 'kinh-te',
          parent: 1,
          articleTypes: ['news'],
          active: true,
          order: 2,
          articleCount: 78,
        },
      ],
    },
    {
      id: 2,
      name: 'Sự kiện',
      slug: 'su-kien',
      parent: null,
      articleTypes: ['event', 'gallery'],
      active: true,
      order: 2,
      articleCount: 89,
      children: [
        {
          id: 21,
          name: 'Hội thảo',
          slug: 'hoi-thao',
          parent: 2,
          articleTypes: ['event'],
          active: true,
          order: 1,
          articleCount: 45,
        },
        {
          id: 22,
          name: 'Workshop',
          slug: 'workshop',
          parent: 2,
          articleTypes: ['event'],
          active: true,
          order: 2,
          articleCount: 44,
        },
      ],
    },
    {
      id: 3,
      name: 'Tuyển dụng',
      slug: 'tuyen-dung',
      parent: null,
      articleTypes: ['job'],
      active: true,
      order: 3,
      articleCount: 67,
    },
    {
      id: 4,
      name: 'Văn bản pháp luật',
      slug: 'van-ban-phap-luat',
      parent: null,
      articleTypes: ['legal'],
      active: false,
      order: 4,
      articleCount: 123,
    },
  ]);

  const articleTypeLabels: Record<string, string> = {
    news: 'Tin tức',
    video: 'Video',
    gallery: 'Thư viện ảnh',
    legal: 'Văn bản PL',
    job: 'Tuyển dụng',
    podcast: 'Podcast',
    event: 'Sự kiện',
    staff: 'Nhân sự',
    download: 'Tải xuống',
  };

  const toggleExpand = (id: number) => {
    setExpandedCategories(prev =>
      prev.includes(id) ? prev.filter(cid => cid !== id) : [...prev, id]
    );
  };

  const handleDragStart = (e: React.DragEvent, id: number) => {
    setDraggedItem(id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetId: number) => {
    e.preventDefault();
    if (draggedItem === null || draggedItem === targetId) return;

    // Reorder logic here
    console.log(`Move category ${draggedItem} to position of ${targetId}`);
    setDraggedItem(null);
  };

  const toggleCategoryActive = (id: number) => {
    setCategories(prev => {
      const updateActive = (cats: Category[]): Category[] => {
        return cats.map(cat => {
          if (cat.id === id) {
            return { ...cat, active: !cat.active };
          }
          if (cat.children) {
            return { ...cat, children: updateActive(cat.children) };
          }
          return cat;
        });
      };
      return updateActive(prev);
    });
  };

  const deleteCategory = (id: number) => {
    if (confirm('Bạn có chắc chắn muốn xóa danh mục này?')) {
      setCategories(prev => {
        const removeCategory = (cats: Category[]): Category[] => {
          return cats.filter(cat => {
            if (cat.id === id) return false;
            if (cat.children) {
              cat.children = removeCategory(cat.children);
            }
            return true;
          });
        };
        return removeCategory(prev);
      });
    }
  };

  const renderCategory = (category: Category, level: number = 0) => {
    const hasChildren = category.children && category.children.length > 0;
    const isExpanded = expandedCategories.includes(category.id);
    const isDragging = draggedItem === category.id;

    return (
      <div key={category.id}>
        <div
          draggable
          onDragStart={(e) => handleDragStart(e, category.id)}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, category.id)}
          className={`group flex items-center gap-3 py-3 px-4 rounded-lg hover:bg-gray-50 transition-all ${
            isDragging ? 'opacity-50' : ''
          } ${level > 0 ? 'ml-8' : ''}`}
          style={{ paddingLeft: `${level * 32 + 16}px` }}
        >
          {/* Drag Handle */}
          <div className="cursor-move opacity-0 group-hover:opacity-100 transition-opacity">
            <GripVertical className="w-4 h-4 text-gray-400" />
          </div>

          {/* Expand/Collapse */}
          {hasChildren ? (
            <button
              onClick={() => toggleExpand(category.id)}
              className="p-1 hover:bg-gray-200 rounded"
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4 text-gray-600" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-600" />
              )}
            </button>
          ) : (
            <div className="w-6" />
          )}

          {/* Category Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-1">
              <button
                onClick={() => onNavigate({ page: 'category-detail', id: category.id })}
                className="text-gray-900 hover:text-blue-600 transition-colors"
              >
                {category.name}
              </button>
              <span className="text-gray-500 text-sm">/{category.slug}</span>
            </div>
            <div className="flex items-center gap-2">
              {category.articleTypes.map((type, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs"
                >
                  {articleTypeLabels[type]}
                </span>
              ))}
            </div>
          </div>

          {/* Article Count */}
          <div className="text-gray-600 text-sm">
            {category.articleCount} bài viết
          </div>

          {/* Status */}
          <button
            onClick={() => toggleCategoryActive(category.id)}
            className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm transition-colors ${
              category.active
                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category.active ? (
              <>
                <Eye className="w-3 h-3" />
                <span>Hoạt động</span>
              </>
            ) : (
              <>
                <EyeOff className="w-3 h-3" />
                <span>Ẩn</span>
              </>
            )}
          </button>

          {/* Actions */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onNavigate({ page: 'category-detail', id: category.id })}
              className="p-2 hover:bg-blue-100 text-blue-600 rounded-lg"
              title="Xem chi tiết"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={() => setEditingCategory(category.id)}
              className="p-2 hover:bg-gray-200 rounded-lg"
              title="Sửa"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => deleteCategory(category.id)}
              className="p-2 hover:bg-red-100 text-red-600 rounded-lg"
              title="Xóa"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Children */}
        {hasChildren && isExpanded && (
          <div>
            {category.children!.map(child => renderCategory(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-gray-900 mb-1">Quản lý danh mục</h2>
          <p className="text-gray-600">Tổ chức và phân loại nội dung theo cấu trúc cây</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Thêm danh mục</span>
        </button>
      </div>

      {/* Search & Filter */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Tìm kiếm danh mục..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Đang hoạt động</option>
            <option value="inactive">Đã ẩn</option>
          </select>

          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Filter className="w-5 h-5" />
            <span>Lọc theo loại</span>
          </button>
        </div>
      </div>

      {/* Categories Tree */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="w-6"></div>
            <div className="w-6"></div>
            <div className="flex-1">Tên danh mục</div>
            <div className="w-32">Bài viết</div>
            <div className="w-32">Trạng thái</div>
            <div className="w-32">Thao tác</div>
          </div>
        </div>
        
        <div className="p-2">
          {categories.map(category => renderCategory(category))}
        </div>

        {categories.length === 0 && (
          <div className="p-12 text-center text-gray-500">
            <FolderOpen className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p>Chưa có danh mục nào</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="mt-4 text-blue-600 hover:text-blue-700"
            >
              Tạo danh mục đầu tiên
            </button>
          </div>
        )}
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-blue-900 mb-2">💡 Mẹo sử dụng</h4>
        <ul className="text-blue-800 text-sm space-y-1">
          <li>• Kéo thả để sắp xếp lại thứ tự danh mục</li>
          <li>• Click vào tên để xem chi tiết và quản lý bài viết</li>
          <li>• Sử dụng trạng thái "Ẩn" để tạm thời ẩn danh mục khỏi frontend</li>
        </ul>
      </div>

      {/* Create/Edit Modal */}
      {(showCreateModal || editingCategory) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-gray-900">
                {editingCategory ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}
              </h3>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setEditingCategory(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2">Tên danh mục *</label>
                  <input
                    type="text"
                    placeholder="VD: Công nghệ"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2">Slug (URL) *</label>
                  <input
                    type="text"
                    placeholder="cong-nghe"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Danh mục cha</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">-- Danh mục gốc --</option>
                  <option value="1">Tin tức</option>
                  <option value="2">Sự kiện</option>
                  <option value="3">Tuyển dụng</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Mô tả</label>
                <textarea
                  placeholder="Mô tả về danh mục này..."
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-3">Loại bài viết được phép *</label>
                <div className="grid grid-cols-3 gap-3">
                  {Object.entries(articleTypeLabels).map(([key, label]) => (
                    <div key={key} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={`type-${key}`}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label htmlFor={`type-${key}`} className="text-gray-700 text-sm">
                        {label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="active-new"
                  defaultChecked
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="active-new" className="text-gray-700">
                  Kích hoạt danh mục ngay sau khi tạo
                </label>
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200 flex items-center gap-3">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setEditingCategory(null);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={() => {
                  // Handle save
                  alert('Đã lưu danh mục');
                  setShowCreateModal(false);
                  setEditingCategory(null);
                }}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>Lưu danh mục</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
