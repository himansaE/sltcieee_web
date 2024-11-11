import type { Prisma } from "@prisma/client";

export type Event = Prisma.EventGetPayload<{
  select: { [K in keyof Required<Prisma.EventSelect>]: true };
}>;

export type OrganizationUnit = Prisma.OrganizationUnitGetPayload<{
  select: { [K in keyof Required<Prisma.OrganizationUnitSelect>]: true };
}>;
