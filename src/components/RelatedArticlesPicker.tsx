import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Calendar, TrendingUp, Clock, Tag, Filter, ChevronDown, Sparkles, ExternalLink, Eye } from 'lucide-react';
import { getArticles } from '../services/api';

interface Article {
  id: number;
  title: string;
  image: string;
  category: string;
  date: string;
  views: number;
  type: string;
  tags: string[];
}

interface RelatedArticlesPickerProps {
  selectedArticles: number[];
  onChange: (articleIds: number[]) => void;
  currentArticleTitle?: string;
  currentArticleCategory?: string;
}

export const RelatedArticlesPicker: React.FC<RelatedArticlesPickerProps> = ({
  selectedArticles,
  onChange,
  currentArticleTitle = '',
  currentArticleCategory = '',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'relevance' | 'date' | 'views'>('relevance');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  const [aiSuggestions, setAiSuggestions] = useState<number[]>([]);
  const [showAISuggestions, setShowAISuggestions] = useState(true);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const ITEMS_PER_PAGE = 10;

  // Fetch articles from API
  useEffect(() => {
    fetchArticles();
  }, [searchQuery, categoryFilter, typeFilter, dateFilter, sortBy, currentPage]);

  // Generate AI suggestions when component mounts
  useEffect(() => {
    if (currentArticleTitle || currentArticleCategory) {
      generateAISuggestions();
    }
  }, [currentArticleTitle, currentArticleCategory]);

  const fetchArticles = async () => {
    setLoading(true);
    
    try {
      // Call API service
      const result = await getArticles({
        search: searchQuery || undefined,
        category: categoryFilter !== 'all' ? categoryFilter : undefined,
        type: typeFilter !== 'all' ? typeFilter : undefined,
        limit: ITEMS_PER_PAGE,
        offset: (currentPage - 1) * ITEMS_PER_PAGE,
      });
      
      // Convert API articles to component format
      const formattedArticles = result.articles.map(article => ({
        id: article.id,
        title: article.title,
        image: article.thumbnail || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=300&fit=crop',
        category: article.category,
        date: article.publishDate,
        views: article.views,
        type: article.type,
        tags: article.tags || [],
      }));
      
      setArticles(formattedArticles);
      setTotalResults(result.total);
    } catch (error) {
      console.error('Error fetching articles:', error);
      // Fallback to mock data for demo
      setArticles(generateMockArticles(currentPage, searchQuery));
      setTotalResults(500);
    } finally {
      setLoading(false);
    }
  };

  const generateAISuggestions = async () => {
    // Simulate AI-powered recommendations based on current article
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // In production, this would call an AI API
    // For now, we'll use the first 5 articles as suggestions
    const suggested = articles.slice(0, 5).map(a => a.id);
    setAiSuggestions(suggested);
  };

  const generateMockArticles = (page: number, query: string): Article[] => {
    const categories = ['Công nghệ', 'Kinh tế', 'Thể thao', 'Giải trí', 'Đời sống', 'Pháp luật', 'Du lịch'];
    const types = ['news', 'video', 'gallery', 'podcast'];
    
    return Array.from({ length: ITEMS_PER_PAGE }, (_, i) => {
      const id = (page - 1) * ITEMS_PER_PAGE + i + 1;
      return {
        id,
        title: query 
          ? `${query} - Bài viết số ${id}` 
          : `Bài viết mẫu số ${id} với tiêu đề dài để test`,
        image: `https://images.unsplash.com/photo-${1500000000000 + id}?w=200`,
        category: categories[id % categories.length],
        date: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
        views: Math.floor(Math.random() * 10000),
        type: types[id % types.length],
        tags: ['tag1', 'tag2', 'tag3'].slice(0, Math.floor(Math.random() * 3) + 1),
      };
    });
  };

  const handleSearch = (value: string) => {
    // Debounce search
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      setSearchQuery(value);
      setCurrentPage(1);
    }, 300);
  };

  const toggleArticle = (id: number) => {
    if (selectedArticles.includes(id)) {
      onChange(selectedArticles.filter(aid => aid !== id));
    } else {
      onChange([...selectedArticles, id]);
    }
  };

  const applyAISuggestions = () => {
    onChange([...new Set([...selectedArticles, ...aiSuggestions])]);
    setShowAISuggestions(false);
  };

  const clearAll = () => {
    onChange([]);
  };

  const totalPages = Math.ceil(totalResults / ITEMS_PER_PAGE);

  const quickFilters = [
    { id: 'trending', label: '🔥 Trending', onClick: () => { setSortBy('views'); setDateFilter('week'); } },
    { id: 'recent', label: '🕐 Mới nhất', onClick: () => { setSortBy('date'); setDateFilter('all'); } },
    { id: 'popular', label: '⭐ Phổ biến', onClick: () => { setSortBy('views'); setDateFilter('all'); } },
    { id: 'same-category', label: '📁 Cùng danh mục', onClick: () => { setCategoryFilter(currentArticleCategory || 'all'); } },
  ];

  const categories = ['Tin nóng', 'Thời sự', 'Kinh tế', 'Pháp luật', 'Đời sống', 'Thể thao', 'Giải trí', 'Công nghệ', 'Du lịch'];
  const types = [
    { value: 'news', label: 'Tin tức' },
    { value: 'video', label: 'Video' },
    { value: 'gallery', label: 'Gallery' },
    { value: 'podcast', label: 'Podcast' },
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="font-medium text-gray-900">Chọn bài viết liên quan</h3>
          {selectedArticles.length > 0 && (
            <span className="px-2 py-0.5 text-xs rounded-full bg-teal-600 text-white">
              {selectedArticles.length} đã chọn
            </span>
          )}
        </div>
        {selectedArticles.length > 0 && (
          <button
            onClick={clearAll}
            className="text-xs text-red-600 hover:text-red-700 flex items-center gap-1"
          >
            <X className="w-3 h-3" />
            Xóa tất cả
          </button>
        )}
      </div>

      {/* AI Suggestions */}
      {showAISuggestions && aiSuggestions.length > 0 && (
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <h4 className="text-sm font-semibold text-purple-900">Gợi ý AI</h4>
            </div>
            <button
              onClick={() => setShowAISuggestions(false)}
              className="text-purple-600 hover:text-purple-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-purple-700 mb-3">
            Dựa trên tiêu đề và nội dung bài viết hiện tại, chúng tôi gợi ý {aiSuggestions.length} bài viết liên quan
          </p>
          <button
            onClick={applyAISuggestions}
            className="w-full px-3 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors"
          >
            Áp dụng gợi ý ({aiSuggestions.length} bài)
          </button>
        </div>
      )}

      {/* Search & Quick Filters */}
      <div className="space-y-3">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            defaultValue={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Tìm kiếm bài viết theo tiêu đề, nội dung..."
            className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20"
          />
        </div>

        {/* Quick Filters */}
        <div className="flex gap-2 flex-wrap">
          {quickFilters.map(filter => (
            <button
              key={filter.id}
              onClick={filter.onClick}
              className="px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors"
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Advanced Filters Toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
        >
          <Filter className="w-4 h-4" />
          Bộ lọc nâng cao
          <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
        </button>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="grid grid-cols-2 gap-3 p-4 bg-gray-50 rounded-lg">
            {/* Category Filter */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Danh mục</label>
              <select
                value={categoryFilter}
                onChange={(e) => { setCategoryFilter(e.target.value); setCurrentPage(1); }}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              >
                <option value="all">-- Danh mục --</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Type Filter */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Loại bài viết</label>
              <select
                value={typeFilter}
                onChange={(e) => { setTypeFilter(e.target.value); setCurrentPage(1); }}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              >
                <option value="all">-- Loại bài viết --</option>
                {types.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>

            {/* Date Filter */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Thời gian</label>
              <select
                value={dateFilter}
                onChange={(e) => { setDateFilter(e.target.value); setCurrentPage(1); }}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              >
                <option value="all">-- Thời gian --</option>
                <option value="today">Hôm nay</option>
                <option value="week">Tuần này</option>
                <option value="month">Tháng này</option>
                <option value="year">Năm nay</option>
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Sắp xếp theo</label>
              <select
                value={sortBy}
                onChange={(e) => { setSortBy(e.target.value as any); setCurrentPage(1); }}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              >
                <option value="relevance">Liên quan nhất</option>
                <option value="date">Mới nhất</option>
                <option value="views">Xem nhiều nhất</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between text-xs text-gray-600 px-1">
        <span>
          {loading ? 'Đang tải...' : `Tìm thấy ${totalResults.toLocaleString('vi-VN')} bài viết`}
        </span>
        <span>
          Trang {currentPage}/{totalPages}
        </span>
      </div>

      {/* Articles List */}
      <div className="space-y-2 max-h-[400px] overflow-y-auto">
        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block w-8 h-8 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin"></div>
            <p className="text-sm text-gray-600 mt-2">Đang tải bài viết...</p>
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 text-sm">Không tìm thấy bài viết phù hợp</p>
          </div>
        ) : (
          articles.map(article => {
            const isSelected = selectedArticles.includes(article.id);
            const isAISuggested = aiSuggestions.includes(article.id);
            
            return (
              <label
                key={article.id}
                className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all group ${
                  isSelected
                    ? 'border-teal-500 bg-teal-50'
                    : 'border-gray-200 hover:border-teal-300 hover:shadow-sm'
                }`}
              >
                {/* Checkbox */}
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggleArticle(article.id)}
                  className="w-4 h-4 text-teal-600 rounded"
                />

                {/* Thumbnail */}
                <div className="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                  <img 
                    src={article.image} 
                    alt="" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=200';
                    }}
                  />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-2 mb-1">
                    <h4 className="text-sm font-medium text-gray-900 line-clamp-2 flex-1">
                      {article.title}
                    </h4>
                    {isAISuggested && (
                      <span className="flex-shrink-0 px-2 py-0.5 text-xs rounded-full bg-purple-100 text-purple-700">
                        AI
                      </span>
                    )}
                  </div>

                  {/* Meta */}
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                      {article.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(article.date).toLocaleDateString('vi-VN')}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {article.views.toLocaleString('vi-VN')}
                    </span>
                  </div>
                </div>

                {/* Preview Link */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    window.open(`/article/${article.id}`, '_blank');
                  }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-gray-100 rounded-lg"
                  title="Xem trước"
                >
                  <ExternalLink className="w-4 h-4 text-gray-400" />
                </button>
              </label>
            );
          })
        )}
      </div>

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-between pt-3 border-t border-gray-200">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Trang trước
          </button>

          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              return (
                <button
                  key={i}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`px-3 py-1.5 text-sm rounded-lg ${
                    currentPage === pageNum
                      ? 'bg-teal-600 text-white'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Trang sau
          </button>
        </div>
      )}

      {/* Selected Articles Summary */}
      {selectedArticles.length > 0 && (
        <div className="pt-3 border-t border-gray-200">
          <p className="text-xs text-gray-600 mb-2">
            Đã chọn {selectedArticles.length} bài viết:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {selectedArticles.map(id => {
              const article = articles.find(a => a.id === id);
              return (
                <span
                  key={id}
                  className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-teal-100 text-teal-700 rounded-full"
                >
                  {article?.title.slice(0, 30) || `#${id}`}...
                  <button
                    onClick={() => toggleArticle(id)}
                    className="hover:bg-teal-200 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};