import { Suspense } from "react";
import type { Metadata } from "next";
import { JobsPageContent } from "@/components/jobs/JobsPageContent";
import { SkeletonJobListingCard } from "@/components/ui/SkeletonCard";

export const metadata: Metadata = {
  title: "Browse Jobs",
  description:
    "Browse data center construction, operations, and AI infrastructure jobs.",
};

function JobsLoading() {
  return (
    <div className="flex-1 min-w-0 px-5 lg:px-8 py-8">
      <div className="flex flex-col gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <SkeletonJobListingCard key={i} />
        ))}
      </div>
    </div>
  );
}

export default function JobsPage() {
  return (
    <Suspense fallback={<JobsLoading />}>
      <JobsPageContent />
    </Suspense>
  );
}
