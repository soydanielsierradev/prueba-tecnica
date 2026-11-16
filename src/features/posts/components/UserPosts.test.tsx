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

  describe('creating a post', () => {
    it('shows both validation errors and sends no request when the form is empty', async () => {
      const user = userEvent.setup()
      let postRequests = 0
      server.use(
        http.post(`${API_URL}/posts`, () => {
          postRequests += 1
          return HttpResponse.json({}, { status: 201 })
        }),
      )
      renderUserPosts()
      await screen.findByRole('list', { name: 'Posts' })

      await user.click(screen.getByRole('button', { name: 'Publish' }))

      expect(await screen.findByText('Title is required')).toBeInTheDocument()
      expect(screen.getByText('Body is required')).toBeInTheDocument()
      expect(screen.getByLabelText('Title')).toHaveAttribute('aria-invalid', 'true')
      expect(postRequests).toBe(0)
    })

    it('adds the new post first and clears the form when the API succeeds', async () => {
      const user = userEvent.setup()
      renderUserPosts()
      const list = await screen.findByRole('list', { name: 'Posts' })

      await user.type(screen.getByLabelText('Title'), '  My new post  ')
      await user.type(screen.getByLabelText('Body'), 'Written in a test')
      await user.click(screen.getByRole('button', { name: 'Publish' }))

      expect(await within(list).findByText('My new post')).toBeInTheDocument()
      const [firstItem] = within(list).getAllByRole('listitem')
      expect(within(firstItem).getByRole('heading')).toHaveTextContent('My new post')
      expect(within(firstItem).getByText('New')).toBeInTheDocument()
      expect(screen.getByText('3 posts')).toBeInTheDocument()
      expect(screen.getByLabelText('Title')).toHaveValue('')
      expect(screen.getByLabelText('Body')).toHaveValue('')
    })

    it('shows an error and keeps the input when the API fails', async () => {
      const user = userEvent.setup()
      server.use(http.post(`${API_URL}/posts`, () => new HttpResponse(null, { status: 500 })))
      renderUserPosts()
      await screen.findByRole('list', { name: 'Posts' })

      await user.type(screen.getByLabelText('Title'), 'Will fail')
      await user.type(screen.getByLabelText('Body'), 'Server is down')
      await user.click(screen.getByRole('button', { name: 'Publish' }))

      expect(
        await screen.findByText("Couldn't publish the post. Please try again."),
      ).toBeInTheDocument()
      expect(screen.getByLabelText('Title')).toHaveValue('Will fail')
      expect(screen.getByLabelText('Body')).toHaveValue('Server is down')
      expect(screen.getByText('2 posts')).toBeInTheDocument()
    })
  })
})
