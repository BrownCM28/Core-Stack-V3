import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { IncomingJobSchema, mapIncomingJob } from "@/lib/ingest";
import { matchAlertsToJob } from "@/lib/alerts";

// ─── Auth ─────────────────────────────────────────────────────────────────────

const VALID_SECRETS = new Set(
  [
    process.env.MAKE_WEBHOOK_SECRET,
    process.env.THEIRSTACK_WEBHOOK_SECRET,
  ].filter(Boolean) as string[]
);

function isAuthorized(req: Request): boolean {
  if (VALID_SECRETS.size === 0) return false; // no secrets configured = deny all
  const secret = req.headers.get("x-webhook-secret");
  return !!secret && VALID_SECRETS.has(secret);
}

// ─── Core handler (exported so aliases can reuse it) ──────────────────────────

export interface IngestResult {
  success: boolean;
  inserted: number;
  skipped: number;
  errors: { index: number; error: string }[];
}

export async function handleIngest(req: Request): Promise<NextResponse> {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  // Accept single job OR array
  const jobs: unknown[] = Array.isArray(body) ? body : [body];

  const result: IngestResult = { success: true, inserted: 0, skipped: 0, errors: [] };

  for (let i = 0; i < jobs.length; i++) {
    try {
      // 1. Validate
      const parsed = IncomingJobSchema.safeParse(jobs[i]);
      if (!parsed.success) {
        const msg = parsed.error.issues.map((e) => `${e.path.join(".")}: ${e.message}`).join("; ");
        result.errors.push({ index: i, error: `Validation failed — ${msg}` });
        continue;
      }
      const raw = parsed.data;

      // 2. Deduplication: prefer applyUrl match; fall back to title+company+location
      const existingJob = await prisma.job.findFirst({
        where: raw.applyUrl
          ? { applyUrl: raw.applyUrl }
          : {
              title: { equals: raw.title, mode: "insensitive" },
              company: { equals: raw.company, mode: "insensitive" },
              location: { equals: raw.location, mode: "insensitive" },
            },
        select: { id: true },
      });

      if (existingJob) {
        console.log(`[ingest] skipped duplicate: "${raw.title}" at "${raw.company}"`);
        result.skipped++;
        continue;
      }

      // 3. Normalize + insert
      const jobData = mapIncomingJob(raw);
      const newJob = await prisma.job.create({ data: jobData });
      result.inserted++;

      console.log(`[ingest] inserted job ${newJob.id}: "${newJob.title}" at "${newJob.company}"`);

      // 4. Alert matching — fire and forget, never block ingestion
      matchAlertsToJob(newJob).catch((err) =>
        console.error(`[ingest] alert matching failed for job ${newJob.id}:`, err)
      );
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`[ingest] error on job at index ${i}:`, msg);
      result.errors.push({ index: i, error: msg });
    }
  }

  return NextResponse.json(result, {
    status: result.inserted > 0 || result.skipped > 0 ? 200 : 422,
  });
}

// ─── Route export ─────────────────────────────────────────────────────────────

export async function POST(req: Request) {
  return handleIngest(req);
}
