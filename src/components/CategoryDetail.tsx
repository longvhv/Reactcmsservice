import { useState } from 'react';
import { ArrowLeft, Edit, Trash2, Save, X, Eye, FileText, Shield, BarChart3, Clock } from 'lucide-react';

interface CategoryDetailProps {
  categoryId: number;
  onNavigate: (page: any) => void;
}

export function CategoryDetail({ categoryId, onNavigate }: CategoryDetailProps) {
  const [activeTab, setActiveTab] = useState('info');
  const [isEditing, setIsEditing] = useState(false);

  const category = {
    id: categoryId,
    name: 'Công nghệ',
    slug: 'cong-nghe',
    description: 'Tin tức và bài viết về công nghệ, khoa học máy tính',
    parent: null,
    articleTypes: ['news', 'video', 'gallery'],
    active: true,
    order: 1,
    articleCount: 234,
    totalViews: 125000,
  };

  const articles = [
    { id: 1, title: 'Hướng dẫn sử dụng CMS Platform', status: 'published', views: 1234, date: '2024-12-26' },
    { id: 2, title: 'Video: AI Translation', status: 'published', views: 987, date: '2024-12-25' },
    { id: 3, title: 'Crawler tự động', status: 'review', views: 543, date: '2024-12-24' },
  ];

  const permissions = [
    { role: 'Editor', permissions: ['read', 'write', 'edit', 'delete'], members: 5 },
    { role: 'Contributor', permissions: ['read', 'write'], members: 12 },
  ];

  const history = [
    { id: 1, user: 'Admin', action: 'Cập nhật thông tin', date: '2024-12-26 14:20' },
    { id: 2, user: 'Admin', action: 'Thay đổi quyền truy cập', date: '2024-12-20 10:15' },
    { id: 3, user: 'Admin', action: 'Tạo danh mục', date: '2024-12-01 09:00' },
  ];

  const tabs = [
    { id: 'info', label: 'Thông tin chi tiết', icon: FileText },
    { id: 'articles', label: 'Danh sách bài viết', icon: FileText },
    { id: 'permissions', label: 'Phân quyền', icon: Shield },
    { id: 'stats', label: 'Thống kê truy cập', icon: BarChart3 },
    { id: 'history', label: 'Lịch sử chỉnh sửa', icon: Clock },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => onNavigate({ page: 'categories' })}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-gray-900 mb-1">{category.name}</h2>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <span>/{category.slug}</span>
              <span className={`px-2 py-1 rounded text-xs ${category.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                {category.active ? 'Hoạt động' : 'Không hoạt động'}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Edit className="w-4 h-4" />
            <span>{isEditing ? 'Hủy chỉnh sửa' : 'Chỉnh sửa'}</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors">
            <Trash2 className="w-4 h-4" />
            <span>Xóa</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="text-gray-600 text-sm">Bài viết</div>
              <div className="text-gray-900 text-xl">{category.articleCount}</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Eye className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <div className="text-gray-600 text-sm">Lượt xem</div>
              <div className="text-gray-900 text-xl">{category.totalViews.toLocaleString()}</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <div className="text-gray-600 text-sm">TB/Bài viết</div>
              <div className="text-gray-900 text-xl">{Math.round(category.totalViews / category.articleCount)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="border-b border-gray-200">
          <div className="flex">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3 border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-6">
          {/* Info Tab */}
          {activeTab === 'info' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 mb-2">Tên danh mục</label>
                  {isEditing ? (
                    <input
                      type="text"
                      defaultValue={category.name}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <div className="text-gray-900">{category.name}</div>
                  )}
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2">Slug (URL)</label>
                  {isEditing ? (
                    <input
                      type="text"
                      defaultValue={category.slug}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <div className="text-gray-900">{category.slug}</div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Mô tả</label>
                {isEditing ? (
                  <textarea
                    defaultValue={category.description}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <div className="text-gray-900">{category.description}</div>
                )}
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Loại bài viết được phép</label>
                {isEditing ? (
                  <div className="space-y-2">
                    {['news', 'video', 'gallery', 'legal', 'job'].map((type) => (
                      <div key={type} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id={`type-${type}`}
                          defaultChecked={category.articleTypes.includes(type)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <label htmlFor={`type-${type}`} className="text-gray-700 capitalize">
                          {type}
                        </label>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex gap-2">
                    {category.articleTypes.map((type) => (
                      <span key={type} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm capitalize">
                        {type}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="active-cat"
                  defaultChecked={category.active}
                  disabled={!isEditing}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="active-cat" className="text-gray-700">
                  Kích hoạt danh mục
                </label>
              </div>

              {isEditing && (
                <div className="flex items-center gap-3 pt-4">
                  <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <Save className="w-4 h-4" />
                    <span>Lưu thay đổi</span>
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <X className="w-4 h-4" />
                    <span>Hủy</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Articles Tab */}
          {activeTab === 'articles' && (
            <div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-gray-700">Tiêu đề</th>
                      <th className="px-6 py-3 text-left text-gray-700">Trạng thái</th>
                      <th className="px-6 py-3 text-left text-gray-700">Lượt xem</th>
                      <th className="px-6 py-3 text-left text-gray-700">Ngày</th>
                      <th className="px-6 py-3 text-right text-gray-700">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {articles.map((article) => (
                      <tr key={article.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-gray-900">{article.title}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded text-xs ${article.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                            {article.status === 'published' ? 'Đã xuất bản' : 'Chờ duyệt'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-700">{article.views}</td>
                        <td className="px-6 py-4 text-gray-700">{article.date}</td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => onNavigate({ page: 'article-detail', id: article.id })}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            Xem
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Permissions Tab */}
          {activeTab === 'permissions' && (
            <div className="space-y-4">
              {permissions.map((perm, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-gray-900">{perm.role}</h4>
                    <span className="text-sm text-gray-600">{perm.members} thành viên</span>
                  </div>
                  <div className="flex gap-2">
                    {perm.permissions.map((p) => (
                      <span key={p} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Stats Tab */}
          {activeTab === 'stats' && (
            <div className="space-y-6">
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">Biểu đồ thống kê truy cập</p>
                </div>
              </div>
            </div>
          )}

          {/* History Tab */}
          {activeTab === 'history' && (
            <div className="space-y-4">
              {history.map((h) => (
                <div key={h.id} className="border-l-4 border-blue-500 pl-4 py-3">
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-gray-900">{h.action}</div>
                    <div className="text-sm text-gray-600">{h.date}</div>
                  </div>
                  <div className="text-sm text-gray-600">{h.user}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
