import { MapPin, Briefcase, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import type { Job } from "@/lib/mock-data";

function formatSalary(min: number, max: number): string {
  return `$${min}k–$${max}k`;
}

function FeaturedJobCard({ job }: { job: Job }) {
  return (
    <a
      href="#"
      className="group flex-shrink-0 w-[300px] rounded-[8px] overflow-hidden border-[1.5px] border-black transition-all duration-150 hover:shadow-[0_0_0_1px_#3ECF8E,_0_0_12px_rgba(62,207,142,0.15)] hover:-translate-y-0.5"
    >
      <div className="flex">
        {/* Left accent bar */}
        <div className="w-[3px] bg-accent flex-shrink-0" />
        {/* Card body */}
        <div className="flex-1 bg-surface p-5">
          <div className="flex items-start justify-between mb-3">
            <Badge variant="featured">FEATURED</Badge>
            <ArrowUpRight
              size={14}
              className="text-text-muted group-hover:text-accent transition-colors duration-150 mt-0.5 flex-shrink-0"
            />
          </div>

          <p className="font-sans text-[10px] font-semibold text-text-muted mb-1.5 uppercase tracking-[0.08em]">
            {job.company}
          </p>

          <h3 className="font-mono font-semibold text-sm leading-snug text-text-primary mb-4 group-hover:text-accent transition-colors duration-150">
            {job.title}
          </h3>

          <div className="flex flex-col gap-1.5 text-[11px] font-sans text-text-muted mb-4">
            <span className="flex items-center gap-1.5">
              <MapPin size={10} className="flex-shrink-0" />
              {job.location}
            </span>
            <span className="flex items-center gap-1.5">
              <Briefcase size={10} className="flex-shrink-0" />
              {job.type}
            </span>
          </div>

          <div className="pt-3 border-t border-[#E2DDD8]">
            <span className="font-mono text-sm font-semibold text-text-primary">
              {formatSalary(job.salaryMin, job.salaryMax)}
            </span>
          </div>
        </div>
      </div>
    </a>
  );
}

export function FeaturedJobsStrip({ jobs }: { jobs: Job[] }) {
  return (
    <section className="bg-background border-b border-[#E2DDD8] py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="flex items-center gap-3 mb-6">
          <span className="font-mono text-[11px] text-text-muted tracking-[0.12em] uppercase whitespace-nowrap">
            Featured Roles
          </span>
          <div className="flex-1 h-px bg-[#E2DDD8]" />
        </div>

        {/* Horizontal scroll strip */}
        <div
          className="scrollbar-hide flex gap-4 overflow-x-auto pb-2"
        >
          {jobs.map((job) => (
            <FeaturedJobCard key={job.id} job={job} />
          ))}
          {/* Fade hint — rightmost edge */}
          <div className="flex-shrink-0 w-4" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
