import { screen } from '@testing-library/react'
import { renderWithClient } from '@/test/renderWithClient'
import App from './App'

describe('App', () => {
  it('renders the app title', async () => {
    renderWithClient(<App />)

    expect(screen.getByRole('heading', { name: 'User Posts Explorer' })).toBeInTheDocument()
    // Let the users request settle so it does not leak into other tests.
    expect(await screen.findByRole('button', { name: /Leanne Graham/ })).toBeInTheDocument()
  })
})
