import React, { useState, useRef } from 'react';
import { useFetch, useMutate } from '@longvhv/query';
import { useNotifications } from '@longvhv/notifications';
import { useMarqueeSelection } from '../../../hooks/useMarqueeSelection';
import { 
  FolderOpen,
  File,
  FileText,
  FileImage,
  FileVideo,
  FileAudio,
  FileCog,
  Download,
  Upload,
  Trash2,
  Edit,
  Copy,
  Move,
  Star,
  Share2,
  Eye,
  Grid,
  List,
  Search,
  Filter,
  ArrowUp,
  MoreVertical,
  Plus,
  FolderPlus,
  ChevronRight,
  Home,
  ArrowLeft,
  Check,
  X
} from 'lucide-react';
import { format } from 'date-fns';

interface FileItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  fileType?: 'image' | 'video' | 'audio' | 'document' | 'other';
  size?: number;
  url?: string;
  thumbnail?: string;
  mimeType?: string;
  folderId: string | null;
  isStarred: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: {
    id: string;
    name: string;
  };
}

interface Folder {
  id: string;
  name: string;
  parentId: string | null;
  itemCount: number;
  createdAt: string;
}

type ViewMode = 'grid' | 'list';
type SortBy = 'name' | 'date' | 'size' | 'type';

