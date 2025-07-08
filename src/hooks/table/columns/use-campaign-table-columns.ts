import { createColumnHelper } from '@tanstack/react-table';

export const useCampaignTableColumns = () => {
  const columnHelper = createColumnHelper<any>();
  
  return [
    columnHelper.accessor('name', {
      header: 'Name',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('created_at', {
      header: 'Created',
      cell: (info) => new Date(info.getValue()).toLocaleDateString(),
    }),
  ];
};


