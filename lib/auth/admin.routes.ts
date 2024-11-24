import { Role } from "@prisma/client";

export const adminRoutes: ReadonlyArray<{
  pattern: string;
  roles: Role[];
}> = [
  {
    pattern: "/admin/events/*",
    roles: [Role.admin],
  },
  {
    pattern: "/admin/organization-units/*",
    roles: [Role.admin],
  },
  {
    pattern: "/admin/dashboard/*",
    roles: [Role.admin, Role.content],
  },
] as const;

export const getRouteRoles = (path: string): Role[] | undefined => {
  const route = adminRoutes.find((r) =>
    new RegExp(`^${r.pattern.replace(/\*/g, ".*")}$`).test(path)
  );
  return route?.roles;
};
