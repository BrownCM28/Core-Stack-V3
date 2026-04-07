import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { z } from "zod";

async function requireAdmin() {
  const session = await getSession();
  if (!session) return null;
  const role = (session.user as { role?: string }).role;
  return role === "ADMIN" ? session : null;
}

const PatchSchema = z.object({
  active: z.boolean(),
});

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = PatchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "active (boolean) required" }, { status: 422 });
  }

  const job = await prisma.job.update({
    where: { id },
    data: { isActive: parsed.data.active },
    select: { id: true, isActive: true },
  });

  return NextResponse.json(job);
}
