import { MapPin, ArrowRight } from "lucide-react";
import { CertificationMiniPills } from "@/components/CertificationMiniPills";
import { LANGUAGE_COLORS } from "@/lib/mock-profile";
import type { TalentProfile } from "@/lib/mock-profile";

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

interface TalentCardProps {
  profile: TalentProfile;
}

export function TalentCard({ profile }: TalentCardProps) {
  return (
    <div className="group bg-surface border-[1.5px] border-[#E2DDD8] rounded-[8px] p-5 hover:border-accent/40 hover:-translate-y-0.5 transition-all duration-150 flex flex-col">
      {/* Header row */}
      <div className="flex items-start gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-[#E8E4DF] flex items-center justify-center flex-shrink-0 font-mono font-semibold text-sm text-text-primary">
          {getInitials(profile.name)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap mb-0.5">
            <p className="font-mono font-semibold text-sm text-text-primary leading-tight">
              {profile.name}
            </p>
            {profile.openToWork && (
              <span className="inline-block font-mono text-[9px] font-bold text-[#0D0F12] bg-accent px-1.5 py-0.5 rounded-[3px] uppercase tracking-wide">
                Open to Work
              </span>
            )}
          </div>
          <p className="font-mono text-xs text-text-muted">@{profile.username}</p>
        </div>
      </div>

      {/* Location + role */}
      <div className="flex items-center gap-2.5 text-xs font-sans text-text-muted mb-4">
        <span className="flex items-center gap-1">
          <MapPin size={11} className="flex-shrink-0" />
          {profile.location}
        </span>
        <span className="text-[#E2DDD8]">·</span>
        <span>{profile.desiredRole}</span>
      </div>

      {/* Language pills */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {profile.topLanguages.map((lang) => {
          const color = LANGUAGE_COLORS[lang] ?? "#6B6560";
          return (
            <span
              key={lang}
              className="inline-flex items-center gap-1.5 font-mono text-[11px] text-accent border border-accent/40 rounded-[4px] px-2 py-0.5"
            >
              <span
                className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: color }}
              />
              {lang}
            </span>
          );
        })}
      </div>

      {/* Cert mini pills */}
      <div className="mb-4 flex-1">
        <CertificationMiniPills certs={profile.certifications} />
      </div>

      {/* Footer */}
      <div className="pt-3 border-t border-[#E2DDD8]">
        <a
          href={`/profile/${profile.username}`}
          className="inline-flex items-center gap-1.5 font-mono text-xs text-text-primary border-[1.5px] border-[#E2DDD8] rounded-[6px] px-3 py-1.5 hover:border-accent hover:text-accent transition-all duration-150"
        >
          View Profile
          <ArrowRight size={11} />
        </a>
      </div>
    </div>
  );
}
