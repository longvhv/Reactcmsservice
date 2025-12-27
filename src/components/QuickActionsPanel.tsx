import { Plus, Upload, TrendingUp, Settings, FileText, Users, Calendar } from 'lucide-react';

interface QuickAction {
  id: string;
  label: string;
  icon: any;
  color: string;
  shortcut?: string;
  onClick?: () => void;
}

export function QuickActionsPanel() {
  const quickActions: QuickAction[] = [
    { id: 'new-article', label: 'Tạo bài viết', icon: Plus, color: 'blue', shortcut: '⌘N' },
    { id: 'upload', label: 'Upload media', icon: Upload, color: 'purple', shortcut: '⌘U' },
    { id: 'stats', label: 'Xem thống kê', icon: TrendingUp, color: 'green', shortcut: '⌘S' },
    { id: 'users', label: 'Quản lý users', icon: Users, color: 'orange' },
    { id: 'schedule', label: 'Lên lịch', icon: Calendar, color: 'pink' },
    { id: 'settings', label: 'Cài đặt', icon: Settings, color: 'gray' },
  ];

  return (
    <div className="fixed right-6 bottom-6 z-40">
      <div className="relative group">
        {/* Main FAB Button */}
        <button className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 shadow-2xl shadow-blue-500/40 flex items-center justify-center text-white hover:scale-110 active:scale-95 transition-all duration-200 group-hover:rotate-45">
          <Plus className="w-6 h-6" />
        </button>

        {/* Quick Actions Menu */}
        <div className="absolute bottom-16 right-0 mb-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-bottom-right scale-95 group-hover:scale-100">
          <div className="bg-card/95 backdrop-blur-xl border border-border/60 rounded-xl shadow-2xl shadow-black/10 p-2 space-y-1 min-w-[240px]">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.id}
                  onClick={action.onClick}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted/60 transition-all duration-200 group/item"
                >
                  <div className={`p-2 rounded-lg bg-${action.color}-100`}>
                    <Icon className={`w-4 h-4 text-${action.color}-600`} />
                  </div>
                  <span className="flex-1 text-left text-sm text-foreground">{action.label}</span>
                  {action.shortcut && (
                    <kbd className="px-2 py-1 bg-muted border border-border/60 rounded text-xs text-muted-foreground font-mono">
                      {action.shortcut}
                    </kbd>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
