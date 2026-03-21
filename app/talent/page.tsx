import type { Metadata } from "next";
import { TalentPageContent } from "@/components/talent/TalentPageContent";
import { TALENT } from "@/lib/mock-profile";

export const metadata: Metadata = {
  title: "Browse Talent | CoreStack",
  description:
    "Engineers and infrastructure specialists actively looking for their next role.",
};

export default function TalentPage() {
  return <TalentPageContent talent={TALENT} />;
}
