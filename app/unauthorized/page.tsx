import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "403 Forbidden | CoreStack",
  description: "You do not have permission to access this page.",
};

export default function UnauthorizedPage() {
  return (
    <main className="min-h-screen bg-[#F5F2EE] flex items-center justify-center px-4">
      <div className="text-center max-w-md w-full">

        {/* Status badge */}
        <div className="inline-flex items-center gap-1.5 bg-white border border-[#e5e1dc] rounded-full px-3.5 py-1 text-xs font-semibold text-[#6B6560] uppercase tracking-widest mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block" />
          403 Forbidden
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-bold text-[#0D0F12] mb-3 leading-tight">
          Access Restricted
        </h1>

        {/* Description */}
        <p className="text-[#6B6560] text-sm leading-relaxed mb-8">
          You do not have the required permissions to view this page.
          If you think this is a mistake, contact your administrator.
        </p>

        {/* Divider */}
        <div className="border-t border-[#e5e1dc] mb-8" />

        {/* Action buttons */}
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 bg-[#0D0F12] text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-black transition-colors"
          >
            ← Back to home
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center bg-white border border-[#e5e1dc] text-[#0D0F12] px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#F5F2EE] transition-colors"
          >
            Go to dashboard
          </Link>
        </div>

        {/* Support link */}
        <p className="mt-8 text-xs text-[#6B6560]">
          Need access?{" "}
          <a
            href="mailto:support@corestack.io"
            className="text-[#3ECF8E] font-semibold hover:underline"
          >
            Contact support
          </a>
        </p>

      </div>
    </main>
  );
}
