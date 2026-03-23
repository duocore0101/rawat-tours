export interface Tour {
  id: string
  title: string
  description: string
  price: number
  duration: string
  location: string
  image_url: string
  created_at: string
}

export interface Booking {
  id: string
  user_id: string
  tour_id: string
  date: string
  people: number
  status: 'pending' | 'confirmed' | 'cancelled'
  created_at: string
  tour?: Tour
}
