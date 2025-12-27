import { useState } from 'react';
import { Plus, Search, Filter, Eye, Edit, Trash2, Globe, Calendar, User, MoreVertical, X, Wand2, Languages, CheckCircle } from 'lucide-react';
import { ArticleEditor } from './ArticleEditor';

interface ArticleManagementProps {
  onNavigate: (page: any) => void;
}

export function ArticleManagement({ onNavigate }: ArticleManagementProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedType, setSelectedType] = useState('all');
  const [selectedArticles, setSelectedArticles] = useState<number[]>([]);
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [editingArticleId, setEditingArticleId] = useState<number | undefined>(undefined);

  const articleTypes = [
    { value: 'all', label: 'Tất cả' },
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

  const articles = [
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
      imageCount: 45,
    },
    {
      id: 4,
      title: 'Quyết định 123/2024/QĐ-TTg về chuyển đổi số',
      type: 'legal',
      status: 'published',
      category: 'Văn bản pháp luật',
      author: 'Phạm Thị D',
      views: 876,
      comments: 23,
      publishDate: '2024-12-24 08:00',
      updatedDate: '2024-12-24 14:15',
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
      fileSize: '5.2 MB',
      fileType: 'PDF',
      downloadCount: 342,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'review': return 'bg-yellow-100 text-yellow-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'archived': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'published': return 'Đã xuất bản';
      case 'draft': return 'Nháp';
      case 'review': return 'Chờ duyệt';
      case 'scheduled': return 'Đã lên lịch';
      case 'archived': return 'Đã lưu trữ';
      default: return status;
    }
  };

  const getTypeLabel = (type: string) => {
    const typeObj = articleTypes.find(t => t.value === type);
    return typeObj?.label || type;
  };

  const toggleSelectArticle = (id: number) => {
    setSelectedArticles(prev =>
      prev.includes(id) ? prev.filter(aid => aid !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedArticles.length === articles.length) {
      setSelectedArticles([]);
    } else {
      setSelectedArticles(articles.map(a => a.id));
    }
  };

  return (
    <div className="space-y-6 animate-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-foreground mb-1">Quản lý bài viết</h2>
          <p className="text-muted-foreground">Quản lý và tổ chức nội dung</p>
        </div>
        <button
          onClick={() => {
            setEditingArticleId(undefined);
            setShowEditor(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-200"
        >
          <Plus className="w-5 h-5" />
          <span>Tạo bài viết</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-64">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Tìm kiếm bài viết..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {articleTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>

          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="all">Tất cả trạng thái</option>
            <option value="published">Đã xuất bản</option>
            <option value="draft">Nháp</option>
            <option value="review">Chờ duyệt</option>
          </select>

          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Filter className="w-5 h-5" />
            <span>Lọc nâng cao</span>
          </button>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedArticles.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="text-blue-900">
              Đã chọn {selectedArticles.length} bài viết
            </div>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1 bg-white border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-50 transition-colors text-sm">
                Xuất bản
              </button>
              <button className="px-3 py-1 bg-white border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-50 transition-colors text-sm">
                Lưu trữ
              </button>
              <button className="px-3 py-1 bg-white border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors text-sm">
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Articles Table */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedArticles.length === articles.length}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-gray-700">Tiêu đề</th>
                <th className="px-6 py-3 text-left text-gray-700">Loại</th>
                <th className="px-6 py-3 text-left text-gray-700">Danh mục</th>
                <th className="px-6 py-3 text-left text-gray-700">Tác giả</th>
                <th className="px-6 py-3 text-left text-gray-700">Trạng thái</th>
                <th className="px-6 py-3 text-left text-gray-700">Lượt xem</th>
                <th className="px-6 py-3 text-left text-gray-700">Ngày xuất bản</th>
                <th className="px-6 py-3 text-right text-gray-700">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {articles.map((article) => (
                <tr key={article.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedArticles.includes(article.id)}
                      onChange={() => toggleSelectArticle(article.id)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => onNavigate({ page: 'article-detail', id: article.id })}
                      className="text-gray-900 hover:text-blue-600 text-left"
                    >
                      {article.title}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                      {getTypeLabel(article.type)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-700">{article.category}</td>
                  <td className="px-6 py-4 text-gray-700">{article.author}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs ${getStatusColor(article.status)}`}>
                      {getStatusLabel(article.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4 text-gray-400" />
                        <span>{article.views}</span>
                      </div>
                      {article.comments > 0 && (
                        <div className="flex items-center gap-1 text-gray-500">
                          ({article.comments})
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-700 text-sm">
                    {article.publishDate || '-'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onNavigate({ page: 'article-detail', id: article.id })}
                        className="p-1 hover:bg-gray-200 rounded"
                        title="Xem"
                      >
                        <Eye className="w-4 h-4 text-gray-600" />
                      </button>
                      <button className="p-1 hover:bg-blue-100 rounded" title="Sửa">
                        <Edit className="w-4 h-4 text-blue-600" />
                      </button>
                      <button className="p-1 hover:bg-green-100 rounded" title="Xem trên web">
                        <Globe className="w-4 h-4 text-green-600" />
                      </button>
                      <button className="p-1 hover:bg-gray-200 rounded" title="Thêm">
                        <MoreVertical className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Hiển thị 1-{articles.length} trong tổng số 234 bài viết
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
              Trước
            </button>
            <button className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm">1</button>
            <button className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">2</button>
            <button className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">3</button>
            <button className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
              Sau
            </button>
          </div>
        </div>
      </div>

      {/* Create/Edit Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-gray-900">Tạo bài viết mới</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2">Loại bài viết *</label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    {articleTypes.filter(t => t.value !== 'all').map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2">Danh mục *</label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Công nghệ</option>
                    <option>Kinh tế</option>
                    <option>Xã hội</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2">Tiêu đề *</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Nhập tiêu đề bài viết..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={() => setShowAIPanel(!showAIPanel)}
                    className="flex items-center gap-2 px-4 py-2 border border-purple-300 text-purple-700 rounded-lg hover:bg-purple-50 transition-colors"
                  >
                    <Wand2 className="w-4 h-4" />
                    <span>AI</span>
                  </button>
                </div>
              </div>

              {/* AI Panel */}
              {showAIPanel && (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <h4 className="text-gray-900 mb-3">Tính năng AI</h4>
                  <div className="grid grid-cols-3 gap-3">
                    <button className="flex items-center gap-2 px-3 py-2 bg-white border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors text-sm">
                      <CheckCircle className="w-4 h-4 text-purple-600" />
                      <span>Kiểm tra chính tả</span>
                    </button>
                    <button className="flex items-center gap-2 px-3 py-2 bg-white border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors text-sm">
                      <Languages className="w-4 h-4 text-purple-600" />
                      <span>Dịch bài viết</span>
                    </button>
                    <button className="flex items-center gap-2 px-3 py-2 bg-white border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors text-sm">
                      <Wand2 className="w-4 h-4 text-purple-600" />
                      <span>Cải thiện nội dung</span>
                    </button>
                    <button className="flex items-center gap-2 px-3 py-2 bg-white border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors text-sm">
                      <CheckCircle className="w-4 h-4 text-purple-600" />
                      <span>Phát hiện vi phạm</span>
                    </button>
                    <button className="flex items-center gap-2 px-3 py-2 bg-white border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors text-sm">
                      <Wand2 className="w-4 h-4 text-purple-600" />
                      <span>Tạo tóm tắt</span>
                    </button>
                    <button className="flex items-center gap-2 px-3 py-2 bg-white border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors text-sm">
                      <Wand2 className="w-4 h-4 text-purple-600" />
                      <span>Gợi ý tags</span>
                    </button>
                  </div>
                </div>
              )}
              
              <div>
                <label className="block text-gray-700 mb-2">Mô tả ngắn</label>
                <textarea
                  placeholder="Nhập mô tả ngắn..."
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2">Nội dung *</label>
                <div className="border border-gray-300 rounded-lg">
                  <div className="border-b border-gray-300 p-2 flex items-center gap-2 bg-gray-50">
                    <button className="px-2 py-1 hover:bg-gray-200 rounded text-sm">B</button>
                    <button className="px-2 py-1 hover:bg-gray-200 rounded text-sm italic">I</button>
                    <button className="px-2 py-1 hover:bg-gray-200 rounded text-sm underline">U</button>
                    <div className="w-px h-4 bg-gray-300" />
                    <button className="px-2 py-1 hover:bg-gray-200 rounded text-sm">Link</button>
                    <button className="px-2 py-1 hover:bg-gray-200 rounded text-sm">Image</button>
                  </div>
                  <textarea
                    placeholder="Nhập nội dung bài viết..."
                    rows={10}
                    className="w-full px-4 py-2 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2">Tags</label>
                  <input
                    type="text"
                    placeholder="Nhập tags, ngăn cách bởi dấu phẩy"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2">Lên lịch xuất bản</label>
                  <input
                    type="datetime-local"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="featured"
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="featured" className="text-gray-700">
                    Bài viết nổi bật
                  </label>
                </div>
                
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="comments"
                    defaultChecked
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="comments" className="text-gray-700">
                    Cho phép bình luận
                  </label>
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200 flex items-center gap-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
              <button className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                Lưu nháp
              </button>
              <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Gửi duyệt
              </button>
              <button className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                Xuất bản
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Article Editor - Fullscreen */}
      {showEditor && (
        <ArticleEditor
          articleId={editingArticleId}
          onClose={() => setShowEditor(false)}
          onSave={(data) => {
            console.log('Saved:', data);
            setShowEditor(false);
          }}
        />
      )}
    </div>
  );
}