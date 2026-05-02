import TourForm from '@/components/TourForm'
import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'

export default async function EditTourPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user || user.email !== 'duocore0101@gmail.com') {
    redirect('/')
  }

  const { data: tour } = await supabase
    .from('tours')
    .select('*')
    .eq('id', id)
    .single()

  if (!tour) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-muted/20 pb-20 pt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <Link 
          href="/admin/tours" 
          className="absolute -top-6 left-4 sm:left-8 text-sm font-bold text-secondary hover:text-primary transition-colors flex items-center gap-2"
        >
          ← Back to Tours
        </Link>
        <div className="mb-12 text-center mt-8 sm:mt-0">
          <h1 className="text-2xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-2">Edit Tour</h1>
          <p className="text-sm sm:text-base text-secondary font-medium">Update the details for your travel package.</p>
        </div>
        <TourForm tour={tour} />
      </div>
    </div>
  )
}
