"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Search, Plus, ChevronLeft, ChevronRight,
  ExternalLink, Eye, ShieldOff, ShieldCheck, RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

interface AdminStats {
  totalJobs: number;
  activeJobs: number;
  totalUsers: number;
  totalApplications: number;
  revenueMTD: number;
}

interface AdminJob {
  id: string;
  title: string;
  company: string;
  category: string;
  source: string;
  isActive: boolean;
  featured: boolean;
  paymentStatus: string;
  postedAt: string;
  expiresAt: string | null;
  _count: { applications: number };
}

interface AdminApplication {
  id: string;
  appliedAt: string;
  status: string;
  user: {
    name: string;
    profile: { username: string } | null;
  };
  job: { title: string; company: string };
}

// ─── Stat card ────────────────────────────────────────────────────────────────

function StatCard({
  label, value, sub, accent,
}: {
  label: string; value: string; sub?: string; accent?: boolean;
}) {
  return (
    <div className="bg-surface border-[1.5px] border-[#E0E0E0] rounded-[8px] p-5">
      <p className="font-mono text-[10px] text-text-muted tracking-[0.12em] uppercase mb-2">{label}</p>
      <p className={cn("font-mono font-bold text-3xl leading-tight", accent ? "text-accent" : "text-text-primary")}>
        {value}
      </p>
      {sub && <p className="font-sans text-xs text-text-muted mt-1">{sub}</p>}
    </div>
  );
}

// ─── Toggle switch ────────────────────────────────────────────────────────────

