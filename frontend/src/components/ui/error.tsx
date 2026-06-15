import { AlertTriangle } from "lucide-react"
import { Button } from "./button"

interface ErrorProps {
  message: string
  onRetry?: () => void
}

export function Error({ message, onRetry }: ErrorProps) {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex flex-col items-center space-y-4 text-center max-w-md px-4">
        <div className="bg-destructive/10 p-4 rounded-full">
          <AlertTriangle className="h-12 w-12 text-destructive" />
        </div>
        <h2 className="text-2xl font-bold text-destructive">Oops! Something went wrong</h2>
        <p className="text-muted-foreground">
          {message || 'An unexpected error occurred. Please try again later.'}
        </p>
        {onRetry && (
          <Button
            onClick={onRetry}
            variant="outline"
            className="mt-4"
          >
            Try again
          </Button>
        )}
      </div>
    </div>
  )
}