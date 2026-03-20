import { Info, AlertTriangle, XCircle, CheckCircle, Zap } from 'lucide-react';
import type { AlertSectionData } from '@/src/types/content-section';

interface Props { section: AlertSectionData; onChange: (u: Partial<AlertSectionData>) => void; }

const alertVariants = [
  { id: 'info', label: 'Info', icon: Info, bg: 'bg-blue-50 border-blue-200 text-blue-700' },
  { id: 'warning', label: 'Warning', icon: AlertTriangle, bg: 'bg-amber-50 border-amber-200 text-amber-700' },
  { id: 'error', label: 'Error', icon: XCircle, bg: 'bg-red-50 border-red-200 text-red-700' },
  { id: 'success', label: 'Success', icon: CheckCircle, bg: 'bg-green-50 border-green-200 text-green-700' },
  { id: 'breaking', label: 'Breaking', icon: Zap, bg: 'bg-red-100 border-red-300 text-red-800' },
] as const;

export function AlertSectionEditor({ section, onChange }: Props) {
  const current = alertVariants.find(v => v.id === section.variant) || alertVariants[0];
  const CurrentIcon = current.icon;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-1.5 flex-wrap">
        {alertVariants.map(v => {
          const Icon = v.icon;
          return (
            <button key={v.id} onClick={() => onChange({ variant: v.id })}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs border transition-all ${section.variant === v.id ? `${v.bg} ring-1 ring-offset-1` : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'}`}>
              <Icon className="w-3 h-3" /> {v.label}
            </button>
          );
        })}
      </div>
      <input type="text" value={section.alertTitle} onChange={e => onChange({ alertTitle: e.target.value })} placeholder="Tiêu đề thông báo..."
        className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
      <textarea value={section.message} onChange={e => onChange({ message: e.target.value })} placeholder="Nội dung thông báo..."
        rows={2} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none" />
      {/* Preview */}
      <div className={`flex items-start gap-3 p-3 rounded-lg border ${current.bg}`}>
        <CurrentIcon className="w-5 h-5 flex-shrink-0 mt-0.5" />
        <div>
          <div className="text-sm">{section.alertTitle || 'Tiêu đề'}</div>
          {section.message && <div className="text-xs mt-0.5 opacity-80">{section.message}</div>}
        </div>
      </div>
    </div>
  );
}