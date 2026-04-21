"use client";

import { useState, useEffect } from "react";
import {
  FileText, Bell, Award, Briefcase, Settings,
  Plus, Trash2, ArrowRight, Github, MapPin,
  RefreshCw, AlertTriangle, X, Loader2, CheckCircle,
} from "lucide-react";
import { CertificationBadge } from "@/components/CertificationBadge";
import type { DbCertification } from "@/components/CertificationBadge";
import { AddCertificationModal } from "@/components/AddCertificationModal";
import { cn } from "@/lib/utils";
import { useSession } from "@/lib/auth-client";

// ─── Types ────────────────────────────────────────────────────────────────────

interface AppJob {
  id: string;
  title: string;
  company: string;
  companyLogo: string | null;
  location: string;
  isActive: boolean;
}

interface UserApplication {
  id: string;
  status: "SUBMITTED" | "VIEWED" | "SHORTLISTED" | "REJECTED" | "WITHDRAWN";
  appliedAt: string;
  job: AppJob;
}

type AppDisplayStatus = "Applied" | "Viewed" | "Shortlisted" | "Rejected" | "Withdrawn";

function mapStatus(s: UserApplication["status"]): AppDisplayStatus {
  const map: Record<UserApplication["status"], AppDisplayStatus> = {
    SUBMITTED: "Applied",
    VIEWED: "Viewed",
    SHORTLISTED: "Shortlisted",
    REJECTED: "Rejected",
    WITHDRAWN: "Withdrawn",
  };
  return map[s];
}

interface SidebarProfile {
  id: string;
  name: string;
  email: string;
  displayName: string | null;
  title: string | null;
  bio: string | null;
  location: string | null;
  openToWork: boolean;
  openToTypes: string[];
  username: string | null;
  profile: { avatarUrl: string | null; bio: string | null } | null;
}

// ─── Shared primitives ────────────────────────────────────────────────────────

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      role="switch"
      aria-checked={checked}
      className={cn(
        "relative inline-flex h-5 w-9 items-center rounded-full border border-black transition-colors duration-200 flex-shrink-0",
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

function SectionCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("bg-white border border-[#E2DDD8] rounded-lg p-6", className)}>
      {children}
    </div>
  );
}

function SectionHeader({
  title,
  count,
  action,
}: {
  title: string;
  count?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between mb-5">
      <div className="flex items-baseline gap-2">
        <h2 className="font-display font-semibold text-base text-text-primary">{title}</h2>
        {count && <span className="font-mono text-xs text-text-muted">{count}</span>}
      </div>
      {action}
    </div>
  );
}

