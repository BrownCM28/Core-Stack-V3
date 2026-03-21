import { CertificationBadge } from "@/components/CertificationBadge";
import type { Certification } from "@/lib/mock-profile";

interface CertificationGridProps {
  certifications: Certification[];
}

export function CertificationGrid({ certifications }: CertificationGridProps) {
  if (certifications.length === 0) return null;

  return (
    <div>
      <p className="font-mono text-[10px] text-text-muted tracking-[0.12em] uppercase mb-4">
        Certifications
      </p>
      <div className="flex flex-col gap-3">
        {certifications.map((cert) => (
          <CertificationBadge key={cert.name} cert={cert} />
        ))}
      </div>
    </div>
  );
}
