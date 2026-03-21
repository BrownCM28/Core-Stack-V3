export type ApplicationStatus = "Applied" | "Viewed" | "Closed";
export type AlertFrequency = "Instant" | "Daily" | "Weekly";

export interface Application {
  id: string;
  jobTitle: string;
  company: string;
  location: string;
  appliedDate: string;
  status: ApplicationStatus;
}

export interface SavedAlert {
  id: string;
  name: string;
  filterSummary: string;
  frequency: AlertFrequency;
  active: boolean;
}

export interface AdminJob {
  id: string;
  title: string;
  company: string;
  category: string;
  source: string;
  posted: string;
  expires: string;
  isActive: boolean;
}

export interface AdminApplication {
  id: string;
  candidateName: string;
  candidateUsername: string;
  jobTitle: string;
  company: string;
  appliedAt: string;
}

export const MOCK_APPLICATIONS: Application[] = [
  {
    id: "1",
    jobTitle: "Data Center Facilities Engineer",
    company: "Equinix",
    location: "Dallas, TX",
    appliedDate: "Mar 18, 2026",
    status: "Viewed",
  },
  {
    id: "2",
    jobTitle: "GPU Cluster Infrastructure Engineer",
    company: "CoreWeave",
    location: "Remote",
    appliedDate: "Mar 15, 2026",
    status: "Applied",
  },
  {
    id: "3",
    jobTitle: "Senior Electrical Engineer",
    company: "Digital Realty",
    location: "Chicago, IL",
    appliedDate: "Mar 10, 2026",
    status: "Applied",
  },
  {
    id: "4",
    jobTitle: "Data Center Project Manager",
    company: "Turner Construction",
    location: "Austin, TX",
    appliedDate: "Mar 5, 2026",
    status: "Closed",
  },
  {
    id: "5",
    jobTitle: "Cooling Systems Technician",
    company: "CyrusOne",
    location: "Phoenix, AZ",
    appliedDate: "Feb 28, 2026",
    status: "Applied",
  },
];

export const MOCK_ALERTS: SavedAlert[] = [
  {
    id: "1",
    name: "AI Infra Remote",
    filterSummary: "AI Infrastructure • Remote • $150k+",
    frequency: "Instant",
    active: true,
  },
  {
    id: "2",
    name: "Data Center Ops Austin",
    filterSummary: "Data Center Ops • Austin, TX • Full-time",
    frequency: "Daily",
    active: true,
  },
  {
    id: "3",
    name: "GPU Engineering",
    filterSummary: "AI Infrastructure • Any location • $130k+",
    frequency: "Weekly",
    active: false,
  },
];

export const ADMIN_JOBS: AdminJob[] = [
  { id: "1", title: "Data Center Facilities Engineer", company: "Equinix", category: "Data Center Ops", source: "LinkedIn", posted: "Mar 18", expires: "Apr 17", isActive: true },
  { id: "2", title: "GPU Cluster Infrastructure Engineer", company: "CoreWeave", category: "AI Infrastructure", source: "Direct", posted: "Mar 17", expires: "Apr 16", isActive: true },
  { id: "3", title: "Senior Electrical Engineer", company: "Digital Realty", category: "Electrical", source: "LinkedIn", posted: "Mar 15", expires: "Apr 14", isActive: true },
  { id: "4", title: "Data Center Project Manager", company: "Turner Construction", category: "Project Management", source: "Indeed", posted: "Mar 14", expires: "Apr 13", isActive: true },
  { id: "5", title: "Cooling Systems Technician", company: "CyrusOne", category: "Cooling/HVAC", source: "Direct", posted: "Mar 12", expires: "Apr 11", isActive: true },
  { id: "6", title: "Network Engineer", company: "Cloudflare", category: "Networking", source: "LinkedIn", posted: "Mar 10", expires: "Apr 9", isActive: false },
  { id: "7", title: "AI Infrastructure Engineer", company: "Lambda Labs", category: "AI Infrastructure", source: "Direct", posted: "Mar 9", expires: "Apr 8", isActive: true },
  { id: "8", title: "Data Center Construction Manager", company: "AECOM", category: "Construction", source: "LinkedIn", posted: "Mar 7", expires: "Apr 6", isActive: true },
  { id: "9", title: "DCIM Systems Administrator", company: "Flexential", category: "Data Center Ops", source: "Indeed", posted: "Mar 5", expires: "Apr 4", isActive: false },
  { id: "10", title: "Power Systems Engineer", company: "Vertiv", category: "Electrical", source: "Direct", posted: "Mar 3", expires: "Apr 2", isActive: true },
];

export const ADMIN_APPLICATIONS: AdminApplication[] = [
  { id: "1", candidateName: "Alex Chen", candidateUsername: "alexchen-dc", jobTitle: "Data Center Facilities Engineer", company: "Equinix", appliedAt: "Mar 21, 2026 14:32" },
  { id: "2", candidateName: "Maya Patel", candidateUsername: "maya-infra", jobTitle: "GPU Cluster Infrastructure Engineer", company: "CoreWeave", appliedAt: "Mar 21, 2026 13:15" },
  { id: "3", candidateName: "James Rodriguez", candidateUsername: "jrodriguez-hpc", jobTitle: "Senior Electrical Engineer", company: "Digital Realty", appliedAt: "Mar 21, 2026 11:48" },
  { id: "4", candidateName: "Sarah Kim", candidateUsername: "sarahkim-ml", jobTitle: "AI Infrastructure Engineer", company: "Lambda Labs", appliedAt: "Mar 20, 2026 16:22" },
  { id: "5", candidateName: "Carlos Martinez", candidateUsername: "cmartinez-net", jobTitle: "Network Engineer", company: "Cloudflare", appliedAt: "Mar 20, 2026 09:55" },
];
