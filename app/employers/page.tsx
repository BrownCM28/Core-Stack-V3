import type { Metadata } from "next";
import { EmployersContent } from "@/components/employers/EmployersContent";

export const metadata: Metadata = {
  title: "Post a Job | CoreStack for Employers",
  description:
    "Reach 3,000+ data center and AI infrastructure engineers. Post a job from $99.",
};

export default function EmployersPage() {
  return <EmployersContent />;
}
