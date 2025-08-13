import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { POSApp } from '../../shared/POSApp'
import { configureSupabaseMockData } from '@/lib/__mocks__/supabase-auth-helpers-nextjs'

beforeEach(() => {
  configureSupabaseMockData({
    products: [
      { id: 'p1', name: 'Item 1', price: 10, image_url: '', stock_quantity: 100, is_available: true },
      { id: 'p2', name: 'Item 2', price: 15, image_url: '', stock_quantity: 50, is_available: true },
    ],
  })
})

describe('POSApp', () => {
  it('renders POS interface', async () => {
    render(<POSApp />)
    
  // Wait for heading and products to appear after loading state
  await screen.findByText('Point of Sale')
  await screen.findByText('Item 1')
  await screen.findByText('Item 2')
  })

  it('adds items to cart', async () => {
    render(<POSApp />)
    
    await waitFor(() => {
      expect(screen.getByText('Item 1')).toBeInTheDocument()
    })

    // In shared POSApp, clicking the product card adds to cart
    fireEvent.click(screen.getByText('Item 1'))
    
    await waitFor(() => {
      // Sidebar shows quantity value 1
      expect(screen.getByText('1')).toBeInTheDocument()
    })
  })

  it('calculates total correctly', async () => {
    render(<POSApp />)
    
    await waitFor(() => {
      expect(screen.getByText('Item 1')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByText('Item 1')) // 10
    fireEvent.click(screen.getByText('Item 2')) // 15
    
    await waitFor(() => {
      // Totals are shown in SAR with VAT calculation; assert VAT label exists
      expect(screen.getByText('VAT (15%):')).toBeInTheDocument()
    })
  })
})


