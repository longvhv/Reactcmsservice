import { Move, Maximize2, RotateCw, Lock, Unlock } from 'lucide-react';

interface TransformPanelProps {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  locked: boolean;
  onUpdate: (updates: {
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    rotation?: number;
    locked?: boolean;
  }) => void;
}

export function TransformPanel({
  x,
  y,
  width,
  height,
  rotation,
  locked,
  onUpdate
}: TransformPanelProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-700">Transform</h3>
        <button
          onClick={() => onUpdate({ locked: !locked })}
          className={`p-1.5 rounded transition-colors ${
            locked
              ? 'bg-red-100 text-red-700 hover:bg-red-200'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
          title={locked ? 'Mở khóa' : 'Khóa'}
        >
          {locked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
        </button>
      </div>

      {/* Position */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Move className="w-4 h-4 text-slate-600" />
          <label className="text-xs font-medium text-slate-600">Vị trí</label>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs text-slate-500 mb-1 block">X</label>
            <input
              type="number"
              value={Math.round(x)}
              onChange={(e) => onUpdate({ x: parseFloat(e.target.value) || 0 })}
              disabled={locked}
              className="w-full px-2 py-1.5 border border-slate-300 rounded text-sm disabled:bg-slate-100 disabled:text-slate-500"
            />
          </div>
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Y</label>
            <input
              type="number"
              value={Math.round(y)}
              onChange={(e) => onUpdate({ y: parseFloat(e.target.value) || 0 })}
              disabled={locked}
              className="w-full px-2 py-1.5 border border-slate-300 rounded text-sm disabled:bg-slate-100 disabled:text-slate-500"
            />
          </div>
        </div>
      </div>

      {/* Size */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Maximize2 className="w-4 h-4 text-slate-600" />
          <label className="text-xs font-medium text-slate-600">Kích thước</label>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs text-slate-500 mb-1 block">W</label>
            <input
              type="number"
              value={Math.round(width)}
              onChange={(e) => onUpdate({ width: parseFloat(e.target.value) || 20 })}
              disabled={locked}
              min="20"
              className="w-full px-2 py-1.5 border border-slate-300 rounded text-sm disabled:bg-slate-100 disabled:text-slate-500"
            />
          </div>
          <div>
            <label className="text-xs text-slate-500 mb-1 block">H</label>
            <input
              type="number"
              value={Math.round(height)}
              onChange={(e) => onUpdate({ height: parseFloat(e.target.value) || 20 })}
              disabled={locked}
              min="20"
              className="w-full px-2 py-1.5 border border-slate-300 rounded text-sm disabled:bg-slate-100 disabled:text-slate-500"
            />
          </div>
        </div>
      </div>

      {/* Rotation */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <RotateCw className="w-4 h-4 text-slate-600" />
          <label className="text-xs font-medium text-slate-600">
            Xoay: {rotation}°
          </label>
        </div>
        <div className="flex gap-2">
          <input
            type="range"
            min="0"
            max="360"
            value={rotation}
            onChange={(e) => onUpdate({ rotation: parseInt(e.target.value) })}
            disabled={locked}
            className="flex-1"
          />
          <input
            type="number"
            value={rotation}
            onChange={(e) => onUpdate({ rotation: parseFloat(e.target.value) || 0 })}
            disabled={locked}
            className="w-16 px-2 py-1 border border-slate-300 rounded text-sm disabled:bg-slate-100"
          />
        </div>
        <div className="flex gap-1 mt-2">
          <button
            onClick={() => onUpdate({ rotation: 0 })}
            disabled={locked}
            className="flex-1 px-2 py-1 text-xs bg-slate-100 hover:bg-slate-200 rounded disabled:opacity-50"
          >
            0°
          </button>
          <button
            onClick={() => onUpdate({ rotation: 90 })}
            disabled={locked}
            className="flex-1 px-2 py-1 text-xs bg-slate-100 hover:bg-slate-200 rounded disabled:opacity-50"
          >
            90°
          </button>
          <button
            onClick={() => onUpdate({ rotation: 180 })}
            disabled={locked}
            className="flex-1 px-2 py-1 text-xs bg-slate-100 hover:bg-slate-200 rounded disabled:opacity-50"
          >
            180°
          </button>
          <button
            onClick={() => onUpdate({ rotation: 270 })}
            disabled={locked}
            className="flex-1 px-2 py-1 text-xs bg-slate-100 hover:bg-slate-200 rounded disabled:opacity-50"
          >
            270°
          </button>
        </div>
      </div>
    </div>
  );
}
