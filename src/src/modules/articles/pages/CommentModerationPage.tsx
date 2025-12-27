import React, { useState } from 'react';
import { useFetch, useMutate } from '@longvhv/query';
import { useNotifications } from '@longvhv/notifications';
import { useTranslation } from '@longvhv/i18n';
import { 
  MessageSquare, 
  Check, 
  X, 
  Flag, 
  Trash2, 
  User,
  Calendar,
  Search,
  Filter,
  MoreVertical,
  Mail,
  Ban,
  Reply,
  Eye
} from 'lucide-react';

interface Comment {
  id: string;
  content: string;
  author: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  article: {
    id: string;
    title: string;
  };
  status: 'pending' | 'approved' | 'spam' | 'rejected';
  createdAt: string;
  ip?: string;
  userAgent?: string;
  replies?: number;
}

const CommentModerationPage: React.FC = () => {
  const { t } = useTranslation();
  const notifications = useNotifications();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedComments, setSelectedComments] = useState<Set<string>>(new Set());
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [replyingTo, setReplyingTo] = useState<Comment | null>(null);
  const [replyText, setReplyText] = useState('');

  // Fetch comments
  const { data: comments, isLoading, refetch } = useFetch<Comment[]>('comments', async () => {
    // Mock data
    return [
      {
        id: '1',
        content: 'Great article! Very informative and well-written. Looking forward to more content like this.',
        author: {
          id: '1',
          name: 'John Doe',
          email: 'john@example.com',
        },
        article: {
          id: '1',
          title: 'Introduction to React Hooks',
        },
        status: 'pending',
        createdAt: '2024-01-20T10:30:00Z',
        ip: '192.168.1.1',
        replies: 0,
      },
      {
        id: '2',
        content: 'Thanks for sharing! This helped me solve my issue.',
        author: {
          id: '2',
          name: 'Jane Smith',
          email: 'jane@example.com',
        },
        article: {
          id: '1',
          title: 'Introduction to React Hooks',
        },
        status: 'approved',
        createdAt: '2024-01-19T14:20:00Z',
        replies: 2,
      },
      {
        id: '3',
        content: 'Buy cheap products at example.com!!! Click here now!!!',
        author: {
          id: '3',
          name: 'Spammer',
          email: 'spam@spam.com',
        },
        article: {
          id: '2',
          title: 'Building Scalable APIs',
        },
        status: 'spam',
        createdAt: '2024-01-18T09:15:00Z',
        ip: '123.456.789.0',
        replies: 0,
      },
      {
        id: '4',
        content: 'I disagree with this approach. There are better alternatives.',
        author: {
          id: '4',
          name: 'Mike Johnson',
          email: 'mike@example.com',
        },
        article: {
          id: '2',
          title: 'Building Scalable APIs',
        },
        status: 'approved',
        createdAt: '2024-01-17T16:45:00Z',
        replies: 1,
      },
    ];
  });

  // Filter comments
  const filteredComments = comments?.filter((comment) => {
    const matchesSearch = 
      comment.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comment.author.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comment.article.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || comment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Approve mutation
  const { mutate: approveComment } = useMutate(
    async (id: string) => {
      await new Promise(resolve => setTimeout(resolve, 500));
      return { success: true };
    },
    {
      onSuccess: () => {
        notifications.success('Comment approved');
        refetch();
      },
    }
  );

  // Reject mutation
  const { mutate: rejectComment } = useMutate(
    async (id: string) => {
      await new Promise(resolve => setTimeout(resolve, 500));
      return { success: true };
    },
    {
      onSuccess: () => {
        notifications.success('Comment rejected');
        refetch();
      },
    }
  );

  // Mark as spam
  const { mutate: markAsSpam } = useMutate(
    async (id: string) => {
      await new Promise(resolve => setTimeout(resolve, 500));
      return { success: true };
    },
    {
      onSuccess: () => {
        notifications.success('Marked as spam');
        refetch();
      },
    }
  );

  // Delete mutation
  const { mutate: deleteComment } = useMutate(
    async (id: string) => {
      await new Promise(resolve => setTimeout(resolve, 500));
      return { success: true };
    },
    {
      onSuccess: () => {
        notifications.success('Comment deleted');
        refetch();
      },
    }
  );

  // Bulk approve
  const handleBulkApprove = () => {
    selectedComments.forEach((id) => approveComment(id));
    setSelectedComments(new Set());
  };

  // Bulk reject
  const handleBulkReject = () => {
    selectedComments.forEach((id) => rejectComment(id));
    setSelectedComments(new Set());
  };

  // Bulk spam
  const handleBulkSpam = () => {
    selectedComments.forEach((id) => markAsSpam(id));
    setSelectedComments(new Set());
  };

  // Toggle selection
  const toggleSelection = (id: string) => {
    const newSelection = new Set(selectedComments);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedComments(newSelection);
  };

  // Reply to comment
  const handleReply = (comment: Comment) => {
    setReplyingTo(comment);
    setShowReplyModal(true);
  };

  // Submit reply
  const submitReply = async () => {
    // API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    notifications.success('Reply posted');
    setShowReplyModal(false);
    setReplyText('');
    setReplyingTo(null);
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    const configs = {
      pending: { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-600 dark:text-yellow-400', label: 'Pending' },
      approved: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-600 dark:text-green-400', label: 'Approved' },
      spam: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-600 dark:text-red-400', label: 'Spam' },
      rejected: { bg: 'bg-gray-100 dark:bg-gray-800', text: 'text-gray-600 dark:text-gray-400', label: 'Rejected' },
    };
    const config = configs[status as keyof typeof configs];
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Comment Moderation
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Review and moderate user comments
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: comments?.length || 0, color: 'blue', icon: '💬' },
          { label: 'Pending', value: comments?.filter(c => c.status === 'pending').length || 0, color: 'yellow', icon: '⏳' },
          { label: 'Approved', value: comments?.filter(c => c.status === 'approved').length || 0, color: 'green', icon: '✅' },
          { label: 'Spam', value: comments?.filter(c => c.status === 'spam').length || 0, color: 'red', icon: '🚫' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{stat.label}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
              <div className="text-3xl">{stat.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex flex-wrap items-center gap-4">
          {/* Search */}
          <div className="flex-1 min-w-[300px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search comments..."
                className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="spam">Spam</option>
            <option value="rejected">Rejected</option>
          </select>

          {/* Bulk Actions */}
          {selectedComments.size > 0 && (
            <div className="flex items-center gap-2">
              <button
                onClick={handleBulkApprove}
                className="flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-xl hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
              >
                <Check className="w-4 h-4" />
                Approve ({selectedComments.size})
              </button>
              <button
                onClick={handleBulkReject}
                className="flex items-center gap-2 px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
              >
                <X className="w-4 h-4" />
                Reject ({selectedComments.size})
              </button>
              <button
                onClick={handleBulkSpam}
                className="flex items-center gap-2 px-4 py-2 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-xl hover:bg-orange-200 dark:hover:bg-orange-900/50 transition-colors"
              >
                <Flag className="w-4 h-4" />
                Spam ({selectedComments.size})
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        {filteredComments?.map((comment) => (
          <div
            key={comment.id}
            className={`bg-white dark:bg-gray-800 rounded-xl border-2 transition-all ${
              selectedComments.has(comment.id)
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-200 dark:border-gray-700'
            }`}
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3 flex-1">
                  <input
                    type="checkbox"
                    checked={selectedComments.has(comment.id)}
                    onChange={() => toggleSelection(comment.id)}
                    className="mt-1 w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500/20"
                  />
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-medium flex-shrink-0">
                    {comment.author.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{comment.author.name}</span>
                      {getStatusBadge(comment.status)}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {comment.author.email}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(comment.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>

              {/* Article Reference */}
              <div className="mb-3 text-sm">
                <span className="text-gray-600 dark:text-gray-400">On article:</span>{' '}
                <a href={`/articles/${comment.article.id}`} className="text-blue-600 dark:text-blue-400 hover:underline">
                  {comment.article.title}
                </a>
              </div>

              {/* Content */}
              <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
                <p className="text-gray-900 dark:text-gray-100">{comment.content}</p>
              </div>

              {/* Meta */}
              {comment.ip && (
                <div className="mb-4 text-xs text-gray-500 dark:text-gray-400">
                  IP: {comment.ip}
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-2">
                {comment.status === 'pending' && (
                  <>
                    <button
                      onClick={() => approveComment(comment.id)}
                      className="flex items-center gap-2 px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                    >
                      <Check className="w-4 h-4" />
                      Approve
                    </button>
                    <button
                      onClick={() => rejectComment(comment.id)}
                      className="flex items-center gap-2 px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                    >
                      <X className="w-4 h-4" />
                      Reject
                    </button>
                  </>
                )}
                <button
                  onClick={() => markAsSpam(comment.id)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-lg hover:bg-orange-200 dark:hover:bg-orange-900/50 transition-colors text-sm"
                >
                  <Flag className="w-4 h-4" />
                  Spam
                </button>
                <button
                  onClick={() => handleReply(comment)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors text-sm"
                >
                  <Reply className="w-4 h-4" />
                  Reply {comment.replies ? `(${comment.replies})` : ''}
                </button>
                <button
                  onClick={() => deleteComment(comment.id)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredComments?.length === 0 && (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            <MessageSquare className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No comments found</p>
          </div>
        )}
      </div>

      {/* Reply Modal */}
      {showReplyModal && replyingTo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6">
            <h3 className="text-xl font-bold mb-4">Reply to Comment</h3>

            {/* Original Comment */}
            <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  {replyingTo.author.name.charAt(0)}
                </div>
                <span className="font-medium">{replyingTo.author.name}</span>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300">{replyingTo.content}</p>
            </div>

            {/* Reply Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Your Reply</label>
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                rows={4}
                placeholder="Write your reply..."
                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowReplyModal(false);
                  setReplyText('');
                  setReplyingTo(null);
                }}
                className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={submitReply}
                disabled={!replyText.trim()}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                <Reply className="w-4 h-4" />
                Send Reply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentModerationPage;
