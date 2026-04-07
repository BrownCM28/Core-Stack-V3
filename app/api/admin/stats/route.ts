import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

async function requireAdmin() {
  const session = await getSession();
  if (!session) return null;
  const role = (session.user as { role?: string }).role;
  return role === "ADMIN" ? session : null;
}

export async function GET(): Promise<NextResponse> {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [totalJobs, activeJobs, totalUsers, totalApplications, paidThisMonth] =
    await Promise.all([
      prisma.job.count(),
      prisma.job.count({
        where: { isActive: true, expiresAt: { gt: now } },
      }),
      prisma.user.count(),
      prisma.application.count(),
      prisma.job.findMany({
        where: { paymentStatus: "paid", postedAt: { gte: startOfMonth } },
        select: { featured: true },
      }),
    ]);

  const revenueMTD = paidThisMonth.reduce(
    (sum, j) => sum + (j.featured ? 249 : 99),
    0
  );

  return NextResponse.json({
    totalJobs,
    activeJobs,
    totalUsers,
    totalApplications,
    revenueMTD,
  });
}
