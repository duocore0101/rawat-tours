'use client'

import { useState, useEffect } from 'react'

const HERO_IMAGES = [
  "/hero_image.jpeg",
  "/Bus1.jpeg",
  "/bus2.jpeg",
  "/bus3.jpeg",
  "/bus4.jpeg",
  "/bus6.jpeg"
]

export default function Hero() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % HERO_IMAGES.length)
    }, 5000) // Change image every 5 seconds

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="relative min-h-[40vh] md:min-h-[75vh] flex items-start justify-center overflow-hidden">
      {/* Background with overlay */}
      {HERO_IMAGES.map((image, index) => (
        <div 
          key={image}
          className={`absolute inset-0 z-0 scale-105 transition-opacity duration-1000 ease-in-out ${
            index === currentImageIndex ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            backgroundImage: `url("${image}")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-background dark:to-background" />
        </div>
      ))}

      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center text-white pt-6 md:pt-8">
        <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-6 py-2 rounded-full border border-white/20 animate-in fade-in zoom-in duration-1000 shadow-2xl">
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <span className="text-[10px] md:text-sm font-bold uppercase tracking-[0.3em]">Premium Luxury Travel</span>
        </div>
      </div>
    </div>
  )
}
