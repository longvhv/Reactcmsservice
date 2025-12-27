import { useState } from 'react';
import { Search, Plus, Play, Pause, Trash2, Edit2, Globe, Clock, CheckCircle, XCircle, AlertCircle, BarChart3, Settings, Code, Filter, Calendar, Download, RefreshCw, Eye, Copy } from 'lucide-react';

interface CrawlerSource {
  id: number;
  name: string;
  url: string;
  type: 'rss' | 'html' | 'api';
  status: 'active' | 'paused' | 'error';
  lastRun: string;
  articlesCollected: number;
  successRate: number;
  schedule: string;
}

export function CrawlerManagement() {
  const [activeTab, setActiveTab] = useState<'sources' | 'history' | 'rules' | 'settings'>('sources');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [showAddSource, setShowAddSource] = useState(false);

  const crawlerSources: CrawlerSource[] = [
    {
      id: 1,
      name: 'VnExpress Technology',
      url: 'https://vnexpress.net/rss/tin-moi-nhat.rss',
      type: 'rss',
      status: 'active',
      lastRun: '5 phút trước',
      articlesCollected: 1247,
      successRate: 98.5,
      schedule: 'Mỗi 15 phút',
    },
    {
      id: 2,
      name: 'TechCrunch News',
      url: 'https://techcrunch.com/feed/',
      type: 'rss',
      status: 'active',
      lastRun: '10 phút trước',
      articlesCollected: 892,
      successRate: 96.2,
      schedule: 'Mỗi 30 phút',
    },
    {
      id: 3,
      name: 'Custom HTML Scraper',
      url: 'https://example.com/news',
      type: 'html',
      status: 'paused',
      lastRun: '2 giờ trước',
      articlesCollected: 456,
      successRate: 87.3,
      schedule: 'Mỗi 1 giờ',
    },
    {
      id: 4,
      name: 'News API Integration',
      url: 'https://api.newsapi.org/v2/',
      type: 'api',
      status: 'error',
      lastRun: '1 ngày trước',
      articlesCollected: 234,
      successRate: 45.8,
      schedule: 'Mỗi 6 giờ',
    },
  ];

  const crawlerHistory = [
    { id: 1, source: 'VnExpress Technology', status: 'success', articles: 12, time: '2 phút trước', duration: '3s' },
    { id: 2, source: 'TechCrunch News', status: 'success', articles: 8, time: '5 phút trước', duration: '5s' },
    { id: 3, source: 'Custom HTML Scraper', status: 'failed', articles: 0, time: '2 giờ trước', duration: '45s', error: 'Connection timeout' },
    { id: 4, source: 'VnExpress Technology', status: 'success', articles: 15, time: '17 phút trước', duration: '4s' },
    { id: 5, source: 'News API Integration', status: 'partial', articles: 3, time: '1 giờ trước', duration: '12s', error: 'Rate limit exceeded' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-700 bg-green-100';
      case 'paused': return 'text-yellow-700 bg-yellow-100';
      case 'error': return 'text-red-700 bg-red-100';
      case 'success': return 'text-green-700 bg-green-100';
      case 'failed': return 'text-red-700 bg-red-100';
      case 'partial': return 'text-orange-700 bg-orange-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'rss': return '📰';
      case 'html': return '🌐';
      case 'api': return '⚡';
      default: return '📄';
    }
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-foreground mb-2">Crawler Management</h1>
          <p className="text-muted-foreground">Quản lý nguồn thu thập nội dung tự động</p>
        </div>
        <button
          onClick={() => setShowAddSource(true)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-200"
        >
          <Plus className="w-5 h-5" />
          <span>Thêm nguồn mới</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <Globe className="w-6 h-6" />
            </div>
            <RefreshCw className="w-5 h-5 opacity-50" />
          </div>
          <div className="text-3xl font-bold mb-1">12</div>
          <div className="text-blue-100 text-sm">Nguồn đang hoạt động</div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <CheckCircle className="w-6 h-6" />
            </div>
            <Clock className="w-5 h-5 opacity-50" />
          </div>
          <div className="text-3xl font-bold mb-1">2,847</div>
          <div className="text-green-100 text-sm">Bài viết hôm nay</div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <BarChart3 className="w-6 h-6" />
            </div>
            <Play className="w-5 h-5 opacity-50" />
          </div>
          <div className="text-3xl font-bold mb-1">94.2%</div>
          <div className="text-purple-100 text-sm">Tỷ lệ thành công</div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <AlertCircle className="w-6 h-6" />
            </div>
            <XCircle className="w-5 h-5 opacity-50" />
          </div>
          <div className="text-3xl font-bold mb-1">3</div>
          <div className="text-orange-100 text-sm">Nguồn có lỗi</div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-card rounded-2xl border border-border/60 overflow-hidden">
        <div className="border-b border-border/60 bg-muted/30">
          <div className="flex items-center gap-1 p-2">
            {[
              { id: 'sources', label: 'Nguồn crawler', icon: Globe },
              { id: 'history', label: 'Lịch sử', icon: Clock },
              { id: 'rules', label: 'Quy tắc', icon: Code },
              { id: 'settings', label: 'Cấu hình', icon: Settings },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-card text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'sources' && (
            <div className="space-y-4">
              {/* Filters */}
              <div className="flex items-center gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm nguồn crawler..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all duration-200"
                  />
                </div>

                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-4 py-3 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                >
                  <option value="all">Tất cả trạng thái</option>
                  <option value="active">Đang hoạt động</option>
                  <option value="paused">Đã tạm dừng</option>
                  <option value="error">Có lỗi</option>
                </select>

                <button className="flex items-center gap-2 px-4 py-3 border border-border/60 rounded-xl hover:bg-muted/50 transition-all duration-200">
                  <Filter className="w-4 h-4" />
                  <span>Bộ lọc</span>
                </button>
              </div>

              {/* Sources Table */}
              <div className="border border-border/60 rounded-xl overflow-hidden">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left px-6 py-4 text-sm text-muted-foreground">Nguồn</th>
                      <th className="text-left px-6 py-4 text-sm text-muted-foreground">Loại</th>
                      <th className="text-left px-6 py-4 text-sm text-muted-foreground">Trạng thái</th>
                      <th className="text-left px-6 py-4 text-sm text-muted-foreground">Lần chạy cuối</th>
                      <th className="text-left px-6 py-4 text-sm text-muted-foreground">Bài viết</th>
                      <th className="text-left px-6 py-4 text-sm text-muted-foreground">Tỷ lệ TC</th>
                      <th className="text-left px-6 py-4 text-sm text-muted-foreground">Lịch trình</th>
                      <th className="text-right px-6 py-4 text-sm text-muted-foreground">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {crawlerSources.map((source) => (
                      <tr key={source.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-6 py-4">
                          <div>
                            <div className="font-medium text-foreground">{source.name}</div>
                            <div className="text-sm text-muted-foreground truncate max-w-xs">{source.url}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-2xl">{getTypeIcon(source.type)}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(source.status)}`}>
                            {source.status === 'active' ? 'Hoạt động' : source.status === 'paused' ? 'Tạm dừng' : 'Lỗi'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">{source.lastRun}</td>
                        <td className="px-6 py-4 text-sm font-medium">{source.articlesCollected.toLocaleString()}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full ${
                                  source.successRate > 90 ? 'bg-green-500' : 
                                  source.successRate > 70 ? 'bg-yellow-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${source.successRate}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium">{source.successRate}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">{source.schedule}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              className="p-2 hover:bg-green-100 text-green-600 rounded-lg transition-colors"
                              title="Chạy ngay"
                            >
                              <Play className="w-4 h-4" />
                            </button>
                            {source.status === 'active' ? (
                              <button 
                                className="p-2 hover:bg-yellow-100 text-yellow-600 rounded-lg transition-colors"
                                title="Tạm dừng"
                              >
                                <Pause className="w-4 h-4" />
                              </button>
                            ) : (
                              <button 
                                className="p-2 hover:bg-green-100 text-green-600 rounded-lg transition-colors"
                                title="Tiếp tục"
                              >
                                <Play className="w-4 h-4" />
                              </button>
                            )}
                            <button 
                              className="p-2 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors"
                              title="Chỉnh sửa"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button 
                              className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                              title="Xóa"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-4">
              {/* History Filters */}
              <div className="flex items-center gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm lịch sử..."
                    className="w-full pl-12 pr-4 py-3 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                  />
                </div>

                <select className="px-4 py-3 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200">
                  <option>24 giờ qua</option>
                  <option>7 ngày qua</option>
                  <option>30 ngày qua</option>
                  <option>Tùy chỉnh</option>
                </select>

                <button className="flex items-center gap-2 px-4 py-3 border border-border/60 rounded-xl hover:bg-muted/50 transition-all duration-200">
                  <Download className="w-4 h-4" />
                  <span>Xuất báo cáo</span>
                </button>
              </div>

              {/* History List */}
              <div className="space-y-3">
                {crawlerHistory.map((item) => (
                  <div key={item.id} className="bg-card border border-border/60 rounded-xl p-4 hover:shadow-md transition-all duration-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <div className={`p-3 rounded-xl ${getStatusColor(item.status)}`}>
                          {item.status === 'success' ? (
                            <CheckCircle className="w-5 h-5" />
                          ) : item.status === 'failed' ? (
                            <XCircle className="w-5 h-5" />
                          ) : (
                            <AlertCircle className="w-5 h-5" />
                          )}
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <h4 className="font-medium text-foreground">{item.source}</h4>
                            <span className={`px-2 py-0.5 rounded-full text-xs ${getStatusColor(item.status)}`}>
                              {item.status === 'success' ? 'Thành công' : item.status === 'failed' ? 'Thất bại' : 'Một phần'}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>{item.articles} bài viết</span>
                            <span>•</span>
                            <span>{item.duration}</span>
                            <span>•</span>
                            <span>{item.time}</span>
                            {item.error && (
                              <>
                                <span>•</span>
                                <span className="text-red-600">{item.error}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button className="p-2 hover:bg-muted rounded-lg transition-colors" title="Xem chi tiết">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 hover:bg-muted rounded-lg transition-colors" title="Chạy lại">
                          <RefreshCw className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'rules' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <p className="text-muted-foreground">Cấu hình quy tắc xử lý và lọc nội dung</p>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors">
                  <Plus className="w-4 h-4" />
                  <span>Thêm quy tắc</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Content Filter Rules */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-blue-500 rounded-xl">
                      <Filter className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-blue-900">Lọc nội dung</h3>
                      <p className="text-sm text-blue-700">8 quy tắc đang hoạt động</p>
                    </div>
                  </div>
                  <ul className="space-y-2 text-sm text-blue-800">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      <span>Loại bỏ quảng cáo</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      <span>Kiểm tra từ khóa spam</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      <span>Độ dài nội dung tối thiểu</span>
                    </li>
                  </ul>
                </div>

                {/* Auto Categorization */}
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-purple-500 rounded-xl">
                      <Code className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-purple-900">Phân loại tự động</h3>
                      <p className="text-sm text-purple-700">AI-powered categorization</p>
                    </div>
                  </div>
                  <ul className="space-y-2 text-sm text-purple-800">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      <span>Phân tích từ khóa</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      <span>Gán danh mục tự động</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      <span>Tạo tags tự động</span>
                    </li>
                  </ul>
                </div>

                {/* Duplicate Detection */}
                <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-green-500 rounded-xl">
                      <Copy className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-green-900">Phát hiện trùng lặp</h3>
                      <p className="text-sm text-green-700">Content similarity check</p>
                    </div>
                  </div>
                  <ul className="space-y-2 text-sm text-green-800">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      <span>So sánh tiêu đề</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      <span>Phân tích nội dung</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      <span>Ngưỡng similarity: 85%</span>
                    </li>
                  </ul>
                </div>

                {/* Image Processing */}
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-orange-500 rounded-xl">
                      <Settings className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-orange-900">Xử lý ảnh</h3>
                      <p className="text-sm text-orange-700">Auto download & optimize</p>
                    </div>
                  </div>
                  <ul className="space-y-2 text-sm text-orange-800">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      <span>Tải ảnh tự động</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      <span>Tối ưu kích thước</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      <span>Generate thumbnails</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                {/* General Settings */}
                <div className="space-y-4">
                  <h3 className="text-foreground">Cài đặt chung</h3>
                  
                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">Giới hạn số lượng bài/lần chạy</label>
                    <input
                      type="number"
                      defaultValue={50}
                      className="w-full px-4 py-3 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">Timeout (giây)</label>
                    <input
                      type="number"
                      defaultValue={30}
                      className="w-full px-4 py-3 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">User Agent</label>
                    <input
                      type="text"
                      defaultValue="Mozilla/5.0 (compatible; CMSBot/1.0)"
                      className="w-full px-4 py-3 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
                    <div>
                      <div className="font-medium text-foreground">Tự động xuất bản</div>
                      <div className="text-sm text-muted-foreground">Xuất bản ngay sau khi crawl</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>

                {/* Notification Settings */}
                <div className="space-y-4">
                  <h3 className="text-foreground">Thông báo</h3>
                  
                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
                    <div>
                      <div className="font-medium text-foreground">Email khi có lỗi</div>
                      <div className="text-sm text-muted-foreground">Gửi thông báo khi crawler thất bại</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
                    <div>
                      <div className="font-medium text-foreground">Báo cáo hàng ngày</div>
                      <div className="text-sm text-muted-foreground">Tổng hợp thống kê cuối ngày</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">Email nhận thông báo</label>
                    <input
                      type="email"
                      defaultValue="admin@cms.com"
                      className="w-full px-4 py-3 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">Webhook URL (optional)</label>
                    <input
                      type="url"
                      placeholder="https://hooks.slack.com/..."
                      className="w-full px-4 py-3 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                    />
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end pt-6 border-t border-border/60">
                <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-200">
                  Lưu cài đặt
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Source Modal */}
      {showAddSource && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-card rounded-2xl border border-border/60 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-border/60">
              <h2 className="text-foreground">Thêm nguồn crawler mới</h2>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm text-muted-foreground mb-2">Tên nguồn *</label>
                <input
                  type="text"
                  placeholder="VD: VnExpress Technology"
                  className="w-full px-4 py-3 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-sm text-muted-foreground mb-2">Loại crawler *</label>
                <select className="w-full px-4 py-3 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200">
                  <option value="rss">RSS Feed</option>
                  <option value="html">HTML Scraper</option>
                  <option value="api">API Integration</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-muted-foreground mb-2">URL *</label>
                <input
                  type="url"
                  placeholder="https://example.com/rss"
                  className="w-full px-4 py-3 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-sm text-muted-foreground mb-2">Lịch trình chạy</label>
                <select className="w-full px-4 py-3 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200">
                  <option>Mỗi 15 phút</option>
                  <option>Mỗi 30 phút</option>
                  <option>Mỗi 1 giờ</option>
                  <option>Mỗi 6 giờ</option>
                  <option>Mỗi ngày</option>
                  <option>Tùy chỉnh (Cron)</option>
                </select>
              </div>
            </div>

            <div className="p-6 border-t border-border/60 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowAddSource(false)}
                className="px-6 py-3 border border-border/60 rounded-xl hover:bg-muted/50 transition-all duration-200"
              >
                Hủy
              </button>
              <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-200">
                Thêm nguồn
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
