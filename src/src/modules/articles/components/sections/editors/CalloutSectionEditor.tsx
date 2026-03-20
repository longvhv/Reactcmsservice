import { Info, AlertTriangle, CheckCircle, XCircle, Lightbulb, StickyNote } from 'lucide-react';
import type { CalloutSectionData } from '@/src/types/content-section';

interface Props { section: CalloutSectionData; onChange: (u: Partial<CalloutSectionData>) => void; }

const variants = [
  { id: 'info', label: 'Thông tin', icon: Info, color: 'blue' },
  { id: 'warning', label: 'Cảnh báo', icon: AlertTriangle, color: 'amber' },
  { id: 'success', label: 'Thành công', icon: CheckCircle, color: 'green' },
  { id: 'error', label: 'Lỗi', icon: XCircle, color: 'red' },
  { id: 'tip', label: 'Mẹo', icon: Lightbulb, color: 'purple' },
  { id: 'note', label: 'Ghi chú', icon: StickyNote, color: 'gray' },
] as const;

const variantColors: Record<string, string> = {
  info: 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800',
  warning: 'bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800',
  success: 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800',
  error: 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800',
  tip: 'bg-purple-50 border-purple-200 dark:bg-purple-900/20 dark:border-purple-800',
  note: 'bg-gray-50 border-gray-200 dark:bg-gray-800/50 dark:border-gray-700',
};

export function CalloutSectionEditor({ section, onChange }: Props) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-1.5 flex-wrap">
        {variants.map(v => {
          const Icon = v.icon;
          return (
            <button key={v.id} onClick={() => onChange({ variant: v.id })}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs transition-all ${section.variant === v.id ? 'ring-2 ring-blue-400 shadow-sm' : ''} ${variantColors[v.id]} border`}>
              <Icon className="w-3.5 h-3.5" /> {v.label}
            </button>
          );
        })}
      </div>
      <input type="text" value={section.calloutTitle} onChange={e => onChange({ calloutTitle: e.target.value })} placeholder="Tiêu đề callout..."
        className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
      <textarea value={section.content} onChange={e => onChange({ content: e.target.value })} placeholder="Nội dung..."
        rows={3} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none" />
    </div>
  );
}