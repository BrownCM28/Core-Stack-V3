'use client'

import { useState, useEffect, useCallback, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import {
  Search, Bookmark, Briefcase, ChevronDown, ArrowRight, X,
} from 'lucide-react'
import { ApplyModal } from '@/components/ApplyModal'
import { formatSalary } from '@/lib/types'
import type { ApiJob } from '@/lib/types'

function timeAgo(date: string): string {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000)
  if (seconds < 86400) return 'Today'
  const days = Math.floor(seconds / 86400)
  if (days < 7) return `${days}d ago`
  const weeks = Math.floor(days / 7)
  if (weeks < 4) return `${weeks}w ago`
  const months = Math.floor(days / 30)
  return `${months}mo ago`
}

function CompanyLogo({ company, size = 'sm' }: { company: string; size?: 'sm' | 'lg' }) {
  const initials = company.slice(0, 2).toUpperCase()
  return (
    <div
      className={`border-2 border-black bg-[#EFEFEF] flex items-center justify-center flex-shrink-0 font-mono font-bold text-black ${
        size === 'lg' ? 'w-16 h-16 text-2xl' : 'w-10 h-10 text-xs'
      }`}
    >
      {initials}
    </div>
  )
}

function SkeletonCard() {
  return (
    <div className="bg-white border-b-2 border-black px-4 py-4 animate-pulse">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 bg-gray-200 flex-shrink-0" />
        <div className="flex-1">
          <div className="h-4 bg-gray-200 w-3/4 mb-2" />
          <div className="h-3 bg-gray-200 w-1/2 mb-3" />
          <div className="flex gap-1">
            <div className="h-5 bg-gray-200 w-20" />
            <div className="h-5 bg-gray-200 w-16" />
          </div>
        </div>
      </div>
    </div>
  )
}

