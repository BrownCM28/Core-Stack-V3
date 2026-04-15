import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      displayName: true,
      title: true,
      bio: true,
      location: true,
      openToWork: true,
      openToTypes: true,
      username: true,
      profile: {
        select: { avatarUrl: true, bio: true },
      },
    },
  });

  return NextResponse.json(user);
}

export async function PATCH(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const { name, displayName, title, bio } = body as Record<string, string | undefined>;

  const user = await prisma.user.update({
    where: { id: session.user.id },
    data: {
      ...(name?.trim() && { name: name.trim() }),
      ...(displayName !== undefined && { displayName: displayName?.trim() || null }),
      ...(title !== undefined && { title: title?.trim() || null }),
      ...(bio !== undefined && { bio: bio?.trim() || null }),
    },
    select: {
      id: true,
      name: true,
      email: true,
      displayName: true,
      title: true,
      bio: true,
    },
  });

  return NextResponse.json({ success: true, user });
}
