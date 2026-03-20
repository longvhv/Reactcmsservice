import { useState, useRef } from 'react';
import { 
  Download, Upload, Sparkles, Move, Image, Type, Square,
  Layers, Clock, Save, Settings, Palette, FileImage
} from 'lucide-react';

// Demo component showing how to integrate all 5 new Canva-style panels
// Complete working example with state management

import { DragDropManager, DragItem } from './DragDropManager';
import { StickersPanel, Sticker } from './StickersPanel';
import { UploadPanel, UploadedFile } from './UploadPanel';
import { ExportOptionsPanel, ExportOptions } from './ExportOptionsPanel';
import { PositionPanel } from './PositionPanel';

// Import existing panels
import { CanvaTemplatesPanel } from './CanvaTemplatesPanel';
import { BackgroundsPanel } from './BackgroundsPanel';
import { ColorPalettesPanel } from './ColorPalettesPanel';
import { TextStylesPanel } from './TextStylesPanel';
import { PhotosPanel } from './PhotosPanel';
import { LayersPanel } from './LayersPanel';
import { HistoryPanel } from './HistoryPanel';

interface Element {
  id: string;
  type: 'text' | 'shape' | 'image' | 'sticker';
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  locked: boolean;
  visible: boolean;
  zIndex: number;
  content?: string;
  color?: string;
  imageUrl?: string;
  stickerData?: any;
}

