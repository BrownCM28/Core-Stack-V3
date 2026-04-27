"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import {
  Search,
  MapPin,
  ChevronDown,
  ChevronRight,
  X,
  SlidersHorizontal,
  Check,
} from "lucide-react";
import { JobListingCard } from "@/components/jobs/JobListingCard";
import { SkeletonJobListingCard } from "@/components/ui/SkeletonCard";
import { ApplyModal } from "@/components/ApplyModal";
import { cn } from "@/lib/utils";
import type { ApiJob } from "@/lib/types";

const CATEGORIES = [
  "All",
  "Data Center Ops",
  "AI Infrastructure",
  "Electrical",
  "Cooling / HVAC",
  "Construction",
  "Networking",
];

const EXPERIENCE_LEVELS = [
  { label: "Entry level", value: "entry", count: 1028 },
  { label: "Intermediate", value: "intermediate", count: 902 },
  { label: "Expert", value: "expert", count: 106 },
];

const JOB_TYPES = [
  { label: "Full-time job", value: "full-time", count: 620 },
  { label: "Part-time job", value: "part-time", count: 232 },
  { label: "Remote", value: "remote", count: 1872 },
  { label: "Freelance", value: "freelance", count: 1121 },
];

function FilterCheckbox({
  label,
  count,
  checked,
  onChange,
}: {
  label: string;
  count: number;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <div className="flex items-center justify-between py-1.5 cursor-pointer" onClick={onChange}>
      <div className="flex items-center gap-2.5">
        <div
          className={cn(
            "w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors",
            checked ? "bg-[#3ECF8E] border-[#3ECF8E]" : "border-[#E5E5E5] bg-white"
          )}
        >
          {checked && <Check size={10} className="text-white" strokeWidth={3} />}
        </div>
        <span className="font-sans text-sm text-gray-700">{label}</span>
      </div>
      <span className="font-mono text-xs text-gray-400">[{count.toLocaleString()}]</span>
    </div>
  );
}

