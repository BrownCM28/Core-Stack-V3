import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { JobDetailContent } from "@/components/jobs/JobDetailContent";
import { prisma } from "@/lib/prisma";
import { mapJobType, mapLevel } from "@/lib/types";
import type { ApiJob } from "@/lib/types";

interface Props {
  params: { id: string };
}

function prismaJobToApi(job: Awaited<ReturnType<typeof getJob>>): ApiJob {
  if (!job) throw new Error("unreachable");
  return {
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
  };
}

async function getJob(id: string) {
  return prisma.job.findFirst({ where: { id, isActive: true } });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const job = await getJob(params.id);
  if (!job) return { title: "Job Not Found" };
  return {
    title: `${job.title} at ${job.company}`,
    description: `${job.title} role at ${job.company} in ${job.location}.`,
  };
}

export default async function JobDetailPage({ params }: Props) {
  const [job, similarRaw] = await Promise.all([
    getJob(params.id),
    prisma.job.findMany({
      where: {
        isActive: true,
        id: { not: params.id },
      },
      orderBy: { postedAt: "desc" },
      take: 3,
    }),
  ]);

  if (!job) notFound();

  // prefer same category for similar, fall back to any
  const sameCategory = similarRaw.filter((j) => j.category === job.category);
  const similarList = sameCategory.length > 0 ? sameCategory.slice(0, 3) : similarRaw.slice(0, 3);

  const similarJobs: ApiJob[] = similarList.map((j) => ({
    id: j.id,
    title: j.title,
    company: j.company,
    companyLogo: j.companyLogo,
    location: j.location,
    remote: j.remote,
    type: mapJobType(j.type),
    level: mapLevel(j.level),
    salary: j.salary,
    salaryMin: j.salaryMin,
    salaryMax: j.salaryMax,
    category: j.category,
    tags: j.tags,
    featured: j.featured,
    postedAt: j.postedAt.toISOString(),
    expiresAt: j.expiresAt?.toISOString() ?? null,
    source: j.source,
  }));

  return <JobDetailContent job={prismaJobToApi(job)} similarJobs={similarJobs} />;
}
