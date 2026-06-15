import { Link } from 'react-router-dom'
import { Home, ArrowLeft } from "lucide-react"
import { Button } from "./button"

export function NotFound() {
  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="flex flex-col items-center space-y-6 text-center max-w-md px-4">
        <div className="bg-blue-100 p-6 rounded-2xl">
          <Home className="h-16 w-16 text-blue-600" />
        </div>
        <h1 className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
          404
        </h1>
        <h2 className="text-2xl font-semibold">Page not found</h2>
        <p className="text-muted-foreground max-w-md">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Button asChild className="mt-4">
          <Link to="/" className="inline-flex items-center space-x-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Go back home</span>
          </Link>
        </Button>
      </div>
    </div>
  )
}