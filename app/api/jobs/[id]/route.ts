import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { mapJobType, mapLevel } from "@/lib/types";
import type { ApiJob } from "@/lib/types";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const job = await prisma.job.findFirst({
    where: { id: params.id, isActive: true },
    include: {
      _count: { select: { applications: true } },
    },
  });

  if (!job) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const result: ApiJob = {
    id: job.id,
    title: job.title,
    company: job.company,
    companyLogo: job.companyLogo,
    location: job.location,
    remote: job.remote,
    type: mapJobType(job.type),
    level: mapLevel(job.level),
    salary: job.salary,
    salaryMin: job.salaryMin,
    salaryMax: job.salaryMax,
    category: job.category,
    tags: job.tags,
    featured: job.featured,
    postedAt: job.postedAt.toISOString(),
    expiresAt: job.expiresAt?.toISOString() ?? null,
    source: job.source,
    description: job.description,
    responsibilities: job.responsibilities,
    requirements: job.requirements,
    applicationCount: job._count.applications,
  };

  return NextResponse.json(result);
}
