import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export async function getSession() {
  return auth.api.getSession({ headers: await headers() });
}

export async function requireSession() {
  const session = await getSession();
  if (!session) redirect("/auth/login");
  return session;
}

export async function requireRole(role: string) {
  const session = await requireSession();
  // role is included via additionalFields config in auth.ts
  const userRole = (session.user as { role?: string }).role ?? "CANDIDATE";
  if (userRole !== role) redirect("/");
  return session;
}
