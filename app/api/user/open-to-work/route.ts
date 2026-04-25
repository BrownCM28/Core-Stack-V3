import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { JobType } from "@prisma/client";

export async function PATCH(req: Request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json().catch(() => ({}));
    const { openToWork, desiredRoleType, desiredLocation } = body as {
      openToWork?: boolean;
      desiredRoleType?: string;
      desiredLocation?: string;
    };

    const openToTypes: JobType[] | undefined =
      desiredRoleType === "Full-time"
        ? [JobType.FULL_TIME]
        : desiredRoleType === "Contract"
        ? [JobType.CONTRACT]
        : desiredRoleType === "Both"
        ? [JobType.FULL_TIME, JobType.CONTRACT]
        : undefined;

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        openToWork: openToWork ?? false,
        ...(desiredLocation !== undefined && { location: desiredLocation }),
        ...(openToTypes !== undefined && { openToTypes }),
      },
      select: {
        id: true,
        openToWork: true,
        openToTypes: true,
        location: true,
      },
    });

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error("[api/user/open-to-work]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
