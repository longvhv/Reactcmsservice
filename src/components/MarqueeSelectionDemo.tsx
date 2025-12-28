import React, { useState, useRef } from 'react';
import { useMarqueeSelection } from '../hooks/useMarqueeSelection';
import { File, Image, Video, Folder, Check } from 'lucide-react';

interface DemoItem {
  id: string;
  name: string;
  type: 'file' | 'folder' | 'image' | 'video';
}

/**
 * Marquee Selection Demo Component
 * 
 * Component demo để test và showcase tính năng marquee selection.
 * Sử dụng để training users hoặc testing functionality.
 */
export const MarqueeSelectionDemo: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  // Sample data
  const items: DemoItem[] = Array.from({ length: 24 }, (_, i) => ({
    id: `item-${i + 1}`,
    name: `Item ${i + 1}`,
    type: ['file', 'folder', 'image', 'video'][Math.floor(Math.random() * 4)] as DemoItem['type'],
  }));

  // Setup marquee selection
  const marquee = useMarqueeSelection({
    containerRef,
    itemSelector: '[data-demo-id]',
    onSelectionChange: (newSelection) => {
      setSelectedItems(newSelection);
    },
    isEnabled: true,
  });

  const getIcon = (type: DemoItem['type']) => {
    switch (type) {
      case 'image':
        return <Image className="w-8 h-8 text-blue-500" />;
      case 'video':
        return <Video className="w-8 h-8 text-purple-500" />;
      case 'folder':
        return <Folder className="w-8 h-8 text-yellow-500" />;
      default:
        return <File className="w-8 h-8 text-gray-500" />;
    }
  };

  const toggleItem = (id: string) => {
    const newSelection = new Set(selectedItems);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedItems(newSelection);
    marquee.updateSelection(newSelection);
  };

  const clearSelection = () => {
    setSelectedItems(new Set());
    marquee.resetSelection();
  };

  return (
    <div className="p-8 space-y-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Marquee Selection Demo
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Kéo chuột trên vùng trống để chọn nhiều items. Giữ Ctrl/Cmd để thêm vào selection hiện tại.
          </p>

          {/* Instructions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
              <div className="font-semibold text-blue-900 dark:text-blue-300 mb-1">
                🖱️ Kéo Chuột
              </div>
              <p className="text-sm text-blue-700 dark:text-blue-400">
                Click và kéo trên vùng trống để tạo vùng chọn
              </p>
            </div>
            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
              <div className="font-semibold text-purple-900 dark:text-purple-300 mb-1">
                ⌨️ Ctrl/Cmd + Kéo
              </div>
              <p className="text-sm text-purple-700 dark:text-purple-400">
                Giữ Ctrl/Cmd để thêm vào selection hiện tại
              </p>
            </div>
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
              <div className="font-semibold text-green-900 dark:text-green-300 mb-1">
                ✅ Click Item
              </div>
              <p className="text-sm text-green-700 dark:text-green-400">
                Click vào checkbox để toggle từng item riêng lẻ
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4">
            <div className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <span className="text-sm text-gray-600 dark:text-gray-400">Selected: </span>
              <span className="font-bold text-gray-900 dark:text-gray-100">
                {selectedItems.size} / {items.length}
              </span>
            </div>
            {selectedItems.size > 0 && (
              <button
                onClick={clearSelection}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
              >
                Clear Selection
              </button>
            )}
          </div>
        </div>

        {/* Grid with Marquee Selection */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <div
            ref={containerRef}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 relative select-none min-h-[400px]"
            onMouseDown={marquee.handleMouseDown}
          >
            {marquee.renderSelectionBox()}
            {items.map((item) => {
              const isSelected = selectedItems.has(item.id);
              
              return (
                <div
                  key={item.id}
                  data-demo-id={item.id}
                  className={`
                    group relative bg-white dark:bg-gray-800 rounded-xl border-2 
                    transition-all cursor-pointer hover:shadow-lg
                    ${isSelected 
                      ? 'border-blue-500 shadow-lg shadow-blue-500/20' 
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  {/* Checkbox */}
                  <div className="absolute top-2 left-2 z-10">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleItem(item.id);
                      }}
                      className={`
                        w-5 h-5 rounded border-2 flex items-center justify-center 
                        transition-all
                        ${isSelected
                          ? 'bg-blue-600 border-blue-600'
                          : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 opacity-0 group-hover:opacity-100'
                        }
                      `}
                    >
                      {isSelected && <Check className="w-3 h-3 text-white" />}
                    </button>
                  </div>

                  {/* Icon */}
                  <div className="aspect-square flex items-center justify-center p-6 bg-gray-50 dark:bg-gray-900 rounded-t-xl">
                    {getIcon(item.type)}
                  </div>

                  {/* Info */}
                  <div className="p-3 border-t border-gray-200 dark:border-gray-700">
                    <p className="font-medium text-sm truncate">{item.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                      {item.type}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Items List */}
        {selectedItems.size > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mt-6">
            <h2 className="text-xl font-bold mb-4">Selected Items ({selectedItems.size})</h2>
            <div className="flex flex-wrap gap-2">
              {Array.from(selectedItems).map((id) => {
                const item = items.find(i => i.id === id);
                return (
                  <div
                    key={id}
                    className="px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-lg text-sm font-medium flex items-center gap-2"
                  >
                    {item?.name}
                    <button
                      onClick={() => toggleItem(id)}
                      className="hover:bg-blue-200 dark:hover:bg-blue-800 rounded p-0.5 transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Code Example */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mt-6">
          <h2 className="text-xl font-bold mb-4">Usage Example</h2>
          <pre className="bg-gray-900 text-gray-100 p-4 rounded-xl overflow-x-auto text-sm">
{`import { useMarqueeSelection } from '../hooks/useMarqueeSelection';

const MyComponent = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  const marquee = useMarqueeSelection({
    containerRef,
    itemSelector: '[data-item-id]',
    onSelectionChange: (newSelection) => {
      setSelectedItems(newSelection);
    },
    isEnabled: true,
  });

  return (
    <div 
      ref={containerRef}
      onMouseDown={marquee.handleMouseDown}
      className="relative select-none"
    >
      {marquee.renderSelectionBox()}
      {items.map(item => (
        <div key={item.id} data-item-id={item.id}>
          {/* item content */}
        </div>
      ))}
    </div>
  );
};`}
          </pre>
        </div>
      </div>
    </div>
  );
};
