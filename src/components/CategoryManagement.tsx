'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, MoreVertical, Edit2, Trash2, ChevronRight, ChevronDown, Eye, Folder, FolderOpen, Settings, FileText, Video, Image as ImageIcon, Briefcase, Mic, MapPin, Download, Zap, X, Save } from 'lucide-react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { PageWrapper } from './PageWrapper';
import { PageHeader } from './PageHeader';
import { CategoryFormModal } from './CategoryFormModal';
import { CategoryDetail } from './CategoryDetail';
import { Card } from './Card';
import { useLanguage } from '../contexts/LanguageContext';
import { useRouter } from '../contexts/RouterContext';

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

interface CategoryManagementProps {
  onNavigate?: (page: any) => void;
}

// Inline CategoryItem component
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
  const isExpanded = expandedCategories.includes(category.id);
  const hasChildren = category.children && category.children.length > 0;

  const getTypeIcon = (types: string[]) => {
    if (types.includes('news')) return <FileText className="w-4 h-4" />;
    if (types.includes('video')) return <Video className="w-4 h-4" />;
    if (types.includes('gallery')) return <ImageIcon className="w-4 h-4" />;
    if (types.includes('job')) return <Briefcase className="w-4 h-4" />;
    if (types.includes('podcast')) return <Mic className="w-4 h-4" />;
    if (types.includes('event')) return <MapPin className="w-4 h-4" />;
    if (types.includes('download')) return <Download className="w-4 h-4" />;
    if (types.includes('infographic')) return <Zap className="w-4 h-4" />;
    return <FileText className="w-4 h-4" />;
  };

  return (
    <div>
      <div
        className="flex items-center gap-2 p-3 rounded-lg hover:bg-secondary/50 transition-all group"
        style={{ paddingLeft: `${level * 1.5 + 0.75}rem` }}
      >
        {hasChildren ? (
          <button
            onClick={() => onToggleExpand(category.id)}
            className="p-1 hover:bg-secondary rounded"
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

        <div className="flex items-center gap-2 flex-1 min-w-0">
          {hasChildren ? (
            isExpanded ? (
              <FolderOpen className="w-4 h-4 text-blue-500 flex-shrink-0" />
            ) : (
              <Folder className="w-4 h-4 text-blue-500 flex-shrink-0" />
            )
          ) : (
            <div className="text-muted-foreground flex-shrink-0">
              {getTypeIcon(category.articleTypes)}
            </div>
          )}

          <button
            onClick={() => onViewDetail(category.id)}
            className="font-medium hover:text-blue-600 transition-colors truncate text-left"
          >
            {category.name}
          </button>

          <span className="text-xs text-muted-foreground flex-shrink-0">
            ({category.articleCount})
          </span>

          {!category.active && (
            <span className="text-xs px-2 py-0.5 bg-gray-500/10 text-gray-500 rounded flex-shrink-0">
              Inactive
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(category.id)}
            className="p-1.5 hover:bg-blue-500/10 text-blue-600 rounded transition-colors"
            title="Edit"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onViewDetail(category.id)}
            className="p-1.5 hover:bg-green-500/10 text-green-600 rounded transition-colors"
            title="View Details"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onToggleActive(category.id)}
            className="p-1.5 hover:bg-yellow-500/10 text-yellow-600 rounded transition-colors"
            title={category.active ? 'Deactivate' : 'Activate'}
          >
            <Settings className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(category.id)}
            className="p-1.5 hover:bg-red-500/10 text-red-600 rounded transition-colors"
            title="Delete"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

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

export function CategoryManagement({ onNavigate }: CategoryManagementProps = {}) {
  const { t } = useLanguage();
  const router = useRouter();

  const [expandedCategories, setExpandedCategories] = useState<number[]>([1, 2]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewingDetailId, setViewingDetailId] = useState<number | null>(null);

  const [categories, setCategories] = useState<Category[]>([
    // Tin tức
    {
      id: 1,
      name: 'Tin tức',
      slug: 'tin-tuc',
      parent: null,
      articleTypes: ['news'],
      active: true,
      order: 1,
      articleCount: 156,
      children: [
        {
          id: 11,
          name: 'Công nghệ',
          slug: 'cong-nghe',
          parent: 1,
          articleTypes: ['news'],
          active: true,
          order: 1,
          articleCount: 45,
        },
        {
          id: 12,
          name: 'Kinh tế',
          slug: 'kinh-te',
          parent: 1,
          articleTypes: ['news'],
          active: true,
          order: 2,
          articleCount: 38,
        },
        {
          id: 13,
          name: 'Xã hội',
          slug: 'xa-hoi',
          parent: 1,
          articleTypes: ['news'],
          active: true,
          order: 3,
          articleCount: 42,
        },
        {
          id: 14,
          name: 'Thế giới',
          slug: 'the-gioi',
          parent: 1,
          articleTypes: ['news'],
          active: true,
          order: 4,
          articleCount: 31,
        },
      ],
    },
    // Video
    {
      id: 2,
      name: 'Video',
      slug: 'video',
      parent: null,
      articleTypes: ['video'],
      active: true,
      order: 2,
      articleCount: 89,
      children: [
        {
          id: 21,
          name: 'Phỏng vấn',
          slug: 'phong-van',
          parent: 2,
          articleTypes: ['video'],
          active: true,
          order: 1,
          articleCount: 34,
        },
        {
          id: 22,
          name: 'Tutorial',
          slug: 'tutorial',
          parent: 2,
          articleTypes: ['video'],
          active: true,
          order: 2,
          articleCount: 28,
        },
        {
          id: 23,
          name: 'Livestream',
          slug: 'livestream',
          parent: 2,
          articleTypes: ['video'],
          active: true,
          order: 3,
          articleCount: 27,
        },
      ],
    },
    // Gallery
    {
      id: 3,
      name: 'Thư viện ảnh',
      slug: 'thu-vien-anh',
      parent: null,
      articleTypes: ['gallery'],
      active: true,
      order: 3,
      articleCount: 67,
      children: [
        {
          id: 31,
          name: 'Sự kiện công ty',
          slug: 'su-kien-cong-ty',
          parent: 3,
          articleTypes: ['gallery'],
          active: true,
          order: 1,
          articleCount: 24,
        },
        {
          id: 32,
          name: 'Hoạt động đội nhóm',
          slug: 'hoat-dong-doi-nhom',
          parent: 3,
          articleTypes: ['gallery'],
          active: true,
          order: 2,
          articleCount: 19,
        },
        {
          id: 33,
          name: 'Văn phòng',
          slug: 'van-phong',
          parent: 3,
          articleTypes: ['gallery'],
          active: true,
          order: 3,
          articleCount: 24,
        },
      ],
    },
    // Văn bản pháp luật
    {
      id: 4,
      name: 'Văn bản pháp luật',
      slug: 'van-ban-phap-luat',
      parent: null,
      articleTypes: ['legal'],
      active: true,
      order: 4,
      articleCount: 142,
      children: [
        {
          id: 41,
          name: 'Nghị định',
          slug: 'nghi-dinh',
          parent: 4,
          articleTypes: ['legal'],
          active: true,
          order: 1,
          articleCount: 48,
        },
        {
          id: 42,
          name: 'Thông tư',
          slug: 'thong-tu',
          parent: 4,
          articleTypes: ['legal'],
          active: true,
          order: 2,
          articleCount: 52,
        },
        {
          id: 43,
          name: 'Quyết định',
          slug: 'quyet-dinh',
          parent: 4,
          articleTypes: ['legal'],
          active: true,
          order: 3,
          articleCount: 42,
        },
      ],
    },
    // Tuyển dụng
    {
      id: 5,
      name: 'Tuyển dụng',
      slug: 'tuyen-dung',
      parent: null,
      articleTypes: ['job'],
      active: true,
      order: 5,
      articleCount: 78,
      children: [
        {
          id: 51,
          name: 'Công nghệ thông tin',
          slug: 'cong-nghe-thong-tin',
          parent: 5,
          articleTypes: ['job'],
          active: true,
          order: 1,
          articleCount: 32,
        },
        {
          id: 52,
          name: 'Marketing',
          slug: 'marketing',
          parent: 5,
          articleTypes: ['job'],
          active: true,
          order: 2,
          articleCount: 18,
        },
        {
          id: 53,
          name: 'Nhân sự',
          slug: 'nhan-su',
          parent: 5,
          articleTypes: ['job'],
          active: true,
          order: 3,
          articleCount: 14,
        },
        {
          id: 54,
          name: 'Kế toán',
          slug: 'ke-toan',
          parent: 5,
          articleTypes: ['job'],
          active: true,
          order: 4,
          articleCount: 14,
        },
      ],
    },
    // Podcast
    {
      id: 6,
      name: 'Podcast',
      slug: 'podcast',
      parent: null,
      articleTypes: ['podcast'],
      active: true,
      order: 6,
      articleCount: 54,
      children: [
        {
          id: 61,
          name: 'Tech Talk',
          slug: 'tech-talk',
          parent: 6,
          articleTypes: ['podcast'],
          active: true,
          order: 1,
          articleCount: 22,
        },
        {
          id: 62,
          name: 'Business Insights',
          slug: 'business-insights',
          parent: 6,
          articleTypes: ['podcast'],
          active: true,
          order: 2,
          articleCount: 18,
        },
        {
          id: 63,
          name: 'Câu chuyện thành công',
          slug: 'cau-chuyen-thanh-cong',
          parent: 6,
          articleTypes: ['podcast'],
          active: true,
          order: 3,
          articleCount: 14,
        },
      ],
    },
    // Sự kiện
    {
      id: 7,
      name: 'Sự kiện',
      slug: 'su-kien',
      parent: null,
      articleTypes: ['event'],
      active: true,
      order: 7,
      articleCount: 96,
      children: [
        {
          id: 71,
          name: 'Hội thảo',
          slug: 'hoi-thao',
          parent: 7,
          articleTypes: ['event'],
          active: true,
          order: 1,
          articleCount: 38,
        },
        {
          id: 72,
          name: 'Workshop',
          slug: 'workshop',
          parent: 7,
          articleTypes: ['event'],
          active: true,
          order: 2,
          articleCount: 28,
        },
        {
          id: 73,
          name: 'Webinar',
          slug: 'webinar',
          parent: 7,
          articleTypes: ['event'],
          active: true,
          order: 3,
          articleCount: 30,
        },
      ],
    },
    // Nhân sự
    {
      id: 8,
      name: 'Đội ngũ',
      slug: 'doi-ngu',
      parent: null,
      articleTypes: ['staff'],
      active: true,
      order: 8,
      articleCount: 45,
      children: [
        {
          id: 81,
          name: 'Ban lãnh đạo',
          slug: 'ban-lanh-dao',
          parent: 8,
          articleTypes: ['staff'],
          active: true,
          order: 1,
          articleCount: 8,
        },
        {
          id: 82,
          name: 'Phòng kỹ thuật',
          slug: 'phong-ky-thuat',
          parent: 8,
          articleTypes: ['staff'],
          active: true,
          order: 2,
          articleCount: 18,
        },
        {
          id: 83,
          name: 'Phòng kinh doanh',
          slug: 'phong-kinh-doanh',
          parent: 8,
          articleTypes: ['staff'],
          active: true,
          order: 3,
          articleCount: 12,
        },
        {
          id: 84,
          name: 'Phòng hành chính',
          slug: 'phong-hanh-chinh',
          parent: 8,
          articleTypes: ['staff'],
          active: true,
          order: 4,
          articleCount: 7,
        },
      ],
    },
    // Tải xuống
    {
      id: 9,
      name: 'Tài liệu',
      slug: 'tai-lieu',
      parent: null,
      articleTypes: ['download'],
      active: true,
      order: 9,
      articleCount: 112,
      children: [
        {
          id: 91,
          name: 'Biểu mẫu',
          slug: 'bieu-mau',
          parent: 9,
          articleTypes: ['download'],
          active: true,
          order: 1,
          articleCount: 38,
        },
        {
          id: 92,
          name: 'Hướng dẫn',
          slug: 'huong-dan',
          parent: 9,
          articleTypes: ['download'],
          active: true,
          order: 2,
          articleCount: 44,
        },
        {
          id: 93,
          name: 'Báo cáo',
          slug: 'bao-cao',
          parent: 9,
          articleTypes: ['download'],
          active: true,
          order: 3,
          articleCount: 30,
        },
      ],
    },
    // Infographic
    {
      id: 10,
      name: 'Infographic',
      slug: 'infographic',
      parent: null,
      articleTypes: ['infographic'],
      active: true,
      order: 10,
      articleCount: 34,
      children: [
        {
          id: 101,
          name: 'Thống kê',
          slug: 'thong-ke',
          parent: 10,
          articleTypes: ['infographic'],
          active: true,
          order: 1,
          articleCount: 15,
        },
        {
          id: 102,
          name: 'Dữ liệu thị trường',
          slug: 'du-lieu-thi-truong',
          parent: 10,
          articleTypes: ['infographic'],
          active: true,
          order: 2,
          articleCount: 19,
        },
      ],
    },
    // Blog
    {
      id: 11,
      name: 'Blog',
      slug: 'blog',
      parent: null,
      articleTypes: ['blog'],
      active: true,
      order: 11,
      articleCount: 87,
      children: [
        {
          id: 111,
          name: 'Công nghệ',
          slug: 'blog-cong-nghe',
          parent: 11,
          articleTypes: ['blog'],
          active: true,
          order: 1,
          articleCount: 32,
        },
        {
          id: 112,
          name: 'Lifestyle',
          slug: 'lifestyle',
          parent: 11,
          articleTypes: ['blog'],
          active: true,
          order: 2,
          articleCount: 28,
        },
        {
          id: 113,
          name: 'Kinh nghiệm',
          slug: 'kinh-nghiem',
          parent: 11,
          articleTypes: ['blog'],
          active: true,
          order: 3,
          articleCount: 27,
        },
      ],
    },
    // Trang
    {
      id: 12,
      name: 'Giới thiệu',
      slug: 'gioi-thieu',
      parent: null,
      articleTypes: ['page'],
      active: true,
      order: 12,
      articleCount: 12,
      children: [
        {
          id: 121,
          name: 'Về chúng tôi',
          slug: 've-chung-toi',
          parent: 12,
          articleTypes: ['page'],
          active: true,
          order: 1,
          articleCount: 3,
        },
        {
          id: 122,
          name: 'Sứ mệnh & Tầm nhìn',
          slug: 'su-menh-tam-nhin',
          parent: 12,
          articleTypes: ['page'],
          active: true,
          order: 2,
          articleCount: 2,
        },
        {
          id: 123,
          name: 'Giá trị cốt lõi',
          slug: 'gia-tri-cot-loi',
          parent: 12,
          articleTypes: ['page'],
          active: true,
          order: 3,
          articleCount: 4,
        },
        {
          id: 124,
          name: 'Lịch sử phát triển',
          slug: 'lich-su-phat-trien',
          parent: 12,
          articleTypes: ['page'],
          active: true,
          order: 4,
          articleCount: 3,
        },
      ],
    },
    // FAQ
    {
      id: 13,
      name: 'Hỏi đáp',
      slug: 'hoi-dap',
      parent: null,
      articleTypes: ['faq'],
      active: true,
      order: 13,
      articleCount: 68,
      children: [
        {
          id: 131,
          name: 'Sản phẩm & Dịch vụ',
          slug: 'san-pham-dich-vu',
          parent: 13,
          articleTypes: ['faq'],
          active: true,
          order: 1,
          articleCount: 24,
        },
        {
          id: 132,
          name: 'Thanh toán',
          slug: 'thanh-toan',
          parent: 13,
          articleTypes: ['faq'],
          active: true,
          order: 2,
          articleCount: 18,
        },
        {
          id: 133,
          name: 'Hỗ trợ kỹ thuật',
          slug: 'ho-tro-ky-thuat',
          parent: 13,
          articleTypes: ['faq'],
          active: true,
          order: 3,
          articleCount: 26,
        },
      ],
    },
    // Testimonial
    {
      id: 14,
      name: 'Đánh giá',
      slug: 'danh-gia',
      parent: null,
      articleTypes: ['testimonial'],
      active: true,
      order: 14,
      articleCount: 52,
      children: [
        {
          id: 141,
          name: 'Khách hàng doanh nghiệp',
          slug: 'khach-hang-doanh-nghiep',
          parent: 14,
          articleTypes: ['testimonial'],
          active: true,
          order: 1,
          articleCount: 22,
        },
        {
          id: 142,
          name: 'Khách hàng cá nhân',
          slug: 'khach-hang-ca-nhan',
          parent: 14,
          articleTypes: ['testimonial'],
          active: true,
          order: 2,
          articleCount: 18,
        },
        {
          id: 143,
          name: 'Đối tác',
          slug: 'doi-tac',
          parent: 14,
          articleTypes: ['testimonial'],
          active: true,
          order: 3,
          articleCount: 12,
        },
      ],
    },
    // Portfolio
    {
      id: 15,
      name: 'Dự án',
      slug: 'du-an',
      parent: null,
      articleTypes: ['portfolio'],
      active: true,
      order: 15,
      articleCount: 43,
      children: [
        {
          id: 151,
          name: 'Web Development',
          slug: 'web-development',
          parent: 15,
          articleTypes: ['portfolio'],
          active: true,
          order: 1,
          articleCount: 16,
        },
        {
          id: 152,
          name: 'Mobile App',
          slug: 'mobile-app',
          parent: 15,
          articleTypes: ['portfolio'],
          active: true,
          order: 2,
          articleCount: 14,
        },
        {
          id: 153,
          name: 'UI/UX Design',
          slug: 'ui-ux-design',
          parent: 15,
          articleTypes: ['portfolio'],
          active: true,
          order: 3,
          articleCount: 13,
        },
      ],
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