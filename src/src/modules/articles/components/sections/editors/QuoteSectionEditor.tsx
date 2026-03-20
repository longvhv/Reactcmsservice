import type { QuoteSectionData } from '@/src/types/content-section';

interface Props { section: QuoteSectionData; onChange: (u: Partial<QuoteSectionData>) => void; }

export function QuoteSectionEditor({ section, onChange }: Props) {
  const styles = ['simple', 'boxed', 'bordered', 'gradient', 'full-width'] as const;
  return (
    <div className="space-y-3">
      <textarea value={section.text} onChange={e => onChange({ text: e.target.value })} placeholder="Nội dung trích dẫn..."
        rows={3} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none" />
      <div className="grid grid-cols-2 gap-3">
        <input type="text" value={section.author} onChange={e => onChange({ author: e.target.value })} placeholder="Tác giả..."
          className="px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
        <input type="text" value={section.source || ''} onChange={e => onChange({ source: e.target.value })} placeholder="Nguồn..."
          className="px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-500">Style:</span>
        {styles.map(s => (
          <button key={s} onClick={() => onChange({ quoteStyle: s })}
            className={`px-2 py-1 rounded text-xs capitalize transition-colors ${section.quoteStyle === s ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200'}`}>
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}