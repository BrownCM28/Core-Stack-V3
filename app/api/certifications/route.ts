import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { sanitizeText } from "@/lib/sanitize";

const CreateCertSchema = z.object({
  name:          z.string().min(1).max(200),
  issuer:        z.string().min(1).max(200),
  issuedAt:      z.string().min(1).max(50),
  expiresAt:     z.string().max(50).optional().nullable(),
  credentialId:  z.string().max(200).optional().nullable(),
  credentialUrl: z.string().url().optional().nullable(),
});

export async function GET() {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const certifications = await prisma.certification.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(certifications);
  } catch (error) {
    console.error("[api/certifications GET]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json().catch(() => null);
    const parsed = CreateCertSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { name, issuer, issuedAt, expiresAt, credentialId, credentialUrl } = parsed.data;

    const cert = await prisma.certification.create({
      data: {
        name:          sanitizeText(name),
        issuer:        sanitizeText(issuer),
        issuedAt:      sanitizeText(issuedAt),
        expiresAt:     expiresAt     ? sanitizeText(expiresAt)    : null,
        credentialId:  credentialId  ? sanitizeText(credentialId) : null,
        credentialUrl: credentialUrl ?? null,
        userId: session.user.id,
      },
    });

    return NextResponse.json(cert, { status: 201 });
  } catch (error) {
    console.error("[api/certifications POST]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

