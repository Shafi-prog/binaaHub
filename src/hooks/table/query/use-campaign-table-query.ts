import { useState } from 'react';

export const useCampaignTableQuery = () => {
  const [search, setSearch] = useState('');
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  
  return {
    search,
    setSearch,
    pageIndex,
    setPageIndex,
    pageSize,
    setPageSize,
    query: {
      search,
      limit: pageSize,
      offset: pageIndex * pageSize,
    },
  };
};


