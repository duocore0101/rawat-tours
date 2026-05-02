'use client'

import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Clock, Star, ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'

interface Tour {
  id: string
  title: string
  location: string
  price: number
  duration: string
  image_url: string
}

export default function TourCard({ tour }: { tour: Tour }) {
  const [currentImage, setCurrentImage] = useState(0)
  
  // Parse images, handling old istockphoto URLs and comma-separated arrays
  const fallback = 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1'
  let images = [fallback]
  
  if (tour.image_url) {
    const validImages = tour.image_url.split(',').filter(url => url.trim() !== '' && !url.includes('istockphoto.com'))
    if (validImages.length > 0) {
      images = validImages
    }
  }

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentImage((prev) => (prev + 1) % images.length)
  }

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length)
  }

  return (
    <div className="group bg-white dark:bg-slate-900 rounded-2xl sm:rounded-[2rem] overflow-hidden border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 sm:hover:-translate-y-3">
      <div className="relative h-48 sm:h-72 overflow-hidden">
        {(() => {
          const src = images[currentImage]
          const isVideo = src.toLowerCase().match(/\.(mp4|webm|ogg|mov)$/) || src.includes('video')
          return isVideo ? (
            <video
              src={src}
              autoPlay
              muted
              loop
              playsInline
              className="object-cover w-full h-full absolute inset-0 transition-transform duration-700"
            />
          ) : (
            <Image
              src={src}
              alt={tour.title}
              fill
              className="object-cover transition-transform duration-700"
            />
          )
        })()}
        
        {images.length > 1 && (
          <>
            <button 
              onClick={prevImage}
              className="absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 glass p-1 sm:p-1.5 rounded-full text-white opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-black/50"
            >
              <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
            <button 
              onClick={nextImage}
              className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 glass p-1 sm:p-1.5 rounded-full text-white opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-black/50"
            >
              <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
            <div className="absolute bottom-2 sm:bottom-3 left-0 right-0 flex justify-center gap-1 sm:gap-1.5">
              {images.map((_, i) => (
                <div 
                  key={i} 
                  className={`h-1 sm:h-1.5 rounded-full transition-all duration-300 ${i === currentImage ? 'w-3 sm:w-4 bg-white' : 'w-1 sm:w-1.5 bg-white/50'}`}
                />
              ))}
            </div>
          </>
        )}
        
        <div className="absolute top-2 right-2 sm:top-4 sm:right-4 glass px-2 py-1 sm:px-4 sm:py-1.5 rounded-full text-xs sm:text-sm font-black text-primary animate-in fade-in zoom-in duration-500">
          ₹{tour.price}
        </div>
      </div>
      
      <div className="p-3 sm:p-8">
        <div className="flex items-center space-x-1 text-primary mb-1.5 sm:mb-3 text-[8px] sm:text-[10px] font-black uppercase tracking-[0.1em] sm:tracking-[0.2em] line-clamp-1">
          <MapPin className="h-3 w-3 sm:h-3.5 sm:w-3.5 flex-shrink-0" />
          <span className="truncate">{tour.location}</span>
        </div>
        
        <h3 className="text-base sm:text-2xl font-black text-gray-900 dark:text-white mb-2 sm:mb-4 line-clamp-1 group-hover:text-primary transition-colors tracking-tight">
          {tour.title}
        </h3>
        
        <div className="flex items-center justify-between text-secondary text-[9px] sm:text-xs font-bold mb-4 sm:mb-8">
          <div className="flex items-center space-x-1 sm:space-x-2">
            <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-primary flex-shrink-0" />
            <span className="truncate">{tour.duration} Trip</span>
          </div>
        </div>
        
        <Link 
          href={`/tours/${tour.id}`}
          className="block w-full text-center py-2 px-2 sm:py-4 sm:px-6 bg-primary text-white text-xs sm:text-base font-black rounded-xl sm:rounded-2xl transition-all duration-300 shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:scale-[1.02] active:scale-95"
        >
          Book Now
        </Link>
      </div>
    </div>
  )
}
