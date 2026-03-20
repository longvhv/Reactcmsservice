import { Monitor, Smartphone, Layout, FileText, Instagram, Facebook, Twitter, Linkedin, Youtube, Mail } from 'lucide-react';

export interface CanvasSize {
  name: string;
  width: number;
  height: number;
  icon: React.ComponentType<any>;
  category: 'social' | 'print' | 'web' | 'presentation';
}

export const canvasPresets: CanvasSize[] = [
  // Social Media
  {
    name: 'Instagram Post',
    width: 1080,
    height: 1080,
    icon: Instagram,
    category: 'social'
  },
  {
    name: 'Instagram Story',
    width: 1080,
    height: 1920,
    icon: Instagram,
    category: 'social'
  },
  {
    name: 'Facebook Post',
    width: 1200,
    height: 630,
    icon: Facebook,
    category: 'social'
  },
  {
    name: 'Facebook Cover',
    width: 820,
    height: 312,
    icon: Facebook,
    category: 'social'
  },
  {
    name: 'Twitter Post',
    width: 1200,
    height: 675,
    icon: Twitter,
    category: 'social'
  },
  {
    name: 'LinkedIn Post',
    width: 1200,
    height: 627,
    icon: Linkedin,
    category: 'social'
  },
  {
    name: 'YouTube Thumbnail',
    width: 1280,
    height: 720,
    icon: Youtube,
    category: 'social'
  },
  
  // Web
  {
    name: 'Blog Banner',
    width: 1200,
    height: 600,
    icon: Layout,
    category: 'web'
  },
  {
    name: 'Email Header',
    width: 600,
    height: 200,
    icon: Mail,
    category: 'web'
  },
  {
    name: 'Desktop Wallpaper',
    width: 1920,
    height: 1080,
    icon: Monitor,
    category: 'web'
  },
  {
    name: 'Mobile Wallpaper',
    width: 1080,
    height: 1920,
    icon: Smartphone,
    category: 'web'
  },
  
  // Print
  {
    name: 'A4 Portrait',
    width: 2480,
    height: 3508,
    icon: FileText,
    category: 'print'
  },
  {
    name: 'A4 Landscape',
    width: 3508,
    height: 2480,
    icon: FileText,
    category: 'print'
  },
  {
    name: 'Letter Portrait',
    width: 2550,
    height: 3300,
    icon: FileText,
    category: 'print'
  },
  {
    name: 'Letter Landscape',
    width: 3300,
    height: 2550,
    icon: FileText,
    category: 'print'
  },
  
  // Presentation
  {
    name: 'Presentation 16:9',
    width: 1920,
    height: 1080,
    icon: Monitor,
    category: 'presentation'
  },
  {
    name: 'Presentation 4:3',
    width: 1024,
    height: 768,
    icon: Monitor,
    category: 'presentation'
  },
];

interface CanvasSizePresetsProps {
  onSelect: (size: CanvasSize) => void;
  currentWidth?: number;
  currentHeight?: number;
}

export function CanvasSizePresets({ onSelect, currentWidth, currentHeight }: CanvasSizePresetsProps) {
  const categories = {
    social: 'Social Media',
    web: 'Web & Digital',
    print: 'Print',
    presentation: 'Presentation'
  };

  return (
    <div className="space-y-6">
      {Object.entries(categories).map(([key, label]) => {
        const presets = canvasPresets.filter(p => p.category === key);
        
        return (
          <div key={key}>
            <h3 className="text-sm font-semibold text-slate-700 mb-3">{label}</h3>
            <div className="grid grid-cols-2 gap-2">
              {presets.map((preset) => {
                const Icon = preset.icon;
                const isActive = currentWidth === preset.width && currentHeight === preset.height;
                
                return (
                  <button
                    key={preset.name}
                    onClick={() => onSelect(preset)}
                    className={`p-3 rounded-lg border-2 transition-all text-left hover:shadow-md ${
                      isActive
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <Icon className="w-5 h-5 text-slate-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm text-slate-900 truncate">
                          {preset.name}
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          {preset.width} × {preset.height}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
