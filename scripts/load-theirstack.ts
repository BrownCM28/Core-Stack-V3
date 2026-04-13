/**
 * One-shot bulk loader — fetches up to 200 jobs from Theirstack (last 14 days)
 * and inserts them into the CoreStack DB.
 *
 * Usage:
 *   npx tsx scripts/load-theirstack.ts
 */

import { config } from "dotenv";
import path from "path";

// Load .env.local before anything else
config({ path: path.resolve(__dirname, "../.env.local") });

import { PrismaClient, JobType, ExperienceLevel } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const adapter = new PrismaPg(pool as any);
const prisma = new PrismaClient({ adapter });

const BASE_URL = "https://api.theirstack.com/v1";
const API_KEY = process.env.THEIRSTACK_API_KEY ?? "";

// ─── Theirstack types ─────────────────────────────────────────────────────────

interface TSJob {
  id: number;
  job_title: string;
  company_object: { name: string } | null;
  company: string | null;
  city: string | null;
  country: string | null;
  employment_type: string | null;
  min_annual_salary: number | null;
  max_annual_salary: number | null;
  description: string | null;
  final_url: string | null;
  apply_url: string | null;
  posted_at: string | null;
  remote: boolean | null;
}

// ─── Category inference ───────────────────────────────────────────────────────

const CATEGORY_RULES: [string[], string][] = [
  [["gpu", "cuda", "ai infra", "ml infra", "machine learning infra", "hpc cluster", "nvidia", "ai infrastructure"], "AI Infrastructure"],
  [["sre", "site reliability", "incident response", "on-call", "oncall"], "SRE"],
  [["platform engineer", "platform eng", "developer platform", "internal developer"], "Platform Eng"],
  [["devops", "ci/cd", "gitops", "automation engineer"], "DevOps"],
  [["cloud infra", "cloud infrastructure", "aws architect", "gcp architect", "azure architect", "terraform", "kubernetes"], "Cloud Infra"],
  [["network engineer", "network architect", "routing", "switching", "bgp", "fiber", "wan", "lan"], "Networking"],
  [["electrical engineer", "power systems", "ups", "switchgear", "generator", "hv/lv", "high voltage"], "Electrical"],
  [["cooling", "hvac", "crac", "crah", "chiller", "thermal", "airflow"], "Cooling/HVAC"],
  [["construction manager", "commissioning", "turnover", "building engineer", "civil"], "Construction"],
  [["facilities manager", "facility manager", "critical facilities", "building operations", "dcim"], "Facilities"],
  [["project manager", "program manager", "pmo", "project lead"], "Project Management"],
  [["data center", "datacenter", "colocation", "colo", "raised floor", "server room"], "Data Center Ops"],
];

function inferCategory(title: string, description: string): string {
  const hay = `${title} ${description}`.toLowerCase();
  for (const [kws, cat] of CATEGORY_RULES) {
    if (kws.some((kw) => hay.includes(kw))) return cat;
  }
  return "Cloud Infra";
}

function normalizeJobType(raw?: string | null): JobType {
  if (!raw) return JobType.FULL_TIME;
  const s = raw.toLowerCase().replace(/[-_\s]/g, "");
  if (s.includes("contract") || s.includes("freelanc") || s.includes("temp")) return JobType.CONTRACT;
  return JobType.FULL_TIME;
}

function normalizeLevel(title: string): ExperienceLevel {
  const s = title.toLowerCase();
  if (/(principal|staff engineer|distinguished)/.test(s)) return ExperienceLevel.PRINCIPAL;
  if (/(lead|tech lead|engineering lead)/.test(s)) return ExperienceLevel.LEAD;
  if (/(senior|sr\.|sr )/.test(s)) return ExperienceLevel.SENIOR;
  if (/(junior|jr\.|entry[ -]level|associate|intern)/.test(s)) return ExperienceLevel.ENTRY;
  return ExperienceLevel.MID;
}

const TAG_KEYWORDS = [
  "terraform", "kubernetes", "k8s", "ansible", "aws", "gcp", "azure",
  "python", "go", "typescript", "rust", "grafana", "prometheus",
  "docker", "pdu", "ups", "generator", "crac", "crah", "bgp",
  "nvidia", "cuda", "gpu", "mlops",
];

// ─── Theirstack query groups (spread across pages to maximise variety) ────────

// We split into batches so each API call is focused and pagination makes sense
const QUERY_BATCHES: string[][] = [
  // Data Center Ops + Electrical + Cooling (page 0 and 1)
  [
    "data center engineer",
    "data center technician",
    "data center operations",
    "data center manager",
    "data center facilities",
    "colocation engineer",
    "colo technician",
    "data center electrical engineer",
    "power systems engineer",
    "critical facilities electrical",
    "data center cooling engineer",
    "data center hvac engineer",
    "critical facilities hvac",
  ],
  // AI Infra + SRE + Platform + DevOps (page 0 and 1)
  [
    "ai infrastructure engineer",
    "gpu infrastructure engineer",
    "ml infrastructure engineer",
    "machine learning infrastructure",
    "site reliability engineer",
    "platform engineer",
    "devops engineer",
    "cloud infrastructure engineer",
    "infrastructure engineer",
  ],
  // Networking + Construction + Facilities
  [
    "data center network engineer",
    "network infrastructure engineer",
    "data center construction manager",
    "critical facilities manager",
    "data center commissioning engineer",
    "data center project manager",
    "data center program manager",
  ],
];

