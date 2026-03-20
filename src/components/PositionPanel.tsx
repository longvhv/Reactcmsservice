import { useState } from 'react';
import {
  AlignLeft, AlignCenter, AlignRight, AlignHorizontalJustifyCenter,
  AlignVerticalJustifyCenter, AlignHorizontalSpaceAround, AlignVerticalSpaceAround,
  AlignHorizontalJustifyStart, AlignHorizontalJustifyEnd,
  AlignVerticalJustifyStart, AlignVerticalJustifyEnd,
  Move, Maximize2, Minimize2, RotateCw, FlipHorizontal, FlipVertical,
  ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Lock, Unlock, Eye, EyeOff,
  Layers, Copy, Trash2, Group, Ungroup, X, Info, Grid
} from 'lucide-react';

// Position Panel - Advanced alignment & positioning tools
// Canva-style position controls with visual feedback

interface PositionPanelProps {
  selectedElements: any[];
  onUpdatePosition: (elementIds: string[], updates: any) => void;
  onAlign: (type: string) => void;
  onDistribute: (type: string) => void;
  onFlip: (direction: 'horizontal' | 'vertical') => void;
  onRotate: (angle: number) => void;
  onLock: (lock: boolean) => void;
  onVisible: (visible: boolean) => void;
  onGroup: () => void;
  onUngroup: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  canvasWidth?: number;
  canvasHeight?: number;
  showPanel?: boolean;
  onClose?: () => void;
}

interface Position {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
}

