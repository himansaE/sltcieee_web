import { getOrganizationUnits } from "@/lib/api/organizationUnitFn";
import { useQuery } from "@tanstack/react-query";

export const useOrganizationUnits = (withEvents = false) => {
  return useQuery({
    queryKey: ["organizationUnits", withEvents],
    queryFn: () => getOrganizationUnits(withEvents),
  });
};
