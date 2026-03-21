export const LANGUAGE_COLORS: Record<string, string> = {
  Python: "#3572A5",
  Go: "#00ADD8",
  TypeScript: "#3178C6",
  HCL: "#844FBA",
  Shell: "#89E051",
  Rust: "#DEA584",
  JavaScript: "#F1E05A",
  "C++": "#F34B7D",
};

export interface Repo {
  name: string;
  language: string;
  stars: number;
  forks: number;
  topics: string[];
  description: string;
}

export interface Certification {
  name: string;
  issuer: string;
  issuerAbbr: string;
  issuedDate: string;
  expiryDate?: string;
  credentialUrl?: string;
}

export interface Language {
  name: string;
  count: number;
  color: string;
}

export interface Profile {
  name: string;
  username: string;
  bio: string;
  location: string;
  company: string;
  blog: string;
  followers: number;
  publicRepos: number;
  openToWork: boolean;
  repos: Repo[];
  languages: Language[];
  topics: string[];
  certifications: Certification[];
}

export const ALEX_CHEN: Profile = {
  name: "Alex Chen",
  username: "alexchen-dc",
  bio: "Infrastructure engineer specializing in large-scale data center automation. Building at the intersection of HPC and cloud-native ops.",
  location: "Austin, TX",
  company: "@Equinix",
  blog: "alexchen.dev",
  followers: 847,
  publicRepos: 43,
  openToWork: true,
  repos: [
    {
      name: "dcim-automation",
      language: "Python",
      stars: 234,
      forks: 45,
      topics: ["terraform", "ansible", "python", "data-center"],
      description: "Automated DCIM workflows for large-scale colocation environments",
    },
    {
      name: "k8s-gpu-scheduler",
      language: "Go",
      stars: 891,
      forks: 102,
      topics: ["kubernetes", "gpu", "scheduling", "mlops"],
      description: "Custom Kubernetes scheduler for GPU workload optimization",
    },
    {
      name: "power-monitoring-stack",
      language: "TypeScript",
      stars: 156,
      forks: 23,
      topics: ["monitoring", "grafana", "prometheus", "pdu"],
      description: "Real-time power monitoring for data center PDUs",
    },
    {
      name: "cooling-predictor",
      language: "Python",
      stars: 67,
      forks: 12,
      topics: ["machine-learning", "cooling", "hvac", "prediction"],
      description: "ML model for predictive cooling in raised-floor environments",
    },
    {
      name: "infra-as-code-templates",
      language: "HCL",
      stars: 312,
      forks: 78,
      topics: ["terraform", "aws", "azure", "iac"],
      description: "Production-ready IaC templates for hyperscaler deployments",
    },
    {
      name: "network-fabric-viz",
      language: "TypeScript",
      stars: 43,
      forks: 8,
      topics: ["networking", "visualization", "d3", "bgp"],
      description: "Network fabric topology visualizer for large DC environments",
    },
  ],
  languages: [
    { name: "Python", count: 18, color: "#3572A5" },
    { name: "Go", count: 9, color: "#00ADD8" },
    { name: "TypeScript", count: 8, color: "#3178C6" },
    { name: "HCL", count: 5, color: "#844FBA" },
    { name: "Shell", count: 3, color: "#89E051" },
  ],
  topics: [
    "terraform", "ansible", "kubernetes", "gpu", "monitoring",
    "prometheus", "grafana", "machine-learning", "networking", "iac", "docker", "bgp",
  ],
  certifications: [
    {
      name: "AWS Solutions Architect – Associate",
      issuer: "AWS",
      issuerAbbr: "AWS",
      issuedDate: "Jan 2024",
      credentialUrl: "#",
    },
    {
      name: "Certified Kubernetes Administrator",
      issuer: "Linux Foundation",
      issuerAbbr: "CKA",
      issuedDate: "Mar 2023",
      expiryDate: "Mar 2026",
    },
    {
      name: "BICSI DCDC",
      issuer: "BICSI",
      issuerAbbr: "BICSI",
      issuedDate: "Jun 2022",
    },
  ],
};

export interface TalentProfile {
  name: string;
  username: string;
  location: string;
  desiredRole: string;
  topLanguages: string[];
  certifications: { abbr: string; issuer: string }[];
  openToWork: boolean;
}

export const TALENT: TalentProfile[] = [
  {
    name: "Alex Chen",
    username: "alexchen-dc",
    location: "Austin, TX",
    desiredRole: "Full-time",
    topLanguages: ["Python", "Go", "TypeScript"],
    certifications: [
      { abbr: "AWS", issuer: "AWS" },
      { abbr: "CKA", issuer: "Linux Foundation" },
      { abbr: "BICSI", issuer: "BICSI" },
    ],
    openToWork: true,
  },
  {
    name: "Maya Patel",
    username: "maya-infra",
    location: "Seattle, WA",
    desiredRole: "Contract",
    topLanguages: ["Go", "Rust", "Shell"],
    certifications: [
      { abbr: "CKA", issuer: "Linux Foundation" },
      { abbr: "GCP", issuer: "Google" },
    ],
    openToWork: true,
  },
  {
    name: "James Rodriguez",
    username: "jrodriguez-hpc",
    location: "Dallas, TX",
    desiredRole: "Full-time",
    topLanguages: ["Python", "C++", "Shell"],
    certifications: [
      { abbr: "AWS", issuer: "AWS" },
      { abbr: "BICSI", issuer: "BICSI" },
    ],
    openToWork: true,
  },
  {
    name: "Sarah Kim",
    username: "sarahkim-ml",
    location: "San Jose, CA",
    desiredRole: "Full-time",
    topLanguages: ["Python", "TypeScript", "Go"],
    certifications: [
      { abbr: "AWS", issuer: "AWS" },
      { abbr: "AZ-104", issuer: "Microsoft" },
    ],
    openToWork: true,
  },
  {
    name: "Carlos Martinez",
    username: "cmartinez-net",
    location: "Phoenix, AZ",
    desiredRole: "Contract",
    topLanguages: ["TypeScript", "Go", "Python"],
    certifications: [
      { abbr: "CCNP", issuer: "Cisco" },
      { abbr: "BICSI", issuer: "BICSI" },
    ],
    openToWork: true,
  },
  {
    name: "Priya Sharma",
    username: "priya-iac",
    location: "Remote",
    desiredRole: "Full-time",
    topLanguages: ["HCL", "Python", "Shell"],
    certifications: [
      { abbr: "AWS", issuer: "AWS" },
      { abbr: "TF Pro", issuer: "HashiCorp" },
    ],
    openToWork: true,
  },
  {
    name: "David Thompson",
    username: "dthompson-ops",
    location: "Chicago, IL",
    desiredRole: "Full-time",
    topLanguages: ["Shell", "Python", "Go"],
    certifications: [
      { abbr: "RHCE", issuer: "Red Hat" },
      { abbr: "AWS", issuer: "AWS" },
    ],
    openToWork: true,
  },
  {
    name: "Emma Walsh",
    username: "ewalsh-k8s",
    location: "Denver, CO",
    desiredRole: "Both",
    topLanguages: ["Go", "TypeScript", "Python"],
    certifications: [
      { abbr: "CKA", issuer: "Linux Foundation" },
      { abbr: "CKAD", issuer: "Linux Foundation" },
    ],
    openToWork: true,
  },
];
