import type React from "react";
import type { OrganizationUnit } from "@prisma/client";
import { Building2 } from "lucide-react";

type AdminOrganizationUnitPageProps = {
  units: OrganizationUnit[];
};

export const AdminOrganizationUnitPage: React.FC<
  AdminOrganizationUnitPageProps
> = ({ units }) => {
  if (units.length === 0)
    return (
      <div className="my-20 flex flex-col gap-2 justify-center items-center px-5">
        <div className="p-3 bg-slate-200 text-slate-700 w-min rounded-full">
          <Building2 size={30} />
        </div>
        <div className="text-center text-gray-500">
          No organization units found
        </div>
      </div>
    );

  // return <></>;
};
