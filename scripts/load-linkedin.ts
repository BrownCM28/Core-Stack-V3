/**
 * Loads 50 relevant data-center / infrastructure jobs from the LinkedIn Job
 * Search API (via RapidAPI) into the CoreStack database.
 *
 * Usage:
 *   npx tsx scripts/load-linkedin.ts
 */

import { config } from "dotenv";
import path from "path";
config({ path: path.resolve(__dirname, "../.env.local") });

import { PrismaClient, JobType, ExperienceLevel } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma  = new PrismaClient({ adapter } as never);

const RAPIDAPI_KEY  = process.env.RAPIDAPI_KEY!;
const RAPIDAPI_HOST = "linkedin-job-search-api.p.rapidapi.com";
const BASE_URL      = `https://${RAPIDAPI_HOST}/active-jb-7d`;

// ─── LinkedIn response types ──────────────────────────────────────────────────

interface LILocation {
  "@type": string;
  address: {
    addressLocality?: string;
    addressRegion?: string;
    addressCountry?: string;
  };
}

interface LIJob {
  id: string;
  title: string;
  organization: string;
  url: string;
  external_apply_url: string | null;
  date_posted: string | null;
  locations_raw: LILocation[] | null;
  locations_derived: string[] | null;
  remote_derived: boolean | null;
  employment_type: string | null;
  salary_raw: {
    minValue?: number;
    maxValue?: number;
    currency?: string;
    unitText?: string;
  } | null;
  description_text: string | null;
  seniority: string | null;
  linkedin_org_industry: string | null;
}

// ─── Title filters (OR-joined, sent as separate API calls for variety) ────────

const TITLE_FILTERS = [
  // Data center & facilities
  '"data center" OR "datacenter" OR "critical facilities"',
  // AI & GPU infra
  '"ai infrastructure" OR "gpu infrastructure" OR "ml infrastructure" OR "machine learning infrastructure"',
  // SRE / Platform / DevOps
  '"site reliability" OR "platform engineer" OR "devops engineer"',
  // Cloud & general infra
  '"infrastructure engineer" OR "cloud infrastructure"',
  // Networking / Electrical / Cooling
  '"network engineer" OR "electrical engineer" OR "cooling engineer" OR "hvac engineer"',
];

// ─── Normalisation helpers ────────────────────────────────────────────────────

const CATEGORY_RULES: [string[], string][] = [
  [["gpu", "cuda", "ai infra", "ml infra", "machine learning infra", "hpc", "nvidia", "ai infrastructure", "gpu infrastructure"], "AI Infrastructure"],
  [["sre", "site reliability", "incident response"], "SRE"],
  [["platform engineer", "platform eng", "developer platform"], "Platform Eng"],
  [["devops", "ci/cd", "gitops", "automation engineer"], "DevOps"],
  [["cloud infra", "cloud infrastructure", "terraform", "kubernetes"], "Cloud Infra"],
  [["network engineer", "network architect", "routing", "bgp", "fiber"], "Networking"],
  [["electrical engineer", "power systems", "ups", "switchgear", "generator", "high voltage"], "Electrical"],
  [["cooling", "hvac", "crac", "crah", "chiller", "thermal"], "Cooling/HVAC"],
  [["construction manager", "commissioning", "turnover", "civil"], "Construction"],
  [["facilities manager", "critical facilities", "building operations", "dcim"], "Facilities"],
  [["project manager", "program manager", "pmo"], "Project Management"],
  [["data center", "datacenter", "colocation", "colo", "raised floor"], "Data Center Ops"],
];

function inferCategory(title: string, desc: string): string {
  const hay = `${title} ${desc}`.toLowerCase();
  for (const [kws, cat] of CATEGORY_RULES) {
    if (kws.some((kw) => hay.includes(kw))) return cat;
  }
  return "Cloud Infra";
}

