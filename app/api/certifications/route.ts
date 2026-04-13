import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const certifications = await prisma.certification.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(certifications);
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const { name, issuer, issuedAt, expiresAt, credentialId, credentialUrl } =
    body as Record<string, string | undefined>;

  if (!name?.trim() || !issuer?.trim() || !issuedAt?.trim()) {
    return NextResponse.json(
      { error: "name, issuer, and issuedAt are required" },
      { status: 400 }
    );
  }

  const cert = await prisma.certification.create({
    data: {
      name: name.trim(),
      issuer: issuer.trim(),
      issuedAt: issuedAt.trim(),
      expiresAt: expiresAt?.trim() || null,
      credentialId: credentialId?.trim() || null,
      credentialUrl: credentialUrl?.trim() || null,
      userId: session.user.id,
    },
  });

  return NextResponse.json(cert, { status: 201 });
}
