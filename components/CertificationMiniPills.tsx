import { cn } from "@/lib/utils";

interface CertMini {
  abbr: string;
  issuer: string;
}

const ISSUER_DOT_COLORS: Record<string, string> = {
  AWS: "bg-[#FF9900]",
  "Linux Foundation": "bg-[#003366]",
  BICSI: "bg-[#1a3a5c]",
  Google: "bg-[#4285F4]",
  Cisco: "bg-[#1BA0D7]",
  Microsoft: "bg-[#0078D4]",
  HashiCorp: "bg-[#7B42BC]",
  "Red Hat": "bg-[#EE0000]",
};

interface CertificationMiniPillsProps {
  certs: CertMini[];
}

export function CertificationMiniPills({ certs }: CertificationMiniPillsProps) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {certs.map((cert) => {
        const dotColor = ISSUER_DOT_COLORS[cert.issuer] ?? "bg-text-muted";
        return (
          <span
            key={`${cert.issuer}-${cert.abbr}`}
            className="inline-flex items-center gap-1.5 font-mono text-[10px] text-text-muted border border-[#E2DDD8] rounded-[4px] px-1.5 py-0.5"
          >
            <span className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0", dotColor)} />
            {cert.abbr}
          </span>
        );
      })}
    </div>
  );
}
