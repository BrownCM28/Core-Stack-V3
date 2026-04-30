import type { Metadata } from "next";
import { EmployersContent } from "@/components/employers/EmployersContent";

export const metadata: Metadata = {
  title: "Post a Job",
  description:
    "Reach thousands of data center and AI infrastructure engineers. Post a listing from $99 or get monthly talent reports delivered automatically.",
  openGraph: {
    title: "Post a Job — CoreStack",
    description:
      "Reach 3,000+ infrastructure engineers. Post a listing or subscribe to monthly CoreStack Score reports.",
    type: "website",
    url: "https://corestack.io/employers",
  },
};

export default function EmployersPage() {
  return <EmployersContent />;
}
