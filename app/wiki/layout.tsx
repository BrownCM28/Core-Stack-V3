import Link from "next/link";
import { WikiSidebarLink } from "@/components/wiki/WikiSidebarLink";

const sidebarSections = [
  {
    label: "CAREERS",
    links: [
      { title: "Data Center Careers Guide", href: "/wiki/data-center-careers" },
      { title: "How to Get Hired at a Hyperscaler", href: "/wiki/how-to-get-hired" },
      { title: "Salary Guide 2026", href: "/wiki/salary-guide" },
    ],
  },
  {
    label: "SKILLS & CREDENTIALS",
    links: [
      { title: "GitHub for Engineers", href: "/wiki/github-for-engineers" },
      { title: "Certifications Guide", href: "/wiki/certifications-guide" },
    ],
  },
  {
    label: "INDUSTRY",
    links: [
      { title: "AI Infrastructure Jobs", href: "/wiki/ai-infrastructure-jobs" },
    ],
  },
];

export default function WikiLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F0F0F0]">
      {/* Breadcrumb top bar */}
      <div className="w-full bg-white border-b border-[#E0E0E0] py-3 px-6">
        <p className="font-mono text-xs text-[#6B7280]">
          <Link href="/" className="hover:text-[#0D0F12] transition-colors">
            CoreStack
          </Link>
          {" → "}
          <Link href="/wiki" className="hover:text-[#0D0F12] transition-colors">
            Wiki
          </Link>
        </p>
      </div>

      {/* Two-column layout */}
      <div className="max-w-7xl mx-auto flex gap-0">
        {/* Left sidebar */}
        <div className="hidden md:block w-64 flex-shrink-0 sticky top-14 self-start bg-[#F0F0F0] border-r border-[#E0E0E0] min-h-screen pt-8 pb-16 px-6">
          <p className="font-mono text-xs uppercase tracking-widest text-[#6B7280] mb-6">
            WIKI
          </p>

          {sidebarSections.map((section) => (
            <div key={section.label}>
              <p className="font-mono text-xs uppercase tracking-widest text-[#6B7280] mb-2 mt-6">
                {section.label}
              </p>
              <div className="flex flex-col">
                {section.links.map((link) => (
                  <WikiSidebarLink key={link.href} href={link.href} title={link.title} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Right content area */}
        <div className="flex-1 min-w-0 bg-white min-h-screen">
          <div className="pt-12 pb-20 px-8 md:px-16 max-w-3xl">
            {/* Mobile back link */}
            <div className="md:hidden mb-6">
              <Link
                href="/wiki"
                className="font-mono text-sm text-[#6B7280] hover:text-[#0D0F12] transition-colors"
              >
                ← Wiki
              </Link>
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
