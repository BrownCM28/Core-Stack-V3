import type { Metadata } from "next";
import { Suspense } from "react";
import { TalentPageContent } from "@/components/talent/TalentPageContent";

export const metadata: Metadata = {
  title: "Browse Engineering Talent",
  description:
    "Discover data center and AI infrastructure engineers open to new opportunities. Filter by stack, certifications, and location.",
  openGraph: {
    title: "Browse Engineering Talent — CoreStack",
    description:
      "Find infrastructure engineers open to work. Filter by stack, certifications, and location.",
    type: "website",
    url: "https://corestack.io/talent",
  },
};

export default function TalentPage() {
  return (
    <Suspense>
      <TalentPageContent />
    </Suspense>
  );
}
