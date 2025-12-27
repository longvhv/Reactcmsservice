import React, { useState, useRef, useEffect } from 'react';
import { useFetch } from '@longvhv/query';
import { X, Plus, Hash } from 'lucide-react';
import { Tag } from '@/types/article';

interface TagInputProps {
  selectedIds: string[];
  onChange: (ids: string[]) => void;
}

/**
 * Tag Input Component
 * Autocomplete input with tag suggestions
 */
export const TagInput: React.FC<TagInputProps> = ({ selectedIds, onChange }) => {
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fetch all available tags
  const { data: allTags } = useFetch<Tag[]>('tags', async () => {
    // Mock tags
    return [
      { id: '1', name: 'React', slug: 'react' },
      { id: '2', name: 'TypeScript', slug: 'typescript' },
      { id: '3', name: 'JavaScript', slug: 'javascript' },
      { id: '4', name: 'Node.js', slug: 'nodejs' },
      { id: '5', name: 'Next.js', slug: 'nextjs' },
      { id: '6', name: 'Vue.js', slug: 'vuejs' },
      { id: '7', name: 'Angular', slug: 'angular' },
      { id: '8', name: 'Tailwind CSS', slug: 'tailwind' },
      { id: '9', name: 'MongoDB', slug: 'mongodb' },
      { id: '10', name: 'PostgreSQL', slug: 'postgresql' },
      { id: '11', name: 'Docker', slug: 'docker' },
      { id: '12', name: 'Kubernetes', slug: 'kubernetes' },
      { id: '13', name: 'AWS', slug: 'aws' },
      { id: '14', name: 'Azure', slug: 'azure' },
      { id: '15', name: 'GraphQL', slug: 'graphql' },
    ];
  });

  // Get selected tags
  const selectedTags = allTags?.filter((tag) => selectedIds.includes(tag.id)) || [];

  // Filter suggestions based on input
  const suggestions = allTags?.filter(
    (tag) =>
      !selectedIds.includes(tag.id) &&
      tag.name.toLowerCase().includes(inputValue.toLowerCase())
  ) || [];

  // Add tag
  const addTag = (tagId: string) => {
    onChange([...selectedIds, tagId]);
    setInputValue('');
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  // Remove tag
  const removeTag = (tagId: string) => {
    onChange(selectedIds.filter((id) => id !== tagId));
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setShowSuggestions(value.length > 0);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      
      // If there's a matching suggestion, add it
      if (suggestions.length > 0) {
        addTag(suggestions[0].id);
      } else {
        // Create new tag (in production, this would call an API)
        const newTag: Tag = {
          id: `new-${Date.now()}`,
          name: inputValue.trim(),
          slug: inputValue.toLowerCase().replace(/\s+/g, '-'),
        };
        
        // For now, just show that we'd create it
        console.log('Would create new tag:', newTag);
        setInputValue('');
      }
    } else if (e.key === 'Backspace' && !inputValue && selectedTags.length > 0) {
      // Remove last tag on backspace when input is empty
      removeTag(selectedTags[selectedTags.length - 1].id);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      {/* Tag container */}
      <div className="flex flex-wrap gap-2 p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
        {/* Selected tags */}
        {selectedTags.map((tag) => (
          <span
            key={tag.id}
            className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm font-medium"
          >
            <Hash className="w-3 h-3" />
            {tag.name}
            <button
              type="button"
              onClick={() => removeTag(tag.id)}
              className="ml-1 hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full p-0.5 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}

        {/* Input */}
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => inputValue && setShowSuggestions(true)}
          placeholder={selectedTags.length === 0 ? 'Add tags...' : ''}
          className="flex-1 min-w-[120px] bg-transparent border-none focus:outline-none text-sm"
        />
      </div>

      {/* Suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-10 mt-2 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl max-h-60 overflow-y-auto">
          {suggestions.map((tag) => (
            <button
              key={tag.id}
              type="button"
              onClick={() => addTag(tag.id)}
              className="w-full flex items-center gap-2 px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <Hash className="w-4 h-4 text-gray-400" />
              <span className="text-sm">{tag.name}</span>
            </button>
          ))}
        </div>
      )}

      {/* Create new tag hint */}
      {showSuggestions && inputValue && suggestions.length === 0 && (
        <div className="absolute z-10 mt-2 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl p-4">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Plus className="w-4 h-4" />
            <span>
              Press <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs font-mono">Enter</kbd> to create "<strong>{inputValue}</strong>"
            </span>
          </div>
        </div>
      )}

      {/* Helper text */}
      <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
        Type to search or create new tags. Press Enter to add.
      </p>
    </div>
  );
};
