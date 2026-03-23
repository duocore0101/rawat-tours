import { Search, MapPin } from 'lucide-react'

export default function Hero() {
  return (
    <div className="relative h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Background with overlay */}
      <div 
        className="absolute inset-0 z-0 scale-105 animate-slow-zoom"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1570125909232-eb263c188f7e?q=80&w=2071&auto=format&fit=crop")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-background dark:to-background" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center text-white">
        <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 mb-8 animate-in fade-in zoom-in duration-1000">
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-[0.2em]">Premium Luxury Travel</span>
        </div>
        <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          Travel in <br /> 
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent via-yellow-400 to-amber-600">
            Pure Luxury
          </span>
        </h1>
        <p className="text-lg md:text-2xl text-gray-200 mb-12 max-w-3xl mx-auto font-medium leading-relaxed animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-200">
          Discover the beauty of India with <span className="text-white font-bold border-b-2 border-accent">Rawat Tours and Travels</span>. Premium luxury bus services for the sophisticated traveler.
        </p>

        {/* Search Bar */}
        <div className="glass max-w-3xl mx-auto p-2 rounded-2xl shadow-2xl flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-2 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
          <div className="relative flex-grow w-full">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search Indian destinations..."
              className="w-full bg-white/20 border-none rounded-xl py-4 pl-12 pr-4 text-slate-900 placeholder-slate-500 focus:ring-2 focus:ring-accent/50 text-sm"
            />
          </div>
          <button className="w-full md:w-auto bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-xl font-semibold flex items-center justify-center space-x-2 transition-all group">
            <Search className="h-5 w-5 group-hover:scale-110 transition-transform" />
            <span>Search Tours</span>
          </button>
        </div>
      </div>
    </div>
  )
}
