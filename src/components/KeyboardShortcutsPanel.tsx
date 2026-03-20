import { X, Command } from 'lucide-react';

interface Shortcut {
  keys: string[];
  description: string;
  category: string;
}

interface KeyboardShortcutsPanelProps {
  onClose: () => void;
}

const shortcuts: Shortcut[] = [
  // Chung
  { keys: ['Ctrl', 'Z'], description: 'Hoàn tác', category: 'Chung' },
  { keys: ['Ctrl', 'Y'], description: 'Làm lại', category: 'Chung' },
  { keys: ['Ctrl', 'S'], description: 'Lưu (Xuất JSON)', category: 'Chung' },
  { keys: ['Ctrl', 'A'], description: 'Chọn tất cả', category: 'Chung' },
  { keys: ['Esc'], description: 'Bỏ chọn / Hủy', category: 'Chung' },
  
  // Phần tử
  { keys: ['Delete'], description: 'Xóa đã chọn', category: 'Phần tử' },
  { keys: ['Ctrl', 'C'], description: 'Sao chép', category: 'Phần tử' },
  { keys: ['Ctrl', 'V'], description: 'Dán', category: 'Phần tử' },
  { keys: ['Ctrl', 'D'], description: 'Nhân bản', category: 'Phần tử' },
  { keys: ['Ctrl', 'G'], description: 'Nhóm', category: 'Phần tử' },
  { keys: ['Ctrl', 'Shift', 'G'], description: 'Bỏ nhóm', category: 'Phần tử' },
  
  // Lớp
  { keys: ['Ctrl', ']'], description: 'Đưa lên trước', category: 'Lớp' },
  { keys: ['Ctrl', '['], description: 'Đưa ra sau', category: 'Lớp' },
  { keys: ['Ctrl', 'Shift', ']'], description: 'Đưa lên trên cùng', category: 'Lớp' },
  { keys: ['Ctrl', 'Shift', '['], description: 'Đưa xuống dưới cùng', category: 'Lớp' },
  
  // Văn bản
  { keys: ['T'], description: 'Thêm văn bản', category: 'Văn bản' },
  { keys: ['Enter'], description: 'Hoàn tất chỉnh sửa', category: 'Văn bản' },
  { keys: ['Esc'], description: 'Hủy chỉnh sửa', category: 'Văn bản' },
  
  // Vẽ
  { keys: ['P'], description: 'Công cụ bút vẽ', category: 'Vẽ' },
  { keys: ['Enter'], description: 'Hoàn tất vẽ', category: 'Vẽ' },
  { keys: ['Esc'], description: 'Hủy vẽ', category: 'Vẽ' },
  
  // Hiển thị
  { keys: ['Ctrl', '+'], description: 'Phóng to', category: 'Hiển thị' },
  { keys: ['Ctrl', '-'], description: 'Thu nhỏ', category: 'Hiển thị' },
  { keys: ['Ctrl', '0'], description: 'Đặt lại thu phóng', category: 'Hiển thị' },
  { keys: ['G'], description: 'Bật/tắt lưới', category: 'Hiển thị' },
  { keys: ['R'], description: 'Bật/tắt thước', category: 'Hiển thị' },
];

export function KeyboardShortcutsPanel({ onClose }: KeyboardShortcutsPanelProps) {
  const categories = [...new Set(shortcuts.map(s => s.category))];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="w-full max-w-3xl max-h-[80vh] bg-background rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-border">
        {/* Header */}
        <div className="p-6 border-b border-border bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <Command className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Phím tắt</h2>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Nắm vững các phím tắt để tăng tốc quy trình làm việc
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/50 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-8">
            {categories.map(category => (
              <div key={category}>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  {category}
                </h3>
                <div className="space-y-2">
                  {shortcuts
                    .filter(s => s.category === category)
                    .map((shortcut, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <span className="text-sm">{shortcut.description}</span>
                        <div className="flex items-center gap-1.5">
                          {shortcut.keys.map((key, keyIndex) => (
                            <div key={keyIndex} className="flex items-center gap-1.5">
                              <kbd className="px-2.5 py-1.5 bg-white border border-border rounded-md shadow-sm text-xs font-mono font-medium">
                                {key}
                              </kbd>
                              {keyIndex < shortcut.keys.length - 1 && (
                                <span className="text-muted-foreground text-xs">+</span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border bg-muted/30 text-center">
          <p className="text-xs text-muted-foreground">
            Nhấn <kbd className="px-2 py-1 bg-white border border-border rounded text-xs mx-1">?</kbd> bất kỳ lúc nào để xem phím tắt
          </p>
        </div>
      </div>
    </div>
  );
}