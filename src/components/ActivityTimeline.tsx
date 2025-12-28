import React, { useState, useEffect } from 'react';
import { 
  Activity, Clock, User, FileText, Edit, Trash2, Plus, Eye, Download, 
  Upload, Settings, LogIn, LogOut, Star, MessageSquare, Share2, Lock, 
  Unlock, CheckCircle, XCircle, AlertCircle, Calendar, Search, Filter, 
  ChevronDown, ChevronUp, RefreshCw, ExternalLink, TrendingUp, Radio,
  BarChart3, PieChart, Zap, Bell, Archive, UserPlus, FileCheck,
  Database, Shield, Globe, Mail, Phone, MapPin, Tag
} from 'lucide-react';
import { PageWrapper } from './PageWrapper';
import { PageHeader } from './PageHeader';
import { Card } from './Card';
import { SectionHeader } from './SectionHeader';
import { ActivityAnalytics } from './ActivityAnalytics';
import { ActivityExport } from './ActivityExport';
import { ActivityComparison } from './ActivityComparison';
import { ActivityInsights } from './ActivityInsights';

interface ActivityEvent {
  id: string;
  type: 'create' | 'update' | 'delete' | 'publish' | 'unpublish' | 'login' | 'logout' | 
         'view' | 'download' | 'upload' | 'share' | 'comment' | 'like' | 'archive' | 
         'restore' | 'approve' | 'reject' | 'export' | 'import';
  entity: 'article' | 'category' | 'user' | 'media' | 'comment' | 'setting' | 'role' | 'permission';
  entityId: string;
  title: string;
  description?: string;
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    role?: string;
  };
  metadata?: {
    changes?: string[];
    oldValue?: any;
    newValue?: any;
    ip?: string;
    userAgent?: string;
    location?: string;
  };
  timestamp: string;
  severity: 'info' | 'success' | 'warning' | 'error';
}

interface ActivityStats {
  total: number;
  today: number;
  thisWeek: number;
  thisMonth: number;
  byType: { [key: string]: number };
  byEntity: { [key: string]: number };
  bySeverity: { [key: string]: number };
}

const EVENT_TYPES = {
  create: { icon: Plus, color: 'bg-green-500', label: 'Created' },
  update: { icon: Edit, color: 'bg-blue-500', label: 'Updated' },
  delete: { icon: Trash2, color: 'bg-red-500', label: 'Deleted' },
  publish: { icon: CheckCircle, color: 'bg-green-500', label: 'Published' },
  unpublish: { icon: XCircle, color: 'bg-orange-500', label: 'Unpublished' },
  login: { icon: LogIn, color: 'bg-purple-500', label: 'Logged In' },
  logout: { icon: LogOut, color: 'bg-gray-500', label: 'Logged Out' },
  view: { icon: Eye, color: 'bg-cyan-500', label: 'Viewed' },
  download: { icon: Download, color: 'bg-pink-500', label: 'Downloaded' },
  upload: { icon: Upload, color: 'bg-teal-500', label: 'Uploaded' },
  share: { icon: Share2, color: 'bg-indigo-500', label: 'Shared' },
  comment: { icon: MessageSquare, color: 'bg-yellow-500', label: 'Commented' },
  like: { icon: Star, color: 'bg-amber-500', label: 'Liked' },
  archive: { icon: Archive, color: 'bg-gray-600', label: 'Archived' },
  restore: { icon: Unlock, color: 'bg-green-600', label: 'Restored' },
  approve: { icon: CheckCircle, color: 'bg-green-600', label: 'Approved' },
  reject: { icon: XCircle, color: 'bg-red-600', label: 'Rejected' },
  export: { icon: Download, color: 'bg-blue-600', label: 'Exported' },
  import: { icon: Upload, color: 'bg-purple-600', label: 'Imported' },
};

const ENTITY_TYPES = {
  article: { icon: FileText, color: 'text-blue-600', bgColor: 'bg-blue-100 dark:bg-blue-900/30' },
  category: { icon: Tag, color: 'text-purple-600', bgColor: 'bg-purple-100 dark:bg-purple-900/30' },
  user: { icon: User, color: 'text-green-600', bgColor: 'bg-green-100 dark:bg-green-900/30' },
  media: { icon: Upload, color: 'text-pink-600', bgColor: 'bg-pink-100 dark:bg-pink-900/30' },
  comment: { icon: MessageSquare, color: 'text-orange-600', bgColor: 'bg-orange-100 dark:bg-orange-900/30' },
  setting: { icon: Settings, color: 'text-gray-600', bgColor: 'bg-gray-100 dark:bg-gray-900/30' },
  role: { icon: Shield, color: 'text-indigo-600', bgColor: 'bg-indigo-100 dark:bg-indigo-900/30' },
  permission: { icon: Lock, color: 'text-red-600', bgColor: 'bg-red-100 dark:bg-red-900/30' },
};

