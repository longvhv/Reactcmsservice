import React, { useState } from 'react';
import { 
  Calendar, Clock, Eye, Heart, MessageSquare, Share2, Bookmark,
  ChevronRight, TrendingUp, Star, User, Filter, Search, ArrowRight,
  Bell, BellOff, Check
} from 'lucide-react';
import { Card } from './Card';

interface StreamArticle {
  id: string;
  order: number;
  title: string;
  slug: string;
  excerpt: string;
  type: string;
  publishedAt: string;
  thumbnail?: string;
  readTime: number;
  views: number;
  likes: number;
  comments: number;
  author: {
    name: string;
    avatar: string;
    bio: string;
  };
}

export function EventStreamPublicView({ streamSlug }: { streamSlug: string }) {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'recent' | 'popular'>('all');
  const [isFollowing, setIsFollowing] = useState(false);
  const [likedArticles, setLikedArticles] = useState<Set<string>>(new Set());
  const [bookmarkedArticles, setBookmarkedArticles] = useState<Set<string>>(new Set());

  // Mock data
  const stream = {
    id: '1',
    name: 'Tech Summit 2024',
    description: 'Chuỗi tin tức và sự kiện về công nghệ lớn nhất năm 2024, cập nhật liên tục các xu hướng AI, Cloud, và Blockchain.',
    slug: streamSlug,
    thumbnail: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&h=600&fit=crop',
    color: '#3B82F6',
    tags: ['Technology', 'AI', 'Cloud', 'Blockchain', 'Innovation'],
    followers: 1203,
    totalArticles: 18,
    lastUpdate: '2024-01-26',
  };

  const articles: StreamArticle[] = [
    {
      id: 'a1',
      order: 1,
      title: 'Tech Summit 2024 - Thông báo chính thức',
      slug: 'tech-summit-2024-announcement',
      excerpt: 'Chính thức công bố sự kiện công nghệ lớn nhất năm 2024 với sự tham gia của hơn 50 diễn giả hàng đầu.',
      type: 'Thông báo',
      publishedAt: '2024-01-15',
      thumbnail: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=500&fit=crop',
      readTime: 5,
      views: 4532,
      likes: 342,
      comments: 67,
      author: {
        name: 'Nguyễn Văn A',
        avatar: 'https://i.pravatar.cc/150?img=1',
        bio: 'Event Manager',
      },
    },
    {
      id: 'a2',
      order: 2,
      title: 'AI Revolution: Xu hướng AI năm 2024',
      slug: 'ai-revolution-trends-2024',
      excerpt: 'Phân tích sâu về các xu hướng AI đột phá sẽ định hình tương lai công nghệ trong năm 2024.',
      type: 'Phân tích',
      publishedAt: '2024-01-17',
      thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=500&fit=crop',
      readTime: 8,
      views: 5234,
      likes: 423,
      comments: 89,
      author: {
        name: 'Trần Thị B',
        avatar: 'https://i.pravatar.cc/150?img=2',
        bio: 'AI Researcher',
      },
    },
    {
      id: 'a3',
      order: 3,
      title: 'Cloud Infrastructure: Best Practices',
      slug: 'cloud-infrastructure-best-practices',
      excerpt: 'Hướng dẫn chi tiết về cách xây dựng hạ tầng Cloud hiệu quả và tiết kiệm chi phí.',
      type: 'Hướng dẫn',
      publishedAt: '2024-01-19',
      thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=500&fit=crop',
      readTime: 12,
      views: 3876,
      likes: 298,
      comments: 56,
      author: {
        name: 'Lê Văn C',
        avatar: 'https://i.pravatar.cc/150?img=3',
        bio: 'Cloud Architect',
      },
    },
  ];

  const toggleLike = (articleId: string) => {
    const newLiked = new Set(likedArticles);
    if (newLiked.has(articleId)) {
      newLiked.delete(articleId);
    } else {
      newLiked.add(articleId);
    }
    setLikedArticles(newLiked);
  };

  const toggleBookmark = (articleId: string) => {
    const newBookmarked = new Set(bookmarkedArticles);
    if (newBookmarked.has(articleId)) {
      newBookmarked.delete(articleId);
    } else {
      newBookmarked.add(articleId);
    }
    setBookmarkedArticles(newBookmarked);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative h-[500px] overflow-hidden">
        <img
          src={stream.thumbnail}
          alt={stream.name}
          className="w-full h-full object-cover"
        />
        <div 
          className="absolute inset-0 mix-blend-multiply opacity-60"
          style={{ backgroundColor: stream.color }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
        
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              {stream.tags.map((tag) => (
                <span key={tag} className="px-4 py-1.5 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm">
                  {tag}
                </span>
              ))}
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              {stream.name}
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              {stream.description}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 mb-6">
              <div className="flex items-center gap-2 text-white/80">
                <User className="w-5 h-5" />
                <span>{stream.followers.toLocaleString()} theo dõi</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-white/50" />
              <div className="flex items-center gap-2 text-white/80">
                <Calendar className="w-5 h-5" />
                <span>{stream.totalArticles} bài viết</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-white/50" />
              <div className="flex items-center gap-2 text-white/80">
                <Clock className="w-5 h-5" />
                <span>Cập nhật {new Date(stream.lastUpdate).toLocaleDateString('vi-VN')}</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => setIsFollowing(!isFollowing)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${
                  isFollowing
                    ? 'bg-white/20 text-white border-2 border-white/30 hover:bg-white/30'
                    : 'bg-white text-gray-900 hover:bg-white/90'
                }`}
              >
                {isFollowing ? (
                  <>
                    <Check className="w-5 h-5" />
                    Đang theo dõi
                  </>
                ) : (
                  <>
                    <Bell className="w-5 h-5" />
                    Theo dõi dòng sự kiện
                  </>
                )}
              </button>
              <button className="px-6 py-3 bg-white/20 backdrop-blur-sm text-white rounded-xl hover:bg-white/30 transition-all flex items-center gap-2">
                <Share2 className="w-5 h-5" />
                Chia sẻ
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Tìm kiếm trong dòng sự kiện..."
              className="w-full pl-12 pr-4 py-3 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
          <div className="flex gap-2">
            {[
              { key: 'all', label: 'Tất cả' },
              { key: 'recent', label: 'Mới nhất' },
              { key: 'popular', label: 'Phổ biến' },
            ].map((filter) => (
              <button
                key={filter.key}
                onClick={() => setSelectedFilter(filter.key as any)}
                className={`px-5 py-2.5 rounded-xl font-medium transition-all ${
                  selectedFilter === filter.key
                    ? 'text-white shadow-lg'
                    : 'bg-card hover:bg-muted'
                }`}
                style={selectedFilter === filter.key ? { backgroundColor: stream.color } : {}}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="space-y-8">
          {articles.map((article, index) => (
            <Card key={article.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 group">
              <div className="grid md:grid-cols-5 gap-6">
                {/* Thumbnail */}
                {article.thumbnail && (
                  <div className="md:col-span-2 relative overflow-hidden">
                    <div className="absolute top-4 left-4 z-10">
                      <div 
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg"
                        style={{ backgroundColor: stream.color }}
                      >
                        {article.order}
                      </div>
                    </div>
                    <img
                      src={article.thumbnail}
                      alt={article.title}
                      className="w-full h-full object-cover min-h-[250px] group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                )}

                {/* Content */}
                <div className="md:col-span-3 p-6 flex flex-col">
                  <div className="flex items-center gap-3 mb-4">
                    <span 
                      className="px-3 py-1 rounded-lg text-xs font-semibold text-white"
                      style={{ backgroundColor: stream.color }}
                    >
                      {article.type}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {new Date(article.publishedAt).toLocaleDateString('vi-VN', { 
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>

                  <h2 className="text-2xl font-bold mb-3 group-hover:text-blue-600 transition-colors">
                    {article.title}
                  </h2>
                  
                  <p className="text-muted-foreground mb-6 line-clamp-2 flex-1">
                    {article.excerpt}
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-3 mb-6 pb-6 border-b border-border">
                    <img
                      src={article.author.avatar}
                      alt={article.author.name}
                      className="w-12 h-12 rounded-full"
                    />
                    <div>
                      <p className="font-semibold">{article.author.name}</p>
                      <p className="text-sm text-muted-foreground">{article.author.bio}</p>
                    </div>
                  </div>

                  {/* Stats & Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <Eye className="w-4 h-4" />
                        {article.views.toLocaleString()}
                      </span>
                      <button
                        onClick={() => toggleLike(article.id)}
                        className={`flex items-center gap-1.5 transition-colors ${
                          likedArticles.has(article.id) ? 'text-red-500' : 'hover:text-red-500'
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${likedArticles.has(article.id) ? 'fill-current' : ''}`} />
                        {article.likes + (likedArticles.has(article.id) ? 1 : 0)}
                      </button>
                      <span className="flex items-center gap-1.5">
                        <MessageSquare className="w-4 h-4" />
                        {article.comments}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4" />
                        {article.readTime} phút đọc
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleBookmark(article.id)}
                        className={`p-2.5 rounded-xl transition-all ${
                          bookmarkedArticles.has(article.id)
                            ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30'
                            : 'bg-secondary hover:bg-muted'
                        }`}
                      >
                        <Bookmark className={`w-5 h-5 ${bookmarkedArticles.has(article.id) ? 'fill-current' : ''}`} />
                      </button>
                      <button
                        className="px-5 py-2.5 text-white rounded-xl font-medium transition-all hover:shadow-lg flex items-center gap-2"
                        style={{ backgroundColor: stream.color }}
                      >
                        Đọc tiếp
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Timeline connector */}
              {index < articles.length - 1 && (
                <div className="flex justify-center py-6">
                  <div 
                    className="w-1 h-12 rounded-full opacity-30"
                    style={{ backgroundColor: stream.color }}
                  />
                </div>
              )}
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="mt-12 text-center">
          <button
            className="px-8 py-3 bg-card hover:bg-muted rounded-xl font-medium transition-all border border-border"
          >
            Xem thêm bài viết
          </button>
        </div>
      </div>

      {/* Sticky Subscribe Bar */}
      {!isFollowing && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-slide-in-bottom">
          <Card className="p-4 shadow-2xl">
            <div className="flex items-center gap-4">
              <div>
                <p className="font-semibold">Theo dõi để không bỏ lỡ cập nhật mới!</p>
                <p className="text-sm text-muted-foreground">Nhận thông báo khi có bài viết mới</p>
              </div>
              <button
                onClick={() => setIsFollowing(true)}
                className="px-6 py-2.5 text-white rounded-xl font-semibold whitespace-nowrap transition-all hover:shadow-lg flex items-center gap-2"
                style={{ backgroundColor: stream.color }}
              >
                <Bell className="w-4 h-4" />
                Theo dõi ngay
              </button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
