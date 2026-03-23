'use client'

import { useState } from 'react'
import { updateBookingStatus } from '@/app/admin/bookings/actions'
import { Check, X, Loader2 } from 'lucide-react'

export default function BookingActions({ bookingId, status }: { bookingId: string, status: string }) {
  const [loading, setLoading] = useState<string | null>(null)

  const handleUpdate = async (newStatus: 'confirmed' | 'cancelled') => {
    setLoading(newStatus)
    try {
      await updateBookingStatus(bookingId, newStatus)
    } catch (error) {
      alert('Failed to update status')
    } finally {
      setLoading(null)
    }
  }

  if (status !== 'pending') return null

  return (
    <div className="flex gap-3">
      <button 
        onClick={() => handleUpdate('confirmed')}
        disabled={!!loading}
        className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg hover:bg-emerald-100 transition-all disabled:opacity-50"
      >
        {loading === 'confirmed' ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3 w-3" />}
        Confirm
      </button>
      <button 
        onClick={() => handleUpdate('cancelled')}
        disabled={!!loading}
        className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-red-600 bg-red-50 px-3 py-1.5 rounded-lg hover:bg-red-100 transition-all disabled:opacity-50"
      >
        {loading === 'cancelled' ? <Loader2 className="h-3 w-3 animate-spin" /> : <X className="h-3 w-3" />}
        Cancel
      </button>
    </div>
  )
}
