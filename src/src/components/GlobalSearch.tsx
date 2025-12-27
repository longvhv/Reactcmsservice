import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFetch } from '@longvhv/query';
import { useTranslation } from '@longvhv/i18n';
import { 
  Search, 
  Clock, 
  TrendingUp, 
  FileText, 
  Image, 
  Users, 
  Settings,
  Hash,
  Folder,
  X,
  Command,
  ArrowRight
} from 'lucide-react';

interface GlobalSearchProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const GlobalSearch: React.FC<GlobalSearchProps> = ({ isOpen: controlledIsOpen, onClose }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Use controlled or internal state
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;
  const setIsOpen = controlledIsOpen !== undefined ? (value: boolean) => {
    if (!value && onClose) onClose();
  } : setInternalIsOpen;

  // Recent searches from localStorage
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    const stored = localStorage.getItem('vhv_recent_searches');
    return stored ? JSON.parse(stored) : [];
  });

  // Fetch search results
  const { data: searchResults, isLoading } = useFetch<SearchResult[]>(
    ['search', searchTerm],
    async () => {
      if (!searchTerm) return [];
      
      // Mock search results
      await new Promise(resolve => setTimeout(resolve, 300));
      
      return [
        {
          id: '1',
          type: 'article',
          title: 'Introduction to React Hooks',
          subtitle: 'Learn about useState, useEffect, and custom hooks',
          url: '/articles/1',
          icon: <FileText className="w-4 h-4" />,
          metadata: 'Published • 2 days ago',
        },
        {
          id: '2',
          type: 'article',
          title: 'Building Scalable APIs with Node.js',
          subtitle: 'Best practices for API design and architecture',
          url: '/articles/2',
          icon: <FileText className="w-4 h-4" />,
          metadata: 'Draft • 5 days ago',
        },
        {
          id: '3',
          type: 'user',
          title: 'John Doe',
          subtitle: 'admin@example.com',
          url: '/users/1',
          icon: <Users className="w-4 h-4" />,
          metadata: 'Admin',
        },
        {
          id: '4',
          type: 'category',
          title: 'Technology',
          subtitle: '15 articles',
          url: '/articles?category=tech',
          icon: <Folder className="w-4 h-4" />,
          metadata: 'Category',
        },
        {
          id: '5',
          type: 'tag',
          title: 'React',
          subtitle: '23 articles',
          url: '/articles?tag=react',
          icon: <Hash className="w-4 h-4" />,
          metadata: 'Tag',
        },
      ].filter(item => 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.subtitle?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    },
    {
      enabled: searchTerm.length > 0,
    }
  );

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+K or Ctrl+K to open
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
        setTimeout(() => inputRef.current?.focus(), 100);
      }

      // ESC to close
      if (e.key === 'Escape') {
        setIsOpen(false);
        setSearchTerm('');
      }

      // Arrow navigation when open
      if (isOpen && searchResults && searchResults.length > 0) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setSelectedIndex(prev => 
            prev < searchResults.length - 1 ? prev + 1 : prev
          );
        }
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          setSelectedIndex(prev => prev > 0 ? prev - 1 : prev);
        }
        if (e.key === 'Enter') {
          e.preventDefault();
          handleSelect(searchResults[selectedIndex]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, searchResults, selectedIndex]);

  // Reset selected index when search changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [searchTerm]);

  // Handle result selection
  const handleSelect = (result: SearchResult) => {
    // Add to recent searches
    const newRecent = [searchTerm, ...recentSearches.filter(s => s !== searchTerm)].slice(0, 5);
    setRecentSearches(newRecent);
    localStorage.setItem('vhv_recent_searches', JSON.stringify(newRecent));

    // Navigate
    navigate(result.url);
    
    // Close search
    setIsOpen(false);
    setSearchTerm('');
  };

  // Clear recent searches
  const clearRecent = () => {
    setRecentSearches([]);
    localStorage.removeItem('vhv_recent_searches');
  };

  // Get icon for result type
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'article': return <FileText className="w-4 h-4 text-blue-500" />;
      case 'media': return <Image className="w-4 h-4 text-purple-500" />;
      case 'user': return <Users className="w-4 h-4 text-green-500" />;
      case 'category': return <Folder className="w-4 h-4 text-orange-500" />;
      case 'tag': return <Hash className="w-4 h-4 text-pink-500" />;
      default: return <Search className="w-4 h-4 text-gray-500" />;
    }
  };

  // Popular searches
  const popularSearches = [
    'React hooks',
    'TypeScript tutorial',
    'API design',
    'Database optimization',
    'Security best practices',
  ];

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-top-4 duration-200">
        {/* Search Input */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search articles, users, media..."
            className="flex-1 bg-transparent border-none focus:outline-none text-lg"
            autoFocus
          />
          <div className="flex items-center gap-2">
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs font-mono">
              ESC
            </kbd>
          </div>
        </div>

        {/* Results */}
        <div className="max-h-96 overflow-y-auto">
          {/* Loading */}
          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          )}

          {/* Search Results */}
          {!isLoading && searchResults && searchResults.length > 0 && (
            <div className="py-2">
              <div className="px-4 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                Results
              </div>
              {searchResults.map((result, index) => (
                <button
                  key={result.id}
                  onClick={() => handleSelect(result)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`w-full flex items-center gap-3 px-6 py-3 transition-colors ${
                    index === selectedIndex
                      ? 'bg-blue-50 dark:bg-blue-900/20'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-900/50'
                  }`}
                >
                  <div className="flex-shrink-0">
                    {result.icon || getTypeIcon(result.type)}
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <div className="font-medium truncate">{result.title}</div>
                    {result.subtitle && (
                      <div className="text-sm text-gray-600 dark:text-gray-400 truncate">
                        {result.subtitle}
                      </div>
                    )}
                  </div>
                  {result.metadata && (
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {result.metadata}
                    </div>
                  )}
                  {index === selectedIndex && (
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                  )}
                </button>
              ))}
            </div>
          )}

          {/* No Results */}
          {!isLoading && searchTerm && searchResults?.length === 0 && (
            <div className="text-center py-12">
              <Search className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
              <p className="text-gray-600 dark:text-gray-400">No results found</p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                Try different keywords
              </p>
            </div>
          )}

          {/* Recent & Popular */}
          {!searchTerm && (
            <div className="py-2">
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center justify-between px-4 py-2">
                    <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      Recent Searches
                    </div>
                    <button
                      onClick={clearRecent}
                      className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Clear
                    </button>
                  </div>
                  {recentSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => setSearchTerm(search)}
                      className="w-full flex items-center gap-3 px-6 py-2 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
                    >
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="flex-1 text-left">{search}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Popular Searches */}
              <div>
                <div className="px-4 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Popular Searches
                </div>
                {popularSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => setSearchTerm(search)}
                    className="w-full flex items-center gap-3 px-6 py-2 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
                  >
                    <TrendingUp className="w-4 h-4 text-gray-400" />
                    <span className="flex-1 text-left">{search}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <kbd className="px-2 py-1 bg-white dark:bg-gray-800 rounded font-mono">↑</kbd>
              <kbd className="px-2 py-1 bg-white dark:bg-gray-800 rounded font-mono">↓</kbd>
              <span>Navigate</span>
            </div>
            <div className="flex items-center gap-1">
              <kbd className="px-2 py-1 bg-white dark:bg-gray-800 rounded font-mono">↵</kbd>
              <span>Select</span>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
            <Command className="w-3 h-3" />
            <kbd className="px-2 py-1 bg-white dark:bg-gray-800 rounded font-mono">K</kbd>
            <span>to open</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Global Search Button Component
export const GlobalSearchButton: React.FC = () => {
  const [, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
      >
        <Search className="w-4 h-4 text-gray-600 dark:text-gray-400" />
        <span className="text-sm text-gray-600 dark:text-gray-400">Search...</span>
        <kbd className="ml-auto px-2 py-0.5 bg-white dark:bg-gray-800 rounded text-xs font-mono">
          ⌘K
        </kbd>
      </button>
    </>
  );
};