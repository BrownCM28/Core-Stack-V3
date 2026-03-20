"use client";

import { forwardRef, InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-mono font-medium text-text-primary uppercase tracking-wide"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "w-full border-[1.5px] border-[#1E2128] bg-white text-text-primary rounded-[6px]",
            "px-3 py-2 text-sm font-sans transition-all duration-150 outline-none",
            "placeholder:text-text-muted",
            "focus:border-accent focus:shadow-accent-input",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            error && "border-red-500 focus:border-red-500 focus:shadow-none",
            className
          )}
          {...props}
        />
        {error && (
          <p className="text-xs text-red-500 font-sans">{error}</p>
        )}
        {hint && !error && (
          <p className="text-xs text-text-muted font-sans">{hint}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
export type { InputProps };
