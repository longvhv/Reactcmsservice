import { useEffect, useCallback } from 'react';

/**
 * Keyboard shortcut configuration
 */
export interface ShortcutConfig {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  meta?: boolean; // Command key on Mac, Windows key on Windows
  callback: (event: KeyboardEvent) => void;
  preventDefault?: boolean;
  description?: string;
}

/**
 * Custom hook for registering keyboard shortcuts
 * 
 * @param shortcuts - Array of shortcut configurations
 * 
 * @example
 * useKeyboardShortcut([
 *   {
 *     key: 's',
 *     ctrl: true,
 *     callback: () => saveDocument(),
 *     preventDefault: true,
 *     description: 'Save document'
 *   },
 *   {
 *     key: 'k',
 *     meta: true,
 *     callback: () => openCommandPalette(),
 *     preventDefault: true,
 *     description: 'Open command palette'
 *   }
 * ]);
 */
export function useKeyboardShortcut(shortcuts: ShortcutConfig[]) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      shortcuts.forEach((shortcut) => {
        const {
          key,
          ctrl = false,
          shift = false,
          alt = false,
          meta = false,
          callback,
          preventDefault = false,
        } = shortcut;

        // Check if the pressed key matches
        const keyMatch = event.key.toLowerCase() === key.toLowerCase();
        
        // Check modifier keys
        const ctrlMatch = ctrl ? event.ctrlKey : !event.ctrlKey;
        const shiftMatch = shift ? event.shiftKey : !event.shiftKey;
        const altMatch = alt ? event.altKey : !event.altKey;
        const metaMatch = meta ? event.metaKey : !event.metaKey;

        // If all conditions match, execute callback
        if (keyMatch && ctrlMatch && shiftMatch && altMatch && metaMatch) {
          if (preventDefault) {
            event.preventDefault();
          }
          callback(event);
        }
      });
    },
    [shortcuts]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}

/**
 * Single keyboard shortcut hook (simpler API)
 * 
 * @example
 * useKeyboardShortcutSingle('s', () => save(), { ctrl: true, preventDefault: true });
 */
export function useKeyboardShortcutSingle(
  key: string,
  callback: (event: KeyboardEvent) => void,
  options: {
    ctrl?: boolean;
    shift?: boolean;
    alt?: boolean;
    meta?: boolean;
    preventDefault?: boolean;
  } = {}
) {
  useKeyboardShortcut([
    {
      key,
      ...options,
      callback,
    },
  ]);
}

/**
 * Common keyboard shortcuts for CMS
 */
export const CMS_SHORTCUTS = {
  SAVE: { key: 's', ctrl: true, description: 'Save' },
  COMMAND_PALETTE: { key: 'k', meta: true, description: 'Command Palette' },
  NEW_ARTICLE: { key: 'n', ctrl: true, description: 'New Article' },
  SEARCH: { key: 'f', ctrl: true, description: 'Search' },
  REFRESH: { key: 'r', ctrl: true, description: 'Refresh' },
  DELETE: { key: 'Delete', description: 'Delete' },
  ESCAPE: { key: 'Escape', description: 'Close/Cancel' },
  ENTER: { key: 'Enter', description: 'Confirm/Submit' },
  HELP: { key: '?', shift: true, description: 'Show Help' },
  UNDO: { key: 'z', ctrl: true, description: 'Undo' },
  REDO: { key: 'z', ctrl: true, shift: true, description: 'Redo' },
  COPY: { key: 'c', ctrl: true, description: 'Copy' },
  PASTE: { key: 'v', ctrl: true, description: 'Paste' },
  CUT: { key: 'x', ctrl: true, description: 'Cut' },
  SELECT_ALL: { key: 'a', ctrl: true, description: 'Select All' },
} as const;

/**
 * Hook to display keyboard shortcut hint
 */
export function useShortcutHint(shortcuts: ShortcutConfig[]) {
  const formatShortcut = (shortcut: ShortcutConfig): string => {
    const parts: string[] = [];
    
    if (shortcut.ctrl) parts.push('Ctrl');
    if (shortcut.shift) parts.push('Shift');
    if (shortcut.alt) parts.push('Alt');
    if (shortcut.meta) parts.push('⌘'); // Command symbol for Mac
    
    parts.push(shortcut.key.toUpperCase());
    
    return parts.join(' + ');
  };

  const hints = shortcuts.map((shortcut) => ({
    keys: formatShortcut(shortcut),
    description: shortcut.description || 'No description',
  }));

  return hints;
}

/**
 * Detect platform for OS-specific shortcuts
 */
export function useIsMac() {
  return typeof navigator !== 'undefined' && navigator.platform.toLowerCase().includes('mac');
}

/**
 * Get modifier key based on platform
 */
export function useModifierKey(): 'ctrl' | 'meta' {
  const isMac = useIsMac();
  return isMac ? 'meta' : 'ctrl';
}
