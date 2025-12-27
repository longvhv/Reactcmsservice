import { useState } from 'react';
import { Upload, FolderPlus, Grid, List, Search, Filter, Image as ImageIcon, Video, FileText, Music, File, Trash2, Edit2, Download, Share2, Eye, MoreVertical, ChevronRight, Folder, Star, Clock, User } from 'lucide-react';

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
}

interface FolderItem {
  id: number;
  name: string;
  parent: number | null;
  fileCount: number;
  size: string;
}

export function MediaManagement() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedFolder, setSelectedFolder] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<number[]>([]);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const folders: FolderItem[] = [
    { id: 1, name: 'Images', parent: null, fileCount: 1247, size: '2.4 GB' },
    { id: 2, name: 'Videos', parent: null, fileCount: 156, size: '15.8 GB' },
    { id: 3, name: 'Documents', parent: null, fileCount: 432, size: '856 MB' },
    { id: 4, name: 'Audio', parent: null, fileCount: 89, size: '1.2 GB' },
    { id: 5, name: 'News Images', parent: 1, fileCount: 623, size: '1.2 GB' },
    { id: 6, name: 'Gallery', parent: 1, fileCount: 456, size: '890 MB' },
    { id: 7, name: 'Thumbnails', parent: 1, fileCount: 168, size: '320 MB' },
  ];

  const mediaFiles: MediaFile[] = [
    {
      id: 1,
      name: 'tech-conference-2024.jpg',
      type: 'image',
      size: '2.4 MB',
      url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400',
      folder: 'News Images',
      uploadedBy: 'Nguyễn Văn A',
      uploadedAt: '2 giờ trước',
      dimensions: '1920x1080',
    },
    {
      id: 2,
      name: 'ai-robot-demo.mp4',
      type: 'video',
      size: '45.2 MB',
      url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400',
      folder: 'Videos',
      uploadedBy: 'Trần Thị B',
      uploadedAt: '5 giờ trước',
      duration: '3:24',
    },
    {
      id: 3,
      name: 'product-launch.jpg',
      type: 'image',
      size: '3.1 MB',
      url: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400',
      folder: 'Gallery',
      uploadedBy: 'Lê Văn C',
      uploadedAt: '1 ngày trước',
      dimensions: '2560x1440',
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
    },
    {
      id: 6,
      name: 'team-meeting.jpg',
      type: 'image',
      size: '1.8 MB',
      url: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400',
      folder: 'News Images',
      uploadedBy: 'Trần Thị B',
      uploadedAt: '4 ngày trước',
      dimensions: '1920x1280',
    },
    {
      id: 7,
      name: 'office-tour.mp4',
      type: 'video',
      size: '67.5 MB',
      url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400',
      folder: 'Videos',
      uploadedBy: 'Lê Văn C',
      uploadedAt: '5 ngày trước',
      duration: '8:15',
    },
    {
      id: 8,
      name: 'startup-workspace.jpg',
      type: 'image',
      size: '2.9 MB',
      url: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=400',
      folder: 'Gallery',
      uploadedBy: 'Nguyễn Văn A',
      uploadedAt: '1 tuần trước',
      dimensions: '3840x2160',
    },
  ];

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

  const toggleFileSelection = (fileId: number) => {
    setSelectedFiles(prev =>
      prev.includes(fileId) ? prev.filter(id => id !== fileId) : [...prev, fileId]
    );
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-foreground mb-2">Thư viện Media</h1>
          <p className="text-muted-foreground">Quản lý tất cả file ảnh, video, tài liệu</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-200"
          >
            <Upload className="w-5 h-5" />
            <span>Upload files</span>
          </button>

          <button className="flex items-center gap-2 px-4 py-3 border border-border/60 rounded-xl hover:bg-muted/50 transition-all duration-200">
            <FolderPlus className="w-5 h-5" />
            <span>Tạo folder</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <ImageIcon className="w-6 h-6" />
            </div>
          </div>
          <div className="text-3xl font-bold mb-1">1,247</div>
          <div className="text-blue-100 text-sm">Hình ảnh</div>
          <div className="text-xs text-blue-200 mt-1">2.4 GB</div>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <Video className="w-6 h-6" />
            </div>
          </div>
          <div className="text-3xl font-bold mb-1">156</div>
          <div className="text-red-100 text-sm">Videos</div>
          <div className="text-xs text-red-200 mt-1">15.8 GB</div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <Music className="w-6 h-6" />
            </div>
          </div>
          <div className="text-3xl font-bold mb-1">89</div>
          <div className="text-purple-100 text-sm">Audio</div>
          <div className="text-xs text-purple-200 mt-1">1.2 GB</div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <FileText className="w-6 h-6" />
            </div>
          </div>
          <div className="text-3xl font-bold mb-1">432</div>
          <div className="text-green-100 text-sm">Tài liệu</div>
          <div className="text-xs text-green-200 mt-1">856 MB</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-4 gap-6">
        {/* Folder Tree Sidebar */}
        <div className="bg-card rounded-2xl border border-border/60 p-6">
          <h3 className="text-foreground mb-4 flex items-center gap-2">
            <Folder className="w-5 h-5" />
            <span>Thư mục</span>
          </h3>

          <div className="space-y-2">
            <button
              onClick={() => setSelectedFolder(null)}
              className={`w-full text-left px-3 py-2 rounded-xl transition-all duration-200 flex items-center gap-2 ${
                selectedFolder === null ? 'bg-blue-100 text-blue-700' : 'hover:bg-muted/50'
              }`}
            >
              <Folder className="w-4 h-4" />
              <span>Tất cả files</span>
              <span className="ml-auto text-xs text-muted-foreground">1,924</span>
            </button>

            {folders.filter(f => f.parent === null).map((folder) => (
              <div key={folder.id}>
                <button
                  onClick={() => setSelectedFolder(folder.id)}
                  className={`w-full text-left px-3 py-2 rounded-xl transition-all duration-200 flex items-center gap-2 ${
                    selectedFolder === folder.id ? 'bg-blue-100 text-blue-700' : 'hover:bg-muted/50'
                  }`}
                >
                  <Folder className="w-4 h-4" />
                  <span>{folder.name}</span>
                  <span className="ml-auto text-xs text-muted-foreground">{folder.fileCount}</span>
                </button>

                {/* Subfolders */}
                {folders.filter(f => f.parent === folder.id).map((subfolder) => (
                  <button
                    key={subfolder.id}
                    onClick={() => setSelectedFolder(subfolder.id)}
                    className={`w-full text-left px-3 py-2 pl-8 rounded-xl transition-all duration-200 flex items-center gap-2 text-sm ${
                      selectedFolder === subfolder.id ? 'bg-blue-100 text-blue-700' : 'hover:bg-muted/50 text-muted-foreground'
                    }`}
                  >
                    <ChevronRight className="w-3 h-3" />
                    <span>{subfolder.name}</span>
                    <span className="ml-auto text-xs">{subfolder.fileCount}</span>
                  </button>
                ))}
              </div>
            ))}

            <div className="pt-4 border-t border-border/60">
              <button className="w-full text-left px-3 py-2 rounded-xl hover:bg-muted/50 transition-all duration-200 flex items-center gap-2">
                <Star className="w-4 h-4" />
                <span>Starred</span>
                <span className="ml-auto text-xs text-muted-foreground">24</span>
              </button>
              <button className="w-full text-left px-3 py-2 rounded-xl hover:bg-muted/50 transition-all duration-200 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>Gần đây</span>
              </button>
            </div>
          </div>
        </div>

        {/* Files Area */}
        <div className="col-span-3 space-y-4">
          {/* Toolbar */}
          <div className="bg-card rounded-2xl border border-border/60 p-4">
            <div className="flex items-center gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Tìm kiếm files..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all duration-200"
                />
              </div>

              <button className="flex items-center gap-2 px-4 py-3 border border-border/60 rounded-xl hover:bg-muted/50 transition-all duration-200">
                <Filter className="w-4 h-4" />
                <span>Lọc</span>
              </button>

              <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-xl">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    viewMode === 'grid' ? 'bg-card shadow-sm' : 'hover:bg-muted'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    viewMode === 'list' ? 'bg-card shadow-sm' : 'hover:bg-muted'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Bulk Actions */}
            {selectedFiles.length > 0 && (
              <div className="mt-3 pt-3 border-t border-border/60 flex items-center gap-3">
                <span className="text-sm text-muted-foreground">{selectedFiles.length} file(s) đã chọn</span>
                <button className="flex items-center gap-1 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm">
                  <Download className="w-3 h-3" />
                  <span>Tải xuống</span>
                </button>
                <button className="flex items-center gap-1 px-3 py-1.5 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm">
                  <Share2 className="w-3 h-3" />
                  <span>Chia sẻ</span>
                </button>
                <button className="flex items-center gap-1 px-3 py-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm">
                  <Trash2 className="w-3 h-3" />
                  <span>Xóa</span>
                </button>
              </div>
            )}
          </div>

          {/* Files Grid/List */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-4 gap-4">
              {mediaFiles.map((file) => {
                const FileIcon = getFileIcon(file.type);
                const color = getFileColor(file.type);
                const isSelected = selectedFiles.includes(file.id);

                return (
                  <div
                    key={file.id}
                    onClick={() => toggleFileSelection(file.id)}
                    className={`bg-card border-2 rounded-xl overflow-hidden cursor-pointer transition-all duration-200 ${
                      isSelected ? 'border-blue-500 shadow-lg shadow-blue-500/20' : 'border-border/60 hover:border-blue-500/50 hover:shadow-md'
                    }`}
                  >
                    {/* Preview */}
                    <div className="aspect-video bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center relative group">
                      {file.type === 'image' && file.url ? (
                        <img src={file.url} alt={file.name} className="w-full h-full object-cover" />
                      ) : file.type === 'video' && file.url ? (
                        <div className="relative w-full h-full">
                          <img src={file.url} alt={file.name} className="w-full h-full object-cover opacity-50" />
                          <Video className="absolute inset-0 m-auto w-12 h-12 text-white" />
                        </div>
                      ) : (
                        <FileIcon className={`w-12 h-12 text-${color}-500`} />
                      )}

                      {/* Checkbox */}
                      <div className={`absolute top-2 left-2 w-5 h-5 border-2 rounded flex items-center justify-center transition-all duration-200 ${
                        isSelected ? 'bg-blue-500 border-blue-500' : 'bg-white/80 border-white/80 opacity-0 group-hover:opacity-100'
                      }`}>
                        {isSelected && (
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1.5 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-colors">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Duration/Dimensions */}
                      {(file.duration || file.dimensions) && (
                        <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 backdrop-blur-sm rounded text-white text-xs">
                          {file.duration || file.dimensions}
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="p-3">
                      <div className="font-medium text-foreground text-sm truncate mb-1">{file.name}</div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{file.size}</span>
                        <span>{file.uploadedAt}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-card rounded-2xl border border-border/60 overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left px-6 py-4 text-sm text-muted-foreground w-12">
                      <input type="checkbox" className="rounded" />
                    </th>
                    <th className="text-left px-6 py-4 text-sm text-muted-foreground">Tên file</th>
                    <th className="text-left px-6 py-4 text-sm text-muted-foreground">Loại</th>
                    <th className="text-left px-6 py-4 text-sm text-muted-foreground">Kích thước</th>
                    <th className="text-left px-6 py-4 text-sm text-muted-foreground">Người tải</th>
                    <th className="text-left px-6 py-4 text-sm text-muted-foreground">Ngày tải</th>
                    <th className="text-right px-6 py-4 text-sm text-muted-foreground">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {mediaFiles.map((file) => {
                    const FileIcon = getFileIcon(file.type);
                    const color = getFileColor(file.type);
                    const isSelected = selectedFiles.includes(file.id);

                    return (
                      <tr 
                        key={file.id} 
                        className={`hover:bg-muted/30 transition-colors ${isSelected ? 'bg-blue-50' : ''}`}
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
                            <div className={`p-2 bg-${color}-100 rounded-lg`}>
                              <FileIcon className={`w-4 h-4 text-${color}-600`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-foreground truncate">{file.name}</div>
                              <div className="text-xs text-muted-foreground">{file.folder}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 bg-${color}-100 text-${color}-700 rounded-full text-xs capitalize`}>
                            {file.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">{file.size}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm">{file.uploadedBy}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">{file.uploadedAt}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button className="p-2 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors" title="Xem">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="p-2 hover:bg-green-100 text-green-600 rounded-lg transition-colors" title="Tải xuống">
                              <Download className="w-4 h-4" />
                            </button>
                            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Chỉnh sửa">
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition-colors" title="Xóa">
                              <Trash2 className="w-4 h-4" />
                            </button>
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
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-card rounded-2xl border border-border/60 max-w-2xl w-full">
            <div className="p-6 border-b border-border/60">
              <h2 className="text-foreground">Upload files</h2>
            </div>
            
            <div className="p-6">
              <div className="border-2 border-dashed border-border/60 rounded-xl p-12 text-center hover:border-blue-500/50 transition-all duration-200 cursor-pointer">
                <Upload className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-foreground mb-2">Kéo thả files vào đây</h3>
                <p className="text-sm text-muted-foreground mb-4">hoặc click để chọn files</p>
                <p className="text-xs text-muted-foreground">Hỗ trợ: JPG, PNG, GIF, MP4, MP3, PDF, DOC (max 100MB)</p>
              </div>
            </div>

            <div className="p-6 border-t border-border/60 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowUploadModal(false)}
                className="px-6 py-3 border border-border/60 rounded-xl hover:bg-muted/50 transition-all duration-200"
              >
                Hủy
              </button>
              <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-200">
                Bắt đầu upload
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
