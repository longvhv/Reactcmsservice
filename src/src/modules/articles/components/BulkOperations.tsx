import React, { useState } from 'react';
import { useMutate } from '@longvhv/query';
import { useNotifications } from '@longvhv/notifications';
import { 
  CheckSquare, 
  Trash2, 
  Archive,
  Eye,
  EyeOff,
  Copy,
  FolderOpen,
  Tag,
  X,
  ChevronDown,
  Download,
  Upload,
  Send
} from 'lucide-react';

interface BulkOperationsProps {
  selectedIds: Set<string>;
  totalCount: number;
  onClearSelection: () => void;
  onRefresh: () => void;
}

export const BulkOperations: React.FC<BulkOperationsProps> = ({
  selectedIds,
  totalCount,
  onClearSelection,
  onRefresh,
}) => {
  const notifications = useNotifications();
  const [showActions, setShowActions] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showTagModal, setShowTagModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{
    type: string;
    title: string;
    message: string;
    action: () => void;
  } | null>(null);

  // Publish mutation
  const { mutate: bulkPublish, isPending: isPublishing } = useMutate(
    async (ids: string[]) => {
      await new Promise(resolve => setTimeout(resolve, 1500));
      return { success: true, count: ids.length };
    },
    {
      onSuccess: (data) => {
        notifications.success(`Published ${data.count} articles`);
        onClearSelection();
        onRefresh();
      },
    }
  );

  // Unpublish mutation
  const { mutate: bulkUnpublish, isPending: isUnpublishing } = useMutate(
    async (ids: string[]) => {
      await new Promise(resolve => setTimeout(resolve, 1500));
      return { success: true, count: ids.length };
    },
    {
      onSuccess: (data) => {
        notifications.success(`Unpublished ${data.count} articles`);
        onClearSelection();
        onRefresh();
      },
    }
  );

  // Delete mutation
  const { mutate: bulkDelete, isPending: isDeleting } = useMutate(
    async (ids: string[]) => {
      await new Promise(resolve => setTimeout(resolve, 2000));
      return { success: true, count: ids.length };
    },
    {
      onSuccess: (data) => {
        notifications.success(`Deleted ${data.count} articles`);
        onClearSelection();
        onRefresh();
      },
    }
  );

  // Archive mutation
  const { mutate: bulkArchive, isPending: isArchiving } = useMutate(
    async (ids: string[]) => {
      await new Promise(resolve => setTimeout(resolve, 1500));
      return { success: true, count: ids.length };
    },
    {
      onSuccess: (data) => {
        notifications.success(`Archived ${data.count} articles`);
        onClearSelection();
        onRefresh();
      },
    }
  );

  // Duplicate mutation
  const { mutate: bulkDuplicate, isPending: isDuplicating } = useMutate(
    async (ids: string[]) => {
      await new Promise(resolve => setTimeout(resolve, 2000));
      return { success: true, count: ids.length };
    },
    {
      onSuccess: (data) => {
        notifications.success(`Duplicated ${data.count} articles`);
        onClearSelection();
        onRefresh();
      },
    }
  );

  // Change category mutation
  const { mutate: bulkChangeCategory, isPending: isChangingCategory } = useMutate(
    async ({ ids, categoryId }: { ids: string[]; categoryId: string }) => {
      await new Promise(resolve => setTimeout(resolve, 1500));
      return { success: true, count: ids.length };
    },
    {
      onSuccess: (data) => {
        notifications.success(`Updated category for ${data.count} articles`);
        setShowCategoryModal(false);
        onClearSelection();
        onRefresh();
      },
    }
  );

  // Add tags mutation
  const { mutate: bulkAddTags, isPending: isAddingTags } = useMutate(
    async ({ ids, tags }: { ids: string[]; tags: string[] }) => {
      await new Promise(resolve => setTimeout(resolve, 1500));
      return { success: true, count: ids.length };
    },
    {
      onSuccess: (data) => {
        notifications.success(`Added tags to ${data.count} articles`);
        setShowTagModal(false);
        onClearSelection();
        onRefresh();
      },
    }
  );

  // Export mutation
  const { mutate: bulkExport, isPending: isExporting } = useMutate(
    async (ids: string[]) => {
      await new Promise(resolve => setTimeout(resolve, 2000));
      // Simulate download
      const blob = new Blob([JSON.stringify({ articles: ids })], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `articles-export-${Date.now()}.json`;
      a.click();
      return { success: true, count: ids.length };
    },
    {
      onSuccess: (data) => {
        notifications.success(`Exported ${data.count} articles`);
      },
    }
  );

  const isPending = isPublishing || isUnpublishing || isDeleting || isArchiving || 
                    isDuplicating || isChangingCategory || isAddingTags || isExporting;

  const handleConfirm = (type: string, title: string, message: string, action: () => void) => {
    setConfirmAction({ type, title, message, action });
    setShowConfirmModal(true);
  };

  const executeConfirm = () => {
    if (confirmAction) {
      confirmAction.action();
      setShowConfirmModal(false);
      setConfirmAction(null);
    }
  };

  if (selectedIds.size === 0) return null;

  return (
    <>
      {/* Bulk Actions Bar */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 animate-in slide-in-from-bottom-5 duration-200">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border-2 border-blue-500 dark:border-blue-600 p-4">
          <div className="flex items-center gap-4">
            {/* Selection Info */}
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                <CheckSquare className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <div className="font-semibold">
                  {selectedIds.size} selected
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  of {totalCount} articles
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="h-12 w-px bg-gray-200 dark:bg-gray-700" />

            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => bulkPublish(Array.from(selectedIds))}
                disabled={isPending}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50"
                title="Publish selected"
              >
                <Eye className="w-4 h-4" />
                <span className="hidden sm:inline">Publish</span>
              </button>

              <button
                onClick={() => bulkUnpublish(Array.from(selectedIds))}
                disabled={isPending}
                className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-xl hover:bg-yellow-700 transition-colors disabled:opacity-50"
                title="Unpublish selected"
              >
                <EyeOff className="w-4 h-4" />
                <span className="hidden sm:inline">Unpublish</span>
              </button>

              <button
                onClick={() => bulkArchive(Array.from(selectedIds))}
                disabled={isPending}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
                title="Archive selected"
              >
                <Archive className="w-4 h-4" />
                <span className="hidden sm:inline">Archive</span>
              </button>

              {/* More Actions Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowActions(!showActions)}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <span className="hidden sm:inline">More</span>
                  <ChevronDown className="w-4 h-4" />
                </button>

                {showActions && (
                  <div className="absolute bottom-full right-0 mb-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <button
                      onClick={() => {
                        setShowCategoryModal(true);
                        setShowActions(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
                    >
                      <FolderOpen className="w-4 h-4" />
                      <span>Change Category</span>
                    </button>

                    <button
                      onClick={() => {
                        setShowTagModal(true);
                        setShowActions(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
                    >
                      <Tag className="w-4 h-4" />
                      <span>Add Tags</span>
                    </button>

                    <button
                      onClick={() => {
                        bulkDuplicate(Array.from(selectedIds));
                        setShowActions(false);
                      }}
                      disabled={isPending}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left disabled:opacity-50"
                    >
                      <Copy className="w-4 h-4" />
                      <span>Duplicate</span>
                    </button>

                    <button
                      onClick={() => {
                        bulkExport(Array.from(selectedIds));
                        setShowActions(false);
                      }}
                      disabled={isPending}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left disabled:opacity-50"
                    >
                      <Download className="w-4 h-4" />
                      <span>Export</span>
                    </button>

                    <div className="border-t border-gray-200 dark:border-gray-700" />

                    <button
                      onClick={() => {
                        handleConfirm(
                          'delete',
                          'Delete Articles',
                          `Are you sure you want to delete ${selectedIds.size} articles? This action cannot be undone.`,
                          () => bulkDelete(Array.from(selectedIds))
                        );
                        setShowActions(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 transition-colors text-left"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Divider */}
            <div className="h-12 w-px bg-gray-200 dark:bg-gray-700" />

            {/* Clear Selection */}
            <button
              onClick={onClearSelection}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title="Clear selection"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Loading Indicator */}
          {isPending && (
            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span>Processing...</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Category Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6">
            <h3 className="text-xl font-bold mb-4">Change Category</h3>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Select Category
              </label>
              <select className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl">
                <option>Technology</option>
                <option>Business</option>
                <option>Science</option>
                <option>Health</option>
                <option>Entertainment</option>
              </select>
            </div>

            <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              This will update the category for {selectedIds.size} selected articles.
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowCategoryModal(false)}
                className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => bulkChangeCategory({ ids: Array.from(selectedIds), categoryId: '1' })}
                disabled={isChangingCategory}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {isChangingCategory ? 'Updating...' : 'Update'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tag Modal */}
      {showTagModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6">
            <h3 className="text-xl font-bold mb-4">Add Tags</h3>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                placeholder="react, typescript, tutorial"
                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl"
              />
            </div>

            <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              These tags will be added to {selectedIds.size} selected articles.
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowTagModal(false)}
                className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => bulkAddTags({ ids: Array.from(selectedIds), tags: ['react', 'typescript'] })}
                disabled={isAddingTags}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {isAddingTags ? 'Adding...' : 'Add Tags'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Modal */}
      {showConfirmModal && confirmAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6">
            <h3 className="text-xl font-bold mb-4 text-red-600 dark:text-red-400">
              {confirmAction.title}
            </h3>

            <p className="text-gray-700 dark:text-gray-300 mb-6">
              {confirmAction.message}
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowConfirmModal(false);
                  setConfirmAction(null);
                }}
                className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={executeConfirm}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