function normalizeJobType(raw: string | string[] | null | undefined): JobType {
  if (!raw) return JobType.FULL_TIME;
  const val = Array.isArray(raw) ? (raw[0] ?? "") : raw;
  const s = val.toLowerCase().replace(/[-_\s]/g, "");
  if (s.includes("contract") || s.includes("temp") || s.includes("freelan")) return JobType.CONTRACT;
  return JobType.FULL_TIME;
}

function normalizeLevel(title: string, seniority: string | null): ExperienceLevel {
  const s = `${title} ${seniority ?? ""}`.toLowerCase();
  if (/(principal|staff engineer|distinguished)/.test(s)) return ExperienceLevel.PRINCIPAL;
  if (/(director|vp |vice president|head of)/.test(s))    return ExperienceLevel.PRINCIPAL;
  if (/(lead|tech lead|engineering lead)/.test(s))         return ExperienceLevel.LEAD;
  if (/(senior|sr\.|sr |mid-senior)/.test(s))              return ExperienceLevel.SENIOR;
  if (/(junior|jr\.|entry[ -]level|associate|intern)/.test(s)) return ExperienceLevel.ENTRY;
  return ExperienceLevel.MID;
}

const TAG_KEYWORDS = [
  "terraform", "kubernetes", "k8s", "ansible", "aws", "gcp", "azure",
  "python", "go", "typescript", "rust", "grafana", "prometheus",
  "docker", "pdu", "ups", "generator", "crac", "crah", "bgp",
  "nvidia", "cuda", "gpu", "mlops", "vmware",
];

function buildLocation(job: LIJob): string {
  // Prefer the first derived location string
  if (job.locations_derived?.length) return job.locations_derived[0];
  // Fall back to structured address
  const addr = job.locations_raw?.[0]?.address;
  if (addr) {
    return [addr.addressLocality, addr.addressRegion, addr.addressCountry]
      .filter(Boolean)
      .join(", ");
  }
  return job.remote_derived ? "Remote" : "Unknown";
}

function annualiseSalary(raw: LIJob["salary_raw"]): { min: number | null; max: number | null } {
  if (!raw) return { min: null, max: null };
  // unitText can be "YEAR", "MONTH", "HOUR", "WEEK"
  const mult = raw.unitText === "HOUR" ? 2080
             : raw.unitText === "MONTH" ? 12
             : raw.unitText === "WEEK" ? 52
             : 1;
  return {
    min: raw.minValue != null ? Math.round(raw.minValue * mult) : null,
    max: raw.maxValue != null ? Math.round(raw.maxValue * mult) : null,
  };
}

// ─── Relevance filter (title must match one of our core categories) ───────────

const RELEVANCE_RE =
  /data.?cent(er|re)|ai infra|gpu infra|ml infra|machine learning infra|site reliability|sre|platform.?eng|devops|cloud infra|infrastructure.?eng|network.?eng|electrical.?eng|cooling|hvac|critical.?facil|colocation|colo|construction.?manag|facilities.?manag|commissioning/i;

function isRelevant(title: string): boolean {
  return RELEVANCE_RE.test(title);
}

// ─── API fetch ────────────────────────────────────────────────────────────────

