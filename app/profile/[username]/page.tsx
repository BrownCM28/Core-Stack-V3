import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  MapPin,
  Building2,
  Globe,
  ExternalLink,
  Users,
  BookOpen,
} from "lucide-react";
import { SkillGraph } from "@/components/SkillGraph";
import { RepoCard } from "@/components/RepoCard";
import { CertificationGrid } from "@/components/CertificationGrid";
import { prisma } from "@/lib/prisma";
import { computeSkillGraph } from "@/lib/github";
import type { GitHubRepoResponse } from "@/lib/github";

interface Props {
  params: { username: string };
}

function GithubIcon({ size = 14 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

async function getProfileData(username: string) {
  return prisma.user.findFirst({
    where: { username },
    include: {
      certifications: { orderBy: { issuedAt: "desc" } },
      profile: {
        include: {
          repos: { orderBy: { stars: "desc" }, take: 30 },
        },
      },
    },
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const user = await getProfileData(params.username);
  if (!user) return { title: "Profile Not Found" };
  return {
    title: `${user.displayName ?? user.name} — CoreStack`,
    description: user.bio ?? `${user.name}'s CoreStack profile.`,
  };
}

export default async function ProfilePage({ params }: Props) {
  const user = await getProfileData(params.username);
  if (!user) notFound();

  const ghProfile = user.profile;
  const initials = user.name.split(" ").map((n) => n[0]).join("").slice(0, 2);

  // Compute skill graph from repos (convert DB repos to match expected shape)
  const reposForSkillGraph = ghProfile?.repos.map((r) => ({
    ...r,
    description: r.description,
    language: r.language,
    topics: r.topics,
    stargazers_count: r.stars,
    forks_count: r.forks,
    html_url: r.url,
    updated_at: r.updatedAt.toISOString(),
    name: r.name,
  })) as GitHubRepoResponse[] | undefined;

  const { skillLanguages, skillTopics } = reposForSkillGraph
    ? computeSkillGraph(reposForSkillGraph)
    : { skillLanguages: {}, skillTopics: [] };

  // Map DB certifications to DbCertification shape
  const certifications = user.certifications.map((c) => ({
    id: c.id,
    name: c.name,
    issuer: c.issuer,
    issuedAt: c.issuedAt,
    expiresAt: c.expiresAt,
    credentialId: c.credentialId,
    credentialUrl: c.credentialUrl,
  }));

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10">

        {/* ── Profile Header ── */}
        <div className="bg-surface border-[1.5px] border-[#E2DDD8] rounded-[8px] p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-start gap-6">

            {/* Avatar with OTW ring */}
            <div className="relative flex-shrink-0">
              {ghProfile?.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={ghProfile.avatarUrl}
                  alt={user.name}
                  className={`w-[72px] h-[72px] rounded-full object-cover ${
                    user.openToWork
                      ? "ring-[3px] ring-accent ring-offset-[3px] ring-offset-surface"
                      : ""
                  }`}
                />
              ) : (
                <div
                  className={`w-[72px] h-[72px] rounded-full bg-[#1E2128] flex items-center justify-center font-mono font-bold text-2xl text-[#9CA3AF] ${
                    user.openToWork
                      ? "ring-[3px] ring-accent ring-offset-[3px] ring-offset-surface"
                      : ""
                  }`}
                >
                  {initials}
                </div>
              )}
              {user.openToWork && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[9px] font-bold text-[#0D0F12] bg-accent px-1.5 py-0.5 rounded-[3px] uppercase tracking-wide">
                  Open to Work
                </span>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0 pt-1">
              <h1 className="font-mono font-bold text-2xl text-text-primary mb-0.5">
                {user.displayName ?? user.name}
              </h1>

              {ghProfile && (
                <a
                  href={`https://github.com/${ghProfile.username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 font-mono text-sm text-text-muted hover:text-accent transition-colors duration-150 mb-3"
                >
                  <GithubIcon size={13} />
                  @{ghProfile.username}
                </a>
              )}

              {(user.bio ?? ghProfile?.bio) && (
                <p className="font-sans text-sm text-text-primary leading-relaxed mb-4 max-w-xl">
                  {user.bio ?? ghProfile?.bio}
                </p>
              )}

              {/* Meta row */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs font-sans text-text-muted mb-4">
                {user.location && (
                  <span className="flex items-center gap-1.5">
                    <MapPin size={12} />
                    {user.location}
                  </span>
                )}
                {(user.companyName ?? ghProfile?.company) && (
                  <span className="flex items-center gap-1.5">
                    <Building2 size={12} />
                    {user.companyName ?? ghProfile?.company}
                  </span>
                )}
                {user.companyWebsite && (
                  <a
                    href={user.companyWebsite}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 hover:text-accent transition-colors duration-150"
                  >
                    <Globe size={12} />
                    {user.companyWebsite.replace(/^https?:\/\//, "")}
                  </a>
                )}
              </div>

              {/* GitHub stats */}
              {ghProfile && (
                <div className="flex items-center gap-5 text-xs font-mono text-text-muted mb-5">
                  <span className="flex items-center gap-1.5">
                    <Users size={12} />
                    <span className="text-text-primary font-semibold">
                      {ghProfile.followers.toLocaleString()}
                    </span>{" "}
                    followers
                  </span>
                  <span className="flex items-center gap-1.5">
                    <BookOpen size={12} />
                    <span className="text-text-primary font-semibold">
                      {ghProfile.publicRepos}
                    </span>{" "}
                    repos
                  </span>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-wrap gap-3">
                {ghProfile && (
                  <a
                    href={`https://github.com/${ghProfile.username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 border-[1.5px] border-[#E2DDD8] rounded-[6px] font-mono text-xs text-text-primary hover:border-accent hover:text-accent transition-all duration-150"
                  >
                    <GithubIcon size={13} />
                    View GitHub Profile
                    <ExternalLink size={11} />
                  </a>
                )}
                <button className="inline-flex items-center gap-2 px-4 py-2 bg-accent border-[1.5px] border-black rounded-[6px] font-mono text-xs text-[#0D0F12] font-semibold hover:bg-[#34C47E] hover:shadow-[0_0_16px_rgba(62,207,142,0.25)] transition-all duration-150">
                  Contact
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── Main content ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left: Stack + Certifications */}
          <div className="lg:col-span-1 flex flex-col gap-5">

            {/* Stack — only if GitHub is connected */}
            {ghProfile ? (
              <div className="bg-surface border-[1.5px] border-[#E2DDD8] rounded-[8px] p-5">
                <SkillGraph
                  skillLanguages={skillLanguages}
                  skillTopics={skillTopics}
                />
              </div>
            ) : (
              <div className="bg-surface border-[1.5px] border-[#E2DDD8] rounded-[8px] p-5">
                <p className="font-mono text-[10px] text-text-muted tracking-[0.12em] uppercase mb-3">
                  Stack
                </p>
                <p className="font-sans text-xs text-text-muted">
                  This user hasn&apos;t connected GitHub yet.
                </p>
              </div>
            )}

            {/* Certifications */}
            {certifications.length > 0 && (
              <div className="bg-surface border-[1.5px] border-[#E2DDD8] rounded-[8px] p-5">
                <CertificationGrid certifications={certifications} />
              </div>
            )}
          </div>

          {/* Right: Repos */}
          <div className="lg:col-span-2">
            <div className="bg-surface border-[1.5px] border-[#E2DDD8] rounded-[8px] p-5">
              <p className="font-mono text-[10px] text-text-muted tracking-[0.12em] uppercase mb-4">
                Public Repos
              </p>

              {!ghProfile ? (
                <p className="font-sans text-sm text-text-muted">
                  This user hasn&apos;t connected GitHub yet.
                </p>
              ) : ghProfile.repos.length === 0 ? (
                <p className="font-sans text-sm text-text-muted">No public repos yet.</p>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {ghProfile.repos.map((repo) => (
                      <RepoCard
                        key={repo.id}
                        repo={{
                          name: repo.name,
                          description: repo.description,
                          language: repo.language,
                          topics: repo.topics,
                          stars: repo.stars,
                          forks: repo.forks,
                          url: repo.url,
                        }}
                      />
                    ))}
                  </div>
                  <div className="mt-5 pt-4 border-t border-[#E2DDD8]">
                    <a
                      href={`https://github.com/${ghProfile.username}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 font-mono text-xs text-text-muted hover:text-accent transition-colors duration-150"
                    >
                      View full GitHub profile →
                    </a>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
