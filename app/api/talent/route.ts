import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";
import { checkRateLimit, standardLimit } from "@/lib/ratelimit";

export interface ApiTalent {
  id: string;
  name: string;
  username: string;
  githubUsername: string | null;
  displayName: string | null;
  location: string | null;
  openToTypes: string[];
  skills: string[];
  certifications: { id: string; name: string; issuer: string }[];
  avatarUrl: string | null;
}

export async function GET(req: Request) {
  const ip = req.headers.get("x-forwarded-for") ?? "anonymous";
  const rl = await checkRateLimit(standardLimit, ip);
  if (rl) return rl;

  const { searchParams } = new URL(req.url);

  const language = searchParams.get("language");
  const roleType = searchParams.get("roleType");
  const location = searchParams.get("location");
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
  const limit = Math.min(24, Math.max(1, parseInt(searchParams.get("limit") ?? "12")));

  const where: Prisma.UserWhereInput = {
    openToWork: true,
    username: { not: null },
    ...(language && {
      skills: { hasSome: [language] },
    }),
    ...(roleType && roleType !== "Both" && {
      openToTypes: {
        hasSome: roleType === "Full-time" ? ["FULL_TIME"] : ["CONTRACT"],
      },
    }),
    ...(roleType === "Both" && {
      openToTypes: { hasSome: ["FULL_TIME", "CONTRACT"] },
    }),
    ...(location && {
      location: { contains: location, mode: "insensitive" },
    }),
  };

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        name: true,
        username: true,
        displayName: true,
        location: true,
        openToTypes: true,
        skills: true,
        certifications: {
          take: 3,
          orderBy: { createdAt: "desc" },
          select: { id: true, name: true, issuer: true },
        },
        profile: {
          select: { avatarUrl: true, username: true },
        },
      },
    }),
    prisma.user.count({ where }),
  ]);

  const talent: ApiTalent[] = users.map((u) => ({
    id: u.id,
    name: u.name,
    username: u.username!,
    githubUsername: u.profile?.username ?? null,
    displayName: u.displayName,
    location: u.location,
    openToTypes: u.openToTypes as string[],
    skills: u.skills,
    certifications: u.certifications,
    avatarUrl: u.profile?.avatarUrl ?? null,
  }));

  return NextResponse.json({
    talent,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });
}
