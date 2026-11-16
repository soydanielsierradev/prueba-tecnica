import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithClient } from '@/test/renderWithClient'
import App from './App'

describe('App', () => {
  it('renders the app title', async () => {
    renderWithClient(<App />)

    expect(screen.getByRole('heading', { name: 'User Posts Explorer' })).toBeInTheDocument()
    // Let the users request settle so it does not leak into other tests.
    expect(await screen.findByRole('button', { name: /Leanne Graham/ })).toBeInTheDocument()
  })

  it('marks the clicked user as selected and replaces the placeholder', async () => {
    const user = userEvent.setup()
    renderWithClient(<App />)

    expect(screen.getByText('Select a user to see their posts')).toBeInTheDocument()

    const leanne = await screen.findByRole('button', { name: /Leanne Graham/ })
    await user.click(leanne)

    expect(leanne).toHaveAttribute('aria-current', 'true')
    expect(screen.queryByText('Select a user to see their posts')).not.toBeInTheDocument()
  })

  describe('on a mobile viewport', () => {
    beforeEach(() => {
      vi.stubGlobal('matchMedia', (query: string) => ({
        matches: query === '(max-width: 767px)',
        media: query,
        addEventListener: () => {},
        removeEventListener: () => {},
      }))
    })

    afterEach(() => {
      vi.unstubAllGlobals()
    })

    it('moves focus to the posts heading and back to the user when returning', async () => {
      const user = userEvent.setup()
      renderWithClient(<App />)

      await user.click(await screen.findByRole('button', { name: /Leanne Graham/ }))
      expect(screen.getByRole('heading', { name: 'Leanne Graham' })).toHaveFocus()

      await user.click(screen.getByRole('button', { name: 'Back to users' }))
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Leanne Graham/ })).toHaveFocus()
      })
    })
  })
})
