// STRIPE TEST MODE: Using test keys. Switch STRIPE_SECRET_KEY and
// NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY to live keys for production.
// Test card: 4242 4242 4242 4242, any future date, any CVC.

import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";
import { getSession } from "@/lib/session";
import { IncomingJobSchema, mapIncomingJob } from "@/lib/ingest";
import { checkRateLimit, strictLimit } from "@/lib/ratelimit";

const TIERS = {
  standard: { amount: 9900, label: "CoreStack Standard Listing – 30 days" },
  featured: { amount: 24900, label: "CoreStack Featured Listing – 30 days" },
} as const;

const BodySchema = z.object({
  jobData: IncomingJobSchema,
  tier: z.enum(["standard", "featured"]),
});

export async function POST(req: Request): Promise<NextResponse> {
  try {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const rl = await checkRateLimit(strictLimit, session.user.id);
  if (rl) return rl;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = BodySchema.safeParse(body);
  if (!parsed.success) {
    const msg = parsed.error.issues.map((e) => `${e.path.join(".")}: ${e.message}`).join("; ");
    return NextResponse.json({ error: `Validation failed — ${msg}` }, { status: 422 });
  }

  const { jobData, tier } = parsed.data;

  // Save job as inactive pending payment
  const jobInput = mapIncomingJob({ ...jobData, source: "direct" });
  const job = await prisma.job.create({
    data: {
      ...jobInput,
      isActive: false,
      paymentStatus: "pending",
      employerId: session.user.id,
    },
  });

  const { amount, label } = TIERS[tier];
  const baseUrl = process.env.BETTER_AUTH_URL ?? "http://localhost:3000";
  const stripe = getStripe();

  // STRIPE MODE: Currently using TEST keys.
  // To go live: replace STRIPE_SECRET_KEY with sk_live_...
  // and NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY with pk_live_...
  // in Vercel environment variables.
  // Also update the Stripe webhook endpoint in the Stripe
  // dashboard to point to https://corestack.io/api/webhooks/stripe
  // and generate a new STRIPE_WEBHOOK_SECRET.
  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: amount,
          product_data: { name: label },
        },
      },
    ],
    success_url: `${baseUrl}/employers/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/employers/post`,
    metadata: {
      jobId: job.id,
      userId: session.user.id,
      tier,
    },
  });

  return NextResponse.json({ checkoutUrl: checkoutSession.url });
  } catch (error) {
    console.error("[api/checkout]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
