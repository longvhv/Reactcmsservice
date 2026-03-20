import { useState } from 'react';
import { Activity, LogIn, LogOut, Edit, Trash2, FileText, Shield, AlertTriangle, CheckCircle, Clock, MapPin, Monitor, Smartphone, Download, Filter, Calendar, Search } from 'lucide-react';
import { PageWrapper } from './PageWrapper';
import { PageHeader } from './PageHeader';
import { Card } from './Card';
import { useLanguage } from '../contexts/LanguageContext';
import toast from './Toast';

interface AccessLog {
  id: number;
  userId: number;
  userName: string;
  userAvatar?: string;
  action: 'login' | 'logout' | 'create' | 'edit' | 'delete' | 'view' | 'failed_login';
  resource?: string;
  resourceType?: string;
  timestamp: string;
  ipAddress: string;
  device: string;
  browser: string;
  location: string;
  status: 'success' | 'failed' | 'warning';
}

interface UserAccessLogsProps {
  onNavigate?: (page: any) => void;
}

export function UserAccessLogs({ onNavigate }: UserAccessLogsProps) {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState('all');
  const [selectedAction, setSelectedAction] = useState('all');
  const [dateRange, setDateRange] = useState('today');
  const [isExporting, setIsExporting] = useState(false);

  // Access logs data
  const logs: AccessLog[] = [
    {
      id: 1,
      userId: 1,
      userName: 'Nguyễn Văn A',
      userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
      action: 'login',
      timestamp: '2024-12-30 09:15:23',
      ipAddress: '192.168.1.100',
      device: 'Desktop',
      browser: 'Chrome 120',
      location: 'Hà Nội, Việt Nam',
      status: 'success',
    },
    {
      id: 2,
      userId: 2,
      userName: 'Trần Thị B',
      userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
      action: 'edit',
      resource: 'AI Translation - Tương lai của dịch thuật',
      resourceType: 'article',
      timestamp: '2024-12-30 09:10:45',
      ipAddress: '192.168.1.105',
      device: 'Desktop',
      browser: 'Firefox 121',
      location: 'TP.HCM, Việt Nam',
      status: 'success',
    },
    {
      id: 3,
      userId: 3,
      userName: 'Lê Văn C',
      userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100',
      action: 'create',
      resource: 'Cloud Computing: Hướng dẫn cho người mới',
      resourceType: 'article',
      timestamp: '2024-12-30 08:45:12',
      ipAddress: '192.168.1.110',
      device: 'Mobile',
      browser: 'Safari 17',
      location: 'Đà Nẵng, Việt Nam',
      status: 'success',
    },
    {
      id: 4,
      userId: 4,
      userName: 'Phạm Thị D',
      action: 'failed_login',
      timestamp: '2024-12-30 08:30:00',
      ipAddress: '192.168.1.115',
      device: 'Desktop',
      browser: 'Chrome 120',
      location: 'Hà Nội, Việt Nam',
      status: 'failed',
    },
    {
      id: 5,
      userId: 1,
      userName: 'Nguyễn Văn A',
      userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
      action: 'delete',
      resource: 'Bài viết cũ không còn phù hợp',
      resourceType: 'article',
      timestamp: '2024-12-30 07:20:30',
      ipAddress: '192.168.1.100',
      device: 'Desktop',
      browser: 'Chrome 120',
      location: 'Hà Nội, Việt Nam',
      status: 'warning',
    },
    {
      id: 6,
      userId: 6,
      userName: 'Đỗ Thị F',
      action: 'view',
      resource: 'Báo cáo thống kê tháng 12',
      resourceType: 'report',
      timestamp: '2024-12-30 07:00:15',
      ipAddress: '192.168.1.120',
      device: 'Tablet',
      browser: 'Chrome 120',
      location: 'TP.HCM, Việt Nam',
      status: 'success',
    },
    {
      id: 7,
      userId: 2,
      userName: 'Trần Thị B',
      userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
      action: 'logout',
      timestamp: '2024-12-29 18:30:00',
      ipAddress: '192.168.1.105',
      device: 'Desktop',
      browser: 'Firefox 121',
      location: 'TP.HCM, Việt Nam',
      status: 'success',
    },
  ];

  const getActionInfo = (action: string) => {
    switch (action) {
      case 'login':
        return { icon: LogIn, label: t('users.accessLogs.loginLabel'), color: 'green' };
      case 'logout':
        return { icon: LogOut, label: t('users.accessLogs.logoutLabel'), color: 'gray' };
      case 'create':
        return { icon: FileText, label: t('users.accessLogs.createLabel'), color: 'blue' };
      case 'edit':
        return { icon: Edit, label: t('users.accessLogs.editLabel'), color: 'purple' };
      case 'delete':
        return { icon: Trash2, label: t('users.accessLogs.deleteLabel'), color: 'red' };
      case 'view':
        return { icon: Shield, label: t('users.accessLogs.viewLabel'), color: 'indigo' };
      case 'failed_login':
        return { icon: AlertTriangle, label: t('users.accessLogs.failedLoginLabel'), color: 'orange' };
      default:
        return { icon: Activity, label: action, color: 'gray' };
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'failed':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-orange-600" />;
      default:
        return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  const getDeviceIcon = (device: string) => {
    if (device.toLowerCase().includes('mobile') || device.toLowerCase().includes('tablet')) {
      return <Smartphone className="w-4 h-4" />;
    }
    return <Monitor className="w-4 h-4" />;
  };

  // Stats
  const stats = {
    totalActions: logs.length,
    successActions: logs.filter(l => l.status === 'success').length,
    failedActions: logs.filter(l => l.status === 'failed').length,
    uniqueUsers: new Set(logs.map(l => l.userId)).size,
  };

  const handleExport = () => {
    setIsExporting(true);
    // Simulate export process
    setTimeout(() => {
      // Create CSV content
      const headers = ['Thời gian', 'Người dùng', 'Hành động', 'Tài nguyên', 'Trạng thái', 'Thiết bị', 'Vị trí', 'IP'];
      const csvContent = [
        headers.join(','),
        ...logs.map(log => [
          log.timestamp,
          log.userName,
          getActionInfo(log.action).label,
          log.resource || '-',
          log.status,
          log.device,
          log.location,
          log.ipAddress
        ].join(','))
      ].join('\n');
      
      // Download CSV
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `access_logs_${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      
      setIsExporting(false);
      toast.success('Đã xuất báo cáo thành công!');
    }, 1500);
  };

  return (
    <PageWrapper>
      <div className="space-y-6">
        <PageHeader
          title={t('users.accessLogs.title')}
          description={t('users.accessLogs.description')}
          action={
            <button 
              onClick={handleExport}
              disabled={isExporting}
              className="flex items-center gap-2 px-4 py-3 border border-border/60 rounded-xl hover:bg-muted/50 transition-all duration-200 disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>{isExporting ? t('users.accessLogs.exporting') : t('users.accessLogs.exportCSV')}</span>
            </button>
          }
        />

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          <Card>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Activity className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">{stats.totalActions}</div>
                <div className="text-sm text-muted-foreground">{t('users.accessLogs.totalActions')}</div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-xl">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">{stats.successActions}</div>
                <div className="text-sm text-muted-foreground">{t('users.accessLogs.success')}</div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-100 rounded-xl">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">{stats.failedActions}</div>
                <div className="text-sm text-muted-foreground">{t('users.accessLogs.failed')}</div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-xl">
                <Shield className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">{stats.uniqueUsers}</div>
                <div className="text-sm text-muted-foreground">{t('users.accessLogs.activeUsers')}</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <div className="p-4 border-b border-border/60">
            <div className="grid grid-cols-4 gap-3">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder={t('users.accessLogs.searchLogs')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                />
              </div>

              <select
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                className="px-4 py-3 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
              >
                <option value="all">-- Người dùng --</option>
                <option value="1">Nguyễn Văn A</option>
                <option value="2">Trần Thị B</option>
                <option value="3">Lê Văn C</option>
              </select>

              <select
                value={selectedAction}
                onChange={(e) => setSelectedAction(e.target.value)}
                className="px-4 py-3 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
              >
                <option value="all">-- Hành động --</option>
                <option value="login">{t('users.accessLogs.login')}</option>
                <option value="logout">{t('users.accessLogs.logout')}</option>
                <option value="create">{t('users.accessLogs.create')}</option>
                <option value="edit">{t('users.accessLogs.edit')}</option>
                <option value="delete">{t('users.accessLogs.delete')}</option>
                <option value="view">{t('users.accessLogs.view')}</option>
              </select>

              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-4 py-3 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
              >
                <option value="today">{t('users.accessLogs.today')}</option>
                <option value="yesterday">{t('users.accessLogs.yesterday')}</option>
                <option value="7days">{t('users.accessLogs.last7Days')}</option>
                <option value="30days">{t('users.accessLogs.last30Days')}</option>
                <option value="custom">{t('users.accessLogs.customRange')}</option>
              </select>
            </div>
          </div>

          {/* Logs Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left px-6 py-4 text-sm text-muted-foreground">{t('users.accessLogs.status')}</th>
                  <th className="text-left px-6 py-4 text-sm text-muted-foreground">{t('users.accessLogs.user')}</th>
                  <th className="text-left px-6 py-4 text-sm text-muted-foreground">{t('users.accessLogs.action')}</th>
                  <th className="text-left px-6 py-4 text-sm text-muted-foreground">{t('users.accessLogs.resource')}</th>
                  <th className="text-left px-6 py-4 text-sm text-muted-foreground">{t('users.accessLogs.timestamp')}</th>
                  <th className="text-left px-6 py-4 text-sm text-muted-foreground">{t('users.accessLogs.device')}</th>
                  <th className="text-left px-6 py-4 text-sm text-muted-foreground">{t('users.accessLogs.location')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {logs.map((log) => {
                  const actionInfo = getActionInfo(log.action);
                  const ActionIcon = actionInfo.icon;
                  return (
                    <tr key={log.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4">
                        {getStatusIcon(log.status)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {log.userAvatar ? (
                            <img
                              src={log.userAvatar}
                              alt={log.userName}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                              {log.userName.charAt(0)}
                            </div>
                          )}
                          <div className="text-sm font-medium text-foreground">{log.userName}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-${actionInfo.color}-100 text-${actionInfo.color}-700`}>
                          <ActionIcon className="w-3 h-3" />
                          {actionInfo.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {log.resource ? (
                          <div className="text-sm text-foreground max-w-xs truncate">
                            {log.resource}
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          {log.timestamp}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          {getDeviceIcon(log.device)}
                          <div>
                            <div>{log.device}</div>
                            <div className="text-xs">{log.browser}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="w-4 h-4" />
                          <div>
                            <div>{log.location}</div>
                            <div className="text-xs">{log.ipAddress}</div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </PageWrapper>
  );
}