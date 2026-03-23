'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateBookingStatus(bookingId: string, status: 'confirmed' | 'cancelled' | 'pending') {
  const supabase = await createClient()

  const { error } = await supabase
    .from('bookings')
    .update({ status })
    .eq('id', bookingId)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/admin/bookings')
  revalidatePath('/admin')
}
