import { Plus, Trash2, GripVertical } from 'lucide-react';
import type { TimelineSectionData, TimelineEvent } from '@/src/types/content-section';
import { generateSectionId } from '../../../sections/index';

interface Props { section: TimelineSectionData; onChange: (u: Partial<TimelineSectionData>) => void; }

export function TimelineSectionEditor({ section, onChange }: Props) {
  const updateEvent = (id: string, field: keyof TimelineEvent, value: string) => {
    onChange({ events: section.events.map(e => e.id === id ? { ...e, [field]: value } : e) });
  };
  const addEvent = () => {
    onChange({ events: [...section.events, { id: generateSectionId(), date: '', eventTitle: '', description: '', color: '#3b82f6' }] });
  };
  const removeEvent = (id: string) => {
    if (section.events.length <= 1) return;
    onChange({ events: section.events.filter(e => e.id !== id) });
  };
  const colors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-gray-500">Layout:</span>
        {(['left', 'right', 'alternating'] as const).map(l => (
          <button key={l} onClick={() => onChange({ layout: l })}
            className={`px-2 py-1 rounded text-xs capitalize ${section.layout === l ? 'bg-violet-100 dark:bg-violet-900/30 text-violet-700' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 hover:bg-gray-200'}`}>
            {l === 'left' ? 'Trái' : l === 'right' ? 'Phải' : 'Xen kẽ'}
          </button>
        ))}
      </div>
      <div className="space-y-2">
        {section.events.map((event, i) => (
          <div key={event.id} className="flex gap-2 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex flex-col items-center gap-1 pt-1">
              <GripVertical className="w-3.5 h-3.5 text-gray-400" />
              <div className="flex flex-col gap-0.5">
                {colors.map(c => (
                  <button key={c} onClick={() => updateEvent(event.id, 'color', c)}
                    className={`w-3 h-3 rounded-full transition-transform ${event.color === c ? 'scale-125 ring-1 ring-offset-1 ring-gray-400' : 'hover:scale-110'}`}
                    style={{ backgroundColor: c }} />
                ))}
              </div>
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex gap-2">
                <input type="text" value={event.date} onChange={e => updateEvent(event.id, 'date', e.target.value)} placeholder="Thời gian..."
                  className="w-32 px-2 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500/30" />
                <input type="text" value={event.eventTitle} onChange={e => updateEvent(event.id, 'eventTitle', e.target.value)} placeholder="Tiêu đề sự kiện..."
                  className="flex-1 px-2 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500/30" />
              </div>
              <textarea value={event.description} onChange={e => updateEvent(event.id, 'description', e.target.value)} placeholder="Mô tả..."
                rows={2} className="w-full px-2 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500/30 resize-none" />
            </div>
            <button onClick={() => removeEvent(event.id)} disabled={section.events.length <= 1}
              className="p-1 text-gray-400 hover:text-red-500 disabled:opacity-30 self-start">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
      <button onClick={addEvent} className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
        <Plus className="w-3.5 h-3.5" /> Thêm sự kiện
      </button>
    </div>
  );
}