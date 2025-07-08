import { useState } from 'react';

export const useAdminCreateMutation = () => {
  const [loading, setLoading] = useState(false);
  
  const mutate = async (data: any) => {
    setLoading(true);
    // Implementation here
    setLoading(false);
  };
  
  return { mutate, loading };
};


