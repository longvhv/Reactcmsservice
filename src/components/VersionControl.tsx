import { useState } from 'react';
import { 
  GitBranch, Clock, User, Eye, RotateCcw, GitCommit,
  ArrowRight, Copy, Check, X, FileText, Image as ImageIcon,
  Edit3, Save, Download, Upload, AlertCircle, Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface ArticleVersion {
  id: string;
  version: number;
  title: string;
  content: string;
  author: string;
  authorAvatar?: string;
  timestamp: Date;
  changeLog: string;
  changes: {
    field: string;
    oldValue: string;
    newValue: string;
  }[];
  status: 'draft' | 'published' | 'archived';
  isCurrent: boolean;
}

interface VersionControlProps {
  articleId: string;
  currentVersion: ArticleVersion;
  onRestore: (versionId: string) => void;
  onCompare: (versionId1: string, versionId2: string) => void;
}

export function VersionControl({
  articleId,
  currentVersion,
  onRestore,
  onCompare,
}: VersionControlProps) {
  const [selectedVersion, setSelectedVersion] = useState<ArticleVersion | null>(null);
  const [compareMode, setCompareMode] = useState(false);
  const [compareVersions, setCompareVersions] = useState<string[]>([]);
  const [showChanges, setShowChanges] = useState(false);

  // Mock version history
  const versions: ArticleVersion[] = [
    {
      id: 'v5',
      version: 5,
      title: 'Hướng dẫn sử dụng React Hooks trong dự án thực tế (Final)',
      content: 'Content version 5...',
      author: 'Nguyễn Văn A',
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
      changeLog: 'Published final version with SEO improvements',
      changes: [
        { field: 'meta_description', oldValue: 'Old description', newValue: 'Optimized SEO description' },
        { field: 'keywords', oldValue: 'react, hooks', newValue: 'react, hooks, tutorial, 2024' },
      ],
      status: 'published',
      isCurrent: true,
    },
    {
      id: 'v4',
      version: 4,
      title: 'Hướng dẫn sử dụng React Hooks trong dự án thực tế',
      content: 'Content version 4...',
      author: 'Editor B',
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
      changeLog: 'Added code examples and improved formatting',
      changes: [
        { field: 'content', oldValue: 'Basic content', newValue: 'Added 5 code examples' },
        { field: 'formatting', oldValue: 'Plain text', newValue: 'Markdown with syntax highlighting' },
      ],
      status: 'draft',
      isCurrent: false,
    },
    {
      id: 'v3',
      version: 3,
      title: 'Hướng dẫn React Hooks',
      content: 'Content version 3...',
      author: 'Nguyễn Văn A',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      changeLog: 'Expanded introduction section',
      changes: [
        { field: 'title', oldValue: 'React Hooks Guide', newValue: 'Hướng dẫn React Hooks' },
        { field: 'intro', oldValue: '1 paragraph', newValue: '3 paragraphs' },
      ],
      status: 'draft',
      isCurrent: false,
    },
    {
      id: 'v2',
      version: 2,
      title: 'React Hooks Guide',
      content: 'Content version 2...',
      author: 'Editor C',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      changeLog: 'Fixed grammar and typos',
      changes: [
        { field: 'grammar', oldValue: '12 errors', newValue: '0 errors' },
      ],
      status: 'draft',
      isCurrent: false,
    },
    {
      id: 'v1',
      version: 1,
      title: 'React Hooks Guide',
      content: 'Content version 1...',
      author: 'Nguyễn Văn A',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      changeLog: 'Initial draft',
      changes: [],
      status: 'draft',
      isCurrent: false,
    },
  ];

  const toggleCompareVersion = (versionId: string) => {
    if (compareVersions.includes(versionId)) {
      setCompareVersions(compareVersions.filter(id => id !== versionId));
    } else if (compareVersions.length < 2) {
      setCompareVersions([...compareVersions, versionId]);
    }
  };

  const handleCompare = () => {
    if (compareVersions.length === 2) {
      onCompare(compareVersions[0], compareVersions[1]);
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (hours < 1) return 'Vừa xong';
    if (hours < 24) return `${hours} giờ trước`;
    if (days < 7) return `${days} ngày trước`;
    return date.toLocaleDateString('vi-VN');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20">
            <GitBranch className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h2 className="text-2xl">Version Control</h2>
            <p className="text-sm text-muted-foreground">
              {versions.length} versions • Current: v{currentVersion.version}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCompareMode(!compareMode)}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-xl transition-all border
              ${compareMode 
                ? 'bg-blue-500/10 border-blue-500/30 text-blue-600' 
                : 'bg-muted/60 border-border/40 hover:bg-muted'
              }
            `}
          >
            <GitCommit className="w-4 h-4" />
            Compare Mode
          </button>

          {compareMode && compareVersions.length === 2 && (
            <button
              onClick={handleCompare}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg shadow-blue-500/30"
            >
              <Eye className="w-4 h-4" />
              Compare Selected
            </button>
          )}

          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-muted/60 hover:bg-muted transition-all border border-border/40">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Compare Mode Info */}
      {compareMode && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-4 border-l-4 border-blue-500"
        >
          <div className="flex items-center gap-3">
            <Info className="w-5 h-5 text-blue-600" />
            <div className="flex-1">
              <p className="text-sm">
                Select 2 versions to compare ({compareVersions.length}/2 selected)
              </p>
            </div>
            {compareVersions.length > 0 && (
              <button
                onClick={() => setCompareVersions([])}
                className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
              >
                Clear selection
              </button>
            )}
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-12 gap-6">
        {/* Version Timeline */}
        <div className="col-span-5 space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground mb-4">
            Version History
          </h3>

          <div className="space-y-3 relative">
            {/* Timeline line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 opacity-20" />

            {versions.map((version, idx) => (
              <motion.div
                key={version.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => setSelectedVersion(version)}
                className={`
                  relative glass-card p-4 cursor-pointer transition-all border-2
                  ${selectedVersion?.id === version.id
                    ? 'border-blue-500 shadow-lg shadow-blue-500/20'
                    : 'border-border/40 hover:border-border/60'
                  }
                  ${compareMode && compareVersions.includes(version.id)
                    ? 'ring-2 ring-blue-500/50'
                    : ''
                  }
                `}
              >
                {/* Timeline dot */}
                <div className={`
                  absolute left-[-2.5rem] top-6 w-5 h-5 rounded-full border-4 border-background
                  ${version.isCurrent
                    ? 'bg-gradient-to-br from-green-500 to-emerald-500 shadow-lg shadow-green-500/50'
                    : 'bg-gradient-to-br from-blue-500 to-purple-500'
                  }
                `}>
                  {version.isCurrent && (
                    <div className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-75" />
                  )}
                </div>

                {compareMode && (
                  <input
                    type="checkbox"
                    checked={compareVersions.includes(version.id)}
                    onChange={() => toggleCompareVersion(version.id)}
                    className="absolute top-4 right-4 w-5 h-5 rounded border-border/40 text-blue-600 focus:ring-2 focus:ring-blue-500/20"
                    onClick={(e) => e.stopPropagation()}
                  />
                )}

                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <span className={`
                      px-2 py-1 rounded-lg text-xs font-medium
                      ${version.isCurrent
                        ? 'bg-green-500/10 text-green-600 border border-green-500/20'
                        : 'bg-blue-500/10 text-blue-600 border border-blue-500/20'
                      }
                    `}>
                      v{version.version}
                      {version.isCurrent && ' • Current'}
                    </span>
                    <span className={`
                      px-2 py-1 rounded-lg text-xs
                      ${version.status === 'published' ? 'bg-green-500/10 text-green-600' : ''}
                      ${version.status === 'draft' ? 'bg-yellow-500/10 text-yellow-600' : ''}
                      ${version.status === 'archived' ? 'bg-gray-500/10 text-gray-600' : ''}
                    `}>
                      {version.status}
                    </span>
                  </div>
                </div>

                <h4 className="font-medium mb-2 line-clamp-2">{version.title}</h4>

                <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                  <div className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    <span>{version.author}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{formatTimeAgo(version.timestamp)}</span>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mb-3">
                  {version.changeLog}
                </p>

                {version.changes.length > 0 && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Edit3 className="w-3 h-3" />
                    <span>{version.changes.length} changes</span>
                  </div>
                )}

                {!version.isCurrent && (
                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border/40">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedVersion(version);
                        setShowChanges(true);
                      }}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-muted/60 hover:bg-muted transition-all text-xs"
                    >
                      <Eye className="w-3 h-3" />
                      Preview
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRestore(version.id);
                      }}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 transition-all text-xs border border-blue-500/20"
                    >
                      <RotateCcw className="w-3 h-3" />
                      Restore
                    </button>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Version Details */}
        <div className="col-span-7">
          {selectedVersion ? (
            <div className="glass-card p-6 sticky top-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-medium">Version {selectedVersion.version}</h3>
                    {selectedVersion.isCurrent && (
                      <span className="px-2 py-1 rounded-lg bg-green-500/10 text-green-600 text-xs font-medium border border-green-500/20">
                        Current
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {selectedVersion.timestamp.toLocaleString('vi-VN')}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button className="p-2 rounded-lg hover:bg-muted/60 transition-colors">
                    <Copy className="w-4 h-4" />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-muted/60 transition-colors">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Author Info */}
              <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/30 border border-border/40 mb-6">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-medium">
                  {selectedVersion.author.charAt(0)}
                </div>
                <div>
                  <div className="font-medium">{selectedVersion.author}</div>
                  <div className="text-xs text-muted-foreground">{selectedVersion.changeLog}</div>
                </div>
              </div>

              {/* Changes List */}
              {selectedVersion.changes.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                    <Edit3 className="w-4 h-4" />
                    Changes ({selectedVersion.changes.length})
                  </h4>

                  <div className="space-y-2">
                    {selectedVersion.changes.map((change, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-lg bg-muted/30 border border-border/40"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 text-xs font-medium">
                            {change.field}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <div className="text-xs text-muted-foreground mb-1">Before:</div>
                            <div className="p-2 rounded bg-red-500/10 border border-red-500/20 text-red-600">
                              {change.oldValue}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground mb-1">After:</div>
                            <div className="p-2 rounded bg-green-500/10 border border-green-500/20 text-green-600">
                              {change.newValue}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Content Preview */}
              <div>
                <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Content Preview
                </h4>
                <div className="p-4 rounded-xl bg-muted/30 border border-border/40">
                  <h5 className="font-medium mb-3">{selectedVersion.title}</h5>
                  <p className="text-sm text-muted-foreground">
                    {selectedVersion.content}
                  </p>
                </div>
              </div>

              {/* Actions */}
              {!selectedVersion.isCurrent && (
                <div className="flex items-center gap-3 mt-6 pt-6 border-t border-border/40">
                  <button
                    onClick={() => onRestore(selectedVersion.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg shadow-blue-500/30"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Restore This Version
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-muted/60 hover:bg-muted transition-all border border-border/40">
                    <Copy className="w-4 h-4" />
                    Duplicate
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="glass-card p-12 text-center">
              <GitBranch className="w-12 h-12 mx-auto mb-3 text-muted-foreground/50" />
              <p className="text-muted-foreground">Select a version to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
