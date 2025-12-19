import { useState, useEffect, useMemo } from 'react';

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Create a timeout handler that updates the debounced value
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, Math.max(0, Math.min(delay, 10000))); // Validate delay: max 10 seconds

    // Cleanup function to cancel the timeout if value changes before delay
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export function useSearch<T>(
  items: T[],
  searchTerm: string,
  searchKey: keyof T,
  delay: number = 300
) {
  const debouncedSearchTerm = useDebounce(searchTerm, delay);

  const filteredItems = useMemo(() => {
    if (!debouncedSearchTerm) return items;
    
    return items.filter(item => {
      const value = item[searchKey];
      if (typeof value === 'string') {
        return value.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
      }
      return false;
    });
  }, [items, debouncedSearchTerm, searchKey]);

  return filteredItems;
}


