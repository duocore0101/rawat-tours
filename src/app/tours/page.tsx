import { createClient } from '@/lib/supabase/server'
import TourCard from '@/components/TourCard'
import { Search, Filter, SlidersHorizontal } from 'lucide-react'
import { Tour } from '@/types'

export default async function ToursPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const parsedSearchParams = await searchParams
  const supabase = await createClient()
  const query = parsedSearchParams.search as string || parsedSearchParams.q as string || ''
  const filter = parsedSearchParams.filter as string || ''

  let supabaseQuery = supabase.from('tours').select('*')

  if (query) {
    supabaseQuery = supabaseQuery.ilike('title', `%${query}%`)
  }

  const { data: tours, error } = await supabaseQuery

  return (
    <div className="min-h-screen bg-muted/20 pb-20">
      {/* Header & Filters Section */}
      <div className="glass border-b border-gray-100 dark:border-slate-800 pt-10 sm:pt-16 pb-8 sm:pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-5xl font-black text-gray-900 dark:text-white mb-6 sm:mb-8 tracking-tight text-center sm:text-left">Explore Our Tours</h1>
          
          <div className="flex flex-col md:flex-row gap-3 sm:gap-4 items-center">
            {/* Search Input */}
            <form action="/tours" className="relative flex-grow w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
              <input
                type="text"
                name="search"
                defaultValue={query}
                placeholder="Search destinations, tours..."
                className="w-full bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-xl sm:rounded-2xl py-3 sm:py-4 pl-10 sm:pl-12 pr-4 focus:ring-2 focus:ring-primary/50 text-sm font-medium transition-all shadow-sm"
              />
            </form>

            <div className="flex gap-2 w-full md:w-auto">
              <button className="flex items-center justify-center space-x-2 flex-1 sm:flex-none bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-semibold hover:bg-muted transition-all shadow-sm">
                <SlidersHorizontal className="h-4 w-4 text-primary" />
                <span>Filters</span>
              </button>
              
              <select 
                className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-semibold hover:bg-muted transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50 flex-1 sm:flex-none"
                defaultValue={filter}
              >
                <option value="">Sort by: Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="newest">Newest First</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Tours Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 sm:mt-12">
        {error ? (
          <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-red-100 dark:border-red-900/20">
            <p className="text-red-500 font-medium">Failed to load tours. Please try again later.</p>
          </div>
        ) : tours && tours.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
            {tours.map((tour: Tour) => (
              <TourCard key={tour.id} tour={tour} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 glass rounded-[2rem]">
            <div className="inline-flex items-center justify-center p-6 bg-primary/10 rounded-full mb-6">
              <Search className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-3 tracking-tight">No tours found</h3>
            <p className="text-secondary max-w-xs mx-auto font-medium">We couldn't find any tours matching your criteria. Try adjusting your search or filters.</p>
          </div>
        )}
      </div>
    </div>
  )
}
