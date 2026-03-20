import { useState, useRef, useEffect } from 'react';
import {
  MessageCircle, Send, X, User, Clock, Edit3, Trash2, Check,
  MoreVertical, Pin, Flag, Smile, AtSign, Hash, Reply,
  CheckCircle, Circle, AlertCircle, Info, Star, Heart,
  ThumbsUp, Eye, EyeOff, Filter, Search, ChevronDown,
  Download, Share2, Plus, Minus, Paperclip, Image as ImageIcon
} from 'lucide-react';

// Types
interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  timestamp: Date;
  status: 'open' | 'resolved' | 'archived';
  priority: 'low' | 'medium' | 'high' | 'critical';
  position?: { x: number; y: number };
  elementId?: string;
  mentions?: string[];
  attachments?: CommentAttachment[];
  reactions?: CommentReaction[];
  replies?: Comment[];
  isEdited?: boolean;
  isPinned?: boolean;
}

interface CommentAttachment {
  id: string;
  type: 'image' | 'file' | 'link';
  url: string;
  name: string;
  size?: number;
}

interface CommentReaction {
  type: 'like' | 'love' | 'star' | 'check';
  userId: string;
  userName: string;
}

interface CommentsPanelProps {
  comments: Comment[];
  currentUserId: string;
  currentUserName: string;
  onAddComment: (comment: Omit<Comment, 'id' | 'timestamp'>) => void;
  onEditComment: (commentId: string, content: string) => void;
  onDeleteComment: (commentId: string) => void;
  onResolveComment: (commentId: string) => void;
  onReplyComment: (commentId: string, reply: Omit<Comment, 'id' | 'timestamp'>) => void;
  onReactComment: (commentId: string, reaction: CommentReaction) => void;
  onPinComment: (commentId: string) => void;
  onClose: () => void;
}

