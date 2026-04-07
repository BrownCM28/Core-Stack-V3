import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*"],
};

// Fetch session from Better Auth via HTTP — avoids Prisma in edge runtime
async function getEdgeSession(req: NextRequest): Promise<{ user?: { role?: string } } | null> {
  try {
    const res = await fetch(`${req.nextUrl.origin}/api/auth/get-session`, {
      headers: { cookie: req.headers.get("cookie") ?? "" },
      // Don't follow redirects — a redirect means no session
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

  // /dashboard/* — require any authenticated session
  if (pathname.startsWith("/dashboard") && !isAuthed) {
    const url = req.nextUrl.clone();
    url.pathname = "/auth/login";
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  // /admin/* — require auth + ADMIN role
  if (pathname.startsWith("/admin")) {
    if (!isAuthed) {
      const url = req.nextUrl.clone();
      url.pathname = "/auth/login";
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }
    if (session?.user?.role !== "ADMIN") {
      return new NextResponse(
        `<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><title>403 Forbidden | CoreStack</title>
<style>body{font-family:monospace;background:#F5F2EE;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0}
.box{text-align:center}h1{font-size:1.5rem;color:#0D0F12;margin-bottom:.5rem}
p{color:#6B6560;font-size:.875rem;margin-bottom:1.5rem}
a{color:#3ECF8E;text-decoration:none;font-weight:600}</style>
</head>
<body><div class="box">
<h1>403 — Forbidden</h1>
<p>You don't have permission to access this page.</p>
<a href="/">← Back to home</a>
</div></body></html>`,
        { status: 403, headers: { "content-type": "text/html" } }
      );
    }
  }

  return NextResponse.next();
}
