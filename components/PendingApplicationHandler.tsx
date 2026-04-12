"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import { Zap, Loader2, ArrowRight } from "lucide-react";

export function PendingApplicationHandler() {
    const { data: session } = useSession();
    const [pendingJobId, setPendingJobId] = useState<string | null>(null);
    const [pendingUrl, setPendingUrl] = useState<string | null>(null);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        if (session?.user) {
            const pJobId = sessionStorage.getItem("pendingJobId");
            const pUrl = sessionStorage.getItem("pendingApplyUrl");
            if (pUrl) {
                setPendingJobId(pJobId);
                setPendingUrl(pUrl);
            }
        }
    }, [session?.user]);

    if (!pendingUrl) return null;

    async function handleContinue() {
        if (!pendingUrl) return;

        setProcessing(true);
        if (pendingJobId) {
            try {
                await fetch("/api/applications", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ jobId: pendingJobId }),
                });
            } catch (err) {
                console.error("Failed to log application", err);
            }
        }

        sessionStorage.removeItem("pendingJobId");
        sessionStorage.removeItem("pendingApplyUrl");

        window.open(pendingUrl, "_blank", "noopener,noreferrer");
        setPendingUrl(null);
        setPendingJobId(null);
        setProcessing(false);
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-surface border-[1.5px] border-black rounded-[8px] p-8 max-w-sm w-full shadow-[0_8px_40px_rgba(0,0,0,0.35)] flex flex-col items-center text-center animate-modal-in">
                <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mb-4">
                    <Zap size={24} className="text-accent" />
                </div>
                <h2 className="font-mono font-semibold text-xl text-text-primary mb-2">
                    Almost there!
                </h2>
                <p className="font-sans text-sm text-text-muted mb-8">
                    You are now signed in. Click below to continue to the application page.
                </p>
                <button
                    onClick={handleContinue}
                    disabled={processing}
                    className="flex w-full items-center justify-center gap-2 px-4 py-3 bg-accent border-[1.5px] border-black text-[#0D0F12] font-mono font-semibold text-sm rounded-[6px] hover:bg-[#34C47E] hover:shadow-[0_0_16px_rgba(62,207,142,0.25)] transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    {processing ? <Loader2 size={16} className="animate-spin" /> : <ArrowRight size={16} />}
                    {processing ? "Opening…" : "Continue to Application"}
                </button>
            </div>
        </div>
    );
}
