import React, { useState } from 'react';
import { useFetch, useMutate } from '@longvhv/query';
import { useNotifications } from '@longvhv/notifications';
import { 
  History, 
  Eye, 
  RotateCcw, 
  User, 
  Calendar,
  FileText,
  Image as ImageIcon,
  Hash,
  Check,
  X,
  GitBranch,
  Clock,
  ChevronRight
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Revision {
  id: string;
  version: number;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  changes: {
    type: 'created' | 'updated' | 'published' | 'unpublished' | 'deleted';
    field?: string;
    oldValue?: any;
    newValue?: any;
  }[];
  summary: string;
  createdAt: string;
  size: number;
}

interface RevisionHistoryProps {
  articleId: string;
  currentVersion: number;
  onRestore?: (revisionId: string) => void;
}

export const RevisionHistory: React.FC<RevisionHistoryProps> = ({
  articleId,
  currentVersion,
  onRestore,
}) => {
  const notifications = useNotifications();
  const [selectedRevision, setSelectedRevision] = useState<Revision | null>(null);
  const [showCompare, setShowCompare] = useState(false);
  const [compareRevisions, setCompareRevisions] = useState<[string?, string?]>([]);

  // Fetch revisions
  const { data: revisions, isLoading, refetch } = useFetch<Revision[]>(
    ['revisions', articleId],
    async () => {
      // Mock data
      return [
        {
          id: '5',
          version: 5,
          author: { id: '1', name: 'John Doe' },
          changes: [
            { type: 'published', field: 'status' },
          ],
          summary: 'Published article',
          createdAt: new Date().toISOString(),
          size: 15420,
        },
        {
          id: '4',
          version: 4,
          author: { id: '2', name: 'Jane Smith' },
          changes: [
            { 
              type: 'updated', 
              field: 'content',
              oldValue: 'Old content here...',
              newValue: 'Updated content with more details...'
            },
            { 
              type: 'updated', 
              field: 'featuredImage',
              oldValue: 'old-image.jpg',
              newValue: 'new-image.jpg'
            },
          ],
          summary: 'Updated content and featured image',
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          size: 15380,
        },
        {
          id: '3',
          version: 3,
          author: { id: '1', name: 'John Doe' },
          changes: [
            { type: 'updated', field: 'title' },
            { type: 'updated', field: 'summary' },
          ],
          summary: 'Updated title and summary',
          createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          size: 14890,
        },
        {
          id: '2',
          version: 2,
          author: { id: '3', name: 'Mike Johnson' },
          changes: [
            { type: 'updated', field: 'content' },
            { type: 'updated', field: 'tags' },
          ],
          summary: 'Added more content and tags',
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          size: 12340,
        },
        {
          id: '1',
          version: 1,
          author: { id: '1', name: 'John Doe' },
          changes: [
            { type: 'created' },
          ],
          summary: 'Initial version',
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          size: 8900,
        },
      ];
    }
  );

  // Restore revision mutation
  const { mutate: restoreRevision, isPending: isRestoring } = useMutate(
    async (revisionId: string) => {
      await new Promise(resolve => setTimeout(resolve, 1500));
      return { success: true };
    },
    {
      onSuccess: (_, revisionId) => {
        notifications.success('Revision restored successfully');
        setSelectedRevision(null);
        onRestore?.(revisionId);
        refetch();
      },
    }
  );

  // Get change icon
  const getChangeIcon = (type: string, field?: string) => {
    if (type === 'created') return <Check className="w-4 h-4 text-green-500" />;
    if (type === 'deleted') return <X className="w-4 h-4 text-red-500" />;
    if (type === 'published') return <Check className="w-4 h-4 text-blue-500" />;
    if (type === 'unpublished') return <X className="w-4 h-4 text-gray-500" />;
    
    // Field-specific icons
    if (field === 'title') return <FileText className="w-4 h-4 text-purple-500" />;
    if (field === 'content') return <FileText className="w-4 h-4 text-blue-500" />;
    if (field === 'featuredImage') return <ImageIcon className="w-4 h-4 text-pink-500" />;
    if (field === 'tags') return <Hash className="w-4 h-4 text-orange-500" />;
    
    return <GitBranch className="w-4 h-4 text-gray-500" />;
  };

  // Format file size
  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <History className="w-6 h-6" />
            Revision History
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {revisions?.length || 0} revisions • Current: v{currentVersion}
          </p>
        </div>

        <button
          onClick={() => setShowCompare(!showCompare)}
          className={`px-4 py-2 rounded-xl transition-colors ${
            showCompare
              ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
              : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          Compare Versions
        </button>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-[22px] top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />

        <div className="space-y-6">
          {revisions?.map((revision, index) => {
            const isLatest = index === 0;
            const isCurrent = revision.version === currentVersion;

            return (
              <div key={revision.id} className="relative">
                {/* Timeline dot */}
                <div className={`absolute left-0 w-11 h-11 rounded-full flex items-center justify-center z-10 ${
                  isCurrent
                    ? 'bg-blue-100 dark:bg-blue-900/30 ring-4 ring-blue-50 dark:ring-blue-900/20'
                    : 'bg-white dark:bg-gray-800 ring-2 ring-gray-200 dark:ring-gray-700'
                }`}>
                  {isCurrent ? (
                    <Check className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  ) : (
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {revision.version}
                    </span>
                  )}
                </div>

                {/* Content card */}
                <div className="ml-16">
                  <div className={`bg-white dark:bg-gray-800 rounded-xl border-2 transition-all ${
                    selectedRevision?.id === revision.id
                      ? 'border-blue-500 shadow-lg'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}>
                    <div className="p-4">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                            {revision.author.name.charAt(0)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{revision.author.name}</span>
                              {isLatest && (
                                <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs rounded-full">
                                  Latest
                                </span>
                              )}
                              {isCurrent && (
                                <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs rounded-full">
                                  Current
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-400 mt-1">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {formatDistanceToNow(new Date(revision.createdAt), { addSuffix: true })}
                              </span>
                              <span>•</span>
                              <span>{formatSize(revision.size)}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedRevision(
                              selectedRevision?.id === revision.id ? null : revision
                            )}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            title="View details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {!isCurrent && (
                            <button
                              onClick={() => restoreRevision(revision.id)}
                              disabled={isRestoring}
                              className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm disabled:opacity-50"
                            >
                              {isRestoring ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                              ) : (
                                <>
                                  <RotateCcw className="w-4 h-4" />
                                  Restore
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Summary */}
                      <p className="text-gray-700 dark:text-gray-300 mb-3">
                        {revision.summary}
                      </p>

                      {/* Changes */}
                      <div className="space-y-2">
                        {revision.changes.map((change, idx) => (
                          <div
                            key={idx}
                            className="flex items-start gap-2 p-2 bg-gray-50 dark:bg-gray-900 rounded-lg"
                          >
                            {getChangeIcon(change.type, change.field)}
                            <div className="flex-1 min-w-0">
                              <div className="text-sm">
                                <span className="font-medium capitalize">{change.type}</span>
                                {change.field && (
                                  <span className="text-gray-600 dark:text-gray-400">
                                    {' '}{change.field}
                                  </span>
                                )}
                              </div>
                              {change.oldValue && change.newValue && (
                                <div className="mt-1 text-xs">
                                  <div className="text-red-600 dark:text-red-400 line-through">
                                    {String(change.oldValue).substring(0, 50)}...
                                  </div>
                                  <div className="text-green-600 dark:text-green-400">
                                    {String(change.newValue).substring(0, 50)}...
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Expanded details */}
                      {selectedRevision?.id === revision.id && (
                        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <div className="text-gray-600 dark:text-gray-400 mb-1">Revision ID</div>
                              <code className="text-xs bg-gray-100 dark:bg-gray-900 px-2 py-1 rounded">
                                {revision.id}
                              </code>
                            </div>
                            <div>
                              <div className="text-gray-600 dark:text-gray-400 mb-1">Changes</div>
                              <div>{revision.changes.length} modifications</div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Compare mode */}
      {showCompare && (
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
          <h3 className="font-semibold mb-4">Compare Revisions</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">From Version</label>
              <select className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl">
                <option>Select version...</option>
                {revisions?.map(r => (
                  <option key={r.id} value={r.id}>v{r.version} - {r.summary}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">To Version</label>
              <select className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl">
                <option>Select version...</option>
                {revisions?.map(r => (
                  <option key={r.id} value={r.id}>v{r.version} - {r.summary}</option>
                ))}
              </select>
            </div>
          </div>
          <button className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors">
            Compare
          </button>
        </div>
      )}
    </div>
  );
};
