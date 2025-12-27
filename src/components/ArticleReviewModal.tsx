import { useState } from 'react';
import { 
  X, Eye, MessageSquare, CheckCircle2, XCircle, Edit3, 
  Send, Clock, User, Calendar, Tag, FileText, Image,
  Link as LinkIcon, Hash, ThumbsUp, ThumbsDown, AlertTriangle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useFocusTrap } from '../hooks/useFocusTrap';

interface ArticleReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  article: {
    id: string;
    title: string;
    content: string;
    excerpt: string;
    author: string;
    authorAvatar?: string;
    category: string;
    tags: string[];
    featuredImage?: string;
    status: string;
    submittedAt: Date;
    wordCount: number;
    readingTime: number;
  };
  onApprove: (comment?: string) => void;
  onReject: (comment: string) => void;
  onRequestChanges: (comment: string) => void;
}

export function ArticleReviewModal({
  isOpen,
  onClose,
  article,
  onApprove,
  onReject,
  onRequestChanges,
}: ArticleReviewModalProps) {
  const modalRef = useFocusTrap(isOpen);
  const [activeTab, setActiveTab] = useState<'preview' | 'metadata' | 'history'>('preview');
  const [comment, setComment] = useState('');
  const [showApprovalForm, setShowApprovalForm] = useState(false);
  const [action, setAction] = useState<'approve' | 'reject' | 'changes'>('approve');
  const [checklist, setChecklist] = useState({
    grammar: false,
    factCheck: false,
    formatting: false,
    images: false,
    seo: false,
    legal: false,
  });

  if (!isOpen) return null;

  const handleSubmitReview = () => {
    if (action === 'approve') {
      onApprove(comment || undefined);
    } else if (action === 'reject') {
      if (!comment.trim()) {
        alert('Vui lòng nhập lý do từ chối');
        return;
      }
      onReject(comment);
    } else if (action === 'changes') {
      if (!comment.trim()) {
        alert('Vui lòng nhập yêu cầu chỉnh sửa');
        return;
      }
      onRequestChanges(comment);
    }
    setComment('');
    setShowApprovalForm(false);
    onClose();
  };

  const checklistItems = [
    { key: 'grammar', label: 'Chính tả & Ngữ pháp', icon: FileText },
    { key: 'factCheck', label: 'Kiểm tra thông tin', icon: CheckCircle2 },
    { key: 'formatting', label: 'Định dạng & Trình bày', icon: Edit3 },
    { key: 'images', label: 'Hình ảnh & Media', icon: Image },
    { key: 'seo', label: 'SEO & Metadata', icon: Tag },
    { key: 'legal', label: 'Pháp lý & Bản quyền', icon: AlertTriangle },
  ];

  const allChecked = Object.values(checklist).every(v => v);
  const checkedCount = Object.values(checklist).filter(v => v).length;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          ref={modalRef}
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-6xl max-h-[90vh] glass-strong rounded-2xl border border-border/40 shadow-2xl overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="relative p-6 border-b border-border/40 bg-gradient-to-br from-blue-500/5 to-purple-500/5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h2 className="text-2xl mb-2 line-clamp-2">{article.title}</h2>
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
                    <span>{article.submittedAt.toLocaleDateString('vi-VN')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    <span>{article.wordCount} từ</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{article.readingTime} phút đọc</span>
                  </div>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-muted/60 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-2 mt-4">
              {[
                { key: 'preview', label: 'Xem trước', icon: Eye },
                { key: 'metadata', label: 'Thông tin', icon: Tag },
                { key: 'history', label: 'Lịch sử', icon: Clock },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key as any)}
                    className={`
                      flex items-center gap-2 px-4 py-2 rounded-xl transition-all
                      ${activeTab === tab.key
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                        : 'bg-muted/40 hover:bg-muted/60'
                      }
                    `}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Preview Tab */}
            {activeTab === 'preview' && (
              <div className="space-y-6">
                {/* Featured Image */}
                {article.featuredImage && (
                  <div className="rounded-xl overflow-hidden border border-border/40">
                    <img
                      src={article.featuredImage}
                      alt={article.title}
                      className="w-full h-80 object-cover"
                    />
                  </div>
                )}

                {/* Excerpt */}
                <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/20">
                  <h3 className="text-sm font-medium text-blue-600 mb-2">Mô tả ngắn</h3>
                  <p className="text-muted-foreground">{article.excerpt}</p>
                </div>

                {/* Content */}
                <div className="prose prose-slate max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: article.content }} />
                </div>

                {/* Tags */}
                <div>
                  <h3 className="text-sm font-medium mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {article.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1.5 rounded-lg bg-muted/40 text-sm"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Metadata Tab */}
            {activeTab === 'metadata' && (
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg mb-4">Thông tin cơ bản</h3>
                  
                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block">Tác giả</label>
                    <div className="p-3 rounded-lg bg-muted/30 border border-border/40">
                      {article.author}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block">Danh mục</label>
                    <div className="p-3 rounded-lg bg-muted/30 border border-border/40">
                      {article.category}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block">Trạng thái</label>
                    <div className="p-3 rounded-lg bg-muted/30 border border-border/40">
                      {article.status}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block">Ngày nộp</label>
                    <div className="p-3 rounded-lg bg-muted/30 border border-border/40">
                      {article.submittedAt.toLocaleString('vi-VN')}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg mb-4">Checklist kiểm duyệt</h3>
                  
                  <div className="space-y-3">
                    {checklistItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <label
                          key={item.key}
                          className={`
                            flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all
                            ${checklist[item.key as keyof typeof checklist]
                              ? 'bg-green-500/10 border-green-500/30'
                              : 'bg-muted/30 border-border/40 hover:bg-muted/50'
                            }
                          `}
                        >
                          <input
                            type="checkbox"
                            checked={checklist[item.key as keyof typeof checklist]}
                            onChange={(e) => setChecklist({
                              ...checklist,
                              [item.key]: e.target.checked,
                            })}
                            className="w-5 h-5 rounded border-border/40 text-green-600 focus:ring-2 focus:ring-green-500/20"
                          />
                          <Icon className="w-4 h-4 text-muted-foreground" />
                          <span className="flex-1 text-sm">{item.label}</span>
                          {checklist[item.key as keyof typeof checklist] && (
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                          )}
                        </label>
                      );
                    })}
                  </div>

                  {/* Progress */}
                  <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Tiến độ kiểm tra</span>
                      <span className="text-sm font-medium">{checkedCount}/{checklistItems.length}</span>
                    </div>
                    <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-500"
                        style={{ width: `${(checkedCount / checklistItems.length) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* History Tab */}
            {activeTab === 'history' && (
              <div className="space-y-4">
                <h3 className="text-lg mb-4">Lịch sử hoạt động</h3>
                
                <div className="space-y-3">
                  {[
                    { action: 'Nộp bài', user: article.author, time: article.submittedAt, type: 'submit' },
                    { action: 'Bình luận', user: 'Editor A', time: new Date(Date.now() - 2 * 60 * 60 * 1000), type: 'comment', comment: 'Cần chỉnh sửa phần giới thiệu' },
                    { action: 'Chỉnh sửa', user: article.author, time: new Date(Date.now() - 1 * 60 * 60 * 1000), type: 'edit' },
                  ].map((event, idx) => (
                    <div
                      key={idx}
                      className="flex gap-4 p-4 rounded-xl bg-muted/30 border border-border/40"
                    >
                      <div className={`
                        w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0
                        ${event.type === 'submit' ? 'bg-blue-500/10 text-blue-600' : ''}
                        ${event.type === 'comment' ? 'bg-purple-500/10 text-purple-600' : ''}
                        ${event.type === 'edit' ? 'bg-orange-500/10 text-orange-600' : ''}
                      `}>
                        {event.type === 'submit' && <Send className="w-5 h-5" />}
                        {event.type === 'comment' && <MessageSquare className="w-5 h-5" />}
                        {event.type === 'edit' && <Edit3 className="w-5 h-5" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium">{event.action}</h4>
                          <span className="text-xs text-muted-foreground">
                            {event.time.toLocaleString('vi-VN')}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{event.user}</p>
                        {event.comment && (
                          <p className="text-sm mt-2 p-2 rounded bg-background/50">
                            {event.comment}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="p-6 border-t border-border/40 bg-muted/20">
            {!showApprovalForm ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Checklist: {checkedCount}/{checklistItems.length}</span>
                  {allChecked && (
                    <span className="ml-2 px-2 py-1 rounded bg-green-500/10 text-green-600 text-xs">
                      Sẵn sàng phê duyệt
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 rounded-xl bg-muted/60 hover:bg-muted transition-all"
                  >
                    Đóng
                  </button>
                  <button
                    onClick={() => {
                      setAction('changes');
                      setShowApprovalForm(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-500/10 text-orange-600 hover:bg-orange-500/20 transition-all border border-orange-500/20"
                  >
                    <Edit3 className="w-4 h-4" />
                    Yêu cầu chỉnh sửa
                  </button>
                  <button
                    onClick={() => {
                      setAction('reject');
                      setShowApprovalForm(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 text-red-600 hover:bg-red-500/20 transition-all border border-red-500/20"
                  >
                    <XCircle className="w-4 h-4" />
                    Từ chối
                  </button>
                  <button
                    onClick={() => {
                      setAction('approve');
                      setShowApprovalForm(true);
                    }}
                    disabled={!allChecked}
                    className="flex items-center gap-2 px-6 py-2 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg shadow-green-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Phê duyệt
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    {action === 'approve' && 'Ghi chú phê duyệt (tùy chọn)'}
                    {action === 'reject' && 'Lý do từ chối *'}
                    {action === 'changes' && 'Yêu cầu chỉnh sửa *'}
                  </label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder={
                      action === 'approve' ? 'Nhập ghi chú nếu cần...' :
                      action === 'reject' ? 'Vui lòng cho biết lý do từ chối...' :
                      'Vui lòng mô tả chi tiết các điểm cần chỉnh sửa...'
                    }
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl bg-background/50 border border-border/40 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none resize-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-3">
                  <button
                    onClick={() => {
                      setShowApprovalForm(false);
                      setComment('');
                    }}
                    className="px-4 py-2 rounded-xl bg-muted/60 hover:bg-muted transition-all"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handleSubmitReview}
                    className={`
                      flex items-center gap-2 px-6 py-2 rounded-xl text-white transition-all shadow-lg
                      ${action === 'approve' ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-green-500/30' : ''}
                      ${action === 'reject' ? 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 shadow-red-500/30' : ''}
                      ${action === 'changes' ? 'bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 shadow-orange-500/30' : ''}
                    `}
                  >
                    <Send className="w-4 h-4" />
                    Gửi đánh giá
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
