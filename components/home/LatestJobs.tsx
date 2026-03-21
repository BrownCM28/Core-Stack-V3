import { ArrowRight } from "lucide-react";
import { JobCard } from "@/components/home/JobCard";
import type { Job } from "@/lib/mock-data";

export function LatestJobs({ jobs }: { jobs: Job[] }) {
  return (
    <div>
      {/* Section header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[11px] text-text-muted tracking-[0.12em] uppercase">
            Latest Listings
          </span>
          <div className="h-px w-10 bg-[#E2DDD8]" />
        </div>
        <a
          href="#"
          className="flex items-center gap-1 font-mono text-xs text-text-muted hover:text-accent transition-colors duration-150"
        >
          View all jobs
          <ArrowRight size={12} />
        </a>
      </div>

      {/* Job grid — 2 cols */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
    </div>
  );
}
