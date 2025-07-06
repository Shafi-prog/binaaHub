import { useState } from "react";

interface UseDataTableProps<TData = any> {
  data: TData[];
  columns?: any[];
  count?: number;
  enablePagination?: boolean;
  getRowId?: (row: TData) => string;
  pageSize?: number;
  enableRowSelection?: boolean | ((row: any) => boolean);
  rowSelection?: {
    state: any;
    updater: any;
  };
}

export const useDataTable = <TData = any>({
  data,
  columns = [],
  count,
  enablePagination = true,
  getRowId,
  pageSize = 20,
  enableRowSelection = false,
  rowSelection,
}: UseDataTableProps<TData>) => {
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: pageSize,
  });

  // Create a mock table object that satisfies basic Table interface requirements
  const table = {
    // Core table data and state
    getRowModel: () => ({ rows: data.map((item, index) => ({ 
      id: getRowId ? getRowId(item) : String(index),
      original: item,
      index
    })) }),
    getFilteredRowModel: () => ({ rows: data.map((item, index) => ({ 
      id: getRowId ? getRowId(item) : String(index),
      original: item,
      index
    })) }),
    getPaginationRowModel: () => ({ rows: data.map((item, index) => ({ 
      id: getRowId ? getRowId(item) : String(index),
      original: item,
      index
    })) }),
    getState: () => ({
      sorting,
      columnFilters,
      rowSelection: rowSelection?.state || {},
      pagination,
    }),
    
    // Selection methods
    setRowSelection: rowSelection?.updater || (() => {}),
    getSelectedRowModel: () => ({ rows: [] }),
    toggleAllRowsSelected: () => {},
    resetRowSelection: () => {},
    
    // Sorting methods
    setSorting,
    toggleAllRowsExpanded: () => {},
    
    // Column methods
    setColumnFilters,
    getColumn: () => null,
    getAllColumns: () => columns,
    
    // Pagination methods
    getRowCount: () => count || data.length,
    getCanPreviousPage: () => pagination.pageIndex > 0,
    getCanNextPage: () => pagination.pageIndex < Math.ceil((count || data.length) / pagination.pageSize) - 1,
    previousPage: () => setPagination(prev => ({ ...prev, pageIndex: Math.max(0, prev.pageIndex - 1) })),
    nextPage: () => setPagination(prev => ({ ...prev, pageIndex: prev.pageIndex + 1 })),
    setPageIndex: (index: number) => setPagination(prev => ({ ...prev, pageIndex: index })),
    getPageCount: () => Math.ceil((count || data.length) / pagination.pageSize),
    setPagination,
    
    // Additional properties to satisfy Table interface
    _features: [],
    _getAllFlatColumnsById: () => ({}),
    _getColumnDefs: () => columns,
    _getDefaultColumnDef: () => ({}),
    options: { data, columns },
    initialState: {},
  } as any; // Type assertion to avoid full interface compliance

  return {
    table,
  };
};
