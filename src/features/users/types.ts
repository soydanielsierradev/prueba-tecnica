// Only the fields the UI reads; the API returns more (address, phone, website…).
export interface User {
  id: number
  name: string
  username: string
  email: string
  company: { name: string }
}
