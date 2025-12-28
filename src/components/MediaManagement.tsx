import React, { useState, useRef } from 'react';
import { useMarqueeSelection } from '../hooks/useMarqueeSelection';
import { 
  Upload, FolderPlus, Grid, List, Search, Filter, Image as ImageIcon, 
  Video, FileText, Music, File, Trash2, Edit2, Download, Share2, Eye, 
  MoreVertical, ChevronRight, Folder, Star, Clock, User, X, Check,
  Move, Copy, Tag, Info, Maximize2, Play, Pause, Volume2, Settings,
  ZoomIn, RotateCw, Crop, Palette, Wand2, Link, TrendingUp, BarChart2,
  ExternalLink, RefreshCw, Archive, FileEdit, Image as ImagePlus, Plus, AlertCircle,
  Menu, HelpCircle, Bell, ChevronDown, SlidersHorizontal, LayoutGrid, Columns
} from 'lucide-react';
import { Card } from './Card';

interface MediaFile {
  id: number;
  name: string;
  type: 'image' | 'video' | 'audio' | 'document';
  size: string;
  url: string;
  folder: string;
  uploadedBy: string;
  uploadedAt: string;
  dimensions?: string;
  duration?: string;
  tags?: string[];
  description?: string;
  isStarred?: boolean;
  deletedAt?: string;
  deletedBy?: string;
}

interface FolderItem {
  id: number;
  name: string;
  parent: number | null;
  fileCount: number;
  size: string;
}

interface MediaManagementProps {
  onNavigate?: (page: any) => void;
}

