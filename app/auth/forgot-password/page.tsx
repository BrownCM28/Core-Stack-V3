'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Loader2, CheckCircle } from 'lucide-react'
import { authClient } from '@/lib/auth-client'

function RightPanel() {
  return (
    <div className="hidden md:flex flex-1 bg-[#EFEFEF] items-center justify-center p-8">
      <div className="w-full h-full rounded-3xl overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/hero-datacenter.png"
          alt=""
          className="w-full h-full object-cover object-center"
        />
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
      <div className="w-full md:w-[540px] flex-shrink-0 bg-white flex flex-col px-14 py-10 overflow-y-auto">
        {/* Logo */}
        <Link href="/" className="flex items-start mb-12">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/Untitled (58).png"
            alt="CoreStack"
            className="h-8 w-auto object-contain"
          />
        </Link>

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
