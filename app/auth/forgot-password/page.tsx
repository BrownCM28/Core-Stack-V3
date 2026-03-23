import type { Metadata } from "next";
import { Zap } from "lucide-react";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Reset password | CoreStack",
};

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-[420px]">
        <div className="flex items-center justify-center gap-2 mb-8">
          <Zap size={20} className="text-accent" />
          <span className="font-mono font-bold text-xl text-text-primary tracking-tight">
            CoreStack
          </span>
        </div>
        <ForgotPasswordForm />
      </div>
    </div>
  );
}
