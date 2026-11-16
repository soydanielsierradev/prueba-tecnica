import { users } from '@/test/fixtures'
import { filterUsers } from './filterUsers'

const names = (list: { name: string }[]) => list.map((user) => user.name)

describe('filterUsers', () => {
  it('returns every user when the term is empty', () => {
    expect(filterUsers(users, '')).toEqual(users)
  })

  it('matches names case-insensitively', () => {
    expect(names(filterUsers(users, 'leanne'))).toEqual(['Leanne Graham'])
    expect(names(filterUsers(users, 'GRAHAM'))).toEqual(['Leanne Graham'])
  })

  it('matches any substring of the name', () => {
    expect(names(filterUsers(users, 'ent'))).toEqual(['Clementine Bauch'])
  })

  it('returns an empty list when nobody matches', () => {
    expect(filterUsers(users, 'zzz')).toEqual([])
  })

  it('ignores leading and trailing spaces', () => {
    expect(names(filterUsers(users, '  ervin  '))).toEqual(['Ervin Howell'])
    expect(filterUsers(users, '   ')).toEqual(users)
  })

  it('does not mutate the original list', () => {
    const original = [...users]

    filterUsers(users, 'leanne')

    expect(users).toEqual(original)
  })
})
