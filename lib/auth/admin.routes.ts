import { Role } from "@prisma/client";

/**
 * Define protected admin routes with their required roles
 */
export const adminRoutes: ReadonlyArray<{
  pattern: string;
  roles: Role[];
}> = [
  {
    pattern: "/admin/events",
    roles: [Role.admin, Role.content],
  },
  {
    pattern: "/admin/events/*",
    roles: [Role.admin, Role.content],
  },
  {
    pattern: "/admin/organization-units",
    roles: [Role.admin],
  },
  {
    pattern: "/admin/organization-units/*",
    roles: [Role.admin],
  },
  {
    pattern: "/admin/users",
    roles: [Role.admin],
  },
  {
    pattern: "/admin/users/*",
    roles: [Role.admin],
  },
  {
    pattern: "/admin/dashboard",
    roles: [Role.admin, Role.content],
  },
  {
    pattern: "/admin/dashboard/*",
    roles: [Role.admin, Role.content],
  },
] as const;

/**
 * Get the roles required for a specific path
 * @param path The path to check
 * @returns Array of roles that can access the path, or undefined if path doesn't require authentication
 */
export const getRouteRoles = (path: string): Role[] | undefined => {
  // Find the matching route pattern
  const route = adminRoutes.find((r) =>
    new RegExp(`^${r.pattern.replace(/\*/g, ".*")}$`).test(path)
  );
  return route?.roles;
};
