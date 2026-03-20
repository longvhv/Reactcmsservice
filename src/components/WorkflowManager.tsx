import React, { useState } from 'react';
import {
  Play, Pause, CheckCircle, XCircle, Clock, User, MessageSquare,
  Calendar, ArrowRight, Eye, Edit, Send, Archive, RefreshCw,
  AlertCircle, Bell, FileText, CheckSquare, Filter, Search,
  ChevronDown, ChevronRight, Tag, Zap
} from 'lucide-react';
import { Card } from './Card';
import { PageWrapper } from './PageWrapper';
import { PageHeader } from './PageHeader';
import { useLanguage } from '../contexts/LanguageContext';

interface WorkflowItem {
  id: number;
  article: {
    id: number;
    title: string;
    type: string;
    thumbnail: string;
    excerpt: string;
    author: {
      name: string;
      avatar: string;
    };
  };
  workflow: {
    status: 'draft' | 'pending' | 'in-review' | 'approved' | 'rejected' | 'published';
    currentStep: number;
    totalSteps: number;
    submittedAt: string;
    submittedBy: string;
    assignedTo: string;
    dueDate: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
  };
  history: {
    step: string;
    user: string;
    action: string;
    comment?: string;
    timestamp: string;
  }[];
  comments: {
    id: number;
    user: string;
    avatar: string;
    content: string;
    timestamp: string;
  }[];
}

