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

  const applications = await prisma.application.findMany({
    orderBy: { appliedAt: "desc" },
    take: 20,
    select: {
      id: true,
      appliedAt: true,
      status: true,
      user: {
        select: {
          name: true,
          profile: { select: { username: true } },
        },
      },
      job: {
        select: { title: true, company: true },
      },
    },
  });

  return NextResponse.json({ applications });
}
