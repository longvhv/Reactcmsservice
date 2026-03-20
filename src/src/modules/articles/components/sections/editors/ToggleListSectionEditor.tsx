import { Plus, Trash2, ThumbsUp, ThumbsDown, Minus } from 'lucide-react';
import type { ToggleListSectionData, ToggleItem } from '@/src/types/content-section';
import { generateSectionId } from '../../../sections/index';

interface Props { section: ToggleListSectionData; onChange: (u: Partial<ToggleListSectionData>) => void; }

export function ToggleListSectionEditor({ section, onChange }: Props) {
  const updateItem = (id: string, field: keyof ToggleItem, value: any) => {
    onChange({ items: section.items.map(i => i.id === id ? { ...i, [field]: value } : i) });
  };
  const addItem = (type: 'pro' | 'con' | 'neutral') => {
    onChange({ items: [...section.items, { id: generateSectionId(), text: '', itemType: type }] });
  };
  const removeItem = (id: string) => {
    if (section.items.length <= 1) return;
    onChange({ items: section.items.filter(i => i.id !== id) });
  };

  const pros = section.items.filter(i => i.itemType === 'pro');
  const cons = section.items.filter(i => i.itemType === 'con');

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 flex-wrap text-xs">
        <span className="text-gray-500">Loại:</span>
        {(['pros-cons', 'checklist', 'feature-list'] as const).map(v => (
          <button key={v} onClick={() => onChange({ variant: v })}
            className={`px-2 py-1 rounded capitalize ${section.variant === v ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            {v === 'pros-cons' ? 'Ưu/Nhược' : v === 'checklist' ? 'Checklist' : 'Features'}
          </button>
        ))}
      </div>

      {section.variant === 'pros-cons' ? (
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-green-600 text-xs mb-1"><ThumbsUp className="w-3.5 h-3.5" /> Ưu điểm</div>
            {pros.map(item => (
              <div key={item.id} className="flex items-center gap-1.5">
                <span className="text-green-500 text-xs">+</span>
                <input type="text" value={item.text} onChange={e => updateItem(item.id, 'text', e.target.value)} placeholder="Ưu điểm..."
                  className="flex-1 px-2 py-1 bg-green-50/50 dark:bg-green-900/10 border border-green-200/50 dark:border-green-800/30 rounded text-xs focus:outline-none" />
                <button onClick={() => removeItem(item.id)} className="text-gray-400 hover:text-red-500"><Trash2 className="w-3 h-3" /></button>
              </div>
            ))}
            <button onClick={() => addItem('pro')} className="text-xs text-green-600 hover:bg-green-50 px-2 py-0.5 rounded"><Plus className="w-3 h-3 inline" /> Thêm</button>
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-red-600 text-xs mb-1"><ThumbsDown className="w-3.5 h-3.5" /> Nhược điểm</div>
            {cons.map(item => (
              <div key={item.id} className="flex items-center gap-1.5">
                <span className="text-red-500 text-xs">-</span>
                <input type="text" value={item.text} onChange={e => updateItem(item.id, 'text', e.target.value)} placeholder="Nhược điểm..."
                  className="flex-1 px-2 py-1 bg-red-50/50 dark:bg-red-900/10 border border-red-200/50 dark:border-red-800/30 rounded text-xs focus:outline-none" />
                <button onClick={() => removeItem(item.id)} className="text-gray-400 hover:text-red-500"><Trash2 className="w-3 h-3" /></button>
              </div>
            ))}
            <button onClick={() => addItem('con')} className="text-xs text-red-600 hover:bg-red-50 px-2 py-0.5 rounded"><Plus className="w-3 h-3 inline" /> Thêm</button>
          </div>
        </div>
      ) : (
        <div className="space-y-1.5">
          {section.items.map(item => (
            <div key={item.id} className="flex items-center gap-2">
              <input type="text" value={item.text} onChange={e => updateItem(item.id, 'text', e.target.value)} placeholder="Mục..."
                className="flex-1 px-2 py-1.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded text-xs focus:outline-none" />
              <button onClick={() => removeItem(item.id)} disabled={section.items.length <= 1}
                className="text-gray-400 hover:text-red-500 disabled:opacity-30"><Trash2 className="w-3 h-3" /></button>
            </div>
          ))}
          <button onClick={() => addItem('neutral')} className="flex items-center gap-1 text-xs text-blue-600 hover:bg-blue-50 px-2 py-0.5 rounded">
            <Plus className="w-3 h-3" /> Thêm mục
          </button>
        </div>
      )}
    </div>
  );
}