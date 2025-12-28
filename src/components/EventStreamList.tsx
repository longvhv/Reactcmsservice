import React, { useState } from 'react';
import { 
  Plus, Search, Filter, Calendar, FileText, TrendingUp, Eye, 
  BarChart3, Edit, Trash2, ChevronRight, Users, Clock, Tag,
  Activity, Star, Archive, CheckCircle, Circle, PlayCircle, PauseCircle
} from 'lucide-react';
import { PageWrapper } from './PageWrapper';
import { PageHeader } from './PageHeader';
import { Card } from './Card';
import { useLanguage } from '../contexts/LanguageContext';

interface EventStream {
  id: string;
  name: string;
  description: string;
  slug: string;
  thumbnail?: string;
  color: string;
  status: 'active' | 'paused' | 'completed' | 'archived';
  type: 'news' | 'campaign' | 'product' | 'event' | 'topic' | 'series';
  articles: {
    total: number;
    published: number;
    draft: number;
  };
  metadata: {
    totalViews: number;
    totalLikes: number;
    totalComments: number;
    avgEngagement: number;
    followers: number;
  };
  timeline: {
    startDate: string;
    endDate?: string;
    lastUpdate: string;
  };
  author: {
    id: string;
    name: string;
    avatar: string;
  };
  tags: string[];
  featured: boolean;
}

