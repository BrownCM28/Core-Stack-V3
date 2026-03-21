"use client";

import { useState } from "react";
import {
  Search, Plus, ChevronLeft, ChevronRight,
  ExternalLink, Eye, ShieldOff,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ADMIN_JOBS, ADMIN_APPLICATIONS } from "@/lib/mock-dashboard";

// ─── Stat card ────────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: string;
  sub?: string;
  accent?: boolean;
}) {
  return (
    <div className="bg-surface border-[1.5px] border-[#E2DDD8] rounded-[8px] p-5">
      <p className="font-mono text-[10px] text-text-muted tracking-[0.12em] uppercase mb-2">
        {label}
      </p>
      <p className={cn("font-mono font-bold text-3xl leading-tight", accent ? "text-accent" : "text-text-primary")}>
        {value}
      </p>
      {sub && <p className="font-sans text-xs text-text-muted mt-1">{sub}</p>}
    </div>
  );
}

// ─── Toggle switch ────────────────────────────────────────────────────────────

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      role="switch"
      aria-checked={checked}
      className={cn(
        "relative inline-flex h-5 w-9 items-center rounded-full border border-black transition-colors duration-200",
        checked ? "bg-accent" : "bg-[#E2DDD8]"
      )}
    >
      <span
        className={cn(
          "inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform duration-200",
          checked ? "translate-x-4" : "translate-x-0.5"
        )}
      />
    </button>
  );
}

// ─── Main ────────────────────────────────────────────────────────────────────

