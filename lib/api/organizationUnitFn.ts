import type { OrganizationUnit, Prisma } from "@prisma/client";
import Request from "@lib/http";

type OrganizationUnitCreateRequest = Omit<
  OrganizationUnit,
  "id" | "slug" | "createdAt"
>;

export const createOrganizationUnit = async (
  organizationUnit: OrganizationUnitCreateRequest
) => {
  const res = await Request<OrganizationUnit>({
    method: "post",
    url: "/api/admin/organization-units",
    data: organizationUnit,
  });

  return res.data;
};

export type OrganizationUnitWithEvents = Prisma.OrganizationUnitGetPayload<{
  include: { events: true };
}>;

export type OrganizationUnitReturn<T extends boolean> = T extends true
  ? OrganizationUnitWithEvents[]
  : OrganizationUnit[];

export const getOrganizationUnits = async <T extends boolean>(
  withEvents: T
): Promise<OrganizationUnitReturn<T>> => {
  const res = await Request<OrganizationUnitReturn<T>>({
    method: "get",
    url: "/api/admin/organization-units",
    params: { withEvents },
  });

  return res.data;
};
