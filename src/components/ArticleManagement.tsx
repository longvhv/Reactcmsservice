import { useState } from 'react';
import { Plus, Wand2, Table, LayoutGrid, List, Search, FileText, Video, Image as ImageIcon, File, Users, Briefcase, Mic, MapPin, Download } from 'lucide-react';
import { ArticleEditor } from './ArticleEditor';
import { PageWrapper } from './PageWrapper';
import { PageHeader } from './PageHeader';
import { ArticleListView, Article } from './ArticleListView';
import { ArticleTableView } from './ArticleTableView';
import { BulkOperations } from './BulkOperations';

interface ArticleManagementProps {
  onNavigate: (page: any) => void;
}

export function ArticleManagement({ onNavigate }: ArticleManagementProps) {
  const [showEditor, setShowEditor] = useState(false);
  const [editingArticleId, setEditingArticleId] = useState<number | undefined>(undefined);
  const [selectedArticles, setSelectedArticles] = useState<number[]>([]);
  const [viewMode, setViewMode] = useState<'table' | 'list' | 'grid'>('table');
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const articles: Article[] = [
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
      category: 'Hướng dẫn',
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
      title: 'Thư viện ảnh sự kiện Tech Summit 2024',
      type: 'gallery',
      status: 'review',
      category: 'Sự kiện',
      author: 'Lê Văn C',
      views: 432,
      comments: 12,
      publishDate: '2024-12-25 09:00',
      updatedDate: '2024-12-25 15:30',
      thumbnail: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=250&fit=crop',
      excerpt: 'Bộ sưu tập hình ảnh từ sự kiện công nghệ lớn nhất năm',
      imageCount: 45,
    },
    {
      id: 4,
      title: 'Quyết định 123/2024/QĐ-TTg về chuyển đổi số',
      type: 'legal',
      status: 'published',
      category: 'Văn bn pháp luật',
      author: 'Phạm Thị D',
      views: 876,
      comments: 23,
      publishDate: '2024-12-24 08:00',
      updatedDate: '2024-12-24 14:15',
      thumbnail: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&h=250&fit=crop',
      excerpt: 'Quyết định về chuyển đổi số trong cơ quan nhà nước',
      documentNumber: '123/2024/QĐ-TTg',
      issueDate: '2024-12-20',
      effectiveDate: '2025-01-01',
    },
    {
      id: 5,
      title: 'Tuyển dụng Senior Full-stack Developer',
      type: 'job',
      status: 'published',
      category: 'Tuyển dụng',
      author: 'Hoàng Văn E',
      views: 1543,
      comments: 89,
      publishDate: '2024-12-23 08:00',
      updatedDate: '2024-12-23 14:00',
      thumbnail: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=250&fit=crop',
      excerpt: 'Tuyển dụng vị trí Senior Full-stack Developer, mức lương hấp dẫn',
      position: 'Senior Full-stack Developer',
      salary: '25-35 triệu',
      location: 'Hà Nội',
      deadline: '2025-01-15',
    },
    {
      id: 6,
      title: 'Podcast: Xu hướng công nghệ 2025',
      type: 'podcast',
      status: 'published',
      category: 'Công nghệ',
      author: 'Đỗ Thị F',
      views: 654,
      comments: 34,
      publishDate: '2024-12-22 10:00',
      updatedDate: '2024-12-22 10:00',
      thumbnail: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=400&h=250&fit=crop',
      excerpt: 'Tập podcast về xu hướng công nghệ năm 2025',
      duration: '45:20',
      audioUrl: 'https://example.com/podcast.mp3',
      episode: 12,
    },
    {
      id: 7,
      title: 'Sự kiện: Workshop AI trong phát triển phần mềm',
      type: 'event',
      status: 'published',
      category: 'Sự kiện',
      author: 'Vũ Văn G',
      views: 987,
      comments: 56,
      publishDate: '2024-12-21 09:00',
      updatedDate: '2024-12-21 15:30',
      thumbnail: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=250&fit=crop',
      excerpt: 'Workshop về ứng dụng AI trong phát triển phần mềm',
      eventDate: '2025-01-20',
      eventTime: '14:00 - 17:00',
      location: 'Tòa nhà VHV, Hà Nội',
      registrationCount: 85,
      maxParticipants: 100,
    },
    {
      id: 8,
      title: 'Hồ sơ nhân sự - Nguyễn Thị H',
      type: 'staff',
      status: 'published',
      category: 'Nhân sự',
      author: 'Admin',
      views: 234,
      comments: 0,
      publishDate: '2024-12-20 08:00',
      updatedDate: '2024-12-20 08:00',
      thumbnail: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=250&fit=crop',
      excerpt: 'Hồ sơ thông tin nhân sự Nguyễn Thị H',
      position: 'Product Manager',
      department: 'Product Development',
      joinDate: '2023-06-15',
    },
    {
      id: 9,
      title: 'Tải xuống: Tài liệu hướng dẫn sử dụng CMS',
      type: 'download',
      status: 'published',
      category: 'Tài liệu',
      author: 'Admin',
      views: 1876,
      comments: 23,
      publishDate: '2024-12-19 08:00',
      updatedDate: '2024-12-19 08:00',
      thumbnail: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&h=250&fit=crop',
      excerpt: 'Tài liệu PDF hướng dẫn chi tiết về CMS Platform',
      fileSize: '5.2 MB',
      fileType: 'PDF',
      downloadCount: 342,
    },
  ];

  const handleEdit = (id: number) => {
    setEditingArticleId(id);
    setShowEditor(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('Bạn có chắc chắn muốn xóa bài viết này?')) {
      console.log('Delete article:', id);
      // Implement delete logic
    }
  };

  const handleSelectionChange = (ids: number[]) => {
    setSelectedArticles(ids);
  };

  const handleBulkComplete = () => {
    setSelectedArticles([]);
    // Refresh data if needed
  };

  // Filter articles based on search term, type, and status
  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || article.type === selectedType;
    const matchesStatus = selectedStatus === 'all' || article.status === selectedStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const articleTypes = [
    { value: 'all', label: 'Tất cả loại' },
    { value: 'news', label: 'Tin tức' },
    { value: 'video', label: 'Video' },
    { value: 'gallery', label: 'Thư viện ảnh' },
    { value: 'legal', label: 'Văn bản pháp luật' },
    { value: 'staff', label: 'Nhân sự' },
    { value: 'job', label: 'Tuyển dụng' },
    { value: 'podcast', label: 'Podcast' },
    { value: 'event', label: 'Sự kiện' },
    { value: 'download', label: 'Tải xuống' },
  ];

  const statusOptions = [
    { value: 'all', label: 'Tất cả trạng thái' },
    { value: 'published', label: 'Đã xuất bản' },
    { value: 'draft', label: 'Nháp' },
    { value: 'review', label: 'Chờ duyệt' },
    { value: 'scheduled', label: 'Đã lên lịch' },
    { value: 'archived', label: 'Đã lưu trữ' },
  ];

  if (showEditor) {
    return (
      <ArticleEditor
        articleId={editingArticleId}
        onBack={() => {
          setShowEditor(false);
          setEditingArticleId(undefined);
        }}
        onNavigate={onNavigate}
      />
    );
  }

  return (
    <PageWrapper>
      <PageHeader
        title="Quản lý bài viết"
        description="Quản lý tất cả các bài viết trên hệ thống"
        action={
          <div className="flex items-center gap-3">
            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 p-1 bg-muted/40 rounded-xl border border-border/60">
              <button
                onClick={() => setViewMode('table')}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  viewMode === 'table'
                    ? 'bg-white shadow-sm text-blue-600'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                title="Dạng bảng"
              >
                <Table className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  viewMode === 'list'
                    ? 'bg-white shadow-sm text-blue-600'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                title="Dạng danh sách"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  viewMode === 'grid'
                    ? 'bg-white shadow-sm text-blue-600'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                title="Dạng lưới"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={() => onNavigate({ page: 'ai-tools' })}
              className="px-4 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-lg hover:shadow-purple-500/20 transition-all flex items-center gap-2"
            >
              <Wand2 className="w-4 h-4" />
              AI Tools
            </button>
            <button
              onClick={() => setShowEditor(true)}
              className="px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/20 transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Tạo bài viết mới
            </button>
          </div>
        }
      />

      {/* Bulk Operations */}
      {selectedArticles.length > 0 && (
        <BulkOperations
          selectedCount={selectedArticles.length}
          selectedIds={selectedArticles}
          onClear={() => setSelectedArticles([])}
          onComplete={handleBulkComplete}
        />
      )}

      {/* Shared Filter Bar for all view modes */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm kiếm bài viết..."
            className="w-full pl-10 pr-4 py-2.5 bg-card border border-border/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        {/* Type Filter */}
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="px-4 py-2.5 bg-card border border-border/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 min-w-[180px]"
        >
          {articleTypes.map(type => (
            <option key={type.value} value={type.value}>{type.label}</option>
          ))}
        </select>

        {/* Status Filter */}
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-4 py-2.5 bg-card border border-border/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 min-w-[160px]"
        >
          {statusOptions.map(status => (
            <option key={status.value} value={status.value}>{status.label}</option>
          ))}
        </select>
      </div>

      {/* Article List */}
      {viewMode === 'table' && (
        <ArticleTableView
          articles={filteredArticles}
          onNavigate={onNavigate}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onSelectionChange={handleSelectionChange}
          selectedIds={selectedArticles}
          enableSelection={true}
        />
      )}
      {viewMode === 'list' && (
        <ArticleListView
          articles={filteredArticles}
          onNavigate={onNavigate}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onSelectionChange={handleSelectionChange}
          selectedIds={selectedArticles}
          showCategory={true}
          enableSelection={true}
          viewMode="list"
        />
      )}
      {viewMode === 'grid' && (
        <ArticleListView
          articles={filteredArticles}
          onNavigate={onNavigate}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onSelectionChange={handleSelectionChange}
          selectedIds={selectedArticles}
          showCategory={true}
          enableSelection={true}
          viewMode="grid"
        />
      )}
    </PageWrapper>
  );
}