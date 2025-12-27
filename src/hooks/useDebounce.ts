import { useEffect, useState } from 'react';

/**
 * Custom hook for debouncing values
 * Delays updating the value until after the specified delay
 * 
 * @param value - The value to debounce
 * @param delay - Delay in milliseconds (default: 500ms)
 * @returns The debounced value
 * 
 * @example
 * const [searchTerm, setSearchTerm] = useState('');
 * const debouncedSearchTerm = useDebounce(searchTerm, 500);
 * 
 * useEffect(() => {
 *   // API call only happens after user stops typing for 500ms
 *   fetchResults(debouncedSearchTerm);
 * }, [debouncedSearchTerm]);
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set up the timeout
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clean up the timeout if value changes before delay expires
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Custom hook for debouncing callback functions
 * 
 * @param callback - The function to debounce
 * @param delay - Delay in milliseconds (default: 500ms)
 * @returns The debounced callback function
 * 
 * @example
 * const handleSearch = useDebounceCallback((term: string) => {
 *   fetchResults(term);
 * }, 500);
 * 
 * <input onChange={(e) => handleSearch(e.target.value)} />
 */
export function useDebounceCallback<T extends (...args: any[]) => void>(
  callback: T,
  delay: number = 500
): (...args: Parameters<T>) => void {
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  return (...args: Parameters<T>) => {
    // Clear existing timeout
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    // Set new timeout
    const newTimeoutId = setTimeout(() => {
      callback(...args);
    }, delay);

    setTimeoutId(newTimeoutId);
  };
}

/**
 * Custom hook for throttling values
 * Updates value at most once per specified interval
 * 
 * @param value - The value to throttle
 * @param interval - Minimum interval between updates in milliseconds (default: 500ms)
 * @returns The throttled value
 * 
 * @example
 * const [scrollPosition, setScrollPosition] = useState(0);
 * const throttledScrollPosition = useThrottle(scrollPosition, 100);
 * 
 * useEffect(() => {
 *   // Heavy computation only runs max once per 100ms
 *   performExpensiveCalculation(throttledScrollPosition);
 * }, [throttledScrollPosition]);
 */
export function useThrottle<T>(value: T, interval: number = 500): T {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const [lastExecuted, setLastExecuted] = useState<number>(Date.now());

  useEffect(() => {
    const now = Date.now();
    const timeElapsed = now - lastExecuted;

    if (timeElapsed >= interval) {
      setThrottledValue(value);
      setLastExecuted(now);
    } else {
      const timerId = setTimeout(() => {
        setThrottledValue(value);
        setLastExecuted(Date.now());
      }, interval - timeElapsed);

      return () => clearTimeout(timerId);
    }
  }, [value, interval, lastExecuted]);

  return throttledValue;
}
