"use client";

import { forwardRef, ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "default" | "primary";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-base",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "default", size = "md", className, children, ...props }, ref) => {
    const base =
      "inline-flex items-center justify-center gap-2 font-mono font-medium rounded-[6px] transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none whitespace-nowrap";

    const variants: Record<ButtonVariant, string> = {
      default: cn(
        "border-[1.5px] border-black bg-transparent text-[#0D0F12]",
        "hover:border-accent hover:text-accent hover:shadow-accent-sm"
      ),
      primary: cn(
        "border-[1.5px] border-black bg-accent text-[#0D0F12]",
        "hover:bg-accent-hover hover:shadow-accent-md"
      ),
    };

    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], sizeClasses[size], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
export type { ButtonProps, ButtonVariant, ButtonSize };