export function AdminContent() {
  const [search, setSearch] = useState("");
  const [activeStates, setActiveStates] = useState<Record<string, boolean>>(
    Object.fromEntries(ADMIN_JOBS.map((j) => [j.id, j.isActive]))
  );

  const filtered = ADMIN_JOBS.filter(
    (j) =>
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.company.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">

      {/* Admin header bar */}
      <div className="bg-[#0D0F12] border-b border-black px-4 sm:px-8 py-4">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-mono font-bold text-base text-white">CoreStack</span>
            <span className="font-mono text-[10px] text-[#0D0F12] bg-accent px-2 py-0.5 rounded-[3px] font-bold uppercase tracking-wide">
              Admin
            </span>
          </div>
          <p className="font-mono text-xs text-[#6B7280]">
            Signed in as <span className="text-[#9CA3AF]">admin@corestack.io</span>
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">

        {/* ── Stats row ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total Jobs" value="2,847" sub="All-time listings" />
          <StatCard label="Active Listings" value="2,156" sub="Currently live" accent />
          <StatCard label="Total Signups" value="1,204" sub="Registered engineers" />
          <StatCard label="Revenue MTD" value="$3,960" sub="March 2026" />
        </div>

        {/* ── Jobs table ── */}
        <div className="bg-surface border-[1.5px] border-[#E2DDD8] rounded-[8px] mb-6">

          {/* Table header */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 px-5 py-4 border-b border-[#E2DDD8]">
            <div className="flex items-baseline gap-2 flex-1">
              <h2 className="font-mono font-semibold text-sm text-text-primary">All Listings</h2>
              <span className="font-mono text-xs text-text-muted">{ADMIN_JOBS.length} total</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search listings…"
                  className="font-sans text-xs bg-background border-[1.5px] border-[#E2DDD8] rounded-[6px] pl-8 pr-3 py-2 text-text-primary placeholder:text-text-muted/60 focus:border-accent focus:outline-none transition-colors duration-150 w-[180px]"
                />
              </div>
              <button className="inline-flex items-center gap-1.5 px-3 py-2 bg-accent border-[1.5px] border-black text-[#0D0F12] font-mono font-semibold text-xs rounded-[6px] hover:bg-[#34C47E] transition-all duration-150 whitespace-nowrap">
                <Plus size={12} /> Add Job
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px]">
              <thead>
                <tr className="border-b border-[#E2DDD8]">
                  {["Title", "Company", "Category", "Source", "Posted", "Expires", "Status", "Actions"].map((col) => (
                    <th
                      key={col}
                      className="px-5 py-3 text-left font-mono text-[10px] text-text-muted tracking-[0.10em] uppercase"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-5 py-12 text-center">
                      <p className="font-mono text-sm text-text-muted">No listings yet</p>
                      <p className="font-sans text-xs text-text-muted mt-1">
                        {search ? `No results for "${search}"` : "Add the first job listing to get started."}
                      </p>
                    </td>
                  </tr>
                )}
                {filtered.map((job) => (
                  <tr
                    key={job.id}
                    className="border-b border-[#E2DDD8] last:border-0 hover:bg-[#FAFAF8] transition-colors duration-100"
                  >
                    <td className="px-5 py-3.5">
                      <p className="font-mono text-xs font-semibold text-text-primary leading-tight max-w-[200px] truncate">
                        {job.title}
                      </p>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="font-sans text-xs text-text-primary">{job.company}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="font-mono text-[10px] text-text-muted bg-[#F0ECE8] rounded-[3px] px-1.5 py-0.5 whitespace-nowrap">
                        {job.category}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="font-sans text-xs text-text-muted">{job.source}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="font-mono text-xs text-text-muted">{job.posted}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="font-mono text-xs text-text-muted">{job.expires}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <Toggle
                          checked={activeStates[job.id]}
                          onChange={() =>
                            setActiveStates((s) => ({ ...s, [job.id]: !s[job.id] }))
                          }
                        />
                        <span className={cn(
                          "font-mono text-[10px]",
                          activeStates[job.id] ? "text-accent" : "text-text-muted"
                        )}>
                          {activeStates[job.id] ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <a
                          href="#"
                          className="inline-flex items-center gap-1 font-mono text-[11px] text-text-muted hover:text-accent transition-colors duration-150"
                        >
                          <Eye size={11} /> View
                        </a>
                        <button className="inline-flex items-center gap-1 font-mono text-[11px] text-red-500 border border-red-200 rounded-[4px] px-1.5 py-0.5 hover:bg-red-50 transition-all duration-150">
                          <ShieldOff size={10} /> Deactivate
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-center gap-1.5 px-5 py-4 border-t border-[#E2DDD8]">
            <button
              disabled
              className="inline-flex items-center justify-center w-8 h-8 font-mono text-xs rounded-[6px] border-[1.5px] border-[#E2DDD8] text-[#C4BFB9] cursor-not-allowed"
            >
              <ChevronLeft size={14} />
            </button>
            {[1, 2, 3].map((p) => (
              <button
                key={p}
                className={cn(
                  "inline-flex items-center justify-center w-8 h-8 font-mono text-xs rounded-[6px] border-[1.5px] transition-all duration-150",
                  p === 1
                    ? "bg-accent border-black text-[#0D0F12] font-semibold"
                    : "border-[#E2DDD8] text-text-primary hover:border-accent hover:text-accent"
                )}
              >
                {p}
              </button>
            ))}
            <span className="font-mono text-xs text-text-muted px-1">…</span>
            <button className="inline-flex items-center justify-center w-8 h-8 font-mono text-xs rounded-[6px] border-[1.5px] border-[#E2DDD8] text-text-primary hover:border-accent hover:text-accent transition-all duration-150">
              <ChevronRight size={14} />
            </button>
          </div>
        </div>

        {/* ── Recent Applications ── */}
        <div className="bg-surface border-[1.5px] border-[#E2DDD8] rounded-[8px]">
          <div className="px-5 py-4 border-b border-[#E2DDD8]">
            <div className="flex items-baseline gap-2">
              <h2 className="font-mono font-semibold text-sm text-text-primary">
                Recent Applications
              </h2>
              <span className="font-mono text-xs text-text-muted">today</span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-[#E2DDD8]">
                  {["Candidate", "Applied to", "Company", "Applied at", ""].map((col, i) => (
                    <th
                      key={i}
                      className="px-5 py-3 text-left font-mono text-[10px] text-text-muted tracking-[0.10em] uppercase"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ADMIN_APPLICATIONS.map((app) => (
                  <tr
                    key={app.id}
                    className="border-b border-[#E2DDD8] last:border-0 hover:bg-[#FAFAF8] transition-colors duration-100"
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-[#E8E4DF] flex items-center justify-center font-mono font-semibold text-xs text-text-primary flex-shrink-0">
                          {app.candidateName.split(" ").map((n) => n[0]).join("")}
                        </div>
                        <div>
                          <p className="font-mono text-xs font-semibold text-text-primary leading-tight">
                            {app.candidateName}
                          </p>
                          <p className="font-mono text-[10px] text-text-muted">
                            @{app.candidateUsername}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="font-sans text-xs text-text-primary max-w-[180px] truncate">
                        {app.jobTitle}
                      </p>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="font-sans text-xs text-text-muted">{app.company}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="font-mono text-xs text-text-muted">{app.appliedAt}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <a
                        href={`/profile/${app.candidateUsername}`}
                        className="inline-flex items-center gap-1 font-mono text-[11px] text-text-muted hover:text-accent transition-colors duration-150"
                      >
                        View Profile <ExternalLink size={10} />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
