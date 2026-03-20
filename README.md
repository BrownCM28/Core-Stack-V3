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
