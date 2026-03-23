import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { mapJobType, mapLevel } from "@/lib/types";
import type { ApiJob } from "@/lib/types";
import { Prisma } from "@prisma/client";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;

  const categories = searchParams.getAll("category");
  const jobTypes = searchParams.getAll("jobType");
  const location = searchParams.get("location");
  const remote = searchParams.get("remote") === "true";
  const salaryMin = searchParams.get("salaryMin") ? parseInt(searchParams.get("salaryMin")!) : null;
  const salaryMax = searchParams.get("salaryMax") ? parseInt(searchParams.get("salaryMax")!) : null;
  const sort = searchParams.get("sort") ?? "newest";
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
  const limit = Math.min(50, parseInt(searchParams.get("limit") ?? "20"));

  // Build where clause
  const where: Prisma.JobWhereInput = {
    isActive: true,
    OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
  };

  if (categories.length > 0) {
    where.category = { in: categories };
  }

  if (jobTypes.length > 0) {
    const typeMap: Record<string, string> = {
      "Full-time": "FULL_TIME",
      "Contract": "CONTRACT",
    };
    const dbTypes = jobTypes.map((t) => typeMap[t]).filter(Boolean);
    if (dbTypes.length > 0) {
      where.type = { in: dbTypes as ("FULL_TIME" | "CONTRACT" | "BOTH")[] };
    }
  }

  if (remote) {
    where.AND = [
      {
        OR: [
          { remote: true },
          { location: { contains: "remote", mode: "insensitive" } },
        ],
      },
    ];
  }

  if (location) {
    where.location = { contains: location, mode: "insensitive" };
  }

  if (salaryMin != null) {
    where.salaryMax = { gte: salaryMin };
  }
  if (salaryMax != null) {
    where.salaryMin = { lte: salaryMax };
  }

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
