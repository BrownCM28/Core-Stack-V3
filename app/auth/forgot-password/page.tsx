'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, MoreHorizontal, Loader2, CheckCircle } from 'lucide-react'
import { authClient } from '@/lib/auth-client'

const MOCK_CANDIDATES = [
  { name: 'Alex Chen', email: 'alexchen@email.com' },
  { name: 'Mia Kumar', email: 'mkumar@email.com' },
  { name: 'James Liu', email: 'jliu@email.com' },
  { name: 'Sarah Park', email: 'sarah@email.com' },
  { name: 'Marcus T.', email: 'marcus@email.com' },
]

function RightPanel() {
  return (
    <div className="hidden md:flex flex-1 relative overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/hero-datacenter.png"
        alt=""
        className="absolute inset-0 w-full h-full object-cover object-center"
      />
      <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.52)' }} />

      <div className="relative z-10 flex flex-col justify-center items-center h-full px-12 text-center">
        <h2 className="font-display text-4xl font-normal text-white leading-tight mb-4 max-w-sm">
          Built for the people who keep the world running.
        </h2>
        <p className="font-sans text-sm text-white/70 max-w-xs leading-relaxed mb-12">
          Data center and AI infrastructure jobs aggregated daily. Your GitHub profile is your resume.
        </p>

        <div className="bg-white border-2 border-black w-[300px] shadow-2xl text-left">
          <div className="border-b-2 border-black px-4 py-3 flex items-center justify-between">
            <span className="font-mono text-xs font-bold text-black">Recent Applications</span>
            <MoreHorizontal size={14} className="text-gray-400" />
          </div>
          <div className="border-b border-gray-200 px-4 py-2 flex items-center gap-2">
            <Search size={12} className="text-gray-400 flex-shrink-0" />
            <span className="font-mono text-xs text-gray-400">Search by name or role...</span>
          </div>
          <div className="px-4 pt-3 pb-1">
            <span className="font-mono text-[10px] uppercase tracking-widest text-gray-400">Recently applied</span>
          </div>
          {MOCK_CANDIDATES.slice(0, 3).map(({ name, email }) => (
            <div key={name} className="px-4 py-2 flex items-center gap-3 border-b border-gray-100">
              <div className="w-7 h-7 rounded-full bg-[#EFEFEF] border border-gray-300 flex items-center justify-center flex-shrink-0">
                <span className="font-mono text-[10px] font-bold text-black">
                  {name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div className="min-w-0">
                <p className="font-mono text-xs font-medium text-black truncate">{name}</p>
                <p className="font-mono text-[10px] text-gray-400 truncate">{email}</p>
              </div>
            </div>
          ))}
          <div className="px-4 pt-3 pb-1">
            <span className="font-mono text-[10px] uppercase tracking-widest text-gray-400">All candidates</span>
          </div>
          {MOCK_CANDIDATES.slice(3).map(({ name, email }) => (
            <div key={name} className="px-4 py-2 flex items-center gap-3 border-b border-gray-100">
              <div className="w-7 h-7 rounded-full bg-[#EFEFEF] border border-gray-300 flex items-center justify-center flex-shrink-0">
                <span className="font-mono text-[10px] font-bold text-black">
                  {name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div className="min-w-0">
                <p className="font-mono text-xs font-medium text-black truncate">{name}</p>
                <p className="font-mono text-[10px] text-gray-400 truncate">{email}</p>
              </div>
            </div>
          ))}
          <div className="px-4 py-2 border-t-2 border-black bg-[#EFEFEF] flex items-center gap-2">
            <span className="font-mono text-[10px] text-gray-500"># tags</span>
            <span className="font-mono text-[10px] text-gray-300">·</span>
            <span className="font-mono text-[10px] text-gray-500">+ navigate</span>
            <span className="font-mono text-[10px] text-gray-300">·</span>
            <span className="font-mono text-[10px] text-gray-500">open</span>
            <span className="font-mono text-[10px] text-gray-300">·</span>
            <span className="font-mono text-[10px] text-gray-500">close</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: err } = await (authClient as any).forgetPassword({
      email,
      redirectTo: '/auth/reset-password',
    })
    setLoading(false)
    if (err) { setError(err.message ?? 'Something went wrong. Please try again.'); return }
    setSent(true)
  }

  return (
    <div className="fixed inset-0 z-[60] flex">
      {/* Left panel */}
      <div className="w-full md:w-[480px] flex-shrink-0 bg-white flex flex-col px-12 py-10 overflow-y-auto">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-12">
          <div className="w-8 h-8 border-2 border-black bg-black flex items-center justify-center">
            <span className="font-mono text-xs text-white font-bold">CS</span>
          </div>
          <span className="font-display text-base font-normal">
            <span className="text-black">Core</span>
            <span className="text-[#3ECF8E]">Stack</span>
          </span>
        </div>

        {/* Form */}
        <div className="flex-1 flex flex-col justify-center max-w-[340px] w-full mx-auto">
          {sent ? (
            <div className="text-center">
              <CheckCircle size={40} className="text-[#3ECF8E] mx-auto mb-4" />
              <h1 className="font-display text-2xl font-normal text-black mb-2">Check your inbox</h1>
              <p className="font-sans text-sm text-gray-500 leading-relaxed mb-6">
                We sent a reset link to <span className="text-black font-medium">{email}</span>. It expires in 1 hour.
              </p>
              <Link href="/auth/login" className="font-mono text-sm text-black underline">
                ← Back to sign in
              </Link>
            </div>
          ) : (
            <>
              <h1 className="font-display text-2xl font-normal text-black mb-1">Reset your password</h1>
              <p className="font-sans text-sm text-gray-500 mb-8">
                Enter your email and we will send you a reset link
              </p>

              <form onSubmit={handleSubmit} className="flex flex-col gap-0">
                <label className="font-mono text-xs text-black mb-1.5 block">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Enter your email"
                  className="w-full border border-gray-300 bg-white font-sans text-sm text-black px-3 py-2.5 outline-none placeholder:text-gray-400 focus:border-black transition-colors"
                />

                {error && <p className="mt-3 font-mono text-xs text-red-500 text-center">{error}</p>}

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-6 w-full bg-black text-white font-mono text-sm py-3 border-2 border-black hover:bg-gray-900 transition-colors disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loading && <Loader2 size={14} className="animate-spin" />}
                  Send reset link
                </button>
              </form>

              <div className="mt-6">
                <Link href="/auth/login" className="font-mono text-xs text-gray-400 hover:text-black transition-colors flex items-center gap-1">
                  ← Back to sign in
                </Link>
              </div>
            </>
          )}
        </div>

        <div className="max-w-[340px] w-full mx-auto">
          <p className="text-center font-sans text-sm text-gray-500">
            Remember your password?{' '}
            <Link href="/auth/login" className="font-mono text-sm text-black underline font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>

      <RightPanel />
    </div>
  )
}
