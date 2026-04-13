import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";
import { resend } from "@/lib/resend";

export async function POST(req: Request): Promise<NextResponse> {
  const sig = req.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    return NextResponse.json({ error: "Missing signature or secret" }, { status: 400 });
  }

  const stripe = getStripe();
  let event: ReturnType<typeof stripe.webhooks.constructEvent>;
  try {
    const rawBody = await req.text();
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[stripe-webhook] signature verification failed:", msg);
    return NextResponse.json({ error: `Webhook Error: ${msg}` }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const { jobId, userId, tier } = (session.metadata ?? {}) as {
      jobId?: string;
      userId?: string;
      tier?: string;
    };

    if (!jobId || !userId) {
      console.error("[stripe-webhook] missing metadata on session", session.id);
      return NextResponse.json({ received: true });
    }

    try {
      const now = new Date();
      const expiresAt = new Date(now);
      expiresAt.setDate(expiresAt.getDate() + 30);

      const job = await prisma.job.update({
        where: { id: jobId },
        data: {
          isActive: true,
          paymentStatus: "paid",
          featured: tier === "featured",
          postedAt: now,
          expiresAt,
        },
      });

      console.log(`[stripe-webhook] job ${jobId} activated (tier=${tier})`);

      // Confirmation email — fire and forget
      if (resend) {
        const user = await prisma.user.findUnique({
          where: { id: userId },
          select: { email: true, name: true },
        });

        if (user?.email) {
          const baseUrl = process.env.BETTER_AUTH_URL ?? "http://localhost:3000";
          resend.emails
            .send({
              from: process.env.RESEND_FROM_EMAIL ?? "noreply@corestack.io",
              to: user.email,
              subject: `Your CoreStack listing is live: ${job.title}`,
              html: `
                <p>Hi ${user.name ?? "there"},</p>
                <p>Your listing <strong>${job.title}</strong> at <strong>${job.company}</strong> is now live on CoreStack.</p>
                <p>
                  <a href="${baseUrl}/jobs/${job.id}" style="display:inline-block;padding:10px 20px;background:#3ECF8E;color:#0D0F12;font-weight:600;text-decoration:none;border-radius:6px;border:1.5px solid #000;">
                    View Listing
                  </a>
                </p>
                <p>Your listing will be active for 30 days until ${expiresAt.toDateString()}.</p>
                <p>— The CoreStack Team</p>
              `,
            })
            .catch((err: unknown) =>
              console.error("[stripe-webhook] confirmation email failed:", err)
            );
        }
      }
    } catch (err) {
      console.error("[stripe-webhook] failed to activate job", jobId, err);
      return NextResponse.json({ error: "Failed to activate job" }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
