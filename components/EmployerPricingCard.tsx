import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmployerPricingCardProps {
  tier: string;
  price: number;
  features: string[];
  ctaLabel: string;
  featured?: boolean;
}

export function EmployerPricingCard({
  tier,
  price,
  features,
  ctaLabel,
  featured = false,
}: EmployerPricingCardProps) {
  return (
    <div
      className={cn(
        "relative bg-surface rounded-[8px] p-7 flex flex-col",
        featured
          ? "border-[2px] border-accent shadow-[0_0_0_1px_#3ECF8E,_0_0_24px_rgba(62,207,142,0.12)]"
          : "border-[1.5px] border-[#E2DDD8]"
      )}
    >
      {featured && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
          <span className="font-mono text-[10px] font-bold text-[#0D0F12] bg-accent px-3 py-1 rounded-full border border-black uppercase tracking-[0.08em] whitespace-nowrap">
            Most Popular
          </span>
        </div>
      )}

      <p className="font-mono text-[10px] text-text-muted tracking-[0.12em] uppercase mb-3">
        {tier}
      </p>

      <div className="flex items-baseline gap-1 mb-1">
        <span className="font-mono font-bold text-[42px] leading-none text-text-primary">
          ${price}
        </span>
        <span className="font-mono text-sm text-text-muted">/listing</span>
      </div>
      <p className="font-sans text-xs text-text-muted mb-7">
        One-time payment. No subscription.
      </p>

      <ul className="flex flex-col gap-2.5 mb-8 flex-1">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2.5 font-sans text-sm text-text-primary">
            <Check size={14} className="text-accent flex-shrink-0 mt-0.5" />
            {f}
          </li>
        ))}
      </ul>

      <button
        className={cn(
          "w-full px-5 py-2.5 font-mono font-semibold text-sm rounded-[6px] border-[1.5px] transition-all duration-150",
          featured
            ? "bg-accent border-black text-[#0D0F12] hover:bg-[#34C47E] hover:shadow-[0_0_16px_rgba(62,207,142,0.25)]"
            : "bg-surface border-[#E2DDD8] text-text-primary hover:border-accent hover:text-accent hover:shadow-[0_0_0_1px_#3ECF8E,_0_0_12px_rgba(62,207,142,0.15)]"
        )}
      >
        {ctaLabel}
      </button>
    </div>
  );
}
