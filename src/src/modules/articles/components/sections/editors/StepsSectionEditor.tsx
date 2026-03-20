import { Plus, Trash2 } from 'lucide-react';
import type { StepsSectionData } from '@/src/types/content-section';
import { generateSectionId } from '../../../sections/index';

interface Props { section: StepsSectionData; onChange: (u: Partial<StepsSectionData>) => void; }

export function StepsSectionEditor({ section, onChange }: Props) {
  const updateStep = (id: string, field: string, value: string) => {
    onChange({ steps: section.steps.map(s => s.id === id ? { ...s, [field]: value } : s) });
  };
  const addStep = () => {
    onChange({ steps: [...section.steps, { id: generateSectionId(), stepTitle: `Bước ${section.steps.length + 1}`, description: '' }] });
  };
  const removeStep = (id: string) => {
    if (section.steps.length <= 1) return;
    onChange({ steps: section.steps.filter(s => s.id !== id) });
  };

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        {section.steps.map((step, i) => (
          <div key={step.id} className="flex gap-3 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
              {i + 1}
            </div>
            <div className="flex-1 space-y-1.5">
              <input type="text" value={step.stepTitle} onChange={e => updateStep(step.id, 'stepTitle', e.target.value)} placeholder={`Tiêu đề bước ${i + 1}...`}
                className="w-full px-2 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500/30" />
              <textarea value={step.description} onChange={e => updateStep(step.id, 'description', e.target.value)} placeholder="Mô tả chi tiết..."
                rows={2} className="w-full px-2 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500/30 resize-none" />
              <input type="text" value={step.duration || ''} onChange={e => updateStep(step.id, 'duration', e.target.value)} placeholder="Thời gian (VD: 5 phút)..."
                className="w-48 px-2 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500/30" />
            </div>
            <button onClick={() => removeStep(step.id)} disabled={section.steps.length <= 1}
              className="p-1 text-gray-400 hover:text-red-500 disabled:opacity-30 self-start"><Trash2 className="w-3.5 h-3.5" /></button>
          </div>
        ))}
      </div>
      <button onClick={addStep} className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-blue-600 hover:bg-blue-50 rounded-lg">
        <Plus className="w-3.5 h-3.5" /> Thêm bước
      </button>
      <div className="flex items-center gap-3 text-xs">
        <label className="flex items-center gap-1.5 cursor-pointer">
          <input type="checkbox" checked={section.showNumbers} onChange={e => onChange({ showNumbers: e.target.checked })} className="rounded" />
          <span className="text-gray-500">Số thứ tự</span>
        </label>
        <div className="flex gap-1">
          {(['simple', 'cards', 'connected'] as const).map(s => (
            <button key={s} onClick={() => onChange({ stepsStyle: s })}
              className={`px-2 py-0.5 rounded text-xs capitalize ${section.stepsStyle === s ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{s}</button>
          ))}
        </div>
      </div>
    </div>
  );
}