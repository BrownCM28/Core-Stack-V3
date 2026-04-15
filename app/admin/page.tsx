import type { Metadata } from "next";
import { requireRole } from "@/lib/session";
import { AdminContent } from "@/components/admin/AdminContent";

export const metadata: Metadata = {
  title: "Admin | CoreStack",
};

export default async function AdminPage() {
  await requireRole("ADMIN");
  return <AdminContent />;
}
