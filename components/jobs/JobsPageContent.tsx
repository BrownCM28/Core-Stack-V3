"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import {
  SlidersHorizontal,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  X,
  Search,
  MapPin,
} from "lucide-react";
import { JobFilters } from "@/components/JobFilters";
import { JobListingCard } from "@/components/jobs/JobListingCard";
import { SkeletonJobListingCard } from "@/components/ui/SkeletonCard";
import { ApplyModal } from "@/components/ApplyModal";
import { cn } from "@/lib/utils";
import type { ApiJob } from "@/lib/types";

export function JobsPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [jobs, setJobs] = useState<ApiJob[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [applyJob, setApplyJob] = useState<ApiJob | null>(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [sortBy, setSortBy] = useState(searchParams.get("sort") ?? "newest");
  const [searchInput, setSearchInput] = useState(searchParams.get("search") ?? "");
  const [locationInput, setLocationInput] = useState(searchParams.get("location") ?? "");

  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/jobs?${searchParams.toString()}`);
      const data = await res.json();
      setJobs(data.jobs ?? []);
      setTotal(data.total ?? 0);
      setTotalPages(data.totalPages ?? 1);
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  useEffect(() => { fetchJobs(); }, [fetchJobs]);

  function setPage(p: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(p));
    router.replace(`${pathname}?${params.toString()}`);
  }

  function handleSort(value: string) {
    setSortBy(value);
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", value);
    params.delete("page");
    router.replace(`${pathname}?${params.toString()}`);
  }

  function handleSearch() {
    const params = new URLSearchParams(searchParams.toString());
    const q = searchInput.trim();
    const loc = locationInput.trim();
    if (q) { params.set("search", q); } else { params.delete("search"); }
    if (loc) { params.set("location", loc); } else { params.delete("location"); }
    params.delete("page");
    router.replace(`${pathname}?${params.toString()}`);
  }

  function handleCategory(cat: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (cat === "All") {
      params.delete("category");
    } else {
      params.set("category", cat);
    }
    params.delete("page");
    router.replace(`${pathname}?${params.toString()}`);
  }

  return (
    <>
      <div className="min-h-screen bg-background">

        {/* ── Hero-style search + categories ── */}
        <div className="w-full px-6 md:px-12 py-8 border-b border-[#E0E0E0]">
          <div className="max-w-3xl">
            {/* Search bar */}
            <div className="flex items-stretch border-2 border-black bg-white w-full">
              <label htmlFor="jobs-keyword" className="sr-only">Job title or keyword</label>
              <div className="flex items-center flex-1 px-4 py-3 border-r-2 border-black">
                <Search size={16} className="text-black flex-shrink-0 mr-3" aria-hidden="true" />
                <input
                  id="jobs-keyword"
                  type="text"
                  placeholder="Job title or keyword..."
                  className="flex-1 font-mono text-sm text-black bg-transparent border-none outline-none placeholder:text-gray-400"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>
              <label htmlFor="jobs-location" className="sr-only">Location</label>
              <div className="flex items-center w-44 px-4 py-3 border-r-2 border-black">
                <MapPin size={16} className="text-black flex-shrink-0 mr-3" aria-hidden="true" />
                <input
                  id="jobs-location"
                  type="text"
                  placeholder="Location"
                  className="flex-1 font-mono text-sm text-black bg-transparent border-none outline-none placeholder:text-gray-400"
                  value={locationInput}
                  onChange={(e) => setLocationInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>
              <button
                onClick={handleSearch}
                className="bg-black text-white font-mono text-sm font-medium px-8 py-3 hover:bg-gray-900 transition-colors flex-shrink-0 cursor-pointer"
              >
                Search
              </button>
            </div>
            {/* Category filter row */}
            <div className="flex items-center gap-0 mt-3 overflow-x-auto scrollbar-hide">
              <button
                className="flex-shrink-0 bg-black text-white font-mono text-xs px-4 py-2 border-2 border-black hover:bg-gray-900 transition-colors cursor-pointer"
                onClick={() => handleCategory("All")}
              >
                All
              </button>
              {["Data Center Ops", "AI Infrastructure", "Electrical", "Cooling / HVAC", "Construction", "Networking"].map((cat) => (
                <button
                  key={cat}
                  className="flex-shrink-0 bg-white text-black font-mono text-xs px-4 py-2 border-2 border-l-0 border-black hover:bg-black hover:text-white transition-colors cursor-pointer whitespace-nowrap"
                  onClick={() => handleCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Mobile filter toggle bar ── */}
        <div className="lg:hidden sticky top-14 z-30 bg-background border-b border-[#E0E0E0] px-4 py-3 flex items-center justify-between">
          <span className="font-mono text-xs text-text-muted">
            <span className="text-text-primary font-semibold">{total}</span> roles found
          </span>
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="flex items-center gap-2 font-mono text-xs text-text-primary border-[1.5px] border-[#E0E0E0] rounded-[6px] px-3 py-1.5 hover:border-accent hover:text-accent transition-all duration-150"
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
            <aside className="relative z-10 w-[300px] bg-surface h-full overflow-y-auto p-6 border-r border-[#E0E0E0] shadow-2xl">
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
          <aside className="hidden lg:block w-[280px] flex-shrink-0 border-r border-[#E0E0E0] bg-surface">
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

            {/* Search bar */}
            <div className="flex gap-2 mb-6">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Search roles, companies, or keywords..."
                className="input-field flex-1"
              />
              <button
                onClick={handleSearch}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-accent border-[1.5px] border-black text-[#0D0F12] font-mono font-semibold text-sm rounded-[6px] hover:bg-[#34C47E] transition-all duration-150 whitespace-nowrap"
              >
                <Search size={14} />
                Search
              </button>
            </div>

            {/* Sort / results bar */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#E0E0E0]">
              <p className="font-mono text-sm text-text-muted">
                <span className="text-text-primary font-semibold">{total}</span>{" "}
                roles found
              </p>

              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => handleSort(e.target.value)}
                  className="appearance-none font-mono text-xs bg-surface border-[1.5px] border-[#E0E0E0] rounded-[6px] pl-3 pr-8 py-1.5 text-text-primary cursor-pointer focus:border-accent focus:outline-none hover:border-accent transition-colors duration-150"
                >
                  <option value="newest">Newest</option>
                  <option value="relevant">Most Relevant</option>
                </select>
                <ChevronDown
                  size={12}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
                />
              </div>
            </div>

            {/* Job cards */}
            {loading ? (
              <div className="flex flex-col gap-4 mb-10">
                {Array.from({ length: 5 }).map((_, i) => (
                  <SkeletonJobListingCard key={i} />
                ))}
              </div>
            ) : jobs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-12 h-12 rounded-full bg-[#E8E4DF] flex items-center justify-center mb-4">
                  <SlidersHorizontal size={20} className="text-text-muted" />
                </div>
                <p className="font-mono font-semibold text-sm text-text-primary mb-1">
                  No roles match your filters
                </p>
                <p className="font-sans text-sm text-text-muted mb-5">
                  Try adjusting or clearing your active filters.
                </p>
                <button
                  onClick={() => router.replace(pathname)}
                  className="inline-flex items-center gap-2 px-4 py-2 border-[1.5px] border-[#E0E0E0] rounded-[6px] font-mono text-xs text-text-primary hover:border-accent hover:text-accent transition-all duration-150"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-4 mb-10">
                {jobs.map((job) => (
                  <JobListingCard
                    key={job.id}
                    job={job}
                    onApply={(j) => setApplyJob(j)}
                  />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <nav
                className="flex items-center justify-center gap-1.5"
                aria-label="Pagination"
              >
                <PageBtn
                  disabled={page <= 1}
                  onClick={() => setPage(page - 1)}
                  aria-label="Previous page"
                >
                  <ChevronLeft size={14} />
                </PageBtn>

                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                  .reduce<(number | "...")[]>((acc, p, idx, arr) => {
                    if (idx > 0 && (p as number) - (arr[idx - 1] as number) > 1) acc.push("...");
                    acc.push(p);
                    return acc;
                  }, [])
                  .map((p, i) =>
                    p === "..." ? (
                      <span key={`ellipsis-${i}`} className="font-mono text-xs text-text-muted px-1">
                        ...
                      </span>
                    ) : (
                      <PageBtn key={p} active={p === page} onClick={() => setPage(p as number)}>
                        {p}
                      </PageBtn>
                    )
                  )}

                <PageBtn
                  disabled={page >= totalPages}
                  onClick={() => setPage(page + 1)}
                  aria-label="Next page"
                >
                  <ChevronRight size={14} />
                </PageBtn>
              </nav>
            )}
          </main>
        </div>
      </div>

      <ApplyModal
        open={applyJob !== null}
        onClose={() => setApplyJob(null)}
        job={applyJob}
      />
    </>
  );
}

function PageBtn({
  children,
  active,
  disabled,
  onClick,
  "aria-label": ariaLabel,
}: {
  children: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  "aria-label"?: string;
}) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      aria-label={ariaLabel}
      className={cn(
        "inline-flex items-center justify-center w-8 h-8 font-mono text-xs rounded-[6px] border-[1.5px] transition-all duration-150",
        active
          ? "bg-accent border-black text-[#0D0F12] font-semibold"
          : disabled
          ? "border-[#E0E0E0] text-[#C4BFB9] cursor-not-allowed"
          : "border-[#E0E0E0] text-text-primary hover:border-accent hover:text-accent cursor-pointer"
      )}
    >
      {children}
    </button>
  );
}
