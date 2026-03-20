import { useState, useEffect, useRef } from 'react';
import {
  Copy, Trash2, Lock, Unlock, Eye, EyeOff, Group, Ungroup,
  ArrowUp, ArrowDown, Layers, Edit3, RotateCw, FlipHorizontal,
  FlipVertical, Download, Duplicate, Maximize2, Crop, Palette,
  Type, Image as ImageIcon, Settings, Star, Link2, AlignCenter,
  AlignLeft, AlignRight, AlignVerticalJustifyCenter, AlignHorizontalJustifyCenter
} from 'lucide-react';

export interface ContextMenuItem {
  id: string;
  label: string;
  icon: React.ElementType;
  shortcut?: string;
  action: () => void;
  divider?: boolean;
  disabled?: boolean;
  submenu?: ContextMenuItem[];
  color?: 'default' | 'danger' | 'success' | 'primary';
}

interface ContextMenuProps {
  x: number;
  y: number;
  items: ContextMenuItem[];
  onClose: () => void;
  target?: any;
}

export function ContextMenu({ x, y, items, onClose, target }: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [submenuOpen, setSubmenuOpen] = useState<string | null>(null);
  const [menuPosition, setMenuPosition] = useState({ x, y });

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    // Adjust position if menu goes off screen
    if (menuRef.current) {
      const rect = menuRef.current.getBoundingClientRect();
      const newPos = { ...menuPosition };

      if (rect.right > window.innerWidth) {
        newPos.x = window.innerWidth - rect.width - 10;
      }
      if (rect.bottom > window.innerHeight) {
        newPos.y = window.innerHeight - rect.height - 10;
      }
      if (newPos.x !== menuPosition.x || newPos.y !== menuPosition.y) {
        setMenuPosition(newPos);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    document.addEventListener('contextmenu', (e) => e.preventDefault());

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('contextmenu', (e) => e.preventDefault());
    };
  }, [onClose, menuPosition]);

  const handleItemClick = (item: ContextMenuItem) => {
    if (item.disabled) return;
    
    if (item.submenu) {
      setSubmenuOpen(submenuOpen === item.id ? null : item.id);
    } else {
      item.action();
      onClose();
    }
  };

  const colorClasses = {
    default: 'hover:bg-gray-100',
    danger: 'hover:bg-red-50 text-red-600',
    success: 'hover:bg-green-50 text-green-600',
    primary: 'hover:bg-blue-50 text-blue-600',
  };

  return (
    <div
      ref={menuRef}
      className="fixed bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-[9999] min-w-[240px] animate-in fade-in zoom-in-95 duration-200"
      style={{
        left: menuPosition.x,
        top: menuPosition.y,
      }}
    >
      {items.map((item, index) => (
        <div key={item.id}>
          {item.divider ? (
            <div className="h-px bg-gray-200 my-2" />
          ) : (
            <div className="relative">
              <button
                onClick={() => handleItemClick(item)}
                disabled={item.disabled}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                  item.disabled
                    ? 'opacity-50 cursor-not-allowed'
                    : colorClasses[item.color || 'default']
                }`}
              >
                <item.icon className="w-4 h-4 flex-shrink-0" />
                <span className="flex-1 text-left font-medium">{item.label}</span>
                {item.shortcut && (
                  <span className="text-xs text-gray-400 font-mono">{item.shortcut}</span>
                )}
                {item.submenu && (
                  <span className="text-gray-400">›</span>
                )}
              </button>

              {/* Submenu */}
              {item.submenu && submenuOpen === item.id && (
                <div className="absolute left-full top-0 ml-2">
                  <div className="bg-white rounded-xl shadow-2xl border border-gray-200 py-2 min-w-[200px]">
                    {item.submenu.map(subItem => (
                      <button
                        key={subItem.id}
                        onClick={() => {
                          subItem.action();
                          onClose();
                        }}
                        disabled={subItem.disabled}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                          subItem.disabled
                            ? 'opacity-50 cursor-not-allowed'
                            : colorClasses[subItem.color || 'default']
                        }`}
                      >
                        <subItem.icon className="w-4 h-4 flex-shrink-0" />
                        <span className="flex-1 text-left font-medium">{subItem.label}</span>
                        {subItem.shortcut && (
                          <span className="text-xs text-gray-400 font-mono">{subItem.shortcut}</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// Hook for using context menu
export function useContextMenu() {
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    items: ContextMenuItem[];
    target?: any;
  } | null>(null);

  const showContextMenu = (
    e: React.MouseEvent,
    items: ContextMenuItem[],
    target?: any
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      items,
      target,
    });
  };

  const closeContextMenu = () => {
    setContextMenu(null);
  };

  return {
    contextMenu,
    showContextMenu,
    closeContextMenu,
  };
}

// Pre-built context menu configurations
export const getElementContextMenu = (
  element: any,
  handlers: {
    onCopy: () => void;
    onDuplicate: () => void;
    onDelete: () => void;
    onLock: () => void;
    onHide: () => void;
    onBringToFront: () => void;
    onSendToBack: () => void;
    onGroup?: () => void;
    onUngroup?: () => void;
    onEdit?: () => void;
    onFlipH?: () => void;
    onFlipV?: () => void;
    onRotate?: () => void;
  }
): ContextMenuItem[] => {
  return [
    {
      id: 'edit',
      label: 'Edit',
      icon: Edit3,
      shortcut: '⏎',
      action: handlers.onEdit || (() => {}),
      disabled: !handlers.onEdit,
    },
    { id: 'div-1', label: '', icon: Copy, action: () => {}, divider: true },
    {
      id: 'copy',
      label: 'Copy',
      icon: Copy,
      shortcut: '⌘C',
      action: handlers.onCopy,
    },
    {
      id: 'duplicate',
      label: 'Duplicate',
      icon: Duplicate,
      shortcut: '⌘D',
      action: handlers.onDuplicate,
    },
    { id: 'div-2', label: '', icon: Copy, action: () => {}, divider: true },
    {
      id: 'transform',
      label: 'Transform',
      icon: RotateCw,
      action: () => {},
      submenu: [
        {
          id: 'flip-h',
          label: 'Flip Horizontal',
          icon: FlipHorizontal,
          action: handlers.onFlipH || (() => {}),
          disabled: !handlers.onFlipH,
        },
        {
          id: 'flip-v',
          label: 'Flip Vertical',
          icon: FlipVertical,
          action: handlers.onFlipV || (() => {}),
          disabled: !handlers.onFlipV,
        },
        {
          id: 'rotate',
          label: 'Rotate 90°',
          icon: RotateCw,
          shortcut: '⌘R',
          action: handlers.onRotate || (() => {}),
          disabled: !handlers.onRotate,
        },
      ],
    },
    {
      id: 'arrange',
      label: 'Arrange',
      icon: Layers,
      action: () => {},
      submenu: [
        {
          id: 'bring-front',
          label: 'Bring to Front',
          icon: ArrowUp,
          shortcut: '⌘]',
          action: handlers.onBringToFront,
        },
        {
          id: 'send-back',
          label: 'Send to Back',
          icon: ArrowDown,
          shortcut: '⌘[',
          action: handlers.onSendToBack,
        },
      ],
    },
    { id: 'div-3', label: '', icon: Copy, action: () => {}, divider: true },
    {
      id: 'group',
      label: element.groupId ? 'Ungroup' : 'Group',
      icon: element.groupId ? Ungroup : Group,
      shortcut: '⌘G',
      action: element.groupId 
        ? (handlers.onUngroup || (() => {}))
        : (handlers.onGroup || (() => {})),
      disabled: element.groupId ? !handlers.onUngroup : !handlers.onGroup,
    },
    {
      id: 'lock',
      label: element.locked ? 'Unlock' : 'Lock',
      icon: element.locked ? Unlock : Lock,
      shortcut: '⌘L',
      action: handlers.onLock,
    },
    {
      id: 'hide',
      label: element.visible ? 'Hide' : 'Show',
      icon: element.visible ? EyeOff : Eye,
      shortcut: '⌘H',
      action: handlers.onHide,
    },
    { id: 'div-4', label: '', icon: Copy, action: () => {}, divider: true },
    {
      id: 'delete',
      label: 'Delete',
      icon: Trash2,
      shortcut: '⌫',
      action: handlers.onDelete,
      color: 'danger',
    },
  ];
};

export const getCanvasContextMenu = (
  handlers: {
    onPaste: () => void;
    onSelectAll: () => void;
    onAddText: () => void;
    onAddShape: () => void;
    onAddImage: () => void;
    onUndo?: () => void;
    onRedo?: () => void;
  }
): ContextMenuItem[] => {
  return [
    {
      id: 'paste',
      label: 'Paste',
      icon: Copy,
      shortcut: '⌘V',
      action: handlers.onPaste,
    },
    {
      id: 'select-all',
      label: 'Select All',
      icon: Maximize2,
      shortcut: '⌘A',
      action: handlers.onSelectAll,
    },
    { id: 'div-1', label: '', icon: Copy, action: () => {}, divider: true },
    {
      id: 'add-text',
      label: 'Add Text',
      icon: Type,
      shortcut: 'T',
      action: handlers.onAddText,
    },
    {
      id: 'add-shape',
      label: 'Add Shape',
      icon: Star,
      shortcut: 'S',
      action: handlers.onAddShape,
    },
    {
      id: 'add-image',
      label: 'Add Image',
      icon: ImageIcon,
      shortcut: 'I',
      action: handlers.onAddImage,
    },
    { id: 'div-2', label: '', icon: Copy, action: () => {}, divider: true },
    {
      id: 'undo',
      label: 'Undo',
      icon: RotateCw,
      shortcut: '⌘Z',
      action: handlers.onUndo || (() => {}),
      disabled: !handlers.onUndo,
    },
    {
      id: 'redo',
      label: 'Redo',
      icon: RotateCw,
      shortcut: '⌘⇧Z',
      action: handlers.onRedo || (() => {}),
      disabled: !handlers.onRedo,
    },
  ];
};

export const getMultiSelectContextMenu = (
  selectedCount: number,
  handlers: {
    onCopy: () => void;
    onDelete: () => void;
    onGroup: () => void;
    onAlign: (type: string) => void;
    onDistribute: (type: string) => void;
  }
): ContextMenuItem[] => {
  return [
    {
      id: 'count',
      label: `${selectedCount} items selected`,
      icon: Layers,
      action: () => {},
      disabled: true,
    },
    { id: 'div-1', label: '', icon: Copy, action: () => {}, divider: true },
    {
      id: 'copy',
      label: 'Copy',
      icon: Copy,
      shortcut: '⌘C',
      action: handlers.onCopy,
    },
    {
      id: 'group',
      label: 'Group',
      icon: Group,
      shortcut: '⌘G',
      action: handlers.onGroup,
    },
    { id: 'div-2', label: '', icon: Copy, action: () => {}, divider: true },
    {
      id: 'align',
      label: 'Align',
      icon: AlignCenter,
      action: () => {},
      submenu: [
        {
          id: 'align-left',
          label: 'Align Left',
          icon: AlignLeft,
          action: () => handlers.onAlign('left'),
        },
        {
          id: 'align-center-h',
          label: 'Align Center',
          icon: AlignHorizontalJustifyCenter,
          action: () => handlers.onAlign('center-h'),
        },
        {
          id: 'align-right',
          label: 'Align Right',
          icon: AlignRight,
          action: () => handlers.onAlign('right'),
        },
        {
          id: 'align-top',
          label: 'Align Top',
          icon: AlignCenter,
          action: () => handlers.onAlign('top'),
        },
        {
          id: 'align-center-v',
          label: 'Align Middle',
          icon: AlignVerticalJustifyCenter,
          action: () => handlers.onAlign('center-v'),
        },
        {
          id: 'align-bottom',
          label: 'Align Bottom',
          icon: AlignCenter,
          action: () => handlers.onAlign('bottom'),
        },
      ],
    },
    {
      id: 'distribute',
      label: 'Distribute',
      icon: Layers,
      action: () => {},
      submenu: [
        {
          id: 'dist-h',
          label: 'Distribute Horizontally',
          icon: AlignHorizontalJustifyCenter,
          action: () => handlers.onDistribute('horizontal'),
        },
        {
          id: 'dist-v',
          label: 'Distribute Vertically',
          icon: AlignVerticalJustifyCenter,
          action: () => handlers.onDistribute('vertical'),
        },
      ],
    },
    { id: 'div-3', label: '', icon: Copy, action: () => {}, divider: true },
    {
      id: 'delete',
      label: 'Delete',
      icon: Trash2,
      shortcut: '⌫',
      action: handlers.onDelete,
      color: 'danger',
    },
  ];
};
