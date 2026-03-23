"use client";

import { useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { useState } from "react";

const CATEGORIES = [
  "Cloud Infra",
  "Data Center Ops",
  "SRE",
  "Platform Eng",
  "DevOps",
  "Networking",
  "Facilities",
  "Construction",
  "Electrical",
  "Cooling/HVAC",
  "Project Management",
];

const JOB_TYPES = ["Full-time", "Contract"];

export function JobFilters() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [saveSearchOpen, setSaveSearchOpen] = useState(false);
  const [alertName, setAlertName] = useState("");
  const [frequency, setFrequency] = useState("daily");

  const selectedCategories = searchParams.getAll("category");
  const selectedJobTypes = searchParams.getAll("jobType");
  const remote = searchParams.get("remote") === "true";
  const salaryMin = searchParams.get("salaryMin") ?? "";
  const salaryMax = searchParams.get("salaryMax") ?? "";
  const location = searchParams.get("location") ?? "";

  const push = useCallback(
    (params: URLSearchParams) => {
      params.delete("page");
      router.replace(`${pathname}?${params.toString()}`);
    },
    [router, pathname]
  );

  function toggleMulti(key: string, value: string) {
    const current = searchParams.getAll(key);
    const params = new URLSearchParams(searchParams.toString());
    params.delete(key);
    if (current.includes(value)) {
      current.filter((v) => v !== value).forEach((v) => params.append(key, v));
    } else {
      [...current, value].forEach((v) => params.append(key, v));
    }
    push(params);
  }

  function setParam(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === null || value === "") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    push(params);
  }

  function clearAll() {
    router.replace(pathname);
  }

  const hasActive =
    selectedCategories.length > 0 ||
    selectedJobTypes.length > 0 ||
    remote ||
    !!salaryMin ||
    !!salaryMax ||
    !!location;

  return (
    <>
      <div className="flex flex-col gap-6">

        {/* CATEGORY */}
        <FilterSection label="Category">
          {CATEGORIES.map((cat) => (
            <FilterCheckbox
              key={cat}
              label={cat}
              checked={selectedCategories.includes(cat)}
              onChange={() => toggleMulti("category", cat)}
            />
          ))}
        </FilterSection>

        {/* JOB TYPE */}
        <FilterSection label="Job Type">
          {JOB_TYPES.map((type) => (
            <FilterCheckbox
              key={type}
              label={type}
              checked={selectedJobTypes.includes(type)}
              onChange={() => toggleMulti("jobType", type)}
            />
          ))}
        </FilterSection>

        {/* REMOTE */}
        <FilterSection label="Remote">
          <div className="flex items-center justify-between">
            <span className="font-sans text-sm text-text-primary">Remote-friendly only</span>
            <button
              role="switch"
              aria-checked={remote}
              onClick={() => setParam("remote", remote ? null : "true")}
              className={cn(
                "relative inline-flex h-5 w-9 flex-shrink-0 items-center rounded-full transition-colors duration-200",
                remote ? "bg-accent" : "bg-[#E2DDD8]"
              )}
            >
              <span
                className={cn(
                  "inline-block h-[14px] w-[14px] transform rounded-full bg-white shadow-sm transition-transform duration-200",
                  remote ? "translate-x-[18px]" : "translate-x-[3px]"
                )}
              />
            </button>
          </div>
        </FilterSection>

        {/* SALARY RANGE */}
        <FilterSection label="Salary Range (k)">
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <Input
                placeholder="Min"
                value={salaryMin}
                onChange={(e) => setParam("salaryMin", e.target.value)}
                onBlur={(e) => setParam("salaryMin", e.target.value)}
                type="number"
                className="text-xs py-1.5"
              />
            </div>
            <span className="font-mono text-xs text-text-muted">–</span>
            <div className="flex-1">
              <Input
                placeholder="Max"
                value={salaryMax}
                onChange={(e) => setParam("salaryMax", e.target.value)}
                onBlur={(e) => setParam("salaryMax", e.target.value)}
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
            value={location}
            onChange={(e) => setParam("location", e.target.value)}
          />
        </FilterSection>

        {/* Footer controls */}
        <div className="flex flex-col gap-2.5 pt-2 border-t border-[#E2DDD8]">
          {hasActive && (
            <button
              onClick={clearAll}
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
            placeholder="e.g. Cloud Infra — Remote"
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
