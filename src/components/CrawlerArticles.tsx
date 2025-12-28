import React, { useState } from 'react';
import {
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Globe,
  Calendar,
  User,
  MoreVertical,
  Download,
  Trash2,
  ThumbsUp,
  ThumbsDown,
  AlertCircle
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface CrawlerArticle {
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
  status: 'pending' | 'approved' | 'rejected';
  imageUrl?: string;
  category?: string;
}

const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
  console.log(`[${type.toUpperCase()}] ${message}`);
  alert(`${type.toUpperCase()}: ${message}`);
};

export function CrawlerArticles() {
  const [articles, setArticles] = useState<CrawlerArticle[]>([
    {
      id: '1',
      title: 'Công nghệ AI đang thay đổi cách chúng ta làm việc như thế nào',
      url: 'https://vnexpress.net/article-1',
      sourceName: 'VnExpress Tin mới nhất',
      sourceId: '1',
      content: 'Nội dung đầy đủ bài viết về AI...',
      excerpt: 'Trí tuệ nhân tạo đang có tác động sâu rộng đến mọi lĩnh vực công việc, từ tự động hóa đến ra quyết định thông minh...',
      author: 'Nguyễn Văn A',
      publishedDate: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      collectedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      status: 'pending',
      category: 'Công nghệ',
    },
    {
      id: '2',
      title: 'Xu hướng phát triển phần mềm năm 2025',
      url: 'https://tuoitre.vn/article-2',
      sourceName: 'Tuổi Trẻ Online RSS',
      sourceId: '2',
      content: 'Nội dung bài viết về xu hướng 2025...',
      excerpt: 'Năm 2025 sẽ chứng kiến sự bùng nổ của các công nghệ như AI, cloud computing, và low-code platforms...',
      author: 'Trần Thị B',
      publishedDate: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
      collectedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      status: 'pending',
      category: 'Công nghệ',
    },
    {
      id: '3',
      title: 'Blockchain: Tương lai của tài chính số',
      url: 'https://dantri.com/article-3',
      sourceName: 'Dân Trí - Tin tức',
      sourceId: '3',
      content: 'Nội dung về blockchain...',
      excerpt: 'Công nghệ blockchain không chỉ dừng lại ở tiền điện tử mà còn mở ra nhiều ứng dụng trong tài chính và quản lý chuỗi cung ứng...',
      author: 'Lê Văn C',
      publishedDate: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      collectedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
      status: 'approved',
      category: 'Tài chính',
    },
    {
      id: '4',
      title: 'An ninh mạng: Thách thức lớn trong kỷ nguyên số',
      url: 'https://thanhnien.vn/article-4',
      sourceName: 'Thanh Niên Online',
      sourceId: '5',
      content: 'Nội dung về an ninh mạng...',
      excerpt: 'Các cuộc tấn công mạng ngày càng tinh vi, đòi hỏi doanh nghiệp phải đầu tư mạnh vào bảo mật...',
      author: 'Phạm Thị D',
      publishedDate: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      collectedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      status: 'pending',
      category: 'Bảo mật',
    },
    {
      id: '5',
      title: '5G và Internet of Things: Kết nối thế giới thông minh',
      url: 'https://vnexpress.net/article-5',
      sourceName: 'VnExpress Tin mới nhất',
      sourceId: '1',
      content: 'Nội dung về 5G và IoT...',
      excerpt: 'Mạng 5G đang tạo nền tảng cho sự phát triển bùng nổ của các thiết bị IoT, mở ra kỷ nguyên thành phố thông minh...',
      author: 'Hoàng Văn E',
      publishedDate: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      collectedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      status: 'rejected',
      category: 'Công nghệ',
    },
    {
      id: '6',
      title: 'Cloud Computing: Giải pháp tối ưu cho doanh nghiệp',
      url: 'https://tuoitre.vn/article-6',
      sourceName: 'Tuổi Trẻ Online RSS',
      sourceId: '2',
      content: 'Nội dung về cloud computing...',
      excerpt: 'Điện toán đám mây giúp doanh nghiệp giảm chi phí hạ tầng và tăng tính linh hoạt trong vận hành...',
      author: 'Đỗ Thị F',
      publishedDate: new Date(Date.now() - 7 * 60 * 60 * 1000).toISOString(),
      collectedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      status: 'pending',
      category: 'Công nghệ',
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterSource, setFilterSource] = useState<string>('all');
  const [selectedArticles, setSelectedArticles] = useState<string[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [previewArticle, setPreviewArticle] = useState<CrawlerArticle | null>(null);

  const handleApprove = (id: string) => {
    setArticles(prev =>
      prev.map(a => (a.id === id ? { ...a, status: 'approved' as const } : a))
    );
    showNotification('Bài viết đã được duyệt!', 'success');
  };

  const handleReject = (id: string) => {
    if (!confirm('Bạn có chắc muốn từ chối bài viết này?')) return;
    setArticles(prev =>
      prev.map(a => (a.id === id ? { ...a, status: 'rejected' as const } : a))
    );
    showNotification('Bài viết đã bị từ chối', 'info');
  };

  const handleDelete = (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa bài viết này?')) return;
    setArticles(prev => prev.filter(a => a.id !== id));
    showNotification('Bài viết đã được xóa', 'success');
  };

  const handleBulkApprove = () => {
    if (!confirm(`Duyệt ${selectedArticles.length} bài viết đã chọn?`)) return;
    setArticles(prev =>
      prev.map(a => (selectedArticles.includes(a.id) ? { ...a, status: 'approved' as const } : a))
    );
    setSelectedArticles([]);
    showNotification(`Đã duyệt ${selectedArticles.length} bài viết`, 'success');
  };

  const handleBulkReject = () => {
    if (!confirm(`Từ chối ${selectedArticles.length} bài viết đã chọn?`)) return;
    setArticles(prev =>
      prev.map(a => (selectedArticles.includes(a.id) ? { ...a, status: 'rejected' as const } : a))
    );
    setSelectedArticles([]);
    showNotification(`Đã từ chối ${selectedArticles.length} bài viết`, 'info');
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
    if (filterStatus !== 'all' && article.status !== filterStatus) {
      return false;
    }
    if (filterSource !== 'all' && article.sourceId !== filterSource) {
      return false;
    }
    return true;
  });

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'pending':
        return { color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/30', label: 'Chờ duyệt' };
      case 'approved':
        return { color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-900/30', label: 'Đã duyệt' };
      case 'rejected':
        return { color: 'text-red-600', bg: 'bg-red-100 dark:bg-red-900/30', label: 'Đã từ chối' };
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

  // Fix: Properly deduplicate sources by sourceId
  const sourcesMap = new Map<string, { id: string; name: string }>();
  articles.forEach(a => {
    if (!sourcesMap.has(a.sourceId)) {
      sourcesMap.set(a.sourceId, { id: a.sourceId, name: a.sourceName });
    }
  });
  const sources = Array.from(sourcesMap.values());

  const pendingCount = articles.filter(a => a.status === 'pending').length;
  const approvedCount = articles.filter(a => a.status === 'approved').length;
  const rejectedCount = articles.filter(a => a.status === 'rejected').length;

  const { t } = useLanguage();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Bài Viết Đã Thu Thập
          </h1>
          <p className="text-muted-foreground mt-1">
            Quản lý bài viết từ các nguồn tự động • Chỉ loại: Tin tức
          </p>
        </div>

        {selectedArticles.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleBulkApprove}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
            >
              <CheckCircle className="w-5 h-5" />
              Duyệt ({selectedArticles.length})
            </button>
            <button
              onClick={handleBulkReject}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
            >
              <XCircle className="w-5 h-5" />
              Từ chối ({selectedArticles.length})
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
            <Globe className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-3xl font-bold">{articles.length}</p>
          <p className="text-xs text-muted-foreground mt-1">
            Từ {sources.length} nguồn
          </p>
        </div>

        <div className="bg-card rounded-xl p-6 border border-border">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Chờ duyệt</p>
            <Clock className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-3xl font-bold">{pendingCount}</p>
          <p className="text-xs text-muted-foreground mt-1">
            Cần xử lý
          </p>
        </div>

        <div className="bg-card rounded-xl p-6 border border-border">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Đã duyệt</p>
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-3xl font-bold">{approvedCount}</p>
          <p className="text-xs text-green-600 mt-1">
            Sẵn sàng xuất bản
          </p>
        </div>

        <div className="bg-card rounded-xl p-6 border border-border">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Đã từ chối</p>
            <XCircle className="w-5 h-5 text-red-600" />
          </div>
          <p className="text-3xl font-bold">{rejectedCount}</p>
          <p className="text-xs text-muted-foreground mt-1">
            Không phù hợp
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
                placeholder={t('placeholders.searchArticles')}
                className="w-full pl-10 pr-4 py-2 bg-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 bg-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="pending">Chờ duyệt</option>
            <option value="approved">Đã duyệt</option>
            <option value="rejected">Đã từ chối</option>
          </select>

          {/* Source Filter */}
          <select
            value={filterSource}
            onChange={(e) => setFilterSource(e.target.value)}
            className="px-4 py-2 bg-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="all">Tất cả nguồn</option>
            {sources.map(source => (
              <option key={source.id} value={source.id}>{source.name}</option>
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
            <Globe className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Không tìm thấy bài viết nào</p>
          </div>
        ) : (
          filteredArticles.map(article => {
            const statusConfig = getStatusConfig(article.status);

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
                    <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground mb-3">
                      <div className="flex items-center gap-1">
                        <Globe className="w-4 h-4" />
                        <span className="font-medium text-blue-600">{article.sourceName}</span>
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
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>Xuất bản: {formatDateTime(article.publishedDate)}</span>
                      </div>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>Thu thập: {formatDateTime(article.collectedAt)}</span>
                      </div>
                    </div>

                    {/* URL */}
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:underline truncate block"
                    >
                      {article.url}
                    </a>
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

                    {article.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleApprove(article.id)}
                          className="p-2 hover:bg-secondary rounded-lg transition-colors"
                          title="Duyệt"
                        >
                          <ThumbsUp className="w-4 h-4 text-green-600" />
                        </button>

                        <button
                          onClick={() => handleReject(article.id)}
                          className="p-2 hover:bg-secondary rounded-lg transition-colors"
                          title="Từ chối"
                        >
                          <ThumbsDown className="w-4 h-4 text-red-600" />
                        </button>
                      </>
                    )}

                    <button
                      onClick={() => handleDelete(article.id)}
                      className="p-2 hover:bg-secondary rounded-lg transition-colors"
                      title={t('tooltips.delete')}
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
                  <span className="font-medium text-blue-600">{previewArticle.sourceName}</span>
                  {previewArticle.author && (
                    <>
                      <span>•</span>
                      <span>{previewArticle.author}</span>
                    </>
                  )}
                  <span>•</span>
                  <span>{formatDateTime(previewArticle.publishedDate)}</span>
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

              {previewArticle.status === 'pending' && (
                <>
                  <button
                    onClick={() => {
                      handleApprove(previewArticle.id);
                      setShowPreview(false);
                      setPreviewArticle(null);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Duyệt bài viết
                  </button>

                  <button
                    onClick={() => {
                      handleReject(previewArticle.id);
                      setShowPreview(false);
                      setPreviewArticle(null);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
                  >
                    <XCircle className="w-4 h-4" />
                    Từ chối
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}