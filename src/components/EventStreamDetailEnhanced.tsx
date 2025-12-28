import React, { useState } from 'react';
import { 
  ArrowLeft, Edit, Trash2, Share2, Eye, Clock, Calendar, TrendingUp,
  FileText, ChevronRight, CheckCircle, Circle, PlayCircle, Users,
  BarChart3, Link2, Tag, Download, Star, Heart, MessageSquare,
  Activity, ExternalLink, Filter, Search, Plus, X, GripVertical,
  Copy, Send, Bell, Archive, Pause, Play, Settings, MoreVertical,
  Globe, Lock, UserPlus, Image, Zap, Target, BookOpen
} from 'lucide-react';
import { PageWrapper } from './PageWrapper';
import { PageHeader } from './PageHeader';
import { Card } from './Card';
import { ArticleListView, Article } from './ArticleListView';

interface StreamArticle {
  id: string;
  order: number;
  title: string;
  slug: string;
  excerpt: string;
  type: string;
  status: 'published' | 'draft';
  publishedAt?: string;
  thumbnail?: string;
  readTime: number;
  views: number;
  likes: number;
  comments: number;
  engagement: number;
  author: {
    id: string;
    name: string;
    avatar: string;
  };
}

interface Collaborator {
  id: string;
  name: string;
  avatar: string;
  role: 'owner' | 'editor' | 'viewer';
  lastActive: string;
}

interface StreamEvent {
  id: string;
  type: 'article_added' | 'article_published' | 'article_removed' | 'stream_updated' | 'collaborator_added';
  message: string;
  timestamp: string;
  user: {
    name: string;
    avatar: string;
  };
}

