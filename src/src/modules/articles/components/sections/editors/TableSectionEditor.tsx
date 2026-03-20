import { Plus, Trash2 } from 'lucide-react';
import type { TableSectionData } from '@/src/types/content-section';

interface Props { section: TableSectionData; onChange: (u: Partial<TableSectionData>) => void; }

export function TableSectionEditor({ section, onChange }: Props) {
  const updateHeader = (index: number, value: string) => {
    const newHeaders = [...section.headers];
    newHeaders[index] = value;
    onChange({ headers: newHeaders });
  };
  const updateCell = (rowIndex: number, colIndex: number, value: string) => {
    const newRows = section.rows.map(r => [...r]);
    newRows[rowIndex][colIndex] = value;
    onChange({ rows: newRows });
  };
  const addColumn = () => {
    onChange({ headers: [...section.headers, `Cột ${section.headers.length + 1}`], rows: section.rows.map(r => [...r, '']) });
  };
  const removeColumn = (index: number) => {
    if (section.headers.length <= 1) return;
    onChange({ headers: section.headers.filter((_, i) => i !== index), rows: section.rows.map(r => r.filter((_, i) => i !== index)) });
  };
  const addRow = () => {
    onChange({ rows: [...section.rows, new Array(section.headers.length).fill('')] });
  };
  const removeRow = (index: number) => {
    if (section.rows.length <= 1) return;
    onChange({ rows: section.rows.filter((_, i) => i !== index) });
  };

  return (
    <div className="space-y-3">
      <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-900/50">
              {section.headers.map((h, i) => (
                <th key={i} className="border-b border-r border-gray-200 dark:border-gray-700 last:border-r-0">
                  <div className="flex items-center">
                    <input type="text" value={h} onChange={e => updateHeader(i, e.target.value)}
                      className="flex-1 px-2 py-1.5 bg-transparent text-xs focus:outline-none" />
                    <button onClick={() => removeColumn(i)} disabled={section.headers.length <= 1}
                      className="p-0.5 text-gray-400 hover:text-red-500 disabled:opacity-30"><Trash2 className="w-3 h-3" /></button>
                  </div>
                </th>
              ))}
              <th className="w-8 border-b border-gray-200 dark:border-gray-700">
                <button onClick={addColumn} className="p-1 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"><Plus className="w-3 h-3" /></button>
              </th>
            </tr>
          </thead>
          <tbody>
            {section.rows.map((row, ri) => (
              <tr key={ri} className="border-b border-gray-100 dark:border-gray-800 last:border-b-0">
                {row.map((cell, ci) => (
                  <td key={ci} className="border-r border-gray-100 dark:border-gray-800 last:border-r-0">
                    <input type="text" value={cell} onChange={e => updateCell(ri, ci, e.target.value)}
                      className="w-full px-2 py-1.5 bg-transparent text-xs focus:outline-none focus:bg-blue-50/50 dark:focus:bg-blue-900/10" />
                  </td>
                ))}
                <td className="w-8">
                  <button onClick={() => removeRow(ri)} disabled={section.rows.length <= 1}
                    className="p-0.5 text-gray-400 hover:text-red-500 disabled:opacity-30"><Trash2 className="w-3 h-3" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center gap-3">
        <button onClick={addRow} className="flex items-center gap-1 px-3 py-1 text-xs text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg">
          <Plus className="w-3 h-3" /> Thêm hàng
        </button>
        <div className="flex-1" />
        <div className="flex items-center gap-3 text-xs">
          <label className="flex items-center gap-1 cursor-pointer">
            <input type="checkbox" checked={section.striped} onChange={e => onChange({ striped: e.target.checked })} className="rounded" />
            <span className="text-gray-500">Striped</span>
          </label>
          <label className="flex items-center gap-1 cursor-pointer">
            <input type="checkbox" checked={section.bordered} onChange={e => onChange({ bordered: e.target.checked })} className="rounded" />
            <span className="text-gray-500">Bordered</span>
          </label>
        </div>
      </div>
    </div>
  );
}