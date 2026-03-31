"use client";

import { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import type { DbCertification } from "@/components/CertificationBadge";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const MONTH_ABBR: Record<string, string> = {
  January: "Jan", February: "Feb", March: "Mar", April: "Apr",
  May: "May", June: "Jun", July: "Jul", August: "Aug",
  September: "Sep", October: "Oct", November: "Nov", December: "Dec",
};

const ISSUERS = [
  "AWS", "Microsoft Azure", "Google Cloud", "Cisco", "CompTIA",
  "Linux Foundation", "HashiCorp", "BICSI", "Uptime Institute", "NVIDIA", "Custom",
];

const YEARS = Array.from({ length: 10 }, (_, i) => String(2026 - i));

const inputClass =
  "w-full font-sans text-sm bg-background border-[1.5px] border-[#E2DDD8] rounded-[6px] px-3 py-2.5 text-text-primary placeholder:text-text-muted/60 focus:border-accent focus:outline-none transition-colors duration-150";

const selectClass =
  "w-full font-sans text-sm bg-background border-[1.5px] border-[#E2DDD8] rounded-[6px] px-3 py-2.5 text-text-primary focus:border-accent focus:outline-none transition-colors duration-150 appearance-none cursor-pointer";

const ChevronSvg = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
    <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

interface AddCertificationModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (cert: DbCertification) => void;
}

