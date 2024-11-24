import {
  getOrganizationUnits,
  type OrganizationUnitReturn,
} from "@/lib/api/organizationUnitFn";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";

interface UseOrganizationUnitsProps<T extends boolean> {
  withEvents: T;
  initialData?: OrganizationUnitReturn<T>;
}
export function useOrganizationUnits<T extends boolean>(
  data: UseOrganizationUnitsProps<T>
): UseQueryResult<OrganizationUnitReturn<T>> {
  return useQuery({
    queryKey: ["organizationUnits", data.withEvents],
    queryFn: () => getOrganizationUnits(data.withEvents),
    initialData: data.initialData,
  });
}
