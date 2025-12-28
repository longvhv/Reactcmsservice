import { useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { 
  Plus, Edit2, Trash2, ChevronRight, ChevronDown, Folder, Eye, EyeOff, 
  Search, GripVertical, FolderOpen, Info
} from 'lucide-react';
import { PageWrapper } from './PageWrapper';
import { PageHeader } from './PageHeader';
import { Card } from './Card';
import { CategoryFormModal } from './CategoryFormModal';
import { CategoryDetail } from './CategoryDetail';
import { useLanguage } from '../contexts/LanguageContext';

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

const ItemType = 'CATEGORY';

interface DraggableCategory {
  id: number;
  type: string;
}

// Draggable Category Item Component
function CategoryItem({ 
  category, 
  level, 
  expandedCategories,
  onToggleExpand,
  onEdit,
  onDelete,
  onToggleActive,
  onViewDetail,
  onMove,
}: {
  category: Category;
  level: number;
  expandedCategories: number[];
  onToggleExpand: (id: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onToggleActive: (id: number) => void;
  onViewDetail: (id: number) => void;
  onMove: (dragId: number, hoverId: number) => void;
}) {
  // Get translation function from context
  const { t } = useLanguage();
  const hasChildren = category.children && category.children.length > 0;
  const isExpanded = expandedCategories.includes(category.id);

  const [{ isDragging }, drag, preview] = useDrag({
    type: ItemType,
    item: { id: category.id, type: ItemType },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isOver }, drop] = useDrop({
    accept: ItemType,
    drop: (item: DraggableCategory) => {
      if (item.id !== category.id) {
        onMove(item.id, category.id);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

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

  return (
    <div ref={preview}>
      <div
        ref={(node) => drag(drop(node))}
        className={`group flex items-center gap-3 py-3 px-4 rounded-lg transition-all ${
          isDragging ? 'opacity-30' : ''
        } ${
          isOver ? 'bg-blue-50 border-l-4 border-blue-500' : 'hover:bg-muted/40'
        }`}
        style={{ paddingLeft: `${level * 32 + 16}px` }}
      >
        {/* Drag Handle */}
        <div ref={drag} className="cursor-move opacity-0 group-hover:opacity-100 transition-opacity">
          <GripVertical className="w-4 h-4 text-muted-foreground" />
        </div>

        {/* Expand/Collapse */}
        {hasChildren ? (
          <button
            onClick={() => onToggleExpand(category.id)}
            className="p-1 hover:bg-muted rounded transition-colors"
          >
            {isExpanded ? (
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            )}
          </button>
        ) : (
          <div className="w-6" />
        )}

        {/* Folder Icon */}
        {isExpanded ? (
          <FolderOpen className="w-5 h-5 text-blue-600" />
        ) : (
          <Folder className="w-5 h-5 text-blue-600" />
        )}

        {/* Category Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1">
            <button
              onClick={() => onViewDetail(category.id)}
              className="font-medium hover:text-blue-600 transition-colors"
            >
              {category.name}
            </button>
            <span className="text-muted-foreground text-sm font-mono">/{category.slug}</span>
          </div>
          <div className="flex items-center gap-2">
            {category.articleTypes.map((type, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded text-xs"
              >
                {articleTypeLabels[type]}
              </span>
            ))}
          </div>
        </div>

        {/* Article Count */}
        <div className="text-muted-foreground text-sm whitespace-nowrap">
          {category.articleCount} bài
        </div>

        {/* Status Toggle */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleActive(category.id);
          }}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm transition-all ${
            category.active
              ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 hover:bg-green-200'
              : 'bg-gray-100 dark:bg-gray-900/30 text-gray-600 dark:text-gray-400 hover:bg-gray-200'
          }`}
        >
          {category.active ? (
            <>
              <Eye className="w-3 h-3" />
              <span>Hiển thị</span>
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
            onClick={() => onViewDetail(category.id)}
            className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-600 rounded-lg transition-colors"
            title="Xem chi tiết"
          >
            <Info className="w-4 h-4" />
          </button>
          <button
            onClick={() => onEdit(category.id)}
            className="p-2 hover:bg-purple-100 dark:hover:bg-purple-900/30 text-purple-600 rounded-lg transition-colors"
            title="Chỉnh sửa"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(category.id)}
            className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 rounded-lg transition-colors"
            title={t('tooltips.delete')}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Render children */}
      {isExpanded && hasChildren && (
        <div>
          {category.children!.map((child) => (
            <CategoryItem
              key={child.id}
              category={child}
              level={level + 1}
              expandedCategories={expandedCategories}
              onToggleExpand={onToggleExpand}
              onEdit={onEdit}
              onDelete={onDelete}
              onToggleActive={onToggleActive}
              onViewDetail={onViewDetail}
              onMove={onMove}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function CategoryManagement({ onNavigate }: CategoryManagementProps) {
  const { t } = useLanguage();
  const [expandedCategories, setExpandedCategories] = useState<number[]>([1, 2]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewingDetailId, setViewingDetailId] = useState<number | null>(null);

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

  const toggleExpand = (id: number) => {
    setExpandedCategories(prev =>
      prev.includes(id) ? prev.filter(cid => cid !== id) : [...prev, id]
    );
  };

  const handleMove = (dragId: number, hoverId: number) => {
    console.log(`Move category ${dragId} to position of ${hoverId}`);
    // Implement reorder logic here
    // This would typically involve updating the order field and parent
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
    if (confirm(t('confirmations.deleteCategory'))) {
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

  const handleEditCategory = (id: number) => {
    const findCategory = (cats: Category[]): Category | null => {
      for (const cat of cats) {
        if (cat.id === id) return cat;
        if (cat.children) {
          const found = findCategory(cat.children);
          if (found) return found;
        }
      }
      return null;
    };
    const category = findCategory(categories);
    if (category) {
      setEditingCategory(category);
      setShowCreateModal(true);
    }
  };

  const handleSaveCategory = (formData: any, saveAndContinue?: boolean) => {
    if (editingCategory) {
      // Update existing category
      setCategories(prev => {
        const updateCategory = (cats: Category[]): Category[] => {
          return cats.map(cat => {
            if (cat.id === editingCategory.id) {
              return { ...cat, ...formData };
            }
            if (cat.children) {
              return { ...cat, children: updateCategory(cat.children) };
            }
            return cat;
          });
        };
        return updateCategory(prev);
      });
      setEditingCategory(null);
    } else {
      // Create new category
      const newCategory: Category = {
        id: Date.now(),
        ...formData,
        articleCount: 0,
      };

      if (formData.parent) {
        // Add as child
        setCategories(prev => {
          const addChild = (cats: Category[]): Category[] => {
            return cats.map(cat => {
              if (cat.id === formData.parent) {
                return {
                  ...cat,
                  children: [...(cat.children || []), newCategory],
                };
              }
              if (cat.children) {
                return { ...cat, children: addChild(cat.children) };
              }
              return cat;
            });
          };
          return addChild(prev);
        });
      } else {
        // Add as root
        setCategories(prev => [...prev, newCategory]);
      }
    }

    if (!saveAndContinue) {
      setShowCreateModal(false);
    }
  };

  // Filter categories by search term
  const filterCategories = (cats: Category[]): Category[] => {
    if (!searchTerm) return cats;
    
    return cats.filter(cat => {
      const matches = cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                     cat.slug.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (matches) return true;
      
      if (cat.children) {
        const filteredChildren = filterCategories(cat.children);
        if (filteredChildren.length > 0) {
          cat.children = filteredChildren;
          return true;
        }
      }
      
      return false;
    });
  };

  const filteredCategories = filterCategories([...categories]);

  // Show category detail view
  if (viewingDetailId !== null) {
    return (
      <CategoryDetail
        categoryId={viewingDetailId}
        onBack={() => setViewingDetailId(null)}
        onNavigate={onNavigate}
        onEdit={(id) => {
          setViewingDetailId(null);
          handleEditCategory(id);
        }}
        onDelete={(id) => {
          setViewingDetailId(null);
          deleteCategory(id);
        }}
      />
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <PageWrapper>
        <PageHeader
          title={t('categories.title')}
          description={t('categories.noCategories')}
          action={
            <button
              onClick={() => {
                setEditingCategory(null);
                setShowCreateModal(true);
              }}
              className="px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/20 transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              {t('categories.createNew')}
            </button>
          }
        />

        {/* Search & Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="md:col-span-3 p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t('search.placeholder')}
                className="w-full pl-10 pr-4 py-2.5 bg-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{categories.length}</p>
              <p className="text-sm text-muted-foreground">Danh mục gốc</p>
            </div>
          </Card>
        </div>

        {/* Category Tree */}
        <Card>
          <div className="p-6">
            <div className="space-y-1">
              {filteredCategories.length > 0 ? (
                filteredCategories.map((category) => (
                  <CategoryItem
                    key={category.id}
                    category={category}
                    level={0}
                    expandedCategories={expandedCategories}
                    onToggleExpand={toggleExpand}
                    onEdit={handleEditCategory}
                    onDelete={deleteCategory}
                    onToggleActive={toggleCategoryActive}
                    onViewDetail={setViewingDetailId}
                    onMove={handleMove}
                  />
                ))
              ) : (
                <div className="text-center py-12">
                  <Folder className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    {searchTerm ? 'Không tìm thấy danh mục nào' : 'Chưa có danh mục nào'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Form Modal */}
        <CategoryFormModal
          isOpen={showCreateModal}
          onClose={() => {
            setShowCreateModal(false);
            setEditingCategory(null);
          }}
          onSave={handleSaveCategory}
          editingCategory={editingCategory}
          categories={categories}
        />
      </PageWrapper>
    </DndProvider>
  );
}