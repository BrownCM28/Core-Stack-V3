import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";
import { checkRateLimit, standardLimit } from "@/lib/ratelimit";
import { sanitizeText } from "@/lib/sanitize";

const CreateAlertSchema = z.object({
  name: z.string().min(1).max(100),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  filters: z.any(),
  frequency: z.enum(["instant", "daily", "weekly"]),
});

function capitalize(s: string): string {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}

function filterSummaryFromFilters(filters: Record<string, unknown>): string {
  const parts: string[] = [];
  const categories = filters.category as string[] | undefined;
  if (categories?.length) parts.push(categories.slice(0, 2).join(", "));
  const location = filters.location as string | undefined;
  if (location) parts.push(location);
  const jobTypes = filters.jobType as string[] | undefined;
  if (jobTypes?.length) parts.push(jobTypes.join(" / "));
  if (filters.remote) parts.push("Remote");
  const salaryMin = filters.salaryMin as string | undefined;
  if (salaryMin) parts.push(`$${salaryMin}k+`);
  return parts.join(" · ") || "All roles";
}

export async function GET() {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const rl = await checkRateLimit(standardLimit, session.user.id);
    if (rl) return rl;

    const alerts = await prisma.savedSearch.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });

    const result = alerts.map((a) => ({
      id: a.id,
      name: a.name,
      filterSummary: filterSummaryFromFilters(
        (a.filters as Record<string, unknown>) ?? {}
      ),
      frequency: capitalize(a.alertFreq),
      active: a.enabled,
      filters: a.filters,
      createdAt: a.createdAt,
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error("[api/alerts GET]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const rl = await checkRateLimit(standardLimit, session.user.id);
    if (rl) return rl;

    const body = await req.json().catch(() => null);
    const parsed = CreateAlertSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", issues: parsed.error.issues },
        { status: 400 }
      );
    }

    const { name, filters, frequency } = parsed.data;

    const alert = await prisma.savedSearch.create({
      data: {
        name: sanitizeText(name),
        filters: filters as Prisma.InputJsonValue,
        alertFreq: frequency,
        enabled: true,
        userId: session.user.id,
      },
    });

    return NextResponse.json(
      {
        id: alert.id,
        name: alert.name,
        filterSummary: filterSummaryFromFilters(filters),
        frequency: capitalize(frequency),
        active: alert.enabled,
        filters: alert.filters,
        createdAt: alert.createdAt,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[api/alerts POST]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

