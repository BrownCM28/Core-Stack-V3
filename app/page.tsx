import { Hero } from "@/components/home/Hero";
import {
  Server, BadgeCheck, Zap, Check, ArrowRight, ChevronRight,
} from "lucide-react";

function GithubIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className="text-[#3ECF8E]" aria-hidden="true">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

const WHY_CARDS = [
  {
    icon: Server,
    title: "Niche by design",
    body: "Every role on CoreStack is in data center ops, construction, electrical, cooling, AI infrastructure, or related fields. No noise. No irrelevant listings.",
  },
  {
    icon: GithubIcon,
    title: "GitHub-native profiles",
    body: "Candidates sign in with GitHub. Their public repos, tech stack, and contribution activity are automatically synced — giving employers a real signal, not just a resume.",
  },
  {
    icon: BadgeCheck,
    title: "Verified certifications",
    body: "Engineers display industry credentials — AWS, CKA, BICSI, CompTIA, Cisco — directly on their profiles. Real qualifications, visible at a glance.",
  },
  {
    icon: Zap,
    title: "Automated and always fresh",
    body: "Listings are aggregated daily from top employers across Greenhouse, Lever, and direct company feeds. No stale postings. No ghost jobs.",
  },
] as const;

const CANDIDATE_FEATURES = [
  "GitHub OAuth sign-in",
  "Auto-synced repos and skill graph",
  "Industry certification badges",
  "Open to Work discovery",
  "Saved job alerts",
];

const EMPLOYER_FEATURES = [
  "Standard and Featured listings",
  "Candidate profile browsing",
  "GitHub signal on every applicant",
  "Certification verification",
  "Monthly CoreStack Score reports (Premium)",
];

const SCORE_CANDIDATES = [
  { rank: "#1", initials: "AC", name: "Alex Chen",  username: "@alexchen-dc",    score: 94, pct: "94%",  opacity: "opacity-100" },
  { rank: "#2", initials: "MK", name: "Mia Kumar",  username: "@mkumar-infra",   score: 87, pct: "87%",  opacity: "opacity-80"  },
  { rank: "#3", initials: "JL", name: "James Liu",  username: "@jliu-ops",       score: 81, pct: "81%",  opacity: "opacity-60"  },
];

