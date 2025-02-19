import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useOrganizationUnits } from "@/hooks/useOrganizationUnit";
import { Search, SortAsc } from "lucide-react";
import type { EventsFilter } from "@/lib/api/events.Fn";
import { useDebounce } from "@/hooks/useDebounce";
import { useEffect, useState } from "react";

interface EventFiltersProps {
  filtersList: EventsFilter;
  onFilterChange: (filters: EventsFilter) => void;
}

export function EventFilters({ onFilterChange }: EventFiltersProps) {
  const [filters, setFilters] = useState<EventsFilter>({
    sortBy: "date",
    sortOrder: "desc",
  });
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const { data: organizationUnits } = useOrganizationUnits({
    withEvents: false,
  });

  useEffect(() => {
    const newFilters = {
      ...filters,
      search: debouncedSearch || undefined,
    };
    onFilterChange(newFilters);
  }, [debouncedSearch, filters, onFilterChange]);

  const handleFilterChange = (updates: Partial<EventsFilter>) => {
    setFilters((current) => {
      const newFilters = { ...current, ...updates };
      return newFilters;
    });
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search events..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="flex gap-2">
        <Select
          value={filters.organizationUnitId || "all"}
          onValueChange={(value) =>
            handleFilterChange({
              organizationUnitId: value === "all" ? undefined : value,
            })
          }
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="All Units" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Units</SelectItem>
            {organizationUnits?.map((unit) => (
              <SelectItem key={unit.id} value={unit.id}>
                {unit.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={`${filters.sortBy}-${filters.sortOrder}`}
          onValueChange={(value) => {
            const [sortBy, sortOrder] = value.split("-") as [
              "date" | "title",
              "asc" | "desc"
            ];
            handleFilterChange({ sortBy, sortOrder });
          }}
        >
          <SelectTrigger className="w-[160px]">
            <SortAsc className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date-desc">Latest First</SelectItem>
            <SelectItem value="date-asc">Oldest First</SelectItem>
            <SelectItem value="title-asc">Title A-Z</SelectItem>
            <SelectItem value="title-desc">Title Z-A</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
