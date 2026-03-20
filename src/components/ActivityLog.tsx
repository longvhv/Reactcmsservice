import React, { useState } from 'react';
import {
  Activity, User, FileText, Folder, Settings, Eye, Edit, Trash2,
  Plus, Upload, Download, Send, Archive, Clock, Filter, Search,
  Calendar, ChevronDown, AlertCircle, CheckCircle, XCircle, Info
} from 'lucide-react';
import { Card } from './Card';
import { PageWrapper } from './PageWrapper';
import { PageHeader } from './PageHeader';
import { useLanguage } from '../contexts/LanguageContext';

interface ActivityLog {
  id: string;
  user: {
    name: string;
    avatar: string;
    role: string;
  };
  action: 'create' | 'edit' | 'delete' | 'publish' | 'unpublish' | 'upload' | 'download' | 'view' | 'archive' | 'restore' | 'approve' | 'reject';
  target: {
    type: 'article' | 'category' | 'media' | 'user' | 'settings' | 'workflow';
    id: string;
    name: string;
  };
  details?: string;
  timestamp: string;
  ipAddress?: string;
  userAgent?: string;
}

export function ActivityLog({ onNavigate }: { onNavigate: (page: any) => void }) {
  const { t } = useLanguage();
  const [selectedAction, setSelectedAction] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState('today');

  // Mock activity logs
  const activityLogs: ActivityLog[] = [
    {
      id: '1',
      user: {
        name: 'Nguyễn Văn A',
        avatar: 'https://i.pravatar.cc/150?img=1',
        role: 'Admin',
      },
      action: 'create',
      target: {
        type: 'article',
        id: '101',
        name: 'AI Revolution: Xu hướng AI năm 2024',
      },
      details: 'Tạo bài viết mới loại Tin tức',
      timestamp: '2024-12-27 10:30:00',
      ipAddress: '192.168.1.100',
      userAgent: 'Chrome 120.0.0',
    },
    {
      id: '2',
      user: {
        name: 'Trần Thị B',
        avatar: 'https://i.pravatar.cc/150?img=2',
        role: 'Editor',
      },
      action: 'edit',
      target: {
        type: 'article',
        id: '102',
        name: 'Cloud Infrastructure: Best Practices',
      },
      details: 'Cập nhật nội dung và hình ảnh thumbnail',
      timestamp: '2024-12-27 09:45:00',
      ipAddress: '192.168.1.101',
      userAgent: 'Firefox 121.0',
    },
    {
      id: '3',
      user: {
        name: 'Lê Văn C',
        avatar: 'https://i.pravatar.cc/150?img=3',
        role: 'Author',
      },
      action: 'publish',
      target: {
        type: 'article',
        id: '103',
        name: 'Blockchain & Web3: Cơ hội và thách thức',
      },
      details: 'Xuất bản bài viết lên website',
      timestamp: '2024-12-27 09:15:00',
      ipAddress: '192.168.1.102',
      userAgent: 'Safari 17.1',
    },
    {
      id: '4',
      user: {
        name: 'Phạm Thị D',
        avatar: 'https://i.pravatar.cc/150?img=4',
        role: 'Editor',
      },
      action: 'approve',
      target: {
        type: 'workflow',
        id: 'w1',
        name: 'Bài viết về Machine Learning',
      },
      details: 'Phê duyệt bài viết trong workflow',
      timestamp: '2024-12-27 08:50:00',
      ipAddress: '192.168.1.103',
      userAgent: 'Edge 120.0.0',
    },
    {
      id: '5',
      user: {
        name: 'Admin',
        avatar: 'https://i.pravatar.cc/150?img=5',
        role: 'Admin',
      },
      action: 'upload',
      target: {
        type: 'media',
        id: 'm1',
        name: 'tech-summit-2024.jpg',
      },
      details: 'Tải lên 5 hình ảnh vào thư viện media',
      timestamp: '2024-12-27 08:30:00',
      ipAddress: '192.168.1.100',
      userAgent: 'Chrome 120.0.0',
    },
    {
      id: '6',
      user: {
        name: 'Nguyễn Văn A',
        avatar: 'https://i.pravatar.cc/150?img=1',
        role: 'Admin',
      },
      action: 'delete',
      target: {
        type: 'article',
        id: '104',
        name: 'Bài viết cũ không còn cần thiết',
      },
      details: 'Xóa bài viết khi hệ thống',
      timestamp: '2024-12-27 08:00:00',
      ipAddress: '192.168.1.100',
      userAgent: 'Chrome 120.0.0',
    },
    {
      id: '7',
      user: {
        name: 'Trần Thị B',
        avatar: 'https://i.pravatar.cc/150?img=2',
        role: 'Editor',
      },
      action: 'archive',
      target: {
        type: 'article',
        id: '105',
        name: 'Sự kiện đã qua',
      },
      details: 'Lưu trữ bài viết về sự kiện đã kết thúc',
      timestamp: '2024-12-26 16:30:00',
      ipAddress: '192.168.1.101',
      userAgent: 'Firefox 121.0',
    },
    {
      id: '8',
      user: {
        name: 'Lê Văn C',
        avatar: 'https://i.pravatar.cc/150?img=3',
        role: 'Author',
      },
      action: 'reject',
      target: {
        type: 'workflow',
        id: 'w2',
        name: 'Bài viết thiếu thông tin',
      },
      details: 'Từ chối bài viết do nội dung chưa đầy đủ',
      timestamp: '2024-12-26 15:00:00',
      ipAddress: '192.168.1.102',
      userAgent: 'Safari 17.1',
    },
  ];

  const actionConfig = {
    create: { label: 'Tạo mới', icon: Plus, color: 'green', bgColor: 'bg-green-100 dark:bg-green-900/30', textColor: 'text-green-600 dark:text-green-400' },
    edit: { label: 'Chỉnh sửa', icon: Edit, color: 'blue', bgColor: 'bg-blue-100 dark:bg-blue-900/30', textColor: 'text-blue-600 dark:text-blue-400' },
    delete: { label: 'Xóa', icon: Trash2, color: 'red', bgColor: 'bg-red-100 dark:bg-red-900/30', textColor: 'text-red-600 dark:text-red-400' },
    publish: { label: 'Xuất bản', icon: Send, color: 'purple', bgColor: 'bg-purple-100 dark:bg-purple-900/30', textColor: 'text-purple-600 dark:text-purple-400' },
    unpublish: { label: 'Hủy xuất bản', icon: XCircle, color: 'orange', bgColor: 'bg-orange-100 dark:bg-orange-900/30', textColor: 'text-orange-600 dark:text-orange-400' },
    upload: { label: 'Tải lên', icon: Upload, color: 'teal', bgColor: 'bg-teal-100 dark:bg-teal-900/30', textColor: 'text-teal-600 dark:text-teal-400' },
    download: { label: 'Tải xuống', icon: Download, color: 'indigo', bgColor: 'bg-indigo-100 dark:bg-indigo-900/30', textColor: 'text-indigo-600 dark:text-indigo-400' },
    view: { label: 'Xem', icon: Eye, color: 'gray', bgColor: 'bg-gray-100 dark:bg-gray-900/30', textColor: 'text-gray-600 dark:text-gray-400' },
    archive: { label: 'Lưu trữ', icon: Archive, color: 'slate', bgColor: 'bg-slate-100 dark:bg-slate-900/30', textColor: 'text-slate-600 dark:text-slate-400' },
    restore: { label: 'Khôi phục', icon: CheckCircle, color: 'emerald', bgColor: 'bg-emerald-100 dark:bg-emerald-900/30', textColor: 'text-emerald-600 dark:text-emerald-400' },
    approve: { label: 'Phê duyệt', icon: CheckCircle, color: 'green', bgColor: 'bg-green-100 dark:bg-green-900/30', textColor: 'text-green-600 dark:text-green-400' },
    reject: { label: 'Từ chối', icon: XCircle, color: 'red', bgColor: 'bg-red-100 dark:bg-red-900/30', textColor: 'text-red-600 dark:text-red-400' },
  };

  const typeConfig = {
    article: { label: 'Bài viết', icon: FileText },
    category: { label: 'Danh mục', icon: Folder },
    media: { label: 'Media', icon: Upload },
    user: { label: 'Người dùng', icon: User },
    settings: { label: 'Cài đặt', icon: Settings },
    workflow: { label: 'Workflow', icon: Activity },
  };

  const users = [
    { value: 'all', label: '-- Người dùng --' },
    { value: 'admin', label: 'Admin' },
    { value: 'nguyen-van-a', label: 'Nguyễn Văn A' },
    { value: 'tran-thi-b', label: 'Trần Thị B' },
    { value: 'le-van-c', label: 'Lê Văn C' },
    { value: 'pham-thi-d', label: 'Phạm Thị D' },
  ];

  const dateRanges = [
    { value: 'today', label: 'Hôm nay' },
    { value: 'yesterday', label: 'Hôm qua' },
    { value: 'week', label: '7 ngày qua' },
    { value: 'month', label: '30 ngày qua' },
    { value: 'all', label: '-- Thời gian --' },
  ];

  const filteredLogs = activityLogs.filter((log) => {
    const matchesAction = selectedAction === 'all' || log.action === selectedAction;
    const matchesType = selectedType === 'all' || log.target.type === selectedType;
    const matchesUser = selectedUser === 'all' || log.user.name.toLowerCase().includes(selectedUser.toLowerCase());
    const matchesSearch = log.target.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.details?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.user.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesAction && matchesType && matchesUser && matchesSearch;
  });

  const stats = {
    total: activityLogs.length,
    today: activityLogs.filter(l => l.timestamp.startsWith('2024-12-27')).length,
    creates: activityLogs.filter(l => l.action === 'create').length,
    edits: activityLogs.filter(l => l.action === 'edit').length,
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'Vừa xong';
    if (minutes < 60) return `${minutes} phút trước`;
    if (hours < 24) return `${hours} giờ trước`;
    if (days < 7) return `${days} ngày trước`;
    return date.toLocaleDateString('vi-VN');
  };

  return (
    <PageWrapper>
      <PageHeader
        title="Nh���t ký hoạt động"
        description="Theo dõi tất cả các hoạt động trên hệ thống"
      />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
              <Activity className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Tổng hoạt động</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
              <Clock className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Hôm nay</p>
              <p className="text-2xl font-bold">{stats.today}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
              <Plus className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Tạo mới</p>
              <p className="text-2xl font-bold">{stats.creates}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-xl">
              <Edit className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Chỉnh sửa</p>
              <p className="text-2xl font-bold">{stats.edits}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder={t('placeholders.searchActivity')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <select
            value={selectedAction}
            onChange={(e) => setSelectedAction(e.target.value)}
            className="px-4 py-2.5 bg-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="all">-- Hành động --</option>
            {Object.entries(actionConfig).map(([key, config]) => (
              <option key={key} value={key}>{config.label}</option>
            ))}
          </select>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-4 py-2.5 bg-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="all">-- Loại đối tượng --</option>
            {Object.entries(typeConfig).map(([key, config]) => (
              <option key={key} value={key}>{config.label}</option>
            ))}
          </select>

          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="px-4 py-2.5 bg-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            {users.map((user) => (
              <option key={user.value} value={user.value}>{user.label}</option>
            ))}
          </select>

          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2.5 bg-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            {dateRanges.map((range) => (
              <option key={range.value} value={range.value}>{range.label}</option>
            ))}
          </select>
        </div>
      </Card>

      {/* Activity Timeline */}
      <Card>
        <div className="divide-y divide-border">
          {filteredLogs.map((log) => {
            const actionInfo = actionConfig[log.action];
            const typeInfo = typeConfig[log.target.type];
            const ActionIcon = actionInfo.icon;
            const TypeIcon = typeInfo.icon;

            return (
              <div key={log.id} className="p-5 hover:bg-secondary/50 transition-colors">
                <div className="flex gap-4">
                  {/* Icon */}
                  <div className={`p-3 ${actionInfo.bgColor} rounded-xl h-fit`}>
                    <ActionIcon className={`w-5 h-5 ${actionInfo.textColor}`} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <img
                            src={log.user.avatar}
                            alt={log.user.name}
                            className="w-6 h-6 rounded-full"
                          />
                          <span className="font-semibold">{log.user.name}</span>
                          <span className={`px-2 py-0.5 ${actionInfo.bgColor} ${actionInfo.textColor} rounded-lg text-xs font-semibold`}>
                            {actionInfo.label}
                          </span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <TypeIcon className="w-3 h-3" />
                            {typeInfo.label}
                          </span>
                        </div>

                        <p className="mb-1">
                          <span className="font-medium">{log.target.name}</span>
                        </p>

                        {log.details && (
                          <p className="text-sm text-muted-foreground mb-2">
                            {log.details}
                          </p>
                        )}

                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatTimestamp(log.timestamp)}
                          </span>
                          <span>{log.user.role}</span>
                          {log.ipAddress && (
                            <span>IP: {log.ipAddress}</span>
                          )}
                        </div>
                      </div>

                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {new Date(log.timestamp).toLocaleString('vi-VN')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {filteredLogs.length === 0 && (
            <div className="p-12 text-center">
              <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Không tìm thấy hoạt động nào</p>
            </div>
          )}
        </div>
      </Card>
    </PageWrapper>
  );
}