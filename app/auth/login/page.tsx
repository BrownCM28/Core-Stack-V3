'use client'

import { useState, useRef, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Github, Mail, Search, MoreHorizontal, Loader2 } from 'lucide-react'
import { signIn } from '@/lib/auth-client'

function GithubIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  )
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4" />
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853" />
      <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05" />
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335" />
    </svg>
  )
}

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

        {/* Floating mock card */}
        <div className="bg-white border-2 border-black w-[300px] shadow-2xl text-left">
          {/* Card header */}
          <div className="border-b-2 border-black px-4 py-3 flex items-center justify-between">
            <span className="font-mono text-xs font-bold text-black">Recent Applications</span>
            <MoreHorizontal size={14} className="text-gray-400" />
          </div>

          {/* Search row */}
          <div className="border-b border-gray-200 px-4 py-2 flex items-center gap-2">
            <Search size={12} className="text-gray-400 flex-shrink-0" />
            <span className="font-mono text-xs text-gray-400">Search by name or role...</span>
          </div>

          {/* Recently applied */}
          <div className="px-4 pt-3 pb-1">
            <span className="font-mono text-[10px] uppercase tracking-widest text-gray-400">Recently applied</span>
          </div>
          {MOCK_CANDIDATES.slice(0, 3).map(({ name, email }) => (
            <div key={name} className="px-4 py-2 flex items-center gap-3 border-b border-gray-100 hover:bg-gray-50">
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

          {/* All candidates */}
          <div className="px-4 pt-3 pb-1">
            <span className="font-mono text-[10px] uppercase tracking-widest text-gray-400">All candidates</span>
          </div>
          {MOCK_CANDIDATES.slice(3).map(({ name, email }) => (
            <div key={name} className="px-4 py-2 flex items-center gap-3 border-b border-gray-100 hover:bg-gray-50">
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

          {/* Footer */}
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

function LoginInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const emailRef = useRef<HTMLInputElement>(null)

  const redirectTarget =
    searchParams.get('redirect') ||
    (typeof window !== 'undefined' ? window.sessionStorage.getItem('pendingRedirect') : null) ||
    '/dashboard'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loadingEmail, setLoadingEmail] = useState(false)
  const [loadingGithub, setLoadingGithub] = useState(false)
  const [loadingGoogle, setLoadingGoogle] = useState(false)

  async function handleEmailSignIn(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoadingEmail(true)
    const { error: err } = await signIn.email({ email, password })
    setLoadingEmail(false)
    if (err) { setError(err.message ?? 'Invalid email or password.'); return }
    if (typeof window !== 'undefined') window.sessionStorage.removeItem('pendingRedirect')
    router.push(redirectTarget)
    router.refresh()
  }

  async function handleGithub() {
    setLoadingGithub(true)
    if (typeof window !== 'undefined') window.sessionStorage.setItem('pendingRedirect', redirectTarget)
    await signIn.social({ provider: 'github', callbackURL: redirectTarget })
  }

  async function handleGoogle() {
    setLoadingGoogle(true)
    if (typeof window !== 'undefined') window.sessionStorage.setItem('pendingRedirect', redirectTarget)
    await signIn.social({ provider: 'google', callbackURL: redirectTarget })
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
          <h1 className="font-display text-2xl font-normal text-black mb-1">Welcome back</h1>
          <p className="font-sans text-sm text-gray-500 mb-8">Sign in to your CoreStack account</p>

          {/* GitHub CTA */}
          <button
            onClick={handleGithub}
            disabled={loadingGithub}
            className="w-full border-2 border-black bg-black text-white font-mono text-sm py-3 flex items-center justify-center gap-3 hover:bg-gray-900 transition-colors disabled:opacity-60 cursor-pointer"
          >
            {loadingGithub ? <Loader2 size={16} className="animate-spin" /> : <GithubIcon />}
            Continue with GitHub
          </button>

          {/* Divider */}
          <div className="my-5 flex items-center gap-3">
            <div className="flex-1 border-t border-gray-200" />
            <span className="font-mono text-xs text-gray-400">or</span>
            <div className="flex-1 border-t border-gray-200" />
          </div>

          {/* Email + password form */}
          <form onSubmit={handleEmailSignIn} className="flex flex-col gap-0">
            <label className="font-mono text-xs text-black mb-1.5 block">Email</label>
            <input
              ref={emailRef}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
              className="w-full border border-gray-300 bg-white font-sans text-sm text-black px-3 py-2.5 outline-none placeholder:text-gray-400 focus:border-black transition-colors"
            />

            <label className="font-mono text-xs text-black mt-4 mb-1.5 block">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
              className="w-full border border-gray-300 bg-white font-sans text-sm text-black px-3 py-2.5 outline-none placeholder:text-gray-400 focus:border-black transition-colors"
            />

            <div className="mt-2 flex justify-end">
              <Link href="/auth/forgot-password" className="font-mono text-xs text-gray-400 hover:text-black transition-colors">
                Forgot password?
              </Link>
            </div>

            {error && <p className="mt-3 font-mono text-xs text-red-500 text-center">{error}</p>}

            <button
              type="submit"
              disabled={loadingEmail}
              className="mt-6 w-full bg-black text-white font-mono text-sm py-3 border-2 border-black hover:bg-gray-900 transition-colors disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
            >
              {loadingEmail && <Loader2 size={14} className="animate-spin" />}
              Sign in
            </button>
          </form>

          {/* OAuth row */}
          <div className="mt-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 border-t border-gray-200" />
              <span className="font-mono text-xs text-gray-400">or continue with</span>
              <div className="flex-1 border-t border-gray-200" />
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleGoogle}
                disabled={loadingGoogle}
                className="flex-1 border border-gray-300 bg-white py-2.5 flex items-center justify-center hover:border-black transition-colors disabled:opacity-60 cursor-pointer"
              >
                {loadingGoogle ? <Loader2 size={14} className="animate-spin" /> : <GoogleIcon />}
              </button>
              <button
                onClick={handleGithub}
                disabled={loadingGithub}
                className="flex-1 border border-gray-300 bg-white py-2.5 flex items-center justify-center hover:border-black transition-colors disabled:opacity-60 cursor-pointer"
              >
                <Github size={18} className="text-black" />
              </button>
              <button
                type="button"
                onClick={() => emailRef.current?.focus()}
                className="flex-1 border border-gray-300 bg-white py-2.5 flex items-center justify-center hover:border-black transition-colors cursor-pointer"
              >
                <Mail size={18} className="text-gray-500" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="max-w-[340px] w-full mx-auto">
          <p className="text-center font-sans text-sm text-gray-500">
            Don&apos;t have an account?{' '}
            <Link href="/auth/signup" className="font-mono text-sm text-black underline font-medium">
              Sign up
            </Link>
          </p>
          <p className="mt-4 font-sans text-xs text-gray-400 text-center">
            By signing in, you agree to our terms of use.
          </p>
        </div>
      </div>

      <RightPanel />
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginInner />
    </Suspense>
  )
}
