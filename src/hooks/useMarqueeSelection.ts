import { useState, useCallback, useRef, useEffect } from 'react';

interface Position {
  x: number;
  y: number;
}

interface SelectionBox {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

interface UseMarqueeSelectionOptions {
  containerRef: React.RefObject<HTMLElement>;
  itemSelector: string;
  onSelectionChange: (selectedIds: Set<string>) => void;
  isEnabled?: boolean;
}

export const useMarqueeSelection = ({
  containerRef,
  itemSelector,
  onSelectionChange,
  isEnabled = true,
}: UseMarqueeSelectionOptions) => {
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionBox, setSelectionBox] = useState<SelectionBox | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const startPosition = useRef<Position | null>(null);
  const initialSelectedIds = useRef<Set<string>>(new Set());
  const isCtrlPressed = useRef(false);

  // Get normalized selection box coordinates
  const getNormalizedBox = useCallback((box: SelectionBox) => {
    return {
      left: Math.min(box.startX, box.endX),
      top: Math.min(box.startY, box.endY),
      right: Math.max(box.startX, box.endX),
      bottom: Math.max(box.startY, box.endY),
    };
  }, []);

  // Check if element intersects with selection box
  const isIntersecting = useCallback((element: Element, box: SelectionBox) => {
    const rect = element.getBoundingClientRect();
    const containerRect = containerRef.current?.getBoundingClientRect();
    
    if (!containerRect) return false;

    // Adjust element position relative to container
    const elementBox = {
      left: rect.left - containerRect.left,
      top: rect.top - containerRect.top,
      right: rect.right - containerRect.left,
      bottom: rect.bottom - containerRect.top,
    };

    const selectionRect = getNormalizedBox(box);

    return !(
      elementBox.right < selectionRect.left ||
      elementBox.left > selectionRect.right ||
      elementBox.bottom < selectionRect.top ||
      elementBox.top > selectionRect.bottom
    );
  }, [containerRef, getNormalizedBox]);

  // Get all items within selection box
  const getSelectedItems = useCallback((box: SelectionBox) => {
    if (!containerRef.current) return new Set<string>();

    const items = containerRef.current.querySelectorAll(itemSelector);
    const selected = new Set<string>();

    items.forEach((item) => {
      if (isIntersecting(item, box)) {
        const id = item.getAttribute('data-item-id');
        if (id) selected.add(id);
      }
    });

    return selected;
  }, [containerRef, itemSelector, isIntersecting]);

  // Handle mouse down
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!isEnabled || !containerRef.current) return;

    // Check if clicking on an item or its children
    const target = e.target as HTMLElement;
    const clickedItem = target.closest(itemSelector);
    if (clickedItem) return;

    // Check if Ctrl/Cmd is pressed
    isCtrlPressed.current = e.ctrlKey || e.metaKey;
    
    // Store initial selection if Ctrl is pressed
    if (isCtrlPressed.current) {
      initialSelectedIds.current = new Set(selectedIds);
    } else {
      initialSelectedIds.current = new Set();
    }

    const containerRect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - containerRect.left;
    const y = e.clientY - containerRect.top;

    startPosition.current = { x, y };
    setIsSelecting(true);
    setSelectionBox({
      startX: x,
      startY: y,
      endX: x,
      endY: y,
    });

    e.preventDefault();
  }, [isEnabled, containerRef, itemSelector, selectedIds]);

  // Handle mouse move
  useEffect(() => {
    if (!isSelecting || !startPosition.current || !containerRef.current) return;

    const handleMouseMove = (e: MouseEvent) => {
      const containerRect = containerRef.current?.getBoundingClientRect();
      if (!containerRect || !startPosition.current) return;

      const x = e.clientX - containerRect.left;
      const y = e.clientY - containerRect.top;

      const newBox = {
        startX: startPosition.current.x,
        startY: startPosition.current.y,
        endX: x,
        endY: y,
      };

      setSelectionBox(newBox);

      // Get items in selection
      const selectedInBox = getSelectedItems(newBox);
      
      // Merge with initial selection if Ctrl is pressed
      let newSelected = new Set(selectedInBox);
      if (isCtrlPressed.current) {
        initialSelectedIds.current.forEach(id => newSelected.add(id));
      }

      setSelectedIds(newSelected);
      onSelectionChange(newSelected);
    };

    const handleMouseUp = () => {
      setIsSelecting(false);
      setSelectionBox(null);
      startPosition.current = null;
      isCtrlPressed.current = false;
      initialSelectedIds.current = new Set();
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isSelecting, containerRef, getSelectedItems, onSelectionChange]);

  // Render selection box
  const renderSelectionBox = useCallback(() => {
    if (!selectionBox || !isSelecting) return null;

    const normalized = getNormalizedBox(selectionBox);
    const width = normalized.right - normalized.left;
    const height = normalized.bottom - normalized.top;

    return (
      <div
        className="absolute pointer-events-none z-50"
        style={{
          left: `${normalized.left}px`,
          top: `${normalized.top}px`,
          width: `${width}px`,
          height: `${height}px`,
          border: '2px solid #3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          borderRadius: '4px',
        }}
      />
    );
  }, [selectionBox, isSelecting, getNormalizedBox]);

  // Reset selection
  const resetSelection = useCallback(() => {
    setSelectedIds(new Set());
    onSelectionChange(new Set());
  }, [onSelectionChange]);

  // Update selection from outside
  const updateSelection = useCallback((newSelection: Set<string>) => {
    setSelectedIds(newSelection);
  }, []);

  return {
    isSelecting,
    selectedIds,
    handleMouseDown,
    renderSelectionBox,
    resetSelection,
    updateSelection,
  };
};
