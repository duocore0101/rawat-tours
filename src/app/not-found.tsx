import Link from 'next/link'
import { MapPinOff, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center bg-muted/10 px-4">
      <div className="glass p-12 rounded-[3rem] shadow-2xl border border-white/40 text-center max-w-lg w-full animate-in zoom-in duration-500">
        <div className="inline-flex items-center justify-center p-6 bg-red-50 dark:bg-red-900/10 rounded-full mb-8">
          <MapPinOff className="h-12 w-12 text-red-500" />
        </div>
        <h1 className="text-6xl font-black text-gray-900 dark:text-white mb-4">404</h1>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">Destination Not Found</h2>
        <p className="text-secondary mb-10 leading-relaxed">
          It seems you've wandered off the beaten path. This destination doesn't exist in our itinerary.
        </p>
        <Link 
          href="/" 
          className="inline-flex items-center space-x-2 bg-primary text-white px-8 py-4 rounded-2xl font-bold hover:bg-opacity-90 transition-all shadow-lg shadow-primary/20"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Home</span>
        </Link>
      </div>
    </div>
  )
}
