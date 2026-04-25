import type { Metadata } from "next";
import Link from "next/link";
import { getStripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { CheckCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Listing Live | CoreStack",
};

interface Props {
  searchParams: Promise<{ session_id?: string }>;
}

export default async function EmployersSuccessPage({ searchParams }: Props) {
  const { session_id } = await searchParams;

  if (!session_id) {
    return <ErrorState message="No session ID provided." />;
  }

  let jobId: string | undefined;
  let jobTitle: string | undefined;

  try {
    const session = await getStripe().checkout.sessions.retrieve(session_id);

    if (session.payment_status !== "paid") {
      return <ErrorState message="Payment not completed." />;
    }

    jobId = session.metadata?.jobId;
    if (jobId) {
      const job = await prisma.job.findUnique({
        where: { id: jobId },
        select: { title: true, company: true },
      });
      jobTitle = job ? `${job.title} at ${job.company}` : undefined;
    }
  } catch {
    return <ErrorState message="Could not verify your session. Please contact support." />;
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="flex justify-center mb-6">
          <CheckCircle size={56} className="text-accent" strokeWidth={1.5} />
        </div>
        <h1 className="font-mono font-bold text-2xl text-text-primary mb-3">
          Your listing is live!
        </h1>
        {jobTitle && (
          <p className="font-sans text-sm text-text-muted mb-2">{jobTitle}</p>
        )}
        <p className="font-sans text-sm text-text-muted mb-8">
          Your listing is now visible to engineers on CoreStack. You&apos;ll receive an email
          confirmation shortly.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          {jobId && (
            <Link
              href={`/jobs/${jobId}`}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-accent border-[1.5px] border-black text-[#0D0F12] font-mono font-semibold text-sm rounded-[6px] hover:bg-[#34C47E] hover:shadow-[0_0_16px_rgba(62,207,142,0.25)] transition-all"
            >
              View your listing
            </Link>
          )}
          <Link
            href="/jobs"
            className="inline-flex items-center gap-2 px-6 py-2.5 border-[1.5px] border-[#E0E0E0] text-text-primary font-mono font-medium text-sm rounded-[6px] hover:border-accent hover:text-accent transition-all"
          >
            Browse all jobs
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <h1 className="font-mono font-bold text-xl text-text-primary mb-3">
          Something went wrong
        </h1>
        <p className="font-sans text-sm text-text-muted mb-6">{message}</p>
        <Link
          href="/employers/post"
          className="font-mono text-sm text-accent hover:underline"
        >
          ← Back to post a job
        </Link>
      </div>
    </div>
  );
}
