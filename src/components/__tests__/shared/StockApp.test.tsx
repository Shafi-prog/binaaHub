import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { StockApp } from '../../shared/StockApp'
import { configureSupabaseMockData } from '@/lib/__mocks__/supabase-auth-helpers-nextjs'

beforeEach(() => {
  configureSupabaseMockData({
    inventory: [
      { id: '1', product_id: 'SKU1', quantity: 10, reserved_quantity: 2, warehouse_location: 'A', last_counted: '2024-01-01' },
      { id: '2', product_id: 'SKU2', quantity: 5, reserved_quantity: 1, warehouse_location: 'B', last_counted: '2024-01-02' },
    ],
  })
})

describe('StockApp', () => {
  it('renders stock management interface', async () => {
    render(<StockApp />)
    
  await screen.findByText('Stock Management')
  expect(screen.getAllByText('SKU1').length).toBeGreaterThan(0)
  expect(screen.getAllByText('SKU2').length).toBeGreaterThan(0)
  })

  it('handles row presence after load', async () => {
    render(<StockApp />)
    
    await screen.findByText('Stock Management')
    // Rows appear with both name and SKU cells
    expect(screen.getAllByText('SKU1').length).toBeGreaterThan(0)
    expect(screen.getAllByText('SKU2').length).toBeGreaterThan(0)
  })

  it('displays loading state initially', () => {
    render(<StockApp />)
    expect(screen.getByText('Loading stock data...')).toBeInTheDocument()
  })
})


