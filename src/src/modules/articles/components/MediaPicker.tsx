import React, { useState } from 'react';
import { useFetch } from '@longvhv/query';
import { X, Upload, Search, Image, Video, File, Check } from 'lucide-react';
import { Media } from '@/types/article';

interface MediaPickerProps {
  onSelect: (url: string) => void;
  onClose: () => void;
  type?: 'image' | 'video' | 'all';
}

/**
 * Media Picker Modal
 * Browse and select media from library or upload new
 */
export const MediaPicker: React.FC<MediaPickerProps> = ({
  onSelect,
  onClose,
  type = 'image',
}) => {
  const [selectedUrl, setSelectedUrl] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'library' | 'upload'>('library');

  // Fetch media library
  const { data: mediaItems, isLoading } = useFetch<Media[]>('media', async () => {
    // Mock media items
    return [
      {
        id: '1',
        url: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
        type: 'image',
        title: 'React Development',
        size: 245600,
        mimeType: 'image/jpeg',
        width: 1920,
        height: 1080,
      },
      {
        id: '2',
        url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800',
        type: 'image',
        title: 'Technology Background',
        size: 312400,
        mimeType: 'image/jpeg',
        width: 1920,
        height: 1080,
      },
      {
        id: '3',
        url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800',
        type: 'image',
        title: 'Team Collaboration',
        size: 198700,
        mimeType: 'image/jpeg',
        width: 1920,
        height: 1080,
      },
      {
        id: '4',
        url: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800',
        type: 'image',
        title: 'Laptop Workspace',
        size: 267800,
        mimeType: 'image/jpeg',
        width: 1920,
        height: 1080,
      },
      {
        id: '5',
        url: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800',
        type: 'image',
        title: 'Code Editor',
        size: 223400,
        mimeType: 'image/jpeg',
        width: 1920,
        height: 1080,
      },
      {
        id: '6',
        url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800',
        type: 'image',
        title: 'Programming Setup',
        size: 289100,
        mimeType: 'image/jpeg',
        width: 1920,
        height: 1080,
      },
    ];
  });

  // Filter media based on search
  const filteredMedia = mediaItems?.filter(
    (item) =>
      (type === 'all' || item.type === type) &&
      (searchTerm === '' || item.title?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Handle select
  const handleSelect = () => {
    if (selectedUrl) {
      onSelect(selectedUrl);
    }
  };

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-6xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-2xl font-bold">Media Library</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Select or upload media files
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('library')}
            className={`flex-1 px-6 py-3 font-medium transition-colors ${
              activeTab === 'library'
                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-b-2 border-blue-600'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            📚 Library
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            className={`flex-1 px-6 py-3 font-medium transition-colors ${
              activeTab === 'upload'
                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-b-2 border-blue-600'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            ⬆️ Upload
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {activeTab === 'library' && (
            <>
              {/* Search */}
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search media..."
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all"
                  />
                </div>
              </div>

              {/* Media Grid */}
              <div className="p-6 overflow-y-auto max-h-96">
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filteredMedia?.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => setSelectedUrl(item.url)}
                        className={`relative group cursor-pointer rounded-xl overflow-hidden border-2 transition-all ${
                          selectedUrl === item.url
                            ? 'border-blue-500 ring-2 ring-blue-500/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
                        }`}
                      >
                        {/* Image */}
                        <div className="aspect-video bg-gray-100 dark:bg-gray-900">
                          {item.type === 'image' ? (
                            <img
                              src={item.url}
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                          ) : item.type === 'video' ? (
                            <div className="w-full h-full flex items-center justify-center">
                              <Video className="w-12 h-12 text-gray-400" />
                            </div>
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <File className="w-12 h-12 text-gray-400" />
                            </div>
                          )}
                        </div>

                        {/* Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="absolute bottom-0 left-0 right-0 p-3">
                            <p className="text-white text-sm font-medium truncate">
                              {item.title}
                            </p>
                            <p className="text-white/80 text-xs">
                              {item.width}×{item.height} • {formatFileSize(item.size)}
                            </p>
                          </div>
                        </div>

                        {/* Selected indicator */}
                        {selectedUrl === item.url && (
                          <div className="absolute top-2 right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                            <Check className="w-5 h-5 text-white" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {!isLoading && filteredMedia?.length === 0 && (
                  <div className="text-center py-12">
                    <Image className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">No media found</p>
                  </div>
                )}
              </div>
            </>
          )}

          {activeTab === 'upload' && (
            <div className="p-6">
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl p-12 text-center">
                <Upload className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Upload Media</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Drag and drop files here, or click to browse
                </p>
                <button
                  type="button"
                  className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                >
                  Choose Files
                </button>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
                  Supported formats: JPG, PNG, GIF, WebP (max 10MB)
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {selectedUrl ? '1 item selected' : 'Select an item'}
          </p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSelect}
              disabled={!selectedUrl}
              className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Select
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
