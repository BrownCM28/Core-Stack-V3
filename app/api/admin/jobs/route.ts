import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export const dynamic = "force-dynamic";

async function requireAdmin() {
  const session = await getSession();
  if (!session) return null;
  const role = (session.user as { role?: string }).role;
  return role === "ADMIN" ? session : null;
}

const PAGE_SIZE = 20;

export async function GET(req: Request): Promise<NextResponse> {
  try {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const page = Math.max(1, Number(searchParams.get("page") ?? "1"));
  const search = searchParams.get("search")?.trim() ?? "";

  const where = search
    ? {
        OR: [
          { title: { contains: search, mode: "insensitive" as const } },
          { company: { contains: search, mode: "insensitive" as const } },
        ],
      }
    : {};

  const [total, jobs] = await Promise.all([
    prisma.job.count({ where }),
    prisma.job.findMany({
      where,
      orderBy: { postedAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      select: {
        id: true,
        title: true,
        company: true,
        category: true,
        source: true,
        isActive: true,
        featured: true,
        paymentStatus: true,
        postedAt: true,
        expiresAt: true,
        _count: { select: { applications: true } },
      },
    }),
  ]);

  return NextResponse.json({
    jobs,
    total,
    page,
    totalPages: Math.ceil(total / PAGE_SIZE),
  });
  } catch (error) {
    console.error("[api/admin/jobs]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
