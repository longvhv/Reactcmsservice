import { Plus, Trash2, Columns, Table } from 'lucide-react';
import type { ComparisonSectionData, ComparisonItem, ComparisonCriteria } from '@/src/types/content-section';
import { generateSectionId } from '../../../sections/index';

interface Props { section: ComparisonSectionData; onChange: (u: Partial<ComparisonSectionData>) => void; }

export function ComparisonSectionEditor({ section, onChange }: Props) {
  const addItem = () => {
    const values: Record<string, string> = {};
    section.criteria.forEach(c => { values[c.id] = ''; });
    const newItem: ComparisonItem = {
      id: generateSectionId(),
      name: `Mục ${section.items.length + 1}`,
      values,
    };
    onChange({ items: [...section.items, newItem] });
  };

  const removeItem = (id: string) => {
    onChange({ items: section.items.filter(i => i.id !== id) });
  };

  const updateItem = (id: string, updates: Partial<ComparisonItem>) => {
    onChange({ items: section.items.map(i => i.id === id ? { ...i, ...updates } : i) });
  };

  const updateItemValue = (itemId: string, criteriaId: string, value: string) => {
    onChange({
      items: section.items.map(i =>
        i.id === itemId ? { ...i, values: { ...i.values, [criteriaId]: value } } : i
      ),
    });
  };

  const addCriteria = () => {
    const newCriteria: ComparisonCriteria = {
      id: generateSectionId(),
      name: `Tiêu chí ${section.criteria.length + 1}`,
      criteriaType: 'text',
    };
    // Add default value for this criteria to all items
    const updatedItems = section.items.map(item => ({
      ...item,
      values: { ...item.values, [newCriteria.id]: '' },
    }));
    onChange({ criteria: [...section.criteria, newCriteria], items: updatedItems });
  };

  const removeCriteria = (id: string) => {
    const updatedItems = section.items.map(item => {
      const { [id]: _, ...rest } = item.values;
      return { ...item, values: rest };
    });
    onChange({
      criteria: section.criteria.filter(c => c.id !== id),
      items: updatedItems,
    });
  };

  const updateCriteria = (id: string, updates: Partial<ComparisonCriteria>) => {
    onChange({ criteria: section.criteria.map(c => c.id === id ? { ...c, ...updates } : c) });
  };

  const layouts = [
    { value: 'side-by-side' as const, label: 'Cạnh nhau', icon: Columns },
    { value: 'table' as const, label: 'Bảng', icon: Table },
  ];

  return (
    <div className="space-y-4">
      {/* Layout */}
      <div>
        <label className="text-xs text-gray-500 mb-1.5 block">Bố cục</label>
        <div className="flex gap-1">
          {layouts.map(l => {
            const Icon = l.icon;
            return (
              <button
                key={l.value}
                onClick={() => onChange({ comparisonLayout: l.value })}
                className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs transition-colors ${
                  section.comparisonLayout === l.value
                    ? 'bg-lime-100 text-lime-700 border border-lime-300'
                    : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-3.5 h-3.5" /> {l.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Criteria Management */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs text-gray-500">Tiêu chí so sánh ({section.criteria.length})</label>
          <button onClick={addCriteria} className="flex items-center gap-1 px-2 py-1 bg-lime-600 text-white rounded-lg text-xs hover:bg-lime-700 transition-colors">
            <Plus className="w-3 h-3" /> Thêm tiêu chí
          </button>
        </div>
        <div className="space-y-1.5">
          {section.criteria.map(c => (
            <div key={c.id} className="flex items-center gap-2">
              <input
                type="text"
                value={c.name}
                onChange={e => updateCriteria(c.id, { name: e.target.value })}
                className="flex-1 px-2 py-1.5 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-lime-500"
                placeholder="Tên tiêu chí..."
              />
              <select
                value={c.criteriaType}
                onChange={e => updateCriteria(c.id, { criteriaType: e.target.value as any })}
                className="px-2 py-1.5 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-lime-500"
              >
                <option value="text">Văn bản</option>
                <option value="rating">Đánh giá</option>
                <option value="boolean">Có/Không</option>
              </select>
              <button onClick={() => removeCriteria(c.id)} className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded">
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Items to Compare */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs text-gray-500">Các mục so sánh ({section.items.length})</label>
          <button onClick={addItem} className="flex items-center gap-1 px-2 py-1 bg-lime-600 text-white rounded-lg text-xs hover:bg-lime-700 transition-colors">
            <Plus className="w-3 h-3" /> Thêm mục
          </button>
        </div>
        <div className="space-y-3">
          {section.items.map((item, idx) => (
            <div key={item.id} className="border border-gray-200 rounded-lg p-3 bg-gray-50/50 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 w-5">{idx + 1}</span>
                <input
                  type="text"
                  value={item.name}
                  onChange={e => updateItem(item.id, { name: e.target.value })}
                  className="flex-1 px-2 py-1 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-lime-500"
                  placeholder="Tên mục..."
                />
                <input
                  type="text"
                  value={item.image || ''}
                  onChange={e => updateItem(item.id, { image: e.target.value })}
                  className="flex-1 px-2 py-1 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-lime-500"
                  placeholder="URL ảnh (tùy chọn)..."
                />
                <button onClick={() => removeItem(item.id)} className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded">
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
              {/* Values for each criteria */}
              <div className="grid grid-cols-2 gap-2 pl-7">
                {section.criteria.map(c => (
                  <div key={c.id}>
                    <label className="text-[10px] text-gray-400">{c.name}</label>
                    {c.criteriaType === 'boolean' ? (
                      <select
                        value={item.values[c.id] || ''}
                        onChange={e => updateItemValue(item.id, c.id, e.target.value)}
                        className="w-full px-2 py-1 text-xs border border-gray-200 rounded focus:ring-1 focus:ring-lime-500"
                      >
                        <option value="">-</option>
                        <option value="true">Có</option>
                        <option value="false">Không</option>
                      </select>
                    ) : c.criteriaType === 'rating' ? (
                      <input
                        type="number"
                        min="0"
                        max="10"
                        step="0.5"
                        value={item.values[c.id] || ''}
                        onChange={e => updateItemValue(item.id, c.id, e.target.value)}
                        className="w-full px-2 py-1 text-xs border border-gray-200 rounded focus:ring-1 focus:ring-lime-500"
                        placeholder="0-10"
                      />
                    ) : (
                      <input
                        type="text"
                        value={item.values[c.id] || ''}
                        onChange={e => updateItemValue(item.id, c.id, e.target.value)}
                        className="w-full px-2 py-1 text-xs border border-gray-200 rounded focus:ring-1 focus:ring-lime-500"
                        placeholder="Giá trị..."
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
