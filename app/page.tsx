import { Hero } from "@/components/home/Hero";
import { HomeSearchBar } from "@/components/home/HomeSearchBar";
import { FeaturedJobsStrip } from "@/components/home/FeaturedJobsStrip";
import { LatestJobs } from "@/components/home/LatestJobs";
import { CategoriesStrip } from "@/components/home/CategoriesStrip";
import { Footer } from "@/components/Footer";
import { prisma } from "@/lib/prisma";
import { mapJobType, mapLevel } from "@/lib/types";
import type { ApiJob } from "@/lib/types";

function toApiJob(job: {
  id: string; title: string; company: string; companyLogo: string | null;
  location: string; remote: boolean; type: string; level: string;
  salary: string | null; salaryMin: number | null; salaryMax: number | null;
  category: string; tags: string[]; featured: boolean;
  postedAt: Date; expiresAt: Date | null; source: string; applyUrl: string | null;
}): ApiJob {
  return {
    ...job,
    type: mapJobType(job.type),
    level: mapLevel(job.level),
    postedAt: job.postedAt.toISOString(),
    expiresAt: job.expiresAt?.toISOString() ?? null,
  };
}

export default async function HomePage() {
  const [featuredJobs, latestJobs] = await Promise.all([
    prisma.job.findMany({
      where: { isActive: true, featured: true },
      orderBy: { postedAt: "desc" },
      take: 6,
      select: {
        id: true, title: true, company: true, companyLogo: true,
        location: true, remote: true, type: true, level: true,
        salary: true, salaryMin: true, salaryMax: true,
        category: true, tags: true, featured: true,
        postedAt: true, expiresAt: true, source: true, applyUrl: true,
      },
    }),
    prisma.job.findMany({
      where: { isActive: true },
      orderBy: { postedAt: "desc" },
      take: 6,
      select: {
        id: true, title: true, company: true, companyLogo: true,
        location: true, remote: true, type: true, level: true,
        salary: true, salaryMin: true, salaryMax: true,
        category: true, tags: true, featured: true,
        postedAt: true, expiresAt: true, source: true, applyUrl: true,
      },
    }),
  ]);

  return (
    <div className="min-h-screen">
      <Hero />

      <section className="bg-background pb-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <HomeSearchBar />
        </div>
      </section>

      <FeaturedJobsStrip jobs={featuredJobs.map(toApiJob)} />

      <section className="bg-background py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <LatestJobs jobs={latestJobs.map(toApiJob)} />
        </div>
      </section>

      <CategoriesStrip />
      <Footer />
    </div>
  );
}
