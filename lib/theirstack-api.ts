// Theirstack pull-based ingestion client
// Docs: https://api.theirstack.com/

const BASE_URL = "https://api.theirstack.com/v1";

// ─── Job field shapes returned by Theirstack API ──────────────────────────────

export interface TheirStackJob {
  id: number;
  job_title: string;
  company_object: { name: string; logo?: string } | null;
  company: string | null;
  city: string | null;
  country: string | null;
  country_code: string | null;
  employment_type: string | null;
  min_annual_salary: number | null;
  max_annual_salary: number | null;
  description: string | null;
  final_url: string | null;
  apply_url: string | null;
  posted_at: string | null;
  remote: boolean | null;
}

export interface TheirStackSearchResponse {
  data: TheirStackJob[];
  metadata?: {
    total: number;
    page: number;
    total_pages: number;
  };
}

// ─── Search parameters ────────────────────────────────────────────────────────

export interface TheirStackSearchParams {
  /** Job title keywords (OR matched) */
  job_title_or?: string[];
  /** Max age of posting in days */
  posted_at_max_age_days?: number;
  /** Results per page (max 100) */
  limit?: number;
  /** Page number */
  page?: number;
  /** Country code filter e.g. "US" */
  country_code?: string | null;
  /** Only remote roles */
  remote?: boolean | null;
  /** Min salary filter */
  min_annual_salary_usd?: number | null;
}

// ─── Client ───────────────────────────────────────────────────────────────────

export async function searchTheirStackJobs(
  params: TheirStackSearchParams
): Promise<TheirStackJob[]> {
  const apiKey = process.env.THEIRSTACK_API_KEY;
  if (!apiKey) throw new Error("THEIRSTACK_API_KEY is not set");

  const body = {
    job_title_or: params.job_title_or,
    posted_at_max_age_days: params.posted_at_max_age_days ?? 7,
    limit: params.limit ?? 50,
    page: params.page ?? 0,
    ...(params.country_code != null && { country_code: params.country_code }),
    ...(params.remote != null && { remote: params.remote }),
    ...(params.min_annual_salary_usd != null && {
      min_annual_salary_usd: params.min_annual_salary_usd,
    }),
  };

  const res = await fetch(`${BASE_URL}/jobs/search`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Theirstack API error ${res.status}: ${text}`);
  }

  const json = (await res.json()) as TheirStackSearchResponse;
  return json.data ?? [];
}

// ─── CoreStack-specific search queries ───────────────────────────────────────
// These keyword groups match the CATEGORY_RULES in lib/ingest.ts

export const CORESTACK_JOB_QUERIES: string[] = [
  // Data Center Ops
  "data center engineer",
  "data center technician",
  "data center operations",
  "data center manager",
  "colocation engineer",
  "colo technician",
  // Electrical
  "data center electrical engineer",
  "critical facilities electrical",
  "power systems engineer data center",
  // Cooling / HVAC
  "data center cooling",
  "data center hvac",
  "critical facilities hvac",
  // Networking
  "data center network engineer",
  "network infrastructure engineer",
  // AI Infrastructure
  "ai infrastructure engineer",
  "gpu infrastructure engineer",
  "ml infrastructure engineer",
  "ai infra engineer",
  // SRE / Platform
  "site reliability engineer",
  "platform engineer",
  // DevOps / Cloud Infra
  "devops engineer",
  "cloud infrastructure engineer",
  "infrastructure engineer",
  // Construction / Facilities
  "data center construction manager",
  "critical facilities manager",
  "data center commissioning",
];