export function MediaManagement({ onNavigate }: MediaManagementProps = {}) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedFolder, setSelectedFolder] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<number[]>([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showFileDetail, setShowFileDetail] = useState<MediaFile | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'size'>('date');
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  // Refs for marquee selection
  const gridContainerRef = useRef<HTMLDivElement>(null);
  const listContainerRef = useRef<HTMLDivElement>(null);
  
  // Preview panel state (Google Drive style)
  const [previewFile, setPreviewFile] = useState<MediaFile | null>(null);
  
  // Lightbox state
  const [showLightbox, setShowLightbox] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);
  
  // Context Menu state
  const [contextMenu, setContextMenu] = useState<{ file: MediaFile; x: number; y: number } | null>(null);
  
  // Hover Preview state
  const [hoverPreview, setHoverPreview] = useState<{ file: MediaFile; x: number; y: number } | null>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // New states for edit, delete, move
  const [showEditModal, setShowEditModal] = useState<MediaFile | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<number[]>([]);
  const [showMoveModal, setShowMoveModal] = useState<number[]>([]);
  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    tags: [] as string[],
    folder: '',
  });
  const [newTag, setNewTag] = useState('');
  const [targetFolder, setTargetFolder] = useState<number | null>(null);
  
  // Drag & Drop Upload state
  const [isDragging, setIsDragging] = useState(false);
  const [uploadQueue, setUploadQueue] = useState<Array<{
    id: number;
    file: File;
    progress: number;
    status: 'pending' | 'uploading' | 'complete' | 'error';
    name: string;
  }>>([]);
  
  // Drag & Drop File to Folder state
  const [draggedFiles, setDraggedFiles] = useState<number[]>([]);
  const [dragOverFolder, setDragOverFolder] = useState<number | null>(null);
  
  // Advanced Filters state
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState({
    dateFrom: '',
    dateTo: '',
    sizeMin: '',
    sizeMax: '',
    fileTypes: [] as string[],
    uploader: '',
  });
  
  // Image Editor state
  const [showImageEditor, setShowImageEditor] = useState<MediaFile | null>(null);
  const [editorSettings, setEditorSettings] = useState({
    brightness: 100,
    contrast: 100,
    saturation: 100,
    blur: 0,
    rotate: 0,
    flipH: false,
    flipV: false,
  });
  const [editorTab, setEditorTab] = useState<'adjust' | 'filters' | 'crop'>('adjust');
  const [showBeforeAfter, setShowBeforeAfter] = useState(false);
  
  // Crop state
  const [cropSettings, setCropSettings] = useState({
    aspectRatio: 'free' as 'free' | '1:1' | '4:3' | '16:9' | '9:16',
    x: 10, // percentage from left
    y: 10, // percentage from top
    width: 80, // percentage of image width
    height: 80, // percentage of image height
  });
  const [isDraggingCrop, setIsDraggingCrop] = useState(false);
  const [isResizingCrop, setIsResizingCrop] = useState<string | null>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const cropContainerRef = React.useRef<HTMLDivElement>(null);
  
  // Special views
  const [specialView, setSpecialView] = useState<'all' | 'starred' | 'recent' | 'trash'>('all');

  // Toast notifications
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const folders: FolderItem[] = [
    { id: 1, name: 'Images', parent: null, fileCount: 1247, size: '2.4 GB' },
    { id: 2, name: 'Videos', parent: null, fileCount: 156, size: '15.8 GB' },
    { id: 3, name: 'Documents', parent: null, fileCount: 432, size: '856 MB' },
    { id: 4, name: 'Audio', parent: null, fileCount: 89, size: '1.2 GB' },
    { id: 5, name: 'News Images', parent: 1, fileCount: 623, size: '1.2 GB' },
    { id: 6, name: 'Gallery', parent: 1, fileCount: 456, size: '890 MB' },
    { id: 7, name: 'Thumbnails', parent: 1, fileCount: 168, size: '320 MB' },
  ];

  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([
    {
      id: 1,
      name: 'tech-conference-2024.jpg',
      type: 'image',
      size: '2.4 MB',
      url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
      folder: 'News Images',
      uploadedBy: 'Nguyễn Văn A',
      uploadedAt: '2 giờ trước',
      dimensions: '1920x1080',
      tags: ['conference', 'technology', 'event'],
      description: 'Tech conference keynote presentation',
      isStarred: true,
    },
    {
      id: 2,
      name: 'ai-robot-demo.mp4',
      type: 'video',
      size: '45.2 MB',
      url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800',
      folder: 'Videos',
      uploadedBy: 'Trần Thị B',
      uploadedAt: '5 giờ trước',
      duration: '3:24',
      tags: ['AI', 'robot', 'demo'],
      description: 'AI robot demonstration video',
    },
    {
      id: 3,
      name: 'product-launch.jpg',
      type: 'image',
      size: '3.1 MB',
      url: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800',
      folder: 'Gallery',
      uploadedBy: 'Lê Văn C',
      uploadedAt: '1 ngày trước',
      dimensions: '2560x1440',
      tags: ['product', 'launch', 'event'],
      isStarred: false,
    },
    {
      id: 4,
      name: 'podcast-intro.mp3',
      type: 'audio',
      size: '8.7 MB',
      url: '',
      folder: 'Audio',
      uploadedBy: 'Nguyễn Văn A',
      uploadedAt: '2 ngày trước',
      duration: '5:42',
      tags: ['podcast', 'intro', 'music'],
    },
    {
      id: 5,
      name: 'company-report-2024.pdf',
      type: 'document',
      size: '1.2 MB',
      url: '',
      folder: 'Documents',
      uploadedBy: 'Phạm Thị D',
      uploadedAt: '3 ngày trước',
      tags: ['report', 'annual', 'company'],
      description: 'Annual company performance report',
    },
    {
      id: 6,
      name: 'team-meeting.jpg',
      type: 'image',
      size: '1.8 MB',
      url: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800',
      folder: 'News Images',
      uploadedBy: 'Trần Thị B',
      uploadedAt: '4 ngày trước',
      dimensions: '1920x1280',
      tags: ['team', 'meeting', 'office'],
    },
    {
      id: 7,
      name: 'office-tour.mp4',
      type: 'video',
      size: '67.5 MB',
      url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
      folder: 'Videos',
      uploadedBy: 'Lê Văn C',
      uploadedAt: '5 ngày trước',
      duration: '8:15',
      tags: ['office', 'tour', 'workplace'],
    },
    {
      id: 8,
      name: 'startup-workspace.jpg',
      type: 'image',
      size: '2.9 MB',
      url: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800',
      folder: 'Gallery',
      uploadedBy: 'Nguyễn Văn A',
      uploadedAt: '1 tuần trước',
      dimensions: '3840x2160',
      tags: ['startup', 'workspace', 'modern'],
      isStarred: true,
    },
    // Deleted files in trash
    {
      id: 9,
      name: 'old-banner.jpg',
      type: 'image',
      size: '4.2 MB',
      url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
      folder: 'News Images',
      uploadedBy: 'Lê Văn C',
      uploadedAt: '10 ngày trước',
      dimensions: '2400x1200',
      tags: ['banner', 'old'],
      deletedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
      deletedBy: 'Admin User',
    },
    {
      id: 10,
      name: 'deprecated-video.mp4',
      type: 'video',
      size: '89.3 MB',
      url: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800',
      folder: 'Videos',
      uploadedBy: 'Trần Thị B',
      uploadedAt: '2 tuần trước',
      duration: '8:15',
      tags: ['deprecated'],
      deletedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days ago
      deletedBy: 'Nguyễn Văn A',
    },
    {
      id: 11,
      name: 'temp-document.pdf',
      type: 'document',
      size: '2.4 MB',
      url: '',
      folder: 'Documents',
      uploadedBy: 'Phạm Thị D',
      uploadedAt: '3 tuần trước',
      tags: ['temp'],
      deletedAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(), // 25 days ago - urgent!
      deletedBy: 'Admin User',
    },
  ]);

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image': return ImageIcon;
      case 'video': return Video;
      case 'audio': return Music;
      case 'document': return FileText;
      default: return File;
    }
  };

  const getFileColor = (type: string) => {
    switch (type) {
      case 'image': return 'blue';
      case 'video': return 'red';
      case 'audio': return 'purple';
      case 'document': return 'green';
      default: return 'gray';
    }
  };

  // Marquee selection for grid view
  const gridMarquee = useMarqueeSelection({
    containerRef: gridContainerRef,
    itemSelector: '[data-item-id]',
    onSelectionChange: (newSelection) => {
      setSelectedFiles(Array.from(newSelection).map(id => parseInt(id, 10)));
    },
    isEnabled: viewMode === 'grid',
  });

  // Marquee selection for list view
  const listMarquee = useMarqueeSelection({
    containerRef: listContainerRef,
    itemSelector: '[data-item-id]',
    onSelectionChange: (newSelection) => {
      setSelectedFiles(Array.from(newSelection).map(id => parseInt(id, 10)));
    },
    isEnabled: viewMode === 'list',
  });

  // Get current marquee based on view mode
  const currentMarquee = viewMode === 'grid' ? gridMarquee : listMarquee;

  const toggleFileSelection = (fileId: number) => {
    const newSelected = selectedFiles.includes(fileId) 
      ? selectedFiles.filter(id => id !== fileId) 
      : [...selectedFiles, fileId];
    setSelectedFiles(newSelected);
    currentMarquee.updateSelection(new Set(newSelected.map(id => id.toString())));
  };

  const toggleStar = (fileId: number) => {
    setMediaFiles(prev => prev.map(file =>
      file.id === fileId ? { ...file, isStarred: !file.isStarred } : file
    ));
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDropModal = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files: FileList) => {
    setIsUploading(true);
    setUploadProgress(0);
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setShowUploadModal(false);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const filteredFiles = mediaFiles.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || file.type === filterType;
    
    // Filter by special views
    if (specialView === 'trash') {
      // Show only deleted files in trash view
      return file.deletedAt && matchesSearch && matchesType;
    }
    
    // Exclude deleted files from all other views
    if (file.deletedAt) return false;
    
    if (specialView === 'starred' && !file.isStarred) return false;
    if (specialView === 'recent') {
      // Show files from last 7 days (simplified check by "trước" text)
      const recentCheck = file.uploadedAt.includes('giờ') || file.uploadedAt.includes('ngày');
      if (!recentCheck) return false;
    }
    
    // Filter by selected folder
    if (selectedFolder !== null) {
      const folder = folders.find(f => f.id === selectedFolder);
      if (folder && file.folder !== folder.name) return false;
    }
    
    return matchesSearch && matchesType;
  });

  // Get subfolders of current folder for display (like Google Drive)
  const currentSubfolders = specialView === 'all' && selectedFolder !== null 
    ? folders.filter(f => f.parent === selectedFolder)
    : specialView === 'all' && selectedFolder === null
    ? folders.filter(f => f.parent === null)
    : [];

  const stats = {
    images: mediaFiles.filter(f => f.type === 'image' && !f.deletedAt).length,
    videos: mediaFiles.filter(f => f.type === 'video' && !f.deletedAt).length,
    audio: mediaFiles.filter(f => f.type === 'audio' && !f.deletedAt).length,
    documents: mediaFiles.filter(f => f.type === 'document' && !f.deletedAt).length,
    totalSize: '20.1 GB',
    storage: { used: 20.1, total: 100 },
    trashedFiles: mediaFiles.filter(f => f.deletedAt).length
  };

  // Edit handlers
  const handleEdit = (file: MediaFile) => {
    setShowEditModal(file);
    setEditForm({
      name: file.name,
      description: file.description || '',
      tags: file.tags || [],
      folder: file.folder,
    });
  };

  const handleSaveEdit = () => {
    if (!showEditModal) return;
    
    setMediaFiles(prev => prev.map(file =>
      file.id === showEditModal.id
        ? { ...file, ...editForm, tags: editForm.tags }
        : file
    ));
    setShowEditModal(null);
    showToast('Đã lưu thay đổi!', 'success');
  };

  const handleAddTag = () => {
    if (newTag.trim() && !editForm.tags.includes(newTag.trim())) {
      setEditForm(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setEditForm(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  // Delete handlers (Soft Delete - Move to Trash)
  const handleDelete = (fileIds: number[]) => {
    const currentDate = new Date().toISOString();
    setMediaFiles(prev => prev.map(file => 
      fileIds.includes(file.id) 
        ? { ...file, deletedAt: currentDate, deletedBy: 'Admin User' }
        : file
    ));
    setSelectedFiles([]);
    showToast(`Đã chuyển ${fileIds.length} file(s) vào thùng rác`, 'success');
  };

  // Restore handlers
  const handleRestore = (fileIds: number[]) => {
    setMediaFiles(prev => prev.map(file => {
      if (fileIds.includes(file.id)) {
        const { deletedAt, deletedBy, ...restFile } = file;
        return restFile;
      }
      return file;
    }));
    setSelectedFiles([]);
    showToast(`Đã khôi phục ${fileIds.length} file(s) thành công!`, 'success');
  };

  // Permanent delete handlers
  const handlePermanentDelete = (fileIds: number[]) => {
    setShowDeleteModal(fileIds);
  };

  const handleConfirmPermanentDelete = () => {
    const count = showDeleteModal.length;
    setMediaFiles(prev => prev.filter(file => !showDeleteModal.includes(file.id)));
    setSelectedFiles([]);
    setShowDeleteModal([]);
    showToast(`Đã xóa vĩnh viễn ${count} file(s)!`, 'success');
  };

  // Empty trash
  const handleEmptyTrash = () => {
    const trashedCount = mediaFiles.filter(f => f.deletedAt).length;
    if (trashedCount > 0) {
      const confirm = window.confirm(`Bạn có chắc muốn xóa vĩnh viễn ${trashedCount} file(s) trong thùng rác?`);
      if (confirm) {
        setMediaFiles(prev => prev.filter(file => !file.deletedAt));
        showToast(`Đã làm trống thùng rác (${trashedCount} files)!`, 'success');
      }
    }
  };

  // Move handlers
  const handleMove = (fileIds: number[]) => {
    setShowMoveModal(fileIds);
    setTargetFolder(null);
  };

  const handleConfirmMove = () => {
    if (targetFolder === null) {
      showToast('Vui lòng chọn thư mục đích!', 'error');
      return;
    }

    const folderName = folders.find(f => f.id === targetFolder)?.name || '';
    setMediaFiles(prev => prev.map(file =>
      showMoveModal.includes(file.id)
        ? { ...file, folder: folderName }
        : file
    ));
    setSelectedFiles([]);
    setShowMoveModal([]);
    setTargetFolder(null);
    showToast(`Đã di chuyển ${showMoveModal.length} file(s) vào ${folderName}!`, 'success');
  };

  // Lightbox handlers
  const openLightbox = (file: MediaFile) => {
    const index = filteredFiles.findIndex(f => f.id === file.id);
    setLightboxIndex(index);
    setShowLightbox(true);
    setZoomLevel(1);
  };

  const closeLightbox = () => {
    setShowLightbox(false);
    setZoomLevel(1);
  };

  const nextFile = () => {
    if (lightboxIndex < filteredFiles.length - 1) {
      setLightboxIndex(lightboxIndex + 1);
      setZoomLevel(1);
    }
  };

  const prevFile = () => {
    if (lightboxIndex > 0) {
      setLightboxIndex(lightboxIndex - 1);
      setZoomLevel(1);
    }
  };

  const zoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.25, 3));
  };

  const zoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.25, 0.5));
  };

  // Keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!showLightbox) return;
      
      if (e.key === 'Escape') {
        closeLightbox();
      } else if (e.key === 'ArrowLeft') {
        prevFile();
      } else if (e.key === 'ArrowRight') {
        nextFile();
      } else if (e.key === '+' || e.key === '=') {
        zoomIn();
      } else if (e.key === '-') {
        zoomOut();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showLightbox, lightboxIndex]);

  // Context menu handlers
  const handleContextMenu = (e: React.MouseEvent, file: MediaFile) => {
    e.preventDefault();
    setContextMenu({ file, x: e.clientX, y: e.clientY });
  };

  const closeContextMenu = () => {
    setContextMenu(null);
  };

  // Click outside to close context menu
  React.useEffect(() => {
    if (contextMenu) {
      const handleClick = () => closeContextMenu();
      window.addEventListener('click', handleClick);
      return () => window.removeEventListener('click', handleClick);
    }
  }, [contextMenu]);

  // Keyboard shortcuts for Image Editor
  React.useEffect(() => {
    if (showImageEditor) {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          closeImageEditor();
        } else if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
          saveEditedImage();
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [showImageEditor]);

  // Hover preview handlers
  const handleMouseEnter = (e: React.MouseEvent, file: MediaFile) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    
    hoverTimeoutRef.current = setTimeout(() => {
      const target = e.currentTarget;
      if (!target) return;
      
      const rect = target.getBoundingClientRect();
      const tooltipWidth = 320; // max-w-xs
      
      // Check if tooltip would go off-screen on the right
      const shouldPositionLeft = rect.right + 10 + tooltipWidth > window.innerWidth;
      
      setHoverPreview({ 
        file, 
        x: shouldPositionLeft ? rect.left - tooltipWidth - 10 : rect.right + 10, 
        y: rect.top 
      });
    }, 500); // 500ms delay
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setHoverPreview(null);
  };

  // Bulk operations handlers
  const handleBulkDownload = () => {
    showToast(`Đang tải xuống ${selectedFiles.length} file(s)...`, 'info');
  };

  const handleDeselectAll = () => {
    setSelectedFiles([]);
  };

  // Drag & Drop handlers
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Only show upload overlay if dragging files from outside (not internal drag)
    // Internal drag will have our custom data set
    const hasFiles = e.dataTransfer.types.includes('Files');
    const hasInternalData = e.dataTransfer.types.includes('text/plain');
    
    // Only show upload overlay if dragging external files
    if (hasFiles && !hasInternalData) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.currentTarget === e.target) {
      setIsDragging(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Check if this is external file drag
    const hasFiles = e.dataTransfer.types.includes('Files');
    const hasInternalData = e.dataTransfer.types.includes('text/plain');
    
    if (hasFiles && !hasInternalData) {
      setIsDragging(true);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files);
    }
  };

  const handleFileUpload = (files: File[]) => {
    const newUploads = files.map((file, index) => ({
      id: Date.now() + index,
      file,
      name: file.name,
      progress: 0,
      status: 'pending' as const,
    }));

    setUploadQueue(prev => [...prev, ...newUploads]);

    // Simulate upload for each file
    newUploads.forEach(upload => {
      simulateUpload(upload.id);
    });
  };

  const simulateUpload = (uploadId: number) => {
    setUploadQueue(prev => prev.map(u => 
      u.id === uploadId ? { ...u, status: 'uploading' as const } : u
    ));

    const interval = setInterval(() => {
      setUploadQueue(prev => {
        const upload = prev.find(u => u.id === uploadId);
        if (!upload) {
          clearInterval(interval);
          return prev;
        }

        if (upload.progress >= 100) {
          clearInterval(interval);
          return prev.map(u => 
            u.id === uploadId ? { ...u, status: 'complete' as const, progress: 100 } : u
          );
        }

        return prev.map(u => 
          u.id === uploadId ? { ...u, progress: Math.min(u.progress + 10, 100) } : u
        );
      });
    }, 200);

    // Auto-remove after completion
    setTimeout(() => {
      setUploadQueue(prev => prev.filter(u => u.id !== uploadId));
      
      // Add to media files (mock)
      const upload = uploadQueue.find(u => u.id === uploadId);
      if (upload) {
        const newFile: MediaFile = {
          id: Date.now(),
          name: upload.file.name,
          type: upload.file.type.startsWith('image/') ? 'image' : 
                upload.file.type.startsWith('video/') ? 'video' : 'document',
          size: `${(upload.file.size / 1024 / 1024).toFixed(2)} MB`,
          uploadedAt: new Date().toLocaleDateString('vi-VN'),
          uploader: 'You',
          folder: currentFolder,
          isStarred: false,
          url: upload.file.type.startsWith('image/') ? URL.createObjectURL(upload.file) : undefined,
        };
        setMediaFiles(prev => [newFile, ...prev]);
      }
    }, 3000);
  };

  // Advanced Filters handlers
  const toggleAdvancedFilters = () => {
    setShowAdvancedFilters(!showAdvancedFilters);
  };

  const handleAdvancedFilterChange = (key: string, value: any) => {
    setAdvancedFilters(prev => ({ ...prev, [key]: value }));
  };

  const toggleFileTypeFilter = (type: string) => {
    setAdvancedFilters(prev => ({
      ...prev,
      fileTypes: prev.fileTypes.includes(type)
        ? prev.fileTypes.filter(t => t !== type)
        : [...prev.fileTypes, type]
    }));
  };

  const clearAdvancedFilters = () => {
    setAdvancedFilters({
      dateFrom: '',
      dateTo: '',
      sizeMin: '',
      sizeMax: '',
      fileTypes: [],
      uploader: '',
    });
  };

  const hasActiveAdvancedFilters = 
    advancedFilters.dateFrom || advancedFilters.dateTo || 
    advancedFilters.sizeMin || advancedFilters.sizeMax || 
    advancedFilters.fileTypes.length > 0 || advancedFilters.uploader;

  // Quick Actions handlers
  const handleCopyPath = () => {
    const paths = selectedFiles.map(id => {
      const file = mediaFiles.find(f => f.id === id);
      return file ? `/${file.folder}/${file.name}` : '';
    }).filter(Boolean);
    
    navigator.clipboard.writeText(paths.join('\n'));
    showToast(`Đã copy ${paths.length} đường dẫn!`, 'success');
  };

  const handleBatchRename = () => {
    const prefix = prompt('Nhập prefix cho tên file:');
    if (prefix) {
      setMediaFiles(prev => prev.map(file => 
        selectedFiles.includes(file.id)
          ? { ...file, name: `${prefix}_${file.name}` }
          : file
      ));
      showToast(`Đã đổi tên ${selectedFiles.length} file(s)!`, 'success');
    }
  };

  // Drag & Drop File to Folder handlers
  const handleFileDragStart = (e: React.DragEvent, fileId: number) => {
    e.stopPropagation();
    const filesToDrag = selectedFiles.includes(fileId) ? selectedFiles : [fileId];
    setDraggedFiles(filesToDrag);
    
    // Set drag image/effect
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', JSON.stringify(filesToDrag));
  };

  const handleFileDragEnd = () => {
    setDraggedFiles([]);
    setDragOverFolder(null);
  };

  const handleFolderDragOver = (e: React.DragEvent, folderId: number) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'move';
    setDragOverFolder(folderId);
  };

  const handleFolderDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverFolder(null);
  };

  const handleFolderDrop = (e: React.DragEvent, folderId: number) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (draggedFiles.length === 0) return;
    
    const folder = folders.find(f => f.id === folderId);
    if (!folder) return;
    
    // Move files to the folder
    setMediaFiles(prev => prev.map(file =>
      draggedFiles.includes(file.id)
        ? { ...file, folder: folder.name }
        : file
    ));
    
    showToast(`Đã di chuyển ${draggedFiles.length} file(s) vào ${folder.name}!`, 'success');
    
    // Clear selection if needed
    setSelectedFiles([]);
    setDraggedFiles([]);
    setDragOverFolder(null);
  };

  const handleDuplicate = () => {
    const newFiles = mediaFiles
      .filter(file => selectedFiles.includes(file.id))
      .map(file => ({
        ...file,
        id: Date.now() + Math.random(),
        name: `${file.name.split('.')[0]}_copy.${file.name.split('.')[1]}`,
      }));
    
    setMediaFiles(prev => [...newFiles, ...prev]);
    showToast(`Đã nhân bản ${newFiles.length} file(s)!`, 'success');
  };

  // Calculate days remaining before auto-delete
  const getDaysUntilAutoDelete = (deletedAt: string) => {
    const deletedDate = new Date(deletedAt);
    const autoDeleteDate = new Date(deletedDate.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days
    const now = new Date();
    const daysRemaining = Math.ceil((autoDeleteDate.getTime() - now.getTime()) / (24 * 60 * 60 * 1000));
    return Math.max(0, daysRemaining);
  };

  // Image Editor handlers
  const openImageEditor = (file: MediaFile) => {
    if (file.type === 'image') {
      setShowImageEditor(file);
      setEditorSettings({
        brightness: 100,
        contrast: 100,
        saturation: 100,
        blur: 0,
        rotate: 0,
        flipH: false,
        flipV: false,
      });
      setCropSettings({
        aspectRatio: 'free',
        x: 10,
        y: 10,
        width: 80,
        height: 80,
      });
      setEditorTab('adjust');
      setShowBeforeAfter(false);
    }
  };

  const closeImageEditor = () => {
    setShowImageEditor(null);
  };

  const handleEditorChange = (key: string, value: number | boolean) => {
    setEditorSettings(prev => ({ ...prev, [key]: value }));
  };

  const resetEditorSettings = () => {
    setEditorSettings({
      brightness: 100,
      contrast: 100,
      saturation: 100,
      blur: 0,
      rotate: 0,
      flipH: false,
      flipV: false,
    });
  };

  const saveEditedImage = () => {
    // In production, this would save the edited image
    showToast('Ảnh đã được lưu với các chỉnh sửa!', 'success');
    closeImageEditor();
  };

  const applyFilterPreset = (preset: string) => {
    switch (preset) {
      case 'vibrant':
        setEditorSettings(prev => ({ ...prev, saturation: 130, contrast: 110 }));
        break;
      case 'grayscale':
        setEditorSettings(prev => ({ ...prev, saturation: 0 }));
        break;
      case 'vintage':
        setEditorSettings(prev => ({ ...prev, saturation: 80, brightness: 110, contrast: 90 }));
        break;
      case 'bright':
        setEditorSettings(prev => ({ ...prev, brightness: 120, contrast: 105 }));
        break;
      case 'dramatic':
        setEditorSettings(prev => ({ ...prev, contrast: 140, saturation: 90, brightness: 95 }));
        break;
      default:
        resetEditorSettings();
    }
  };

  const getImageStyle = () => {
    return {
      filter: `brightness(${editorSettings.brightness}%) contrast(${editorSettings.contrast}%) saturate(${editorSettings.saturation}%) blur(${editorSettings.blur}px)`,
      transform: `rotate(${editorSettings.rotate}deg) scaleX(${editorSettings.flipH ? -1 : 1}) scaleY(${editorSettings.flipV ? -1 : 1})`,
      transition: 'filter 0.2s ease, transform 0.2s ease',
    };
  };

  // Crop handlers
  const handleCropAspectRatio = (ratio: 'free' | '1:1' | '4:3' | '16:9' | '9:16') => {
    setCropSettings(prev => {
      const newSettings = { ...prev, aspectRatio: ratio };
      
      if (ratio !== 'free') {
        // Calculate new dimensions based on aspect ratio
        const aspectRatios = {
          '1:1': 1,
          '4:3': 4/3,
          '16:9': 16/9,
          '9:16': 9/16,
        };
        
        const targetRatio = aspectRatios[ratio];
        const currentRatio = prev.width / prev.height;
        
        if (currentRatio > targetRatio) {
          // Width is too large, adjust it
          newSettings.width = prev.height * targetRatio;
        } else {
          // Height is too large, adjust it
          newSettings.height = prev.width / targetRatio;
        }
        
        // Make sure it fits within bounds
        if (newSettings.x + newSettings.width > 100) {
          newSettings.x = 100 - newSettings.width;
        }
        if (newSettings.y + newSettings.height > 100) {
          newSettings.y = 100 - newSettings.height;
        }
      }
      
      return newSettings;
    });
  };

  const handleCropMouseDown = (e: React.MouseEvent, type: 'drag' | 'resize', corner?: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (type === 'drag') {
      setIsDraggingCrop(true);
    } else if (type === 'resize' && corner) {
      setIsResizingCrop(corner);
    }
    
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const applyCrop = () => {
    // In production, this would actually crop the image using canvas
    showToast('Ảnh đã được cắt thành công!', 'success');
    // Reset crop settings for next use
    setCropSettings({
      aspectRatio: 'free',
      x: 10,
      y: 10,
      width: 80,
      height: 80,
    });
  };

  const resetCrop = () => {
    setCropSettings({
      aspectRatio: 'free',
      x: 10,
      y: 10,
      width: 80,
      height: 80,
    });
  };

  // Add mouse move and up listeners for crop
  React.useEffect(() => {
    if (!isDraggingCrop && !isResizingCrop) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!cropContainerRef.current) return;

      const container = cropContainerRef.current;
      const rect = container.getBoundingClientRect();
      const deltaX = ((e.clientX - dragStart.x) / rect.width) * 100;
      const deltaY = ((e.clientY - dragStart.y) / rect.height) * 100;

      setCropSettings(prev => {
        let newSettings = { ...prev };

        if (isDraggingCrop) {
          // Move the crop area
          newSettings.x = Math.max(0, Math.min(100 - prev.width, prev.x + deltaX));
          newSettings.y = Math.max(0, Math.min(100 - prev.height, prev.y + deltaY));
        } else if (isResizingCrop) {
          // Resize the crop area
          const aspectRatios = {
            'free': null,
            '1:1': 1,
            '4:3': 4/3,
            '16:9': 16/9,
            '9:16': 9/16,
          };
          const targetRatio = aspectRatios[prev.aspectRatio];

          switch (isResizingCrop) {
            case 'se': // bottom-right
              newSettings.width = Math.max(10, Math.min(100 - prev.x, prev.width + deltaX));
              if (targetRatio) {
                newSettings.height = newSettings.width / targetRatio;
              } else {
                newSettings.height = Math.max(10, Math.min(100 - prev.y, prev.height + deltaY));
              }
              break;
            case 'sw': // bottom-left
              const newWidth = Math.max(10, prev.width - deltaX);
              const newX = Math.max(0, prev.x + deltaX);
              if (newX + newWidth <= 100) {
                newSettings.width = newWidth;
                newSettings.x = newX;
              }
              if (targetRatio) {
                newSettings.height = newSettings.width / targetRatio;
              } else {
                newSettings.height = Math.max(10, Math.min(100 - prev.y, prev.height + deltaY));
              }
              break;
            case 'ne': // top-right
              newSettings.width = Math.max(10, Math.min(100 - prev.x, prev.width + deltaX));
              const newHeight = Math.max(10, prev.height - deltaY);
              const newY = Math.max(0, prev.y + deltaY);
              if (targetRatio) {
                newSettings.height = newSettings.width / targetRatio;
                newSettings.y = Math.max(0, prev.y + prev.height - newSettings.height);
              } else if (newY + newHeight <= 100) {
                newSettings.height = newHeight;
                newSettings.y = newY;
              }
              break;
            case 'nw': // top-left
              const newWidthNW = Math.max(10, prev.width - deltaX);
              const newXNW = Math.max(0, prev.x + deltaX);
              const newHeightNW = Math.max(10, prev.height - deltaY);
              const newYNW = Math.max(0, prev.y + deltaY);
              
              if (newXNW + newWidthNW <= 100) {
                newSettings.width = newWidthNW;
                newSettings.x = newXNW;
              }
              
              if (targetRatio) {
                newSettings.height = newSettings.width / targetRatio;
                newSettings.y = Math.max(0, prev.y + prev.height - newSettings.height);
              } else if (newYNW + newHeightNW <= 100) {
                newSettings.height = newHeightNW;
                newSettings.y = newYNW;
              }
              break;
          }

          // Ensure crop area stays within bounds
          if (newSettings.x + newSettings.width > 100) {
            newSettings.width = 100 - newSettings.x;
          }
          if (newSettings.y + newSettings.height > 100) {
            newSettings.height = 100 - newSettings.y;
          }
        }

        return newSettings;
      });

      setDragStart({ x: e.clientX, y: e.clientY });
    };

    const handleMouseUp = () => {
      setIsDraggingCrop(false);
      setIsResizingCrop(null);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggingCrop, isResizingCrop, dragStart]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Header - Google Drive Style */}
      <header className="h-16 border-b border-border/60 bg-card/50 backdrop-blur-sm sticky top-0 z-40 flex items-center px-4 gap-4">
        <button 
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="p-2 hover:bg-muted rounded-lg transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
            <Folder className="w-6 h-6 text-white" />
          </div>
          <span className="font-semibold text-lg">Media Library</span>
        </div>

        {/* Back to CMS Button */}
        {onNavigate && (
          <button
            onClick={() => onNavigate({ page: 'dashboard' })}
            className="px-4 py-2 bg-muted/50 hover:bg-muted rounded-lg transition-colors flex items-center gap-2 text-sm font-medium"
          >
            <ChevronRight className="w-4 h-4 rotate-180" />
            Quay về CMS
          </button>
        )}

        {/* Search Bar */}
        <div className="flex-1 max-w-2xl mx-auto relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Tìm kiếm trong Media Library..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-2.5 bg-muted/50 border-0 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-card transition-all"
          />
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className={`bg-card/30 border-r border-border/60 transition-all duration-300 flex flex-col ${sidebarCollapsed ? 'w-0 overflow-hidden' : 'w-64'}`}>
          <div className="p-4 space-y-2">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={(e) => {
                if (e.target.files) {
                  handleFileUpload(Array.from(e.target.files));
                  e.target.value = '';
                }
              }}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-200 font-medium"
            >
              <Upload className="w-5 h-5" />
              <span>Upload mới</span>
            </button>

            <button className="w-full flex items-center gap-3 px-4 py-3 border border-border/60 rounded-xl hover:bg-muted/50 transition-all duration-200">
              <FolderPlus className="w-5 h-5" />
              <span>Tạo thư mục</span>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 pb-4">
            <div className="space-y-1">
              <div className="text-xs font-medium text-muted-foreground px-3 py-2">TRUY CẬP NHANH</div>
              
              <button
                onClick={() => {
                  setSelectedFolder(null);
                  setSpecialView('all');
                }}
                className={`w-full text-left px-3 py-2.5 rounded-xl transition-all duration-200 flex items-center gap-3 ${
                  selectedFolder === null && specialView === 'all' ? 'bg-blue-50 text-blue-700 font-medium' : 'hover:bg-muted/50'
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
                <span>Tất cả files</span>
                <span className="ml-auto text-xs text-muted-foreground">1,924</span>
              </button>

              <button 
                onClick={() => {
                  setSelectedFolder(null);
                  setSpecialView('starred');
                }}
                className={`w-full text-left px-3 py-2.5 rounded-xl transition-all duration-200 flex items-center gap-3 ${
                  specialView === 'starred' ? 'bg-blue-50 text-blue-700 font-medium' : 'hover:bg-muted/50'
                }`}
              >
                <Star className="w-4 h-4 text-yellow-500" />
                <span>Đã đánh dấu</span>
                <span className="ml-auto text-xs text-muted-foreground">
                  {mediaFiles.filter(f => f.isStarred).length}
                </span>
              </button>

              <button 
                onClick={() => {
                  setSelectedFolder(null);
                  setSpecialView('recent');
                }}
                className={`w-full text-left px-3 py-2.5 rounded-xl transition-all duration-200 flex items-center gap-3 ${
                  specialView === 'recent' ? 'bg-blue-50 text-blue-700 font-medium' : 'hover:bg-muted/50'
                }`}
              >
                <Clock className="w-4 h-4" />
                <span>Gần đây</span>
              </button>

              <button 
                onClick={() => {
                  setSelectedFolder(null);
                  setSpecialView('trash');
                }}
                className={`w-full text-left px-3 py-2.5 rounded-xl transition-all duration-200 flex items-center gap-3 ${
                  specialView === 'trash' ? 'bg-red-50 text-red-700 font-medium' : 'hover:bg-muted/50'
                }`}
              >
                <Trash2 className="w-4 h-4 text-red-500" />
                <span>Thùng rác</span>
                {stats.trashedFiles > 0 && (
                  <span className="ml-auto text-xs bg-red-500 text-white px-2 py-0.5 rounded-full font-medium">
                    {stats.trashedFiles}
                  </span>
                )}
              </button>

              <div className="pt-4 mt-2 border-t border-border/60">
                <div className="text-xs font-medium text-muted-foreground px-3 py-2">THƯ MỤC</div>
                
                {folders.filter(f => f.parent === null).map((folder) => (
                  <div key={folder.id}>
                    <button
                      onClick={() => {
                        setSelectedFolder(folder.id);
                        setSpecialView('all');
                      }}
                      onDragOver={(e) => handleFolderDragOver(e, folder.id)}
                      onDragLeave={handleFolderDragLeave}
                      onDrop={(e) => handleFolderDrop(e, folder.id)}
                      className={`w-full text-left px-3 py-2.5 rounded-xl transition-all duration-200 flex items-center gap-3 ${
                        selectedFolder === folder.id && specialView === 'all' ? 'bg-blue-50 text-blue-700 font-medium' : 'hover:bg-muted/50'
                      } ${dragOverFolder === folder.id ? 'bg-green-100 border-2 border-green-500 scale-105' : ''}`}
                    >
                      <Folder className="w-4 h-4" />
                      <span className="flex-1">{folder.name}</span>
                      <span className="text-xs text-muted-foreground">{folder.fileCount}</span>
                    </button>

                    {/* Subfolders */}
                    {folders.filter(f => f.parent === folder.id).map((subfolder) => (
                      <button
                        key={subfolder.id}
                        onClick={() => {
                          setSelectedFolder(subfolder.id);
                          setSpecialView('all');
                        }}
                        onDragOver={(e) => handleFolderDragOver(e, subfolder.id)}
                        onDragLeave={handleFolderDragLeave}
                        onDrop={(e) => handleFolderDrop(e, subfolder.id)}
                        className={`w-full text-left px-3 py-2.5 pl-10 rounded-xl transition-all duration-200 flex items-center gap-2 text-sm ${
                          selectedFolder === subfolder.id && specialView === 'all' ? 'bg-blue-50 text-blue-700 font-medium' : 'hover:bg-muted/50 text-muted-foreground'
                        } ${dragOverFolder === subfolder.id ? 'bg-green-100 border-2 border-green-500 scale-105' : ''}`}
                      >
                        <ChevronRight className="w-3 h-3" />
                        <span className="flex-1">{subfolder.name}</span>
                        <span className="text-xs">{subfolder.fileCount}</span>
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Storage Indicator */}
          <div className="p-4 border-t border-border/60 bg-muted/30">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Storage</span>
                <span className="font-medium">{stats.storage.used} GB / {stats.storage.total} GB</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all" 
                  style={{ width: `${(stats.storage.used / stats.storage.total) * 100}%` }}
                />
              </div>
              <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                Nâng cấp storage
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className={`flex-1 overflow-auto transition-all duration-300 ${previewFile ? 'mr-96' : ''}`}>
          <div className="p-6 space-y-6">
            {/* Breadcrumb & Actions Bar */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 flex-wrap">
                {/* Home/Root breadcrumb */}
                {(selectedFolder !== null || specialView !== 'all') && (
                  <>
                    <button 
                      onClick={() => {
                        setSelectedFolder(null);
                        setSpecialView('all');
                      }}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
                    >
                      <Folder className="w-4 h-4" />
                      My Drive
                    </button>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </>
                )}
                
                {/* Parent folder breadcrumb (if in subfolder) */}
                {specialView === 'all' && selectedFolder !== null && (() => {
                  const currentFolder = folders.find(f => f.id === selectedFolder);
                  const parentFolder = currentFolder?.parent ? folders.find(f => f.id === currentFolder.parent) : null;
                  
                  return parentFolder ? (
                    <>
                      <button 
                        onClick={() => setSelectedFolder(parentFolder.id)}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {parentFolder.name}
                      </button>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </>
                  ) : null;
                })()}
                
                {/* Current location */}
                <span className="text-sm font-medium flex items-center gap-1.5">
                  {specialView === 'starred' && (
                    <>
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      Đã đánh dấu
                    </>
                  )}
                  {specialView === 'recent' && (
                    <>
                      <Clock className="w-4 h-4" />
                      Gần đây
                    </>
                  )}
                  {specialView === 'trash' && (
                    <>
                      <Trash2 className="w-4 h-4" />
                      Thùng rác
                    </>
                  )}
                  {specialView === 'all' && selectedFolder === null && (
                    <>
                      <Folder className="w-4 h-4" />
                      My Drive
                    </>
                  )}
                  {specialView === 'all' && selectedFolder !== null && (
                    <>
                      <Folder className="w-4 h-4 text-blue-500" />
                      {folders.find(f => f.id === selectedFolder)?.name}
                    </>
                  )}
                </span>
              </div>

              {/* Conditional Toolbar: Show filters OR bulk actions */}
              {selectedFiles.length > 0 && specialView !== 'trash' ? (
                // Bulk Actions
                <div className="flex items-center gap-2 min-h-[42px]">
                  <span className="font-medium text-blue-900 mr-2">{selectedFiles.length} file(s) đã chọn</span>
                  <button 
                    onClick={handleBulkDownload}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
                  >
                    <Download className="w-4 h-4" />
                    Tải xuống
                  </button>
                  <button 
                    onClick={() => handleMove(selectedFiles)}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors text-sm font-medium"
                  >
                    <Move className="w-4 h-4" />
                    Di chuyển
                  </button>
                  <button 
                    className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
                  >
                    <Share2 className="w-4 h-4" />
                    Chia sẻ
                  </button>
                  <button 
                    onClick={() => handleDelete(selectedFiles)}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
                  >
                    <Trash2 className="w-4 h-4" />
                    Xóa
                  </button>
                  <button 
                    onClick={() => setSelectedFiles([])}
                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                    title="Bỏ chọn"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                // Filter Toolbar
                <div className="flex items-center gap-3 min-h-[42px]">
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="px-4 py-2 bg-card border border-border/60 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="all">Tất cả loại</option>
                    <option value="image">Hình ảnh</option>
                    <option value="video">Video</option>
                    <option value="audio">Audio</option>
                    <option value="document">Tài liệu</option>
                  </select>

                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'name' | 'date' | 'size')}
                    className="px-4 py-2 bg-card border border-border/60 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="date">Ngày tải lên</option>
                    <option value="name">Tên file</option>
                    <option value="size">Kích thước</option>
                  </select>

                  <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-lg border border-border/60">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-card shadow-sm' : 'hover:bg-card/50'}`}
                    >
                      <Grid className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-card shadow-sm' : 'hover:bg-card/50'}`}
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Advanced Filters Toggle */}
                  <button
                    onClick={toggleAdvancedFilters}
                    className={`px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-all ${
                      showAdvancedFilters 
                        ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20' 
                        : 'bg-card border border-border/60 hover:border-blue-500/50'
                    }`}
                  >
                    <SlidersHorizontal className="w-4 h-4" />
                    Bộ lọc
                    {hasActiveAdvancedFilters && (
                      <span className="w-2 h-2 bg-green-500 rounded-full" />
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Trash Warning Banner */}
            {specialView === 'trash' && (
              <div className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 rounded-2xl p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-red-100 rounded-xl">
                    <AlertCircle className="w-6 h-6 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-red-900 mb-2">Thùng rác</h3>
                    <p className="text-sm text-red-700 mb-4">
                      Files trong thùng rác sẽ tự động bị xóa vĩnh viễn sau 30 ngày. Bạn có thể khôi phục hoặc xóa vĩnh viễn các files này.
                    </p>
                    <div className="flex items-center gap-3">
                      {selectedFiles.length > 0 ? (
                        <>
                          <button
                            onClick={() => handleRestore(selectedFiles)}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all flex items-center gap-2 text-sm font-medium shadow-lg shadow-blue-500/20"
                          >
                            <RefreshCw className="w-4 h-4" />
                            Khôi phục {selectedFiles.length} file(s)
                          </button>
                          <button
                            onClick={() => handlePermanentDelete(selectedFiles)}
                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all flex items-center gap-2 text-sm font-medium shadow-lg shadow-red-500/20"
                          >
                            <Trash2 className="w-4 h-4" />
                            Xóa vĩnh viễn {selectedFiles.length} file(s)
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={handleEmptyTrash}
                          disabled={stats.trashedFiles === 0}
                          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all flex items-center gap-2 text-sm font-medium shadow-lg shadow-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Trash2 className="w-4 h-4" />
                          Làm trống thùng rác ({stats.trashedFiles} files)
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Files Grid/List */}
            <div
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className="relative"
            >
            {filteredFiles.length === 0 && currentSubfolders.length === 0 ? (
              <div className="bg-card border border-border/60 rounded-2xl text-center py-16">
                <Folder className="w-20 h-20 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="font-semibold text-xl mb-2">Không có nội dung</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  {specialView === 'starred' && 'Chưa có file nào được đánh dấu'}
                  {specialView === 'recent' && 'Chưa có file nào gần đây'}
                  {specialView === 'trash' && 'Thùng rác trống'}
                  {specialView === 'all' && searchQuery && 'Không tìm thấy file hoặc thư mục phù hợp'}
                  {specialView === 'all' && !searchQuery && 'Thư mục này chưa có file hoặc thư mục con nào'}
                </p>
                {specialView === 'all' && !searchQuery && (
                  <button
                    onClick={() => setShowUploadModal(true)}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/20 transition-all inline-flex items-center gap-2 font-medium"
                  >
                    <Upload className="w-5 h-5" />
                    Upload files
                  </button>
                )}
              </div>
            ) : viewMode === 'grid' ? (
              <div 
                ref={gridContainerRef}
                className={`grid gap-4 ${previewFile ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4' : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6'} relative select-none`}
                onMouseDown={gridMarquee.handleMouseDown}
              >
                {gridMarquee.renderSelectionBox()}
                
                {/* Render Folders First (Google Drive style) */}
                {currentSubfolders.map((folder) => (
                  <div
                    key={`folder-${folder.id}`}
                    data-item-id={`folder-${folder.id}`}
                    onDragOver={(e) => handleFolderDragOver(e, folder.id)}
                    onDragLeave={handleFolderDragLeave}
                    onDrop={(e) => handleFolderDrop(e, folder.id)}
                    className={`bg-card border-2 rounded-xl overflow-hidden cursor-pointer transition-all duration-200 group hover:shadow-lg border-border/60 hover:border-blue-500/50 ${
                      dragOverFolder === folder.id ? 'bg-green-50 border-green-500 scale-105' : ''
                    }`}
                    onClick={() => {
                      setSelectedFolder(folder.id);
                      setSpecialView('all');
                    }}
                  >
                    {/* Folder Preview */}
                    <div className="aspect-square bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center relative">
                      <Folder className="w-16 h-16 text-blue-500" />
                    </div>

                    {/* Folder Info */}
                    <div className="p-3 border-t border-border/60">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{folder.name}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {folder.fileCount} files • {folder.size}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Render Files */}
                {filteredFiles.map((file) => {
                  const FileIcon = getFileIcon(file.type);
                  const color = getFileColor(file.type);
                  const isSelected = selectedFiles.includes(file.id);

                  return (
                    <div
                      key={file.id}
                      data-item-id={file.id}
                      draggable={!file.deletedAt}
                      onDragStart={(e) => handleFileDragStart(e, file.id)}
                      onDragEnd={handleFileDragEnd}
                      className={`bg-card border-2 rounded-xl overflow-hidden cursor-pointer transition-all duration-200 group hover:shadow-lg ${
                        isSelected ? 'border-blue-500 shadow-lg shadow-blue-500/20' : 'border-border/60 hover:border-blue-500/50'
                      } ${file.deletedAt ? 'opacity-60 hover:opacity-80' : ''} ${draggedFiles.includes(file.id) ? 'opacity-50' : ''}`}
                      onContextMenu={(e) => handleContextMenu(e, file)}
                      onMouseEnter={(e) => handleMouseEnter(e, file)}
                      onMouseLeave={handleMouseLeave}
                    >
                      {/* Preview */}
                      <div 
                        className="aspect-square bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center relative"
                        onClick={() => setPreviewFile(file)}
                        onDoubleClick={() => openLightbox(file)}
                      >
                        {file.type === 'image' && file.url ? (
                          <img src={file.url} alt={file.name} className="w-full h-full object-cover" />
                        ) : file.type === 'video' && file.url ? (
                          <div className="relative w-full h-full">
                            <img src={file.url} alt={file.name} className="w-full h-full object-cover opacity-60" />
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="p-3 bg-white/90 backdrop-blur-sm rounded-full">
                                <Play className="w-6 h-6 text-red-600" />
                              </div>
                            </div>
                          </div>
                        ) : (
                          <FileIcon className={`w-12 h-12 text-${color}-500`} />
                        )}

                        {/* Checkbox */}
                        <div 
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFileSelection(file.id);
                          }}
                          className={`absolute top-2 left-2 w-5 h-5 border-2 rounded-md flex items-center justify-center transition-all duration-200 ${
                            isSelected ? 'bg-blue-500 border-blue-500' : 'bg-white/90 border-white/90 opacity-0 group-hover:opacity-100'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3 text-white" />}
                        </div>

                        {/* Star */}
                        {!file.deletedAt && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleStar(file.id);
                            }}
                            className="absolute top-2 right-2 p-1.5 bg-white/90 backdrop-blur-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                          >
                            <Star className={`w-3.5 h-3.5 ${file.isStarred ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600'}`} />
                          </button>
                        )}

                        {/* Trash Badge */}
                        {file.deletedAt && (
                          <div className="absolute top-2 right-2 px-2 py-1 bg-red-500 text-white text-xs font-medium rounded-md flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {getDaysUntilAutoDelete(file.deletedAt)} ngày
                          </div>
                        )}

                        {/* Duration/Dimensions */}
                        {(file.duration || file.dimensions) && (
                          <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/70 backdrop-blur-sm rounded text-white text-xs font-medium">
                            {file.duration || file.dimensions}
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="p-3">
                        <div className="font-medium text-sm truncate mb-1">{file.name}</div>
                        <div className="text-xs text-muted-foreground">{file.size}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div 
                ref={listContainerRef}
                className="bg-card border border-border/60 rounded-2xl overflow-hidden relative select-none"
                onMouseDown={listMarquee.handleMouseDown}
              >
                {listMarquee.renderSelectionBox()}
                <table className="w-full">
                  <thead className="bg-muted/30 border-b border-border/60">
                    <tr>
                      <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground w-12">
                        <input 
                          type="checkbox" 
                          className="rounded" 
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedFiles(filteredFiles.map(f => f.id));
                            } else {
                              setSelectedFiles([]);
                            }
                          }}
                        />
                      </th>
                      <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">Tên file</th>
                      <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">Người tải</th>
                      <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">Ngày tải</th>
                      <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">Kích thước</th>
                      <th className="text-right px-6 py-3 text-sm font-medium text-muted-foreground">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {/* Render Folders First (Google Drive style) */}
                    {currentSubfolders.map((folder) => (
                      <tr 
                        key={`folder-${folder.id}`}
                        data-item-id={`folder-${folder.id}`}
                        onDragOver={(e) => handleFolderDragOver(e, folder.id)}
                        onDragLeave={handleFolderDragLeave}
                        onDrop={(e) => handleFolderDrop(e, folder.id)}
                        onClick={() => {
                          setSelectedFolder(folder.id);
                          setSpecialView('all');
                        }}
                        className={`hover:bg-muted/30 transition-colors cursor-pointer ${
                          dragOverFolder === folder.id ? 'bg-green-50' : ''
                        }`}
                      >
                        <td className="px-6 py-4">
                          {/* Empty checkbox column for folders */}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-50 rounded-lg">
                              <Folder className="w-5 h-5 text-blue-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium truncate">{folder.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">—</td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">—</td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">
                          {folder.fileCount} files • {folder.size}
                        </td>
                        <td className="px-6 py-4"></td>
                      </tr>
                    ))}
                    
                    {/* Render Files */}
                    {filteredFiles.map((file) => {
                      const FileIcon = getFileIcon(file.type);
                      const color = getFileColor(file.type);
                      const isSelected = selectedFiles.includes(file.id);

                      return (
                        <tr 
                          data-item-id={file.id} 
                          key={file.id}
                          draggable={!file.deletedAt}
                          onDragStart={(e) => handleFileDragStart(e, file.id)}
                          onDragEnd={handleFileDragEnd}
                          className={`hover:bg-muted/30 transition-colors ${isSelected ? 'bg-blue-50' : ''} ${file.deletedAt ? 'opacity-60 hover:opacity-80' : ''} ${draggedFiles.includes(file.id) ? 'opacity-50' : ''}`}
                        >
                          <td className="px-6 py-4">
                            <input 
                              type="checkbox" 
                              checked={isSelected}
                              onChange={() => toggleFileSelection(file.id)}
                              className="rounded" 
                            />
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className={`p-2 bg-${color}-50 rounded-lg`}>
                                <FileIcon className={`w-5 h-5 text-${color}-600`} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="font-medium truncate flex items-center gap-2">
                                  {file.name}
                                  {file.isStarred && !file.deletedAt && (
                                    <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400 flex-shrink-0" />
                                  )}
                                  {file.deletedAt && (
                                    <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-medium rounded flex items-center gap-1 flex-shrink-0">
                                      <Clock className="w-3 h-3" />
                                      {getDaysUntilAutoDelete(file.deletedAt)} ngày còn lại
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                                {file.uploadedBy.charAt(0)}
                              </div>
                              <span className="text-sm">{file.uploadedBy}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-muted-foreground">{file.uploadedAt}</td>
                          <td className="px-6 py-4 text-sm text-muted-foreground">{file.size}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-end gap-1">
                              {file.deletedAt ? (
                                /* Trash Actions */
                                <>
                                  <button 
                                    onClick={() => handleRestore([file.id])}
                                    className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors" 
                                    title="Khôi phục"
                                  >
                                    <RefreshCw className="w-4 h-4" />
                                  </button>
                                  <button 
                                    onClick={() => handlePermanentDelete([file.id])}
                                    className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors" 
                                    title="Xóa vĩnh viễn"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </>
                              ) : (
                                /* Normal Actions */
                                <>
                                  <button 
                                    onClick={() => setPreviewFile(file)}
                                    className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors" 
                                    title="Xem chi tiết"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </button>
                                  <button className="p-2 hover:bg-green-50 text-green-600 rounded-lg transition-colors" title="Tải xuống">
                                    <Download className="w-4 h-4" />
                                  </button>
                                  <button 
                                    onClick={() => {
                                      if (file.type === 'image') {
                                        openImageEditor(file);
                                      } else {
                                        handleEdit(file);
                                      }
                                    }}
                                    className="p-2 hover:bg-gray-50 rounded-lg transition-colors" 
                                    title={file.type === 'image' ? 'Chỉnh sửa ảnh' : 'Chỉnh sửa'}
                                  >
                                    <Edit2 className="w-4 h-4" />
                                  </button>
                                  <button 
                                    onClick={() => handleDelete([file.id])}
                                    className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors" 
                                    title="Xóa"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
            </div>

            {/* Drag & Drop Overlay */}
            {isDragging && (
              <div className="fixed inset-0 bg-blue-500/10 backdrop-blur-sm z-40 flex items-center justify-center pointer-events-none">
                <div className="bg-card border-4 border-dashed border-blue-500 rounded-3xl p-12 text-center">
                  <Upload className="w-20 h-20 text-blue-500 mx-auto mb-4 animate-bounce" />
                  <h3 className="text-2xl font-semibold mb-2">Thả files để upload</h3>
                  <p className="text-muted-foreground">Hỗ trợ nhiều files cùng lúc</p>
                </div>
              </div>
            )}
          </div>
        </main>

        {/* Preview Panel - Google Drive Style */}
        {previewFile && (
          <aside className="fixed right-0 top-16 bottom-0 w-96 bg-card border-l border-border/60 shadow-2xl z-30 overflow-y-auto animate-in slide-in-from-right duration-300">
            <div className="p-6 space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg">Chi tiết file</h3>
                <button
                  onClick={() => setPreviewFile(null)}
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Preview Image/Video */}
              <div 
                className="aspect-video bg-gradient-to-br from-muted to-muted/50 rounded-xl overflow-hidden flex items-center justify-center cursor-pointer relative group"
                onClick={() => openLightbox(previewFile)}
              >
                {previewFile.type === 'image' && previewFile.url ? (
                  <>
                    <img src={previewFile.url} alt={previewFile.name} className="w-full h-full object-contain" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity p-3 bg-white/90 backdrop-blur-sm rounded-full">
                        <Maximize2 className="w-6 h-6" />
                      </div>
                    </div>
                  </>
                ) : previewFile.type === 'video' && previewFile.url ? (
                  <div className="relative w-full h-full">
                    <img src={previewFile.url} alt={previewFile.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <button className="p-6 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors">
                        <Play className="w-10 h-10 text-red-600" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    {React.createElement(getFileIcon(previewFile.type), { className: 'w-20 h-20 text-muted-foreground mx-auto mb-3' })}
                    <p className="text-sm text-muted-foreground">{previewFile.name}</p>
                  </div>
                )}
              </div>

              {/* File Name */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  {React.createElement(getFileIcon(previewFile.type), { className: `w-5 h-5 text-${getFileColor(previewFile.type)}-600` })}
                  <h4 className="font-semibold">{previewFile.name}</h4>
                </div>
                {previewFile.description && (
                  <p className="text-sm text-muted-foreground">{previewFile.description}</p>
                )}
              </div>

              {/* View Fullscreen Button */}
              <button
                onClick={() => openLightbox(previewFile)}
                className="w-full px-4 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl hover:shadow-lg hover:shadow-purple-500/20 transition-all flex items-center justify-center gap-2 font-medium"
              >
                <Maximize2 className="w-5 h-5" />
                Xem toàn màn hình
              </button>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2">
                <button className="px-4 py-2.5 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 font-medium">
                  <Download className="w-4 h-4" />
                  Tải xuống
                </button>
                <button className="px-4 py-2.5 border border-border/60 rounded-xl hover:bg-muted/50 transition-colors flex items-center justify-center gap-2 font-medium">
                  <Share2 className="w-4 h-4" />
                  Chia sẻ
                </button>
                <button 
                  onClick={() => {
                    if (previewFile.type === 'image') {
                      openImageEditor(previewFile);
                    } else {
                      handleEdit(previewFile);
                    }
                    setPreviewFile(null);
                  }}
                  className="px-4 py-2.5 border border-border/60 rounded-xl hover:bg-muted/50 transition-colors flex items-center justify-center gap-2 font-medium"
                >
                  <Edit2 className="w-4 h-4" />
                  {previewFile.type === 'image' ? 'Chỉnh sửa ảnh' : 'Chỉnh sửa'}
                </button>
                <button 
                  onClick={() => {
                    handleDelete([previewFile.id]);
                    setPreviewFile(null);
                  }}
                  className="px-4 py-2.5 border border-red-200 text-red-600 rounded-xl hover:bg-red-50 transition-colors flex items-center justify-center gap-2 font-medium"
                >
                  <Trash2 className="w-4 h-4" />
                  Xóa
                </button>
              </div>

              {/* Star Toggle */}
              <button
                onClick={() => toggleStar(previewFile.id)}
                className="w-full px-4 py-2.5 border border-border/60 rounded-xl hover:bg-muted/50 transition-colors flex items-center justify-center gap-2 font-medium"
              >
                <Star className={`w-4 h-4 ${previewFile.isStarred ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                {previewFile.isStarred ? 'Bỏ đánh dấu' : 'Đánh dấu'}
              </button>

              {/* File Info */}
              <div className="space-y-3 pt-4 border-t border-border/60">
                <h4 className="font-semibold text-sm">Thông tin file</h4>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between py-2 border-b border-border/60">
                    <span className="text-muted-foreground">Loại</span>
                    <span className={`px-2.5 py-1 bg-${getFileColor(previewFile.type)}-50 text-${getFileColor(previewFile.type)}-700 rounded-full text-xs font-medium capitalize`}>
                      {previewFile.type}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-2 border-b border-border/60">
                    <span className="text-muted-foreground">Kích thước</span>
                    <span className="font-medium">{previewFile.size}</span>
                  </div>

                  {previewFile.dimensions && (
                    <div className="flex items-center justify-between py-2 border-b border-border/60">
                      <span className="text-muted-foreground">Kích thước ảnh</span>
                      <span className="font-medium">{previewFile.dimensions}</span>
                    </div>
                  )}

                  {previewFile.duration && (
                    <div className="flex items-center justify-between py-2 border-b border-border/60">
                      <span className="text-muted-foreground">Thời lượng</span>
                      <span className="font-medium">{previewFile.duration}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between py-2 border-b border-border/60">
                    <span className="text-muted-foreground">Thư mục</span>
                    <span className="font-medium">{previewFile.folder}</span>
                  </div>

                  <div className="flex items-center justify-between py-2 border-b border-border/60">
                    <span className="text-muted-foreground">Người tải</span>
                    <span className="font-medium">{previewFile.uploadedBy}</span>
                  </div>

                  <div className="flex items-center justify-between py-2">
                    <span className="text-muted-foreground">Ngày tải</span>
                    <span className="font-medium">{previewFile.uploadedAt}</span>
                  </div>
                </div>
              </div>

              {/* Tags */}
              {previewFile.tags && previewFile.tags.length > 0 && (
                <div className="pt-4 border-t border-border/60">
                  <h4 className="font-semibold text-sm mb-3">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {previewFile.tags.map((tag, idx) => (
                      <span key={idx} className="px-3 py-1.5 bg-secondary rounded-lg text-sm">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Actions */}
              <div className="pt-4 border-t border-border/60">
                <h4 className="font-semibold text-sm mb-3">Thao tác nhanh</h4>
                <div className="space-y-2">
                  <button className="w-full px-4 py-2.5 bg-secondary rounded-xl hover:bg-muted transition-colors flex items-center gap-3">
                    <Copy className="w-4 h-4" />
                    <span className="text-sm">Copy link</span>
                  </button>
                  <button className="w-full px-4 py-2.5 bg-secondary rounded-xl hover:bg-muted transition-colors flex items-center gap-3">
                    <ExternalLink className="w-4 h-4" />
                    <span className="text-sm">Mở trong tab mới</span>
                  </button>
                  <button 
                    onClick={() => {
                      handleMove([previewFile.id]);
                      setPreviewFile(null);
                    }}
                    className="w-full px-4 py-2.5 bg-secondary rounded-xl hover:bg-muted transition-colors flex items-center gap-3"
                  >
                    <Move className="w-4 h-4" />
                    <span className="text-sm">Di chuyển</span>
                  </button>
                </div>
              </div>
            </div>
          </aside>
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Upload Files</h2>
              <button
                onClick={() => setShowUploadModal(false)}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileInput}
              className="hidden"
            />

            <div 
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDropModal}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-12 text-center transition-all duration-200 cursor-pointer ${
                dragActive 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-border/60 hover:border-blue-500/50 hover:bg-muted/30'
              }`}
            >
              <Upload className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">
                {dragActive ? 'Thả files vào đây' : 'Kéo thả files vào đây'}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">hoặc click để chọn files từ máy tính</p>
              <p className="text-xs text-muted-foreground">
                Hỗ trợ: JPG, PNG, GIF, MP4, MP3, PDF, DOC, DOCX (max 100MB/file)
              </p>
            </div>

            {isUploading && (
              <div className="mt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Đang upload...</span>
                  <span className="text-sm text-muted-foreground">{uploadProgress}%</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            <div className="mt-6 pt-6 border-t border-border/60 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowUploadModal(false)}
                className="px-6 py-3 border border-border/60 rounded-xl hover:bg-muted/50 transition-all duration-200 font-medium"
              >
                Hủy
              </button>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-200 font-medium"
              >
                Chọn files
              </button>
            </div>
          </Card>
        </div>
      )}

      {/* File Detail Modal */}
      {showFileDetail && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <Card className="max-w-5xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Chi tiết file</h2>
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors" title="Tải xuống">
                  <Download className="w-5 h-5" />
                </button>
                <button className="p-2 hover:bg-purple-50 text-purple-600 rounded-lg transition-colors" title="Chia sẻ">
                  <Share2 className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => handleEdit(showFileDetail)}
                  className="p-2 hover:bg-gray-50 rounded-lg transition-colors" 
                  title="Chỉnh sửa"
                >
                  <Edit2 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setShowFileDetail(null)}
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Preview */}
              <div>
                <div className="aspect-video bg-gradient-to-br from-muted to-muted/50 rounded-xl overflow-hidden flex items-center justify-center">
                  {showFileDetail.type === 'image' && showFileDetail.url ? (
                    <img src={showFileDetail.url} alt={showFileDetail.name} className="w-full h-full object-contain" />
                  ) : showFileDetail.type === 'video' && showFileDetail.url ? (
                    <div className="relative w-full h-full">
                      <img src={showFileDetail.url} alt={showFileDetail.name} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <button className="p-6 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors">
                          <Play className="w-10 h-10 text-red-600" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      {React.createElement(getFileIcon(showFileDetail.type), { className: 'w-24 h-24 text-muted-foreground mx-auto mb-4' })}
                      <p className="text-sm text-muted-foreground">Không có preview</p>
                    </div>
                  )}
                </div>

                {/* Quick Actions */}
                <div className="mt-4 flex items-center gap-2">
                  <button className="flex-1 px-4 py-2.5 bg-secondary rounded-xl hover:bg-muted transition-colors flex items-center justify-center gap-2">
                    <Copy className="w-4 h-4" />
                    <span>Copy link</span>
                  </button>
                  <button className="flex-1 px-4 py-2.5 bg-secondary rounded-xl hover:bg-muted transition-colors flex items-center justify-center gap-2">
                    <ExternalLink className="w-4 h-4" />
                    <span>Mở</span>
                  </button>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-4">Thông tin file</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between py-2 border-b border-border/60">
                      <span className="text-sm text-muted-foreground">Tên file</span>
                      <span className="text-sm font-medium">{showFileDetail.name}</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-border/60">
                      <span className="text-sm text-muted-foreground">Loại</span>
                      <span className={`px-3 py-1 bg-${getFileColor(showFileDetail.type)}-50 text-${getFileColor(showFileDetail.type)}-700 rounded-full text-xs font-medium capitalize`}>
                        {showFileDetail.type}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-border/60">
                      <span className="text-sm text-muted-foreground">Kích thước</span>
                      <span className="text-sm font-medium">{showFileDetail.size}</span>
                    </div>
                    {showFileDetail.dimensions && (
                      <div className="flex items-center justify-between py-2 border-b border-border/60">
                        <span className="text-sm text-muted-foreground">Kích thước ảnh</span>
                        <span className="text-sm font-medium">{showFileDetail.dimensions}</span>
                      </div>
                    )}
                    {showFileDetail.duration && (
                      <div className="flex items-center justify-between py-2 border-b border-border/60">
                        <span className="text-sm text-muted-foreground">Thời lượng</span>
                        <span className="text-sm font-medium">{showFileDetail.duration}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between py-2 border-b border-border/60">
                      <span className="text-sm text-muted-foreground">Thư mục</span>
                      <span className="text-sm font-medium">{showFileDetail.folder}</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-border/60">
                      <span className="text-sm text-muted-foreground">Người tải</span>
                      <span className="text-sm font-medium">{showFileDetail.uploadedBy}</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-border/60">
                      <span className="text-sm text-muted-foreground">Ngày tải</span>
                      <span className="text-sm font-medium">{showFileDetail.uploadedAt}</span>
                    </div>
                  </div>
                </div>

                {showFileDetail.description && (
                  <div>
                    <h3 className="font-semibold mb-2">Mô tả</h3>
                    <p className="text-sm text-muted-foreground">{showFileDetail.description}</p>
                  </div>
                )}

                {showFileDetail.tags && showFileDetail.tags.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {showFileDetail.tags.map((tag, idx) => (
                        <span key={idx} className="px-3 py-1.5 bg-secondary rounded-lg text-sm">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="font-semibold mb-3">AI Tools</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <button className="px-4 py-2.5 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl hover:shadow-md transition-all flex items-center justify-center gap-2">
                      <Wand2 className="w-4 h-4 text-purple-600" />
                      <span className="text-sm font-medium text-purple-700">Generate Caption</span>
                    </button>
                    <button className="px-4 py-2.5 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl hover:shadow-md transition-all flex items-center justify-center gap-2">
                      <Tag className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-700">Auto Tag</span>
                    </button>
                    <button className="px-4 py-2.5 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl hover:shadow-md transition-all flex items-center justify-center gap-2">
                      <Crop className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-green-700">Smart Crop</span>
                    </button>
                    <button className="px-4 py-2.5 bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl hover:shadow-md transition-all flex items-center justify-center gap-2">
                      <Palette className="w-4 h-4 text-orange-600" />
                      <span className="text-sm font-medium text-orange-700">AI Enhance</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Upload Queue Panel */}
      {uploadQueue.length > 0 && (
        <div className="fixed bottom-6 right-6 z-50 w-96 max-h-96 overflow-y-auto">
          <Card className="p-4 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Upload className="w-5 h-5 text-blue-500" />
                Đang upload ({uploadQueue.length})
              </h3>
              <button
                onClick={() => setUploadQueue([])}
                className="p-1 hover:bg-muted rounded transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              {uploadQueue.map(upload => (
                <div key={upload.id} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="truncate flex-1 pr-2">{upload.name}</span>
                    <span className={`text-xs font-medium ${
                      upload.status === 'complete' ? 'text-green-600' :
                      upload.status === 'error' ? 'text-red-600' :
                      'text-blue-600'
                    }`}>
                      {upload.status === 'complete' && '✓ Hoàn thành'}
                      {upload.status === 'uploading' && `${upload.progress}%`}
                      {upload.status === 'pending' && 'Đang chờ...'}
                      {upload.status === 'error' && '✗ Lỗi'}
                    </span>
                  </div>
                  {upload.status === 'uploading' && (
                    <div className="w-full bg-secondary rounded-full h-1.5">
                      <div 
                        className="bg-blue-500 h-1.5 rounded-full transition-all duration-200"
                        style={{ width: `${upload.progress}%` }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Advanced Filters Panel */}
      {showAdvancedFilters && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40" onClick={toggleAdvancedFilters}>
          <div 
            className="fixed right-0 top-16 bottom-0 w-96 bg-card border-l border-border/60 shadow-2xl p-6 overflow-y-auto animate-slide-in-right"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5" />
                Bộ lọc nâng cao
              </h3>
              <button
                onClick={toggleAdvancedFilters}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Date Range */}
              <div>
                <label className="block text-sm font-medium mb-2">Ngày tải lên</label>
                <div className="space-y-2">
                  <input
                    type="date"
                    value={advancedFilters.dateFrom}
                    onChange={(e) => handleAdvancedFilterChange('dateFrom', e.target.value)}
                    className="w-full px-3 py-2 bg-muted/50 border border-border/60 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    placeholder="Từ ngày"
                  />
                  <input
                    type="date"
                    value={advancedFilters.dateTo}
                    onChange={(e) => handleAdvancedFilterChange('dateTo', e.target.value)}
                    className="w-full px-3 py-2 bg-muted/50 border border-border/60 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    placeholder="Đến ngày"
                  />
                </div>
              </div>

              {/* File Size Range */}
              <div>
                <label className="block text-sm font-medium mb-2">Kích thước (MB)</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    value={advancedFilters.sizeMin}
                    onChange={(e) => handleAdvancedFilterChange('sizeMin', e.target.value)}
                    className="px-3 py-2 bg-muted/50 border border-border/60 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    placeholder="Min"
                  />
                  <input
                    type="number"
                    value={advancedFilters.sizeMax}
                    onChange={(e) => handleAdvancedFilterChange('sizeMax', e.target.value)}
                    className="px-3 py-2 bg-muted/50 border border-border/60 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    placeholder="Max"
                  />
                </div>
              </div>

              {/* File Types */}
              <div>
                <label className="block text-sm font-medium mb-2">Loại file</label>
                <div className="space-y-2">
                  {['image', 'video', 'audio', 'document'].map(type => (
                    <label key={type} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={advancedFilters.fileTypes.includes(type)}
                        onChange={() => toggleFileTypeFilter(type)}
                        className="w-4 h-4 text-blue-500 rounded focus:ring-2 focus:ring-blue-500/20"
                      />
                      <span className="text-sm capitalize">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Uploader */}
              <div>
                <label className="block text-sm font-medium mb-2">Người upload</label>
                <input
                  type="text"
                  value={advancedFilters.uploader}
                  onChange={(e) => handleAdvancedFilterChange('uploader', e.target.value)}
                  className="w-full px-3 py-2 bg-muted/50 border border-border/60 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  placeholder="Tên người upload..."
                />
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-4 border-t border-border/60">
                <button
                  onClick={clearAdvancedFilters}
                  className="flex-1 px-4 py-2.5 border border-border/60 rounded-lg hover:bg-muted/50 transition-colors font-medium"
                >
                  Xóa bộ lọc
                </button>
                <button
                  onClick={toggleAdvancedFilters}
                  className="flex-1 px-4 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
                >
                  Áp dụng
                </button>
              </div>

              {/* Active Filters Summary */}
              {hasActiveAdvancedFilters && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-xs font-medium text-blue-900 mb-2">Bộ lọc đang áp dụng:</p>
                  <div className="space-y-1 text-xs text-blue-700">
                    {advancedFilters.dateFrom && <div>• Từ: {advancedFilters.dateFrom}</div>}
                    {advancedFilters.dateTo && <div>• Đến: {advancedFilters.dateTo}</div>}
                    {advancedFilters.sizeMin && <div>• Min: {advancedFilters.sizeMin} MB</div>}
                    {advancedFilters.sizeMax && <div>• Max: {advancedFilters.sizeMax} MB</div>}
                    {advancedFilters.fileTypes.length > 0 && (
                      <div>• Loại: {advancedFilters.fileTypes.join(', ')}</div>
                    )}
                    {advancedFilters.uploader && <div>• Uploader: {advancedFilters.uploader}</div>}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Context Menu */}
      {contextMenu && (
        <div
          className="fixed z-50 bg-card border border-border/60 rounded-xl shadow-2xl py-2 min-w-[200px] animate-scale-in"
          style={{
            left: `${contextMenu.x}px`,
            top: `${contextMenu.y}px`,
          }}
        >
          {contextMenu.file.deletedAt ? (
            /* Trash Context Menu */
            <>
              <button
                onClick={() => {
                  handleRestore([contextMenu.file.id]);
                  closeContextMenu();
                }}
                className="w-full px-4 py-2.5 hover:bg-blue-50 text-blue-600 transition-colors flex items-center gap-3 text-left font-medium"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Khôi phục</span>
              </button>

              <div className="h-px bg-border/60 my-2" />

              <button
                onClick={() => {
                  handlePermanentDelete([contextMenu.file.id]);
                  closeContextMenu();
                }}
                className="w-full px-4 py-2.5 hover:bg-red-50 text-red-600 transition-colors flex items-center gap-3 text-left font-medium"
              >
                <Trash2 className="w-4 h-4" />
                <span>Xóa vĩnh viễn</span>
              </button>

              <div className="px-4 py-3 border-t border-border/60 mt-2">
                <p className="text-xs text-muted-foreground">
                  Đã xóa {contextMenu.file.deletedAt}
                </p>
                <p className="text-xs text-muted-foreground">
                  bởi {contextMenu.file.deletedBy}
                </p>
              </div>
            </>
          ) : (
            /* Normal Context Menu */
            <>
              <button
                onClick={() => {
                  openLightbox(contextMenu.file);
                  closeContextMenu();
                }}
                className="w-full px-4 py-2.5 hover:bg-muted/50 transition-colors flex items-center gap-3 text-left"
              >
                <Maximize2 className="w-4 h-4" />
                <span>Mở</span>
              </button>
              
              <button
                onClick={() => {
                  alert(`Tải xuống ${contextMenu.file.name}`);
                  closeContextMenu();
                }}
                className="w-full px-4 py-2.5 hover:bg-muted/50 transition-colors flex items-center gap-3 text-left"
              >
                <Download className="w-4 h-4" />
                <span>Tải xuống</span>
              </button>

              <button
                onClick={() => {
                  alert(`Chia sẻ ${contextMenu.file.name}`);
                  closeContextMenu();
                }}
                className="w-full px-4 py-2.5 hover:bg-muted/50 transition-colors flex items-center gap-3 text-left"
              >
                <Share2 className="w-4 h-4" />
                <span>Chia sẻ</span>
              </button>

              <div className="h-px bg-border/60 my-2" />

              <button
                onClick={() => {
                  if (contextMenu.file.type === 'image') {
                    openImageEditor(contextMenu.file);
                  } else {
                    handleEdit(contextMenu.file);
                  }
                  closeContextMenu();
                }}
                className="w-full px-4 py-2.5 hover:bg-muted/50 transition-colors flex items-center gap-3 text-left"
              >
                <Edit2 className="w-4 h-4" />
                <span>{contextMenu.file.type === 'image' ? 'Chỉnh sửa ảnh' : 'Chỉnh sửa'}</span>
              </button>

              <button
                onClick={() => {
                  handleMove([contextMenu.file.id]);
                  closeContextMenu();
                }}
                className="w-full px-4 py-2.5 hover:bg-muted/50 transition-colors flex items-center gap-3 text-left"
              >
                <Move className="w-4 h-4" />
                <span>Di chuyển</span>
              </button>

              <button
                onClick={() => {
                  toggleStar(contextMenu.file.id);
                  closeContextMenu();
                }}
                className="w-full px-4 py-2.5 hover:bg-muted/50 transition-colors flex items-center gap-3 text-left"
              >
                <Star className={`w-4 h-4 ${contextMenu.file.isStarred ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                <span>{contextMenu.file.isStarred ? 'Bỏ đánh dấu' : 'Đánh dấu'}</span>
              </button>

              <div className="h-px bg-border/60 my-2" />

              <button
                onClick={() => {
                  handleDelete([contextMenu.file.id]);
                  closeContextMenu();
                }}
                className="w-full px-4 py-2.5 hover:bg-red-50 text-red-600 transition-colors flex items-center gap-3 text-left"
              >
                <Trash2 className="w-4 h-4" />
                <span>Xóa</span>
              </button>
            </>
          )}
        </div>
      )}

      {/* Hover Preview Tooltip */}
      {hoverPreview && (
        <div
          className="fixed z-50 pointer-events-none"
          style={{
            left: `${hoverPreview.x}px`,
            top: `${hoverPreview.y}px`,
          }}
        >
          <Card className="p-3 shadow-2xl max-w-xs animate-scale-in">
            {/* Preview Thumbnail */}
            <div className="aspect-video bg-gradient-to-br from-muted to-muted/50 rounded-lg overflow-hidden mb-3">
              {hoverPreview.file.type === 'image' && hoverPreview.file.url ? (
                <img 
                  src={hoverPreview.file.url} 
                  alt={hoverPreview.file.name} 
                  className="w-full h-full object-cover" 
                />
              ) : hoverPreview.file.type === 'video' && hoverPreview.file.url ? (
                <div className="relative w-full h-full">
                  <img 
                    src={hoverPreview.file.url} 
                    alt={hoverPreview.file.name} 
                    className="w-full h-full object-cover" 
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="p-2 bg-white/90 backdrop-blur-sm rounded-full">
                      <Play className="w-4 h-4 text-red-600" />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  {React.createElement(getFileIcon(hoverPreview.file.type), { 
                    className: `w-12 h-12 text-${getFileColor(hoverPreview.file.type)}-500` 
                  })}
                </div>
              )}
            </div>

            {/* File Info */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                {React.createElement(getFileIcon(hoverPreview.file.type), { 
                  className: `w-4 h-4 text-${getFileColor(hoverPreview.file.type)}-600` 
                })}
                <p className="font-semibold text-sm truncate">{hoverPreview.file.name}</p>
              </div>
              
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span>{hoverPreview.file.size}</span>
                {hoverPreview.file.dimensions && (
                  <>
                    <span>•</span>
                    <span>{hoverPreview.file.dimensions}</span>
                  </>
                )}
                {hoverPreview.file.duration && (
                  <>
                    <span>•</span>
                    <span>{hoverPreview.file.duration}</span>
                  </>
                )}
              </div>

              {hoverPreview.file.tags && hoverPreview.file.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 pt-2 border-t border-border/60">
                  {hoverPreview.file.tags.slice(0, 3).map((tag, idx) => (
                    <span 
                      key={idx} 
                      className="px-2 py-0.5 bg-secondary rounded text-xs"
                    >
                      #{tag}
                    </span>
                  ))}
                  {hoverPreview.file.tags.length > 3 && (
                    <span className="text-xs text-muted-foreground">
                      +{hoverPreview.file.tags.length - 3}
                    </span>
                  )}
                </div>
              )}
            </div>
          </Card>
        </div>
      )}

      {/* Full-screen Lightbox */}
      {showLightbox && filteredFiles[lightboxIndex] && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-md z-[60] flex items-center justify-center">
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          {/* File Counter */}
          <div className="absolute top-4 left-4 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white font-medium z-10">
            {lightboxIndex + 1} / {filteredFiles.length}
          </div>

          {/* Navigation Arrows */}
          {lightboxIndex > 0 && (
            <button
              onClick={prevFile}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-4 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10"
            >
              <ChevronRight className="w-8 h-8 text-white rotate-180" />
            </button>
          )}

          {lightboxIndex < filteredFiles.length - 1 && (
            <button
              onClick={nextFile}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-4 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10"
            >
              <ChevronRight className="w-8 h-8 text-white" />
            </button>
          )}

          {/* Zoom Controls */}
          {filteredFiles[lightboxIndex].type === 'image' && (
            <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full p-2 z-10">
              <button
                onClick={zoomOut}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
                disabled={zoomLevel <= 0.5}
              >
                <ZoomIn className="w-5 h-5 text-white rotate-180" />
              </button>
              <span className="text-white font-medium px-2">{Math.round(zoomLevel * 100)}%</span>
              <button
                onClick={zoomIn}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
                disabled={zoomLevel >= 3}
              >
                <ZoomIn className="w-5 h-5 text-white" />
              </button>
            </div>
          )}

          {/* File Info Bar */}
          <div className="absolute bottom-4 left-4 bg-white/10 backdrop-blur-sm rounded-2xl p-4 max-w-md z-10">
            <div className="flex items-center gap-3 mb-2">
              {React.createElement(getFileIcon(filteredFiles[lightboxIndex].type), { 
                className: `w-5 h-5 text-white` 
              })}
              <span className="text-white font-semibold">{filteredFiles[lightboxIndex].name}</span>
            </div>
            <div className="flex items-center gap-4 text-sm text-white/80">
              <span>{filteredFiles[lightboxIndex].size}</span>
              {filteredFiles[lightboxIndex].dimensions && (
                <>
                  <span>•</span>
                  <span>{filteredFiles[lightboxIndex].dimensions}</span>
                </>
              )}
              {filteredFiles[lightboxIndex].duration && (
                <>
                  <span>•</span>
                  <span>{filteredFiles[lightboxIndex].duration}</span>
                </>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="w-full h-full flex items-center justify-center p-20">
            {filteredFiles[lightboxIndex].type === 'image' && filteredFiles[lightboxIndex].url ? (
              <img 
                src={filteredFiles[lightboxIndex].url} 
                alt={filteredFiles[lightboxIndex].name} 
                className="max-w-full max-h-full object-contain transition-transform duration-200"
                style={{ transform: `scale(${zoomLevel})` }}
              />
            ) : filteredFiles[lightboxIndex].type === 'video' && filteredFiles[lightboxIndex].url ? (
              <div className="relative max-w-5xl w-full aspect-video">
                <img 
                  src={filteredFiles[lightboxIndex].url} 
                  alt={filteredFiles[lightboxIndex].name} 
                  className="w-full h-full object-cover rounded-xl"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <button className="p-8 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors hover:scale-110">
                    <Play className="w-16 h-16 text-red-600" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center">
                {React.createElement(getFileIcon(filteredFiles[lightboxIndex].type), { 
                  className: 'w-32 h-32 text-white/50 mx-auto mb-6' 
                })}
                <p className="text-white text-lg">{filteredFiles[lightboxIndex].name}</p>
                <p className="text-white/60 mt-2">Preview không khả dụng</p>
              </div>
            )}
          </div>

          {/* Keyboard Hints */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-4 text-white/60 text-sm">
            <span className="flex items-center gap-1">
              <kbd className="px-2 py-1 bg-white/10 rounded">←</kbd>
              <kbd className="px-2 py-1 bg-white/10 rounded">→</kbd>
              Navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-2 py-1 bg-white/10 rounded">ESC</kbd>
              Close
            </span>
            {filteredFiles[lightboxIndex].type === 'image' && (
              <span className="flex items-center gap-1">
                <kbd className="px-2 py-1 bg-white/10 rounded">+</kbd>
                <kbd className="px-2 py-1 bg-white/10 rounded">-</kbd>
                Zoom
              </span>
            )}
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Chỉnh sửa file</h2>
              <button onClick={() => setShowEditModal(null)} className="p-2 hover:bg-muted rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Tên file</label>
                <input type="text" value={editForm.name} onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))} className="w-full px-4 py-3 bg-secondary border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Mô tả</label>
                <textarea value={editForm.description} onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))} rows={4} className="w-full px-4 py-3 bg-secondary border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none" placeholder="Nhập mô tả cho file..." />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Tags</label>
                <div className="flex gap-2 mb-3">
                  <input type="text" value={newTag} onChange={(e) => setNewTag(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleAddTag()} placeholder="Nhập tag mới..." className="flex-1 px-4 py-2.5 bg-secondary border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
                  <button onClick={handleAddTag} className="px-4 py-2.5 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Thêm
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {editForm.tags.map((tag, idx) => (
                    <span key={idx} className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-xl flex items-center gap-2">
                      #{tag}
                      <button onClick={() => handleRemoveTag(tag)} className="hover:text-red-600 transition-colors">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Thư mục</label>
                <select value={editForm.folder} onChange={(e) => setEditForm(prev => ({ ...prev, folder: e.target.value }))} className="w-full px-4 py-3 bg-secondary border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20">
                  {folders.filter(f => f.parent === null).map(folder => (
                    <option key={folder.id} value={folder.name}>{folder.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-border/60 flex items-center justify-end gap-3">
              <button onClick={() => setShowEditModal(null)} className="px-6 py-3 border border-border/60 rounded-xl hover:bg-muted/50 transition-all font-medium">Hủy</button>
              <button onClick={handleSaveEdit} className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/20 transition-all font-medium flex items-center gap-2">
                <Check className="w-4 h-4" />
                Lưu thay đổi
              </button>
            </div>
          </Card>
        </div>
      )}

      {/* Permanent Delete Modal */}
      {showDeleteModal.length > 0 && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <Card className="max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-red-50 rounded-xl">
                  <Trash2 className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">Xóa vĩnh viễn</h2>
                  <p className="text-sm text-muted-foreground mt-1">{showDeleteModal.length} file(s) sẽ bị xóa vĩnh viễn</p>
                </div>
              </div>
              <button onClick={() => setShowDeleteModal([])} className="p-2 hover:bg-muted rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
              <p className="text-sm text-red-800 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                <strong>CẢNH BÁO:</strong> Hành động này không thể hoàn tác. File sẽ bị xóa vĩnh viễn khỏi hệ thống.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button onClick={() => setShowDeleteModal([])} className="flex-1 px-6 py-3 border border-border/60 rounded-xl hover:bg-muted/50 transition-all font-medium">Hủy</button>
              <button onClick={handleConfirmPermanentDelete} className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:shadow-lg hover:shadow-red-500/20 transition-all font-medium flex items-center justify-center gap-2">
                <Trash2 className="w-4 h-4" />
                Xóa vĩnh viễn
              </button>
            </div>
          </Card>
        </div>
      )}

      {/* Move Modal */}
      {showMoveModal.length > 0 && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <Card className="max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-50 rounded-xl">
                  <Move className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">Di chuyển files</h2>
                  <p className="text-sm text-muted-foreground mt-1">Chọn thư mục đích cho {showMoveModal.length} file(s)</p>
                </div>
              </div>
              <button onClick={() => setShowMoveModal([])} className="p-2 hover:bg-muted rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 mb-6 max-h-96 overflow-y-auto">
              <label className="block text-sm font-medium mb-3">Chọn thư mục</label>
              {folders.filter(f => f.parent === null).map(folder => (
                <div key={folder.id}>
                  <button onClick={() => setTargetFolder(folder.id)} className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-center gap-3 ${targetFolder === folder.id ? 'bg-green-50 border-2 border-green-500' : 'bg-secondary border-2 border-transparent hover:border-green-200'}`}>
                    <Folder className={`w-5 h-5 ${targetFolder === folder.id ? 'text-green-600' : 'text-muted-foreground'}`} />
                    <div className="flex-1">
                      <div className="font-medium">{folder.name}</div>
                      <div className="text-xs text-muted-foreground">{folder.fileCount} files</div>
                    </div>
                    {targetFolder === folder.id && <Check className="w-5 h-5 text-green-600" />}
                  </button>
                  
                  {/* Subfolders */}
                  {folders.filter(f => f.parent === folder.id).map(subfolder => (
                    <button key={subfolder.id} onClick={() => setTargetFolder(subfolder.id)} className={`w-full text-left px-4 py-3 pl-12 rounded-xl transition-all flex items-center gap-3 ${targetFolder === subfolder.id ? 'bg-green-50 border-2 border-green-500' : 'bg-secondary border-2 border-transparent hover:border-green-200'}`}>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      <Folder className={`w-4 h-4 ${targetFolder === subfolder.id ? 'text-green-600' : 'text-muted-foreground'}`} />
                      <div className="flex-1">
                        <div className="font-medium text-sm">{subfolder.name}</div>
                        <div className="text-xs text-muted-foreground">{subfolder.fileCount} files</div>
                      </div>
                      {targetFolder === subfolder.id && <Check className="w-5 h-5 text-green-600" />}
                    </button>
                  ))}
                </div>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <button onClick={() => setShowMoveModal([])} className="flex-1 px-6 py-3 border border-border/60 rounded-xl hover:bg-muted/50 transition-all font-medium">Hủy</button>
              <button onClick={handleConfirmMove} disabled={targetFolder === null} className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:shadow-lg hover:shadow-green-500/20 transition-all font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                <Move className="w-4 h-4" />
                Di chuyển
              </button>
            </div>
          </Card>
        </div>
      )}

      {/* Image Editor Modal */}
      {showImageEditor && (
        <div className="fixed inset-0 bg-black z-50 flex flex-col">
          {/* Top Toolbar */}
          <div className="h-16 bg-black/80 backdrop-blur-sm border-b border-white/10 flex items-center justify-between px-6">
            <div className="flex items-center gap-4">
              <button
                onClick={closeImageEditor}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
              <h2 className="text-white font-semibold text-lg">{showImageEditor.name}</h2>
            </div>

            {/* Tab Navigation */}
            <div className="flex items-center gap-2 bg-white/5 p-1 rounded-lg">
              <button
                onClick={() => setEditorTab('adjust')}
                className={`px-4 py-2 rounded-md transition-all ${
                  editorTab === 'adjust' ? 'bg-blue-500 text-white' : 'text-white/70 hover:text-white'
                }`}
              >
                <SlidersHorizontal className="w-4 h-4 inline mr-2" />
                Điều chỉnh
              </button>
              <button
                onClick={() => setEditorTab('filters')}
                className={`px-4 py-2 rounded-md transition-all ${
                  editorTab === 'filters' ? 'bg-blue-500 text-white' : 'text-white/70 hover:text-white'
                }`}
              >
                <Palette className="w-4 h-4 inline mr-2" />
                Bộ lọc
              </button>
              <button
                onClick={() => setEditorTab('crop')}
                className={`px-4 py-2 rounded-md transition-all ${
                  editorTab === 'crop' ? 'bg-blue-500 text-white' : 'text-white/70 hover:text-white'
                }`}
              >
                <Crop className="w-4 h-4 inline mr-2" />
                Cắt ảnh
              </button>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowBeforeAfter(!showBeforeAfter)}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all"
              >
                <Eye className="w-4 h-4 inline mr-2" />
                {showBeforeAfter ? 'Ẩn so sánh' : 'So sánh'}
              </button>
              <button
                onClick={() => {
                  if (editorTab === 'crop') {
                    resetCrop();
                  } else {
                    resetEditorSettings();
                  }
                }}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all"
              >
                <RotateCw className="w-4 h-4 inline mr-2" />
                Đặt lại
              </button>
              <button
                onClick={saveEditedImage}
                className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all font-medium"
              >
                <Check className="w-4 h-4 inline mr-2" />
                Lưu
              </button>
            </div>
          </div>

          <div className="flex-1 flex overflow-hidden">
            {/* Left Sidebar - Controls */}
            <div className="w-80 bg-black/60 backdrop-blur-sm border-r border-white/10 p-6 overflow-y-auto">
              {/* Adjust Tab */}
              {editorTab === 'adjust' && (
                <div className="space-y-6">
                  <div>
                    <label className="text-white text-sm font-medium mb-3 block">Độ sáng</label>
                    <input
                      type="range"
                      min="0"
                      max="200"
                      value={editorSettings.brightness}
                      onChange={(e) => handleEditorChange('brightness', parseInt(e.target.value))}
                      className="w-full accent-blue-500"
                    />
                    <div className="flex justify-between text-xs text-white/60 mt-1">
                      <span>Tối</span>
                      <span>{editorSettings.brightness}%</span>
                      <span>Sáng</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-white text-sm font-medium mb-3 block">Độ tương phản</label>
                    <input
                      type="range"
                      min="0"
                      max="200"
                      value={editorSettings.contrast}
                      onChange={(e) => handleEditorChange('contrast', parseInt(e.target.value))}
                      className="w-full accent-blue-500"
                    />
                    <div className="flex justify-between text-xs text-white/60 mt-1">
                      <span>Thấp</span>
                      <span>{editorSettings.contrast}%</span>
                      <span>Cao</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-white text-sm font-medium mb-3 block">Độ bão hòa</label>
                    <input
                      type="range"
                      min="0"
                      max="200"
                      value={editorSettings.saturation}
                      onChange={(e) => handleEditorChange('saturation', parseInt(e.target.value))}
                      className="w-full accent-blue-500"
                    />
                    <div className="flex justify-between text-xs text-white/60 mt-1">
                      <span>Xám</span>
                      <span>{editorSettings.saturation}%</span>
                      <span>Sống động</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-white text-sm font-medium mb-3 block">Độ mờ</label>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      value={editorSettings.blur}
                      onChange={(e) => handleEditorChange('blur', parseInt(e.target.value))}
                      className="w-full accent-blue-500"
                    />
                    <div className="flex justify-between text-xs text-white/60 mt-1">
                      <span>Rõ nét</span>
                      <span>{editorSettings.blur}px</span>
                      <span>Mờ</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/10">
                    <label className="text-white text-sm font-medium mb-3 block">Xoay & Lật</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleEditorChange('rotate', (editorSettings.rotate - 90) % 360)}
                        className="px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all flex items-center justify-center gap-2"
                      >
                        <RotateCw className="w-4 h-4 rotate-180" />
                        Trái
                      </button>
                      <button
                        onClick={() => handleEditorChange('rotate', (editorSettings.rotate + 90) % 360)}
                        className="px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all flex items-center justify-center gap-2"
                      >
                        <RotateCw className="w-4 h-4" />
                        Phải
                      </button>
                      <button
                        onClick={() => handleEditorChange('flipH', !editorSettings.flipH)}
                        className={`px-4 py-3 rounded-lg transition-all flex items-center justify-center gap-2 ${
                          editorSettings.flipH ? 'bg-blue-500 text-white' : 'bg-white/10 hover:bg-white/20 text-white'
                        }`}
                      >
                        Lật ngang
                      </button>
                      <button
                        onClick={() => handleEditorChange('flipV', !editorSettings.flipV)}
                        className={`px-4 py-3 rounded-lg transition-all flex items-center justify-center gap-2 ${
                          editorSettings.flipV ? 'bg-blue-500 text-white' : 'bg-white/10 hover:bg-white/20 text-white'
                        }`}
                      >
                        Lật dọc
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Filters Tab */}
              {editorTab === 'filters' && (
                <div className="space-y-4">
                  <h3 className="text-white font-medium mb-4">Bộ lọc có sẵn</h3>
                  
                  <button
                    onClick={() => applyFilterPreset('original')}
                    className="w-full p-4 bg-white/10 hover:bg-white/20 rounded-lg transition-all text-left"
                  >
                    <div className="text-white font-medium">Gốc</div>
                    <div className="text-white/60 text-sm mt-1">Không có bộ lọc</div>
                  </button>

                  <button
                    onClick={() => applyFilterPreset('vibrant')}
                    className="w-full p-4 bg-white/10 hover:bg-white/20 rounded-lg transition-all text-left"
                  >
                    <div className="text-white font-medium">Sống động</div>
                    <div className="text-white/60 text-sm mt-1">Tăng độ bão hòa và tương phản</div>
                  </button>

                  <button
                    onClick={() => applyFilterPreset('grayscale')}
                    className="w-full p-4 bg-white/10 hover:bg-white/20 rounded-lg transition-all text-left"
                  >
                    <div className="text-white font-medium">Đen trắng</div>
                    <div className="text-white/60 text-sm mt-1">Loại bỏ màu sắc</div>
                  </button>

                  <button
                    onClick={() => applyFilterPreset('vintage')}
                    className="w-full p-4 bg-white/10 hover:bg-white/20 rounded-lg transition-all text-left"
                  >
                    <div className="text-white font-medium">Cổ điển</div>
                    <div className="text-white/60 text-sm mt-1">Hiệu ứng vintage ấm áp</div>
                  </button>

                  <button
                    onClick={() => applyFilterPreset('bright')}
                    className="w-full p-4 bg-white/10 hover:bg-white/20 rounded-lg transition-all text-left"
                  >
                    <div className="text-white font-medium">Sáng</div>
                    <div className="text-white/60 text-sm mt-1">Tăng độ sáng</div>
                  </button>

                  <button
                    onClick={() => applyFilterPreset('dramatic')}
                    className="w-full p-4 bg-white/10 hover:bg-white/20 rounded-lg transition-all text-left"
                  >
                    <div className="text-white font-medium">Kịch tính</div>
                    <div className="text-white/60 text-sm mt-1">Tăng độ tương phản mạnh</div>
                  </button>
                </div>
              )}

              {/* Crop Tab */}
              {editorTab === 'crop' && (
                <div className="space-y-4">
                  <h3 className="text-white font-medium mb-4">Tỷ lệ khung hình</h3>
                  
                  <button 
                    onClick={() => handleCropAspectRatio('free')}
                    className={`w-full px-4 py-3 ${cropSettings.aspectRatio === 'free' ? 'bg-blue-500' : 'bg-white/10 hover:bg-white/20'} text-white rounded-lg transition-all text-left`}
                  >
                    Tự do
                  </button>
                  <button 
                    onClick={() => handleCropAspectRatio('1:1')}
                    className={`w-full px-4 py-3 ${cropSettings.aspectRatio === '1:1' ? 'bg-blue-500' : 'bg-white/10 hover:bg-white/20'} text-white rounded-lg transition-all text-left`}
                  >
                    1:1 (Vuông)
                  </button>
                  <button 
                    onClick={() => handleCropAspectRatio('4:3')}
                    className={`w-full px-4 py-3 ${cropSettings.aspectRatio === '4:3' ? 'bg-blue-500' : 'bg-white/10 hover:bg-white/20'} text-white rounded-lg transition-all text-left`}
                  >
                    4:3
                  </button>
                  <button 
                    onClick={() => handleCropAspectRatio('16:9')}
                    className={`w-full px-4 py-3 ${cropSettings.aspectRatio === '16:9' ? 'bg-blue-500' : 'bg-white/10 hover:bg-white/20'} text-white rounded-lg transition-all text-left`}
                  >
                    16:9 (Ngang)
                  </button>
                  <button 
                    onClick={() => handleCropAspectRatio('9:16')}
                    className={`w-full px-4 py-3 ${cropSettings.aspectRatio === '9:16' ? 'bg-blue-500' : 'bg-white/10 hover:bg-white/20'} text-white rounded-lg transition-all text-left`}
                  >
                    9:16 (Dọc)
                  </button>
                  
                  <div className="pt-4 border-t border-white/10 space-y-3">
                    <button
                      onClick={applyCrop}
                      className="w-full px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-all font-medium"
                    >
                      <Check className="w-4 h-4 inline mr-2" />
                      Áp dụng cắt
                    </button>
                    <button
                      onClick={resetCrop}
                      className="w-full px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all"
                    >
                      <RotateCw className="w-4 h-4 inline mr-2" />
                      Đặt lại
                    </button>
                    <p className="text-white/60 text-sm mt-4">
                      Kéo khung để di chuyển, kéo góc để thay đổi kích thước
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Center - Image Preview */}
            <div className="flex-1 flex items-center justify-center p-8 relative overflow-hidden">
              {editorTab === 'crop' ? (
                /* Crop Mode */
                <div 
                  ref={cropContainerRef}
                  className="relative max-w-full max-h-full"
                  style={{ width: '80%', height: '80%' }}
                >
                  {/* Background Image */}
                  <img
                    src={showImageEditor.url}
                    alt={showImageEditor.name}
                    className="w-full h-full object-contain pointer-events-none"
                  />
                  
                  {/* Dark Overlay - outside crop area */}
                  <div className="absolute inset-0 pointer-events-none">
                    {/* Top */}
                    <div 
                      className="absolute top-0 left-0 right-0 bg-black/60"
                      style={{ height: `${cropSettings.y}%` }}
                    />
                    {/* Bottom */}
                    <div 
                      className="absolute bottom-0 left-0 right-0 bg-black/60"
                      style={{ height: `${100 - cropSettings.y - cropSettings.height}%` }}
                    />
                    {/* Left */}
                    <div 
                      className="absolute left-0 bg-black/60"
                      style={{ 
                        top: `${cropSettings.y}%`,
                        width: `${cropSettings.x}%`,
                        height: `${cropSettings.height}%`
                      }}
                    />
                    {/* Right */}
                    <div 
                      className="absolute right-0 bg-black/60"
                      style={{ 
                        top: `${cropSettings.y}%`,
                        width: `${100 - cropSettings.x - cropSettings.width}%`,
                        height: `${cropSettings.height}%`
                      }}
                    />
                  </div>
                  
                  {/* Crop Area */}
                  <div
                    className="absolute border-2 border-white cursor-move"
                    style={{
                      left: `${cropSettings.x}%`,
                      top: `${cropSettings.y}%`,
                      width: `${cropSettings.width}%`,
                      height: `${cropSettings.height}%`,
                    }}
                    onMouseDown={(e) => handleCropMouseDown(e, 'drag')}
                  >
                    {/* Grid lines */}
                    <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none">
                      {[...Array(9)].map((_, i) => (
                        <div key={i} className="border border-white/30" />
                      ))}
                    </div>
                    
                    {/* Resize handles */}
                    <div 
                      className="absolute -top-2 -left-2 w-4 h-4 bg-white border-2 border-blue-500 rounded-full cursor-nw-resize"
                      onMouseDown={(e) => handleCropMouseDown(e, 'resize', 'nw')}
                    />
                    <div 
                      className="absolute -top-2 -right-2 w-4 h-4 bg-white border-2 border-blue-500 rounded-full cursor-ne-resize"
                      onMouseDown={(e) => handleCropMouseDown(e, 'resize', 'ne')}
                    />
                    <div 
                      className="absolute -bottom-2 -left-2 w-4 h-4 bg-white border-2 border-blue-500 rounded-full cursor-sw-resize"
                      onMouseDown={(e) => handleCropMouseDown(e, 'resize', 'sw')}
                    />
                    <div 
                      className="absolute -bottom-2 -right-2 w-4 h-4 bg-white border-2 border-blue-500 rounded-full cursor-se-resize"
                      onMouseDown={(e) => handleCropMouseDown(e, 'resize', 'se')}
                    />
                    
                    {/* Crop dimensions info */}
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                      {Math.round(cropSettings.width)}% × {Math.round(cropSettings.height)}%
                    </div>
                  </div>
                </div>
              ) : showBeforeAfter ? (
                <div className="relative w-full h-full max-w-5xl max-h-full flex gap-4">
                  {/* Before */}
                  <div className="flex-1 flex flex-col">
                    <div className="text-white text-sm font-medium mb-2 text-center">Trước</div>
                    <div className="flex-1 flex items-center justify-center bg-black/20 rounded-lg overflow-hidden">
                      <img
                        src={showImageEditor.url}
                        alt="Before"
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                  </div>

                  {/* After */}
                  <div className="flex-1 flex flex-col">
                    <div className="text-white text-sm font-medium mb-2 text-center">Sau</div>
                    <div className="flex-1 flex items-center justify-center bg-black/20 rounded-lg overflow-hidden">
                      <img
                        src={showImageEditor.url}
                        alt="After"
                        style={getImageStyle()}
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <img
                  src={showImageEditor.url}
                  alt={showImageEditor.name}
                  style={getImageStyle()}
                  className="max-w-full max-h-full object-contain"
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] animate-slide-up">
          <div className={`px-6 py-4 rounded-2xl shadow-2xl backdrop-blur-xl flex items-center gap-3 ${
            toast.type === 'success' ? 'bg-gradient-to-r from-green-500 to-emerald-600' :
            toast.type === 'error' ? 'bg-gradient-to-r from-red-500 to-pink-600' :
            'bg-gradient-to-r from-blue-500 to-indigo-600'
          }`}>
            <div className="p-2 bg-white/20 rounded-lg">
              {toast.type === 'success' && <Check className="w-5 h-5 text-white" />}
              {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-white" />}
              {toast.type === 'info' && <Info className="w-5 h-5 text-white" />}
            </div>
            <p className="text-white font-medium">{toast.message}</p>
          </div>
        </div>
      )}
    </div>
  );
}
