export interface TextStyle {
  name: string;
  fontSize: number;
  fontWeight: string;
  lineHeight: number;
  letterSpacing: number;
  category: 'heading' | 'body' | 'display' | 'special';
}

export const textStylePresets: TextStyle[] = [
  // Display
  {
    name: 'Display Large',
    fontSize: 72,
    fontWeight: 'bold',
    lineHeight: 1.1,
    letterSpacing: -2,
    category: 'display'
  },
  {
    name: 'Display Medium',
    fontSize: 56,
    fontWeight: 'bold',
    lineHeight: 1.2,
    letterSpacing: -1.5,
    category: 'display'
  },
  {
    name: 'Display Small',
    fontSize: 48,
    fontWeight: 'bold',
    lineHeight: 1.2,
    letterSpacing: -1,
    category: 'display'
  },
  
  // Headings
  {
    name: 'Heading 1',
    fontSize: 36,
    fontWeight: 'bold',
    lineHeight: 1.3,
    letterSpacing: -0.5,
    category: 'heading'
  },
  {
    name: 'Heading 2',
    fontSize: 30,
    fontWeight: 'bold',
    lineHeight: 1.3,
    letterSpacing: 0,
    category: 'heading'
  },
  {
    name: 'Heading 3',
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 1.4,
    letterSpacing: 0,
    category: 'heading'
  },
  {
    name: 'Heading 4',
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 1.4,
    letterSpacing: 0,
    category: 'heading'
  },
  {
    name: 'Heading 5',
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 1.5,
    letterSpacing: 0,
    category: 'heading'
  },
  {
    name: 'Heading 6',
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 1.5,
    letterSpacing: 0,
    category: 'heading'
  },
  
  // Body
  {
    name: 'Body Large',
    fontSize: 18,
    fontWeight: 'normal',
    lineHeight: 1.6,
    letterSpacing: 0,
    category: 'body'
  },
  {
    name: 'Body Regular',
    fontSize: 16,
    fontWeight: 'normal',
    lineHeight: 1.6,
    letterSpacing: 0,
    category: 'body'
  },
  {
    name: 'Body Small',
    fontSize: 14,
    fontWeight: 'normal',
    lineHeight: 1.5,
    letterSpacing: 0,
    category: 'body'
  },
  {
    name: 'Caption',
    fontSize: 12,
    fontWeight: 'normal',
    lineHeight: 1.4,
    letterSpacing: 0.5,
    category: 'body'
  },
  
  // Special
  {
    name: 'Overline',
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 1.3,
    letterSpacing: 1.5,
    category: 'special'
  },
  {
    name: 'Button',
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 1,
    letterSpacing: 0.5,
    category: 'special'
  },
  {
    name: 'Quote',
    fontSize: 20,
    fontWeight: '500',
    lineHeight: 1.6,
    letterSpacing: 0,
    category: 'special'
  },
];

interface TextStylePresetsProps {
  onSelect: (style: TextStyle) => void;
  currentStyle?: {
    fontSize?: number;
    fontWeight?: string;
    lineHeight?: number;
    letterSpacing?: number;
  };
}

export function TextStylePresets({ onSelect, currentStyle }: TextStylePresetsProps) {
  const categories = {
    display: 'Display',
    heading: 'Headings',
    body: 'Body Text',
    special: 'Special'
  };

  return (
    <div className="space-y-4">
      {Object.entries(categories).map(([key, label]) => {
        const styles = textStylePresets.filter(s => s.category === key);
        
        return (
          <div key={key}>
            <h3 className="text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wide">
              {label}
            </h3>
            <div className="space-y-1">
              {styles.map((style) => {
                const isActive = 
                  currentStyle?.fontSize === style.fontSize &&
                  currentStyle?.fontWeight === style.fontWeight;
                
                return (
                  <button
                    key={style.name}
                    onClick={() => onSelect(style)}
                    className={`w-full p-3 rounded-lg border-2 transition-all text-left hover:shadow-md ${
                      isActive
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                    style={{
                      fontSize: Math.min(style.fontSize, 24),
                      fontWeight: style.fontWeight,
                      lineHeight: style.lineHeight,
                      letterSpacing: style.letterSpacing * 0.5
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-slate-900">{style.name}</span>
                      <span className="text-xs text-slate-500">
                        {style.fontSize}px
                      </span>
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
