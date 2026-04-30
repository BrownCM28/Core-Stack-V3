import { Suspense } from "react";
import type { Metadata } from "next";
import { JobsPageContent } from "@/components/jobs/JobsPageContent";
import { SkeletonJobListingCard } from "@/components/ui/SkeletonCard";

export const metadata: Metadata = {
  title: "Browse Jobs",
  description:
    "Search and filter data center and AI infrastructure roles by category, location, salary, and job type. Updated daily from top employers.",
  openGraph: {
    title: "Browse Infrastructure Jobs — CoreStack",
    description:
      "Data center ops, AI infrastructure, electrical, cooling, networking and more. Filter by location, salary, and job type.",
    type: "website",
    url: "https://corestack.io/jobs",
  },
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
