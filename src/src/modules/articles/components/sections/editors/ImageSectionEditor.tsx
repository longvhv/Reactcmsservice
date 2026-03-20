import React from 'react';
import { Upload, X } from 'lucide-react';
import type { ImageSectionData } from '@/src/types/content-section';

interface Props { section: ImageSectionData; onChange: (u: Partial<ImageSectionData>) => void; }

export function ImageSectionEditor({ section, onChange }: Props) {
  return (
    <div className="space-y-3">
      {section.imageUrl ? (
        <div className="relative group">
          <img src={section.imageUrl} alt={section.alt} className="w-full max-h-64 object-cover rounded-lg" />
          <button onClick={() => onChange({ imageUrl: '' })} className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center">
          <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
          <p className="text-sm text-gray-500 mb-2">Nhập URL hình ảnh</p>
        </div>
      )}
      <input type="url" value={section.imageUrl} onChange={e => onChange({ imageUrl: e.target.value })} placeholder="URL hình ảnh..."
        className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
      <div className="grid grid-cols-2 gap-3">
        <input type="text" value={section.alt} onChange={e => onChange({ alt: e.target.value })} placeholder="Alt text..."
          className="px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
        <input type="text" value={section.caption || ''} onChange={e => onChange({ caption: e.target.value })} placeholder="Caption..."
          className="px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
      </div>
      <div className="flex items-center gap-3">
        <select value={section.width} onChange={e => onChange({ width: e.target.value as any })}
          className="px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm">
          <option value="full">Full width</option><option value="wide">Wide</option><option value="medium">Medium</option><option value="small">Small</option>
        </select>
        <select value={section.alignment} onChange={e => onChange({ alignment: e.target.value as any })}
          className="px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm">
          <option value="left">Trái</option><option value="center">Giữa</option><option value="right">Phải</option>
        </select>
      </div>
    </div>
  );
}