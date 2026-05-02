'use client'

import { useState } from 'react'
import { Trash2, Loader2 } from 'lucide-react'
import { deleteTour } from '@/app/admin/tours/actions'
import { useRouter } from 'next/navigation'

export default function DeleteTourButton({ tourId }: { tourId: string }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this tour? This action cannot be undone.')) {
      return
    }

    setLoading(true)
    try {
      await deleteTour(tourId)
      router.refresh()
    } catch (error: any) {
      alert('Failed to delete tour: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button 
      onClick={handleDelete}
      disabled={loading}
      className="flex-grow md:flex-none flex items-center justify-center gap-2 p-3 bg-red-50 text-red-600 rounded-2xl hover:bg-red-100 transition-all font-bold disabled:opacity-50"
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
      <span>{loading ? 'Deleting...' : 'Delete'}</span>
    </button>
  )
}
