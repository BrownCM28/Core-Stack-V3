import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { PostJobForm } from "@/components/employers/PostJobForm";
import { getSession } from "@/lib/session";

export const metadata: Metadata = {
  title: "Post a Job | CoreStack",
  description: "Fill out your job listing and proceed to payment.",
};

export default async function PostJobPage() {
  const session = await getSession();
  if (!session) {
    redirect("/auth/login?redirect=/employers/post");
  }

  return <PostJobForm />;
}
