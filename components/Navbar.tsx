'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'

const TICKER_ITEMS = [
  'Microsoft announces $3.3B data center expansion in Wisconsin — 2,000 construction jobs',
  'Equinix hiring 400+ critical facilities engineers across North America in Q2 2026',
  'Google breaks ground on 11th Virginia data center campus — $2B investment',
  'AWS opens applications for Data Center Technician roles in 14 cities',
  "Meta's hyperscale AI data center in Louisiana creates 500 permanent operations jobs",
  'CoreWeave raises $1.5B to build 5 new GPU cluster facilities — infrastructure hiring surge',
  'Digital Realty expanding Phoenix campus — seeking 100 cooling and electrical engineers',
  'NTT Data Centers breaks ground in Dallas — largest single-campus build in Texas history',
  'Nvidia partners with 3 colocation providers for dedicated AI infrastructure campuses',
  'QTS Realty hiring NOC engineers and facilities managers across Southeast US',
  'Iron Mountain data center division expanding — seeking BICSI-certified project managers',
  'US data center construction spending hits record $28B in Q1 2026 — talent demand at all-time high',
]

const NAV_LINKS = [
  { label: 'Browse Jobs', href: '/jobs' },
  { label: '↳ Data Center Ops', href: '/jobs?category=Data+Center+Ops', sub: true },
  { label: '↳ AI Infrastructure', href: '/jobs?category=AI+Infrastructure', sub: true },
  { label: '↳ Construction', href: '/jobs?category=Construction', sub: true },
  { label: '↳ Electrical', href: '/jobs?category=Electrical', sub: true },
  { label: 'Post a Job', href: '/employers' },
  { label: 'Wiki', href: '/wiki' },
  { label: 'Docs', href: '/docs' },
  { label: 'Sign In', href: '/auth/login' },
]

const doubled = [...TICKER_ITEMS, ...TICKER_ITEMS]

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const router = useRouter()

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

  function handleSearch() {
    if (window.location.pathname === '/') {
      document.querySelector('input[type="text"]')?.scrollIntoView({ behavior: 'smooth' })
      setTimeout(() => {
        (document.querySelector('input[type="text"]') as HTMLInputElement)?.focus()
      }, 500)
    } else {
      router.push('/jobs')
    }
  }

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 flex flex-col"
        style={{
          background: 'rgba(0, 0, 0, 0.82)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
        }}
      >
        {/* Main nav row — 52px */}
        <div className="relative flex items-center justify-between px-6 md:px-8 h-[52px]">

          {/* Left — circle emblem + wordmark */}
          <Link
            href="/"
            className="flex items-center gap-2 flex-shrink-0"
            onClick={() => setMenuOpen(false)}
          >
            <div className="w-6 h-6 rounded-full border border-white/40 flex items-center justify-center flex-shrink-0">
              <span className="font-mono text-[10px] text-white leading-none">C</span>
            </div>
            <span className="font-display text-sm font-normal tracking-tight ml-1">
              <span className="text-white">Core</span>
              <span className="text-[#3ECF8E]">Stack</span>
            </span>
          </Link>

          {/* Center — single nav link, absolutely centered */}
          <Link
            href="/jobs"
            className="absolute left-1/2 -translate-x-1/2 hidden md:block font-mono text-sm text-white/60 hover:text-white transition-colors duration-200"
            onClick={() => setMenuOpen(false)}
          >
            Browse Jobs
          </Link>

          {/* Right — three modular buttons */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Button 1: text CTA */}
            <Link
              href="/jobs"
              className="border border-white/25 text-white font-mono text-xs px-5 h-[32px] flex items-center hover:bg-white/10 transition-colors duration-200 whitespace-nowrap"
            >
              Browse Jobs
            </Link>

            {/* Button 2: search */}
            <button
              onClick={handleSearch}
              className="w-[32px] h-[32px] border border-white/25 flex items-center justify-center hover:bg-white/10 transition-colors duration-200 cursor-pointer"
              aria-label="Search"
            >
              <Search size={14} className="text-white/70" />
            </button>

            {/* Button 3: hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="w-[32px] h-[32px] border border-white/25 flex items-center justify-center hover:bg-white/10 transition-colors duration-200 cursor-pointer"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
            >
              <div className="flex flex-col gap-[4px] items-center justify-center">
                <span className={`w-[14px] h-[1px] bg-white/70 transition-all duration-300 block ${menuOpen ? 'rotate-45 translate-y-[5px]' : ''}`} />
                <span className={`w-[14px] h-[1px] bg-white/70 transition-all duration-300 block ${menuOpen ? 'opacity-0' : ''}`} />
                <span className={`w-[14px] h-[1px] bg-white/70 transition-all duration-300 block ${menuOpen ? '-rotate-45 -translate-y-[5px]' : ''}`} />
              </div>
            </button>
          </div>
        </div>

        {/* Ticker row */}
        <div
          className="w-full overflow-hidden border-t border-white/10 py-2 flex items-center"
          role="marquee"
          aria-label="Live infrastructure news"
        >
          <div className="flex items-center flex-shrink-0">
            <span className="bg-white text-black font-mono text-[10px] font-bold px-2 py-0.5 uppercase tracking-widest ml-4 mr-3">
              LIVE
            </span>
            <div className="w-px h-3 bg-white/20 mr-3 flex-shrink-0" aria-hidden="true" />
          </div>
          <div className="flex-1 overflow-hidden">
            <div className="ticker-track">
              {doubled.map((item, i) => (
                <span
                  key={i}
                  className="inline-flex items-center font-mono text-[10px] text-white/45 whitespace-nowrap"
                >
                  {item}
                  <span className="text-[#3ECF8E] mx-8" aria-hidden="true">✦</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Full-screen overlay — paddingTop matches full header height */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed inset-0 z-40 bg-black overflow-y-auto"
            style={{ paddingTop: '80px' }}
          >
            <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] min-h-[calc(100vh-80px)] border-t border-white/10">

              {/* Left column — nav links */}
              <div className="bg-black border-r border-white/10 px-10 py-12">
                <p className="font-mono text-xs uppercase tracking-widest text-white/30 mb-6">
                  NAVIGATION
                </p>
                <nav className="flex flex-col">
                  {NAV_LINKS.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className={
                        link.sub
                          ? 'font-display text-lg text-white/40 hover:text-white/80 transition-colors duration-200 pl-4 py-1 block'
                          : 'font-display text-2xl md:text-3xl font-normal text-white/60 hover:text-white transition-colors duration-200 py-2 block'
                      }
                    >
                      {link.label}
                    </Link>
                  ))}
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
                  <Link
                    href="/auth/signup"
                    onClick={() => setMenuOpen(false)}
                    className="font-mono text-xs text-[#3ECF8E] inline-flex items-center gap-2 hover:gap-3 transition-all"
                  >
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
                  <Link
                    href="/employers"
                    onClick={() => setMenuOpen(false)}
                    className="font-mono text-xs text-[#3ECF8E] inline-flex items-center gap-2 hover:gap-3 transition-all"
                  >
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
