import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Calendar, Users, MapPin, Tag, Clock } from 'lucide-react'
import Image from 'next/image'
import { Booking } from '@/types'

export default async function MyBookingsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: bookings, error } = await supabase
    .from('bookings')
    .select(`
      *,
      tour:tours (*)
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-muted/20 pb-20 pt-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-2">My Bookings</h1>
          <p className="text-secondary">Keep track of your adventures and upcoming travels.</p>
        </div>

        {error ? (
          <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 p-8 rounded-3xl text-center">
            <p className="text-red-500 font-medium text-lg">Failed to retrieve bookings. Please try refreshing the page.</p>
          </div>
        ) : bookings && bookings.length > 0 ? (
          <div className="space-y-6">
            {bookings.map((booking: Booking) => (
              <div key={booking.id} className="glass bg-white/80 dark:bg-slate-900/80 rounded-3xl p-6 shadow-sm border border-white hover:shadow-md transition-all flex flex-col md:flex-row gap-8 items-center">
                {/* Tour Image Thumbnail */}
                <div className="relative h-40 w-full md:w-64 rounded-2xl overflow-hidden flex-shrink-0">
                  <Image
                    src={booking.tour?.image_url || 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1'}
                    alt={booking.tour?.title || 'Tour'}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Booking Info */}
                <div className="flex-grow w-full space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                        {booking.tour?.title}
                      </h3>
                      <div className="flex items-center space-x-1 text-primary text-sm font-semibold">
                        <MapPin className="h-4 w-4" />
                        <span>{booking.tour?.location}</span>
                      </div>
                    </div>
                    <div className={`px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      booking.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' :
                      booking.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {booking.status}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-y border-gray-100 dark:border-slate-800">
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase tracking-widest text-secondary font-bold">Departure Date</span>
                      <div className="flex items-center gap-2 text-sm font-semibold">
                        <Calendar className="h-4 w-4 text-primary" />
                        <span>{new Date(booking.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase tracking-widest text-secondary font-bold">People</span>
                      <div className="flex items-center gap-2 text-sm font-semibold">
                        <Users className="h-4 w-4 text-primary" />
                        <span>{booking.people} {booking.people > 1 ? 'Adults' : 'Adult'}</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase tracking-widest text-secondary font-bold">Total Cost</span>
                      <div className="flex items-center gap-2 text-sm font-semibold">
                        <Tag className="h-4 w-4 text-primary" />
                        <span>₹{(booking.tour?.price || 0) * booking.people}</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase tracking-widest text-secondary font-bold">Order ID</span>
                      <div className="flex items-center gap-2 text-sm font-semibold font-mono text-gray-400">
                        <span>#{booking.id.slice(0, 8)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-gray-200 dark:border-slate-800">
            <div className="inline-flex items-center justify-center p-6 bg-muted rounded-full mb-6">
              <Calendar className="h-10 w-10 text-secondary" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">No Bookings Yet</h3>
            <p className="text-secondary max-w-sm mx-auto mb-8">Ready to start your next adventure? Explore our curated tours and find your perfect destination.</p>
            <a 
              href="/tours" 
              className="inline-flex items-center space-x-2 bg-primary text-white px-8 py-3 rounded-2xl font-bold hover:bg-opacity-90 transition-all shadow-lg shadow-primary/20"
            >
              Explore Tours
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
