import type { VideoSectionData } from '@/src/types/content-section';

interface Props { section: VideoSectionData; onChange: (u: Partial<VideoSectionData>) => void; }

export function VideoSectionEditor({ section, onChange }: Props) {
  const getEmbedUrl = (url: string): string | null => {
    const ytMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]+)/);
    if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;
    const viMatch = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
    if (viMatch) return `https://player.vimeo.com/video/${viMatch[1]}`;
    return null;
  };
  const embedUrl = getEmbedUrl(section.url);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        {(['youtube', 'vimeo', 'url'] as const).map(s => (
          <button key={s} onClick={() => onChange({ source: s })}
            className={`px-3 py-1.5 rounded-lg text-xs capitalize ${section.source === s ? 'bg-red-100 dark:bg-red-900/30 text-red-700' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 hover:bg-gray-200'}`}>
            {s}
          </button>
        ))}
      </div>
      <input type="url" value={section.url} onChange={e => onChange({ url: e.target.value })}
        placeholder={section.source === 'youtube' ? 'https://youtube.com/watch?v=...' : section.source === 'vimeo' ? 'https://vimeo.com/...' : 'URL video...'}
        className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
      {embedUrl && (
        <div className="aspect-video rounded-lg overflow-hidden bg-black">
          <iframe src={embedUrl} className="w-full h-full" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
        </div>
      )}
      <div className="flex gap-3">
        <input type="text" value={section.caption || ''} onChange={e => onChange({ caption: e.target.value })} placeholder="Caption (tùy chọn)..."
          className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
        <select value={section.aspectRatio} onChange={e => onChange({ aspectRatio: e.target.value as any })}
          className="px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm">
          <option value="16:9">16:9</option><option value="4:3">4:3</option><option value="21:9">21:9</option>
        </select>
      </div>
    </div>
  );
}