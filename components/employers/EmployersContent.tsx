"use client";

import { useState } from "react";
import { ChevronDown, ArrowRight, Zap } from "lucide-react";
import { EmployerPricingCard } from "@/components/EmployerPricingCard";
import { cn } from "@/lib/utils";

// ─── FAQ data ────────────────────────────────────────────────────────────────

const FAQS = [
  {
    id: "duration",
    q: "How long does my listing stay live?",
    a: "All listings — Standard and Featured — are active for 30 days from the date your payment is processed. You'll receive an email reminder 5 days before expiry with the option to renew.",
  },
  {
    id: "edit",
    q: "Can I edit my listing after posting?",
    a: "Yes. You can edit the title, description, salary range, and job type at any time during the 30-day window. Changes go live immediately. Editing does not reset your listing's expiry date.",
  },
  {
    id: "apply",
    q: "How do candidates apply?",
    a: "Candidates click 'Apply Now' on your listing and are prompted to create or log in to a CoreStack account. All applications are tracked in your employer dashboard with candidate profile links.",
  },
  {
    id: "refunds",
    q: "Do you offer refunds?",
    a: "We offer a full refund within 24 hours of posting if your listing has received zero applications. After 24 hours or once applications are received, listings are non-refundable.",
  },
];

// ─── Step ────────────────────────────────────────────────────────────────────

function HowItWorksStep({
  step,
  title,
  description,
}: {
  step: number;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="w-10 h-10 rounded-full bg-accent border-[2px] border-black flex items-center justify-center font-mono font-bold text-base text-[#0D0F12] mb-4 flex-shrink-0">
        {step}
      </div>
      <h3 className="font-mono font-semibold text-sm text-text-primary mb-2">{title}</h3>
      <p className="font-sans text-sm text-text-muted leading-relaxed">{description}</p>
    </div>
  );
}

// ─── FAQ item ─────────────────────────────────────────────────────────────────

