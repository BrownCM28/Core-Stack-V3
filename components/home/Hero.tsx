import { Search } from "lucide-react";
import { HeroTypewriterLine } from "@/components/home/HeroTypewriterLine";

const CATEGORIES = [
  { label: "All Roles", href: "/jobs" },
  { label: "Data Center Ops", href: "/jobs?category=operations" },
  { label: "AI Infrastructure", href: "/jobs?category=ai-infrastructure" },
  { label: "Electrical & Power", href: "/jobs?category=electrical" },
  { label: "Network Eng.", href: "/jobs?category=networking" },
  { label: "Construction PM", href: "/jobs?category=construction" },
  { label: "DCIM / Systems", href: "/jobs?category=dcim" },
];

export function Hero() {
  return (
    <section className="relative flex flex-col items-center justify-center text-center px-4 pt-20 pb-28 overflow-hidden">

      {/* Aerial data center photo */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/hero-datacenter.png"
        alt=""
        className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
        aria-hidden="true"
        style={{ opacity: 0.1 }}
      />

      {/* Subtle graph-paper grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none select-none"
        aria-hidden="true"
        style={{
          backgroundImage:
            "linear-gradient(to right, #C4C4C4 1px, transparent 1px), linear-gradient(to bottom, #C4C4C4 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          opacity: 0.28,
        }}
      />

      <div className="relative z-10 mx-auto max-w-4xl w-full">

        {/* Live badge */}
        <div className="hero-animate" style={{ animationDelay: "0ms" }}>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-accent/30 bg-accent/5 text-accent text-xs font-mono mb-10 tracking-wide">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-accent" />
            </span>
            312 companies actively hiring
          </div>
        </div>

        {/* Two-line display headline */}
        <div className="hero-animate mb-6" style={{ animationDelay: "120ms" }}>
          <h1 className="font-display font-normal text-5xl md:text-[4.5rem] text-[#0D0F12] leading-[1.06] tracking-tight">
            Infrastructure jobs for
          </h1>
          <div
            className="font-display font-normal text-5xl md:text-[4.5rem] leading-[1.06] tracking-tight"
            style={{ minHeight: "1.06em" }}
            aria-live="polite"
          >
            <HeroTypewriterLine />
          </div>
        </div>

        {/* Description */}
        <div className="hero-animate" style={{ animationDelay: "220ms" }}>
          <p className="font-sans text-base sm:text-lg text-[#6B7280] max-w-xl mx-auto mb-10 leading-relaxed">
            Data center construction, operations, and AI infrastructure roles
            — aggregated daily.
          </p>
        </div>

        {/* Terminal command pill */}
        <div className="hero-animate" style={{ animationDelay: "310ms" }}>
          <a
            href="/jobs"
            className="inline-flex items-center gap-2.5 px-5 py-2.5 bg-[#0D0F12] rounded-full font-mono text-sm text-white hover:bg-[#1E2128] transition-colors duration-150 mb-2"
          >
            <span className="text-[#6B7280]">$</span>
            <span>browse open roles</span>
            <span className="text-accent">→</span>
          </a>
          <p className="font-mono text-xs text-[#9CA3AF] mb-8">
            Search, filter, and apply — updated daily
          </p>
        </div>

        {/* Search bar */}
        <div className="hero-animate mb-4" style={{ animationDelay: "400ms" }}>
          <form action="/jobs" className="mx-auto w-full max-w-[560px]">
            <div
              className="flex items-center h-[52px] bg-white border border-[#E0E0E0] rounded-xl px-4 gap-3"
              style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}
            >
              <Search size={16} className="text-[#9CA3AF] flex-shrink-0" />
              <input
                name="search"
                type="text"
                placeholder="Search roles, companies, locations..."
                className="flex-1 bg-transparent border-none outline-none font-sans text-sm text-[#0D0F12] placeholder:text-[#9CA3AF]"
              />
            </div>
          </form>
        </div>

        {/* Category filter pills */}
        <div className="hero-animate mb-16" style={{ animationDelay: "480ms" }}>
          <div className="flex items-center justify-center gap-2 flex-wrap">
            {CATEGORIES.map((cat, i) => (
              <a
                key={cat.href}
                href={cat.href}
                className={
                  i === 0
                    ? "inline-flex items-center px-4 py-1.5 rounded-full font-mono text-xs whitespace-nowrap bg-[#0D0F12] text-white"
                    : "inline-flex items-center px-4 py-1.5 rounded-full font-mono text-xs whitespace-nowrap bg-white border border-[#E0E0E0] text-[#6B7280] hover:border-[#0D0F12] hover:text-[#0D0F12] transition-colors duration-150"
                }
              >
                {cat.label}
              </a>
            ))}
          </div>
        </div>

        {/* Stat bar */}
        <div
          className="hero-animate border-t border-[#E0E0E0] pt-8"
          style={{ animationDelay: "560ms" }}
        >
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10 text-sm font-mono text-[#6B7280]">
            <div className="flex items-center gap-2">
              <span className="text-[#0D0F12] font-semibold text-base tabular-nums">2,847</span>
              <span>active roles</span>
            </div>
            <span className="hidden sm:block text-[#E0E0E0] select-none">•</span>
            <div className="flex items-center gap-2">
              <span className="text-[#0D0F12] font-semibold text-base tabular-nums">312</span>
              <span>companies hiring</span>
            </div>
            <span className="hidden sm:block text-[#E0E0E0] select-none">•</span>
            <div className="flex items-center gap-2">
              <span className="text-[#0D0F12] font-semibold text-base tabular-nums">1,204</span>
              <span>engineers placed</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
