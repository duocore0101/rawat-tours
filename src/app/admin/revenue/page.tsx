import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  Calendar,
  ArrowUpRight,
  Map as MapIcon,
  ChevronRight
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import ExportRevenueButton from '@/components/ExportRevenueButton'

export default async function RevenuePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user || user.email !== 'duocore0101@gmail.com') {
    redirect('/')
  }

  // Fetch only confirmed bookings for revenue calculation
  const { data: bookings, error } = await supabase
    .from('bookings')
    .select(`
      *,
      tour:tours (*)
    `)
    .eq('status', 'confirmed')
    .order('created_at', { ascending: false })

  if (error) {
    return <div className="p-8 text-red-500">Error loading revenue data: {error.message}</div>
  }

  const totalRevenue = bookings?.reduce((acc, b: any) => acc + (b.tour?.price * b.people), 0) || 0
  const avgOrderValue = bookings?.length ? totalRevenue / bookings.length : 0
  const totalTravelers = bookings?.reduce((acc, b: any) => acc + b.people, 0) || 0

  // Calculate revenue per tour
  const tourRevenue: Record<string, { title: string, revenue: number, count: number, image: string }> = {}
  bookings?.forEach((b: any) => {
    if (b.tour) {
      if (!tourRevenue[b.tour.id]) {
        tourRevenue[b.tour.id] = { 
          title: b.tour.title, 
          revenue: 0, 
          count: 0,
          image: b.tour.image_url?.split(',')[0]
        }
      }
      tourRevenue[b.tour.id].revenue += b.tour.price * b.people
      tourRevenue[b.tour.id].count += 1
    }
  })

  const topTours = Object.values(tourRevenue).sort((a, b) => b.revenue - a.revenue)

  return (
    <div className="min-h-screen bg-muted/20 pb-20 pt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <Link 
              href="/admin" 
              className="text-sm font-bold text-secondary hover:text-primary transition-colors flex items-center gap-2 mb-4"
            >
              ← Back to Dashboard
            </Link>
            <h1 className="text-4xl sm:text-5xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">Revenue Analytics</h1>
            <p className="text-secondary font-medium tracking-wide uppercase text-[10px]">Financial Performance & Booking Insights</p>
          </div>
          <div className="bg-white dark:bg-slate-900 px-6 py-4 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-emerald-100 rounded-2xl">
              <TrendingUp className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-secondary uppercase tracking-widest">Growth</p>
              <p className="text-xl font-black text-emerald-600">+24.5%</p>
            </div>
          </div>
        </div>

        {/* Top Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <SummaryCard 
            title="Total Revenue" 
            value={`₹${totalRevenue.toLocaleString()}`} 
            icon={<DollarSign className="text-emerald-500" />} 
            subtitle="From confirmed bookings"
          />
          <SummaryCard 
            title="Avg. Booking" 
            value={`₹${avgOrderValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`} 
            icon={<ArrowUpRight className="text-blue-500" />} 
            subtitle="Revenue per customer"
          />
          <SummaryCard 
            title="Total Travelers" 
            value={totalTravelers} 
            icon={<Users className="text-purple-500" />} 
            subtitle="Confirmed passengers"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Detailed Earnings Table */}
          <div className="lg:col-span-2 glass bg-white/50 dark:bg-slate-900/50 rounded-[2.5rem] p-8 border border-white shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                <span>Recent Earnings</span>
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="text-[10px] uppercase tracking-widest text-secondary font-bold border-b border-gray-100 dark:border-slate-800">
                  <tr>
                    <th className="pb-4">Transaction</th>
                    <th className="pb-4">Customer</th>
                    <th className="pb-4">Pax</th>
                    <th className="pb-4 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-slate-800/50">
                  {bookings?.map((booking: any) => (
                    <tr key={booking.id} className="group">
                      <td className="py-5">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold">{booking.tour?.title}</span>
                          <span className="text-[10px] text-secondary">{new Date(booking.created_at).toLocaleDateString()}</span>
                        </div>
                      </td>
                      <td className="py-5">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">{booking.customer_name}</span>
                          <span className="text-[10px] text-primary">{booking.customer_phone}</span>
                        </div>
                      </td>
                      <td className="py-5 text-sm font-bold text-secondary">{booking.people}</td>
                      <td className="py-5 text-right">
                        <span className="text-sm font-black text-emerald-600">₹{((booking.tour?.price || 0) * booking.people).toLocaleString()}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Revenue by Tour */}
          <div className="space-y-6">
            <div className="glass bg-white/50 dark:bg-slate-900/50 rounded-[2.5rem] p-8 border border-white shadow-sm">
              <h3 className="text-xl font-bold flex items-center gap-2 mb-8">
                <MapIcon className="h-5 w-5 text-primary" />
                <span>By Tour</span>
              </h3>
              <div className="space-y-6">
                {topTours.map((tour, index) => (
                  <div key={index} className="flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl overflow-hidden relative border border-gray-100">
                        <Image src={tour.image || 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1'} alt="" fill className="object-cover" />
                      </div>
                      <div>
                        <p className="text-sm font-bold truncate max-w-[120px]">{tour.title}</p>
                        <p className="text-[10px] text-secondary font-bold">{tour.count} Bookings</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-gray-900 dark:text-white">₹{tour.revenue.toLocaleString()}</p>
                      <div className="w-20 h-1.5 bg-gray-100 dark:bg-slate-800 rounded-full mt-1 overflow-hidden">
                        <div 
                          className="h-full bg-primary rounded-full" 
                          style={{ width: `${(tour.revenue / totalRevenue) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-primary rounded-[2.5rem] p-8 text-white shadow-xl shadow-primary/20 relative overflow-hidden">
               <div className="relative z-10">
                 <h4 className="text-lg font-bold mb-2">Need a Report?</h4>
                 <p className="text-white/70 text-sm mb-6 font-medium">Generate a detailed PDF report for your monthly accounting.</p>
                 <ExportRevenueButton bookings={bookings || []} totalRevenue={totalRevenue} />
               </div>
               <DollarSign className="absolute -bottom-8 -right-8 h-40 w-40 text-white/10 rotate-12" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function SummaryCard({ title, value, icon, subtitle }: { title: string, value: any, icon: React.ReactNode, subtitle: string }) {
  return (
    <div className="glass bg-white/80 dark:bg-slate-900/80 rounded-[2.5rem] p-8 shadow-sm border border-white hover:shadow-md transition-all">
      <div className="p-3 bg-muted/50 dark:bg-slate-800 rounded-2xl w-fit mb-6">
        {icon}
      </div>
      <div>
        <p className="text-[10px] uppercase tracking-widest text-secondary font-bold mb-1">{title}</p>
        <p className="text-3xl font-black text-gray-900 dark:text-white mb-1">{value}</p>
        <p className="text-xs text-secondary font-medium">{subtitle}</p>
      </div>
    </div>
  )
}
