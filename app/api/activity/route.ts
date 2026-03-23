import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { ApiActivity } from "@/lib/types";

function formatEventText(
  type: string,
  payload: Record<string, unknown> | null,
  userName: string
): string {
  switch (type) {
    case "APPLICATION_SUBMITTED":
      return `${userName} applied to ${payload?.jobTitle ?? "a role"} at ${payload?.company ?? "a company"}`;
    case "APPLICATION_VIEWED":
      return `An employer viewed ${userName}'s application for ${payload?.jobTitle ?? "a role"}`;
    case "APPLICATION_SHORTLISTED":
      return `${userName} was shortlisted for ${payload?.jobTitle ?? "a role"}`;
    case "APPLICATION_REJECTED":
      return `${userName}'s application for ${payload?.jobTitle ?? "a role"} was not progressed`;
    case "PROFILE_VIEWED":
      return `${payload?.viewerCompany ?? "An employer"} viewed ${userName}'s profile`;
    case "JOB_SAVED":
      return `${userName} saved ${payload?.jobTitle ?? "a role"}`;
    case "ALERT_MATCH":
      return `Alert "${payload?.alertName ?? "search"}" matched ${payload?.matchCount ?? 0} new roles`;
    case "CERT_ADDED":
      return `${userName} added ${payload?.certName ?? "a certification"}`;
    default:
      return `Activity from ${userName}`;
  }
}

function timeAgo(date: Date): string {
  const diffMs = Date.now() - date.getTime();
  const mins = Math.floor(diffMs / 60_000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return `${Math.floor(days / 7)}w ago`;
}

export async function GET() {
  const events = await prisma.activityEvent.findMany({
    orderBy: { createdAt: "desc" },
    take: 20,
    include: {
      user: { select: { name: true, username: true } },
    },
  });

  const result: ApiActivity[] = events.map((e) => ({
    id: e.id,
    text: formatEventText(
      e.type,
      e.payload as Record<string, unknown> | null,
      e.user.name
    ),
    timeAgo: timeAgo(e.createdAt),
  }));

  return NextResponse.json(result);
}
