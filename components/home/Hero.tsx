import { Search } from "lucide-react";
import { HeroTypewriterLine } from "@/components/home/HeroTypewriterLine";

export function Hero() {
  return (
    <section className="relative flex flex-col items-center justify-center text-center px-6 pt-28 pb-24 min-h-[88vh] overflow-hidden">

      {/* Aerial data center photo */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/hero-datacenter.png"
        alt=""
        className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
        aria-hidden="true"
        style={{ opacity: 0.12 }}
      />

      <div className="relative z-10 mx-auto max-w-4xl w-full">

        {/* Eyebrow */}
        <div className="hero-animate" style={{ animationDelay: "0ms" }}>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-[#6B7280] mb-10">
            312 companies actively hiring
          </p>
        </div>

        {/* Headline */}
        <div className="hero-animate mb-7" style={{ animationDelay: "100ms" }}>
          <h1 className="font-display text-[3.75rem] md:text-[5.5rem] text-[#0D0F12] leading-[1.02] tracking-tight">
            Infrastructure jobs for
          </h1>
          <div
            className="font-display text-[3.75rem] md:text-[5.5rem] leading-[1.02] tracking-tight"
            style={{ minHeight: "1.02em" }}
            aria-live="polite"
          >
            <HeroTypewriterLine />
          </div>
        </div>

        {/* Description */}
        <div className="hero-animate" style={{ animationDelay: "200ms" }}>
          <p className="font-sans text-lg text-[#6B7280] max-w-md mx-auto mb-10 leading-relaxed">
            Data center construction, operations, and AI infrastructure roles — aggregated daily.
          </p>
        </div>

        {/* Glass search bar */}
        <div className="hero-animate mb-7" style={{ animationDelay: "290ms" }}>
          <form action="/jobs" className="mx-auto w-full max-w-[540px]">
            <label htmlFor="hero-search" className="sr-only">
              Search roles, companies, or locations
            </label>
            <div
              className="flex items-center h-14 rounded-2xl px-5 gap-3 backdrop-blur-xl bg-white/88 border border-white/50"
              style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.10), 0 1px 0 rgba(255,255,255,0.8) inset" }}
            >
              <Search size={16} className="text-[#9CA3AF] flex-shrink-0" aria-hidden="true" />
              <input
                id="hero-search"
                name="search"
                type="search"
                placeholder="Search roles, companies, locations..."
                className="flex-1 bg-transparent border-none outline-none font-sans text-sm text-[#0D0F12] placeholder:text-[#9CA3AF]"
              />
            </div>
          </form>
        </div>

        {/* CTAs */}
        <div
          className="hero-animate flex flex-col sm:flex-row items-center justify-center gap-3 mb-24"
          style={{ animationDelay: "370ms" }}
        >
          <a
            href="/jobs"
            className="w-full sm:w-auto inline-flex items-center justify-center px-7 py-3.5 bg-[#0D0F12] text-white font-sans text-sm font-medium rounded-xl transition-colors duration-200 hover:bg-[#1E2128]"
          >
            Browse Open Roles
          </a>
          <a
            href="/auth/signup"
            className="w-full sm:w-auto inline-flex items-center justify-center px-7 py-3.5 bg-transparent border border-[#D1D1D6] text-[#0D0F12] font-sans text-sm font-medium rounded-xl transition-colors duration-200 hover:border-[#9CA3AF]"
          >
            Create Profile
          </a>
        </div>

        {/* Stat bar */}
        <div
          className="hero-animate border-t border-[#E5E5EA] pt-8"
          style={{ animationDelay: "450ms" }}
        >
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-14 font-sans text-sm text-[#6B7280]">
            <div className="flex items-center gap-3">
              <span className="text-[#0D0F12] font-semibold text-xl tabular-nums tracking-tight">2,847</span>
              <span>active roles</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-[#E5E5EA]" aria-hidden="true" />
            <div className="flex items-center gap-3">
              <span className="text-[#0D0F12] font-semibold text-xl tabular-nums tracking-tight">312</span>
              <span>companies hiring</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-[#E5E5EA]" aria-hidden="true" />
            <div className="flex items-center gap-3">
              <span className="text-[#0D0F12] font-semibold text-xl tabular-nums tracking-tight">1,204</span>
              <span>engineers placed</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
