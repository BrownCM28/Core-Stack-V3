import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

// DB Certification type (matches Prisma model)
export interface DbCertification {
  id: string;
  name: string;
  issuer: string;
  issuedAt: string;   // "Mar 2022"
  expiresAt?: string | null;
  credentialId?: string | null;
  credentialUrl?: string | null;
}

const ISSUER_STYLES: Record<string, { bg: string; text: string }> = {
  "Amazon Web Services": { bg: "bg-[#FF9900]/15", text: "text-[#B36800]" },
  AWS: { bg: "bg-[#FF9900]/15", text: "text-[#B36800]" },
  "Linux Foundation": { bg: "bg-[#003366]/10", text: "text-[#003366]" },
  BICSI: { bg: "bg-[#1a3a5c]/10", text: "text-[#1a3a5c]" },
  "Google Cloud": { bg: "bg-[#4285F4]/10", text: "text-[#1a56c4]" },
  Google: { bg: "bg-[#4285F4]/10", text: "text-[#1a56c4]" },
  Cisco: { bg: "bg-[#1BA0D7]/10", text: "text-[#1281aa]" },
  Microsoft: { bg: "bg-[#0078D4]/10", text: "text-[#0063b1]" },
  HashiCorp: { bg: "bg-[#7B42BC]/10", text: "text-[#6235a0]" },
  "Red Hat": { bg: "bg-[#EE0000]/10", text: "text-[#b30000]" },
  "Uptime Institute": { bg: "bg-[#1a3a5c]/10", text: "text-[#1a3a5c]" },
};

function getIssuerStyle(issuer: string) {
  return ISSUER_STYLES[issuer] ?? { bg: "bg-[#E2DDD8]", text: "text-text-muted" };
}

function parseMonthYear(s: string): Date | null {
  const MONTHS: Record<string, number> = {
    Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
    Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
  };
  const parts = s.trim().split(" ");
  if (parts.length !== 2) return null;
  const month = MONTHS[parts[0]];
  const year = parseInt(parts[1], 10);
  if (month === undefined || isNaN(year)) return null;
  return new Date(year, month + 1, 0, 23, 59, 59);
}

type ExpiryState = "expired" | "expiring-soon" | "valid" | "none";

function getExpiryState(expiresAt: string | null | undefined): ExpiryState {
  if (!expiresAt) return "none";
  const expiry = parseMonthYear(expiresAt);
  if (!expiry) return "none";
  const now = new Date();
  if (expiry < now) return "expired";
  const daysUntilExpiry = (expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
  if (daysUntilExpiry <= 90) return "expiring-soon";
  return "valid";
}

export function CertificationBadge({ cert }: { cert: DbCertification }) {
  const { bg, text } = getIssuerStyle(cert.issuer);
  const expiryState = getExpiryState(cert.expiresAt);

  return (
    <div className="bg-surface border-[1.5px] border-[#E2DDD8] rounded-[8px] p-4 hover:border-accent/40 hover:-translate-y-0.5 transition-all duration-150">
      <div className="mb-3">
        <span
          className={cn(
            "inline-block font-mono text-[10px] font-semibold px-2 py-0.5 rounded-[4px]",
            bg,
            text
          )}
        >
          {cert.issuer}
        </span>
      </div>

      <p className="font-mono text-sm font-semibold text-text-primary leading-snug mb-2">
        {cert.name}
      </p>

      <p className="font-sans text-xs text-text-muted mb-1.5">
        Issued {cert.issuedAt}
      </p>

      {expiryState === "expired" && (
        <p className="inline-flex items-center gap-1 font-mono text-[11px] font-semibold text-red-600 bg-red-50 rounded-[3px] px-1.5 py-0.5">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
          Expired {cert.expiresAt}
        </p>
      )}

      {expiryState === "expiring-soon" && (
        <p className="inline-flex items-center gap-1 font-mono text-[11px] font-semibold text-amber-600 bg-amber-50 rounded-[3px] px-1.5 py-0.5">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" />
          Expires {cert.expiresAt}
        </p>
      )}

      {expiryState === "valid" && cert.expiresAt && (
        <p className="font-sans text-xs text-text-muted">
          Expires {cert.expiresAt}
        </p>
      )}

      {cert.credentialUrl && (
        <a
          href={cert.credentialUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 mt-2.5 font-mono text-[11px] text-text-muted hover:text-accent transition-colors duration-150"
        >
          View credential <ExternalLink size={10} />
        </a>
      )}
    </div>
  );
}
