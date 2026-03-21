"use client";

import { useState, useEffect } from "react";
import {
  FileText, Bell, Award, Briefcase, Settings,
  Plus, Trash2, ArrowRight, Github,
  RefreshCw, AlertTriangle, X,
} from "lucide-react";
import { CertificationBadge } from "@/components/CertificationBadge";
import { AddCertificationModal } from "@/components/AddCertificationModal";
import { cn } from "@/lib/utils";
import { ALEX_CHEN } from "@/lib/mock-profile";
import {
  MOCK_APPLICATIONS,
  MOCK_ALERTS,
  type Application,
  type AlertFrequency,
} from "@/lib/mock-dashboard";

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
    <div className={cn("bg-surface border-[1.5px] border-[#E2DDD8] rounded-[8px] p-6", className)}>
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
        <h2 className="font-mono font-semibold text-base text-text-primary">{title}</h2>
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
}: {
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1.5 font-mono text-xs border-[1.5px] border-[#E2DDD8] rounded-[6px] text-text-primary hover:border-accent hover:text-accent transition-all duration-150",
        className
      )}
    >
      {children}
    </button>
  );
}

// ─── Status pill ──────────────────────────────────────────────────────────────

function StatusPill({ status }: { status: Application["status"] }) {
  const styles: Record<Application["status"], string> = {
    Applied: "bg-[#E8E4DF] text-text-muted",
    Viewed: "bg-[#DBEAFE] text-[#1D4ED8]",
    Closed: "bg-[#FEF3C7] text-[#92400E]",
  };
  return (
    <span className={cn("inline-block font-mono text-[11px] font-semibold px-2 py-0.5 rounded-[4px]", styles[status])}>
      {status}
    </span>
  );
}

// ─── Alert frequency pill ─────────────────────────────────────────────────────

function FreqPill({ freq }: { freq: AlertFrequency }) {
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
          className="relative w-full max-w-[400px] bg-surface border-[1.5px] border-black rounded-[8px] shadow-2xl pointer-events-auto"
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
  { id: "alerts", label: "Alerts", icon: Bell },
  { id: "certifications", label: "Certifications", icon: Award },
  { id: "otw", label: "Open to Work", icon: Briefcase },
  { id: "settings", label: "Settings", icon: Settings },
] as const;

type TabId = (typeof TABS)[number]["id"];

// ─── Tab panels ───────────────────────────────────────────────────────────────

