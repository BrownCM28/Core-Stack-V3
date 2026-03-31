import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const cert = await prisma.certification.findFirst({
    where: { id: params.id, userId: session.user.id },
  });
  if (!cert) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.certification.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
