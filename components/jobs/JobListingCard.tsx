"use client";

import { useRouter } from "next/navigation";
import { MapPin, Clock, Briefcase, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import type { Job } from "@/lib/mock-data";

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  "Data Center Ops":
    "Monitor and maintain critical infrastructure systems including power, cooling, and connectivity in a Tier III/IV facility. Ensure maximum uptime in a 24/7 mission-critical environment.",
  Electrical:
    "Design, install, and maintain high-voltage electrical systems for mission-critical data center infrastructure including UPS systems, switchgear, and generator sets.",
  "AI Infrastructure":
    "Build, deploy, and optimize GPU cluster infrastructure and distributed computing systems supporting large-scale machine learning and AI workloads.",
  Construction:
    "Lead construction, commissioning, and turnover activities for greenfield and brownfield data center builds. Coordinate with engineering and operations teams.",
  "Cooling/HVAC":
    "Maintain and optimize precision cooling systems including CRAC/CRAH units, chillers, cooling towers, and economizers to ensure optimal thermal management.",
  Networking:
    "Design, deploy, and maintain network infrastructure including routing, switching, and fiber plant across hyperscale and colocation data center environments.",
  "Project Management":
    "Lead cross-functional teams delivering mission-critical infrastructure projects on schedule and within budget. Interface with engineers, contractors, and executive stakeholders.",
};

function formatSalary(min: number, max: number): string {
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

interface JobListingCardProps {
  job: Job;
  onApply: (job: Job) => void;
}

export function JobListingCard({ job, onApply }: JobListingCardProps) {
  const router = useRouter();
  const isNew = job.postedHoursAgo < 48;
  const description = CATEGORY_DESCRIPTIONS[job.category] ?? "";

  return (
    <div
      role="article"
      onClick={() => router.push(`/jobs/${job.id}`)}
      className={cn(
        "group relative bg-surface rounded-[8px] p-6 cursor-pointer",
        "transition-all duration-150",
        job.featured
          ? "border-[1.5px] border-black border-l-[3px] border-l-accent hover:shadow-[0_0_0_1px_#3ECF8E,_0_0_12px_rgba(62,207,142,0.15)] hover:-translate-y-0.5"
          : "border-[1.5px] border-[#E2DDD8] hover:border-accent/40 hover:-translate-y-0.5 hover:shadow-sm"
      )}
    >
      {/* Top row: badges */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-1.5 flex-wrap">
          {isNew && <Badge variant="new">NEW</Badge>}
          {job.featured && <Badge variant="featured">FEATURED</Badge>}
          <Badge variant="muted">{job.category}</Badge>
          {job.type === "Contract" && (
            <Badge variant="expiring">Contract</Badge>
          )}
          {job.location === "Remote" && (
            <Badge variant="muted">Remote</Badge>
          )}
        </div>
      </div>

      {/* Title */}
      <h3 className="font-mono font-semibold text-base leading-snug text-text-primary mb-1 group-hover:text-accent transition-colors duration-150">
        {job.title}
      </h3>

      {/* Company · location · type */}
      <p className="font-sans text-sm text-text-muted mb-4">
        <span className="font-semibold text-text-primary">{job.company}</span>
        <span className="mx-1.5 text-[#E2DDD8]">·</span>
        <span className="inline-flex items-center gap-1">
          <MapPin size={11} className="inline flex-shrink-0" />
          {job.location}
        </span>
        <span className="mx-1.5 text-[#E2DDD8]">·</span>
        <span className="inline-flex items-center gap-1">
          <Briefcase size={11} className="inline flex-shrink-0" />
          {job.type}
        </span>
      </p>

      {/* Salary */}
      <p className="font-mono text-sm font-semibold text-text-primary mb-3">
        {formatSalary(job.salaryMin, job.salaryMax)}
      </p>

      {/* Description excerpt */}
      <p className="font-sans text-sm text-text-muted leading-relaxed line-clamp-2 mb-5">
        {description}
      </p>

      {/* Footer: time + apply button */}
      <div className="flex items-center justify-between pt-4 border-t border-[#E2DDD8]">
        <span className="flex items-center gap-1.5 text-xs font-mono text-text-muted">
          <Clock size={11} />
          {formatTimeAgo(job.postedHoursAgo)}
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onApply(job);
          }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-accent border-[1.5px] border-black text-[#0D0F12] font-mono font-semibold text-xs rounded-[6px] transition-all duration-150 hover:bg-[#34C47E] hover:shadow-[0_0_16px_rgba(62,207,142,0.25)]"
        >
          Apply Now
          <ArrowRight size={12} />
        </button>
      </div>
    </div>
  );
}