function ApplicationsTab() {
  return (
    <SectionCard>
      <SectionHeader
        title="Your Applications"
        count={`${MOCK_APPLICATIONS.length} applications`}
      />
      <div className="flex flex-col divide-y divide-[#E2DDD8]">
        {MOCK_APPLICATIONS.map((app) => (
          <div
            key={app.id}
            className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 py-4 first:pt-0 last:pb-0"
          >
            {/* Company logo placeholder */}
            <div className="flex-shrink-0 w-9 h-9 rounded-[6px] bg-[#1E2128] border border-[#2A2D35] flex items-center justify-center font-mono font-bold text-sm text-[#4B5563]">
              {app.company[0]}
            </div>

            {/* Job info */}
            <div className="flex-1 min-w-0">
              <p className="font-mono font-semibold text-sm text-text-primary leading-tight truncate">
                {app.jobTitle}
              </p>
              <p className="font-sans text-xs text-text-muted">
                {app.company} · {app.location}
              </p>
            </div>

            {/* Applied date */}
            <span className="font-mono text-xs text-text-muted whitespace-nowrap">
              {app.appliedDate}
            </span>

            {/* Status */}
            <StatusPill status={app.status} />

            {/* Action */}
            <WireButton>
              View listing <ArrowRight size={11} />
            </WireButton>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

function AlertsTab() {
  const [alertOpen, setAlertOpen] = useState(false);
  const [activeStates, setActiveStates] = useState<Record<string, boolean>>(
    Object.fromEntries(MOCK_ALERTS.map((a) => [a.id, a.active]))
  );

  return (
    <>
      <SectionCard>
        <SectionHeader
          title="Saved Searches"
          count={`${MOCK_ALERTS.length} alerts`}
          action={
            <WireButton onClick={() => setAlertOpen(true)}>
              <Plus size={12} /> Add Alert
            </WireButton>
          }
        />
        <div className="flex flex-col gap-3">
          {MOCK_ALERTS.map((alert) => (
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
                  checked={activeStates[alert.id]}
                  onChange={() =>
                    setActiveStates((s) => ({ ...s, [alert.id]: !s[alert.id] }))
                  }
                />
                <button className="text-text-muted hover:text-red-500 transition-colors duration-150 p-1">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
      <AddAlertModal open={alertOpen} onClose={() => setAlertOpen(false)} />
    </>
  );
}

function CertificationsTab() {
  const [addOpen, setAddOpen] = useState(false);

  return (
    <>
      <SectionCard>
        <SectionHeader
          title="Your Certifications"
          count={`${ALEX_CHEN.certifications.length} certifications`}
          action={
            <WireButton onClick={() => setAddOpen(true)}>
              <Plus size={12} /> Add Certification
            </WireButton>
          }
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {ALEX_CHEN.certifications.map((cert) => (
            <CertificationBadge key={cert.name} cert={cert} />
          ))}
        </div>
      </SectionCard>
      <AddCertificationModal open={addOpen} onClose={() => setAddOpen(false)} />
    </>
  );
}

function OpenToWorkTab() {
  const [otw, setOtw] = useState(true);
  const [desiredRole, setDesiredRole] = useState("Full-time");

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

      {otw && (
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
                defaultValue="Austin, TX"
                className="flex-1 font-sans text-sm bg-background border-[1.5px] border-[#E2DDD8] rounded-[6px] px-3 py-2.5 text-text-primary focus:border-accent focus:outline-none transition-colors duration-150"
              />
              <label className="flex items-center gap-2 cursor-pointer whitespace-nowrap">
                <span className="relative flex-shrink-0">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-4 h-4 rounded-[3px] border-[1.5px] border-[#E2DDD8] bg-surface peer-checked:bg-accent peer-checked:border-accent transition-all duration-150" />
                </span>
                <span className="font-sans text-xs text-text-muted">Remote OK</span>
              </label>
            </div>
          </div>

          {/* Salary range */}
          <div>
            <label className="block font-mono text-xs text-text-muted mb-1.5">
              Expected Salary Range
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-xs text-text-muted">$</span>
                <input
                  type="number"
                  defaultValue="130"
                  placeholder="Min"
                  className="w-full font-sans text-sm bg-background border-[1.5px] border-[#E2DDD8] rounded-[6px] pl-6 pr-3 py-2.5 text-text-primary focus:border-accent focus:outline-none transition-colors duration-150"
                />
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-xs text-text-muted">$</span>
                <input
                  type="number"
                  defaultValue="160"
                  placeholder="Max"
                  className="w-full font-sans text-sm bg-background border-[1.5px] border-[#E2DDD8] rounded-[6px] pl-6 pr-3 py-2.5 text-text-primary focus:border-accent focus:outline-none transition-colors duration-150"
                />
              </div>
            </div>
          </div>

          {/* Available from */}
          <div>
            <label className="block font-mono text-xs text-text-muted mb-1.5">
              Available From
            </label>
            <div className="grid grid-cols-2 gap-3 max-w-xs">
              <div className="relative">
                <select className="w-full font-sans text-sm bg-background border-[1.5px] border-[#E2DDD8] rounded-[6px] px-3 py-2.5 text-text-primary focus:border-accent focus:outline-none appearance-none cursor-pointer">
                  <option>March</option>
                  <option>April</option>
                  <option>May</option>
                </select>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </span>
              </div>
              <div className="relative">
                <select className="w-full font-sans text-sm bg-background border-[1.5px] border-[#E2DDD8] rounded-[6px] px-3 py-2.5 text-text-primary focus:border-accent focus:outline-none appearance-none cursor-pointer">
                  <option>2026</option>
                  <option>2027</option>
                </select>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 pt-2">
            <button className="px-5 py-2.5 bg-accent border-[1.5px] border-black text-[#0D0F12] font-mono font-semibold text-sm rounded-[6px] hover:bg-[#34C47E] hover:shadow-[0_0_16px_rgba(62,207,142,0.25)] transition-all duration-150">
              Save preferences
            </button>
          </div>

          <p className="font-mono text-xs text-text-muted pt-1 border-t border-[#E2DDD8]">
            Your profile is publicly visible at{" "}
            <a href="#" className="text-accent hover:underline">
              corestack.io/profile/alexchen-dc
            </a>
          </p>
        </div>
      )}
    </SectionCard>
  );
}

function SettingsTab() {
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
              defaultValue="Alex Chen"
              className="w-full font-sans text-sm bg-background border-[1.5px] border-[#E2DDD8] rounded-[6px] px-3 py-2.5 text-text-primary focus:border-accent focus:outline-none transition-colors duration-150"
            />
          </div>
          <div>
            <label className="block font-mono text-xs text-text-muted mb-1.5">Email</label>
            <input
              type="email"
              defaultValue="alex.chen@equinix.com"
              className="w-full font-sans text-sm bg-background border-[1.5px] border-[#E2DDD8] rounded-[6px] px-3 py-2.5 text-text-primary focus:border-accent focus:outline-none transition-colors duration-150"
            />
          </div>
          <button className="self-start px-4 py-2 bg-accent border-[1.5px] border-black text-[#0D0F12] font-mono font-semibold text-xs rounded-[6px] hover:bg-[#34C47E] transition-all duration-150">
            Save changes
          </button>
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
              <p className="font-mono text-sm font-semibold text-text-primary">@alexchen-dc</p>
              <p className="font-sans text-xs text-text-muted">Last synced Mar 21, 2026 09:14</p>
            </div>
          </div>
          <WireButton>
            <RefreshCw size={12} /> Reconnect GitHub
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

// ─── Main export ──────────────────────────────────────────────────────────────

export function DashboardContent() {
  const [activeTab, setActiveTab] = useState<TabId>("applications");

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">

        {/* Dashboard header */}
        <div className="mb-7">
          <h1 className="font-mono font-bold text-2xl text-text-primary mb-0.5">Dashboard</h1>
          <p className="font-sans text-sm text-text-muted">Welcome back, Alex Chen</p>
        </div>

        {/* Tab bar */}
        <div className="flex items-center gap-1 border-b border-[#E2DDD8] mb-7 overflow-x-auto scrollbar-hide">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={cn(
                "flex items-center gap-2 px-3 py-2.5 font-mono text-xs whitespace-nowrap border-b-2 -mb-px transition-all duration-150",
                activeTab === id
                  ? "border-accent text-text-primary font-semibold"
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
        {activeTab === "alerts" && <AlertsTab />}
        {activeTab === "certifications" && <CertificationsTab />}
        {activeTab === "otw" && <OpenToWorkTab />}
        {activeTab === "settings" && <SettingsTab />}
      </div>
    </div>
  );
}