function Toggle({ checked, onChange, disabled }: { checked: boolean; onChange: () => void; disabled?: boolean }) {
  return (
    <button
      onClick={onChange}
      disabled={disabled}
      role="switch"
      aria-checked={checked}
      className={cn(
        "relative inline-flex h-5 w-9 items-center rounded-full border border-black transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed",
        checked ? "bg-accent" : "bg-[#E0E0E0]"
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
  const router = useRouter();
  const searchParams = useSearchParams();

  const [stats, setStats] = useState<AdminStats | null>(null);
  const [jobs, setJobs] = useState<AdminJob[]>([]);
  const [jobsTotal, setJobsTotal] = useState(0);
  const [jobsTotalPages, setJobsTotalPages] = useState(1);
  const [applications, setApplications] = useState<AdminApplication[]>([]);

  const [searchInput, setSearchInput] = useState(searchParams.get("search") ?? "");
  const [page, setPage] = useState(Number(searchParams.get("page") ?? "1"));
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<string | null>(null);

  // Fetch stats once
  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then(setStats)
      .catch(() => {});
  }, []);

  // Fetch applications once
  useEffect(() => {
    fetch("/api/admin/applications")
      .then((r) => r.json())
      .then((d) => setApplications(d.applications ?? []))
      .catch(() => {});
  }, []);

  // Fetch jobs when page/search changes
  const fetchJobs = useCallback((p: number, s: string) => {
    const params = new URLSearchParams();
    params.set("page", String(p));
    if (s) params.set("search", s);
    fetch(`/api/admin/jobs?${params}`)
      .then((r) => r.json())
      .then((d) => {
        setJobs(d.jobs ?? []);
        setJobsTotal(d.total ?? 0);
        setJobsTotalPages(d.totalPages ?? 1);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetchJobs(page, searchParams.get("search") ?? "");
  }, [page, fetchJobs, searchParams]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (searchInput) params.set("search", searchInput);
    else params.delete("search");
    params.set("page", "1");
    setPage(1);
    router.replace(`/admin?${params}`);
    fetchJobs(1, searchInput);
  }

  async function toggleActive(job: AdminJob) {
    setTogglingId(job.id);
    try {
      const res = await fetch(`/api/admin/jobs/${job.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !job.isActive }),
      });
      if (res.ok) {
        const updated = await res.json();
        setJobs((prev) => prev.map((j) => (j.id === updated.id ? { ...j, isActive: updated.isActive } : j)));
      }
    } finally {
      setTogglingId(null);
    }
  }

  async function handleSync() {
    setSyncing(true);
    setSyncResult(null);
    try {
      const res = await fetch("/api/admin/sync-theirstack", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        setSyncResult(`Done — fetched ${data.fetched}, inserted ${data.inserted}, skipped ${data.skipped}`);
        // Refresh jobs table and stats
        fetchJobs(page, searchParams.get("search") ?? "");
        fetch("/api/admin/stats").then((r) => r.json()).then(setStats).catch(() => {});
      } else {
        setSyncResult(`Error: ${data.error ?? "unknown"}`);
      }
    } catch {
      setSyncResult("Network error — check console");
    } finally {
      setSyncing(false);
    }
  }

  const currentSearch = searchParams.get("search") ?? "";

  function fmt(iso: string) {
    return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }

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
          <div className="flex items-center gap-3">
            {syncResult && (
              <span className={cn(
                "font-mono text-[11px]",
                syncResult.startsWith("Error") ? "text-red-400" : "text-accent"
              )}>
                {syncResult}
              </span>
            )}
            <button
              onClick={handleSync}
              disabled={syncing}
              className="inline-flex items-center gap-1.5 px-3 py-2 border-[1.5px] border-white/20 text-white font-mono font-semibold text-xs rounded-[6px] hover:border-accent hover:text-accent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw size={12} className={syncing ? "animate-spin" : ""} />
              {syncing ? "Syncing…" : "Sync Theirstack"}
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">

        {/* ── Stats row ── */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <StatCard label="Total Jobs" value={stats ? String(stats.totalJobs) : "—"} sub="All-time listings" />
          <StatCard label="Active Listings" value={stats ? String(stats.activeJobs) : "—"} sub="Currently live" accent />
          <StatCard label="Total Signups" value={stats ? String(stats.totalUsers) : "—"} sub="Registered users" />
          <StatCard label="Applications" value={stats ? String(stats.totalApplications) : "—"} sub="All-time" />
          <StatCard
            label="Revenue MTD"
            value={stats ? `$${stats.revenueMTD.toLocaleString()}` : "—"}
            sub={new Date().toLocaleString("en-US", { month: "long", year: "numeric" })}
            accent
          />
        </div>

        {/* ── Jobs table ── */}
        <div className="bg-surface border-[1.5px] border-[#E0E0E0] rounded-[8px] mb-6">

          {/* Table header */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 px-5 py-4 border-b border-[#E0E0E0]">
            <div className="flex items-baseline gap-2 flex-1">
              <h2 className="font-mono font-semibold text-sm text-text-primary">All Listings</h2>
              <span className="font-mono text-xs text-text-muted">{jobsTotal} total</span>
            </div>
            <form onSubmit={handleSearch} className="flex items-center gap-3">
              <div className="relative">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search listings…"
                  className="font-sans text-xs bg-background border-[1.5px] border-[#E0E0E0] rounded-[6px] pl-8 pr-3 py-2 text-text-primary placeholder:text-text-muted/60 focus:border-accent focus:outline-none transition-colors duration-150 w-[180px]"
                />
              </div>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-accent border-[1.5px] border-black text-[#0D0F12] font-mono font-semibold text-xs rounded-[6px] hover:bg-[#34C47E] transition-all duration-150 whitespace-nowrap"
              >
                Search
              </button>
              <button
                type="button"
                onClick={() => router.push("/employers/post")}
                className="inline-flex items-center gap-1.5 px-3 py-2 border-[1.5px] border-[#E0E0E0] text-text-primary font-mono font-semibold text-xs rounded-[6px] hover:border-accent hover:text-accent transition-all duration-150 whitespace-nowrap"
              >
                <Plus size={12} /> Add Job
              </button>
            </form>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px]">
              <thead>
                <tr className="border-b border-[#E0E0E0]">
                  {["Title", "Company", "Category", "Source", "Apps", "Posted", "Expires", "Status", "Actions"].map((col) => (
                    <th key={col} className="px-5 py-3 text-left font-mono text-[10px] text-text-muted tracking-[0.10em] uppercase">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {jobs.length === 0 && (
                  <tr>
                    <td colSpan={9} className="px-5 py-12 text-center">
                      <p className="font-mono text-sm text-text-muted">
                        {currentSearch ? `No results for "${currentSearch}"` : "No listings yet"}
                      </p>
                    </td>
                  </tr>
                )}
                {jobs.map((job) => (
                  <tr key={job.id} className="border-b border-[#E0E0E0] last:border-0 hover:bg-[#FAFAF8] transition-colors duration-100">
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
                      <p className="font-mono text-xs text-text-muted">{job._count.applications}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="font-mono text-xs text-text-muted">{fmt(job.postedAt)}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="font-mono text-xs text-text-muted">
                        {job.expiresAt ? fmt(job.expiresAt) : "—"}
                      </p>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <Toggle
                          checked={job.isActive}
                          disabled={togglingId === job.id}
                          onChange={() => toggleActive(job)}
                        />
                        <span className={cn("font-mono text-[10px]", job.isActive ? "text-accent" : "text-text-muted")}>
                          {job.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <a
                          href={`/jobs/${job.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 font-mono text-[11px] text-text-muted hover:text-accent transition-colors duration-150"
                        >
                          <Eye size={11} /> View
                        </a>
                        <button
                          onClick={() => toggleActive(job)}
                          disabled={togglingId === job.id}
                          className={cn(
                            "inline-flex items-center gap-1 font-mono text-[11px] rounded-[4px] px-1.5 py-0.5 transition-all duration-150 disabled:opacity-40",
                            job.isActive
                              ? "text-red-500 border border-red-200 hover:bg-red-50"
                              : "text-accent border border-accent/30 hover:bg-accent/10"
                          )}
                        >
                          {job.isActive ? <><ShieldOff size={10} /> Deactivate</> : <><ShieldCheck size={10} /> Activate</>}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {jobsTotalPages > 1 && (
            <div className="flex items-center justify-center gap-1.5 px-5 py-4 border-t border-[#E0E0E0]">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="inline-flex items-center justify-center w-8 h-8 font-mono text-xs rounded-[6px] border-[1.5px] border-[#E0E0E0] text-text-muted disabled:text-[#C4BFB9] disabled:cursor-not-allowed hover:border-accent hover:text-accent transition-all"
              >
                <ChevronLeft size={14} />
              </button>
              {Array.from({ length: Math.min(jobsTotalPages, 5) }, (_, i) => {
                const p = i + 1;
                return (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={cn(
                      "inline-flex items-center justify-center w-8 h-8 font-mono text-xs rounded-[6px] border-[1.5px] transition-all duration-150",
                      page === p
                        ? "bg-accent border-black text-[#0D0F12] font-semibold"
                        : "border-[#E0E0E0] text-text-primary hover:border-accent hover:text-accent"
                    )}
                  >
                    {p}
                  </button>
                );
              })}
              {jobsTotalPages > 5 && <span className="font-mono text-xs text-text-muted px-1">…</span>}
              <button
                disabled={page >= jobsTotalPages}
                onClick={() => setPage((p) => p + 1)}
                className="inline-flex items-center justify-center w-8 h-8 font-mono text-xs rounded-[6px] border-[1.5px] border-[#E0E0E0] text-text-muted disabled:text-[#C4BFB9] disabled:cursor-not-allowed hover:border-accent hover:text-accent transition-all"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          )}
        </div>

        {/* ── Recent Applications ── */}
        <div className="bg-surface border-[1.5px] border-[#E0E0E0] rounded-[8px]">
          <div className="px-5 py-4 border-b border-[#E0E0E0]">
            <div className="flex items-baseline gap-2">
              <h2 className="font-mono font-semibold text-sm text-text-primary">Recent Applications</h2>
              <span className="font-mono text-xs text-text-muted">last 20</span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-[#E0E0E0]">
                  {["Candidate", "Applied to", "Company", "Applied at", ""].map((col, i) => (
                    <th key={i} className="px-5 py-3 text-left font-mono text-[10px] text-text-muted tracking-[0.10em] uppercase">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {applications.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-5 py-10 text-center">
                      <p className="font-mono text-sm text-text-muted">No applications yet</p>
                    </td>
                  </tr>
                )}
                {applications.map((app) => {
                  const initials = app.user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2);
                  const username = app.user.profile?.username;
                  return (
                    <tr key={app.id} className="border-b border-[#E0E0E0] last:border-0 hover:bg-[#FAFAF8] transition-colors duration-100">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-[#E8E4DF] flex items-center justify-center font-mono font-semibold text-xs text-text-primary flex-shrink-0">
                            {initials}
                          </div>
                          <div>
                            <p className="font-mono text-xs font-semibold text-text-primary leading-tight">
                              {app.user.name}
                            </p>
                            {username && (
                              <p className="font-mono text-[10px] text-text-muted">@{username}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <p className="font-sans text-xs text-text-primary max-w-[180px] truncate">
                          {app.job.title}
                        </p>
                      </td>
                      <td className="px-5 py-3.5">
                        <p className="font-sans text-xs text-text-muted">{app.job.company}</p>
                      </td>
                      <td className="px-5 py-3.5">
                        <p className="font-mono text-xs text-text-muted">
                          {new Date(app.appliedAt).toLocaleString("en-US", {
                            month: "short", day: "numeric", year: "numeric",
                            hour: "2-digit", minute: "2-digit",
                          })}
                        </p>
                      </td>
                      <td className="px-5 py-3.5">
                        {username ? (
                          <a
                            href={`/profile/${username}`}
                            className="inline-flex items-center gap-1 font-mono text-[11px] text-text-muted hover:text-accent transition-colors duration-150"
                          >
                            View Profile <ExternalLink size={10} />
                          </a>
                        ) : (
                          <span className="font-mono text-[11px] text-text-muted/40">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
