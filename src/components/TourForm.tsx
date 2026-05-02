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
    price: tour?.price || 0,
    duration: tour?.duration || '',
    description: tour?.description || '',
    image_url: tour?.image_url || '',
  })
  const [files, setFiles] = useState<File[]>([])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    let finalImageUrl = formData.image_url

    if (files.length > 0) {
      const uploadedUrls = []
      for (const file of files) {
        const fileExt = file.name.split('.').pop()
        const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`
        
        const { error: uploadError, data } = await supabase.storage
          .from('tours')
          .upload(fileName, file)
          
        if (uploadError) {
          alert(`Error uploading image: ${uploadError.message}. Make sure the bucket 'tours' exists and has INSERT policies!`)
          setLoading(false)
          return
        }
        
        const { data: { publicUrl } } = supabase.storage
          .from('tours')
          .getPublicUrl(fileName)
          
        uploadedUrls.push(publicUrl)
      }
      
      if (uploadedUrls.length > 0) {
        // Append new URLs to existing ones, or replace if empty
        finalImageUrl = finalImageUrl ? `${finalImageUrl},${uploadedUrls.join(',')}` : uploadedUrls.join(',')
      }
    }

    if (finalImageUrl) {
      finalImageUrl = finalImageUrl.split(',').filter(u => !u.includes('istockphoto.com')).join(',')
    }

    const payload = {
      ...formData,
      image_url: finalImageUrl,
      price: Number(formData.price),
      location: tour?.location || 'Not Specified', // Provide fallback for NOT NULL constraint
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

        {/* Images */}
        <div className="md:col-span-2">
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Tour Media (Photos & Videos)</label>
          <div className="relative">
            <input
              type="file"
              multiple
              accept="image/*,video/*"
              onChange={(e) => {
                if (e.target.files) {
                  const newFiles = Array.from(e.target.files);
                  setFiles(prev => [...prev, ...newFiles]);
                }
              }}
              className="w-full bg-white dark:bg-slate-800 border border-dashed border-gray-300 dark:border-slate-600 rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary/50 text-sm transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
            />
          </div>
          {files.length > 0 && (
            <p className="mt-2 text-xs font-semibold text-emerald-600">{files.length} new file(s) selected to upload</p>
          )}

          {formData.image_url && (
            <div className="mt-4">
              <p className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest">Currently Saved Media</p>
              <div className="flex flex-wrap gap-3">
                {formData.image_url.split(',').filter(u => u).map((url, i) => {
                  const isVideo = url.toLowerCase().match(/\.(mp4|webm|ogg|mov)$/) || url.includes('video');
                  return (
                    <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden border border-gray-200 shadow-sm group">
                      {isVideo ? (
                         <video src={url} className="w-full h-full object-cover" />
                      ) : (
                         // eslint-disable-next-line @next/next/no-img-element
                         <img src={url} alt="" className="w-full h-full object-cover" />
                      )}
                      <button 
                        type="button" 
                        onClick={() => {
                          const newUrls = formData.image_url.split(',').filter((_, index) => index !== i).join(',');
                          setFormData(prev => ({...prev, image_url: newUrls}));
                        }}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
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
