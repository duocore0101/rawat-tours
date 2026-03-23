'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Loader2, Save, X, Image as ImageIcon, MapPin, DollarSign, Clock, FileText } from 'lucide-react'
import { Tour } from '@/types'

export default function TourForm({ tour }: { tour?: Tour }) {
  const router = useRouter()
  const supabase = createClient()
  
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: tour?.title || '',
    location: tour?.location || '',
    price: tour?.price || 0,
    duration: tour?.duration || '',
    description: tour?.description || '',
    image_url: tour?.image_url || '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const payload = {
      ...formData,
      price: Number(formData.price),
    }

    let error
    if (tour) {
      const { error: updateError } = await supabase
        .from('tours')
        .update(payload)
        .eq('id', tour.id)
      error = updateError
    } else {
      const { error: insertError } = await supabase
        .from('tours')
        .insert(payload)
      error = insertError
    }

    if (error) {
      alert(error.message)
    } else {
      router.push('/admin/tours')
      router.refresh()
    }
    setLoading(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 glass p-8 rounded-3xl border border-white/40 shadow-xl max-w-3xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Title */}
        <div className="md:col-span-2">
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Tour Title</label>
          <div className="relative">
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Manali Adventure Luxury Bus Tour"
              className="w-full bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary/50 text-sm transition-all"
            />
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Location</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              name="location"
              required
              value={formData.location}
              onChange={handleChange}
              placeholder="Manali, Himachal Pradesh"
              className="w-full bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-primary/50 text-sm transition-all"
            />
          </div>
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Price (₹)</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-400">₹</span>
            <input
              type="number"
              name="price"
              required
              value={formData.price}
              onChange={handleChange}
              className="w-full bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-primary/50 text-sm transition-all"
            />
          </div>
        </div>

        {/* Duration */}
        <div>
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Duration</label>
          <div className="relative">
            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              name="duration"
              required
              value={formData.duration}
              onChange={handleChange}
              placeholder="7 Days"
              className="w-full bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-primary/50 text-sm transition-all"
            />
          </div>
        </div>

        {/* Image URL */}
        <div>
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Image URL</label>
          <div className="relative">
            <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              name="image_url"
              value={formData.image_url}
              onChange={handleChange}
              placeholder="https://images.unsplash.com/..."
              className="w-full bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-primary/50 text-sm transition-all"
            />
          </div>
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Description</label>
          <div className="relative">
            <textarea
              name="description"
              rows={5}
              value={formData.description}
              onChange={handleChange}
              placeholder="Provide a detailed description of the tour experience..."
              className="w-full bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 rounded-2xl py-3 px-4 focus:ring-2 focus:ring-primary/50 text-sm transition-all resize-none"
            />
          </div>
        </div>
      </div>

      <div className="flex gap-4 pt-6 border-t border-gray-100 dark:border-slate-800">
        <button
          type="submit"
          disabled={loading}
          className="flex-grow bg-primary text-white py-4 rounded-2xl font-bold flex items-center justify-center space-x-2 hover:bg-opacity-90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
        >
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : (
            <>
              <Save className="h-5 w-5" />
              <span>{tour ? 'Save Changes' : 'Create Tour'}</span>
            </>
          )}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-8 py-4 bg-muted text-secondary rounded-2xl font-bold hover:bg-gray-200 dark:hover:bg-slate-700 transition-all"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
