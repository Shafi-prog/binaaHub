import React, { useEffect, useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Search, MapPin } from 'lucide-react';

interface Store {
  id: string;
  name: string;
  location: string;
  rating: number;
  description?: string;
  phone?: string;
  category?: string;
  verified?: boolean;
}

interface StoreSearchProps {
  onSelect: (store: Store) => void;
  onCancel: () => void;
  selectedStore: Store | null;
}

export function StoreSearch({ onSelect, onCancel, selectedStore }: StoreSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<Store[]>([]);
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchStores = async (q: string = '') => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/stores${q ? `?search=${encodeURIComponent(q)}` : ''}`)
      if (!res.ok) throw new Error(`status ${res.status}`)
      const data = await res.json()
      setResults(data.stores || [])
    } catch (e: any) {
      setError(e?.message || 'حدث خطأ')
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchStores() }, [])
  useEffect(() => {
    const id = setTimeout(() => fetchStores(searchTerm.trim()), 300)
    return () => clearTimeout(id)
  }, [searchTerm])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="w-5 h-5" />
          البحث عن المتاجر
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="ابحث عن متجر..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            <Button onClick={() => fetchStores(searchTerm)}>
              <Search className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="space-y-2">
            {loading && (
              <div className="text-sm text-gray-500">جارٍ التحميل...</div>
            )}
            {error && (
              <div className="text-sm text-red-600">{error}</div>
            )}
            {!loading && !error && results.map(store => (
              <div key={store.id} className="p-3 border rounded-lg flex items-center justify-between">
                <div>
                  <h4 className="font-semibold">{store.name}</h4>
                  <p className="text-sm text-gray-600 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {store.location || '—'}
                  </p>
                </div>
                <Button size="sm" onClick={() => onSelect(store)}>
                  اختيار
                </Button>
              </div>
            ))}
          </div>
          <div className="flex justify-end space-x-2 mt-4">
            <Button variant="outline" onClick={onCancel}>
              إلغاء
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
