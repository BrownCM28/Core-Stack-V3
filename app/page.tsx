import { Metadata } from "next";
import HomePageClient from "./HomePageClient";

export const metadata: Metadata = {
  title: "CoreStack — Data Center & AI Infrastructure Jobs",
  description:
    "Browse data center construction, operations, and AI infrastructure jobs. Updated daily from top employers.",
  openGraph: {
    title: "CoreStack — Data Center & AI Infrastructure Jobs",
    description: "The niche job board for infrastructure engineers.",
    type: "website",
    url: "https://corestack.io",
  },
};

export const dynamic = "force-dynamic";

export default function HomePage() {
  return <HomePageClient />;
}
