import type { CodeSectionData } from '@/src/types/content-section';

interface Props { section: CodeSectionData; onChange: (u: Partial<CodeSectionData>) => void; }

const languages = ['javascript', 'typescript', 'python', 'java', 'go', 'rust', 'html', 'css', 'sql', 'bash', 'json', 'yaml', 'markdown', 'c', 'cpp', 'csharp', 'php', 'ruby', 'swift', 'kotlin'];

export function CodeSectionEditor({ section, onChange }: Props) {
  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <select value={section.language} onChange={e => onChange({ language: e.target.value })}
          className="px-3 py-1.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-blue-500/30">
          {languages.map(l => <option key={l} value={l}>{l}</option>)}
        </select>
        <input type="text" value={section.filename || ''} onChange={e => onChange({ filename: e.target.value })} placeholder="filename.js (tùy chọn)"
          className="flex-1 px-3 py-1.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-blue-500/30" />
        <select value={section.theme} onChange={e => onChange({ theme: e.target.value as any })}
          className="px-3 py-1.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-xs">
          <option value="dark">Dark</option><option value="light">Light</option>
        </select>
      </div>
      <textarea value={section.code} onChange={e => onChange({ code: e.target.value })} placeholder="// Nhập mã nguồn..."
        rows={10}
        className={`w-full px-4 py-3 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-y ${
          section.theme === 'dark' ? 'bg-gray-900 text-gray-100 border-gray-700' : 'bg-gray-50 text-gray-900 border-gray-200'
        } border`}
        spellCheck={false}
      />
      <label className="flex items-center gap-1.5 cursor-pointer text-xs">
        <input type="checkbox" checked={section.showLineNumbers} onChange={e => onChange({ showLineNumbers: e.target.checked })} className="rounded" />
        <span className="text-gray-600 dark:text-gray-400">Hiện số dòng</span>
      </label>
    </div>
  );
}