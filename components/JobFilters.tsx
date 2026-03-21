"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  "Data Center Ops",
  "Construction",
  "Electrical",
  "Cooling/HVAC",
  "AI Infrastructure",
  "Networking",
  "Project Management",
];

const JOB_TYPES = ["Full-time", "Contract", "Part-time"];

interface FilterState {
  categories: string[];
  jobTypes: string[];
  remote: boolean;
  salaryMin: string;
  salaryMax: string;
  location: string;
}

const DEFAULT_FILTERS: FilterState = {
  categories: [],
  jobTypes: [],
  remote: false,
  salaryMin: "",
  salaryMax: "",
  location: "",
};

export function JobFilters() {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [saveSearchOpen, setSaveSearchOpen] = useState(false);
  const [alertName, setAlertName] = useState("");
  const [frequency, setFrequency] = useState("daily");

  const toggleCategory = (cat: string) =>
    setFilters((prev) => ({
      ...prev,
      categories: prev.categories.includes(cat)
        ? prev.categories.filter((c) => c !== cat)
        : [...prev.categories, cat],
    }));

  const toggleJobType = (type: string) =>
    setFilters((prev) => ({
      ...prev,
      jobTypes: prev.jobTypes.includes(type)
        ? prev.jobTypes.filter((t) => t !== type)
        : [...prev.jobTypes, type],
    }));

  const hasActive =
    filters.categories.length > 0 ||
    filters.jobTypes.length > 0 ||
    filters.remote ||
    !!filters.salaryMin ||
    !!filters.salaryMax ||
    !!filters.location;

  return (
    <>
      <div className="flex flex-col gap-6">

        {/* CATEGORY */}
        <FilterSection label="Category">
          {CATEGORIES.map((cat) => (
            <FilterCheckbox
              key={cat}
              label={cat}
              checked={filters.categories.includes(cat)}
              onChange={() => toggleCategory(cat)}
            />
          ))}
        </FilterSection>

        {/* JOB TYPE */}
        <FilterSection label="Job Type">
          {JOB_TYPES.map((type) => (
            <FilterCheckbox
              key={type}
              label={type}
              checked={filters.jobTypes.includes(type)}
              onChange={() => toggleJobType(type)}
            />
          ))}
        </FilterSection>

        {/* REMOTE */}
        <FilterSection label="Remote">
          <div className="flex items-center justify-between">
            <span className="font-sans text-sm text-text-primary">Remote-friendly only</span>
            <button
              role="switch"
              aria-checked={filters.remote}
              onClick={() =>
                setFilters((prev) => ({ ...prev, remote: !prev.remote }))
              }
              className={cn(
                "relative inline-flex h-5 w-9 flex-shrink-0 items-center rounded-full transition-colors duration-200",
                filters.remote ? "bg-accent" : "bg-[#E2DDD8]"
              )}
            >
              <span
                className={cn(
                  "inline-block h-[14px] w-[14px] transform rounded-full bg-white shadow-sm transition-transform duration-200",
                  filters.remote ? "translate-x-[18px]" : "translate-x-[3px]"
                )}
              />
            </button>
          </div>
        </FilterSection>

        {/* SALARY RANGE */}
        <FilterSection label="Salary Range">
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <Input
                placeholder="Min $"
                value={filters.salaryMin}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, salaryMin: e.target.value }))
                }
                type="number"
                className="text-xs py-1.5"
              />
            </div>
            <span className="font-mono text-xs text-text-muted">–</span>
            <div className="flex-1">
              <Input
                placeholder="Max $"
                value={filters.salaryMax}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, salaryMax: e.target.value }))
                }
                type="number"
                className="text-xs py-1.5"
              />
            </div>
          </div>
        </FilterSection>

        {/* LOCATION */}
        <FilterSection label="Location">
          <Input
            placeholder="City, state, or zip..."
            value={filters.location}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, location: e.target.value }))
            }
          />
        </FilterSection>

        {/* Footer controls */}
        <div className="flex flex-col gap-2.5 pt-2 border-t border-[#E2DDD8]">
          {hasActive && (
            <button
              onClick={() => setFilters(DEFAULT_FILTERS)}
              className="font-mono text-xs text-text-muted hover:text-accent transition-colors duration-150 text-left"
            >
              Clear all filters
            </button>
          )}
          <Button
            variant="default"
            size="sm"
            className="w-full"
            onClick={() => setSaveSearchOpen(true)}
          >
            Save this search
          </Button>
        </div>
      </div>

      {/* Save Search Modal */}
      <Modal
        open={saveSearchOpen}
        onClose={() => setSaveSearchOpen(false)}
        title="Save this search"
      >
        <div className="flex flex-col gap-4">
          <Input
            label="Alert name"
            placeholder="e.g. Data Center Ops in Dallas"
            value={alertName}
            onChange={(e) => setAlertName(e.target.value)}
          />
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-mono font-medium text-text-primary uppercase tracking-wide">
              Frequency
            </label>
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              className="w-full border-[1.5px] border-[#1E2128] bg-white text-text-primary rounded-[6px] px-3 py-2 text-sm font-sans transition-all duration-150 outline-none focus:border-accent focus:shadow-[0_0_0_3px_rgba(62,207,142,0.15)] appearance-none cursor-pointer"
            >
              <option value="instant">Instant</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
            </select>
          </div>
          <Button variant="primary" size="md" className="w-full mt-1">
            Save Alert
          </Button>
        </div>
      </Modal>
    </>
  );
}

// ─── Sub-components ────────────────────────────────────────────────────────

function FilterSection({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="font-mono text-[10px] text-text-muted tracking-[0.12em] uppercase mb-3">
        {label}
      </p>
      <div className="flex flex-col gap-2">{children}</div>
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
    <label className="flex items-center gap-2.5 cursor-pointer group">
      <input
        type="checkbox"
        className="sr-only peer"
        checked={checked}
        onChange={onChange}
      />
      <div className="w-4 h-4 border-[1.5px] border-[#E2DDD8] rounded-[3px] flex-shrink-0 peer-checked:bg-accent peer-checked:border-accent transition-colors duration-150" />
      <span className="font-sans text-sm text-text-primary group-hover:text-accent transition-colors duration-150 leading-none select-none">
        {label}
      </span>
    </label>
  );
}
