'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Calendar, Users, CheckCircle2, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function BookingForm({ tourId, price }: { tourId: string, price: number }) {
  const [date, setDate] = useState('')
  const [people, setPeople] = useState(1)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const supabase = createClient()
  const router = useRouter()

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      router.push('/login')
      return
    }

    const { error } = await supabase.from('bookings').insert({
      tour_id: tourId,
      user_id: user.id,
      date,
      people,
      status: 'pending'
    })

    if (error) {
      setError(error.message)
    } else {
      setSuccess(true)
    }
    setLoading(false)
  }

  if (success) {
    return (
      <div className="bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/20 p-8 rounded-3xl text-center animate-in zoom-in duration-500">
        <div className="inline-flex items-center justify-center p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-full mb-4">
          <CheckCircle2 className="h-8 w-8 text-emerald-600" />
        </div>
        <h3 className="text-xl font-bold text-emerald-900 dark:text-emerald-400 mb-2">Booking Requested!</h3>
        <p className="text-emerald-700 dark:text-emerald-500 text-sm mb-6">Your adventure is one step closer. We'll notify you once confirmed.</p>
        <button 
          onClick={() => router.push('/my-bookings')}
          className="bg-emerald-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-emerald-700 transition-all"
        >
          View My Bookings
        </button>
      </div>
    )
  }

  return (
    <div className="glass p-8 rounded-3xl shadow-xl border border-white/40 sticky top-24">
      <h3 className="text-2xl font-bold mb-6">Book This Tour</h3>
      
      <form onSubmit={handleBooking} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            <span>Select Date</span>
          </label>
          <input
            type="date"
            required
            min={new Date().toISOString().split('T')[0]}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary/50 text-sm transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            <span>Number of Travelers</span>
          </label>
          <input
            type="number"
            min="1"
            max="10"
            required
            value={people}
            onChange={(e) => setPeople(parseInt(e.target.value))}
            className="w-full bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary/50 text-sm transition-all"
          />
        </div>

        <div className="pt-4 border-t border-gray-100 dark:border-slate-800">
          <div className="flex justify-between items-center mb-6">
            <span className="text-secondary font-medium">Total Price</span>
            <span className="text-3xl font-extrabold text-primary">₹{price * people}</span>
          </div>

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/90 text-white py-4 rounded-2xl font-bold flex items-center justify-center space-x-2 transition-all shadow-lg shadow-primary/25 disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <span>Confirm Booking</span>}
          </button>
        </div>
      </form>
    </div>
  )
}