export function CommentsPanel({
  comments,
  currentUserId,
  currentUserName,
  onAddComment,
  onEditComment,
  onDeleteComment,
  onResolveComment,
  onReplyComment,
  onReactComment,
  onPinComment,
  onClose,
}: CommentsPanelProps) {
  const [newComment, setNewComment] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [filter, setFilter] = useState<'all' | 'open' | 'resolved'>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAttachments, setShowAttachments] = useState(false);
  const [selectedComment, setSelectedComment] = useState<string | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const replyRef = useRef<HTMLTextAreaElement>(null);

  // Filter comments
  const filteredComments = comments.filter(comment => {
    if (filter !== 'all' && comment.status !== filter) return false;
    if (priorityFilter !== 'all' && comment.priority !== priorityFilter) return false;
    if (searchQuery && !comment.content.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  }).sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return b.timestamp.getTime() - a.timestamp.getTime();
  });

  // Stats
  const stats = {
    total: comments.length,
    open: comments.filter(c => c.status === 'open').length,
    resolved: comments.filter(c => c.status === 'resolved').length,
    critical: comments.filter(c => c.priority === 'critical').length,
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    
    // Extract mentions
    const mentions = newComment.match(/@(\w+)/g)?.map(m => m.slice(1)) || [];
    
    onAddComment({
      userId: currentUserId,
      userName: currentUserName,
      content: newComment,
      status: 'open',
      priority: 'medium',
      mentions,
      reactions: [],
      replies: [],
    });
    
    setNewComment('');
    inputRef.current?.focus();
  };

  const handleEditComment = (commentId: string) => {
    if (!editContent.trim()) return;
    onEditComment(commentId, editContent);
    setEditingId(null);
    setEditContent('');
  };

  const handleReply = (commentId: string) => {
    if (!replyContent.trim()) return;
    
    const mentions = replyContent.match(/@(\w+)/g)?.map(m => m.slice(1)) || [];
    
    onReplyComment(commentId, {
      userId: currentUserId,
      userName: currentUserName,
      content: replyContent,
      status: 'open',
      priority: 'medium',
      mentions,
      reactions: [],
      replies: [],
    });
    
    setReplyingTo(null);
    setReplyContent('');
  };

  const startEditing = (comment: Comment) => {
    setEditingId(comment.id);
    setEditContent(comment.content);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-500';
      case 'high': return 'text-orange-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-blue-500';
      default: return 'text-gray-500';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'critical': return AlertCircle;
      case 'high': return Flag;
      case 'medium': return Info;
      case 'low': return Circle;
      default: return Info;
    }
  };

  const getReactionIcon = (type: string) => {
    switch (type) {
      case 'like': return ThumbsUp;
      case 'love': return Heart;
      case 'star': return Star;
      case 'check': return CheckCircle;
      default: return ThumbsUp;
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'Vừa xong';
    if (minutes < 60) return `${minutes} phút trước`;
    if (hours < 24) return `${hours} giờ trước`;
    if (days < 7) return `${days} ngày trước`;
    return date.toLocaleDateString();
  };

  const renderComment = (comment: Comment, isReply = false) => {
    const isEditing = editingId === comment.id;
    const isReplying = replyingTo === comment.id;
    const isSelected = selectedComment === comment.id;
    const isOwner = comment.userId === currentUserId;
    const PriorityIcon = getPriorityIcon(comment.priority);

    return (
      <div
        key={comment.id}
        className={`group relative ${isReply ? 'ml-10' : ''}`}
      >
        {/* Comment Card */}
        <div
          className={`relative bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border-2 transition-all ${
            isSelected
              ? 'border-blue-400 shadow-lg'
              : 'border-gray-100 dark:border-gray-700 hover:border-gray-200'
          } ${comment.isPinned ? 'ring-2 ring-blue-200' : ''}`}
          onClick={() => setSelectedComment(isSelected ? null : comment.id)}
        >
          {/* Pinned Badge */}
          {comment.isPinned && (
            <div className="absolute -top-2 -right-2 bg-blue-500 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
              <Pin className="w-3 h-3" />
              Đã ghim
            </div>
          )}

          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              {/* Avatar */}
              <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                {comment.userAvatar ? (
                  <img src={comment.userAvatar} alt={comment.userName} className="w-full h-full rounded-full object-cover" />
                ) : (
                  comment.userName.charAt(0).toUpperCase()
                )}
              </div>
              
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm">{comment.userName}</span>
                  {comment.isEdited && (
                    <span className="text-xs text-gray-400">(đã sửa)</span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Clock className="w-3 h-3" />
                  {formatTime(comment.timestamp)}
                </div>
              </div>
            </div>

            {/* Actions Menu */}
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              {/* Priority Badge */}
              <div className={`flex items-center gap-1 ${getPriorityColor(comment.priority)}`}>
                <PriorityIcon className="w-4 h-4" />
              </div>

              {/* More Menu */}
              {isOwner && (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onPinComment(comment.id)}
                    className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    title={comment.isPinned ? "Bỏ ghim" : "Ghim"}
                  >
                    <Pin className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => startEditing(comment)}
                    className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDeleteComment(comment.id)}
                    className="p-1.5 hover:bg-red-50 text-red-500 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          {isEditing ? (
            <div className="space-y-2">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows={3}
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  onClick={() => handleEditComment(comment.id)}
                  className="px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                >
                  Lưu
                </button>
                <button
                  onClick={() => {
                    setEditingId(null);
                    setEditContent('');
                  }}
                  className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                >
                  Hủy
                </button>
              </div>
            </div>
          ) : (
            <div className="text-sm text-gray-700 dark:text-gray-300 mb-3 whitespace-pre-wrap">
              {comment.content}
            </div>
          )}

          {/* Attachments */}
          {comment.attachments && comment.attachments.length > 0 && (
            <div className="mb-3 space-y-2">
              {comment.attachments.map(attachment => (
                <div
                  key={attachment.id}
                  className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <Paperclip className="w-4 h-4 text-gray-400" />
                  <span className="text-sm flex-1">{attachment.name}</span>
                  <Download className="w-4 h-4 text-gray-400 cursor-pointer hover:text-blue-500" />
                </div>
              ))}
            </div>
          )}

          {/* Actions Bar */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
            {/* Reactions */}
            <div className="flex items-center gap-2">
              {['like', 'love', 'star', 'check'].map((type) => {
                const Icon = getReactionIcon(type);
                const count = comment.reactions?.filter(r => r.type === type).length || 0;
                const hasReacted = comment.reactions?.some(r => r.type === type && r.userId === currentUserId);
                
                return (
                  <button
                    key={type}
                    onClick={() => onReactComment(comment.id, { type: type as any, userId: currentUserId, userName: currentUserName })}
                    className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs transition-colors ${
                      hasReacted
                        ? 'bg-blue-100 text-blue-600'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {count > 0 && <span>{count}</span>}
                  </button>
                );
              })}
            </div>

            {/* Reply Button */}
            <button
              onClick={() => setReplyingTo(comment.id)}
              className="flex items-center gap-1 px-3 py-1 text-xs text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <Reply className="w-3.5 h-3.5" />
              Trả lời
              {comment.replies && comment.replies.length > 0 && (
                <span className="ml-1 text-blue-500">({comment.replies.length})</span>
              )}
            </button>
          </div>

          {/* Reply Input */}
          {isReplying && (
            <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
              <div className="flex gap-2">
                <textarea
                  ref={replyRef}
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Viết phản hồi..."
                  className="flex-1 px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-sm"
                  rows={2}
                  autoFocus
                />
                <button
                  onClick={() => handleReply(comment.id)}
                  className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Status Badge */}
          <div className="absolute -bottom-2 left-4">
            <button
              onClick={() => onResolveComment(comment.id)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                comment.status === 'resolved'
                  ? 'bg-green-100 text-green-700 hover:bg-green-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-blue-100 hover:text-blue-600'
              }`}
            >
              {comment.status === 'resolved' ? (
                <span className="flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  Đã xử lý
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <Circle className="w-3 h-3" />
                  Đang mở
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Replies */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-6 space-y-4">
            {comment.replies.map(reply => renderComment(reply, true))}
          </div>
        )}

        {!isReply && <div className="h-4" />}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <MessageCircle className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Bình luận & Phản hồi</h2>
                <p className="text-sm text-white/80">Cộng tác với nhóm của bạn</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center transition-colors backdrop-blur-sm"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
              <div className="text-2xl font-bold">{stats.total}</div>
              <div className="text-xs text-white/70">Tổng</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
              <div className="text-2xl font-bold">{stats.open}</div>
              <div className="text-xs text-white/70">Mở</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
              <div className="text-2xl font-bold">{stats.resolved}</div>
              <div className="text-xs text-white/70">Đã xử lý</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
              <div className="text-2xl font-bold">{stats.critical}</div>
              <div className="text-xs text-white/70">Nghiêm trọng</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-wrap gap-3">
            {/* Search */}
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm kiếm bình luận..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
            </div>

            {/* Status Filter */}
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="all">-- Trạng thái --</option>
              <option value="open">Đang mở</option>
              <option value="resolved">Đã giải quyết</option>
            </select>

            {/* Priority Filter */}
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="all">-- Mức độ ưu tiên --</option>
              <option value="critical">Nghiêm trọng</option>
              <option value="high">Cao</option>
              <option value="medium">Trung bình</option>
              <option value="low">Thấp</option>
            </select>
          </div>
        </div>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {filteredComments.length === 0 ? (
            <div className="text-center py-12">
              <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">
                {searchQuery || filter !== 'all' || priorityFilter !== 'all'
                  ? 'Không có bình luận phù hợp'
                  : 'Chưa có bình luận nào. Hãy là người đầu tiên!'}
              </p>
            </div>
          ) : (
            filteredComments.map(comment => renderComment(comment))
          )}
        </div>

        {/* New Comment Input */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <div className="flex gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-medium flex-shrink-0">
              {currentUserName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <textarea
                ref={inputRef}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Thêm bình luận... Dùng @tên để nhắc đến ai đó"
                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-sm"
                rows={3}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                    handleAddComment();
                  }
                }}
              />
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors">
                    <Smile className="w-4 h-4 text-gray-500" />
                  </button>
                  <button className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors">
                    <Paperclip className="w-4 h-4 text-gray-500" />
                  </button>
                  <button className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors">
                    <ImageIcon className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
                <button
                  onClick={handleAddComment}
                  disabled={!newComment.trim()}
                  className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium text-sm flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Bình luận
                  <span className="text-xs text-white/70">(⌘↵)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}