export function PositionPanel({
  selectedElements,
  onUpdatePosition,
  onAlign,
  onDistribute,
  onFlip,
  onRotate,
  onLock,
  onVisible,
  onGroup,
  onUngroup,
  onDuplicate,
  onDelete,
  canvasWidth = 1920,
  canvasHeight = 1080,
  showPanel = true,
  onClose,
}: PositionPanelProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [lockAspectRatio, setLockAspectRatio] = useState(false);

  const selectedElement = selectedElements[0];
  const multipleSelected = selectedElements.length > 1;
  const hasSelection = selectedElements.length > 0;

  const position: Position = hasSelection ? {
    x: selectedElement?.x || 0,
    y: selectedElement?.y || 0,
    width: selectedElement?.width || 100,
    height: selectedElement?.height || 100,
    rotation: selectedElement?.rotation || 0,
  } : { x: 0, y: 0, width: 0, height: 0, rotation: 0 };

  const aspectRatio = position.width / position.height;

  const updateValue = (key: keyof Position, value: number) => {
    if (!hasSelection) return;

    const updates: any = { [key]: value };

    // Handle aspect ratio locking for width/height
    if (lockAspectRatio && (key === 'width' || key === 'height')) {
      if (key === 'width') {
        updates.height = Math.round(value / aspectRatio);
      } else {
        updates.width = Math.round(value * aspectRatio);
      }
    }

    const elementIds = selectedElements.map(el => el.id);
    onUpdatePosition(elementIds, updates);
  };

  const alignmentButtons = [
    { icon: AlignLeft, label: 'Căn trái', action: 'left', group: 'horizontal' },
    { icon: AlignCenter, label: 'Căn giữa X', action: 'center-x', group: 'horizontal' },
    { icon: AlignRight, label: 'Căn phải', action: 'right', group: 'horizontal' },
    { icon: AlignHorizontalJustifyCenter, label: 'Căn giữa ngang', action: 'center-horizontal', group: 'horizontal' },
    { icon: AlignVerticalJustifyStart, label: 'Căn trên', action: 'top', group: 'vertical' },
    { icon: AlignVerticalJustifyCenter, label: 'Căn giữa Y', action: 'center-y', group: 'vertical' },
    { icon: AlignVerticalJustifyEnd, label: 'Căn dưới', action: 'bottom', group: 'vertical' },
    { icon: AlignHorizontalSpaceAround, label: 'Phân bố ngang', action: 'distribute-horizontal', group: 'distribute' },
    { icon: AlignVerticalSpaceAround, label: 'Phân bố dọc', action: 'distribute-vertical', group: 'distribute' },
  ];

  if (!showPanel) return null;

  return (
    <div className="w-96 bg-white border-l border-gray-200 flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-white">
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        )}
        <div className="flex items-center gap-3 mb-2">
          <Move className="w-7 h-7" />
          <h3 className="text-2xl font-bold">Vị trí</h3>
        </div>
        <p className="text-white/80 text-sm">
          {!hasSelection && 'Chọn phần tử để điều chỉnh'}
          {hasSelection && !multipleSelected && '1 phần tử đã chọn'}
          {multipleSelected && `${selectedElements.length} phần tử đã chọn`}
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {!hasSelection ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <Grid className="w-16 h-16 mb-4" />
            <p className="text-center">Chưa chọn phần tử nào</p>
            <p className="text-sm text-center">Nhấp vào phần tử để xem tùy chọn vị trí</p>
          </div>
        ) : (
          <>
            {/* Position Coordinates */}
            <div>
              <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                <Move className="w-5 h-5 text-purple-600" />
                Position
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-2">X</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={Math.round(position.x)}
                      onChange={(e) => updateValue('x', parseFloat(e.target.value))}
                      className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-sm"
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">px</span>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-2">Y</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={Math.round(position.y)}
                      onChange={(e) => updateValue('y', parseFloat(e.target.value))}
                      className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-sm"
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">px</span>
                  </div>
                </div>
              </div>

              {/* Quick Position Buttons */}
              <div className="mt-3 grid grid-cols-4 gap-2">
                <button
                  onClick={() => updateValue('x', 0)}
                  className="p-2 bg-gray-100 hover:bg-purple-100 rounded-lg transition-colors text-xs font-medium"
                  title="Di chuyển sang trái"
                >
                  <ArrowLeft className="w-4 h-4 mx-auto" />
                </button>
                <button
                  onClick={() => updateValue('x', (canvasWidth - position.width) / 2)}
                  className="p-2 bg-gray-100 hover:bg-purple-100 rounded-lg transition-colors text-xs font-medium"
                  title="Căn giữa ngang"
                >
                  <AlignCenter className="w-4 h-4 mx-auto" />
                </button>
                <button
                  onClick={() => updateValue('x', canvasWidth - position.width)}
                  className="p-2 bg-gray-100 hover:bg-purple-100 rounded-lg transition-colors text-xs font-medium"
                  title="Di chuyển sang phải"
                >
                  <ArrowRight className="w-4 h-4 mx-auto" />
                </button>
                <button
                  onClick={() => { updateValue('y', 0); }}
                  className="p-2 bg-gray-100 hover:bg-purple-100 rounded-lg transition-colors text-xs font-medium"
                  title="Di chuyển lên trên"
                >
                  <ArrowUp className="w-4 h-4 mx-auto" />
                </button>
              </div>
            </div>

            {/* Size */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-bold text-gray-800 flex items-center gap-2">
                  <Maximize2 className="w-5 h-5 text-purple-600" />
                  Size
                </h4>
                <button
                  onClick={() => setLockAspectRatio(!lockAspectRatio)}
                  className={`p-2 rounded-lg transition-colors ${
                    lockAspectRatio ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-600'
                  }`}
                  title={lockAspectRatio ? 'Mở khóa tỷ lệ' : 'Khóa tỷ lệ'}
                >
                  {lockAspectRatio ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-2">Chiều rộng</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={Math.round(position.width)}
                      onChange={(e) => updateValue('width', parseFloat(e.target.value))}
                      className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-sm"
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">px</span>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-2">Chiều cao</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={Math.round(position.height)}
                      onChange={(e) => updateValue('height', parseFloat(e.target.value))}
                      className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-sm"
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">px</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Rotation */}
            <div>
              <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                <RotateCw className="w-5 h-5 text-purple-600" />
                Rotation
              </h4>
              <div className="space-y-3">
                <div className="relative">
                  <input
                    type="range"
                    min="0"
                    max="360"
                    value={position.rotation}
                    onChange={(e) => updateValue('rotation', parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>0°</span>
                    <span className="font-semibold text-purple-600">{Math.round(position.rotation)}°</span>
                    <span>360°</span>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[0, 90, 180, 270].map((angle) => (
                    <button
                      key={angle}
                      onClick={() => updateValue('rotation', angle)}
                      className="px-3 py-2 bg-gray-100 hover:bg-purple-100 rounded-lg transition-colors text-sm font-medium"
                    >
                      {angle}°
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Alignment Tools */}
            <div>
              <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                <AlignCenter className="w-5 h-5 text-purple-600" />
                Alignment
              </h4>
              
              {/* Horizontal Alignment */}
              <div className="mb-3">
                <p className="text-xs font-semibold text-gray-600 mb-2">Ngang</p>
                <div className="grid grid-cols-4 gap-2">
                  {alignmentButtons.filter(b => b.group === 'horizontal').map((button) => {
                    const Icon = button.icon;
                    return (
                      <button
                        key={button.action}
                        onClick={() => onAlign(button.action)}
                        className="p-3 bg-gray-100 hover:bg-purple-100 rounded-lg transition-all hover:scale-105"
                        title={button.label}
                      >
                        <Icon className="w-5 h-5 mx-auto text-gray-700" />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Vertical Alignment */}
              <div className="mb-3">
                <p className="text-xs font-semibold text-gray-600 mb-2">Dọc</p>
                <div className="grid grid-cols-3 gap-2">
                  {alignmentButtons.filter(b => b.group === 'vertical').map((button) => {
                    const Icon = button.icon;
                    return (
                      <button
                        key={button.action}
                        onClick={() => onAlign(button.action)}
                        className="p-3 bg-gray-100 hover:bg-purple-100 rounded-lg transition-all hover:scale-105"
                        title={button.label}
                      >
                        <Icon className="w-5 h-5 mx-auto text-gray-700" />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Distribute */}
              {multipleSelected && (
                <div>
                  <p className="text-xs font-semibold text-gray-600 mb-2">Phân bố</p>
                  <div className="grid grid-cols-2 gap-2">
                    {alignmentButtons.filter(b => b.group === 'distribute').map((button) => {
                      const Icon = button.icon;
                      return (
                        <button
                          key={button.action}
                          onClick={() => onDistribute(button.action)}
                          className="flex items-center gap-2 p-3 bg-gray-100 hover:bg-purple-100 rounded-lg transition-all hover:scale-105 text-sm font-medium"
                          title={button.label}
                        >
                          <Icon className="w-5 h-5 text-gray-700" />
                          <span className="text-xs">{button.label.replace('Phân bố ', '')}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Transform */}
            <div>
              <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                <FlipHorizontal className="w-5 h-5 text-purple-600" />
                Transform
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => onFlip('horizontal')}
                  className="flex items-center gap-2 px-4 py-3 bg-gray-100 hover:bg-purple-100 rounded-lg transition-all hover:scale-105 font-medium"
                >
                  <FlipHorizontal className="w-5 h-5" />
                  <span className="text-sm">Lật ngang</span>
                </button>
                <button
                  onClick={() => onFlip('vertical')}
                  className="flex items-center gap-2 px-4 py-3 bg-gray-100 hover:bg-purple-100 rounded-lg transition-all hover:scale-105 font-medium"
                >
                  <FlipVertical className="w-5 h-5" />
                  <span className="text-sm">Lật dọc</span>
                </button>
              </div>
            </div>

            {/* Actions */}
            <div>
              <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                <Layers className="w-5 h-5 text-purple-600" />
                Hành động
              </h4>
              <div className="space-y-2">
                {multipleSelected && (
                  <>
                    <button
                      onClick={onGroup}
                      className="w-full flex items-center gap-3 px-4 py-3 bg-gray-100 hover:bg-purple-100 rounded-lg transition-colors font-medium"
                    >
                      <Group className="w-5 h-5" />
                      <span>Nhóm phần tử</span>
                    </button>
                    <button
                      onClick={onUngroup}
                      className="w-full flex items-center gap-3 px-4 py-3 bg-gray-100 hover:bg-purple-100 rounded-lg transition-colors font-medium"
                    >
                      <Ungroup className="w-5 h-5" />
                      <span>Bỏ nhóm</span>
                    </button>
                  </>
                )}
                
                <button
                  onClick={onDuplicate}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-gray-100 hover:bg-purple-100 rounded-lg transition-colors font-medium"
                >
                  <Copy className="w-5 h-5" />
                  <span>Nhân đôi</span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onLock(!selectedElement?.locked)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-colors font-medium ${
                      selectedElement?.locked
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    {selectedElement?.locked ? <Lock className="w-5 h-5" /> : <Unlock className="w-5 h-5" />}
                    <span className="text-sm">{selectedElement?.locked ? 'Đã khóa' : 'Khóa'}</span>
                  </button>
                  
                  <button
                    onClick={() => onVisible(!selectedElement?.visible)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-colors font-medium ${
                      !selectedElement?.visible
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    {selectedElement?.visible ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                    <span className="text-sm">{selectedElement?.visible ? 'Hiện' : 'Ẩn'}</span>
                  </button>
                </div>

                <button
                  onClick={onDelete}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors font-medium"
                >
                  <Trash2 className="w-5 h-5" />
                  <span>Xóa</span>
                </button>
              </div>
            </div>

            {/* Info */}
            <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-purple-900">
                  <p className="font-semibold mb-1">Mẹo nhanh</p>
                  <ul className="space-y-1 text-purple-800">
                    <li>• Dùng phím mũi tên để di chuyển</li>
                    <li>• Giữ Shift để di chuyển 10px</li>
                    <li>• Cmd/Ctrl+D để nhân đôi</li>
                  </ul>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// Export types
export type { PositionPanelProps, Position };