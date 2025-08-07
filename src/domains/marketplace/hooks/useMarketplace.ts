import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase/client';

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  image?: string;
}

interface MarketplaceFilters {
  category?: string;
  priceRange?: [number, number];
  searchTerm?: string;
}

export const useMarketplace = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<MarketplaceFilters>({});
  const [categories, setCategories] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async (filters: MarketplaceFilters = {}) => {
    setLoading(true);
    setError(null);
    try {
      let query = supabase.from('products').select('*');
      if (filters.category && filters.category !== 'all') {
        query = query.eq('category', filters.category);
      }
      if (filters.searchTerm) {
        query = query.ilike('name', `%${filters.searchTerm}%`);
      }
      const { data, error: fetchError } = await query;
      if (fetchError) throw fetchError;
      setProducts(data || []);
    } catch (err: any) {
      console.error('Error fetching products:', err);
      setError(err.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error: catErr } = await supabase
        .from('products')
        .select('category');
      if (catErr) throw catErr;
      // Dedupe categories manually
      const uniqueCats = Array.from(new Set(data?.map((row: any) => row.category) || []));
      setCategories(uniqueCats);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  useEffect(() => { fetchProducts(filters); }, [fetchProducts, filters]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const updateFilters = (newFilters: Partial<MarketplaceFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const addProductToSelection = (product: Product) => {
    // Placeholder implementation
    console.log('Product added to selection:', product);
  };

  return {
    products,
    loading,
    filters,
    error,
    categories,
    fetchProducts,
    updateFilters,
    addProductToSelection,
    isProjectContext: false,
    projectId: null
  };
};