function FaqItem({
  faq,
  open,
  onToggle,
}: {
  faq: (typeof FAQS)[number];
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-[#E2DDD8] last:border-0">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 py-4 text-left"
      >
        <span className="font-mono font-medium text-sm text-text-primary">{faq.q}</span>
        <ChevronDown
          size={16}
          className={cn(
            "text-text-muted flex-shrink-0 transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </button>
      {open && (
        <p className="font-sans text-sm text-text-muted leading-relaxed pb-4">
          {faq.a}
        </p>
      )}
    </div>
  );
}

// ─── Main ────────────────────────────────────────────────────────────────────

const STANDARD_FEATURES = [
  "30-day listing duration",
  "Listed in main job feed",
  "Candidate applications tracked",
  "Email notifications on apply",
  "Standard search placement",
  "Email support",
];

const FEATURED_FEATURES = [
  "Everything in Standard",
  "Pinned above standard listings",
  "Emerald featured badge on listing",
  "Priority in candidate alert emails",
  "Company logo displayed prominently",
  "Dedicated account support",
];

const TRUSTED_COMPANIES = [
  "Equinix", "Digital Realty", "CoreWeave", "NVIDIA", "AWS", "CyrusOne",
];

export function EmployersContent() {
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background">

      {/* ── Hero ── */}
      <section className="bg-[#0D0F12] border-b border-black">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div className="inline-flex items-center gap-2 mb-5">
            <Zap size={14} className="text-accent" />
            <span className="font-mono text-xs text-accent tracking-[0.12em] uppercase">
              For Employers
            </span>
          </div>
          <h1 className="font-mono font-bold text-4xl sm:text-5xl text-white leading-tight mb-5">
            Hire the engineers building
            <br />
            <span className="text-accent">tomorrow&apos;s infrastructure.</span>
          </h1>
          <p className="font-sans text-base text-[#9CA3AF] max-w-xl mx-auto mb-8 leading-relaxed">
            Reach 3,000+ data center and AI infrastructure engineers actively
            looking for their next role on CoreStack.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button className="inline-flex items-center gap-2 px-6 py-3 bg-accent border-[1.5px] border-black text-[#0D0F12] font-mono font-semibold text-sm rounded-[6px] hover:bg-[#34C47E] hover:shadow-[0_0_20px_rgba(62,207,142,0.3)] transition-all duration-150">
              Post a Job
              <ArrowRight size={14} />
            </button>
            <button className="inline-flex items-center gap-2 px-6 py-3 border-[1.5px] border-white/20 text-white font-mono font-medium text-sm rounded-[6px] hover:border-accent/60 hover:text-accent transition-all duration-150">
              Browse Talent
            </button>
          </div>
        </div>
      </section>

      {/* ── Stats bar ── */}
      <section className="bg-surface border-b border-[#E2DDD8]">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-5">
          <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-[#E2DDD8]">
            {[
              { value: "3,241", label: "engineers" },
              { value: "148", label: "open to work" },
              { value: "47", label: "companies hiring" },
              { value: "12 days", label: "avg. time to hire" },
            ].map(({ value, label }) => (
              <div key={label} className="px-6 first:pl-0 last:pr-0 py-2 text-center sm:text-left">
                <p className="font-mono font-bold text-2xl text-text-primary leading-tight">
                  {value}
                </p>
                <p className="font-sans text-xs text-text-muted">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-10">
          <p className="font-mono text-[10px] text-text-muted tracking-[0.12em] uppercase mb-2">
            Pricing
          </p>
          <h2 className="font-mono font-bold text-2xl text-text-primary">
            Simple, transparent pricing
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
          <EmployerPricingCard
            tier="Standard"
            price={99}
            features={STANDARD_FEATURES}
            ctaLabel="Post Standard Listing"
            featured={false}
          />
          <EmployerPricingCard
            tier="Featured"
            price={249}
            features={FEATURED_FEATURES}
            ctaLabel="Post Featured Listing"
            featured={true}
          />
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="bg-surface border-y border-[#E2DDD8]">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-10">
            <p className="font-mono text-[10px] text-text-muted tracking-[0.12em] uppercase mb-2">
              How It Works
            </p>
            <h2 className="font-mono font-bold text-2xl text-text-primary">
              Go live in minutes
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
            <HowItWorksStep
              step={1}
              title="Create your listing"
              description="Fill out the job details — title, description, salary range, and requirements."
            />
            {/* Arrow connector */}
            <HowItWorksStep
              step={2}
              title="Complete payment"
              description="Secure one-time checkout via Stripe. Standard $99 or Featured $249."
            />
            <HowItWorksStep
              step={3}
              title="Get discovered"
              description="Your listing goes live on CoreStack immediately after payment is confirmed."
            />
          </div>
        </div>
      </section>

      {/* ── Trusted by ── */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
        <p className="font-sans text-sm text-text-muted text-center mb-7">
          Trusted by teams at:
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
          {TRUSTED_COMPANIES.map((company) => (
            <span
              key={company}
              className="font-mono text-sm font-semibold text-[#C4BFB9] hover:text-text-muted transition-colors duration-150"
            >
              {company}
            </span>
          ))}
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="bg-surface border-t border-[#E2DDD8]">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-14">
          <div className="text-center mb-8">
            <p className="font-mono text-[10px] text-text-muted tracking-[0.12em] uppercase mb-2">
              FAQ
            </p>
            <h2 className="font-mono font-bold text-2xl text-text-primary">
              Common questions
            </h2>
          </div>
          <div className="bg-surface border-[1.5px] border-[#E2DDD8] rounded-[8px] px-6 divide-y divide-[#E2DDD8]">
            {FAQS.map((faq) => (
              <FaqItem
                key={faq.id}
                faq={faq}
                open={openFaq === faq.id}
                onToggle={() => setOpenFaq(openFaq === faq.id ? null : faq.id)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="bg-[#0D0F12] border-t border-black">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-14 text-center">
          <h2 className="font-mono font-bold text-2xl text-white mb-3">
            Ready to find your next hire?
          </h2>
          <p className="font-sans text-sm text-[#9CA3AF] mb-7">
            Post a listing and reach thousands of qualified infrastructure engineers.
          </p>
          <button className="inline-flex items-center gap-2 px-6 py-3 bg-accent border-[1.5px] border-black text-[#0D0F12] font-mono font-semibold text-sm rounded-[6px] hover:bg-[#34C47E] hover:shadow-[0_0_20px_rgba(62,207,142,0.3)] transition-all duration-150">
            Post a Job — from $99
            <ArrowRight size={14} />
          </button>
        </div>
      </section>
    </div>
  );
}
