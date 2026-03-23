import type { Metadata } from "next";
import { requireSession } from "@/lib/session";
import { DashboardContent } from "@/components/dashboard/DashboardContent";

export const metadata: Metadata = {
  title: "Dashboard | CoreStack",
};

export default async function DashboardPage() {
  await requireSession();
  return <DashboardContent />;
}
