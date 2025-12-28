import React, { useState, useEffect } from 'react';
import {
  Eye, Edit, Trash2, MoreVertical, Calendar, User, MessageSquare,
  Star, Clock, FileText, Video, Image as ImageIcon, File, Briefcase,
  Mic, MapPin, Download, Users, ChevronRight, Filter, Search,
  Grid, List, Check, X
} from 'lucide-react';
import { Card } from './Card';

export interface Article {
  id: number;
  title: string;
  type: string;
  status: 'published' | 'draft' | 'review' | 'scheduled' | 'archived';
  category?: string;
  author: string;
  views: number;
  comments: number;
  publishDate: string;
  updatedDate: string;
  featured?: boolean;
  thumbnail?: string;
  excerpt?: string;
  // Type-specific fields
  duration?: string;
  videoUrl?: string;
  imageCount?: number;
  documentNumber?: string;
  position?: string;
  salary?: string;
  location?: string;
  deadline?: string;
  episode?: number;
  audioUrl?: string;
  eventDate?: string;
  eventTime?: string;
  registrationCount?: number;
  maxParticipants?: number;
  department?: string;
  joinDate?: string;
  fileSize?: string;
  fileType?: string;
  downloadCount?: number;
}

interface ArticleListViewProps {
  articles: Article[];
  onNavigate?: (page: any) => void;
  onEdit?: (articleId: number) => void;
  onDelete?: (articleId: number) => void;
  onSelectionChange?: (selectedIds: number[]) => void;
  selectedIds?: number[];
  showCategory?: boolean;
  showTypeFilter?: boolean;
  showStatusFilter?: boolean;
  showBulkActions?: boolean;
  showSearch?: boolean;
  viewModeToggle?: boolean;
  enableSelection?: boolean;
  customActions?: Array<{
    label: string;
    icon: any;
    onClick: (article: Article) => void;
    color?: string;
  }>;
  emptyMessage?: string;
  emptyIcon?: any;
  compact?: boolean;
  highlightColor?: string;
  viewMode?: 'grid' | 'list'; // Add viewMode prop
}

