"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Search, MapPin, Server, Zap, BadgeCheck, Briefcase,
  ArrowRight, MessageCircle, ChevronDown, ChevronRight, User,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────
// Shared helpers
// ─────────────────────────────────────────────────────────────

function GithubIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────
// NAVBAR
// ─────────────────────────────────────────────────────────────

function HomeNav() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white">
      <div className="flex items-center justify-between px-8 md:px-16 h-16">
        {/* Wordmark */}
        <Link href="/" className="font-display text-xl leading-none">
          <span className="text-black">Core</span>
          <span className="text-[#3ECF8E]">Stack</span>
        </Link>

        {/* Nav links */}
        <nav aria-label="Main navigation" className="hidden md:flex items-center gap-8">
          {[
            { label: "Browse Jobs", href: "/jobs" },
            { label: "Wiki", href: "/wiki" },
            { label: "Talent", href: "/talent" },
            { label: "Post a Job", href: "/employers" },
          ].map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className="font-mono text-sm text-black hover:text-[#3ECF8E] transition-colors duration-150"
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <Link
          href="/jobs"
          className="bg-black text-white rounded-full px-5 py-2 font-mono text-sm hover:bg-gray-900 transition-colors duration-150"
        >
          Browse Jobs
        </Link>
      </div>

      {/* Rule + animated SVG trace */}
      <div className="relative h-px bg-[#E5E5E5]">
        <div className="absolute inset-x-0 -top-2 h-6 pointer-events-none overflow-hidden">
          <svg
            className="w-full h-full"
            viewBox="0 0 1440 24"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <circle cx="32" cy="8" r="4" fill="black" />
            <circle cx="1408" cy="8" r="4" fill="black" />
            <motion.path
              d="M 32 8 C 240 8 480 22 720 22 C 960 22 1200 8 1408 8"
              stroke="black"
              strokeWidth="1.5"
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1.5, ease: "easeInOut", delay: 0.3 }}
            />
          </svg>
        </div>
      </div>
    </header>
  );
}

// ─────────────────────────────────────────────────────────────
// HERO
// ─────────────────────────────────────────────────────────────

