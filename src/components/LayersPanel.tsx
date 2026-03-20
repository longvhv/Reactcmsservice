import { useState, useRef, useEffect } from 'react';
import {
  Eye, EyeOff, Lock, Unlock, Trash2, Copy, ChevronDown, ChevronRight,
  GripVertical, Type, Square, Circle, Image as ImageIcon, BarChart3,
  Minus, Group, Edit3, Star, Triangle, Hexagon, ArrowRight
} from 'lucide-react';

interface InfographicElement {
  id: string;
  type: 'text' | 'shape' | 'chart' | 'image' | 'icon' | 'line' | 'custom-shape';
  name?: string;
  locked: boolean;
  visible: boolean;
  zIndex: number;
  groupId?: string;
  [key: string]: any;
}

interface LayersPanelProps {
  elements: InfographicElement[];
  selectedElementIds: string[];
  onSelectElements: (ids: string[]) => void;
  onUpdateElement: (id: string, updates: Partial<InfographicElement>) => void;
  onReorderElements: (draggedId: string, targetId: string, position: 'before' | 'after') => void;
  onDeleteElements: (ids: string[]) => void;
  onDuplicateElements: (ids: string[]) => void;
  onGroupElements?: () => void;
  onUngroupElements?: () => void;
}

const getElementIcon = (element: InfographicElement) => {
  switch (element.type) {
    case 'text': return Type;
    case 'shape': 
      if (element.shapeType === 'circle') return Circle;
      if (element.shapeType === 'star') return Star;
      if (element.shapeType === 'triangle') return Triangle;
      if (element.shapeType === 'hexagon') return Hexagon;
      return Square;
    case 'chart': return BarChart3;
    case 'image': return ImageIcon;
    case 'line': return Minus;
    case 'icon': return Star;
    default: return Square;
  }
};

const getElementDisplayName = (element: InfographicElement, index: number) => {
  if (element.name) return element.name;
  
  const typeNames = {
    text: 'Text',
    shape: element.shapeType || 'Shape',
    chart: element.chartType || 'Chart',
    image: 'Image',
    icon: element.iconName || 'Icon',
    line: 'Line',
    'custom-shape': 'Custom Shape'
  };
  
  return `${typeNames[element.type] || element.type} ${index + 1}`;
};

