import { prisma } from "@/lib/prisma";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://corestack.io";

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl,               lastModified: new Date(), changeFrequency: "daily",  priority: 1.0 },
    { url: `${baseUrl}/jobs`,     lastModified: new Date(), changeFrequency: "daily",  priority: 0.9 },
    { url: `${baseUrl}/talent`,   lastModified: new Date(), changeFrequency: "daily",  priority: 0.8 },
    { url: `${baseUrl}/wiki`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/employers`,lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
  ];

  // Dynamic job pages — only active, non-expired
  const jobs = await prisma.job.findMany({
    where: {
      isActive: true,
      OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
    },
    select: { id: true, updatedAt: true },
    orderBy: { postedAt: "desc" },
    take: 5000, // cap for very large datasets
  });

  const jobRoutes: MetadataRoute.Sitemap = jobs.map((job) => ({
    url: `${baseUrl}/jobs/${job.id}`,
    lastModified: job.updatedAt,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  // Dynamic profile pages
  const profiles = await prisma.gitHubProfile.findMany({
    select: { username: true, updatedAt: true },
  });

  const profileRoutes: MetadataRoute.Sitemap = profiles.map((p) => ({
    url: `${baseUrl}/profile/${p.username}`,
    lastModified: p.updatedAt,
    changeFrequency: "weekly",
    priority: 0.5,
  }));

  return [...staticRoutes, ...jobRoutes, ...profileRoutes];
}
