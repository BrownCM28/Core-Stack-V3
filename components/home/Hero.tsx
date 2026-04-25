"use client";

import { Search, ChevronRight, Copy } from "lucide-react";
import { HeroTypewriterLine } from "@/components/home/HeroTypewriterLine";
import { useState } from "react";

const CATEGORIES = [
  { label: "All Roles",        href: "/jobs" },
  { label: "Data Center Ops",  href: "/jobs?category=operations" },
  { label: "AI Infrastructure",href: "/jobs?category=ai-infrastructure" },
  { label: "Electrical & Power",href: "/jobs?category=electrical" },
  { label: "Network Eng.",     href: "/jobs?category=networking" },
  { label: "Construction PM",  href: "/jobs?category=construction" },
  { label: "DCIM / Systems",   href: "/jobs?category=dcim" },
];

export function Hero() {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText("browse open roles").then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  }

  return (
    <section className="relative flex flex-col items-center justify-center text-center px-6 py-24 min-h-screen overflow-hidden">

      {/* Datacenter background image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/hero-datacenter.png"
        alt=""
        className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
        aria-hidden="true"
        style={{ opacity: 0.1 }}
      />

      <div className="relative z-10 mx-auto max-w-4xl w-full flex flex-col items-center">

        {/* ── Badge ─────────────────────────────────────────── */}
        <div className="hero-animate mb-8" style={{ animationDelay: "0ms" }}>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 border border-[#E5E5EA] rounded-full backdrop-blur-sm text-xs font-mono">
            <span className="w-2 h-2 bg-[#3ECF8E] rounded-sm flex-shrink-0" aria-hidden="true" />
            <span className="font-bold text-[#0D0F12] tabular-nums">312</span>
            <span className="text-[#6B7280]">companies actively hiring</span>
            <span className="text-[#D1D1D6] select-none" aria-hidden="true">|</span>
            <span className="text-[#6B7280]">Updated today</span>
          </div>
        </div>

        {/* ── Headline ──────────────────────────────────────── */}
        <div className="hero-animate mb-6 w-full" style={{ animationDelay: "100ms" }}>
          <h1 className="font-display font-normal text-[4rem] sm:text-[5.5rem] md:text-[7rem] text-[#0D0F12] leading-[0.97] tracking-tight">
            Infrastructure jobs for
          </h1>
          <div
            className="font-display font-normal text-[4rem] sm:text-[5.5rem] md:text-[7rem] leading-[0.97] tracking-tight"
            style={{ minHeight: "0.97em" }}
            aria-live="polite"
          >
            <HeroTypewriterLine />
          </div>
        </div>

        {/* ── Description ───────────────────────────────────── */}
        <div className="hero-animate mb-8" style={{ animationDelay: "190ms" }}>
          <p className="font-sans text-base sm:text-lg text-[#6B7280] max-w-2xl leading-relaxed">
            Data center construction, operations, and AI infrastructure roles — aggregated daily from top employers worldwide.
          </p>
        </div>

        {/* ── Terminal command pill ─────────────────────────── */}
        <div className="hero-animate mb-2" style={{ animationDelay: "270ms" }}>
          <div className="inline-flex items-center gap-3 px-5 py-3 bg-[#0D0F12] rounded-lg font-mono text-sm text-white">
            <span className="text-[#3ECF8E] select-none">$</span>
            <a href="/jobs" className="hover:text-white/80 transition-colors duration-150">
              browse open roles
            </a>
            <button
              onClick={handleCopy}
              aria-label="Copy command"
              className="text-[#6B7280] hover:text-white transition-colors duration-150 ml-1"
            >
              <Copy size={13} />
            </button>
          </div>
        </div>

        {/* ── Pill subtitle ─────────────────────────────────── */}
        <div className="hero-animate mb-8" style={{ animationDelay: "310ms" }}>
          <p className="font-sans text-xs text-[#9CA3AF]">
            {copied ? "Copied!" : "Search, filter, and apply — updated daily"}
          </p>
        </div>

        {/* ── Search bar ────────────────────────────────────── */}
        <div className="hero-animate w-full mb-5" style={{ animationDelay: "370ms" }}>
          <form action="/jobs" className="mx-auto w-full max-w-[680px]">
            <label htmlFor="hero-search" className="sr-only">
              Search roles, companies, or locations
            </label>
            <div
              className="flex items-center h-14 bg-white border border-[#E5E5EA] rounded-lg px-5 gap-3"
              style={{ boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}
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

        {/* ── Category filter row ───────────────────────────── */}
        <div className="hero-animate w-full max-w-[680px]" style={{ animationDelay: "430ms" }}>
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide">
            {CATEGORIES.map((cat, i) => (
              <a
                key={cat.href}
                href={cat.href}
                className={
                  i === 0
                    ? "inline-flex items-center px-4 py-2 rounded-[4px] font-mono text-xs whitespace-nowrap flex-shrink-0 bg-[#0D0F12] text-white"
                    : "inline-flex items-center px-4 py-2 rounded-[4px] font-mono text-xs whitespace-nowrap flex-shrink-0 bg-white border border-[#E5E5EA] text-[#6B7280] hover:border-[#0D0F12] hover:text-[#0D0F12] transition-colors duration-150"
                }
              >
                {cat.label}
              </a>
            ))}
            <button
              aria-label="More categories"
              className="inline-flex items-center justify-center w-9 h-9 rounded-[4px] flex-shrink-0 bg-white border border-[#E5E5EA] text-[#6B7280] hover:border-[#0D0F12] hover:text-[#0D0F12] transition-colors duration-150"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
