import { Loader2 } from "lucide-react"

export function Loading() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full blur-xl opacity-20 animate-pulse"></div>
          <Loader2 className="h-12 w-12 animate-spin text-primary relative" />
        </div>
        <p className="text-muted-foreground text-lg font-medium">Loading...</p>
        <p className="text-xs text-muted-foreground/80">Please wait while we prepare your data</p>
      </div>
    </div>
  )
}