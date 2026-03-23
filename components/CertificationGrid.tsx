import { CertificationBadge } from "@/components/CertificationBadge";
import type { DbCertification } from "@/components/CertificationBadge";

export function CertificationGrid({ certifications }: { certifications: DbCertification[] }) {
  if (certifications.length === 0) return null;

  return (
    <div>
      <p className="font-mono text-[10px] text-text-muted tracking-[0.12em] uppercase mb-4">
        Certifications
      </p>
      <div className="flex flex-col gap-3">
        {certifications.map((cert) => (
          <CertificationBadge key={cert.id} cert={cert} />
        ))}
      </div>
    </div>
  );
}
