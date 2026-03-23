import TourForm from '@/components/TourForm'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function NewTourPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user || user.email !== 'duocore0101@gmail.com') {
    redirect('/')
  }

  return (
    <div className="min-h-screen bg-muted/20 pb-20 pt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-2">Create New Tour</h1>
          <p className="text-secondary font-medium">Design an extraordinary experience for your travelers.</p>
        </div>
        <TourForm />
      </div>
    </div>
  )
}
