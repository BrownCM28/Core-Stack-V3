# CoreStack — Production Readiness Prompt Sequence
# Based on the April 17, 2026 production checklist audit.
# Organized into 4 stages: Pre-Launch Critical, Pre-Launch Important,
# Launch Week, and Post-Launch.
# Each prompt is a standalone Claude Code session.

---

# STAGE 1 — PRE-LAUNCH CRITICAL
# These block going live. Do all of these before deploying to production.
# Complete them in order — each builds on the previous.

---

## STAGE 1 — PROMPT 1: Fix the Broken Profile Page

```
Fix the server error on /app/profile/[username]/page.tsx.
This page currently throws a 500 server-side exception.

Work through this checklist in order:

1. Open /app/profile/[username]/page.tsx and find the
   data fetching logic. Look for the Prisma query that
   fetches the GitHubProfile by username.

2. Confirm the query includes all required relations:
   prisma.gitHubProfile.findUnique({
     where: { username },
     include: {
       user: {
         include: {
           certifications: true
         }
       },
       repos: {
         orderBy: { stars: 'desc' },
         take: 6
       }
     }
   })
   If any include is missing, add it.

3. Add a null check after the query. If profile is null,
   render a proper not-found UI — do not crash:
   if (!profile) {
     return (
       <div className="...">
         <h1>Profile not found</h1>
         <p>This user has not connected GitHub yet.</p>
         <Link href="/talent">Browse talent →</Link>
       </div>
     )
   }

4. Wrap the entire page data fetch in a try-catch.
   On catch, log the error and return the not-found UI
   rather than crashing.

5. Check every field accessed on profile and profile.user
   for potential undefined access. Add optional chaining
   (?.) on any field that might be null:
   - profile.bio?.
   - profile.company?.
   - profile.location?.
   - profile.blog?.
   - profile.user?.name
   - profile.skillLanguages (may be null JSON field)

6. If skillLanguages is null, the SkillGraph component
   must handle this gracefully — pass an empty object {}
   as the default, not null.

7. Test by visiting /profile/[any-username] with a valid
   username and with an invalid username. Both should
   render without a 500 error.

Run npm run build and confirm zero errors.
Show me the complete updated /app/profile/[username]/page.tsx.
```

---

## STAGE 1 — PROMPT 2: Remove Mock Data from Production

```
Remove all mock/demo data files that are currently being
used in production code. These should not exist in a
live application.

STEP 1 — Find all mock data files:
Look for these files and any others with "mock" in the name:
- /lib/mock-profile.ts
- /lib/mock-dashboard.ts
- Any file in /lib or /app that exports hardcoded fake data

STEP 2 — Find all imports of these mock files:
Search the entire codebase for imports of these files.
List every file that imports from them.

STEP 3 — For each file that imports mock data:
Replace the mock data with one of these approaches:
a) If the component already has a real API/DB query that
   works, delete the mock import and use real data only.
b) If the component has NO real data source yet, replace
   the mock data with an empty state UI:
   - Empty applications: "No applications yet"
   - Empty certifications: "No certifications added"
   - Empty profile: redirect to /auth/login or show
     "Complete your profile" prompt

STEP 4 — Delete the mock files:
Once no files import them, delete:
- /lib/mock-profile.ts
- /lib/mock-dashboard.ts
And any other mock data files found.

STEP 5 — Verify nothing broke:
Run npm run build and confirm zero errors.
Visit /dashboard and /profile pages — they should show
real data or empty states, never fake data.

Show me every file modified and the complete diff.
```

---

## STAGE 1 — PROMPT 3: Security Headers & CSP

```
Add security headers to CoreStack to pass a production
security audit. This prevents XSS, clickjacking, and
other common attacks.

STEP 1 — Add headers to next.config.mjs (or next.config.ts):

Add a headers() function that applies to all routes:

const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin'
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
]

const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline'
    https://js.stripe.com;
  style-src 'self' 'unsafe-inline'
    https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com;
  img-src 'self' data: blob:
    https://avatars.githubusercontent.com
    https://*.githubusercontent.com
    https://media.licdn.com
    https://img.logo.dev;
  connect-src 'self'
    https://api.stripe.com
    https://api.github.com
    https://api.resend.com;
  frame-src https://js.stripe.com
    https://hooks.stripe.com;
  object-src 'none';
  base-uri 'self';
  form-action 'self';
`

