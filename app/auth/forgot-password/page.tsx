import type { Metadata } from "next";
import Link from "next/link";
import { Zap } from "lucide-react";

export const metadata: Metadata = {
  title: "Reset password | CoreStack",
};

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-[420px]">

        {/* Wordmark */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <Zap size={20} className="text-accent" />
          <span className="font-mono font-bold text-xl text-text-primary tracking-tight">
            CoreStack
          </span>
        </div>

        {/* Card */}
        <div className="bg-surface border-[1.5px] border-[#E2DDD8] rounded-[8px] p-8">
          <h1 className="font-mono font-bold text-xl text-text-primary text-center mb-1">
            Reset your password
          </h1>
          <p className="font-sans text-sm text-text-muted text-center mb-7 leading-relaxed">
            Enter your email address and we&apos;ll send you a link to reset your password.
          </p>

          <div className="flex flex-col gap-3 mb-5">
            <input
              type="email"
              placeholder="Email address"
              className="w-full font-sans text-sm bg-background border-[1.5px] border-[#E2DDD8] rounded-[6px] px-3 py-2.5 text-text-primary placeholder:text-text-muted/60 focus:border-accent focus:outline-none transition-colors duration-150"
            />
          </div>

          <button className="w-full px-5 py-2.5 bg-accent border-[1.5px] border-black text-[#0D0F12] font-mono font-semibold text-sm rounded-[6px] hover:bg-[#34C47E] hover:shadow-[0_0_16px_rgba(62,207,142,0.25)] transition-all duration-150 mb-7">
            Send reset link
          </button>

          <p className="font-sans text-sm text-text-muted text-center">
            <Link
              href="/auth/login"
              className="text-accent hover:underline font-medium"
            >
              ← Back to login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
