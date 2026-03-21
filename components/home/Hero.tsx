import { ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section
      className="relative w-full overflow-hidden py-24 px-4 sm:px-6 lg:px-8"
      style={{
        backgroundImage: `
          radial-gradient(ellipse 100% 60% at 50% 0%, rgba(62,207,142,0.1) 0%, transparent 60%),
          linear-gradient(rgba(62,207,142,0.04) 1px, transparent 1px),
          linear-gradient(90deg, rgba(62,207,142,0.04) 1px, transparent 1px)
        `,
        backgroundSize: "100% 100%, 40px 40px, 40px 40px",
        backgroundColor: "#0D0F12",
      }}
    >
      <div className="mx-auto max-w-4xl text-center">

        {/* Live badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-accent/30 bg-accent/5 text-accent text-xs font-mono mb-8 tracking-wide">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-accent" />
          </span>
          312 companies actively hiring
        </div>

        {/* Headline */}
        <h1 className="font-mono font-semibold text-4xl sm:text-5xl lg:text-[3.25rem] text-white leading-[1.15] tracking-tight mb-6 text-balance">
          Infrastructure jobs for the people who{" "}
          <span className="text-accent">keep the world running.</span>
        </h1>

        {/* Subtext */}
        <p className="font-sans text-base sm:text-lg text-[#9CA3AF] max-w-2xl mx-auto mb-10 leading-relaxed">
          Data center construction, operations, and AI infrastructure roles
          — aggregated daily.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-16">
          <a
            href="#"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-accent border-[1.5px] border-black text-[#0D0F12] font-mono font-semibold text-sm rounded-[6px] transition-all duration-150 hover:bg-[#34C47E] hover:shadow-[0_0_16px_rgba(62,207,142,0.25)]"
          >
            Browse Jobs
            <ArrowRight size={14} />
          </a>
          <a
            href="#"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-transparent border-[1.5px] border-white/30 text-white font-mono font-medium text-sm rounded-[6px] transition-all duration-150 hover:border-accent hover:text-accent hover:shadow-[0_0_0_1px_#3ECF8E,_0_0_12px_rgba(62,207,142,0.15)]"
          >
            Create Profile
          </a>
        </div>

        {/* Stat bar */}
        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10 text-sm font-mono text-[#6B7280]">
            <div className="flex items-center gap-2">
              <span className="text-white font-semibold text-base tabular-nums">2,847</span>
              <span>active roles</span>
            </div>
            <span className="hidden sm:block text-white/20 select-none">•</span>
            <div className="flex items-center gap-2">
              <span className="text-white font-semibold text-base tabular-nums">312</span>
              <span>companies hiring</span>
            </div>
            <span className="hidden sm:block text-white/20 select-none">•</span>
            <div className="flex items-center gap-2">
              <span className="text-white font-semibold text-base tabular-nums">1,204</span>
              <span>engineers placed</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
