import { useState, useEffect, useRef } from 'react';
import {
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  AlignVerticalJustifyCenter, AlignHorizontalJustifyCenter,
  Copy, Trash2, Lock, Unlock, Eye, EyeOff,
  FlipHorizontal, FlipVertical, Group, Ungroup,
  BringToFront, SendToBack, ChevronUp, ChevronDown,
  Palette, Type, Move, RotateCw, Link, Layers,
  MoreHorizontal, Sparkles, Wand2
} from 'lucide-react';

interface QuickActionsToolbarProps {
  selectedElements: any[];
  position: { x: number; y: number };
  onAlign: (direction: string) => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onLock: () => void;
  onVisible: () => void;
  onFlip: (direction: 'horizontal' | 'vertical') => void;
  onGroup: () => void;
  onUngroup: () => void;
  onBringForward: () => void;
  onSendBackward: () => void;
  onBringToFront: () => void;
  onSendToBack: () => void;
  onChangeColor: () => void;
  onEditText: () => void;
  onOpenEffects: () => void;
}

export function QuickActionsToolbar({
  selectedElements,
  position,
  onAlign,
  onDuplicate,
  onDelete,
  onLock,
  onVisible,
  onFlip,
  onGroup,
  onUngroup,
  onBringForward,
  onSendBackward,
  onBringToFront,
  onSendToBack,
  onChangeColor,
  onEditText,
  onOpenEffects,
}: QuickActionsToolbarProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showLayersMenu, setShowLayersMenu] = useState(false);
  const [showAlignMenu, setShowAlignMenu] = useState(false);
  const toolbarRef = useRef<HTMLDivElement>(null);

  const isLocked = selectedElements.some(el => el.locked);
  const isVisible = selectedElements.every(el => el.visible);
  const isGrouped = selectedElements.length > 1;
  const hasText = selectedElements.some(el => el.type === 'text');
  const hasImage = selectedElements.some(el => el.type === 'image');

  // Auto-hide menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (toolbarRef.current && !toolbarRef.current.contains(e.target as Node)) {
        setShowLayersMenu(false);
        setShowAlignMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Primary actions - always visible
  const primaryActions = [
    {
      icon: Copy,
      label: 'Duplicate',
      action: onDuplicate,
      shortcut: '⌘D',
      show: true,
    },
    {
      icon: Palette,
      label: 'Color',
      action: onChangeColor,
      show: true,
    },
    {
      icon: hasText ? Type : Wand2,
      label: hasText ? 'Edit Text' : 'Effects',
      action: hasText ? onEditText : onOpenEffects,
      show: true,
    },
    {
      icon: AlignCenter,
      label: 'Align',
      action: () => setShowAlignMenu(!showAlignMenu),
      show: true,
      hasMenu: true,
      active: showAlignMenu,
    },
    {
      icon: Layers,
      label: 'Layer',
      action: () => setShowLayersMenu(!showLayersMenu),
      show: true,
      hasMenu: true,
      active: showLayersMenu,
    },
  ];

  // Secondary actions - in expanded menu
  const secondaryActions = [
    {
      icon: isGrouped ? Ungroup : Group,
      label: isGrouped ? 'Ungroup' : 'Group',
      action: isGrouped ? onUngroup : onGroup,
      shortcut: '⌘G',
      show: selectedElements.length >= 2,
    },
    {
      icon: FlipHorizontal,
      label: 'Flip H',
      action: () => onFlip('horizontal'),
      show: true,
    },
    {
      icon: FlipVertical,
      label: 'Flip V',
      action: () => onFlip('vertical'),
      show: true,
    },
    {
      icon: isLocked ? Unlock : Lock,
      label: isLocked ? 'Unlock' : 'Lock',
      action: onLock,
      shortcut: '⌘L',
      show: true,
    },
    {
      icon: isVisible ? EyeOff : Eye,
      label: isVisible ? 'Hide' : 'Show',
      action: onVisible,
      show: true,
    },
    {
      icon: Trash2,
      label: 'Delete',
      action: onDelete,
      shortcut: '⌫',
      show: true,
      danger: true,
    },
  ];

  // Align menu options
  const alignOptions = [
    { icon: AlignLeft, label: 'Left', action: () => onAlign('left') },
    { icon: AlignCenter, label: 'Center X', action: () => onAlign('center-x') },
    { icon: AlignRight, label: 'Right', action: () => onAlign('right') },
    { icon: AlignHorizontalJustifyCenter, label: 'Center H', action: () => onAlign('center-h') },
    { icon: AlignLeft, label: 'Top', action: () => onAlign('top'), rotate: 90 },
    { icon: AlignCenter, label: 'Center Y', action: () => onAlign('center-y'), rotate: 90 },
    { icon: AlignRight, label: 'Bottom', action: () => onAlign('bottom'), rotate: 90 },
    { icon: AlignVerticalJustifyCenter, label: 'Center V', action: () => onAlign('center-v') },
  ];

  // Layer menu options
  const layerOptions = [
    { icon: BringToFront, label: 'Bring to Front', action: onBringToFront, shortcut: '⌘]' },
    { icon: ChevronUp, label: 'Bring Forward', action: onBringForward, shortcut: ']' },
    { icon: ChevronDown, label: 'Send Backward', action: onSendBackward, shortcut: '[' },
    { icon: SendToBack, label: 'Send to Back', action: onSendToBack, shortcut: '⌘[' },
  ];

  if (selectedElements.length === 0) return null;

  return (
    <div
      ref={toolbarRef}
      className="fixed z-50 animate-in fade-in zoom-in-95 duration-200"
      style={{
        left: `${position.x}px`,
        top: `${position.y - 60}px`,
        transform: 'translateX(-50%)',
      }}
    >
      {/* Main Toolbar */}
      <div className="flex items-center gap-1 bg-background/95 backdrop-blur-xl border border-border rounded-xl shadow-2xl p-2">
        {/* Primary Actions */}
        {primaryActions.map((action, index) => (
          action.show && (
            <button
              key={index}
              onClick={action.action}
              className={`
                group relative flex items-center justify-center gap-1.5 px-3 h-10 rounded-lg
                transition-all duration-200 hover:bg-muted
                ${action.active ? 'bg-muted' : ''}
              `}
              title={action.label}
            >
              <action.icon className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
              <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                {action.label}
              </span>
              {action.hasMenu && (
                <ChevronDown className="w-3 h-3 text-muted-foreground transition-transform" />
              )}
              
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-background/95 backdrop-blur-sm border border-border rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap text-xs">
                {action.label}
                {action.shortcut && (
                  <span className="ml-2 text-muted-foreground">{action.shortcut}</span>
                )}
              </div>
            </button>
          )
        ))}

        {/* Divider */}
        <div className="w-px h-6 bg-border mx-1" />

        {/* More Actions Toggle */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="group flex items-center justify-center w-10 h-10 rounded-lg hover:bg-muted transition-colors"
          title="More actions"
        >
          <MoreHorizontal className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
        </button>

        {/* Expanded Actions */}
        {isExpanded && (
          <div className="absolute top-full left-0 mt-2 p-2 bg-background/95 backdrop-blur-xl border border-border rounded-xl shadow-2xl min-w-[200px] animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex flex-col gap-1">
              {secondaryActions.map((action, index) => (
                action.show && (
                  <button
                    key={index}
                    onClick={() => {
                      action.action();
                      setIsExpanded(false);
                    }}
                    className={`
                      group flex items-center justify-between gap-3 px-3 py-2 rounded-lg
                      transition-all duration-200 hover:bg-muted
                      ${action.danger ? 'hover:bg-destructive/10 hover:text-destructive' : ''}
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <action.icon className={`
                        w-4 h-4 transition-colors
                        ${action.danger 
                          ? 'text-destructive' 
                          : 'text-muted-foreground group-hover:text-foreground'
                        }
                      `} />
                      <span className={`
                        text-sm font-medium transition-colors
                        ${action.danger 
                          ? 'text-destructive' 
                          : 'text-foreground'
                        }
                      `}>
                        {action.label}
                      </span>
                    </div>
                    {action.shortcut && (
                      <span className="text-xs text-muted-foreground">
                        {action.shortcut}
                      </span>
                    )}
                  </button>
                )
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Align Menu */}
      {showAlignMenu && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 p-3 bg-background/95 backdrop-blur-xl border border-border rounded-xl shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Align
          </div>
          <div className="grid grid-cols-4 gap-1">
            {alignOptions.map((option, index) => (
              <button
                key={index}
                onClick={() => {
                  option.action();
                  setShowAlignMenu(false);
                }}
                className="group flex flex-col items-center justify-center gap-1 p-2 rounded-lg hover:bg-muted transition-colors"
                title={option.label}
              >
                <option.icon 
                  className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors"
                  style={option.rotate ? { transform: `rotate(${option.rotate}deg)` } : {}}
                />
                <span className="text-[10px] text-muted-foreground group-hover:text-foreground transition-colors">
                  {option.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Layer Menu */}
      {showLayersMenu && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 p-2 bg-background/95 backdrop-blur-xl border border-border rounded-xl shadow-2xl min-w-[200px] animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="mb-2 px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Layer Order
          </div>
          <div className="flex flex-col gap-1">
            {layerOptions.map((option, index) => (
              <button
                key={index}
                onClick={() => {
                  option.action();
                  setShowLayersMenu(false);
                }}
                className="group flex items-center justify-between gap-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors"
              >
                <div className="flex items-center gap-3">
                  <option.icon className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                  <span className="text-sm font-medium text-foreground">
                    {option.label}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {option.shortcut}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Selection Count Badge */}
      {selectedElements.length > 1 && (
        <div className="absolute -top-2 -right-2 flex items-center justify-center w-6 h-6 bg-primary text-primary-foreground rounded-full text-xs font-bold shadow-lg">
          {selectedElements.length}
        </div>
      )}

      {/* Connector Line to Selection */}
      <div className="absolute top-full left-1/2 -translate-x-1/2 w-px h-3 bg-border" />
    </div>
  );
}

// Helper component for BringToFront icon (custom)
function BringToFront({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="8" y="8" width="12" height="12" rx="2" />
      <path d="M4 16V4h12" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

// Helper component for SendToBack icon (custom)
function SendToBack({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="4" y="4" width="12" height="12" rx="2" />
      <path d="M20 8v12H8" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
