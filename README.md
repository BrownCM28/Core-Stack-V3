# CoreStack

The job board for data center construction, operations, and AI infrastructure professionals.

## Tech Stack

- **Framework**: Next.js 14 (App Router) + TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL + Prisma
- **Auth**: Better Auth
- **Payments**: Stripe
- **Email**: Resend

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database

### Setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Configure environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Fill in the values in `.env.local` (see Environment Variables below).

3. **Run the development server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `BETTER_AUTH_SECRET` | Secret key for Better Auth session signing |
| `BETTER_AUTH_URL` | Base URL of the app (e.g. `http://localhost:3000`) |
| `GITHUB_CLIENT_ID` | GitHub OAuth app client ID |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth app client secret |
| `GOOGLE_CLIENT_ID` | Google OAuth app client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth app client secret |
| `STRIPE_SECRET_KEY` | Stripe secret key (`sk_...`) |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret (`whsec_...`) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key (`pk_...`) |
| `MAKE_WEBHOOK_SECRET` | Shared secret for Make.com webhook validation |
| `THEIRSTACK_WEBHOOK_SECRET` | Shared secret for TheirStack webhook validation |
| `RESEND_API_KEY` | Resend API key for transactional email |
| `RESEND_FROM_EMAIL` | From address for outbound email |

## Webhook Ingestion

CoreStack accepts job postings via webhook from Make.com and Theirstack. All endpoints require an `x-webhook-secret` header.

### Endpoints

| Endpoint | Source | Notes |
|----------|--------|-------|
| `POST /api/webhooks/ingest` | Any | Generic handler; accepts CoreStack schema directly |
| `POST /api/webhooks/make` | Make.com | Alias for `/ingest` — point your Make scenario here |
| `POST /api/webhooks/theirstack` | Theirstack | Maps native Theirstack payload before ingesting |

### Authentication

Set a random secret in your environment and pass it as the `x-webhook-secret` header:

```
MAKE_WEBHOOK_SECRET=<random-secret>
THEIRSTACK_WEBHOOK_SECRET=<random-secret>
```

### CoreStack webhook schema (Make.com / generic)

```json
{
  "title": "Senior SRE",
  "company": "Acme Corp",
  "location": "Austin, TX",
  "description": "...",
  "applyUrl": "https://acme.com/jobs/123",
  "jobType": "full-time",
  "level": "senior",
  "salaryMin": 140000,
  "salaryMax": 180000,
  "remote": false,
  "tags": ["kubernetes", "terraform"],
  "postedAt": "2026-04-05T00:00:00Z"
}
```

Send a single object or a JSON array of objects. Duplicate jobs (matched by `applyUrl`, or by `title + company + location`) are silently skipped.

### Example curl

```bash
curl -X POST https://your-domain.com/api/webhooks/ingest \
  -H "Content-Type: application/json" \
  -H "x-webhook-secret: $MAKE_WEBHOOK_SECRET" \
  -d '{
    "title": "Data Center Technician",
    "company": "Equinix",
    "location": "Dallas, TX",
    "description": "Responsible for day-to-day operations of a Tier 4 facility...",
    "applyUrl": "https://equinix.com/careers/1234",
    "jobType": "full-time"
  }'
```

### Theirstack payload

The `/api/webhooks/theirstack` endpoint accepts Theirstack's native format and auto-maps fields:

| Theirstack field | CoreStack field |
|-----------------|-----------------|
| `job_title` | `title` |
| `company_object.name` | `company` |
| `city` + `country` | `location` |
| `employment_type` | `jobType` |
| `min_annual_salary` | `salaryMin` |
| `max_annual_salary` | `salaryMax` |
| `description` | `description` |
| `final_url` | `applyUrl` |
| `posted_at` | `postedAt` |

The payload may be a single job object, an array of job objects, or `{ "jobs": [...] }`.

## Design System

| Token | Value |
|-------|-------|
| Background | `#F5F2EE` |
| Surface | `#FFFFFF` |
| Accent | `#3ECF8E` |
| Border | `#000000` (1.5px) |
| Text Primary | `#0D0F12` |
| Text Muted | `#6B6560` |
| Font Headings | IBM Plex Mono |
| Font Body | Inter |

## Project Structure

```
/app             → Next.js App Router pages and layouts
/components      → Shared React components
  /ui            → Design system primitives (Button, Input, Badge, Modal)
/lib             → Utilities and shared logic
  utils.ts       → cn() helper
```

## Scripts

```bash
npm run dev      # Start development server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Production Deployment

### 1. Set environment variables in Vercel
Add all values from `.env.production.example` to your Vercel project under **Settings → Environment Variables**. Scope them to **Production** only.

### 2. Run database migrations
```bash
npx prisma migrate deploy
```
Run this after each deploy that includes schema changes. Vercel does not run this automatically.

### 3. Update GitHub OAuth app
In [github.com/settings/developers](https://github.com/settings/developers), update the callback URL to:
