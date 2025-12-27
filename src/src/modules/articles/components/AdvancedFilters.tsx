import React, { useState } from 'react';
import { 
  Filter, 
  X, 
  Calendar,
  User,
  FolderOpen,
  Hash,
  FileText,
  Eye,
  ChevronDown,
  Search,
  RotateCcw
} from 'lucide-react';

interface FilterValues {
  search: string;
  status: string[];
  category: string[];
  tags: string[];
  author: string[];
  dateRange: {
    from?: string;
    to?: string;
  };
  type: string[];
  featured: boolean | null;
}

interface AdvancedFiltersProps {
  onFilterChange: (filters: FilterValues) => void;
  onReset: () => void;
}

export const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({
  onFilterChange,
  onReset,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<FilterValues>({
    search: '',
    status: [],
    category: [],
    tags: [],
    author: [],
    dateRange: {},
    type: [],
    featured: null,
  });

  // Mock data
  const statuses = [
    { value: 'draft', label: 'Draft', color: 'gray' },
    { value: 'pending', label: 'Pending Review', color: 'yellow' },
    { value: 'published', label: 'Published', color: 'green' },
    { value: 'archived', label: 'Archived', color: 'blue' },
  ];

  const categories = [
    'Technology',
    'Business',
    'Science',
    'Health',
    'Entertainment',
    'Sports',
  ];

  const tags = [
    'React',
    'TypeScript',
    'JavaScript',
    'Node.js',
    'Tutorial',
    'Best Practices',
  ];

  const authors = [
    { id: '1', name: 'John Doe' },
    { id: '2', name: 'Jane Smith' },
    { id: '3', name: 'Mike Johnson' },
  ];

  const articleTypes = [
    'news',
    'video',
    'gallery',
    'podcast',
    'event',
    'job',
    'document',
  ];

  const updateFilter = <K extends keyof FilterValues>(
    key: K,
    value: FilterValues[K]
  ) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const toggleArrayFilter = (key: keyof FilterValues, value: string) => {
    const currentArray = filters[key] as string[];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(v => v !== value)
      : [...currentArray, value];
    updateFilter(key, newArray as any);
  };

  const handleReset = () => {
    const resetFilters: FilterValues = {
      search: '',
      status: [],
      category: [],
      tags: [],
      author: [],
      dateRange: {},
      type: [],
      featured: null,
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
    onReset();
  };

  const activeFilterCount = 
    filters.status.length +
    filters.category.length +
    filters.tags.length +
    filters.author.length +
    filters.type.length +
    (filters.dateRange.from ? 1 : 0) +
    (filters.featured !== null ? 1 : 0);

  return (
    <div className="space-y-4">
      {/* Filter Toggle Button */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
            isOpen
              ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
              : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          <Filter className="w-5 h-5" />
          <span className="font-medium">Advanced Filters</span>
          {activeFilterCount > 0 && (
            <span className="px-2 py-0.5 bg-blue-600 text-white rounded-full text-xs font-medium">
              {activeFilterCount}
            </span>
          )}
          <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {activeFilterCount > 0 && (
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Filter Panel */}
      {isOpen && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 animate-in slide-in-from-top-2 duration-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Search */}
            <div className="lg:col-span-3">
              <label className="block text-sm font-medium mb-2">
                <Search className="w-4 h-4 inline mr-2" />
                Search
              </label>
              <input
                type="search"
                value={filters.search}
                onChange={(e) => updateFilter('search', e.target.value)}
                placeholder="Search by title, content, or ID..."
                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium mb-2">
                <Eye className="w-4 h-4 inline mr-2" />
                Status
              </label>
              <div className="space-y-2">
                {statuses.map((status) => (
                  <label
                    key={status.value}
                    className="flex items-center gap-2 p-2 hover:bg-gray-50 dark:hover:bg-gray-900 rounded-lg cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={filters.status.includes(status.value)}
                      onChange={() => toggleArrayFilter('status', status.value)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500/20"
                    />
                    <span className={`flex-1 text-sm ${
                      filters.status.includes(status.value) ? 'font-medium' : ''
                    }`}>
                      {status.label}
                    </span>
                    <span className={`w-2 h-2 rounded-full bg-${status.color}-500`} />
                  </label>
                ))}
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium mb-2">
                <FolderOpen className="w-4 h-4 inline mr-2" />
                Category
              </label>
              <div className="space-y-2">
                {categories.map((category) => (
                  <label
                    key={category}
                    className="flex items-center gap-2 p-2 hover:bg-gray-50 dark:hover:bg-gray-900 rounded-lg cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={filters.category.includes(category)}
                      onChange={() => toggleArrayFilter('category', category)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500/20"
                    />
                    <span className={`flex-1 text-sm ${
                      filters.category.includes(category) ? 'font-medium' : ''
                    }`}>
                      {category}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Tags Filter */}
            <div>
              <label className="block text-sm font-medium mb-2">
                <Hash className="w-4 h-4 inline mr-2" />
                Tags
              </label>
              <div className="space-y-2">
                {tags.map((tag) => (
                  <label
                    key={tag}
                    className="flex items-center gap-2 p-2 hover:bg-gray-50 dark:hover:bg-gray-900 rounded-lg cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={filters.tags.includes(tag)}
                      onChange={() => toggleArrayFilter('tags', tag)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500/20"
                    />
                    <span className={`flex-1 text-sm ${
                      filters.tags.includes(tag) ? 'font-medium' : ''
                    }`}>
                      #{tag}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Author Filter */}
            <div>
              <label className="block text-sm font-medium mb-2">
                <User className="w-4 h-4 inline mr-2" />
                Author
              </label>
              <div className="space-y-2">
                {authors.map((author) => (
                  <label
                    key={author.id}
                    className="flex items-center gap-2 p-2 hover:bg-gray-50 dark:hover:bg-gray-900 rounded-lg cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={filters.author.includes(author.id)}
                      onChange={() => toggleArrayFilter('author', author.id)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500/20"
                    />
                    <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                      {author.name.charAt(0)}
                    </div>
                    <span className={`flex-1 text-sm ${
                      filters.author.includes(author.id) ? 'font-medium' : ''
                    }`}>
                      {author.name}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Article Type Filter */}
            <div>
              <label className="block text-sm font-medium mb-2">
                <FileText className="w-4 h-4 inline mr-2" />
                Article Type
              </label>
              <div className="space-y-2">
                {articleTypes.map((type) => (
                  <label
                    key={type}
                    className="flex items-center gap-2 p-2 hover:bg-gray-50 dark:hover:bg-gray-900 rounded-lg cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={filters.type.includes(type)}
                      onChange={() => toggleArrayFilter('type', type)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500/20"
                    />
                    <span className={`flex-1 text-sm capitalize ${
                      filters.type.includes(type) ? 'font-medium' : ''
                    }`}>
                      {type}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Date Range Filter */}
            <div>
              <label className="block text-sm font-medium mb-2">
                <Calendar className="w-4 h-4 inline mr-2" />
                Date Range
              </label>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-gray-600 dark:text-gray-400 mb-1 block">
                    From
                  </label>
                  <input
                    type="date"
                    value={filters.dateRange.from || ''}
                    onChange={(e) => updateFilter('dateRange', {
                      ...filters.dateRange,
                      from: e.target.value,
                    })}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-600 dark:text-gray-400 mb-1 block">
                    To
                  </label>
                  <input
                    type="date"
                    value={filters.dateRange.to || ''}
                    onChange={(e) => updateFilter('dateRange', {
                      ...filters.dateRange,
                      to: e.target.value,
                    })}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Featured Filter */}
            <div className="lg:col-span-3">
              <label className="block text-sm font-medium mb-2">
                Featured Articles
              </label>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="featured"
                    checked={filters.featured === null}
                    onChange={() => updateFilter('featured', null)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-sm">All</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="featured"
                    checked={filters.featured === true}
                    onChange={() => updateFilter('featured', true)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-sm">Featured Only</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="featured"
                    checked={filters.featured === false}
                    onChange={() => updateFilter('featured', false)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-sm">Not Featured</span>
                </label>
              </div>
            </div>
          </div>

          {/* Active Filters Summary */}
          {activeFilterCount > 0 && (
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium">
                  Active Filters ({activeFilterCount})
                </span>
                <button
                  onClick={handleReset}
                  className="text-sm text-red-600 dark:text-red-400 hover:underline"
                >
                  Clear All
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {filters.status.map((status) => (
                  <span
                    key={status}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm"
                  >
                    {status}
                    <button
                      onClick={() => toggleArrayFilter('status', status)}
                      className="hover:bg-blue-200 dark:hover:bg-blue-900/50 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                {filters.category.map((cat) => (
                  <span
                    key={cat}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full text-sm"
                  >
                    {cat}
                    <button
                      onClick={() => toggleArrayFilter('category', cat)}
                      className="hover:bg-purple-200 dark:hover:bg-purple-900/50 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                {filters.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full text-sm"
                  >
                    #{tag}
                    <button
                      onClick={() => toggleArrayFilter('tags', tag)}
                      className="hover:bg-green-200 dark:hover:bg-green-900/50 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
