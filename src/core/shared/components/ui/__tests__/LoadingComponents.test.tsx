import { render, screen } from '@testing-library/react'
import { LoadingSpinner, LoadingSkeleton, LoadingCard } from '../LoadingComponents'

describe('LoadingComponents', () => {
  describe('LoadingSpinner', () => {
    it('renders with default size', () => {
      render(<LoadingSpinner />)
      const spinner = screen.getByTestId('loading-spinner')
      expect(spinner).toBeInTheDocument()
      expect(spinner).toHaveClass('w-6', 'h-6')
    })

    it('renders with custom size', () => {
      render(<LoadingSpinner size="large" />)
      const spinner = screen.getByTestId('loading-spinner')
      expect(spinner).toHaveClass('w-8', 'h-8')
    })

    it('renders with custom text', () => {
      render(<LoadingSpinner text="Custom loading..." />)
      expect(screen.getByText('Custom loading...')).toBeInTheDocument()
    })
  })

  describe('LoadingSkeleton', () => {
    it('renders with default props', () => {
      render(<LoadingSkeleton />)
      const skeleton = screen.getByTestId('loading-skeleton')
      expect(skeleton).toBeInTheDocument()
    })

    it('renders with custom height', () => {
      render(<LoadingSkeleton height="h-20" />)
      const skeleton = screen.getByTestId('loading-skeleton')
      expect(skeleton).toHaveClass('h-20')
    })
  })

  describe('LoadingCard', () => {
    it('renders loading card with skeleton', () => {
      render(<LoadingCard />)
      expect(screen.getByTestId('loading-card')).toBeInTheDocument()
      expect(screen.getAllByTestId('loading-skeleton')).toHaveLength(3)
    })
  })
})
