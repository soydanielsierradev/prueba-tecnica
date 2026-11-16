import type { User } from './types'

export function filterUsers(users: User[], term: string): User[] {
  const query = term.trim().toLowerCase()

  if (!query) return users

  return users.filter((user) => user.name.toLowerCase().includes(query))
}
