import { ExternalLink, Youtube, Twitter, Facebook, Instagram, Code, Figma } from 'lucide-react';
import type { EmbedSectionData } from '@/src/types/content-section';

interface Props { section: EmbedSectionData; onChange: (u: Partial<EmbedSectionData>) => void; }

export function EmbedSectionEditor({ section, onChange }: Props) {
  const embedTypes = [
    { value: 'youtube' as const, label: 'YouTube' },
    { value: 'vimeo' as const, label: 'Vimeo' },
    { value: 'twitter' as const, label: 'Twitter/X' },
    { value: 'facebook' as const, label: 'Facebook' },
    { value: 'instagram' as const, label: 'Instagram' },
    { value: 'codepen' as const, label: 'CodePen' },
    { value: 'figma' as const, label: 'Figma' },
    { value: 'custom' as const, label: 'Tùy chỉnh' },
  ];

  const aspectRatios = [
    { value: '16:9' as const, label: '16:9' },
    { value: '4:3' as const, label: '4:3' },
    { value: '1:1' as const, label: '1:1' },
    { value: 'auto' as const, label: 'Tự động' },
  ];

  const getPlaceholder = () => {
    switch (section.embedType) {
      case 'youtube': return 'https://www.youtube.com/watch?v=...';
      case 'vimeo': return 'https://vimeo.com/...';
      case 'twitter': return 'https://twitter.com/user/status/...';
      case 'facebook': return 'https://www.facebook.com/...';
      case 'instagram': return 'https://www.instagram.com/p/...';
      case 'codepen': return 'https://codepen.io/user/pen/...';
      case 'figma': return 'https://www.figma.com/file/...';
      default: return 'https://...';
    }
  };

  return (
    <div className="space-y-4">
      {/* Embed Type Selection */}
      <div>
        <label className="text-xs text-gray-500 mb-1.5 block">Loại nhúng</label>
        <div className="grid grid-cols-4 gap-1">
          {embedTypes.map(et => (
            <button
              key={et.value}
              onClick={() => onChange({ embedType: et.value })}
              className={`px-2 py-1.5 rounded-lg text-xs transition-colors ${
                section.embedType === et.value
                  ? 'bg-teal-100 text-teal-700 border border-teal-300'
                  : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'
              }`}
            >
              {et.label}
            </button>
          ))}
        </div>
      </div>

      {/* URL Input */}
      <div>
        <label className="text-xs text-gray-500 mb-1 block">URL</label>
        <input
          type="text"
          value={section.url}
          onChange={e => onChange({ url: e.target.value })}
          placeholder={getPlaceholder()}
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
        />
      </div>

      {/* Custom Embed Code (for custom type) */}
      {section.embedType === 'custom' && (
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Mã nhúng HTML (iframe/embed)</label>
          <textarea
            value={section.embedCode || ''}
            onChange={e => onChange({ embedCode: e.target.value })}
            placeholder="<iframe src='...' width='100%' height='400'></iframe>"
            rows={4}
            className="w-full px-3 py-2 text-sm font-mono border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
          />
        </div>
      )}

      {/* Aspect Ratio */}
      <div>
        <label className="text-xs text-gray-500 mb-1 block">Tỷ lệ khung hình</label>
        <div className="flex gap-1">
          {aspectRatios.map(ar => (
            <button
              key={ar.value}
              onClick={() => onChange({ aspectRatio: ar.value })}
              className={`flex-1 px-3 py-1.5 rounded-lg text-xs transition-colors ${
                section.aspectRatio === ar.value
                  ? 'bg-teal-100 text-teal-700 border border-teal-300'
                  : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'
              }`}
            >
              {ar.label}
            </button>
          ))}
        </div>
      </div>

      {/* Preview */}
      {section.url && (
        <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <ExternalLink className="w-4 h-4 text-teal-600" />
            <span className="capitalize">{section.embedType}</span>
            <span className="text-gray-400">•</span>
            <span className="truncate text-xs text-gray-400">{section.url}</span>
          </div>
          <div className={`mt-2 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 ${
            section.aspectRatio === '16:9' ? 'aspect-video' :
            section.aspectRatio === '4:3' ? 'aspect-[4/3]' :
            section.aspectRatio === '1:1' ? 'aspect-square' : 'h-32'
          }`}>
            <span className="text-xs">Embed preview sẽ hiển thị ở chế độ xem trước</span>
          </div>
        </div>
      )}
    </div>
  );
}
