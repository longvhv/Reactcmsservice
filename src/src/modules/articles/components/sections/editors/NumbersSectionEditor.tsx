import { Plus, Trash2 } from 'lucide-react';
import type { NumbersSectionData } from '@/src/types/content-section';
import { generateSectionId } from '../../../sections/index';

interface Props { section: NumbersSectionData; onChange: (u: Partial<NumbersSectionData>) => void; }

export function NumbersSectionEditor({ section, onChange }: Props) {
  const updateItem = (id: string, field: string, value: any) => {
    onChange({ items: section.items.map(i => i.id === id ? { ...i, [field]: field === 'value' ? Number(value) || 0 : value } : i) });
  };
  const addItem = () => {
    onChange({ items: [...section.items, { id: generateSectionId(), value: 0, label: '' }] });
  };
  const removeItem = (id: string) => {
    if (section.items.length <= 1) return;
    onChange({ items: section.items.filter(i => i.id !== id) });
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {section.items.map(item => (
          <div key={item.id} className="flex gap-2 p-2.5 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex-1 space-y-1.5">
              <div className="flex gap-1.5">
                <input type="text" value={item.prefix || ''} onChange={e => updateItem(item.id, 'prefix', e.target.value)} placeholder="$"
                  className="w-10 px-1 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded text-xs text-center focus:outline-none" />
                <input type="number" value={item.value} onChange={e => updateItem(item.id, 'value', e.target.value)} placeholder="0"
                  className="flex-1 px-2 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500/30" />
                <input type="text" value={item.suffix || ''} onChange={e => updateItem(item.id, 'suffix', e.target.value)} placeholder="%"
                  className="w-10 px-1 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded text-xs text-center focus:outline-none" />
              </div>
              <input type="text" value={item.label} onChange={e => updateItem(item.id, 'label', e.target.value)} placeholder="Label..."
                className="w-full px-2 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded text-xs focus:outline-none" />
            </div>
            <button onClick={() => removeItem(item.id)} disabled={section.items.length <= 1}
              className="p-1 text-gray-400 hover:text-red-500 disabled:opacity-30 self-start"><Trash2 className="w-3 h-3" /></button>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-3">
        <button onClick={addItem} className="flex items-center gap-1 px-3 py-1 text-xs text-blue-600 hover:bg-blue-50 rounded-lg">
          <Plus className="w-3 h-3" /> Thêm số liệu
        </button>
        <div className="flex gap-1 ml-auto">
          {([2, 3, 4] as const).map(c => (
            <button key={c} onClick={() => onChange({ columns: c })}
              className={`px-2 py-0.5 rounded text-xs ${section.columns === c ? 'bg-sky-100 text-sky-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{c} cột</button>
          ))}
        </div>
        <label className="flex items-center gap-1 cursor-pointer text-xs">
          <input type="checkbox" checked={section.animate} onChange={e => onChange({ animate: e.target.checked })} className="rounded" />
          <span className="text-gray-500">Animate</span>
        </label>
      </div>
    </div>
  );
}