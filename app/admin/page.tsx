import type { Metadata } from "next";
import { AdminContent } from "@/components/admin/AdminContent";

export const metadata: Metadata = {
  title: "Admin | CoreStack",
};

export default function AdminPage() {
  return <AdminContent />;
}
