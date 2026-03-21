"use client";

import { useEffect, useCallback } from "react";
import { X, Github, Zap } from "lucide-react";

interface ApplyModalProps {
  open: boolean;
  onClose: () => void;
  job?: { title: string; company: string } | null;
}

export function ApplyModal({ open, onClose, job }: ApplyModalProps) {
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

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div className="relative z-10 w-full max-w-md bg-surface border-[1.5px] border-black rounded-[8px] shadow-[0_8px_40px_rgba(0,0,0,0.35)]">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-text-muted hover:text-accent transition-colors duration-150"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        <div className="px-8 py-8">
          {/* CoreStack logo */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <Zap size={16} className="text-accent" aria-hidden="true" />
            <span className="font-mono font-semibold text-base text-text-primary tracking-tight">
              CoreStack
            </span>
          </div>

          {/* Headline */}
          <h2 className="font-mono font-semibold text-xl text-text-primary text-center mb-2">
            Create a free account to apply
          </h2>

          {job && (
            <p className="font-sans text-sm text-text-muted text-center mb-1">
              Apply for{" "}
              <span className="text-text-primary font-medium">{job.title}</span>
              {" "}at{" "}
              <span className="text-text-primary font-medium">{job.company}</span>
            </p>
          )}

          <p className="font-sans text-xs text-text-muted text-center mb-8">
            Join thousands of infrastructure engineers on CoreStack.
          </p>

          {/* GitHub */}
          <a
            href="#"
            className="flex w-full items-center justify-center gap-3 px-4 py-3 bg-[#24292F] border-[1.5px] border-[#30363D] text-white font-mono font-medium text-sm rounded-[6px] transition-all duration-150 hover:bg-[#2D3440] hover:border-white/30 mb-3"
          >
            <Github size={18} />
            Continue with GitHub
          </a>

          {/* Google */}
          <a
            href="#"
            className="flex w-full items-center justify-center gap-3 px-4 py-3 bg-transparent border-[1.5px] border-black text-text-primary font-mono font-medium text-sm rounded-[6px] transition-all duration-150 hover:border-accent hover:text-accent hover:shadow-[0_0_0_1px_#3ECF8E,_0_0_12px_rgba(62,207,142,0.15)] mb-6"
          >
            <span className="flex h-[18px] w-[18px] items-center justify-center rounded-full bg-white text-[11px] font-bold text-[#4285F4] ring-1 ring-[#DADCE0] flex-shrink-0">
              G
            </span>
            Continue with Google
          </a>

          {/* OR divider */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-[#E2DDD8]" />
            <span className="font-mono text-xs text-text-muted">or</span>
            <div className="flex-1 h-px bg-[#E2DDD8]" />
          </div>

          {/* Email link */}
          <p className="text-center">
            <a
              href="#"
              className="font-mono text-sm text-text-muted hover:text-accent transition-colors duration-150"
            >
              Sign in with email →
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
