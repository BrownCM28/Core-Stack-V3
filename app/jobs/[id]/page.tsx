import type { Metadata } from "next";
import { JobDetailContent } from "@/components/jobs/JobDetailContent";
import { JOBS } from "@/lib/mock-data";

export const metadata: Metadata = {
  title: "Data Center Facilities Engineer at Equinix",
  description:
    "Data Center Facilities Engineer role at Equinix in Dallas, TX. Full-time, $95k–$120k.",
};

export default function JobDetailPage() {
  // Phase 2: always render the Equinix job as hardcoded detail
  const job = JOBS[0];

  // Similar jobs: same category, excluding this job
  const similarJobs = JOBS.filter(
    (j) => j.category === job.category && j.id !== job.id
  ).slice(0, 3);

  return <JobDetailContent job={job} similarJobs={similarJobs} />;
}
