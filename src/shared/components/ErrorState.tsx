import { AlertCircle, RotateCw } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'

interface ErrorStateProps {
  title: string
  message?: string
  onRetry?: () => void
}

export function ErrorState({ title, message, onRetry }: ErrorStateProps) {
  return (
    <Alert variant="destructive">
      <AlertCircle />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription className="flex flex-col items-start gap-3">
        {message && <p>{message}</p>}
        {onRetry && (
          <Button variant="outline" size="sm" onClick={onRetry}>
            <RotateCw />
            Retry
          </Button>
        )}
      </AlertDescription>
    </Alert>
  )
}
