import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Image from 'next/image'
import {
  LayoutDashboard,
  Map as MapIcon,
  CalendarCheck,
  Users,
  Plus,
  TrendingUp,
  CheckCircle,
  Clock,
  DollarSign
} from 'lucide-react'
import Link from 'next/link'

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user || user.email !== 'duocore0101@gmail.com') {
    redirect('/')
  }

  const { data: tours } = await supabase.from('tours').select('*')
  const { data: bookings } = await supabase.from('bookings').select('*, tour:tours(price)')

  const totalRevenue = bookings?.reduce((acc, b: any) => acc + (b.tour?.price * b.people), 0) || 0
  const activeBookings = bookings?.filter(b => b.status === 'confirmed').length || 0
  const pendingBookings = bookings?.filter(b => b.status === 'pending').length || 0

  return (
    <div className="min-h-screen bg-muted/20 pb-20">
      <div className="glass border-b border-gray-100 dark:border-slate-800 pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="text-5xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">Admin Console</h1>
              <p className="text-secondary font-medium tracking-wide uppercase text-[10px]">Rawat Tours & Travels Management</p>
            </div>
            <Link
              href="/admin/tours/new"
              className="bg-primary text-white px-6 py-3 rounded-2xl font-bold flex items-center space-x-2 hover:bg-opacity-90 transition-all shadow-lg shadow-primary/20"
            >
              <Plus className="h-5 w-5" />
              <span>Add New Tour</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard title="Total Revenue" value={`₹${totalRevenue.toLocaleString()}`} icon={<DollarSign className="text-emerald-500" />} change="+12%" />
          <StatCard title="Total Tours" value={tours?.length || 0} icon={<MapIcon className="text-blue-500" />} />
          <StatCard title="Active Bookings" value={activeBookings} icon={<CheckCircle className="text-emerald-500" />} />
          <StatCard title="Pending" value={pendingBookings} icon={<Clock className="text-amber-500" />} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Bookings */}
          <div className="lg:col-span-2 glass bg-white/50 dark:bg-slate-900/50 rounded-3xl p-8 border border-white shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <CalendarCheck className="h-5 w-5 text-primary" />
                <span>Recent Bookings</span>
              </h3>
              <Link href="/admin/bookings" className="text-sm font-bold text-primary hover:underline underline-offset-4">View All</Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="text-[10px] uppercase tracking-widest text-secondary font-bold border-b border-gray-100 dark:border-slate-800">
                  <tr>
                    <th className="pb-4 pt-2">Tour ID</th>
                    <th className="pb-4 pt-2">Date</th>
                    <th className="pb-4 pt-2">People</th>
                    <th className="pb-4 pt-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-slate-800/50">
                  {bookings?.slice(0, 5).map((booking: any) => (
                    <tr key={booking.id} className="group">
                      <td className="py-4 text-sm font-semibold font-mono text-gray-400 group-hover:text-primary transition-colors">#{booking.id.slice(0, 8)}</td>
                      <td className="py-4 text-sm font-medium">{new Date(booking.date).toLocaleDateString()}</td>
                      <td className="py-4 text-sm font-medium">{booking.people}</td>
                      <td className="py-4">
                        <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${booking.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' :
                            booking.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                              'bg-red-100 text-red-700'
                          }`}>
                          {booking.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Actions / Tours List */}
          <div className="glass bg-white/50 dark:bg-slate-900/50 rounded-3xl p-8 border border-white shadow-sm h-fit">
            <h3 className="text-xl font-bold flex items-center gap-2 mb-8">
              <MapIcon className="h-5 w-5 text-primary" />
              <span>Tours Management</span>
            </h3>
            <div className="space-y-4">
              {tours?.slice(0, 4).map((tour) => (
                <div key={tour.id} className="flex items-center justify-between p-3 bg-white dark:bg-slate-900 rounded-2xl border border-gray-50 dark:border-slate-800 hover:border-primary/30 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl overflow-hidden relative border border-gray-100">
                      <Image src={tour.image_url} alt="" fill className="object-cover" />
                    </div>
                    <div>
                      <p className="text-sm font-bold truncate max-w-[120px]">{tour.title}</p>
                      <p className="text-[10px] text-emerald-600 font-bold">₹{tour.price}</p>
                    </div>
                  </div>
                  <Link href={`/admin/tours/edit/${tour.id}`} className="text-xs font-bold text-primary hover:bg-primary/10 px-3 py-1 rounded-lg transition-all">
                    Edit
                  </Link>
                </div>
              ))}
              <Link
                href="/admin/tours"
                className="block text-center text-sm font-bold text-secondary hover:text-primary transition-all pt-4 border-t border-gray-100 dark:border-slate-800"
              >
                Manage All Tours
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ title, value, icon, change }: { title: string, value: any, icon: React.ReactNode, change?: string }) {
  return (
    <div className="glass bg-white/80 dark:bg-slate-900/80 rounded-3xl p-6 shadow-sm border border-white hover:shadow-md transition-all">
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-muted/50 dark:bg-slate-800 rounded-2xl">
          {icon}
        </div>
        {change && (
          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 px-2 py-1 rounded-lg">
            {change}
          </span>
        )}
      </div>
      <div>
        <p className="text-[10px] uppercase tracking-widest text-secondary font-bold mb-1">{title}</p>
        <p className="text-3xl font-extrabold text-gray-900 dark:text-white">{value}</p>
      </div>
    </div>
  )
}
