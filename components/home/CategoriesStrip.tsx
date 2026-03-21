import {
  Server,
  Building2,
  Zap,
  Wind,
  Cpu,
  Network,
  ClipboardList,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Category {
  name: string;
  icon: LucideIcon;
  count: number;
  slug: string;
}

const CATEGORIES: Category[] = [
  { name: "Data Center Ops", icon: Server, count: 847, slug: "dc-ops" },
  { name: "Construction", icon: Building2, count: 234, slug: "construction" },
  { name: "Electrical", icon: Zap, count: 312, slug: "electrical" },
  { name: "Cooling/HVAC", icon: Wind, count: 198, slug: "cooling-hvac" },
  { name: "AI Infrastructure", icon: Cpu, count: 423, slug: "ai-infrastructure" },
  { name: "Networking", icon: Network, count: 276, slug: "networking" },
  { name: "Project Management", icon: ClipboardList, count: 189, slug: "project-management" },
];

export function CategoriesStrip() {
  return (
    <section className="bg-surface border-t border-[#E2DDD8] border-b border-b-[#E2DDD8] py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="flex items-center gap-3 mb-8">
          <span className="font-mono text-[11px] text-text-muted tracking-[0.12em] uppercase whitespace-nowrap">
            Browse by Category
          </span>
          <div className="flex-1 h-px bg-[#E2DDD8]" />
        </div>

        {/* Category grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <a
                key={cat.slug}
                href="#"
                className="group flex flex-col items-center gap-2.5 p-4 bg-white border-[1.5px] border-[#E2DDD8] rounded-[8px] text-center transition-all duration-150 hover:border-accent hover:shadow-[0_0_0_1px_#3ECF8E,_0_0_12px_rgba(62,207,142,0.15)] hover:-translate-y-0.5"
              >
                <Icon
                  size={18}
                  className="text-text-muted group-hover:text-accent transition-colors duration-150"
                />
                <span className="font-mono text-[11px] font-medium text-text-primary group-hover:text-accent transition-colors duration-150 leading-tight">
                  {cat.name}
                </span>
                <span className="font-mono text-[10px] text-text-muted">
                  {cat.count.toLocaleString()} roles
                </span>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
