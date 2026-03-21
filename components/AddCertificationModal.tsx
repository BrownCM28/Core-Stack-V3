"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const ISSUERS = [
  "AWS", "Microsoft Azure", "Google Cloud", "Cisco", "CompTIA",
  "Linux Foundation", "HashiCorp", "BICSI", "Uptime Institute", "NVIDIA", "Custom",
];

const YEARS = Array.from({ length: 10 }, (_, i) => String(2026 - i));

const inputClass =
  "w-full font-sans text-sm bg-background border-[1.5px] border-[#E2DDD8] rounded-[6px] px-3 py-2.5 text-text-primary placeholder:text-text-muted/60 focus:border-accent focus:outline-none transition-colors duration-150";

const selectClass =
  "w-full font-sans text-sm bg-background border-[1.5px] border-[#E2DDD8] rounded-[6px] px-3 py-2.5 text-text-primary focus:border-accent focus:outline-none transition-colors duration-150 appearance-none cursor-pointer";

interface AddCertificationModalProps {
  open: boolean;
  onClose: () => void;
}

export function AddCertificationModal({ open, onClose }: AddCertificationModalProps) {
  const [noExpiry, setNoExpiry] = useState(false);

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

  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
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

            {/* Issuer */}
            <div>
              <label className="block font-mono text-xs text-text-muted mb-1.5">
                Issuing Organization
              </label>
              <div className="relative">
                <select className={selectClass}>
                  <option value="">Select issuer…</option>
                  {ISSUERS.map((issuer) => (
                    <option key={issuer} value={issuer}>{issuer}</option>
                  ))}
                </select>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
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
              />
            </div>

            {/* Issue date */}
            <div>
              <label className="block font-mono text-xs text-text-muted mb-1.5">
                Issue Date
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <select className={selectClass}>
                    <option value="">Month</option>
                    {MONTHS.map((m) => <option key={m}>{m}</option>)}
                  </select>
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </span>
                </div>
                <div className="relative">
                  <select className={selectClass}>
                    <option value="">Year</option>
                    {YEARS.map((y) => <option key={y}>{y}</option>)}
                  </select>
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </span>
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
                    <select className={selectClass}>
                      <option value="">Month</option>
                      {MONTHS.map((m) => <option key={m}>{m}</option>)}
                    </select>
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </span>
                  </div>
                  <div className="relative">
                    <select className={selectClass}>
                      <option value="">Year</option>
                      {YEARS.map((y) => <option key={y}>{y}</option>)}
                    </select>
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </span>
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
            <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent border-[1.5px] border-black text-[#0D0F12] font-mono font-semibold text-sm rounded-[6px] hover:bg-[#34C47E] hover:shadow-[0_0_16px_rgba(62,207,142,0.25)] transition-all duration-150">
              Add Certification
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
