import { useState, useMemo } from "react";

// Hook for order table query management
export const useOrderTableQuery = () => {
  const [query, setQuery] = useState<Record<string, any>>({});

  const tableQuery = useMemo(() => ({
    ...query,
    limit: query.limit || 20,
    offset: query.offset || 0,
  }), [query]);

  const updateQuery = (updates: Record<string, any>) => {
    setQuery(prev => ({ ...prev, ...updates }));
  };

  const resetQuery = () => {
    setQuery({});
  };

  return {
    query: tableQuery,
    updateQuery,
    resetQuery,
    setQuery,
  };
};
