/**
 * Pulls 12 real, live infrastructure jobs (≤7 days old) from active-jobs-db
 * via RapidAPI and inserts them into the CoreStack database.
 *
 * Usage: npx tsx scripts/load-active-ats.ts
 */

import { config } from "dotenv";
import path from "path";
config({ path: path.resolve(__dirname, "../.env.local") });

import { PrismaClient, JobType, ExperienceLevel } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const adapter = new PrismaPg(pool as any);
const prisma = new PrismaClient({ adapter });

const KEY = process.env.RAPIDAPI_KEY!;
const HOST = "active-jobs-db.p.rapidapi.com";

// ─── API types ────────────────────────────────────────────────────────────────

interface ATSJob {
  id: string;
  title: string;
  organization: string;
  url: string;
  date_posted: string | null;
  locations_derived: string[] | null;
  remote_derived: boolean | null;
  employment_type: string | string[] | null;
  salary_raw: { minValue?: number; maxValue?: number; unitText?: string } | null;
  description_text: string | null;
}

// ─── Targeted queries — 4 calls, ~25 results each → pick best 12 ─────────────

const QUERIES: { title: string; location: string }[] = [
  {
    title: '"data center" OR "datacenter" OR "critical facilities"',
    location: '"United States"',
  },
  {
    title: '"data center" OR "datacenter"',
    location: '"United Kingdom" OR "Canada" OR "Australia"',
  },
  {
    title: '"infrastructure engineer" OR "site reliability engineer"',
    location: '"United States" OR "United Kingdom"',
  },
  {
    title: '"ai infrastructure" OR "gpu infrastructure" OR "ml infrastructure"',
    location: '"United States" OR "United Kingdom"',
  },
  {
    title: '"platform engineer" OR "devops engineer"',
    location: '"United States" OR "United Kingdom"',
  },
  {
    title: '"cloud infrastructure" OR "cloud engineer"',
    location: '"United States"',
  },
  {
    title: '"network engineer" OR "network infrastructure"',
    location: '"United States" OR "United Kingdom"',
  },
  {
    title: '"electrical engineer" OR "power systems engineer" OR "cooling engineer"',
    location: '"United States"',
  },
  {
    title: '"facilities manager" OR "data center operations" OR "colocation"',
    location: '"United States" OR "United Kingdom"',
  },
];

// ─── Normalisation ────────────────────────────────────────────────────────────

const CATEGORY_RULES: [RegExp, string][] = [
  [/gpu|cuda|ai infra|ml infra|machine learning infra|hpc cluster|nvidia/i, "AI Infrastructure"],
  [/site reliability|sre\b/i, "SRE"],
  [/platform eng|developer platform|internal platform/i, "Platform Eng"],
  [/devops|ci\/cd|gitops/i, "DevOps"],
  [/cloud infra|cloud infrastructure|terraform|kubernetes/i, "Cloud Infra"],
  [/network eng|network architect|routing|bgp|fiber/i, "Networking"],
  [/electrical eng|power systems|\bups\b|switchgear|generator|high voltage/i, "Electrical"],
  [/cooling|hvac|\bcrac\b|\bcrah\b|chiller|thermal/i, "Cooling/HVAC"],
  [/construction manag|commissioning|civil eng/i, "Construction"],
  [/facilities manag|critical facilities|building operat|dcim/i, "Facilities"],
  [/project manag|program manag|\bpmo\b/i, "Project Management"],
  [/data.?cent|datacent|colocation|colo\b|raised floor/i, "Data Center Ops"],
];

function inferCategory(title: string, desc: string): string {
  const hay = `${title} ${desc}`;
  for (const [re, cat] of CATEGORY_RULES) {
    if (re.test(hay)) return cat;
  }
  return "Cloud Infra";
}

function normalizeType(raw: string | string[] | null): JobType {
  if (!raw) return JobType.FULL_TIME;
  const val = Array.isArray(raw) ? (raw[0] ?? "") : raw;
  const s = val.toLowerCase().replace(/[-_\s]/g, "");
  if (s.includes("contract") || s.includes("temp") || s.includes("freelan")) return JobType.CONTRACT;
  return JobType.FULL_TIME;
}

function normalizeLevel(title: string): ExperienceLevel {
  const t = title.toLowerCase();
  if (/principal|staff engineer|distinguished|fellow/.test(t)) return ExperienceLevel.PRINCIPAL;
  if (/director|\bvp\b|vice president|head of/.test(t)) return ExperienceLevel.PRINCIPAL;
  if (/\blead\b|tech lead|engineering lead/.test(t)) return ExperienceLevel.LEAD;
  if (/senior|\bsr\.?\b|mid-senior/.test(t)) return ExperienceLevel.SENIOR;
  if (/junior|\bjr\.?\b|entry.level|associate|intern/.test(t)) return ExperienceLevel.ENTRY;
  return ExperienceLevel.MID;
}

