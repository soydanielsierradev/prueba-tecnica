import { screen } from '@testing-library/react'
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
})
