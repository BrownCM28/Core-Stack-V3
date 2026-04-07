"use client";

import { useEffect, useCallback, useState } from "react";
import { X, Github, Zap, CheckCircle, Loader2, AlertCircle } from "lucide-react";
import { useSession, signIn } from "@/lib/auth-client";
import type { ApiJob } from "@/lib/types";

interface ApplyModalProps {
  open: boolean;
  onClose: () => void;
  job: ApiJob | null;
}

export function ApplyModal({ open, onClose, job }: ApplyModalProps) {
  const { data: sessionData } = useSession();
  const isLoggedIn = !!sessionData?.user;

  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset state when job changes or modal opens
  useEffect(() => {
    if (open) {
      setApplied(false);
      setError(null);
    }
  }, [open, job?.id]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (open) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, handleKeyDown]);

  async function handleApply() {
    if (!job) return;
    setApplying(true);
    setError(null);
    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId: job.id }),
      });
      if (res.ok) {
        setApplied(true);
        if (job.applyUrl) window.open(job.applyUrl, "_blank", "noopener,noreferrer");
      } else {
        const data = await res.json().catch(() => ({}));
        setError((data as { error?: string }).error ?? "Failed to submit application");
      }
    } catch {
      setError("Network error — please try again");
    } finally {
      setApplying(false);
    }
  }

  function handleSocialSignIn(provider: "github" | "google") {
    if (job) {
      sessionStorage.setItem("pendingApplyJobId", job.id);
      if (job.applyUrl) sessionStorage.setItem("pendingApplyUrl", job.applyUrl);
    }
    signIn.social({ provider, callbackURL: "/dashboard" });
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-md bg-surface border-[1.5px] border-black rounded-[8px] shadow-[0_8px_40px_rgba(0,0,0,0.35)] animate-modal-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-text-muted hover:text-accent transition-colors duration-150"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        <div className="px-8 py-8">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Zap size={16} className="text-accent" aria-hidden="true" />
            <span className="font-mono font-semibold text-base text-text-primary tracking-tight">
              CoreStack
            </span>
          </div>

          {isLoggedIn ? (
            applied ? (
              /* ── Success state ── */
              <div className="flex flex-col items-center text-center gap-3 py-2">
                <CheckCircle size={36} className="text-accent" />
                <h2 className="font-mono font-semibold text-lg text-text-primary">
                  Application submitted
                </h2>
                {job && (
                  <p className="font-sans text-sm text-text-muted">
                    You applied for{" "}
                    <span className="text-text-primary font-medium">{job.title}</span> at{" "}
                    <span className="text-text-primary font-medium">{job.company}</span>.
                  </p>
                )}
                {job?.applyUrl && (
                  <a
                    href={job.applyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-sm text-accent hover:underline"
                  >
                    View original listing →
                  </a>
                )}
                <button
                  onClick={onClose}
                  className="mt-2 px-5 py-2.5 bg-accent border-[1.5px] border-black text-[#0D0F12] font-mono font-semibold text-sm rounded-[6px] hover:bg-[#34C47E] transition-all duration-150"
                >
                  Done
                </button>
              </div>
            ) : (
              /* ── Apply form ── */
              <>
                <h2 className="font-mono font-semibold text-xl text-text-primary text-center mb-2">
                  Apply for this role
                </h2>
                {job && (
                  <p className="font-sans text-sm text-text-muted text-center mb-8">
                    Applying for{" "}
                    <span className="text-text-primary font-medium">{job.title}</span> at{" "}
                    <span className="text-text-primary font-medium">{job.company}</span>
                  </p>
                )}
                {error && (
                  <div className="flex items-center gap-2 mb-4 px-3 py-2 bg-red-50 border border-red-200 rounded-[6px] text-red-600 text-xs font-mono">
                    <AlertCircle size={13} />
                    {error}
                  </div>
                )}
                <button
                  onClick={handleApply}
                  disabled={applying}
                  className="flex w-full items-center justify-center gap-2 px-4 py-3 bg-accent border-[1.5px] border-black text-[#0D0F12] font-mono font-semibold text-sm rounded-[6px] transition-all duration-150 hover:bg-[#34C47E] hover:shadow-[0_0_16px_rgba(62,207,142,0.25)] disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {applying && <Loader2 size={15} className="animate-spin" />}
                  {applying ? "Submitting…" : "Apply Now"}
                </button>
              </>
            )
          ) : (
            /* ── Sign-in prompt ── */
            <>
              <h2 className="font-mono font-semibold text-xl text-text-primary text-center mb-2">
                Create a free account to apply
              </h2>
              {job && (
                <p className="font-sans text-sm text-text-muted text-center mb-1">
                  Apply for{" "}
                  <span className="text-text-primary font-medium">{job.title}</span> at{" "}
                  <span className="text-text-primary font-medium">{job.company}</span>
                </p>
              )}
              <p className="font-sans text-xs text-text-muted text-center mb-8">
                Join thousands of infrastructure engineers on CoreStack.
              </p>

              <button
                onClick={() => handleSocialSignIn("github")}
                className="flex w-full items-center justify-center gap-3 px-4 py-3 bg-[#24292F] border-[1.5px] border-[#30363D] text-white font-mono font-medium text-sm rounded-[6px] transition-all duration-150 hover:bg-[#2D3440] hover:border-white/30 mb-3"
              >
                <Github size={18} />
                Continue with GitHub
              </button>

              <button
                onClick={() => handleSocialSignIn("google")}
                className="flex w-full items-center justify-center gap-3 px-4 py-3 bg-transparent border-[1.5px] border-black text-text-primary font-mono font-medium text-sm rounded-[6px] transition-all duration-150 hover:border-accent hover:text-accent hover:shadow-[0_0_0_1px_#3ECF8E,_0_0_12px_rgba(62,207,142,0.15)] mb-6"
              >
                <span className="flex h-[18px] w-[18px] items-center justify-center rounded-full bg-white text-[11px] font-bold text-[#4285F4] ring-1 ring-[#DADCE0] flex-shrink-0">
                  G
                </span>
                Continue with Google
              </button>

              <div className="flex items-center gap-3 mb-5">
                <div className="flex-1 h-px bg-[#E2DDD8]" />
                <span className="font-mono text-xs text-text-muted">or</span>
                <div className="flex-1 h-px bg-[#E2DDD8]" />
              </div>

              <p className="text-center">
                <a
                  href="/auth/login"
                  className="font-mono text-sm text-text-muted hover:text-accent transition-colors duration-150"
                >
                  Sign in with email →
                </a>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
