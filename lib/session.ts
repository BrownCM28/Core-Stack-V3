import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth, type Session } from "@/lib/auth";
import { type Role, ROLES, hasRole } from "@/lib/roles";

// ─── Raw session fetch ────────────────────────────────────────────────────────

export async function getSession(): Promise<Session | null> {
  return auth.api.getSession({ headers: await headers() });
}

// ─── Typed role helper ────────────────────────────────────────────────────────
// Reads the role off the Better Auth session and validates it against the
// known Role union — falls back to "CANDIDATE" if missing or unrecognised.

export function getUserRole(session: Session): Role {
  const raw = (session.user as { role?: string }).role;
  return ROLES.includes(raw as Role) ? (raw as Role) : "CANDIDATE";
}

// ─── Guards ───────────────────────────────────────────────────────────────────

/** Require any authenticated session. Redirects to /auth/login if missing. */
export async function requireSession(): Promise<Session> {
  const session = await getSession();
  if (!session) redirect("/auth/login");
  return session;
}

/**
 * Require an EXACT role match.
 * - Unauthenticated → /auth/login
 * - Wrong role      → /unauthorized (proper 403 page)
 * - Correct role    → returns the full session
 */
export async function requireRole(role: Role): Promise<Session> {
  const session = await requireSession();
  const userRole = getUserRole(session);
  if (userRole !== role) redirect("/unauthorized");
  return session;
}

/**
 * Require AT LEAST the given role (hierarchy-aware).
 * e.g. requireMinRole("EMPLOYER") passes for both EMPLOYER and ADMIN.
 * - Unauthenticated → /auth/login
 * - Insufficient role → /unauthorized
 * - Sufficient role   → returns the full session
 */
export async function requireMinRole(role: Role): Promise<Session> {
  const session = await requireSession();
  const userRole = getUserRole(session);
  if (!hasRole(userRole, role)) redirect("/unauthorized");
  return session;
}