export function WorkflowManager({ onNavigate }: { onNavigate: (page: any) => void }) {
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedItem, setExpandedItem] = useState<number | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<WorkflowItem | null>(null);
  const [reviewAction, setReviewAction] = useState<'approve' | 'reject' | 'request-changes'>('approve');
  const [reviewComment, setReviewComment] = useState('');

  // Mock workflow items
  const workflowItems: WorkflowItem[] = [
    {
      id: 1,
      article: {
        id: 101,
        title: 'AI Revolution: Xu hướng AI năm 2024',
        type: 'news',
        thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=250&fit=crop',
        excerpt: 'Phân tích sâu về các xu hướng AI đột phá sẽ định hình tương lai công nghệ.',
        author: {
          name: 'Nguyễn Văn A',
          avatar: 'https://i.pravatar.cc/150?img=1',
        },
      },
      workflow: {
        status: 'pending',
        currentStep: 1,
        totalSteps: 3,
        submittedAt: '2024-12-27 09:30',
        submittedBy: 'Nguyễn Văn A',
        assignedTo: 'Trần Thị B (Editor)',
        dueDate: '2024-12-28',
        priority: 'high',
      },
      history: [
        {
          step: 'Nháp',
          user: 'Nguyễn Văn A',
          action: 'Tạo bài viết',
          timestamp: '2024-12-26 14:00',
        },
        {
          step: 'Gửi duyệt',
          user: 'Nguyễn Văn A',
          action: 'Gửi bài viết để duyệt',
          comment: 'Bài viết đã hoàn thành, xin duyệt.',
          timestamp: '2024-12-27 09:30',
        },
      ],
      comments: [
        {
          id: 1,
          user: 'Nguyễn Văn A',
          avatar: 'https://i.pravatar.cc/150?img=1',
          content: 'Bài viết đã hoàn thành, mong được duyệt sớm.',
          timestamp: '2024-12-27 09:30',
        },
      ],
    },
    {
      id: 2,
      article: {
        id: 102,
        title: 'Blockchain & Web3: Cơ hội và thách thức',
        type: 'news',
        thumbnail: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=250&fit=crop',
        excerpt: 'Khám phá tiềm năng của công nghệ Blockchain và Web3 trong doanh nghiệp.',
        author: {
          name: 'Lê Văn C',
          avatar: 'https://i.pravatar.cc/150?img=3',
        },
      },
      workflow: {
        status: 'in-review',
        currentStep: 2,
        totalSteps: 3,
        submittedAt: '2024-12-26 15:20',
        submittedBy: 'Lê Văn C',
        assignedTo: 'Phạm Thị D (Reviewer)',
        dueDate: '2024-12-27',
        priority: 'urgent',
      },
      history: [
        {
          step: 'Nháp',
          user: 'Lê Văn C',
          action: 'Tạo bài viết',
          timestamp: '2024-12-25 10:00',
        },
        {
          step: 'Gửi duyệt',
          user: 'Lê Văn C',
          action: 'Gửi bài viết để duyệt',
          timestamp: '2024-12-26 15:20',
        },
        {
          step: 'Đang duyệt',
          user: 'Trần Thị B',
          action: 'Bắt đầu xem xét',
          comment: 'Đang kiểm tra nội dung và hình ảnh.',
          timestamp: '2024-12-26 16:00',
        },
      ],
      comments: [
        {
          id: 1,
          user: 'Lê Văn C',
          avatar: 'https://i.pravatar.cc/150?img=3',
          content: 'Bài viết quan trọng, mong được ưu tiên duyệt.',
          timestamp: '2024-12-26 15:20',
        },
        {
          id: 2,
          user: 'Trần Thị B',
          avatar: 'https://i.pravatar.cc/150?img=2',
          content: 'Đang xem xét, có thể cần chỉnh sửa một số nội dung.',
          timestamp: '2024-12-26 16:00',
        },
      ],
    },
    {
      id: 3,
      article: {
        id: 103,
        title: 'Cloud Infrastructure: Best Practices',
        type: 'news',
        thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=250&fit=crop',
        excerpt: 'Hướng dẫn chi tiết về cách xây dựng hạ tầng Cloud hiệu quả.',
        author: {
          name: 'Trần Thị B',
          avatar: 'https://i.pravatar.cc/150?img=2',
        },
      },
      workflow: {
        status: 'approved',
        currentStep: 3,
        totalSteps: 3,
        submittedAt: '2024-12-25 11:00',
        submittedBy: 'Trần Thị B',
        assignedTo: 'Admin',
        dueDate: '2024-12-27',
        priority: 'medium',
      },
      history: [
        {
          step: 'Nháp',
          user: 'Trần Thị B',
          action: 'Tạo bài viết',
          timestamp: '2024-12-24 09:00',
        },
        {
          step: 'Gửi duyệt',
          user: 'Trần Thị B',
          action: 'Gửi bài viết để duyệt',
          timestamp: '2024-12-25 11:00',
        },
        {
          step: 'Đang duyệt',
          user: 'Admin',
          action: 'Bắt đầu xem xét',
          timestamp: '2024-12-25 14:00',
        },
        {
          step: 'Đã duyệt',
          user: 'Admin',
          action: 'Phê duyệt bài viết',
          comment: 'Nội dung tốt, đã duyệt để xuất bản.',
          timestamp: '2024-12-25 15:30',
        },
      ],
      comments: [],
    },
  ];

  const statusConfig = {
    draft: { label: 'Nháp', color: 'gray', icon: Edit },
    pending: { label: 'Chờ duyệt', color: 'yellow', icon: Clock },
    'in-review': { label: 'Đang duyệt', color: 'blue', icon: Eye },
    approved: { label: 'Đã duyệt', color: 'green', icon: CheckCircle },
    rejected: { label: 'Từ chối', color: 'red', icon: XCircle },
    published: { label: 'Đã xuất bản', color: 'purple', icon: Send },
  };

  const priorityConfig = {
    low: { label: 'Thấp', color: 'gray' },
    medium: { label: 'Trung bình', color: 'blue' },
    high: { label: 'Cao', color: 'orange' },
    urgent: { label: 'Khẩn cấp', color: 'red' },
  };

  const filteredItems = workflowItems.filter((item) => {
    const matchesStatus = selectedStatus === 'all' || item.workflow.status === selectedStatus;
    const matchesPriority = selectedPriority === 'all' || item.workflow.priority === selectedPriority;
    const matchesSearch = item.article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.article.author.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesPriority && matchesSearch;
  });

  const stats = {
    pending: workflowItems.filter(i => i.workflow.status === 'pending').length,
    inReview: workflowItems.filter(i => i.workflow.status === 'in-review').length,
    approved: workflowItems.filter(i => i.workflow.status === 'approved').length,
    rejected: workflowItems.filter(i => i.workflow.status === 'rejected').length,
  };

  const handleReview = (item: WorkflowItem, action: 'approve' | 'reject' | 'request-changes') => {
    setSelectedItem(item);
    setReviewAction(action);
    setShowReviewModal(true);
  };

  const submitReview = () => {
    console.log('Review submitted:', {
      item: selectedItem?.id,
      action: reviewAction,
      comment: reviewComment,
    });
    setShowReviewModal(false);
    setReviewComment('');
    setSelectedItem(null);
  };

  return (
    <PageWrapper>
      <PageHeader
        title="Quản lý Workflow"
        description="Xem xét và phê duyệt bài viết"
      />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl">
              <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Chờ duyệt</p>
              <p className="text-2xl font-bold">{stats.pending}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
              <Eye className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Đang duyệt</p>
              <p className="text-2xl font-bold">{stats.inReview}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Đã duyệt</p>
              <p className="text-2xl font-bold">{stats.approved}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-xl">
              <XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Từ chối</p>
              <p className="text-2xl font-bold">{stats.rejected}</p>
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
              placeholder={t('placeholders.searchArticles')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2.5 bg-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="all">-- Trạng thái --</option>
            {Object.entries(statusConfig).map(([key, config]) => (
              <option key={key} value={key}>{config.label}</option>
            ))}
          </select>

          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="px-4 py-2.5 bg-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="all">-- Độ ưu tiên --</option>
            {Object.entries(priorityConfig).map(([key, config]) => (
              <option key={key} value={key}>{config.label}</option>
            ))}
          </select>
        </div>
      </Card>

      {/* Workflow Items */}
      <div className="space-y-4">
        {filteredItems.map((item) => {
          const statusInfo = statusConfig[item.workflow.status];
          const priorityInfo = priorityConfig[item.workflow.priority];
          const StatusIcon = statusInfo.icon;
          const isExpanded = expandedItem === item.id;

          return (
            <Card key={item.id} className="overflow-hidden">
              {/* Header */}
              <div className="p-6">
                <div className="flex gap-4">
                  {/* Thumbnail */}
                  <img
                    src={item.article.thumbnail}
                    alt={item.article.title}
                    className="w-32 h-24 object-cover rounded-xl flex-shrink-0"
                  />

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 
                          className="font-semibold text-lg mb-2 hover:text-blue-500 cursor-pointer"
                          onClick={() => onNavigate({ page: 'article-detail', id: item.article.id })}
                        >
                          {item.article.title}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                          {item.article.excerpt}
                        </p>
                      </div>
                      
                      <div className="flex gap-2 ml-4">
                        <span className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 bg-${statusInfo.color}-100 dark:bg-${statusInfo.color}-900/30 text-${statusInfo.color}-600 dark:text-${statusInfo.color}-400`}>
                          <StatusIcon className="w-3 h-3" />
                          {statusInfo.label}
                        </span>
                        <span className={`px-3 py-1 rounded-lg text-xs font-semibold bg-${priorityInfo.color}-100 dark:bg-${priorityInfo.color}-900/30 text-${priorityInfo.color}-600 dark:text-${priorityInfo.color}-400`}>
                          {priorityInfo.label}
                        </span>
                      </div>
                    </div>

                    {/* Workflow Progress */}
                    <div className="mb-3">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs text-muted-foreground">
                          Bước {item.workflow.currentStep}/{item.workflow.totalSteps}
                        </span>
                        <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                          <div
                            className={`h-full bg-${statusInfo.color}-500 transition-all`}
                            style={{ width: `${(item.workflow.currentStep / item.workflow.totalSteps) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Meta Info */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <img
                          src={item.article.author.avatar}
                          alt={item.article.author.name}
                          className="w-6 h-6 rounded-full"
                        />
                        <span>{item.article.author.name}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        <span>{item.workflow.assignedTo}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>Hạn: {item.workflow.dueDate}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="w-4 h-4" />
                        <span>{item.comments.length} bình luận</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 mt-4 pt-4 border-t border-border">
                  <button
                    onClick={() => setExpandedItem(isExpanded ? null : item.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-secondary hover:bg-muted rounded-xl transition-colors"
                  >
                    {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    {isExpanded ? 'Thu gọn' : 'Xem chi tiết'}
                  </button>

                  {(item.workflow.status === 'pending' || item.workflow.status === 'in-review') && (
                    <>
                      <button
                        onClick={() => handleReview(item, 'approve')}
                        className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Phê duyệt
                      </button>
                      <button
                        onClick={() => handleReview(item, 'request-changes')}
                        className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-xl hover:bg-yellow-600 transition-colors"
                      >
                        <RefreshCw className="w-4 h-4" />
                        Yêu cầu sửa
                      </button>
                      <button
                        onClick={() => handleReview(item, 'reject')}
                        className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
                      >
                        <XCircle className="w-4 h-4" />
                        Từ chối
                      </button>
                    </>
                  )}

                  {item.workflow.status === 'approved' && (
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors">
                      <Send className="w-4 h-4" />
                      Xuất bản
                    </button>
                  )}
                </div>
              </div>

              {/* Expanded Details */}
              {isExpanded && (
                <div className="px-6 pb-6 border-t border-border pt-6 bg-secondary/30">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* History Timeline */}
                    <div>
                      <h4 className="font-semibold mb-4 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-blue-500" />
                        Lịch sử workflow
                      </h4>
                      <div className="space-y-4">
                        {item.history.map((h, idx) => (
                          <div key={idx} className="flex gap-3">
                            <div className="flex flex-col items-center">
                              <div className="w-3 h-3 rounded-full bg-blue-500" />
                              {idx < item.history.length - 1 && (
                                <div className="w-0.5 h-full bg-border my-1" />
                              )}
                            </div>
                            <div className="flex-1 pb-4">
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-medium">{h.step}</span>
                                <span className="text-xs text-muted-foreground">{h.timestamp}</span>
                              </div>
                              <p className="text-sm text-muted-foreground mb-1">
                                {h.user} - {h.action}
                              </p>
                              {h.comment && (
                                <p className="text-sm bg-muted p-2 rounded-lg mt-2">
                                  {h.comment}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Comments */}
                    <div>
                      <h4 className="font-semibold mb-4 flex items-center gap-2">
                        <MessageSquare className="w-5 h-5 text-blue-500" />
                        Bình luận ({item.comments.length})
                      </h4>
                      <div className="space-y-4">
                        {item.comments.map((comment) => (
                          <div key={comment.id} className="flex gap-3">
                            <img
                              src={comment.avatar}
                              alt={comment.user}
                              className="w-10 h-10 rounded-full flex-shrink-0"
                            />
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-medium">{comment.user}</span>
                                <span className="text-xs text-muted-foreground">{comment.timestamp}</span>
                              </div>
                              <p className="text-sm bg-muted p-3 rounded-lg">
                                {comment.content}
                              </p>
                            </div>
                          </div>
                        ))}

                        {/* Add Comment */}
                        <div className="flex gap-3 pt-4 border-t border-border">
                          <input
                            type="text"
                            placeholder="Thêm bình luận..."
                            className="flex-1 px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                          />
                          <button className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors">
                            <Send className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          );
        })}

        {filteredItems.length === 0 && (
          <Card className="p-12 text-center">
            <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Không tìm thấy bài viết nào trong workflow</p>
          </Card>
        )}
      </div>

      {/* Review Modal */}
      {showReviewModal && selectedItem && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-4">
                {reviewAction === 'approve' && 'Phê duyệt bài viết'}
                {reviewAction === 'reject' && 'Từ chối bài viết'}
                {reviewAction === 'request-changes' && 'Yêu cầu chỉnh sửa'}
              </h3>

              {/* Article Preview */}
              <div className="p-4 bg-secondary rounded-xl mb-4">
                <div className="flex gap-4">
                  <img
                    src={selectedItem.article.thumbnail}
                    alt={selectedItem.article.title}
                    className="w-24 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1">{selectedItem.article.title}</h4>
                    <p className="text-sm text-muted-foreground">{selectedItem.article.excerpt}</p>
                  </div>
                </div>
              </div>

              {/* Review Comment */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">
                  {reviewAction === 'approve' && 'Ghi chú (tùy chọn)'}
                  {reviewAction === 'reject' && 'Lý do từ chối *'}
                  {reviewAction === 'request-changes' && 'Yêu cầu chỉnh sửa *'}
                </label>
                <textarea
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder={
                    reviewAction === 'approve' 
                      ? 'Nhập ghi chú về bài viết...'
                      : reviewAction === 'reject'
                      ? 'Nhập lý do từ chối bài viết...'
                      : 'Nhập các điểm cần chỉnh sửa...'
                  }
                  rows={6}
                  className="w-full px-4 py-3 bg-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowReviewModal(false);
                    setReviewComment('');
                    setSelectedItem(null);
                  }}
                  className="flex-1 px-4 py-2.5 bg-secondary hover:bg-muted rounded-xl transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={submitReview}
                  className={`flex-1 px-4 py-2.5 text-white rounded-xl transition-all hover:shadow-lg ${
                    reviewAction === 'approve' ? 'bg-green-500 hover:bg-green-600' :
                    reviewAction === 'reject' ? 'bg-red-500 hover:bg-red-600' :
                    'bg-yellow-500 hover:bg-yellow-600'
                  }`}
                >
                  {reviewAction === 'approve' && 'Phê duyệt'}
                  {reviewAction === 'reject' && 'Từ chối'}
                  {reviewAction === 'request-changes' && 'Gửi yêu cầu'}
                </button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </PageWrapper>
  );
}