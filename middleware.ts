import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*", "/employers/:path*"],
};

async function getEdgeSession(req: NextRequest): Promise<{ user?: { role?: string } } | null> {
  try {
    const res = await fetch(`${req.nextUrl.origin}/api/auth/get-session`, {
      headers: { cookie: req.headers.get("cookie") ?? "" },
    });
    if (!res.ok) return null;
    return (await res.json()) as { user?: { role?: string } };
  } catch {
    return null;
  }
}

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const session = await getEdgeSession(req);
  const isAuthed = !!session?.user;

  // Helper to build login redirect
  const loginRedirect = () => {
    const url = req.nextUrl.clone();
    url.pathname = "/auth/login";
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  };

  // /dashboard/* and /employers/* — require any authenticated session
  if ((pathname.startsWith("/dashboard") || pathname.startsWith("/employers")) && !isAuthed) {
    return loginRedirect();
  }

  // /admin/* — require auth + ADMIN role
  if (pathname.startsWith("/admin")) {
    if (!isAuthed) return loginRedirect();

    if (session?.user?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/unauthorized", req.url));  // ← consistent with session.ts
    }
  }

  return NextResponse.next(); 
}
