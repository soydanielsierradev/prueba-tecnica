import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface UserSearchProps {
  value: string
  onChange: (value: string) => void
}

export function UserSearch({ value, onChange }: UserSearchProps) {
  return (
    <div className="relative">
      <Label htmlFor="user-search" className="sr-only">
        Search users by name
      </Label>
      <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        id="user-search"
        type="search"
        placeholder="Search by name"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="pl-8"
      />
    </div>
  )
}
