import { apiGet } from '@/shared/api/client'
import type { User } from './types'

export function getUsers(): Promise<User[]> {
  return apiGet<User[]>('/users')
}