function annualiseSalary(raw: ATSJob["salary_raw"]) {
  if (!raw?.minValue && !raw?.maxValue) return { min: null, max: null };
  const mult = raw.unitText === "HOUR" ? 2080 : raw.unitText === "MONTH" ? 12 : raw.unitText === "WEEK" ? 52 : 1;
  return {
    min: raw.minValue != null ? Math.round(raw.minValue * mult) : null,
    max: raw.maxValue != null ? Math.round(raw.maxValue * mult) : null,
  };
}

const TAG_KEYWORDS = [
  "terraform", "kubernetes", "k8s", "ansible", "aws", "gcp", "azure",
  "python", "golang", "typescript", "rust", "grafana", "prometheus",
  "docker", "nvidia", "cuda", "gpu", "mlops", "vmware", "bgp", "ospf",
];

// ─── API fetch ────────────────────────────────────────────────────────────────

async function fetchJobs(q: { title: string; location: string }): Promise<ATSJob[]> {
  const url = new URL(`https://${HOST}/active-ats-7d`);
  url.searchParams.set("offset", "0");
  url.searchParams.set("limit", "50");
  url.searchParams.set("description_type", "text");
  url.searchParams.set("title_filter", q.title);
  url.searchParams.set("location_filter", q.location);

  const res = await fetch(url.toString(), {
    headers: {
      "Content-Type": "application/json",
      "x-rapidapi-host": HOST,
      "x-rapidapi-key": KEY,
    },
  });

  const data = await res.json() as ATSJob[] | { message: string };

  if (!res.ok || !Array.isArray(data)) {
    const msg = Array.isArray(data) ? "" : (data as { message: string }).message;
    throw new Error(`API ${res.status}: ${msg}`);
  }
  return data;
}

// ─── DB insert ────────────────────────────────────────────────────────────────

async function insertJob(job: ATSJob): Promise<"inserted" | "skipped"> {
  const description = job.description_text?.trim() ?? "";
  if (description.length < 80) return "skipped";

  const title = job.title.trim();
  const company = (job.organization ?? "Unknown").trim();
  const location = job.locations_derived?.[0] ?? (job.remote_derived ? "Remote" : "Unknown");
  const applyUrl = job.url;

  const existing = await prisma.job.findFirst({
    where: { OR: [{ applyUrl }, { title: { equals: title, mode: "insensitive" }, company: { equals: company, mode: "insensitive" } }] },
    select: { id: true },
  });
  if (existing) return "skipped";

  const postedAt = job.date_posted ? new Date(job.date_posted) : new Date();
  const expiresAt = new Date(postedAt);
  expiresAt.setDate(expiresAt.getDate() + 30);

  const { min: salaryMin, max: salaryMax } = annualiseSalary(job.salary_raw);
  const category = inferCategory(title, description);
  const tags = TAG_KEYWORDS.filter(kw => description.toLowerCase().includes(kw)).slice(0, 8);

  await prisma.job.create({
    data: {
      title,
      company,
      location,
      description,
      applyUrl,
      type: normalizeType(job.employment_type),
      level: normalizeLevel(title),
      category,
      remote: job.remote_derived ?? /\bremote\b/i.test(location),
      salary: null,
      salaryMin,
      salaryMax,
      tags,
      responsibilities: [],
      requirements: [],
      source: "LinkedIn",
      isActive: true,
      featured: false,
      paymentStatus: "free",
      postedAt,
      expiresAt,
    },
  });
  return "inserted";
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  if (!KEY) { console.error("RAPIDAPI_KEY not set"); process.exit(1); }

  const TARGET = 50;
  let inserted = 0, skipped = 0, errors = 0;
  const seenIds = new Set<string>();

  console.log(`\nCoreStack — Live Job Loader (active-ats-7d)`);
  console.log(`Target: ${TARGET} new jobs (skips any already in DB)\n`);

  for (let qi = 0; qi < QUERIES.length; qi++) {
    const query = QUERIES[qi];
    if (inserted >= TARGET) break;

    console.log(`Query ${qi + 1}/${QUERIES.length}: ${query.title.slice(0, 60)}…`);

    let jobs: ATSJob[];
    try {
      jobs = await fetchJobs(query);
    } catch (err) {
      console.error(`  ✗ ${(err as Error).message}`);
      continue;
    }
    console.log(`  → ${jobs.length} results`);

    for (const job of jobs) {
      if (inserted >= TARGET) break;
      if (seenIds.has(job.id)) continue;
      seenIds.add(job.id);

      try {
        const outcome = await insertJob(job);
        if (outcome === "inserted") {
          inserted++;
          const cat = inferCategory(job.title, job.description_text ?? "");
          console.log(`  [${String(inserted).padStart(2)}] ✓ ${job.title} — ${job.organization}  [${cat}]`);
        } else {
          skipped++;
        }
      } catch (err) {
        console.error(`  ✗ ${job.title}: ${(err as Error).message}`);
        errors++;
      }
    }
  }

  console.log(`\n──────────────────────────────────`);
  console.log(`Inserted : ${inserted}`);
  console.log(`Skipped  : ${skipped}`);
  console.log(`Errors   : ${errors}`);
  console.log(`──────────────────────────────────\n`);

  await prisma.$disconnect();
}

main().catch(err => { console.error(err); prisma.$disconnect(); process.exit(1); });
