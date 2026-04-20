// Theirstack webhook — maps native payload to CoreStack schema then delegates to ingest.
import { NextResponse } from "next/server";
import { handleIngest } from "@/lib/ingest-handler";
import { checkRateLimit, webhookLimit } from "@/lib/ratelimit";

// Theirstack sends job objects nested like this (simplified):
// {
//   job_title: string
//   company_object: { name: string }
//   city: string | null
//   country: string | null
//   employment_type: string | null
//   min_annual_salary: number | null
//   max_annual_salary: number | null
//   description: string
//   final_url: string | null
//   posted_at: string | null
// }
// The payload may be a single object OR { jobs: [...] } OR an array.

function mapTheirstack(raw: Record<string, unknown>): Record<string, unknown> {
  const city = (raw.city as string | null) ?? "";
  const country = (raw.country as string | null) ?? "";
  const location = [city, country].filter(Boolean).join(", ") || "Remote";

  const company =
    (raw.company_object as { name?: string } | null)?.name ??
    (raw.company as string | null) ??
    "Unknown";

  return {
    title: raw.job_title ?? raw.title,
    company,
    location,
    description: raw.description ?? "",
    applyUrl: raw.final_url ?? raw.apply_url ?? null,
    jobType: raw.employment_type ?? null,
    salaryMin: raw.min_annual_salary ?? null,
    salaryMax: raw.max_annual_salary ?? null,
    postedAt: raw.posted_at ?? null,
    source: "Theirstack",
  };
}

export async function POST(req: Request): Promise<NextResponse> {
  const rl = await checkRateLimit(webhookLimit, "theirstack-webhook");
  if (rl) return rl;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  // Normalise to an array of raw Theirstack job objects
  let rawJobs: Record<string, unknown>[];
  if (Array.isArray(body)) {
    rawJobs = body as Record<string, unknown>[];
  } else if (
    body &&
    typeof body === "object" &&
    "jobs" in body &&
    Array.isArray((body as { jobs: unknown }).jobs)
  ) {
    rawJobs = (body as { jobs: Record<string, unknown>[] }).jobs;
  } else {
    rawJobs = [body as Record<string, unknown>];
  }

  console.log(`[theirstack] received ${rawJobs.length} job(s)`);

  // Map to CoreStack shape and forward to the shared ingest handler
  const mapped = rawJobs.map(mapTheirstack);
  const payload = mapped.length === 1 ? mapped[0] : mapped;

  const syntheticReq = new Request(req.url, {
    method: "POST",
    headers: req.headers,
    body: JSON.stringify(payload),
  });

  return handleIngest(syntheticReq);
}
