"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X, Zap, LogOut, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSession, signOut } from "@/lib/auth-client";

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
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: session, isPending } = useSession();

  async function handleSignOut() {
    await signOut();
    router.push("/");
    router.refresh();
  }

  const userInitials = session?.user?.name
    ? session.user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "?";

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-b-black bg-[#0D0F12]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between">

          {/* Wordmark */}
          <Link href="/" className="flex items-center gap-2 group" aria-label="CoreStack home">
            <Zap size={16} className="text-accent transition-colors duration-150" aria-hidden="true" />
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

          {/* Desktop auth area */}
          <div className="hidden md:flex items-center gap-2">
            {isPending ? (
              <div className="w-8 h-8 rounded-full bg-[#1E2128] animate-pulse" />
            ) : session ? (
              <>
                <Link
                  href="/dashboard"
                  className={cn(btnBase, "gap-1.5 border-[1.5px] border-[#2A2D35] bg-transparent text-[#9CA3AF] px-3 py-2 hover:border-accent hover:text-accent")}
                >
                  <LayoutDashboard size={14} />
                  Dashboard
                </Link>
                <div className="flex items-center gap-2 pl-2 border-l border-[#2A2D35]">
                  <div className="w-7 h-7 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center overflow-hidden flex-shrink-0">
                    {session.user.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={session.user.image} alt={session.user.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="font-mono text-[10px] font-bold text-accent">{userInitials}</span>
                    )}
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="text-[#6B6560] hover:text-red-400 transition-colors duration-150 p-1"
                    title="Sign out"
                  >
                    <LogOut size={14} />
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link href="/auth/login" className={cn(btnBase, btnWire)}>Login</Link>
                <Link href="/auth/signup" className={cn(btnBase, btnPrimary)}>Sign Up</Link>
              </>
            )}
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
                "transition-all duration-150 hover:text-accent hover:bg-white/5"
              )}
            >
              {link.label}
            </Link>
          ))}
          <div className="flex flex-col gap-2 pt-3 mt-2 border-t border-t-[#1E2128]">
            {session ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className={cn(btnBase, btnWire, "w-full gap-1.5")}
                >
                  <LayoutDashboard size={14} /> Dashboard
                </Link>
                <button
                  onClick={() => { setMobileOpen(false); handleSignOut(); }}
                  className={cn(btnBase, "w-full border-[1.5px] border-[#2A2D35] text-[#9CA3AF] px-4 py-2 hover:border-red-400 hover:text-red-400 gap-1.5")}
                >
                  <LogOut size={14} /> Sign out
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/login" onClick={() => setMobileOpen(false)} className={cn(btnBase, btnWire, "w-full")}>Login</Link>
                <Link href="/auth/signup" onClick={() => setMobileOpen(false)} className={cn(btnBase, btnPrimary, "w-full")}>Sign Up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
