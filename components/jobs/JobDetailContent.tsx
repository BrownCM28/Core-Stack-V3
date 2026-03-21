"use client";

import { useState } from "react";
import {
  MapPin,
  Clock,
  Briefcase,
  Bookmark,
  ChevronRight,
  ArrowUpRight,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { ApplyModal } from "@/components/ApplyModal";
import { JobCard } from "@/components/home/JobCard";
import { cn } from "@/lib/utils";
import type { Job } from "@/lib/mock-data";

function formatSalary(min: number, max: number) {
  return `$${min}k–$${max}k`;
}

function formatTimeAgo(hours: number): string {
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "1 day ago";
  if (days < 7) return `${days} days ago`;
  const weeks = Math.floor(days / 7);
  return weeks === 1 ? "1 week ago" : `${weeks} weeks ago`;
}

interface JobDetailContentProps {
  job: Job;
  similarJobs: Job[];
}

export function JobDetailContent({ job, similarJobs }: JobDetailContentProps) {
  const [applyOpen, setApplyOpen] = useState(false);
  const [saved, setSaved] = useState(false);

  return (
    <>
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">

          {/* Breadcrumb */}
          <nav
            className="flex items-center gap-1.5 text-xs font-mono text-text-muted mb-8"
            aria-label="Breadcrumb"
          >
            <a href="#" className="hover:text-accent transition-colors duration-150">
              Jobs
            </a>
            <ChevronRight size={12} className="flex-shrink-0" />
            <a href="#" className="hover:text-accent transition-colors duration-150">
              {job.category}
            </a>
            <ChevronRight size={12} className="flex-shrink-0" />
            <span className="text-text-primary truncate">{job.title}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

            {/* ── Left: header + description ── */}
            <div className="lg:col-span-2 flex flex-col gap-5">

              {/* Job header */}
              <div className="bg-surface border-[1.5px] border-black rounded-[8px] p-6">
                <div className="flex items-start gap-5">

                  {/* Company logo placeholder */}
                  <div className="flex-shrink-0 w-16 h-16 rounded-[8px] bg-[#1E2128] border-[1.5px] border-[#2A2D35] flex items-center justify-center">
                    <span className="font-mono font-bold text-2xl text-[#4B5563]">
                      {job.company[0]}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h1 className="font-mono font-bold text-2xl text-text-primary leading-tight mb-1">
                      {job.title}
                    </h1>
                    <a
                      href="#"
                      className="font-sans text-sm text-text-muted hover:text-accent transition-colors duration-150"
                    >
                      {job.company}
                    </a>

                    {/* Meta row */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs font-sans text-text-muted mt-3 mb-4">
                      <span className="flex items-center gap-1.5">
                        <MapPin size={11} />
                        {job.location}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Briefcase size={11} />
                        {job.type}
                      </span>
                      <span className="font-mono font-semibold text-text-primary">
                        {formatSalary(job.salaryMin, job.salaryMax)}
                      </span>
                    </div>

                    {/* Badges */}
                    <div className="flex flex-wrap items-center gap-1.5 mb-5">
                      {job.featured && <Badge variant="featured">FEATURED</Badge>}
                      {job.postedHoursAgo < 48 && <Badge variant="new">NEW</Badge>}
                      <Badge variant="muted">{job.category}</Badge>
                      {job.type === "Contract" && (
                        <Badge variant="expiring">Contract</Badge>
                      )}
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        onClick={() => setApplyOpen(true)}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent border-[1.5px] border-black text-[#0D0F12] font-mono font-semibold text-sm rounded-[6px] transition-all duration-150 hover:bg-[#34C47E] hover:shadow-[0_0_16px_rgba(62,207,142,0.25)]"
                      >
                        Apply Now
                      </button>
                      <button
                        onClick={() => setSaved((v) => !v)}
                        className={cn(
                          "inline-flex items-center gap-2 px-5 py-2.5 border-[1.5px] border-black rounded-[6px] font-mono font-medium text-sm transition-all duration-150",
                          saved
                            ? "bg-accent text-[#0D0F12]"
                            : "bg-transparent text-text-primary hover:border-accent hover:text-accent hover:shadow-[0_0_0_1px_#3ECF8E,_0_0_12px_rgba(62,207,142,0.15)]"
                        )}
                      >
                        <Bookmark
                          size={14}
                          fill={saved ? "currentColor" : "none"}
                        />
                        {saved ? "Saved" : "Save Job"}
                      </button>
                    </div>

                    {/* Posted info */}
                    <p className="mt-4 text-xs font-mono text-text-muted flex items-center gap-1.5">
                      <Clock size={10} />
                      Posted {formatTimeAgo(job.postedHoursAgo)} · Source: LinkedIn
                    </p>
                  </div>
                </div>
              </div>

              {/* Job description */}
              <JobDescription />
            </div>

            {/* ── Right: sidebar ── */}
            <div className="lg:col-span-1 flex flex-col gap-5 lg:sticky lg:top-[calc(3.5rem+2rem)]">

              {/* Job details card */}
              <SidebarCard title="Job Details">
                <dl className="flex flex-col gap-3">
                  <DetailRow
                    label="Location"
                    value={job.location}
                    icon={<MapPin size={12} />}
                  />
                  <DetailRow
                    label="Job Type"
                    value={job.type}
                    icon={<Briefcase size={12} />}
                  />
                  <DetailRow label="Category" value={job.category} />
                  <DetailRow
                    label="Salary"
                    value={formatSalary(job.salaryMin, job.salaryMax)}
                  />
                  <DetailRow
                    label="Remote"
                    value={job.location === "Remote" ? "Yes" : "On-site"}
                  />
                  <DetailRow
                    label="Posted"
                    value={formatTimeAgo(job.postedHoursAgo)}
                    icon={<Clock size={12} />}
                  />
                </dl>
              </SidebarCard>

              {/* Company card */}
              <SidebarCard title="Company">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-[6px] bg-[#1E2128] border border-[#2A2D35] flex items-center justify-center flex-shrink-0">
                    <span className="font-mono font-bold text-base text-[#4B5563]">
                      {job.company[0]}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="font-mono font-semibold text-sm text-text-primary">
                      {job.company}
                    </p>
                    <p className="font-sans text-xs text-text-muted">
                      Data Center Provider
                    </p>
                  </div>
                </div>
                <a
                  href="#"
                  className="flex items-center gap-1.5 font-mono text-xs text-text-muted hover:text-accent transition-colors duration-150"
                >
                  View all roles from {job.company}
                  <ArrowUpRight size={11} />
                </a>
              </SidebarCard>

              {/* Similar jobs */}
              {similarJobs.length > 0 && (
                <div>
                  <p className="font-mono text-[10px] text-text-muted tracking-[0.12em] uppercase mb-3">
                    Similar Jobs
                  </p>
                  <div className="flex flex-col gap-3">
                    {similarJobs.map((sj) => (
                      <JobCard key={sj.id} job={sj} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <ApplyModal
        open={applyOpen}
        onClose={() => setApplyOpen(false)}
        job={{ title: job.title, company: job.company }}
      />
    </>
  );
}

// ─── Job description ─────────────────────────────────────────────────────────

const RESPONSIBILITIES = [
  "Monitor and maintain critical infrastructure including UPS systems, PDUs, diesel generators, ATS, CRAC/CRAH units, and BMS",
  "Respond to critical alarms and execute emergency response procedures to minimize downtime impact",
  "Perform scheduled and unscheduled preventive maintenance and document all activities in the CMMS",
  "Coordinate third-party vendor and contractor work within the facility, ensuring safe practices and quality outcomes",
  "Participate in the change management process and conduct risk assessments for all planned maintenance",
  "Support capacity planning initiatives and assist with infrastructure expansion and build-out projects",
  "Maintain accurate as-built documentation, single-line diagrams, and system schematics",
  "Ensure compliance with SOC 2 Type II, ISO 27001, and SSAE 18 operational standards",
];

const REQUIREMENTS = [
  "3+ years of experience in data center operations or critical facilities management",
  "Strong working knowledge of electrical systems: UPS, PDU, MV/LV switchgear, generators, ATS",
  "Hands-on experience with mechanical systems: CRAC/CRAH, precision cooling, chillers, cooling towers",
  "Familiarity with DCIM software such as Nlyte, Sunbird, or Schneider EcoStruxure",
  "OSHA 30-Hour certification or willingness to obtain within 60 days of hire",
  "Ability to work on-call rotation and respond to after-hours emergencies",
  "Associates or Bachelor's degree in Electrical, Mechanical, or Facilities Engineering preferred",
];

const NICE_TO_HAVE = [
  "Certified Data Center Expert Professional (CDCEP) or equivalent certification",
  "Experience operating Equinix IBX or other Tier III/IV colocation environments",
  "Knowledge of 48V DC power infrastructure and battery systems",
  "BICSI RCDD or OSP certification",
];

const BENEFITS = [
  "Base salary: $95,000 – $120,000 depending on experience and certifications",
  "Participation in Equinix's Employee Stock Purchase Plan (ESPP)",
  "Comprehensive medical, dental, and vision coverage from day one",
  "401(k) with Equinix matching contributions up to 6% of salary",
  "Annual learning & development budget for certifications and training",
  "On-call premium pay and shift differentials",
  "Paid parental leave and employee wellness programs",
];

function BulletList({
  items,
  dotColor = "bg-accent",
}: {
  items: string[];
  dotColor?: string;
}) {
  return (
    <ul className="space-y-2.5">
      {items.map((item, i) => (
        <li
          key={i}
          className="flex items-start gap-3 font-sans text-sm text-text-primary leading-relaxed"
        >
          <span
            className={cn(
              "mt-[7px] w-1.5 h-1.5 rounded-full flex-shrink-0",
              dotColor
            )}
          />
          {item}
        </li>
      ))}
    </ul>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-mono font-semibold text-base text-text-primary mb-4 pb-2 border-b border-[#E2DDD8]">
      {children}
    </h2>
  );
}

function JobDescription() {
  return (
    <article className="bg-surface border-[1.5px] border-[#E2DDD8] rounded-[8px] p-6 flex flex-col gap-8">

      {/* Overview */}
      <section>
        <SectionHeading>Overview</SectionHeading>
        <p className="font-sans text-sm text-text-primary leading-relaxed">
          Equinix is seeking an experienced Data Center Facilities Engineer to join our
          critical infrastructure team in Dallas, TX. You will be responsible for the
          day-to-day operations, maintenance, and continuous improvement of our Tier IV
          colocation facility supporting some of the world&apos;s largest cloud providers,
          financial institutions, and enterprise customers. Working within a 24/7/365
          operational environment, you&apos;ll play a central role in maintaining
          industry-leading uptime across all critical mechanical and electrical systems.
        </p>
      </section>

      {/* Responsibilities */}
      <section>
        <SectionHeading>Responsibilities</SectionHeading>
        <BulletList items={RESPONSIBILITIES} dotColor="bg-accent" />
      </section>

      {/* Requirements */}
      <section>
        <SectionHeading>Requirements</SectionHeading>
        <BulletList items={REQUIREMENTS} dotColor="bg-[#E2DDD8]" />
      </section>

      {/* Nice to Have */}
      <section>
        <SectionHeading>Nice to Have</SectionHeading>
        <BulletList items={NICE_TO_HAVE} dotColor="bg-text-muted/40" />
      </section>

      {/* Compensation */}
      <section>
        <SectionHeading>Compensation &amp; Benefits</SectionHeading>
        <BulletList items={BENEFITS} dotColor="bg-accent/60" />
      </section>
    </article>
  );
}

// ─── Sidebar sub-components ───────────────────────────────────────────────────

function SidebarCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-surface border-[1.5px] border-[#E2DDD8] rounded-[8px] p-5">
      <p className="font-mono text-[10px] text-text-muted tracking-[0.12em] uppercase mb-4 pb-3 border-b border-[#E2DDD8]">
        {title}
      </p>
      {children}
    </div>
  );
}

function DetailRow({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <dt className="font-mono text-xs text-text-muted flex-shrink-0">{label}</dt>
      <dd className="font-sans text-xs text-text-primary text-right flex items-center gap-1">
        {icon && <span className="text-text-muted">{icon}</span>}
        {value}
      </dd>
    </div>
  );
}
