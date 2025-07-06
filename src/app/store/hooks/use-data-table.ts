import { useState, useMemo } from "react";

// Main data table hook
export const useDataTable = (data: any[] = []) => {
  const [query, setQuery] = useState<Record<string, any>>({});

  const tableQuery = useMemo(() => ({
    ...query,
    limit: query.limit || 20,
    offset: query.offset || 0,
  }), [query]);

  const updateQuery = (updates: Record<string, any>) => {
    setQuery((prev: any) => ({ ...prev, ...updates }));
  };

  const resetQuery = () => {
    setQuery({});
  };

  const tableData = useMemo(() => {
    // Apply filters and search to data
    return data.filter((item) => {
      // Basic filtering logic
      if (query.search) {
        const searchLower = query.search.toLowerCase();
        return (
          item.id?.toLowerCase().includes(searchLower) ||
          item.customer?.email?.toLowerCase().includes(searchLower)
        );
      }
      return true;
    });
  }, [data, query]);

  return {
    data: tableData,
    query: tableQuery,
    updateQuery,
    resetQuery,
  };
};
