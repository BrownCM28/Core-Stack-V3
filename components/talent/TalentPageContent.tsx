"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { SlidersHorizontal, X, Loader2 } from "lucide-react";
import { TalentCard } from "@/components/TalentCard";
import type { ApiTalent } from "@/app/api/talent/route";

// ─── Filter sub-components ────────────────────────────────────────────────────

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <p className="font-mono text-[10px] text-text-muted tracking-[0.12em] uppercase mb-3">
        {title}
      </p>
      {children}
    </div>
  );
}

function FilterCheckbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer group mb-2.5">
      <span className="relative flex-shrink-0">
        <input type="checkbox" className="sr-only peer" checked={checked} onChange={onChange} />
        <div className="w-4 h-4 rounded-[3px] border-[1.5px] border-[#E0E0E0] bg-surface peer-checked:bg-accent peer-checked:border-accent transition-all duration-150 flex items-center justify-center">
          {checked && (
            <svg width="10" height="8" viewBox="0 0 10 8" fill="none" className="absolute">
              <path d="M1 4L3.5 6.5L9 1" stroke="#0D0F12" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </div>
      </span>
      <span className="font-sans text-xs text-text-primary group-hover:text-accent transition-colors duration-150">
        {label}
      </span>
    </label>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

const LANGUAGES = ["Python", "Go", "TypeScript", "Rust", "HCL", "Shell", "C++"];
const ROLE_TYPES = ["Full-time", "Contract", "Both"];

export function TalentPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [talent, setTalent] = useState<ApiTalent[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Read filter state from URL
  const language = searchParams.get("language") ?? "";
  const roleType = searchParams.get("roleType") ?? "";
  const location = searchParams.get("location") ?? "";

  const hasActive = !!(language || roleType || location);

  const fetchTalent = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (language) params.set("language", language);
      if (roleType) params.set("roleType", roleType);
      if (location) params.set("location", location);
      const res = await fetch(`/api/talent?${params.toString()}`);
      const data = await res.json();
      setTalent(data.talent ?? []);
      setTotal(data.total ?? 0);
    } catch {
      setTalent([]);
    } finally {
      setLoading(false);
    }
  }, [language, roleType, location]);

  useEffect(() => { fetchTalent(); }, [fetchTalent]);

  function setParam(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (!value) params.delete(key);
    else params.set(key, value);
    router.replace(`${pathname}?${params.toString()}`);
  }

  function clearAll() {
    router.replace(pathname);
  }

  const filterPanel = (
    <div>
      <FilterSection title="Stack / Language">
        {LANGUAGES.map((lang) => (
          <FilterCheckbox
            key={lang}
            label={lang}
            checked={language === lang}
            onChange={() => setParam("language", language === lang ? null : lang)}
          />
        ))}
      </FilterSection>

      <FilterSection title="Role Type">
        {ROLE_TYPES.map((type) => (
          <FilterCheckbox
            key={type}
            label={type}
            checked={roleType === type}
            onChange={() => setParam("roleType", roleType === type ? null : type)}
          />
        ))}
      </FilterSection>

      <FilterSection title="Location">
        <input
          type="text"
          value={location}
          onChange={(e) => setParam("location", e.target.value || null)}
          placeholder="City, state, or remote"
          className="w-full font-sans text-xs bg-surface border-[1.5px] border-[#E0E0E0] rounded-[6px] px-3 py-2 text-text-primary placeholder:text-text-muted/60 focus:border-accent focus:outline-none transition-colors duration-150"
        />
      </FilterSection>

      {hasActive && (
        <button
          onClick={clearAll}
          className="font-mono text-xs text-text-muted hover:text-accent transition-colors duration-150"
        >
          Clear filters
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-background">

      {/* Page header */}
      <div className="border-b border-[#E0E0E0] bg-surface">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="font-mono font-bold text-3xl text-text-primary mb-2">
            Open to Work
          </h1>
          <p className="font-sans text-sm text-text-muted max-w-xl">
            Engineers and infrastructure specialists actively looking for their next role.
          </p>
          {!loading && (
            <p className="font-mono text-xs text-text-muted mt-3">
              <span className="text-text-primary font-semibold">{total}</span> candidate{total !== 1 ? "s" : ""} available
            </p>
          )}
        </div>
      </div>

      {/* Mobile filter toggle bar */}
      <div className="lg:hidden sticky top-14 z-30 bg-background border-b border-[#E0E0E0] px-4 py-3 flex items-center justify-between">
        <span className="font-mono text-xs text-text-muted">
          <span className="text-text-primary font-semibold">{loading ? "…" : talent.length}</span> shown
        </span>
        <button
          onClick={() => setMobileFiltersOpen(true)}
          className="flex items-center gap-2 font-mono text-xs text-text-primary border-[1.5px] border-[#E0E0E0] rounded-[6px] px-3 py-1.5 hover:border-accent hover:text-accent transition-all duration-150"
        >
          <SlidersHorizontal size={13} />
          Filters
        </button>
      </div>

      {/* Mobile filter drawer */}
      {mobileFiltersOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMobileFiltersOpen(false)} />
          <aside className="relative z-10 w-[300px] bg-surface h-full overflow-y-auto p-6 border-r border-[#E0E0E0] shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <span className="font-mono font-semibold text-sm text-text-primary">Filters</span>
              <button onClick={() => setMobileFiltersOpen(false)} className="text-text-muted hover:text-accent p-1">
                <X size={18} />
              </button>
            </div>
            {filterPanel}
          </aside>
        </div>
      )}

      {/* Page body */}
      <div className="flex">

        {/* Desktop sidebar */}
        <aside className="hidden lg:block w-[280px] flex-shrink-0 border-r border-[#E0E0E0] bg-surface">
          <div className="sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto px-6 py-8">
            <div className="flex items-center gap-2 mb-6">
              <SlidersHorizontal size={13} className="text-text-muted" />
              <span className="font-mono text-[10px] text-text-muted tracking-[0.12em] uppercase">Filters</span>
            </div>
            {filterPanel}
          </div>
        </aside>

        {/* Talent grid */}
        <main className="flex-1 min-w-0 px-5 lg:px-8 py-8">
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 size={24} className="animate-spin text-text-muted" />
            </div>
          ) : talent.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-12 h-12 rounded-full bg-[#E8E4DF] flex items-center justify-center mb-4">
                <SlidersHorizontal size={20} className="text-text-muted" />
              </div>
              <p className="font-mono font-semibold text-sm text-text-primary mb-1">
                No candidates match your filters
              </p>
              <p className="font-sans text-sm text-text-muted mb-5">
                Try broadening your search or clearing filters.
              </p>
              {hasActive && (
                <button
                  onClick={clearAll}
                  className="inline-flex items-center gap-2 px-4 py-2 border-[1.5px] border-[#E0E0E0] rounded-[6px] font-mono text-xs text-text-primary hover:border-accent hover:text-accent transition-all duration-150"
                >
                  Clear all filters
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {talent.map((profile) => (
                <TalentCard key={profile.id} profile={profile} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
