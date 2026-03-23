import { prisma } from "@/lib/prisma";

// ─── GitHub API types ─────────────────────────────────────────────────────────

export interface GitHubUserResponse {
  id: number;
  login: string;
  name: string | null;
  avatar_url: string;
  bio: string | null;
  company: string | null;
  blog: string | null;
  location: string | null;
  followers: number;
  following: number;
  public_repos: number;
}

export interface GitHubRepoResponse {
  name: string;
  description: string | null;
  language: string | null;
  topics: string[];
  stargazers_count: number;
  forks_count: number;
  html_url: string;
  updated_at: string;
}

// ─── Fetch helpers ────────────────────────────────────────────────────────────

export async function fetchGitHubUser(accessToken: string): Promise<GitHubUserResponse> {
  const res = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
    next: { revalidate: 0 },
  });
  if (!res.ok) {
    throw new Error(`GitHub API error: ${res.status} ${res.statusText}`);
  }
  return res.json() as Promise<GitHubUserResponse>;
}

export async function fetchGitHubRepos(accessToken: string): Promise<GitHubRepoResponse[]> {
  const res = await fetch(
    "https://api.github.com/user/repos?per_page=30&sort=updated&type=public",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
      next: { revalidate: 0 },
    }
  );
  if (!res.ok) {
    throw new Error(`GitHub repos API error: ${res.status} ${res.statusText}`);
  }
  return res.json() as Promise<GitHubRepoResponse[]>;
}

// ─── Skill aggregation ────────────────────────────────────────────────────────

export function computeSkillGraph(repos: GitHubRepoResponse[]): {
  skillLanguages: Record<string, number>;
  skillTopics: string[];
} {
  const skillLanguages: Record<string, number> = {};
  const topicSet = new Set<string>();

  for (const repo of repos) {
    if (repo.language) {
      skillLanguages[repo.language] = (skillLanguages[repo.language] ?? 0) + 1;
    }
    for (const topic of repo.topics ?? []) {
      topicSet.add(topic);
    }
  }

  return {
    skillLanguages,
    skillTopics: Array.from(topicSet),
  };
}

// ─── Sync ─────────────────────────────────────────────────────────────────────

export async function syncGitHubProfile(userId: string, accessToken: string) {
  const [ghUser, ghRepos] = await Promise.all([
    fetchGitHubUser(accessToken),
    fetchGitHubRepos(accessToken),
  ]);

  const { skillLanguages } = computeSkillGraph(ghRepos);

  // Upsert GitHubProfile
  const profile = await prisma.gitHubProfile.upsert({
    where: { userId },
    create: {
      userId,
      username: ghUser.login,
      displayName: ghUser.name ?? ghUser.login,
      avatarUrl: ghUser.avatar_url,
      bio: ghUser.bio,
      company: ghUser.company,
      followers: ghUser.followers,
      following: ghUser.following,
      publicRepos: ghUser.public_repos,
    },
    update: {
      username: ghUser.login,
      displayName: ghUser.name ?? ghUser.login,
      avatarUrl: ghUser.avatar_url,
      bio: ghUser.bio,
      company: ghUser.company,
      followers: ghUser.followers,
      following: ghUser.following,
      publicRepos: ghUser.public_repos,
    },
  });

  // Replace repos: delete stale, insert fresh
  await prisma.gitHubRepo.deleteMany({ where: { profileId: profile.id } });
  if (ghRepos.length > 0) {
    await prisma.gitHubRepo.createMany({
      data: ghRepos.map((r) => ({
        profileId: profile.id,
        name: r.name,
        description: r.description,
        language: r.language,
        topics: r.topics ?? [],
        stars: r.stargazers_count,
        forks: r.forks_count,
        url: r.html_url,
        updatedAt: new Date(r.updated_at),
      })),
    });
  }

  // Also update User.skills with detected languages
  await prisma.user.update({
    where: { id: userId },
    data: {
      skills: Object.keys(skillLanguages),
    },
  });

  return profile;
}
