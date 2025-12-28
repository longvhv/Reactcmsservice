import { useState } from 'react';
import { 
  ArrowLeft, Edit2, Trash2, Eye, EyeOff, Users, FileText, Calendar,
  TrendingUp, Folder, Link as LinkIcon, Settings, Save, X, Plus,
  ExternalLink, BarChart3, Clock, Tag, Table, List as ListIcon, LayoutGrid, Search
} from 'lucide-react';
import { PageWrapper } from './PageWrapper';
import { PageHeader } from './PageHeader';
import { Card } from './Card';
import { ArticleListView, Article } from './ArticleListView';
import { ArticleTableView } from './ArticleTableView';

interface CategoryDetailProps {
  categoryId?: number;
  onBack: () => void;
  onNavigate: (page: any) => void;
  onEdit?: (categoryId: number) => void;
  onDelete?: (categoryId: number) => void;
}

interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  parent: number | null;
  parentName?: string;
  articleTypes: string[];
  active: boolean;
  order: number;
  articleCount: number;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  children?: Category[];
}

interface Article {
  id: number;
  title: string;
  type: string;
  status: string;
  author: string;
  publishDate: string;
  views: number;
}

export function CategoryDetail({ 
  categoryId = 1, 
  onBack, 
  onNavigate,
  onEdit,
  onDelete 
}: CategoryDetailProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'articles' | 'seo' | 'settings'>('overview');
  
  // Articles Tab States
  const [articleViewMode, setArticleViewMode] = useState<'table' | 'list' | 'grid'>('table');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedArticles, setSelectedArticles] = useState<number[]>([]);

  // Mock data - replace with API call
  const category: Category = {
    id: categoryId,
    name: 'Công nghệ',
    slug: 'cong-nghe',
    description: 'Danh mục chứa các bài viết về công nghệ, AI, phần mềm và các xu hướng công nghệ mới nhất.',
    parent: 1,
    parentName: 'Tin tức',
    articleTypes: ['news', 'video', 'podcast'],
    active: true,
    order: 1,
    articleCount: 156,
    seoTitle: 'Tin tức công nghệ - CMS Platform',
    seoDescription: 'Cập nhật tin tức công nghệ mới nhất, xu hướng AI, phần mềm và chuyển đổi số',
    seoKeywords: ['công nghệ', 'AI', 'phần mềm', 'chuyển đổi số'],
    createdAt: '2024-01-15 10:30',
    updatedAt: '2024-12-26 14:20',
    createdBy: 'Admin',
    updatedBy: 'Nguyễn Văn A',
    children: [
      { id: 111, name: 'AI & Machine Learning', slug: 'ai-ml', parent: categoryId, articleTypes: ['news'], active: true, order: 1, articleCount: 45 },
      { id: 112, name: 'Phần mềm', slug: 'phan-mem', parent: categoryId, articleTypes: ['news', 'video'], active: true, order: 2, articleCount: 67 },
      { id: 113, name: 'Blockchain', slug: 'blockchain', parent: categoryId, articleTypes: ['news'], active: true, order: 3, articleCount: 44 },
    ],
  };

  // Mock articles data - filtered by category
  const allArticles: Article[] = [
    {
      id: 1,
      title: 'Hướng dẫn sử dụng CMS Platform mới',
      type: 'news',
      status: 'published',
      category: 'Công nghệ',
      author: 'Nguyễn Văn A',
      views: 1234,
      comments: 45,
      publishDate: '2024-12-26 10:30',
      updatedDate: '2024-12-26 14:20',
      thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop',
      excerpt: 'Hướng dẫn chi tiết về cách sử dụng CMS Platform cho người mới bắt đầu',
      featured: true,
    },
    {
      id: 2,
      title: 'Video: Tính năng AI Translation trong CMS',
      type: 'video',
      status: 'published',
      category: 'Công nghệ',
      author: 'Trần Thị B',
      views: 2341,
      comments: 67,
      publishDate: '2024-12-25 16:45',
      updatedDate: '2024-12-25 16:45',
      thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=250&fit=crop',
      excerpt: 'Video hướng dẫn sử dụng tính năng AI Translation tự động',
      duration: '15:30',
      videoUrl: 'https://www.youtube.com/watch?v=example',
    },
    {
      id: 3,
      title: 'Podcast: Xu hướng công nghệ 2025',
      type: 'podcast',
      status: 'published',
      category: 'Công nghệ',
      author: 'Đỗ Thị F',
      views: 654,
      comments: 23,
      publishDate: '2024-12-22 08:00',
      updatedDate: '2024-12-22 14:00',
      thumbnail: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=400&h=250&fit=crop',
      excerpt: 'Thảo luận về các xu hướng công nghệ mới trong năm 2025',
      duration: '45:00',
    },
    {
      id: 4,
      title: 'Giới thiệu ChatGPT-4 và ứng dụng trong công việc',
      type: 'news',
      status: 'draft',
      category: 'Công nghệ',
      author: 'Nguyễn Văn A',
      views: 0,
      comments: 0,
      publishDate: '2024-12-27 10:00',
      updatedDate: '2024-12-27 10:00',
      thumbnail: 'https://images.unsplash.com/photo-1677756119517-756a188d2d94?w=400&h=250&fit=crop',
      excerpt: 'Tìm hiểu về ChatGPT-4 và cách áp dụng vào công việc hàng ngày',
    },
    {
      id: 5,
      title: 'Video: Hướng dẫn lập trình React từ cơ bản đến nâng cao',
      type: 'video',
      status: 'review',
      category: 'Công nghệ',
      author: 'Trần Thị B',
      views: 156,
      comments: 12,
      publishDate: '2024-12-20 14:00',
      updatedDate: '2024-12-26 09:00',
      thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=250&fit=crop',
      excerpt: 'Series video hướng dẫn lập trình React cho người mới bắt đầu',
      duration: '2:30:00',
      videoUrl: 'https://www.youtube.com/watch?v=example',
    },
  ];

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

  const statusLabels: Record<string, string> = {
    published: 'Đã xuất bản',
    draft: 'Nháp',
    review: 'Chờ duyệt',
  };

  const handleDelete = () => {
    if (confirm('Bạn có chắc chắn muốn xóa danh mục này? Tất cả bài viết trong danh mục sẽ bị di chuyển về "Chưa phân loại".')) {
      onDelete?.(categoryId);
      onBack();
    }
  };

  const stats = [
    { label: 'Tổng bài viết', value: category.articleCount, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Danh mục con', value: category.children?.length || 0, icon: Folder, color: 'text-purple-600', bg: 'bg-purple-100' },
    { label: 'Lượt xem', value: '23.5K', icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'Loại bài viết', value: category.articleTypes.length, icon: Tag, color: 'text-orange-600', bg: 'bg-orange-100' },
  ];

  return (
    <PageWrapper>
      <PageHeader
        title={category.name}
        description={`/${category.slug}`}
        breadcrumbs={[
          { label: 'Danh mục', onClick: onBack },
          { label: category.parentName || 'Root' },
          { label: category.name },
        ]}
        action={
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="px-4 py-2.5 bg-card border border-border/60 text-foreground rounded-xl hover:bg-muted transition-all flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Quay lại
            </button>
            <button
              onClick={() => onEdit?.(categoryId)}
              className="px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/20 transition-all flex items-center gap-2"
            >
              <Edit2 className="w-4 h-4" />
              Chỉnh sửa
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:shadow-lg hover:shadow-red-500/20 transition-all flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Xóa
            </button>
          </div>
        }
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                <p className="text-2xl">{stat.value}</p>
              </div>
              <div className={`p-3 ${stat.bg} rounded-xl`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <Card>
        <div className="border-b border-border">
          <div className="flex gap-6 px-6">
            {[
              { id: 'overview', label: 'Tổng quan', icon: BarChart3 },
              { id: 'articles', label: 'Bài viết', icon: FileText },
              { id: 'seo', label: 'SEO', icon: TrendingUp },
              { id: 'settings', label: 'Cài đặt', icon: Settings },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-4 border-b-2 transition-all ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Basic Info */}
              <div>
                <h3 className="text-lg mb-4 flex items-center gap-2">
                  <Folder className="w-5 h-5 text-blue-600" />
                  Thông tin cơ bản
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-muted-foreground">Tên danh mục</label>
                    <p className="mt-1">{category.name}</p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Đường dẫn (Slug)</label>
                    <p className="mt-1 font-mono text-sm bg-muted px-3 py-2 rounded-lg inline-flex items-center gap-2">
                      /{category.slug}
                      <button className="text-blue-600 hover:text-blue-700">
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Danh mục cha</label>
                    <p className="mt-1">{category.parentName || 'Không có (Root)'}</p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Trạng thái</label>
                    <p className="mt-1">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm ${
                        category.active 
                          ? 'bg-green-100 text-green-600' 
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {category.active ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        {category.active ? 'Hiển thị' : 'Ẩn'}
                      </span>
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm text-muted-foreground">Mô tả</label>
                    <p className="mt-1 text-sm">{category.description || 'Chưa có mô tả'}</p>
                  </div>
                </div>
              </div>

              {/* Article Types */}
              <div>
                <h3 className="text-lg mb-4 flex items-center gap-2">
                  <Tag className="w-5 h-5 text-purple-600" />
                  Loại bài viết được phép
                </h3>
                <div className="flex flex-wrap gap-2">
                  {category.articleTypes.map(type => (
                    <span
                      key={type}
                      className="px-3 py-1.5 bg-blue-100 text-blue-600 rounded-lg text-sm"
                    >
                      {articleTypeLabels[type] || type}
                    </span>
                  ))}
                </div>
              </div>

              {/* Child Categories */}
              {category.children && category.children.length > 0 && (
                <div>
                  <h3 className="text-lg mb-4 flex items-center gap-2">
                    <Folder className="w-5 h-5 text-orange-600" />
                    Danh mục con ({category.children.length})
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {category.children.map(child => (
                      <div
                        key={child.id}
                        onClick={() => onNavigate({ page: 'category-detail', id: child.id })}
                        className="p-4 bg-muted/40 rounded-xl border border-border/60 hover:border-blue-500/50 hover:shadow-md transition-all cursor-pointer group"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <Folder className="w-5 h-5 text-blue-600" />
                          <span className="text-xs text-muted-foreground">{child.articleCount} bài</span>
                        </div>
                        <h4 className="font-medium group-hover:text-blue-600 transition-colors">
                          {child.name}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-1">/{child.slug}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Metadata */}
              <div>
                <h3 className="text-lg mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-gray-600" />
                  Thông tin khác
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <label className="text-muted-foreground">Ngày tạo</label>
                    <p className="mt-1">{category.createdAt} bởi {category.createdBy}</p>
                  </div>
                  <div>
                    <label className="text-muted-foreground">Cập nhật lần cuối</label>
                    <p className="mt-1">{category.updatedAt} bởi {category.updatedBy}</p>
                  </div>
                  <div>
                    <label className="text-muted-foreground">Thứ tự sắp xếp</label>
                    <p className="mt-1">#{category.order}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Articles Tab */}
          {activeTab === 'articles' && (
            <div className="space-y-4">
              {/* Header with View Mode Toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg">Bài viết trong danh mục</h3>
                  <p className="text-sm text-muted-foreground">Tổng cộng {allArticles.length} bài viết</p>
                </div>
                <div className="flex items-center gap-3">
                  {/* View Mode Toggle */}
                  <div className="flex items-center gap-1 p-1 bg-muted/40 rounded-xl border border-border/60">
                    <button
                      onClick={() => setArticleViewMode('table')}
                      className={`p-2 rounded-lg transition-all duration-200 ${
                        articleViewMode === 'table'
                          ? 'bg-white shadow-sm text-blue-600'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                      title="Dạng bảng"
                    >
                      <Table className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setArticleViewMode('list')}
                      className={`p-2 rounded-lg transition-all duration-200 ${
                        articleViewMode === 'list'
                          ? 'bg-white shadow-sm text-blue-600'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                      title="Dạng danh sách"
                    >
                      <ListIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setArticleViewMode('grid')}
                      className={`p-2 rounded-lg transition-all duration-200 ${
                        articleViewMode === 'grid'
                          ? 'bg-white shadow-sm text-blue-600'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                      title="Dạng lưới"
                    >
                      <LayoutGrid className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    onClick={() => onNavigate({ page: 'article-editor', categoryId })}
                    className="px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/20 transition-all flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Tạo bài viết mới
                  </button>
                </div>
              </div>

              {/* Filters */}
              <div className="flex items-center gap-3">
                {/* Search */}
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Tìm kiếm bài viết..."
                    className="w-full pl-10 pr-4 py-2.5 bg-secondary border border-border/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                {/* Status Filter */}
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-4 py-2.5 bg-secondary border border-border/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 min-w-[160px]"
                >
                  <option value="all">Tất cả trạng thái</option>
                  <option value="published">Đã xuất bản</option>
                  <option value="draft">Nháp</option>
                  <option value="review">Chờ duyệt</option>
                  <option value="scheduled">Đã lên lịch</option>
                  <option value="archived">Đã lưu trữ</option>
                </select>
              </div>

              {/* Article List */}
              {(() => {
                // Filter articles
                const filteredArticles = allArticles.filter(article => {
                  const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                       article.author.toLowerCase().includes(searchTerm.toLowerCase());
                  const matchesStatus = selectedStatus === 'all' || article.status === selectedStatus;
                  return matchesSearch && matchesStatus;
                });

                const handleEdit = (articleId: number) => {
                  onNavigate({ page: 'article-detail', id: articleId });
                };

                const handleDelete = (articleId: number) => {
                  if (confirm('Bạn có chắc chắn muốn xóa bài viết này?')) {
                    console.log('Delete article:', articleId);
                  }
                };

                const handleSelectionChange = (selectedIds: number[]) => {
                  setSelectedArticles(selectedIds);
                };

                // Render based on view mode
                if (articleViewMode === 'table') {
                  return (
                    <ArticleTableView
                      articles={filteredArticles}
                      onNavigate={onNavigate}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      onSelectionChange={handleSelectionChange}
                      selectedIds={selectedArticles}
                      enableSelection={true}
                    />
                  );
                } else {
                  return (
                    <ArticleListView
                      articles={filteredArticles}
                      onNavigate={onNavigate}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      onSelectionChange={handleSelectionChange}
                      selectedIds={selectedArticles}
                      showCategory={false}
                      enableSelection={true}
                      viewMode={articleViewMode === 'grid' ? 'grid' : 'list'}
                    />
                  );
                }
              })()}
            </div>
          )}

          {/* SEO Tab */}
          {activeTab === 'seo' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg mb-4">Tối ưu hóa SEO</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-muted-foreground">Tiêu đề SEO</label>
                    <p className="mt-1 p-3 bg-muted/40 rounded-lg">{category.seoTitle || category.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {(category.seoTitle || category.name).length}/60 ký tự
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Mô tả SEO</label>
                    <p className="mt-1 p-3 bg-muted/40 rounded-lg text-sm">
                      {category.seoDescription || category.description || 'Chưa có mô tả SEO'}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {(category.seoDescription || category.description || '').length}/160 ký tự
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Từ khóa</label>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {category.seoKeywords?.map((keyword, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm"
                        >
                          {keyword}
                        </span>
                      )) || <p className="text-sm text-muted-foreground">Chưa có từ khóa</p>}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">URL xem trước</label>
                    <p className="mt-1 p-3 bg-muted/40 rounded-lg text-sm font-mono text-blue-600">
                      https://example.com/{category.slug}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg mb-4">Cài đặt danh mục</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-muted/40 rounded-xl">
                    <div>
                      <h4 className="font-medium">Hiển thị công khai</h4>
                      <p className="text-sm text-muted-foreground">Cho phép danh mục hiển thị trên website</p>
                    </div>
                    <button
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        category.active ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          category.active ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-muted/40 rounded-xl">
                    <div>
                      <h4 className="font-medium">Tự động thêm bài viết mới</h4>
                      <p className="text-sm text-muted-foreground">Tự động thêm bài viết vào danh mục này khi tạo mới</p>
                    </div>
                    <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-300">
                      <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-1" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-muted/40 rounded-xl">
                    <div>
                      <h4 className="font-medium">Hiển thị trong menu</h4>
                      <p className="text-sm text-muted-foreground">Hiển thị danh mục trong menu điều hướng</p>
                    </div>
                    <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600">
                      <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                <h4 className="font-medium text-red-600 mb-2 flex items-center gap-2">
                  <Trash2 className="w-4 h-4" />
                  Xóa danh mục
                </h4>
                <p className="text-sm text-red-600 mb-4">
                  Hành động này không thể hoàn tác. Tất cả bài viết trong danh mục sẽ được chuyển về "Chưa phân loại".
                </p>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
                >
                  Xóa danh mục này
                </button>
              </div>
            </div>
          )}
        </div>
      </Card>
    </PageWrapper>
  );
}