import { Hero } from "@/components/home/Hero";
import {
  Server, BadgeCheck, Zap, Check, ArrowRight,
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
  { rank: "#2", initials: "MK", name: "Mia Kumar",  username: "@mkumar-infra",   score: 87, pct: "87%",  opacity: "opacity-75"  },
  { rank: "#3", initials: "JL", name: "James Liu",  username: "@jliu-ops",       score: 81, pct: "81%",  opacity: "opacity-50"  },
];

export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">

      <Hero />

      {/* ── Section 1: Why CoreStack ─────────────────────────────────────── */}
      <section className="bg-white py-32 border-t border-[#E5E5EA]">
        <div className="mx-auto max-w-6xl px-6 sm:px-8 lg:px-12">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-[#6B7280] text-center mb-5">
            Why CoreStack
          </p>
          <h2 className="font-display text-[2.75rem] md:text-5xl text-[#0D0F12] text-center leading-tight mb-5">
            Built for infrastructure.
            <br />
            Not generic job boards.
          </h2>
          <p className="font-sans text-lg text-[#6B7280] text-center max-w-xl mx-auto mb-20 leading-relaxed">
            CoreStack is the only talent platform purpose-built for data center
            construction, operations, and AI infrastructure.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {WHY_CARDS.map(({ icon: Icon, title, body }) => (
              <div
                key={title}
                className="bg-[#F5F5F7] rounded-2xl p-8 transition-shadow duration-200 hover:shadow-[0_4px_24px_rgba(0,0,0,0.07)]"
              >
                <div className="mb-5">
                  <Icon size={22} />
                </div>
                <h3 className="font-display text-xl text-[#0D0F12] mb-2">{title}</h3>
                <p className="font-sans text-sm text-[#6B7280] leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 2: CoreStack Score ───────────────────────────────────── */}
      <section className="bg-[#0D0F12] py-32">
        <div className="mx-auto max-w-6xl px-6 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">

            {/* Left */}
            <div>
              <span className="inline-block border border-[#3ECF8E]/40 text-[#3ECF8E] rounded-full px-3 py-1 text-xs font-mono tracking-wider mb-6">
                PREMIUM FEATURE
              </span>
              <h2 className="font-display text-[2.25rem] md:text-[2.75rem] text-white leading-tight mb-6">
                The CoreStack Score.
                <br />
                Monthly talent reports
                <br />
                delivered to top employers.
              </h2>
              <div className="font-sans text-[#A1A1AA] leading-relaxed mb-8 space-y-4 text-[0.9375rem]">
                <p>
                  Every month, CoreStack automatically generates a ranked talent
                  report and delivers it directly to our premium employer
                  subscribers — before they even post a job.
                </p>
                <p>
                  Each candidate is scored using our proprietary algorithm that
                  analyzes GitHub activity, repository quality, language
                  relevance, certification depth, and open-to-work status.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 mb-10">
                {["GitHub signal analysis", "Cert depth scoring", "Monthly auto-delivery"].map((pill) => (
                  <span
                    key={pill}
                    className="border border-white/15 rounded-full px-3.5 py-1.5 text-xs font-mono text-white/70"
                  >
                    {pill}
                  </span>
                ))}
              </div>
              <a
                href="/employers#premium"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#3ECF8E] text-[#0D0F12] font-sans font-medium text-sm rounded-xl hover:bg-[#34C47E] transition-colors duration-200"
              >
                Join the Premium Waitlist
                <ArrowRight size={14} />
              </a>
            </div>

            {/* Right — scorecard */}
            <div
              className="bg-[#161618] rounded-2xl p-8 relative overflow-hidden"
              style={{ boxShadow: "0 0 0 1px rgba(255,255,255,0.06)" }}
            >
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
                <span
                  className="font-mono text-5xl text-white/5 font-bold"
                  style={{ transform: "rotate(-15deg)" }}
                >
                  PREVIEW
                </span>
              </div>

              <div className="flex justify-between items-center mb-1">
                <span className="font-mono text-sm font-semibold text-white">CoreStack Score Report</span>
                <span className="text-xs text-white/40 font-sans">April 2026</span>
              </div>
              <p className="text-xs font-mono text-white/40 mb-5">
                Top 3 candidates · AI Infrastructure · Remote
              </p>
              <div className="border-t border-white/8 mb-5" />

              <div className="flex flex-col gap-5">
                {SCORE_CANDIDATES.map(({ rank, initials, name, username, score, pct, opacity }) => (
                  <div key={rank} className="flex items-center gap-4">
                    <span className="text-[#3ECF8E] font-mono font-bold text-sm w-6 text-center flex-shrink-0">
                      {rank}
                    </span>
                    <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs font-mono font-bold">{initials}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white font-sans leading-tight">{name}</p>
                      <p className="text-xs text-white/40 font-mono">{username}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1.5 w-20 flex-shrink-0">
                      <span className="text-sm font-mono font-bold text-white">{score}</span>
                      <div className="w-full h-1 bg-white/10 rounded-full">
                        <div
                          className={`h-full rounded-full bg-[#3ECF8E] ${opacity}`}
                          style={{ width: pct }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-5 border-t border-white/8">
                <p className="text-xs text-white/30 font-mono text-center">
                  Delivered automatically · 47 employers receiving reports
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Section 3: How It Works ──────────────────────────────────────── */}
      <section className="bg-white py-32 border-b border-[#E5E5EA]">
        <div className="mx-auto max-w-6xl px-6 sm:px-8 lg:px-12">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-[#6B7280] text-center mb-5">
            How It Works
          </p>
          <h2 className="font-display text-[2.75rem] md:text-5xl text-[#0D0F12] text-center leading-tight mb-24">
            From search to hired
            <br />
            in three steps.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
            {[
              {
                n: "01",
                title: "Create your profile",
                body: "Sign in with GitHub in one click. Your repos, stack, and certifications sync automatically. Add your open-to-work preferences and you're discoverable.",
              },
              {
                n: "02",
                title: "Browse curated roles",
                body: "Search and filter hundreds of data center and AI infrastructure roles updated daily from top employers. Save searches and get instant email alerts on new matches.",
              },
              {
                n: "03",
                title: "Get found by employers",
                body: "Premium employers receive monthly CoreStack Score reports featuring the top-ranked candidates in their category. Your GitHub signal and certifications work for you.",
              },
            ].map(({ n, title, body }) => (
              <div key={n} className="flex flex-col">
                <p
                  className="font-display text-[6rem] leading-none text-[#0D0F12] mb-6 select-none"
                  style={{ opacity: 0.06 }}
                  aria-hidden="true"
                >
                  {n}
                </p>
                <h3 className="font-display text-xl text-[#0D0F12] mb-3">{title}</h3>
                <p className="font-sans text-sm text-[#6B7280] leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 4: For Candidates / For Employers ────────────────────── */}
      <section className="bg-[#F5F5F7] py-32">
        <div className="mx-auto max-w-6xl px-6 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* For Candidates */}
            <div className="bg-white rounded-2xl p-10 flex flex-col">
              <p className="text-xs font-mono uppercase tracking-[0.18em] text-[#3ECF8E] mb-4">
                For Candidates
              </p>
              <h3 className="font-display text-[1.75rem] text-[#0D0F12] leading-snug mb-4">
                Your GitHub is your resume.
              </h3>
              <p className="font-sans text-sm text-[#6B7280] leading-relaxed mb-8">
                Connect GitHub, add your certifications, and set your
                availability. CoreStack builds your infrastructure profile
                automatically — and shares it with the employers that matter.
              </p>
              <ul className="flex flex-col gap-3 mb-10" role="list">
                {CANDIDATE_FEATURES.map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm text-[#0D0F12] font-sans">
                    <Check size={15} className="text-[#3ECF8E] flex-shrink-0" aria-hidden="true" />
                    {f}
                  </li>
                ))}
              </ul>
              <div className="mt-auto">
                <a
                  href="/auth/signup"
                  className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#0D0F12] text-white font-sans font-medium text-sm rounded-xl hover:bg-[#1E2128] transition-colors duration-200"
                >
                  Create Free Profile
                </a>
              </div>
            </div>

            {/* For Employers */}
            <div className="bg-[#0D0F12] rounded-2xl p-10 flex flex-col">
              <p className="text-xs font-mono uppercase tracking-[0.18em] text-[#3ECF8E] mb-4">
                For Employers
              </p>
              <h3 className="font-display text-[1.75rem] text-white leading-snug mb-4">
                Hire before your competitors
                <br />
                even start searching.
              </h3>
              <p className="font-sans text-sm text-[#A1A1AA] leading-relaxed mb-8">
                Post a listing, browse open-to-work candidates, or subscribe
                to monthly CoreStack Score reports — pre-ranked talent in your
                exact category, delivered automatically.
              </p>
              <ul className="flex flex-col gap-3 mb-10" role="list">
                {EMPLOYER_FEATURES.map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm text-white font-sans">
                    <Check size={15} className="text-[#3ECF8E] flex-shrink-0" aria-hidden="true" />
                    {f}
                  </li>
                ))}
              </ul>
              <div className="mt-auto">
                <a
                  href="/employers"
                  className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#3ECF8E] text-[#0D0F12] font-sans font-medium text-sm rounded-xl hover:bg-[#34C47E] transition-colors duration-200"
                >
                  Post a Job
                  <ArrowRight size={14} />
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Section 5: Final CTA Banner ──────────────────────────────────── */}
      <section className="bg-[#0D0F12] py-36 text-center">
        <div className="mx-auto max-w-2xl px-6">
          <h2 className="font-display text-[2.75rem] md:text-5xl text-white leading-tight mb-5">
            Infrastructure talent.
            <br />
            Finally in one place.
          </h2>
          <p className="font-sans text-[#A1A1AA] mb-12 text-lg leading-relaxed">
            Join 1,200+ engineers and 300+ employers already on CoreStack.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a
              href="/jobs"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#3ECF8E] text-[#0D0F12] font-sans font-medium text-sm rounded-xl hover:bg-[#34C47E] transition-colors duration-200"
            >
              Browse Jobs
              <ArrowRight size={14} />
            </a>
            <a
              href="/employers"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-transparent border border-white/20 text-white font-sans font-medium text-sm rounded-xl hover:border-white/40 transition-colors duration-200"
            >
              Post a Job
            </a>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer className="bg-[#0D0F12] border-t border-white/8 py-10">
        <div className="mx-auto max-w-6xl px-6 sm:px-8 lg:px-12">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <span className="font-mono text-base font-bold">
              <span className="text-white">Core</span>
              <span className="text-[#3ECF8E]">Stack</span>
            </span>
            <nav aria-label="Footer navigation">
              <ul className="flex gap-6 flex-wrap" role="list">
                {[
                  { label: "Browse Jobs", href: "/jobs" },
                  { label: "Talent",      href: "/talent" },
                  { label: "Wiki",        href: "/wiki" },
                  { label: "Post a Job",  href: "/employers" },
                ].map(({ label, href }) => (
                  <li key={href}>
                    <a
                      href={href}
                      className="text-sm font-sans text-white/40 hover:text-white/80 transition-colors duration-150"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
          <div className="mt-8 pt-6 border-t border-white/8">
            <p className="text-xs text-white/25 font-mono text-center">
              © 2025 CoreStack. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}
