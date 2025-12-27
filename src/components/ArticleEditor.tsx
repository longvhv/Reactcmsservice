import { useState, useRef } from 'react';
import { X, Save, Eye, Sparkles, Languages, CheckCircle, ImagePlus, Video, FileText, Briefcase, Mic, Calendar, FolderTree, Tag, Upload, Link, Bold, Italic, List, Code, Heading, Quote, Image as ImageIcon, Maximize2, Minimize2, Clock, Globe, ChevronDown, Plus, Search, Wand2, AlignLeft, GripVertical, Trash2, Edit2, User } from 'lucide-react';

interface ArticleEditorProps {
  articleId?: number;
  onClose: () => void;
  onSave: (data: any) => void;
}

interface GalleryImage {
  id: number;
  url: string;
  caption: string;
  file?: File;
}

export function ArticleEditor({ articleId, onClose, onSave }: ArticleEditorProps) {
  const [isFullscreen, setIsFullscreen] = useState(true);
  const [articleType, setArticleType] = useState('news');
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['Công nghệ']);
  const [tags, setTags] = useState<string[]>(['CMS', 'Tutorial']);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [showAiTools, setShowAiTools] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [selectedAuthor, setSelectedAuthor] = useState('Nguyễn Văn A');
  const [showAddAuthor, setShowAddAuthor] = useState(false);
  const [newAuthorName, setNewAuthorName] = useState('');
  
  // Gallery specific
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [draggedImageId, setDraggedImageId] = useState<number | null>(null);
  const [editingImageId, setEditingImageId] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const articleTypes = [
    { id: 'news', label: 'Tin tức', icon: FileText, color: 'blue' },
    { id: 'video', label: 'Video', icon: Video, color: 'red' },
    { id: 'gallery', label: 'Thư viện ảnh', icon: ImageIcon, color: 'purple' },
    { id: 'legal', label: 'Văn bản PL', icon: FileText, color: 'indigo' },
    { id: 'job', label: 'Tuyển dụng', icon: Briefcase, color: 'green' },
    { id: 'podcast', label: 'Podcast', icon: Mic, color: 'pink' },
    { id: 'event', label: 'Sự kiện', icon: Calendar, color: 'orange' },
  ];

  const availableCategories = [
    { id: 1, name: 'Công nghệ', parent: null },
    { id: 2, name: 'AI & Machine Learning', parent: 1 },
    { id: 3, name: 'Web Development', parent: 1 },
    { id: 4, name: 'Sự kiện', parent: null },
    { id: 5, name: 'Tuyển dụng', parent: null },
    { id: 6, name: 'Hướng dẫn', parent: null },
  ];

  const authors = [
    'Nguyễn Văn A',
    'Trần Thị B',
    'Lê Văn C',
    'Phạm Thị D',
  ];

  const aiTools = [
    { id: 'translate', label: 'Dịch tự động', icon: Languages, color: 'blue' },
    { id: 'grammar', label: 'Kiểm tra chính tả', icon: CheckCircle, color: 'green' },
    { id: 'optimize', label: 'Tối ưu SEO', icon: Sparkles, color: 'purple' },
    { id: 'suggest', label: 'Gợi ý nội dung', icon: Wand2, color: 'pink' },
  ];

  const handleSave = async () => {
    setIsSaving(true);
    setTimeout(() => {
      setLastSaved(new Date());
      setIsSaving(false);
      onSave({ title, content, type: articleType, categories: selectedCategories, tags, author: selectedAuthor });
    }, 1000);
  };

  const toggleCategory = (categoryName: string) => {
    setSelectedCategories(prev =>
      prev.includes(categoryName)
        ? prev.filter(c => c !== categoryName)
        : [...prev, categoryName]
    );
  };

  const handleAddAuthor = () => {
    if (newAuthorName.trim()) {
      setSelectedAuthor(newAuthorName);
      setNewAuthorName('');
      setShowAddAuthor(false);
    }
  };

  // Gallery functions
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const newImage: GalleryImage = {
          id: Date.now() + Math.random(),
          url: event.target?.result as string,
          caption: '',
          file,
        };
        setGalleryImages(prev => [...prev, newImage]);
      };
      reader.readAsDataURL(file);
    });
  };

  const updateImageCaption = (id: number, caption: string) => {
    setGalleryImages(prev =>
      prev.map(img => img.id === id ? { ...img, caption } : img)
    );
  };

  const deleteImage = (id: number) => {
    setGalleryImages(prev => prev.filter(img => img.id !== id));
  };

  const handleDragStart = (e: React.DragEvent, id: number) => {
    setDraggedImageId(id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetId: number) => {
    e.preventDefault();
    if (draggedImageId === null || draggedImageId === targetId) return;

    const draggedIndex = galleryImages.findIndex(img => img.id === draggedImageId);
    const targetIndex = galleryImages.findIndex(img => img.id === targetId);

    const newImages = [...galleryImages];
    const [draggedImage] = newImages.splice(draggedIndex, 1);
    newImages.splice(targetIndex, 0, draggedImage);

    setGalleryImages(newImages);
    setDraggedImageId(null);
  };

  // Mock CKEditor Component
  const CKEditorMock = ({ value, onChange }: { value: string; onChange: (val: string) => void }) => (
    <div className="border border-border/60 rounded-xl overflow-hidden bg-card">
      {/* Toolbar */}
      <div className="border-b border-border/60 p-3 bg-muted/30 flex items-center gap-2 flex-wrap">
        <select className="px-2 py-1 border border-border/60 rounded text-sm bg-card">
          <option>Paragraph</option>
          <option>Heading 1</option>
          <option>Heading 2</option>
          <option>Heading 3</option>
        </select>
        
        <div className="h-6 w-px bg-border/60" />
        
        <button className="p-1.5 hover:bg-muted rounded transition-colors" title="Bold">
          <Bold className="w-4 h-4" />
        </button>
        <button className="p-1.5 hover:bg-muted rounded transition-colors" title="Italic">
          <Italic className="w-4 h-4" />
        </button>
        <button className="p-1.5 hover:bg-muted rounded transition-colors" title="Underline">
          <span className="text-sm font-bold underline">U</span>
        </button>
        
        <div className="h-6 w-px bg-border/60" />
        
        <button className="p-1.5 hover:bg-muted rounded transition-colors" title="Bullet List">
          <List className="w-4 h-4" />
        </button>
        <button className="p-1.5 hover:bg-muted rounded transition-colors" title="Numbered List">
          <span className="text-sm font-bold">1.</span>
        </button>
        
        <div className="h-6 w-px bg-border/60" />
        
        <button className="p-1.5 hover:bg-muted rounded transition-colors" title="Insert Link">
          <Link className="w-4 h-4" />
        </button>
        <button className="p-1.5 hover:bg-muted rounded transition-colors" title="Insert Image">
          <ImageIcon className="w-4 h-4" />
        </button>
        <button className="p-1.5 hover:bg-muted rounded transition-colors" title="Insert Video">
          <Video className="w-4 h-4" />
        </button>
        
        <div className="h-6 w-px bg-border/60" />
        
        <button className="p-1.5 hover:bg-muted rounded transition-colors" title="Code Block">
          <Code className="w-4 h-4" />
        </button>
        <button className="p-1.5 hover:bg-muted rounded transition-colors" title="Quote">
          <Quote className="w-4 h-4" />
        </button>
        
        <div className="flex-1" />
        
        <button className="p-1.5 hover:bg-muted rounded transition-colors" title="Undo">
          <span className="text-sm">↶</span>
        </button>
        <button className="p-1.5 hover:bg-muted rounded transition-colors" title="Redo">
          <span className="text-sm">↷</span>
        </button>
      </div>
      
      {/* Editor Area */}
      <div className="p-6 min-h-[400px] max-h-[600px] overflow-y-auto">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Bắt đầu viết nội dung..."
          className="w-full h-full min-h-[400px] resize-none border-none focus:outline-none bg-transparent text-foreground placeholder:text-muted-foreground leading-relaxed"
        />
      </div>
      
      {/* Footer */}
      <div className="border-t border-border/60 px-4 py-2 bg-muted/20 flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-4">
          <span>{value.length} characters</span>
          <span>|</span>
          <span>{value.split(/\s+/).filter(w => w).length} words</span>
        </div>
        <div className="flex items-center gap-2">
          <span>CKEditor 5</span>
        </div>
      </div>
    </div>
  );

  // Render form fields based on article type
  const renderTypeSpecificFields = () => {
    switch (articleType) {
      case 'news':
        return (
          <>
            <div>
              <label className="block text-foreground mb-2">Ảnh đại diện *</label>
              <div className="border-2 border-dashed border-border/60 rounded-xl p-8 hover:border-blue-500/50 transition-all duration-200 cursor-pointer group">
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-200">
                    <ImagePlus className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-foreground mb-1">Click để tải ảnh lên</p>
                  <p className="text-sm text-muted-foreground">PNG, JPG hoặc WebP (max. 5MB)</p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-foreground mb-2">Mô tả ngắn</label>
              <textarea
                rows={3}
                placeholder="Mô tả ngắn gọn về bài viết..."
                className="w-full px-4 py-3 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all duration-200 resize-none"
              />
            </div>

            <div>
              <label className="block text-foreground mb-2">Thời gian đọc (phút)</label>
              <input
                type="number"
                placeholder="5"
                className="w-full px-4 py-3 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all duration-200"
              />
            </div>
          </>
        );

      case 'video':
        return (
          <>
            <div>
              <label className="block text-foreground mb-2">URL Video *</label>
              <input
                type="url"
                placeholder="https://youtube.com/watch?v=..."
                className="w-full px-4 py-3 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all duration-200"
              />
            </div>

            <div>
              <label className="block text-foreground mb-2">Thời lượng</label>
              <input
                type="text"
                placeholder="15:30"
                className="w-full px-4 py-3 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all duration-200"
              />
            </div>

            <div>
              <label className="block text-foreground mb-2">Thumbnail</label>
              <div className="border-2 border-dashed border-border/60 rounded-xl p-6 hover:border-red-500/50 transition-all duration-200 cursor-pointer group">
                <div className="text-center">
                  <Video className="w-8 h-8 text-muted-foreground mx-auto mb-2 group-hover:text-red-500 transition-colors" />
                  <p className="text-sm text-muted-foreground">Upload thumbnail</p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-foreground mb-2">Transcript (phụ đề)</label>
              <textarea
                rows={4}
                placeholder="00:00 - Giới thiệu..."
                className="w-full px-4 py-3 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all duration-200 resize-none font-mono text-sm"
              />
            </div>
          </>
        );

      case 'gallery':
        return (
          <>
            <div>
              <label className="block text-foreground mb-2">Mô tả gallery</label>
              <textarea
                rows={3}
                placeholder="Mô tả về bộ sưu tập ảnh này..."
                className="w-full px-4 py-3 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all duration-200 resize-none"
              />
            </div>
          </>
        );

      case 'legal':
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-foreground mb-2">Số hiệu văn bản *</label>
                <input
                  type="text"
                  placeholder="15/2024/NĐ-CP"
                  className="w-full px-4 py-3 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-foreground mb-2">Loại văn bản</label>
                <select className="w-full px-4 py-3 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all duration-200">
                  <option>Nghị định</option>
                  <option>Thông tư</option>
                  <option>Quyết định</option>
                  <option>Luật</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-foreground mb-2">Ngày ban hành</label>
                <input
                  type="date"
                  className="w-full px-4 py-3 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-foreground mb-2">Ngày hiệu lực</label>
                <input
                  type="date"
                  className="w-full px-4 py-3 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all duration-200"
                />
              </div>
            </div>

            <div>
              <label className="block text-foreground mb-2">Cơ quan ban hành</label>
              <input
                type="text"
                placeholder="Chính phủ"
                className="w-full px-4 py-3 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all duration-200"
              />
            </div>

            <div>
              <label className="block text-foreground mb-2">File đính kèm</label>
              <button className="w-full px-4 py-3 border border-border/60 rounded-xl hover:bg-muted/30 transition-all duration-200 flex items-center justify-center gap-2">
                <Upload className="w-4 h-4" />
                <span>Tải lên file PDF</span>
              </button>
            </div>
          </>
        );

      case 'job':
        return (
          <>
            <div>
              <label className="block text-foreground mb-2">Vị trí tuyển dụng *</label>
              <input
                type="text"
                placeholder="Senior Frontend Developer"
                className="w-full px-4 py-3 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all duration-200"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-foreground mb-2">Cấp bậc</label>
                <select className="w-full px-4 py-3 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all duration-200">
                  <option>Intern</option>
                  <option>Junior</option>
                  <option>Middle</option>
                  <option>Senior</option>
                  <option>Lead</option>
                </select>
              </div>
              <div>
                <label className="block text-foreground mb-2">Số lượng</label>
                <input
                  type="number"
                  placeholder="2"
                  className="w-full px-4 py-3 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all duration-200"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-foreground mb-2">Mức lương</label>
                <input
                  type="text"
                  placeholder="25-35 triệu"
                  className="w-full px-4 py-3 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-foreground mb-2">Hạn nộp</label>
                <input
                  type="date"
                  className="w-full px-4 py-3 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all duration-200"
                />
              </div>
            </div>

            <div>
              <label className="block text-foreground mb-2">Địa điểm làm việc</label>
              <input
                type="text"
                placeholder="Hà Nội"
                className="w-full px-4 py-3 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all duration-200"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-foreground mb-2">Email liên hệ</label>
                <input
                  type="email"
                  placeholder="hr@company.com"
                  className="w-full px-4 py-3 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-foreground mb-2">Số điện thoại</label>
                <input
                  type="tel"
                  placeholder="024 1234 5678"
                  className="w-full px-4 py-3 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all duration-200"
                />
              </div>
            </div>
          </>
        );

      case 'podcast':
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-foreground mb-2">Season</label>
                <input
                  type="number"
                  placeholder="2"
                  className="w-full px-4 py-3 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-foreground mb-2">Episode</label>
                <input
                  type="number"
                  placeholder="12"
                  className="w-full px-4 py-3 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all duration-200"
                />
              </div>
            </div>

            <div>
              <label className="block text-foreground mb-2">File Audio *</label>
              <button className="w-full px-4 py-3 border border-border/60 rounded-xl hover:bg-muted/30 transition-all duration-200 flex items-center justify-center gap-2">
                <Upload className="w-4 h-4" />
                <span>Tải lên file MP3/WAV</span>
              </button>
            </div>

            <div>
              <label className="block text-foreground mb-2">Thời lượng</label>
              <input
                type="text"
                placeholder="45:30"
                className="w-full px-4 py-3 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all duration-200"
              />
            </div>

            <div>
              <label className="block text-foreground mb-2">Khách mời</label>
              <textarea
                rows={3}
                placeholder="Dr. Nguyễn Văn X - AI Researcher&#10;Ms. Trần Thị Y - Content Strategist"
                className="w-full px-4 py-3 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all duration-200 resize-none"
              />
            </div>

            <div>
              <label className="block text-foreground mb-2">Album Art</label>
              <div className="border-2 border-dashed border-border/60 rounded-xl p-6 hover:border-pink-500/50 transition-all duration-200 cursor-pointer">
                <div className="text-center">
                  <Mic className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Upload album art (1:1 ratio)</p>
                </div>
              </div>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col animate-in">
      {/* Top Bar */}
      <div className="glass-strong border-b border-border/40 px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <button
              onClick={onClose}
              className="p-2 hover:bg-muted/50 rounded-xl transition-all duration-200"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="h-8 w-px bg-border/60" />

            <div>
              <h2 className="text-foreground">{articleId ? 'Chỉnh sửa bài viết' : 'Tạo bài viết mới'}</h2>
              {lastSaved && (
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Đã lưu lúc {lastSaved.toLocaleTimeString()}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* View Toggle */}
            <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-xl">
              <button
                onClick={() => setActiveTab('edit')}
                className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                  activeTab === 'edit'
                    ? 'bg-card text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Chỉnh sửa
              </button>
              <button
                onClick={() => setActiveTab('preview')}
                className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                  activeTab === 'preview'
                    ? 'bg-card text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Xem trước
              </button>
            </div>

            <div className="h-8 w-px bg-border/60" />

            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 hover:bg-muted/50 rounded-xl transition-all duration-200"
            >
              {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Article Type Selector */}
        <div>
          <label className="block text-sm text-muted-foreground mb-3">Loại bài viết *</label>
          <div className="flex items-center gap-3">
            {articleTypes.map((type) => {
              const Icon = type.icon;
              return (
                <button
                  key={type.id}
                  onClick={() => setArticleType(type.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 transition-all duration-200 ${
                    articleType === type.id
                      ? 'border-blue-500 bg-blue-50 shadow-lg shadow-blue-500/10'
                      : 'border-border/60 hover:border-border bg-card'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${
                    articleType === type.id ? 'text-blue-600' : 'text-muted-foreground'
                  }`} />
                  <span className={`${
                    articleType === type.id ? 'text-blue-700' : 'text-foreground'
                  }`}>
                    {type.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content - Conditional Layout based on activeTab */}
      <div className="flex-1 flex overflow-hidden">
        {activeTab === 'edit' ? (
          <>
            {/* Edit Mode - 2 Column */}
            <div className="flex-1 flex flex-col overflow-hidden border-r border-border/40">
              {/* Title Input */}
              <div className="p-6 pb-4">
                <input
                  type="text"
                  placeholder="Tiêu đề bài viết..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-3xl border-none focus:outline-none bg-transparent text-foreground placeholder:text-muted-foreground"
                />
              </div>

              {/* Content Area - Different for Gallery */}
              <div className="flex-1 overflow-y-auto p-6">
                {articleType === 'gallery' ? (
                  /* Gallery Image Manager */
                  <div className="space-y-6">
                    <div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full border-2 border-dashed border-border/60 rounded-xl p-12 hover:border-purple-500/50 transition-all duration-200 group"
                      >
                        <div className="text-center">
                          <ImageIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4 group-hover:text-purple-500 transition-colors" />
                          <h3 className="text-foreground mb-2">Kéo thả hoặc click để thêm ảnh</h3>
                          <p className="text-sm text-muted-foreground">Hỗ trợ nhiều ảnh cùng lúc. PNG, JPG, WebP (max 10MB/ảnh)</p>
                        </div>
                      </button>
                    </div>

                    {/* Gallery Images Grid */}
                    {galleryImages.length > 0 && (
                      <div className="grid grid-cols-2 gap-4">
                        {galleryImages.map((image, index) => (
                          <div
                            key={image.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, image.id)}
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, image.id)}
                            className={`group relative bg-card border-2 rounded-xl overflow-hidden transition-all duration-200 ${
                              draggedImageId === image.id ? 'opacity-50 border-purple-500' : 'border-border/60 hover:border-purple-500/50'
                            }`}
                          >
                            {/* Drag Handle */}
                            <div className="absolute top-2 left-2 z-10 p-1.5 bg-black/50 backdrop-blur-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity cursor-move">
                              <GripVertical className="w-4 h-4 text-white" />
                            </div>

                            {/* Image Number */}
                            <div className="absolute top-2 right-2 z-10 px-2 py-1 bg-black/50 backdrop-blur-sm rounded-lg text-white text-xs">
                              #{index + 1}
                            </div>

                            {/* Image */}
                            <div className="aspect-video bg-muted">
                              <img src={image.url} alt="" className="w-full h-full object-cover" />
                            </div>

                            {/* Caption Editor */}
                            <div className="p-3 border-t border-border/60">
                              {editingImageId === image.id ? (
                                <div className="flex gap-2">
                                  <input
                                    type="text"
                                    value={image.caption}
                                    onChange={(e) => updateImageCaption(image.id, e.target.value)}
                                    placeholder="Nhập tiêu đề ảnh..."
                                    className="flex-1 px-3 py-2 border border-border/60 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                                    autoFocus
                                    onBlur={() => setEditingImageId(null)}
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter') setEditingImageId(null);
                                    }}
                                  />
                                </div>
                              ) : (
                                <div className="flex items-center gap-2">
                                  <p className="flex-1 text-sm text-muted-foreground truncate">
                                    {image.caption || 'Chưa có tiêu đề...'}
                                  </p>
                                  <button
                                    onClick={() => setEditingImageId(image.id)}
                                    className="p-1.5 hover:bg-muted rounded-lg transition-colors"
                                  >
                                    <Edit2 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => deleteImage(image.id)}
                                    className="p-1.5 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {galleryImages.length > 0 && (
                      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                        <p className="text-sm text-blue-800">
                          💡 <strong>Mẹo:</strong> Kéo thả các ảnh để sắp xếp lại thứ tự. Click biểu tượng bút chì để chỉnh sửa tiêu đề.
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  /* CKEditor for other types */
                  <CKEditorMock value={content} onChange={setContent} />
                )}
              </div>
            </div>

            {/* Right Sidebar - Attributes */}
            <div className="w-[420px] bg-card/50 overflow-y-auto">
              <div className="p-6 space-y-6">
                {/* Categories - Multi Select */}
                <div>
                  <label className="block text-foreground mb-2 flex items-center gap-2">
                    <FolderTree className="w-4 h-4" />
                    Danh mục *
                  </label>
                  <div className="relative">
                    <button
                      onClick={() => setShowCategoryPicker(!showCategoryPicker)}
                      className="w-full px-4 py-3 border border-border/60 rounded-xl hover:bg-muted/30 transition-all duration-200 flex items-center justify-between"
                    >
                      <span className="text-muted-foreground text-sm">
                        {selectedCategories.length} đã chọn
                      </span>
                      <ChevronDown className="w-4 h-4" />
                    </button>

                    {showCategoryPicker && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border/60 rounded-xl shadow-xl z-10 max-h-64 overflow-y-auto animate-slide-in-top">
                        <div className="p-3 border-b border-border/60">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input
                              type="text"
                              placeholder="Tìm danh mục..."
                              className="w-full pl-9 pr-3 py-2 bg-muted/50 border border-border/60 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                            />
                          </div>
                        </div>
                        <div className="p-2">
                          {availableCategories.map((cat) => (
                            <button
                              key={cat.id}
                              onClick={() => toggleCategory(cat.name)}
                              className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 ${
                                selectedCategories.includes(cat.name)
                                  ? 'bg-blue-50 text-blue-700'
                                  : 'hover:bg-muted/30'
                              }`}
                            >
                              <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                                selectedCategories.includes(cat.name)
                                  ? 'bg-blue-600 border-blue-600'
                                  : 'border-border/60'
                              }`}>
                                {selectedCategories.includes(cat.name) && (
                                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                )}
                              </div>
                              <span className="text-sm">{cat.name}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Selected Categories */}
                  {selectedCategories.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {selectedCategories.map((cat, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs flex items-center gap-1.5"
                        >
                          {cat}
                          <button
                            onClick={() => toggleCategory(cat)}
                            className="hover:bg-blue-200 rounded-full p-0.5 transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-foreground mb-2 flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    Tags
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-muted rounded-full text-sm flex items-center gap-1.5"
                      >
                        #{tag}
                        <button
                          onClick={() => setTags(tags.filter((_, i) => i !== index))}
                          className="hover:bg-border rounded-full p-0.5 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <input
                    type="text"
                    placeholder="Thêm tag..."
                    className="w-full px-4 py-2 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 text-sm"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && e.currentTarget.value) {
                        setTags([...tags, e.currentTarget.value]);
                        e.currentTarget.value = '';
                      }
                    }}
                  />
                </div>

                <div className="h-px bg-border/60" />

                {/* Type-specific fields */}
                {renderTypeSpecificFields()}

                <div className="h-px bg-border/60" />

                {/* Author - With Add New */}
                <div>
                  <label className="block text-foreground mb-2 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Tác giả *
                  </label>
                  
                  {showAddAuthor ? (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={newAuthorName}
                        onChange={(e) => setNewAuthorName(e.target.value)}
                        placeholder="Nhập tên tác giả mới..."
                        className="w-full px-4 py-3 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                        autoFocus
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={handleAddAuthor}
                          className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-200"
                        >
                          Thêm
                        </button>
                        <button
                          onClick={() => {
                            setShowAddAuthor(false);
                            setNewAuthorName('');
                          }}
                          className="px-4 py-2 border border-border/60 rounded-xl hover:bg-muted/50 transition-all duration-200"
                        >
                          Hủy
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <select
                        value={selectedAuthor}
                        onChange={(e) => setSelectedAuthor(e.target.value)}
                        className="flex-1 px-4 py-3 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                      >
                        {authors.map((author) => (
                          <option key={author} value={author}>
                            {author}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() => setShowAddAuthor(true)}
                        className="p-3 border border-border/60 rounded-xl hover:bg-blue-50 hover:border-blue-500 transition-all duration-200 group"
                        title="Thêm tác giả mới"
                      >
                        <Plus className="w-5 h-5 text-muted-foreground group-hover:text-blue-600" />
                      </button>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-foreground mb-2">Lên lịch xuất bản</label>
                  <input
                    type="datetime-local"
                    className="w-full px-4 py-3 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                  />
                </div>
              </div>
            </div>
          </>
        ) : (
          /* Preview Mode - Single Column Full Width */
          <div className="flex-1 overflow-y-auto bg-gradient-to-br from-background via-muted/20 to-background">
            <div className="max-w-4xl mx-auto px-6 py-12">
              {/* Article Header */}
              <div className="mb-8">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
                  <span>Trang chủ</span>
                  <span>/</span>
                  {selectedCategories[0] && <span>{selectedCategories[0]}</span>}
                </div>

                {/* Type Badge */}
                <div className="flex items-center gap-2 mb-4">
                  {articleTypes.find(t => t.id === articleType) && (() => {
                    const type = articleTypes.find(t => t.id === articleType)!;
                    const Icon = type.icon;
                    return (
                      <div className={`inline-flex items-center gap-2 px-3 py-1.5 bg-${type.color}-100 text-${type.color}-700 rounded-full text-sm`}>
                        <Icon className="w-4 h-4" />
                        <span>{type.label}</span>
                      </div>
                    );
                  })()}
                </div>

                {/* Title */}
                <h1 className="text-foreground mb-6">
                  {title || 'Tiêu đề bài viết'}
                </h1>

                {/* Meta Info */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>{selectedAuthor}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{new Date().toLocaleDateString('vi-VN')}</span>
                  </div>
                  {articleType === 'news' && (
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      <span>5 phút đọc</span>
                    </div>
                  )}
                </div>

                {/* Tags */}
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {tags.map((tag, idx) => (
                      <span key={idx} className="px-3 py-1 bg-muted text-muted-foreground rounded-full text-xs">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Article Content - Different per type */}
              <div className="bg-card rounded-2xl border border-border/60 overflow-hidden shadow-sm">
                {articleType === 'news' && (
                  <div>
                    {/* Featured Image Placeholder */}
                    <div className="aspect-[21/9] bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                      <ImageIcon className="w-16 h-16 text-blue-400" />
                    </div>
                    
                    {/* Content */}
                    <div className="p-8">
                      <div className="prose prose-lg max-w-none">
                        {content ? (
                          <div dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br />') }} />
                        ) : (
                          <p className="text-muted-foreground">Nội dung bài viết sẽ hiển thị ở đây...</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {articleType === 'video' && (
                  <div>
                    {/* Video Player Placeholder */}
                    <div className="aspect-video bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center">
                      <div className="text-center">
                        <Video className="w-20 h-20 text-red-400 mx-auto mb-4" />
                        <p className="text-red-700">Video Player</p>
                        <p className="text-sm text-red-600 mt-2">https://youtube.com/watch?v=...</p>
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="p-8">
                      <div className="prose prose-lg max-w-none">
                        {content ? (
                          <div dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br />') }} />
                        ) : (
                          <p className="text-muted-foreground">Mô tả video sẽ hiển thị ở đây...</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {articleType === 'gallery' && (
                  <div className="p-8">
                    {galleryImages.length > 0 ? (
                      <div className="space-y-8">
                        {galleryImages.map((img) => (
                          <div key={img.id} className="space-y-3">
                            <div className="rounded-xl overflow-hidden">
                              <img 
                                src={img.url} 
                                alt={img.caption} 
                                className="w-full h-auto"
                              />
                            </div>
                            {img.caption && (
                              <p className="text-center text-muted-foreground italic">
                                {img.caption}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <ImageIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">Chưa có ảnh nào trong gallery</p>
                      </div>
                    )}
                  </div>
                )}

                {articleType === 'legal' && (
                  <div className="p-8">
                    {/* Legal Document Info */}
                    <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-6 mb-6">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Số hiệu:</span>
                          <span className="ml-2 font-medium">15/2024/NĐ-CP</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Loại:</span>
                          <span className="ml-2 font-medium">Nghị định</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Ngày ban hành:</span>
                          <span className="ml-2 font-medium">01/01/2024</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Ngày hiệu lực:</span>
                          <span className="ml-2 font-medium">01/03/2024</span>
                        </div>
                        <div className="col-span-2">
                          <span className="text-muted-foreground">Cơ quan ban hành:</span>
                          <span className="ml-2 font-medium">Chính phủ</span>
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="prose prose-lg max-w-none">
                      {content ? (
                        <div dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br />') }} />
                      ) : (
                        <p className="text-muted-foreground">Nội dung văn bản pháp luật...</p>
                      )}
                    </div>

                    {/* Download Button */}
                    <div className="mt-6 pt-6 border-t border-border/60">
                      <button className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors">
                        <Upload className="w-4 h-4" />
                        <span>Tải xuống văn bản (PDF)</span>
                      </button>
                    </div>
                  </div>
                )}

                {articleType === 'job' && (
                  <div className="p-8">
                    {/* Job Info Cards */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                        <p className="text-sm text-muted-foreground mb-1">Cấp bậc</p>
                        <p className="font-medium text-green-700">Senior</p>
                      </div>
                      <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                        <p className="text-sm text-muted-foreground mb-1">Số lượng</p>
                        <p className="font-medium text-green-700">2 người</p>
                      </div>
                      <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                        <p className="text-sm text-muted-foreground mb-1">Mức lương</p>
                        <p className="font-medium text-green-700">25-35 triệu</p>
                      </div>
                      <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                        <p className="text-sm text-muted-foreground mb-1">Hạn nộp</p>
                        <p className="font-medium text-green-700">31/12/2024</p>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="prose prose-lg max-w-none mb-6">
                      {content ? (
                        <div dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br />') }} />
                      ) : (
                        <p className="text-muted-foreground">Mô tả công việc và yêu cầu...</p>
                      )}
                    </div>

                    {/* Apply Button */}
                    <div className="pt-6 border-t border-border/60">
                      <button className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:shadow-lg hover:shadow-green-500/20 transition-all">
                        <Briefcase className="w-5 h-5" />
                        <span>Ứng tuyển ngay</span>
                      </button>
                    </div>
                  </div>
                )}

                {articleType === 'podcast' && (
                  <div>
                    {/* Podcast Cover */}
                    <div className="aspect-square bg-gradient-to-br from-pink-100 to-pink-200 flex items-center justify-center max-w-md mx-auto">
                      <div className="text-center">
                        <Mic className="w-20 h-20 text-pink-400 mx-auto mb-4" />
                        <p className="text-pink-700">Album Art</p>
                      </div>
                    </div>
                    
                    {/* Audio Player Placeholder */}
                    <div className="p-8">
                      <div className="bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-200 rounded-xl p-6 mb-6">
                        <div className="flex items-center gap-4 mb-4">
                          <button className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center text-white hover:bg-pink-600 transition-colors">
                            ▶
                          </button>
                          <div className="flex-1">
                            <div className="h-2 bg-pink-200 rounded-full overflow-hidden">
                              <div className="h-full w-1/3 bg-pink-500 rounded-full"></div>
                            </div>
                          </div>
                          <span className="text-sm text-muted-foreground">15:20 / 45:30</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <p>Season 2, Episode 12</p>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="prose prose-lg max-w-none">
                        {content ? (
                          <div dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br />') }} />
                        ) : (
                          <p className="text-muted-foreground">Mô tả podcast...</p>
                        )}
                      </div>

                      {/* Guests */}
                      <div className="mt-6 pt-6 border-t border-border/60">
                        <h3 className="mb-3">Khách mời</h3>
                        <div className="space-y-2 text-sm text-muted-foreground">
                          <p>Dr. Nguyễn Văn X - AI Researcher</p>
                          <p>Ms. Trần Thị Y - Content Strategist</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {articleType === 'event' && (
                  <div className="p-8">
                    {/* Event Info */}
                    <div className="bg-orange-50 border border-orange-200 rounded-xl p-6 mb-6">
                      <div className="flex items-start gap-4">
                        <div className="bg-orange-500 text-white rounded-xl p-4 text-center min-w-[80px]">
                          <div className="text-2xl font-bold">26</div>
                          <div className="text-sm">Th12</div>
                        </div>
                        <div>
                          <h3 className="text-orange-900 mb-2">Sự kiện Tech Conference 2024</h3>
                          <div className="space-y-1 text-sm text-muted-foreground">
                            <p>📍 Hà Nội</p>
                            <p>🕐 09:00 - 17:00</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="prose prose-lg max-w-none mb-6">
                      {content ? (
                        <div dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br />') }} />
                      ) : (
                        <p className="text-muted-foreground">Thông tin sự kiện...</p>
                      )}
                    </div>

                    {/* Register Button */}
                    <div className="pt-6 border-t border-border/60">
                      <button className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:shadow-lg hover:shadow-orange-500/20 transition-all">
                        <Calendar className="w-5 h-5" />
                        <span>Đăng ký tham dự</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Related Categories */}
              {selectedCategories.length > 0 && (
                <div className="mt-8 p-6 bg-card rounded-xl border border-border/60">
                  <h3 className="text-sm text-muted-foreground mb-3">Danh mục</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedCategories.map((cat, idx) => (
                      <span key={idx} className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm">
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Toolbar - AI Tools & Actions */}
      <div className="glass-strong border-t border-border/40 px-6 py-4">
        <div className="flex items-center justify-between max-w-full">
          {/* AI Tools */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAiTools(!showAiTools)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-200"
            >
              <Sparkles className="w-4 h-4" />
              <span>AI Tools</span>
            </button>

            {showAiTools && (
              <div className="flex items-center gap-2 animate-slide-in-bottom">
                {aiTools.map((tool) => {
                  const Icon = tool.icon;
                  return (
                    <button
                      key={tool.id}
                      className={`flex items-center gap-2 px-4 py-2 bg-${tool.color}-100 text-${tool.color}-700 rounded-xl hover:bg-${tool.color}-200 transition-all duration-200`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-sm">{tool.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-border/60 rounded-xl hover:bg-muted/50 transition-all duration-200"
            >
              Hủy
            </button>
            <button className="px-6 py-2 border border-border/60 rounded-xl hover:bg-muted/50 transition-all duration-200">
              Lưu nháp
            </button>
            <button className="flex items-center gap-2 px-6 py-2 border border-border/60 rounded-xl hover:bg-muted/50 transition-all duration-200">
              <Eye className="w-4 h-4" />
              <span>Xem trước</span>
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-200 disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Đang lưu...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Xuất bản</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
