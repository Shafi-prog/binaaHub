import { createColumnHelper } from '@tanstack/react-table';

export const useCollectionTableColumns = () => {
  const columnHelper = createColumnHelper<any>();
  
  return [
    columnHelper.accessor('title', {
      header: 'Title',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('handle', {
      header: 'Handle',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('created_at', {
      header: 'Created',
      cell: (info) => new Date(info.getValue()).toLocaleDateString(),
    }),
  ];
};


