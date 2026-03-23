import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { syncGitHubProfile } from "@/lib/github";
import { prisma } from "@/lib/prisma";

export async function POST() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get GitHub access token from the linked Account
  const account = await prisma.account.findFirst({
    where: { userId: session.user.id, providerId: "github" },
  });

  if (!account?.accessToken) {
    return NextResponse.json(
      { error: "No GitHub account linked. Sign in with GitHub to connect." },
      { status: 400 }
    );
  }

  const profile = await syncGitHubProfile(session.user.id, account.accessToken);

  return NextResponse.json({ success: true, profile });
}
