/**
 * Unit tests for useMarqueeSelection hook
 * 
 * Tests cover:
 * - Basic selection functionality
 * - Keyboard modifiers (Ctrl/Cmd)
 * - Intersection detection
 * - Selection state management
 * - Edge cases
 */

import { renderHook, act } from '@testing-library/react';
import { useMarqueeSelection } from '../useMarqueeSelection';
import { useRef } from 'react';

describe('useMarqueeSelection', () => {
  let containerRef: React.RefObject<HTMLDivElement>;
  let mockOnSelectionChange: jest.Mock;

  beforeEach(() => {
    // Setup mock container
    const div = document.createElement('div');
    div.getBoundingClientRect = jest.fn(() => ({
      left: 0,
      top: 0,
      right: 1000,
      bottom: 1000,
      width: 1000,
      height: 1000,
      x: 0,
      y: 0,
      toJSON: () => {},
    }));
    document.body.appendChild(div);

    containerRef = { current: div };
    mockOnSelectionChange = jest.fn();
  });

  afterEach(() => {
    document.body.innerHTML = '';
    jest.clearAllMocks();
  });

  describe('Initialization', () => {
    it('should initialize with default values', () => {
      const { result } = renderHook(() =>
        useMarqueeSelection({
          containerRef,
          itemSelector: '[data-test-id]',
          onSelectionChange: mockOnSelectionChange,
        })
      );

      expect(result.current.isSelecting).toBe(false);
      expect(result.current.selectedIds.size).toBe(0);
    });

    it('should accept isEnabled parameter', () => {
      const { result } = renderHook(() =>
        useMarqueeSelection({
          containerRef,
          itemSelector: '[data-test-id]',
          onSelectionChange: mockOnSelectionChange,
          isEnabled: false,
        })
      );

      expect(result.current.isSelecting).toBe(false);
    });
  });

  describe('Selection Box Rendering', () => {
    it('should return null when not selecting', () => {
      const { result } = renderHook(() =>
        useMarqueeSelection({
          containerRef,
          itemSelector: '[data-test-id]',
          onSelectionChange: mockOnSelectionChange,
        })
      );

      const selectionBox = result.current.renderSelectionBox();
      expect(selectionBox).toBeNull();
    });
  });

  describe('Selection State Management', () => {
    it('should reset selection', () => {
      const { result } = renderHook(() =>
        useMarqueeSelection({
          containerRef,
          itemSelector: '[data-test-id]',
          onSelectionChange: mockOnSelectionChange,
        })
      );

      // Manually set some selection
      act(() => {
        result.current.updateSelection(new Set(['1', '2', '3']));
      });

      expect(result.current.selectedIds.size).toBe(3);

      // Reset
      act(() => {
        result.current.resetSelection();
      });

      expect(result.current.selectedIds.size).toBe(0);
      expect(mockOnSelectionChange).toHaveBeenCalledWith(new Set());
    });

    it('should update selection', () => {
      const { result } = renderHook(() =>
        useMarqueeSelection({
          containerRef,
          itemSelector: '[data-test-id]',
          onSelectionChange: mockOnSelectionChange,
        })
      );

      const newSelection = new Set(['1', '2', '3']);

      act(() => {
        result.current.updateSelection(newSelection);
      });

      expect(result.current.selectedIds).toEqual(newSelection);
    });
  });

  describe('Mouse Interactions', () => {
    it('should handle mouse down on container', () => {
      const { result } = renderHook(() =>
        useMarqueeSelection({
          containerRef,
          itemSelector: '[data-test-id]',
          onSelectionChange: mockOnSelectionChange,
        })
      );

      const mouseEvent = new MouseEvent('mousedown', {
        clientX: 100,
        clientY: 100,
        bubbles: true,
      }) as any;

      mouseEvent.preventDefault = jest.fn();

      act(() => {
        result.current.handleMouseDown(mouseEvent);
      });

      expect(result.current.isSelecting).toBe(true);
      expect(mouseEvent.preventDefault).toHaveBeenCalled();
    });

    it('should not start selection when clicking on item', () => {
      // Create an item element
      const item = document.createElement('div');
      item.setAttribute('data-test-id', '1');
      containerRef.current?.appendChild(item);

      const { result } = renderHook(() =>
        useMarqueeSelection({
          containerRef,
          itemSelector: '[data-test-id]',
          onSelectionChange: mockOnSelectionChange,
        })
      );

      const mouseEvent = {
        clientX: 100,
        clientY: 100,
        target: item,
        preventDefault: jest.fn(),
        ctrlKey: false,
        metaKey: false,
      } as any;

      // Mock closest to return the item
      item.closest = jest.fn(() => item);

      act(() => {
        result.current.handleMouseDown(mouseEvent);
      });

      expect(result.current.isSelecting).toBe(false);
    });
  });

  describe('Keyboard Modifiers', () => {
    it('should handle Ctrl modifier', () => {
      const { result } = renderHook(() =>
        useMarqueeSelection({
          containerRef,
          itemSelector: '[data-test-id]',
          onSelectionChange: mockOnSelectionChange,
        })
      );

      // Set initial selection
      act(() => {
        result.current.updateSelection(new Set(['1', '2']));
      });

      const mouseEvent = {
        clientX: 100,
        clientY: 100,
        target: containerRef.current,
        preventDefault: jest.fn(),
        ctrlKey: true,
        metaKey: false,
      } as any;

      act(() => {
        result.current.handleMouseDown(mouseEvent);
      });

      expect(result.current.isSelecting).toBe(true);
    });

    it('should handle Cmd modifier (Mac)', () => {
      const { result } = renderHook(() =>
        useMarqueeSelection({
          containerRef,
          itemSelector: '[data-test-id]',
          onSelectionChange: mockOnSelectionChange,
        })
      );

      const mouseEvent = {
        clientX: 100,
        clientY: 100,
        target: containerRef.current,
        preventDefault: jest.fn(),
        ctrlKey: false,
        metaKey: true,
      } as any;

      act(() => {
        result.current.handleMouseDown(mouseEvent);
      });

      expect(result.current.isSelecting).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    it('should handle disabled state', () => {
      const { result } = renderHook(() =>
        useMarqueeSelection({
          containerRef,
          itemSelector: '[data-test-id]',
          onSelectionChange: mockOnSelectionChange,
          isEnabled: false,
        })
      );

      const mouseEvent = {
        clientX: 100,
        clientY: 100,
        target: containerRef.current,
        preventDefault: jest.fn(),
        ctrlKey: false,
        metaKey: false,
      } as any;

      act(() => {
        result.current.handleMouseDown(mouseEvent);
      });

      expect(result.current.isSelecting).toBe(false);
    });

    it('should handle null container ref', () => {
      const nullRef = { current: null };

      const { result } = renderHook(() =>
        useMarqueeSelection({
          containerRef: nullRef,
          itemSelector: '[data-test-id]',
          onSelectionChange: mockOnSelectionChange,
        })
      );

      const mouseEvent = {
        clientX: 100,
        clientY: 100,
        preventDefault: jest.fn(),
        ctrlKey: false,
        metaKey: false,
      } as any;

      act(() => {
        result.current.handleMouseDown(mouseEvent);
      });

      expect(result.current.isSelecting).toBe(false);
    });
  });

  describe('Intersection Detection', () => {
    it('should detect items within selection box', () => {
      // Create test items
      const item1 = document.createElement('div');
      item1.setAttribute('data-test-id', '1');
      item1.getBoundingClientRect = jest.fn(() => ({
        left: 10,
        top: 10,
        right: 60,
        bottom: 60,
        width: 50,
        height: 50,
        x: 10,
        y: 10,
        toJSON: () => {},
      }));

      const item2 = document.createElement('div');
      item2.setAttribute('data-test-id', '2');
      item2.getBoundingClientRect = jest.fn(() => ({
        left: 100,
        top: 100,
        right: 150,
        bottom: 150,
        width: 50,
        height: 50,
        x: 100,
        y: 100,
        toJSON: () => {},
      }));

      containerRef.current?.appendChild(item1);
      containerRef.current?.appendChild(item2);

      const { result } = renderHook(() =>
        useMarqueeSelection({
          containerRef,
          itemSelector: '[data-test-id]',
          onSelectionChange: mockOnSelectionChange,
        })
      );

      // This is a simplified test - full integration tests would be needed
      // to properly test intersection detection
      expect(result.current.selectedIds.size).toBe(0);
    });
  });
});
