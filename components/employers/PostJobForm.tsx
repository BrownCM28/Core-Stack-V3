"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { Check, ChevronRight, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Constants ────────────────────────────────────────────────────────────────

const CATEGORIES = [
  "AI Infrastructure",
  "Cloud Infra",
  "Data Center Ops",
  "DevOps",
  "Networking",
  "Platform Eng",
  "SRE",
] as const;

const JOB_TYPES = ["Full-time", "Contract", "Part-time", "Remote"] as const;

const STANDARD_FEATURES = [
  "30-day listing duration",
  "Listed in main job feed",
  "Candidate applications tracked",
  "Email notifications on apply",
  "Standard search placement",
];

const FEATURED_FEATURES = [
  "Everything in Standard",
  "Pinned above standard listings",
  "Emerald featured badge",
  "Priority in alert emails",
  "Company logo displayed",
];

type Tier = "standard" | "featured";

// ─── Zod validation ───────────────────────────────────────────────────────────

const Step1Schema = z.object({
  title: z.string().min(1, "Title is required"),
  company: z.string().min(1, "Company is required"),
  location: z.string().min(1, "Location is required"),
  jobType: z.string().min(1, "Job type is required"),
  category: z.string().min(1, "Category is required"),
  description: z.string().min(100, "Description must be at least 100 characters"),
  applyUrl: z.string().url("Must be a valid URL (include https://)"),
  salaryMin: z.union([z.literal(""), z.string().regex(/^\d+$/, "Must be a number")]),
  salaryMax: z.union([z.literal(""), z.string().regex(/^\d+$/, "Must be a number")]),
});

// ─── Sub-components ───────────────────────────────────────────────────────────

