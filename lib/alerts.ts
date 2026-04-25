import { prisma } from "@/lib/prisma";
import { resend } from "@/lib/resend";
import type { Job, SavedSearch } from "@prisma/client";

// ─── Filter matching ──────────────────────────────────────────────────────────

interface AlertFilters {
  category?: string | string[];
  jobType?: string | string[];
  location?: string;
  remote?: boolean;
  salaryMin?: number | string;
  salaryMax?: number | string;
}

function mapJobTypeToDisplay(type: string): string {
  if (type === "FULL_TIME") return "Full-time";
  if (type === "CONTRACT") return "Contract";
  if (type === "BOTH") return "Full-time / Contract";
  return type;
}

function jobMatchesFilters(job: Job, filters: AlertFilters): boolean {
  // Category
  if (filters.category) {
    const cats = Array.isArray(filters.category) ? filters.category : [filters.category];
    if (cats.length > 0 && !cats.includes(job.category)) return false;
  }

  // Job type
  if (filters.jobType) {
    const types = Array.isArray(filters.jobType) ? filters.jobType : [filters.jobType];
    if (types.length > 0) {
      const jobDisplay = mapJobTypeToDisplay(job.type);
      const match = types.some(
        (t) => t === jobDisplay || t.toLowerCase() === jobDisplay.toLowerCase()
      );
      if (!match) return false;
    }
  }

  // Location (case-insensitive contains)
  if (filters.location) {
    if (!job.location.toLowerCase().includes(filters.location.toLowerCase())) return false;
  }

  // Remote
  if (filters.remote === true && !job.remote) return false;

  // Salary overlap: filter range in thousands, job range in full dollars
  const filterMin = filters.salaryMin ? Number(filters.salaryMin) * 1000 : null;
  const filterMax = filters.salaryMax ? Number(filters.salaryMax) * 1000 : null;

  if (filterMin !== null && job.salaryMax !== null && job.salaryMax < filterMin) return false;
  if (filterMax !== null && job.salaryMin !== null && job.salaryMin > filterMax) return false;

  return true;
}

// ─── Email sending ────────────────────────────────────────────────────────────

const SITE_URL = process.env.BETTER_AUTH_URL ?? "https://corestack.io";
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? "alerts@corestack.io";

async function sendAlertEmail(
  userId: string,
  savedSearch: SavedSearch,
  job: Job
): Promise<void> {
  if (!resend) return; // no API key configured

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true, name: true },
  });
  if (!user?.email) return;

  const salary = job.salary ?? (job.salaryMin && job.salaryMax
    ? `$${Math.round(job.salaryMin / 1000)}k–$${Math.round(job.salaryMax / 1000)}k`
    : null);

  const jobUrl = `${SITE_URL}/jobs/${job.id}`;

  await resend.emails.send({
    from: `CoreStack Alerts <${FROM_EMAIL}>`,
    to: user.email,
    subject: `New match for your "${savedSearch.name}" search on CoreStack`,
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /></head>
<body style="font-family:ui-monospace,monospace;background:#F5F0EB;margin:0;padding:24px;">
  <div style="max-width:520px;margin:0 auto;background:#FAFAF8;border:1.5px solid #E0E0E0;border-radius:8px;overflow:hidden;">
    <div style="background:#0D0F12;padding:20px 24px;">
      <span style="font-family:ui-monospace,monospace;font-size:14px;font-weight:700;color:#3ECF8E;letter-spacing:-0.02em;">CoreStack</span>
    </div>
    <div style="padding:24px;">
      <p style="font-size:12px;color:#6B7280;margin:0 0 4px;">New match for your alert</p>
      <h2 style="font-size:16px;font-weight:700;color:#0D0F12;margin:0 0 20px;">${savedSearch.name}</h2>

      <div style="border:1.5px solid #E0E0E0;border-radius:8px;padding:16px;margin-bottom:20px;">
        <p style="font-size:15px;font-weight:700;color:#0D0F12;margin:0 0 4px;">${job.title}</p>
        <p style="font-size:13px;color:#6B7280;margin:0 0 12px;">${job.company} · ${job.location}</p>
        ${salary ? `<p style="font-size:13px;font-weight:700;color:#0D0F12;margin:0 0 12px;">${salary}</p>` : ""}
        <p style="font-size:12px;color:#6B7280;margin:0;line-height:1.6;">${(job.description ?? "").slice(0, 200)}${(job.description?.length ?? 0) > 200 ? "…" : ""}</p>
      </div>

      <a href="${jobUrl}"
         style="display:inline-block;background:#3ECF8E;color:#0D0F12;font-family:ui-monospace,monospace;font-size:13px;font-weight:700;padding:10px 20px;border-radius:6px;text-decoration:none;">
        View &amp; Apply on CoreStack →
      </a>
    </div>
    <div style="border-top:1px solid #E0E0E0;padding:16px 24px;">
      <p style="font-size:11px;color:#9CA3AF;margin:0;">
        You're receiving this because you saved the search "${savedSearch.name}" on CoreStack.
        <a href="${SITE_URL}/dashboard" style="color:#3ECF8E;">Manage alerts →</a>
      </p>
    </div>
  </div>
</body>
</html>
    `.trim(),
  });
}

// ─── Main matching function ───────────────────────────────────────────────────

export async function matchAlertsToJob(job: Job): Promise<void> {
  const activeAlerts = await prisma.savedSearch.findMany({
    where: { enabled: true },
  });

  await Promise.allSettled(
    activeAlerts.map(async (alert) => {
      const filters = (alert.filters ?? {}) as AlertFilters;
      if (!jobMatchesFilters(job, filters)) return;

      if (alert.alertFreq === "instant") {
        await sendAlertEmail(alert.userId, alert, job);
      } else {
        // Daily/weekly: mark as having a pending match (cron will batch-send)
        await prisma.savedSearch.update({
          where: { id: alert.id },
          data: { lastRunAt: new Date() },
        });
      }
    })
  );
}
