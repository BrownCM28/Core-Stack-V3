import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Certification } from "@/lib/mock-profile";

const ISSUER_STYLES: Record<string, { bg: string; text: string }> = {
  AWS: { bg: "bg-[#FF9900]/15", text: "text-[#B36800]" },
  "Linux Foundation": { bg: "bg-[#003366]/10", text: "text-[#003366]" },
  BICSI: { bg: "bg-[#1a3a5c]/10", text: "text-[#1a3a5c]" },
  Google: { bg: "bg-[#4285F4]/10", text: "text-[#1a56c4]" },
  Cisco: { bg: "bg-[#1BA0D7]/10", text: "text-[#1281aa]" },
  Microsoft: { bg: "bg-[#0078D4]/10", text: "text-[#0063b1]" },
  HashiCorp: { bg: "bg-[#7B42BC]/10", text: "text-[#6235a0]" },
  "Red Hat": { bg: "bg-[#EE0000]/10", text: "text-[#b30000]" },
};

function getIssuerStyle(issuer: string) {
  return ISSUER_STYLES[issuer] ?? { bg: "bg-[#E2DDD8]", text: "text-text-muted" };
}

interface CertificationBadgeProps {
  cert: Certification;
}

export function CertificationBadge({ cert }: CertificationBadgeProps) {
  const { bg, text } = getIssuerStyle(cert.issuer);
  const isExpiring = !!cert.expiryDate;

  return (
    <div className="bg-surface border-[1.5px] border-[#E2DDD8] rounded-[8px] p-4 hover:border-accent/40 transition-all duration-150">
      {/* Issuer pill */}
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

      <p className="font-sans text-xs text-text-muted mb-1">
        Issued {cert.issuedDate}
      </p>

      {isExpiring && (
        <p className="font-mono text-[11px] text-amber-600 font-medium">
          Expires {cert.expiryDate}
        </p>
      )}

      {cert.credentialUrl && (
        <a
          href={cert.credentialUrl}
          className="inline-flex items-center gap-1 mt-2 font-mono text-[11px] text-text-muted hover:text-accent transition-colors duration-150"
        >
          View credential <ExternalLink size={10} />
        </a>
      )}
    </div>
  );
}
