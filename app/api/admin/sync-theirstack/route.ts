// Manually-triggered (and cron-ready) Theirstack pull ingestion.
// POST /api/admin/sync-theirstack — requires ADMIN session.
//
// To run on a schedule, add a Vercel cron in vercel.json:
//   { "crons": [{ "path": "/api/cron/sync-theirstack", "schedule": "0 6 * * *" }] }
// and create /app/api/cron/sync-theirstack/route.ts that calls this logic.

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { searchTheirStackJobs, CORESTACK_JOB_QUERIES } from "@/lib/theirstack-api";
import { inferCategory, normalizeJobType, normalizeLevel } from "@/lib/ingest";
import { matchAlertsToJob } from "@/lib/alerts";
import type { TheirStackJob } from "@/lib/theirstack-api";

async function requireAdmin() {
  const session = await getSession();
  if (!session) return null;
  const role = (session.user as { role?: string }).role;
  return role === "ADMIN" ? session : null;
}

function mapTheirStackToIngest(raw: TheirStackJob) {
  const city = raw.city ?? "";
  const country = raw.country ?? "";
  const location = [city, country].filter(Boolean).join(", ") || "Remote";
  const company =
    raw.company_object?.name ?? raw.company ?? "Unknown";
  const title = raw.job_title;
  const description = raw.description ?? "";

  return {
    title,
    company,
    location,
    description,
    applyUrl: raw.final_url ?? raw.apply_url ?? null,
    jobType: raw.employment_type ?? null,
    salaryMin: raw.min_annual_salary ?? null,
    salaryMax: raw.max_annual_salary ?? null,
    remote: raw.remote ?? null,
    postedAt: raw.posted_at ?? null,
    source: "Theirstack",
    // Let ingest normalise category / level / tags
    category: inferCategory(title, description),
    level: null as string | null,
    salary: null as string | null,
    tags: null as string[] | null,
    responsibilities: null as string[] | null,
    requirements: null as string[] | null,
  };
}

export async function POST(): Promise<NextResponse> {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const result = { fetched: 0, inserted: 0, skipped: 0, errors: 0 };

  try {
    // Fetch jobs matching CoreStack-relevant queries (last 7 days, US-focused)
    const jobs = await searchTheirStackJobs({
      job_title_or: CORESTACK_JOB_QUERIES,
      posted_at_max_age_days: 7,
      limit: 100,
    });

    result.fetched = jobs.length;
    console.log(`[sync-theirstack] fetched ${jobs.length} jobs from Theirstack`);

    for (const raw of jobs) {
      try {
        if (!raw.job_title || !raw.description) {
          result.skipped++;
          continue;
        }

        const applyUrl = raw.final_url ?? raw.apply_url ?? null;
        const company = raw.company_object?.name ?? raw.company ?? "";
        const city = raw.city ?? "";
        const country = raw.country ?? "";
        const location = [city, country].filter(Boolean).join(", ") || "Remote";

        // Dedup: prefer applyUrl, fall back to title+company+location
        const existing = await prisma.job.findFirst({
          where: applyUrl
            ? { applyUrl }
            : {
                title: { equals: raw.job_title, mode: "insensitive" },
                company: { equals: company, mode: "insensitive" },
                location: { equals: location, mode: "insensitive" },
              },
          select: { id: true },
        });

        if (existing) {
          result.skipped++;
          continue;
        }

        const mapped = mapTheirStackToIngest(raw);
        const jobData = {
          title: mapped.title.trim(),
          company: mapped.company.trim(),
          location: mapped.location.trim(),
          description: mapped.description.trim(),
          applyUrl: mapped.applyUrl ?? null,
          type: normalizeJobType(mapped.jobType),
          level: normalizeLevel(mapped.title, mapped.level),
          category: mapped.category,
          remote: mapped.remote ?? /\bremote\b/i.test(location),
          salary: null,
          salaryMin: mapped.salaryMin ?? null,
          salaryMax: mapped.salaryMax ?? null,
          tags: [] as string[],
          responsibilities: [] as string[],
          requirements: [] as string[],
          source: "Theirstack",
          isActive: true,
          featured: false,
          paymentStatus: "free",
          postedAt: mapped.postedAt ? new Date(mapped.postedAt) : new Date(),
          expiresAt: (() => {
            const d = mapped.postedAt ? new Date(mapped.postedAt) : new Date();
            d.setDate(d.getDate() + 30);
            return d;
          })(),
        };

        const newJob = await prisma.job.create({ data: jobData });
        result.inserted++;

        console.log(`[sync-theirstack] inserted ${newJob.id}: "${newJob.title}" at "${newJob.company}"`);

        // Fire alert matching non-blocking
        matchAlertsToJob(newJob).catch((err: unknown) =>
          console.error(`[sync-theirstack] alert matching failed for ${newJob.id}:`, err)
        );
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        console.error("[sync-theirstack] error on job:", raw.job_title, msg);
        result.errors++;
      }
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[sync-theirstack] fetch failed:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }

  return NextResponse.json({ success: true, ...result });
}
