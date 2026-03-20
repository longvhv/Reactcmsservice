import { useState, useRef, useCallback } from 'react';
import { 
  Upload, X, FileImage, Film, Music, FileText, File,
  Check, Loader2, Trash2, Eye, Search, Grid, List,
  FolderOpen, Image as ImageIcon, Video, FileAudio, AlertCircle
} from 'lucide-react';

// Upload Panel - Canva-style file upload interface
// Supports images, videos, audio, documents

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  thumbnail?: string;
  uploadedAt: Date;
  category: 'image' | 'video' | 'audio' | 'document' | 'other';
}

interface UploadPanelProps {
  onSelectFile: (file: UploadedFile) => void;
  onClose: () => void;
  maxFileSize?: number; // in MB
  allowedTypes?: string[];
  uploadedFiles?: UploadedFile[];
  onUpload?: (files: File[]) => Promise<void>;
}

const FILE_CATEGORIES = [
  { id: 'all', name: 'Tất cả', icon: Grid },
  { id: 'image', name: 'Hình ảnh', icon: ImageIcon },
  { id: 'video', name: 'Video', icon: Video },
  { id: 'audio', name: 'Âm thanh', icon: FileAudio },
  { id: 'document', name: 'Tài liệu', icon: FileText },
];

const getFileCategory = (type: string): UploadedFile['category'] => {
  if (type.startsWith('image/')) return 'image';
  if (type.startsWith('video/')) return 'video';
  if (type.startsWith('audio/')) return 'audio';
  if (type.includes('pdf') || type.includes('document')) return 'document';
  return 'other';
};