Add both to next config:
async headers() {
  return [
    {
      source: '/(.*)',
      headers: [
        ...securityHeaders,
        {
          key: 'Content-Security-Policy',
          value: cspHeader.replace(/\n/g, ''),
        },
      ],
    },
  ]
},

STEP 2 — Add request size limits to API routes:

In /app/api/webhooks/ingest/route.ts and
/app/api/webhooks/stripe/route.ts, add:

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
}

For the Stripe webhook route specifically, the body
parser must be disabled for signature verification.
Confirm this is already set and do not override it.

STEP 3 — Verify:
Run npm run build and confirm zero errors.
Show me the complete updated next.config file.
```

---

## STAGE 1 — PROMPT 4: Rate Limiting

```
Add rate limiting to all public-facing API routes to
prevent abuse. Use Upstash Redis with @upstash/ratelimit.

STEP 1 — Install packages:
npm install @upstash/ratelimit @upstash/redis

STEP 2 — Create /lib/ratelimit.ts:

import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

// Standard limit: 60 requests per minute
export const standardLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(60, '1 m'),
  analytics: true,
  prefix: 'corestack:standard',
})

// Strict limit: 10 requests per minute (auth, checkout)
export const strictLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '1 m'),
  analytics: true,
  prefix: 'corestack:strict',
})

// Webhook limit: 100 per minute (for Make.com bulk ingestion)
export const webhookLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(100, '1 m'),
  analytics: true,
  prefix: 'corestack:webhook',
})

Create a helper function:
export async function checkRateLimit(
  limiter: Ratelimit,
  identifier: string
): Promise<Response | null> {
  const { success, limit, remaining, reset } =
    await limiter.limit(identifier)

  if (!success) {
    return new Response('Too many requests', {
      status: 429,
      headers: {
        'X-RateLimit-Limit': limit.toString(),
        'X-RateLimit-Remaining': remaining.toString(),
        'X-RateLimit-Reset': reset.toString(),
        'Retry-After': Math.ceil((reset - Date.now()) / 1000).toString(),
      },
    })
  }
  return null
}

STEP 3 — Apply rate limiting to these routes:

/app/api/jobs/route.ts — standardLimit
  identifier: request IP address
  Add at top of GET handler:
  const ip = request.headers.get('x-forwarded-for') ?? 'anonymous'
  const rateLimitResponse = await checkRateLimit(standardLimit, ip)
  if (rateLimitResponse) return rateLimitResponse

/app/api/applications/route.ts — strictLimit
  identifier: session userId (requires auth anyway)

/app/api/checkout/route.ts — strictLimit
  identifier: session userId

/app/api/alerts/route.ts — standardLimit
  identifier: session userId

/app/api/talent/route.ts — standardLimit
  identifier: IP address

/app/api/webhooks/ingest/route.ts — webhookLimit
  identifier: 'webhook' (fixed key, not per-IP)

/app/api/webhooks/theirstack/route.ts — webhookLimit
  identifier: 'theirstack-webhook'

STEP 4 — Add env vars to .env.example:
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

STEP 5 — Handle missing Redis gracefully:
In /lib/ratelimit.ts, if UPSTASH_REDIS_REST_URL is not set,
export a no-op checkRateLimit that always returns null.
This prevents crashes in development when Redis is not
configured:

if (!process.env.UPSTASH_REDIS_REST_URL) {
  export async function checkRateLimit() { return null }
  // ... export dummy limiters
}

Run npm run build and confirm zero errors.
Show me /lib/ratelimit.ts and one example updated
route to confirm the pattern.
```

---

## STAGE 1 — PROMPT 5: Error Handling & Try-Catch Audit

```
Audit all API routes in /app/api/ and add proper
try-catch error handling to any route missing it.

STEP 1 — Audit every route file in /app/api/:
For each route.ts file, check if the handler is
wrapped in a try-catch. If not, wrap it.

Standard error response pattern to use everywhere:
try {
  // existing handler code
} catch (error) {
  console.error('[ROUTE_NAME]', error)
  return Response.json(
    { error: 'Internal server error' },
    { status: 500 }
  )
}

STEP 2 — Add consistent 401 auth checks:
Any route that requires authentication must return 401
if no session exists BEFORE doing any database work:

