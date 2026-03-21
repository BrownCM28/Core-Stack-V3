export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: "Full-time" | "Contract";
  salaryMin: number;
  salaryMax: number;
  category: string;
  postedHoursAgo: number;
  featured?: boolean;
}

export const JOBS: Job[] = [
  {
    id: "1",
    title: "Data Center Facilities Engineer",
    company: "Equinix",
    location: "Dallas, TX",
    type: "Full-time",
    salaryMin: 95,
    salaryMax: 120,
    category: "Data Center Ops",
    postedHoursAgo: 24,
    featured: true,
  },
  {
    id: "2",
    title: "Critical Power Systems Technician",
    company: "Digital Realty",
    location: "Phoenix, AZ",
    type: "Full-time",
    salaryMin: 80,
    salaryMax: 100,
    category: "Electrical",
    postedHoursAgo: 6,
  },
  {
    id: "3",
    title: "AI Infrastructure Engineer",
    company: "CoreWeave",
    location: "Remote",
    type: "Full-time",
    salaryMin: 150,
    salaryMax: 200,
    category: "AI Infrastructure",
    postedHoursAgo: 48,
    featured: true,
  },
  {
    id: "4",
    title: "Data Center Construction Manager",
    company: "Turner Construction",
    location: "Chicago, IL",
    type: "Contract",
    salaryMin: 130,
    salaryMax: 160,
    category: "Construction",
    postedHoursAgo: 72,
  },
  {
    id: "5",
    title: "DCIM Systems Administrator",
    company: "CyrusOne",
    location: "Dallas, TX",
    type: "Full-time",
    salaryMin: 90,
    salaryMax: 110,
    category: "Data Center Ops",
    postedHoursAgo: 120,
  },
  {
    id: "6",
    title: "Mechanical/Cooling Engineer",
    company: "Vertiv",
    location: "Columbus, OH",
    type: "Full-time",
    salaryMin: 100,
    salaryMax: 130,
    category: "Cooling/HVAC",
    postedHoursAgo: 168,
  },
  {
    id: "7",
    title: "Network Operations Center (NOC) Engineer",
    company: "Flexential",
    location: "Denver, CO",
    type: "Full-time",
    salaryMin: 75,
    salaryMax: 95,
    category: "Networking",
    postedHoursAgo: 336,
  },
  {
    id: "8",
    title: "GPU Cluster Infrastructure Engineer",
    company: "Lambda Labs",
    location: "San Francisco, CA",
    type: "Full-time",
    salaryMin: 160,
    salaryMax: 220,
    category: "AI Infrastructure",
    postedHoursAgo: 72,
  },
  {
    id: "9",
    title: "Electrical Project Manager",
    company: "AECOM",
    location: "Atlanta, GA",
    type: "Full-time",
    salaryMin: 110,
    salaryMax: 140,
    category: "Project Management",
    postedHoursAgo: 168,
  },
  {
    id: "10",
    title: "Data Center Technician I",
    company: "Switch",
    location: "Las Vegas, NV",
    type: "Full-time",
    salaryMin: 55,
    salaryMax: 75,
    category: "Data Center Ops",
    postedHoursAgo: 96,
  },
  {
    id: "11",
    title: "HV Switchgear Specialist",
    company: "Iron Mountain",
    location: "Richmond, VA",
    type: "Full-time",
    salaryMin: 85,
    salaryMax: 105,
    category: "Electrical",
    postedHoursAgo: 336,
  },
  {
    id: "12",
    title: "Site Reliability Engineer – Infrastructure",
    company: "Cloudflare",
    location: "Austin, TX",
    type: "Full-time",
    salaryMin: 140,
    salaryMax: 180,
    category: "AI Infrastructure",
    postedHoursAgo: 120,
  },
  {
    id: "13",
    title: "Commissioning Manager – Data Center",
    company: "Jacobs Engineering",
    location: "Seattle, WA",
    type: "Contract",
    salaryMin: 120,
    salaryMax: 155,
    category: "Construction",
    postedHoursAgo: 168,
  },
  {
    id: "14",
    title: "Facilities Operations Manager",
    company: "NTT Global Data Centers",
    location: "Ashburn, VA",
    type: "Full-time",
    salaryMin: 110,
    salaryMax: 135,
    category: "Data Center Ops",
    postedHoursAgo: 144,
  },
  {
    id: "15",
    title: "Chiller Plant Operator",
    company: "QTS Data Centers",
    location: "Richmond, VA",
    type: "Full-time",
    salaryMin: 65,
    salaryMax: 80,
    category: "Cooling/HVAC",
    postedHoursAgo: 504,
  },
  {
    id: "16",
    title: "Network Infrastructure Engineer",
    company: "Zayo Group",
    location: "Boulder, CO",
    type: "Full-time",
    salaryMin: 95,
    salaryMax: 120,
    category: "Networking",
    postedHoursAgo: 336,
  },
  {
    id: "17",
    title: "Mission Critical Project Manager",
    company: "DPR Construction",
    location: "Phoenix, AZ",
    type: "Contract",
    salaryMin: 125,
    salaryMax: 155,
    category: "Project Management",
    postedHoursAgo: 192,
  },
  {
    id: "18",
    title: "Power Systems Engineer",
    company: "Amazon Web Services",
    location: "Seattle, WA",
    type: "Full-time",
    salaryMin: 130,
    salaryMax: 170,
    category: "Electrical",
    postedHoursAgo: 48,
  },
  {
    id: "19",
    title: "Structural Engineer – Hyperscale",
    company: "AECOM",
    location: "Raleigh, NC",
    type: "Full-time",
    salaryMin: 105,
    salaryMax: 130,
    category: "Construction",
    postedHoursAgo: 168,
  },
  {
    id: "20",
    title: "MLOps Infrastructure Engineer",
    company: "Together AI",
    location: "Remote",
    type: "Full-time",
    salaryMin: 145,
    salaryMax: 190,
    category: "AI Infrastructure",
    postedHoursAgo: 96,
  },
];

export const FEATURED_JOBS = JOBS.filter((j) => j.featured);

export const LATEST_JOBS = [...JOBS]
  .sort((a, b) => a.postedHoursAgo - b.postedHoursAgo)
  .slice(0, 6);

export interface ActivityEvent {
  id: string;
  text: string;
  timeAgo: string;
}

export const ACTIVITY: ActivityEvent[] = [
  {
    id: "1",
    text: "An infrastructure engineer applied to GPU Cluster role at Lambda Labs",
    timeAgo: "3m ago",
  },
  {
    id: "2",
    text: "New role posted: Data Center Facilities Engineer at Equinix",
    timeAgo: "12m ago",
  },
  {
    id: "3",
    text: "A Python/Terraform developer in Denver is open to work",
    timeAgo: "1h ago",
  },
  {
    id: "4",
    text: "CoreWeave just posted a new AI Infrastructure role",
    timeAgo: "2h ago",
  },
  {
    id: "5",
    text: "An engineer applied to Critical Power Systems Technician at Digital Realty",
    timeAgo: "3h ago",
  },
  {
    id: "6",
    text: "New role posted: DCIM Systems Administrator at CyrusOne",
    timeAgo: "5h ago",
  },
  {
    id: "7",
    text: "A Go/Kubernetes developer in Austin is open to work",
    timeAgo: "6h ago",
  },
  {
    id: "8",
    text: "Turner Construction just posted a new Construction role",
    timeAgo: "8h ago",
  },
];
