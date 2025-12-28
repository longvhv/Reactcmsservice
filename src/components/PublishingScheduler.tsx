import { useState } from 'react';
import { 
  Calendar, Clock, Send, X, Edit3, Trash2, Pause, Play,
  CheckCircle2, AlertCircle, Filter, Search, ChevronDown,
  Globe, Eye, BarChart3, Zap, CalendarDays, Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';

export interface ScheduledPost {
  id: string;
  articleId: string;
  title: string;
  category: string;
  author: string;
  scheduledDate: Date;
  scheduledTime: string;
  timezone: string;
  status: 'scheduled' | 'publishing' | 'published' | 'failed' | 'cancelled';
  platforms: ('website' | 'facebook' | 'twitter' | 'linkedin')[];
  autoShare: boolean;
  notifySubscribers: boolean;
  featuredImage?: string;
  error?: string;
}

interface PublishingSchedulerProps {
  onSchedule: (post: Partial<ScheduledPost>) => void;
  onCancel: (postId: string) => void;
  onReschedule: (postId: string, newDate: Date) => void;
}

export function PublishingScheduler({
  onSchedule,
  onCancel,
  onReschedule,
}: PublishingSchedulerProps) {
  const { t } = useLanguage();
  const [view, setView] = useState<'calendar' | 'list'>('list');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Mock scheduled posts
  const scheduledPosts: ScheduledPost[] = [
    {
      id: '1',
      articleId: 'a1',
      title: 'Top 10 React Best Practices 2024',
      category: 'Lập trình',
      author: 'Nguyễn Văn A',
      scheduledDate: new Date(Date.now() + 2 * 60 * 60 * 1000),
      scheduledTime: '14:00',
      timezone: 'Asia/Ho_Chi_Minh',
      status: 'scheduled',
      platforms: ['website', 'facebook', 'twitter'],
      autoShare: true,
      notifySubscribers: true,
    },
    {
      id: '2',
      articleId: 'a2',
      title: 'Complete Guide to TypeScript',
      category: 'Tutorial',
      author: 'Trần Thị B',
      scheduledDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      scheduledTime: '09:00',
      timezone: 'Asia/Ho_Chi_Minh',
      status: 'scheduled',
      platforms: ['website', 'linkedin'],
      autoShare: false,
      notifySubscribers: true,
    },
    {
      id: '3',
      articleId: 'a3',
      title: 'SEO Tips for Developers',
      category: 'SEO',
      author: 'Lê Văn C',
      scheduledDate: new Date(Date.now() - 1 * 60 * 60 * 1000),
      scheduledTime: '10:30',
      timezone: 'Asia/Ho_Chi_Minh',
      status: 'published',
      platforms: ['website', 'facebook'],
      autoShare: true,
      notifySubscribers: true,
    },
    {
      id: '4',
      articleId: 'a4',
      title: 'Understanding Async/Await',
      category: 'JavaScript',
      author: 'Phạm Thị D',
      scheduledDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      scheduledTime: '15:00',
      timezone: 'Asia/Ho_Chi_Minh',
      status: 'scheduled',
      platforms: ['website'],
      autoShare: false,
      notifySubscribers: false,
    },
  ];

  const filteredPosts = scheduledPosts.filter(post => {
    if (filterStatus === 'all') return true;
    return post.status === filterStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'scheduled': return <Clock className="w-4 h-4 text-blue-600" />;
      case 'publishing': return <Zap className="w-4 h-4 text-yellow-600 animate-pulse" />;
      case 'published': return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case 'failed': return <AlertCircle className="w-4 h-4 text-red-600" />;
      case 'cancelled': return <X className="w-4 h-4 text-gray-600" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'publishing': return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
      case 'published': return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'failed': return 'bg-red-500/10 text-red-600 border-red-500/20';
      case 'cancelled': return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
      default: return 'bg-muted/50';
    }
  };

  const formatDateTime = (date: Date, time: string) => {
    const dateStr = date.toLocaleDateString('vi-VN', { 
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
    return `${dateStr} • ${time}`;
  };

  const getTimeUntil = (date: Date) => {
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    
    if (diff < 0) return 'Đã xuất bản';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `Còn ${days} ngày`;
    if (hours > 0) return `Còn ${hours} giờ`;
    return 'Sắp xuất bản';
  };

  const stats = {
    scheduled: scheduledPosts.filter(p => p.status === 'scheduled').length,
    publishing: scheduledPosts.filter(p => p.status === 'publishing').length,
    published: scheduledPosts.filter(p => p.status === 'published').length,
    failed: scheduledPosts.filter(p => p.status === 'failed').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20">
            <CalendarDays className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl mb-1">Publishing Scheduler</h1>
            <p className="text-sm text-muted-foreground">
              Lên lịch và quản lý xuất bản nội dung tự động
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="flex items-center gap-1 p-1 rounded-lg bg-muted/60">
            <button
              onClick={() => setView('list')}
              className={`
                flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all text-sm
                ${view === 'list' 
                  ? 'bg-background shadow-sm' 
                  : 'hover:bg-background/50'
                }
              `}
            >
              <BarChart3 className="w-4 h-4" />
              List
            </button>
            <button
              onClick={() => setView('calendar')}
              className={`
                flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all text-sm
                ${view === 'calendar' 
                  ? 'bg-background shadow-sm' 
                  : 'hover:bg-background/50'
                }
              `}
            >
              <Calendar className="w-4 h-4" />
              Calendar
            </button>
          </div>

          <button
            onClick={() => setShowScheduleModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg shadow-blue-500/30"
          >
            <Plus className="w-4 h-4" />
            Schedule Post
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-6">
        <div className="glass-card p-4">
          <div className="flex items-center justify-between mb-3">
            <Clock className="w-5 h-5 text-blue-600" />
            <span className="text-2xl font-medium">{stats.scheduled}</span>
          </div>
          <div className="text-sm text-muted-foreground">Chờ xuất bản</div>
        </div>

        <div className="glass-card p-4">
          <div className="flex items-center justify-between mb-3">
            <Zap className="w-5 h-5 text-yellow-600" />
            <span className="text-2xl font-medium">{stats.publishing}</span>
          </div>
          <div className="text-sm text-muted-foreground">Đang xuất bản</div>
        </div>

        <div className="glass-card p-4">
          <div className="flex items-center justify-between mb-3">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            <span className="text-2xl font-medium">{stats.published}</span>
          </div>
          <div className="text-sm text-muted-foreground">Đã xuất bản</div>
        </div>

        <div className="glass-card p-4">
          <div className="flex items-center justify-between mb-3">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <span className="text-2xl font-medium">{stats.failed}</span>
          </div>
          <div className="text-sm text-muted-foreground">Thất bại</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 rounded-lg bg-background/50 border border-border/40 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
          >
            <option value="all">All Status</option>
            <option value="scheduled">Scheduled</option>
            <option value="publishing">Publishing</option>
            <option value="published">Published</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      {/* Scheduled Posts List */}
      {view === 'list' && (
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filteredPosts.map((post, idx) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: idx * 0.05 }}
                className="glass-card p-6 hover:shadow-lg transition-all"
              >
                <div className="flex items-start gap-4">
                  {/* Status Icon */}
                  <div className={`
                    p-3 rounded-xl border
                    ${getStatusColor(post.status)}
                  `}>
                    {getStatusIcon(post.status)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-medium mb-1 line-clamp-1">
                          {post.title}
                        </h3>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <span>{post.category}</span>
                          <span>•</span>
                          <span>{post.author}</span>
                        </div>
                      </div>

                      <div className={`
                        px-3 py-1 rounded-lg text-xs font-medium border
                        ${getStatusColor(post.status)}
                      `}>
                        {post.status}
                      </div>
                    </div>

                    {/* Schedule Info */}
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span>{formatDateTime(post.scheduledDate, post.scheduledTime)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium text-blue-600">
                          {getTimeUntil(post.scheduledDate)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Globe className="w-4 h-4 text-muted-foreground" />
                        <span>{post.timezone}</span>
                      </div>
                    </div>

                    {/* Platforms */}
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-xs text-muted-foreground">Platforms:</span>
                      {post.platforms.map(platform => (
                        <span
                          key={platform}
                          className="px-2 py-1 rounded bg-muted/40 text-xs capitalize"
                        >
                          {platform}
                        </span>
                      ))}
                    </div>

                    {/* Options */}
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      {post.autoShare && (
                        <div className="flex items-center gap-1">
                          <Send className="w-3 h-3" />
                          <span>Auto-share</span>
                        </div>
                      )}
                      {post.notifySubscribers && (
                        <div className="flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Notify subscribers</span>
                        </div>
                      )}
                    </div>

                    {/* Error Message */}
                    {post.error && (
                      <div className="mt-3 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                        <div className="flex items-start gap-2">
                          <AlertCircle className="w-4 h-4 text-red-600 mt-0.5" />
                          <div className="flex-1 text-sm text-red-600">
                            {post.error}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border/40">
                      <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/60 hover:bg-muted transition-all text-sm">
                        <Eye className="w-3 h-3" />
                        Preview
                      </button>
                      
                      {post.status === 'scheduled' && (
                        <>
                          <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 transition-all text-sm border border-blue-500/20">
                            <Edit3 className="w-3 h-3" />
                            Reschedule
                          </button>
                          <button
                            onClick={() => onCancel(post.id)}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500/10 text-red-600 hover:bg-red-500/20 transition-all text-sm border border-red-500/20"
                          >
                            <X className="w-3 h-3" />
                            Cancel
                          </button>
                        </>
                      )}

                      {post.status === 'failed' && (
                        <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20 transition-all text-sm border border-yellow-500/20">
                          <Play className="w-3 h-3" />
                          Retry
                        </button>
                      )}

                      <button className="ml-auto flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/60 hover:bg-muted transition-all text-sm text-red-600">
                        <Trash2 className="w-3 h-3" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredPosts.length === 0 && (
            <div className="glass-card p-12 text-center">
              <CalendarDays className="w-12 h-12 mx-auto mb-3 text-muted-foreground/50" />
              <p className="text-muted-foreground">No scheduled posts</p>
            </div>
          )}
        </div>
      )}

      {/* Calendar View */}
      {view === 'calendar' && (
        <div className="glass-card p-6">
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
            <p className="text-muted-foreground mb-2">Calendar View</p>
            <p className="text-sm text-muted-foreground">
              Visual calendar with scheduled posts (coming soon)
            </p>
          </div>
        </div>
      )}
    </div>
  );
}