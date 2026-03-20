import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import type { ChartSectionData, ChartDataPoint } from '@/src/types/content-section';
import { generateSectionId } from '../../../sections/index';

interface Props { section: ChartSectionData; onChange: (u: Partial<ChartSectionData>) => void; }

const chartTypes = ['bar', 'line', 'pie', 'area', 'donut', 'radar'] as const;
const chartIcons: Record<string, string> = { bar: '📊', line: '📈', pie: '🥧', area: '📉', donut: '🍩', radar: '🎯' };

export function ChartSectionEditor({ section, onChange }: Props) {
  const updateDataPoint = (index: number, field: keyof ChartDataPoint, value: any) => {
    const newData = [...section.data];
    newData[index] = { ...newData[index], [field]: field === 'value' ? Number(value) || 0 : value };
    onChange({ data: newData });
  };

  const addDataPoint = () => {
    const colors = section.colorScheme;
    onChange({
      data: [...section.data, { label: `Item ${section.data.length + 1}`, value: 50, color: colors[section.data.length % colors.length] }],
    });
  };

  const removeDataPoint = (index: number) => {
    if (section.data.length <= 1) return;
    onChange({ data: section.data.filter((_, i) => i !== index) });
  };

  return (
    <div className="space-y-4">
      {/* Chart Type Selector */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {chartTypes.map(t => (
          <button key={t} onClick={() => onChange({ chartType: t })}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs capitalize transition-all ${
              section.chartType === t ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 ring-1 ring-emerald-300' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 hover:bg-gray-200'
            }`}>
            <span>{chartIcons[t]}</span> {t}
          </button>
        ))}
      </div>

      {/* Chart Title */}
      <input type="text" value={section.chartTitle || ''} onChange={e => onChange({ chartTitle: e.target.value })} placeholder="Tiêu đề biểu đồ (tùy chọn)..."
        className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20" />

      {/* Data Table */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        <div className="bg-gray-50 dark:bg-gray-900/50 px-3 py-2 text-xs text-gray-500 flex items-center justify-between">
          <span>Dữ liệu ({section.data.length} mục)</span>
          <button onClick={addDataPoint} className="flex items-center gap-1 text-blue-600 hover:text-blue-700">
            <Plus className="w-3 h-3" /> Thêm
          </button>
        </div>
        <div className="divide-y divide-gray-100 dark:divide-gray-700">
          {section.data.map((point, i) => (
            <div key={i} className="flex items-center gap-2 px-3 py-2">
              <input type="color" value={point.color || section.colorScheme[i % section.colorScheme.length]} onChange={e => updateDataPoint(i, 'color', e.target.value)}
                className="w-6 h-6 rounded cursor-pointer border-0" />
              <input type="text" value={point.label} onChange={e => updateDataPoint(i, 'label', e.target.value)} placeholder="Label"
                className="flex-1 px-2 py-1 bg-transparent border border-gray-200 dark:border-gray-700 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500/30" />
              <input type="number" value={point.value} onChange={e => updateDataPoint(i, 'value', e.target.value)} placeholder="Value"
                className="w-24 px-2 py-1 bg-transparent border border-gray-200 dark:border-gray-700 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500/30" />
              <button onClick={() => removeDataPoint(i)} disabled={section.data.length <= 1}
                className="p-1 text-gray-400 hover:text-red-500 disabled:opacity-30 transition-colors">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Settings */}
      <div className="flex items-center gap-4 flex-wrap text-xs">
        <label className="flex items-center gap-1.5 cursor-pointer">
          <input type="checkbox" checked={section.showLegend} onChange={e => onChange({ showLegend: e.target.checked })} className="rounded" />
          <span className="text-gray-600 dark:text-gray-400">Chú giải</span>
        </label>
        <label className="flex items-center gap-1.5 cursor-pointer">
          <input type="checkbox" checked={section.showGrid} onChange={e => onChange({ showGrid: e.target.checked })} className="rounded" />
          <span className="text-gray-600 dark:text-gray-400">Lưới</span>
        </label>
        <label className="flex items-center gap-1.5 cursor-pointer">
          <input type="checkbox" checked={section.showValues} onChange={e => onChange({ showValues: e.target.checked })} className="rounded" />
          <span className="text-gray-600 dark:text-gray-400">Giá trị</span>
        </label>
        <label className="flex items-center gap-1.5 cursor-pointer">
          <input type="checkbox" checked={section.animate} onChange={e => onChange({ animate: e.target.checked })} className="rounded" />
          <span className="text-gray-600 dark:text-gray-400">Animation</span>
        </label>
      </div>
    </div>
  );
}