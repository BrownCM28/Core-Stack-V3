export const ROLES = ["CANDIDATE", "EMPLOYER", "ADMIN"] as const;
export type Role = (typeof ROLES)[number];

const hierarchy: Record<Role, number> = {
  CANDIDATE: 0,
  EMPLOYER:  1,
  ADMIN:     2,
};

export function hasRole(userRole: string | undefined, required: Role): boolean {
  const level = hierarchy[userRole as Role] ?? -1;
  return level >= hierarchy[required];
}
