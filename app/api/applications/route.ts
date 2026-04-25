import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const applications = await prisma.application.findMany({
      where: { userId: session.user.id },
      orderBy: { appliedAt: "desc" },
      include: {
        job: {
          select: {
            id: true,
            title: true,
            company: true,
            companyLogo: true,
            location: true,
            isActive: true,
          },
        },
      },
    });

    return NextResponse.json(applications);
  } catch (error) {
    console.error("[api/applications GET]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json().catch(() => ({}));
    const { jobId } = body as { jobId?: string };
    if (!jobId) return NextResponse.json({ error: "jobId required" }, { status: 400 });

    const jobExists = await prisma.job.findFirst({ where: { id: jobId, isActive: true } });
    if (!jobExists) return NextResponse.json({ error: "Job not found" }, { status: 404 });

    const application = await prisma.application.upsert({
      where: { userId_jobId: { userId: session.user.id, jobId } },
      create: { userId: session.user.id, jobId },
      update: {},
    });

    return NextResponse.json({ success: true, application });
  } catch (error) {
    console.error("[api/applications POST]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
