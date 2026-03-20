"use client";

import { useEffect, useCallback, ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  className?: string;
  /** Max width of the panel, defaults to "max-w-lg" */
  maxWidth?: string;
}

function Modal({ open, onClose, title, children, className, maxWidth = "max-w-lg" }: ModalProps) {
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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        className={cn(
          "relative z-10 w-full bg-surface border-[1.5px] border-black rounded-[8px]",
          "shadow-[0_8px_40px_rgba(0,0,0,0.3)]",
          maxWidth,
          className
        )}
      >
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2DDD8]">
            <h2 className="font-mono font-semibold text-base text-text-primary">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="text-text-muted hover:text-accent transition-colors duration-150 p-1 -mr-1 rounded"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>
          </div>
        )}

        {/* Close button (no title) */}
        {!title && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-text-muted hover:text-accent transition-colors duration-150 p-1 rounded"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        )}

        {/* Body */}
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}

export { Modal };
export type { ModalProps };
