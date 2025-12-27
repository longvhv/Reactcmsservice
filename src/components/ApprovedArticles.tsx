import React, { useState } from 'react';
import {
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Globe,
  Calendar,
  User,
  CheckCircle,
  XCircle,
  Send,
  Download,
  FileText,
  TrendingUp,
  Clock
} from 'lucide-react';

interface ApprovedArticle {
  id: string;
  title: string;
  url: string;
  sourceName: string;
  sourceId: string;
  content: string;
  excerpt: string;
  author?: string;
  publishedDate: string;
  collectedAt: string;
  approvedAt: string;
  approvedBy: string;
  status: 'approved' | 'published' | 'archived';
  imageUrl?: string;
  category?: string;
  publishStatus?: 'draft' | 'published' | 'scheduled';
}

const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
  console.log(`[${type.toUpperCase()}] ${message}`);
  alert(`${type.toUpperCase()}: ${message}`);
};

export function ApprovedArticles() {
  const [articles, setArticles] = useState<ApprovedArticle[]>([
    {
      id: '1',
      title: 'Blockchain: Tương lai của tài chính số',
      url: 'https://dantri.com/article-3',
      sourceName: 'Dân Trí - Tin tức',
      sourceId: '3',
      content: 'Nội dung về blockchain...',
      excerpt: 'Công nghệ blockchain không chỉ dừng lại ở tiền điện tử mà còn mở ra nhiều ứng dụng trong tài chính và quản lý chuỗi cung ứng...',
      author: 'Lê Văn C',
      publishedDate: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      collectedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
      approvedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      approvedBy: 'Admin',
      status: 'published',
      category: 'Tài chính',
      publishStatus: 'published',
    },
    {
      id: '2',
      title: 'Trí tuệ nhân tạo trong y tế: Cách mạng chẩn đoán bệnh',
      url: 'https://vnexpress.net/article-7',
      sourceName: 'VnExpress Tin mới nhất',
      sourceId: '1',
      content: 'Nội dung về AI trong y tế...',
      excerpt: 'AI đang giúp các bác sĩ chẩn đoán bệnh chính xác hơn và nhanh chóng hơn, đặc biệt trong việc phát hiện ung thư sớm...',
      author: 'Nguyễn Thị G',
      publishedDate: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
      collectedAt: new Date(Date.now() - 7 * 60 * 60 * 1000).toISOString(),
      approvedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      approvedBy: 'Editor 1',
      status: 'approved',
      category: 'Y tế',
      publishStatus: 'draft',
    },
    {
      id: '3',
      title: 'Metaverse: Thế giới ảo hay tương lai thực?',
      url: 'https://tuoitre.vn/article-8',
      sourceName: 'Tuổi Trẻ Online RSS',
      sourceId: '2',
      content: 'Nội dung về metaverse...',
      excerpt: 'Metaverse đang dần trở thành hiện thực với sự đầu tư mạnh mẽ từ các công ty công nghệ lớn...',
      author: 'Trần Văn H',
      publishedDate: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
      collectedAt: new Date(Date.now() - 9 * 60 * 60 * 1000).toISOString(),
      approvedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
      approvedBy: 'Editor 2',
      status: 'published',
      category: 'Công nghệ',
      publishStatus: 'published',
    },
    {
      id: '4',
      title: 'Green Tech: Công nghệ vì môi trường bền vững',
      url: 'https://thanhnien.vn/article-9',
      sourceName: 'Thanh Niên Online',
      sourceId: '5',
      content: 'Nội dung về green tech...',
      excerpt: 'Các công nghệ xanh đang giúp giảm thiểu tác động đến môi trường và tạo ra năng lượng sạch...',
      author: 'Phạm Thị I',
      publishedDate: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      collectedAt: new Date(Date.now() - 11 * 60 * 60 * 1000).toISOString(),
      approvedAt: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
      approvedBy: 'Admin',
      status: 'approved',
      category: 'Môi trường',
      publishStatus: 'draft',
    },
    {
      id: '5',
      title: 'Quantum Computing: Sức mạnh tính toán vượt trội',
      url: 'https://vnexpress.net/article-10',
      sourceName: 'VnExpress Tin mới nhất',
      sourceId: '1',
      content: 'Nội dung về quantum computing...',
      excerpt: 'Máy tính lượng tử hứa hẹn giải quyết các bài toán phức tạp mà máy tính thông thường không thể làm được...',
      author: 'Hoàng Văn K',
      publishedDate: new Date(Date.now() - 14 * 60 * 60 * 1000).toISOString(),
      collectedAt: new Date(Date.now() - 13 * 60 * 60 * 1000).toISOString(),
      approvedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      approvedBy: 'Editor 1',
      status: 'approved',
      category: 'Công nghệ',
      publishStatus: 'scheduled',
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [selectedArticles, setSelectedArticles] = useState<string[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [previewArticle, setPreviewArticle] = useState<ApprovedArticle | null>(null);

  const handlePublish = (id: string) => {
    if (!confirm('Xuất bản bài viết này lên CMS?')) return;
    setArticles(prev =>
      prev.map(a => (a.id === id ? { ...a, status: 'published' as const, publishStatus: 'published' as const } : a))
    );
    showNotification('Bài viết đã được xuất bản!', 'success');
  };

  const handleArchive = (id: string) => {
    if (!confirm('Lưu trữ bài viết này?')) return;
    setArticles(prev =>
      prev.map(a => (a.id === id ? { ...a, status: 'archived' as const } : a))
    );
    showNotification('Bài viết đã được lưu trữ', 'info');
  };

  const handleDelete = (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa bài viết này?')) return;
    setArticles(prev => prev.filter(a => a.id !== id));
    showNotification('Bài viết đã được xóa', 'success');
  };

  const handleBulkPublish = () => {
    if (!confirm(`Xuất bản ${selectedArticles.length} bài viết đã chọn?`)) return;
    setArticles(prev =>
      prev.map(a => (selectedArticles.includes(a.id) ? { ...a, status: 'published' as const, publishStatus: 'published' as const } : a))
    );
    setSelectedArticles([]);
    showNotification(`Đã xuất bản ${selectedArticles.length} bài viết`, 'success');
  };

  const handleBulkDelete = () => {
    if (!confirm(`Xóa ${selectedArticles.length} bài viết đã chọn?`)) return;
    setArticles(prev => prev.filter(a => !selectedArticles.includes(a.id)));
    setSelectedArticles([]);
    showNotification(`Đã xóa ${selectedArticles.length} bài viết`, 'success');
  };

  const toggleSelectArticle = (id: string) => {
    setSelectedArticles(prev =>
      prev.includes(id) ? prev.filter(aid => aid !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedArticles.length === filteredArticles.length) {
      setSelectedArticles([]);
    } else {
      setSelectedArticles(filteredArticles.map(a => a.id));
    }
  };

  const filteredArticles = articles.filter(article => {
    if (searchTerm && !article.title.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    if (filterStatus !== 'all' && article.publishStatus !== filterStatus) {
      return false;
    }
    if (filterCategory !== 'all' && article.category !== filterCategory) {
      return false;
    }
    return true;
  });

  const getPublishStatusConfig = (status: string) => {
    switch (status) {
      case 'draft':
        return { color: 'text-gray-600', bg: 'bg-gray-100 dark:bg-gray-900/30', label: 'Nháp' };
      case 'published':
        return { color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-900/30', label: 'Đã xuất bản' };
      case 'scheduled':
        return { color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/30', label: 'Đã lên lịch' };
      default:
        return { color: 'text-gray-600', bg: 'bg-gray-100 dark:bg-gray-900/30', label: status };
    }
  };

  const formatDateTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const categories = Array.from(new Set(articles.map(a => a.category).filter(Boolean)));

  const approvedCount = articles.filter(a => a.publishStatus === 'draft').length;
  const publishedCount = articles.filter(a => a.publishStatus === 'published').length;
  const scheduledCount = articles.filter(a => a.publishStatus === 'scheduled').length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            Bài Viết Đã Duyệt
          </h1>
          <p className="text-muted-foreground mt-1">
            Quản lý bài viết đã được phê duyệt • Loại: Tin tức
          </p>
        </div>

        {selectedArticles.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleBulkPublish}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
            >
              <Send className="w-5 h-5" />
              Xuất bản ({selectedArticles.length})
            </button>
            <button
              onClick={handleBulkDelete}
              className="p-2 hover:bg-secondary rounded-lg transition-colors"
            >
              <Trash2 className="w-5 h-5 text-red-600" />
            </button>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card rounded-xl p-6 border border-border">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Tổng bài viết</p>
            <FileText className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-3xl font-bold">{articles.length}</p>
          <p className="text-xs text-muted-foreground mt-1">
            Đã được duyệt
          </p>
        </div>

        <div className="bg-card rounded-xl p-6 border border-border">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Chờ xuất bản</p>
            <Clock className="w-5 h-5 text-gray-600" />
          </div>
          <p className="text-3xl font-bold">{approvedCount}</p>
          <p className="text-xs text-muted-foreground mt-1">
            Nháp
          </p>
        </div>

        <div className="bg-card rounded-xl p-6 border border-border">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Đã xuất bản</p>
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-3xl font-bold">{publishedCount}</p>
          <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            Đang hiển thị
          </p>
        </div>

        <div className="bg-card rounded-xl p-6 border border-border">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Đã lên lịch</p>
            <Calendar className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-3xl font-bold">{scheduledCount}</p>
          <p className="text-xs text-muted-foreground mt-1">
            Sẽ xuất bản
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-card rounded-xl border border-border p-4">
        <div className="flex flex-wrap items-center gap-4">
          {/* Search */}
          <div className="flex-1 min-w-[250px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm kiếm bài viết..."
                className="w-full pl-10 pr-4 py-2 bg-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20"
              />
            </div>
          </div>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 bg-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="draft">Nháp</option>
            <option value="published">Đã xuất bản</option>
            <option value="scheduled">Đã lên lịch</option>
          </select>

          {/* Category Filter */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 bg-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20"
          >
            <option value="all">Tất cả danh mục</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          {/* Export */}
          <button
            onClick={() => showNotification('Export feature coming soon!', 'info')}
            className="flex items-center gap-2 px-4 py-2 bg-secondary border border-border rounded-xl hover:bg-secondary/80 transition-colors"
          >
            <Download className="w-5 h-5" />
            Xuất file
          </button>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 gap-4">
        {filteredArticles.length === 0 ? (
          <div className="bg-card rounded-xl border border-border p-12 text-center">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Không tìm thấy bài viết nào</p>
          </div>
        ) : (
          filteredArticles.map(article => {
            const statusConfig = getPublishStatusConfig(article.publishStatus || 'draft');

            return (
              <div
                key={article.id}
                className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition-all group"
              >
                <div className="flex items-start gap-4">
                  {/* Checkbox */}
                  <input
                    type="checkbox"
                    checked={selectedArticles.includes(article.id)}
                    onChange={() => toggleSelectArticle(article.id)}
                    className="mt-1 rounded"
                  />

                  {/* Content */}
                  <div className="flex-1">
                    {/* Title & Status */}
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-semibold flex-1 mr-4">{article.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.color} whitespace-nowrap`}>
                        {statusConfig.label}
                      </span>
                    </div>

                    {/* Excerpt */}
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {article.excerpt}
                    </p>

                    {/* Meta Info */}
                    <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground mb-2">
                      <div className="flex items-center gap-1">
                        <Globe className="w-4 h-4" />
                        <span className="font-medium text-green-600">{article.sourceName}</span>
                      </div>
                      {article.author && (
                        <>
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            <span>{article.author}</span>
                          </div>
                        </>
                      )}
                      {article.category && (
                        <>
                          <span>•</span>
                          <span className="px-2 py-0.5 bg-secondary rounded-full">{article.category}</span>
                        </>
                      )}
                    </div>

                    {/* Dates */}
                    <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>Xuất bản: {formatDateTime(article.publishedDate)}</span>
                      </div>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" />
                        <span>Duyệt: {formatDateTime(article.approvedAt)}</span>
                      </div>
                      <span>•</span>
                      <span>Người duyệt: {article.approvedBy}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => {
                        setPreviewArticle(article);
                        setShowPreview(true);
                      }}
                      className="p-2 hover:bg-secondary rounded-lg transition-colors"
                      title="Xem trước"
                    >
                      <Eye className="w-4 h-4 text-blue-600" />
                    </button>

                    {article.publishStatus !== 'published' && (
                      <button
                        onClick={() => handlePublish(article.id)}
                        className="p-2 hover:bg-secondary rounded-lg transition-colors"
                        title="Xuất bản"
                      >
                        <Send className="w-4 h-4 text-green-600" />
                      </button>
                    )}

                    <button
                      onClick={() => showNotification('Edit feature coming soon!', 'info')}
                      className="p-2 hover:bg-secondary rounded-lg transition-colors"
                      title="Sửa"
                    >
                      <Edit className="w-4 h-4 text-blue-600" />
                    </button>

                    <button
                      onClick={() => handleDelete(article.id)}
                      className="p-2 hover:bg-secondary rounded-lg transition-colors"
                      title="Xóa"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Preview Modal */}
      {showPreview && previewArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-4xl bg-card rounded-2xl shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-2">{previewArticle.title}</h2>
                <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                  <span className="font-medium text-green-600">{previewArticle.sourceName}</span>
                  {previewArticle.author && (
                    <>
                      <span>•</span>
                      <span>{previewArticle.author}</span>
                    </>
                  )}
                  <span>•</span>
                  <span>{formatDateTime(previewArticle.publishedDate)}</span>
                  <span>•</span>
                  <span>Duyệt bởi: {previewArticle.approvedBy}</span>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowPreview(false);
                  setPreviewArticle(null);
                }}
                className="p-2 hover:bg-secondary rounded-lg transition-colors"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="prose prose-sm max-w-none dark:prose-invert">
              <p className="text-lg text-muted-foreground mb-4">{previewArticle.excerpt}</p>
              <div className="text-sm whitespace-pre-wrap">{previewArticle.content}</div>
            </div>

            <div className="flex items-center gap-3 mt-6 pt-6 border-t border-border">
              <a
                href={previewArticle.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-secondary border border-border rounded-xl hover:bg-secondary/80 transition-colors"
              >
                <Globe className="w-4 h-4" />
                Xem bài gốc
              </a>

              {previewArticle.publishStatus !== 'published' && (
                <button
                  onClick={() => {
                    handlePublish(previewArticle.id);
                    setShowPreview(false);
                    setPreviewArticle(null);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
                >
                  <Send className="w-4 h-4" />
                  Xuất bản lên CMS
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}