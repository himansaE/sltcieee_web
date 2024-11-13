import { WithAuth } from "@/components/withAuth";
import { AdminOrganizationUnitPage } from "@features/organizationUnits/components/organizationUnitPage";
import prisma from "@/lib/prisma";
import { Role } from "@prisma/client";
import type { OrganizationUnitWithEvents } from "@/lib/api/organizationUnitFn";

async function OrganizationUnitPage(): Promise<JSX.Element> {
  const units = (await prisma.organizationUnit.findMany({
    include: { events: true },
  })) as unknown as OrganizationUnitWithEvents[];

  return <AdminOrganizationUnitPage units={units} />;
}

export default WithAuth(OrganizationUnitPage, [Role.admin]);