const getFileIcon = (category: string) => {
  switch (category) {
    case 'image': return FileImage;
    case 'video': return Film;
    case 'audio': return Music;
    case 'document': return FileText;
    default: return File;
  }
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

export function UploadPanel({
  onSelectFile,
  onClose,
  maxFileSize = 50, // 50MB default
  allowedTypes = ['image/*', 'video/*', 'audio/*', '.pdf', '.doc', '.docx'],
  uploadedFiles = [],
  onUpload,
}: UploadPanelProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    await handleFiles(files);
  }, []);

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    await handleFiles(files);
  }, []);

  const handleFiles = async (files: File[]) => {
    setError(null);
    
    // Validate files
    const maxSizeBytes = maxFileSize * 1024 * 1024;
    const invalidFiles = files.filter(file => file.size > maxSizeBytes);
    
    if (invalidFiles.length > 0) {
      setError(`Một số tệp vượt quá giới hạn ${maxFileSize}MB`);
      return;
    }

    if (onUpload) {
      setUploading(true);
      setUploadProgress(0);
      
      try {
        // Simulate upload progress
        const progressInterval = setInterval(() => {
          setUploadProgress(prev => {
            if (prev >= 90) {
              clearInterval(progressInterval);
              return 90;
            }
            return prev + 10;
          });
        }, 200);

        await onUpload(files);
        
        clearInterval(progressInterval);
        setUploadProgress(100);
        
        setTimeout(() => {
          setUploading(false);
          setUploadProgress(0);
        }, 500);
      } catch (err) {
        setError('Tải lên thất bại. Vui lòng thử lại.');
        setUploading(false);
        setUploadProgress(0);
      }
    }
  };

  const filteredFiles = uploadedFiles.filter((file) => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || file.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 p-8 text-white">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 hover:bg-white/20 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-3 mb-4">
            <Upload className="w-8 h-8" />
            <h2 className="text-3xl font-bold">Tải tệp lên</h2>
          </div>
          
          <p className="text-white/90 text-lg mb-6">
            Tải lên hình ảnh, video và tài liệu của bạn
          </p>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm tệp đã tải lên..."
              className="w-full pl-12 pr-4 py-3 bg-white/95 backdrop-blur-sm text-gray-800 rounded-xl border-0 focus:ring-2 focus:ring-blue-400 text-base"
            />
          </div>

          {/* View Toggle */}
          <div className="absolute top-6 right-20 flex gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-white/30' : 'hover:bg-white/20'
              }`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list' ? 'bg-white/30' : 'hover:bg-white/20'
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Category Sidebar */}
          <div className="w-48 bg-gray-50 border-r border-gray-200 p-4 overflow-y-auto">
            <p className="text-xs font-semibold text-gray-500 uppercase mb-3">Danh mục</p>
            {FILE_CATEGORIES.map((category) => {
              const Icon = category.icon;
              const count = category.id === 'all' 
                ? uploadedFiles.length 
                : uploadedFiles.filter(f => f.category === category.id).length;
              
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-all ${
                    selectedCategory === category.id
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg scale-105'
                      : 'hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="flex-1 text-left font-medium">{category.name}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    selectedCategory === category.id ? 'bg-white/20' : 'bg-gray-300'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Upload Area */}
            <div className="p-6 border-b border-gray-200">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept={allowedTypes.join(',')}
                onChange={handleFileSelect}
                className="hidden"
              />
              
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`relative border-3 border-dashed rounded-xl p-8 text-center transition-all ${
                  isDragging
                    ? 'border-blue-500 bg-blue-50 scale-105'
                    : 'border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50/50'
                }`}
              >
                {uploading ? (
                  <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
                    <p className="text-lg font-semibold text-gray-700">Đang tải lên...</p>
                    <div className="w-full max-w-xs bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                    <p className="text-sm text-gray-500">{uploadProgress}%</p>
                  </div>
                ) : (
                  <>
                    <Upload className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      {isDragging ? 'Thả tệp vào đây' : 'Tải tệp lên'}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Kéo thả tệp vào đây, hoặc nhấp để duyệt
                    </p>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
                    >
                      <FolderOpen className="w-5 h-5 inline mr-2" />
                      Chọn tệp
                    </button>
                    <p className="text-xs text-gray-500 mt-4">
                      Kích thước tệp tối đa: {maxFileSize}MB
                    </p>
                  </>
                )}
              </div>

              {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <p className="text-sm">{error}</p>
                </div>
              )}
            </div>

            {/* Files Grid/List */}
            <div className="flex-1 p-6 overflow-y-auto bg-gradient-to-br from-gray-50 to-white">
              {filteredFiles.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                  {uploadedFiles.length === 0 ? (
                    <>
                      <FileImage className="w-16 h-16 mb-4" />
                      <p className="text-lg">Chưa có tệp nào được tải lên</p>
                      <p className="text-sm">Tải lên tệp đầu tiên để bắt đầu</p>
                    </>
                  ) : (
                    <>
                      <Search className="w-16 h-16 mb-4" />
                      <p className="text-lg">Không tìm thấy tệp</p>
                      <p className="text-sm">Thử từ khóa tìm kiếm khác</p>
                    </>
                  )}
                </div>
              ) : (
                <div className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-4 gap-4'
                    : 'space-y-2'
                }>
                  {filteredFiles.map((file) => {
                    const Icon = getFileIcon(file.category);
                    
                    if (viewMode === 'list') {
                      return (
                        <div
                          key={file.id}
                          className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-200 hover:shadow-md transition-all group"
                        >
                          <div className="p-3 bg-blue-50 rounded-lg">
                            <Icon className="w-6 h-6 text-blue-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-800 truncate">{file.name}</p>
                            <p className="text-sm text-gray-500">
                              {formatFileSize(file.size)} • {new Date(file.uploadedAt).toLocaleDateString()}
                            </p>
                          </div>
                          <button
                            onClick={() => onSelectFile(file)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors opacity-0 group-hover:opacity-100"
                          >
                            Thêm vào canvas
                          </button>
                        </div>
                      );
                    }
                    
                    return (
                      <div
                        key={file.id}
                        className="group relative bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all cursor-pointer"
                        onClick={() => onSelectFile(file)}
                      >
                        <div className="aspect-square bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center">
                          {file.thumbnail ? (
                            <img
                              src={file.thumbnail}
                              alt={file.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Icon className="w-16 h-16 text-blue-600" />
                          )}
                        </div>
                        
                        <div className="p-3">
                          <p className="font-medium text-sm text-gray-800 truncate" title={file.name}>
                            {file.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatFileSize(file.size)}
                          </p>
                        </div>
                        
                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-blue-600/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="text-center text-white">
                            <Eye className="w-8 h-8 mx-auto mb-2" />
                            <p className="font-semibold">Thêm vào canvas</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-100 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            <span className="font-semibold">{uploadedFiles.length}</span> tệp đã tải lên
            {filteredFiles.length !== uploadedFiles.length && (
              <> • Hiện <span className="font-semibold">{filteredFiles.length}</span></>
            )}
          </p>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <AlertCircle className="w-4 h-4" />
            <span>Hỗ trợ: Hình ảnh, Video, Âm thanh, PDF, Tài liệu</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Export types
export type { UploadedFile, UploadPanelProps };
export { getFileCategory, getFileIcon, formatFileSize };