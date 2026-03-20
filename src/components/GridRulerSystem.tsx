import { useState, useEffect } from 'react';
import {
  Grid, Ruler, AlignLeft, AlignCenter, AlignRight, AlignTop,
  AlignBottom, AlignVerticalJustifyCenter, AlignHorizontalJustifyCenter,
  Lock, Unlock, Eye, EyeOff, Settings, Plus, Minus, X, Check,
  Move, Maximize2, Minimize2, RotateCw, Compass, Crosshair,
  Square, Circle, Triangle, Hexagon, Star, Diamond
} from 'lucide-react';

// Types
interface GridRulerSystemProps {
  canvasWidth: number;
  canvasHeight: number;
  zoom: number;
  elements: any[];
  onSnapToGrid?: (element: any, snappedPosition: { x: number; y: number }) => void;
  onAlignElements?: (elements: any[], alignment: AlignmentType) => void;
}

type AlignmentType =
  | 'left' | 'center-h' | 'right'
  | 'top' | 'center-v' | 'bottom'
  | 'distribute-h' | 'distribute-v';

interface GridSettings {
  enabled: boolean;
  size: number;
  subdivisions: number;
  color: string;
  opacity: number;
  snapToGrid: boolean;
  snapDistance: number;
}

interface RulerSettings {
  enabled: boolean;
  unit: 'px' | 'cm' | 'in' | 'mm';
  color: string;
  backgroundColor: string;
  fontSize: number;
}

interface GuideSettings {
  horizontal: Guide[];
  vertical: Guide[];
  color: string;
  snapToGuides: boolean;
  snapDistance: number;
}

interface Guide {
  id: string;
  position: number;
  locked: boolean;
  visible: boolean;
}

