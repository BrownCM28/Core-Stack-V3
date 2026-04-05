import type { Metadata } from "next";
import { Suspense } from "react";
import { TalentPageContent } from "@/components/talent/TalentPageContent";

export const metadata: Metadata = {
  title: "Browse Talent | CoreStack",
  description:
    "Engineers and infrastructure specialists actively looking for their next role.",
};

export default function TalentPage() {
  return (
    <Suspense>
      <TalentPageContent />
    </Suspense>
  );
}
