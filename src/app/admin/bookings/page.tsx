import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Calendar, Users, MapPin, Tag, Search, Filter } from 'lucide-react'
import Image from 'next/image'
import { Booking } from '@/types'
import Link from 'next/link'
import BookingActions from '@/components/BookingActions'
import WhatsAppButton from '@/components/WhatsAppButton'

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
    .eq('status', 'pending')
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-muted/20 pb-20 pt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass border-b border-gray-100 dark:border-slate-800 p-6 sm:p-8 rounded-[2rem] mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative">
            <Link 
              href="/admin" 
              className="absolute -top-12 left-2 text-sm font-bold text-secondary hover:text-primary transition-colors flex items-center gap-2"
            >
              ← Back to Dashboard
            </Link>
            <div>
              <h1 className="text-2xl sm:text-5xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">Pending Requests</h1>
              <p className="text-secondary font-medium tracking-wide uppercase text-[10px]">Review and confirm customer reservations</p>
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
          <div className="flex gap-4 mb-8">
            <Link 
              href="/admin/bookings" 
              className="px-6 py-2 rounded-xl font-bold bg-primary text-white shadow-lg shadow-primary/20"
            >
              Pending Requests
            </Link>
            <Link 
              href="/admin/bookings/active" 
              className="px-6 py-2 rounded-xl font-bold bg-white dark:bg-slate-900 text-secondary hover:text-primary transition-all border border-gray-100 dark:border-slate-800"
            >
              Active Bookings
            </Link>
          </div>
          </div>
        
        {error ? (
          <p className="text-red-500">Error loading bookings: {error.message}</p>
        ) : (
          <div className="glass bg-white/50 dark:bg-slate-900/50 rounded-2xl sm:rounded-3xl overflow-hidden border border-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[800px]">
                <thead className="bg-muted/30 text-[10px] uppercase tracking-widest text-secondary font-bold border-b border-gray-100 dark:border-slate-800">
                  <tr>
                    <th className="px-4 sm:px-6 py-4">Tour & Customer</th>
                    <th className="px-4 sm:px-6 py-4">Travel Date</th>
                    <th className="px-4 sm:px-6 py-4">Pax</th>
                    <th className="px-4 sm:px-6 py-4">Total Price</th>
                    <th className="px-4 sm:px-6 py-4">Status</th>
                    <th className="px-4 sm:px-6 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-slate-800/50">
                  {bookings?.map((booking: any) => (
                    <tr key={booking.id} className="hover:bg-white/80 dark:hover:bg-slate-800/80 transition-colors group text-gray-900 dark:text-white">
                      <td className="px-4 sm:px-6 py-4 sm:py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl overflow-hidden relative flex-shrink-0">
                            <Image 
                              src={booking.tour?.image_url?.split(',')?.find((u: string) => u && !u.includes('istockphoto.com') && !u.toLowerCase().match(/\.(mp4|webm|mov|ogg)$/)) || 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1'} 
                              alt={booking.tour?.title || 'Tour'} 
                              fill 
                              className="object-cover" 
                            />
                          </div>
                          <div>
                            <p className="text-xs sm:text-sm font-bold line-clamp-1 max-w-[150px] sm:max-w-xs">{booking.tour?.title}</p>
                            <div className="flex flex-col mt-1">
                              <p className="text-[10px] sm:text-xs font-bold text-gray-900 dark:text-white">{booking.customer_name || 'No Name'}</p>
                              <p className="text-[10px] sm:text-[11px] text-primary font-medium">{booking.customer_phone || 'No Phone'}</p>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 sm:py-6 text-xs sm:text-sm font-medium">
                        {new Date(booking.date).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                      </td>
                      <td className="px-4 sm:px-6 py-4 sm:py-6 text-xs sm:text-sm font-medium">{booking.people}</td>
                      <td className="px-4 sm:px-6 py-4 sm:py-6 text-xs sm:text-sm font-extrabold text-primary">
                        ₹{((booking.tour?.price || 0) * booking.people).toLocaleString()}
                      </td>
                      <td className="px-4 sm:px-6 py-4 sm:py-6 text-xs sm:text-sm">
                        <span className={`px-2 py-1 rounded-md text-[9px] sm:text-[10px] font-bold uppercase tracking-wider ${
                          booking.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' :
                          booking.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-4 sm:py-6">
                        <div className="flex items-center gap-2">
                          <BookingActions 
                            bookingId={booking.id} 
                            status={booking.status} 
                            bookingData={{
                              customer_name: booking.customer_name || 'Guest',
                              customer_phone: booking.customer_phone || '',
                              tour_title: booking.tour?.title || 'Unknown Tour',
                              date: booking.date,
                              people: booking.people,
                              price: booking.tour?.price || 0
                            }}
                          />
                          <WhatsAppButton 
                            customerName={booking.customer_name || 'Guest'}
                            tourTitle={booking.tour?.title || 'Unknown Tour'}
                            date={booking.date}
                            people={booking.people}
                            price={booking.tour?.price || 0}
                            customerPhone={booking.customer_phone || ''}
                            status={booking.status}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
