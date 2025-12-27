import { useState } from 'react';
import { Plus, Search, Calendar, List, Grid, X, Save, Wand2, Languages, CheckCircle, Image as ImageIcon } from 'lucide-react';

export function EventSeries() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const eventSeries = [
    {
      id: 1,
      name: 'Tech Summit 2024',
      description: 'Chuỗi sự kiện công nghệ lớn nhất năm',
      thumbnail: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
      articleCount: 12,
      totalViews: 45000,
      startDate: '2024-01-15',
      endDate: '2024-12-30',
      status: 'active',
      color: '#3B82F6',
    },
    {
      id: 2,
      name: 'AI Innovation Series',
      description: 'Khám phá xu hướng AI và Machine Learning',
      thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800',
      articleCount: 8,
      totalViews: 32000,
      startDate: '2024-03-01',
      endDate: '2024-11-30',
      status: 'active',
      color: '#8B5CF6',
    },
    {
      id: 3,
      name: 'Startup Journey',
      description: 'Hành trình khởi nghiệp và phát triển doanh nghiệp',
      thumbnail: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800',
      articleCount: 15,
      totalViews: 28000,
      startDate: '2024-02-01',
      endDate: '2024-12-31',
      status: 'active',
      color: '#10B981',
    },
    {
      id: 4,
      name: 'Digital Transformation',
      description: 'Chuyển đổi số doanh nghiệp',
      thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800',
      articleCount: 6,
      totalViews: 18000,
      startDate: '2024-01-01',
      endDate: '2024-06-30',
      status: 'completed',
      color: '#F59E0B',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-gray-900 mb-1">Dòng sự kiện</h2>
          <p className="text-gray-600">Quản lý chuỗi bài viết và sự kiện liên quan</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow' : ''}`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow' : ''}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Tạo dòng sự kiện</span>
          </button>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Tìm kiếm dòng sự kiện..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Đang hoạt động</option>
            <option value="completed">Đã hoàn thành</option>
            <option value="draft">Nháp</option>
          </select>
        </div>
      </div>

      {/* Event Series Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {eventSeries.map((series) => (
            <div 
              key={series.id} 
              className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all cursor-pointer"
            >
              <div className="relative aspect-video overflow-hidden bg-gray-100">
                <img 
                  src={series.thumbnail} 
                  alt={series.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div 
                  className="absolute top-4 right-4 w-3 h-3 rounded-full shadow-lg"
                  style={{ backgroundColor: series.color }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <span className={`px-3 py-1 rounded-full text-xs ${
                    series.status === 'active' ? 'bg-green-500' : 'bg-gray-500'
                  } text-white`}>
                    {series.status === 'active' ? 'Đang hoạt động' : 'Đã hoàn thành'}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {series.name}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {series.description}
                </p>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl text-blue-600 mb-1">{series.articleCount}</div>
                    <div className="text-xs text-gray-600">Bài viết</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-2xl text-purple-600 mb-1">{(series.totalViews / 1000).toFixed(1)}K</div>
                    <div className="text-xs text-gray-600">Lượt xem</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>{series.startDate} → {series.endDate}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-gray-700">Tên dòng sự kiện</th>
                  <th className="px-6 py-3 text-left text-gray-700">Trạng thái</th>
                  <th className="px-6 py-3 text-left text-gray-700">Bài viết</th>
                  <th className="px-6 py-3 text-left text-gray-700">Lượt xem</th>
                  <th className="px-6 py-3 text-left text-gray-700">Thời gian</th>
                  <th className="px-6 py-3 text-right text-gray-700">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {eventSeries.map((series) => (
                  <tr key={series.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: series.color }}
                        ></div>
                        <div>
                          <div className="text-gray-900">{series.name}</div>
                          <div className="text-gray-600 text-sm">{series.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs ${
                        series.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {series.status === 'active' ? 'Đang hoạt động' : 'Đã hoàn thành'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-700">{series.articleCount}</td>
                    <td className="px-6 py-4 text-gray-700">{series.totalViews.toLocaleString()}</td>
                    <td className="px-6 py-4 text-gray-700 text-sm">
                      {series.startDate} → {series.endDate}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-blue-600 hover:text-blue-700">Xem</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-gray-900">Tạo dòng sự kiện mới</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div>
                <label className="block text-gray-700 mb-2">Tên dòng sự kiện *</label>
                <input
                  type="text"
                  placeholder="VD: Tech Summit 2025"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Mô tả</label>
                <textarea
                  placeholder="Mô tả về dòng sự kiện này..."
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2">Ngày bắt đầu</label>
                  <input
                    type="date"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2">Ngày kết thúc</label>
                  <input
                    type="date"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Màu sắc nhận diện</label>
                <div className="flex gap-3">
                  {['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#EC4899'].map((color) => (
                    <button
                      key={color}
                      className="w-10 h-10 rounded-lg border-2 border-gray-300 hover:scale-110 transition-transform"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Ảnh thumbnail</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer">
                  <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">Click để tải ảnh lên</p>
                  <p className="text-gray-500 text-sm">hoặc kéo thả file vào đây</p>
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
              <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Save className="w-4 h-4" />
                <span>Tạo dòng sự kiện</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
