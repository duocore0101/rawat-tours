import Hero from "@/components/Hero";
import TourCard from "@/components/TourCard";
import { createClient } from "@/lib/supabase/server";
import { Tour } from "@/types";

export default async function Home() {
  const supabase = await createClient();
  const { data: tours, error } = await supabase
    .from("tours")
    .select("*")
    .limit(6); // Show top 6 tours on home page

  return (
    <div className="hero-gradient min-h-screen pb-20">
      <Hero />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-12 gap-6 text-center md:text-left">
          <div className="flex flex-col items-center md:items-start">
            <div className="inline-flex items-center space-x-2 bg-primary/10 px-3 py-1 rounded-full mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-primary">Luxury Journeys</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tighter text-gray-900 dark:text-white mt-1">
              Explore Our <span className="text-primary block sm:inline">Premium Tours</span>
            </h2>
          </div>
          <a href="/tours" className="inline-flex items-center justify-center bg-primary/10 hover:bg-primary text-primary hover:text-white px-6 py-3 rounded-full text-sm font-black transition-all duration-300 group">
            View All Destinations <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
          </a>
        </div>

        {error ? (
          <div className="text-center py-12 glass rounded-3xl">
            <p className="text-red-500 font-bold">Failed to load luxury tours. Please try again.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-10">
            {tours?.map((tour: Tour) => (
              <TourCard key={tour.id} tour={tour} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
