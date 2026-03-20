'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, Filter, MoreVertical, Edit2, Trash2, Eye, Clock, TrendingUp, LayoutGrid, List, Table, Wand2, FileText, Video, Image as ImageIconComponent, Briefcase, Calendar, Mic, MapPin, Download, Zap, Columns, ChevronDown, Check } from 'lucide-react';
import { ArticleEditor } from './ArticleEditor';
import { ArticleTableView } from './ArticleTableView';
import { Article, ColumnConfig, DEFAULT_COLUMNS } from './ArticleTableView';
import { ArticleListView } from './ArticleListView';
import { PageWrapper } from './PageWrapper';
import { PageHeader } from './PageHeader';
import { BulkOperations } from './BulkOperations';
import { useLanguage } from '../contexts/LanguageContext';
import { useRouter } from '../contexts/RouterContext';
import { getArticles, deleteArticle, type Article as APIArticle } from '../services/api';

// Mock articles data
const MOCK_ARTICLES: Article[] = [
  {
    id: 1,
    title: 'AI Revolution: Xu hướng trí tuệ nhân tạo năm 2026',
    type: 'news',
    status: 'published',
    category: 'Công nghệ',
    author: 'Nguyễn Văn A',
    views: 5234,
    comments: 89,
    publishDate: '2026-02-20',
    updatedDate: '2026-02-22',
    featured: true,
    excerpt: 'Khám phá những xu hướng AI mới nhất đang định hình tương lai công nghệ.',
  },
  {
    id: 2,
    title: 'Cloud Infrastructure: Best Practices cho doanh nghiệp',
    type: 'news',
    status: 'published',
    category: 'Hạ tầng',
    author: 'Trần Thị B',
    views: 4876,
    comments: 72,
    publishDate: '2026-02-18',
    updatedDate: '2026-02-19',
    featured: false,
    excerpt: 'Hướng dẫn triển khai hạ tầng cloud hiệu quả và tối ưu chi phí.',
  },
  {
    id: 3,
    title: 'Blockchain & Web3: Cơ hội và thách thức',
    type: 'news',
    status: 'draft',
    category: 'Blockchain',
    author: 'Lê Văn C',
    views: 4123,
    comments: 65,
    publishDate: '2026-02-15',
    updatedDate: '2026-02-17',
    featured: false,
    excerpt: 'Phân tích sâu về tương lai của blockchain và web3 trong năm 2026.',
  },
  {
    id: 4,
    title: 'Machine Learning trong thực tế: Case studies từ Việt Nam',
    type: 'news',
    status: 'review',
    category: 'AI/ML',
    author: 'Phạm Thị D',
    views: 3987,
    comments: 58,
    publishDate: '2026-02-12',
    updatedDate: '2026-02-14',
    featured: true,
    excerpt: 'Những ứng dụng thực tế của ML tại các doanh nghiệp Việt Nam.',
  },
  {
    id: 5,
    title: 'DevOps: Automation và CI/CD Pipeline',
    type: 'news',
    status: 'published',
    category: 'DevOps',
    author: 'Hoàng Văn E',
    views: 3654,
    comments: 52,
    publishDate: '2026-02-10',
    updatedDate: '2026-02-11',
    featured: false,
    excerpt: 'Xây dựng pipeline CI/CD hiện đại với các công cụ mã nguồn mở.',
  },
  {
    id: 6,
    title: 'Hướng dẫn sử dụng Kubernetes cho người mới',
    type: 'video',
    status: 'published',
    category: 'Tutorial',
    author: 'Nguyễn Văn A',
    views: 8921,
    comments: 134,
    publishDate: '2026-02-08',
    updatedDate: '2026-02-09',
    featured: true,
    duration: '45:30',
    videoUrl: 'https://example.com/video1',
    excerpt: 'Video hướng dẫn chi tiết về Kubernetes từ cơ bản đến nâng cao.',
  },
  {
    id: 7,
    title: 'Bộ ảnh: Hội nghị Tech Summit Vietnam 2026',
    type: 'gallery',
    status: 'published',
    category: 'Sự kiện',
    author: 'Trần Thị B',
    views: 2345,
    comments: 28,
    publishDate: '2026-02-05',
    updatedDate: '2026-02-06',
    featured: false,
    imageCount: 48,
    excerpt: 'Hình ảnh nổi bật từ hội nghị công nghệ lớn nhất Việt Nam.',
  },
  {
    id: 8,
    title: 'Podcast: Tương lai của Remote Work',
    type: 'podcast',
    status: 'scheduled',
    category: 'Workplace',
    author: 'Lê Văn C',
    views: 1567,
    comments: 41,
    publishDate: '2026-03-01',
    updatedDate: '2026-02-25',
    featured: false,
    episode: 15,
    audioUrl: 'https://example.com/podcast1',
    excerpt: 'Thảo luận về xu hướng làm việc từ xa và hybrid workplace.',
  },
  {
    id: 9,
    title: 'Tuyển dụng: Senior Backend Developer',
    type: 'job',
    status: 'published',
    category: 'Tuyển dụng',
    author: 'HR Team',
    views: 892,
    comments: 5,
    publishDate: '2026-02-22',
    updatedDate: '2026-02-22',
    featured: false,
    position: 'Senior Backend Developer',
    salary: '2000-3500 USD',
    location: 'Hà Nội',
    deadline: '2026-03-15',
    excerpt: 'Tuyển dụng Senior Backend Developer với kinh nghiệm Go/Python.',
  },
  {
    id: 10,
    title: 'Cybersecurity: Bảo mật ứng dụng web trong 2026',
    type: 'news',
    status: 'archived',
    category: 'Bảo mật',
    author: 'Phạm Thị D',
    views: 6789,
    comments: 93,
    publishDate: '2026-01-15',
    updatedDate: '2026-02-01',
    featured: false,
    excerpt: 'Tổng hợp các phương pháp bảo mật web application mới nhất.',
  },
];