const formatRelativeTime = (timestamp: string): string => {
  const now = new Date();
  const date = new Date(timestamp);
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (seconds < 60) return 'vừa xong';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} phút trước`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} giờ trước`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} ngày trước`;
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks} tuần trước`;
  const months = Math.floor(days / 30);
  return `${months} tháng trước`;
};

const formatFullDate = (timestamp: string): string => {
  const date = new Date(timestamp);
  return date.toLocaleString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export function ActivityTimeline() {
  const [selectedView, setSelectedView] = useState<'timeline' | 'analytics'>('timeline');
  const [isLive, setIsLive] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedEntity, setSelectedEntity] = useState<string>('all');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [selectedDateRange, setSelectedDateRange] = useState<string>('all');
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<ActivityEvent | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showComparisonModal, setShowComparisonModal] = useState(false);
  const [showInsightsModal, setShowInsightsModal] = useState(false);

  // Mock events data
  const mockEvents: ActivityEvent[] = [
    {
      id: '1',
      type: 'create',
      entity: 'article',
      entityId: 'art-001',
      title: 'Tạo bài viết mới "Hướng dẫn React Hooks"',
      description: 'Bài viết về React Hooks cho người mới bắt đầu',
      user: {
        id: 'u1',
        name: 'Nguyễn Văn A',
        email: 'nguyenvana@example.com',
        avatar: 'https://i.pravatar.cc/150?img=1',
        role: 'Admin',
      },
      metadata: {
        changes: ['title', 'content', 'category', 'tags'],
        location: 'Hà Nội, Việt Nam',
      },
      timestamp: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
      severity: 'success',
    },
    {
      id: '2',
      type: 'update',
      entity: 'article',
      entityId: 'art-002',
      title: 'Cập nhật bài viết "TypeScript Best Practices"',
      description: 'Chỉnh sửa nội dung và thêm ví dụ mới',
      user: {
        id: 'u2',
        name: 'Trần Thị B',
        email: 'tranthib@example.com',
        avatar: 'https://i.pravatar.cc/150?img=2',
        role: 'Editor',
      },
      metadata: {
        changes: ['content', 'updated_at'],
        oldValue: { status: 'draft' },
        newValue: { status: 'published' },
      },
      timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      severity: 'info',
    },
    {
      id: '3',
      type: 'delete',
      entity: 'comment',
      entityId: 'cmt-123',
      title: 'Xóa bình luận spam',
      description: 'Bình luận vi phạm quy định cộng đồng',
      user: {
        id: 'u3',
        name: 'Lê Văn C',
        email: 'levanc@example.com',
        avatar: 'https://i.pravatar.cc/150?img=3',
        role: 'Moderator',
      },
      metadata: {
        oldValue: { content: 'This is spam...' },
        ip: '192.168.1.100',
      },
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      severity: 'warning',
    },
    {
      id: '4',
      type: 'login',
      entity: 'user',
      entityId: 'u1',
      title: 'Đăng nhập hệ thống',
      description: 'Đăng nhập thành công từ trình duyệt Chrome',
      user: {
        id: 'u1',
        name: 'Nguyễn Văn A',
        email: 'nguyenvana@example.com',
        avatar: 'https://i.pravatar.cc/150?img=1',
        role: 'Admin',
      },
      metadata: {
        ip: '203.162.4.191',
        userAgent: 'Chrome/120.0.0.0',
        location: 'Hồ Chí Minh, Việt Nam',
      },
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      severity: 'info',
    },
    {
      id: '5',
      type: 'publish',
      entity: 'article',
      entityId: 'art-003',
      title: 'Xuất bản bài viết "Advanced CSS Grid"',
      description: 'Bài viết đã được duyệt và xuất bản',
      user: {
        id: 'u4',
        name: 'Phạm Thị D',
        email: 'phamthid@example.com',
        avatar: 'https://i.pravatar.cc/150?img=4',
        role: 'Editor',
      },
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      severity: 'success',
    },
    {
      id: '6',
      type: 'upload',
      entity: 'media',
      entityId: 'med-456',
      title: 'Tải lên hình ảnh "hero-banner.jpg"',
      description: 'Tải lên thành công, kích thước 2.4 MB',
      user: {
        id: 'u2',
        name: 'Trần Thị B',
        email: 'tranthib@example.com',
        avatar: 'https://i.pravatar.cc/150?img=2',
        role: 'Editor',
      },
      metadata: {
        newValue: { size: '2.4 MB', type: 'image/jpeg', dimensions: '1920x1080' },
      },
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
      severity: 'success',
    },
    {
      id: '7',
      type: 'approve',
      entity: 'article',
      entityId: 'art-004',
      title: 'Phê duyệt bài viết "Node.js Performance"',
      description: 'Bài viết đạt tiêu chuẩn và được duyệt',
      user: {
        id: 'u1',
        name: 'Nguyễn Văn A',
        email: 'nguyenvana@example.com',
        avatar: 'https://i.pravatar.cc/150?img=1',
        role: 'Admin',
      },
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      severity: 'success',
    },
    {
      id: '8',
      type: 'create',
      entity: 'user',
      entityId: 'u5',
      title: 'Tạo tài khoản người dùng mới',
      description: 'Người dùng "hoangvan@example.com" đã được tạo',
      user: {
        id: 'u1',
        name: 'Nguyễn Văn A',
        email: 'nguyenvana@example.com',
        avatar: 'https://i.pravatar.cc/150?img=1',
        role: 'Admin',
      },
      metadata: {
        newValue: { email: 'hoangvan@example.com', role: 'Author' },
      },
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      severity: 'success',
    },
  ];

  const stats: ActivityStats = {
    total: 1247,
    today: 45,
    thisWeek: 312,
    thisMonth: 1247,
    byType: {
      create: 234,
      update: 456,
      delete: 23,
      publish: 178,
      login: 356,
    },
    byEntity: {
      article: 445,
      user: 234,
      media: 178,
      comment: 234,
      category: 89,
    },
    bySeverity: {
      info: 678,
      success: 456,
      warning: 89,
      error: 24,
    },
  };

  // Real-time updates simulation
  useEffect(() => {
    if (!isLive) return;
    
    const interval = setInterval(() => {
      console.log('🔴 Live: Checking for new events...');
    }, 5000);
    
    return () => clearInterval(interval);
  }, [isLive]);

  // Filter events
  const filteredEvents = mockEvents.filter(event => {
    if (searchTerm && !event.title.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    if (selectedType !== 'all' && event.type !== selectedType) return false;
    if (selectedEntity !== 'all' && event.entity !== selectedEntity) return false;
    if (selectedSeverity !== 'all' && event.severity !== selectedSeverity) return false;
    return true;
  });

  const renderTimelineView = () => (
    <div className="space-y-6">
      {/* Timeline */}
      <Card padding="md">
        <div className="relative">
          {/* Timeline vertical line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 opacity-20" />

          {/* Events */}
          <div className="space-y-8">
            {filteredEvents.map((event, index) => {
              const eventType = EVENT_TYPES[event.type];
              const entityType = ENTITY_TYPES[event.entity];
              const EventIcon = eventType.icon;
              const EntityIcon = entityType.icon;
              const isExpanded = expandedEvent === event.id;

              return (
                <div key={event.id} className="relative pl-20 group">
                  {/* Timeline dot */}
                  <div className={`absolute left-4 w-8 h-8 rounded-full ${eventType.color} flex items-center justify-center shadow-lg transform transition-transform group-hover:scale-110 z-10`}>
                    <EventIcon className="w-4 h-4 text-white" />
                  </div>

                  {/* Event card */}
                  <div className="bg-card border border-border/60 rounded-2xl p-6 hover:shadow-xl hover:border-blue-500/30 transition-all duration-300">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`px-3 py-1 ${eventType.color} text-white rounded-lg text-xs font-semibold uppercase tracking-wider`}>
                            {eventType.label}
                          </span>
                          <span className={`px-3 py-1 ${entityType.bgColor} ${entityType.color} rounded-lg text-xs font-semibold flex items-center gap-1`}>
                            <EntityIcon className="w-3 h-3" />
                            {event.entity}
                          </span>
                          <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                            event.severity === 'success' ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' :
                            event.severity === 'warning' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400' :
                            event.severity === 'error' ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' :
                            'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                          }`}>
                            {event.severity}
                          </span>
                        </div>

                        <h3 className="text-lg font-semibold mb-1">{event.title}</h3>
                        {event.description && (
                          <p className="text-sm text-muted-foreground mb-3">{event.description}</p>
                        )}

                        {/* User & time */}
                        <div className="flex items-center gap-6 text-sm">
                          <div className="flex items-center gap-2">
                            {event.user.avatar ? (
                              <img src={event.user.avatar} alt={event.user.name} className="w-8 h-8 rounded-full ring-2 ring-blue-500/20" />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                                {event.user.name.charAt(0)}
                              </div>
                            )}
                            <div>
                              <p className="font-medium">{event.user.name}</p>
                              <p className="text-xs text-muted-foreground">{event.user.role}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Clock className="w-4 h-4" />
                            <span>{formatRelativeTime(event.timestamp)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setExpandedEvent(isExpanded ? null : event.id)}
                          className="p-2 hover:bg-secondary rounded-lg transition-colors"
                        >
                          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                        </button>
                        <button
                          onClick={() => setSelectedEvent(event)}
                          className="p-2 hover:bg-secondary rounded-lg transition-colors"
                        >
                          <ExternalLink className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    {/* Expanded details */}
                    {isExpanded && event.metadata && (
                      <div className="mt-4 pt-4 border-t border-border/60 space-y-4">
                        {/* Changes */}
                        {event.metadata.changes && (
                          <div>
                            <p className="text-sm font-semibold mb-2 flex items-center gap-2">
                              <FileCheck className="w-4 h-4" />
                              Các trường đã thay đổi
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {event.metadata.changes.map((change, i) => (
                                <span key={i} className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg text-xs font-medium">
                                  {change}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Old/New values */}
                        {(event.metadata.oldValue || event.metadata.newValue) && (
                          <div className="grid grid-cols-2 gap-4">
                            {event.metadata.oldValue && (
                              <div>
                                <p className="text-sm font-semibold mb-2 text-red-600 dark:text-red-400">Giá trị cũ:</p>
                                <pre className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg text-xs overflow-x-auto font-mono">
                                  {JSON.stringify(event.metadata.oldValue, null, 2)}
                                </pre>
                              </div>
                            )}
                            {event.metadata.newValue && (
                              <div>
                                <p className="text-sm font-semibold mb-2 text-green-600 dark:text-green-400">Giá trị mới:</p>
                                <pre className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg text-xs overflow-x-auto font-mono">
                                  {JSON.stringify(event.metadata.newValue, null, 2)}
                                </pre>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Technical details */}
                        <div className="grid grid-cols-2 gap-4 p-4 bg-secondary rounded-xl">
                          <div className="space-y-2">
                            <p className="text-xs text-muted-foreground">Event ID</p>
                            <p className="text-sm font-mono">{event.id}</p>
                          </div>
                          <div className="space-y-2">
                            <p className="text-xs text-muted-foreground">Entity ID</p>
                            <p className="text-sm font-mono">{event.entityId}</p>
                          </div>
                          {event.metadata.ip && (
                            <div className="space-y-2">
                              <p className="text-xs text-muted-foreground flex items-center gap-1">
                                <Globe className="w-3 h-3" />
                                IP Address
                              </p>
                              <p className="text-sm font-mono">{event.metadata.ip}</p>
                            </div>
                          )}
                          {event.metadata.location && (
                            <div className="space-y-2">
                              <p className="text-xs text-muted-foreground flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                Location
                              </p>
                              <p className="text-sm">{event.metadata.location}</p>
                            </div>
                          )}
                          <div className="space-y-2 col-span-2">
                            <p className="text-xs text-muted-foreground">Timestamp</p>
                            <p className="text-sm">{formatFullDate(event.timestamp)}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>
    </div>
  );

  const renderAnalyticsView = () => (
    <div className="space-y-6">
      {/* Top stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Tổng số sự kiện', value: stats.total, icon: Activity, color: 'blue' },
          { label: 'Hôm nay', value: stats.today, icon: Calendar, color: 'green' },
          { label: 'Tuần này', value: stats.thisWeek, icon: TrendingUp, color: 'purple' },
          { label: 'Tháng này', value: stats.thisMonth, icon: BarChart3, color: 'orange' },
        ].map((stat, i) => (
          <Card key={i} padding="md">
            <div className="flex items-center justify-between mb-3">
              <div className={`p-3 bg-${stat.color}-100 dark:bg-${stat.color}-900/30 rounded-xl`}>
                <stat.icon className={`w-6 h-6 text-${stat.color}-600 dark:text-${stat.color}-400`} />
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
            <p className="text-3xl font-bold">{stat.value.toLocaleString()}</p>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* By Type */}
        <Card padding="md">
          <SectionHeader
            title="Theo loại hành động"
            description="Phân bố sự kiện theo loại"
            icon={PieChart}
          />
          <div className="space-y-3 mt-4">
            {Object.entries(stats.byType).map(([type, count]) => {
              const percentage = ((count / stats.total) * 100).toFixed(1);
              const eventType = EVENT_TYPES[type as keyof typeof EVENT_TYPES];
              return (
                <div key={type}>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="font-medium capitalize flex items-center gap-2">
                      {eventType && <eventType.icon className="w-4 h-4" />}
                      {eventType?.label || type}
                    </span>
                    <span className="text-muted-foreground">{count} ({percentage}%)</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* By Entity */}
        <Card padding="md">
          <SectionHeader
            title="Theo đối tượng"
            description="Phân bố sự kiện theo entity"
            icon={Database}
          />
          <div className="space-y-3 mt-4">
            {Object.entries(stats.byEntity).map(([entity, count]) => {
              const percentage = ((count / stats.total) * 100).toFixed(1);
              const entityType = ENTITY_TYPES[entity as keyof typeof ENTITY_TYPES];
              return (
                <div key={entity}>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="font-medium capitalize flex items-center gap-2">
                      {entityType && <entityType.icon className="w-4 h-4" />}
                      {entity}
                    </span>
                    <span className="text-muted-foreground">{count} ({percentage}%)</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-green-500 to-teal-500 transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* By Severity */}
      <Card padding="md">
        <SectionHeader
          title="Theo mức độ nghiêm trọng"
          description="Phân bố sự kiện theo severity"
          icon={AlertCircle}
        />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          {Object.entries(stats.bySeverity).map(([severity, count]) => {
            const colors = {
              info: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-blue-500',
              success: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 border-green-500',
              warning: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 border-yellow-500',
              error: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 border-red-500',
            };
            const color = colors[severity as keyof typeof colors];
            return (
              <div key={severity} className={`p-4 ${color} rounded-xl border-l-4`}>
                <p className="text-sm font-medium uppercase tracking-wider mb-1">{severity}</p>
                <p className="text-3xl font-bold">{count}</p>
                <p className="text-xs mt-1">{((count / stats.total) * 100).toFixed(1)}% of total</p>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );

  return (
    <PageWrapper>
      <div className="space-y-6">
        {/* Header */}
        <PageHeader
          title="Dòng sự kiện"
          description={
            <div className="flex items-center gap-3">
              <span>Theo dõi và phân tích hoạt động hệ thống</span>
              {isLive && (
                <span className="flex items-center gap-2 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full text-sm font-medium">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                  </span>
                  Live
                </span>
              )}
            </div>
          }
          action={
            <div className="flex items-center gap-3">
              {/* View toggle */}
              <div className="flex items-center gap-1 p-1 bg-secondary rounded-xl">
                <button
                  onClick={() => setSelectedView('timeline')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedView === 'timeline'
                      ? 'bg-blue-500 text-white shadow-lg'
                      : 'hover:bg-muted/50'
                  }`}
                >
                  <Activity className="w-4 h-4" />
                  Timeline
                </button>
                <button
                  onClick={() => setSelectedView('analytics')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedView === 'analytics'
                      ? 'bg-blue-500 text-white shadow-lg'
                      : 'hover:bg-muted/50'
                  }`}
                >
                  <BarChart3 className="w-4 h-4" />
                  Analytics
                </button>
              </div>

              {/* Live toggle */}
              <button
                onClick={() => setIsLive(!isLive)}
                className={`flex items-center gap-2 px-4 py-3 border rounded-xl transition-all ${
                  isLive
                    ? 'bg-green-50 dark:bg-green-900/30 border-green-500 text-green-600 dark:text-green-400'
                    : 'border-border/60 hover:bg-muted/50'
                }`}
              >
                <Radio className="w-4 h-4" />
                <span className="font-medium">{isLive ? 'Live On' : 'Live Off'}</span>
              </button>

              {/* Filter toggle */}
              {selectedView === 'timeline' && (
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center gap-2 px-4 py-3 border rounded-xl transition-all ${
                    showFilters
                      ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-500'
                      : 'border-border/60 hover:bg-muted/50'
                  }`}
                >
                  <Filter className="w-4 h-4" />
                  <span className="font-medium">Filters</span>
                  {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              )}

              {/* Refresh */}
              <button className="flex items-center gap-2 px-4 py-3 border border-border/60 rounded-xl hover:bg-muted/50 transition-all">
                <RefreshCw className="w-4 h-4" />
                <span className="font-medium">Refresh</span>
              </button>

              {/* Export */}
              <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/20 transition-all">
                <Download className="w-4 h-4" />
                <span className="font-medium">Export</span>
              </button>
            </div>
          }
        />

        {/* Stats overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: 'Hôm nay', value: stats.today, icon: '📅', color: 'bg-blue-500', trend: '+12%' },
            { label: 'Tuần này', value: stats.thisWeek, icon: '📊', color: 'bg-purple-500', trend: '+8%' },
            { label: 'Tháng này', value: stats.thisMonth, icon: '📈', color: 'bg-green-500', trend: '+15%' },
            { label: 'Tổng cộng', value: stats.total, icon: '🎯', color: 'bg-orange-500', trend: 'All time' },
          ].map((stat, i) => (
            <Card key={i} padding="md">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center text-2xl shadow-lg`}>
                  {stat.icon}
                </div>
                <span className="text-xs text-green-600 dark:text-green-400 font-semibold flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  {stat.trend}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
              <p className="text-3xl font-bold">{stat.value.toLocaleString()}</p>
            </Card>
          ))}
        </div>

        {/* Filters */}
        {showFilters && selectedView === 'timeline' && (
          <Card padding="md">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="md:col-span-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Tìm kiếm sự kiện..."
                    className="w-full pl-10 pr-4 py-3 bg-secondary border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Type filter */}
              <div>
                <label className="block text-sm font-medium mb-2">Loại hành động</label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full px-3 py-2 bg-secondary border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="all">Tất cả</option>
                  {Object.entries(EVENT_TYPES).map(([key, config]) => (
                    <option key={key} value={key}>{config.label}</option>
                  ))}
                </select>
              </div>

              {/* Entity filter */}
              <div>
                <label className="block text-sm font-medium mb-2">Đối tượng</label>
                <select
                  value={selectedEntity}
                  onChange={(e) => setSelectedEntity(e.target.value)}
                  className="w-full px-3 py-2 bg-secondary border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="all">Tất cả</option>
                  {Object.keys(ENTITY_TYPES).map((key) => (
                    <option key={key} value={key}>{key}</option>
                  ))}
                </select>
              </div>

              {/* Severity filter */}
              <div>
                <label className="block text-sm font-medium mb-2">Mức độ</label>
                <select
                  value={selectedSeverity}
                  onChange={(e) => setSelectedSeverity(e.target.value)}
                  className="w-full px-3 py-2 bg-secondary border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="all">Tất cả</option>
                  <option value="info">Info</option>
                  <option value="success">Success</option>
                  <option value="warning">Warning</option>
                  <option value="error">Error</option>
                </select>
              </div>

              {/* Clear filters */}
              <div className="flex items-end">
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedType('all');
                    setSelectedEntity('all');
                    setSelectedSeverity('all');
                  }}
                  className="w-full px-4 py-2 bg-secondary hover:bg-secondary/80 rounded-xl transition-colors font-medium"
                >
                  Xóa bộ lọc
                </button>
              </div>
            </div>
          </Card>
        )}

        {/* Content */}
        {selectedView === 'timeline' ? renderTimelineView() : renderAnalyticsView()}

        {/* Event detail modal */}
        {selectedEvent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-4xl bg-card rounded-2xl shadow-2xl border border-border/60 max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-card border-b border-border/60 p-6 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold">Chi tiết sự kiện</h3>
                  <p className="text-sm text-muted-foreground font-mono">{selectedEvent.id}</p>
                </div>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="p-2 hover:bg-secondary rounded-lg transition-colors"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Full event data */}
                <div>
                  <p className="text-sm font-semibold mb-3">Event Data (JSON)</p>
                  <pre className="p-4 bg-secondary rounded-xl overflow-x-auto text-sm font-mono">
                    {JSON.stringify(selectedEvent, null, 2)}
                  </pre>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setSelectedEvent(null)}
                    className="flex-1 px-4 py-3 bg-secondary hover:bg-secondary/80 rounded-xl transition-colors font-medium"
                  >
                    Đóng
                  </button>
                  <button className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:shadow-lg transition-all font-medium">
                    Export Event
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}