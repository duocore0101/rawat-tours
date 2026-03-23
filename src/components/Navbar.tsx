'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'
import { Bus, User as UserIcon, LogOut, Menu, X, Shield } from 'lucide-react'

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <nav className="glass sticky top-0 z-50 border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3 group transition-all">
              <div className="bg-primary p-2.5 rounded-2xl group-hover:scale-110 group-hover:rotate-3 transition-all shadow-xl shadow-primary/20">
                <Bus className="h-7 w-7 text-white" />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-2xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary via-indigo-600 to-indigo-900 dark:from-primary dark:to-white">
                  RAWAT TOURS
                </span>
                <span className="text-[10px] font-extrabold uppercase tracking-[0.3em] text-secondary/80">
                  And Travels
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/tours" className="text-sm font-medium hover:text-primary transition-colors">
              Explore Tours
            </Link>
            {user ? (
              <>
                <Link href="/my-bookings" className="text-sm font-medium hover:text-primary transition-colors">
                  My Bookings
                </Link>
                {user.email === 'duocore0101@gmail.com' && (
                  <Link href="/admin" className="flex items-center space-x-1 text-sm font-medium text-accent hover:opacity-80 transition-opacity">
                    <Shield className="h-4 w-4" />
                    <span>Admin</span>
                  </Link>
                )}
                <div className="flex items-center space-x-4">
                  <span className="text-xs text-secondary hidden lg:inline-block">{user.email}</span>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1 text-sm font-medium text-red-500 hover:text-red-600 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/login" className="text-sm font-medium hover:text-primary transition-colors">
                  Login
                </Link>
                <Link
                  href="/login?mode=signup"
                  className="bg-primary text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-opacity-90 transition-all shadow-lg shadow-primary/20"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-500 hover:text-primary transition-colors"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900 border-b animate-in slide-in-from-top duration-300">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              href="/tours"
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-muted transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Explore Tours
            </Link>
            {user ? (
              <>
                <Link
                  href="/my-bookings"
                  className="block px-3 py-2 rounded-md text-base font-medium hover:bg-muted transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  My Bookings
                </Link>
                <button
                  onClick={() => {
                    handleLogout()
                    setIsOpen(false)
                  }}
                  className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-red-500 hover:bg-muted transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="block px-3 py-2 rounded-md text-base font-medium hover:bg-muted transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/login?mode=signup"
                  className="block px-3 py-2 rounded-md text-base font-medium text-primary hover:bg-muted transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
