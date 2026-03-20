import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type BadgeVariant = "new" | "featured" | "muted" | "expired" | "expiring";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantClasses: Record<BadgeVariant, string> = {
  new: "bg-accent border-[1.5px] border-black text-[#0D0F12]",
  featured: "bg-transparent border-[1.5px] border-accent text-accent",
  muted: "bg-[#F5F2EE] border-[1.5px] border-[#E2DDD8] text-text-muted",
  expired: "bg-red-50 border-[1.5px] border-red-300 text-red-600",
  expiring: "bg-amber-50 border-[1.5px] border-amber-300 text-amber-700",
};

function Badge({ variant = "muted", className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-mono font-medium tracking-wide whitespace-nowrap",
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

export { Badge };
export type { BadgeProps, BadgeVariant };