export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <div className="min-h-screen">

      <Hero />

      {/* ── Section 1: Why CoreStack ─────────────────────────────────────── */}
      <section className="border-t border-[#E2DDD8] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="font-mono text-xs uppercase tracking-widest text-[#6B6560] text-center mb-3">
            WHY CORESTACK
          </p>
          <h2 className="font-display font-bold text-4xl text-[#0D0F12] text-center mb-4">
            Built for infrastructure.
            <br />
            Not generic job boards.
          </h2>
          <p className="font-sans text-[#6B6560] text-center max-w-xl mx-auto mb-12 leading-relaxed">
            CoreStack is the only talent platform purpose-built for data center
            construction, operations, and AI infrastructure — where the people
            who keep the internet running come to find their next role.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {WHY_CARDS.map(({ icon: Icon, title, body }) => (
              <div
                key={title}
                className="bg-white border border-[#E2DDD8] rounded-lg p-6 hover:border-[#3ECF8E] transition-colors duration-150"
              >
                <Icon size={20} />
                <h3 className="font-display font-semibold text-[#0D0F12] mt-3 mb-2">{title}</h3>
                <p className="font-sans text-sm text-[#6B6560] leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 2: CoreStack Score ───────────────────────────────────── */}
      <section className="border-t border-[#E2DDD8] py-20" style={{ background: "rgba(245,242,238,0.55)" }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">

            {/* Left */}
            <div>
              <span className="inline-block border border-[#3ECF8E] text-[#3ECF8E] rounded-full px-3 py-1 text-xs font-mono mb-4">
                PREMIUM FEATURE
              </span>
              <h2 className="font-display font-bold text-3xl text-[#0D0F12] leading-tight mb-4">
                The CoreStack Score.
                <br />
                Monthly talent reports
                <br />
                delivered to top employers.
              </h2>
              <div className="font-sans text-[#6B6560] leading-relaxed mb-6 space-y-4">
                <p>
                  Every month, CoreStack automatically generates a ranked talent
                  report and delivers it directly to our premium employer
                  subscribers — before they even post a job.
                </p>
                <p>
                  Each candidate is scored using our proprietary algorithm that
                  analyzes GitHub activity, repository quality, language
                  relevance to data center and AI workloads, certification
                  depth, and open-to-work status.
                </p>
                <p>
                  Premium employers receive the top 25 scored candidates in
                  their target role categories — filtered, ranked, and ready
                  to contact.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 mb-8">
                {["GitHub signal analysis", "Cert depth scoring", "Monthly auto-delivery"].map((pill) => (
                  <span
                    key={pill}
                    className="border border-black rounded-full px-3 py-1 text-xs font-mono text-[#0D0F12]"
                  >
                    {pill}
                  </span>
                ))}
              </div>
              <a
                href="/employers#premium"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#3ECF8E] border-[1.5px] border-black rounded-[6px] font-mono font-semibold text-sm text-[#0D0F12] hover:bg-[#34C47E] transition-colors duration-150"
              >
                Join the Premium Waitlist →
              </a>
            </div>

            {/* Right — scorecard mockup */}
            <div className="bg-white border border-[#E2DDD8] rounded-xl p-6 shadow-sm relative overflow-hidden">
              {/* PREVIEW watermark */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
                <span
                  className="font-mono text-5xl text-[#E2DDD8] font-bold opacity-40"
                  style={{ transform: "rotate(-15deg)" }}
                >
                  PREVIEW
                </span>
              </div>

              <div className="flex justify-between items-center mb-1">
                <span className="font-mono text-sm font-bold text-[#0D0F12]">CoreStack Score Report</span>
                <span className="text-xs text-[#6B6560] font-sans">April 2026</span>
              </div>
              <p className="text-xs font-mono text-[#6B6560] mb-4">
                Top 3 candidates · AI Infrastructure · Remote
              </p>
              <div className="border-t border-[#E2DDD8] mb-4" />

              <div className="flex flex-col gap-4">
                {SCORE_CANDIDATES.map(({ rank, initials, name, username, score, pct, opacity }) => (
                  <div key={rank} className="flex items-center gap-3">
                    <span className="text-[#3ECF8E] font-mono font-bold text-sm w-6 text-center flex-shrink-0">
                      {rank}
                    </span>
                    <div className="w-8 h-8 rounded-full bg-[#0D0F12] flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs font-mono font-bold">{initials}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#0D0F12] font-mono leading-tight">{name}</p>
                      <p className="text-xs text-[#6B6560] font-sans">{username}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1 w-24 flex-shrink-0">
                      <span className="text-sm font-mono font-bold text-[#0D0F12]">{score}</span>
                      <div className="w-full h-1.5 bg-[#E2DDD8] rounded-full">
                        <div
                          className={`h-full rounded-full bg-[#3ECF8E] ${opacity}`}
                          style={{ width: pct }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-[#E2DDD8]">
                <p className="text-xs text-[#6B6560] font-mono text-center">
                  Delivered automatically · 47 employers receiving reports
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Section 3: How It Works ──────────────────────────────────────── */}
      <section className="border-t border-[#E2DDD8] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="font-mono text-xs uppercase tracking-widest text-[#6B6560] text-center mb-3">
            HOW IT WORKS
          </p>
          <h2 className="font-display font-bold text-4xl text-[#0D0F12] text-center mb-16">
            From search to hired in three steps.
          </h2>

          <div className="flex flex-col md:flex-row md:items-start">

            <div className="flex-1 text-center px-6 py-8 md:py-0">
              <p className="font-mono font-bold text-6xl leading-none mb-3 text-[#3ECF8E] opacity-20">01</p>
              <h3 className="font-mono font-semibold text-lg text-[#0D0F12] mb-2">Create your profile</h3>
              <p className="font-sans text-sm text-[#6B6560] leading-relaxed max-w-xs mx-auto">
                Sign in with GitHub in one click. Your repos, stack, and
                certifications sync automatically. Add your open-to-work
                preferences and you&apos;re discoverable.
              </p>
            </div>

            <ChevronRight
              size={32}
              className="hidden md:flex self-center flex-shrink-0 text-[#E2DDD8]"
            />

            <div className="flex-1 text-center px-6 py-8 md:py-0">
              <p className="font-mono font-bold text-6xl leading-none mb-3 text-[#3ECF8E] opacity-20">02</p>
              <h3 className="font-mono font-semibold text-lg text-[#0D0F12] mb-2">Browse curated roles</h3>
              <p className="font-sans text-sm text-[#6B6560] leading-relaxed max-w-xs mx-auto">
                Search and filter hundreds of data center and AI infrastructure
                roles updated daily from top employers. Save searches and get
                instant email alerts on new matches.
              </p>
            </div>

            <ChevronRight
              size={32}
              className="hidden md:flex self-center flex-shrink-0 text-[#E2DDD8]"
            />

            <div className="flex-1 text-center px-6 py-8 md:py-0">
              <p className="font-mono font-bold text-6xl leading-none mb-3 text-[#3ECF8E] opacity-20">03</p>
              <h3 className="font-mono font-semibold text-lg text-[#0D0F12] mb-2">Get found by employers</h3>
              <p className="font-sans text-sm text-[#6B6560] leading-relaxed max-w-xs mx-auto">
                Premium employers receive monthly CoreStack Score reports
                featuring the top-ranked candidates in their category. Your
                GitHub signal and certifications work for you even while you
                sleep.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ── Section 4: For Candidates / For Employers ────────────────────── */}
      <section className="border-t border-[#E2DDD8] py-20" style={{ background: "rgba(245,242,238,0.55)" }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* For Candidates */}
            <div className="bg-white border border-[#E2DDD8] rounded-xl p-8 flex flex-col">
              <p className="text-xs font-mono uppercase tracking-widest text-[#3ECF8E] mb-3">
                FOR CANDIDATES
              </p>
              <h3 className="font-display font-bold text-2xl text-[#0D0F12] mb-3">
                Your GitHub is your resume.
              </h3>
              <p className="font-sans text-sm text-[#6B6560] leading-relaxed mb-6">
                Connect GitHub, add your certifications, and set your
                availability. CoreStack builds your infrastructure profile
                automatically — and shares it with the employers that matter.
              </p>
              <ul className="flex flex-col gap-2 mb-8">
                {CANDIDATE_FEATURES.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-[#0D0F12]">
                    <Check size={16} className="text-[#3ECF8E] flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <div className="mt-auto">
                <a
                  href="/auth/signup"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#3ECF8E] border-[1.5px] border-black rounded-[6px] font-mono font-semibold text-sm text-[#0D0F12] hover:bg-[#34C47E] transition-colors duration-150"
                >
                  Create Free Profile
                </a>
              </div>
            </div>

            {/* For Employers */}
            <div className="bg-[#0D0F12] rounded-xl p-8 flex flex-col">
              <p className="text-xs font-mono uppercase tracking-widest text-[#3ECF8E] mb-3">
                FOR EMPLOYERS
              </p>
              <h3 className="font-display font-bold text-2xl text-white mb-3">
                Hire before your competitors
                <br />
                even start searching.
              </h3>
              <p className="font-sans text-sm text-[#94A3B8] leading-relaxed mb-6">
                Post a listing, browse open-to-work candidates, or subscribe
                to monthly CoreStack Score reports — pre-ranked talent in your
                exact category, delivered automatically.
              </p>
              <ul className="flex flex-col gap-2 mb-8">
                {EMPLOYER_FEATURES.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-white">
                    <Check size={16} className="text-[#3ECF8E] flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <div className="mt-auto">
                <a
                  href="/employers"
                  className="inline-flex items-center gap-2 bg-[#3ECF8E] border border-black rounded-md px-4 py-2 text-sm font-mono font-medium text-[#0D0F12] hover:bg-[#34C47E] transition-colors"
                >
                  Post a Job
                  <ArrowRight size={16} />
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Section 5: Final CTA Banner ──────────────────────────────────── */}
      <section className="border-t border-[#E2DDD8] py-20 text-center">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-display font-bold text-4xl text-[#0D0F12] mb-4">
            Infrastructure talent.
            <br />
            Finally in one place.
          </h2>
          <p className="font-sans text-[#6B6560] mb-8 max-w-md mx-auto">
            Join 1,200+ engineers and 300+ employers already on CoreStack.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a
              href="/jobs"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#3ECF8E] border-[1.5px] border-black rounded-[6px] font-mono font-semibold text-sm text-[#0D0F12] hover:bg-[#34C47E] transition-colors duration-150"
            >
              Browse Jobs
              <ArrowRight size={14} />
            </a>
            <a
              href="/employers"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-transparent border-[1.5px] border-[#E2DDD8] rounded-[6px] font-mono font-medium text-sm text-[#0D0F12] hover:border-[#3ECF8E] hover:text-[#3ECF8E] transition-colors duration-150"
            >
              Post a Job
            </a>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer className="bg-[#0D0F12] border-t border-[#1E2128] py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <span className="font-mono text-lg font-bold">
              <span className="text-white">Core</span>
              <span className="text-[#3ECF8E]">Stack</span>
            </span>
            <nav className="flex gap-6 flex-wrap">
              {[
                { label: "Browse Jobs", href: "/jobs" },
                { label: "Talent",      href: "/talent" },
                { label: "Post a Job",  href: "/employers" },
              ].map(({ label, href }) => (
                <a
                  key={href}
                  href={href}
                  className="text-sm font-mono text-[#6B6560] hover:text-[#3ECF8E] transition-colors"
                >
                  {label}
                </a>
              ))}
            </nav>
          </div>
          <div className="mt-6 pt-6 border-t border-[#1E2128]">
            <p className="text-xs text-[#6B6560] font-mono text-center">
              © 2025 CoreStack. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}
