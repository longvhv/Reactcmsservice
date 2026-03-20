import { Plus, Trash2, GripVertical } from 'lucide-react';
import type { SlideshowSectionData, SlideshowSlide } from '@/src/types/content-section';
import { generateSectionId } from '../../../sections/index';

interface Props { section: SlideshowSectionData; onChange: (u: Partial<SlideshowSectionData>) => void; }

export function SlideshowSectionEditor({ section, onChange }: Props) {
  const updateSlide = (id: string, field: keyof SlideshowSlide, value: string) => {
    onChange({ slides: section.slides.map(s => s.id === id ? { ...s, [field]: value } : s) });
  };
  const addSlide = () => {
    onChange({ slides: [...section.slides, { id: generateSectionId(), imageUrl: '', caption: '', alt: '' }] });
  };
  const removeSlide = (id: string) => {
    onChange({ slides: section.slides.filter(s => s.id !== id) });
  };

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        {section.slides.map((slide, i) => (
          <div key={slide.id} className="flex gap-3 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700">
            {slide.imageUrl && <img src={slide.imageUrl} alt={slide.alt} className="w-20 h-14 object-cover rounded" />}
            <div className="flex-1 space-y-1.5">
              <input type="url" value={slide.imageUrl} onChange={e => updateSlide(slide.id, 'imageUrl', e.target.value)} placeholder="URL hình ảnh..."
                className="w-full px-2 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500/30" />
              <div className="flex gap-2">
                <input type="text" value={slide.caption || ''} onChange={e => updateSlide(slide.id, 'caption', e.target.value)} placeholder="Caption..."
                  className="flex-1 px-2 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500/30" />
                <input type="text" value={slide.alt} onChange={e => updateSlide(slide.id, 'alt', e.target.value)} placeholder="Alt text..."
                  className="flex-1 px-2 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500/30" />
              </div>
            </div>
            <button onClick={() => removeSlide(slide.id)} className="p-1 text-gray-400 hover:text-red-500 self-start"><Trash2 className="w-3.5 h-3.5" /></button>
          </div>
        ))}
      </div>
      <button onClick={addSlide} className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
        <Plus className="w-3.5 h-3.5" /> Thêm slide
      </button>
      <div className="flex items-center gap-4 flex-wrap text-xs">
        <label className="flex items-center gap-1.5 cursor-pointer">
          <input type="checkbox" checked={section.autoPlay} onChange={e => onChange({ autoPlay: e.target.checked })} className="rounded" />
          <span className="text-gray-600 dark:text-gray-400">Tự động phát</span>
        </label>
        {section.autoPlay && (
          <label className="flex items-center gap-1.5">
            <span className="text-gray-500">Mỗi</span>
            <input type="number" value={section.interval} onChange={e => onChange({ interval: Number(e.target.value) || 5 })} min={2} max={15}
              className="w-12 px-1 py-0.5 border border-gray-200 dark:border-gray-700 rounded text-xs text-center" />
            <span className="text-gray-500">giây</span>
          </label>
        )}
        <label className="flex items-center gap-1.5 cursor-pointer">
          <input type="checkbox" checked={section.showDots} onChange={e => onChange({ showDots: e.target.checked })} className="rounded" />
          <span className="text-gray-600 dark:text-gray-400">Dots</span>
        </label>
        <label className="flex items-center gap-1.5 cursor-pointer">
          <input type="checkbox" checked={section.showArrows} onChange={e => onChange({ showArrows: e.target.checked })} className="rounded" />
          <span className="text-gray-600 dark:text-gray-400">Arrows</span>
        </label>
        <select value={section.transition} onChange={e => onChange({ transition: e.target.value as any })}
          className="px-2 py-1 border border-gray-200 dark:border-gray-700 rounded text-xs bg-gray-50 dark:bg-gray-900">
          <option value="slide">Slide</option><option value="fade">Fade</option><option value="zoom">Zoom</option>
        </select>
      </div>
    </div>
  );
}