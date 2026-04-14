import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import App from './App'

describe('App score flow', () => {
  it('applies token preset when role changes', () => {
    render(<App />)
    fireEvent.change(screen.getByLabelText('Роль'), { target: { value: 'customer' } })

    expect(screen.getByPlaceholderText('Bearer token')).toHaveValue('customer-demo-token')
  })

  it('loads and displays maker score', async () => {
    global.fetch = vi.fn(async (url) => {
      if (String(url).includes('/furniture_makers/123456789012/score')) {
        return {
          ok: true,
          json: async () => ({
            bin_iin: '123456789012',
            score: 78,
            score_band: 'high',
            components: { recency: 80, frequency: 75, volume: 72, quality: 85 },
            insufficient_data: false,
            calculated_at: '2026-04-14T10:00:00Z',
          }),
        }
      }

      return { ok: false, json: async () => ({ error: { message: 'not mocked' } }) }
    })

    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'Получить score' }))

    await waitFor(() => {
      expect(screen.getByText(/78 \(high\)/)).toBeInTheDocument()
      expect(screen.getByText(/false/)).toBeInTheDocument()
    })
  })

  it('renders readable API error payload', async () => {
    global.fetch = vi.fn(async () => ({
      ok: false,
      status: 404,
      json: async () => ({
        error: {
          code: 'maker_not_found',
          message: 'Furniture maker not found',
          details: { bin_iin: '000000000000' },
        },
      }),
    }))

    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'Получить score' }))

    await waitFor(() => {
      expect(screen.getByText(/Furniture maker not found/)).toBeInTheDocument()
      expect(screen.getByText(/maker_not_found/)).toBeInTheDocument()
      expect(screen.getByText(/000000000000/)).toBeInTheDocument()
    })
  })
})