export function JobsPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Remote data
  const [jobs, setJobs] = useState<ApiJob[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [applyJob, setApplyJob] = useState<ApiJob | null>(null);

  // UI state
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [sortBy, setSortBy] = useState(searchParams.get("sort") ?? "newest");
  const [searchInput, setSearchInput] = useState(searchParams.get("search") ?? "");
  const [locationInput, setLocationInput] = useState(searchParams.get("location") ?? "");

  // Sidebar filter state
  const [sidebarCategory, setSidebarCategory] = useState(searchParams.get("category") ?? "");
  const [experienceLevels, setExperienceLevels] = useState<string[]>(["intermediate"]);
  const [jobTypes, setJobTypes] = useState<string[]>(["freelance"]);
  const [salaryInput, setSalaryInput] = useState("");

  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
  const activeCategory = searchParams.get("category") ?? "";

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

  function pushParams(updates: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [k, v] of Object.entries(updates)) {
      if (v === null || v === "") params.delete(k); else params.set(k, v);
    }
    params.delete("page");
    router.replace(`${pathname}?${params.toString()}`);
  }

  function handleSearch() {
    pushParams({
      search: searchInput.trim() || null,
      location: locationInput.trim() || null,
    });
  }

  function handleCategoryPill(cat: string) {
    pushParams({ category: cat === "All" ? null : cat });
  }

  function handleSort(value: string) {
    setSortBy(value);
    pushParams({ sort: value });
  }

  function handleApplyFilters() {
    const params = new URLSearchParams();
    if (searchInput.trim()) params.set("search", searchInput.trim());
    if (sidebarCategory) params.set("category", sidebarCategory);
    if (sortBy !== "newest") params.set("sort", sortBy);
    router.push(`${pathname}?${params.toString()}`);
    setMobileFiltersOpen(false);
  }

  function handleReset() {
    setSidebarCategory("");
    setExperienceLevels([]);
    setJobTypes([]);
    setSalaryInput("");
    setSearchInput("");
    setLocationInput("");
    setSortBy("newest");
    router.push(pathname);
  }

  function setPage(p: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(p));
    router.replace(`${pathname}?${params.toString()}`);
  }

  function toggleExperience(val: string) {
    setExperienceLevels((prev) =>
      prev.includes(val) ? prev.filter((v) => v !== val) : [...prev, val]
    );
  }

  function toggleJobType(val: string) {
    setJobTypes((prev) =>
      prev.includes(val) ? prev.filter((v) => v !== val) : [...prev, val]
    );
  }

  const filterSidebar = (
    <div className="bg-white border border-[#E5E5E5] rounded-xl p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <span className="font-display text-lg font-normal text-black">Filter</span>
        <button
          onClick={handleReset}
          className="font-mono text-xs text-[#3ECF8E] hover:underline cursor-pointer"
        >
          Reset
        </button>
      </div>

      {/* Categories */}
      <p className="font-mono text-xs uppercase tracking-widest text-gray-400 mb-3">
        Categories
      </p>
      <div className="relative">
        <select
          value={sidebarCategory}
          onChange={(e) => setSidebarCategory(e.target.value)}
          className="w-full border border-[#E5E5E5] rounded-lg font-mono text-sm text-gray-600 px-3 py-2.5 bg-white appearance-none cursor-pointer focus:outline-none focus:border-[#3ECF8E] transition-colors pr-8"
        >
          <option value="" disabled>Select categories</option>
          <option value="Data Center Ops">Data Center Ops</option>
          <option value="AI Infrastructure">AI Infrastructure</option>
          <option value="Electrical">Electrical</option>
          <option value="Cooling / HVAC">Cooling / HVAC</option>
          <option value="Construction">Construction</option>
          <option value="Networking">Networking</option>
          <option value="Project Management">Project Management</option>
        </select>
        <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
      </div>

      {/* Experience level */}
      <p className="font-mono text-xs uppercase tracking-widest text-gray-400 mt-5 mb-3">
        Experience level
      </p>
      {EXPERIENCE_LEVELS.map((item) => (
        <FilterCheckbox
          key={item.value}
          label={item.label}
          count={item.count}
          checked={experienceLevels.includes(item.value)}
          onChange={() => toggleExperience(item.value)}
        />
      ))}

      {/* Job type */}
      <p className="font-mono text-xs uppercase tracking-widest text-gray-400 mt-5 mb-3">
        Job type
      </p>
      {JOB_TYPES.map((item) => (
        <FilterCheckbox
          key={item.value}
          label={item.label}
          count={item.count}
          checked={jobTypes.includes(item.value)}
          onChange={() => toggleJobType(item.value)}
        />
      ))}

      {/* Salary range */}
      <p className="font-mono text-xs uppercase tracking-widest text-gray-400 mt-5 mb-3">
        Price range
      </p>
      <input
        type="text"
        value={salaryInput}
        onChange={(e) => setSalaryInput(e.target.value)}
        placeholder="Enter fixed price"
        className="w-full border border-[#E5E5E5] rounded-lg font-mono text-sm text-gray-500 px-3 py-2.5 bg-white focus:outline-none focus:border-[#3ECF8E] transition-colors"
      />

      {/* Apply */}
      <button
        onClick={handleApplyFilters}
        className="w-full bg-black text-white font-mono text-xs py-3 rounded-lg mt-5 hover:bg-gray-900 transition-colors cursor-pointer"
      >
        Apply Filters
      </button>
    </div>
  );

  return (
    <>
      <div className="min-h-screen bg-white">

        {/* ── Section 1: Page header + search ── */}
        <div className="w-full border-b border-[#E5E5E5] px-4 md:px-8 py-10 bg-white">
          <div className="max-w-6xl mx-auto flex flex-col items-center">

            {/* Stats pill */}
            <div className="bg-white border border-[#E5E5E5] rounded-full px-4 py-1.5 inline-flex items-center gap-2 mb-5">
              <span className="w-2 h-2 rounded-full bg-[#3ECF8E] flex-shrink-0" />
              <span className="font-mono text-xs text-gray-500">
                {total > 0 ? total.toLocaleString() : "2,847"} Active Roles
              </span>
              <span className="text-gray-300 text-xs">|</span>
              <span className="font-mono text-xs text-gray-500">Updated daily</span>
            </div>

            {/* Headline */}
            <h1 className="font-display text-4xl md:text-5xl font-normal text-black text-center mb-1 leading-tight">
              Find The Best
            </h1>
            <h2 className="font-display text-4xl md:text-5xl font-normal text-[#3ECF8E] text-center mb-4 leading-tight">
              Infrastructure Jobs<span className="cursor-blink">|</span>
            </h2>

            {/* Subtitle */}
            <p className="font-sans text-sm text-gray-500 text-center mb-2 max-w-lg leading-relaxed">
              Data center construction, operations, and AI infrastructure roles — aggregated daily from top employers worldwide.
            </p>
            <p className="font-mono text-xs text-gray-400 text-center mb-6">
              Search, filter and apply to your next role
            </p>

            {/* Two-field search bar */}
            <div className="flex items-stretch border-2 border-black bg-white w-full max-w-2xl">
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

            {/* Connected category buttons */}
            <div className="flex items-center gap-0 mt-4 overflow-x-auto scrollbar-hide max-w-2xl w-full">
              {CATEGORIES.map((cat, i) => {
                const isActive = cat === "All" ? activeCategory === "" : activeCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => handleCategoryPill(cat)}
                    className={cn(
                      "flex-shrink-0 font-mono text-xs px-4 py-2 border-2 border-black cursor-pointer transition-colors whitespace-nowrap",
                      i > 0 && "border-l-0",
                      isActive
                        ? "bg-black text-white"
                        : "bg-white text-black hover:bg-black hover:text-white"
                    )}
                  >
                    {cat}
                  </button>
                );
              })}
              <button
                className="flex-shrink-0 bg-white text-black font-mono text-xs px-3 py-2 border-2 border-l-0 border-black hover:bg-black hover:text-white transition-colors cursor-pointer"
                onClick={() => router.push("/jobs")}
                aria-label="More categories"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* ── Section 2: Results bar ── */}
        <div className="w-full border-b border-[#E5E5E5] px-4 md:px-8 py-3 bg-white">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <p className="font-mono text-sm text-gray-500">
              <span className="text-black font-semibold">{total}</span> roles found
            </p>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => handleSort(e.target.value)}
                className="border border-[#E5E5E5] rounded font-mono text-xs text-gray-600 pl-3 pr-8 py-1.5 bg-white appearance-none cursor-pointer focus:outline-none focus:border-[#3ECF8E] transition-colors"
              >
                <option value="newest">Newest</option>
                <option value="relevant">Most Relevant</option>
                <option value="salary">Salary: High</option>
              </select>
              <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* ── Mobile filter bar ── */}
        <div className="lg:hidden sticky top-[88px] z-30 bg-white border-b border-[#E5E5E5] px-4 py-3 flex items-center justify-between">
          <span className="font-mono text-xs text-gray-500">
            <span className="text-black font-semibold">{total}</span> roles
          </span>
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="flex items-center gap-2 font-mono text-xs text-black border border-[#E5E5E5] rounded-lg px-3 py-1.5 hover:border-[#3ECF8E] hover:text-[#3ECF8E] transition-all"
          >
            <SlidersHorizontal size={13} />
            Filter
          </button>
        </div>

        {/* ── Mobile filter drawer ── */}
        {mobileFiltersOpen && (
          <div className="lg:hidden fixed inset-0 z-40 flex">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMobileFiltersOpen(false)} />
            <aside className="relative z-10 w-[300px] bg-white h-full overflow-y-auto p-5 shadow-2xl">
              <div className="flex items-center justify-between mb-5">
                <span className="font-display text-lg text-black">Filter</span>
                <button onClick={() => setMobileFiltersOpen(false)} className="text-gray-400 hover:text-black p-1">
                  <X size={18} />
                </button>
              </div>
              {filterSidebar}
            </aside>
          </div>
        )}

        {/* ── Section 3: Two-column layout ── */}
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-6">
          <div className="flex gap-6">

            {/* Left — job cards */}
            <div className="flex-1 min-w-0">
              {loading ? (
                <div className="flex flex-col gap-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <SkeletonJobListingCard key={i} />
                  ))}
                </div>
              ) : jobs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <p className="font-display text-2xl text-gray-300 mb-2">No roles found.</p>
                  <p className="font-sans text-sm text-gray-400 mb-6">
                    Try adjusting your filters or search terms.
                  </p>
                  <button
                    onClick={() => router.push("/jobs")}
                    className="font-mono text-xs text-black border border-[#E5E5E5] rounded-lg px-4 py-2 hover:border-black transition-colors"
                  >
                    Clear all filters
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-3 mb-6">
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
                <nav className="flex items-center justify-center gap-2 mt-6" aria-label="Pagination">
                  <button
                    disabled={page <= 1}
                    onClick={() => setPage(page - 1)}
                    className="border border-[#E5E5E5] font-mono text-xs px-4 py-2 rounded text-gray-500 hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 2)
                    .reduce<(number | "...")[]>((acc, p, idx, arr) => {
                      if (idx > 0 && (p as number) - (arr[idx - 1] as number) > 1) acc.push("...");
                      acc.push(p);
                      return acc;
                    }, [])
                    .map((p, i) =>
                      p === "..." ? (
                        <span key={`ellipsis-${i}`} className="font-mono text-xs text-gray-400 px-2">...</span>
                      ) : (
                        <button
                          key={p}
                          onClick={() => setPage(p as number)}
                          className={cn(
                            "w-8 h-8 rounded flex items-center justify-center font-mono text-xs transition-colors",
                            p === page
                              ? "bg-black text-white"
                              : "border border-[#E5E5E5] text-gray-500 hover:bg-gray-50"
                          )}
                        >
                          {p}
                        </button>
                      )
                    )}

                  <button
                    disabled={page >= totalPages}
                    onClick={() => setPage(page + 1)}
                    className="border border-[#E5E5E5] font-mono text-xs px-4 py-2 rounded text-gray-500 hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </nav>
              )}
            </div>

            {/* Right — filter sidebar (desktop) */}
            <aside className="hidden lg:block w-[220px] flex-shrink-0 sticky top-[88px] self-start">
              {filterSidebar}
            </aside>
          </div>
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
