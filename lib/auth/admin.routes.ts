import { Role } from "@prisma/client";

/**
 * Define protected admin routes with their required roles
 */
export const adminRoutes: ReadonlyArray<{
  pattern: string;
  roles: Role[];
}> = [
  // Admin dashboard (visible to admin and content)
  { pattern: "/admin/dashboard", roles: [Role.admin, Role.content] },
  { pattern: "/admin/dashboard/*", roles: [Role.admin, Role.content] },

  // Blogs management (admin + content)
  { pattern: "/admin/blog", roles: [Role.admin, Role.content] },
  { pattern: "/admin/blog/*", roles: [Role.admin, Role.content] },

  // Authors management (admin + content)
  { pattern: "/admin/authors", roles: [Role.admin, Role.content] },
  { pattern: "/admin/authors/*", roles: [Role.admin, Role.content] },

  // Events (admin only)
  { pattern: "/admin/events", roles: [Role.admin] },
  { pattern: "/admin/events/*", roles: [Role.admin] },

  // Organization Units (admin only)
  { pattern: "/admin/organization-units", roles: [Role.admin] },
  { pattern: "/admin/organization-units/*", roles: [Role.admin] },

  // Users (admin only)
  { pattern: "/admin/users", roles: [Role.admin] },
  { pattern: "/admin/users/*", roles: [Role.admin] },

  // Round Table (admin only)
  { pattern: "/admin/round-table", roles: [Role.admin] },
  { pattern: "/admin/round-table/*", roles: [Role.admin] },

  // Settings (admin only)
  { pattern: "/admin/settings", roles: [Role.admin] },
  { pattern: "/admin/settings/*", roles: [Role.admin] },

  // API: posts (admin + content)
  { pattern: "/api/admin/posts", roles: [Role.admin, Role.content] },
  { pattern: "/api/admin/posts/*", roles: [Role.admin, Role.content] },

  // API: authors (admin + content)
  { pattern: "/api/admin/authors", roles: [Role.admin, Role.content] },
  { pattern: "/api/admin/authors/*", roles: [Role.admin, Role.content] },

  // API: upload (admin + content)
  { pattern: "/api/admin/upload", roles: [Role.admin, Role.content] },

  // API: events (admin only)
  { pattern: "/api/admin/event", roles: [Role.admin] },
  { pattern: "/api/admin/event/*", roles: [Role.admin] },

  // API: organization units (admin only)
  { pattern: "/api/admin/organization-units", roles: [Role.admin] },
  { pattern: "/api/admin/organization-units/*", roles: [Role.admin] },

  // API: users (admin only)
  { pattern: "/api/admin/users", roles: [Role.admin] },
  { pattern: "/api/admin/users/*", roles: [Role.admin] },

  // API: round-table (admin only)
  { pattern: "/api/admin/round-table", roles: [Role.admin] },

  // Catch-alls (keep these at the end so more specific patterns match first)
  { pattern: "/admin/*", roles: [Role.admin] },
  { pattern: "/api/admin/*", roles: [Role.admin] },
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
