import { useState } from 'react';
import { 
  CheckCircle2, XCircle, Clock, AlertCircle, MessageSquare, 
  Eye, Edit3, Send, ArrowRight, Users, Calendar, Filter,
  CheckSquare, Sparkles, History, Tag, User, Search,
  MoreVertical, Download, RefreshCw, TrendingUp, FileText,
  Zap, Star, ChevronDown, Mail, Bell, ArrowUpRight,
  Shield, BarChart3, Flag, Info, ExternalLink, Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Types
export type ModerationStatus = 'pending' | 'approved' | 'rejected' | 'flagged' | 'reviewing' | 'published';
export type ContentType = 'article' | 'video' | 'gallery' | 'document' | 'event' | 'podcast' | 'recruitment' | 'legal';
export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export interface ModerationAction {
  id: string;
  action: 'submit' | 'approve' | 'reject' | 'request_changes' | 'flag' | 'assign' | 'publish';
  userId: string;
  userName: string;
  userAvatar?: string;
  timestamp: Date;
  comment?: string;
  level?: number;
}

export interface ContentItem {
  id: string;
  title: string;
  type: ContentType;
  author: string;
  authorId: string;
  authorAvatar?: string;
  category: string;
  status: ModerationStatus;
  priority: Priority;
  submittedAt: Date;
  scheduledPublish?: Date;
  assignedTo?: {
    id: string;
    name: string;
    avatar?: string;
  };
  currentLevel: number;
  requiredLevel: number;
  moderationHistory: ModerationAction[];
  commentsCount: number;
  viewsCount: number;
  tags: string[];
  excerpt?: string;
  thumbnail?: string;
  flaggedIssues?: string[];
  aiScore?: number; // AI quality score 0-100
  seoScore?: number; // SEO score 0-100
  wordCount?: number;
  readingTime?: number; // minutes
}

interface ContentModerationProps {
  onNavigate?: (page: any) => void;
}

export function ContentModeration({ onNavigate }: ContentModerationProps) {
  const [selectedTab, setSelectedTab] = useState<'all' | ModerationStatus>('pending');
  const [selectedType, setSelectedType] = useState<'all' | ContentType>('all');
  const [selectedPriority, setSelectedPriority] = useState<'all' | Priority>('all');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);
  const [reviewComment, setReviewComment] = useState('');
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewAction, setReviewAction] = useState<'approve' | 'reject' | 'flag' | null>(null);

  // Mock data
  const mockContent: ContentItem[] = [
    {
      id: '1',
      title: 'Hướng dẫn toàn diện về React Server Components và Next.js 14',
      type: 'article',
      author: 'Nguyễn Văn A',
      authorId: 'user1',
      category: 'Lập trình',
      status: 'pending',
      priority: 'high',
      submittedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      currentLevel: 1,
      requiredLevel: 2,
      moderationHistory: [
        {
          id: 'a1',
          action: 'submit',
          userId: 'user1',
          userName: 'Nguyễn Văn A',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        }
      ],
      commentsCount: 3,
      viewsCount: 245,
      tags: ['React', 'Next.js', 'Tutorial'],
      excerpt: 'Tìm hiểu chi tiết về React Server Components và cách tích hợp vào Next.js 14...',
      aiScore: 92,
      seoScore: 85,
      wordCount: 2450,
      readingTime: 12,
      assignedTo: {
        id: 'editor1',
        name: 'Trần Editor A',
      }
    },
    {
      id: '2',
      title: 'Top 15 công cụ AI Marketing tốt nhất năm 2024',
      type: 'article',
      author: 'Trần Thị B',
      authorId: 'user2',
      category: 'Marketing',
      status: 'flagged',
      priority: 'urgent',
      submittedAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
      currentLevel: 0,
      requiredLevel: 1,
      moderationHistory: [
        {
          id: 'a2',
          action: 'submit',
          userId: 'user2',
          userName: 'Trần Thị B',
          timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
        },
        {
          id: 'a3',
          action: 'flag',
          userId: 'editor2',
          userName: 'Lê Editor B',
          timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
          comment: 'Cần kiểm tra lại thông tin về giá cả các công cụ'
        }
      ],
      commentsCount: 5,
      viewsCount: 156,
      tags: ['AI', 'Marketing', 'Tools'],
      flaggedIssues: ['Thông tin cần kiểm chứng', 'Thiếu nguồn tham khảo'],
      aiScore: 78,
      seoScore: 72,
      wordCount: 1820,
      readingTime: 9,
    },
    {
      id: '3',
      title: 'Video: Phân tích xu hướng thiết kế UI/UX 2024',
      type: 'video',
      author: 'Lê Văn C',
      authorId: 'user3',
      category: 'Design',
      status: 'reviewing',
      priority: 'medium',
      submittedAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
      currentLevel: 1,
      requiredLevel: 2,
      moderationHistory: [
        {
          id: 'a4',
          action: 'submit',
          userId: 'user3',
          userName: 'Lê Văn C',
          timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
        }
      ],
      commentsCount: 2,
      viewsCount: 89,
      tags: ['UI/UX', 'Design', 'Trends'],
      aiScore: 88,
      seoScore: 90,
      assignedTo: {
        id: 'editor3',
        name: 'Phạm Editor C',
      }
    },
    {
      id: '4',
      title: 'Podcast: Khởi nghiệp với công nghệ Blockchain',
      type: 'podcast',
      author: 'Phạm Thị D',
      authorId: 'user4',
      category: 'Công nghệ',
      status: 'approved',
      priority: 'medium',
      submittedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      scheduledPublish: new Date(Date.now() + 12 * 60 * 60 * 1000),
      currentLevel: 2,
      requiredLevel: 2,
      moderationHistory: [
        {
          id: 'a5',
          action: 'submit',
          userId: 'user4',
          userName: 'Phạm Thị D',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
        },
        {
          id: 'a6',
          action: 'approve',
          userId: 'editor1',
          userName: 'Trần Editor A',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          comment: 'Nội dung chất lượng, approve để xuất bản'
        }
      ],
      commentsCount: 1,
      viewsCount: 234,
      tags: ['Blockchain', 'Startup', 'Podcast'],
      aiScore: 95,
      seoScore: 88,
    },
    {
      id: '5',
      title: 'Thông báo tuyển dụng Senior Frontend Developer',
      type: 'recruitment',
      author: 'HR Team',
      authorId: 'hr1',
      category: 'Tuyển dụng',
      status: 'pending',
      priority: 'high',
      submittedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
      currentLevel: 0,
      requiredLevel: 1,
      moderationHistory: [
        {
          id: 'a7',
          action: 'submit',
          userId: 'hr1',
          userName: 'HR Team',
          timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
        }
      ],
      commentsCount: 0,
      viewsCount: 45,
      tags: ['Recruitment', 'Frontend', 'Senior'],
      aiScore: 82,
      seoScore: 75,
    },
    {
      id: '6',
      title: 'Sự kiện: Tech Conference 2024 - Innovation Summit',
      type: 'event',
      author: 'Events Team',
      authorId: 'events1',
      category: 'Sự kiện',
      status: 'approved',
      priority: 'urgent',
      submittedAt: new Date(Date.now() - 48 * 60 * 60 * 1000),
      scheduledPublish: new Date(Date.now() + 2 * 60 * 60 * 1000),
      currentLevel: 2,
      requiredLevel: 2,
      moderationHistory: [
        {
          id: 'a8',
          action: 'submit',
          userId: 'events1',
          userName: 'Events Team',
          timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000),
        },
        {
          id: 'a9',
          action: 'approve',
          userId: 'editor2',
          userName: 'Lê Editor B',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
        }
      ],
      commentsCount: 4,
      viewsCount: 567,
      tags: ['Event', 'Tech', 'Conference'],
      aiScore: 90,
      seoScore: 93,
    },
  ];

  // Filter content
  const filteredContent = mockContent.filter(item => {
    const matchesTab = selectedTab === 'all' || item.status === selectedTab;
    const matchesType = selectedType === 'all' || item.type === selectedType;
    const matchesPriority = selectedPriority === 'all' || item.priority === selectedPriority;
    const matchesSearch = !searchQuery || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesTab && matchesType && matchesPriority && matchesSearch;
  });

  // Stats
  const stats = {
    pending: mockContent.filter(i => i.status === 'pending').length,
    reviewing: mockContent.filter(i => i.status === 'reviewing').length,
    flagged: mockContent.filter(i => i.status === 'flagged').length,
    approved: mockContent.filter(i => i.status === 'approved').length,
    avgResponseTime: '4.2h',
    approvalRate: '87%',
  };

  const getStatusColor = (status: ModerationStatus) => {
    switch (status) {
      case 'pending': return 'yellow';
      case 'reviewing': return 'blue';
      case 'approved': return 'green';
      case 'rejected': return 'red';
      case 'flagged': return 'orange';
      case 'published': return 'purple';
      default: return 'gray';
    }
  };

  const getStatusIcon = (status: ModerationStatus) => {
    switch (status) {
      case 'pending': return Clock;
      case 'reviewing': return Eye;
      case 'approved': return CheckCircle2;
      case 'rejected': return XCircle;
      case 'flagged': return Flag;
      case 'published': return Sparkles;
      default: return AlertCircle;
    }
  };

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case 'urgent': return 'red';
      case 'high': return 'orange';
      case 'medium': return 'blue';
      case 'low': return 'gray';
    }
  };

  const getTypeIcon = (type: ContentType) => {
    switch (type) {
      case 'article': return FileText;
      case 'video': return FileText;
      case 'gallery': return FileText;
      case 'document': return FileText;
      case 'event': return Calendar;
      case 'podcast': return FileText;
      case 'recruitment': return Users;
      case 'legal': return Shield;
    }
  };

  const getTypeLabel = (type: ContentType) => {
    const labels: Record<ContentType, string> = {
      article: 'Bài viết',
      video: 'Video',
      gallery: 'Gallery',
      document: 'Tài liệu',
      event: 'Sự kiện',
      podcast: 'Podcast',
      recruitment: 'Tuyển dụng',
      legal: 'Pháp luật',
    };
    return labels[type];
  };

  const handleReview = (item: ContentItem, action: 'approve' | 'reject' | 'flag') => {
    setSelectedItem(item);
    setReviewAction(action);
    setShowReviewModal(true);
  };

  const handleSubmitReview = () => {
    console.log('Submitting review:', {
      itemId: selectedItem?.id,
      action: reviewAction,
      comment: reviewComment,
    });
    setShowReviewModal(false);
    setReviewComment('');
    setSelectedItem(null);
    setReviewAction(null);
  };

  const toggleItemSelection = (id: string) => {
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleBulkAction = (action: string) => {
    console.log('Bulk action:', action, 'for items:', selectedItems);
    setSelectedItems([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent flex items-center gap-3">
              <Shield className="w-8 h-8 text-blue-600" />
              Kiểm duyệt nội dung
            </h1>
            <p className="text-muted-foreground mt-1">
              Quản lý và phê duyệt nội dung từ tất cả các loại
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-2 rounded-xl border-2 transition-all flex items-center gap-2 ${
                showFilters 
                  ? 'bg-blue-500 text-white border-blue-500' 
                  : 'bg-white border-border/60 hover:border-blue-500'
              }`}
            >
              <Filter className="w-4 h-4" />
              Bộ lọc
            </button>
            <button className="px-4 py-2 bg-white border-2 border-border/60 rounded-xl hover:border-blue-500 transition-all flex items-center gap-2">
              <Download className="w-4 h-4" />
              Xuất báo cáo
            </button>
            <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/30 transition-all flex items-center gap-2">
              <RefreshCw className="w-4 h-4" />
              Làm mới
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white/80 backdrop-blur-sm border-2 border-yellow-200 rounded-2xl p-6 hover:shadow-lg transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Chờ duyệt</p>
                <p className="text-3xl font-bold text-yellow-600 mt-1">{stats.pending}</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-xl">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2 text-sm">
              <TrendingUp className="w-4 h-4 text-yellow-600" />
              <span className="text-yellow-600">+12% so với tuần trước</span>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm border-2 border-blue-200 rounded-2xl p-6 hover:shadow-lg transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Đang xem xét</p>
                <p className="text-3xl font-bold text-blue-600 mt-1">{stats.reviewing}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <Eye className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="w-4 h-4" />
              <span>3 reviewer đang xử lý</span>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm border-2 border-orange-200 rounded-2xl p-6 hover:shadow-lg transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Bị gắn cờ</p>
                <p className="text-3xl font-bold text-orange-600 mt-1">{stats.flagged}</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-xl">
                <Flag className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2 text-sm text-orange-600">
              <AlertCircle className="w-4 h-4" />
              <span>Cần xem xét ngay</span>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm border-2 border-green-200 rounded-2xl p-6 hover:shadow-lg transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Đã duyệt</p>
                <p className="text-3xl font-bold text-green-600 mt-1">{stats.approved}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-xl">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2 text-sm text-green-600">
              <Sparkles className="w-4 h-4" />
              <span>Tỷ lệ duyệt: {stats.approvalRate}</span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white/80 backdrop-blur-sm border-2 border-border/60 rounded-2xl p-6 overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Loại nội dung</label>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value as any)}
                    className="w-full px-4 py-2 border-2 border-border/60 rounded-xl focus:outline-none focus:border-blue-500 transition-all"
                  >
                    <option value="all">Tất cả</option>
                    <option value="article">Bài viết</option>
                    <option value="video">Video</option>
                    <option value="gallery">Gallery</option>
                    <option value="event">Sự kiện</option>
                    <option value="podcast">Podcast</option>
                    <option value="recruitment">Tuyển dụng</option>
                    <option value="legal">Pháp luật</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Độ ưu tiên</label>
                  <select
                    value={selectedPriority}
                    onChange={(e) => setSelectedPriority(e.target.value as any)}
                    className="w-full px-4 py-2 border-2 border-border/60 rounded-xl focus:outline-none focus:border-blue-500 transition-all"
                  >
                    <option value="all">Tất cả</option>
                    <option value="urgent">Khẩn cấp</option>
                    <option value="high">Cao</option>
                    <option value="medium">Trung bình</option>
                    <option value="low">Thấp</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Tìm kiếm</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Tìm theo tiêu đề, tác giả, tags..."
                      className="w-full pl-10 pr-4 py-2 border-2 border-border/60 rounded-xl focus:outline-none focus:border-blue-500 transition-all"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {[
            { id: 'all', label: 'Tất cả', count: mockContent.length },
            { id: 'pending', label: 'Chờ duyệt', count: stats.pending },
            { id: 'reviewing', label: 'Đang xem xét', count: stats.reviewing },
            { id: 'flagged', label: 'Bị gắn cờ', count: stats.flagged },
            { id: 'approved', label: 'Đã duyệt', count: stats.approved },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id as any)}
              className={`px-6 py-3 rounded-xl border-2 transition-all whitespace-nowrap flex items-center gap-2 ${
                selectedTab === tab.id
                  ? 'bg-blue-500 text-white border-blue-500 shadow-lg shadow-blue-500/30'
                  : 'bg-white border-border/60 hover:border-blue-500'
              }`}
            >
              {tab.label}
              <span className={`px-2 py-0.5 rounded-lg text-xs font-medium ${
                selectedTab === tab.id ? 'bg-white/20' : 'bg-muted'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Bulk Actions Bar */}
        {selectedItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-blue-500 text-white rounded-2xl p-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <span className="font-medium">{selectedItems.length} nội dung đã chọn</span>
              <button
                onClick={() => setSelectedItems([])}
                className="text-sm hover:underline"
              >
                Bỏ chọn
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleBulkAction('approve')}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                Duyệt tất cả
              </button>
              <button
                onClick={() => handleBulkAction('flag')}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all flex items-center gap-2"
              >
                <Flag className="w-4 h-4" />
                Gắn cờ
              </button>
              <button
                onClick={() => handleBulkAction('assign')}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all flex items-center gap-2"
              >
                <Users className="w-4 h-4" />
                Giao việc
              </button>
            </div>
          </motion.div>
        )}

        {/* Content List */}
        <div className="bg-white/80 backdrop-blur-sm border-2 border-border/60 rounded-2xl overflow-hidden">
          {filteredContent.length === 0 ? (
            <div className="p-16 text-center">
              <AlertCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold mb-2">Không có nội dung</h3>
              <p className="text-muted-foreground">
                {searchQuery ? 'Không tìm thấy kết quả phù hợp' : 'Chưa có nội dung nào cần kiểm duyệt'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border/60">
              {filteredContent.map((item) => {
                const StatusIcon = getStatusIcon(item.status);
                const TypeIcon = getTypeIcon(item.type);
                const statusColor = getStatusColor(item.status);
                const priorityColor = getPriorityColor(item.priority);
                const isSelected = selectedItems.includes(item.id);

                return (
                  <motion.div
                    key={item.id}
                    layout
                    className={`p-6 hover:bg-muted/30 transition-all ${
                      isSelected ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      {/* Checkbox */}
                      <div className="pt-1">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleItemSelection(item.id)}
                          className="w-5 h-5 rounded border-2 border-border/60"
                        />
                      </div>

                      {/* Content Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-3 mb-3">
                          {/* Type Icon */}
                          <div className={`p-2 bg-${statusColor}-50 rounded-lg`}>
                            <TypeIcon className={`w-5 h-5 text-${statusColor}-600`} />
                          </div>

                          <div className="flex-1 min-w-0">
                            {/* Title */}
                            <h3 className="font-semibold text-lg mb-2 line-clamp-1">
                              {item.title}
                            </h3>

                            {/* Meta Info */}
                            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3 flex-wrap">
                              <div className="flex items-center gap-1.5">
                                <User className="w-4 h-4" />
                                {item.author}
                              </div>
                              <div className="flex items-center gap-1.5">
                                <Layers className="w-4 h-4" />
                                {getTypeLabel(item.type)}
                              </div>
                              <div className="flex items-center gap-1.5">
                                <Calendar className="w-4 h-4" />
                                {new Date(item.submittedAt).toLocaleString('vi-VN')}
                              </div>
                              {item.wordCount && (
                                <div className="flex items-center gap-1.5">
                                  <FileText className="w-4 h-4" />
                                  {item.wordCount} từ • {item.readingTime} phút đọc
                                </div>
                              )}
                              <div className="flex items-center gap-1.5">
                                <Eye className="w-4 h-4" />
                                {item.viewsCount} lượt xem
                              </div>
                              <div className="flex items-center gap-1.5">
                                <MessageSquare className="w-4 h-4" />
                                {item.commentsCount} bình luận
                              </div>
                            </div>

                            {/* Excerpt */}
                            {item.excerpt && (
                              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                                {item.excerpt}
                              </p>
                            )}

                            {/* Tags & Scores */}
                            <div className="flex items-center gap-3 flex-wrap">
                              {/* Tags */}
                              <div className="flex items-center gap-2">
                                {item.tags.slice(0, 3).map((tag) => (
                                  <span
                                    key={tag}
                                    className="px-2 py-1 bg-muted rounded-lg text-xs"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>

                              {/* AI & SEO Scores */}
                              {item.aiScore && (
                                <div className="flex items-center gap-1.5 px-2 py-1 bg-purple-50 rounded-lg">
                                  <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                                  <span className="text-xs font-medium text-purple-600">
                                    AI: {item.aiScore}%
                                  </span>
                                </div>
                              )}
                              {item.seoScore && (
                                <div className="flex items-center gap-1.5 px-2 py-1 bg-green-50 rounded-lg">
                                  <BarChart3 className="w-3.5 h-3.5 text-green-600" />
                                  <span className="text-xs font-medium text-green-600">
                                    SEO: {item.seoScore}%
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* Flagged Issues */}
                            {item.flaggedIssues && item.flaggedIssues.length > 0 && (
                              <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded-xl">
                                <div className="flex items-start gap-2">
                                  <Flag className="w-4 h-4 text-orange-600 mt-0.5" />
                                  <div className="flex-1">
                                    <p className="text-sm font-medium text-orange-900 mb-1">
                                      Vấn đề cần xử lý:
                                    </p>
                                    <ul className="text-sm text-orange-700 space-y-1">
                                      {item.flaggedIssues.map((issue, idx) => (
                                        <li key={idx}>• {issue}</li>
                                      ))}
                                    </ul>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Assigned To */}
                            {item.assignedTo && (
                              <div className="mt-3 flex items-center gap-2 text-sm">
                                <Users className="w-4 h-4 text-muted-foreground" />
                                <span className="text-muted-foreground">Giao cho:</span>
                                <span className="font-medium">{item.assignedTo.name}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Status & Actions */}
                      <div className="flex flex-col items-end gap-3">
                        {/* Status Badge */}
                        <div className={`px-3 py-1.5 bg-${statusColor}-100 text-${statusColor}-700 rounded-lg flex items-center gap-2 whitespace-nowrap`}>
                          <StatusIcon className="w-4 h-4" />
                          <span className="text-sm font-medium">
                            {item.status === 'pending' && 'Chờ duyệt'}
                            {item.status === 'reviewing' && 'Đang xem xét'}
                            {item.status === 'approved' && 'Đã duyệt'}
                            {item.status === 'rejected' && 'Từ chối'}
                            {item.status === 'flagged' && 'Gắn cờ'}
                            {item.status === 'published' && 'Đã xuất bản'}
                          </span>
                        </div>

                        {/* Priority Badge */}
                        <div className={`px-3 py-1.5 bg-${priorityColor}-100 text-${priorityColor}-700 rounded-lg text-sm font-medium`}>
                          {item.priority === 'urgent' && '🔥 Khẩn cấp'}
                          {item.priority === 'high' && '⚡ Cao'}
                          {item.priority === 'medium' && '📌 Trung bình'}
                          {item.priority === 'low' && '💡 Thấp'}
                        </div>

                        {/* Progress */}
                        <div className="text-sm text-muted-foreground">
                          Cấp {item.currentLevel}/{item.requiredLevel}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleReview(item, 'approve')}
                            className="p-2 bg-green-50 hover:bg-green-100 text-green-600 rounded-lg transition-all"
                            title="Duyệt"
                          >
                            <CheckCircle2 className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleReview(item, 'flag')}
                            className="p-2 bg-orange-50 hover:bg-orange-100 text-orange-600 rounded-lg transition-all"
                            title="Gắn cờ"
                          >
                            <Flag className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleReview(item, 'reject')}
                            className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-all"
                            title="Từ chối"
                          >
                            <XCircle className="w-5 h-5" />
                          </button>
                          <button
                            className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-all"
                            title="Xem chi tiết"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                          <button className="p-2 bg-muted hover:bg-muted/80 rounded-lg transition-all">
                            <MoreVertical className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Review Modal */}
      <AnimatePresence>
        {showReviewModal && selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6 z-50"
            onClick={() => setShowReviewModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-auto"
            >
              <div className="p-6 border-b border-border/60">
                <h2 className="text-2xl font-bold">
                  {reviewAction === 'approve' && '✅ Duyệt nội dung'}
                  {reviewAction === 'reject' && '❌ Từ chối nội dung'}
                  {reviewAction === 'flag' && '🚩 Gắn cờ nội dung'}
                </h2>
                <p className="text-muted-foreground mt-1">{selectedItem.title}</p>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block font-medium mb-2">
                    Nhận xét {reviewAction === 'reject' && <span className="text-red-500">*</span>}
                  </label>
                  <textarea
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder={
                      reviewAction === 'approve' 
                        ? 'Nhận xét về nội dung (tùy chọn)...'
                        : reviewAction === 'reject'
                        ? 'Lý do từ chối (bắt buộc)...'
                        : 'Mô tả vấn đề cần xử lý...'
                    }
                    rows={5}
                    className="w-full px-4 py-3 border-2 border-border/60 rounded-xl focus:outline-none focus:border-blue-500 transition-all resize-none"
                  />
                </div>

                {reviewAction === 'approve' && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                    <div className="flex items-start gap-3">
                      <Info className="w-5 h-5 text-green-600 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm text-green-900 font-medium">
                          Nội dung sẽ được chuyển sang trạng thái "Đã duyệt"
                        </p>
                        <p className="text-sm text-green-700 mt-1">
                          Tác giả sẽ nhận được thông báo và có thể xuất bản nội dung
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {reviewAction === 'reject' && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm text-red-900 font-medium">
                          Nội dung sẽ bị từ chối
                        </p>
                        <p className="text-sm text-red-700 mt-1">
                          Tác giả sẽ nhận được thông báo kèm lý do từ chối
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-6 border-t border-border/60 flex items-center justify-end gap-3">
                <button
                  onClick={() => setShowReviewModal(false)}
                  className="px-6 py-2.5 border-2 border-border/60 rounded-xl hover:border-blue-500 transition-all"
                >
                  Hủy
                </button>
                <button
                  onClick={handleSubmitReview}
                  disabled={reviewAction === 'reject' && !reviewComment}
                  className={`px-6 py-2.5 rounded-xl transition-all flex items-center gap-2 ${
                    reviewAction === 'approve'
                      ? 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:shadow-lg hover:shadow-green-500/30'
                      : reviewAction === 'reject'
                      ? 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:shadow-lg hover:shadow-red-500/30'
                      : 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:shadow-lg hover:shadow-orange-500/30'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <Send className="w-4 h-4" />
                  Xác nhận
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
