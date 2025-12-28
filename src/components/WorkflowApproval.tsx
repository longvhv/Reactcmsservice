import { useState } from 'react';
import { CheckCircle, XCircle, Clock, AlertCircle, User, Calendar, MessageSquare, Eye, ArrowRight, FileText, Video, Image as ImageIcon } from 'lucide-react';
import { PageWrapper } from './PageWrapper';
import { PageHeader } from './PageHeader';
import { Card } from './Card';
import { useLanguage } from '../contexts/LanguageContext';

interface WorkflowItem {
  id: number;
  title: string;
  type: 'news' | 'video' | 'gallery';
  author: string;
  submittedDate: string;
  status: 'pending' | 'in-review' | 'approved' | 'rejected';
  currentStep: number;
  totalSteps: number;
  reviewer?: string;
  priority: 'low' | 'medium' | 'high';
  comments: number;
}

export function WorkflowApproval() {
  const { t } = useLanguage();
  const [selectedTab, setSelectedTab] = useState<'pending' | 'in-review' | 'approved' | 'rejected'>('pending');

  const workflowItems: WorkflowItem[] = [
    {
      id: 1,
      title: 'Hướng dẫn React Hooks chi tiết cho người mới bắt đầu',
      type: 'news',
      author: 'Nguyễn Văn A',
      submittedDate: '2 giờ trước',
      status: 'pending',
      currentStep: 1,
      totalSteps: 3,
      priority: 'high',
      comments: 2,
    },
    {
      id: 2,
      title: 'Video tutorial: Build modern web app with Next.js',
      type: 'video',
      author: 'Trần Thị B',
      submittedDate: '5 giờ trước',
      status: 'in-review',
      currentStep: 2,
      totalSteps: 3,
      reviewer: 'Editor Chief',
      priority: 'medium',
      comments: 5,
    },
    {
      id: 3,
      title: 'Gallery: Tech Conference 2024 - Những hình ảnh đẹp nhất',
      type: 'gallery',
      author: 'Lê Văn C',
      submittedDate: '1 ngày trước',
      status: 'approved',
      currentStep: 3,
      totalSteps: 3,
      reviewer: 'Editor Chief',
      priority: 'low',
      comments: 1,
    },
    {
      id: 4,
      title: 'Best practices for SEO in 2024',
      type: 'news',
      author: 'Phạm Thị D',
      submittedDate: '2 ngày trước',
      status: 'rejected',
      currentStep: 2,
      totalSteps: 3,
      reviewer: 'Content Manager',
      priority: 'medium',
      comments: 8,
    },
  ];

  const tabs = [
    { id: 'pending', label: 'Chờ duyệt', count: workflowItems.filter(i => i.status === 'pending').length, color: 'yellow' },
    { id: 'in-review', label: 'Đang xét duyệt', count: workflowItems.filter(i => i.status === 'in-review').length, color: 'blue' },
    { id: 'approved', label: 'Đã phê duyệt', count: workflowItems.filter(i => i.status === 'approved').length, color: 'green' },
    { id: 'rejected', label: 'Từ chối', count: workflowItems.filter(i => i.status === 'rejected').length, color: 'red' },
  ];

  const workflowSteps = [
    { id: 1, name: 'Nộp bài', role: 'Author' },
    { id: 2, name: 'Kiểm tra nội dung', role: 'Content Manager' },
    { id: 3, name: 'Phê duyệt cuối', role: 'Editor Chief' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'in-review': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'approved': return 'bg-green-100 text-green-700 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700';
      case 'medium': return 'bg-orange-100 text-orange-700';
      case 'low': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'news': return FileText;
      case 'video': return Video;
      case 'gallery': return ImageIcon;
      default: return FileText;
    }
  };

  const filteredItems = workflowItems.filter(item => item.status === selectedTab);

  return (
    <PageWrapper>
      <div className="space-y-6">
        {/* Header */}
        <PageHeader
          title="Quy trình phê duyệt"
          description="Quản lý workflow xuất bản nội dung"
          action={
            <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-200">
              Cài đặt workflow
            </button>
          }
        />

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-4">
          {tabs.map((tab) => (
            <div key={tab.id} className={`bg-gradient-to-br from-${tab.color}-50 to-${tab.color}-100 border border-${tab.color}-200 rounded-2xl p-6 cursor-pointer hover:shadow-lg transition-all duration-200`}>
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 bg-${tab.color}-500 rounded-xl`}>
                  {tab.id === 'pending' && <Clock className="w-6 h-6 text-white" />}
                  {tab.id === 'in-review' && <AlertCircle className="w-6 h-6 text-white" />}
                  {tab.id === 'approved' && <CheckCircle className="w-6 h-6 text-white" />}
                  {tab.id === 'rejected' && <XCircle className="w-6 h-6 text-white" />}
                </div>
              </div>
              <div className={`text-3xl font-bold text-${tab.color}-700 mb-1`}>{tab.count}</div>
              <div className={`text-sm text-${tab.color}-600`}>{tab.label}</div>
            </div>
          ))}
        </div>

        {/* Workflow Diagram */}
        <Card>
          <h3 className="text-foreground mb-6">Quy trình phê duyệt (3 bước)</h3>
          
          <div className="flex items-center justify-between">
            {workflowSteps.map((step, idx) => (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl mb-3 shadow-lg">
                    {step.id}
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-foreground mb-1">{step.name}</div>
                    <div className="text-xs text-muted-foreground">{step.role}</div>
                  </div>
                </div>
                {idx < workflowSteps.length - 1 && (
                  <ArrowRight className="w-8 h-8 text-muted-foreground mx-4" />
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* Tabs */}
        <Card>
          <div className="border-b border-border/60 bg-muted/30">
            <div className="flex items-center gap-1 p-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-200 ${
                    selectedTab === tab.id
                      ? 'bg-card text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(tab.id)}`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Items List */}
          <div className="divide-y divide-border/60">
            {filteredItems.map((item) => {
              const TypeIcon = getTypeIcon(item.type);
              return (
                <div key={item.id} className="p-6 hover:bg-muted/30 transition-colors">
                  <div className="flex items-start gap-4">
                    {/* Type Icon */}
                    <div className="p-3 bg-blue-100 rounded-xl">
                      <TypeIcon className="w-6 h-6 text-blue-600" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="text-foreground font-medium mb-2 pr-4">{item.title}</h4>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <User className="w-4 h-4" />
                              {item.author}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {item.submittedDate}
                            </span>
                            {item.reviewer && (
                              <>
                                <span>•</span>
                                <span>Người duyệt: {item.reviewer}</span>
                              </>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(item.priority)}`}>
                            {item.priority === 'high' ? 'Ưu tiên cao' : item.priority === 'medium' ? 'Trung bình' : 'Thấp'}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(item.status)}`}>
                            Bước {item.currentStep}/{item.totalSteps}
                          </span>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
                            style={{ width: `${(item.currentStep / item.totalSteps) * 100}%` }}
                          />
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {item.comments > 0 && (
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <MessageSquare className="w-4 h-4" />
                              <span>{item.comments} nhận xét</span>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          {item.status === 'pending' && (
                            <>
                              <button className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-xl hover:bg-green-200 transition-colors">
                                <CheckCircle className="w-4 h-4" />
                                <span>Duyệt & tiếp tục</span>
                              </button>
                              <button className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-xl hover:bg-red-200 transition-colors">
                                <XCircle className="w-4 h-4" />
                                <span>Từ chối</span>
                              </button>
                            </>
                          )}
                          {item.status === 'in-review' && (
                            <button className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-xl hover:bg-blue-200 transition-colors">
                              <AlertCircle className="w-4 h-4" />
                              <span>Đang xét duyệt...</span>
                            </button>
                          )}
                          <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Activity Timeline */}
        <div className="grid grid-cols-2 gap-6">
          <Card>
            <h3 className="text-foreground mb-6">Hoạt động gần đây</h3>
            <div className="space-y-4">
              {[
                { action: 'Đã phê duyệt', item: 'Gallery Tech Conference', user: 'Editor Chief', time: '5 phút trước' },
                { action: 'Chuyển sang bước 2', item: 'Video tutorial Next.js', user: 'Content Manager', time: '1 giờ trước' },
                { action: 'Từ chối', item: 'Best practices SEO', user: 'Content Manager', time: '2 giờ trước' },
              ].map((activity, idx) => (
                <div key={idx} className="flex items-start gap-3 pb-4 border-b border-border/60 last:border-0">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-medium flex-shrink-0">
                    {activity.user.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-foreground mb-1">
                      <span className="font-medium">{activity.user}</span> {activity.action.toLowerCase()}{' '}
                      <span className="font-medium">{activity.item}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">{activity.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h3 className="text-foreground mb-6">Thống kê hiệu suất</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-xl">
                <div>
                  <div className="text-sm text-green-800 mb-1">Tỷ lệ phê duyệt</div>
                  <div className="text-2xl font-bold text-green-700">87.5%</div>
                </div>
                <CheckCircle className="w-10 h-10 text-green-500" />
              </div>

              <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <div>
                  <div className="text-sm text-blue-800 mb-1">Thời gian duyệt TB</div>
                  <div className="text-2xl font-bold text-blue-700">2.4 giờ</div>
                </div>
                <Clock className="w-10 h-10 text-blue-500" />
              </div>

              <div className="flex items-center justify-between p-4 bg-orange-50 border border-orange-200 rounded-xl">
                <div>
                  <div className="text-sm text-orange-800 mb-1">Đang chờ xử lý</div>
                  <div className="text-2xl font-bold text-orange-700">12</div>
                </div>
                <AlertCircle className="w-10 h-10 text-orange-500" />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </PageWrapper>
  );
}