// ─── Fetch one page from Theirstack ──────────────────────────────────────────

async function fetchPage(queries: string[], page: number, days: number): Promise<TSJob[]> {
  const body = {
    job_title_or: queries,
    posted_at_max_age_days: days,
    limit: 25,
    page,
  };

  const res = await fetch(`${BASE_URL}/jobs/search`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Theirstack ${res.status}: ${text.slice(0, 300)}`);
  }

  const json = await res.json() as { data?: TSJob[] };
  return json.data ?? [];
}

// ─── Insert one job ───────────────────────────────────────────────────────────

async function insertJob(raw: TSJob): Promise<"inserted" | "skipped" | "error"> {
  try {
    const title = raw.job_title?.trim();
    const description = raw.description?.trim();
    if (!title || !description || description.length < 50) return "skipped";

    const company = raw.company_object?.name ?? raw.company ?? "Unknown";
    const city = raw.city ?? "";
    const country = raw.country ?? "";
    const location = [city, country].filter(Boolean).join(", ") || "Remote";
    const applyUrl = raw.final_url ?? raw.apply_url ?? null;

    // Dedup
    const existing = await prisma.job.findFirst({
      where: applyUrl
        ? { applyUrl }
        : {
          title: { equals: title, mode: "insensitive" },
          company: { equals: company, mode: "insensitive" },
          location: { equals: location, mode: "insensitive" },
        },
      select: { id: true },
    });
    if (existing) return "skipped";

    const postedAt = raw.posted_at ? new Date(raw.posted_at) : new Date();
    const expiresAt = new Date(postedAt);
    expiresAt.setDate(expiresAt.getDate() + 30);

    const category = inferCategory(title, description);
    const remote = raw.remote ?? /\bremote\b/i.test(location);
    const tags = TAG_KEYWORDS.filter((kw) => description.toLowerCase().includes(kw)).slice(0, 8);

    await prisma.job.create({
      data: {
        title,
        company: company.trim(),
        location: location.trim(),
        description,
        applyUrl,
        type: normalizeJobType(raw.employment_type),
        level: normalizeLevel(title),
        category,
        remote,
        salary: null,
        salaryMin: raw.min_annual_salary ?? null,
        salaryMax: raw.max_annual_salary ?? null,
        tags,
        responsibilities: [],
        requirements: [],
        source: "Theirstack",
        isActive: true,
        featured: false,
        paymentStatus: "free",
        postedAt,
        expiresAt,
      },
    });

    return "inserted";
  } catch (err) {
    console.error(`  ✗ error on "${raw.job_title}":`, (err as Error).message);
    return "error";
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  if (!API_KEY) {
    console.error("THEIRSTACK_API_KEY is not set in .env.local");
    process.exit(1);
  }

  const TARGET = 200;
  const DAYS = 14;

  let inserted = 0;
  let skipped = 0;
  let errors = 0;
  let fetched = 0;

  const seenIds = new Set<number>();

  console.log(`\nCoreStack — Theirstack Bulk Loader`);
  console.log(`Target: ${TARGET} new jobs | Last ${DAYS} days\n`);

  outer:
  for (let batchIdx = 0; batchIdx < QUERY_BATCHES.length; batchIdx++) {
    const queries = QUERY_BATCHES[batchIdx];
    console.log(`Batch ${batchIdx + 1}/${QUERY_BATCHES.length} — ${queries.length} query terms`);

    for (let page = 0; page <= 7; page++) {
      if (inserted >= TARGET) break outer;

      console.log(`  Fetching page ${page}…`);
      let jobs: TSJob[];
      try {
        jobs = await fetchPage(queries, page, DAYS);
      } catch (err) {
        console.error(`  API error:`, (err as Error).message);
        break; // try next batch
      }

      console.log(`  Got ${jobs.length} results`);
      if (jobs.length === 0) break; // no more pages

      for (const job of jobs) {
        if (inserted >= TARGET) break outer;
        if (seenIds.has(job.id)) continue; // dedupe across batches
        seenIds.add(job.id);
        fetched++;

        const outcome = await insertJob(job);
        if (outcome === "inserted") {
          inserted++;
          process.stdout.write(`  [${inserted.toString().padStart(3)}] ✓ ${job.job_title} — ${job.company_object?.name ?? job.company ?? "?"}\n`);
        } else if (outcome === "skipped") {
          skipped++;
        } else {
          errors++;
        }
      }
    }
  }

  console.log(`\n─────────────────────────────────────`);
  console.log(`Fetched from API : ${fetched}`);
  console.log(`Inserted         : ${inserted}`);
  console.log(`Skipped (dedup)  : ${skipped}`);
  console.log(`Errors           : ${errors}`);
  console.log(`─────────────────────────────────────\n`);

  await prisma.$disconnect();
}

main().catch((err) => {
  console.error(err);
  prisma.$disconnect();
  process.exit(1);
});
