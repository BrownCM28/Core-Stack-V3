'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'

const NAV_CATEGORIES = [
  { label: 'Browse Jobs', href: '/jobs' },
  { label: 'Post a Job', href: '/employers' },
  { label: 'Wiki', href: '/wiki' },
  { label: 'Docs', href: '/docs' },
]

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [])

  return (
    <>
      {/* Fixed top bar */}
      <header className="fixed top-0 left-0 right-0 h-[52px] bg-black z-50 flex items-center justify-between px-6 md:px-10">

        {/* Left — wordmark */}
        <Link
          href="/"
          className="font-display text-base font-normal tracking-tight flex-shrink-0"
          onClick={() => setMenuOpen(false)}
        >
          <span className="text-white">Core</span>
          <span className="text-[#3ECF8E]">Stack</span>
        </Link>

        {/* Center — category nav (desktop only) */}
        <nav className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
          {NAV_CATEGORIES.map((link) => {
            const active = pathname.startsWith(link.href)
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`font-mono text-xs tracking-wider uppercase transition-colors duration-200 ${
                  active ? 'text-white' : 'text-white/50 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        {/* Right — CTA + hamburger */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <Link
            href="/auth/signup"
            className="bg-white text-black font-mono text-xs px-5 py-2 hover:bg-white/90 transition-colors duration-200 whitespace-nowrap"
          >
            Get Started
          </Link>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex flex-col justify-center items-center w-8 h-8 gap-1.5 cursor-pointer"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            <span className={`w-5 h-px bg-white transition-all duration-300 block ${menuOpen ? 'rotate-45 translate-y-[8px]' : ''}`} />
            <span className={`w-5 h-px bg-white transition-all duration-300 block ${menuOpen ? 'opacity-0 scale-x-0' : ''}`} />
            <span className={`w-5 h-px bg-white transition-all duration-300 block ${menuOpen ? '-rotate-45 -translate-y-[8px]' : ''}`} />
          </button>
        </div>
      </header>

      {/* Full-screen overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed inset-0 z-40 bg-black overflow-y-auto"
            style={{ paddingTop: '52px' }}
          >
            <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] min-h-[calc(100vh-52px)] border-t border-white/10">

              {/* Left column — nav links */}
              <div className="bg-black border-r border-white/10 px-10 py-12">
                <p className="font-mono text-xs uppercase tracking-widest text-white/30 mb-6">
                  NAVIGATION
                </p>
                <nav className="flex flex-col">
                  <Link href="/jobs" onClick={() => setMenuOpen(false)} className="font-display text-2xl md:text-3xl font-normal text-white/60 hover:text-white transition-colors duration-200 py-2 block">
                    Browse Jobs
                  </Link>
                  <Link href="/jobs?category=Data+Center+Ops" onClick={() => setMenuOpen(false)} className="font-display text-lg text-white/40 hover:text-white/80 transition-colors duration-200 pl-4 py-1 block">
                    ↳ Data Center Ops
                  </Link>
                  <Link href="/jobs?category=AI+Infrastructure" onClick={() => setMenuOpen(false)} className="font-display text-lg text-white/40 hover:text-white/80 transition-colors duration-200 pl-4 py-1 block">
                    ↳ AI Infrastructure
                  </Link>
                  <Link href="/jobs?category=Construction" onClick={() => setMenuOpen(false)} className="font-display text-lg text-white/40 hover:text-white/80 transition-colors duration-200 pl-4 py-1 block">
                    ↳ Construction
                  </Link>
                  <Link href="/jobs?category=Electrical" onClick={() => setMenuOpen(false)} className="font-display text-lg text-white/40 hover:text-white/80 transition-colors duration-200 pl-4 py-1 block">
                    ↳ Electrical
                  </Link>
                  <Link href="/employers" onClick={() => setMenuOpen(false)} className="font-display text-2xl md:text-3xl font-normal text-white/60 hover:text-white transition-colors duration-200 py-2 block">
                    Post a Job
                  </Link>
                  <Link href="/wiki" onClick={() => setMenuOpen(false)} className="font-display text-2xl md:text-3xl font-normal text-white/60 hover:text-white transition-colors duration-200 py-2 block">
                    Wiki
                  </Link>
                  <Link href="/docs" onClick={() => setMenuOpen(false)} className="font-display text-2xl md:text-3xl font-normal text-white/60 hover:text-white transition-colors duration-200 py-2 block">
                    Docs
                  </Link>
                  <Link href="/auth/login" onClick={() => setMenuOpen(false)} className="font-display text-2xl md:text-3xl font-normal text-white/60 hover:text-white transition-colors duration-200 py-2 block">
                    Sign In
                  </Link>
                </nav>
              </div>

              {/* Right column — content panels */}
              <div className="bg-[#0A0A0A] px-10 py-12 grid grid-cols-1 md:grid-cols-2 gap-8 content-start">

                {/* Panel 1 — For Candidates */}
                <div>
                  <p className="font-mono text-xs uppercase tracking-widest text-white/30 mb-4">
                    FOR CANDIDATES
                  </p>
                  <h3 className="font-display text-xl text-white mb-3">
                    Your GitHub is your resume.
                  </h3>
                  <p className="font-sans text-sm text-white/50 leading-relaxed mb-6">
                    Sign in with GitHub and your entire tech stack syncs automatically. Add certifications, set your Open to Work status, and get discovered by top infrastructure employers.
                  </p>
                  <ul className="flex flex-col gap-1.5 mb-6">
                    {['GitHub OAuth sign-in', 'Auto-synced repos and skill graph', 'Certification badges', 'Open to Work discovery'].map((item) => (
                      <li key={item} className="font-mono text-xs text-white/40 flex items-center gap-2">
                        <span className="text-[#3ECF8E]">·</span>{item}
                      </li>
                    ))}
                  </ul>
                  <Link href="/auth/signup" onClick={() => setMenuOpen(false)} className="font-mono text-xs text-[#3ECF8E] inline-flex items-center gap-2 hover:gap-3 transition-all">
                    Create free profile ↗
                  </Link>
                </div>

                {/* Panel 2 — For Employers */}
                <div>
                  <p className="font-mono text-xs uppercase tracking-widest text-white/30 mb-4">
                    FOR EMPLOYERS
                  </p>
                  <h3 className="font-display text-xl text-white mb-3">
                    Hire before your competitors even start searching.
                  </h3>
                  <p className="font-sans text-sm text-white/50 leading-relaxed mb-6">
                    Post a listing or subscribe to monthly CoreStack Score reports — pre-ranked infrastructure talent delivered automatically.
                  </p>
                  <ul className="flex flex-col gap-1.5 mb-6">
                    {['Standard and Featured listings', 'GitHub signal on every applicant', 'Monthly CoreStack Score reports (Premium)'].map((item) => (
                      <li key={item} className="font-mono text-xs text-white/40 flex items-center gap-2">
                        <span className="text-[#3ECF8E]">·</span>{item}
                      </li>
                    ))}
                  </ul>
                  <Link href="/employers" onClick={() => setMenuOpen(false)} className="font-mono text-xs text-[#3ECF8E] inline-flex items-center gap-2 hover:gap-3 transition-all">
                    Post a job ↗
                  </Link>
                </div>
              </div>
            </div>

            {/* Bottom bar — desktop only */}
            <div className="hidden md:flex border-t border-white/10 px-10 py-4 items-center justify-between">
              <span className="font-mono text-xs text-white/20">© 2026 CoreStack</span>
              <span className="font-mono text-xs text-white/20">Built for the people who keep the world running.</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
