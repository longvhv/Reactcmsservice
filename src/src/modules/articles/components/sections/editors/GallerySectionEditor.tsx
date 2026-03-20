import { Plus, Trash2, Upload, LayoutGrid, Columns, Image as ImageIcon } from 'lucide-react';
import type { GallerySectionData, GalleryImageItem } from '@/src/types/content-section';
import { generateSectionId } from '../../../sections/index';

interface Props { section: GallerySectionData; onChange: (u: Partial<GallerySectionData>) => void; }

export function GallerySectionEditor({ section, onChange }: Props) {
  const addImage = () => {
    const newImage: GalleryImageItem = {
      id: generateSectionId(),
      url: '',
      alt: '',
      caption: '',
    };
    onChange({ images: [...section.images, newImage] });
  };

  const updateImage = (id: string, updates: Partial<GalleryImageItem>) => {
    onChange({
      images: section.images.map(img => img.id === id ? { ...img, ...updates } : img),
    });
  };

  const removeImage = (id: string) => {
    onChange({ images: section.images.filter(img => img.id !== id) });
  };

  const layouts = [
    { value: 'grid' as const, label: 'Grid', icon: LayoutGrid },
    { value: 'masonry' as const, label: 'Masonry', icon: Columns },
    { value: 'carousel' as const, label: 'Carousel', icon: ImageIcon },
  ];

  return (
    <div className="space-y-4">
      {/* Layout & Settings */}
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Bố cục</label>
          <div className="flex gap-1">
            {layouts.map(l => {
              const Icon = l.icon;
              return (
                <button
                  key={l.value}
                  onClick={() => onChange({ layout: l.value })}
                  className={`flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg text-xs transition-colors ${
                    section.layout === l.value
                      ? 'bg-pink-100 text-pink-700 border border-pink-300'
                      : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-3 h-3" /> {l.label}
                </button>
              );
            })}
          </div>
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Số cột</label>
          <div className="flex gap-1">
            {([2, 3, 4] as const).map(col => (
              <button
                key={col}
                onClick={() => onChange({ columns: col })}
                className={`flex-1 px-2 py-1.5 rounded-lg text-xs transition-colors ${
                  section.columns === col
                    ? 'bg-pink-100 text-pink-700 border border-pink-300'
                    : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'
                }`}
              >
                {col} cột
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Khoảng cách</label>
          <div className="flex gap-1">
            {(['small', 'medium', 'large'] as const).map(g => (
              <button
                key={g}
                onClick={() => onChange({ gap: g })}
                className={`flex-1 px-2 py-1.5 rounded-lg text-xs transition-colors ${
                  section.gap === g
                    ? 'bg-pink-100 text-pink-700 border border-pink-300'
                    : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'
                }`}
              >
                {g === 'small' ? 'Nhỏ' : g === 'medium' ? 'TB' : 'Lớn'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Lightbox toggle */}
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={section.enableLightbox}
          onChange={e => onChange({ enableLightbox: e.target.checked })}
          className="rounded border-gray-300"
        />
        <span className="text-gray-600">Bật Lightbox (phóng to ảnh khi click)</span>
      </label>

      {/* Images List */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">{section.images.length} ảnh</span>
          <button
            onClick={addImage}
            className="flex items-center gap-1 px-2.5 py-1 bg-pink-600 text-white rounded-lg text-xs hover:bg-pink-700 transition-colors"
          >
            <Plus className="w-3 h-3" /> Thêm ảnh
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2 max-h-[400px] overflow-y-auto">
          {section.images.map((img, idx) => (
            <div key={img.id} className="border border-gray-200 rounded-lg p-2 space-y-2 bg-gray-50/50">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">#{idx + 1}</span>
                <button onClick={() => removeImage(img.id)} className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded">
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>

              {img.url ? (
                <div className="relative aspect-video rounded overflow-hidden bg-gray-100">
                  <img src={img.url} alt={img.alt} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="aspect-video rounded bg-gray-100 flex flex-col items-center justify-center text-gray-400">
                  <Upload className="w-5 h-5 mb-1" />
                  <span className="text-xs">Chưa có ảnh</span>
                </div>
              )}

              <input
                type="text"
                value={img.url}
                onChange={e => updateImage(img.id, { url: e.target.value })}
                placeholder="URL ảnh..."
                className="w-full px-2 py-1 text-xs border border-gray-200 rounded focus:ring-1 focus:ring-pink-500 focus:border-pink-500"
              />
              <input
                type="text"
                value={img.alt}
                onChange={e => updateImage(img.id, { alt: e.target.value })}
                placeholder="Mô tả ảnh (alt)..."
                className="w-full px-2 py-1 text-xs border border-gray-200 rounded focus:ring-1 focus:ring-pink-500 focus:border-pink-500"
              />
              <input
                type="text"
                value={img.caption || ''}
                onChange={e => updateImage(img.id, { caption: e.target.value })}
                placeholder="Chú thích..."
                className="w-full px-2 py-1 text-xs border border-gray-200 rounded focus:ring-1 focus:ring-pink-500 focus:border-pink-500"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
