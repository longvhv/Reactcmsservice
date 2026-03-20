import { Music, Radio, Headphones } from 'lucide-react';
import type { AudioSectionData } from '@/src/types/content-section';

interface Props { section: AudioSectionData; onChange: (u: Partial<AudioSectionData>) => void; }

export function AudioSectionEditor({ section, onChange }: Props) {
  const sources = [
    { value: 'url' as const, label: 'URL trực tiếp', icon: Music },
    { value: 'spotify' as const, label: 'Spotify', icon: Headphones },
    { value: 'soundcloud' as const, label: 'SoundCloud', icon: Radio },
  ];

  return (
    <div className="space-y-4">
      {/* Source Selection */}
      <div>
        <label className="text-xs text-gray-500 mb-1.5 block">Nguồn âm thanh</label>
        <div className="flex gap-1">
          {sources.map(s => {
            const Icon = s.icon;
            return (
              <button
                key={s.value}
                onClick={() => onChange({ source: s.value })}
                className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs transition-colors ${
                  section.source === s.value
                    ? 'bg-orange-100 text-orange-700 border border-orange-300'
                    : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-3.5 h-3.5" /> {s.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* URL Input */}
      <div>
        <label className="text-xs text-gray-500 mb-1 block">
          {section.source === 'spotify' ? 'Spotify URL/Embed' : section.source === 'soundcloud' ? 'SoundCloud URL' : 'Audio URL'}
        </label>
        <input
          type="text"
          value={section.url}
          onChange={e => onChange({ url: e.target.value })}
          placeholder={
            section.source === 'spotify'
              ? 'https://open.spotify.com/track/...'
              : section.source === 'soundcloud'
              ? 'https://soundcloud.com/...'
              : 'https://example.com/audio.mp3'
          }
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
        />
      </div>

      {/* Title & Artist */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Tiêu đề</label>
          <input
            type="text"
            value={section.audioTitle}
            onChange={e => onChange({ audioTitle: e.target.value })}
            placeholder="Tên bài hát/podcast..."
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          />
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Nghệ sĩ/Tác giả</label>
          <input
            type="text"
            value={section.artist || ''}
            onChange={e => onChange({ artist: e.target.value })}
            placeholder="Tên nghệ sĩ..."
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          />
        </div>
      </div>

      {/* Cover Image */}
      <div>
        <label className="text-xs text-gray-500 mb-1 block">Ảnh bìa (tùy chọn)</label>
        <input
          type="text"
          value={section.coverImage || ''}
          onChange={e => onChange({ coverImage: e.target.value })}
          placeholder="URL ảnh bìa..."
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
        />
      </div>

      {/* Preview */}
      {section.url && (
        <div className="p-4 bg-gray-900 rounded-xl flex items-center gap-4">
          {section.coverImage ? (
            <img src={section.coverImage} alt="" className="w-14 h-14 rounded-lg object-cover" />
          ) : (
            <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center">
              <Music className="w-6 h-6 text-white" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm truncate">{section.audioTitle || 'Untitled'}</p>
            <p className="text-gray-400 text-xs truncate">{section.artist || 'Unknown artist'}</p>
            <div className="mt-2 h-1 bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full w-1/3 bg-orange-500 rounded-full" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
