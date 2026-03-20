import { useState, useEffect } from 'react';
import { ArrowLeft, Edit, Trash2, Globe, Calendar, User, Eye, MessageCircle, Heart, Clock, Share2, Bookmark, MapPin, Briefcase, DollarSign, FileText, Download, Play, Image as ImageIcon, Users, RotateCcw, GitBranch, Upload, FolderOpen, Film, Headphones, X, ExternalLink, Tag, Building2, Mail, Phone, Gavel, Scale, FileCheck, Layers, ChevronRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { SectionPreviewRenderer } from '../src/modules/articles/components/sections/renderers/SectionPreviewRenderer';
import { getArticle } from '../services/api';

interface ArticleDetailProps {
  articleId: number;
  onNavigate: (page: any) => void;
}

export function ArticleDetail({ articleId, onNavigate }: ArticleDetailProps) {
  const { t } = useLanguage();
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [activeTab, setActiveTab] = useState<'content' | 'info' | 'versions'>('content');

  useEffect(() => {
    const loadArticle = async () => {
      setLoading(true);
      try {
        const data = await getArticle(articleId);
        setArticle(data);
      } catch (error) {
        console.error('Error loading article:', error);
      } finally {
        setLoading(false);
      }
    };
    loadArticle();
  }, [articleId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-muted-foreground">Đang tải bài viết...</span>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center">
          <FileText className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-foreground">Không tìm thấy bài viết</h3>
        <p className="text-sm text-muted-foreground">Bài viết không tồn tại hoặc đã bị xóa</p>
        <button
          onClick={() => onNavigate({ page: 'articles' })}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Quay lại danh sách
        </button>
      </div>
    );
  }

  const statusColors: Record<string, string> = {
    published: 'bg-green-100 text-green-700',
    draft: 'bg-gray-100 text-gray-600',
    pending: 'bg-yellow-100 text-yellow-700',
    archived: 'bg-red-100 text-red-600',
  };

  const typeIcons: Record<string, React.ElementType> = {
    news: FileText, video: Play, gallery: ImageIcon, legal: Scale,
    recruitment: Briefcase, podcast: Headphones, event: Calendar,
    personnel: Users, download: Download, infographic: ImageIcon,
    pdf: FileText, faq: MessageCircle,
  };
  const TypeIcon = typeIcons[article.type] || FileText;

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <button onClick={() => onNavigate({ page: 'articles' })} className="hover:text-foreground transition-colors flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Bài viết
        </button>
        <ChevronRight className="w-3 h-3" />
        <span className="text-foreground truncate max-w-[300px]">{article.title}</span>
      </div>

      {/* Article Header Card */}
      <div className="bg-card border border-border/60 rounded-2xl overflow-hidden mb-6 shadow-sm">
        {/* Featured Image */}
        {article.thumbnail && (
          <div className="relative aspect-[21/9] overflow-hidden">
            <img src={article.thumbnail} alt={article.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <div className="flex items-center gap-2 mb-3">
                <span className={`px-3 py-1 rounded-full text-xs ${statusColors[article.status] || statusColors.draft}`}>
                  {article.status === 'published' ? 'Đã xuất bản' : article.status === 'draft' ? 'Nháp' : article.status === 'pending' ? 'Chờ duyệt' : 'Lưu trữ'}
                </span>
                <span className="px-3 py-1 rounded-full text-xs bg-white/20 text-white flex items-center gap-1">
                  <TypeIcon className="w-3 h-3" /> {article.type}
                </span>
                {article.contentMode === 'sections' && (
                  <span className="px-3 py-1 rounded-full text-xs bg-purple-500/20 text-white flex items-center gap-1">
                    <Layers className="w-3 h-3" /> {article.sections?.length || 0} sections
                  </span>
                )}
              </div>
              <h1 className="text-white text-2xl md:text-3xl mb-2">{article.title}</h1>
            </div>
          </div>
        )}

        {/* No thumbnail variant */}
        {!article.thumbnail && (
          <div className="p-8 pb-4">
            <div className="flex items-center gap-2 mb-3">
              <span className={`px-3 py-1 rounded-full text-xs ${statusColors[article.status] || statusColors.draft}`}>
                {article.status === 'published' ? 'Đã xuất bản' : article.status === 'draft' ? 'Nháp' : article.status === 'pending' ? 'Chờ duyệt' : 'Lưu trữ'}
              </span>
              <span className="px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-700 flex items-center gap-1">
                <TypeIcon className="w-3 h-3" /> {article.type}
              </span>
              {article.contentMode === 'sections' && (
                <span className="px-3 py-1 rounded-full text-xs bg-purple-100 text-purple-700 flex items-center gap-1">
                  <Layers className="w-3 h-3" /> {article.sections?.length || 0} sections
                </span>
              )}
            </div>
            <h1 className="text-2xl md:text-3xl text-foreground mb-2">{article.title}</h1>
          </div>
        )}

        {/* Meta bar */}
        <div className="flex items-center justify-between px-8 py-3 border-t border-border/40 bg-muted/30">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <User className="w-4 h-4" />
              <span>{article.author || 'Unknown'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              <span>{article.date || article.createdAt}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Eye className="w-4 h-4" />
              <span>{article.views?.toLocaleString() || 0} lượt xem</span>
            </div>
            {article.category && (
              <div className="flex items-center gap-1.5">
                <Tag className="w-4 h-4" />
                <span>{Array.isArray(article.category) ? article.category.join(', ') : article.category}</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setLiked(!liked)} className={`p-2 rounded-lg transition-colors ${liked ? 'text-red-500 bg-red-50' : 'text-gray-400 hover:bg-gray-100'}`}>
              <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
            </button>
            <button onClick={() => setBookmarked(!bookmarked)} className={`p-2 rounded-lg transition-colors ${bookmarked ? 'text-blue-500 bg-blue-50' : 'text-gray-400 hover:bg-gray-100'}`}>
              <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-current' : ''}`} />
            </button>
            <button className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors">
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate({ page: 'articles', action: 'edit', articleId: article.id })}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              <Edit className="w-3.5 h-3.5" /> Sửa
            </button>
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <div className="flex items-center gap-1 mb-6 bg-muted/30 p-1 rounded-xl border border-border/40">
        {[
          { id: 'content' as const, label: 'Nội dung', icon: FileText },
          { id: 'info' as const, label: 'Thông tin', icon: Globe },
          { id: 'versions' as const, label: 'Phiên bản', icon: GitBranch },
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm transition-colors ${
                activeTab === tab.id
                  ? 'bg-card shadow text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="w-4 h-4" /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content Tab */}
      {activeTab === 'content' && (
        <div className="bg-card border border-border/60 rounded-2xl p-8 shadow-sm">
          {/* Excerpt */}
          {article.excerpt && (
            <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 rounded-r-lg">
              <p className="text-blue-900 dark:text-blue-200 italic">{article.excerpt}</p>
            </div>
          )}

          {/* Main Content - Multi-section or Legacy */}
          {article.contentMode === 'sections' && article.sections && article.sections.length > 0 ? (
            <SectionPreviewRenderer sections={article.sections} />
          ) : article.content ? (
            <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: article.content }} />
          ) : (
            <p className="text-muted-foreground italic">Chưa có nội dung</p>
          )}

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="mt-8 pt-6 border-t border-border/60">
              <h4 className="text-sm text-muted-foreground mb-3 flex items-center gap-1.5">
                <Tag className="w-4 h-4" /> Tags
              </h4>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag: string, i: number) => (
                  <span key={i} className="px-3 py-1.5 bg-muted rounded-full text-sm text-muted-foreground hover:bg-blue-50 hover:text-blue-700 transition-colors cursor-pointer">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Info Tab */}
      {activeTab === 'info' && (
        <div className="bg-card border border-border/60 rounded-2xl p-8 shadow-sm">
          <div className="grid grid-cols-2 gap-6">
            {[
              { label: 'ID', value: `#${article.id}` },
              { label: 'Loại bài viết', value: article.type },
              { label: 'Trạng thái', value: article.status },
              { label: 'Tác giả', value: article.author },
              { label: 'Danh mục', value: Array.isArray(article.category) ? article.category.join(', ') : article.category },
              { label: 'Slug', value: article.slug || 'Chưa có' },
              { label: 'Ngày tạo', value: article.createdAt || article.date },
              { label: 'Chế độ nội dung', value: article.contentMode === 'sections' ? `Block Editor (${article.sections?.length || 0} sections)` : 'Rich Text (Legacy)' },
              { label: 'Lượt xem', value: article.views?.toLocaleString() || '0' },
              { label: 'Bình luận', value: article.comments?.toString() || '0' },
            ].map((item, i) => (
              <div key={i} className="space-y-1">
                <label className="text-xs text-muted-foreground">{item.label}</label>
                <p className="text-sm text-foreground">{item.value}</p>
              </div>
            ))}
          </div>

          {/* Section Summary (if sections mode) */}
          {article.contentMode === 'sections' && article.sections && (
            <div className="mt-6 pt-6 border-t border-border/60">
              <h4 className="text-sm text-muted-foreground mb-3 flex items-center gap-1.5">
                <Layers className="w-4 h-4" /> Cấu trúc nội dung ({article.sections.length} sections)
              </h4>
              <div className="space-y-1.5">
                {article.sections.map((section: any, i: number) => (
                  <div key={section.id} className="flex items-center gap-2 px-3 py-2 bg-muted/30 rounded-lg text-sm">
                    <span className="text-xs text-muted-foreground w-6">{i + 1}</span>
                    <span className="px-2 py-0.5 rounded text-xs bg-blue-100 text-blue-700 capitalize">{section.type}</span>
                    <span className="text-muted-foreground truncate">{section.title || (section.type === 'html' ? 'Văn bản' : section.type)}</span>
                    {!section.isVisible && <span className="text-xs text-orange-500">(ẩn)</span>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Versions Tab */}
      {activeTab === 'versions' && (
        <div className="bg-card border border-border/60 rounded-2xl p-8 shadow-sm">
          <div className="text-center py-12">
            <GitBranch className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h4 className="text-foreground mb-1">Lịch sử phiên bản</h4>
            <p className="text-sm text-muted-foreground">Tính năng quản lý phiên bản sẽ sớm được cập nhật</p>
          </div>
        </div>
      )}
    </div>
  );
}
