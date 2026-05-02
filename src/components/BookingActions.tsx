'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { updateBookingStatus } from '@/app/admin/bookings/actions'
import { Check, X, Loader2 } from 'lucide-react'

interface BookingActionsProps {
  bookingId: string
  status: string
  bookingData: {
    customer_name: string
    customer_phone: string
    tour_title: string
    date: string
    people: number
    price: number
  }
}

export default function BookingActions({ bookingId, status, bookingData }: BookingActionsProps) {
  const [loading, setLoading] = useState<string | null>(null)
  const router = useRouter()

  const handleUpdate = async (newStatus: 'confirmed' | 'cancelled') => {
    setLoading(newStatus)
    try {
      await updateBookingStatus(bookingId, newStatus)
      router.refresh()
      
      if (newStatus === 'confirmed') {
        const message = encodeURIComponent(
          `✅ *Booking Confirmed!* ✅\n\n` +
          `Hello *${bookingData.customer_name}*,\n` +
          `We have received your payment. Your booking for *${bookingData.tour_title}* is now officially **CONFIRMED**!\n\n` +
          `📅 *Date:* ${new Date(bookingData.date).toLocaleDateString()}\n` +
          `👥 *Travelers:* ${bookingData.people}\n` +
          `💰 *Total Amount:* ₹${(bookingData.price * bookingData.people).toLocaleString()} (Paid)\n\n` +
          `Thank you for choosing *Rawat Tours & Travels*! We look forward to seeing you.`
        )
        window.open(`https://wa.me/${bookingData.customer_phone.replace(/[^0-9]/g, '')}?text=${message}`, '_blank')
      }
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
