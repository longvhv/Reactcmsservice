/**
 * useSections Hook - Manage content sections state
 */

import { useState, useCallback, useRef } from 'react';
import type { ContentSection, ContentSectionType } from '@/src/types/content-section';
import {
  createDefaultSection,
  reorderSections,
  duplicateSection,
  insertSectionAfter,
  removeSectionById,
  updateSectionById,
  moveSectionUp,
  moveSectionDown,
} from '../sections/index';

interface UseSectionsOptions {
  initialSections?: ContentSection[];
  maxUndoSteps?: number;
  onChange?: (sections: ContentSection[]) => void;
}

export function useSections(options: UseSectionsOptions = {}) {
  const { initialSections = [], maxUndoSteps = 30, onChange } = options;

  const [sections, _setSections] = useState<ContentSection[]>(initialSections);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const undoStack = useRef<ContentSection[][]>([]);
  const redoStack = useRef<ContentSection[][]>([]);

  const setSections = useCallback((newSections: ContentSection[] | ((prev: ContentSection[]) => ContentSection[])) => {
    _setSections(prev => {
      const resolved = typeof newSections === 'function' ? newSections(prev) : newSections;
      // Push to undo stack
      undoStack.current.push([...prev]);
      if (undoStack.current.length > maxUndoSteps) {
        undoStack.current.shift();
      }
      redoStack.current = [];
      onChange?.(resolved);
      return resolved;
    });
  }, [maxUndoSteps, onChange]);

  const loadSections = useCallback((newSections: ContentSection[]) => {
    _setSections(newSections);
    undoStack.current = [];
    redoStack.current = [];
  }, []);

  const addSection = useCallback((type: ContentSectionType, afterId?: string | null) => {
    const order = sections.length;
    const newSection = createDefaultSection(type, order);
    setSections(insertSectionAfter(sections, afterId ?? (sections.length > 0 ? sections[sections.length - 1].id : null), newSection));
    setActiveSectionId(newSection.id);
    return newSection.id;
  }, [sections, setSections]);

  const removeSection = useCallback((id: string) => {
    setSections(removeSectionById(sections, id));
    if (activeSectionId === id) {
      setActiveSectionId(null);
    }
  }, [sections, setSections, activeSectionId]);

  const updateSection = useCallback((id: string, updates: Partial<ContentSection>) => {
    setSections(updateSectionById(sections, id, updates));
  }, [sections, setSections]);

  const moveUp = useCallback((id: string) => {
    setSections(moveSectionUp(sections, id));
  }, [sections, setSections]);

  const moveDown = useCallback((id: string) => {
    setSections(moveSectionDown(sections, id));
  }, [sections, setSections]);

  const duplicate = useCallback((id: string) => {
    const section = sections.find(s => s.id === id);
    if (!section) return;
    const dup = duplicateSection(section);
    setSections(insertSectionAfter(sections, id, dup));
    setActiveSectionId(dup.id);
  }, [sections, setSections]);

  const reorder = useCallback((fromIndex: number, toIndex: number) => {
    setSections(reorderSections(sections, fromIndex, toIndex));
  }, [sections, setSections]);

  const toggleVisibility = useCallback((id: string) => {
    const section = sections.find(s => s.id === id);
    if (section) {
      setSections(updateSectionById(sections, id, { isVisible: !section.isVisible }));
    }
  }, [sections, setSections]);

  const undo = useCallback(() => {
    if (undoStack.current.length === 0) return;
    const prev = undoStack.current.pop()!;
    _setSections(current => {
      redoStack.current.push([...current]);
      onChange?.(prev);
      return prev;
    });
  }, [onChange]);

  const redo = useCallback(() => {
    if (redoStack.current.length === 0) return;
    const next = redoStack.current.pop()!;
    _setSections(current => {
      undoStack.current.push([...current]);
      onChange?.(next);
      return next;
    });
  }, [onChange]);

  const resetSections = useCallback(() => {
    const defaultSection = createDefaultSection('html', 0);
    _setSections([defaultSection]);
    undoStack.current = [];
    redoStack.current = [];
    setActiveSectionId(defaultSection.id);
    onChange?.([defaultSection]);
  }, [onChange]);

  return {
    sections,
    setSections: loadSections,
    activeSectionId,
    setActiveSectionId,
    addSection,
    removeSection,
    updateSection,
    moveUp,
    moveDown,
    duplicate,
    reorder,
    toggleVisibility,
    undo,
    redo,
    canUndo: undoStack.current.length > 0,
    canRedo: redoStack.current.length > 0,
    resetSections,
    sectionCount: sections.length,
  };
}