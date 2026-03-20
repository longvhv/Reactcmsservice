import type { CTASectionData } from '@/src/types/content-section';

interface Props { section: CTASectionData; onChange: (u: Partial<CTASectionData>) => void; }

export function CTASectionEditor({ section, onChange }: Props) {
  return (
    <div className="space-y-3">
      <input type="text" value={section.ctaTitle} onChange={e => onChange({ ctaTitle: e.target.value })} placeholder="Tiêu đề CTA..."
        className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
      <textarea value={section.description || ''} onChange={e => onChange({ description: e.target.value })} placeholder="Mô tả ngắn (tùy chọn)..."
        rows={2} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none" />
      <div className="grid grid-cols-2 gap-3">
        <input type="text" value={section.buttonText} onChange={e => onChange({ buttonText: e.target.value })} placeholder="Text nút..."
          className="px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
        <input type="url" value={section.buttonUrl} onChange={e => onChange({ buttonUrl: e.target.value })} placeholder="URL..."
          className="px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
      </div>
      <div className="flex items-center gap-3 flex-wrap text-xs">
        <span className="text-gray-500">Button:</span>
        {(['primary', 'secondary', 'outline', 'gradient'] as const).map(s => (
          <button key={s} onClick={() => onChange({ buttonStyle: s })}
            className={`px-2 py-1 rounded capitalize ${section.buttonStyle === s ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{s}</button>
        ))}
        <span className="text-gray-500 ml-2">Layout:</span>
        {(['centered', 'left', 'split'] as const).map(l => (
          <button key={l} onClick={() => onChange({ ctaLayout: l })}
            className={`px-2 py-1 rounded capitalize ${section.ctaLayout === l ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{l}</button>
        ))}
      </div>
      {/* Preview */}
      <div className={`p-6 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center`}>
        <h4 className="mb-1">{section.ctaTitle || 'Tiêu đề CTA'}</h4>
        {section.description && <p className="text-sm opacity-80 mb-3">{section.description}</p>}
        <span className={`inline-block px-6 py-2 rounded-lg text-sm ${section.buttonStyle === 'outline' ? 'border-2 border-white' : section.buttonStyle === 'secondary' ? 'bg-white/20' : 'bg-white text-blue-600'}`}>
          {section.buttonText || 'Button'}
        </span>
      </div>
    </div>
  );
}