import React, { useState } from 'react';
import {
  Search, X, Filter, Calendar, User, Tag, FileText, Folder,
  Clock, TrendingUp, SlidersHorizontal, ChevronDown, Check, Star
} from 'lucide-react';
import { Card } from './Card';
import { PageWrapper } from './PageWrapper';
import { PageHeader } from './PageHeader';
import { ArticleListView, Article } from './ArticleListView';
import { useLanguage } from '../contexts/LanguageContext';

export function AdvancedSearch({ onNavigate }: { onNavigate: (page: any) => void }) {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(true);
  const [filters, setFilters] = useState({
    types: [] as string[],
    statuses: [] as string[],
    categories: [] as string[],
    authors: [] as string[],
    tags: [] as string[],
    dateRange: 'all',
    customDateFrom: '',
    customDateTo: '',
    minViews: '',
    minComments: '',
    featured: false,
    sortBy: 'date-desc',
  });

  // Mock search results
  const searchResults: Article[] = [
    {
      id: 1,
      title: 'AI Revolution: Xu hướng AI năm 2024',
      type: 'news',
      status: 'published',
      author: 'Nguyễn Văn A',
      views: 5234,
      comments: 89,
      publishDate: '2024-01-17',
      updatedDate: '2024-01-17',
      thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=250&fit=crop',
      excerpt: 'Phân tích sâu về các xu hướng AI đột phá sẽ định hình tương lai công nghệ trong năm 2024.',
      featured: true,
      category: 'Công nghệ',
    },
    {
      id: 2,
      title: 'Cloud Infrastructure: Best Practices',
      type: 'news',
      status: 'published',
      author: 'Trần Thị B',
      views: 3876,
      comments: 56,
      publishDate: '2024-01-19',
      updatedDate: '2024-01-19',
      thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=250&fit=crop',
      excerpt: 'Hướng dẫn chi tiết về cách xây dựng hạ tầng Cloud hiệu quả và tiết kiệm chi phí.',
      category: 'Công nghệ',
    },
    {
      id: 3,
      title: 'Blockchain & Web3: Cơ hội và thách thức',
      type: 'news',
      status: 'published',
      author: 'Lê Văn C',
      views: 4123,
      comments: 72,
      publishDate: '2024-01-21',
      updatedDate: '2024-01-21',
      thumbnail: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=250&fit=crop',
      excerpt: 'Khám phá tiềm năng của công nghệ Blockchain và Web3 trong doanh nghiệp.',
      category: 'Công nghệ',
    },
  ];

  const articleTypes = [
    { value: 'news', label: 'Tin tức' },
    { value: 'video', label: 'Video' },
    { value: 'gallery', label: 'Thư viện ảnh' },
    { value: 'legal', label: 'Văn bản pháp luật' },
    { value: 'staff', label: 'Nhân sự' },
    { value: 'job', label: 'Tuyển dụng' },
    { value: 'podcast', label: 'Podcast' },
    { value: 'event', label: 'Sự kiện' },
    { value: 'download', label: 'Tải xuống' },
  ];

  const statuses = [
    { value: 'published', label: 'Đã xuất bản', color: 'green' },
    { value: 'draft', label: 'Nháp', color: 'gray' },
    { value: 'review', label: 'Chờ duyệt', color: 'yellow' },
    { value: 'scheduled', label: 'Đã lên lịch', color: 'blue' },
    { value: 'archived', label: 'Đã lưu trữ', color: 'red' },
  ];

  const categories = [
    'Công nghệ',
    'Kinh doanh',
    'Giáo dục',
    'Sức khỏe',
    'Du lịch',
    'Thể thao',
  ];

  const authors = [
    'Nguyễn Văn A',
    'Trần Thị B',
    'Lê Văn C',
    'Phạm Thị D',
    'Hoàng Văn E',
  ];

  const tags = [
    'AI', 'Cloud', 'Blockchain', 'Web3', 'Machine Learning',
    'DevOps', 'Security', 'Mobile', 'Frontend', 'Backend',
  ];

  const dateRanges = [
    { value: 'all', label: '-- Thời gian --' },
    { value: 'today', label: 'Hôm nay' },
    { value: 'week', label: '7 ngày qua' },
    { value: 'month', label: '30 ngày qua' },
    { value: '3months', label: '3 tháng qua' },
    { value: 'year', label: 'Năm nay' },
    { value: 'custom', label: 'Tùy chỉnh' },
  ];

  const sortOptions = [
    { value: 'date-desc', label: 'Mới nhất' },
    { value: 'date-asc', label: 'Cũ nhất' },
    { value: 'views-desc', label: 'Nhiều lượt xem nhất' },
    { value: 'views-asc', label: 'Ít lượt xem nhất' },
    { value: 'comments-desc', label: 'Nhiều bình luận nhất' },
    { value: 'title-asc', label: 'Tên A-Z' },
    { value: 'title-desc', label: 'Tên Z-A' },
  ];

  const toggleFilter = (filterKey: keyof typeof filters, value: string) => {
    const currentValues = filters[filterKey] as string[];
    if (currentValues.includes(value)) {
      setFilters({
        ...filters,
        [filterKey]: currentValues.filter(v => v !== value),
      });
    } else {
      setFilters({
        ...filters,
        [filterKey]: [...currentValues, value],
      });
    }
  };

  const clearAllFilters = () => {
    setFilters({
      types: [],
      statuses: [],
      categories: [],
      authors: [],
      tags: [],
      dateRange: 'all',
      customDateFrom: '',
      customDateTo: '',
      minViews: '',
      minComments: '',
      featured: false,
      sortBy: 'date-desc',
    });
    setSearchQuery('');
  };

  const getActiveFilterCount = () => {
    return (
      filters.types.length +
      filters.statuses.length +
      filters.categories.length +
      filters.authors.length +
      filters.tags.length +
      (filters.dateRange !== 'all' ? 1 : 0) +
      (filters.minViews ? 1 : 0) +
      (filters.minComments ? 1 : 0) +
      (filters.featured ? 1 : 0)
    );
  };

  const activeFilterCount = getActiveFilterCount();

  return (
    <PageWrapper>
      <PageHeader
        title="Tìm kiếm nâng cao"
        description="Tìm kiếm bài viết với bộ lọc chi tiết"
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-blue-500" />
                <h3 className="font-semibold">Bộ lọc</h3>
                {activeFilterCount > 0 && (
                  <span className="px-2 py-0.5 bg-blue-500 text-white rounded-full text-xs font-semibold">
                    {activeFilterCount}
                  </span>
                )}
              </div>
              {activeFilterCount > 0 && (
                <button
                  onClick={clearAllFilters}
                  className="text-sm text-red-500 hover:text-red-600 transition-colors"
                >
                  Xóa hết
                </button>
              )}
            </div>

            {/* Article Types */}
            <div className="mb-6">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center justify-between w-full mb-2"
              >
                <span className="text-sm font-medium">Loại bài viết</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>
              <div className="space-y-2">
                {articleTypes.map((type) => (
                  <label key={type.value} className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={filters.types.includes(type.value)}
                      onChange={() => toggleFilter('types', type.value)}
                      className="w-4 h-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                    />
                    <span className="text-sm group-hover:text-blue-500 transition-colors">
                      {type.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Status */}
            <div className="mb-6">
              <span className="text-sm font-medium mb-2 block">Trạng thái</span>
              <div className="space-y-2">
                {statuses.map((status) => (
                  <label key={status.value} className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={filters.statuses.includes(status.value)}
                      onChange={() => toggleFilter('statuses', status.value)}
                      className="w-4 h-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                    />
                    <span className="text-sm group-hover:text-blue-500 transition-colors">
                      {status.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Categories */}
            <div className="mb-6">
              <span className="text-sm font-medium mb-2 block">Danh mục</span>
              <div className="space-y-2">
                {categories.map((category) => (
                  <label key={category} className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={filters.categories.includes(category)}
                      onChange={() => toggleFilter('categories', category)}
                      className="w-4 h-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                    />
                    <span className="text-sm group-hover:text-blue-500 transition-colors">
                      {category}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Authors */}
            <div className="mb-6">
              <span className="text-sm font-medium mb-2 block">Tác giả</span>
              <div className="space-y-2">
                {authors.map((author) => (
                  <label key={author} className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={filters.authors.includes(author)}
                      onChange={() => toggleFilter('authors', author)}
                      className="w-4 h-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                    />
                    <span className="text-sm group-hover:text-blue-500 transition-colors">
                      {author}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div className="mb-6">
              <span className="text-sm font-medium mb-2 block">Thẻ</span>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => toggleFilter('tags', tag)}
                    className={`px-3 py-1 rounded-lg text-sm transition-all ${
                      filters.tags.includes(tag)
                        ? 'bg-blue-500 text-white shadow-lg'
                        : 'bg-secondary hover:bg-muted'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Date Range */}
            <div className="mb-6">
              <span className="text-sm font-medium mb-2 block">Thời gian</span>
              <select
                value={filters.dateRange}
                onChange={(e) => setFilters({ ...filters, dateRange: e.target.value })}
                className="w-full px-3 py-2 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm"
              >
                {dateRanges.map((range) => (
                  <option key={range.value} value={range.value}>
                    {range.label}
                  </option>
                ))}
              </select>
              {filters.dateRange === 'custom' && (
                <div className="mt-3 space-y-2">
                  <input
                    type="date"
                    value={filters.customDateFrom}
                    onChange={(e) => setFilters({ ...filters, customDateFrom: e.target.value })}
                    className="w-full px-3 py-2 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm"
                    placeholder="Từ ngày"
                  />
                  <input
                    type="date"
                    value={filters.customDateTo}
                    onChange={(e) => setFilters({ ...filters, customDateTo: e.target.value })}
                    className="w-full px-3 py-2 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm"
                    placeholder="Đến ngày"
                  />
                </div>
              )}
            </div>

            {/* Metrics Filters */}
            <div className="mb-6">
              <span className="text-sm font-medium mb-2 block">Chỉ số</span>
              <div className="space-y-2">
                <div>
                  <label className="text-xs text-muted-foreground block mb-1">
                    Lượt xem tối thiểu
                  </label>
                  <input
                    type="number"
                    value={filters.minViews}
                    onChange={(e) => setFilters({ ...filters, minViews: e.target.value })}
                    placeholder="VD: 1000"
                    className="w-full px-3 py-2 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground block mb-1">
                    Bình luận tối thiểu
                  </label>
                  <input
                    type="number"
                    value={filters.minComments}
                    onChange={(e) => setFilters({ ...filters, minComments: e.target.value })}
                    placeholder="VD: 10"
                    className="w-full px-3 py-2 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Featured Only */}
            <div className="mb-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.featured}
                  onChange={(e) => setFilters({ ...filters, featured: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                />
                <Star className="w-4 h-4 text-yellow-500" />
                <span className="text-sm">Chỉ bài viết nổi bật</span>
              </label>
            </div>
          </Card>
        </div>

        {/* Search Results */}
        <div className="lg:col-span-3 space-y-4">
          {/* Search Bar */}
          <Card className="p-4">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder={t('placeholders.searchAdvanced')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-base"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              <button className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors flex items-center gap-2 font-medium">
                <Search className="w-5 h-5" />
                Tìm kiếm
              </button>
            </div>
          </Card>

          {/* Active Filters */}
          {activeFilterCount > 0 && (
            <Card className="p-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm text-muted-foreground">Đang lọc:</span>
                {filters.types.map((type) => (
                  <span
                    key={type}
                    className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg text-sm flex items-center gap-1"
                  >
                    {articleTypes.find(t => t.value === type)?.label}
                    <button
                      onClick={() => toggleFilter('types', type)}
                      className="hover:bg-blue-200 dark:hover:bg-blue-800 rounded p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                {filters.statuses.map((status) => (
                  <span
                    key={status}
                    className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg text-sm flex items-center gap-1"
                  >
                    {statuses.find(s => s.value === status)?.label}
                    <button
                      onClick={() => toggleFilter('statuses', status)}
                      className="hover:bg-green-200 dark:hover:bg-green-800 rounded p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                {filters.categories.map((category) => (
                  <span
                    key={category}
                    className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg text-sm flex items-center gap-1"
                  >
                    {category}
                    <button
                      onClick={() => toggleFilter('categories', category)}
                      className="hover:bg-purple-200 dark:hover:bg-purple-800 rounded p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </Card>
          )}

          {/* Results Header */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-lg">Kết quả tìm kiếm</h3>
              <p className="text-sm text-muted-foreground">
                Tìm thấy {searchResults.length} bài viết
              </p>
            </div>
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
              className="px-4 py-2 bg-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Results */}
          <ArticleListView
            articles={searchResults}
            onNavigate={onNavigate}
            showCategory={true}
            showTypeFilter={false}
            showStatusFilter={false}
            showBulkActions={false}
            showSearch={false}
            viewModeToggle={true}
            emptyMessage="Không tìm thấy bài viết nào phù hợp với bộ lọc"
            emptyIcon={Search}
          />
        </div>
      </div>
    </PageWrapper>
  );
}