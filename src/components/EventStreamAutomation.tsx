import React, { useState } from 'react';
import {
  Zap, Plus, Play, Pause, Trash2, Edit, Copy, Calendar,
  Bell, Mail, Send, CheckCircle, X, ChevronRight, Settings,
  Clock, Target, Filter, TrendingUp, Users, FileText, Share2
} from 'lucide-react';
import { Card } from './Card';
import { PageWrapper } from './PageWrapper';
import { PageHeader } from './PageHeader';

interface AutomationRule {
  id: string;
  name: string;
  description: string;
  trigger: {
    type: 'article_published' | 'view_threshold' | 'schedule' | 'follower_milestone' | 'engagement_rate';
    condition: string;
  };
  actions: {
    type: 'notify' | 'email' | 'publish_next' | 'share_social' | 'update_status';
    config: any;
  }[];
  status: 'active' | 'paused' | 'draft';
  lastRun?: string;
  executions: number;
  createdAt: string;
}

export function EventStreamAutomation({ streamId, streamColor }: { streamId: string; streamColor: string }) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedRule, setSelectedRule] = useState<AutomationRule | null>(null);

  const rules: AutomationRule[] = [
    {
      id: 'r1',
      name: 'Auto-publish next article',
      description: 'Tự động xuất bản bài viết tiếp theo sau 3 ngày khi bài trước đạt 1000 views',
      trigger: {
        type: 'view_threshold',
        condition: 'Views >= 1000',
      },
      actions: [
        { type: 'publish_next', config: { delay: '3 days' } },
        { type: 'notify', config: { users: ['admin', 'editors'], message: 'New article published' } },
      ],
      status: 'active',
      lastRun: '2024-01-25T14:30:00',
      executions: 8,
      createdAt: '2024-01-10',
    },
    {
      id: 'r2',
      name: 'Weekly engagement report',
      description: 'Gửi báo cáo engagement hàng tuần cho team',
      trigger: {
        type: 'schedule',
        condition: 'Every Monday 9:00 AM',
      },
      actions: [
        { type: 'email', config: { to: 'team@example.com', template: 'weekly_report' } },
      ],
      status: 'active',
      lastRun: '2024-01-22T09:00:00',
      executions: 12,
      createdAt: '2024-01-01',
    },
    {
      id: 'r3',
      name: 'Follower milestone celebration',
      description: 'Thông báo và share khi đạt mốc followers mới',
      trigger: {
        type: 'follower_milestone',
        condition: 'Every 500 followers',
      },
      actions: [
        { type: 'notify', config: { users: 'all', message: 'Milestone reached!' } },
        { type: 'share_social', config: { platforms: ['facebook', 'twitter'] } },
      ],
      status: 'active',
      lastRun: '2024-01-20T16:45:00',
      executions: 3,
      createdAt: '2024-01-05',
    },
    {
      id: 'r4',
      name: 'Low engagement alert',
      description: 'Cảnh báo khi engagement rate giảm dưới 5% trong 7 ngày',
      trigger: {
        type: 'engagement_rate',
        condition: 'Rate < 5% for 7 days',
      },
      actions: [
        { type: 'notify', config: { users: ['admin'], priority: 'high' } },
        { type: 'email', config: { to: 'admin@example.com', subject: 'Low engagement alert' } },
      ],
      status: 'paused',
      executions: 1,
      createdAt: '2024-01-15',
    },
  ];

  const triggerTypes = [
    {
      key: 'article_published',
      label: 'Khi bài viết được xuất bản',
      icon: FileText,
      color: '#3B82F6',
    },
    {
      key: 'view_threshold',
      label: 'Khi đạt ngưỡng lượt xem',
      icon: TrendingUp,
      color: '#10B981',
    },
    {
      key: 'schedule',
      label: 'Theo lịch định kỳ',
      icon: Calendar,
      color: '#8B5CF6',
    },
    {
      key: 'follower_milestone',
      label: 'Khi đạt mốc followers',
      icon: Users,
      color: '#EC4899',
    },
    {
      key: 'engagement_rate',
      label: 'Dựa trên tỷ lệ tương tác',
      icon: Target,
      color: '#F59E0B',
    },
  ];

  const actionTypes = [
    {
      key: 'notify',
      label: 'Gửi thông báo',
      icon: Bell,
      color: '#3B82F6',
    },
    {
      key: 'email',
      label: 'Gửi email',
      icon: Mail,
      color: '#10B981',
    },
    {
      key: 'publish_next',
      label: 'Xuất bản bài tiếp theo',
      icon: FileText,
      color: '#8B5CF6',
    },
    {
      key: 'share_social',
      label: 'Chia sẻ mạng xã hội',
      icon: Share2,
      color: '#EC4899',
    },
    {
      key: 'update_status',
      label: 'Cập nhật trạng thái',
      icon: Settings,
      color: '#F59E0B',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400';
      case 'paused': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400';
      case 'draft': return 'bg-gray-100 dark:bg-gray-900/30 text-gray-600 dark:text-gray-400';
      default: return 'bg-gray-100 dark:bg-gray-900/30 text-gray-600 dark:text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Play className="w-3 h-3" />;
      case 'paused': return <Pause className="w-3 h-3" />;
      default: return <Edit className="w-3 h-3" />;
    }
  };

  return (
    <PageWrapper>
      <PageHeader
        title="Tự động hóa"
        description="Thiết lập rules tự động cho dòng sự kiện"
        action={
          <button 
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2.5 text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-2"
            style={{ backgroundColor: streamColor }}
          >
            <Plus className="w-4 h-4" />
            Tạo rule mới
          </button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Zap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-sm text-muted-foreground">Tổng rules</span>
          </div>
          <p className="text-2xl font-bold">{rules.length}</p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <Play className="w-4 h-4 text-green-600 dark:text-green-400" />
            </div>
            <span className="text-sm text-muted-foreground">Đang chạy</span>
          </div>
          <p className="text-2xl font-bold">{rules.filter(r => r.status === 'active').length}</p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <CheckCircle className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            </div>
            <span className="text-sm text-muted-foreground">Đã thực thi</span>
          </div>
          <p className="text-2xl font-bold">{rules.reduce((sum, r) => sum + r.executions, 0)}</p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <Clock className="w-4 h-4 text-orange-600 dark:text-orange-400" />
            </div>
            <span className="text-sm text-muted-foreground">Hôm nay</span>
          </div>
          <p className="text-2xl font-bold">5</p>
        </Card>
      </div>

      {/* Rules List */}
      <div className="space-y-4">
        {rules.map((rule) => (
          <Card key={rule.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold">{rule.name}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${getStatusColor(rule.status)}`}>
                      {getStatusIcon(rule.status)}
                      {rule.status === 'active' ? 'Đang chạy' : rule.status === 'paused' ? 'Tạm dừng' : 'Nháp'}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{rule.description}</p>
                  
                  {rule.lastRun && (
                    <p className="text-xs text-muted-foreground">
                      Chạy lần cuối: {new Date(rule.lastRun).toLocaleString('vi-VN')} • {rule.executions} lần thực thi
                    </p>
                  )}
                </div>

                <div className="flex gap-2">
                  <button className="p-2 hover:bg-secondary rounded-lg transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="p-2 hover:bg-secondary rounded-lg transition-colors">
                    <Copy className="w-4 h-4" />
                  </button>
                  <button className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              </div>

              {/* Rule Flow */}
              <div className="flex items-center gap-4 p-4 bg-secondary rounded-xl">
                {/* Trigger */}
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground mb-2 uppercase font-semibold">Khi</p>
                  <div className="flex items-center gap-2 p-3 bg-card rounded-lg">
                    <Zap className="w-4 h-4" style={{ color: streamColor }} />
                    <div>
                      <p className="text-sm font-medium">{rule.trigger.type.replace('_', ' ')}</p>
                      <p className="text-xs text-muted-foreground">{rule.trigger.condition}</p>
                    </div>
                  </div>
                </div>

                <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />

                {/* Actions */}
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground mb-2 uppercase font-semibold">Thì</p>
                  <div className="space-y-2">
                    {rule.actions.map((action, index) => {
                      const actionType = actionTypes.find(t => t.key === action.type);
                      const Icon = actionType?.icon || Settings;
                      return (
                        <div key={index} className="flex items-center gap-2 p-2 bg-card rounded-lg">
                          <Icon className="w-4 h-4" style={{ color: actionType?.color }} />
                          <p className="text-sm">{actionType?.label}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Quick Toggle */}
                <button
                  className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                    rule.status === 'active'
                      ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 hover:bg-yellow-200'
                      : 'text-white hover:shadow-lg'
                  }`}
                  style={rule.status !== 'active' ? { backgroundColor: streamColor } : {}}
                >
                  {rule.status === 'active' ? (
                    <>
                      <Pause className="w-4 h-4" />
                      Tạm dừng
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" />
                      Kích hoạt
                    </>
                  )}
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Create Rule Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">Tạo rule tự động hóa mới</h3>
                <button 
                  onClick={() => setShowCreateModal(false)}
                  className="p-2 hover:bg-secondary rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Basic Info */}
                <div>
                  <label className="block text-sm font-medium mb-2">Tên rule</label>
                  <input
                    type="text"
                    placeholder="VD: Auto-publish weekly article"
                    className="w-full px-4 py-2.5 bg-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Mô tả</label>
                  <textarea
                    placeholder="Mô tả ngắn gọn về rule này..."
                    rows={3}
                    className="w-full px-4 py-2.5 bg-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
                  />
                </div>

                {/* Trigger */}
                <div>
                  <label className="block text-sm font-medium mb-3">Kích hoạt khi</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {triggerTypes.map((trigger) => {
                      const Icon = trigger.icon;
                      return (
                        <button
                          key={trigger.key}
                          className="p-4 bg-secondary hover:bg-muted rounded-xl text-left transition-colors group"
                        >
                          <div className="flex items-center gap-3 mb-2">
                            <div 
                              className="p-2 rounded-lg"
                              style={{ backgroundColor: `${trigger.color}20` }}
                            >
                              <Icon className="w-5 h-5" style={{ color: trigger.color }} />
                            </div>
                            <p className="font-medium text-sm">{trigger.label}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Actions */}
                <div>
                  <label className="block text-sm font-medium mb-3">Hành động</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {actionTypes.map((action) => {
                      const Icon = action.icon;
                      return (
                        <button
                          key={action.key}
                          className="p-4 bg-secondary hover:bg-muted rounded-xl text-left transition-colors group"
                        >
                          <div className="flex items-center gap-3">
                            <div 
                              className="p-2 rounded-lg"
                              style={{ backgroundColor: `${action.color}20` }}
                            >
                              <Icon className="w-5 h-5" style={{ color: action.color }} />
                            </div>
                            <p className="font-medium text-sm">{action.label}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-border">
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 px-4 py-2.5 bg-secondary hover:bg-secondary/80 rounded-xl transition-colors"
                  >
                    Hủy
                  </button>
                  <button
                    className="flex-1 px-4 py-2.5 text-white rounded-xl hover:shadow-lg transition-all"
                    style={{ backgroundColor: streamColor }}
                  >
                    Tạo rule
                  </button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Templates */}
      <Card className="p-6 mt-6">
        <h3 className="font-semibold text-lg mb-4">Templates phổ biến</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              name: 'Auto-publish schedule',
              description: 'Tự động xuất bản bài viết theo lịch định kỳ',
              icon: Calendar,
              color: '#3B82F6',
            },
            {
              name: 'Engagement notifications',
              description: 'Thông báo khi có tương tác cao',
              icon: Bell,
              color: '#10B981',
            },
            {
              name: 'Social media sharing',
              description: 'Tự động chia sẻ lên mạng xã hội',
              icon: Share2,
              color: '#EC4899',
            },
            {
              name: 'Performance alerts',
              description: 'Cảnh báo khi hiệu suất thay đổi',
              icon: TrendingUp,
              color: '#F59E0B',
            },
          ].map((template) => {
            const Icon = template.icon;
            return (
              <button
                key={template.name}
                className="p-4 bg-secondary hover:bg-muted rounded-xl text-left transition-colors group"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div 
                    className="p-2 rounded-lg"
                    style={{ backgroundColor: `${template.color}20` }}
                  >
                    <Icon className="w-5 h-5" style={{ color: template.color }} />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{template.name}</p>
                    <p className="text-xs text-muted-foreground">{template.description}</p>
                  </div>
                  <Plus className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </button>
            );
          })}
        </div>
      </Card>
    </PageWrapper>
  );
}
