import { useState } from 'react';
import { 
  CheckCircle2, XCircle, Clock, AlertCircle, MessageSquare, 
  Eye, Edit3, Send, ArrowRight, Users, Calendar, Filter,
  CheckSquare, Sparkles, History, Tag, User
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';

// Types
export type ApprovalStatus = 'draft' | 'pending' | 'approved' | 'rejected' | 'published';

export interface ApprovalAction {
  id: string;
  action: 'submit' | 'approve' | 'reject' | 'request_changes' | 'publish';
  userId: string;
  userName: string;
  userAvatar?: string;
  timestamp: Date;
  comment?: string;
  level?: number; // For multi-level approval
}

export interface Article {
  id: string;
  title: string;
  author: string;
  authorAvatar?: string;
  category: string;
  status: ApprovalStatus;
  submittedAt?: Date;
  currentLevel: number;
  requiredLevel: number;
  approvalHistory: ApprovalAction[];
  comments: number;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  tags: string[];
}

interface ApprovalWorkflowProps {
  onApprove?: (articleId: string, comment?: string) => void;
  onReject?: (articleId: string, comment: string) => void;
  onRequestChanges?: (articleId: string, comment: string) => void;
}

export function ApprovalWorkflow({ onApprove, onReject, onRequestChanges }: ApprovalWorkflowProps) {
  const { t } = useLanguage();
  const [selectedTab, setSelectedTab] = useState<'pending' | 'approved' | 'rejected' | 'all'>('pending');
  const [selectedArticles, setSelectedArticles] = useState<string[]>([]);
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [showBulkActions, setShowBulkActions] = useState(false);

  // Mock data
  const mockArticles: Article[] = [
    {
      id: '1',
      title: 'Hướng dẫn sử dụng React Hooks trong dự án thực tế',
      author: 'Nguyễn Văn A',
      authorAvatar: undefined,
      category: 'Lập trình',
      status: 'pending',
      submittedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      currentLevel: 1,
      requiredLevel: 2,
      approvalHistory: [
        {
          id: 'a1',
          action: 'submit',
          userId: '1',
          userName: 'Nguyễn Văn A',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        }
      ],
      comments: 3,
      priority: 'high',
      tags: ['React', 'Tutorial', 'JavaScript'],
    },
    {
      id: '2',
      title: 'Top 10 công cụ AI cho Marketing 2024',
      author: 'Trần Thị B',
      category: 'Marketing',
      status: 'pending',
      submittedAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
      currentLevel: 0,
      requiredLevel: 1,
      approvalHistory: [
        {
          id: 'a2',
          action: 'submit',
          userId: '2',
          userName: 'Trần Thị B',
          timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
        }
      ],
      comments: 1,
      priority: 'urgent',
      tags: ['AI', 'Marketing'],
    },
    {
      id: '3',
      title: 'Phân tích xu hướng thiết kế UI/UX 2024',
      author: 'Lê Văn C',
      category: 'Design',
      status: 'pending',
      submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      currentLevel: 1,
      requiredLevel: 2,
      approvalHistory: [
        {
          id: 'a3',
          action: 'submit',
          userId: '3',
          userName: 'Lê Văn C',
          timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        },
        {
          id: 'a4',
          action: 'approve',
          userId: '4',
          userName: 'Reviewer Level 1',
          timestamp: new Date(Date.now() - 20 * 60 * 60 * 1000),
          comment: 'Nội dung tốt, cần review thêm ở level 2',
          level: 1,
        }
      ],
      comments: 5,
      priority: 'medium',
      tags: ['Design', 'UI/UX'],
    },
  ];

  const filteredArticles = mockArticles.filter(article => {
    if (selectedTab !== 'all' && article.status !== selectedTab) return false;
    if (filterPriority !== 'all' && article.priority !== filterPriority) return false;
    return true;
  });

  const stats = {
    pending: mockArticles.filter(a => a.status === 'pending').length,
    approved: mockArticles.filter(a => a.status === 'approved').length,
    rejected: mockArticles.filter(a => a.status === 'rejected').length,
    total: mockArticles.length,
  };

  const toggleArticleSelection = (id: string) => {
    setSelectedArticles(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    setSelectedArticles(filteredArticles.map(a => a.id));
  };

  const clearSelection = () => {
    setSelectedArticles([]);
  };

  const handleBulkApprove = () => {
    selectedArticles.forEach(id => onApprove?.(id));
    clearSelection();
    setShowBulkActions(false);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'red';
      case 'high': return 'orange';
      case 'medium': return 'yellow';
      case 'low': return 'blue';
      default: return 'gray';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'Khẩn cấp';
      case 'high': return 'Cao';
      case 'medium': return 'Trung bình';
      case 'low': return 'Thấp';
      default: return 'N/A';
    }
  };

  const getStatusIcon = (status: ApprovalStatus) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'approved': return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case 'rejected': return <XCircle className="w-4 h-4 text-red-600" />;
      case 'published': return <Sparkles className="w-4 h-4 text-blue-600" />;
      default: return <AlertCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (hours < 1) return 'Vừa xong';
    if (hours < 24) return `${hours} giờ trước`;
    if (days < 7) return `${days} ngày trước`;
    return date.toLocaleDateString('vi-VN');
  };

  return (
    <div className="space-y-6">
      {/* Header với Stats */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl blur-3xl" />
        <div className="relative glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl mb-2">Quản lý kiểm duyệt</h2>
              <p className="text-sm text-muted-foreground">
                Xem xét và phê duyệt nội dung chờ xuất bản
              </p>
            </div>
            
            {/* Quick Stats */}
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-2xl bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                  {stats.pending}
                </div>
                <div className="text-xs text-muted-foreground">Chờ duyệt</div>
              </div>
              <div className="w-px h-10 bg-border/40" />
              <div className="text-center">
                <div className="text-2xl bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  {stats.approved}
                </div>
                <div className="text-xs text-muted-foreground">Đã duyệt</div>
              </div>
              <div className="w-px h-10 bg-border/40" />
              <div className="text-center">
                <div className="text-2xl bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">
                  {stats.rejected}
                </div>
                <div className="text-xs text-muted-foreground">Từ chối</div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-2">
            {[
              { key: 'pending', label: 'Chờ duyệt', count: stats.pending, icon: Clock },
              { key: 'approved', label: 'Đã duyệt', count: stats.approved, icon: CheckCircle2 },
              { key: 'rejected', label: 'Từ chối', count: stats.rejected, icon: XCircle },
              { key: 'all', label: 'Tất cả', count: stats.total, icon: Filter },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setSelectedTab(tab.key as any)}
                  className={`
                    flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-200
                    ${selectedTab === tab.key
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                      : 'bg-muted/40 hover:bg-muted/60'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{tab.label}</span>
                  <span className={`
                    px-2 py-0.5 rounded-full text-xs font-medium
                    ${selectedTab === tab.key
                      ? 'bg-white/20'
                      : 'bg-background/60'
                    }
                  `}>
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Filters & Bulk Actions */}
      <div className="flex items-center justify-between gap-4">
        {/* Priority Filter */}
        <div className="flex items-center gap-3">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-4 py-2 rounded-lg bg-background/50 border border-border/40 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
          >
            <option value="all">Tất cả mức độ</option>
            <option value="urgent">Khẩn cấp</option>
            <option value="high">Cao</option>
            <option value="medium">Trung bình</option>
            <option value="low">Thấp</option>
          </select>
        </div>

        {/* Bulk Actions */}
        {selectedArticles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3"
          >
            <span className="text-sm text-muted-foreground">
              Đã chọn {selectedArticles.length} bài
            </span>
            <button
              onClick={handleBulkApprove}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg shadow-green-500/30"
            >
              <CheckSquare className="w-4 h-4" />
              Duyệt hàng loạt
            </button>
            <button
              onClick={clearSelection}
              className="px-4 py-2 rounded-xl bg-muted/60 hover:bg-muted transition-all"
            >
              Bỏ chọn
            </button>
          </motion.div>
        )}

        {filteredArticles.length > 0 && selectedArticles.length === 0 && (
          <button
            onClick={selectAll}
            className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
          >
            Chọn tất cả
          </button>
        )}
      </div>

      {/* Articles List */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {filteredArticles.map((article, index) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.05 }}
              className={`
                glass-card p-6 transition-all duration-200
                ${selectedArticles.includes(article.id) ? 'ring-2 ring-blue-500/50 bg-blue-500/5' : 'hover:shadow-lg'}
              `}
            >
              <div className="flex items-start gap-4">
                {/* Checkbox */}
                <input
                  type="checkbox"
                  checked={selectedArticles.includes(article.id)}
                  onChange={() => toggleArticleSelection(article.id)}
                  className="mt-1 w-4 h-4 rounded border-border/40 text-blue-600 focus:ring-2 focus:ring-blue-500/20"
                />

                {/* Content */}
                <div className="flex-1 min-w-0">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg mb-2 line-clamp-2">{article.title}</h3>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          <span>{article.author}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Tag className="w-4 h-4" />
                          <span>{article.category}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>{formatTimeAgo(article.submittedAt!)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MessageSquare className="w-4 h-4" />
                          <span>{article.comments} bình luận</span>
                        </div>
                      </div>
                    </div>

                    {/* Priority Badge */}
                    <div className={`
                      px-3 py-1 rounded-lg text-xs font-medium
                      ${getPriorityColor(article.priority) === 'red' ? 'bg-red-500/10 text-red-600 border border-red-500/20' : ''}
                      ${getPriorityColor(article.priority) === 'orange' ? 'bg-orange-500/10 text-orange-600 border border-orange-500/20' : ''}
                      ${getPriorityColor(article.priority) === 'yellow' ? 'bg-yellow-500/10 text-yellow-600 border border-yellow-500/20' : ''}
                      ${getPriorityColor(article.priority) === 'blue' ? 'bg-blue-500/10 text-blue-600 border border-blue-500/20' : ''}
                    `}>
                      {getPriorityLabel(article.priority)}
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex items-center gap-2 mb-4">
                    {article.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 rounded-lg bg-muted/40 text-xs text-muted-foreground"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Approval Progress */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-muted-foreground">
                        Tiến độ duyệt: Level {article.currentLevel}/{article.requiredLevel}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {Math.round((article.currentLevel / article.requiredLevel) * 100)}%
                      </span>
                    </div>
                    <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-500"
                        style={{ width: `${(article.currentLevel / article.requiredLevel) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted/40 hover:bg-muted transition-all">
                      <Eye className="w-4 h-4" />
                      <span className="text-sm">Xem trước</span>
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted/40 hover:bg-muted transition-all">
                      <MessageSquare className="w-4 h-4" />
                      <span className="text-sm">Bình luận</span>
                    </button>
                    <button 
                      onClick={() => onApprove?.(article.id)}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg shadow-green-500/30"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span className="text-sm">Phê duyệt</span>
                    </button>
                    <button 
                      onClick={() => onReject?.(article.id, '')}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 text-red-600 hover:bg-red-500/20 transition-all border border-red-500/20"
                    >
                      <XCircle className="w-4 h-4" />
                      <span className="text-sm">Từ chối</span>
                    </button>
                    <button 
                      onClick={() => onRequestChanges?.(article.id, '')}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-500/10 text-orange-600 hover:bg-orange-500/20 transition-all border border-orange-500/20"
                    >
                      <Edit3 className="w-4 h-4" />
                      <span className="text-sm">Yêu cầu chỉnh sửa</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredArticles.length === 0 && (
          <div className="glass-card p-12 text-center">
            <AlertCircle className="w-12 h-12 mx-auto mb-3 text-muted-foreground/50" />
            <p className="text-muted-foreground">Không có bài viết nào</p>
          </div>
        )}
      </div>
    </div>
  );
}