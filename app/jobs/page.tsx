import type { Metadata } from "next";
import { JobsPageContent } from "@/components/jobs/JobsPageContent";
import { JOBS } from "@/lib/mock-data";

export const metadata: Metadata = {
  title: "Browse Jobs",
  description:
    "Browse data center construction, operations, and AI infrastructure jobs.",
};

export default function JobsPage() {
  return <JobsPageContent jobs={JOBS} />;
}
