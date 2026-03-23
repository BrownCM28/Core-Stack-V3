"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2, CheckCircle } from "lucide-react";
import { authClient } from "@/lib/auth-client";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    // forgetPassword requires email sending to be configured (Resend — Phase 10)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: err } = await (authClient as any).forgetPassword({
      email,
      redirectTo: "/auth/reset-password",
    });
    setLoading(false);
    if (err) {
      setError(err.message ?? "Something went wrong. Please try again.");
      return;
    }
    setSent(true);
  }

  return (
    <div className="bg-surface border-[1.5px] border-[#E2DDD8] rounded-[8px] p-8">
      {sent ? (
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle size={40} className="text-accent" />
          </div>
          <h1 className="font-mono font-bold text-xl text-text-primary mb-2">
            Check your inbox
          </h1>
          <p className="font-sans text-sm text-text-muted leading-relaxed mb-6">
            We sent a reset link to <span className="text-text-primary font-medium">{email}</span>.
            It expires in 1 hour.
          </p>
          <Link
            href="/auth/login"
            className="font-sans text-sm text-accent hover:underline font-medium"
          >
            ← Back to login
          </Link>
        </div>
      ) : (
        <>
          <h1 className="font-mono font-bold text-xl text-text-primary text-center mb-1">
            Reset your password
          </h1>
          <p className="font-sans text-sm text-text-muted text-center mb-7 leading-relaxed">
            Enter your email and we&apos;ll send you a reset link.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full font-sans text-sm bg-background border-[1.5px] border-[#E2DDD8] rounded-[6px] px-3 py-2.5 text-text-primary placeholder:text-text-muted/60 focus:border-accent focus:outline-none transition-colors duration-150"
            />

            {error && (
              <p className="font-sans text-xs text-red-500">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full px-5 py-2.5 bg-accent border-[1.5px] border-black text-[#0D0F12] font-mono font-semibold text-sm rounded-[6px] hover:bg-[#34C47E] hover:shadow-[0_0_16px_rgba(62,207,142,0.25)] transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading && <Loader2 size={14} className="animate-spin" />}
              Send reset link
            </button>
          </form>

          <p className="font-sans text-sm text-text-muted text-center mt-6">
            <Link href="/auth/login" className="text-accent hover:underline font-medium">
              ← Back to login
            </Link>
          </p>
        </>
      )}
    </div>
  );
}
