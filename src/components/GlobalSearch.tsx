import { useState } from 'react';
import { Search as SearchIcon, FileText, Video, Image, User, Calendar, TrendingUp, Filter, X, Clock } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface SearchResult {
  id: number;
  type: 'article' | 'user' | 'media' | 'category';
  title: string;
  description?: string;
  thumbnail?: string;
  meta?: string;
  date?: string;
}

export function GlobalSearch() {
  const { t } = useLanguage();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'articles' | 'users' | 'media'>('all');

  const results: SearchResult[] = [
    {
      id: 1,
      type: 'article',
      title: 'Hướng dẫn React Hooks chi tiết',
      description: 'Tìm hiểu về useState, useEffect và các hooks khác...',
      meta: '1,234 views',
      date: '2 ngày trước',
    },
    {
      id: 2,
      type: 'user',
      title: 'Nguyễn Văn A',
      description: 'Content Manager',
      meta: '247 bài viết',
    },
    {
      id: 3,
      type: 'media',
      title: 'tech-conference-2024.jpg',
      description: '1920x1080 • 2.4 MB',
      thumbnail: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=100',
      date: '1 tuần trước',
    },
  ];

  const recentSearches = ['React Hooks', 'Video tutorial', 'Gallery 2024'];
  const trendingTopics = ['AI', 'Machine Learning', 'Web Development', 'SEO'];

  return (
    <div className="relative">
      {/* Search Trigger */}
      <div className="relative group">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
        <input
          type="text"
          placeholder={t('placeholders.searchCommand')}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          className="w-full pl-10 pr-20 py-2.5 bg-muted/50 border border-border/60 rounded-xl 
            focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 focus:bg-card
            transition-all duration-200 placeholder:text-muted-foreground"
        />
        <kbd className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-1 bg-background border border-border/60 rounded text-xs text-muted-foreground font-mono">
          ⌘K
        </kbd>
      </div>

      {/* Search Modal */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Modal */}
          <div className="fixed top-20 left-1/2 -translate-x-1/2 w-full max-w-2xl bg-card border border-border/60 rounded-2xl shadow-2xl z-50 animate-slide-in-top">
            {/* Header */}
            <div className="p-4 border-b border-border/60">
              <div className="flex items-center gap-3 mb-3">
                <SearchIcon className="w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Tìm kiếm trong CMS..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  autoFocus
                  className="flex-1 bg-transparent border-none focus:outline-none text-foreground placeholder:text-muted-foreground"
                />
                <button onClick={() => setIsOpen(false)}>
                  <X className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />
                </button>
              </div>

              {/* Filters */}
              <div className="flex items-center gap-2">
                {[
                  { id: 'all', label: 'Tất cả' },
                  { id: 'articles', label: 'Bài viết' },
                  { id: 'users', label: 'Người dùng' },
                  { id: 'media', label: 'Media' },
                ].map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => setActiveFilter(filter.id as any)}
                    className={`px-3 py-1 rounded-lg text-sm transition-all duration-200 ${
                      activeFilter === filter.id
                        ? 'bg-blue-100 text-blue-700'
                        : 'hover:bg-muted/50'
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Results */}
            <div className="max-h-96 overflow-y-auto">
              {query ? (
                <div className="p-2">
                  {results.map((result) => (
                    <button
                      key={result.id}
                      className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors text-left"
                    >
                      {/* Icon/Thumbnail */}
                      {result.thumbnail ? (
                        <img src={result.thumbnail} alt="" className="w-12 h-12 rounded-lg object-cover" />
                      ) : (
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          {result.type === 'article' && <FileText className="w-6 h-6 text-blue-600" />}
                          {result.type === 'user' && <User className="w-6 h-6 text-blue-600" />}
                          {result.type === 'media' && <Image className="w-6 h-6 text-blue-600" />}
                        </div>
                      )}

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-foreground truncate">{result.title}</div>
                        {result.description && (
                          <div className="text-sm text-muted-foreground truncate">{result.description}</div>
                        )}
                      </div>

                      {/* Meta */}
                      <div className="text-xs text-muted-foreground text-right">
                        {result.meta && <div>{result.meta}</div>}
                        {result.date && <div>{result.date}</div>}
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-4">
                  {/* Recent Searches */}
                  <div className="mb-6">
                    <div className="text-xs text-muted-foreground mb-2 px-2 flex items-center gap-2">
                      <Clock className="w-3 h-3" />
                      Tìm kiếm gần đây
                    </div>
                    <div className="space-y-1">
                      {recentSearches.map((search, idx) => (
                        <button
                          key={idx}
                          className="w-full text-left px-3 py-2 rounded-lg hover:bg-muted/50 transition-colors text-sm"
                        >
                          <SearchIcon className="w-4 h-4 inline mr-2 text-muted-foreground" />
                          {search}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Trending */}
                  <div>
                    <div className="text-xs text-muted-foreground mb-2 px-2 flex items-center gap-2">
                      <TrendingUp className="w-3 h-3" />
                      Trending
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {trendingTopics.map((topic, idx) => (
                        <button
                          key={idx}
                          className="px-3 py-1 bg-muted rounded-full text-sm hover:bg-muted/80 transition-colors"
                        >
                          {topic}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-4">
                <span>↑↓ điều hướng</span>
                <span>↵ chọn</span>
                <span>esc đóng</span>
              </div>
              <div>Tìm thấy {results.length} kết quả</div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}