function WireButton({
  onClick,
  children,
  className,
  disabled,
}: {
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1.5 font-mono text-xs border-[1.5px] border-[#E2DDD8] rounded-[6px] text-text-primary hover:border-accent hover:text-accent transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
    >
      {children}
    </button>
  );
}

// ─── Status pill ──────────────────────────────────────────────────────────────

function StatusPill({ status }: { status: AppDisplayStatus }) {
  const styles: Record<AppDisplayStatus, string> = {
    Applied: "bg-[#E8E4DF] text-text-muted",
    Viewed: "bg-[#DBEAFE] text-[#1D4ED8]",
    Shortlisted: "bg-[#DCFCE7] text-[#166534]",
    Rejected: "bg-[#FEE2E2] text-[#991B1B]",
    Withdrawn: "bg-[#F3F4F6] text-[#6B7280]",
  };
  return (
    <span className={cn("inline-block font-mono text-[11px] font-semibold px-2 py-0.5 rounded-[4px]", styles[status])}>
      {status}
    </span>
  );
}

// ─── Alert types ──────────────────────────────────────────────────────────────

interface ApiAlert {
  id: string;
  name: string;
  filterSummary: string;
  frequency: string;
  active: boolean;
}

// ─── Alert frequency pill ─────────────────────────────────────────────────────

function FreqPill({ freq }: { freq: string }) {
  return (
    <span className="inline-block font-mono text-[10px] text-text-muted bg-[#F0ECE8] rounded-[4px] px-2 py-0.5">
      {freq}
    </span>
  );
}

// ─── Add Alert modal ──────────────────────────────────────────────────────────

function AddAlertModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="relative w-full max-w-[400px] bg-surface border-[1.5px] border-black rounded-[8px] shadow-2xl pointer-events-auto animate-modal-in"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between px-6 py-5 border-b border-[#E2DDD8]">
            <h2 className="font-mono font-semibold text-base text-text-primary">Add Job Alert</h2>
            <button onClick={onClose} className="text-text-muted hover:text-accent transition-colors p-1">
              <X size={18} />
            </button>
          </div>
          <div className="px-6 py-5 flex flex-col gap-4">
            <div>
              <label className="block font-mono text-xs text-text-muted mb-1.5">Alert Name</label>
              <input
                type="text"
                placeholder="e.g. AI Infra Remote"
                className="w-full font-sans text-sm bg-background border-[1.5px] border-[#E2DDD8] rounded-[6px] px-3 py-2.5 text-text-primary placeholder:text-text-muted/60 focus:border-accent focus:outline-none transition-colors duration-150"
              />
            </div>
            <div>
              <label className="block font-mono text-xs text-text-muted mb-1.5">Frequency</label>
              <div className="relative">
                <select className="w-full font-sans text-sm bg-background border-[1.5px] border-[#E2DDD8] rounded-[6px] px-3 py-2.5 text-text-primary focus:border-accent focus:outline-none transition-colors duration-150 appearance-none cursor-pointer">
                  <option>Instant</option>
                  <option>Daily Digest</option>
                  <option>Weekly Digest</option>
                </select>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between px-6 py-5 border-t border-[#E2DDD8]">
            <button onClick={onClose} className="font-mono text-sm text-text-muted hover:text-accent transition-colors">
              Cancel
            </button>
            <button className="px-5 py-2.5 bg-accent border-[1.5px] border-black text-[#0D0F12] font-mono font-semibold text-sm rounded-[6px] hover:bg-[#34C47E] hover:shadow-[0_0_16px_rgba(62,207,142,0.25)] transition-all duration-150">
              Save Alert
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Tab definitions ──────────────────────────────────────────────────────────

const TABS = [
  { id: "applications", label: "Applications", icon: FileText },
  { id: "certifications", label: "Certifications", icon: Award },
  { id: "otw", label: "Open to Work", icon: Briefcase },
  { id: "alerts", label: "Alerts", icon: Bell },
  { id: "settings", label: "Settings", icon: Settings },
] as const;

type TabId = (typeof TABS)[number]["id"];

// ─── Applications tab ─────────────────────────────────────────────────────────

function ApplicationsTab() {
  const [apps, setApps] = useState<UserApplication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/applications")
      .then((r) => r.json())
      .then((data) => setApps(Array.isArray(data) ? data : []))
      .catch(() => setApps([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <SectionCard>
      <SectionHeader
        title="Your Applications"
        count={loading ? undefined : `${apps.length} application${apps.length !== 1 ? "s" : ""}`}
      />
      {loading ? (
        <div className="flex justify-center py-10">
          <Loader2 size={20} className="animate-spin text-text-muted" />
        </div>
      ) : apps.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-14 text-center">
          <div className="w-12 h-12 rounded-full bg-[#E8E4DF] flex items-center justify-center mb-4">
            <FileText size={20} className="text-text-muted" />
          </div>
          <p className="font-mono font-semibold text-sm text-text-primary mb-1">
            No applications yet
          </p>
          <p className="font-sans text-sm text-text-muted mb-5 max-w-xs">
            Browse open roles and start applying — your applications will appear here.
          </p>
          <a
            href="/jobs"
            className="inline-flex items-center gap-2 px-4 py-2 bg-accent border-[1.5px] border-black text-[#0D0F12] font-mono font-semibold text-xs rounded-[6px] hover:bg-[#34C47E] transition-all duration-150"
          >
            Browse open roles
          </a>
        </div>
      ) : (
        <div className="flex flex-col divide-y divide-[#E2DDD8]">
          {apps.map((app) => (
            <div
              key={app.id}
              className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 py-4 first:pt-0 last:pb-0"
            >
              <div className="flex-shrink-0 w-9 h-9 rounded-[6px] bg-[#1E2128] border border-[#2A2D35] flex items-center justify-center font-mono font-bold text-sm text-[#4B5563]">
                {app.job.company[0]}
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-mono font-semibold text-sm text-text-primary leading-tight truncate">
                  {app.job.title}
                </p>
                <p className="font-sans text-xs text-text-muted">
                  {app.job.company} · {app.job.location}
                </p>
              </div>

              <span className="font-mono text-xs text-text-muted whitespace-nowrap">
                {new Date(app.appliedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </span>

              <StatusPill status={mapStatus(app.status)} />

              <a href={`/jobs/${app.job.id}`}>
                <WireButton>
                  View listing <ArrowRight size={11} />
                </WireButton>
              </a>
            </div>
          ))}
        </div>
      )}
    </SectionCard>
  );
}

// ─── Alerts tab ───────────────────────────────────────────────────────────────

function AlertsTab() {
  const [alerts, setAlerts] = useState<ApiAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [alertOpen, setAlertOpen] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/alerts")
      .then((r) => r.json())
      .then((data) => setAlerts(Array.isArray(data) ? data : []))
      .catch(() => setAlerts([]))
      .finally(() => setLoading(false));
  }, []);

  async function handleToggle(id: string, current: boolean) {
    setTogglingId(id);
    try {
      const res = await fetch(`/api/alerts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !current }),
      });
      if (res.ok) {
        setAlerts((prev) =>
          prev.map((a) => (a.id === id ? { ...a, active: !current } : a))
        );
      }
    } finally {
      setTogglingId(null);
    }
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    try {
      await fetch(`/api/alerts/${id}`, { method: "DELETE" });
      setAlerts((prev) => prev.filter((a) => a.id !== id));
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <>
      <SectionCard>
        <SectionHeader
          title="Saved Searches"
          count={loading ? undefined : `${alerts.length} alert${alerts.length !== 1 ? "s" : ""}`}
          action={
            <WireButton onClick={() => setAlertOpen(true)}>
              <Plus size={12} /> Add Alert
            </WireButton>
          }
        />
        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 size={20} className="animate-spin text-text-muted" />
          </div>
        ) : alerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-14 text-center">
            <div className="w-12 h-12 rounded-full bg-[#E8E4DF] flex items-center justify-center mb-4">
              <Bell size={20} className="text-text-muted" />
            </div>
            <p className="font-mono font-semibold text-sm text-text-primary mb-1">No saved searches</p>
            <p className="font-sans text-sm text-text-muted mb-5 max-w-xs">
              Save a job search on the jobs page to get notified of new matches.
            </p>
            <a
              href="/jobs"
              className="inline-flex items-center gap-2 px-4 py-2 bg-accent border-[1.5px] border-black text-[#0D0F12] font-mono font-semibold text-xs rounded-[6px] hover:bg-[#34C47E] transition-all duration-150"
            >
              Browse jobs
            </a>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-4 border-[1.5px] border-[#E2DDD8] rounded-[8px] hover:border-accent/30 transition-colors duration-150"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-mono font-semibold text-sm text-text-primary mb-0.5">
                    {alert.name}
                  </p>
                  <p className="font-sans text-xs text-text-muted">{alert.filterSummary}</p>
                </div>
                <FreqPill freq={alert.frequency} />
                <div className="flex items-center gap-3">
                  <Toggle
                    checked={alert.active}
                    onChange={() => {
                      if (togglingId !== alert.id) handleToggle(alert.id, alert.active);
                    }}
                  />
                  <button
                    onClick={() => { if (deletingId !== alert.id) handleDelete(alert.id); }}
                    disabled={deletingId === alert.id}
                    className="text-text-muted hover:text-red-500 transition-colors duration-150 p-1 disabled:opacity-50"
                  >
                    {deletingId === alert.id
                      ? <Loader2 size={14} className="animate-spin" />
                      : <Trash2 size={14} />
                    }
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </SectionCard>
      <AddAlertModal open={alertOpen} onClose={() => setAlertOpen(false)} />
    </>
  );
}

// ─── Certifications tab ───────────────────────────────────────────────────────

function CertificationsTab() {
  const [certs, setCerts] = useState<DbCertification[]>([]);
  const [loading, setLoading] = useState(true);
  const [addOpen, setAddOpen] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/certifications")
      .then((r) => r.json())
      .then((data) => setCerts(Array.isArray(data) ? data : []))
      .catch(() => setCerts([]))
      .finally(() => setLoading(false));
  }, []);

  function handleCertAdded(cert: DbCertification) {
    setCerts((prev) => [cert, ...prev]);
  }

  async function handleDelete(id: string) {
    setDeleting(id);
    try {
      await fetch(`/api/certifications/${id}`, { method: "DELETE" });
      setCerts((prev) => prev.filter((c) => c.id !== id));
    } finally {
      setDeleting(null);
    }
  }

  return (
    <>
      <SectionCard>
        <SectionHeader
          title="Your Certifications"
          count={loading ? undefined : `${certs.length} certification${certs.length !== 1 ? "s" : ""}`}
          action={
            <WireButton onClick={() => setAddOpen(true)}>
              <Plus size={12} /> Add Certification
            </WireButton>
          }
        />
        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 size={20} className="animate-spin text-text-muted" />
          </div>
        ) : certs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-14 text-center">
            <div className="w-12 h-12 rounded-full bg-[#E8E4DF] flex items-center justify-center mb-4">
              <Award size={20} className="text-text-muted" />
            </div>
            <p className="font-mono font-semibold text-sm text-text-primary mb-1">
              No certifications yet
            </p>
            <p className="font-sans text-sm text-text-muted mb-5 max-w-xs">
              Add your professional certifications to strengthen your profile.
            </p>
            <WireButton onClick={() => setAddOpen(true)}>
              <Plus size={12} /> Add your first cert
            </WireButton>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {certs.map((cert) => (
              <div key={cert.id} className="relative group">
                <CertificationBadge cert={cert} />
                <button
                  onClick={() => handleDelete(cert.id)}
                  disabled={deleting === cert.id}
                  className="absolute top-2 right-2 p-1.5 rounded-[4px] bg-surface border border-[#E2DDD8] text-text-muted hover:text-red-500 hover:border-red-300 transition-all duration-150 opacity-0 group-hover:opacity-100 disabled:opacity-50"
                  aria-label="Delete certification"
                >
                  {deleting === cert.id
                    ? <Loader2 size={12} className="animate-spin" />
                    : <Trash2 size={12} />
                  }
                </button>
              </div>
            ))}
          </div>
        )}
      </SectionCard>
      <AddCertificationModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSuccess={handleCertAdded}
      />
    </>
  );
}

// ─── Open to Work tab ─────────────────────────────────────────────────────────

function OpenToWorkTab() {
  const { data: sessionData } = useSession();
  const [otw, setOtw] = useState(false);
  const [desiredRole, setDesiredRole] = useState("Full-time");
  const [location, setLocation] = useState("");
  const [remoteOk, setRemoteOk] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/user/profile")
      .then((r) => r.json())
      .then((user) => {
        if (user && typeof user === "object") {
          setOtw(user.openToWork ?? false);
          setLocation(user.location ?? "");
          if (user.openToTypes?.includes("CONTRACT") && user.openToTypes?.includes("FULL_TIME")) {
            setDesiredRole("Both");
          } else if (user.openToTypes?.includes("CONTRACT")) {
            setDesiredRole("Contract");
          } else {
            setDesiredRole("Full-time");
          }
        }
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    try {
      await fetch("/api/user/open-to-work", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          openToWork: otw,
          desiredRoleType: desiredRole,
          desiredLocation: location,
        }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setSaving(false);
    }
  }

  const username = sessionData?.user?.name?.toLowerCase().replace(/\s+/g, "") ?? "you";

  return (
    <SectionCard>
      {/* Big OTW toggle */}
      <div className="flex items-start gap-5 mb-8 pb-8 border-b border-[#E2DDD8]">
        <div className="flex-1">
          <h2 className="font-mono font-bold text-xl text-text-primary mb-1">Open to Work</h2>
          <p className="font-sans text-sm text-text-muted">
            {otw
              ? "Employers and recruiters can discover your profile."
              : "Your profile is hidden from employers and recruiters."}
          </p>
        </div>
        <Toggle checked={otw} onChange={() => setOtw((v) => !v)} />
      </div>

      {otw && loaded && (
        <div className="flex flex-col gap-5">
          {/* Role type */}
          <div>
            <label className="block font-mono text-xs text-text-muted mb-2">
              Desired Role Type
            </label>
            <div className="flex gap-2 flex-wrap">
              {["Full-time", "Contract", "Both"].map((type) => (
                <button
                  key={type}
                  onClick={() => setDesiredRole(type)}
                  className={cn(
                    "px-4 py-2 font-mono text-xs rounded-[6px] border-[1.5px] transition-all duration-150",
                    desiredRole === type
                      ? "bg-accent border-black text-[#0D0F12] font-semibold"
                      : "bg-surface border-[#E2DDD8] text-text-muted hover:border-accent hover:text-accent"
                  )}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Preferred location */}
          <div>
            <label className="block font-mono text-xs text-text-muted mb-1.5">
              Preferred Location
            </label>
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Austin, TX"
                className="flex-1 font-sans text-sm bg-background border-[1.5px] border-[#E2DDD8] rounded-[6px] px-3 py-2.5 text-text-primary focus:border-accent focus:outline-none transition-colors duration-150"
              />
              <label className="flex items-center gap-2 cursor-pointer whitespace-nowrap">
                <span className="relative flex-shrink-0">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={remoteOk}
                    onChange={() => setRemoteOk((v) => !v)}
                  />
                  <div className="w-4 h-4 rounded-[3px] border-[1.5px] border-[#E2DDD8] bg-surface peer-checked:bg-accent peer-checked:border-accent transition-all duration-150" />
                </span>
                <span className="font-sans text-xs text-text-muted">Remote OK</span>
              </label>
            </div>
          </div>

          <div className="flex items-center gap-4 pt-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent border-[1.5px] border-black text-[#0D0F12] font-mono font-semibold text-sm rounded-[6px] hover:bg-[#34C47E] hover:shadow-[0_0_16px_rgba(62,207,142,0.25)] transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {saving && <Loader2 size={13} className="animate-spin" />}
              {saving ? "Saving…" : "Save preferences"}
            </button>
            {saved && (
              <span className="flex items-center gap-1.5 font-mono text-xs text-accent">
                <CheckCircle size={13} /> Saved
              </span>
            )}
          </div>

          <p className="font-mono text-xs text-text-muted pt-1 border-t border-[#E2DDD8]">
            Your profile is publicly visible at{" "}
            <a href={`/profile/${username}`} className="text-accent hover:underline">
              corestack.io/profile/{username}
            </a>
          </p>
        </div>
      )}
    </SectionCard>
  );
}

// ─── Settings tab ─────────────────────────────────────────────────────────────

function SettingsTab() {
  const { data: sessionData } = useSession();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);

  const [syncing, setSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<"idle" | "success" | "error">("idle");

  const sessionUserId = sessionData?.user?.id;
  const sessionUserName = sessionData?.user?.name;
  const sessionUserEmail = sessionData?.user?.email;
  useEffect(() => {
    if (sessionUserId) {
      setName(sessionUserName ?? "");
      setEmail(sessionUserEmail ?? "");
    }
  }, [sessionUserId, sessionUserName, sessionUserEmail]);

  async function handleSaveProfile() {
    setProfileSaving(true);
    setProfileSaved(false);
    try {
      await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 3000);
    } finally {
      setProfileSaving(false);
    }
  }

  async function handleReconnectGitHub() {
    setSyncing(true);
    setSyncStatus("idle");
    try {
      const res = await fetch("/api/github/sync", { method: "POST" });
      setSyncStatus(res.ok ? "success" : "error");
    } catch {
      setSyncStatus("error");
    } finally {
      setSyncing(false);
    }
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Account */}
      <SectionCard>
        <h3 className="font-mono font-semibold text-sm text-text-primary mb-5 pb-3 border-b border-[#E2DDD8]">
          Account
        </h3>
        <div className="flex flex-col gap-4 max-w-md">
          <div>
            <label className="block font-mono text-xs text-text-muted mb-1.5">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full font-sans text-sm bg-background border-[1.5px] border-[#E2DDD8] rounded-[6px] px-3 py-2.5 text-text-primary focus:border-accent focus:outline-none transition-colors duration-150"
            />
          </div>
          <div>
            <label className="block font-mono text-xs text-text-muted mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              disabled
              className="w-full font-sans text-sm bg-background border-[1.5px] border-[#E2DDD8] rounded-[6px] px-3 py-2.5 text-text-muted cursor-not-allowed opacity-60"
            />
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleSaveProfile}
              disabled={profileSaving}
              className="self-start inline-flex items-center gap-1.5 px-4 py-2 bg-accent border-[1.5px] border-black text-[#0D0F12] font-mono font-semibold text-xs rounded-[6px] hover:bg-[#34C47E] transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {profileSaving && <Loader2 size={12} className="animate-spin" />}
              {profileSaving ? "Saving…" : "Save changes"}
            </button>
            {profileSaved && (
              <span className="flex items-center gap-1.5 font-mono text-xs text-accent">
                <CheckCircle size={13} /> Saved
              </span>
            )}
          </div>
        </div>
      </SectionCard>

      {/* GitHub */}
      <SectionCard>
        <h3 className="font-mono font-semibold text-sm text-text-primary mb-5 pb-3 border-b border-[#E2DDD8]">
          GitHub
        </h3>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center gap-3 flex-1">
            <div className="w-9 h-9 rounded-full bg-[#1E2128] flex items-center justify-center flex-shrink-0">
              <Github size={18} className="text-[#9CA3AF]" />
            </div>
            <div>
              <p className="font-mono text-sm font-semibold text-text-primary">GitHub Integration</p>
              <p className="font-sans text-xs text-text-muted">
                {syncStatus === "success"
                  ? "Sync complete — profile updated."
                  : syncStatus === "error"
                  ? "Sync failed. Check your GitHub connection."
                  : "Sync your GitHub repos and skills."}
              </p>
            </div>
          </div>
          <WireButton onClick={handleReconnectGitHub} disabled={syncing}>
            <RefreshCw size={12} className={syncing ? "animate-spin" : ""} />
            {syncing ? "Syncing…" : "Reconnect GitHub"}
          </WireButton>
        </div>
      </SectionCard>

      {/* Password */}
      <SectionCard>
        <h3 className="font-mono font-semibold text-sm text-text-primary mb-5 pb-3 border-b border-[#E2DDD8]">
          Password
        </h3>
        <div className="flex flex-col gap-3 max-w-md">
          {[
            { label: "Current Password", placeholder: "••••••••" },
            { label: "New Password", placeholder: "••••••••" },
            { label: "Confirm New Password", placeholder: "••••••••" },
          ].map(({ label, placeholder }) => (
            <div key={label}>
              <label className="block font-mono text-xs text-text-muted mb-1.5">{label}</label>
              <input
                type="password"
                placeholder={placeholder}
                className="w-full font-sans text-sm bg-background border-[1.5px] border-[#E2DDD8] rounded-[6px] px-3 py-2.5 text-text-primary placeholder:text-text-muted/40 focus:border-accent focus:outline-none transition-colors duration-150"
              />
            </div>
          ))}
          <button className="self-start px-4 py-2 bg-accent border-[1.5px] border-black text-[#0D0F12] font-mono font-semibold text-xs rounded-[6px] hover:bg-[#34C47E] transition-all duration-150">
            Update password
          </button>
        </div>
      </SectionCard>

      {/* Danger Zone */}
      <SectionCard>
        <h3 className="font-mono font-semibold text-sm text-red-600 mb-5 pb-3 border-b border-red-100">
          Danger Zone
        </h3>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1">
            <p className="font-sans text-sm text-text-primary font-medium mb-0.5">Delete account</p>
            <p className="font-sans text-xs text-text-muted">
              Permanently delete your CoreStack account and all associated data.
            </p>
          </div>
          <button className="self-start sm:self-auto inline-flex items-center gap-2 px-4 py-2 border-[1.5px] border-red-400 rounded-[6px] font-mono text-xs text-red-600 hover:bg-red-50 transition-all duration-150 whitespace-nowrap">
            <AlertTriangle size={13} />
            Delete account
          </button>
        </div>
      </SectionCard>
    </div>
  );
}

// ─── GitHub icon ──────────────────────────────────────────────────────────────

function GithubIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

// ─── Profile sidebar ──────────────────────────────────────────────────────────

function ProfileSidebar({
  session,
  onOtw,
  onSettings,
}: {
  session: ReturnType<typeof useSession>["data"];
  onOtw: () => void;
  onSettings: () => void;
}) {
  const [profile, setProfile] = useState<SidebarProfile | null>(null);
  const [appCount, setAppCount] = useState<number | null>(null);
  const [certCount, setCertCount] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/user/profile")
      .then((r) => r.json())
      .then(setProfile)
      .catch(() => {});
    fetch("/api/applications")
      .then((r) => r.json())
      .then((data) => setAppCount(Array.isArray(data) ? data.length : 0))
      .catch(() => {});
    fetch("/api/certifications")
      .then((r) => r.json())
      .then((data) => setCertCount(Array.isArray(data) ? data.length : 0))
      .catch(() => {});
  }, []);

  const name = profile?.name ?? session?.user?.name ?? "User";
  const initials = name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase();
  const avatarUrl = profile?.profile?.avatarUrl;
  const githubUsername = profile?.username;
  const location = profile?.location;
  const bio = profile?.profile?.bio ?? profile?.bio;
  const isOtw = profile?.openToWork ?? false;
  const openToTypes = (profile?.openToTypes ?? []) as string[];

  function roleLabel(types: string[]) {
    const ft = types.includes("FULL_TIME");
    const ct = types.includes("CONTRACT");
    if (ft && ct) return "Full-time / Contract";
    if (ft) return "Full-time";
    if (ct) return "Contract";
    return "";
  }

  return (
    <div className="bg-white border border-[#E2DDD8] rounded-lg p-6 lg:sticky lg:top-20">
      {/* Avatar + identity */}
      <div className="flex flex-col items-center text-center mb-5">
        {avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={avatarUrl}
            alt={name}
            className="w-20 h-20 rounded-full object-cover mb-3 flex-shrink-0"
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-accent flex items-center justify-center font-mono font-bold text-2xl text-[#0D0F12] mb-3 flex-shrink-0">
            {initials}
          </div>
        )}
        <p className="font-mono font-semibold text-[#0D0F12] leading-tight">{name}</p>
        {githubUsername && (
          <a
            href={`https://github.com/${githubUsername}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 mt-1 font-mono text-xs text-text-muted hover:text-accent transition-colors duration-150"
          >
            <GithubIcon size={11} />
            @{githubUsername}
          </a>
        )}
        {location && (
          <span className="flex items-center gap-1 mt-1.5 font-sans text-xs text-text-muted">
            <MapPin size={11} />
            {location}
          </span>
        )}
        {bio && (
          <p className="font-sans text-xs text-text-muted mt-2 line-clamp-2 leading-relaxed">
            {bio}
          </p>
        )}
      </div>

      {/* OTW status */}
      <div className="border-t border-[#E2DDD8] pt-4 mb-4">
        <div className="flex flex-col items-center gap-1.5 mb-3">
          {isOtw ? (
            <>
              <span className="inline-block font-mono text-[10px] font-bold text-[#0D0F12] bg-accent px-2 py-0.5 rounded-[4px] uppercase tracking-wide">
                Open to Work
              </span>
              {roleLabel(openToTypes) && (
                <span className="font-sans text-xs text-text-muted">
                  {roleLabel(openToTypes)}
                </span>
              )}
            </>
          ) : (
            <span className="font-mono text-xs text-text-muted">Not open to work</span>
          )}
        </div>
        <WireButton onClick={onOtw} className="w-full justify-center">
          Update status
        </WireButton>
      </div>

      {/* Stats */}
      <div className="border-t border-[#E2DDD8] pt-4 mb-4">
        <div className="flex items-center justify-center gap-3 font-mono text-xs text-text-muted">
          <span>
            <span className="font-semibold text-[#0D0F12] tabular-nums">
              {appCount ?? "—"}
            </span>{" "}
            applications
          </span>
          <span className="text-[#E2DDD8]">•</span>
          <span>
            <span className="font-semibold text-[#0D0F12] tabular-nums">
              {certCount ?? "—"}
            </span>{" "}
            certifications
          </span>
        </div>
      </div>

      {/* Links + edit */}
      <div className="border-t border-[#E2DDD8] pt-4 flex flex-col gap-2">
        {githubUsername && (
          <a
            href={`/profile/${githubUsername}`}
            className="font-mono text-xs text-accent hover:underline text-center"
          >
            View public profile →
          </a>
        )}
        <WireButton onClick={onSettings} className="w-full justify-center">
          Edit Profile
        </WireButton>
      </div>
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function DashboardContent() {
  const { data: sessionData } = useSession();
  const [activeTab, setActiveTab] = useState<TabId>("applications");

  // Resume pending apply after OAuth redirect
  const currentUserId = sessionData?.user?.id;
  useEffect(() => {
    const pendingJobId = sessionStorage.getItem("pendingApplyJobId");
    if (!pendingJobId || !currentUserId) return;
    sessionStorage.removeItem("pendingApplyJobId");
    const pendingApplyUrl = sessionStorage.getItem("pendingApplyUrl");
    sessionStorage.removeItem("pendingApplyUrl");
    fetch("/api/applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobId: pendingJobId }),
    })
      .then((res) => {
        if (res.ok && pendingApplyUrl) {
          window.open(pendingApplyUrl, "_blank", "noopener,noreferrer");
        }
      })
      .catch(() => {});
  }, [currentUserId]);

  return (
    <div className="min-h-screen bg-[#F5F2EE]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-6 items-start">

          {/* Sidebar */}
          <aside className="w-full lg:w-[280px] flex-shrink-0">
            <ProfileSidebar
              session={sessionData}
              onOtw={() => setActiveTab("otw")}
              onSettings={() => setActiveTab("settings")}
            />
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Tab bar */}
            <div className="flex items-center gap-1 border-b border-[#E2DDD8] mb-5 overflow-x-auto scrollbar-hide">
              {TABS.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-2.5 font-mono text-xs whitespace-nowrap border-b-2 -mb-px transition-all duration-150",
                    activeTab === id
                      ? "border-accent text-[#0D0F12] font-semibold"
                      : "border-transparent text-text-muted hover:text-text-primary"
                  )}
                >
                  <Icon size={13} />
                  {label}
                </button>
              ))}
            </div>

            {/* Tab content */}
            {activeTab === "applications" && <ApplicationsTab />}
            {activeTab === "certifications" && <CertificationsTab />}
            {activeTab === "otw" && <OpenToWorkTab />}
            {activeTab === "alerts" && <AlertsTab />}
            {activeTab === "settings" && <SettingsTab />}
          </div>
        </div>
      </div>
    </div>
  );
}
