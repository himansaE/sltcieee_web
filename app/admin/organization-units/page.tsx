export const dynamic = "force-dynamic";

import { AdminOrganizationUnitPage } from "@features/organizationUnits/components/organizationUnitPage";
import prisma from "@/lib/prisma";

export default async function OrganizationUnitPage(): Promise<JSX.Element> {
  const units = await prisma.organizationUnit.findMany({
    include: { events: true },
  });

  return <AdminOrganizationUnitPage units={units} />;
}

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Organization Units | IEEE SLTC Admin",
  description: "Organization Units",
};
