"use client";

import { useState } from "react";
import {
  SlidersHorizontal,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { JobFilters } from "@/components/JobFilters";
import { JobListingCard } from "@/components/jobs/JobListingCard";
import { ApplyModal } from "@/components/ApplyModal";
import { cn } from "@/lib/utils";
import type { Job } from "@/lib/mock-data";

interface JobsPageContentProps {
  jobs: Job[];
}

export function JobsPageContent({ jobs }: JobsPageContentProps) {
  const [applyJob, setApplyJob] = useState<Job | null>(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [sortBy, setSortBy] = useState("newest");

  return (
    <>
      <div className="min-h-screen bg-background">

        {/* ── Mobile filter toggle bar ── */}
        <div className="lg:hidden sticky top-14 z-30 bg-background border-b border-[#E2DDD8] px-4 py-3 flex items-center justify-between">
          <span className="font-mono text-xs text-text-muted">
            <span className="text-text-primary font-semibold">{jobs.length}</span> roles found
          </span>
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="flex items-center gap-2 font-mono text-xs text-text-primary border-[1.5px] border-[#E2DDD8] rounded-[6px] px-3 py-1.5 hover:border-accent hover:text-accent transition-all duration-150"
          >
            <SlidersHorizontal size={13} />
            Filters
          </button>
        </div>

        {/* ── Mobile filter drawer ── */}
        {mobileFiltersOpen && (
          <div className="lg:hidden fixed inset-0 z-40 flex">
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setMobileFiltersOpen(false)}
            />
            <aside className="relative z-10 w-[300px] bg-surface h-full overflow-y-auto p-6 border-r border-[#E2DDD8] shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <span className="font-mono font-semibold text-sm text-text-primary">
                  Filters
                </span>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="text-text-muted hover:text-accent transition-colors duration-150 p-1"
                >
                  <X size={18} />
                </button>
              </div>
              <JobFilters />
            </aside>
          </div>
        )}

        {/* ── Page body ── */}
        <div className="flex">

          {/* Desktop sidebar */}
          <aside className="hidden lg:block w-[280px] flex-shrink-0 border-r border-[#E2DDD8] bg-surface">
            <div className="sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto px-6 py-8">
              <div className="flex items-center gap-2 mb-6">
                <SlidersHorizontal size={13} className="text-text-muted" />
                <span className="font-mono text-[10px] text-text-muted tracking-[0.12em] uppercase">
                  Filters
                </span>
              </div>
              <JobFilters />
            </div>
          </aside>

          {/* Listings */}
          <main className="flex-1 min-w-0 px-5 lg:px-8 py-8">

            {/* Sort / results bar */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#E2DDD8]">
              <p className="font-mono text-sm text-text-muted">
                <span className="text-text-primary font-semibold">{jobs.length}</span>{" "}
                roles found
              </p>

              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none font-mono text-xs bg-surface border-[1.5px] border-[#E2DDD8] rounded-[6px] pl-3 pr-8 py-1.5 text-text-primary cursor-pointer focus:border-accent focus:outline-none hover:border-accent transition-colors duration-150"
                >
                  <option value="newest">Newest</option>
                  <option value="relevant">Most Relevant</option>
                  <option value="salary">Highest Salary</option>
                </select>
                <ChevronDown
                  size={12}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
                />
              </div>
            </div>

            {/* Job cards */}
            <div className="flex flex-col gap-4 mb-10">
              {jobs.map((job) => (
                <JobListingCard
                  key={job.id}
                  job={job}
                  onApply={(j) => setApplyJob(j)}
                />
              ))}
            </div>

            {/* Pagination */}
            <nav
              className="flex items-center justify-center gap-1.5"
              aria-label="Pagination"
            >
              <PageBtn disabled aria-label="Previous page">
                <ChevronLeft size={14} />
              </PageBtn>
              <PageBtn active>1</PageBtn>
              <PageBtn>2</PageBtn>
              <PageBtn>3</PageBtn>
              <span className="font-mono text-xs text-text-muted px-1">...</span>
              <PageBtn aria-label="Next page">
                <ChevronRight size={14} />
              </PageBtn>
            </nav>
          </main>
        </div>
      </div>

      {/* Apply modal */}
      <ApplyModal
        open={applyJob !== null}
        onClose={() => setApplyJob(null)}
        job={applyJob ? { title: applyJob.title, company: applyJob.company } : null}
      />
    </>
  );
}

function PageBtn({
  children,
  active,
  disabled,
  "aria-label": ariaLabel,
}: {
  children: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
  "aria-label"?: string;
}) {
  return (
    <button
      disabled={disabled}
      aria-label={ariaLabel}
      className={cn(
        "inline-flex items-center justify-center w-8 h-8 font-mono text-xs rounded-[6px] border-[1.5px] transition-all duration-150",
        active
          ? "bg-accent border-black text-[#0D0F12] font-semibold"
          : disabled
          ? "border-[#E2DDD8] text-[#C4BFB9] cursor-not-allowed"
          : "border-[#E2DDD8] text-text-primary hover:border-accent hover:text-accent cursor-pointer"
      )}
    >
      {children}
    </button>
  );
}
