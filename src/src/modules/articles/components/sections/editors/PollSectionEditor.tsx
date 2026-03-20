import { Plus, Trash2 } from 'lucide-react';
import type { PollSectionData } from '@/src/types/content-section';
import { generateSectionId } from '../../../sections/index';

interface Props { section: PollSectionData; onChange: (u: Partial<PollSectionData>) => void; }

export function PollSectionEditor({ section, onChange }: Props) {
  const updateOption = (id: string, text: string) => {
    onChange({ options: section.options.map(o => o.id === id ? { ...o, text } : o) });
  };
  const addOption = () => {
    if (section.options.length >= 10) return;
    onChange({ options: [...section.options, { id: generateSectionId(), text: '', votes: 0 }] });
  };
  const removeOption = (id: string) => {
    if (section.options.length <= 2) return;
    onChange({ options: section.options.filter(o => o.id !== id) });
  };

  return (
    <div className="space-y-3">
      <input type="text" value={section.question} onChange={e => onChange({ question: e.target.value })} placeholder="Câu hỏi bình chọn..."
        className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
      <div className="space-y-1.5">
        {section.options.map((opt, i) => (
          <div key={opt.id} className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-xs text-gray-500">{i + 1}</span>
            <input type="text" value={opt.text} onChange={e => updateOption(opt.id, e.target.value)} placeholder={`Lựa chọn ${i + 1}...`}
              className="flex-1 px-3 py-1.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500/30" />
            <button onClick={() => removeOption(opt.id)} disabled={section.options.length <= 2}
              className="p-1 text-gray-400 hover:text-red-500 disabled:opacity-30"><Trash2 className="w-3.5 h-3.5" /></button>
          </div>
        ))}
      </div>
      <button onClick={addOption} disabled={section.options.length >= 10}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors disabled:opacity-30">
        <Plus className="w-3.5 h-3.5" /> Thêm lựa chọn ({section.options.length}/10)
      </button>
      <div className="flex items-center gap-4 flex-wrap text-xs">
        <label className="flex items-center gap-1.5 cursor-pointer">
          <input type="checkbox" checked={section.allowMultiple} onChange={e => onChange({ allowMultiple: e.target.checked })} className="rounded" />
          <span className="text-gray-600 dark:text-gray-400">Chọn nhiều</span>
        </label>
        <label className="flex items-center gap-1.5 cursor-pointer">
          <input type="checkbox" checked={section.showResults} onChange={e => onChange({ showResults: e.target.checked })} className="rounded" />
          <span className="text-gray-600 dark:text-gray-400">Hiện kết quả trước</span>
        </label>
      </div>
    </div>
  );
}