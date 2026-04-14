import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import App from './App'

describe('App score flow', () => {
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
})