export function EventStreamDetailEnhanced({ streamId, onNavigate }: { streamId: string; onNavigate: (page: any) => void }) {
  const [selectedTab, setSelectedTab] = useState<'overview' | 'articles' | 'analytics' | 'activity' | 'settings'>('overview');
  const [articleFilter, setArticleFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [showAddArticle, setShowAddArticle] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data
  const stream = {
    id: streamId,
    name: 'Tech Summit 2024',
    description: 'Chuỗi tin tức và sự kiện về công nghệ lớn nhất năm 2024, cập nhật liên tục các xu hướng AI, Cloud, và Blockchain.',
    slug: 'tech-summit-2024',
    thumbnail: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&h=400&fit=crop',
    color: '#3B82F6',
    status: 'active',
    type: 'event',
    visibility: 'public',
    timeline: {
      startDate: '2024-01-15',
      endDate: '2024-12-30',
      lastUpdate: '2024-01-26',
      createdAt: '2024-01-10',
    },
    author: {
      id: 'u1',
      name: 'Nguyễn Văn A',
      avatar: 'https://i.pravatar.cc/150?img=1',
      bio: 'Event Manager',
    },
    tags: ['Technology', 'AI', 'Cloud', 'Blockchain', 'Innovation'],
    featured: true,
    stats: {
      totalArticles: 24,
      publishedArticles: 18,
      draftArticles: 6,
      totalViews: 45823,
      totalLikes: 2341,
      totalComments: 567,
      avgEngagement: 8.5,
      followers: 1203,
      avgReadTime: 7,
      shareCount: 342,
      bookmarkCount: 156,
    },
  };

  const [articles, setArticles] = useState<StreamArticle[]>([
    {
      id: 'a1',
      order: 1,
      title: 'Tech Summit 2024 - Thông báo chính thức',
      slug: 'tech-summit-2024-announcement',
      excerpt: 'Chính thức công bố sự kiện công nghệ lớn nhất năm 2024 với sự tham gia của hơn 50 diễn giả hàng đầu.',
      type: 'announcement',
      status: 'published',
      publishedAt: '2024-01-15',
      thumbnail: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=250&fit=crop',
      readTime: 5,
      views: 4532,
      likes: 342,
      comments: 67,
      engagement: 9.2,
      author: { id: 'u1', name: 'Nguyễn Văn A', avatar: 'https://i.pravatar.cc/150?img=1' },
    },
    {
      id: 'a2',
      order: 2,
      title: 'AI Revolution: Xu hướng AI năm 2024',
      slug: 'ai-revolution-trends-2024',
      excerpt: 'Phân tích sâu về các xu hướng AI đột phá sẽ định hình tương lai c��ng nghệ trong năm 2024.',
      type: 'analysis',
      status: 'published',
      publishedAt: '2024-01-17',
      thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=250&fit=crop',
      readTime: 8,
      views: 5234,
      likes: 423,
      comments: 89,
      engagement: 9.8,
      author: { id: 'u2', name: 'Trần Thị B', avatar: 'https://i.pravatar.cc/150?img=2' },
    },
    {
      id: 'a3',
      order: 3,
      title: 'Cloud Infrastructure: Best Practices',
      slug: 'cloud-infrastructure-best-practices',
      excerpt: 'Hướng dẫn chi tiết về cách xây dựng hạ tầng Cloud hiệu quả và tiết kiệm chi phí.',
      type: 'guide',
      status: 'published',
      publishedAt: '2024-01-19',
      thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=250&fit=crop',
      readTime: 12,
      views: 3876,
      likes: 298,
      comments: 56,
      engagement: 8.1,
      author: { id: 'u3', name: 'Lê Văn C', avatar: 'https://i.pravatar.cc/150?img=3' },
    },
    {
      id: 'a4',
      order: 4,
      title: 'Blockchain & Web3: Cơ hội và thách thức',
      slug: 'blockchain-web3-opportunities',
      excerpt: 'Khám phá tiềm năng của công nghệ Blockchain và Web3 trong doanh nghiệp.',
      type: 'analysis',
      status: 'published',
      publishedAt: '2024-01-21',
      thumbnail: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=250&fit=crop',
      readTime: 10,
      views: 4123,
      likes: 356,
      comments: 72,
      engagement: 8.9,
      author: { id: 'u1', name: 'Nguyễn Văn A', avatar: 'https://i.pravatar.cc/150?img=1' },
    },
    {
      id: 'a5',
      order: 5,
      title: 'Interview: CEO OpenAI về tương lai AI',
      slug: 'interview-ceo-openai',
      excerpt: 'Cuộc trò chuyện độc quyền với CEO OpenAI về định hướng phát triển AI trong tương lai.',
      type: 'interview',
      status: 'draft',
      readTime: 15,
      views: 0,
      likes: 0,
      comments: 0,
      engagement: 0,
      author: { id: 'u2', name: 'Trần Thị B', avatar: 'https://i.pravatar.cc/150?img=2' },
    },
  ]);

  // Convert StreamArticle to Article format for ArticleListView
  const convertToArticles = (streamArticles: StreamArticle[]): Article[] => {
    return streamArticles.map(article => ({
      id: parseInt(article.id.replace('a', '')),
      title: article.title,
      type: article.type,
      status: article.status,
      author: article.author.name,
      views: article.views,
      comments: article.comments,
      publishDate: article.publishedAt || new Date().toISOString(),
      updatedDate: article.publishedAt || new Date().toISOString(),
      thumbnail: article.thumbnail,
      excerpt: article.excerpt,
    }));
  };

  const collaborators: Collaborator[] = [
    { id: 'u1', name: 'Nguyễn Văn A', avatar: 'https://i.pravatar.cc/150?img=1', role: 'owner', lastActive: '2024-01-26T10:30:00' },
    { id: 'u2', name: 'Trần Thị B', avatar: 'https://i.pravatar.cc/150?img=2', role: 'editor', lastActive: '2024-01-26T09:15:00' },
    { id: 'u3', name: 'Lê Văn C', avatar: 'https://i.pravatar.cc/150?img=3', role: 'editor', lastActive: '2024-01-25T16:45:00' },
    { id: 'u4', name: 'Phạm Thị D', avatar: 'https://i.pravatar.cc/150?img=4', role: 'viewer', lastActive: '2024-01-24T14:20:00' },
  ];

  const streamEvents: StreamEvent[] = [
    {
      id: 'e1',
      type: 'article_published',
      message: 'đã xuất bản bài viết "Blockchain & Web3"',
      timestamp: '2024-01-21T14:30:00',
      user: { name: 'Nguyễn Văn A', avatar: 'https://i.pravatar.cc/150?img=1' },
    },
    {
      id: 'e2',
      type: 'article_added',
      message: 'đã th��m bài viết mới "Interview CEO OpenAI"',
      timestamp: '2024-01-20T11:20:00',
      user: { name: 'Trần Thị B', avatar: 'https://i.pravatar.cc/150?img=2' },
    },
    {
      id: 'e3',
      type: 'collaborator_added',
      message: 'đã mời Phạm Thị D tham gia',
      timestamp: '2024-01-19T09:45:00',
      user: { name: 'Nguyễn Văn A', avatar: 'https://i.pravatar.cc/150?img=1' },
    },
  ];

  const availableArticles = [
    { id: 'new1', title: 'Cybersecurity in 2024', type: 'analysis', status: 'published' as const },
    { id: 'new2', title: 'IoT and Smart Cities', type: 'guide', status: 'published' as const },
    { id: 'new3', title: '5G Technology Overview', type: 'news', status: 'draft' as const },
  ];

  const filteredArticles = articles.filter(article => {
    const matchesFilter = articleFilter === 'all' || article.status === articleFilter;
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newArticles = [...articles];
    const draggedArticle = newArticles[draggedIndex];
    newArticles.splice(draggedIndex, 1);
    newArticles.splice(index, 0, draggedArticle);

    const reorderedArticles = newArticles.map((a, idx) => ({ ...a, order: idx + 1 }));
    setArticles(reorderedArticles);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const removeArticle = (articleId: string) => {
    if (confirm('Bạn có chắc muốn xóa bài viết khỏi dòng sự kiện?')) {
      const newArticles = articles
        .filter(a => a.id !== articleId)
        .map((a, index) => ({ ...a, order: index + 1 }));
      setArticles(newArticles);
    }
  };

  const getTypeColor = (type: string) => {
    const colors = {
      announcement: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
      analysis: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
      guide: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
      interview: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
      news: 'bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400',
    };
    return colors[type as keyof typeof colors] || colors.news;
  };

  const getTypeLabel = (type: string) => {
    const labels = {
      announcement: 'Thông báo',
      analysis: 'Phân tích',
      guide: 'Hướng dẫn',
      interview: 'Phỏng vấn',
      news: 'Tin tức',
    };
    return labels[type as keyof typeof labels] || 'Bài viết';
  };

  const getRoleColor = (role: string) => {
    const colors = {
      owner: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
      editor: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
      viewer: 'bg-gray-100 dark:bg-gray-900/30 text-gray-600 dark:text-gray-400',
    };
    return colors[role as keyof typeof colors] || colors.viewer;
  };

  return (
    <PageWrapper>
      {/* Back Button */}
      <button
        onClick={() => onNavigate({ page: 'event-series' })}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        Quay lại danh sách
      </button>

      {/* Enhanced Hero Section */}
      <div className="relative h-72 rounded-2xl overflow-hidden mb-6">
        <img
          src={stream.thumbnail}
          alt={stream.name}
          className="w-full h-full object-cover"
        />
        <div 
          className="absolute inset-0 mix-blend-multiply opacity-60"
          style={{ backgroundColor: stream.color }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
        
        {/* Hero Content */}
        <div className="absolute inset-0 p-8 flex flex-col justify-between">
          {/* Top badges */}
          <div className="flex items-start justify-between">
            <div className="flex flex-wrap gap-2">
              {stream.featured && (
                <span className="px-3 py-1.5 bg-yellow-500 text-white rounded-lg text-sm font-semibold flex items-center gap-1.5 shadow-lg">
                  <Star className="w-4 h-4" />
                  Nổi bật
                </span>
              )}
              <span className="px-3 py-1.5 bg-white/20 backdrop-blur-sm text-white rounded-lg text-sm font-semibold flex items-center gap-1.5">
                <Activity className="w-4 h-4" />
                {stream.status === 'active' ? 'Đang chạy' : stream.status === 'paused' ? 'Tạm dừng' : 'Hoàn thành'}
              </span>
              <span className="px-3 py-1.5 bg-white/20 backdrop-blur-sm text-white rounded-lg text-sm font-semibold flex items-center gap-1.5">
                {stream.visibility === 'public' ? <Globe className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                {stream.visibility === 'public' ? 'Công khai' : 'Riêng tư'}
              </span>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-2">
              <button 
                onClick={() => onNavigate({ page: 'event-stream-form', id: streamId })}
                className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-xl hover:bg-white/30 transition-all flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Chỉnh sửa
              </button>
              <button 
                onClick={() => setShowShareModal(true)}
                className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-xl hover:bg-white/30 transition-all flex items-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                Chia sẻ
              </button>
              <button className="px-3 py-2 bg-white/20 backdrop-blur-sm text-white rounded-xl hover:bg-white/30 transition-all">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Bottom content */}
          <div>
            <div className="flex flex-wrap gap-2 mb-3">
              {stream.tags.slice(0, 5).map((tag) => (
                <span key={tag} className="px-2.5 py-1 bg-white/15 backdrop-blur-sm text-white text-xs rounded-lg">
                  {tag}
                </span>
              ))}
            </div>
            <h1 className="text-4xl font-bold text-white mb-3">{stream.name}</h1>
            <p className="text-white/90 text-lg max-w-3xl">{stream.description}</p>

            {/* Collaborators */}
            <div className="flex items-center gap-3 mt-4">
              <div className="flex -space-x-2">
                {collaborators.slice(0, 4).map((collab) => (
                  <img
                    key={collab.id}
                    src={collab.avatar}
                    alt={collab.name}
                    className="w-8 h-8 rounded-full border-2 border-white shadow-lg"
                    title={collab.name}
                  />
                ))}
              </div>
              <span className="text-white/80 text-sm">
                {collaborators.length} cộng tác viên
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-10 gap-3 mb-6">
        {[
          { icon: FileText, label: 'Bài viết', value: `${stream.stats.publishedArticles}/${stream.stats.totalArticles}`, color: 'blue' },
          { icon: Eye, label: 'Lượt xem', value: `${(stream.stats.totalViews / 1000).toFixed(1)}K`, color: 'purple' },
          { icon: Heart, label: 'Lượt thích', value: `${(stream.stats.totalLikes / 1000).toFixed(1)}K`, color: 'red' },
          { icon: MessageSquare, label: 'Bình luận', value: stream.stats.totalComments, color: 'green' },
          { icon: TrendingUp, label: 'Tương tác', value: `${stream.stats.avgEngagement}%`, color: 'teal' },
          { icon: Users, label: 'Theo dõi', value: `${(stream.stats.followers / 1000).toFixed(1)}K`, color: 'pink' },
          { icon: Share2, label: 'Chia sẻ', value: stream.stats.shareCount, color: 'indigo' },
          { icon: BookOpen, label: 'Lưu', value: stream.stats.bookmarkCount, color: 'orange' },
          { icon: Clock, label: 'Đọc TB', value: `${stream.stats.avgReadTime}m`, color: 'amber' },
          { icon: Zap, label: 'Hoạt động', value: 'Cao', color: 'lime' },
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="p-3 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-1">
                <Icon className={`w-4 h-4 text-${stat.color}-500`} />
                <span className="text-xs text-muted-foreground truncate">{stat.label}</span>
              </div>
              <p className="text-lg font-bold">{stat.value}</p>
            </Card>
          );
        })}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Sidebar - Quick Info */}
        <div className="lg:col-span-1 space-y-4">
          {/* Timeline Info */}
          <Card className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-4 h-4" style={{ color: stream.color }} />
              <h3 className="font-semibold">Thời gian</h3>
            </div>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-muted-foreground mb-1">Bắt đầu</p>
                <p className="font-medium">{new Date(stream.timeline.startDate).toLocaleDateString('vi-VN')}</p>
              </div>
              {stream.timeline.endDate && (
                <div>
                  <p className="text-muted-foreground mb-1">Kết thúc</p>
                  <p className="font-medium">{new Date(stream.timeline.endDate).toLocaleDateString('vi-VN')}</p>
                </div>
              )}
              <div>
                <p className="text-muted-foreground mb-1">Cập nhật</p>
                <p className="font-medium">{new Date(stream.timeline.lastUpdate).toLocaleDateString('vi-VN')}</p>
              </div>
              <div className="pt-3 border-t border-border">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Thời lượng</span>
                  <span className="font-medium">
                    {Math.ceil((new Date(stream.timeline.endDate!).getTime() - new Date(stream.timeline.startDate).getTime()) / (1000 * 60 * 60 * 24))} ngày
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* Collaborators */}
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" style={{ color: stream.color }} />
                <h3 className="font-semibold">Cộng tác viên</h3>
              </div>
              <button className="p-1.5 hover:bg-secondary rounded-lg transition-colors">
                <UserPlus className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2">
              {collaborators.slice(0, 5).map((collab) => (
                <div key={collab.id} className="flex items-center gap-2 p-2 hover:bg-secondary rounded-lg transition-colors">
                  <img src={collab.avatar} alt={collab.name} className="w-8 h-8 rounded-full" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{collab.name}</p>
                    <span className={`text-xs px-1.5 py-0.5 rounded ${getRoleColor(collab.role)}`}>
                      {collab.role}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-3 px-3 py-2 bg-secondary hover:bg-secondary/80 rounded-lg text-sm transition-colors">
              Xem tất cả ({collaborators.length})
            </button>
          </Card>

          {/* Quick Actions */}
          <Card className="p-5">
            <h3 className="font-semibold mb-3">Hành động nhanh</h3>
            <div className="space-y-2">
              <button 
                onClick={() => setShowAddArticle(true)}
                className="w-full px-3 py-2 text-white rounded-lg transition-all flex items-center justify-center gap-2 text-sm"
                style={{ backgroundColor: stream.color }}
              >
                <Plus className="w-4 h-4" />
                Thêm bài viết
              </button>
              <button className="w-full px-3 py-2 bg-secondary hover:bg-secondary/80 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm">
                <Download className="w-4 h-4" />
                Xuất báo cáo
              </button>
              <button className="w-full px-3 py-2 bg-secondary hover:bg-secondary/80 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm">
                <Copy className="w-4 h-4" />
                Nhân bản
              </button>
              <button className="w-full px-3 py-2 border border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm">
                <Archive className="w-4 h-4" />
                Lưu trữ
              </button>
            </div>
          </Card>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-3 space-y-6">
          {/* Tabs */}
          <Card className="p-2">
            <div className="flex gap-2 overflow-x-auto">
              {[
                { key: 'overview', label: 'Tổng quan', icon: BarChart3 },
                { key: 'articles', label: 'Bài viết', icon: FileText, badge: articles.length },
                { key: 'analytics', label: 'Phân tích', icon: TrendingUp },
                { key: 'activity', label: 'Hoạt động', icon: Activity, badge: streamEvents.length },
                { key: 'settings', label: 'Cài đặt', icon: Settings },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setSelectedTab(tab.key as any)}
                    className={`px-4 py-2.5 rounded-xl font-medium transition-all flex items-center gap-2 whitespace-nowrap ${
                      selectedTab === tab.key
                        ? 'text-white shadow-lg'
                        : 'hover:bg-secondary'
                    }`}
                    style={selectedTab === tab.key ? { backgroundColor: stream.color } : {}}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                    {tab.badge && (
                      <span className={`px-1.5 py-0.5 rounded-full text-xs ${
                        selectedTab === tab.key ? 'bg-white/20' : 'bg-secondary'
                      }`}>
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </Card>

          {/* Overview Tab */}
          {selectedTab === 'overview' && (
            <div className="space-y-6">
              {/* Performance Chart */}
              <Card className="p-6">
                <h3 className="font-semibold text-lg mb-4">Hiệu suất 7 ngày qua</h3>
                <div className="h-64 flex items-end justify-between gap-2">
                  {[65, 78, 72, 85, 92, 88, 95].map((value, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center gap-2">
                      <div className="relative w-full group">
                        <div 
                          className="w-full rounded-t-lg transition-all hover:opacity-80 cursor-pointer"
                          style={{ 
                            height: `${value * 2.5}px`,
                            backgroundColor: stream.color
                          }}
                        />
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          {value * 100} views
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'][index]}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Top Articles */}
              <Card className="p-6">
                <h3 className="font-semibold text-lg mb-4">Bài viết nổi bật</h3>
                <div className="space-y-3">
                  {articles
                    .filter(a => a.status === 'published')
                    .sort((a, b) => b.views - a.views)
                    .slice(0, 5)
                    .map((article, index) => (
                      <div key={article.id} className="flex items-center gap-3 p-3 bg-secondary rounded-xl hover:shadow-md transition-shadow">
                        <div 
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold flex-shrink-0"
                          style={{ backgroundColor: stream.color }}
                        >
                          {index + 1}
                        </div>
                        {article.thumbnail && (
                          <img src={article.thumbnail} alt={article.title} className="w-16 h-12 object-cover rounded-lg flex-shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{article.title}</p>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                            <span className="flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              {article.views}
                            </span>
                            <span className="flex items-center gap-1">
                              <Heart className="w-3 h-3" />
                              {article.likes}
                            </span>
                            <span className="flex items-center gap-1">
                              <TrendingUp className="w-3 h-3" />
                              {article.engagement}%
                            </span>
                          </div>
                        </div>
                        <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                          <ExternalLink className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                </div>
              </Card>

              {/* Recent Activity */}
              <Card className="p-6">
                <h3 className="font-semibold text-lg mb-4">Hoạt động gần đây</h3>
                <div className="space-y-3">
                  {streamEvents.slice(0, 5).map((event) => (
                    <div key={event.id} className="flex gap-3">
                      <img src={event.user.avatar} alt={event.user.name} className="w-8 h-8 rounded-full" />
                      <div className="flex-1">
                        <p className="text-sm">
                          <span className="font-medium">{event.user.name}</span>{' '}
                          <span className="text-muted-foreground">{event.message}</span>
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {new Date(event.timestamp).toLocaleString('vi-VN')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {/* Articles Tab */}
          {selectedTab === 'articles' && (
            <div className="space-y-4">
              {/* Filter Toolbar */}
              <Card className="p-4">
                <div className="flex flex-col md:flex-row gap-3">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Tìm kiếm bài viết..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                  <div className="flex gap-2">
                    {[
                      { key: 'all', label: 'Tất cả', count: articles.length },
                      { key: 'published', label: 'Đã xuất bản', count: articles.filter(a => a.status === 'published').length },
                      { key: 'draft', label: 'Nháp', count: articles.filter(a => a.status === 'draft').length },
                    ].map((filter) => (
                      <button
                        key={filter.key}
                        onClick={() => setArticleFilter(filter.key as any)}
                        className={`px-4 py-2 rounded-xl transition-all text-sm font-medium ${
                          articleFilter === filter.key
                            ? 'text-white shadow-lg'
                            : 'bg-secondary hover:bg-secondary/80'
                        }`}
                        style={articleFilter === filter.key ? { backgroundColor: stream.color } : {}}
                      >
                        {filter.label} ({filter.count})
                      </button>
                    ))}
                  </div>
                </div>
              </Card>

              {/* Article List */}
              <ArticleListView
                articles={convertToArticles(filteredArticles)}
                onNavigate={onNavigate}
                onEdit={(id) => console.log('Edit article:', id)}
                onDelete={(id) => {
                  const articleToRemove = filteredArticles.find(a => parseInt(a.id.replace('a', '')) === id);
                  if (articleToRemove) {
                    removeArticle(articleToRemove.id);
                  }
                }}
                showCategory={false}
                showTypeFilter={false}
                showStatusFilter={false}
                showBulkActions={false}
                showSearch={false}
                viewModeToggle={true}
                enableSelection={false}
                customActions={[
                  {
                    label: 'Xóa khỏi dòng',
                    icon: X,
                    onClick: (article) => {
                      const streamArticle = articles.find(a => parseInt(a.id.replace('a', '')) === article.id);
                      if (streamArticle) {
                        removeArticle(streamArticle.id);
                      }
                    },
                    color: '#EF4444'
                  }
                ]}
                emptyMessage="Không tìm thấy bài viết nào trong dòng sự kiện"
                highlightColor={stream.color}
              />
            </div>
          )}

          {/* Analytics Tab */}
          {selectedTab === 'analytics' && (
            <div className="space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Avg. Views/Article', value: Math.round(stream.stats.totalViews / stream.stats.publishedArticles), color: 'blue' },
                  { label: 'Engagement Rate', value: `${stream.stats.avgEngagement}%`, color: 'green' },
                  { label: 'Completion Rate', value: `${Math.round((stream.stats.publishedArticles / stream.stats.totalArticles) * 100)}%`, color: 'purple' },
                  { label: 'Growth Rate', value: '+24%', color: 'orange' },
                ].map((metric, index) => (
                  <Card key={index} className={`p-6 bg-${metric.color}-50 dark:bg-${metric.color}-900/20`}>
                    <p className={`text-sm text-${metric.color}-600 dark:text-${metric.color}-400 mb-2`}>{metric.label}</p>
                    <p className="text-3xl font-bold">{metric.value}</p>
                  </Card>
                ))}
              </div>

              {/* Article Performance Comparison */}
              <Card className="p-6">
                <h3 className="font-semibold text-lg mb-4">So sánh hiệu suất bài viết</h3>
                <div className="space-y-4">
                  {articles.filter(a => a.status === 'published').map((article) => (
                    <div key={article.id}>
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium truncate flex-1">{article.title}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{article.views} views</span>
                          <span>{article.engagement}%</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <div className="text-xs text-muted-foreground mb-1">Views</div>
                          <div className="w-full bg-secondary rounded-full h-2">
                            <div
                              className="h-full rounded-full bg-blue-500"
                              style={{ width: `${(article.views / Math.max(...articles.filter(a => a.status === 'published').map(a => a.views))) * 100}%` }}
                            />
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground mb-1">Likes</div>
                          <div className="w-full bg-secondary rounded-full h-2">
                            <div
                              className="h-full rounded-full bg-red-500"
                              style={{ width: `${(article.likes / Math.max(...articles.filter(a => a.status === 'published').map(a => a.likes))) * 100}%` }}
                            />
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground mb-1">Engagement</div>
                          <div className="w-full bg-secondary rounded-full h-2">
                            <div
                              className="h-full rounded-full"
                              style={{ 
                                width: `${(article.engagement / Math.max(...articles.filter(a => a.status === 'published').map(a => a.engagement))) * 100}%`,
                                backgroundColor: stream.color
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Engagement Breakdown */}
              <Card className="p-6">
                <h3 className="font-semibold text-lg mb-4">Phân tích tương tác</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium mb-3">Theo loại bài viết</h4>
                    <div className="space-y-2">
                      {['announcement', 'analysis', 'guide', 'interview'].map((type) => {
                        const count = articles.filter(a => a.type === type && a.status === 'published').length;
                        const total = articles.filter(a => a.status === 'published').length;
                        return (
                          <div key={type}>
                            <div className="flex items-center justify-between text-sm mb-1">
                              <span>{getTypeLabel(type)}</span>
                              <span className="text-muted-foreground">{count}</span>
                            </div>
                            <div className="w-full bg-secondary rounded-full h-2">
                              <div
                                className="h-full rounded-full"
                                style={{ 
                                  width: `${(count / total) * 100}%`,
                                  backgroundColor: stream.color
                                }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-3">Theo tác giả</h4>
                    <div className="space-y-2">
                      {Array.from(new Set(articles.filter(a => a.status === 'published').map(a => a.author.name))).map((authorName) => {
                        const count = articles.filter(a => a.author.name === authorName && a.status === 'published').length;
                        const total = articles.filter(a => a.status === 'published').length;
                        return (
                          <div key={authorName}>
                            <div className="flex items-center justify-between text-sm mb-1">
                              <span className="truncate">{authorName}</span>
                              <span className="text-muted-foreground">{count}</span>
                            </div>
                            <div className="w-full bg-secondary rounded-full h-2">
                              <div
                                className="h-full rounded-full"
                                style={{ 
                                  width: `${(count / total) * 100}%`,
                                  backgroundColor: stream.color
                                }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Activity Tab */}
          {selectedTab === 'activity' && (
            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-4">Lịch sử hoạt động</h3>
              <div className="space-y-4">
                {streamEvents.map((event, index) => (
                  <div key={event.id} className="relative">
                    {index < streamEvents.length - 1 && (
                      <div className="absolute left-4 top-12 bottom-0 w-0.5 bg-border" />
                    )}
                    <div className="flex gap-4">
                      <img src={event.user.avatar} alt={event.user.name} className="w-10 h-10 rounded-full flex-shrink-0 relative z-10" />
                      <div className="flex-1 pb-4">
                        <div className="p-4 bg-secondary rounded-xl">
                          <p className="text-sm mb-1">
                            <span className="font-medium">{event.user.name}</span>{' '}
                            <span className="text-muted-foreground">{event.message}</span>
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(event.timestamp).toLocaleString('vi-VN')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Settings Tab */}
          {selectedTab === 'settings' && (
            <div className="space-y-6">
              <Card className="p-6">
                <h3 className="font-semibold text-lg mb-4">Cài đặt chung</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-secondary rounded-xl">
                    <div>
                      <p className="font-medium">Tự động xuất bản</p>
                      <p className="text-sm text-muted-foreground">Tự động xuất bản bài viết mới</p>
                    </div>
                    <input type="checkbox" className="w-5 h-5 rounded" />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-secondary rounded-xl">
                    <div>
                      <p className="font-medium">Thông báo email</p>
                      <p className="text-sm text-muted-foreground">Nhận email khi có bài viết mới</p>
                    </div>
                    <input type="checkbox" defaultChecked className="w-5 h-5 rounded" />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-secondary rounded-xl">
                    <div>
                      <p className="font-medium">SEO tự động</p>
                      <p className="text-sm text-muted-foreground">Tự động tối ưu SEO cho bài viết</p>
                    </div>
                    <input type="checkbox" defaultChecked className="w-5 h-5 rounded" />
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="font-semibold text-lg mb-4 text-red-600">Vùng nguy hiểm</h3>
                <div className="space-y-3">
                  <button className="w-full px-4 py-3 border border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors flex items-center justify-between">
                    <div className="text-left">
                      <p className="font-medium">Lưu trữ dòng sự kiện</p>
                      <p className="text-sm">Dòng sẽ không hiển thị công khai</p>
                    </div>
                    <Archive className="w-5 h-5" />
                  </button>
                  <button className="w-full px-4 py-3 border border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors flex items-center justify-between">
                    <div className="text-left">
                      <p className="font-medium">Xóa dòng sự kiện</p>
                      <p className="text-sm">Hành động này không thể hoàn tác</p>
                    </div>
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* Add Article Modal */}
      {showAddArticle && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">Thêm bài viết vào dòng</h3>
                <button 
                  onClick={() => setShowAddArticle(false)}
                  className="p-2 hover:bg-secondary rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Tìm kiếm bài viết..."
                  className="w-full pl-10 pr-4 py-2.5 bg-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div className="space-y-2">
                {availableArticles.map((article) => (
                  <button
                    key={article.id}
                    className="w-full p-4 bg-secondary hover:bg-muted rounded-xl text-left transition-colors flex items-center justify-between group"
                  >
                    <div>
                      <p className="font-medium mb-1">{article.title}</p>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-xs ${getTypeColor(article.type)}`}>
                          {getTypeLabel(article.type)}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-xs ${
                          article.status === 'published'
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                            : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400'
                        }`}>
                          {article.status === 'published' ? 'Đã xuất bản' : 'Nháp'}
                        </span>
                      </div>
                    </div>
                    <Plus className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">Chia sẻ dòng sự kiện</h3>
                <button 
                  onClick={() => setShowShareModal(false)}
                  className="p-2 hover:bg-secondary rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Link chia sẻ</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={`https://cms.example.com/stream/${stream.slug}`}
                      readOnly
                      className="flex-1 px-4 py-2.5 bg-secondary border border-border rounded-xl"
                    />
                    <button className="px-4 py-2.5 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors">
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Chia sẻ qua</label>
                  <div className="grid grid-cols-4 gap-2">
                    {['Facebook', 'Twitter', 'LinkedIn', 'Email'].map((platform) => (
                      <button
                        key={platform}
                        className="p-3 bg-secondary hover:bg-muted rounded-xl transition-colors text-sm"
                      >
                        {platform}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </PageWrapper>
  );
}