export function LayersPanel({
  elements,
  selectedElementIds,
  onSelectElements,
  onUpdateElement,
  onReorderElements,
  onDeleteElements,
  onDuplicateElements,
  onGroupElements,
  onUngroupElements
}: LayersPanelProps) {
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const [dragPosition, setDragPosition] = useState<'before' | 'after' | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());
  const editInputRef = useRef<HTMLInputElement>(null);
  
  // Focus input when editing starts
  useEffect(() => {
    if (editingId && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [editingId]);

  // Sort elements by zIndex (reversed for display - top layer first)
  const sortedElements = [...elements].sort((a, b) => b.zIndex - a.zIndex);

  // Group elements by groupId
  const groups = new Map<string, InfographicElement[]>();
  const ungroupedElements: InfographicElement[] = [];
  
  sortedElements.forEach(el => {
    if (el.groupId) {
      if (!groups.has(el.groupId)) {
        groups.set(el.groupId, []);
      }
      groups.get(el.groupId)!.push(el);
    } else {
      ungroupedElements.push(el);
    }
  });

  const handleDragStart = (e: React.DragEvent, elementId: string) => {
    e.stopPropagation();
    setDraggedId(elementId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, elementId: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (draggedId === elementId) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const midpoint = rect.top + rect.height / 2;
    const position = e.clientY < midpoint ? 'before' : 'after';
    
    setDragOverId(elementId);
    setDragPosition(position);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverId(null);
    setDragPosition(null);
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (draggedId && dragPosition) {
      onReorderElements(draggedId, targetId, dragPosition);
    }
    
    setDraggedId(null);
    setDragOverId(null);
    setDragPosition(null);
  };

  const handleElementClick = (e: React.MouseEvent, elementId: string) => {
    e.stopPropagation();
    
    if (e.ctrlKey || e.metaKey) {
      // Multi-select
      if (selectedElementIds.includes(elementId)) {
        onSelectElements(selectedElementIds.filter(id => id !== elementId));
      } else {
        onSelectElements([...selectedElementIds, elementId]);
      }
    } else if (e.shiftKey && selectedElementIds.length > 0) {
      // Range select
      const lastSelectedId = selectedElementIds[selectedElementIds.length - 1];
      const lastIndex = sortedElements.findIndex(el => el.id === lastSelectedId);
      const currentIndex = sortedElements.findIndex(el => el.id === elementId);
      
      const start = Math.min(lastIndex, currentIndex);
      const end = Math.max(lastIndex, currentIndex);
      const rangeIds = sortedElements.slice(start, end + 1).map(el => el.id);
      
      onSelectElements([...new Set([...selectedElementIds, ...rangeIds])]);
    } else {
      // Single select
      onSelectElements([elementId]);
    }
  };

  const startEditing = (e: React.MouseEvent, element: InfographicElement) => {
    e.stopPropagation();
    setEditingId(element.id);
    setEditingName(element.name || '');
  };

  const finishEditing = () => {
    if (editingId && editingName.trim()) {
      onUpdateElement(editingId, { name: editingName.trim() });
    }
    setEditingId(null);
    setEditingName('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      finishEditing();
    } else if (e.key === 'Escape') {
      setEditingId(null);
      setEditingName('');
    }
  };

  const toggleGroupCollapse = (groupId: string) => {
    const newCollapsed = new Set(collapsedGroups);
    if (newCollapsed.has(groupId)) {
      newCollapsed.delete(groupId);
    } else {
      newCollapsed.add(groupId);
    }
    setCollapsedGroups(newCollapsed);
  };

  const renderElement = (element: InfographicElement, index: number, isGroupMember = false) => {
    const Icon = getElementIcon(element);
    const isSelected = selectedElementIds.includes(element.id);
    const isDragging = draggedId === element.id;
    const isDragOver = dragOverId === element.id;
    const isEditing = editingId === element.id;
    
    return (
      <div
        key={element.id}
        draggable={!element.locked}
        onDragStart={(e) => !element.locked && handleDragStart(e, element.id)}
        onDragOver={(e) => handleDragOver(e, element.id)}
        onDragLeave={handleDragLeave}
        onDrop={(e) => handleDrop(e, element.id)}
        onClick={(e) => handleElementClick(e, element.id)}
        className={`
          group relative flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer
          transition-all duration-150
          ${isGroupMember ? 'ml-6' : ''}
          ${isSelected ? 'bg-blue-100 dark:bg-blue-900/30' : 'hover:bg-muted/50'}
          ${isDragging ? 'opacity-40' : ''}
          ${element.locked ? 'opacity-60' : ''}
        `}
      >
        {/* Drag indicator */}
        {isDragOver && dragPosition === 'before' && (
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-blue-500" />
        )}
        {isDragOver && dragPosition === 'after' && (
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />
        )}

        {/* Drag handle */}
        {!element.locked && (
          <GripVertical className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
        )}

        {/* Icon */}
        <Icon className={`w-4 h-4 flex-shrink-0 ${isSelected ? 'text-blue-600' : 'text-muted-foreground'}`} />

        {/* Name */}
        {isEditing ? (
          <input
            ref={editInputRef}
            type="text"
            value={editingName}
            onChange={(e) => setEditingName(e.target.value)}
            onBlur={finishEditing}
            onKeyDown={handleKeyDown}
            className="flex-1 px-1 py-0.5 text-sm bg-background border border-blue-500 rounded outline-none"
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <span 
            className={`flex-1 text-sm truncate ${isSelected ? 'font-medium' : ''}`}
            onDoubleClick={(e) => startEditing(e, element)}
          >
            {getElementDisplayName(element, index)}
          </span>
        )}

        {/* Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onUpdateElement(element.id, { visible: !element.visible });
            }}
            className="p-1 hover:bg-background rounded"
            title={element.visible ? 'Hide' : 'Show'}
          >
            {element.visible ? (
              <Eye className="w-3.5 h-3.5 text-muted-foreground" />
            ) : (
              <EyeOff className="w-3.5 h-3.5 text-muted-foreground" />
            )}
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              onUpdateElement(element.id, { locked: !element.locked });
            }}
            className="p-1 hover:bg-background rounded"
            title={element.locked ? 'Unlock' : 'Lock'}
          >
            {element.locked ? (
              <Lock className="w-3.5 h-3.5 text-muted-foreground" />
            ) : (
              <Unlock className="w-3.5 h-3.5 text-muted-foreground" />
            )}
          </button>
        </div>

        {/* Status indicators (always visible) */}
        <div className="flex items-center gap-1">
          {!element.visible && (
            <EyeOff className="w-3 h-3 text-muted-foreground" />
          )}
          {element.locked && (
            <Lock className="w-3 h-3 text-muted-foreground" />
          )}
        </div>
      </div>
    );
  };

  const renderGroup = (groupId: string, groupElements: InfographicElement[]) => {
    const isCollapsed = collapsedGroups.has(groupId);
    const hasSelectedElement = groupElements.some(el => selectedElementIds.includes(el.id));
    
    return (
      <div key={groupId} className="mb-1">
        {/* Group header */}
        <div
          onClick={(e) => {
            e.stopPropagation();
            const groupElementIds = groupElements.map(el => el.id);
            onSelectElements(groupElementIds);
          }}
          className={`
            flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer
            transition-all duration-150
            ${hasSelectedElement ? 'bg-blue-100 dark:bg-blue-900/30' : 'hover:bg-muted/50'}
          `}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleGroupCollapse(groupId);
            }}
            className="p-0.5 hover:bg-background rounded"
          >
            {isCollapsed ? (
              <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
            )}
          </button>
          
          <Group className={`w-4 h-4 flex-shrink-0 ${hasSelectedElement ? 'text-blue-600' : 'text-muted-foreground'}`} />
          
          <span className={`flex-1 text-sm ${hasSelectedElement ? 'font-medium' : ''}`}>
            Group ({groupElements.length} items)
          </span>

          <button
            onClick={(e) => {
              e.stopPropagation();
              if (onUngroupElements) {
                // Select group elements first
                onSelectElements(groupElements.map(el => el.id));
                onUngroupElements();
              }
            }}
            className="p-1 hover:bg-background rounded opacity-0 group-hover:opacity-100 transition-opacity"
            title="Ungroup"
          >
            <Group className="w-3.5 h-3.5 text-muted-foreground rotate-180" />
          </button>
        </div>

        {/* Group members */}
        {!isCollapsed && (
          <div className="mt-1 space-y-0.5">
            {groupElements.map((el, idx) => renderElement(el, idx, true))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-card border-l border-border/60">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/60">
        <div className="flex items-center gap-2">
          <GripVertical className="w-4 h-4 text-muted-foreground" />
          <h3 className="font-medium">Layers</h3>
          <span className="text-xs text-muted-foreground">({elements.length})</span>
        </div>

        {selectedElementIds.length > 1 && (
          <button
            onClick={onGroupElements}
            className="p-1.5 hover:bg-muted rounded-lg transition-colors"
            title="Nhóm các lớp đã chọn (Ctrl+G)"
          >
            <Group className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Actions Bar */}
      {selectedElementIds.length > 0 && (
        <div className="flex items-center justify-between px-4 py-2 bg-muted/50 border-b border-border/60">
          <span className="text-xs text-muted-foreground">
            {selectedElementIds.length} selected
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onDuplicateElements(selectedElementIds)}
              className="p-1.5 hover:bg-background rounded transition-colors"
              title="Duplicate"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDeleteElements(selectedElementIds)}
              className="p-1.5 hover:bg-background text-red-600 rounded transition-colors"
              title="Delete"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Layers List */}
      <div className="flex-1 overflow-y-auto px-2 py-2 space-y-0.5">
        {elements.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4 text-muted-foreground">
            <GripVertical className="w-12 h-12 mb-2 opacity-30" />
            <p className="text-sm mb-1">Chưa có lớp nào</p>
            <p className="text-xs">Thêm phần tử để xem ở đây</p>
          </div>
        ) : (
          <>
            {/* Render groups */}
            {Array.from(groups.entries()).map(([groupId, groupElements]) =>
              renderGroup(groupId, groupElements)
            )}
            
            {/* Render ungrouped elements */}
            {ungroupedElements.map((el, idx) => renderElement(el, idx))}
          </>
        )}
      </div>

      {/* Footer Tips */}
      <div className="px-4 py-2 border-t border-border/60 text-xs text-muted-foreground space-y-1">
        <div className="flex items-center gap-2">
          <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px]">Click</kbd>
          <span>Chọn lớp</span>
        </div>
        <div className="flex items-center gap-2">
          <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px]">Ctrl+Click</kbd>
          <span>Multi-select</span>
        </div>
        <div className="flex items-center gap-2">
          <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px]">Double-click</kbd>
          <span>Đổi tên lớp</span>
        </div>
      </div>
    </div>
  );
}
