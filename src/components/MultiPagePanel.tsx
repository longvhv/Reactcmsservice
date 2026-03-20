import { useState, useRef } from 'react';
import {
  Plus, Trash2, Copy, Eye, EyeOff, Lock, Unlock, Move, Check, X,
  ChevronUp, ChevronDown, Grid3x3, List, FileText, Image as ImageIcon,
  Layers, Star, Settings, Download, Share2, Play, Pause, RotateCw,
  ArrowLeft, ArrowRight, Maximize2, Minimize2, Edit3, Save,
  FolderOpen, File, Files, Scissors, Clipboard, MoreVertical
} from 'lucide-react';
import { motion, AnimatePresence, Reorder } from 'motion/react';

// Types
interface Page {
  id: string;
  name: string;
  thumbnail?: string;
  width: number;
  height: number;
  elements: any[];
  background: string;
  locked: boolean;
  visible: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
  metadata?: PageMetadata;
}

interface PageMetadata {
  description?: string;
  tags?: string[];
  duration?: number; // For presentations
  transition?: TransitionType;
  notes?: string;
}

type TransitionType = 'none' | 'fade' | 'slide' | 'zoom' | 'flip' | 'cube' | 'dissolve';

interface MultiPagePanelProps {
  pages: Page[];
  currentPageId: string;
  onPageSelect: (pageId: string) => void;
  onPageAdd: (page: Omit<Page, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onPageDuplicate: (pageId: string) => void;
  onPageDelete: (pageId: string) => void;
  onPageUpdate: (pageId: string, updates: Partial<Page>) => void;
  onPageReorder: (pages: Page[]) => void;
  onClose: () => void;
}

export function MultiPagePanel({
  pages,
  currentPageId,
  onPageSelect,
  onPageAdd,
  onPageDuplicate,
  onPageDelete,
  onPageUpdate,
  onPageReorder,
  onClose,
}: MultiPagePanelProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedPages, setSelectedPages] = useState<string[]>([]);
  const [isReordering, setIsReordering] = useState(false);
  const [showPageSettings, setShowPageSettings] = useState(false);
  const [editingPageId, setEditingPageId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [isPresentationMode, setIsPresentationMode] = useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const thumbnailRefs = useRef<Map<string, HTMLCanvasElement>>(new Map());

  // Filter pages
  const filteredPages = pages.filter(page => 
    page.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    page.metadata?.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    page.metadata?.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Sort pages by order
  const sortedPages = [...filteredPages].sort((a, b) => a.order - b.order);

  // Multi-select handlers
  const togglePageSelection = (pageId: string, event: React.MouseEvent) => {
    if (event.shiftKey) {
      // Range select
      const currentIndex = sortedPages.findIndex(p => p.id === currentPageId);
      const targetIndex = sortedPages.findIndex(p => p.id === pageId);
      const start = Math.min(currentIndex, targetIndex);
      const end = Math.max(currentIndex, targetIndex);
      const range = sortedPages.slice(start, end + 1).map(p => p.id);
      setSelectedPages(range);
    } else if (event.metaKey || event.ctrlKey) {
      // Multi-select
      if (selectedPages.includes(pageId)) {
        setSelectedPages(selectedPages.filter(id => id !== pageId));
      } else {
        setSelectedPages([...selectedPages, pageId]);
      }
    } else {
      // Single select
      setSelectedPages([pageId]);
      onPageSelect(pageId);
    }
  };

  // Page actions
  const handleAddPage = () => {
    const newPage: Omit<Page, 'id' | 'createdAt' | 'updatedAt'> = {
      name: `Trang ${pages.length + 1}`,
      width: 1920,
      height: 1080,
      elements: [],
      background: '#ffffff',
      locked: false,
      visible: true,
      order: pages.length,
      metadata: {
        description: '',
        tags: [],
        transition: 'fade',
      },
    };
    onPageAdd(newPage);
  };

  const handleDuplicateSelected = () => {
    selectedPages.forEach(pageId => {
      onPageDuplicate(pageId);
    });
    setSelectedPages([]);
  };

  const handleDeleteSelected = () => {
    if (selectedPages.length === 0) return;
    if (!confirm(`Xóa ${selectedPages.length} trang?`)) return;
    
    selectedPages.forEach(pageId => {
      onPageDelete(pageId);
    });
    setSelectedPages([]);
  };

  const startEditingName = (page: Page) => {
    setEditingPageId(page.id);
    setEditingName(page.name);
  };

  const savePageName = () => {
    if (editingPageId && editingName.trim()) {
      onPageUpdate(editingPageId, { name: editingName.trim() });
    }
    setEditingPageId(null);
    setEditingName('');
  };

  // Presentation mode
  const startPresentation = () => {
    setIsPresentationMode(true);
    setCurrentSlideIndex(sortedPages.findIndex(p => p.id === currentPageId));
  };

  const exitPresentation = () => {
    setIsPresentationMode(false);
  };

  const nextSlide = () => {
    if (currentSlideIndex < sortedPages.length - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1);
      onPageSelect(sortedPages[currentSlideIndex + 1].id);
    }
  };

  const prevSlide = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1);
      onPageSelect(sortedPages[currentSlideIndex - 1].id);
    }
  };

  // Generate thumbnail
  const generateThumbnail = (page: Page): string => {
    // In real implementation, would render page to canvas and get data URL
    // For now, return placeholder
    return page.thumbnail || `https://via.placeholder.com/320x180?text=Page+${page.order + 1}`;
  };

  // Render page card
  const renderPageCard = (page: Page, index: number) => {
    const isSelected = selectedPages.includes(page.id);
    const isCurrent = page.id === currentPageId;
    const isEditing = editingPageId === page.id;

    return (
      <motion.div
        key={page.id}
        layout
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className={`group relative bg-white dark:bg-gray-800 rounded-xl overflow-hidden transition-all cursor-pointer ${
          isCurrent
            ? 'ring-4 ring-blue-500 shadow-xl'
            : isSelected
            ? 'ring-2 ring-purple-500 shadow-lg'
            : 'hover:shadow-lg border-2 border-gray-200 dark:border-gray-700'
        }`}
        onClick={(e) => togglePageSelection(page.id, e)}
      >
        {/* Thumbnail */}
        <div className="relative aspect-video bg-gray-100 dark:bg-gray-900">
          <img
            src={generateThumbnail(page)}
            alt={page.name}
            className="w-full h-full object-contain"
          />
          
          {/* Overlay with actions */}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onPageSelect(page.id);
              }}
              className="p-2 bg-white/90 rounded-lg hover:bg-white transition-colors"
              title="View"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onPageDuplicate(page.id);
              }}
              className="p-2 bg-white/90 rounded-lg hover:bg-white transition-colors"
              title="Duplicate"
            >
              <Copy className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (confirm(`Delete "${page.name}"?`)) {
                  onPageDelete(page.id);
                }
              }}
              className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {/* Page number badge */}
          <div className="absolute top-2 left-2 px-2 py-1 bg-black/70 text-white text-xs font-medium rounded">
            {index + 1}
          </div>

          {/* Status badges */}
          <div className="absolute top-2 right-2 flex gap-1">
            {page.locked && (
              <div className="p-1 bg-red-500 rounded" title="Locked">
                <Lock className="w-3 h-3 text-white" />
              </div>
            )}
            {!page.visible && (
              <div className="p-1 bg-gray-500 rounded" title="Hidden">
                <EyeOff className="w-3 h-3 text-white" />
              </div>
            )}
          </div>

          {/* Current indicator */}
          {isCurrent && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500" />
          )}

          {/* Selection checkbox */}
          {isSelected && (
            <div className="absolute bottom-2 right-2 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
              <Check className="w-4 h-4 text-white" />
            </div>
          )}
        </div>

        {/* Page info */}
        <div className="p-3">
          {isEditing ? (
            <div className="flex gap-1">
              <input
                type="text"
                value={editingName}
                onChange={(e) => setEditingName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') savePageName();
                  if (e.key === 'Escape') {
                    setEditingPageId(null);
                    setEditingName('');
                  }
                }}
                className="flex-1 px-2 py-1 text-sm border border-gray-200 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
              <button
                onClick={savePageName}
                className="p-1 bg-green-500 text-white rounded hover:bg-green-600"
              >
                <Check className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  setEditingPageId(null);
                  setEditingName('');
                }}
                className="p-1 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div
              className="flex items-center justify-between"
              onDoubleClick={() => startEditingName(page)}
            >
              <h3 className="font-medium text-sm truncate flex-1">{page.name}</h3>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  startEditingName(page);
                }}
                className="p-1 opacity-0 group-hover:opacity-100 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-all"
              >
                <Edit3 className="w-3 h-3" />
              </button>
            </div>
          )}

          {page.metadata?.description && (
            <p className="text-xs text-gray-500 mt-1 truncate">
              {page.metadata.description}
            </p>
          )}

          {page.metadata?.tags && page.metadata.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {page.metadata.tags.slice(0, 3).map((tag, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-full"
                >
                  {tag}
                </span>
              ))}
              {page.metadata.tags.length > 3 && (
                <span className="text-xs text-gray-500">
                  +{page.metadata.tags.length - 3}
                </span>
              )}
            </div>
          )}

          {/* Element count */}
          <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Layers className="w-3 h-3" />
              {page.elements.length} phần tử
            </span>
            <span>
              {page.width}×{page.height}
            </span>
          </div>
        </div>
      </motion.div>
    );
  };

  // Presentation mode view
  if (isPresentationMode) {
    const currentPage = sortedPages[currentSlideIndex];
    
    return (
      <div className="fixed inset-0 bg-black z-50 flex flex-col">
        {/* Top bar */}
        <div className="bg-gray-900 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={exitPresentation}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-white text-sm transition-colors"
            >
              Thoát trình chiếu
            </button>
            <span className="text-white text-sm">
              {currentSlideIndex + 1} / {sortedPages.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={prevSlide}
              disabled={currentSlideIndex === 0}
              className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextSlide}
              disabled={currentSlideIndex === sortedPages.length - 1}
              className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Slide content */}
        <div className="flex-1 flex items-center justify-center p-8">
          <motion.div
            key={currentPage.id}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="max-w-full max-h-full"
          >
            <img
              src={generateThumbnail(currentPage)}
              alt={currentPage.name}
              className="max-w-full max-h-full object-contain shadow-2xl"
            />
          </motion.div>
        </div>

        {/* Bottom bar with thumbnails */}
        <div className="bg-gray-900 px-6 py-3">
          <div className="flex gap-2 overflow-x-auto">
            {sortedPages.map((page, index) => (
              <button
                key={page.id}
                onClick={() => {
                  setCurrentSlideIndex(index);
                  onPageSelect(page.id);
                }}
                className={`flex-shrink-0 w-32 aspect-video rounded-lg overflow-hidden transition-all ${
                  index === currentSlideIndex
                    ? 'ring-2 ring-blue-500 scale-110'
                    : 'opacity-50 hover:opacity-100'
                }`}
              >
                <img
                  src={generateThumbnail(page)}
                  alt={page.name}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Normal panel view
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-7xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <Files className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Quản lý trang</h2>
                <p className="text-sm text-white/80">
                  {pages.length} {pages.length === 1 ? 'trang' : 'trang'}
                  {selectedPages.length > 0 && ` • Đã chọn ${selectedPages.length}`}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center transition-colors backdrop-blur-sm"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search & Actions */}
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm trang..."
                className="w-full px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                title={viewMode === 'grid' ? 'Xem danh sách' : 'Xem lưới'}
              >
                {viewMode === 'grid' ? <List className="w-5 h-5" /> : <Grid3x3 className="w-5 h-5" />}
              </button>

              <button
                onClick={startPresentation}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors flex items-center gap-2"
              >
                <Play className="w-4 h-4" />
                Trình chiếu
              </button>

              <button
                onClick={handleAddPage}
                className="px-4 py-2 bg-white text-purple-600 rounded-lg hover:bg-gray-100 font-medium transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Thêm trang
              </button>
            </div>
          </div>
        </div>

        {/* Toolbar */}
        {selectedPages.length > 0 && (
          <div className="bg-purple-100 dark:bg-purple-900/30 border-b border-purple-200 dark:border-purple-800 px-6 py-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-purple-900 dark:text-purple-100">
                {selectedPages.length} {selectedPages.length === 1 ? 'trang' : 'trang'} đã chọn
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleDuplicateSelected}
                  className="px-3 py-1.5 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-sm flex items-center gap-2"
                >
                  <Copy className="w-4 h-4" />
                  Nhân bản
                </button>
                <button
                  onClick={handleDeleteSelected}
                  className="px-3 py-1.5 bg-red-500 text-white hover:bg-red-600 rounded-lg transition-colors text-sm flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Xóa
                </button>
                <button
                  onClick={() => setSelectedPages([])}
                  className="px-3 py-1.5 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg transition-colors text-sm"
                >
                  Bỏ chọn
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Pages Grid/List */}
        <div className="flex-1 overflow-y-auto p-6">
          {sortedPages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <Files className="w-16 h-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Chưa có trang nào
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Tạo trang đầu tiên để bắt đầu
              </p>
              <button
                onClick={handleAddPage}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all font-medium flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Tạo trang đầu tiên
              </button>
            </div>
          ) : (
            <AnimatePresence>
              {isReordering ? (
                <Reorder.Group
                  axis="y"
                  values={sortedPages}
                  onReorder={onPageReorder}
                  className="space-y-3"
                >
                  {sortedPages.map((page) => (
                    <Reorder.Item key={page.id} value={page}>
                      <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 cursor-grab active:cursor-grabbing">
                        <Move className="w-5 h-5 text-gray-400" />
                        <img
                          src={generateThumbnail(page)}
                          alt={page.name}
                          className="w-24 aspect-video object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h3 className="font-medium">{page.name}</h3>
                          <p className="text-sm text-gray-500">{page.elements.length} phần tử</p>
                        </div>
                      </div>
                    </Reorder.Item>
                  ))}
                </Reorder.Group>
              ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {sortedPages.map((page, index) => renderPageCard(page, index))}
                </div>
              ) : (
                <div className="space-y-3">
                  {sortedPages.map((page, index) => renderPageCard(page, index))}
                </div>
              )}
            </AnimatePresence>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsReordering(!isReordering)}
                className={`px-4 py-2 rounded-lg transition-colors font-medium ${
                  isReordering
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {isReordering ? (
                  <>
                    <Check className="w-4 h-4 inline mr-2" />
                    Hoàn tất sắp xếp
                  </>
                ) : (
                  <>
                    <Move className="w-4 h-4 inline mr-2" />
                    Sắp xếp trang
                  </>
                )}
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="px-6 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg transition-colors font-medium"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}