function ProgressBar({ step }: { step: 1 | 2 | 3 }) {
  const steps = ["Job Details", "Listing Type", "Review"];
  return (
    <div className="flex items-center gap-0 mb-10">
      {steps.map((label, i) => {
        const n = i + 1;
        const done = step > n;
        const active = step === n;
        return (
          <div key={label} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center font-mono font-bold text-xs border-[1.5px] transition-colors",
                  done
                    ? "bg-accent border-black text-[#0D0F12]"
                    : active
                    ? "bg-[#0D0F12] border-black text-white"
                    : "bg-surface border-[#E2DDD8] text-text-muted"
                )}
              >
                {done ? <Check size={13} /> : n}
              </div>
              <span
                className={cn(
                  "mt-1.5 font-mono text-[10px] tracking-wide whitespace-nowrap",
                  active ? "text-text-primary font-semibold" : "text-text-muted"
                )}
              >
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={cn(
                  "flex-1 h-[1.5px] mb-5 mx-2",
                  done ? "bg-accent" : "bg-[#E2DDD8]"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p className="mt-1 font-sans text-xs text-red-500">{msg}</p>;
}

function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block font-mono text-xs font-semibold text-text-primary mb-1.5">
      {children}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
  );
}

const inputCls =
  "w-full px-3 py-2.5 bg-surface border-[1.5px] border-[#E2DDD8] rounded-[6px] font-sans text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent focus:shadow-[0_0_0_2px_rgba(62,207,142,0.15)] transition-all";

// ─── Steps ───────────────────────────────────────────────────────────────────

interface Step1Data {
  title: string;
  company: string;
  location: string;
  jobType: string;
  category: string;
  description: string;
  applyUrl: string;
  salaryMin: string;
  salaryMax: string;
}

function Step1(props: {
  data: Step1Data;
  onChange: (d: Step1Data) => void;
  onNext: () => void;
}) {
  const [errors, setErrors] = useState<Partial<Record<keyof Step1Data, string>>>({});

  function set<K extends keyof Step1Data>(k: K, v: Step1Data[K]) {
    props.onChange({ ...props.data, [k]: v });
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  }

  function validate() {
    const result = Step1Schema.safeParse(props.data);
    if (result.success) {
      setErrors({});
      return true;
    }
    const errs: Partial<Record<keyof Step1Data, string>> = {};
    for (const issue of result.error.issues) {
      const key = issue.path[0] as keyof Step1Data;
      if (!errs[key]) errs[key] = issue.message;
    }
    setErrors(errs);
    return false;
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Row 1 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <Label required>Job Title</Label>
          <input
            className={inputCls}
            placeholder="e.g. Senior SRE"
            value={props.data.title}
            onChange={(e) => set("title", e.target.value)}
          />
          <FieldError msg={errors.title} />
        </div>
        <div>
          <Label required>Company</Label>
          <input
            className={inputCls}
            placeholder="e.g. Equinix"
            value={props.data.company}
            onChange={(e) => set("company", e.target.value)}
          />
          <FieldError msg={errors.company} />
        </div>
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <Label required>Location</Label>
          <input
            className={inputCls}
            placeholder="e.g. Austin, TX or Remote"
            value={props.data.location}
            onChange={(e) => set("location", e.target.value)}
          />
          <FieldError msg={errors.location} />
        </div>
        <div>
          <Label required>Job Type</Label>
          <select
            className={inputCls}
            value={props.data.jobType}
            onChange={(e) => set("jobType", e.target.value)}
          >
            <option value="">Select type…</option>
            {JOB_TYPES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
          <FieldError msg={errors.jobType} />
        </div>
      </div>

      {/* Row 3 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <Label required>Category</Label>
          <select
            className={inputCls}
            value={props.data.category}
            onChange={(e) => set("category", e.target.value)}
          >
            <option value="">Select category…</option>
            {CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <FieldError msg={errors.category} />
        </div>
        <div>
          <Label required>Apply URL</Label>
          <input
            className={inputCls}
            placeholder="https://yourcompany.com/jobs/123"
            value={props.data.applyUrl}
            onChange={(e) => set("applyUrl", e.target.value)}
          />
          <FieldError msg={errors.applyUrl} />
        </div>
      </div>

      {/* Salary */}
      <div className="grid grid-cols-2 gap-5">
        <div>
          <Label>Salary Min (USD)</Label>
          <input
            className={inputCls}
            type="number"
            placeholder="e.g. 120000"
            value={props.data.salaryMin}
            onChange={(e) => set("salaryMin", e.target.value)}
          />
          <FieldError msg={errors.salaryMin} />
        </div>
        <div>
          <Label>Salary Max (USD)</Label>
          <input
            className={inputCls}
            type="number"
            placeholder="e.g. 160000"
            value={props.data.salaryMax}
            onChange={(e) => set("salaryMax", e.target.value)}
          />
          <FieldError msg={errors.salaryMax} />
        </div>
      </div>

      {/* Description */}
      <div>
        <Label required>Description</Label>
        <textarea
          className={cn(inputCls, "min-h-[160px] resize-y")}
          placeholder="Describe the role, responsibilities, and requirements (min 100 characters)"
          value={props.data.description}
          onChange={(e) => set("description", e.target.value)}
        />
        <div className="flex items-start justify-between mt-1">
          <FieldError msg={errors.description} />
          <span
            className={cn(
              "font-mono text-[10px] ml-auto",
              props.data.description.length < 100 ? "text-text-muted" : "text-accent"
            )}
          >
            {props.data.description.length} / 100 min
          </span>
        </div>
      </div>

      <button
        onClick={() => validate() && props.onNext()}
        className="self-end inline-flex items-center gap-2 px-6 py-2.5 bg-accent border-[1.5px] border-black text-[#0D0F12] font-mono font-semibold text-sm rounded-[6px] hover:bg-[#34C47E] hover:shadow-[0_0_16px_rgba(62,207,142,0.25)] transition-all"
      >
        Next — Listing Type
        <ChevronRight size={14} />
      </button>
    </div>
  );
}

function Step2(props: {
  selected: Tier;
  onChange: (t: Tier) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {(["standard", "featured"] as Tier[]).map((tier) => {
          const isFeature = tier === "featured";
          const price = isFeature ? 249 : 99;
          const features = isFeature ? FEATURED_FEATURES : STANDARD_FEATURES;
          const selected = props.selected === tier;
          return (
            <button
              key={tier}
              onClick={() => props.onChange(tier)}
              className={cn(
                "relative text-left bg-surface rounded-[8px] p-7 flex flex-col border-[2px] transition-all duration-150",
                selected
                  ? "border-accent shadow-[0_0_0_1px_#3ECF8E,0_0_24px_rgba(62,207,142,0.15)]"
                  : isFeature
                  ? "border-[#E2DDD8] hover:border-accent/50"
                  : "border-[#E2DDD8] hover:border-accent/50"
              )}
            >
              {isFeature && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="font-mono text-[10px] font-bold text-[#0D0F12] bg-accent px-3 py-1 rounded-full border border-black uppercase tracking-[0.08em] whitespace-nowrap">
                    Most Popular
                  </span>
                </div>
              )}
              {selected && (
                <div className="absolute top-4 right-4 w-5 h-5 bg-accent rounded-full flex items-center justify-center border border-black">
                  <Check size={11} />
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
              <ul className="flex flex-col gap-2.5 flex-1">
                {features.map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-2.5 font-sans text-sm text-text-primary"
                  >
                    <Check size={14} className="text-accent flex-shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between">
        <button
          onClick={props.onBack}
          className="font-mono text-sm text-text-muted hover:text-text-primary transition-colors"
        >
          ← Back
        </button>
        <button
          onClick={props.onNext}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-accent border-[1.5px] border-black text-[#0D0F12] font-mono font-semibold text-sm rounded-[6px] hover:bg-[#34C47E] hover:shadow-[0_0_16px_rgba(62,207,142,0.25)] transition-all"
        >
          Next — Review
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 py-3 border-b border-[#E2DDD8] last:border-0">
      <span className="font-mono text-xs text-text-muted w-32 flex-shrink-0">{label}</span>
      <span className="font-sans text-sm text-text-primary text-right">{value}</span>
    </div>
  );
}

function Step3(props: {
  jobData: Step1Data;
  tier: Tier;
  onBack: () => void;
  onSubmit: () => Promise<void>;
  submitting: boolean;
}) {
  const price = props.tier === "featured" ? "$249" : "$99";
  const tierLabel = props.tier === "featured" ? "Featured Listing" : "Standard Listing";
  const { jobData } = props;

  return (
    <div className="flex flex-col gap-6">
      {/* Job summary */}
      <div className="bg-surface border-[1.5px] border-[#E2DDD8] rounded-[8px] px-6">
        <p className="font-mono text-[10px] text-text-muted tracking-[0.12em] uppercase py-4 border-b border-[#E2DDD8]">
          Job Details
        </p>
        <ReviewRow label="Title" value={jobData.title} />
        <ReviewRow label="Company" value={jobData.company} />
        <ReviewRow label="Location" value={jobData.location} />
        <ReviewRow label="Job Type" value={jobData.jobType} />
        <ReviewRow label="Category" value={jobData.category} />
        <ReviewRow label="Apply URL" value={jobData.applyUrl} />
        {(jobData.salaryMin || jobData.salaryMax) && (
          <ReviewRow
            label="Salary"
            value={[
              jobData.salaryMin ? `$${Number(jobData.salaryMin).toLocaleString()}` : null,
              jobData.salaryMax ? `$${Number(jobData.salaryMax).toLocaleString()}` : null,
            ]
              .filter(Boolean)
              .join(" – ")}
          />
        )}
      </div>

      {/* Tier + price */}
      <div className="bg-surface border-[1.5px] border-[#E2DDD8] rounded-[8px] px-6">
        <p className="font-mono text-[10px] text-text-muted tracking-[0.12em] uppercase py-4 border-b border-[#E2DDD8]">
          Order Summary
        </p>
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-2">
            {props.tier === "featured" && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-accent/10 border border-accent/30 rounded font-mono text-[10px] text-accent font-semibold uppercase tracking-wide">
                <Zap size={10} /> Featured
              </span>
            )}
            <span className="font-sans text-sm text-text-primary">{tierLabel} – 30 days</span>
          </div>
          <span className="font-mono font-bold text-lg text-text-primary">{price}</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <button
          onClick={props.onBack}
          className="font-mono text-sm text-text-muted hover:text-text-primary transition-colors"
          disabled={props.submitting}
        >
          ← Back
        </button>
        <button
          onClick={props.onSubmit}
          disabled={props.submitting}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-accent border-[1.5px] border-black text-[#0D0F12] font-mono font-semibold text-sm rounded-[6px] hover:bg-[#34C47E] hover:shadow-[0_0_16px_rgba(62,207,142,0.25)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {props.submitting ? "Redirecting…" : `Proceed to Payment — ${price}`}
          {!props.submitting && <ChevronRight size={14} />}
        </button>
      </div>
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

const DEFAULT_JOB: Step1Data = {
  title: "",
  company: "",
  location: "",
  jobType: "",
  category: "",
  description: "",
  applyUrl: "",
  salaryMin: "",
  salaryMax: "",
};

export function PostJobForm() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [jobData, setJobData] = useState<Step1Data>(DEFAULT_JOB);
  const [tier, setTier] = useState<Tier>("standard");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  async function handleSubmit() {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tier,
          jobData: {
            ...jobData,
            salaryMin: jobData.salaryMin ? Number(jobData.salaryMin) : null,
            salaryMax: jobData.salaryMax ? Number(jobData.salaryMax) : null,
            jobType: jobData.jobType,
          },
        }),
      });

      if (res.status === 401) {
        router.push("/auth/login?redirect=/employers/post");
        return;
      }

      const data = await res.json();
      if (!res.ok || !data.checkoutUrl) {
        setSubmitError(data.error ?? "Something went wrong. Please try again.");
        return;
      }

      window.location.href = data.checkoutUrl;
    } catch {
      setSubmitError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <p className="font-mono text-[10px] text-text-muted tracking-[0.12em] uppercase mb-2">
            Post a Job
          </p>
          <h1 className="font-mono font-bold text-2xl text-text-primary">
            Create your listing
          </h1>
        </div>

        <ProgressBar step={step} />

        {submitError && (
          <div className="mb-6 px-4 py-3 bg-red-50 border border-red-200 rounded-[6px]">
            <p className="font-sans text-sm text-red-600">{submitError}</p>
          </div>
        )}

        {step === 1 && (
          <Step1
            data={jobData}
            onChange={setJobData}
            onNext={() => setStep(2)}
          />
        )}
        {step === 2 && (
          <Step2
            selected={tier}
            onChange={setTier}
            onNext={() => setStep(3)}
            onBack={() => setStep(1)}
          />
        )}
        {step === 3 && (
          <Step3
            jobData={jobData}
            tier={tier}
            onBack={() => setStep(2)}
            onSubmit={handleSubmit}
            submitting={submitting}
          />
        )}
      </div>
    </div>
  );
}
