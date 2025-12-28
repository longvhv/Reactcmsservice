import React, { useState, useEffect } from 'react';
import {
  Eye, Edit, Trash2, MoreVertical, Calendar, User, MessageSquare,
  Star, Clock, FileText, Video, Image as ImageIcon, File, Briefcase,
  Mic, MapPin, Download, Users, ChevronDown, ChevronUp, Settings,
  Check, X, ArrowUpDown, Filter, ArrowUp, ArrowDown, Columns, MoreHorizontal,
  Search, Table, List, LayoutGrid
} from 'lucide-react';

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

export interface ColumnConfig {
  id: string;
  label: string;
  visible: boolean;
  sortable: boolean;
  width?: string;
  alwaysVisible?: boolean;
}

interface ArticleTableViewProps {
  articles: Article[];
  onEdit?: (articleId: number) => void;
  onDelete?: (articleId: number) => void;
  onSelectionChange?: (selectedIds: number[]) => void;
  selectedIds?: number[];
  enableSelection?: boolean;
  onNavigate?: (page: any) => void;
  onViewModeChange?: (mode: 'table' | 'list' | 'grid') => void;
  currentViewMode?: 'table' | 'list' | 'grid';
}

const DEFAULT_COLUMNS: ColumnConfig[] = [
  { id: 'id', label: 'ID', visible: false, sortable: true, width: '80px' },
  { id: 'thumbnail', label: 'Hình ảnh', visible: true, sortable: false, width: '100px' },
  { id: 'title', label: 'Tiêu đề', visible: true, sortable: true, alwaysVisible: true },
  { id: 'type', label: 'Loại', visible: true, sortable: true, width: '140px' },
  { id: 'status', label: 'Trạng thái', visible: true, sortable: true, width: '130px' },
  { id: 'category', label: 'Danh mục', visible: true, sortable: true, width: '150px' },
  { id: 'author', label: 'Tác giả', visible: true, sortable: true, width: '150px' },
  { id: 'views', label: 'Lượt xem', visible: true, sortable: true, width: '110px' },
  { id: 'comments', label: 'Bình luận', visible: false, sortable: true, width: '110px' },
  { id: 'publishDate', label: 'Ngày xuất bản', visible: true, sortable: true, width: '160px' },
  { id: 'updatedDate', label: 'Cập nhật', visible: false, sortable: true, width: '160px' },
  { id: 'featured', label: 'Nổi bật', visible: false, sortable: true, width: '100px' },
];

