import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";

const ALLOWED = [
  "userType", "jobCategories", "workPreference",
  "availability", "onboardingCompleted", "onboardingStep", "openToWork",
] as const;

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => ({}));
  const data: Record<string, unknown> = {};
  for (const field of ALLOWED) {
    if (field in body) data[field] = body[field];
  }

  await prisma.user.update({ where: { id: session.user.id }, data });
  return NextResponse.json({ success: true });
}
