import { ArrowRight } from "lucide-react";
import { HeroPillSearch } from "@/components/home/HeroPillSearch";

export function Hero() {
  return (
    <section
      className="relative flex flex-col items-center justify-center text-center px-4 pt-14 pb-20 overflow-hidden"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/hero-datacenter.png"
        alt=""
        className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
        aria-hidden="true"
        style={{ opacity: 0.12 }}
      />

      <div className="relative z-10 mx-auto max-w-4xl">

        {/* Live badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-accent/30 bg-accent/5 text-accent text-xs font-mono mb-8 tracking-wide">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-accent" />
          </span>
          312 companies actively hiring
        </div>

        {/* Headline */}
        <h1 className="font-display font-normal text-5xl md:text-6xl text-[#0D0F12] leading-[1.1] mb-6 text-balance">
          Infrastructure jobs for the people who{" "}
          <span className="text-accent">keep the world running.</span>
        </h1>

        {/* Subtext */}
        <p className="font-sans text-base sm:text-lg text-[#6B7280] max-w-2xl mx-auto mb-8 leading-relaxed">
          Data center construction, operations, and AI infrastructure roles
          — aggregated daily.
        </p>

        {/* Pill search */}
        <HeroPillSearch />

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-16">
          <a
            href="/jobs"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-accent border-[1.5px] border-black text-[#0D0F12] font-mono font-semibold text-sm rounded-[6px] transition-all duration-150 hover:bg-[#34C47E] hover:shadow-[0_0_16px_rgba(62,207,142,0.25)]"
          >
            Browse Jobs
            <ArrowRight size={14} />
          </a>
          <a
            href="/auth/signup"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-transparent border-[1.5px] border-[#E0E0E0] text-[#0D0F12] font-mono font-medium text-sm rounded-[6px] transition-all duration-150 hover:border-accent hover:text-accent hover:shadow-[0_0_0_1px_#3ECF8E,_0_0_12px_rgba(62,207,142,0.15)]"
          >
            Create Profile
          </a>
        </div>

        {/* Stat bar */}
        <div className="border-t border-[#E0E0E0] pt-8">
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
