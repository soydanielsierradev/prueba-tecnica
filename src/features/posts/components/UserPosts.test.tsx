import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { API_URL } from '@/shared/api/client'
import { users } from '@/test/fixtures'
import { renderWithClient } from '@/test/renderWithClient'
import { server } from '@/test/server'
import { UserPosts } from './UserPosts'

const leanne = users[0]

function renderUserPosts() {
  return renderWithClient(<UserPosts author={leanne} onBack={() => {}} />)
}

describe('UserPosts', () => {
  it("shows a loading state, then the user's posts with a header", async () => {
    renderUserPosts()

    expect(screen.getByRole('heading', { name: 'Leanne Graham' })).toBeInTheDocument()
    expect(screen.getByRole('status', { name: 'Loading posts' })).toBeInTheDocument()

    const list = await screen.findByRole('list', { name: 'Posts' })
    const titles = within(list)
      .getAllByRole('heading')
      .map((heading) => heading.textContent)
    expect(titles).toEqual(['First post by Leanne', 'Second post by Leanne'])

    expect(screen.getByText(/Sincere@april\.biz/)).toHaveTextContent('Romaguera-Crona')
    expect(screen.getByText('2 posts')).toBeInTheDocument()
  })

  it('shows an error with a retry action when posts fail to load', async () => {
    const user = userEvent.setup()
    server.use(
      http.get(`${API_URL}/users/:userId/posts`, () => new HttpResponse(null, { status: 500 })),
    )
    renderUserPosts()

    expect(await screen.findByRole('alert')).toHaveTextContent("Couldn't load posts")

    server.resetHandlers()
    await user.click(screen.getByRole('button', { name: 'Retry' }))

    expect(await screen.findByRole('list', { name: 'Posts' })).toBeInTheDocument()
  })
})
