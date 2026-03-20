import type { DividerSectionData } from '@/src/types/content-section';

interface Props { section: DividerSectionData; onChange: (u: Partial<DividerSectionData>) => void; }

export function DividerSectionEditor({ section, onChange }: Props) {
  const styles = ['solid', 'dashed', 'dotted', 'gradient', 'ornamental'] as const;
  const widths = [
    { value: 'full', label: '100%' }, { value: '3/4', label: '75%' },
    { value: '1/2', label: '50%' }, { value: '1/4', label: '25%' },
  ] as const;

  const previewStyle: React.CSSProperties = {
    borderTopStyle: section.style === 'gradient' || section.style === 'ornamental' ? 'solid' : section.style,
    borderTopWidth: 2,
    borderTopColor: section.color || '#d1d5db',
    width: section.dividerWidth === 'full' ? '100%' : section.dividerWidth === '3/4' ? '75%' : section.dividerWidth === '1/2' ? '50%' : '25%',
    margin: '0 auto',
    ...(section.style === 'gradient' ? {
      borderImage: 'linear-gradient(to right, transparent, #3b82f6, transparent) 1',
    } : {}),
  };

  return (
    <div className="space-y-3">
      <div className="py-4"><hr style={previewStyle} /></div>
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-gray-500">Kiểu:</span>
        {styles.map(s => (
          <button key={s} onClick={() => onChange({ style: s })}
            className={`px-2 py-1 rounded text-xs capitalize ${section.style === s ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 hover:bg-gray-200'}`}>
            {s}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-500">Rộng:</span>
        {widths.map(w => (
          <button key={w.value} onClick={() => onChange({ dividerWidth: w.value })}
            className={`px-2 py-1 rounded text-xs ${section.dividerWidth === w.value ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 hover:bg-gray-200'}`}>
            {w.label}
          </button>
        ))}
      </div>
      <input type="text" value={section.withText || ''} onChange={e => onChange({ withText: e.target.value })} placeholder="Chữ trong đường phân cách (tùy chọn)..."
        className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
    </div>
  );
}