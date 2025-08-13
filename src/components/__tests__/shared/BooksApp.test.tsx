import { render, screen, waitFor } from '@testing-library/react'
import { BooksApp } from '../../shared/BooksApp'
import { configureSupabaseMockData } from '@/lib/__mocks__/supabase-auth-helpers-nextjs'

// Seed Supabase mock with orders that map to invoices in BooksApp
beforeEach(() => {
  configureSupabaseMockData({
    orders: [
      {
        id: 'o1',
        order_number: '1001',
        subtotal: 100,
        tax_amount: 15,
        total_amount: 115,
        created_at: new Date().toISOString(),
        payment_status: 'paid',
        metadata: { vat_number: '1234567890' },
        customer_id: 'Cust A',
      },
    ],
  })
})

describe('BooksApp', () => {
  it('renders books management interface', async () => {
    render(<BooksApp />)
    // BooksApp heading in shared component is Accounting Management System
    await waitFor(() => {
      expect(screen.getByText('Accounting Management System')).toBeInTheDocument()
    })
  })

  it('displays invoices table after loading', async () => {
    render(<BooksApp />)
    await waitFor(() => {
      expect(screen.getByText('Invoices')).toBeInTheDocument()
    })
  })

  it('displays loading state initially', () => {
    render(<BooksApp />)
    // Shared BooksApp uses generic Loading...
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })
})


