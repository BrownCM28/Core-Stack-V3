import { z } from "zod";
import { JobType, ExperienceLevel } from "@prisma/client";
import type { Prisma } from "@prisma/client";
import { sanitizeText, sanitizeHtml } from "@/lib/sanitize";

// ─── Validation schema ────────────────────────────────────────────────────────

export const IncomingJobSchema = z.object({
  title: z.string().min(1, "title required"),
  company: z.string().min(1, "company required"),
  location: z.string().min(1, "location required"),
  description: z.string().min(1, "description required"),
  applyUrl: z.string().url("applyUrl must be a valid URL").optional().nullable(),
  jobType: z.string().optional().nullable(),
  level: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
  salaryMin: z.number().int().positive().optional().nullable(),
  salaryMax: z.number().int().positive().optional().nullable(),
  salary: z.string().optional().nullable(),
  remote: z.boolean().optional().nullable(),
  tags: z.array(z.string()).optional().nullable(),
  responsibilities: z.array(z.string()).optional().nullable(),
  requirements: z.array(z.string()).optional().nullable(),
  postedAt: z.string().optional().nullable(),
  source: z.string().optional().nullable(),
});

export type IncomingJobInput = z.infer<typeof IncomingJobSchema>;

// ─── Category inference ───────────────────────────────────────────────────────

const CATEGORY_RULES: [string[], string][] = [
  [["gpu", "cuda", "ai infra", "ml infra", "machine learning infrastructure", "hpc cluster", "nvidia"], "AI Infrastructure"],
  [["sre", "site reliability", "incident response", "on-call", "oncall"], "SRE"],
  [["platform engineer", "platform eng", "developer platform", "internal developer", "golden path"], "Platform Eng"],
  [["devops", "ci/cd", "gitops", "automation engineer", "infrastructure engineer"], "DevOps"],
  [["cloud infra", "cloud infrastructure", "aws architect", "gcp architect", "azure architect", "terraform", "kubernetes"], "Cloud Infra"],
  [["network engineer", "network architect", "routing", "switching", "bgp", "fiber", "wan", "lan"], "Networking"],
  [["electrical engineer", "power systems", "ups", "switchgear", "generator", "hv/lv", "high voltage", "low voltage"], "Electrical"],
  [["cooling", "hvac", "crac", "crah", "chiller", "thermal", "airflow"], "Cooling/HVAC"],
  [["construction manager", "commissioning", "turnover", "building engineer", "civil"], "Construction"],
  [["facilities manager", "facility manager", "critical facilities", "building operations", "dcim"], "Facilities"],
  [["project manager", "program manager", "pmo", "project lead"], "Project Management"],
  [["data center", "datacenter", "colocation", "colo", "raised floor", "server room", "cage"], "Data Center Ops"],
];

export function inferCategory(title: string, description: string): string {
  const haystack = `${title} ${description}`.toLowerCase();
  for (const [keywords, category] of CATEGORY_RULES) {
    if (keywords.some((kw) => haystack.includes(kw))) return category;
  }
  return "Cloud Infra"; // sensible default for infra roles
}

// ─── Job type normalisation ───────────────────────────────────────────────────

export function normalizeJobType(raw?: string | null): JobType {
  if (!raw) return JobType.FULL_TIME;
  const s = raw.toLowerCase().replace(/[-_\s]/g, "");
  if (s.includes("contract") || s.includes("freelanc") || s.includes("temp")) return JobType.CONTRACT;
  if (s.includes("both") || s.includes("eithe") || s.includes("fullcontract")) return JobType.BOTH;
  return JobType.FULL_TIME;
}

// ─── Experience level normalisation ──────────────────────────────────────────

export function normalizeLevel(title: string, raw?: string | null): ExperienceLevel {
  const s = `${title} ${raw ?? ""}`.toLowerCase();
  if (/(principal|staff engineer|distinguished)/.test(s)) return ExperienceLevel.PRINCIPAL;
  if (/(lead|tech lead|engineering lead)/.test(s)) return ExperienceLevel.LEAD;
  if (/(senior|sr\.|sr )/.test(s)) return ExperienceLevel.SENIOR;
  if (/(junior|jr\.|jr |entry[ -]level|associate|intern)/.test(s)) return ExperienceLevel.ENTRY;
  return ExperienceLevel.MID;
}

// ─── Main mapper ──────────────────────────────────────────────────────────────
export function mapIncomingJob(
  raw: IncomingJobInput
): Prisma.JobUncheckedCreateInput {
  const postedAt = raw.postedAt ? new Date(raw.postedAt) : new Date();
  const expiresAt = new Date(postedAt);
  expiresAt.setDate(expiresAt.getDate() + 30);
  // ── Sanitize user-supplied text ───────────────────────────────────────────
  const title       = sanitizeText(raw.title);
  const company     = sanitizeText(raw.company);
  const location    = sanitizeText(raw.location);
  const description = sanitizeHtml(raw.description);  // preserve formatting
  // ─────────────────────────────────────────────────────────────────────────
  const category =
    (raw.category && raw.category.trim()) ||
    inferCategory(title, description);
  const remote =
    raw.remote != null
      ? raw.remote
      : /\bremote\b/i.test(location);
  const TAG_KEYWORDS = [
    "terraform", "kubernetes", "k8s", "ansible", "aws", "gcp", "azure",
    "python", "go", "typescript", "rust", "grafana", "prometheus",
    "docker", "pdu", "ups", "generator", "crac", "crah", "bgp",
    "nvidia", "cuda", "gpu", "mlops",
  ];
  const autoTags = raw.tags?.length
    ? raw.tags.map((t) => sanitizeText(t))
    : TAG_KEYWORDS.filter((kw) =>
        description.toLowerCase().includes(kw)
      ).slice(0, 8);
  return {
    title,
    company,
    location,
    description,
    applyUrl: raw.applyUrl ?? null,
    type: normalizeJobType(raw.jobType),
    level: normalizeLevel(title, raw.level),
    category,
    remote,
    salary: raw.salary ? sanitizeText(raw.salary) : null,
    salaryMin: raw.salaryMin ?? null,
    salaryMax: raw.salaryMax ?? null,
    tags: autoTags,
    responsibilities: (raw.responsibilities ?? []).map(sanitizeText),
    requirements: (raw.requirements ?? []).map(sanitizeText),
    source: raw.source ?? "webhook",
    isActive: true,
    featured: false,
    postedAt,
    expiresAt,
  };
}
