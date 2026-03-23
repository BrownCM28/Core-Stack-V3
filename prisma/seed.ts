import { config } from "dotenv";
config({ path: ".env.local" });

import { PrismaClient, UserRole, JobType, ExperienceLevel, ApplicationStatus, ActivityEventType } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { hashSync } from "bcryptjs";
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

async function main() {
  console.log("🌱 Seeding CoreStack database...");

  // ── Clean up ──────────────────────────────────────────────────────────────
  await prisma.activityEvent.deleteMany();
  await prisma.savedSearch.deleteMany();
  await prisma.application.deleteMany();
  await prisma.certification.deleteMany();
  await prisma.gitHubRepo.deleteMany();
  await prisma.gitHubProfile.deleteMany();
  await prisma.job.deleteMany();
  await prisma.verification.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();

  const now = new Date();

  // Helper: create user + credential account
  async function createUserWithPassword(data: {
    id: string;
    name: string;
    email: string;
    password: string;
    role: UserRole;
    emailVerified?: boolean;
    username?: string;
    displayName?: string;
    title?: string;
    bio?: string;
    location?: string;
    openToWork?: boolean;
    openToTypes?: JobType[];
    skills?: string[];
    yearsExperience?: number;
    companyName?: string;
    companyWebsite?: string;
    companySize?: string;
  }) {
    const { password, ...userData } = data;
    const user = await prisma.user.create({
      data: {
        ...userData,
        emailVerified: userData.emailVerified ?? true,
        createdAt: now,
        updatedAt: now,
      },
    });
    await prisma.account.create({
      data: {
        id: uid(),
        accountId: user.email,
        providerId: "credential",
        userId: user.id,
        password: hashSync(password, 10),
        createdAt: now,
        updatedAt: now,
      },
    });
    return user;
  }

  // ── Admin ─────────────────────────────────────────────────────────────────
  const admin = await createUserWithPassword({
    id: uid(),
    name: "CoreStack Admin",
    email: "admin@corestack.io",
    password: "admin123",
    role: UserRole.ADMIN,
  });

  // ── Employers ─────────────────────────────────────────────────────────────
  const employer1 = await createUserWithPassword({
    id: uid(),
    name: "CloudScale Hiring",
    email: "hiring@cloudscale.io",
    password: "employer123",
    role: UserRole.EMPLOYER,
    companyName: "CloudScale Systems",
    companyWebsite: "https://cloudscale.io",
    companySize: "201-500",
  });

  const employer2 = await createUserWithPassword({
    id: uid(),
    name: "Nexus Jobs",
    email: "jobs@nexusdc.com",
    password: "employer123",
    role: UserRole.EMPLOYER,
    companyName: "Nexus Data Centers",
    companyWebsite: "https://nexusdc.com",
    companySize: "51-200",
  });

  // ── Candidates ────────────────────────────────────────────────────────────
  const candidate1 = await createUserWithPassword({
    id: uid(),
    name: "Alex Chen",
    email: "alex@example.com",
    password: "candidate123",
    role: UserRole.CANDIDATE,
    username: "alex-chen",
    displayName: "Alex Chen",
    title: "Senior Infrastructure Engineer",
    bio: "Infrastructure engineer with 8 years building large-scale data center automation platforms. Passionate about GitOps and zero-downtime deployments.",
    location: "Austin, TX",
    openToWork: true,
    openToTypes: [JobType.FULL_TIME],
    skills: ["Python", "Terraform", "Kubernetes", "AWS", "Ansible", "Go"],
    yearsExperience: 8,
  });

  const candidate2 = await createUserWithPassword({
    id: uid(),
    name: "Sarah Kim",
    email: "sarah@example.com",
    password: "candidate123",
    role: UserRole.CANDIDATE,
    username: "sarah-kim",
    displayName: "Sarah Kim",
    title: "Cloud Infrastructure Lead",
    bio: "Cloud infrastructure specialist focused on hybrid cloud architectures. Led 3 data center migration projects with 99.99% uptime.",
    location: "Seattle, WA",
    openToWork: true,
    openToTypes: [JobType.FULL_TIME, JobType.CONTRACT],
    skills: ["AWS", "GCP", "Terraform", "Python", "Kubernetes", "Prometheus"],
    yearsExperience: 6,
  });

  const candidate3 = await createUserWithPassword({
    id: uid(),
    name: "Marcus Davis",
    email: "marcus@example.com",
    password: "candidate123",
    role: UserRole.CANDIDATE,
    username: "marcus-davis",
    displayName: "Marcus Davis",
    title: "Data Center Operations Manager",
    bio: "Ops manager with deep experience in physical infrastructure, power systems, and cooling. BICSI RCDD certified.",
    location: "Dallas, TX",
    openToWork: false,
    openToTypes: [JobType.FULL_TIME],
    skills: ["DCIM", "BMS", "Power Systems", "Cooling", "Change Management"],
    yearsExperience: 12,
  });

  const candidate4 = await createUserWithPassword({
    id: uid(),
    name: "Priya Nair",
    email: "priya@example.com",
    password: "candidate123",
    role: UserRole.CANDIDATE,
    username: "priya-nair",
    displayName: "Priya Nair",
    title: "Platform Engineer",
    bio: "Platform engineer specializing in developer tooling, internal developer platforms, and CI/CD for infrastructure teams.",
    location: "Remote",
    openToWork: true,
    openToTypes: [JobType.CONTRACT],
    skills: ["Go", "TypeScript", "Kubernetes", "ArgoCD", "Backstage", "Vault"],
    yearsExperience: 5,
  });

  const candidate5 = await createUserWithPassword({
    id: uid(),
    name: "Jordan Wu",
    email: "jordan@example.com",
    password: "candidate123",
    role: UserRole.CANDIDATE,
    username: "jordan-wu",
    displayName: "Jordan Wu",
    title: "Site Reliability Engineer",
    bio: "SRE focused on reliability, incident response, and observability in hyperscale environments. On-call veteran.",
    location: "San Francisco, CA",
    openToWork: true,
    openToTypes: [JobType.FULL_TIME, JobType.CONTRACT],
    skills: ["Python", "Go", "Prometheus", "Grafana", "PagerDuty", "Terraform"],
    yearsExperience: 7,
  });

  // ── GitHub profiles ───────────────────────────────────────────────────────
  await prisma.gitHubProfile.create({
    data: {
      userId: candidate1.id,
      username: "alex-chen",
      displayName: "Alex Chen",
      avatarUrl: "https://avatars.githubusercontent.com/u/1001",
      bio: "Building infra at scale. Open source contributor.",
      company: "@cloudscale",
      followers: 312, following: 88, publicRepos: 47,
      repos: {
        create: [
          { name: "terraform-dc-modules", description: "Opinionated Terraform modules for data center provisioning", language: "HCL", stars: 284, forks: 61, url: "https://github.com/alex-chen/terraform-dc-modules", updatedAt: new Date("2026-02-15") },
          { name: "k8s-autoscaler-policy", description: "Custom VPA policies for infrastructure workloads", language: "Go", stars: 97, forks: 22, url: "https://github.com/alex-chen/k8s-autoscaler-policy", updatedAt: new Date("2026-01-08") },
          { name: "ansible-rack-config", description: "Ansible playbooks for bare-metal rack automation", language: "Python", stars: 53, forks: 14, url: "https://github.com/alex-chen/ansible-rack-config", updatedAt: new Date("2025-11-20") },
        ],
      },
    },
  });

  await prisma.gitHubProfile.create({
    data: {
      userId: candidate2.id,
      username: "sarah-kim",
      displayName: "Sarah Kim",
      avatarUrl: "https://avatars.githubusercontent.com/u/1002",
      bio: "Hybrid cloud architect | AWS Hero",
      followers: 521, following: 134, publicRepos: 63,
      repos: {
        create: [
          { name: "hybrid-cloud-baseline", description: "Reference architecture for hybrid cloud with AWS Outposts", language: "HCL", stars: 441, forks: 102, url: "https://github.com/sarah-kim/hybrid-cloud-baseline", updatedAt: new Date("2026-02-28") },
          { name: "dc-migration-runbook", description: "Runbooks and tooling for zero-downtime DC migrations", language: "Python", stars: 176, forks: 45, url: "https://github.com/sarah-kim/dc-migration-runbook", updatedAt: new Date("2026-01-22") },
          { name: "prometheus-dc-dashboards", description: "Grafana/Prometheus dashboards for data center metrics", language: "TypeScript", stars: 88, forks: 19, url: "https://github.com/sarah-kim/prometheus-dc-dashboards", updatedAt: new Date("2025-12-05") },
        ],
      },
    },
  });

  await prisma.gitHubProfile.create({
    data: {
      userId: candidate4.id,
      username: "priya-nair",
      displayName: "Priya Nair",
      avatarUrl: "https://avatars.githubusercontent.com/u/1004",
      bio: "Platform engineering | IDP builder | OSS contributor",
      followers: 248, following: 72, publicRepos: 38,
      repos: {
        create: [
          { name: "backstage-infra-plugin", description: "Backstage plugin for visualizing infrastructure topology", language: "TypeScript", stars: 193, forks: 41, url: "https://github.com/priya-nair/backstage-infra-plugin", updatedAt: new Date("2026-03-01") },
          { name: "vault-operator", description: "Kubernetes operator for Vault secret lifecycle management", language: "Go", stars: 137, forks: 29, url: "https://github.com/priya-nair/vault-operator", updatedAt: new Date("2026-02-10") },
        ],
      },
    },
  });

  await prisma.gitHubProfile.create({
    data: {
      userId: candidate5.id,
      username: "jordan-wu",
      displayName: "Jordan Wu",
      avatarUrl: "https://avatars.githubusercontent.com/u/1005",
      bio: "SRE @ hyperscale | On-call philosopher",
      followers: 389, following: 97, publicRepos: 52,
      repos: {
        create: [
          { name: "incident-commander", description: "Opinionated incident management CLI for on-call engineers", language: "Go", stars: 322, forks: 78, url: "https://github.com/jordan-wu/incident-commander", updatedAt: new Date("2026-03-10") },
          { name: "slo-burn-rate-alerts", description: "Multi-window burn rate alerting rules for Prometheus", language: "Python", stars: 214, forks: 55, url: "https://github.com/jordan-wu/slo-burn-rate-alerts", updatedAt: new Date("2026-02-05") },
          { name: "chaos-dc", description: "Chaos engineering toolkit for data center failure simulation", language: "Go", stars: 98, forks: 24, url: "https://github.com/jordan-wu/chaos-dc", updatedAt: new Date("2025-11-30") },
        ],
      },
    },
  });

  // ── Certifications ────────────────────────────────────────────────────────
  await prisma.certification.createMany({
    data: [
      { userId: candidate1.id, name: "AWS Solutions Architect – Professional", issuer: "Amazon Web Services", issuedAt: "Mar 2022", expiresAt: "Mar 2025" },
      { userId: candidate1.id, name: "CKA: Certified Kubernetes Administrator", issuer: "Linux Foundation", issuedAt: "Sep 2023", expiresAt: "Sep 2026" },
      { userId: candidate1.id, name: "HashiCorp Terraform Associate", issuer: "HashiCorp", issuedAt: "Jan 2024" },
      { userId: candidate2.id, name: "AWS Solutions Architect – Professional", issuer: "Amazon Web Services", issuedAt: "Jun 2023", expiresAt: "Jun 2026" },
      { userId: candidate2.id, name: "Google Cloud Professional Architect", issuer: "Google Cloud", issuedAt: "Nov 2022", expiresAt: "Nov 2024" },
      { userId: candidate2.id, name: "CKA: Certified Kubernetes Administrator", issuer: "Linux Foundation", issuedAt: "Apr 2024", expiresAt: "Apr 2027" },
      { userId: candidate3.id, name: "BICSI RCDD", issuer: "BICSI", issuedAt: "May 2020", expiresAt: "May 2023" },
      { userId: candidate3.id, name: "Uptime Institute ATD", issuer: "Uptime Institute", issuedAt: "Jan 2021" },
      { userId: candidate4.id, name: "CKA: Certified Kubernetes Administrator", issuer: "Linux Foundation", issuedAt: "Jul 2023", expiresAt: "Jul 2026" },
      { userId: candidate4.id, name: "HashiCorp Vault Associate", issuer: "HashiCorp", issuedAt: "Mar 2024" },
      { userId: candidate5.id, name: "CKA: Certified Kubernetes Administrator", issuer: "Linux Foundation", issuedAt: "Feb 2022", expiresAt: "Feb 2025" },
      { userId: candidate5.id, name: "AWS SysOps Administrator", issuer: "Amazon Web Services", issuedAt: "Oct 2023", expiresAt: "Oct 2026" },
    ],
  });

  // ── Jobs ──────────────────────────────────────────────────────────────────
  const jobs = await Promise.all([
    prisma.job.create({ data: { title: "Senior Infrastructure Engineer", company: "CloudScale Systems", location: "Austin, TX", remote: true, type: JobType.FULL_TIME, level: ExperienceLevel.SENIOR, salary: "$140k – $180k", description: "Join our infrastructure team to build and operate the platforms that power 300+ data centers across North America.", responsibilities: ["Design and implement large-scale Terraform modules", "Own CI/CD pipelines for infra deployments", "Lead incident response for P1/P2 events"], requirements: ["5+ years infrastructure engineering", "Strong Terraform and Kubernetes experience", "AWS or GCP Professional certification preferred"], tags: ["Terraform", "Kubernetes", "AWS", "Python"], category: "Cloud Infra", employerId: employer1.id, postedAt: new Date("2026-03-01"), updatedAt: now }}),
    prisma.job.create({ data: { title: "Data Center Operations Manager", company: "Nexus Data Centers", location: "Dallas, TX", remote: false, type: JobType.FULL_TIME, level: ExperienceLevel.SENIOR, salary: "$120k – $155k", description: "Lead operations for our Tier IV facility in Dallas. Manage a team of 12 engineers and technicians across 3 shifts.", responsibilities: ["Oversee 24/7 facility operations", "Manage vendor relationships and SLAs", "Drive capacity planning and expansion projects"], requirements: ["8+ years data center operations", "BICSI RCDD or equivalent preferred", "Experience with DCIM platforms"], tags: ["DCIM", "Power Systems", "Cooling", "BICSI"], category: "Data Center Ops", employerId: employer2.id, postedAt: new Date("2026-02-28"), updatedAt: now }}),
    prisma.job.create({ data: { title: "Site Reliability Engineer – Hyperscale", company: "CloudScale Systems", location: "Seattle, WA", remote: true, type: JobType.FULL_TIME, level: ExperienceLevel.MID, salary: "$130k – $165k", description: "Build and maintain the reliability systems for our fastest-growing cloud region.", responsibilities: ["Define and maintain SLOs/SLAs", "Build observability tooling", "Lead post-incident reviews and blameless retrospectives"], requirements: ["3+ years SRE experience", "Strong Python or Go skills", "Experience with Prometheus/Grafana stack"], tags: ["Python", "Go", "Prometheus", "Grafana", "Kubernetes"], category: "SRE", employerId: employer1.id, postedAt: new Date("2026-03-05"), updatedAt: now }}),
    prisma.job.create({ data: { title: "Platform Engineer – Internal Developer Platform", company: "Nexus Data Centers", location: "Remote", remote: true, type: JobType.CONTRACT, level: ExperienceLevel.SENIOR, salary: "$90 – $120/hr", description: "6-month contract to build and launch an internal developer platform for our 400-person engineering org.", responsibilities: ["Build Backstage-based IDP", "Integrate with existing CI/CD and secrets management", "Define golden path templates"], requirements: ["Experience with Backstage or similar IDP tooling", "Strong Go or TypeScript", "Kubernetes operator experience a plus"], tags: ["Backstage", "Go", "TypeScript", "Kubernetes", "Vault"], category: "Platform Eng", employerId: employer2.id, postedAt: new Date("2026-03-08"), updatedAt: now }}),
    prisma.job.create({ data: { title: "Cloud Infrastructure Architect", company: "CloudScale Systems", location: "Austin, TX", remote: false, type: JobType.FULL_TIME, level: ExperienceLevel.PRINCIPAL, salary: "$175k – $220k", description: "Define the next generation cloud architecture for CloudScale's hybrid infrastructure platform.", responsibilities: ["Own cloud architecture roadmap", "Partner with product and security teams", "Lead technical due diligence for acquisitions"], requirements: ["10+ years infrastructure experience", "Deep AWS and GCP expertise", "Track record of leading large-scale migrations"], tags: ["AWS", "GCP", "Terraform", "Architecture"], category: "Cloud Infra", employerId: employer1.id, postedAt: new Date("2026-02-20"), featured: true, updatedAt: now }}),
    prisma.job.create({ data: { title: "Network Infrastructure Engineer", company: "Nexus Data Centers", location: "Dallas, TX", remote: false, type: JobType.FULL_TIME, level: ExperienceLevel.MID, salary: "$100k – $130k", description: "Design and operate the network fabric for our Tier IV data center in Dallas.", responsibilities: ["Configure and maintain Arista/Cisco spine-leaf fabric", "Implement BGP and EVPN routing", "On-call rotation for network incidents"], requirements: ["3+ years network engineering in DC environments", "CCNP or JNCIP preferred", "BGP, EVPN, VXLAN experience"], tags: ["Networking", "BGP", "EVPN", "Arista", "Cisco"], category: "Networking", employerId: employer2.id, postedAt: new Date("2026-03-10"), updatedAt: now }}),
    prisma.job.create({ data: { title: "DevOps Engineer – Infrastructure Automation", company: "CloudScale Systems", location: "Remote", remote: true, type: JobType.FULL_TIME, level: ExperienceLevel.MID, salary: "$115k – $145k", description: "Automate everything. Join a team obsessed with eliminating toil across our global infrastructure.", responsibilities: ["Build automation pipelines for provisioning and configuration", "Maintain GitOps workflows with ArgoCD", "Improve deployment velocity and reliability"], requirements: ["3+ years DevOps/infrastructure automation", "Ansible and Terraform required", "ArgoCD or Flux experience preferred"], tags: ["Ansible", "Terraform", "ArgoCD", "Python", "Kubernetes"], category: "DevOps", employerId: employer1.id, postedAt: new Date("2026-03-12"), updatedAt: now }}),
    prisma.job.create({ data: { title: "Physical Infrastructure Technician", company: "Nexus Data Centers", location: "Dallas, TX", remote: false, type: JobType.FULL_TIME, level: ExperienceLevel.ENTRY, salary: "$55k – $75k", description: "Hands-on role racking, cabling, and maintaining physical hardware in our Dallas facility.", responsibilities: ["Rack and stack servers and networking equipment", "Run structured cabling", "Assist with hardware troubleshooting and RMA"], requirements: ["1+ year in a data center or server room", "CompTIA A+ or equivalent", "Able to lift 50 lbs and work in a raised-floor environment"], tags: ["Hardware", "Cabling", "CompTIA"], category: "Data Center Ops", employerId: employer2.id, postedAt: new Date("2026-03-14"), updatedAt: now }}),
    prisma.job.create({ data: { title: "Kubernetes Platform Lead", company: "CloudScale Systems", location: "Austin, TX", remote: true, type: JobType.FULL_TIME, level: ExperienceLevel.LEAD, salary: "$155k – $195k", description: "Lead our Kubernetes platform team of 5 engineers. Own the platform strategy and hands-on delivery.", responsibilities: ["Lead platform team engineering and roadmap", "Design multi-cluster networking and policy", "Partner with security for supply chain hardening"], requirements: ["6+ years Kubernetes experience", "CKS certification preferred", "Previous tech lead experience"], tags: ["Kubernetes", "Go", "Platform Eng", "CKA"], category: "Platform Eng", employerId: employer1.id, postedAt: new Date("2026-02-15"), featured: true, updatedAt: now }}),
    prisma.job.create({ data: { title: "Facilities Engineer – Power & Cooling", company: "Nexus Data Centers", location: "Dallas, TX", remote: false, type: JobType.FULL_TIME, level: ExperienceLevel.MID, salary: "$90k – $115k", description: "Oversee critical power and cooling systems for our 50MW Tier IV facility.", responsibilities: ["Maintain UPS, generators, and PDU systems", "Monitor and optimize PUE", "Coordinate with contractors for capital projects"], requirements: ["5+ years in critical facilities", "Electrical or mechanical engineering background", "Uptime Institute ATD preferred"], tags: ["Power Systems", "Cooling", "UPS", "Generator", "PUE"], category: "Facilities", employerId: employer2.id, postedAt: new Date("2026-03-03"), updatedAt: now }}),
  ]);

  // ── Applications ──────────────────────────────────────────────────────────
  await prisma.application.createMany({
    data: [
      { userId: candidate1.id, jobId: jobs[0].id, status: ApplicationStatus.SHORTLISTED, appliedAt: new Date("2026-03-05"), updatedAt: now },
      { userId: candidate1.id, jobId: jobs[4].id, status: ApplicationStatus.VIEWED, appliedAt: new Date("2026-03-02"), updatedAt: now },
      { userId: candidate2.id, jobId: jobs[4].id, status: ApplicationStatus.SUBMITTED, appliedAt: new Date("2026-03-03"), updatedAt: now },
      { userId: candidate4.id, jobId: jobs[3].id, status: ApplicationStatus.SHORTLISTED, appliedAt: new Date("2026-03-09"), updatedAt: now },
      { userId: candidate5.id, jobId: jobs[2].id, status: ApplicationStatus.SUBMITTED, appliedAt: new Date("2026-03-06"), updatedAt: now },
      { userId: candidate2.id, jobId: jobs[0].id, status: ApplicationStatus.REJECTED, appliedAt: new Date("2026-02-25"), updatedAt: now },
      { userId: candidate5.id, jobId: jobs[6].id, status: ApplicationStatus.SUBMITTED, appliedAt: new Date("2026-03-13"), updatedAt: now },
      { userId: candidate1.id, jobId: jobs[8].id, status: ApplicationStatus.VIEWED, appliedAt: new Date("2026-02-18"), updatedAt: now },
      { userId: candidate4.id, jobId: jobs[8].id, status: ApplicationStatus.SUBMITTED, appliedAt: new Date("2026-02-16"), updatedAt: now },
      { userId: candidate3.id, jobId: jobs[1].id, status: ApplicationStatus.SHORTLISTED, appliedAt: new Date("2026-03-01"), updatedAt: now },
    ],
  });

  // ── Saved searches ────────────────────────────────────────────────────────
  await prisma.savedSearch.createMany({
    data: [
      { userId: candidate1.id, name: "Senior Terraform roles — Remote", query: "Terraform", filters: { remote: true, levels: ["SENIOR"], tags: ["Terraform"] }, alertFreq: "daily", enabled: true },
      { userId: candidate1.id, name: "Kubernetes Lead positions", query: "Kubernetes Lead", filters: { levels: ["LEAD", "PRINCIPAL"], tags: ["Kubernetes"] }, alertFreq: "weekly", enabled: true },
      { userId: candidate2.id, name: "Cloud Architect — PNW", query: "cloud architect", filters: { location: "Seattle, WA", levels: ["SENIOR", "PRINCIPAL"] }, alertFreq: "weekly", enabled: false },
    ],
  });

  // ── Activity events ───────────────────────────────────────────────────────
  await prisma.activityEvent.createMany({
    data: [
      { userId: candidate1.id, type: ActivityEventType.APPLICATION_SUBMITTED, payload: { jobTitle: "Senior Infrastructure Engineer", company: "CloudScale Systems" }, createdAt: new Date("2026-03-05T10:14:00Z") },
      { userId: candidate1.id, type: ActivityEventType.APPLICATION_VIEWED, payload: { jobTitle: "Senior Infrastructure Engineer", company: "CloudScale Systems" }, createdAt: new Date("2026-03-06T08:30:00Z") },
      { userId: candidate1.id, type: ActivityEventType.APPLICATION_SHORTLISTED, payload: { jobTitle: "Senior Infrastructure Engineer", company: "CloudScale Systems" }, createdAt: new Date("2026-03-07T14:22:00Z") },
      { userId: candidate1.id, type: ActivityEventType.APPLICATION_SUBMITTED, payload: { jobTitle: "Cloud Infrastructure Architect", company: "CloudScale Systems" }, createdAt: new Date("2026-03-02T09:05:00Z") },
      { userId: candidate1.id, type: ActivityEventType.CERT_ADDED, payload: { certName: "HashiCorp Terraform Associate", issuer: "HashiCorp" }, createdAt: new Date("2026-01-10T11:00:00Z") },
      { userId: candidate1.id, type: ActivityEventType.ALERT_MATCH, payload: { alertName: "Senior Terraform roles — Remote", matchCount: 3 }, createdAt: new Date("2026-03-15T07:00:00Z") },
      { userId: candidate2.id, type: ActivityEventType.APPLICATION_SUBMITTED, payload: { jobTitle: "Cloud Infrastructure Architect", company: "CloudScale Systems" }, createdAt: new Date("2026-03-03T13:45:00Z") },
      { userId: candidate2.id, type: ActivityEventType.PROFILE_VIEWED, payload: { viewerCompany: "CloudScale Systems" }, createdAt: new Date("2026-03-08T16:20:00Z") },
    ],
  });

  console.log("✅ Seed complete.");
  console.log(`   Users: 8 (1 admin, 2 employers, 5 candidates)`);
  console.log(`   Jobs: ${jobs.length}`);
  console.log(`   Applications: 10`);
  console.log(`   GitHub profiles: 4`);
  console.log(`   Certifications: 12`);
  console.log(`   Saved searches: 3`);
  console.log(`   Activity events: 8`);
}

main()
  .catch((e) => { console.error("❌ Seed failed:", e); process.exit(1); })
  .finally(() => prisma.$disconnect());
