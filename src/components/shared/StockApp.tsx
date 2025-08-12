import React, { useEffect, useMemo, useState } from 'react';
// @ts-ignore - mapped to mock in tests via jest.moduleNameMapper
import { getProducts } from '@/domains/marketplace/services/medusa'

export const StockApp: React.FC = () => {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const products = await getProducts()
        if (mounted) setItems(products ?? [])
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => {
      mounted = false
    }
  }, [])

  const filtered = useMemo(() => {
    if (!search) return items
    const s = search.toLowerCase()
    return items.filter((p) => `${p.title ?? p.name ?? ''}`.toLowerCase().includes(s))
  }, [items, search])

  return (
    <div className="stock-app">
      <h2>Stock Management</h2>
      {loading ? (
        <div>Loading stock data...</div>
      ) : (
        <>
          <input
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="inventory-list">
            {filtered.map((item, index) => (
              <div key={index} className="inventory-item">
                <h3>{item.title ?? item.name}</h3>
                <p>Qty: {item.inventory_quantity ?? item.quantity ?? 0}</p>
                <p>Price: {item.price ?? 0}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default StockApp;