export function ArticleListView({
  articles,
  onNavigate,
  onEdit,
  onDelete,
  onSelectionChange,
  selectedIds,
  showCategory = true,
  showTypeFilter = true,
  showStatusFilter = true,
  showBulkActions = false,
  showSearch = true,
  viewModeToggle = true,
  enableSelection = false,
  customActions = [],
  emptyMessage = 'Không có bài viết nào',
  emptyIcon: EmptyIcon = FileText,
  compact = false,
  highlightColor = '#3B82F6',
  viewMode = 'list', // External viewMode prop
}: ArticleListViewProps) {
  const [selectedArticles, setSelectedArticles] = useState<number[]>(selectedIds || []);

  const articleTypes = [
    { value: 'all', label: 'Tất cả loại', icon: FileText },
    { value: 'news', label: 'Tin tức', icon: FileText },
    { value: 'video', label: 'Video', icon: Video },
    { value: 'gallery', label: 'Thư viện ảnh', icon: ImageIcon },
    { value: 'legal', label: 'Văn bản pháp luật', icon: File },
    { value: 'staff', label: 'Nhân sự', icon: Users },
    { value: 'job', label: 'Tuyển dụng', icon: Briefcase },
    { value: 'podcast', label: 'Podcast', icon: Mic },
    { value: 'event', label: 'Sự kiện', icon: MapPin },
    { value: 'download', label: 'Tải xuống', icon: Download },
  ];

  const statusOptions = [
    { value: 'all', label: 'Tất cả trạng thái' },
    { value: 'published', label: 'Đã xuất bản' },
    { value: 'draft', label: 'Nháp' },
    { value: 'review', label: 'Chờ duyệt' },
    { value: 'scheduled', label: 'Đã lên lịch' },
    { value: 'archived', label: 'Đã lưu trữ' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400';
      case 'draft': return 'bg-gray-100 dark:bg-gray-900/30 text-gray-600 dark:text-gray-400';
      case 'review': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400';
      case 'scheduled': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400';
      case 'archived': return 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400';
      default: return 'bg-gray-100 dark:bg-gray-900/30 text-gray-600 dark:text-gray-400';
    }
  };

  const getStatusLabel = (status: string) => {
    const option = statusOptions.find(s => s.value === status);
    return option?.label || status;
  };

  const getTypeIcon = (type: string) => {
    const typeObj = articleTypes.find(t => t.value === type);
    return typeObj?.icon || FileText;
  };

  const getTypeLabel = (type: string) => {
    const typeObj = articleTypes.find(t => t.value === type);
    return typeObj?.label || type;
  };

  const toggleSelectArticle = (id: number) => {
    const newSelection = selectedArticles.includes(id) 
      ? selectedArticles.filter(aid => aid !== id) 
      : [...selectedArticles, id];
    setSelectedArticles(newSelection);
    onSelectionChange?.(newSelection);
  };

  const toggleSelectAll = () => {
    const newSelection = selectedArticles.length === articles.length 
      ? [] 
      : articles.map(a => a.id);
    setSelectedArticles(newSelection);
    onSelectionChange?.(newSelection);
  };

  // Sync with external selectedIds prop
  useEffect(() => {
    if (selectedIds !== undefined) {
      setSelectedArticles(selectedIds);
    }
  }, [selectedIds]);

  return (
    <div className="space-y-4">
      {/* Articles Grid/List */}
      {articles.length > 0 ? (
        viewMode === 'grid' ? (
          <div className={`grid gap-4 ${compact ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
            {articles.map((article) => {
              const TypeIcon = getTypeIcon(article.type);
              return (
                <Card key={article.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
                  {article.thumbnail && (
                    <div className="relative h-48 overflow-hidden">
                      <img src={article.thumbnail} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      {article.featured && (
                        <div className="absolute top-3 right-3">
                          <span className="px-2 py-1 bg-yellow-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1">
                            <Star className="w-3 h-3" />
                            Nổi bật
                          </span>
                        </div>
                      )}
                      {enableSelection && (
                        <div className="absolute top-3 left-3">
                          <input
                            type="checkbox"
                            checked={selectedArticles.includes(article.id)}
                            onChange={() => toggleSelectArticle(article.id)}
                            className="w-5 h-5 rounded"
                          />
                        </div>
                      )}
                    </div>
                  )}

                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${getStatusColor(article.status)}`}>
                        {getStatusLabel(article.status)}
                      </span>
                      <span className="px-2 py-1 bg-secondary rounded-lg text-xs flex items-center gap-1">
                        <TypeIcon className="w-3 h-3" />
                        {getTypeLabel(article.type)}
                      </span>
                    </div>

                    <h3 className="font-semibold mb-2 line-clamp-2 group-hover:text-blue-500 transition-colors">
                      {article.title}
                    </h3>

                    {article.excerpt && (
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {article.excerpt}
                      </p>
                    )}

                    {showCategory && article.category && (
                      <p className="text-xs text-muted-foreground mb-3">
                        📁 {article.category}
                      </p>
                    )}

                    <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {article.views}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-3 h-3" />
                        {article.comments}
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {article.author}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-border">
                      <span className="text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3 inline mr-1" />
                        {new Date(article.publishDate).toLocaleDateString('vi-VN')}
                      </span>
                      <div className="flex gap-1">
                        {onEdit && (
                          <button
                            onClick={() => onEdit(article.id)}
                            className="p-1.5 hover:bg-secondary rounded-lg transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        )}
                        {onNavigate && (
                          <button
                            onClick={() => onNavigate({ page: 'article-detail', id: article.id })}
                            className="p-1.5 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                          >
                            <ChevronRight className="w-4 h-4 text-blue-500" />
                          </button>
                        )}
                        {customActions.map((action, idx) => (
                          <button
                            key={idx}
                            onClick={() => action.onClick(article)}
                            className="p-1.5 hover:bg-secondary rounded-lg transition-colors"
                            style={action.color ? { color: action.color } : {}}
                          >
                            {React.createElement(action.icon, { className: 'w-4 h-4' })}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card>
            {enableSelection && (
              <div className="p-4 border-b border-border">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedArticles.length === articles.length && articles.length > 0}
                    onChange={toggleSelectAll}
                    className="w-5 h-5 rounded"
                  />
                  <span className="text-sm font-medium">Chọn tất cả</span>
                </label>
              </div>
            )}
            <div className="divide-y divide-border">
              {articles.map((article) => {
                const TypeIcon = getTypeIcon(article.type);
                return (
                  <div key={article.id} className={`p-${compact ? '4' : '5'} hover:bg-secondary/50 transition-colors group`}>
                    <div className="flex items-start gap-4">
                      {enableSelection && (
                        <input
                          type="checkbox"
                          checked={selectedArticles.includes(article.id)}
                          onChange={() => toggleSelectArticle(article.id)}
                          className="w-5 h-5 rounded mt-1"
                        />
                      )}

                      {article.thumbnail && !compact && (
                        <img
                          src={article.thumbnail}
                          alt={article.title}
                          className="w-32 h-20 object-cover rounded-lg flex-shrink-0"
                        />
                      )}

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              {article.featured && (
                                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 flex-shrink-0" />
                              )}
                              <span className={`px-2 py-0.5 rounded-lg text-xs font-semibold ${getStatusColor(article.status)}`}>
                                {getStatusLabel(article.status)}
                              </span>
                              <span className="px-2 py-0.5 bg-secondary rounded-lg text-xs flex items-center gap-1">
                                <TypeIcon className="w-3 h-3" />
                                {getTypeLabel(article.type)}
                              </span>
                              {showCategory && article.category && (
                                <span className="text-xs text-muted-foreground">
                                  📁 {article.category}
                                </span>
                              )}
                            </div>
                            <h3 className={`font-semibold ${compact ? 'text-base' : 'text-lg'} mb-1 group-hover:text-blue-500 transition-colors`}>
                              {article.title}
                            </h3>
                            {!compact && article.excerpt && (
                              <p className="text-sm text-muted-foreground line-clamp-1 mb-2">
                                {article.excerpt}
                              </p>
                            )}
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <User className="w-4 h-4" />
                                {article.author}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {new Date(article.publishDate).toLocaleDateString('vi-VN')}
                              </span>
                              <span className="flex items-center gap-1">
                                <Eye className="w-4 h-4" />
                                {article.views}
                              </span>
                              <span className="flex items-center gap-1">
                                <MessageSquare className="w-4 h-4" />
                                {article.comments}
                              </span>
                            </div>
                          </div>

                          <div className="flex gap-2 flex-shrink-0">
                            {onEdit && (
                              <button
                                onClick={() => onEdit(article.id)}
                                className="p-2 hover:bg-secondary rounded-lg transition-colors"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                            )}
                            {onDelete && (
                              <button
                                onClick={() => onDelete(article.id)}
                                className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                              >
                                <Trash2 className="w-4 h-4 text-red-500" />
                              </button>
                            )}
                            {onNavigate && (
                              <button
                                onClick={() => onNavigate({ page: 'article-detail', id: article.id })}
                                className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                              >
                                <ChevronRight className="w-4 h-4 text-blue-500" />
                              </button>
                            )}
                            {customActions.map((action, idx) => (
                              <button
                                key={idx}
                                onClick={() => action.onClick(article)}
                                className="p-2 hover:bg-secondary rounded-lg transition-colors"
                                style={action.color ? { color: action.color } : {}}
                              >
                                {React.createElement(action.icon, { className: 'w-4 h-4' })}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        )
      ) : (
        <Card className="p-12 text-center">
          <EmptyIcon className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">{emptyMessage}</p>
        </Card>
      )}
    </div>
  );
}