async function fetchJobs(titleFilter: string, offset = 0): Promise<LIJob[]> {
  const url = new URL(BASE_URL);
  url.searchParams.set("limit", "100");
  url.searchParams.set("offset", String(offset));
  url.searchParams.set("description_type", "text");
  url.searchParams.set("title_filter", titleFilter);

  const res = await fetch(url.toString(), {
    headers: {
      "Content-Type": "application/json",
      "x-rapidapi-host": RAPIDAPI_HOST,
      "x-rapidapi-key": RAPIDAPI_KEY,
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`API ${res.status}: ${text.slice(0, 200)}`);
  }

  const data = await res.json() as LIJob[] | { message: string };
  if (!Array.isArray(data)) throw new Error(`Unexpected response: ${JSON.stringify(data).slice(0, 200)}`);
  return data;
}

// ─── DB insert ────────────────────────────────────────────────────────────────

async function insertJob(job: LIJob): Promise<"inserted" | "skipped" | "irrelevant"> {
  if (!isRelevant(job.title)) return "irrelevant";

  const description = job.description_text?.trim() ?? "";
  if (description.length < 80) return "skipped"; // too sparse

  const applyUrl  = job.external_apply_url ?? job.url;
  const company   = (job.organization ?? "Unknown").trim();
  const location  = buildLocation(job);
  const title     = job.title.trim();

  // Dedup by applyUrl first, then title+company+location
  const existing = await prisma.job.findFirst({
    where: applyUrl
      ? { applyUrl }
      : {
          title:    { equals: title,    mode: "insensitive" },
          company:  { equals: company,  mode: "insensitive" },
          location: { equals: location, mode: "insensitive" },
        },
    select: { id: true },
  });
  if (existing) return "skipped";

  const postedAt  = job.date_posted ? new Date(job.date_posted) : new Date();
  const expiresAt = new Date(postedAt);
  expiresAt.setDate(expiresAt.getDate() + 30);

  const { min: salaryMin, max: salaryMax } = annualiseSalary(job.salary_raw);
  const category = inferCategory(title, description);
  const remote   = job.remote_derived ?? /\bremote\b/i.test(location);
  const tags     = TAG_KEYWORDS.filter((kw) => description.toLowerCase().includes(kw)).slice(0, 8);

  await prisma.job.create({
    data: {
      title,
      company,
      location,
      description,
      applyUrl,
      type:             normalizeJobType(job.employment_type),
      level:            normalizeLevel(title, job.seniority),
      category,
      remote,
      salary:           null,
      salaryMin,
      salaryMax,
      tags,
      responsibilities: [],
      requirements:     [],
      source:           "LinkedIn",
      isActive:         true,
      featured:         false,
      paymentStatus:    "free",
      postedAt,
      expiresAt,
    },
  });

  return "inserted";
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  if (!RAPIDAPI_KEY) { console.error("RAPIDAPI_KEY not set in .env.local"); process.exit(1); }

  const TARGET = 50;
  let inserted = 0, skipped = 0, irrelevant = 0, errors = 0;
  const seenIds = new Set<string>();

  console.log(`\nCoreStack — LinkedIn Jobs Loader`);
  console.log(`Target: ${TARGET} jobs\n`);

  outer:
  for (const [fi, filter] of TITLE_FILTERS.entries()) {
    console.log(`Filter ${fi + 1}/${TITLE_FILTERS.length}: ${filter}`);

    for (const offset of [0, 100]) {
      if (inserted >= TARGET) break outer;

      let jobs: LIJob[];
      try {
        jobs = await fetchJobs(filter, offset);
      } catch (err) {
        console.error(`  ✗ fetch error: ${(err as Error).message}`);
        break;
      }

      console.log(`  offset=${offset} → ${jobs.length} results`);
      if (jobs.length === 0) break;

      for (const job of jobs) {
        if (inserted >= TARGET) break outer;
        if (seenIds.has(job.id)) continue;
        seenIds.add(job.id);

        let outcome: string;
        try {
          outcome = await insertJob(job);
        } catch (err) {
          console.error(`  ✗ ${job.title}: ${(err as Error).message}`);
          errors++;
          continue;
        }

        if (outcome === "inserted") {
          inserted++;
          const cat = inferCategory(job.title, job.description_text ?? "");
          process.stdout.write(`  [${String(inserted).padStart(2)}] ✓ ${job.title} — ${job.organization}  [${cat}]\n`);
        } else if (outcome === "irrelevant") {
          irrelevant++;
        } else {
          skipped++;
        }
      }
    }
  }

  console.log(`\n─────────────────────────────────`);
  console.log(`Inserted       : ${inserted}`);
  console.log(`Skipped (dedup): ${skipped}`);
  console.log(`Irrelevant     : ${irrelevant}`);
  console.log(`Errors         : ${errors}`);
  console.log(`─────────────────────────────────\n`);

  await prisma.$disconnect();
}

main().catch((err) => { console.error(err); prisma.$disconnect(); process.exit(1); });