export function GridRulerSystem({
  canvasWidth,
  canvasHeight,
  zoom,
  elements,
  onSnapToGrid,
  onAlignElements,
}: GridRulerSystemProps) {
  const [gridSettings, setGridSettings] = useState<GridSettings>({
    enabled: true,
    size: 20,
    subdivisions: 4,
    color: '#3b82f6',
    opacity: 0.2,
    snapToGrid: true,
    snapDistance: 10,
  });

  const [rulerSettings, setRulerSettings] = useState<RulerSettings>({
    enabled: true,
    unit: 'px',
    color: '#6b7280',
    backgroundColor: '#f3f4f6',
    fontSize: 10,
  });

  const [guideSettings, setGuideSettings] = useState<GuideSettings>({
    horizontal: [],
    vertical: [],
    color: '#ef4444',
    snapToGuides: true,
    snapDistance: 10,
  });

  const [showSettings, setShowSettings] = useState(false);
  const [isDraggingGuide, setIsDraggingGuide] = useState(false);
  const [dragGuideType, setDragGuideType] = useState<'horizontal' | 'vertical' | null>(null);
  const [selectedElements, setSelectedElements] = useState<any[]>([]);

  // Unit conversion
  const convertUnit = (pixels: number, targetUnit: string): number => {
    const DPI = 96; // Standard screen DPI
    switch (targetUnit) {
      case 'cm':
        return pixels / (DPI / 2.54);
      case 'in':
        return pixels / DPI;
      case 'mm':
        return pixels / (DPI / 25.4);
      default:
        return pixels;
    }
  };

  const formatRulerLabel = (value: number): string => {
    const converted = convertUnit(value, rulerSettings.unit);
    return `${Math.round(converted)}${rulerSettings.unit}`;
  };

  // Grid rendering
  const renderGrid = () => {
    if (!gridSettings.enabled) return null;

    const lines: JSX.Element[] = [];
    const step = gridSettings.size * zoom;
    const subStep = step / gridSettings.subdivisions;

    // Vertical lines
    for (let x = 0; x <= canvasWidth * zoom; x += subStep) {
      const isMajor = x % step === 0;
      lines.push(
        <line
          key={`v-${x}`}
          x1={x}
          y1={0}
          x2={x}
          y2={canvasHeight * zoom}
          stroke={gridSettings.color}
          strokeWidth={isMajor ? 1 : 0.5}
          opacity={isMajor ? gridSettings.opacity : gridSettings.opacity * 0.5}
        />
      );
    }

    // Horizontal lines
    for (let y = 0; y <= canvasHeight * zoom; y += subStep) {
      const isMajor = y % step === 0;
      lines.push(
        <line
          key={`h-${y}`}
          x1={0}
          y1={y}
          x2={canvasWidth * zoom}
          y2={y}
          stroke={gridSettings.color}
          strokeWidth={isMajor ? 1 : 0.5}
          opacity={isMajor ? gridSettings.opacity : gridSettings.opacity * 0.5}
        />
      );
    }

    return (
      <svg
        className="absolute inset-0 pointer-events-none"
        width={canvasWidth * zoom}
        height={canvasHeight * zoom}
      >
        {lines}
      </svg>
    );
  };

  // Ruler rendering
  const renderRulers = () => {
    if (!rulerSettings.enabled) return null;

    const majorTick = 100;
    const minorTick = 50;
    const rulerSize = 30;

    return (
      <>
        {/* Horizontal Ruler */}
        <div
          className="absolute top-0 left-[30px] right-0 h-[30px] border-b border-gray-300"
          style={{ backgroundColor: rulerSettings.backgroundColor }}
        >
          <svg width={canvasWidth * zoom} height={rulerSize}>
            {Array.from({ length: Math.ceil((canvasWidth * zoom) / minorTick) + 1 }, (_, i) => {
              const x = i * minorTick;
              const isMajor = x % majorTick === 0;
              
              return (
                <g key={`h-tick-${i}`}>
                  <line
                    x1={x}
                    y1={isMajor ? 0 : 10}
                    x2={x}
                    y2={rulerSize}
                    stroke={rulerSettings.color}
                    strokeWidth={isMajor ? 1.5 : 1}
                  />
                  {isMajor && (
                    <text
                      x={x + 3}
                      y={12}
                      fill={rulerSettings.color}
                      fontSize={rulerSettings.fontSize}
                      fontFamily="Inter, sans-serif"
                    >
                      {formatRulerLabel(x / zoom)}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Vertical Ruler */}
        <div
          className="absolute top-[30px] left-0 bottom-0 w-[30px] border-r border-gray-300"
          style={{ backgroundColor: rulerSettings.backgroundColor }}
        >
          <svg width={rulerSize} height={canvasHeight * zoom}>
            {Array.from({ length: Math.ceil((canvasHeight * zoom) / minorTick) + 1 }, (_, i) => {
              const y = i * minorTick;
              const isMajor = y % majorTick === 0;
              
              return (
                <g key={`v-tick-${i}`}>
                  <line
                    x1={isMajor ? 0 : 10}
                    y1={y}
                    x2={rulerSize}
                    y2={y}
                    stroke={rulerSettings.color}
                    strokeWidth={isMajor ? 1.5 : 1}
                  />
                  {isMajor && (
                    <text
                      x={5}
                      y={y - 3}
                      fill={rulerSettings.color}
                      fontSize={rulerSettings.fontSize}
                      fontFamily="Inter, sans-serif"
                      transform={`rotate(-90 5 ${y - 3})`}
                    >
                      {formatRulerLabel(y / zoom)}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Corner Box */}
        <div
          className="absolute top-0 left-0 w-[30px] h-[30px] border-b border-r border-gray-300 flex items-center justify-center"
          style={{ backgroundColor: rulerSettings.backgroundColor }}
        >
          <Ruler className="w-4 h-4 text-gray-500" />
        </div>
      </>
    );
  };

  // Guides rendering
  const renderGuides = () => {
    return (
      <>
        {/* Horizontal Guides */}
        {guideSettings.horizontal.map((guide) => {
          if (!guide.visible) return null;
          return (
            <div
              key={guide.id}
              className={`absolute left-0 right-0 h-[1px] border-t-2 border-dashed ${
                guide.locked ? 'cursor-not-allowed' : 'cursor-ns-resize'
              }`}
              style={{
                top: guide.position * zoom,
                borderColor: guideSettings.color,
              }}
              draggable={!guide.locked}
            >
              <div className="absolute -top-2 left-2 px-2 py-0.5 bg-red-500 text-white text-xs rounded">
                {formatRulerLabel(guide.position)}
              </div>
            </div>
          );
        })}

        {/* Vertical Guides */}
        {guideSettings.vertical.map((guide) => {
          if (!guide.visible) return null;
          return (
            <div
              key={guide.id}
              className={`absolute top-0 bottom-0 w-[1px] border-l-2 border-dashed ${
                guide.locked ? 'cursor-not-allowed' : 'cursor-ew-resize'
              }`}
              style={{
                left: guide.position * zoom,
                borderColor: guideSettings.color,
              }}
              draggable={!guide.locked}
            >
              <div className="absolute top-2 -left-8 px-2 py-0.5 bg-red-500 text-white text-xs rounded -rotate-90 origin-left">
                {formatRulerLabel(guide.position)}
              </div>
            </div>
          );
        })}
      </>
    );
  };

  // Add guide
  const addHorizontalGuide = (position: number) => {
    const newGuide: Guide = {
      id: `h-${Date.now()}`,
      position,
      locked: false,
      visible: true,
    };
    setGuideSettings({
      ...guideSettings,
      horizontal: [...guideSettings.horizontal, newGuide],
    });
  };

  const addVerticalGuide = (position: number) => {
    const newGuide: Guide = {
      id: `v-${Date.now()}`,
      position,
      locked: false,
      visible: true,
    };
    setGuideSettings({
      ...guideSettings,
      vertical: [...guideSettings.vertical, newGuide],
    });
  };

  // Alignment functions
  const alignElements = (type: AlignmentType) => {
    if (selectedElements.length < 2) return;

    const bounds = selectedElements.map(el => ({
      element: el,
      left: el.x,
      right: el.x + el.width,
      top: el.y,
      bottom: el.y + el.height,
      centerX: el.x + el.width / 2,
      centerY: el.y + el.height / 2,
    }));

    switch (type) {
      case 'left':
        const minLeft = Math.min(...bounds.map(b => b.left));
        bounds.forEach(b => b.element.x = minLeft);
        break;

      case 'center-h':
        const avgCenterX = bounds.reduce((sum, b) => sum + b.centerX, 0) / bounds.length;
        bounds.forEach(b => b.element.x = avgCenterX - b.element.width / 2);
        break;

      case 'right':
        const maxRight = Math.max(...bounds.map(b => b.right));
        bounds.forEach(b => b.element.x = maxRight - b.element.width);
        break;

      case 'top':
        const minTop = Math.min(...bounds.map(b => b.top));
        bounds.forEach(b => b.element.y = minTop);
        break;

      case 'center-v':
        const avgCenterY = bounds.reduce((sum, b) => sum + b.centerY, 0) / bounds.length;
        bounds.forEach(b => b.element.y = avgCenterY - b.element.height / 2);
        break;

      case 'bottom':
        const maxBottom = Math.max(...bounds.map(b => b.bottom));
        bounds.forEach(b => b.element.y = maxBottom - b.element.height);
        break;

      case 'distribute-h':
        const sortedByX = [...bounds].sort((a, b) => a.left - a.left);
        const totalWidth = sortedByX[sortedByX.length - 1].right - sortedByX[0].left;
        const elementsWidth = sortedByX.reduce((sum, b) => sum + b.element.width, 0);
        const gap = (totalWidth - elementsWidth) / (sortedByX.length - 1);
        
        let currentX = sortedByX[0].left;
        sortedByX.forEach(b => {
          b.element.x = currentX;
          currentX += b.element.width + gap;
        });
        break;

      case 'distribute-v':
        const sortedByY = [...bounds].sort((a, b) => a.top - b.top);
        const totalHeight = sortedByY[sortedByY.length - 1].bottom - sortedByY[0].top;
        const elementsHeight = sortedByY.reduce((sum, b) => sum + b.element.height, 0);
        const vGap = (totalHeight - elementsHeight) / (sortedByY.length - 1);
        
        let currentY = sortedByY[0].top;
        sortedByY.forEach(b => {
          b.element.y = currentY;
          currentY += b.element.height + vGap;
        });
        break;
    }

    onAlignElements?.(selectedElements, type);
  };

  return (
    <>
      {/* Grid */}
      {renderGrid()}

      {/* Rulers */}
      {renderRulers()}

      {/* Guides */}
      {renderGuides()}

      {/* Floating Toolbar */}
      <div className="fixed top-20 left-4 bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-2 space-y-2 z-50 border border-gray-200 dark:border-gray-700">
        {/* Grid Toggle */}
        <button
          onClick={() => setGridSettings({ ...gridSettings, enabled: !gridSettings.enabled })}
          className={`w-full p-2 rounded-lg transition-colors ${
            gridSettings.enabled
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
          }`}
          title="Bật/tắt lưới (⌘)"
        >
          <Grid className="w-5 h-5 mx-auto" />
        </button>

        {/* Ruler Toggle */}
        <button
          onClick={() => setRulerSettings({ ...rulerSettings, enabled: !rulerSettings.enabled })}
          className={`w-full p-2 rounded-lg transition-colors ${
            rulerSettings.enabled
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
          }`}
          title="Bật/tắt thước (⌘R)"
        >
          <Ruler className="w-5 h-5 mx-auto" />
        </button>

        <div className="h-px bg-gray-200 dark:bg-gray-700" />

        {/* Alignment Tools */}
        <div className="grid grid-cols-3 gap-1">
          <button
            onClick={() => alignElements('left')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="Căn trái"
            disabled={selectedElements.length < 2}
          >
            <AlignLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => alignElements('center-h')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="Căn giữa ngang"
            disabled={selectedElements.length < 2}
          >
            <AlignHorizontalJustifyCenter className="w-4 h-4" />
          </button>
          <button
            onClick={() => alignElements('right')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="Căn phải"
            disabled={selectedElements.length < 2}
          >
            <AlignRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => alignElements('top')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="Căn trên"
            disabled={selectedElements.length < 2}
          >
            <AlignTop className="w-4 h-4" />
          </button>
          <button
            onClick={() => alignElements('center-v')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="Căn giữa dọc"
            disabled={selectedElements.length < 2}
          >
            <AlignVerticalJustifyCenter className="w-4 h-4" />
          </button>
          <button
            onClick={() => alignElements('bottom')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="Căn dưới"
            disabled={selectedElements.length < 2}
          >
            <AlignBottom className="w-4 h-4" />
          </button>
        </div>

        <div className="h-px bg-gray-200 dark:bg-gray-700" />

        {/* Distribution */}
        <button
          onClick={() => alignElements('distribute-h')}
          className="w-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-xs"
          title="Phân bố ngang"
          disabled={selectedElements.length < 3}
        >
          <AlignHorizontalJustifyCenter className="w-4 h-4 mx-auto" />
        </button>
        <button
          onClick={() => alignElements('distribute-v')}
          className="w-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-xs"
          title="Phân bố dọc"
          disabled={selectedElements.length < 3}
        >
          <AlignVerticalJustifyCenter className="w-4 h-4 mx-auto" />
        </button>

        <div className="h-px bg-gray-200 dark:bg-gray-700" />

        {/* Settings */}
        <button
          onClick={() => setShowSettings(true)}
          className="w-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          title="Cài đặt lưới & thước"
        >
          <Settings className="w-5 h-5 mx-auto" />
        </button>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Settings className="w-6 h-6" />
                  <h2 className="text-xl font-bold">Cài đặt lưới & thước</h2>
                </div>
                <button
                  onClick={() => setShowSettings(false)}
                  className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6 overflow-y-auto max-h-[60vh]">
              {/* Grid Settings */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Cài đặt lưới</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Bật lưới</label>
                    <button
                      onClick={() => setGridSettings({ ...gridSettings, enabled: !gridSettings.enabled })}
                      className={`w-12 h-6 rounded-full transition-colors ${
                        gridSettings.enabled ? 'bg-blue-500' : 'bg-gray-300'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 bg-white rounded-full transition-transform ${
                          gridSettings.enabled ? 'translate-x-6' : 'translate-x-0.5'
                        }`}
                      />
                    </button>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Kích thước lưới: {gridSettings.size}px
                    </label>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      value={gridSettings.size}
                      onChange={(e) => setGridSettings({ ...gridSettings, size: parseInt(e.target.value) })}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Chia nhỏ: {gridSettings.subdivisions}
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={gridSettings.subdivisions}
                      onChange={(e) => setGridSettings({ ...gridSettings, subdivisions: parseInt(e.target.value) })}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Độ mờ: {Math.round(gridSettings.opacity * 100)}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={gridSettings.opacity}
                      onChange={(e) => setGridSettings({ ...gridSettings, opacity: parseFloat(e.target.value) })}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Màu sắc</label>
                    <input
                      type="color"
                      value={gridSettings.color}
                      onChange={(e) => setGridSettings({ ...gridSettings, color: e.target.value })}
                      className="w-full h-10 rounded-lg cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Bám lưới</label>
                    <button
                      onClick={() => setGridSettings({ ...gridSettings, snapToGrid: !gridSettings.snapToGrid })}
                      className={`w-12 h-6 rounded-full transition-colors ${
                        gridSettings.snapToGrid ? 'bg-blue-500' : 'bg-gray-300'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 bg-white rounded-full transition-transform ${
                          gridSettings.snapToGrid ? 'translate-x-6' : 'translate-x-0.5'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Ruler Settings */}
              <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold mb-4">Cài đặt thước</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Hiện thước</label>
                    <button
                      onClick={() => setRulerSettings({ ...rulerSettings, enabled: !rulerSettings.enabled })}
                      className={`w-12 h-6 rounded-full transition-colors ${
                        rulerSettings.enabled ? 'bg-blue-500' : 'bg-gray-300'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 bg-white rounded-full transition-transform ${
                          rulerSettings.enabled ? 'translate-x-6' : 'translate-x-0.5'
                        }`}
                      />
                    </button>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Đơn vị</label>
                    <select
                      value={rulerSettings.unit}
                      onChange={(e) => setRulerSettings({ ...rulerSettings, unit: e.target.value as any })}
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="px">Điểm ảnh (px)</option>
                      <option value="cm">Xen-ti-mét (cm)</option>
                      <option value="in">Inch (in)</option>
                      <option value="mm">Mi-li-mét (mm)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Guide Settings */}
              <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold mb-4">Đường dẫn hướng</h3>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => addHorizontalGuide(canvasHeight / 2)}
                      className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                    >
                      Thêm đường ngang
                    </button>
                    <button
                      onClick={() => addVerticalGuide(canvasWidth / 2)}
                      className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                    >
                      Thêm đường dọc
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Bám đường dẫn hướng</label>
                    <button
                      onClick={() => setGuideSettings({ ...guideSettings, snapToGuides: !guideSettings.snapToGuides })}
                      className={`w-12 h-6 rounded-full transition-colors ${
                        guideSettings.snapToGuides ? 'bg-blue-500' : 'bg-gray-300'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 bg-white rounded-full transition-transform ${
                          guideSettings.snapToGuides ? 'translate-x-6' : 'translate-x-0.5'
                        }`}
                      />
                    </button>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Màu đường dẫn hướng</label>
                    <input
                      type="color"
                      value={guideSettings.color}
                      onChange={(e) => setGuideSettings({ ...guideSettings, color: e.target.value })}
                      className="w-full h-10 rounded-lg cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-2">
              <button
                onClick={() => setShowSettings(false)}
                className="px-6 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}