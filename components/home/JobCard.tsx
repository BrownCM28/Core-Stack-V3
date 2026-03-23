import Link from "next/link";
import { MapPin, Clock, Briefcase } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import { timeAgoFromISO, formatSalary } from "@/lib/types";
import type { ApiJob } from "@/lib/types";

export function JobCard({ job }: { job: ApiJob }) {
  const isNew = Date.now() - new Date(job.postedAt).getTime() < 48 * 60 * 60 * 1000;

  return (
    <Link
      href={`/jobs/${job.id}`}
      className={cn(
        "group block bg-surface rounded-[8px] p-5",
        "border-[1.5px] border-[#E2DDD8]",
        "transition-all duration-150 cursor-pointer",
        "hover:border-accent/40 hover:-translate-y-0.5 hover:shadow-sm"
      )}
    >
      {/* Badge row */}
      <div className="flex items-center gap-1.5 flex-wrap mb-3">
        {isNew && <Badge variant="new">NEW</Badge>}
        <Badge variant="muted">{job.category}</Badge>
        {job.type === "Contract" && (
          <Badge variant="expiring">Contract</Badge>
        )}
      </div>

      {/* Title */}
      <h3 className="font-mono font-semibold text-sm leading-snug text-text-primary mb-1 group-hover:text-accent transition-colors duration-150">
        {job.title}
      </h3>

      {/* Company */}
      <p className="font-sans text-xs font-semibold text-text-muted mb-3 uppercase tracking-wide">
        {job.company}
      </p>

      {/* Location + type */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] font-sans text-text-muted mb-4">
        <span className="flex items-center gap-1">
          <MapPin size={10} className="flex-shrink-0" />
          {job.location}
        </span>
        <span className="flex items-center gap-1">
          <Briefcase size={10} className="flex-shrink-0" />
          {job.type}
        </span>
      </div>

      {/* Footer: salary + time */}
      <div className="flex items-center justify-between pt-3 border-t border-[#E2DDD8]">
        <span className="font-mono text-sm font-semibold text-text-primary">
          {formatSalary(job.salaryMin, job.salaryMax, job.salary)}
        </span>
        <span className="flex items-center gap-1 text-[11px] font-mono text-text-muted">
          <Clock size={10} />
          {timeAgoFromISO(job.postedAt)}
        </span>
      </div>
    </Link>
  );
}
