import { useState } from 'react';
import { 
  CheckCircle2, XCircle, Clock, AlertCircle, MessageSquare, 
  Eye, Edit3, Send, ArrowRight, Users, Calendar, Filter,
  CheckSquare, Sparkles, History, Tag, User, Search,
  MoreVertical, Download, RefreshCw, TrendingUp, FileText,
  Zap, Star, ChevronDown, Mail, Bell, ArrowUpRight,
  Shield, BarChart3, Flag, Info, ExternalLink, Layers,
  FastForward, PlayCircle, PauseCircle, SkipForward, Timer
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';

// Types
export type QueueStatus = 'new' | 'in-review' | 'flagged' | 'ready';
export type ContentType = 'article' | 'video' | 'gallery' | 'document' | 'event' | 'podcast' | 'recruitment' | 'legal';
export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export interface QueueItem {
  id: string;
  title: string;
  type: ContentType;
  author: string;
  authorId: string;
  category: string;
  status: QueueStatus;
  priority: Priority;
  submittedAt: Date;
  waitTime: number; // in minutes
  assignedTo?: string;
  thumbnail?: string;
  wordCount?: number;
  aiScore?: number;
  tags: string[];
}

interface ContentModerationProps {
  onNavigate?: (page: any) => void;
}

export function ContentModeration({ onNavigate }: ContentModerationProps) {
  const { t } = useLanguage();
  const [selectedView, setSelectedView] = useState<'queue' | 'assigned' | 'flagged'>('queue');
  const [selectedType, setSelectedType] = useState<'all' | ContentType>('all');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [sortBy, setSortBy] = useState<'priority' | 'time' | 'type'>('priority');
  const [quickReviewMode, setQuickReviewMode] = useState(false);

  // Mock data
  const mockQueue: QueueItem[] = [
    {
      id: '1',
      title: 'Hướng dẫn toàn diện về React Server Components và Next.js 14',
      type: 'article',
      author: 'Nguyễn Văn A',
      authorId: 'user1',
      category: 'Lập trình',
      status: 'new',
      priority: 'urgent',
      submittedAt: new Date(Date.now() - 15 * 60 * 1000),
      waitTime: 15,
      wordCount: 2450,
      aiScore: 92,
      tags: ['React', 'Next.js', 'Tutorial'],
    },
    {
      id: '2',
      title: 'Top 15 công cụ AI Marketing tốt nhất năm 2024',
      type: 'article',
      author: 'Trần Thị B',
      authorId: 'user2',
      category: 'Marketing',
      status: 'flagged',
      priority: 'high',
      submittedAt: new Date(Date.now() - 45 * 60 * 1000),
      waitTime: 45,
      wordCount: 1820,
      aiScore: 78,
      tags: ['AI', 'Marketing'],
    },
    {
      id: '3',
      title: 'Video: Phân tích xu hướng thiết kế UI/UX 2024',
      type: 'video',
      author: 'Lê Văn C',
      authorId: 'user3',
      category: 'Design',
      status: 'in-review',
      priority: 'medium',
      submittedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      waitTime: 120,
      assignedTo: 'Editor A',
      aiScore: 88,
      tags: ['UI/UX', 'Design'],
    },
    {
      id: '4',
      title: 'Podcast: Khởi nghiệp với công nghệ Blockchain',
      type: 'podcast',
      author: 'Phạm Thị D',
      authorId: 'user4',
      category: 'Công nghệ',
      status: 'ready',
      priority: 'low',
      submittedAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
      waitTime: 240,
      assignedTo: 'Editor B',
      aiScore: 95,
      tags: ['Blockchain', 'Startup'],
    },
    {
      id: '5',
      title: 'Thông báo tuyển dụng Senior Frontend Developer',
      type: 'recruitment',
      author: 'HR Team',
      authorId: 'hr1',
      category: 'Tuyển dụng',
      status: 'new',
      priority: 'high',
      submittedAt: new Date(Date.now() - 30 * 60 * 1000),
      waitTime: 30,
      aiScore: 82,
      tags: ['Recruitment', 'Frontend'],
    },
    {
      id: '6',
      title: 'Sự kiện: Tech Conference 2024 - Innovation Summit',
      type: 'event',
      author: 'Events Team',
      authorId: 'events1',
      category: 'Sự kiện',
      status: 'new',
      priority: 'urgent',
      submittedAt: new Date(Date.now() - 10 * 60 * 1000),
      waitTime: 10,
      aiScore: 90,
      tags: ['Event', 'Tech'],
    },
  ];

  // Filter & Sort
  const filteredQueue = mockQueue
    .filter(item => {
      const matchesView = 
        selectedView === 'queue' ? item.status !== 'flagged' :
        selectedView === 'assigned' ? !!item.assignedTo :
        selectedView === 'flagged' ? item.status === 'flagged' : true;
      
      const matchesType = selectedType === 'all' || item.type === selectedType;
      const matchesSearch = !searchQuery || 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.author.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesView && matchesType && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'priority') {
        const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      } else if (sortBy === 'time') {
        return b.waitTime - a.waitTime;
      }
      return 0;
    });

  // Stats
  const stats = {
    total: mockQueue.length,
    new: mockQueue.filter(i => i.status === 'new').length,
    inReview: mockQueue.filter(i => i.status === 'in-review').length,
    flagged: mockQueue.filter(i => i.status === 'flagged').length,
    ready: mockQueue.filter(i => i.status === 'ready').length,
    avgWaitTime: Math.round(mockQueue.reduce((sum, i) => sum + i.waitTime, 0) / mockQueue.length),
  };

  const getStatusColor = (status: QueueStatus) => {
    switch (status) {
      case 'new': return 'blue';
      case 'in-review': return 'yellow';
      case 'flagged': return 'red';
      case 'ready': return 'green';
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
      case 'video': return PlayCircle;
      case 'gallery': return Layers;
      case 'document': return FileText;
      case 'event': return Calendar;
      case 'podcast': return PlayCircle;
      case 'recruitment': return Users;
      case 'legal': return Shield;
    }
  };

  const handleQuickAction = (itemId: string, action: 'approve' | 'review' | 'flag') => {
    console.log('Quick action:', action, 'for item:', itemId);
  };

  const toggleItemSelection = (id: string) => {
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent flex items-center gap-3">
              <Zap className="w-8 h-8 text-blue-600" />
              Hàng đợi kiểm duyệt
            </h1>
            <p className="text-muted-foreground mt-1">
              Xử lý nhanh nội dung chờ duyệt • Thời gian chờ trung bình: {stats.avgWaitTime} phút
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-border/60 rounded-xl">
              <div className={`w-2 h-2 rounded-full ${autoRefresh ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
              <span className="text-sm">{autoRefresh ? 'Auto-refresh ON' : 'Auto-refresh OFF'}</span>
              <button
                onClick={() => setAutoRefresh(!autoRefresh)}
                className="ml-2 text-xs text-blue-600 hover:text-blue-700"
              >
                Toggle
              </button>
            </div>

            <button
              onClick={() => setQuickReviewMode(!quickReviewMode)}
              className={`px-4 py-2 rounded-xl border-2 transition-all flex items-center gap-2 ${
                quickReviewMode 
                  ? 'bg-purple-500 text-white border-purple-500' 
                  : 'bg-white border-border/60 hover:border-purple-500'
              }`}
            >
              <FastForward className="w-4 h-4" />
              Quick Review
            </button>

            <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/30 transition-all flex items-center gap-2">
              <RefreshCw className="w-4 h-4" />
              Làm mới
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-white/80 backdrop-blur-sm border-2 border-blue-200 rounded-xl p-4 hover:shadow-lg transition-all">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-2xl font-bold text-blue-600">{stats.new}</span>
            </div>
            <p className="text-sm text-muted-foreground">Mới</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm border-2 border-yellow-200 rounded-xl p-4 hover:shadow-lg transition-all">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Eye className="w-5 h-5 text-yellow-600" />
              </div>
              <span className="text-2xl font-bold text-yellow-600">{stats.inReview}</span>
            </div>
            <p className="text-sm text-muted-foreground">Đang xem xét</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm border-2 border-red-200 rounded-xl p-4 hover:shadow-lg transition-all">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-red-100 rounded-lg">
                <Flag className="w-5 h-5 text-red-600" />
              </div>
              <span className="text-2xl font-bold text-red-600">{stats.flagged}</span>
            </div>
            <p className="text-sm text-muted-foreground">Bị gắn cờ</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm border-2 border-green-200 rounded-xl p-4 hover:shadow-lg transition-all">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
              <span className="text-2xl font-bold text-green-600">{stats.ready}</span>
            </div>
            <p className="text-sm text-muted-foreground">Sẵn sàng</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm border-2 border-purple-200 rounded-xl p-4 hover:shadow-lg transition-all">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Timer className="w-5 h-5 text-purple-600" />
              </div>
              <span className="text-2xl font-bold text-purple-600">{stats.avgWaitTime}m</span>
            </div>
            <p className="text-sm text-muted-foreground">Chờ TB</p>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="bg-white/80 backdrop-blur-sm border-2 border-border/60 rounded-2xl p-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            {/* View Tabs */}
            <div className="flex items-center gap-2">
              {[
                { id: 'queue', label: 'Hàng đợi', icon: Clock },
                { id: 'assigned', label: 'Đã giao', icon: Users },
                { id: 'flagged', label: 'Gắn cờ', icon: Flag },
              ].map((view) => {
                const Icon = view.icon;
                return (
                  <button
                    key={view.id}
                    onClick={() => setSelectedView(view.id as any)}
                    className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
                      selectedView === view.id
                        ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                        : 'bg-muted/50 hover:bg-muted'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {view.label}
                  </button>
                );
              })}
            </div>

            {/* Search & Filters */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('placeholders.search')}
                  className="pl-9 pr-4 py-2 border-2 border-border/60 rounded-lg focus:outline-none focus:border-blue-500 transition-all w-64"
                />
              </div>

              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as any)}
                className="px-4 py-2 border-2 border-border/60 rounded-lg focus:outline-none focus:border-blue-500 transition-all"
              >
                <option value="all">Tất cả loại</option>
                <option value="article">Bài viết</option>
                <option value="video">Video</option>
                <option value="event">Sự kiện</option>
                <option value="podcast">Podcast</option>
                <option value="recruitment">Tuyển dụng</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-4 py-2 border-2 border-border/60 rounded-lg focus:outline-none focus:border-blue-500 transition-all"
              >
                <option value="priority">Ưu tiên</option>
                <option value="time">Thời gian chờ</option>
                <option value="type">Loại</option>
              </select>
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
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
              <button className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Duyệt nhanh
              </button>
              <button className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all flex items-center gap-2">
                <Users className="w-4 h-4" />
                Giao việc
              </button>
            </div>
          </motion.div>
        )}

        {/* Queue List */}
        <div className="bg-white/80 backdrop-blur-sm border-2 border-border/60 rounded-2xl overflow-hidden">
          {filteredQueue.length === 0 ? (
            <div className="p-16 text-center">
              <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Tuyệt vời! Hàng đợi trống</h3>
              <p className="text-muted-foreground">
                Không có nội dung nào cần xử lý
              </p>
            </div>
          ) : quickReviewMode ? (
            // Quick Review Mode - Compact Cards
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
              {filteredQueue.map((item) => {
                const TypeIcon = getTypeIcon(item.type);
                const statusColor = getStatusColor(item.status);
                const priorityColor = getPriorityColor(item.priority);

                return (
                  <motion.div
                    key={item.id}
                    layout
                    className="bg-gradient-to-br from-white to-gray-50 border-2 border-border/60 rounded-xl p-4 hover:shadow-lg transition-all"
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <div className={`p-2 bg-${statusColor}-50 rounded-lg`}>
                        <TypeIcon className={`w-5 h-5 text-${statusColor}-600`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm line-clamp-2 mb-1">
                          {item.title}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {item.author} • {item.waitTime}m chờ
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      <span className={`px-2 py-1 bg-${priorityColor}-100 text-${priorityColor}-700 rounded text-xs font-medium`}>
                        {item.priority === 'urgent' && '🔥'}
                        {item.priority === 'high' && '⚡'}
                        {item.priority === 'medium' && '📌'}
                        {item.priority === 'low' && '💡'}
                      </span>
                      {item.aiScore && (
                        <span className="px-2 py-1 bg-purple-50 text-purple-700 rounded text-xs">
                          AI: {item.aiScore}%
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleQuickAction(item.id, 'approve')}
                        className="flex-1 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all text-sm font-medium"
                      >
                        ✓ Duyệt
                      </button>
                      <button
                        onClick={() => handleQuickAction(item.id, 'review')}
                        className="flex-1 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all text-sm font-medium"
                      >
                        👁 Xem
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            // Standard List Mode
            <div className="divide-y divide-border/60">
              {filteredQueue.map((item) => {
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
                    <div className="flex items-center gap-4">
                      {/* Checkbox */}
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleItemSelection(item.id)}
                        className="w-5 h-5 rounded"
                      />

                      {/* Wait Time Indicator */}
                      <div className="flex flex-col items-center">
                        <Timer className={`w-5 h-5 ${
                          item.waitTime > 60 ? 'text-red-600' : 
                          item.waitTime > 30 ? 'text-orange-600' : 
                          'text-blue-600'
                        }`} />
                        <span className="text-xs font-medium mt-1">{item.waitTime}m</span>
                      </div>

                      {/* Content Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-3 mb-2">
                          <div className={`p-2 bg-${statusColor}-50 rounded-lg`}>
                            <TypeIcon className={`w-5 h-5 text-${statusColor}-600`} />
                          </div>

                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-lg mb-1 line-clamp-1">
                              {item.title}
                            </h3>

                            <div className="flex items-center gap-3 text-sm text-muted-foreground flex-wrap">
                              <span className="flex items-center gap-1">
                                <User className="w-4 h-4" />
                                {item.author}
                              </span>
                              <span className="flex items-center gap-1">
                                <Layers className="w-4 h-4" />
                                {item.category}
                              </span>
                              {item.wordCount && (
                                <span className="flex items-center gap-1">
                                  <FileText className="w-4 h-4" />
                                  {item.wordCount} từ
                                </span>
                              )}
                              {item.assignedTo && (
                                <span className="flex items-center gap-1 text-blue-600">
                                  <Users className="w-4 h-4" />
                                  Giao cho: {item.assignedTo}
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-2 mt-2">
                              {item.tags.slice(0, 3).map((tag) => (
                                <span
                                  key={tag}
                                  className="px-2 py-0.5 bg-muted rounded text-xs"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Priority & Scores */}
                      <div className="flex flex-col items-end gap-2">
                        <div className={`px-3 py-1 bg-${priorityColor}-100 text-${priorityColor}-700 rounded-lg text-sm font-medium`}>
                          {item.priority === 'urgent' && '🔥 Khẩn cấp'}
                          {item.priority === 'high' && '⚡ Cao'}
                          {item.priority === 'medium' && '📌 TB'}
                          {item.priority === 'low' && '💡 Thấp'}
                        </div>

                        {item.aiScore && (
                          <div className="px-3 py-1 bg-purple-50 text-purple-700 rounded-lg text-sm flex items-center gap-1">
                            <Sparkles className="w-3.5 h-3.5" />
                            {item.aiScore}%
                          </div>
                        )}

                        <div className={`px-3 py-1 bg-${statusColor}-100 text-${statusColor}-700 rounded-lg text-sm`}>
                          {item.status === 'new' && '🆕 Mới'}
                          {item.status === 'in-review' && '👁 Đang xem'}
                          {item.status === 'flagged' && '🚩 Gắn cờ'}
                          {item.status === 'ready' && '✅ Sẵn sàng'}
                        </div>
                      </div>

                      {/* Quick Actions */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleQuickAction(item.id, 'approve')}
                          className="p-2 bg-green-50 hover:bg-green-100 text-green-600 rounded-lg transition-all"
                          title="Duyệt nhanh"
                        >
                          <CheckCircle2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleQuickAction(item.id, 'review')}
                          className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-all"
                          title="Xem chi tiết"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleQuickAction(item.id, 'flag')}
                          className="p-2 bg-orange-50 hover:bg-orange-100 text-orange-600 rounded-lg transition-all"
                          title="Gắn cờ"
                        >
                          <Flag className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick Access to Other Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => onNavigate?.({ page: 'analytics' })}
            className="p-6 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-2xl hover:shadow-lg hover:shadow-blue-500/30 transition-all text-left group"
          >
            <div className="flex items-center justify-between mb-3">
              <BarChart3 className="w-8 h-8" />
              <ArrowUpRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <h3 className="text-xl font-semibold mb-1">Analytics</h3>
            <p className="text-blue-100 text-sm">
              Xem thống kê và phân tích tổng quan hệ thống
            </p>
          </button>

          <button
            onClick={() => onNavigate?.({ page: 'ai-tools' })}
            className="p-6 bg-gradient-to-br from-purple-500 to-pink-600 text-white rounded-2xl hover:shadow-lg hover:shadow-purple-500/30 transition-all text-left group"
          >
            <div className="flex items-center justify-between mb-3">
              <Sparkles className="w-8 h-8" />
              <ArrowUpRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <h3 className="text-xl font-semibold mb-1">AI Tools</h3>
            <p className="text-purple-100 text-sm">
              Công cụ AI hỗ trợ kiểm duyệt và phân tích nội dung
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}