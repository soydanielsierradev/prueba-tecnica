import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { API_URL } from '@/shared/api/client'
import { renderWithClient } from '@/test/renderWithClient'
import { server } from '@/test/server'
import { UserList } from './UserList'

function renderUserList() {
  return renderWithClient(<UserList selectedUserId={null} onSelectUser={() => {}} />)
}

describe('UserList', () => {
  it('shows a loading state, then lets the user filter by name', async () => {
    const user = userEvent.setup()
    renderUserList()

    expect(screen.getByRole('status', { name: 'Loading users' })).toBeInTheDocument()

    expect(await screen.findByRole('button', { name: /Leanne Graham/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Ervin Howell/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Clementine Bauch/ })).toBeInTheDocument()

    const search = screen.getByRole('searchbox', { name: 'Search users by name' })
    await user.type(search, 'leanne')

    expect(screen.getByRole('button', { name: /Leanne Graham/ })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Ervin Howell/ })).not.toBeInTheDocument()

    await user.clear(search)
    await user.type(search, 'zzz')

    expect(screen.getByText('No users match "zzz"')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Leanne Graham/ })).not.toBeInTheDocument()
  })

  it('shows an error with a retry action when users fail to load', async () => {
    const user = userEvent.setup()
    server.use(http.get(`${API_URL}/users`, () => new HttpResponse(null, { status: 500 })))
    renderUserList()

    const alert = await screen.findByRole('alert')
    expect(alert).toHaveTextContent("Couldn't load users")

    server.resetHandlers()
    await user.click(screen.getByRole('button', { name: 'Retry' }))

    expect(await screen.findByRole('button', { name: /Leanne Graham/ })).toBeInTheDocument()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })
})
