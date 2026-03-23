import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Clock, Star } from 'lucide-react'

interface Tour {
  id: string
  title: string
  location: string
  price: number
  duration: string
  image_url: string
}

export default function TourCard({ tour }: { tour: Tour }) {
  return (
    <div className="group bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-3">
      <div className="relative h-72 overflow-hidden">
        <Image
          src={tour.image_url || 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1'}
          alt={tour.title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute top-4 right-4 glass px-4 py-1.5 rounded-full text-sm font-black text-primary animate-in fade-in zoom-in duration-500">
          ₹{tour.price}
        </div>
        <div className="absolute bottom-4 left-4 flex gap-1">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star key={s} className="h-3 w-3 fill-accent text-accent" />
          ))}
        </div>
      </div>
      
      <div className="p-8">
        <div className="flex items-center space-x-1 text-primary mb-3 text-[10px] font-black uppercase tracking-[0.2em]">
          <MapPin className="h-3.5 w-3.5" />
          <span>{tour.location}</span>
        </div>
        
        <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-4 line-clamp-1 group-hover:text-primary transition-colors tracking-tight">
          {tour.title}
        </h3>
        
        <div className="flex items-center justify-between text-secondary text-xs font-bold mb-8">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-primary" />
            <span>{tour.duration} Premium Trip</span>
          </div>
        </div>
        
        <Link 
          href={`/tours/${tour.id}`}
          className="block w-full text-center py-4 px-6 bg-primary text-white font-black rounded-2xl transition-all duration-300 shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:scale-[1.02] active:scale-95"
        >
          Book Your Experience
        </Link>
      </div>
    </div>
  )
}
