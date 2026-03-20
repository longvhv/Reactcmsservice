import { useState } from 'react';
import { Undo2, Redo2, Clock, X, ChevronDown, ChevronRight, Search } from 'lucide-react';

interface HistoryAction {
  id: string;
  timestamp: number;
  description: string;
  elementCount: number;
}

interface HistoryPanelProps {
  history: any[][];
  currentIndex: number;
  onUndo: () => void;
  onRedo: () => void;
  onJumpTo: (index: number) => void;
  maxHistoryDisplay?: number;
}

export function HistoryPanel({
  history,
  currentIndex,
  onUndo,
  onRedo,
  onJumpTo,
  maxHistoryDisplay = 50
}: HistoryPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Generate history actions with descriptions
  const historyActions: HistoryAction[] = history.map((state, index) => {
    let description = 'Initial state';
    
    if (index > 0) {
      const prevState = history[index - 1];
      const added = state.length - prevState.length;
      const removed = prevState.length - state.length;
      
      if (added > 0) {
        description = `Added ${added} element${added > 1 ? 's' : ''}`;
      } else if (removed > 0) {
        description = `Removed ${removed} element${removed > 1 ? 's' : ''}`;
      } else {
        // Check for modifications
        const modified = state.filter((el: any) => {
          const prevEl = prevState.find((p: any) => p.id === el.id);
          return prevEl && JSON.stringify(el) !== JSON.stringify(prevEl);
        }).length;
        
        if (modified > 0) {
          description = `Modified ${modified} element${modified > 1 ? 's' : ''}`;
        } else {
          description = 'Changed state';
        }
      }
    }

    return {
      id: `action-${index}`,
      timestamp: Date.now() - (history.length - index) * 1000,
      description,
      elementCount: state.length
    };
  });

  const filteredActions = searchTerm
    ? historyActions.filter(action =>
        action.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : historyActions;

  const displayedActions = filteredActions.slice(
    Math.max(0, filteredActions.length - maxHistoryDisplay)
  );

  const formatTime = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    if (seconds > 5) return `${seconds}s ago`;
    return 'Just now';
  };

  const canUndo = currentIndex > 0;
  const canRedo = currentIndex < history.length - 1;

  if (!isExpanded) {
    // Compact toolbar view
    return (
      <div className="flex items-center gap-2 bg-card border border-border/60 rounded-xl px-3 py-2 shadow-sm">
        <button
          onClick={onUndo}
          disabled={!canUndo}
          className={`
            p-2 rounded-lg transition-all duration-200
            ${canUndo 
              ? 'hover:bg-muted text-foreground' 
              : 'text-muted-foreground cursor-not-allowed opacity-40'
            }
          `}
          title="Undo (Ctrl+Z)"
        >
          <Undo2 className="w-4 h-4" />
        </button>

        <button
          onClick={onRedo}
          disabled={!canRedo}
          className={`
            p-2 rounded-lg transition-all duration-200
            ${canRedo 
              ? 'hover:bg-muted text-foreground' 
              : 'text-muted-foreground cursor-not-allowed opacity-40'
            }
          `}
          title="Redo (Ctrl+Y)"
        >
          <Redo2 className="w-4 h-4" />
        </button>

        <div className="h-4 w-px bg-border/60" />

        <button
          onClick={() => setIsExpanded(true)}
          className="flex items-center gap-2 px-2 py-1 hover:bg-muted rounded-lg transition-colors"
        >
          <Clock className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {currentIndex + 1} / {history.length}
          </span>
          <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
        </button>
      </div>
    );
  }

  // Expanded panel view
  return (
    <div className="absolute top-full right-0 mt-2 w-80 bg-card border border-border/60 rounded-xl shadow-2xl z-50 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/60">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-muted-foreground" />
          <h3 className="font-medium">History</h3>
          <span className="text-xs text-muted-foreground">
            ({currentIndex + 1}/{history.length})
          </span>
        </div>
        
        <button
          onClick={() => setIsExpanded(false)}
          className="p-1 hover:bg-muted rounded-lg transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2 px-4 py-2 bg-muted/50 border-b border-border/60">
        <button
          onClick={onUndo}
          disabled={!canUndo}
          className={`
            flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg
            transition-all duration-200 text-sm font-medium
            ${canUndo 
              ? 'bg-background hover:bg-muted text-foreground' 
              : 'bg-muted/50 text-muted-foreground cursor-not-allowed opacity-40'
            }
          `}
        >
          <Undo2 className="w-4 h-4" />
          Undo
        </button>

        <button
          onClick={onRedo}
          disabled={!canRedo}
          className={`
            flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg
            transition-all duration-200 text-sm font-medium
            ${canRedo 
              ? 'bg-background hover:bg-muted text-foreground' 
              : 'bg-muted/50 text-muted-foreground cursor-not-allowed opacity-40'
            }
          `}
        >
          <Redo2 className="w-4 h-4" />
          Redo
        </button>
      </div>

      {/* Search */}
      {history.length > 10 && (
        <div className="px-4 py-2 border-b border-border/60">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search history..."
              className="w-full pl-9 pr-3 py-2 bg-background border border-border/60 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded"
              >
                <X className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* History Timeline */}
      <div className="max-h-96 overflow-y-auto">
        {displayedActions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center px-4">
            <Clock className="w-12 h-12 text-muted-foreground opacity-30 mb-2" />
            <p className="text-sm text-muted-foreground">
              {searchTerm ? 'No matching history' : 'No history yet'}
            </p>
          </div>
        ) : (
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-[29px] top-4 bottom-4 w-px bg-border/60" />

            {/* History items */}
            <div className="space-y-1 p-2">
              {displayedActions.map((action, idx) => {
                const actionIndex = history.findIndex((_, i) => 
                  `action-${i}` === action.id
                );
                const isCurrent = actionIndex === currentIndex;
                const isPast = actionIndex < currentIndex;
                
                return (
                  <button
                    key={action.id}
                    onClick={() => onJumpTo(actionIndex)}
                    className={`
                      w-full flex items-start gap-3 px-3 py-2 rounded-lg text-left
                      transition-all duration-200 relative
                      ${isCurrent 
                        ? 'bg-blue-100 dark:bg-blue-900/30 ring-1 ring-blue-500' 
                        : isPast 
                          ? 'hover:bg-muted' 
                          : 'hover:bg-muted opacity-50'
                      }
                    `}
                  >
                    {/* Timeline dot */}
                    <div className={`
                      relative mt-1 w-3 h-3 rounded-full border-2 flex-shrink-0 z-10
                      ${isCurrent 
                        ? 'bg-blue-500 border-blue-500 ring-2 ring-blue-500/20' 
                        : isPast 
                          ? 'bg-card border-foreground' 
                          : 'bg-card border-muted-foreground'
                      }
                    `}>
                      {isCurrent && (
                        <div className="absolute inset-0 rounded-full bg-blue-500 animate-ping opacity-75" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className={`text-sm font-medium truncate ${
                          isCurrent ? 'text-blue-600 dark:text-blue-400' : ''
                        }`}>
                          {action.description}
                        </span>
                        {isCurrent && (
                          <span className="text-xs font-medium text-blue-600 dark:text-blue-400 flex-shrink-0">
                            Current
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{formatTime(action.timestamp)}</span>
                        <span>•</span>
                        <span>{action.elementCount} element{action.elementCount !== 1 ? 's' : ''}</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-border/60 bg-muted/30">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            {history.length > maxHistoryDisplay && `Showing last ${maxHistoryDisplay} actions`}
          </span>
          <div className="flex items-center gap-2">
            <kbd className="px-1.5 py-0.5 bg-background border border-border/60 rounded text-[10px]">
              Ctrl+Z
            </kbd>
            <span>Undo</span>
            <kbd className="px-1.5 py-0.5 bg-background border border-border/60 rounded text-[10px] ml-2">
              Ctrl+Y
            </kbd>
            <span>Redo</span>
          </div>
        </div>
      </div>
    </div>
  );
}
