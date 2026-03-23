import { Loader2 } from 'lucide-react'

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted/10">
      <div className="relative">
        <Loader2 className="h-12 w-12 text-primary animate-spin" />
        <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse" />
      </div>
      <p className="mt-6 text-sm font-semibold text-secondary animate-pulse uppercase tracking-widest">
        Preparing your adventure...
      </p>
    </div>
  )
}
