import { useState } from 'react';
import { Send, MessageSquare, ThumbsUp, Reply, MoreVertical, Edit3, Trash2, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  userRole: string;
  content: string;
  timestamp: Date;
  isResolved: boolean;
  likes: number;
  replies: Comment[];
  isEdited?: boolean;
}

interface ReviewCommentsProps {
  articleId: string;
  comments?: Comment[];
  onAddComment: (content: string, replyTo?: string) => void;
  onResolveComment: (commentId: string) => void;
  onDeleteComment: (commentId: string) => void;
  onEditComment: (commentId: string, content: string) => void;
  onLikeComment: (commentId: string) => void;
}

export function ReviewComments({
  articleId,
  comments = [],
  onAddComment,
  onResolveComment,
  onDeleteComment,
  onEditComment,
  onLikeComment,
}: ReviewCommentsProps) {
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  // Mock comments if none provided
  const mockComments: Comment[] = comments.length > 0 ? comments : [
    {
      id: '1',
      userId: 'u1',
      userName: 'Editor Level 1',
      userRole: 'Senior Editor',
      content: 'Phần giới thiệu cần mở rộng thêm, hiện tại hơi ngắn. Nên thêm 1-2 đoạn về bối cảnh và tầm quan trọng của chủ đề.',
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
      isResolved: false,
      likes: 3,
      replies: [
        {
          id: '1-1',
          userId: 'u2',
          userName: 'Tác giả',
          userRole: 'Author',
          content: 'Cảm ơn góp ý! Tôi sẽ bổ sung thêm về lịch sử phát triển và tác động của công nghệ này.',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          isResolved: false,
          likes: 1,
          replies: [],
        },
      ],
    },
    {
      id: '2',
      userId: 'u3',
      userName: 'SEO Specialist',
      userRole: 'SEO Team',
      content: 'Tiêu đề nên ngắn gọn hơn để tối ưu SEO. Recommend: "Hướng dẫn React Hooks 2024" thay vì tiêu đề hiện tại.',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      isResolved: true,
      likes: 2,
      replies: [],
    },
    {
      id: '3',
      userId: 'u4',
      userName: 'Content Quality',
      userRole: 'QA Team',
      content: 'Code examples rất hay! Một số chỗ nên thêm comments để giải thích rõ hơn cho người mới.',
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
      isResolved: false,
      likes: 5,
      replies: [],
    },
  ];

  const handleSubmitComment = () => {
    if (!newComment.trim()) return;
    onAddComment(newComment);
    setNewComment('');
  };

  const handleSubmitReply = (commentId: string) => {
    if (!replyContent.trim()) return;
    onAddComment(replyContent, commentId);
    setReplyContent('');
    setReplyingTo(null);
  };

  const handleEdit = (commentId: string, content: string) => {
    setEditingId(commentId);
    setEditContent(content);
  };

  const handleSaveEdit = (commentId: string) => {
    if (!editContent.trim()) return;
    onEditComment(commentId, editContent);
    setEditingId(null);
    setEditContent('');
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

  const renderComment = (comment: Comment, isReply: boolean = false) => {
    const isEditing = editingId === comment.id;

    return (
      <motion.div
        key={comment.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className={`
          ${isReply ? 'ml-12 mt-3' : ''}
          ${comment.isResolved ? 'opacity-60' : ''}
        `}
      >
        <div className={`
          p-4 rounded-xl border transition-all
          ${comment.isResolved 
            ? 'bg-green-500/5 border-green-500/20' 
            : 'bg-muted/30 border-border/40 hover:bg-muted/50'
          }
        `}>
          {/* Header */}
          <div className="flex items-start gap-3 mb-3">
            {/* Avatar */}
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-medium flex-shrink-0">
              {comment.userName.charAt(0)}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{comment.userName}</span>
                    <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 text-xs">
                      {comment.userRole}
                    </span>
                    {comment.isResolved && (
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-green-500/10 text-green-600 text-xs">
                        <CheckCircle2 className="w-3 h-3" />
                        Resolved
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {formatTimeAgo(comment.timestamp)}
                    {comment.isEdited && <span className="ml-2">(đã chỉnh sửa)</span>}
                  </div>
                </div>

                {/* Actions Menu */}
                <div className="relative group">
                  <button className="p-1 rounded hover:bg-background/50 transition-colors opacity-0 group-hover:opacity-100">
                    <MoreVertical className="w-4 h-4 text-muted-foreground" />
                  </button>
                  
                  {/* Dropdown menu would go here */}
                </div>
              </div>

              {/* Content */}
              <div className="mt-3">
                {isEditing ? (
                  <div className="space-y-2">
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-background/50 border border-border/40 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none resize-none"
                      rows={3}
                    />
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleSaveEdit(comment.id)}
                        className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700 transition-all"
                      >
                        Lưu
                      </button>
                      <button
                        onClick={() => {
                          setEditingId(null);
                          setEditContent('');
                        }}
                        className="px-3 py-1.5 rounded-lg bg-muted text-sm hover:bg-muted/80 transition-all"
                      >
                        Hủy
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-foreground leading-relaxed">{comment.content}</p>
                )}
              </div>

              {/* Actions */}
              {!isEditing && (
                <div className="flex items-center gap-4 mt-3">
                  <button
                    onClick={() => onLikeComment(comment.id)}
                    className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-blue-600 transition-colors"
                  >
                    <ThumbsUp className="w-4 h-4" />
                    <span>{comment.likes > 0 ? comment.likes : 'Like'}</span>
                  </button>

                  {!isReply && (
                    <button
                      onClick={() => setReplyingTo(comment.id)}
                      className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-blue-600 transition-colors"
                    >
                      <Reply className="w-4 h-4" />
                      <span>Reply</span>
                    </button>
                  )}

                  <button
                    onClick={() => handleEdit(comment.id, comment.content)}
                    className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-orange-600 transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>Edit</span>
                  </button>

                  {!comment.isResolved && (
                    <button
                      onClick={() => onResolveComment(comment.id)}
                      className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-green-600 transition-colors"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Resolve</span>
                    </button>
                  )}

                  <button
                    onClick={() => onDeleteComment(comment.id)}
                    className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-red-600 transition-colors ml-auto"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Reply Input */}
          {replyingTo === comment.id && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="ml-12 mt-3"
            >
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
                  Y
                </div>
                <div className="flex-1 space-y-2">
                  <textarea
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder="Viết phản hồi..."
                    className="w-full px-3 py-2 rounded-lg bg-background/50 border border-border/40 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none resize-none"
                    rows={2}
                    autoFocus
                  />
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleSubmitReply(comment.id)}
                      disabled={!replyContent.trim()}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send className="w-3 h-3" />
                      Gửi
                    </button>
                    <button
                      onClick={() => {
                        setReplyingTo(null);
                        setReplyContent('');
                      }}
                      className="px-3 py-1.5 rounded-lg bg-muted text-sm hover:bg-muted/80 transition-all"
                    >
                      Hủy
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Replies */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="space-y-3 mt-3">
              {comment.replies.map((reply) => renderComment(reply, true))}
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg">Bình luận & Đánh giá</h3>
          <span className="px-2 py-1 rounded-full bg-blue-500/10 text-blue-600 text-xs font-medium">
            {mockComments.length}
          </span>
        </div>

        <div className="text-sm text-muted-foreground">
          {mockComments.filter(c => c.isResolved).length} / {mockComments.length} đã giải quyết
        </div>
      </div>

      {/* New Comment Input */}
      <div className="glass-card p-4">
        <div className="flex gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-white font-medium flex-shrink-0">
            Y
          </div>
          <div className="flex-1 space-y-3">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Thêm bình luận hoặc góp ý..."
              className="w-full px-4 py-3 rounded-xl bg-background/50 border border-border/40 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none resize-none"
              rows={3}
            />
            <div className="flex items-center justify-between">
              <div className="text-xs text-muted-foreground">
                Hỗ trợ Markdown formatting
              </div>
              <button
                onClick={handleSubmitComment}
                disabled={!newComment.trim()}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
                Gửi bình luận
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        <AnimatePresence>
          {mockComments.map((comment) => renderComment(comment))}
        </AnimatePresence>
      </div>

      {mockComments.length === 0 && (
        <div className="glass-card p-12 text-center">
          <MessageSquare className="w-12 h-12 mx-auto mb-3 text-muted-foreground/50" />
          <p className="text-muted-foreground">Chưa có bình luận nào</p>
          <p className="text-sm text-muted-foreground mt-1">
            Hãy là người đầu tiên góp ý cho bài viết này
          </p>
        </div>
      )}
    </div>
  );
}