export function AddCertificationModal({ open, onClose, onSuccess }: AddCertificationModalProps) {
  const [issuer, setIssuer] = useState("");
  const [name, setName] = useState("");
  const [credentialId, setCredentialId] = useState("");
  const [issueMonth, setIssueMonth] = useState("");
  const [issueYear, setIssueYear] = useState("");
  const [noExpiry, setNoExpiry] = useState(false);
  const [expiryMonth, setExpiryMonth] = useState("");
  const [expiryYear, setExpiryYear] = useState("");
  const [credentialUrl, setCredentialUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset on open
  useEffect(() => {
    if (open) {
      setIssuer(""); setName(""); setCredentialId("");
      setIssueMonth(""); setIssueYear("");
      setNoExpiry(false); setExpiryMonth(""); setExpiryYear("");
      setCredentialUrl(""); setError(null);
    }
  }, [open]);

  // Lock body scroll + ESC handler
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

  async function handleSubmit() {
    setError(null);
    if (!issuer) { setError("Please select an issuing organization"); return; }
    if (!name.trim()) { setError("Please enter a certification name"); return; }
    if (!issueMonth || !issueYear) { setError("Please select an issue date"); return; }
    if (!noExpiry && (!expiryMonth || !expiryYear)) { setError("Please select an expiry date or check 'No expiry'"); return; }

    const issuedAt = `${MONTH_ABBR[issueMonth]} ${issueYear}`;
    const expiresAt = noExpiry ? null : `${MONTH_ABBR[expiryMonth]} ${expiryYear}`;

    setSubmitting(true);
    try {
      const res = await fetch("/api/certifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          issuer: issuer === "Custom" ? name.trim() : issuer,
          issuedAt,
          expiresAt,
          credentialId: credentialId.trim() || null,
          credentialUrl: credentialUrl.trim() || null,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError((data as { error?: string }).error ?? "Failed to save certification");
        return;
      }
      const cert = await res.json() as DbCertification;
      onSuccess(cert);
      onClose();
    } catch {
      setError("Network error — please try again");
    } finally {
      setSubmitting(false);
    }
  }

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="relative w-full max-w-[500px] bg-surface border-[1.5px] border-black rounded-[8px] shadow-2xl max-h-[90vh] overflow-y-auto pointer-events-auto animate-modal-in"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-[#E2DDD8]">
            <h2 className="font-mono font-semibold text-base text-text-primary">
              Add Certification
            </h2>
            <button
              onClick={onClose}
              className="text-text-muted hover:text-accent transition-colors duration-150 p-1"
            >
              <X size={18} />
            </button>
          </div>

          {/* Body */}
          <div className="px-6 py-5 flex flex-col gap-4">

            {error && (
              <div className="px-3 py-2 bg-red-50 border border-red-200 rounded-[6px] font-mono text-xs text-red-600">
                {error}
              </div>
            )}

            {/* Issuer */}
            <div>
              <label className="block font-mono text-xs text-text-muted mb-1.5">
                Issuing Organization
              </label>
              <div className="relative">
                <select className={selectClass} value={issuer} onChange={(e) => setIssuer(e.target.value)}>
                  <option value="">Select issuer…</option>
                  {ISSUERS.map((i) => (
                    <option key={i} value={i}>{i}</option>
                  ))}
                </select>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted">
                  <ChevronSvg />
                </span>
              </div>
            </div>

            {/* Cert name */}
            <div>
              <label className="block font-mono text-xs text-text-muted mb-1.5">
                Certification Name
              </label>
              <input
                type="text"
                placeholder="e.g. Solutions Architect – Associate"
                className={inputClass}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {/* Credential ID */}
            <div>
              <label className="block font-mono text-xs text-text-muted mb-1.5">
                Credential ID{" "}
                <span className="text-text-muted/60 font-sans normal-case">(optional)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. A1B2C3D4"
                className={inputClass}
                value={credentialId}
                onChange={(e) => setCredentialId(e.target.value)}
              />
            </div>

            {/* Issue date */}
            <div>
              <label className="block font-mono text-xs text-text-muted mb-1.5">
                Issue Date
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <select className={selectClass} value={issueMonth} onChange={(e) => setIssueMonth(e.target.value)}>
                    <option value="">Month</option>
                    {MONTHS.map((m) => <option key={m}>{m}</option>)}
                  </select>
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted"><ChevronSvg /></span>
                </div>
                <div className="relative">
                  <select className={selectClass} value={issueYear} onChange={(e) => setIssueYear(e.target.value)}>
                    <option value="">Year</option>
                    {YEARS.map((y) => <option key={y}>{y}</option>)}
                  </select>
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted"><ChevronSvg /></span>
                </div>
              </div>
            </div>

            {/* Expiry date */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="font-mono text-xs text-text-muted">Expiry Date</label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <span className="relative flex-shrink-0">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={noExpiry}
                      onChange={() => setNoExpiry((v) => !v)}
                    />
                    <div className="w-4 h-4 rounded-[3px] border-[1.5px] border-[#E2DDD8] bg-surface peer-checked:bg-accent peer-checked:border-accent transition-all duration-150 flex items-center justify-center">
                      {noExpiry && (
                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                          <path d="M1 4L3.5 6.5L9 1" stroke="#0D0F12" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                  </span>
                  <span className="font-sans text-xs text-text-muted">No expiry</span>
                </label>
              </div>
              {!noExpiry && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative">
                    <select className={selectClass} value={expiryMonth} onChange={(e) => setExpiryMonth(e.target.value)}>
                      <option value="">Month</option>
                      {MONTHS.map((m) => <option key={m}>{m}</option>)}
                    </select>
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted"><ChevronSvg /></span>
                  </div>
                  <div className="relative">
                    <select className={selectClass} value={expiryYear} onChange={(e) => setExpiryYear(e.target.value)}>
                      <option value="">Year</option>
                      {YEARS.map((y) => <option key={y}>{y}</option>)}
                    </select>
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted"><ChevronSvg /></span>
                  </div>
                </div>
              )}
            </div>

            {/* Credential URL */}
            <div>
              <label className="block font-mono text-xs text-text-muted mb-1.5">
                Credential URL{" "}
                <span className="text-text-muted/60 font-sans normal-case">(optional)</span>
              </label>
              <input
                type="url"
                placeholder="https://…"
                className={inputClass}
                value={credentialUrl}
                onChange={(e) => setCredentialUrl(e.target.value)}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-6 py-5 border-t border-[#E2DDD8]">
            <button
              onClick={onClose}
              className="font-mono text-sm text-text-muted hover:text-accent transition-colors duration-150"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent border-[1.5px] border-black text-[#0D0F12] font-mono font-semibold text-sm rounded-[6px] hover:bg-[#34C47E] hover:shadow-[0_0_16px_rgba(62,207,142,0.25)] transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting && <Loader2 size={14} className="animate-spin" />}
              {submitting ? "Saving…" : "Add Certification"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