export function CanvaAdvancedDemo() {
  // Canvas state
  const canvasRef = useRef<HTMLDivElement>(null);
  const [elements, setElements] = useState<Element[]>([]);
  const [selectedElementIds, setSelectedElementIds] = useState<string[]>([]);
  const [canvasWidth, setCanvasWidth] = useState(1920);
  const [canvasHeight, setCanvasHeight] = useState(1080);
  const [zoom, setZoom] = useState(1);

  // Panel visibility states
  const [showStickersPanel, setShowStickersPanel] = useState(false);
  const [showUploadPanel, setShowUploadPanel] = useState(false);
  const [showExportPanel, setShowExportPanel] = useState(false);
  const [showTemplatesPanel, setShowTemplatesPanel] = useState(false);
  const [showBackgroundsPanel, setShowBackgroundsPanel] = useState(false);
  const [showColorsPanel, setShowColorsPanel] = useState(false);
  const [showTextStylesPanel, setShowTextStylesPanel] = useState(false);
  const [showPhotosPanel, setShowPhotosPanel] = useState(false);

  // Upload state
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  // History state (for undo/redo)
  const [history, setHistory] = useState<Element[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Get selected elements
  const selectedElements = elements.filter(el => selectedElementIds.includes(el.id));

  // ============= Drag & Drop Handlers =============
  
  const handleDrop = (item: DragItem, position: { x: number; y: number }) => {
    let newElement: Element | null = null;

    switch (item.type) {
      case 'sticker':
        newElement = createStickerElement(item.data, position);
        break;
      case 'photo':
      case 'upload':
        newElement = createImageElement(item.data, position);
        break;
      case 'text-style':
        newElement = createTextElement(item.data, position);
        break;
      case 'shape':
        newElement = createShapeElement(item.data, position);
        break;
      case 'background':
        applyBackground(item.data);
        return;
      default:
        console.log('Unknown drag item type:', item.type);
    }

    if (newElement) {
      addElement(newElement);
    }
  };

  const createStickerElement = (sticker: Sticker, position: { x: number; y: number }): Element => {
    return {
      id: `sticker-${Date.now()}-${Math.random()}`,
      type: 'sticker',
      x: position.x - 50,
      y: position.y - 50,
      width: 100,
      height: 100,
      rotation: 0,
      locked: false,
      visible: true,
      zIndex: elements.length,
      color: sticker.color || '#000000',
      stickerData: sticker,
    };
  };

  const createImageElement = (data: any, position: { x: number; y: number }): Element => {
    return {
      id: `image-${Date.now()}-${Math.random()}`,
      type: 'image',
      x: position.x - 100,
      y: position.y - 100,
      width: 200,
      height: 200,
      rotation: 0,
      locked: false,
      visible: true,
      zIndex: elements.length,
      imageUrl: data.url || data.thumbnail || data,
    };
  };

  const createTextElement = (style: any, position: { x: number; y: number }): Element => {
    return {
      id: `text-${Date.now()}-${Math.random()}`,
      type: 'text',
      x: position.x - 100,
      y: position.y - 25,
      width: 200,
      height: 50,
      rotation: 0,
      locked: false,
      visible: true,
      zIndex: elements.length,
      content: style?.name || 'Text',
      color: style?.color || '#000000',
    };
  };

  const createShapeElement = (shape: any, position: { x: number; y: number }): Element => {
    return {
      id: `shape-${Date.now()}-${Math.random()}`,
      type: 'shape',
      x: position.x - 50,
      y: position.y - 50,
      width: 100,
      height: 100,
      rotation: 0,
      locked: false,
      visible: true,
      zIndex: elements.length,
      color: '#3b82f6',
    };
  };

  const applyBackground = (background: any) => {
    // Apply background to canvas
    if (canvasRef.current) {
      canvasRef.current.style.background = background.value || background;
    }
  };

  const addElement = (element: Element) => {
    const newElements = [...elements, element];
    setElements(newElements);
    saveToHistory(newElements);
    setSelectedElementIds([element.id]);
  };

  // ============= Upload Handlers =============

  const handleUpload = async (files: File[]) => {
    const newFiles: UploadedFile[] = await Promise.all(
      files.map(async (file) => {
        const url = URL.createObjectURL(file);
        const category = file.type.startsWith('image/') ? 'image'
          : file.type.startsWith('video/') ? 'video'
          : file.type.startsWith('audio/') ? 'audio'
          : 'document';

        return {
          id: `file-${Date.now()}-${Math.random()}`,
          name: file.name,
          size: file.size,
          type: file.type,
          url,
          thumbnail: category === 'image' ? url : undefined,
          uploadedAt: new Date(),
          category,
        };
      })
    );

    setUploadedFiles([...uploadedFiles, ...newFiles]);
  };

  // ============= Export Handler =============

  const handleExport = async (options: ExportOptions) => {
    console.log('Exporting with options:', options);
    
    // In real implementation, use html2canvas or similar
    // to export the canvas to the selected format
    
    // Simulate export
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Create download
    const canvas = canvasRef.current;
    if (canvas) {
      // Export logic here
      console.log('Canvas exported successfully!');
    }
  };

  // ============= Position Panel Handlers =============

  const handleUpdatePosition = (elementIds: string[], updates: any) => {
    const newElements = elements.map(el =>
      elementIds.includes(el.id) ? { ...el, ...updates } : el
    );
    setElements(newElements);
    saveToHistory(newElements);
  };

  const handleAlign = (type: string) => {
    if (selectedElements.length === 0) return;

    const newElements = [...elements];
    const selectedIds = selectedElementIds;

    selectedIds.forEach(id => {
      const element = newElements.find(el => el.id === id);
      if (!element) return;

      switch (type) {
        case 'left':
          element.x = 0;
          break;
        case 'center-x':
        case 'center-horizontal':
          element.x = (canvasWidth - element.width) / 2;
          break;
        case 'right':
          element.x = canvasWidth - element.width;
          break;
        case 'top':
          element.y = 0;
          break;
        case 'center-y':
          element.y = (canvasHeight - element.height) / 2;
          break;
        case 'bottom':
          element.y = canvasHeight - element.height;
          break;
      }
    });

    setElements(newElements);
    saveToHistory(newElements);
  };

  const handleDistribute = (type: string) => {
    if (selectedElements.length < 2) return;

    const newElements = [...elements];
    const sorted = [...selectedElements].sort((a, b) => 
      type === 'distribute-horizontal' ? a.x - b.x : a.y - b.y
    );

    const totalSpace = type === 'distribute-horizontal'
      ? sorted[sorted.length - 1].x - sorted[0].x
      : sorted[sorted.length - 1].y - sorted[0].y;
    
    const spacing = totalSpace / (sorted.length - 1);

    sorted.forEach((el, i) => {
      const element = newElements.find(e => e.id === el.id);
      if (!element || i === 0 || i === sorted.length - 1) return;

      if (type === 'distribute-horizontal') {
        element.x = sorted[0].x + (spacing * i);
      } else {
        element.y = sorted[0].y + (spacing * i);
      }
    });

    setElements(newElements);
    saveToHistory(newElements);
  };

  const handleFlip = (direction: 'horizontal' | 'vertical') => {
    // Implement flip logic
    console.log('Flip:', direction);
  };

  const handleRotate = (angle: number) => {
    handleUpdatePosition(selectedElementIds, { rotation: angle });
  };

  const handleLock = (lock: boolean) => {
    handleUpdatePosition(selectedElementIds, { locked: lock });
  };

  const handleVisible = (visible: boolean) => {
    handleUpdatePosition(selectedElementIds, { visible });
  };

  const handleGroup = () => {
    console.log('Group elements');
    // Implement grouping logic
  };

  const handleUngroup = () => {
    console.log('Ungroup elements');
    // Implement ungrouping logic
  };

  const handleDuplicate = () => {
    const duplicated = selectedElements.map(el => ({
      ...el,
      id: `${el.type}-${Date.now()}-${Math.random()}`,
      x: el.x + 20,
      y: el.y + 20,
    }));
    
    const newElements = [...elements, ...duplicated];
    setElements(newElements);
    saveToHistory(newElements);
    setSelectedElementIds(duplicated.map(el => el.id));
  };

  const handleDelete = () => {
    const newElements = elements.filter(el => !selectedElementIds.includes(el.id));
    setElements(newElements);
    saveToHistory(newElements);
    setSelectedElementIds([]);
  };

  // ============= History Management =============

  const saveToHistory = (newElements: Element[]) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newElements);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setElements(history[historyIndex - 1]);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setElements(history[historyIndex + 1]);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Top Toolbar */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-gray-800">Canva-Style Builder</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={undo}
              disabled={historyIndex <= 0}
              className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50"
              title="Undo (Ctrl+Z)"
            >
              <Clock className="w-5 h-5" />
            </button>
            <button
              onClick={redo}
              disabled={historyIndex >= history.length - 1}
              className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50"
              title="Redo (Ctrl+Shift+Z)"
            >
              <Clock className="w-5 h-5 transform scale-x-[-1]" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="px-4 py-2 hover:bg-gray-100 rounded-lg flex items-center gap-2">
            <Save className="w-5 h-5" />
            <span>Save</span>
          </button>
          <button
            onClick={() => setShowExportPanel(true)}
            className="px-4 py-2 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg flex items-center gap-2 hover:shadow-lg"
          >
            <Download className="w-5 h-5" />
            <span>Export</span>
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-20 bg-white border-r border-gray-200 flex flex-col items-center py-4 gap-2">
          <button
            onClick={() => setShowTemplatesPanel(true)}
            className="w-14 h-14 flex flex-col items-center justify-center hover:bg-gray-100 rounded-lg text-xs"
          >
            <Layers className="w-6 h-6 mb-1" />
            <span>Templates</span>
          </button>
          <button
            onClick={() => setShowUploadPanel(true)}
            className="w-14 h-14 flex flex-col items-center justify-center hover:bg-purple-100 rounded-lg text-xs text-purple-600"
          >
            <Upload className="w-6 h-6 mb-1" />
            <span>Upload</span>
          </button>
          <button className="w-14 h-14 flex flex-col items-center justify-center hover:bg-gray-100 rounded-lg text-xs">
            <Type className="w-6 h-6 mb-1" />
            <span>Text</span>
          </button>
          <button className="w-14 h-14 flex flex-col items-center justify-center hover:bg-gray-100 rounded-lg text-xs">
            <Square className="w-6 h-6 mb-1" />
            <span>Shape</span>
          </button>
          <button
            onClick={() => setShowStickersPanel(true)}
            className="w-14 h-14 flex flex-col items-center justify-center hover:bg-pink-100 rounded-lg text-xs text-pink-600"
          >
            <Sparkles className="w-6 h-6 mb-1" />
            <span>Stickers</span>
          </button>
          <button
            onClick={() => setShowPhotosPanel(true)}
            className="w-14 h-14 flex flex-col items-center justify-center hover:bg-gray-100 rounded-lg text-xs"
          >
            <FileImage className="w-6 h-6 mb-1" />
            <span>Photos</span>
          </button>
          <button
            onClick={() => setShowBackgroundsPanel(true)}
            className="w-14 h-14 flex flex-col items-center justify-center hover:bg-gray-100 rounded-lg text-xs"
          >
            <Image className="w-6 h-6 mb-1" />
            <span>BG</span>
          </button>
          <button
            onClick={() => setShowColorsPanel(true)}
            className="w-14 h-14 flex flex-col items-center justify-center hover:bg-gray-100 rounded-lg text-xs"
          >
            <Palette className="w-6 h-6 mb-1" />
            <span>Colors</span>
          </button>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 bg-gray-200 overflow-auto p-8 flex items-center justify-center">
          <div
            ref={canvasRef}
            className="bg-white shadow-2xl relative"
            style={{
              width: canvasWidth * zoom,
              height: canvasHeight * zoom,
              transform: `scale(${zoom})`,
              transformOrigin: 'center',
            }}
          >
            {elements.map(element => (
              <div
                key={element.id}
                onClick={() => setSelectedElementIds([element.id])}
                className={`absolute cursor-move ${
                  selectedElementIds.includes(element.id) ? 'ring-2 ring-blue-500' : ''
                }`}
                style={{
                  left: element.x,
                  top: element.y,
                  width: element.width,
                  height: element.height,
                  transform: `rotate(${element.rotation}deg)`,
                  opacity: element.visible ? 1 : 0.3,
                  pointerEvents: element.locked ? 'none' : 'auto',
                  zIndex: element.zIndex,
                }}
              >
                {element.type === 'text' && (
                  <div style={{ color: element.color }}>{element.content}</div>
                )}
                {element.type === 'image' && (
                  <img src={element.imageUrl} alt="" className="w-full h-full object-cover" />
                )}
                {element.type === 'sticker' && element.stickerData && (
                  <div className="w-full h-full flex items-center justify-center">
                    {/* Render sticker icon */}
                    <span style={{ fontSize: '48px', color: element.color }}>
                      {element.stickerData.name}
                    </span>
                  </div>
                )}
                {element.type === 'shape' && (
                  <div
                    className="w-full h-full rounded"
                    style={{ backgroundColor: element.color }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel - Position Controls */}
        {selectedElements.length > 0 && (
          <PositionPanel
            selectedElements={selectedElements}
            onUpdatePosition={handleUpdatePosition}
            onAlign={handleAlign}
            onDistribute={handleDistribute}
            onFlip={handleFlip}
            onRotate={handleRotate}
            onLock={handleLock}
            onVisible={handleVisible}
            onGroup={handleGroup}
            onUngroup={handleUngroup}
            onDuplicate={handleDuplicate}
            onDelete={handleDelete}
            canvasWidth={canvasWidth}
            canvasHeight={canvasHeight}
            showPanel={true}
          />
        )}
      </div>

      {/* Drag & Drop Manager */}
      <DragDropManager canvasRef={canvasRef} onDrop={handleDrop} />

      {/* Panels */}
      {showStickersPanel && (
        <StickersPanel
          onSelectSticker={(sticker) => {
            // Auto-add to center of canvas
            handleDrop(
              { type: 'sticker', data: sticker, label: sticker.name },
              { x: canvasWidth / 2, y: canvasHeight / 2 }
            );
            setShowStickersPanel(false);
          }}
          onClose={() => setShowStickersPanel(false)}
        />
      )}

      {showUploadPanel && (
        <UploadPanel
          onSelectFile={(file) => {
            handleDrop(
              { type: 'upload', data: file, label: file.name },
              { x: canvasWidth / 2, y: canvasHeight / 2 }
            );
            setShowUploadPanel(false);
          }}
          onClose={() => setShowUploadPanel(false)}
          uploadedFiles={uploadedFiles}
          onUpload={handleUpload}
        />
      )}

      {showExportPanel && (
        <ExportOptionsPanel
          onExport={handleExport}
          onClose={() => setShowExportPanel(false)}
          canvasWidth={canvasWidth}
          canvasHeight={canvasHeight}
        />
      )}
    </div>
  );
}

export default CanvaAdvancedDemo;
