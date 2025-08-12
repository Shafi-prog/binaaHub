import { useState, useEffect, useMemo } from 'react';

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export function useSearch<T>(
  items: T[],
  searchKeys: (keyof T)[],
  initialSearchTerm: string = ''
) {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);

  const filteredData = useMemo(() => {
    if (!searchTerm) return items;

    return items.filter(item => {
      return searchKeys.some(key => {
        const value = item[key];
        if (typeof value === 'string') {
          return value.toLowerCase().includes(searchTerm.toLowerCase());
        }
        return false;
      });
    });
  }, [items, searchKeys, searchTerm]);

  const clearSearch = () => setSearchTerm('');

  return {
    filteredData,
    searchTerm,
    setSearchTerm,
    clearSearch
  };
}


