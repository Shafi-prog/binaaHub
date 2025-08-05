import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { DataCard } from '../DataCard'

describe('DataCard', () => {
  const mockData = [
    { id: 1, name: 'Test Item 1', value: 100 },
    { id: 2, name: 'Test Item 2', value: 200 },
  ]

  it('renders loading state', () => {
    render(<DataCard title="Test Card" data={[]} loading={true} />)
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('renders data correctly', () => {
    render(<DataCard title="Test Card" data={mockData} />)
    expect(screen.getByText('Test Card')).toBeInTheDocument()
    expect(screen.getByText('Test Item 1')).toBeInTheDocument()
    expect(screen.getByText('Test Item 2')).toBeInTheDocument()
  })

  it('renders empty state when no data', () => {
    render(<DataCard title="Test Card" data={[]} />)
    expect(screen.getByText('No data available')).toBeInTheDocument()
  })

  it('handles refresh action', async () => {
    const mockOnRefresh = jest.fn()
    render(<DataCard title="Test Card" data={mockData} onRefresh={mockOnRefresh} />)
    
    const refreshButton = screen.getByRole('button', { name: /refresh/i })
    fireEvent.click(refreshButton)
    
    await waitFor(() => {
      expect(mockOnRefresh).toHaveBeenCalledTimes(1)
    })
  })
})
