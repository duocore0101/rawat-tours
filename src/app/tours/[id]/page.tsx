import { createClient } from '@/lib/supabase/server'
import Image from 'next/image'
import { MapPin, Clock, Star, ShieldCheck, Coffee, Wifi, Camera, Bus } from 'lucide-react'
import BookingForm from '@/components/BookingForm'
import { notFound } from 'next/navigation'

export default async function TourDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: tour, error } = await supabase
    .from('tours')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !tour) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-muted/10 pb-20">
      {/* Hero Header */}
      <div className="relative h-[70vh] w-full">
        <Image
          src={tour.image_url || 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2069&auto=format&fit=crop'}
          alt={tour.title}
          fill
          className="object-cover scale-105 animate-slow-zoom"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-black/20 to-transparent" />
        <div className="absolute bottom-20 left-0 w-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="inline-flex items-center space-x-2 bg-accent/90 backdrop-blur-md px-4 py-1.5 rounded-full w-fit mb-6 shadow-xl shadow-accent/20">
              <Bus className="h-4 w-4 text-black" />
              <span className="text-xs font-black uppercase tracking-widest text-black">Rawat Premium Route</span>
            </div>
            <h1 className="text-5xl md:text-8xl font-black text-white mb-6 tracking-tighter drop-shadow-2xl">{tour.title}</h1>
            <div className="flex flex-wrap items-center gap-6 text-white/90">
              <div className="flex items-center space-x-2 bg-black/20 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10">
                <MapPin className="h-5 w-5 text-accent" />
                <span className="font-bold uppercase tracking-wider text-sm">{tour.location}</span>
              </div>
              <div className="flex items-center space-x-2 bg-black/20 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10">
                <Clock className="h-5 w-5 text-accent" />
                <span className="font-bold text-sm">{tour.duration} Experience</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            <section>
              <h2 className="text-2xl font-bold mb-6">About This Tour</h2>
              <p className="text-secondary leading-relaxed text-lg">
                {tour.description || "Discover the magic of this incredible destination. This carefully curated tour offers a perfect blend of adventure, culture, and relaxation. Join us for an unforgettable journey through breathtaking landscapes and hidden gems that only locals know about."}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-6">What's Included</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <div className="flex items-center space-x-3 p-4 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-50 dark:border-slate-800">
                  <ShieldCheck className="h-6 w-6 text-emerald-500" />
                  <span className="text-sm font-medium">Travel Insurance</span>
                </div>
                <div className="flex items-center space-x-3 p-4 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-50 dark:border-slate-800">
                  <Coffee className="h-6 w-6 text-amber-500" />
                  <span className="text-sm font-medium">Daily Breakfast</span>
                </div>
                <div className="flex items-center space-x-3 p-4 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-50 dark:border-slate-800">
                  <Wifi className="h-6 w-6 text-blue-500" />
                  <span className="text-sm font-medium">High-speed WiFi</span>
                </div>
                <div className="flex items-center space-x-3 p-4 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-50 dark:border-slate-800">
                  <Camera className="h-6 w-6 text-purple-500" />
                  <span className="text-sm font-medium">Photo Package</span>
                </div>
                <div className="flex items-center space-x-3 p-4 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-50 dark:border-slate-800">
                  <MapPin className="h-6 w-6 text-rose-500" />
                  <span className="text-sm font-medium">Local Guide</span>
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar - Booking Card */}
          <div className="relative">
            <BookingForm tourId={tour.id} price={tour.price} />
          </div>
        </div>
      </div>
    </div>
  )
}
