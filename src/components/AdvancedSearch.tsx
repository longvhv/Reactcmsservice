import { useState } from 'react';
import { Search, Filter, X, Calendar, Tag, User, FileText, Clock, CheckCircle2, AlertCircle, ChevronDown } from 'lucide-react';
import { useDebounce } from '../hooks/useDebounce';

export interface SearchFilter {
  query: string;
  status?: 'draft' | 'published' | 'archived' | 'pending';
  category?: string;
  author?: string;
  dateFrom?: string;
  dateTo?: string;
  tags?: string[];
  articleType?: string;
}

interface AdvancedSearchProps {
  onSearch: (filters: SearchFilter) => void;
  placeholder?: string;
  showFilters?: boolean;
  categories?: Array<{ id: string; name: string }>;
  authors?: Array<{ id: string; name: string }>;
  articleTypes?: Array<{ value: string; label: string }>;
}

export function AdvancedSearch({
  onSearch,
  placeholder = 'Search articles...',
  showFilters = true,
  categories = [],
  authors = [],
  articleTypes = [],
}: AdvancedSearchProps) {
  const [query, setQuery] = useState('');
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [filters, setFilters] = useState<SearchFilter>({
    query: '',
  });

  // Debounce search query
  const debouncedQuery = useDebounce(query, 300);

  // Update search when debounced query changes
  useState(() => {
    if (debouncedQuery !== filters.query) {
      const newFilters = { ...filters, query: debouncedQuery };
      setFilters(newFilters);
      onSearch(newFilters);
    }
  });

  const handleFilterChange = (key: keyof SearchFilter, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onSearch(newFilters);
  };

  const clearFilters = () => {
    const newFilters: SearchFilter = { query };
    setFilters(newFilters);
    onSearch(newFilters);
  };

  const activeFilterCount = Object.keys(filters).filter(
    (key) => key !== 'query' && filters[key as keyof SearchFilter]
  ).length;

  return (
    <div className="space-y-3">
      {/* Search Bar */}
      <div className="flex items-center gap-3">
        {/* Search Input */}
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-background/50 border border-border/40 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
          />
          {query && (
            <button
              onClick={() => {
                setQuery('');
                handleFilterChange('query', '');
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded-lg transition-colors"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          )}
        </div>

        {/* Filter Toggle Button */}
        {showFilters && (
          <button
            onClick={() => setShowFilterPanel(!showFilterPanel)}
            className={`
              relative flex items-center gap-2 px-4 py-3 rounded-xl border transition-all
              ${showFilterPanel 
                ? 'bg-blue-500/10 border-blue-500/50 text-blue-600' 
                : 'bg-background/50 border-border/40 hover:border-blue-500/50'
              }
            `}
          >
            <Filter className="w-5 h-5" />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 text-white text-xs flex items-center justify-center font-medium">
                {activeFilterCount}
              </span>
            )}
          </button>
        )}
      </div>

      {/* Filter Panel */}
      {showFilterPanel && showFilters && (
        <div className="glass-card p-6 space-y-6 animate-slide-down">
          {/* Active Filters Summary */}
          {activeFilterCount > 0 && (
            <div className="flex items-center justify-between pb-4 border-b border-border/40">
              <span className="text-sm text-muted-foreground">
                {activeFilterCount} filter{activeFilterCount > 1 ? 's' : ''} active
              </span>
              <button
                onClick={clearFilters}
                className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
              >
                Clear all
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Status Filter */}
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Status
              </label>
              <select
                value={filters.status || ''}
                onChange={(e) => handleFilterChange('status', e.target.value || undefined)}
                className="w-full px-4 py-2.5 rounded-lg bg-background/50 border border-border/40 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
              >
                <option value="">All Status</option>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="pending">Pending Review</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            {/* Category Filter */}
            {categories.length > 0 && (
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  Category
                </label>
                <select
                  value={filters.category || ''}
                  onChange={(e) => handleFilterChange('category', e.target.value || undefined)}
                  className="w-full px-4 py-2.5 rounded-lg bg-background/50 border border-border/40 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Author Filter */}
            {authors.length > 0 && (
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Author
                </label>
                <select
                  value={filters.author || ''}
                  onChange={(e) => handleFilterChange('author', e.target.value || undefined)}
                  className="w-full px-4 py-2.5 rounded-lg bg-background/50 border border-border/40 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                >
                  <option value="">All Authors</option>
                  {authors.map((author) => (
                    <option key={author.id} value={author.id}>
                      {author.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Article Type Filter */}
            {articleTypes.length > 0 && (
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Article Type
                </label>
                <select
                  value={filters.articleType || ''}
                  onChange={(e) => handleFilterChange('articleType', e.target.value || undefined)}
                  className="w-full px-4 py-2.5 rounded-lg bg-background/50 border border-border/40 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                >
                  <option value="">All Types</option>
                  {articleTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Date From */}
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Date From
              </label>
              <input
                type="date"
                value={filters.dateFrom || ''}
                onChange={(e) => handleFilterChange('dateFrom', e.target.value || undefined)}
                className="w-full px-4 py-2.5 rounded-lg bg-background/50 border border-border/40 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
              />
            </div>

            {/* Date To */}
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Date To
              </label>
              <input
                type="date"
                value={filters.dateTo || ''}
                onChange={(e) => handleFilterChange('dateTo', e.target.value || undefined)}
                className="w-full px-4 py-2.5 rounded-lg bg-background/50 border border-border/40 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
              />
            </div>
          </div>

          {/* Active Filters Tags */}
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap gap-2 pt-4 border-t border-border/40">
              {filters.status && (
                <FilterTag
                  label={`Status: ${filters.status}`}
                  onRemove={() => handleFilterChange('status', undefined)}
                />
              )}
              {filters.category && (
                <FilterTag
                  label={`Category: ${categories.find((c) => c.id === filters.category)?.name}`}
                  onRemove={() => handleFilterChange('category', undefined)}
                />
              )}
              {filters.author && (
                <FilterTag
                  label={`Author: ${authors.find((a) => a.id === filters.author)?.name}`}
                  onRemove={() => handleFilterChange('author', undefined)}
                />
              )}
              {filters.articleType && (
                <FilterTag
                  label={`Type: ${articleTypes.find((t) => t.value === filters.articleType)?.label}`}
                  onRemove={() => handleFilterChange('articleType', undefined)}
                />
              )}
              {filters.dateFrom && (
                <FilterTag
                  label={`From: ${filters.dateFrom}`}
                  onRemove={() => handleFilterChange('dateFrom', undefined)}
                />
              )}
              {filters.dateTo && (
                <FilterTag
                  label={`To: ${filters.dateTo}`}
                  onRemove={() => handleFilterChange('dateTo', undefined)}
                />
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Filter Tag Component
function FilterTag({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-sm">
      <span className="text-blue-600">{label}</span>
      <button
        onClick={onRemove}
        className="p-0.5 hover:bg-blue-500/20 rounded transition-colors"
      >
        <X className="w-3 h-3 text-blue-600" />
      </button>
    </div>
  );
}
