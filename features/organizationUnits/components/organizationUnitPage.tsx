"use client";
import { useState } from "react";
import type React from "react";
import { Building2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OrganizationUnitCard } from "./card";
import { useOrganizationUnits } from "@/hooks/useOrganizationUnit";
import AddNewOrganizationUnit from "./addUnit";
import { DivList } from "@/components/widgets/divList";
import { LockOverlay } from "./lockOverlay";
import { cn } from "@/lib/utils";
import { Prisma } from "@prisma/client";

type props = {
  units: Prisma.OrganizationUnitGetPayload<{
    include: { events: true };
  }>[];
};

export const AdminOrganizationUnitPage: React.FC<props> = (props) => {
  const [isLocked, setIsLocked] = useState(true);
  const { data: units, refetch: refetchUnits } = useOrganizationUnits({
    withEvents: true,
    initialData: props.units,
  });

  return (
    <div
      className={cn(
        "px-3 sm:px-6 py-3 sm:py-4 relative",
        isLocked
          ? "h-[calc(100vh-64px)] overflow-hidden"
          : "min-h-[calc(100vh-64px)]"
      )}
    >
      <LockOverlay
        isLocked={isLocked}
        onToggleLock={() => setIsLocked(false)}
      />

      <div className="bg-white rounded-lg shadow-sm sm:shadow-none p-3 sm:p-4 mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-0">
            Organization Units
          </h1>

          <div className="flex items-center gap-2 sm:gap-3 sm:ml-auto">
            <Button
              variant={isLocked ? "default" : "outline"}
              onClick={() => setIsLocked(!isLocked)}
              className={cn(
                "flex-1 sm:flex-initial text-xs sm:text-sm transition-all duration-200 justify-center",
                isLocked &&
                  "bg-primary/10 text-primary hover:bg-primary/20 border-primary"
              )}
            >
              <Lock className="h-3.5 w-3.5 sm:h-4 sm:w-4 lg:mr-2" />
              <span className="hidden lg:inline">
                {isLocked ? "Locked" : "Lock Page"}
              </span>
            </Button>
            <AddNewOrganizationUnit
              refresh={refetchUnits}
              className="flex-1 sm:flex-initial"
            />
          </div>
        </div>
      </div>

      <div
        className={cn(
          "relative",
          isLocked
            ? "h-[calc(100%-4rem)] overflow-hidden"
            : "min-h-[calc(100%-4rem)]"
        )}
      >
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
              <OrganizationUnitCard
                unit={unit}
                key={unit.id}
                onRefresh={refetchUnits}
              />
            ))}
            <DivList count={5} />
          </div>
        )}
      </div>
    </div>
  );
};
