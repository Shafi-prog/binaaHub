// @ts-nocheck
'use client'

import dynamic from 'next/dynamic'

const PriceListCreateForm = dynamic(() => import('./components/price-list-create-form').then(mod => mod.PriceListCreateForm), {
  ssr: false,
  loading: () => <div className="p-8">Loading price list form...</div>
})

const PriceListCreate = () => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Create Price List</h1>
      <PriceListCreateForm
        regions={[]}
        currencies={[]}
        pricePreferences={{}}
      />
    </div>
  )
}

export default PriceListCreate;


