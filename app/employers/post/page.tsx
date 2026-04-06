import type { Metadata } from "next";
import { PostJobForm } from "@/components/employers/PostJobForm";

export const metadata: Metadata = {
  title: "Post a Job | CoreStack",
  description: "Fill out your job listing and proceed to payment.",
};

export default function PostJobPage() {
  return <PostJobForm />;
}
