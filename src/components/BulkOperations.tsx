import React, { useState } from 'react';
import {
  CheckSquare, Trash2, Archive, Eye, EyeOff, Calendar, Tag,
  Folder, User, Send, Download, Copy, FileText, AlertTriangle,
  X, Check, Clock, Zap, Globe, Lock, ChevronRight
} from 'lucide-react';
import { Card } from './Card';
import { useLanguage } from '../contexts/LanguageContext';
import { bulkDeleteArticles, bulkUpdateStatus } from '../services/api';

interface BulkOperation {
  id: string;
  icon: any;
  label: string;
  description: string;
  color: string;
  requiresConfirmation: boolean;
  action: (selectedIds: number[]) => void;
}

interface BulkOperationsProps {
  selectedCount: number;
  selectedIds: number[];
  onClear: () => void;
  onComplete?: () => void;
}

export function BulkOperations({ selectedCount, selectedIds, onClear, onComplete }: BulkOperationsProps) {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingOperation, setPendingOperation] = useState<BulkOperation | null>(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showTagModal, setShowTagModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const { t } = useLanguage();

  const quickOperations: BulkOperation[] = [
    {
      id: 'publish',
      icon: Globe,
      label: t('publish'),
      description: t('publish_description'),
      color: '#10B981',
      requiresConfirmation: true,
      action: async (ids) => {
        await bulkUpdateStatus(ids, 'published');
        console.log('Publishing:', ids);
        onComplete?.();
      },
    },
    {
      id: 'unpublish',
      icon: EyeOff,
      label: t('unpublish'),
      description: t('unpublish_description'),
      color: '#F59E0B',
      requiresConfirmation: true,
      action: async (ids) => {
        await bulkUpdateStatus(ids, 'draft');
        console.log('Unpublishing:', ids);
        onComplete?.();
      },
    },
    {
      id: 'schedule',
      icon: Calendar,
      label: t('schedule'),
      description: t('schedule_description'),
      color: '#3B82F6',
      requiresConfirmation: false,
      action: () => setShowScheduleModal(true),
    },
    {
      id: 'archive',
      icon: Archive,
      label: t('archive'),
      description: t('archive_description'),
      color: '#8B5CF6',
      requiresConfirmation: true,
      action: async (ids) => {
        await bulkUpdateStatus(ids, 'archived');
        console.log('Archiving:', ids);
        onComplete?.();
      },
    },
    {
      id: 'delete',
      icon: Trash2,
      label: t('delete'),
      description: t('delete_description'),
      color: '#EF4444',
      requiresConfirmation: true,
      action: async (ids) => {
        await bulkDeleteArticles(ids);
        console.log('Deleting:', ids);
        onComplete?.();
      },
    },
  ];

  const advancedOperations: BulkOperation[] = [
    {
      id: 'move-category',
      icon: Folder,
      label: t('move_category'),
      description: t('move_category_description'),
      color: '#6366F1',
      requiresConfirmation: false,
      action: () => setShowCategoryModal(true),
    },
    {
      id: 'assign-author',
      icon: User,
      label: t('assign_author'),
      description: t('assign_author_description'),
      color: '#EC4899',
      requiresConfirmation: false,
      action: () => setShowAssignModal(true),
    },
    {
      id: 'add-tags',
      icon: Tag,
      label: t('add_tags'),
      description: t('add_tags_description'),
      color: '#14B8A6',
      requiresConfirmation: false,
      action: () => setShowTagModal(true),
    },
    {
      id: 'export',
      icon: Download,
      label: t('export'),
      description: t('export_description'),
      color: '#059669',
      requiresConfirmation: false,
      action: (ids) => {
        console.log('Exporting:', ids);
      },
    },
    {
      id: 'duplicate',
      icon: Copy,
      label: t('duplicate'),
      description: t('duplicate_description'),
      color: '#F97316',
      requiresConfirmation: true,
      action: (ids) => {
        console.log('Duplicating:', ids);
        onComplete?.();
      },
    },
    {
      id: 'private',
      icon: Lock,
      label: t('private'),
      description: t('private_description'),
      color: '#64748B',
      requiresConfirmation: true,
      action: (ids) => {
        console.log('Making private:', ids);
        onComplete?.();
      },
    },
  ];

  const handleOperation = (operation: BulkOperation) => {
    if (operation.requiresConfirmation) {
      setPendingOperation(operation);
      setShowConfirmModal(true);
    } else {
      operation.action(selectedIds);
    }
  };

  const confirmOperation = () => {
    if (pendingOperation) {
      pendingOperation.action(selectedIds);
      setShowConfirmModal(false);
      setPendingOperation(null);
    }
  };

  if (selectedCount === 0) {
    return null;
  }

  return (
    <>
      {/* Bulk Operations Bar */}
      <Card className="p-4 mb-6 sticky top-4 z-40 shadow-lg border-2 border-blue-500/20">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <CheckSquare className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="font-semibold">
                Đã chọn {selectedCount} bài viết
              </h3>
              <p className="text-sm text-muted-foreground">
                Chọn thao tác để áp dụng hàng loạt
              </p>
            </div>
          </div>
          <button
            onClick={onClear}
            className="px-3 py-2 hover:bg-secondary rounded-lg transition-colors flex items-center gap-2 text-sm"
          >
            <X className="w-4 h-4" />
            Bỏ chọn
          </button>
        </div>

        {/* Quick Operations */}
        <div className="mb-4">
          <p className="text-xs text-muted-foreground mb-2 uppercase font-semibold">
            Thao tác nhanh
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
            {quickOperations.map((operation) => {
              const Icon = operation.icon;
              return (
                <button
                  key={operation.id}
                  onClick={() => handleOperation(operation)}
                  className="p-3 bg-secondary hover:bg-muted rounded-xl transition-all group text-left"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div
                      className="p-1.5 rounded-lg"
                      style={{ backgroundColor: `${operation.color}20` }}
                    >
                      <Icon className="w-4 h-4" style={{ color: operation.color }} />
                    </div>
                    <span className="font-medium text-sm">{operation.label}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {operation.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Advanced Operations */}
        <div>
          <p className="text-xs text-muted-foreground mb-2 uppercase font-semibold">
            Thao tác nâng cao
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
            {advancedOperations.map((operation) => {
              const Icon = operation.icon;
              return (
                <button
                  key={operation.id}
                  onClick={() => handleOperation(operation)}
                  className="p-3 bg-secondary hover:bg-muted rounded-xl transition-all group text-left"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div
                      className="p-1.5 rounded-lg"
                      style={{ backgroundColor: `${operation.color}20` }}
                    >
                      <Icon className="w-4 h-4" style={{ color: operation.color }} />
                    </div>
                    <span className="font-medium text-sm">{operation.label}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {operation.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Confirmation Modal */}
      {showConfirmModal && pendingOperation && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="p-3 rounded-xl"
                  style={{ backgroundColor: `${pendingOperation.color}20` }}
                >
                  {React.createElement(pendingOperation.icon, {
                    className: 'w-6 h-6',
                    style: { color: pendingOperation.color },
                  })}
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{pendingOperation.label}</h3>
                  <p className="text-sm text-muted-foreground">
                    {pendingOperation.description}
                  </p>
                </div>
              </div>

              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl mb-6">
                <div className="flex gap-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-yellow-800 dark:text-yellow-200 mb-1">
                      Xác nhận thao tác
                    </p>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">
                      Bạn sắp {pendingOperation.label.toLowerCase()} {selectedCount} bài viết.
                      {pendingOperation.id === 'delete' && ' Hành động này không thể hoàn tác.'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowConfirmModal(false);
                    setPendingOperation(null);
                  }}
                  className="flex-1 px-4 py-2.5 bg-secondary hover:bg-muted rounded-xl transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={confirmOperation}
                  className="flex-1 px-4 py-2.5 text-white rounded-xl transition-all hover:shadow-lg"
                  style={{ backgroundColor: pendingOperation.color }}
                >
                  Xác nhận
                </button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Category Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Chuyển danh mục</h3>
                <button
                  onClick={() => setShowCategoryModal(false)}
                  className="p-2 hover:bg-secondary rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-sm text-muted-foreground mb-4">
                Chọn danh mục đích cho {selectedCount} bài viết
              </p>

              <div className="space-y-2 mb-6">
                {['Công nghệ', 'Kinh doanh', 'Giáo dục', 'Sức khỏe', 'Du lịch'].map((category) => (
                  <button
                    key={category}
                    className="w-full p-3 bg-secondary hover:bg-muted rounded-xl text-left transition-colors flex items-center justify-between"
                  >
                    <span>{category}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowCategoryModal(false)}
                  className="flex-1 px-4 py-2.5 bg-secondary hover:bg-muted rounded-xl transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={() => {
                    setShowCategoryModal(false);
                    onComplete?.();
                  }}
                  className="flex-1 px-4 py-2.5 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
                >
                  Áp dụng
                </button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Schedule Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Lên lịch xuất bản</h3>
                <button
                  onClick={() => setShowScheduleModal(false)}
                  className="p-2 hover:bg-secondary rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-sm text-muted-foreground mb-4">
                Đặt thời gian xuất bản cho {selectedCount} bài viết
              </p>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Ngày xuất bản</label>
                  <input
                    type="date"
                    className="w-full px-4 py-2.5 bg-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Giờ xuất bản</label>
                  <input
                    type="time"
                    className="w-full px-4 py-2.5 bg-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowScheduleModal(false)}
                  className="flex-1 px-4 py-2.5 bg-secondary hover:bg-muted rounded-xl transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={() => {
                    setShowScheduleModal(false);
                    onComplete?.();
                  }}
                  className="flex-1 px-4 py-2.5 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
                >
                  Lên lịch
                </button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Tag Modal */}
      {showTagModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Thêm tags</h3>
                <button
                  onClick={() => setShowTagModal(false)}
                  className="p-2 hover:bg-secondary rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-sm text-muted-foreground mb-4">
                Chọn tags để thêm vào {selectedCount} bài viết
              </p>

              <div className="flex flex-wrap gap-2 mb-6">
                {['AI', 'Cloud', 'Blockchain', 'Web3', 'Mobile', 'Security', 'DevOps', 'Frontend', 'Backend'].map((tag) => (
                  <button
                    key={tag}
                    className="px-3 py-1.5 bg-secondary hover:bg-blue-500 hover:text-white rounded-lg transition-all text-sm"
                  >
                    {tag}
                  </button>
                ))}
              </div>

              <div className="mb-6">
                <input
                  type="text"
                  placeholder="Hoặc nhập tag mới..."
                  className="w-full px-4 py-2.5 bg-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowTagModal(false)}
                  className="flex-1 px-4 py-2.5 bg-secondary hover:bg-muted rounded-xl transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={() => {
                    setShowTagModal(false);
                    onComplete?.();
                  }}
                  className="flex-1 px-4 py-2.5 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
                >
                  Thêm tags
                </button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Assign Author Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Gán tác giả</h3>
                <button
                  onClick={() => setShowAssignModal(false)}
                  className="p-2 hover:bg-secondary rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-sm text-muted-foreground mb-4">
                Chọn tác giả mới cho {selectedCount} bài viết
              </p>

              <div className="space-y-2 mb-6">
                {[
                  { name: 'Nguyễn Văn A', avatar: 'https://i.pravatar.cc/150?img=1', role: 'Admin' },
                  { name: 'Trần Thị B', avatar: 'https://i.pravatar.cc/150?img=2', role: 'Editor' },
                  { name: 'Lê Văn C', avatar: 'https://i.pravatar.cc/150?img=3', role: 'Author' },
                ].map((author) => (
                  <button
                    key={author.name}
                    className="w-full p-3 bg-secondary hover:bg-muted rounded-xl transition-colors flex items-center gap-3"
                  >
                    <img src={author.avatar} alt={author.name} className="w-10 h-10 rounded-full" />
                    <div className="flex-1 text-left">
                      <p className="font-medium">{author.name}</p>
                      <p className="text-xs text-muted-foreground">{author.role}</p>
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowAssignModal(false)}
                  className="flex-1 px-4 py-2.5 bg-secondary hover:bg-muted rounded-xl transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={() => {
                    setShowAssignModal(false);
                    onComplete?.();
                  }}
                  className="flex-1 px-4 py-2.5 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
                >
                  Áp dụng
                </button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </>
  );
}