function JobCard({
  job,
  isSelected,
  onClick,
}: {
  job: ApiJob
  isSelected: boolean
  onClick: () => void
}) {
  return (
    <div
      onClick={onClick}
      className="border-b-2 border-black px-4 py-4 cursor-pointer relative transition-colors"
      style={{
        backgroundColor: isSelected ? '#F5F5F5' : '#FFFFFF',
        borderLeft: isSelected ? '3px solid #3ECF8E' : undefined,
      }}
      onMouseEnter={(e) => {
        if (!isSelected) (e.currentTarget as HTMLDivElement).style.backgroundColor = '#FAFAFA'
      }}
      onMouseLeave={(e) => {
        if (!isSelected) (e.currentTarget as HTMLDivElement).style.backgroundColor = '#FFFFFF'
      }}
    >
      <Bookmark
        size={16}
        className="absolute top-3 right-3 text-gray-300 hover:text-black transition-colors cursor-pointer"
        onClick={(e) => e.stopPropagation()}
      />

      <div className="flex items-start gap-3">
        <CompanyLogo company={job.company} />
        <div className="flex-1 min-w-0 pr-6">
          <h3 className="font-display text-base font-normal text-black leading-tight">
            {job.title}
          </h3>
          <p className="font-mono text-xs text-gray-500 mt-0.5">{job.company}</p>
        </div>
      </div>

      <div className="mt-2 flex flex-wrap gap-1">
        <span className="border border-gray-300 bg-white font-mono text-[10px] text-gray-500 px-2 py-0.5">
          {job.category}
        </span>
        <span className="border border-gray-300 bg-white font-mono text-[10px] text-gray-500 px-2 py-0.5">
          {job.type}
        </span>
        {job.remote && (
          <span className="border border-gray-300 bg-white font-mono text-[10px] text-gray-500 px-2 py-0.5">
            Remote
          </span>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between">
        <span className="font-mono text-[10px] text-gray-400">{timeAgo(job.postedAt)}</span>
        <span className="font-mono text-[10px] text-gray-500 flex items-center gap-1">
          <Briefcase size={10} />
          {job.type}
        </span>
      </div>
    </div>
  )
}

function JobDetail({
  job,
  onApply,
}: {
  job: ApiJob | null
  onApply: (job: ApiJob) => void
}) {
  const [showFull, setShowFull] = useState(false)
  const [email, setEmail] = useState('')

  useEffect(() => { setShowFull(false) }, [job])

  if (!job) {
    return (
      <div className="flex-1 bg-white flex items-center justify-center">
        <p className="font-mono text-sm text-gray-400">Select a role to view details</p>
      </div>
    )
  }

  const desc = job.description ?? ''
  const needsTrunc = desc.length > 400

  const metaTags = [
    job.type,
    job.category,
    job.location,
    formatSalary(job.salaryMin, job.salaryMax, job.salary),
  ].filter(Boolean)

  return (
    <div className="flex-1 bg-white overflow-y-auto px-8 py-8">
      {/* Header */}
      <CompanyLogo company={job.company} size="lg" />
      <h1 className="font-display text-3xl font-normal text-black mt-4 mb-1">{job.title}</h1>
      <p className="font-mono text-sm text-gray-500">{job.company}</p>

      <div className="mt-3 flex flex-wrap gap-2">
        {metaTags.map((tag, i) => (
          <span key={i} className="border-2 border-black font-mono text-xs px-3 py-1 text-black">
            {tag}
          </span>
        ))}
      </div>

      <button
        onClick={() => onApply(job)}
        className="mt-4 bg-[#3ECF8E] border-2 border-black font-mono text-sm font-medium px-8 py-3 text-black flex items-center gap-2 hover:bg-[#34C47E] transition-colors cursor-pointer"
      >
        Apply Now
        <ArrowRight size={14} />
      </button>

      <div className="border-t-2 border-black mt-6 mb-6" />

      {/* Overview */}
      <h2 className="font-display text-xl font-normal text-black mb-3">Overview</h2>
      <div className="font-sans text-sm text-gray-700 leading-7">
        {needsTrunc && !showFull ? (
          <>
            <p>{desc.slice(0, 400)}…</p>
            <button
              onClick={() => setShowFull(true)}
              className="mt-2 font-mono text-xs text-[#3ECF8E] hover:underline cursor-pointer"
            >
              Read more
            </button>
          </>
        ) : (
          <p>{desc || 'No description available.'}</p>
        )}
      </div>

      {/* Tags */}
      <div className="mt-6">
        <p className="font-mono text-xs uppercase tracking-widest text-gray-400 mb-2">Tags</p>
        <div className="flex flex-wrap gap-1">
          {[job.category, job.type, job.remote ? 'Remote' : null]
            .filter(Boolean)
            .map((tag, i) => (
              <span
                key={i}
                className="border border-gray-300 bg-white font-mono text-[10px] text-gray-500 px-2 py-0.5"
              >
                {tag}
              </span>
            ))}
        </div>
      </div>

      {/* Details row */}
      <div className="mt-6 pt-6 border-t border-[#E5E5E5] flex">
        <div className="flex-1 pl-0 pr-6 border-r border-[#E5E5E5]">
          <p className="font-mono text-xs uppercase text-gray-400 mb-1">Job Type</p>
          <p className="font-display text-lg font-normal text-black">{job.type}</p>
        </div>
        <div className="flex-1 px-6 border-r border-[#E5E5E5]">
          <p className="font-mono text-xs uppercase text-gray-400 mb-1">Salary Range</p>
          <p className="font-display text-lg font-normal text-black">
            {formatSalary(job.salaryMin, job.salaryMax, job.salary) || 'Not specified'}
          </p>
        </div>
        <div className="flex-1 pl-6">
          <p className="font-mono text-xs uppercase text-gray-400 mb-1">Location</p>
          <p className="font-display text-lg font-normal text-black">{job.location}</p>
        </div>
      </div>

      {/* Email banner */}
      <div className="mt-8 bg-black border-2 border-black px-6 py-4 flex items-center justify-between flex-wrap gap-4">
        <p className="font-display text-lg font-normal text-white">
          Get curated jobs delivered to your inbox
        </p>
        <div className="flex items-center">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address"
            className="bg-white border-2 border-white font-mono text-sm px-3 py-2 text-black outline-none w-[220px]"
          />
          <button className="bg-[#3ECF8E] border-2 border-[#3ECF8E] font-mono text-sm font-medium text-black px-4 py-2 hover:bg-[#34C47E] transition-colors cursor-pointer whitespace-nowrap">
            Send me jobs
          </button>
        </div>
      </div>
    </div>
  )
}

function JobsPageClient() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [jobs, setJobs] = useState<ApiJob[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [selectedJob, setSelectedJob] = useState<ApiJob | null>(null)
  const [activeSort, setActiveSort] = useState<'best' | 'recent' | 'popular'>('recent')
  const [showFilters, setShowFilters] = useState(true)
  const [applyJob, setApplyJob] = useState<ApiJob | null>(null)
  const [searchInput, setSearchInput] = useState(searchParams.get('search') ?? '')
  const [filterJobType, setFilterJobType] = useState(searchParams.get('jobType') ?? '')
  const [filterLevel, setFilterLevel] = useState(searchParams.get('level') ?? '')
  const [filterCategory, setFilterCategory] = useState(searchParams.get('category') ?? '')
  const [filterLocation, setFilterLocation] = useState(searchParams.get('location') ?? '')

  const filterCount = [filterJobType, filterLevel, filterCategory, filterLocation].filter(Boolean).length

  const fetchJobs = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams(searchParams.toString())
      params.set('limit', '20')
      const res = await fetch(`/api/jobs?${params.toString()}`)
      const data = await res.json()
      setJobs(data.jobs ?? [])
      setTotal(data.total ?? 0)
    } finally {
      setLoading(false)
    }
  }, [searchParams])

  useEffect(() => { fetchJobs() }, [fetchJobs])

  useEffect(() => {
    if (jobs.length > 0 && !selectedJob) {
      setSelectedJob(jobs[0])
    }
  }, [jobs]) // eslint-disable-line react-hooks/exhaustive-deps

  function pushSearch() {
    const params = new URLSearchParams()
    if (searchInput.trim()) params.set('search', searchInput.trim())
    if (filterJobType) params.set('jobType', filterJobType)
    if (filterLevel) params.set('level', filterLevel)
    if (filterCategory) params.set('category', filterCategory)
    if (filterLocation) params.set('location', filterLocation)
    const sortMap = { best: '', recent: 'newest', popular: 'relevant' }
    const sort = sortMap[activeSort]
    if (sort) params.set('sort', sort)
    router.push(`/jobs?${params.toString()}`)
  }

  function clearFilters() {
    setFilterJobType('')
    setFilterLevel('')
    setFilterCategory('')
    setFilterLocation('')
    setSearchInput('')
    router.push('/jobs')
  }

  function handleCardClick(job: ApiJob) {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      router.push(`/jobs/${job.id}`)
    } else {
      setSelectedJob(job)
    }
  }

  const sortLabels = { best: 'Best Matches', recent: 'Most Recent', popular: 'Most Popular' }

  return (
    <>
      <div className="flex flex-col bg-[#EFEFEF]" style={{ height: 'calc(100vh - 90px)' }}>

        {/* ── Top bar ── */}
        <div className="border-b-2 border-black px-6 py-5 bg-[#EFEFEF] flex-shrink-0">
          {/* Row 1 */}
          <div className="flex items-center gap-3">
            {/* Sort tabs */}
            <div className="hidden md:flex items-center flex-shrink-0">
              {(['best', 'recent', 'popular'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setActiveSort(s)}
                  className={`font-mono text-xs px-4 py-2 border-2 transition-colors cursor-pointer whitespace-nowrap ${
                    activeSort === s
                      ? 'bg-black text-white border-black'
                      : 'bg-transparent text-gray-500 border-transparent hover:border-black hover:text-black'
                  }`}
                >
                  {sortLabels[s]}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="flex items-center flex-1 max-w-xl border-2 border-black bg-white h-10 px-4">
              <Search size={14} className="text-gray-400 flex-shrink-0 mr-2" aria-hidden="true" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && pushSearch()}
                placeholder="Search jobs or tags..."
                className="flex-1 font-mono text-sm text-black bg-transparent outline-none placeholder:text-gray-400"
              />
            </div>

            {/* Filter toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 border-2 border-black bg-white font-mono text-xs px-4 h-10 flex-shrink-0 hover:bg-[#FAFAFA] transition-colors cursor-pointer"
            >
              Filter
              {filterCount > 0 && (
                <span className="w-5 h-5 bg-black text-white font-mono text-xs flex items-center justify-center">
                  {filterCount}
                </span>
              )}
            </button>
          </div>

          {/* Row 2 — filter dropdowns */}
          {showFilters && (
            <div className="flex items-center gap-2 mt-3 flex-wrap">
              {/* Employment Type */}
              <div className="relative flex-shrink-0">
                <select
                  value={filterJobType}
                  onChange={(e) => setFilterJobType(e.target.value)}
                  className="border-2 border-black bg-white font-mono text-xs px-3 h-9 appearance-none pr-7 text-black cursor-pointer outline-none"
                >
                  <option value="">Employment Type</option>
                  {['Full-time', 'Contract', 'Part-time', 'Remote'].map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
                <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-black pointer-events-none" />
              </div>

              {/* Job Level */}
              <div className="relative flex-shrink-0">
                <select
                  value={filterLevel}
                  onChange={(e) => setFilterLevel(e.target.value)}
                  className="border-2 border-black bg-white font-mono text-xs px-3 h-9 appearance-none pr-7 text-black cursor-pointer outline-none"
                >
                  <option value="">Job Level</option>
                  {['Entry', 'Mid', 'Senior', 'Lead', 'Principal'].map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
                <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-black pointer-events-none" />
              </div>

              {/* Job Category */}
              <div className="relative flex-shrink-0">
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="border-2 border-black bg-white font-mono text-xs px-3 h-9 appearance-none pr-7 text-black cursor-pointer outline-none"
                >
                  <option value="">Job Category</option>
                  {[
                    'Data Center Ops', 'AI Infrastructure', 'Electrical',
                    'Cooling/HVAC', 'Construction', 'Networking', 'Project Management',
                  ].map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
                <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-black pointer-events-none" />
              </div>

              {/* Location */}
              <input
                type="text"
                value={filterLocation}
                onChange={(e) => setFilterLocation(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && pushSearch()}
                placeholder="Enter city or Remote"
                className="border-2 border-black bg-white font-mono text-xs px-3 h-9 outline-none text-black placeholder:text-gray-400 w-44"
              />

              {/* Search */}
              <button
                onClick={pushSearch}
                className="bg-black text-white font-mono text-sm px-6 h-9 border-2 border-black hover:bg-gray-900 transition-colors cursor-pointer flex-shrink-0"
              >
                Search
              </button>

              {/* Clear */}
              {filterCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1 font-mono text-xs text-gray-500 hover:text-black transition-colors cursor-pointer"
                >
                  <X size={12} />
                  Clear
                </button>
              )}
            </div>
          )}
        </div>

        {/* ── Two-panel layout ── */}
        <div className="flex flex-1 min-h-0">

          {/* Left panel — job cards */}
          <div className="w-[420px] flex-shrink-0 border-r-2 border-black bg-[#EFEFEF] flex flex-col">
            {/* Results bar */}
            <div className="px-4 py-3 border-b-2 border-black bg-white flex-shrink-0">
              <p className="font-mono text-xs text-gray-500">
                <span className="text-black font-semibold">{total}</span> roles found
              </p>
            </div>

            {/* Card list */}
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)
              ) : jobs.length === 0 ? (
                <div className="px-4 py-12 text-center">
                  <p className="font-mono text-sm text-gray-400">No roles found.</p>
                  <button
                    onClick={clearFilters}
                    className="mt-4 font-mono text-xs text-black border-2 border-black px-4 py-2 hover:bg-black hover:text-white transition-colors cursor-pointer"
                  >
                    Clear filters
                  </button>
                </div>
              ) : (
                jobs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    isSelected={selectedJob?.id === job.id}
                    onClick={() => handleCardClick(job)}
                  />
                ))
              )}
            </div>
          </div>

          {/* Right panel — detail view (desktop only) */}
          <div className="hidden md:flex flex-1 min-w-0 overflow-y-auto">
            <JobDetail job={selectedJob} onApply={(j) => setApplyJob(j)} />
          </div>
        </div>
      </div>

      <ApplyModal
        open={applyJob !== null}
        onClose={() => setApplyJob(null)}
        job={applyJob}
      />
    </>
  )
}

export default function JobsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-[calc(100vh-90px)]">
          <p className="font-mono text-sm text-gray-400">Loading…</p>
        </div>
      }
    >
      <JobsPageClient />
    </Suspense>
  )
}
