import { useState } from 'react';
import { MessageCircle, ThumbsUp, ThumbsDown, Flag, Trash2, CheckCircle, XCircle, Eye, User, Clock, Search, Filter, MoreVertical } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface Comment {
  id: number;
  content: string;
  author: string;
  email: string;
  article: string;
  status: 'pending' | 'approved' | 'spam' | 'trash';
  date: string;
  likes: number;
  reports: number;
  replies?: number;
}

export function CommentModeration() {
  const { t } = useLanguage();
  const [selectedTab, setSelectedTab] = useState<'pending' | 'approved' | 'spam' | 'all'>('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedComments, setSelectedComments] = useState<number[]>([]);

  const comments: Comment[] = [
    {
      id: 1,
      content: 'Bài viết rất hay và hữu ích! Cảm ơn tác giả đã chia sẻ.',
      author: 'Nguyễn Văn A',
      email: 'nguyenvana@email.com',
      article: 'Hướng dẫn React Hooks chi tiết',
      status: 'pending',
      date: '5 phút trước',
      likes: 12,
      reports: 0,
      replies: 2,
    },
    {
      id: 2,
      content: 'Mình có thắc mắc về phần useEffect, có thể giải thích rõ hơn không ạ?',
      author: 'Trần Thị B',
      email: 'tranthib@email.com',
      article: 'Hướng dẫn React Hooks chi tiết',
      status: 'pending',
      date: '15 phút trước',
      likes: 5,
      reports: 0,
    },
    {
      id: 3,
      content: 'Spam content here...',
      author: 'Spammer X',
      email: 'spam@spam.com',
      article: 'Best practices SEO 2024',
      status: 'spam',
      date: '1 giờ trước',
      likes: 0,
      reports: 8,
    },
    {
      id: 4,
      content: 'Code examples rất dễ hiểu. Thanks!',
      author: 'Lê Văn C',
      email: 'levanc@email.com',
      article: 'JavaScript Tips & Tricks',
      status: 'approved',
      date: '2 giờ trước',
      likes: 23,
      reports: 0,
      replies: 5,
    },
  ];

  const tabs = [
    { id: 'pending', label: 'Chờ duyệt', count: comments.filter(c => c.status === 'pending').length, color: 'yellow' },
    { id: 'approved', label: 'Đã duyệt', count: comments.filter(c => c.status === 'approved').length, color: 'green' },
    { id: 'spam', label: 'Spam', count: comments.filter(c => c.status === 'spam').length, color: 'red' },
    { id: 'all', label: 'Tất cả', count: comments.length, color: 'blue' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'approved': return 'bg-green-100 text-green-700';
      case 'spam': return 'bg-red-100 text-red-700';
      case 'trash': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const filteredComments = selectedTab === 'all' 
    ? comments 
    : comments.filter(c => c.status === selectedTab);

  const toggleCommentSelection = (id: number) => {
    setSelectedComments(prev =>
      prev.includes(id) ? prev.filter(cid => cid !== id) : [...prev, id]
    );
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-foreground mb-2">Quản lý bình luận</h1>
          <p className="text-muted-foreground">Kiểm duyệt và quản lý bình luận</p>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-3 border border-border/60 rounded-xl hover:bg-muted/50 transition-all duration-200">
            <Filter className="w-4 h-4" />
            <span>Bộ lọc</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {tabs.map((tab) => (
          <div key={tab.id} className={`bg-gradient-to-br from-${tab.color}-50 to-${tab.color}-100 border border-${tab.color}-200 rounded-2xl p-6`}>
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 bg-${tab.color}-500 rounded-xl`}>
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className={`text-3xl font-bold text-${tab.color}-700 mb-1`}>{tab.count}</div>
            <div className={`text-sm text-${tab.color}-600`}>{tab.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="bg-card rounded-2xl border border-border/60 overflow-hidden">
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
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(tab.id === 'all' ? 'approved' : tab.id)}`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Search & Bulk Actions */}
        <div className="p-4 border-b border-border/60">
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder={t('placeholders.searchArticles')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
              />
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedComments.length > 0 && (
            <div className="mt-3 pt-3 border-t border-border/60 flex items-center gap-3">
              <span className="text-sm text-muted-foreground">{selectedComments.length} bình luận đã chọn</span>
              <button className="flex items-center gap-1 px-3 py-1.5 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm">
                <CheckCircle className="w-3 h-3" />
                <span>Duyệt</span>
              </button>
              <button className="flex items-center gap-1 px-3 py-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm">
                <XCircle className="w-3 h-3" />
                <span>Spam</span>
              </button>
              <button className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm">
                <Trash2 className="w-3 h-3" />
                <span>Xóa</span>
              </button>
            </div>
          )}
        </div>

        {/* Comments List */}
        <div className="divide-y divide-border/60">
          {filteredComments.map((comment) => (
            <div
              key={comment.id}
              className={`p-6 hover:bg-muted/30 transition-colors ${
                selectedComments.includes(comment.id) ? 'bg-blue-50' : ''
              }`}
            >
              <div className="flex gap-4">
                {/* Checkbox */}
                <div className="pt-1">
                  <input
                    type="checkbox"
                    checked={selectedComments.includes(comment.id)}
                    onChange={() => toggleCommentSelection(comment.id)}
                    className="w-5 h-5 rounded"
                  />
                </div>

                {/* Avatar */}
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-medium flex-shrink-0">
                  {comment.author.charAt(0)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-foreground">{comment.author}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(comment.status)}`}>
                          {comment.status === 'pending' ? 'Chờ duyệt' : comment.status === 'approved' ? 'Đã duyệt' : 'Spam'}
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground">{comment.email}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{comment.date}</span>
                    </div>
                  </div>

                  <div className="text-foreground mb-3 leading-relaxed">{comment.content}</div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="text-xs text-muted-foreground">Trên: <span className="text-blue-600">{comment.article}</span></span>
                      {comment.replies && (
                        <span className="flex items-center gap-1">
                          <MessageCircle className="w-4 h-4" />
                          {comment.replies} phản hồi
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <ThumbsUp className="w-4 h-4" />
                        {comment.likes}
                      </span>
                      {comment.reports > 0 && (
                        <span className="flex items-center gap-1 text-red-600">
                          <Flag className="w-4 h-4" />
                          {comment.reports} báo cáo
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {comment.status === 'pending' && (
                        <>
                          <button className="p-2 hover:bg-green-100 text-green-600 rounded-lg transition-colors" title="Duyệt">
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition-colors" title="Đánh dấu spam">
                            <Flag className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      <button className="p-2 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors" title="Xem chi tiết">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-card rounded-2xl border border-border/60 p-6">
          <h3 className="text-foreground mb-4">Hoạt động hôm nay</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Bình luận mới</span>
              <span className="font-medium">24</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Đã duyệt</span>
              <span className="font-medium text-green-600">18</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Spam bị chặn</span>
              <span className="font-medium text-red-600">6</span>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-2xl border border-border/60 p-6">
          <h3 className="text-foreground mb-4">Top người bình luận</h3>
          <div className="space-y-3">
            {['Nguyễn Văn A', 'Trần Thị B', 'Lê Văn C'].map((user, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  {user.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium">{user}</div>
                </div>
                <div className="text-sm text-muted-foreground">{12 - idx * 3} bình luận</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card rounded-2xl border border-border/60 p-6">
          <h3 className="text-foreground mb-4">Bài viết hot</h3>
          <div className="space-y-3">
            {['React Hooks Guide', 'JavaScript Tips', 'SEO Best Practices'].map((article, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <span className="text-sm text-foreground truncate">{article}</span>
                <span className="text-sm text-muted-foreground">{45 - idx * 10} comments</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}