const session = await getSession()
if (!session) {
  return Response.json(
    { error: 'Unauthorized' },
    { status: 401 }
  )
}

Verify this pattern is in:
- /api/applications/route.ts
- /api/checkout/route.ts
- /api/alerts/route.ts (GET and POST)
- /api/certifications/route.ts
- /api/user/open-to-work/route.ts
- /api/github/sync/route.ts
- /api/admin/*/route.ts (all admin routes)

STEP 3 — Add 404 handling to single-resource routes:
/api/jobs/[id]/route.ts — if job not found:
  return Response.json({ error: 'Job not found' }, { status: 404 })

/api/alerts/[id]/route.ts — if alert not found or
  doesn't belong to current user:
  return Response.json({ error: 'Not found' }, { status: 404 })

/api/certifications/[id]/route.ts — same pattern

STEP 4 — Verify webhook routes return fast:
/api/webhooks/stripe/route.ts must return 200 immediately
after receiving the event — Stripe times out at 30 seconds.
Confirm the handler returns Response.json({ received: true })
at the end regardless of processing outcome.

Run npm run build and confirm zero errors.
List every file that was modified.
```

---

## STAGE 1 — PROMPT 6: Database Indexes & Connection Pooling

```
Add database indexes for common queries and configure
Prisma connection pooling for production.

STEP 1 — Add indexes to /prisma/schema.prisma:

On the Job model, add these indexes after the existing
@@unique and @@index declarations:

@@index([category])
@@index([jobType])
@@index([active, expiresAt])
@@index([active, featured, postedAt])
@@index([company])
@@index([postedAt(sort: Desc)])

On the Application model:
@@index([userId])
@@index([jobId])
@@index([appliedAt(sort: Desc)])

On the User model:
@@index([email])
@@index([role])
@@index([openToWork])

On the GitHubProfile model:
@@index([username])
@@index([userId])

On the SavedSearch model:
@@index([userId])
@@index([active])

On the ActivityEvent model:
@@index([createdAt(sort: Desc)])

On the Certification model:
@@index([userId])

STEP 2 — Run the migration:
npx prisma migrate dev --name add_production_indexes

STEP 3 — Configure connection pooling in /lib/prisma.ts:

Replace the existing Prisma singleton with:

import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development'
      ? ['query', 'error', 'warn']
      : ['error'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

STEP 4 — Add connection pool URL parameter:
In .env.example, update DATABASE_URL comment:
# Add ?pgbouncer=true&connection_limit=10 for production
# with PgBouncer (Supabase/Neon provide this automatically)
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/corestack

Run npm run build and confirm zero errors.
Show me the updated schema.prisma indexes section
and /lib/prisma.ts.
```

---

## STAGE 1 — PROMPT 7: Input Validation & Sanitization

```
Audit all API routes to ensure every user input is
validated with Zod and sanitized before database writes.

STEP 1 — Install DOMPurify for HTML sanitization:
npm install isomorphic-dompurify
npm install --save-dev @types/dompurify

STEP 2 — Create /lib/sanitize.ts:

import DOMPurify from 'isomorphic-dompurify'

// Strip all HTML from a string
export function sanitizeText(input: string): string {
  return DOMPurify.sanitize(input, { ALLOWED_TAGS: [] })
    .trim()
}

// Allow basic formatting HTML (for job descriptions)
export function sanitizeHtml(input: string): string {
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: ['p', 'br', 'ul', 'ol', 'li',
      'strong', 'em', 'h2', 'h3'],
    ALLOWED_ATTR: [],
  }).trim()
}

STEP 3 — Apply sanitization to these routes:

/app/api/webhooks/ingest/route.ts:
After Zod validation, sanitize the description field:
  data.description = sanitizeHtml(data.description)
  data.title = sanitizeText(data.title)
  data.company = sanitizeText(data.company)

/app/api/certifications/route.ts (POST):
  body.name = sanitizeText(body.name)
  body.issuer = sanitizeText(body.issuer)
  body.credentialId = body.credentialId
    ? sanitizeText(body.credentialId) : undefined

/app/api/alerts/route.ts (POST):
  body.name = sanitizeText(body.name)

/app/api/user/profile route (PATCH) if it exists:
  body.name = sanitizeText(body.name)

STEP 4 — Verify Zod schemas on all POST/PATCH routes:
Check that every route with a request body has a Zod
schema that validates BEFORE any database operation.

Routes to verify:
- /api/webhooks/ingest (should already have this)
- /api/certifications (POST)
- /api/alerts (POST)
- /api/alerts/[id] (PATCH)
- /api/checkout (POST)
- /api/applications (POST)
- /api/user/open-to-work (PATCH)

For any route missing Zod validation, add a schema:
import { z } from 'zod'

const schema = z.object({ ... })
const result = schema.safeParse(body)
if (!result.success) {
  return Response.json(
    { error: 'Invalid request', details: result.error.flatten() },
    { status: 400 }
  )
}

Run npm run build and confirm zero errors.
Show me /lib/sanitize.ts and the updated ingest route.
```

---

## STAGE 1 — PROMPT 8: SEO — Metadata, Sitemap & Robots

```
Add production SEO infrastructure to CoreStack.
This covers dynamic metadata, sitemap.xml, and robots.txt.

STEP 1 — Add generateMetadata to all public pages:

/app/page.tsx (homepage):
export const metadata = {
  title: 'CoreStack — Data Center & AI Infrastructure Jobs',
  description: 'Browse data center construction, operations, and AI infrastructure jobs. Updated daily from top employers.',
  openGraph: {
    title: 'CoreStack — Data Center & AI Infrastructure Jobs',
    description: 'The niche job board for infrastructure engineers.',
    type: 'website',
    url: 'https://corestack.io',
  },
}

/app/jobs/page.tsx:
export const metadata = {
  title: 'Browse Jobs — CoreStack',
  description: 'Search and filter data center and AI infrastructure roles by category, location, salary, and job type.',
}

/app/jobs/[id]/page.tsx — dynamic:
export async function generateMetadata({ params }) {
  const job = await prisma.job.findUnique({
    where: { id: params.id }
  })
  if (!job) return { title: 'Job Not Found — CoreStack' }
  return {
    title: `${job.title} at ${job.company} — CoreStack`,
    description: job.description.slice(0, 160),
    openGraph: {
      title: `${job.title} at ${job.company}`,
      description: job.description.slice(0, 160),
    },
  }
}

/app/profile/[username]/page.tsx — dynamic:
export async function generateMetadata({ params }) {
  const profile = await prisma.gitHubProfile.findUnique({
    where: { username: params.username },
    include: { user: true }
  })
  if (!profile) return { title: 'Profile Not Found — CoreStack' }
  return {
    title: `${profile.user?.name ?? profile.username} — CoreStack`,
    description: profile.bio ?? `Infrastructure engineer on CoreStack.`,
  }
}

/app/talent/page.tsx:
export const metadata = {
  title: 'Browse Engineering Talent — CoreStack',
  description: 'Discover data center and AI infrastructure engineers open to new opportunities.',
}

/app/employers/page.tsx:
export const metadata = {
  title: 'Post a Job — CoreStack',
  description: 'Reach thousands of data center and AI infrastructure engineers. Post a listing from $99.',
}

STEP 2 — Create /app/sitemap.ts:

import { prisma } from '@/lib/prisma'
import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://corestack.io'

  // Static routes
  const staticRoutes = [
    '', '/jobs', '/talent', '/employers',
    '/auth/login', '/auth/signup',
  ].map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  // Dynamic job pages
  const jobs = await prisma.job.findMany({
    where: { active: true },
    select: { id: true, updatedAt: true },
  })
  const jobRoutes = jobs.map(job => ({
    url: `${baseUrl}/jobs/${job.id}`,
    lastModified: job.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  // Dynamic profile pages
  const profiles = await prisma.gitHubProfile.findMany({
    select: { username: true, lastSyncedAt: true },
  })
  const profileRoutes = profiles.map(p => ({
    url: `${baseUrl}/profile/${p.username}`,
    lastModified: p.lastSyncedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.5,
  }))

  return [...staticRoutes, ...jobRoutes, ...profileRoutes]
}

STEP 3 — Create /app/robots.ts:

import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin',
        '/dashboard',
        '/api/',
        '/auth/',
      ],
    },
    sitemap: 'https://corestack.io/sitemap.xml',
  }
}

Run npm run build and confirm zero errors.
Show me all new and modified files.
```

---

## STAGE 1 — PROMPT 9: 404 & Error Pages

```
Add proper 404 and error boundary pages to CoreStack.

STEP 1 — Create /app/not-found.tsx (global 404):

'use client' is NOT needed — this is a server component.

import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col
      items-center justify-center px-4 text-center">
      <p className="font-mono text-xs uppercase tracking-widest
        text-[#3ECF8E] mb-4">404</p>
      <h1 className="font-mono text-4xl font-bold
        text-[#0D0F12] mb-4">
        Page not found.
      </h1>
      <p className="text-[#6B6560] mb-8 max-w-sm">
        The page you are looking for does not exist or
        has been removed.
      </p>
      <div className="flex gap-4">
        <Link href="/"
          className="btn-primary px-4 py-2 text-sm
            font-mono rounded-md">
          Go home
        </Link>
        <Link href="/jobs"
          className="btn-wire px-4 py-2 text-sm
            font-mono rounded-md">
          Browse jobs
        </Link>
      </div>
    </div>
  )
}

STEP 2 — Create /app/error.tsx (global error boundary):

'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col
      items-center justify-center px-4 text-center">
      <p className="font-mono text-xs uppercase tracking-widest
        text-red-400 mb-4">Something went wrong</p>
      <h1 className="font-mono text-4xl font-bold
        text-[#0D0F12] mb-4">
        Unexpected error.
      </h1>
      <p className="text-[#6B6560] mb-8 max-w-sm">
        An error occurred while loading this page.
        Please try again.
      </p>
      <button
        onClick={reset}
        className="btn-primary px-4 py-2 text-sm
          font-mono rounded-md">
        Try again
      </button>
    </div>
  )
}

STEP 3 — Add loading.tsx skeleton pages:

Create /app/jobs/loading.tsx:
export default function JobsLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex gap-8">
        <div className="w-72 flex-shrink-0">
          <div className="h-96 bg-[#E2DDD8] rounded-lg
            animate-pulse" />
        </div>
        <div className="flex-1 flex flex-col gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-32 bg-[#E2DDD8]
              rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  )
}

Create /app/profile/[username]/loading.tsx:
export default function ProfileLoading() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="h-32 bg-[#E2DDD8] rounded-lg
        animate-pulse mb-6" />
      <div className="grid grid-cols-2 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-40 bg-[#E2DDD8]
            rounded-lg animate-pulse" />
        ))}
      </div>
    </div>
  )
}

Create /app/talent/loading.tsx — same pattern.

Run npm run build and confirm zero errors.
Show me all created files.
```

---

## STAGE 1 — PROMPT 10: Production Environment & Stripe Live Mode

```
Prepare the production environment configuration and
switch Stripe to live mode.

STEP 1 — Create .env.production.example:
(This is a template — never commit actual values)

# Database (production PostgreSQL — Neon or Supabase)
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/corestack?sslmode=require

# Auth (generate with: openssl rand -base64 32)
BETTER_AUTH_SECRET=<32-char-random-string>
BETTER_AUTH_URL=https://corestack.io

# GitHub OAuth (update redirect URL to production domain)
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=

# Google OAuth (update redirect URL to production domain)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Stripe LIVE MODE (switch from sk_test_ to sk_live_)
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...

# Webhook secrets (generate new random strings for production)
MAKE_WEBHOOK_SECRET=<random-32-char>
THEIRSTACK_WEBHOOK_SECRET=<random-32-char>

# Email
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=noreply@corestack.io

# Rate limiting (create free account at upstash.com)
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

STEP 2 — Add a Stripe mode indicator comment in
/app/api/checkout/route.ts:

Find where the Stripe checkout session is created.
Add this comment directly above it:

// STRIPE MODE: Currently using TEST keys.
// To go live: replace STRIPE_SECRET_KEY with sk_live_...
// and NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY with pk_live_...
// in Vercel environment variables.
// Also update the Stripe webhook endpoint in the Stripe
// dashboard to point to https://corestack.io/api/webhooks/stripe
// and generate a new STRIPE_WEBHOOK_SECRET.

STEP 3 — Verify the Stripe webhook route handles
production signatures correctly:

In /app/api/webhooks/stripe/route.ts confirm:
- stripe.webhooks.constructEvent() is called with the
  raw request body (not parsed JSON)
- STRIPE_WEBHOOK_SECRET is read from process.env
- The route returns 200 for all events even ones it
  does not handle (prevents Stripe retries)

STEP 4 — Update README.md with production deployment steps:

Add a section called "## Production Deployment" with:

1. Set all environment variables in Vercel dashboard
2. Run database migrations: npx prisma migrate deploy
3. Update GitHub OAuth app redirect URL to production domain
4. Update Google OAuth app redirect URL to production domain
5. Configure Stripe live webhook endpoint
6. Verify Resend domain for email deliverability
7. Set up Upstash Redis for rate limiting

Run npm run build and confirm zero errors.
Show me the updated .env.production.example and README section.
```

---

# STAGE 2 — LAUNCH WEEK
# Do these in the first week after going live.
# These improve stability and observability but do not block launch.

---

## STAGE 2 — PROMPT 11: Error Tracking with Sentry

```
Install and configure Sentry for production error tracking.

STEP 1 — Install:
npm install @sentry/nextjs

STEP 2 — Run the Sentry wizard:
npx @sentry/wizard@latest -i nextjs

This will create:
- sentry.client.config.ts
- sentry.server.config.ts
- sentry.edge.config.ts
- instrumentation.ts
- next.config updates

STEP 3 — Configure /sentry.server.config.ts:
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
  enabled: process.env.NODE_ENV === 'production',
})

STEP 4 — Configure /sentry.client.config.ts:
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  enabled: process.env.NODE_ENV === 'production',
  integrations: [
    Sentry.replayIntegration(),
  ],
})

STEP 5 — Add SENTRY_DSN to .env.example and
.env.production.example.

STEP 6 — Replace the most critical console.error calls
with Sentry.captureException:

In /app/api/webhooks/ingest/route.ts:
import * as Sentry from '@sentry/nextjs'
// In the catch block:
Sentry.captureException(error, {
  extra: { jobData: data }
})

In /app/api/webhooks/stripe/route.ts:
// In the catch block:
Sentry.captureException(error, {
  extra: { stripeEvent: event?.type }
})

Run npm run build and confirm zero errors.
Show me the sentry config files.
```

---

## STAGE 2 — PROMPT 12: Performance — ISR & Caching

```
Add Incremental Static Regeneration (ISR) to public
pages and implement basic caching for the job board.

STEP 1 — Add ISR revalidation to job detail pages:

In /app/jobs/[id]/page.tsx, add at the top of the file:
export const revalidate = 3600 // revalidate every hour

STEP 2 — Add ISR to the talent page:
In /app/talent/page.tsx:
export const revalidate = 1800 // revalidate every 30 min

STEP 3 — Add Next.js fetch caching to the jobs API:

In /app/jobs/page.tsx where it fetches from /api/jobs,
use Next.js fetch with cache options:
const res = await fetch(`${process.env.BETTER_AUTH_URL}/api/jobs?${params}`, {
  next: { revalidate: 300 } // cache for 5 minutes
})

STEP 4 — Add cache-control headers to the jobs API route:

In /app/api/jobs/route.ts, add cache headers to the
GET response:
return Response.json(data, {
  headers: {
    'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
  },
})

Only add this to the GET (listing) route, not to any
route that reads auth session or user-specific data.

STEP 5 — Generate static params for job category pages
if /app/jobs/category/[category]/page.tsx exists:

export async function generateStaticParams() {
  return [
    'data-center-ops',
    'construction',
    'electrical',
    'cooling-hvac',
    'ai-infrastructure',
    'networking',
    'project-management',
  ].map(category => ({ category }))
}
export const revalidate = 3600

Run npm run build and confirm zero errors.
Show me all modified files.
```

---

# STAGE 3 — POST-LAUNCH (WEEKS 2-4)
# These enhance the product once it is stable and live.

---

## STAGE 3 — PROMPT 13: Email Notifications

```
Add email notifications for key platform events using
the existing Resend integration.

STEP 1 — Create /lib/emails.ts with template functions:

import { resend } from './resend'

// Email 1: New application notification to employer
export async function sendApplicationNotification({
  employerEmail,
  jobTitle,
  company,
  candidateName,
  profileUrl,
}: {
  employerEmail: string
  jobTitle: string
  company: string
  candidateName: string
  profileUrl: string
}) {
  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to: employerEmail,
    subject: `New application: ${jobTitle} at ${company}`,
    html: `
      <h2>New application received</h2>
      <p>${candidateName} has applied to your listing:
        <strong>${jobTitle}</strong></p>
      <p><a href="${profileUrl}">View candidate profile →</a></p>
      <hr />
      <p style="color:#6B6560;font-size:12px">
        CoreStack · Unsubscribe
      </p>
    `
  })
}

// Email 2: Job expiry warning (7 days before)
export async function sendJobExpiryWarning({
  employerEmail,
  jobTitle,
  expiresAt,
  jobId,
}: {
  employerEmail: string
  jobTitle: string
  expiresAt: Date
  jobId: string
}) {
  const expiryDate = expiresAt.toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric'
  })
  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to: employerEmail,
    subject: `Your listing expires soon: ${jobTitle}`,
    html: `
      <h2>Your listing expires on ${expiryDate}</h2>
      <p>Your CoreStack listing for <strong>${jobTitle}</strong>
        will expire on ${expiryDate}.</p>
      <p><a href="${process.env.BETTER_AUTH_URL}/employers">
        Renew your listing →</a></p>
    `
  })
}

// Email 3: Welcome email on signup
export async function sendWelcomeEmail({
  email,
  name,
}: {
  email: string
  name: string
}) {
  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to: email,
    subject: 'Welcome to CoreStack',
    html: `
      <h2>Welcome to CoreStack, ${name}!</h2>
      <p>You've joined the niche job board for data center
        and AI infrastructure professionals.</p>
      <p><a href="${process.env.BETTER_AUTH_URL}/jobs">
        Browse open roles →</a></p>
    `
  })
}

STEP 2 — Wire up sendApplicationNotification:
In /app/api/applications/route.ts, after successfully
creating the application, call the notification:

After inserting the application:
- Find the job's postedBy employer user
- If postedBy exists and has an email, call
  sendApplicationNotification(...)
- Wrap in try-catch — email failure should never
  block the application from being saved

STEP 3 — Wire up sendWelcomeEmail:
In the Better Auth configuration in /lib/auth.ts,
find or add the afterSignUp callback hook and call
sendWelcomeEmail there.

Run npm run build and confirm zero errors.
Show me /lib/emails.ts and the updated applications route.
```

---

## STAGE 3 — PROMPT 14: Admin Dashboard Analytics

```
Add analytics to the admin dashboard so you can monitor
platform health without logging into the database.

STEP 1 — Update /app/api/admin/stats/route.ts to return
more detailed metrics:

Return this shape:
{
  overview: {
    totalJobs: number,
    activeJobs: number,
    totalUsers: number,
    totalApplications: number,
    openToWorkCandidates: number,
    githubConnectedUsers: number,
  },
  revenue: {
    allTime: number,      // sum of all paid listings
    thisMonth: number,    // sum this calendar month
    lastMonth: number,    // sum last calendar month
    featuredListings: number,  // count of featured paid
    standardListings: number,  // count of standard paid
  },
  growth: {
    newUsersToday: number,
    newUsersThisWeek: number,
    newJobsToday: number,
    newJobsThisWeek: number,
    applicationsToday: number,
  },
  topCategories: Array<{
    category: string,
    count: number,
  }>,
  topCompanies: Array<{
    company: string,
    count: number,
  }>,
}

Implement each metric with Prisma queries.
Use Promise.all() to run queries in parallel.

STEP 2 — Update /app/admin/page.tsx to display:

Row 1 — Overview cards (6 cards):
Total Jobs | Active Jobs | Total Users | Applications
Open to Work | GitHub Connected

Row 2 — Revenue cards (3 cards):
All-Time Revenue | This Month | Last Month

Row 3 — Growth (today + this week for users, jobs, apps)

Row 4 — Two column: Top Categories | Top Companies
Each as a simple ranked list with counts

All numbers formatted with toLocaleString() for readability.
Revenue formatted as currency: $X,XXX

Run npm run build and confirm zero errors.
Show me the updated stats route and admin page.
```

---

## STAGE 3 — PROMPT 15: Password Reset Flow

```
Verify and fix the password reset flow end-to-end.

STEP 1 — Test the forgot password form at /auth/forgot-password:
- The form must POST to Better Auth's forgot password endpoint
- Better Auth should send an email with a reset link
- Verify RESEND_API_KEY is being used to send the email

STEP 2 — Create /app/auth/reset-password/page.tsx if it
does not exist:
- This page is linked from the reset email
- It reads a token from the URL query params
- Shows a form: New Password + Confirm Password
- Submits to Better Auth's reset password endpoint
- On success: redirect to /auth/login with a success message
- On error: show "Reset link expired or invalid"

STEP 3 — In /app/auth/login/page.tsx, add a success
message display:
If the URL has ?reset=success query param, show a
green banner: "Password reset successfully. Please sign in."

STEP 4 — Verify Better Auth is configured to handle
password reset:
In /lib/auth.ts, confirm emailAndPassword is configured
with sendResetPassword callback that calls Resend.

Run npm run build and confirm zero errors.
Show me the reset password page and the auth config.
```

---

# STAGE 4 — POST-LAUNCH (MONTH 2+)
# These are important but not urgent. Do them once the
# platform has real users and revenue.

---

## STAGE 4 — PROMPT 16: Automated Job Quality Scoring

```
Add automated job quality scoring to flag low-quality
listings before they go live.

Build a scoreJob(job) function in /lib/job-quality.ts
that returns a quality score 0-100 and a list of issues.

Scoring criteria:
- Has description > 200 chars: +25 points
- Has salary range: +20 points
- Has specific location (not just "Remote"): +10 points
- Description mentions responsibilities: +15 points
- Description mentions requirements: +15 points
- Has valid applyUrl (not a redirect): +10 points
- Is not a duplicate title+company in last 30 days: +5 points

Return { score: number, issues: string[] }

Call this in the ingest handler and store the score on
the Job model. Add a qualityScore Int? field to the
Prisma schema.

In the admin panel, show the quality score on each job
row. Flag jobs with score < 50 with a yellow warning icon.
```

---

## STAGE 4 — PROMPT 17: Resume Upload

```
Add optional resume/CV upload for candidates using
Vercel Blob storage.

Install: npm install @vercel/blob

Add to User model: resumeUrl String?

Create /app/api/user/resume/route.ts:
- POST: accepts a PDF file upload (max 5MB)
- Validates: PDF only, max 5MB
- Uploads to Vercel Blob with put()
- Saves the blob URL to user.resumeUrl
- Returns { url: string }

Add a resume upload section to the dashboard Settings tab:
- "Upload Resume" button
- Shows current resume filename if one exists
- "Download" and "Delete" options for existing resume
- File input (PDF only, max 5MB)

Show resume download link on public profile if the
candidate has set their profile to show it.
```

---

## STAGE 4 — PROMPT 18: Company Profiles

```
Add auto-generated company profile pages that aggregate
all listings from a company.

Create /app/companies/[slug]/page.tsx:
- slug is the company name lowercased with spaces
  replaced by hyphens (e.g. "digital-realty")
- Fetch all active jobs where company matches (case insensitive)
- Display: company name, job count, active listings grid
- Add ISR: revalidate = 3600

Create /app/api/companies/route.ts:
- GET: returns list of companies with job counts
  SELECT company, COUNT(*) as jobCount
  FROM Job WHERE active = true
  GROUP BY company
  ORDER BY jobCount DESC
  LIMIT 50

Add "View all roles at {company} →" links on job detail
pages that link to /companies/[slug].

Generate static params for top 20 companies.
```

---

# QUICK REFERENCE — STAGE ORDER

Stage 1 (Pre-Launch Critical — do before going live):
  Prompt 1:  Fix broken profile page (500 error)
  Prompt 2:  Remove mock data from production
  Prompt 3:  Security headers & CSP
  Prompt 4:  Rate limiting (Upstash Redis)
  Prompt 5:  Error handling audit (try-catch all routes)
  Prompt 6:  Database indexes & connection pooling
  Prompt 7:  Input validation & sanitization
  Prompt 8:  SEO — metadata, sitemap, robots.txt
  Prompt 9:  404 & error boundary pages
  Prompt 10: Production environment & Stripe live mode

Stage 2 (Launch Week — first 7 days):
  Prompt 11: Sentry error tracking
  Prompt 12: ISR & caching

Stage 3 (Post-Launch Weeks 2-4):
  Prompt 13: Email notifications
  Prompt 14: Admin analytics dashboard
  Prompt 15: Password reset flow

Stage 4 (Month 2+):
  Prompt 16: Job quality scoring
  Prompt 17: Resume upload
  Prompt 18: Company profiles