export const AdvancedFileManager: React.FC = () => {
  const notifications = useNotifications();
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<SortBy>('name');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showCreateFolderModal, setShowCreateFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  // Refs for marquee selection
  const gridContainerRef = useRef<HTMLDivElement>(null);
  const listContainerRef = useRef<HTMLDivElement>(null);

  // Marquee selection for grid view
  const gridMarquee = useMarqueeSelection({
    containerRef: gridContainerRef,
    itemSelector: '[data-item-id]',
    onSelectionChange: (newSelection) => {
      setSelectedItems(newSelection);
    },
    isEnabled: viewMode === 'grid',
  });

  // Marquee selection for list view
  const listMarquee = useMarqueeSelection({
    containerRef: listContainerRef,
    itemSelector: '[data-item-id]',
    onSelectionChange: (newSelection) => {
      setSelectedItems(newSelection);
    },
    isEnabled: viewMode === 'list',
  });

  // Get current marquee based on view mode
  const currentMarquee = viewMode === 'grid' ? gridMarquee : listMarquee;

  // Fetch files
  const { data: files, isLoading: filesLoading, refetch: refetchFiles } = useFetch<FileItem[]>(
    ['files', currentFolderId],
    async () => {
      // Mock data
      return [
        {
          id: '1',
          name: 'company-logo.png',
          type: 'file',
          fileType: 'image',
          size: 245678,
          url: 'https://via.placeholder.com/400x300/3B82F6/FFFFFF?text=Logo',
          thumbnail: 'https://via.placeholder.com/150x150/3B82F6/FFFFFF?text=Logo',
          mimeType: 'image/png',
          folderId: currentFolderId,
          isStarred: true,
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          createdBy: { id: '1', name: 'John Doe' },
        },
        {
          id: '2',
          name: 'presentation.pdf',
          type: 'file',
          fileType: 'document',
          size: 1245678,
          url: '/files/presentation.pdf',
          mimeType: 'application/pdf',
          folderId: currentFolderId,
          isStarred: false,
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          createdBy: { id: '2', name: 'Jane Smith' },
        },
        {
          id: '3',
          name: 'intro-video.mp4',
          type: 'file',
          fileType: 'video',
          size: 15245678,
          url: '/files/intro-video.mp4',
          thumbnail: 'https://via.placeholder.com/150x150/8B5CF6/FFFFFF?text=Video',
          mimeType: 'video/mp4',
          folderId: currentFolderId,
          isStarred: true,
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
          createdBy: { id: '1', name: 'John Doe' },
        },
        {
          id: 'f1',
          name: 'Images',
          type: 'folder',
          folderId: currentFolderId,
          isStarred: false,
          createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
          createdBy: { id: '1', name: 'John Doe' },
        },
        {
          id: 'f2',
          name: 'Documents',
          type: 'folder',
          folderId: currentFolderId,
          isStarred: true,
          createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          createdBy: { id: '2', name: 'Jane Smith' },
        },
      ];
    }
  );

  // Fetch folders (breadcrumb)
  const { data: folders } = useFetch<Folder[]>(
    ['folders'],
    async () => {
      return [
        { id: 'f1', name: 'Images', parentId: null, itemCount: 45, createdAt: new Date().toISOString() },
        { id: 'f2', name: 'Documents', parentId: null, itemCount: 23, createdAt: new Date().toISOString() },
      ];
    }
  );

  // Upload mutation
  const { mutate: uploadFiles, isPending: isUploading } = useMutate(
    async (files: FileList) => {
      await new Promise(resolve => setTimeout(resolve, 2000));
      return { success: true };
    },
    {
      onSuccess: () => {
        notifications.success('Files uploaded successfully');
        setShowUploadModal(false);
        refetchFiles();
      },
    }
  );

  // Create folder mutation
  const { mutate: createFolder, isPending: isCreatingFolder } = useMutate(
    async (name: string) => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { success: true };
    },
    {
      onSuccess: () => {
        notifications.success('Folder created');
        setShowCreateFolderModal(false);
        setNewFolderName('');
        refetchFiles();
      },
    }
  );

  // Delete mutation
  const { mutate: deleteItems } = useMutate(
    async (ids: string[]) => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { success: true };
    },
    {
      onSuccess: () => {
        notifications.success('Items deleted');
        setSelectedItems(new Set());
        refetchFiles();
      },
    }
  );

  // Toggle star
  const { mutate: toggleStar } = useMutate(
    async (id: string) => {
      await new Promise(resolve => setTimeout(resolve, 300));
      return { success: true };
    },
    {
      onSuccess: () => {
        refetchFiles();
      },
    }
  );

  const formatFileSize = (bytes?: number): string => {
    if (!bytes) return '-';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getFileIcon = (item: FileItem) => {
    if (item.type === 'folder') return <FolderOpen className="w-6 h-6 text-yellow-500" />;
    
    switch (item.fileType) {
      case 'image': return <FileImage className="w-6 h-6 text-blue-500" />;
      case 'video': return <FileVideo className="w-6 h-6 text-purple-500" />;
      case 'audio': return <FileAudio className="w-6 h-6 text-green-500" />;
      case 'document': return <FileText className="w-6 h-6 text-red-500" />;
      default: return <File className="w-6 h-6 text-gray-500" />;
    }
  };

  const toggleSelectItem = (id: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedItems(newSelected);
    currentMarquee.updateSelection(newSelected);
  };

  const selectAll = () => {
    if (selectedItems.size === files?.length) {
      setSelectedItems(new Set());
      currentMarquee.updateSelection(new Set());
    } else {
      const allIds = new Set(files?.map(f => f.id) || []);
      setSelectedItems(allIds);
      currentMarquee.updateSelection(allIds);
    }
  };

  // Filter and sort files
  const filteredFiles = files?.filter(file => 
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'date':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'size':
        return (b.size || 0) - (a.size || 0);
      case 'type':
        return (a.type + (a.fileType || '')).localeCompare(b.type + (b.fileType || ''));
      default:
        return 0;
    }
  });

  if (filesLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            File Manager
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your files and folders
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setShowCreateFolderModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl transition-colors"
          >
            <FolderPlus className="w-5 h-5" />
            New Folder
          </button>
          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg"
          >
            <Upload className="w-5 h-5" />
            Upload Files
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Files', value: files?.filter(f => f.type === 'file').length || 0, icon: '📁' },
          { label: 'Folders', value: files?.filter(f => f.type === 'folder').length || 0, icon: '📂' },
          { label: 'Storage Used', value: '2.4 GB / 10 GB', icon: '💾' },
          { label: 'Starred', value: files?.filter(f => f.isStarred).length || 0, icon: '⭐' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{stat.label}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
              <div className="text-3xl">{stat.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex flex-wrap items-center gap-4">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm">
            <button
              onClick={() => setCurrentFolderId(null)}
              className="flex items-center gap-1 px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
            >
              <Home className="w-4 h-4" />
              Home
            </button>
            {currentFolderId && (
              <>
                <ChevronRight className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600 dark:text-gray-400">Current Folder</span>
              </>
            )}
          </div>

          <div className="flex-1" />

          {/* Search */}
          <div className="flex-1 min-w-[250px] max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search files..."
                className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortBy)}
            className="px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="name">Name</option>
            <option value="date">Date</option>
            <option value="size">Size</option>
            <option value="type">Type</option>
          </select>

          {/* View Mode */}
          <div className="flex items-center gap-1 p-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-gray-800 shadow'
                  : 'hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded transition-colors ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-gray-800 shadow'
                  : 'hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedItems.size > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {selectedItems.size} item(s) selected
              </span>
              <button
                onClick={() => {
                  if (confirm('Download selected items?')) {
                    notifications.info('Download started');
                  }
                }}
                className="px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg text-sm hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
              >
                <Download className="w-4 h-4 inline mr-1" />
                Download
              </button>
              <button
                onClick={() => {
                  if (confirm('Delete selected items?')) {
                    deleteItems(Array.from(selectedItems));
                  }
                }}
                className="px-3 py-1.5 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg text-sm hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
              >
                <Trash2 className="w-4 h-4 inline mr-1" />
                Delete
              </button>
              <button
                onClick={() => setSelectedItems(new Set())}
                className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Clear
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Files Grid/List */}
      {viewMode === 'grid' ? (
        <div 
          ref={gridContainerRef}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 relative select-none"
          onMouseDown={gridMarquee.handleMouseDown}
        >
          {gridMarquee.renderSelectionBox()}
          {filteredFiles?.map((item) => (
            <div
              key={item.id}
              data-item-id={item.id}
              className={`group relative bg-white dark:bg-gray-800 rounded-xl border-2 transition-all cursor-pointer ${\n                selectedItems.has(item.id)\n                  ? 'border-blue-500 shadow-lg'\n                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md'\n              }`}
              onClick={() => {
                if (item.type === 'folder') {
                  setCurrentFolderId(item.id);
                }
              }}
            >
              {/* Checkbox */}
              <div className="absolute top-2 left-2 z-10">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSelectItem(item.id);
                  }}
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                    selectedItems.has(item.id)
                      ? 'bg-blue-600 border-blue-600'
                      : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 opacity-0 group-hover:opacity-100'
                  }`}
                >
                  {selectedItems.has(item.id) && <Check className="w-3 h-3 text-white" />}
                </button>
              </div>

              {/* Star */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleStar(item.id);
                }}
                className="absolute top-2 right-2 z-10 p-1.5 rounded-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Star className={`w-4 h-4 ${item.isStarred ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`} />
              </button>

              {/* Thumbnail/Icon */}
              <div className="aspect-square p-6 flex items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-t-xl">
                {item.type === 'file' && item.thumbnail ? (
                  <img src={item.thumbnail} alt={item.name} className="max-w-full max-h-full object-contain" />
                ) : (
                  getFileIcon(item)
                )}
              </div>

              {/* Info */}
              <div className="p-3 border-t border-gray-200 dark:border-gray-700">
                <p className="font-medium text-sm truncate mb-1" title={item.name}>
                  {item.name}
                </p>
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>{item.type === 'folder' ? 'Folder' : formatFileSize(item.size)}</span>
                  <span>{format(new Date(item.createdAt), 'MMM dd')}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-1.5 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div 
          ref={listContainerRef}
          className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden relative select-none"
          onMouseDown={listMarquee.handleMouseDown}
        >
          {listMarquee.renderSelectionBox()}
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedItems.size === files?.length && files.length > 0}
                    onChange={selectAll}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium">Name</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Size</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Modified</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Owner</th>
                <th className="px-4 py-3 text-right text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredFiles?.map((item) => (
                <tr
                  key={item.id}
                  data-item-id={item.id}
                  className={`hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${\n                    selectedItems.has(item.id) ? 'bg-blue-50 dark:bg-blue-900/20' : ''\n                  }`}
                >
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedItems.has(item.id)}
                      onChange={() => toggleSelectItem(item.id)}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {getFileIcon(item)}
                      <div>
                        <p className="font-medium text-sm">{item.name}</p>
                        {item.fileType && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{item.fileType}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">{formatFileSize(item.size)}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                    {format(new Date(item.updatedAt), 'MMM dd, yyyy')}
                  </td>
                  <td className="px-4 py-3 text-sm">{item.createdBy.name}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => toggleStar(item.id)}
                        className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-600 rounded transition-colors"
                      >
                        <Star className={`w-4 h-4 ${item.isStarred ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`} />
                      </button>
                      {item.type === 'file' && (
                        <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-600 rounded transition-colors">
                          <Download className="w-4 h-4" />
                        </button>
                      )}
                      <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-600 rounded transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Empty State */}
      {filteredFiles?.length === 0 && (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <FolderOpen className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
          <p className="text-gray-600 dark:text-gray-400 mb-4">No files found</p>
          <button
            onClick={() => setShowUploadModal(true)}
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            Upload your first file
          </button>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6">
            <h3 className="text-xl font-bold mb-4">Upload Files</h3>
            
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center">
              <Upload className="w-12 h-12 mx-auto text-gray-400 mb-3" />
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Drag and drop files here, or click to browse
              </p>
              <input
                type="file"
                multiple
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    uploadFiles(e.target.files);
                  }
                }}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors mt-2"
              >
                Choose Files
              </label>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowUploadModal(false)}
                className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Folder Modal */}
      {showCreateFolderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6">
            <h3 className="text-xl font-bold mb-4">Create New Folder</h3>
            
            <input
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="Folder name"
              className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 mb-4"
              autoFocus
            />

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowCreateFolderModal(false);
                  setNewFolderName('');
                }}
                className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (newFolderName.trim()) {
                    createFolder(newFolderName);
                  }
                }}
                disabled={!newFolderName.trim() || isCreatingFolder}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {isCreatingFolder ? 'Creating...' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};