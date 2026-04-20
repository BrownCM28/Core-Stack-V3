import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { mapJobType, mapLevel } from "@/lib/types";
import type { ApiJob } from "@/lib/types";
import { Prisma } from "@prisma/client";
import { checkRateLimit, standardLimit } from "@/lib/ratelimit";

export async function GET(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "anonymous";
  const rl = await checkRateLimit(standardLimit, ip);
  if (rl) return rl;

  const { searchParams } = req.nextUrl;

  const categories = searchParams.getAll("category");
  const jobTypes = searchParams.getAll("jobType");
  const search = searchParams.get("search")?.trim();
  const location = searchParams.get("location");
  const remote = searchParams.get("remote") === "true";
  const salaryMin = searchParams.get("salaryMin") ? parseInt(searchParams.get("salaryMin")!) : null;
  const salaryMax = searchParams.get("salaryMax") ? parseInt(searchParams.get("salaryMax")!) : null;
  const sort = searchParams.get("sort") ?? "newest";
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
  const limit = Math.min(50, parseInt(searchParams.get("limit") ?? "20"));

  // Build where clause — all filters go through andFilters so they stack correctly
  const andFilters: Prisma.JobWhereInput[] = [
    { OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }] },
  ];
  const where: Prisma.JobWhereInput = { isActive: true };

  if (categories.length > 0) {
    andFilters.push({ category: { in: categories } });
  }

  if (jobTypes.length > 0) {
    const typeMap: Record<string, string> = {
      "Full-time": "FULL_TIME",
      "Contract": "CONTRACT",
    };
    const dbTypes = jobTypes.map((t) => typeMap[t]).filter(Boolean);
    if (dbTypes.length > 0) {
      andFilters.push({
        type: { in: dbTypes as ("FULL_TIME" | "CONTRACT" | "BOTH")[] },
      });
    }
  }

  if (remote) {
    andFilters.push({
      OR: [
        { remote: true },
        { location: { contains: "remote", mode: "insensitive" } },
      ],
    });
  }

  if (location) {
    andFilters.push({ location: { contains: location, mode: "insensitive" } });
  }

  if (search) {
    andFilters.push({
      OR: [
        { title: { contains: search, mode: "insensitive" } },
        { company: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ],
    });
  }

  if (salaryMin != null) {
    andFilters.push({ salaryMax: { gte: salaryMin } });
  }
  if (salaryMax != null) {
    andFilters.push({ salaryMin: { lte: salaryMax } });
  }

  where.AND = andFilters;

  const orderBy: Prisma.JobOrderByWithRelationInput[] = [
    { featured: "desc" },
    sort === "newest" ? { postedAt: "desc" } : { postedAt: "desc" },
  ];

  const [jobs, total] = await Promise.all([
    prisma.job.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        title: true,
        company: true,
        companyLogo: true,
        location: true,
        remote: true,
        type: true,
        level: true,
        salary: true,
        salaryMin: true,
        salaryMax: true,
        category: true,
        tags: true,
        featured: true,
        postedAt: true,
        expiresAt: true,
        source: true,
        applyUrl: true,
      },
    }),
    prisma.job.count({ where }),
  ]);

  const result: ApiJob[] = jobs.map((job) => ({
    ...job,
    type: mapJobType(job.type),
    level: mapLevel(job.level),
    postedAt: job.postedAt.toISOString(),
    expiresAt: job.expiresAt?.toISOString() ?? null,
  }));

  return NextResponse.json({
    jobs: result,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });
}
