"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, Zap, LogOut, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSession, signOut } from "@/lib/auth-client";

const NAV_LINKS = [
  { label: "Browse Jobs", href: "/jobs" },
  { label: "Talent", href: "/talent" },
  { label: "Wiki", href: "/wiki" },
  { label: "Post a Job", href: "/employers" },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: session, isPending } = useSession();

  async function handleSignOut() {
    await signOut();
    router.push("/");
    router.refresh();
  }

  if (pathname === "/") return null;

  const userInitials = session?.user?.name
    ? session.user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "?";

  function active(href: string) {
    return href === "/" ? pathname === "/" : pathname.startsWith(href);
  }

  return (
    <div className="sticky top-0 z-40 w-full bg-white border-b border-[#E0E0E0]">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <div className="flex h-16 items-center justify-between gap-4">

          {/* Wordmark */}
          <Link
            href="/"
            className="flex items-center gap-2 flex-shrink-0"
            aria-label="CoreStack home"
          >
            <Zap size={15} className="text-accent" aria-hidden="true" />
            <span className="font-mono font-bold text-sm uppercase tracking-widest text-[#0D0F12]">
              CoreStack
            </span>
          </Link>

          {/* Desktop right side — nav links + auth grouped together */}
          <div className="hidden md:flex items-center gap-2 ml-auto">
            {/* Nav links */}
            <nav className="flex items-center gap-2">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "inline-flex items-center gap-2 px-4 py-1.5 rounded-full border font-mono text-xs transition-all duration-150 whitespace-nowrap",
                    active(link.href)
                      ? "border-[#0D0F12] text-[#0D0F12]"
                      : "border-[#E0E0E0] text-[#6B7280] hover:border-[#0D0F12] hover:text-[#0D0F12]"
                  )}
                >
                  <span
                    className={cn(
                      "w-1.5 h-1.5 rounded-full flex-shrink-0 border transition-colors duration-150",
                      active(link.href)
                        ? "bg-[#0D0F12] border-[#0D0F12]"
                        : "bg-transparent border-[#BFBFBF]"
                    )}
                  />
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Divider */}
            <div className="w-px h-5 bg-[#E0E0E0] mx-1 flex-shrink-0" />

            {/* Auth / CTA */}
            {isPending ? (
              <div className="w-8 h-8 rounded-full bg-[#E0E0E0] animate-pulse" />
            ) : session ? (
              <>
                <Link
                  href="/dashboard"
                  className={cn(
                    "inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border font-mono text-xs transition-all duration-150",
                    active("/dashboard")
                      ? "border-[#0D0F12] text-[#0D0F12]"
                      : "border-[#E0E0E0] text-[#6B7280] hover:border-[#0D0F12] hover:text-[#0D0F12]"
                  )}
                >
                  <LayoutDashboard size={12} />
                  Dashboard
                </Link>
                <div className="flex items-center gap-2 pl-1">
                  <div className="w-7 h-7 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center overflow-hidden flex-shrink-0">
                    {session.user.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={session.user.image}
                        alt={session.user.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="font-mono text-[10px] font-bold text-accent">
                        {userInitials}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="text-[#6B7280] hover:text-red-500 transition-colors duration-150 p-1"
                    title="Sign out"
                  >
                    <LogOut size={13} />
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="font-mono text-xs text-[#6B7280] hover:text-[#0D0F12] transition-colors duration-150 px-2"
                >
                  Login
                </Link>
                <Link
                  href="/auth/signup"
                  className="inline-flex items-center px-5 py-2 rounded-full bg-[#0D0F12] text-white font-mono font-bold text-xs uppercase tracking-widest hover:bg-[#1E2128] transition-colors duration-150"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-[#0D0F12] hover:text-accent transition-colors duration-150 p-1.5"
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
        <div className="md:hidden border-t border-[#E0E0E0] bg-white px-6 py-4 flex flex-col gap-2">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "inline-flex items-center gap-2 px-4 py-2 rounded-full border font-mono text-xs transition-all duration-150",
                active(link.href)
                  ? "border-[#0D0F12] text-[#0D0F12]"
                  : "border-[#E0E0E0] text-[#6B7280]"
              )}
            >
              <span
                className={cn(
                  "w-1.5 h-1.5 rounded-full flex-shrink-0 border",
                  active(link.href)
                    ? "bg-[#0D0F12] border-[#0D0F12]"
                    : "bg-transparent border-[#BFBFBF]"
                )}
              />
              {link.label}
            </Link>
          ))}

          <div className="flex flex-col gap-2 pt-3 mt-1 border-t border-[#E0E0E0]">
            {session ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#E0E0E0] font-mono text-xs text-[#6B7280]"
                >
                  <LayoutDashboard size={12} />
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    handleSignOut();
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#E0E0E0] font-mono text-xs text-red-500"
                >
                  <LogOut size={12} />
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  onClick={() => setMobileOpen(false)}
                  className="inline-flex items-center justify-center px-4 py-2 rounded-full border border-[#E0E0E0] font-mono text-xs text-[#6B7280]"
                >
                  Login
                </Link>
                <Link
                  href="/auth/signup"
                  onClick={() => setMobileOpen(false)}
                  className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-[#0D0F12] font-mono font-bold text-xs text-white uppercase tracking-widest"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