export function ArticleTableView({
  articles,
  onEdit,
  onDelete,
  onSelectionChange,
  selectedIds = [],
  enableSelection = false,
  onNavigate,
  onViewModeChange,
  currentViewMode = 'table',
}: ArticleTableViewProps) {
  const [columns, setColumns] = useState<ColumnConfig[]>(() => {
    const saved = localStorage.getItem('articleTableColumns');
    return saved ? JSON.parse(saved) : DEFAULT_COLUMNS;
  });
  const [showColumnSelector, setShowColumnSelector] = useState(false);
  const [sortColumn, setSortColumn] = useState<string>('publishDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [selectedArticles, setSelectedArticles] = useState<number[]>(selectedIds);
  const [showActionsMenu, setShowActionsMenu] = useState<number | null>(null);

  // Save column config to localStorage
  useEffect(() => {
    localStorage.setItem('articleTableColumns', JSON.stringify(columns));
  }, [columns]);

  // Sync selected articles
  useEffect(() => {
    setSelectedArticles(selectedIds);
  }, [selectedIds]);

  const toggleColumn = (columnId: string) => {
    const column = columns.find(c => c.id === columnId);
    if (column?.alwaysVisible) return;

    setColumns(columns.map(col =>
      col.id === columnId ? { ...col, visible: !col.visible } : col
    ));
  };

  const resetColumns = () => {
    setColumns(DEFAULT_COLUMNS);
  };

  const handleSort = (columnId: string) => {
    if (sortColumn === columnId) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnId);
      setSortDirection('asc');
    }
  };

  const sortedArticles = [...articles].sort((a, b) => {
    let aVal: any = a[sortColumn as keyof Article];
    let bVal: any = b[sortColumn as keyof Article];

    // Handle different data types
    if (typeof aVal === 'string') aVal = aVal.toLowerCase();
    if (typeof bVal === 'string') bVal = bVal.toLowerCase();

    if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const toggleSelectAll = () => {
    if (selectedArticles.length === articles.length) {
      setSelectedArticles([]);
      onSelectionChange?.([]);
    } else {
      const allIds = articles.map(a => a.id);
      setSelectedArticles(allIds);
      onSelectionChange?.(allIds);
    }
  };

  const toggleSelectArticle = (id: number) => {
    const newSelection = selectedArticles.includes(id)
      ? selectedArticles.filter(i => i !== id)
      : [...selectedArticles, id];
    setSelectedArticles(newSelection);
    onSelectionChange?.(newSelection);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-700 border-green-200';
      case 'draft': return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'review': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'scheduled': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'archived': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      published: 'Đã xuất bản',
      draft: 'Nháp',
      review: 'Chờ duyệt',
      scheduled: 'Đã lên lịch',
      archived: 'Đã lưu trữ',
    };
    return labels[status] || status;
  };

  const getTypeIcon = (type: string) => {
    const icons: Record<string, any> = {
      news: FileText,
      video: Video,
      gallery: ImageIcon,
      legal: File,
      staff: Users,
      job: Briefcase,
      podcast: Mic,
      event: MapPin,
      download: Download,
    };
    return icons[type] || FileText;
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      news: 'Tin tức',
      video: 'Video',
      gallery: 'Thư viện ảnh',
      legal: 'Văn bản pháp luật',
      staff: 'Nhân sự',
      job: 'Tuyển dụng',
      podcast: 'Podcast',
      event: 'Sự kiện',
      download: 'Tải xuống',
    };
    return labels[type] || type;
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      news: 'bg-blue-50 text-blue-600 border-blue-200',
      video: 'bg-red-50 text-red-600 border-red-200',
      gallery: 'bg-purple-50 text-purple-600 border-purple-200',
      legal: 'bg-orange-50 text-orange-600 border-orange-200',
      staff: 'bg-green-50 text-green-600 border-green-200',
      job: 'bg-teal-50 text-teal-600 border-teal-200',
      podcast: 'bg-pink-50 text-pink-600 border-pink-200',
      event: 'bg-indigo-50 text-indigo-600 border-indigo-200',
      download: 'bg-cyan-50 text-cyan-600 border-cyan-200',
    };
    return colors[type] || 'bg-gray-50 text-gray-600 border-gray-200';
  };

  const visibleColumns = columns.filter(c => c.visible);

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {enableSelection && selectedArticles.length > 0 && (
            <div className="px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700">
              Đã chọn {selectedArticles.length} bài viết
            </div>
          )}
        </div>

        {/* Column Selector */}
        <div className="relative">
          <button
            onClick={() => setShowColumnSelector(!showColumnSelector)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border/60 hover:bg-muted/40 transition-all duration-200 group"
          >
            <Columns className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
            <span className="text-sm text-muted-foreground group-hover:text-foreground">Cột hiển thị</span>
            <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${showColumnSelector ? 'rotate-180' : ''}`} />
          </button>

          {showColumnSelector && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowColumnSelector(false)}
              />
              <div className="absolute right-0 top-full mt-2 w-64 bg-card border border-border/60 rounded-xl shadow-2xl shadow-black/10 z-20 overflow-hidden animate-slide-in-top">
                <div className="p-3 border-b border-border/60 bg-gradient-to-r from-blue-50 to-purple-50">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-foreground">Cột hiển thị</h4>
                    <button
                      onClick={resetColumns}
                      className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Đặt lại
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {visibleColumns.length}/{columns.length} cột
                  </p>
                </div>

                <div className="p-2 max-h-96 overflow-y-auto">
                  {columns.map(column => (
                    <button
                      key={column.id}
                      onClick={() => toggleColumn(column.id)}
                      disabled={column.alwaysVisible}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200 ${
                        column.alwaysVisible
                          ? 'opacity-50 cursor-not-allowed'
                          : 'hover:bg-muted/60 cursor-pointer'
                      }`}
                    >
                      <span className="text-sm text-foreground">{column.label}</span>
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                        column.visible
                          ? 'bg-blue-500 border-blue-500'
                          : 'border-border/60'
                      }`}>
                        {column.visible && <Check className="w-3.5 h-3.5 text-white" />}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="relative overflow-hidden rounded-xl border border-border/60 bg-card shadow-lg">
        {/* Gradient accent */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/60 bg-muted/20">
                {enableSelection && (
                  <th className="px-4 py-3 text-left w-12">
                    <input
                      type="checkbox"
                      checked={selectedArticles.length === articles.length && articles.length > 0}
                      onChange={toggleSelectAll}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                )}
                
                {visibleColumns.map(column => (
                  <th
                    key={column.id}
                    className="px-4 py-3 text-left"
                    style={{ width: column.width }}
                  >
                    {column.sortable ? (
                      <button
                        onClick={() => handleSort(column.id)}
                        className="flex items-center gap-2 font-medium text-sm text-foreground hover:text-blue-600 transition-colors group"
                      >
                        {column.label}
                        <div className="flex flex-col">
                          {sortColumn === column.id ? (
                            sortDirection === 'asc' ? (
                              <ArrowUp className="w-3.5 h-3.5" />
                            ) : (
                              <ArrowDown className="w-3.5 h-3.5" />
                            )
                          ) : (
                            <ArrowUpDown className="w-3.5 h-3.5 opacity-0 group-hover:opacity-50 transition-opacity" />
                          )}
                        </div>
                      </button>
                    ) : (
                      <span className="font-medium text-sm text-foreground">{column.label}</span>
                    )}
                  </th>
                ))}

                <th className="px-4 py-3 text-right w-24">
                  <span className="font-medium text-sm text-foreground">Thao tác</span>
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border/40">
              {sortedArticles.map((article, idx) => {
                const TypeIcon = getTypeIcon(article.type);
                const isSelected = selectedArticles.includes(article.id);

                return (
                  <tr
                    key={article.id}
                    className={`group hover:bg-muted/20 transition-colors ${
                      isSelected ? 'bg-blue-50/50' : ''
                    }`}
                  >
                    {enableSelection && (
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectArticle(article.id)}
                          className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                    )}

                    {columns.find(c => c.id === 'id' && c.visible) && (
                      <td className="px-4 py-3">
                        <span className="text-sm text-muted-foreground">#{article.id}</span>
                      </td>
                    )}

                    {columns.find(c => c.id === 'thumbnail' && c.visible) && (
                      <td className="px-4 py-3">
                        {article.thumbnail ? (
                          <div className="relative w-16 h-10 rounded-lg overflow-hidden border border-border/60 group-hover:border-blue-300 transition-colors">
                            <img
                              src={article.thumbnail}
                              alt={article.title}
                              className="w-full h-full object-cover"
                            />
                            {article.featured && (
                              <div className="absolute top-0.5 right-0.5">
                                <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="w-16 h-10 rounded-lg bg-muted/40 flex items-center justify-center">
                            <ImageIcon className="w-4 h-4 text-muted-foreground" />
                          </div>
                        )}
                      </td>
                    )}

                    {columns.find(c => c.id === 'title' && c.visible) && (
                      <td className="px-4 py-3">
                        <div className="flex items-start gap-3">
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-foreground truncate group-hover:text-blue-600 transition-colors">
                              {article.title}
                            </h4>
                            {article.excerpt && (
                              <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                                {article.excerpt}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                    )}

                    {columns.find(c => c.id === 'type' && c.visible) && (
                      <td className="px-4 py-3">
                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-medium ${getTypeColor(article.type)}`}>
                          <TypeIcon className="w-3.5 h-3.5" />
                          {getTypeLabel(article.type)}
                        </div>
                      </td>
                    )}

                    {columns.find(c => c.id === 'status' && c.visible) && (
                      <td className="px-4 py-3">
                        <div className={`inline-flex items-center px-2.5 py-1 rounded-lg border text-xs font-medium ${getStatusColor(article.status)}`}>
                          {getStatusLabel(article.status)}
                        </div>
                      </td>
                    )}

                    {columns.find(c => c.id === 'category' && c.visible) && (
                      <td className="px-4 py-3">
                        <span className="text-sm text-foreground">{article.category || '-'}</span>
                      </td>
                    )}

                    {columns.find(c => c.id === 'author' && c.visible) && (
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-xs text-white font-medium">
                            {article.author.charAt(0)}
                          </div>
                          <span className="text-sm text-foreground">{article.author}</span>
                        </div>
                      </td>
                    )}

                    {columns.find(c => c.id === 'views' && c.visible) && (
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <Eye className="w-3.5 h-3.5" />
                          {article.views.toLocaleString()}
                        </div>
                      </td>
                    )}

                    {columns.find(c => c.id === 'comments' && c.visible) && (
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <MessageSquare className="w-3.5 h-3.5" />
                          {article.comments}
                        </div>
                      </td>
                    )}

                    {columns.find(c => c.id === 'publishDate' && c.visible) && (
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <Calendar className="w-3.5 h-3.5" />
                          {article.publishDate}
                        </div>
                      </td>
                    )}

                    {columns.find(c => c.id === 'updatedDate' && c.visible) && (
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <Clock className="w-3.5 h-3.5" />
                          {article.updatedDate}
                        </div>
                      </td>
                    )}

                    {columns.find(c => c.id === 'featured' && c.visible) && (
                      <td className="px-4 py-3">
                        {article.featured && (
                          <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                        )}
                      </td>
                    )}

                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => onEdit?.(article.id)}
                          className="p-1.5 rounded-lg hover:bg-blue-50 text-muted-foreground hover:text-blue-600 transition-all duration-200"
                          title="Chỉnh sửa"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDelete?.(article.id)}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-muted-foreground hover:text-red-600 transition-all duration-200"
                          title="Xóa"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <div className="relative">
                          <button
                            onClick={() => setShowActionsMenu(showActionsMenu === article.id ? null : article.id)}
                            className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-all duration-200"
                            title="Thêm"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                          
                          {showActionsMenu === article.id && (
                            <>
                              <div
                                className="fixed inset-0 z-10"
                                onClick={() => setShowActionsMenu(null)}
                              />
                              <div className="absolute right-0 top-full mt-1 w-48 bg-card border border-border/60 rounded-lg shadow-xl z-20 py-1">
                                <button className="w-full px-3 py-2 text-left text-sm hover:bg-muted/60 transition-colors flex items-center gap-2">
                                  <Eye className="w-4 h-4" />
                                  Xem chi tiết
                                </button>
                                <button className="w-full px-3 py-2 text-left text-sm hover:bg-muted/60 transition-colors flex items-center gap-2">
                                  <Star className="w-4 h-4" />
                                  {article.featured ? 'Bỏ nổi bật' : 'Đánh dấu nổi bật'}
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {sortedArticles.length === 0 && (
          <div className="py-16 text-center">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground">Không có bài viết nào</p>
          </div>
        )}
      </div>

      {/* Pagination could go here */}
    </div>
  );
}