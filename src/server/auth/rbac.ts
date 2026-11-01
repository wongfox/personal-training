/**
 * Role-based access control. Roles are stored in the database (roles /
 * user_roles); what each role may do is defined here, in code, so permission
 * changes are reviewed and versioned like any other logic.
 */

export const ROLE_KEYS = ["SUPER_ADMIN", "ADMIN", "CONTENT_MANAGER", "COACH", "USER"] as const;
export type RoleKey = (typeof ROLE_KEYS)[number];

export const ROLE_INFO: Record<RoleKey, { name: string; description: string }> = {
  SUPER_ADMIN: { name: "Super admin", description: "Full access, including granting admin roles." },
  ADMIN: { name: "Admin", description: "Manages users and content, publishes content." },
  CONTENT_MANAGER: { name: "Content manager", description: "Creates and edits journeys, modules and lessons." },
  COACH: { name: "Coach", description: "Reviews learners and their progress (read-only)." },
  USER: { name: "Learner", description: "Access to their own training only." },
};

const PERMISSIONS = {
  "admin:access": ["SUPER_ADMIN", "ADMIN", "CONTENT_MANAGER", "COACH"],
  "metrics:read": ["SUPER_ADMIN", "ADMIN", "COACH"],
  "users:read": ["SUPER_ADMIN", "ADMIN", "COACH"],
  "users:manage": ["SUPER_ADMIN", "ADMIN"],
  "roles:grant_admin": ["SUPER_ADMIN"],
  "content:read": ["SUPER_ADMIN", "ADMIN", "CONTENT_MANAGER"],
  "content:write": ["SUPER_ADMIN", "ADMIN", "CONTENT_MANAGER"],
  "content:publish": ["SUPER_ADMIN", "ADMIN"],
  "audit:read": ["SUPER_ADMIN", "ADMIN"],
} as const satisfies Record<string, readonly RoleKey[]>;

export type Permission = keyof typeof PERMISSIONS;

export function can(roles: readonly string[], permission: Permission): boolean {
  const allowed: readonly string[] = PERMISSIONS[permission];
  return roles.some((r) => allowed.includes(r));
}

/** Roles a given actor may grant or revoke. */
export function grantableRoles(actorRoles: readonly string[]): RoleKey[] {
  if (can(actorRoles, "roles:grant_admin")) return [...ROLE_KEYS];
  if (can(actorRoles, "users:manage")) return ["CONTENT_MANAGER", "COACH", "USER"];
  return [];
}

export function isRoleKey(value: string): value is RoleKey {
  return (ROLE_KEYS as readonly string[]).includes(value);
}