function Hero() {
  const [searchQuery, setSearchQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const router = useRouter();

  function handleSearch() {
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set("search", searchQuery.trim());
    if (locationQuery.trim()) params.set("location", locationQuery.trim());
    router.push(`/jobs${params.toString() ? `?${params.toString()}` : ""}`);
  }

  return (
    <section className="relative min-h-screen bg-white overflow-hidden px-8 md:px-16 pt-32 pb-16 flex flex-col items-center justify-between">

      {/* Datacenter background image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/hero-datacenter.png"
        alt=""
        className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none select-none"
        aria-hidden="true"
        style={{ opacity: 0.28 }}
      />

      {/* Massive editorial headline */}
      <motion.div
        initial={{ opacity: 0, y: 48 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 flex flex-col items-center text-center w-full"
      >
        <h1
          className="font-display font-normal uppercase tracking-tight text-black leading-none text-center w-full"
          aria-label="Infrastructure jobs for the people who keep the world running."
        >
          <span className="block text-center text-[13vw] md:text-[7.5vw] leading-[1.05] font-normal uppercase tracking-tight text-black w-full">
            INFRASTRUCTURE
          </span>
          <span className="block text-center text-[13vw] md:text-[7.5vw] leading-[1.05] font-normal uppercase tracking-tight text-black w-full">
            JOBS FOR THE
          </span>
          <span className="flex items-baseline justify-center gap-3 text-[13vw] md:text-[7.5vw] leading-[1.05] font-normal uppercase tracking-tight text-black w-full">
            <span>PEOPLE WHO</span>
            <motion.span
              className="text-[#3ECF8E] inline-block"
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              aria-hidden="true"
            >
              ✦
            </motion.span>
          </span>
          <span className="block text-center text-[13vw] md:text-[7.5vw] leading-[1.05] font-normal uppercase tracking-tight text-black w-full">
            KEEP THE WORLD
          </span>
          <span className="block text-center text-[13vw] md:text-[7.5vw] leading-[1.05] font-normal uppercase tracking-tight text-black w-full">
            RUNNING.
          </span>
        </h1>
        <p className="text-center font-sans text-base text-gray-500 leading-relaxed max-w-xl mx-auto mt-6">
          CoreStack aggregates data center and AI infrastructure roles from top employers — updated daily. Your GitHub profile is your resume.
        </p>
      </motion.div>

      {/* Search + bottom bar */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 mt-12 max-w-3xl w-full"
      >
        {/* Squared search bar */}
        <div className="flex items-stretch border-2 border-black bg-white w-full">
          {/* Keyword */}
          <label htmlFor="hero-keyword" className="sr-only">Job title or keyword</label>
          <div className="flex items-center flex-1 px-4 py-3 border-r-2 border-black">
            <Search size={16} className="text-black flex-shrink-0 mr-3" aria-hidden="true" />
            <input
              id="hero-keyword"
              type="text"
              placeholder="Job title or keyword..."
              className="flex-1 font-mono text-sm text-black bg-transparent border-none outline-none placeholder:text-gray-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>
          {/* Location */}
          <label htmlFor="hero-location" className="sr-only">Location</label>
          <div className="flex items-center w-48 px-4 py-3 border-r-2 border-black">
            <MapPin size={16} className="text-black flex-shrink-0 mr-3" aria-hidden="true" />
            <input
              id="hero-location"
              type="text"
              placeholder="Location"
              className="flex-1 font-mono text-sm text-black bg-transparent border-none outline-none placeholder:text-gray-400"
              value={locationQuery}
              onChange={(e) => setLocationQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>
          {/* Submit */}
          <button
            onClick={handleSearch}
            className="bg-black text-white font-mono text-sm font-medium px-8 py-3 hover:bg-gray-900 transition-colors flex-shrink-0 cursor-pointer"
          >
            Search
          </button>
        </div>

        {/* Category filter row — squared */}
        <div className="flex items-center gap-0 mt-3 overflow-x-auto scrollbar-hide">
          <button
            className="flex-shrink-0 bg-black text-white font-mono text-xs px-4 py-2 border-2 border-black hover:bg-gray-900 transition-colors cursor-pointer"
            onClick={() => router.push("/jobs")}
          >
            All
          </button>
          {[
            "Data Center Ops",
            "AI Infrastructure",
            "Electrical",
            "Cooling / HVAC",
            "Construction",
            "Networking",
          ].map((cat) => (
            <button
              key={cat}
              className="flex-shrink-0 bg-white text-black font-mono text-xs px-4 py-2 border-2 border-l-0 border-black hover:bg-black hover:text-white transition-colors cursor-pointer whitespace-nowrap"
              onClick={() => router.push(`/jobs?category=${encodeURIComponent(cat)}`)}
            >
              {cat}
            </button>
          ))}
          <button
            className="flex-shrink-0 bg-white text-black font-mono text-xs px-3 py-2 border-2 border-l-0 border-black hover:bg-black hover:text-white transition-colors cursor-pointer"
            onClick={() => router.push("/jobs")}
            aria-label="More categories"
          >
            <ChevronRight size={14} />
          </button>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[#E5E5E5] mt-8 pt-6 flex items-center justify-between flex-wrap gap-4">
          <a
            href="mailto:hello@corestack.io"
            className="flex items-center gap-2 font-mono text-sm text-black underline underline-offset-2 hover:text-[#3ECF8E] transition-colors duration-150"
          >
            <MessageCircle size={14} aria-hidden="true" />
            Contact us
          </a>
          <div className="flex items-center gap-4 font-mono text-sm text-gray-400" aria-label="Featured employers">
            <span>Equinix</span>
            <span className="h-4 w-px bg-gray-200" aria-hidden="true" />
            <span>CoreWeave</span>
            <span className="h-4 w-px bg-gray-200" aria-hidden="true" />
            <span>Digital Realty</span>
          </div>
          <div className="flex items-center gap-2 font-mono text-sm text-black">
            <span>Scroll down</span>
            <div className="w-7 h-7 rounded-full bg-black flex items-center justify-center" aria-hidden="true">
              <ChevronDown size={14} className="text-white" />
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// LATEST ROLES SECTION
// ─────────────────────────────────────────────────────────────

const LATEST_JOBS = [
  {
    title: "Data Center Facilities Engineer",
    company: "Equinix",
    location: "Dallas, TX",
    type: "Full-time",
    category: "Data Center Ops",
    salary: "$95k – $120k",
    badge: "NEW" as const,
    featured: true,
  },
  {
    title: "GPU Cluster Infrastructure Engineer",
    company: "CoreWeave",
    location: "Remote",
    type: "Full-time",
    category: "AI Infrastructure",
    salary: "$160k – $220k",
    badge: "NEW" as const,
    featured: false,
  },
  {
    title: "Critical Power Systems Technician",
    company: "Digital Realty",
    location: "Phoenix, AZ",
    type: "Full-time",
    category: "Electrical",
    salary: "$80k – $100k",
    badge: null,
    featured: false,
  },
  {
    title: "Data Center Construction Manager",
    company: "Turner Construction",
    location: "Chicago, IL",
    type: "Contract",
    category: "Construction",
    salary: "$130k – $160k",
    badge: null,
    featured: false,
  },
  {
    title: "Mechanical Cooling Engineer",
    company: "Vertiv",
    location: "Columbus, OH",
    type: "Full-time",
    category: "Cooling / HVAC",
    salary: "$100k – $130k",
    badge: null,
    featured: false,
  },
];

function LatestRolesSection() {
  return (
    <section className="px-8 md:px-16 py-16 bg-white border-t-2 border-black">
      {/* Section header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-display text-3xl md:text-4xl font-normal uppercase text-black">
          Latest Roles
        </h2>
        <a
          href="/jobs"
          className="font-mono text-sm text-black underline hover:text-[#3ECF8E] transition-colors duration-150"
        >
          View all roles →
        </a>
      </div>

      {/* Job rows */}
      <div className="flex flex-col divide-y-2 divide-black border-y-2 border-black">
        {LATEST_JOBS.map((job, index) => (
          <a
            key={index}
            href="/jobs"
            className="flex items-center justify-between py-5 hover:bg-[#F5F5F5] transition-colors group cursor-pointer"
          >
            {/* Left: title + meta */}
            <div className="flex items-start gap-4 flex-1 min-w-0">
              <span className="font-mono text-xs text-gray-300 w-6 flex-shrink-0 mt-1">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="min-w-0">
                {/* Title row */}
                <div className="flex items-center gap-3 mb-1 flex-wrap">
                  <span className="font-display text-lg md:text-xl font-normal text-black group-hover:text-[#3ECF8E] transition-colors duration-150">
                    {job.title}
                  </span>
                  {job.badge && (
                    <span className="font-mono text-xs bg-[#3ECF8E] text-black px-2 py-0.5 flex-shrink-0">
                      {job.badge}
                    </span>
                  )}
                  {job.featured && (
                    <span className="font-mono text-xs border-2 border-black text-black px-2 py-0.5 flex-shrink-0">
                      FEATURED
                    </span>
                  )}
                </div>
                {/* Meta row */}
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="font-mono text-xs text-gray-500">{job.company}</span>
                  <span className="font-mono text-xs text-gray-300" aria-hidden="true">·</span>
                  <span className="font-mono text-xs text-gray-500">{job.location}</span>
                  <span className="font-mono text-xs text-gray-300" aria-hidden="true">·</span>
                  <span className="font-mono text-xs border border-gray-300 text-gray-500 px-2 py-0.5">
                    {job.type}
                  </span>
                  <span className="font-mono text-xs border border-gray-300 text-gray-500 px-2 py-0.5">
                    {job.category}
                  </span>
                </div>
              </div>
            </div>
            {/* Right: salary + apply */}
            <div className="flex items-center gap-6 flex-shrink-0 ml-4">
              <span className="font-mono text-sm font-medium text-black hidden md:block">
                {job.salary}
              </span>
              <span className="font-mono text-xs text-black border-2 border-black px-3 py-2 group-hover:bg-black group-hover:text-white transition-colors flex-shrink-0">
                Apply →
              </span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// SECTION 1 — RESOURCES
// ─────────────────────────────────────────────────────────────

const RESOURCE_CARDS = [
  {
    icon: Server,
    title: "Data Center Ops",
    body: "Facilities, power, cooling, and DCIM roles at the world's largest data center operators.",
  },
  {
    icon: Zap,
    title: "AI Infrastructure",
    body: "GPU clusters, HPC, and ML infrastructure roles at hyperscalers and AI-native companies. The fastest growing category on CoreStack.",
  },
  {
    icon: BadgeCheck,
    title: "Certified Talent",
    body: "Engineers with AWS, BICSI, CKA, and Cisco credentials. Verified certifications visible on every candidate profile.",
  },
] as const;

function ResourcesSection() {
  return (
    <section className="bg-white px-8 md:px-16 py-24 border-t border-[#E5E5E5]">
      <Link href="/wiki" className="block mb-16 group">
        <h2 className="font-display font-normal text-[clamp(2rem,7vw,6rem)] uppercase text-black leading-tight group-hover:text-[#3ECF8E] transition-colors duration-150">
          INFRASTRUCTURE<br />RESOURCES ↗
        </h2>
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {RESOURCE_CARDS.map(({ icon: Icon, title, body }, i) => (
          <motion.div
            key={title}
            className="bg-[#F5F5F5] rounded-2xl p-8 hover:bg-[#EFEFEF] transition-colors duration-150 cursor-pointer"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="w-10 h-10 rounded-lg bg-[#3ECF8E]/20 flex items-center justify-center mb-6">
              <Icon size={20} className="text-[#3ECF8E]" aria-hidden="true" />
            </div>
            <h3 className="font-display text-2xl text-black mb-3">{title}</h3>
            <p className="font-sans text-sm text-gray-500 leading-relaxed">{body}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// SECTION 2 — ACCORDION
// ─────────────────────────────────────────────────────────────

const ACCORDION_ITEMS = [
  {
    title: "Find Your Role",
    body: "Search and filter thousands of data center and AI infrastructure roles updated daily. Set saved searches and get instant email alerts when new matching roles are posted.",
  },
  {
    title: "Build Your Profile",
    body: "Sign in with GitHub and your entire tech stack syncs automatically. Repos, languages, topics, and contribution activity — visible to employers at a glance. Add certification badges in one click.",
  },
  {
    title: "Get Discovered",
    body: "Toggle Open to Work and your profile appears in our talent directory. Premium employers receive monthly CoreStack Score reports — ranked candidates in their exact category, delivered before they even post a job.",
  },
  {
    title: "Post and Hire",
    body: "Standard and Featured job listings reach thousands of infrastructure engineers. View applicant GitHub profiles and certifications directly — no resume parsing, no noise.",
  },
];

function AccordionSection() {
  const [open, setOpen] = useState(0);

  return (
    <section className="bg-white px-8 md:px-16 py-24 border-t border-[#E5E5E5]">
      <h2 className="font-display font-normal text-[clamp(2rem,6vw,5.5rem)] uppercase text-black mb-16 leading-tight">
        INTRODUCING<br />CORESTACK
      </h2>

      <div>
        {ACCORDION_ITEMS.map((item, i) => (
          <div key={item.title} className="border-b border-[#E5E5E5]">
            <button
              onClick={() => setOpen(open === i ? -1 : i)}
              className="w-full py-6 flex items-center justify-between hover:bg-[#FAFAFA] transition-colors duration-150 -mx-8 px-8 text-left"
              aria-expanded={open === i}
            >
              <span className="font-display text-2xl md:text-3xl font-normal text-black">
                {item.title}
              </span>
              <span className="text-2xl font-light text-black flex-shrink-0 ml-4 leading-none" aria-hidden="true">
                {open === i ? "−" : "+"}
              </span>
            </button>

            <AnimatePresence initial={false}>
              {open === i && (
                <motion.div
                  key="body"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.22, ease: "easeInOut" }}
                  style={{ overflow: "hidden" }}
                >
                  <p className="font-sans text-sm text-gray-500 max-w-lg leading-relaxed pt-2 pb-8">
                    {item.body}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// SECTION 3 — COVERED
// ─────────────────────────────────────────────────────────────

function ConnectorDiagram({ nodes }: {
  nodes: { icon: React.ReactNode; accent?: boolean; label: string }[];
}) {
  return (
    <div className="flex items-center justify-center mt-8 gap-0" aria-hidden="true">
      {nodes.map((node, i) => (
        <div key={i} className="flex items-center">
          <div
            className={`w-12 h-12 rounded-xl border flex items-center justify-center ${
              node.accent
                ? "bg-[#3ECF8E] border-black"
                : "bg-white border-gray-300"
            }`}
            title={node.label}
          >
            {node.icon}
          </div>
          {i < nodes.length - 1 && (
            <div className="w-12 border-t-2 border-dashed border-gray-300" />
          )}
        </div>
      ))}
    </div>
  );
}

function OrbitDiagram() {
  return (
    <div className="relative w-36 h-36 mx-auto mt-8" aria-hidden="true">
      <div className="absolute inset-0 rounded-full border-2 border-gray-200" />
      <div className="absolute inset-5 rounded-full border-2 border-gray-200" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-12 h-12 rounded-full bg-[#3ECF8E]/15 flex items-center justify-center">
          <span className="font-mono text-xs font-bold text-[#3ECF8E]">CS</span>
        </div>
      </div>
      <motion.div
        className="absolute inset-0"
        animate={{ rotate: 360 }}
        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-black" />
      </motion.div>
      <motion.div
        className="absolute inset-5"
        animate={{ rotate: -360 }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#3ECF8E]" />
      </motion.div>
    </div>
  );
}

function CoveredSection() {
  return (
    <section className="bg-white px-8 md:px-16 py-24 border-t border-[#E5E5E5]">
      <h2 className="font-display font-normal text-[clamp(2rem,5vw,4.5rem)] uppercase text-black mb-12 leading-tight">
        CORESTACK HAS<br />GOT YOU COVERED
      </h2>

      <div className="flex flex-col gap-4">
        {[
          {
            title: "GitHub-native candidate profiles",
            visual: (
              <ConnectorDiagram nodes={[
                { icon: <GithubIcon size={20} />, label: "GitHub" },
                { icon: <Zap size={20} className="text-black" />, label: "CoreStack", accent: true },
                { icon: <Briefcase size={20} className="text-gray-500" />, label: "Employer" },
              ]} />
            ),
          },
          {
            title: "Automated monthly talent reports",
            visual: <OrbitDiagram />,
          },
          {
            title: "Certification verification at a glance",
            visual: (
              <ConnectorDiagram nodes={[
                { icon: <User size={20} className="text-gray-500" />, label: "Candidate" },
                { icon: <BadgeCheck size={20} className="text-black" />, label: "Verified Badge", accent: true },
                { icon: <Briefcase size={20} className="text-gray-500" />, label: "Employer" },
              ]} />
            ),
          },
        ].map(({ title, visual }, i) => (
          <motion.div
            key={title}
            className="bg-[#F5F5F5] rounded-2xl p-8"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <h3 className="font-sans text-lg font-semibold text-black">{title}</h3>
            {visual}
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// SECTION 4 — TESTIMONIALS
// ─────────────────────────────────────────────────────────────

const TESTIMONIALS = [
  {
    category: "DATA CENTER OPS",
    quote: (
      <>
        CoreStack found me a senior facilities role at{" "}
        <strong>Equinix</strong> in three weeks. No other platform had roles
        at this level of specificity.
      </>
    ),
    name: "James Liu",
    role: "Facilities Engineer, Dallas TX",
  },
  {
    category: "AI INFRASTRUCTURE",
    quote: (
      <>
        My GitHub profile did the talking. <strong>CoreWeave</strong> reached
        out directly after seeing my Kubernetes repos on CoreStack.
      </>
    ),
    name: "Mia Kumar",
    role: "GPU Cluster Engineer, Remote",
  },
  {
    category: "EMPLOYER",
    quote: (
      <>
        The CoreStack Score report sent us three qualified{" "}
        <strong>BICSI-certified</strong> candidates before we even posted the
        role.
      </>
    ),
    name: "Sarah Chen",
    role: "Talent Lead, Digital Realty",
  },
  {
    category: "CONSTRUCTION",
    quote: (
      <>
        Found a $140k construction PM role at{" "}
        <strong>Turner Construction</strong> within two weeks. The job was on
        CoreStack before it appeared anywhere else.
      </>
    ),
    name: "David Park",
    role: "Construction PM, Seattle WA",
  },
];

function TestimonialsSection() {
  return (
    <section className="bg-white px-8 md:px-16 py-24 border-t border-[#E5E5E5]">
      <h2 className="font-display font-normal text-[clamp(2rem,5vw,4.5rem)] uppercase text-black mb-12 leading-tight">
        WHAT ENGINEERS<br />ARE SAYING
      </h2>

      <div className="flex gap-6 overflow-x-auto scrollbar-hide pb-4">
        {TESTIMONIALS.map(({ category, quote, name, role }) => (
          <article
            key={name}
            className="min-w-[340px] bg-[#F5F5F5] rounded-2xl p-8 flex flex-col justify-between flex-shrink-0"
          >
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-gray-400 mb-4">
                {category}
              </p>
              <div className="flex items-start justify-between gap-4 mb-6">
                <p className="font-sans text-base text-black leading-relaxed">{quote}</p>
                <div
                  className="w-8 h-8 rounded-full bg-black flex items-center justify-center flex-shrink-0 mt-1"
                  aria-hidden="true"
                >
                  <ArrowRight size={14} className="text-white" />
                </div>
              </div>
            </div>
            <footer>
              <p className="font-display text-lg text-black">{name}</p>
              <p className="font-mono text-xs text-gray-400 mt-1">{role}</p>
            </footer>
          </article>
        ))}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// FOOTER
// ─────────────────────────────────────────────────────────────

function PageFooter() {
  return (
    <footer className="bg-[#0D0F12] py-12 px-8 md:px-16">
      <div className="flex justify-between items-center flex-wrap gap-4 mb-8">
        <Link href="/" className="font-display text-xl leading-none">
          <span className="text-white">Core</span>
          <span className="text-[#3ECF8E]">Stack</span>
        </Link>
        <nav aria-label="Footer navigation">
          <ul className="flex gap-6 flex-wrap" role="list">
            {[
              { label: "Browse Jobs", href: "/jobs" },
              { label: "Talent", href: "/talent" },
              { label: "Wiki", href: "/wiki" },
              { label: "Post a Job", href: "/employers" },
            ].map(({ label, href }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="text-sm font-sans text-white/40 hover:text-white/80 transition-colors duration-150"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="border-t border-white/10 pt-6">
        <p className="text-xs text-white/25 font-mono text-center">
          © 2025 CoreStack. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

// ─────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────

export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <HomeNav />
      <Hero />
      <LatestRolesSection />
      <ResourcesSection />
      <AccordionSection />
      <CoveredSection />
      <TestimonialsSection />
      <PageFooter />
    </div>
  );
}
