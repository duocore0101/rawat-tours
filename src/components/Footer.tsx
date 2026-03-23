import Link from 'next/link'
import { Bus, Instagram, Twitter, Facebook, Mail } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-slate-950 border-t py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center space-x-2 group">
              <Bus className="h-6 w-6 text-primary group-hover:scale-110 transition-transform" />
              <div className="flex flex-col">
                <span className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-600">
                  Rawat Tours
                </span>
                <span className="text-[8px] uppercase tracking-widest font-bold text-secondary">And Travels</span>
              </div>
            </Link>
            <p className="mt-4 text-sm text-secondary leading-relaxed">
              Discover extraordinary places and create unforgettable memories with our premium travel experiences.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/tours" className="text-sm text-secondary hover:text-primary transition-colors">All Tours</Link></li>
              <li><Link href="/tours?filter=adventure" className="text-sm text-secondary hover:text-primary transition-colors">Adventure</Link></li>
              <li><Link href="/tours?filter=luxury" className="text-sm text-secondary hover:text-primary transition-colors">Luxury</Link></li>
              <li><Link href="/tours?filter=budget" className="text-sm text-secondary hover:text-primary transition-colors">Budget Friendly</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Support</h3>
            <ul className="space-y-2">
              <li><Link href="/faq" className="text-sm text-secondary hover:text-primary transition-colors">FAQ</Link></li>
              <li><Link href="/contact" className="text-sm text-secondary hover:text-primary transition-colors">Contact Us</Link></li>
              <li><Link href="/privacy" className="text-sm text-secondary hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-sm text-secondary hover:text-primary transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Newsletter</h3>
            <p className="text-sm text-secondary mb-4">Subscribe to get the latest travel updates.</p>
            <form className="flex space-x-2">
              <input
                type="email"
                placeholder="Email"
                className="bg-muted text-sm rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <button className="bg-primary text-white p-2 rounded-lg hover:bg-opacity-90 transition-all">
                <Mail className="h-4 w-4" />
              </button>
            </form>
            <div className="flex space-x-4 mt-6">
              <Instagram className="h-5 w-5 text-secondary hover:text-primary cursor-pointer transition-colors" />
              <Twitter className="h-5 w-5 text-secondary hover:text-primary cursor-pointer transition-colors" />
              <Facebook className="h-5 w-5 text-secondary hover:text-primary cursor-pointer transition-colors" />
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-100 dark:border-slate-900 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-secondary">
            &copy; {new Date().getFullYear()} Rawat Tours and Travels. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0 flex space-x-6">
            <span className="text-xs text-secondary">Made with ❤️ for Travelers</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
