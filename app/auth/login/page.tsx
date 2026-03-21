import type { Metadata } from "next";
import Link from "next/link";
import { Zap } from "lucide-react";

export const metadata: Metadata = {
  title: "Sign in | CoreStack",
};

function GithubIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <span className="w-5 h-5 bg-white rounded-full flex items-center justify-center ring-1 ring-[#DADCE0] flex-shrink-0">
      <svg width="12" height="12" viewBox="0 0 18 18" fill="none" aria-hidden="true">
        <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4" />
        <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853" />
        <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05" />
        <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335" />
      </svg>
    </span>
  );
}

export default function LoginPage() {
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
            Welcome back
          </h1>
          <p className="font-sans text-sm text-text-muted text-center mb-7">
            Sign in to your CoreStack account
          </p>

          {/* GitHub — hero CTA */}
          <button className="w-full flex items-center justify-center gap-3 px-5 py-3 bg-[#24292F] border-[1.5px] border-black text-white font-mono font-semibold text-sm rounded-[6px] hover:bg-[#2f363d] transition-all duration-150 mb-3 shadow-sm">
            <GithubIcon />
            Continue with GitHub
          </button>

          {/* Google */}
          <button className="w-full flex items-center justify-center gap-3 px-5 py-2.5 bg-surface border-[1.5px] border-[#E2DDD8] text-text-primary font-mono font-medium text-sm rounded-[6px] hover:border-accent hover:text-accent transition-all duration-150 mb-7">
            <GoogleIcon />
            Continue with Google
          </button>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#E2DDD8]" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-surface px-3 font-sans text-xs text-text-muted">
                or continue with email
              </span>
            </div>
          </div>

          {/* Email + Password */}
          <div className="flex flex-col gap-3 mb-2">
            <input
              type="email"
              placeholder="Email address"
              className="w-full font-sans text-sm bg-background border-[1.5px] border-[#E2DDD8] rounded-[6px] px-3 py-2.5 text-text-primary placeholder:text-text-muted/60 focus:border-accent focus:outline-none transition-colors duration-150"
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full font-sans text-sm bg-background border-[1.5px] border-[#E2DDD8] rounded-[6px] px-3 py-2.5 text-text-primary placeholder:text-text-muted/60 focus:border-accent focus:outline-none transition-colors duration-150"
            />
          </div>

          {/* Forgot password */}
          <div className="flex justify-end mb-5">
            <Link
              href="/auth/forgot-password"
              className="font-sans text-xs text-text-muted hover:text-accent transition-colors duration-150"
            >
              Forgot password?
            </Link>
          </div>

          {/* Sign in */}
          <button className="w-full px-5 py-2.5 bg-accent border-[1.5px] border-black text-[#0D0F12] font-mono font-semibold text-sm rounded-[6px] hover:bg-[#34C47E] hover:shadow-[0_0_16px_rgba(62,207,142,0.25)] transition-all duration-150 mb-7">
            Sign in
          </button>

          {/* Footer */}
          <p className="font-sans text-sm text-text-muted text-center">
            Don&apos;t have an account?{" "}
            <Link href="/auth/signup" className="text-accent hover:underline font-medium">
              Sign up →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
