import { useState, useRef, useEffect, RefObject } from 'react';
import { Upload, Image as ImageIcon, Type, Square, Sparkles } from 'lucide-react';

// Drag & Drop Manager cho Canva-style experience
// Hỗ trợ drag elements từ panels vào canvas

interface DragItem {
  type: 'template' | 'background' | 'photo' | 'text-style' | 'sticker' | 'upload' | 'shape' | 'element';
  data: any;
  preview?: string;
  icon?: any;
  label?: string;
}

interface DragDropManagerProps {
  canvasRef: RefObject<HTMLDivElement>;
  onDrop: (item: DragItem, position: { x: number; y: number }) => void;
  disabled?: boolean;
}

export function DragDropManager({ canvasRef, onDrop, disabled }: DragDropManagerProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const [currentDragItem, setCurrentDragItem] = useState<DragItem | null>(null);
  const dragPreviewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && dragPreviewRef.current) {
        setDragPosition({ x: e.clientX, y: e.clientY });
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (isDragging && currentDragItem && canvasRef.current) {
        const canvasRect = canvasRef.current.getBoundingClientRect();
        
        // Check if drop is inside canvas
        if (
          e.clientX >= canvasRect.left &&
          e.clientX <= canvasRect.right &&
          e.clientY >= canvasRect.top &&
          e.clientY <= canvasRect.bottom
        ) {
          // Convert to canvas coordinates
          const x = e.clientX - canvasRect.left;
          const y = e.clientY - canvasRect.top;
          
          onDrop(currentDragItem, { x, y });
        }
      }
      
      setIsDragging(false);
      setCurrentDragItem(null);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, currentDragItem, canvasRef, onDrop]);

  // Public API để start drag từ bất kỳ component nào
  const startDrag = (item: DragItem) => {
    if (disabled) return;
    setCurrentDragItem(item);
    setIsDragging(true);
  };

  return (
    <>
      {/* Drag Preview */}
      {isDragging && currentDragItem && (
        <div
          ref={dragPreviewRef}
          className="fixed pointer-events-none z-[9999]"
          style={{
            left: dragPosition.x + 10,
            top: dragPosition.y + 10,
            transform: 'translate(-50%, -50%)',
          }}
        >
          <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl border-2 border-blue-500 p-3 flex items-center gap-3 min-w-[180px]">
            {currentDragItem.preview ? (
              <img
                src={currentDragItem.preview}
                alt="Preview"
                className="w-12 h-12 object-cover rounded-lg"
              />
            ) : currentDragItem.icon ? (
              <currentDragItem.icon className="w-12 h-12 text-blue-600" />
            ) : (
              <Sparkles className="w-12 h-12 text-blue-600" />
            )}
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-800">
                {currentDragItem.label || 'Dragging...'}
              </p>
              <p className="text-xs text-gray-500 capitalize">
                {currentDragItem.type.replace('-', ' ')}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Drop Zone Overlay */}
      {isDragging && (
        <div className="fixed inset-0 z-[9998] pointer-events-none">
          <div className="absolute inset-0 bg-blue-500/10" />
          {canvasRef.current && (
            <div
              className="absolute border-4 border-dashed border-blue-500 rounded-lg"
              style={{
                left: canvasRef.current.offsetLeft,
                top: canvasRef.current.offsetTop,
                width: canvasRef.current.offsetWidth,
                height: canvasRef.current.offsetHeight,
              }}
            >
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="bg-blue-600 text-white px-6 py-3 rounded-full shadow-2xl font-semibold flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  Drop here to add to canvas
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}

// Helper component: Draggable Item Wrapper
interface DraggableProps {
  item: DragItem;
  onDragStart: (item: DragItem) => void;
  children: React.ReactNode;
  className?: string;
}

export function Draggable({ item, onDragStart, children, className = '' }: DraggableProps) {
  return (
    <div
      draggable
      onDragStart={(e) => {
        e.preventDefault();
        onDragStart(item);
      }}
      onMouseDown={() => {
        // Alternative: start drag on mouse down for smoother UX
        onDragStart(item);
      }}
      className={`cursor-move hover:scale-105 transition-transform ${className}`}
      title="Kéo vào canvas"
    >
      {children}
    </div>
  );
}

// Helper hook: useDragDrop
export function useDragDrop(canvasRef: RefObject<HTMLDivElement>) {
  const [dragManager, setDragManager] = useState<{
    startDrag: (item: DragItem) => void;
  } | null>(null);

  const handleDrop = (item: DragItem, position: { x: number; y: number }) => {
    // This will be overridden by actual implementation
    console.log('Drop:', item, 'at', position);
  };

  return {
    DragDropComponent: (
      <DragDropManager
        canvasRef={canvasRef}
        onDrop={handleDrop}
      />
    ),
    startDrag: (item: DragItem) => {
      if (dragManager) {
        dragManager.startDrag(item);
      }
    },
    registerDragManager: (manager: any) => setDragManager(manager),
  };
}

// Export types
export type { DragItem, DragDropManagerProps };
