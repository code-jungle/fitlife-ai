import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import ErrorBoundary from '../ErrorBoundary'

// Componente que sempre falha para testar o ErrorBoundary
const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error')
  }
  return <div>No error</div>
}

describe('ErrorBoundary', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Mock console.error para evitar logs nos testes
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  it('should render children when there is no error', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>
    )

    expect(screen.getByText('No error')).toBeInTheDocument()
  })

  it('should render error UI when there is an error', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )

    expect(screen.getByText('Oops! Algo deu errado')).toBeInTheDocument()
    expect(screen.getByText('Ocorreu um erro inesperado. Nossa equipe foi notificada e está trabalhando para resolver o problema.')).toBeInTheDocument()
  })

  it('should show retry button when there is an error', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )

    expect(screen.getByText('Tentar Novamente')).toBeInTheDocument()
  })

  it('should reset error state when retry is clicked', () => {
    const { rerender } = render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )

    expect(screen.getByText('Oops! Algo deu errado')).toBeInTheDocument()

    // Simular clique no botão de retry
    const retryButton = screen.getByText('Tentar Novamente')
    retryButton.click()

    // Re-renderizar com erro resolvido
    rerender(
      <ErrorBoundary>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>
    )

    expect(screen.getByText('No error')).toBeInTheDocument()
  })
})
