'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Search, Building2, Zap, Eye, Coffee,
  CheckCircle2, Check, ArrowRight,
} from 'lucide-react'

const CATEGORIES = [
  'Data Center Ops',
  'AI Infrastructure',
  'Electrical / Power',
  'Cooling / HVAC',
  'Construction',
  'Networking / NOC',
  'DCIM / Sys Admin',
  'Project Management',
]

const TOTAL_STEPS = 4

async function saveStep(data: Record<string, unknown>) {
  await fetch('/api/onboarding', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
}

function StepDots({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: TOTAL_STEPS }, (_, i) => {
        const stepNum = i + 1
        if (stepNum < current) {
          return <span key={i} className="w-2 h-2 rounded-full bg-black" />
        }
        if (stepNum === current) {
          return <span key={i} className="w-2.5 h-2.5 rounded-full bg-[#3ECF8E]" />
        }
        return <span key={i} className="w-2 h-2 rounded-full bg-gray-200" />
      })}
    </div>
  )
}

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [userType, setUserType] = useState<string | null>(null)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [workPreference, setWorkPreference] = useState<string | null>(null)
  const [availability, setAvailability] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // Resume saved progress
  useEffect(() => {
    fetch('/api/user/profile')
      .then(r => r.json())
      .then(user => {
        if (user.onboardingStep && user.onboardingStep > 0) setStep(user.onboardingStep)
        if (user.userType) setUserType(user.userType)
        if (user.jobCategories?.length) setSelectedCategories(user.jobCategories)
        if (user.workPreference) setWorkPreference(user.workPreference)
        if (user.availability) setAvailability(user.availability)
      })
      .catch(() => {})
  }, [])

  function toggleCategory(cat: string) {
    setSelectedCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    )
  }

  async function handleUserType(type: string) {
    setUserType(type)
    await saveStep({ userType: type, onboardingStep: type === 'employer' ? 4 : 2 })
    if (type === 'employer') {
      router.push('/employers/post')
    } else {
      setStep(2)
    }
  }

  async function handleStep2Continue() {
    if (selectedCategories.length === 0) return
    setLoading(true)
    await saveStep({ jobCategories: selectedCategories, workPreference, onboardingStep: 3 })
    setLoading(false)
    setStep(3)
  }

  async function handleAvailability(value: string) {
    setAvailability(value)
    await saveStep({
      availability: value,
      openToWork: value !== 'not-looking',
      onboardingStep: 4,
    })
    setStep(4)
  }

  async function handleFinish() {
    setLoading(true)
    await saveStep({ onboardingCompleted: true, onboardingStep: 4 })
    setLoading(false)
    const cats = selectedCategories.map(c => encodeURIComponent(c)).join(',')
    router.push(cats ? `/jobs?categories=${cats}` : '/jobs')
  }

  return (
    <div className="min-h-screen bg-[#EFEFEF] flex items-center justify-center px-4 py-12">
      <div
        className="bg-white w-full max-w-[600px] border-2 border-black overflow-hidden"
        style={{ borderRadius: '16px' }}
      >
        {/* Card header */}
        <div className="border-b-2 border-black px-8 py-5 flex items-center justify-between">
          <Link href="/">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/Untitled (58).png"
              alt="CoreStack"
              className="h-7 w-auto object-contain"
            />
          </Link>
          <StepDots current={step} />
        </div>

        {/* Animated step content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >

            {/* ── STEP 1 — Who are you? ── */}
            {step === 1 && (
              <div className="px-8 py-10">
                <h1 className="font-display text-2xl font-normal text-black mb-2 text-center">
                  What brings you to CoreStack?
                </h1>
                <p className="font-sans text-sm text-gray-500 text-center mb-8">
                  This helps us personalise your experience
                </p>

                <div className="grid grid-cols-2 gap-4">
                  {[
                    {
                      type: 'candidate',
                      icon: <Search size={18} className="text-black" />,
                      title: "I'm looking for a role",
                      sub: 'Browse and apply to data center and AI infrastructure jobs',
                    },
                    {
                      type: 'employer',
                      icon: <Building2 size={18} className="text-black" />,
                      title: "I'm hiring",
                      sub: 'Post a listing or find infrastructure talent for my team',
                    },
                  ].map(({ type, icon, title, sub }) => (
                    <button
                      key={type}
                      onClick={() => handleUserType(type)}
                      className="border-2 border-black bg-white p-6 cursor-pointer flex flex-col items-start gap-3 transition-all duration-150 text-left hover:bg-[#FAFAFA]"
                      style={{
                        borderRadius: '12px',
                        ...(userType === type && {
                          borderColor: '#3ECF8E',
                          backgroundColor: 'rgba(62,207,142,0.04)',
                        }),
                      }}
                    >
                      <div
                        className="w-10 h-10 border-2 border-black flex items-center justify-center"
                        style={{ borderRadius: '8px' }}
                      >
                        {icon}
                      </div>
                      <div>
                        <p className="font-display text-lg font-normal text-black">{title}</p>
                        <p className="font-sans text-xs text-gray-500 leading-relaxed mt-1">{sub}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ── STEP 2 — Role preferences ── */}
            {step === 2 && (
              <div className="px-8 py-8">
                <h1 className="font-display text-2xl font-normal text-black mb-1">
                  What type of work are you looking for?
                </h1>
                <p className="font-sans text-sm text-gray-500 mb-6">Select all that apply</p>

                {/* Category pills */}
                <div className="flex flex-wrap gap-2 mb-8">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat}
                      onClick={() => toggleCategory(cat)}
                      className={`border-2 border-black font-mono text-xs px-4 py-2 cursor-pointer transition-all duration-150 ${
                        selectedCategories.includes(cat)
                          ? 'bg-black text-white'
                          : 'bg-white text-black hover:bg-[#FAFAFA]'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Work preference */}
                <p className="font-mono text-xs uppercase tracking-widest text-gray-400 mb-3">
                  WORK PREFERENCE
                </p>
                <div className="flex gap-3 mb-8">
                  {[
                    { value: 'full-time', label: 'Full-time only' },
                    { value: 'contract', label: 'Contract / consulting' },
                    { value: 'both', label: 'Open to both' },
                  ].map(({ value, label }) => (
                    <button
                      key={value}
                      onClick={() => setWorkPreference(value)}
                      className={`flex-1 border-2 border-black font-mono text-xs py-2.5 text-center cursor-pointer transition-all duration-150 ${
                        workPreference === value
                          ? 'bg-black text-white'
                          : 'bg-white text-black hover:bg-[#FAFAFA]'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleStep2Continue}
                  disabled={selectedCategories.length === 0 || loading}
                  className="w-full bg-black text-white font-mono text-sm py-3 border-2 border-black hover:bg-gray-900 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  Continue
                </button>
              </div>
            )}

            {/* ── STEP 3 — Availability ── */}
            {step === 3 && (
              <div className="px-8 py-10">
                <h1 className="font-display text-2xl font-normal text-black mb-2 text-center">
                  When are you available?
                </h1>
                <p className="font-sans text-sm text-gray-500 text-center mb-8">
                  We will match you with relevant opportunities
                </p>

                <div className="flex flex-col gap-3">
                  {[
                    {
                      value: 'active',
                      icon: <Zap size={16} />,
                      title: 'Actively looking',
                      sub: 'Ready to start — show me everything',
                    },
                    {
                      value: 'open',
                      icon: <Eye size={16} />,
                      title: 'Open to the right opportunity',
                      sub: 'Employed but open — be selective',
                    },
                    {
                      value: 'not-looking',
                      icon: <Coffee size={16} />,
                      title: 'Not looking right now',
                      sub: 'Just exploring for now',
                    },
                  ].map(({ value, icon, title, sub }) => {
                    const selected = availability === value
                    return (
                      <button
                        key={value}
                        onClick={() => handleAvailability(value)}
                        className="w-full border-2 border-black bg-white px-6 py-5 cursor-pointer flex items-center gap-4 transition-all duration-150 text-left hover:bg-[#FAFAFA]"
                        style={{
                          borderRadius: '10px',
                          ...(selected && {
                            borderColor: '#3ECF8E',
                            backgroundColor: 'rgba(62,207,142,0.04)',
                          }),
                        }}
                      >
                        <div
                          className={`w-10 h-10 border-2 flex items-center justify-center flex-shrink-0 rounded-full transition-colors ${
                            selected
                              ? 'bg-black border-black text-white'
                              : 'border-black text-black'
                          }`}
                        >
                          {icon}
                        </div>
                        <div>
                          <p className="font-display text-base font-normal text-black">{title}</p>
                          <p className="font-mono text-xs text-gray-500 mt-0.5">{sub}</p>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* ── STEP 4 — Done ── */}
            {step === 4 && (
              <div className="px-8 py-10 text-center">
                <div
                  className="w-16 h-16 bg-[rgba(62,207,142,0.1)] border-2 border-[#3ECF8E] flex items-center justify-center mx-auto mb-6"
                  style={{ borderRadius: '50%' }}
                >
                  <CheckCircle2 size={28} className="text-[#3ECF8E]" />
                </div>

                <h1 className="font-display text-2xl font-normal text-black mb-2">
                  You&apos;re all set.
                </h1>
                <p className="font-sans text-sm text-gray-500 mb-8 max-w-xs mx-auto leading-relaxed">
                  Your CoreStack profile is live. We have applied your preferences to the job feed.
                </p>

                {/* Completed checklist */}
                <div className="text-left max-w-xs mx-auto mb-8 flex flex-col gap-3">
                  {[
                    'Account created',
                    'Job preferences saved',
                    `Open to Work: ${availability === 'not-looking' ? 'Off' : 'On'}`,
                    selectedCategories.length > 0
                      ? `${selectedCategories.length} categor${selectedCategories.length === 1 ? 'y' : 'ies'} selected`
                      : null,
                  ]
                    .filter(Boolean)
                    .map(item => (
                      <div key={item} className="flex items-center gap-3">
                        <Check size={14} className="text-[#3ECF8E] flex-shrink-0" />
                        <span className="font-mono text-xs text-gray-600">{item}</span>
                      </div>
                    ))}
                </div>

                <button
                  onClick={handleFinish}
                  disabled={loading}
                  className="w-full bg-[#3ECF8E] border-2 border-black font-mono text-sm font-medium text-black py-3 flex items-center justify-center gap-2 hover:bg-[#34C47E] transition-colors disabled:opacity-60 cursor-pointer"
                >
                  Browse Infrastructure Jobs
                  <ArrowRight size={14} />
                </button>
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
