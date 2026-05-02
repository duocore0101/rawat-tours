'use client'

import { useState } from 'react'
import Image from 'next/image'
import { X } from 'lucide-react'

export default function TourGallery({ mediaUrls }: { mediaUrls: string[] }) {
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null)

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {mediaUrls.map((url, i) => {
          const isVideo = url.toLowerCase().match(/\.(mp4|webm|ogg|mov)$/) || url.includes('video')
          return (
            <div 
              key={i} 
              className="relative h-48 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group cursor-pointer"
              onClick={() => setSelectedMedia(url)}
            >
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors z-10" />
              {isVideo ? (
                <video src={url} autoPlay muted loop playsInline className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110" />
              ) : (
                <Image src={url} alt={`Gallery image ${i + 1}`} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
              )}
            </div>
          )
        })}
      </div>

      {/* Lightbox Pop-up */}
      {selectedMedia && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 sm:p-8 animate-in fade-in duration-300"
          onClick={() => setSelectedMedia(null)}
        >
          <button 
            onClick={(e) => {
              e.stopPropagation()
              setSelectedMedia(null)
            }}
            className="absolute top-6 right-6 sm:top-10 sm:right-10 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-3 rounded-full transition-all z-50 backdrop-blur-md hover:rotate-90 hover:scale-110 duration-300"
          >
            <X className="w-8 h-8" />
          </button>
          
          <div 
            className="relative w-full max-w-6xl max-h-[90vh] flex items-center justify-center shadow-2xl animate-in zoom-in-95 duration-500"
            onClick={(e) => e.stopPropagation()}
          >
            {selectedMedia.toLowerCase().match(/\.(mp4|webm|ogg|mov)$/) || selectedMedia.includes('video') ? (
              <video 
                src={selectedMedia} 
                controls 
                autoPlay 
                className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl ring-1 ring-white/10"
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img 
                src={selectedMedia} 
                alt="Popup media" 
                className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl ring-1 ring-white/10" 
              />
            )}
          </div>
        </div>
      )}
    </>
  )
}
