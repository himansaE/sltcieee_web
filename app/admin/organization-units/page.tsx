import { WithAuth } from "@/components/withAuth";
import AddNewOrganizationUnit from "@features/organizationUnits/components/addUnit";
import { AdminOrganizationUnitPage } from "@features/organizationUnits/components/organizationUnitPage";
import prisma from "@/lib/prisma";
import { Role } from "@prisma/client";

async function OrganizationUnitPage(): Promise<JSX.Element> {
  const units = await prisma.organizationUnit.findMany();

  return (
    <div className="px-5 py-4">
      <div className="flex justify-between flex-row">
        <h1 className="text-2xl font-bold">Manage Organization Units</h1>
        <AddNewOrganizationUnit />
      </div>
      <AdminOrganizationUnitPage units={units} />
    </div>
  );
}

export default WithAuth(OrganizationUnitPage, [Role.admin]);
