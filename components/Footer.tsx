import { Zap } from "lucide-react";

const FOOTER_LINKS = [
  { label: "Browse Jobs", href: "#" },
  { label: "Talent", href: "#" },
  { label: "Post a Job", href: "#" },
  { label: "About", href: "#" },
  { label: "Contact", href: "#" },
];

export function Footer() {
  return (
    <footer className="bg-[#0D0F12] border-t border-t-[#1E2128]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8">

          {/* Wordmark + tagline */}
          <div className="flex flex-col items-center md:items-start gap-1.5">
            <div className="flex items-center gap-2">
              <Zap size={14} className="text-accent" aria-hidden="true" />
              <span className="font-mono font-semibold text-white tracking-tight">
                CoreStack
              </span>
            </div>
            <p className="font-sans text-xs text-[#4B5563] text-center md:text-left">
              Built for the infrastructure industry.
            </p>
          </div>

          {/* Nav links */}
          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2" aria-label="Footer navigation">
            {FOOTER_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="font-sans text-sm text-[#6B7280] hover:text-accent transition-colors duration-150"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Copyright */}
          <p className="font-mono text-xs text-[#4B5563] whitespace-nowrap">
            © 2025 CoreStack
          </p>
        </div>
      </div>
    </footer>
  );
}
