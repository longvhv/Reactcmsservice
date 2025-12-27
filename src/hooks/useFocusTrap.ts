import { useEffect, useRef } from 'react';

/**
 * Hook to trap focus within a modal/dialog
 * Useful for accessibility to keep keyboard navigation within the modal
 * 
 * @param isActive - Whether the focus trap is active
 * @returns ref - Ref to attach to the container element
 * 
 * @example
 * const modalRef = useFocusTrap(isOpen);
 * 
 * return (
 *   isOpen && (
 *     <div ref={modalRef}>
 *       <input /> // Focus will cycle within this div
 *     </div>
 *   )
 * );
 */
export function useFocusTrap(isActive: boolean) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isActive || !ref.current) return;

    const element = ref.current;
    
    // Get all focusable elements
    const focusableElements = element.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    // Focus first element when trap activates
    firstElement?.focus();

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        // Shift + Tab (backwards)
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        // Tab (forwards)
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    element.addEventListener('keydown', handleTab);

    return () => {
      element.removeEventListener('keydown', handleTab);
    };
  }, [isActive]);

  return ref;
}

/**
 * Hook to restore focus when a modal closes
 * 
 * @example
 * const [isOpen, setIsOpen] = useState(false);
 * const buttonRef = useFocusReturn(isOpen);
 * 
 * <button ref={buttonRef} onClick={() => setIsOpen(true)}>Open</button>
 */
export function useFocusReturn(isOpen: boolean) {
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Store the currently focused element
      previousFocusRef.current = document.activeElement as HTMLElement;
    } else if (previousFocusRef.current) {
      // Restore focus when modal closes
      previousFocusRef.current.focus();
      previousFocusRef.current = null;
    }
  }, [isOpen]);

  return triggerRef;
}
