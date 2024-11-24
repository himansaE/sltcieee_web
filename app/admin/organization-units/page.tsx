export const dynamic = "force-dynamic";

import { AdminOrganizationUnitPage } from "@features/organizationUnits/components/organizationUnitPage";
import prisma from "@/lib/prisma";
import type { OrganizationUnitWithEvents } from "@/lib/api/organizationUnitFn";

export default async function OrganizationUnitPage(): Promise<JSX.Element> {
  const units = (await prisma.organizationUnit.findMany({
    include: { events: true },
  })) as unknown as OrganizationUnitWithEvents[];

  return <AdminOrganizationUnitPage units={units} />;
}