export function EventStreamList({ onNavigate }: { onNavigate: (page: any) => void }) {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Mock data
  const mockStreams: EventStream[] = [
    {
      id: '1',
      name: 'Tech Summit 2024',
      description: 'Chuỗi tin tức và sự kiện về công nghệ lớn nhất năm 2024, cập nhật liên tục các xu hướng AI, Cloud, và Blockchain.',
      slug: 'tech-summit-2024',
      thumbnail: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop',
      color: '#3B82F6',
      status: 'active',
      type: 'event',
      articles: { total: 24, published: 18, draft: 6 },
      metadata: {
        totalViews: 45823,
        totalLikes: 2341,
        totalComments: 567,
        avgEngagement: 8.5,
        followers: 1203,
      },
      timeline: {
        startDate: '2024-01-15',
        endDate: '2024-12-30',
        lastUpdate: '2024-01-26',
      },
      author: {
        id: 'u1',
        name: 'Nguyễn Văn A',
        avatar: 'https://i.pravatar.cc/150?img=1',
      },
      tags: ['Technology', 'AI', 'Cloud', 'Blockchain'],
      featured: true,
    },
    {
      id: '2',
      name: 'Chiến dịch ra mắt sản phẩm X',
      description: 'Dòng sự kiện marketing cho sản phẩm X, bao gồm teaser, launch event, review, và user stories.',
      slug: 'product-x-launch',
      thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop',
      color: '#8B5CF6',
      status: 'active',
      type: 'product',
      articles: { total: 12, published: 10, draft: 2 },
      metadata: {
        totalViews: 32145,
        totalLikes: 1823,
        totalComments: 412,
        avgEngagement: 7.2,
        followers: 892,
      },
      timeline: {
        startDate: '2024-01-20',
        endDate: '2024-03-20',
        lastUpdate: '2024-01-25',
      },
      author: {
        id: 'u2',
        name: 'Trần Thị B',
        avatar: 'https://i.pravatar.cc/150?img=2',
      },
      tags: ['Product', 'Marketing', 'Launch'],
      featured: true,
    },
    {
      id: '3',
      name: 'Tin tức Startup Việt Nam',
      description: 'Cập nhật tin tức, phân tích và insights về hệ sinh thái startup Việt Nam.',
      slug: 'vietnam-startup-news',
      thumbnail: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&h=400&fit=crop',
      color: '#10B981',
      status: 'active',
      type: 'news',
      articles: { total: 45, published: 42, draft: 3 },
      metadata: {
        totalViews: 67234,
        totalLikes: 3456,
        totalComments: 892,
        avgEngagement: 9.1,
        followers: 2145,
      },
      timeline: {
        startDate: '2024-01-01',
        lastUpdate: '2024-01-26',
      },
      author: {
        id: 'u3',
        name: 'Lê Văn C',
        avatar: 'https://i.pravatar.cc/150?img=3',
      },
      tags: ['Startup', 'Business', 'Vietnam'],
      featured: false,
    },
    {
      id: '4',
      name: 'Chuyển đổi số 2024',
      description: 'Series bài viết về chuyển đổi số doanh nghiệp, case study và best practices.',
      slug: 'digital-transformation-2024',
      thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=400&fit=crop',
      color: '#F59E0B',
      status: 'paused',
      type: 'topic',
      articles: { total: 8, published: 6, draft: 2 },
      metadata: {
        totalViews: 18456,
        totalLikes: 945,
        totalComments: 234,
        avgEngagement: 6.3,
        followers: 567,
      },
      timeline: {
        startDate: '2024-01-10',
        lastUpdate: '2024-01-20',
      },
      author: {
        id: 'u1',
        name: 'Nguyễn Văn A',
        avatar: 'https://i.pravatar.cc/150?img=1',
      },
      tags: ['Digital', 'Transformation', 'Enterprise'],
      featured: false,
    },
  ];

  const filteredStreams = mockStreams.filter((stream) => {
    const matchesSearch = stream.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         stream.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || stream.status === selectedStatus;
    const matchesType = selectedType === 'all' || stream.type === selectedType;
    return matchesSearch && matchesStatus && matchesType;
  });

  const stats = {
    total: mockStreams.length,
    active: mockStreams.filter(s => s.status === 'active').length,
    paused: mockStreams.filter(s => s.status === 'paused').length,
    completed: mockStreams.filter(s => s.status === 'completed').length,
    totalArticles: mockStreams.reduce((sum, s) => sum + s.articles.total, 0),
    totalViews: mockStreams.reduce((sum, s) => sum + s.metadata.totalViews, 0),
    totalFollowers: mockStreams.reduce((sum, s) => sum + s.metadata.followers, 0),
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400';
      case 'paused': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400';
      case 'completed': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400';
      case 'archived': return 'bg-gray-100 dark:bg-gray-900/30 text-gray-600 dark:text-gray-400';
      default: return 'bg-gray-100 dark:bg-gray-900/30 text-gray-600 dark:text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <PlayCircle className="w-3 h-3" />;
      case 'paused': return <PauseCircle className="w-3 h-3" />;
      case 'completed': return <CheckCircle className="w-3 h-3" />;
      case 'archived': return <Archive className="w-3 h-3" />;
      default: return <Circle className="w-3 h-3" />;
    }
  };

  const getTypeColor = (type: string) => {
    const colors = {
      news: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
      campaign: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
      product: 'bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400',
      event: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
      topic: 'bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400',
      series: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400',
    };
    return colors[type as keyof typeof colors] || colors.topic;
  };

  const getTypeLabel = (type: string) => {
    const labels = {
      news: 'Tin tức',
      campaign: 'Chiến dịch',
      product: 'Sản phẩm',
      event: 'Sự kiện',
      topic: 'Chủ đề',
      series: 'Chuỗi',
    };
    return labels[type as keyof typeof labels] || 'Khác';
  };

  return (
    <PageWrapper>
      <PageHeader
        title="Dòng sự kiện"
        description="Quản lý các dòng sự kiện và bài viết liên quan"
        action={
          <button 
            onClick={() => onNavigate({ page: 'event-stream-form' })}
            className="px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/20 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Tạo dòng sự kiện mới
          </button>
        }
      />

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Activity className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-sm text-muted-foreground">Tổng dòng</span>
          </div>
          <p className="text-2xl font-bold">{stats.total}</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <PlayCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
            </div>
            <span className="text-sm text-muted-foreground">Đang chạy</span>
          </div>
          <p className="text-2xl font-bold">{stats.active}</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
              <PauseCircle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
            </div>
            <span className="text-sm text-muted-foreground">Tạm dừng</span>
          </div>
          <p className="text-2xl font-bold">{stats.paused}</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <CheckCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-sm text-muted-foreground">Hoàn thành</span>
          </div>
          <p className="text-2xl font-bold">{stats.completed}</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <FileText className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            </div>
            <span className="text-sm text-muted-foreground">Bài viết</span>
          </div>
          <p className="text-2xl font-bold">{stats.totalArticles}</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <Eye className="w-4 h-4 text-orange-600 dark:text-orange-400" />
            </div>
            <span className="text-sm text-muted-foreground">Lượt xem</span>
          </div>
          <p className="text-2xl font-bold">{(stats.totalViews / 1000).toFixed(1)}K</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-pink-100 dark:bg-pink-900/30 rounded-lg">
              <Users className="w-4 h-4 text-pink-600 dark:text-pink-400" />
            </div>
            <span className="text-sm text-muted-foreground">Theo dõi</span>
          </div>
          <p className="text-2xl font-bold">{(stats.totalFollowers / 1000).toFixed(1)}K</p>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder={t('placeholders.searchEventStream')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          {/* Type Filter */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-4 py-2.5 bg-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="all">Tất cả loại</option>
            <option value="news">Tin tức</option>
            <option value="campaign">Chiến dịch</option>
            <option value="product">Sản phẩm</option>
            <option value="event">Sự kiện</option>
            <option value="topic">Chủ đề</option>
            <option value="series">Chuỗi</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2.5 bg-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Đang chạy</option>
            <option value="paused">Tạm dừng</option>
            <option value="completed">Hoàn thành</option>
            <option value="archived">Lưu trữ</option>
          </select>

          {/* View Mode */}
          <div className="flex items-center gap-2 p-1 bg-secondary rounded-xl">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-2 rounded-lg transition-all ${
                viewMode === 'grid' ? 'bg-blue-500 text-white shadow-lg' : 'hover:bg-muted'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-2 rounded-lg transition-all ${
                viewMode === 'list' ? 'bg-blue-500 text-white shadow-lg' : 'hover:bg-muted'
              }`}
            >
              <FileText className="w-4 h-4" />
            </button>
          </div>
        </div>
      </Card>

      {/* Streams Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStreams.map((stream) => (
            <Card key={stream.id} className="overflow-hidden hover:shadow-lg transition-all group">
              {/* Thumbnail with color overlay */}
              {stream.thumbnail && (
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={stream.thumbnail}
                    alt={stream.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div 
                    className="absolute inset-0 mix-blend-multiply opacity-60"
                    style={{ backgroundColor: stream.color }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  
                  {/* Badges */}
                  <div className="absolute top-3 right-3 flex flex-col gap-2">
                    {stream.featured && (
                      <span className="px-3 py-1 bg-yellow-500 text-white rounded-full text-xs font-semibold flex items-center gap-1">
                        <Star className="w-3 h-3" />
                        Nổi bật
                      </span>
                    )}
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${getStatusColor(stream.status)}`}>
                      {getStatusIcon(stream.status)}
                      {stream.status === 'active' ? 'Đang chạy' : stream.status === 'paused' ? 'Tạm dừng' : stream.status === 'completed' ? 'Hoàn thành' : 'Lưu trữ'}
                    </span>
                  </div>

                  {/* Title overlay */}
                  <div className="absolute bottom-3 left-3 right-3">
                    <span className={`px-2 py-1 rounded-lg text-xs font-semibold mb-2 inline-block ${getTypeColor(stream.type)}`}>
                      {getTypeLabel(stream.type)}
                    </span>
                    <h3 
                      onClick={() => onNavigate({ page: 'event-stream-detail', id: stream.id })}
                      className="text-white font-semibold text-lg line-clamp-2 cursor-pointer hover:underline"
                    >
                      {stream.name}
                    </h3>
                  </div>
                </div>
              )}

              <div className="p-5">
                {/* Description */}
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {stream.description}
                </p>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="text-center p-2 bg-secondary rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Bài viết</p>
                    <p className="font-semibold">{stream.articles.published}/{stream.articles.total}</p>
                  </div>
                  <div className="text-center p-2 bg-secondary rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Lượt xem</p>
                    <p className="font-semibold">{(stream.metadata.totalViews / 1000).toFixed(1)}K</p>
                  </div>
                  <div className="text-center p-2 bg-secondary rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Theo dõi</p>
                    <p className="font-semibold">{stream.metadata.followers}</p>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {stream.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="px-2 py-1 bg-secondary text-xs rounded-lg">
                      {tag}
                    </span>
                  ))}
                  {stream.tags.length > 3 && (
                    <span className="px-2 py-1 bg-secondary text-xs rounded-lg">
                      +{stream.tags.length - 3}
                    </span>
                  )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="flex items-center gap-2">
                    <img src={stream.author.avatar} alt={stream.author.name} className="w-6 h-6 rounded-full" />
                    <span className="text-xs text-muted-foreground">{stream.author.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-secondary rounded-lg transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => onNavigate({ page: 'event-stream-detail', id: stream.id })}
                      className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                    >
                      <ChevronRight className="w-4 h-4 text-blue-500" />
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <div className="divide-y divide-border">
            {filteredStreams.map((stream) => (
              <div key={stream.id} className="p-5 hover:bg-secondary/50 transition-colors group">
                <div className="flex items-start gap-4">
                  {/* Thumbnail */}
                  {stream.thumbnail && (
                    <div className="relative w-32 h-20 flex-shrink-0 rounded-lg overflow-hidden">
                      <img
                        src={stream.thumbnail}
                        alt={stream.name}
                        className="w-full h-full object-cover"
                      />
                      <div 
                        className="absolute inset-0 mix-blend-multiply opacity-40"
                        style={{ backgroundColor: stream.color }}
                      />
                    </div>
                  )}

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`px-2 py-0.5 rounded-lg text-xs font-semibold ${getTypeColor(stream.type)}`}>
                            {getTypeLabel(stream.type)}
                          </span>
                          {stream.featured && (
                            <span className="px-2 py-0.5 bg-yellow-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1">
                              <Star className="w-3 h-3" />
                              Nổi bật
                            </span>
                          )}
                        </div>
                        <h3 className="font-semibold text-lg mb-1 group-hover:text-blue-500 transition-colors">
                          {stream.name}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {stream.description}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 flex-shrink-0 ${getStatusColor(stream.status)}`}>
                        {getStatusIcon(stream.status)}
                        {stream.status === 'active' ? 'Đang chạy' : stream.status === 'paused' ? 'Tạm dừng' : stream.status === 'completed' ? 'Hoàn thành' : 'Lưu trữ'}
                      </span>
                    </div>

                    <div className="flex items-center gap-6 text-sm text-muted-foreground mb-3">
                      <span className="flex items-center gap-1">
                        <FileText className="w-4 h-4" />
                        {stream.articles.published}/{stream.articles.total} bài viết
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {stream.metadata.totalViews.toLocaleString()} lượt xem
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {stream.metadata.followers} theo dõi
                      </span>
                      <span className="flex items-center gap-1">
                        <TrendingUp className="w-4 h-4" />
                        {stream.metadata.avgEngagement}% tương tác
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <img src={stream.author.avatar} alt={stream.author.name} className="w-6 h-6 rounded-full" />
                          <span className="text-xs text-muted-foreground">{stream.author.name}</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {stream.tags.slice(0, 4).map((tag) => (
                            <span key={tag} className="px-2 py-0.5 bg-secondary text-xs rounded-lg">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="p-2 hover:bg-secondary rounded-lg transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => onNavigate({ page: 'event-stream-detail', id: stream.id })}
                          className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                        >
                          <ChevronRight className="w-4 h-4 text-blue-500" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {filteredStreams.length === 0 && (
        <Card className="p-12 text-center">
          <Activity className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">Không tìm thấy dòng sự kiện nào</p>
        </Card>
      )}
    </PageWrapper>
  );
}