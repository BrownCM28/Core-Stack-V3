"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Browse Jobs", href: "/jobs" },
  { label: "Talent", href: "/talent" },
  { label: "Post a Job", href: "/post" },
];

const btnBase =
  "inline-flex items-center justify-center font-mono font-medium text-sm rounded-[6px] transition-all duration-150 select-none whitespace-nowrap";

const btnWire =
  "border-[1.5px] border-[#2A2D35] bg-transparent text-[#9CA3AF] px-4 py-2 hover:border-accent hover:text-accent hover:shadow-accent-sm";

const btnPrimary =
  "border-[1.5px] border-black bg-accent text-[#0D0F12] px-4 py-2 hover:bg-accent-hover hover:shadow-accent-md";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-b-black bg-[#0D0F12]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between">

          {/* Wordmark */}
          <Link
            href="/"
            className="flex items-center gap-2 group"
            aria-label="CoreStack home"
          >
            <Zap
              size={16}
              className="text-accent transition-colors duration-150"
              aria-hidden="true"
            />
            <span className="font-mono font-semibold text-base tracking-tight text-white group-hover:text-accent transition-colors duration-150">
              CoreStack
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "font-mono text-sm text-[#6B6560] px-3 py-1.5 rounded-[6px]",
                  "border border-transparent transition-all duration-150",
                  "hover:text-accent hover:border-accent/40"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop auth buttons */}
          <div className="hidden md:flex items-center gap-2">
            <Link href="/login" className={cn(btnBase, btnWire)}>
              Login
            </Link>
            <Link href="/signup" className={cn(btnBase, btnPrimary)}>
              Sign Up
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-[#9CA3AF] hover:text-accent transition-colors duration-150 p-1.5"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-t-[#1E2128] bg-[#0D0F12] px-4 py-3 flex flex-col gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "font-mono text-sm text-[#6B6560] px-3 py-2 rounded-[6px]",
                "transition-all duration-150",
                "hover:text-accent hover:bg-white/5"
              )}
            >
              {link.label}
            </Link>
          ))}
          <div className="flex flex-col gap-2 pt-3 mt-2 border-t border-t-[#1E2128]">
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className={cn(btnBase, btnWire, "w-full")}
            >
              Login
            </Link>
            <Link
              href="/signup"
              onClick={() => setMobileOpen(false)}
              className={cn(btnBase, btnPrimary, "w-full")}
            >
              Sign Up
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
