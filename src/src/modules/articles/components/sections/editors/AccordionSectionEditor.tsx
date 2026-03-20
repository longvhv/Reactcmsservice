import { Plus, Trash2, ChevronDown } from 'lucide-react';
import type { AccordionSectionData } from '@/src/types/content-section';
import { generateSectionId } from '../../../sections/index';

interface Props { section: AccordionSectionData; onChange: (u: Partial<AccordionSectionData>) => void; }

export function AccordionSectionEditor({ section, onChange }: Props) {
  const updateItem = (id: string, field: string, value: string) => {
    onChange({ items: section.items.map(item => item.id === id ? { ...item, [field]: value } : item) });
  };
  const addItem = () => {
    onChange({ items: [...section.items, { id: generateSectionId(), accordionTitle: '', content: '' }] });
  };
  const removeItem = (id: string) => {
    if (section.items.length <= 1) return;
    onChange({ items: section.items.filter(i => i.id !== id) });
  };

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        {section.items.map((item, i) => (
          <div key={item.id} className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700 space-y-2">
            <div className="flex items-center gap-2">
              <ChevronDown className="w-4 h-4 text-gray-400" />
              <input type="text" value={item.accordionTitle} onChange={e => updateItem(item.id, 'accordionTitle', e.target.value)} placeholder={`Câu hỏi/Tiêu đề ${i + 1}...`}
                className="flex-1 px-2 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500/30" />
              <button onClick={() => removeItem(item.id)} disabled={section.items.length <= 1}
                className="p-1 text-gray-400 hover:text-red-500 disabled:opacity-30"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
            <textarea value={item.content} onChange={e => updateItem(item.id, 'content', e.target.value)} placeholder="Nội dung/Câu trả lời..."
              rows={3} className="w-full px-2 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500/30 resize-none" />
          </div>
        ))}
      </div>
      <button onClick={addItem} className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg">
        <Plus className="w-3.5 h-3.5" /> Thêm mục
      </button>
      <div className="flex items-center gap-3 text-xs flex-wrap">
        <label className="flex items-center gap-1.5 cursor-pointer">
          <input type="checkbox" checked={section.allowMultipleOpen} onChange={e => onChange({ allowMultipleOpen: e.target.checked })} className="rounded" />
          <span className="text-gray-500">Mở nhiều mục</span>
        </label>
        <label className="flex items-center gap-1.5 cursor-pointer">
          <input type="checkbox" checked={section.defaultOpenFirst} onChange={e => onChange({ defaultOpenFirst: e.target.checked })} className="rounded" />
          <span className="text-gray-500">Mở mục đầu</span>
        </label>
        <div className="flex gap-1">
          {(['simple', 'bordered', 'separated', 'filled'] as const).map(s => (
            <button key={s} onClick={() => onChange({ accordionStyle: s })}
              className={`px-2 py-0.5 rounded text-xs capitalize ${section.accordionStyle === s ? 'bg-rose-100 text-rose-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{s}</button>
          ))}
        </div>
      </div>
    </div>
  );
}