interface ArticleManagementProps {
  onNavigate?: (page: any) => void;
}

export function ArticleManagement({ onNavigate }: ArticleManagementProps = {}) {
  const { t } = useLanguage();
  const router = useRouter();
  const [showEditor, setShowEditor] = useState(false);
  const [editingArticleId, setEditingArticleId] = useState<number | undefined>(undefined);
  const [selectedArticles, setSelectedArticles] = useState<number[]>([]);
  const [viewMode, setViewMode] = useState<'table' | 'list' | 'grid'>('table');
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Column config state (lifted from ArticleTableView)
  const [tableColumns, setTableColumns] = useState<ColumnConfig[]>(() => {
    const saved = localStorage.getItem('articleTableColumns');
    return saved ? JSON.parse(saved) : DEFAULT_COLUMNS;
  });
  const [showColumnSelector, setShowColumnSelector] = useState(false);

  // Save column config to localStorage
  useEffect(() => {
    localStorage.setItem('articleTableColumns', JSON.stringify(tableColumns));
  }, [tableColumns]);

  const toggleColumn = (columnId: string) => {
    const column = tableColumns.find(c => c.id === columnId);
    if (column?.alwaysVisible) return;
    setTableColumns(tableColumns.map(col =>
      col.id === columnId ? { ...col, visible: !col.visible } : col
    ));
  };

  const resetColumns = () => {
    setTableColumns(DEFAULT_COLUMNS);
  };

  const visibleColumnCount = tableColumns.filter(c => c.visible).length;

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Load articles from mock data
  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    setLoading(true);
    try {
      const result = await getArticles();
      // Convert API articles to component format
      const formattedArticles: Article[] = result.articles.map((article: APIArticle) => ({
        id: article.id,
        title: article.title,
        type: article.type,
        status: article.status,
        category: article.category,
        author: article.author || article.authorName || 'Unknown',
        views: article.views,
        comments: article.comments || 0,
        publishDate: article.publishDate,
        updatedDate: article.updatedDate || article.publishDate,
        featured: article.featured || false,
        excerpt: article.excerpt,
        duration: article.duration,
        videoUrl: article.videoUrl,
      }));
      setArticles(formattedArticles);
    } catch (error) {
      console.error('Error loading articles:', error);
      setArticles(MOCK_ARTICLES);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id: number) => {
    setEditingArticleId(id);
    setShowEditor(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm(t('confirmations.deleteArticle'))) {
      try {
        const success = await deleteArticle(id);
        if (success) {
          setArticles(prev => prev.filter(a => a.id !== id));
          console.log('Article deleted successfully:', id);
        } else {
          throw new Error('Failed to delete article');
        }
      } catch (error) {
        console.error('Error deleting article:', error);
        alert(`Lỗi khi xóa bài viết: ${error}`);
      }
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
    { value: 'all', label: '-- Loại bài viết --' },
    { value: 'news', label: t('articleTypes.news') },
    { value: 'video', label: t('articleTypes.video') },
    { value: 'gallery', label: t('articleTypes.gallery') },
    { value: 'legal', label: t('articleTypes.legal') },
    { value: 'staff', label: t('articleTypes.staff') },
    { value: 'job', label: t('articleTypes.job') },
    { value: 'podcast', label: t('articleTypes.podcast') },
    { value: 'event', label: t('articleTypes.event') },
    { value: 'download', label: t('articleTypes.download') },
    { value: 'infographic', label: t('articleTypes.infographic') },
  ];

  const statusOptions = [
    { value: 'all', label: '-- Trạng thái --' },
    { value: 'published', label: t('status.published') },
    { value: 'draft', label: t('status.draft') },
    { value: 'review', label: t('status.review') },
    { value: 'scheduled', label: t('status.scheduled') },
    { value: 'archived', label: t('status.archived') },
  ];

  if (showEditor) {
    return (
      <ArticleEditor
        articleId={editingArticleId}
        onClose={() => {
          setShowEditor(false);
          setEditingArticleId(undefined);
        }}
        onSave={(data, saveAndContinue) => {
          console.log('Article saved:', data);
          // Reload articles list
          loadArticles();
          
          if (saveAndContinue) {
            // Keep editor open but reset for new article
            setEditingArticleId(undefined);
          } else {
            // Close editor
            setShowEditor(false);
            setEditingArticleId(undefined);
          }
        }}
      />
    );
  }

  return (
    <PageWrapper>
      <PageHeader
        title={t('articles.title')}
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
                title={t('articles.viewTable')}
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
                title={t('articles.viewList')}
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
                title={t('articles.viewGrid')}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={() => onNavigate ? onNavigate({ page: 'ai-tools' }) : router.push('/ai-tools')}
              className="px-4 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-lg hover:shadow-purple-500/20 transition-all flex items-center gap-2"
            >
              <Wand2 className="w-4 h-4" />
              {t('aiTools.title')}
            </button>
            <button
              onClick={() => setShowEditor(true)}
              className="px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/20 transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              {t('articles.createNew')}
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
            placeholder={t('placeholders.searchArticles')}
            className="w-full pl-12 pr-4 py-3 bg-muted/50 border-0 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-card transition-all"
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

        {/* Column Selector (only for table view) */}
        {viewMode === 'table' && (
          <div className="relative">
            <button
              onClick={() => setShowColumnSelector(!showColumnSelector)}
              className="flex items-center gap-2 px-3 py-2.5 bg-card border border-border/60 rounded-xl text-sm hover:bg-muted/40 transition-all duration-200 group"
            >
              <Columns className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
              <span className="text-muted-foreground group-hover:text-foreground">Cột hiển thị</span>
              <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${showColumnSelector ? 'rotate-180' : ''}`} />
            </button>

            {showColumnSelector && (
              <div>
                <div
                  className="fixed inset-0"
                  style={{ zIndex: 50 }}
                  onClick={() => setShowColumnSelector(false)}
                />
                <div className="absolute right-0 top-full mt-2 w-64 bg-card border border-border/60 rounded-xl shadow-2xl shadow-black/10 overflow-hidden" style={{ zIndex: 51 }}>
                  <div className="p-3 border-b border-border/60 bg-gradient-to-r from-blue-50 to-purple-50">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-foreground">Cột hiển thị</h4>
                      <button
                        onClick={resetColumns}
                        className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Đặt lại
                      </button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {visibleColumnCount}/{tableColumns.length} cột
                    </p>
                  </div>

                  <div className="p-2 max-h-96 overflow-y-auto">
                    {tableColumns.map(column => (
                      <button
                        key={column.id}
                        onClick={() => toggleColumn(column.id)}
                        disabled={column.alwaysVisible}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200 ${
                          column.alwaysVisible
                            ? 'opacity-50 cursor-not-allowed'
                            : 'hover:bg-muted/60 cursor-pointer'
                        }`}
                      >
                        <span className="text-sm text-foreground">{column.label}</span>
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                          column.visible
                            ? 'bg-blue-500 border-blue-500'
                            : 'border-border/60'
                        }`}>
                          {column.visible && <Check className="w-3.5 h-3.5 text-white" />}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Article List */}
      {loading ? (
        <div className="flex items-center justify-center p-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-muted-foreground">Đang tải danh sách bài viết...</p>
          </div>
        </div>
      ) : (
        <>
          {viewMode === 'table' && (
            <ArticleTableView
              articles={filteredArticles}
              onNavigate={onNavigate}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onSelectionChange={handleSelectionChange}
              selectedIds={selectedArticles}
              enableSelection={true}
              columns={tableColumns}
              onColumnsChange={setTableColumns}
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
        </>
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