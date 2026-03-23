import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Calendar, Users, MapPin, Tag, Search, Filter } from 'lucide-react'
import Image from 'next/image'
import { Booking } from '@/types'
import BookingActions from '@/components/BookingActions'

export default async function AdminBookingsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user || user.email !== 'duocore0101@gmail.com') {
    redirect('/')
  }

  const { data: bookings, error } = await supabase
    .from('bookings')
    .select(`
      *,
      tour:tours (*)
    `)
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-muted/20 pb-20 pt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass border-b border-gray-100 dark:border-slate-800 p-8 rounded-[2rem] mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="text-5xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">Global Bookings</h1>
              <p className="text-secondary font-medium tracking-wide uppercase text-[10px]">Rawat Tours & Travels Reservation Manager</p>
            </div>
          <div className="flex gap-2 w-full md:w-auto">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search bookings..." 
                className="w-full bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <button className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 p-2 rounded-xl">
              <Filter className="h-5 w-5 text-secondary" />
            </button>
          </div>
        </div>

        {error ? (
          <p className="text-red-500">Error loading bookings: {error.message}</p>
        ) : (
          <div className="glass bg-white/50 dark:bg-slate-900/50 rounded-3xl overflow-hidden border border-white shadow-sm">
            <table className="w-full text-left">
              <thead className="bg-muted/30 text-[10px] uppercase tracking-widest text-secondary font-bold border-b border-gray-100 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-4">Tour & Customer</th>
                  <th className="px-6 py-4">Travel Date</th>
                  <th className="px-6 py-4">Pax</th>
                  <th className="px-6 py-4">Total Price</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-slate-800/50">
                {bookings?.map((booking: any) => (
                  <tr key={booking.id} className="hover:bg-white/80 dark:hover:bg-slate-800/80 transition-colors group">
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl overflow-hidden relative flex-shrink-0">
                          <Image src={booking.tour?.image_url} alt="" fill className="object-cover" />
                        </div>
                        <div>
                          <p className="text-sm font-bold">{booking.tour?.title}</p>
                          <p className="text-xs text-secondary">{booking.user_id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6 text-sm font-medium">
                      {new Date(booking.date).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                    </td>
                    <td className="px-6 py-6 text-sm font-medium">{booking.people}</td>
                    <td className="px-6 py-6 text-sm font-extrabold text-primary">
                      ₹{((booking.tour?.price || 0) * booking.people).toLocaleString()}
                    </td>
                    <td className="px-6 py-6 text-sm">
                      <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                        booking.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' :
                        booking.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-6">
                      <BookingActions bookingId={booking.id} status={booking.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
