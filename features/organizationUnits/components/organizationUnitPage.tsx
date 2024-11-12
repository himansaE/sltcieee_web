"use client";
import type React from "react";
import { Building2 } from "lucide-react";
import { OrganizationUnitCard } from "./card";
import type { OrganizationUnitWithEvents } from "@lib/api/organizationUnitFn";
import { useOrganizationUnits } from "@/hooks/useOrganizationUnit";
import AddNewOrganizationUnit from "./addUnit";

type AdminOrganizationUnitPageProps = {
  units: OrganizationUnitWithEvents[];
};

export const AdminOrganizationUnitPage: React.FC<
  AdminOrganizationUnitPageProps
> = ({ units: initialUnitsData }) => {
  const { data: units, refetch: refetchUnits } = useOrganizationUnits({
    withEvents: true,
    initialData: initialUnitsData,
  });

  return (
    <div className="px-5 py-4">
      <div className="flex justify-between flex-row">
        <h1 className="text-2xl font-bold">Manage Organization Units</h1>
        <AddNewOrganizationUnit refresh={refetchUnits} />
      </div>
      {!units ? (
        <></>
      ) : units?.length === 0 ? (
        <div className="my-20 flex flex-col gap-2 justify-center items-center px-5">
          <div className="p-3 bg-slate-200 text-slate-700 w-min rounded-full">
            <Building2 size={30} />
          </div>
          <div className="text-center text-gray-500">
            No organization units found
          </div>
        </div>
      ) : (
        <div
          className="grid auto-rows-max gap-6 py-10"
          style={{
            gridTemplateColumns:
              "repeat(auto-fit, minmax(min(400px, 100%), 1fr))",
          }}
        >
          {units.map((unit) => (
            <OrganizationUnitCard unit={unit} key={unit.id} />
          ))}
        </div>
      )}
    </div>
  );
};
