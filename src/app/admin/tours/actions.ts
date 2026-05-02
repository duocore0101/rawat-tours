'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function deleteTour(tourId: string) {
  const supabase = await createClient()

  // Verify admin
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.email !== 'duocore0101@gmail.com') {
    throw new Error('Unauthorized')
  }

  const { error } = await supabase
    .from('tours')
    .delete()
    .eq('id', tourId)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/admin/tours')
  revalidatePath('/')
}
