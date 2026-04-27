import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { sanitizeText } from "@/lib/sanitize";

const PatchAlertSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  frequency: z.enum(["instant", "daily", "weekly"]).optional(),
  active: z.boolean().optional(),
});

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const alert = await prisma.savedSearch.findFirst({
    where: { id: params.id, userId: session.user.id },
  });
  if (!alert) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await req.json().catch(() => null);
  const parsed = PatchAlertSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const { name, frequency, active } = parsed.data;

  const updated = await prisma.savedSearch.update({
    where: { id: params.id },
    data: {
      ...(name !== undefined && { name: sanitizeText(name) }),
      ...(frequency !== undefined && { alertFreq: frequency }),
      ...(active !== undefined && { enabled: active }),
    },
  });

  return NextResponse.json({ success: true, id: updated.id, active: updated.enabled });
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const alert = await prisma.savedSearch.findFirst({
    where: { id: params.id, userId: session.user.id },
  });
  if (!alert) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.savedSearch.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
