import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Plus, Trash2, Edit, MapPin, DollarSign } from 'lucide-react'
import Image from 'next/image'

export default async function AdminToursPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user || user.email !== 'duocore0101@gmail.com') {
    redirect('/')
  }

  const { data: tours } = await supabase
    .from('tours')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-muted/20 pb-20">
      <div className="bg-white dark:bg-slate-950 border-b border-gray-100 dark:border-slate-800 pt-12 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-2">Manage Tours</h1>
            <p className="text-secondary font-medium">Add, update or remove travel packages.</p>
          </div>
          <Link 
            href="/admin/tours/new"
            className="bg-primary text-white px-6 py-3 rounded-2xl font-bold flex items-center space-x-2 hover:bg-opacity-90 transition-all shadow-lg shadow-primary/20"
          >
            <Plus className="h-5 w-5" />
            <span>Add New</span>
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-1 gap-6">
          {tours?.map((tour) => (
            <div key={tour.id} className="bg-white dark:bg-slate-900 rounded-3xl p-4 flex flex-col md:flex-row items-center gap-8 shadow-sm border border-gray-50 hover:shadow-md transition-all">
              <div className="relative h-32 w-full md:w-48 rounded-2xl overflow-hidden flex-shrink-0">
                <Image src={tour.image_url} alt={tour.title} fill className="object-cover" />
              </div>
              
              <div className="flex-grow text-center md:text-left">
                <h3 className="text-xl font-bold mb-1">{tour.title}</h3>
                <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-secondary">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span>{tour.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4 text-emerald-500" />
                    <span className="font-bold text-gray-900 dark:text-white">${tour.price}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 w-full md:w-auto">
                <Link 
                  href={`/admin/tours/edit/${tour.id}`}
                  className="flex-grow md:flex-none flex items-center justify-center gap-2 p-3 bg-blue-50 text-blue-600 rounded-2xl hover:bg-blue-100 transition-all font-bold"
                >
                  <Edit className="h-4 w-4" />
                  <span>Edit</span>
                </Link>
                {/* Delete logic would be a client component, but for simplicity we link to an action or use a client wrapper */}
                <button className="flex-grow md:flex-none flex items-center justify-center gap-2 p-3 bg-red-50 text-red-600 rounded-2xl hover:bg-red-100 transition-all font-bold">
                  <Trash2 className="h-4 w-4" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
