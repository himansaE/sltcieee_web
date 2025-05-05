"use client";
import { useState, useRef } from "react";
import { CalendarX2 } from "lucide-react";
import AddNewEvent from "./addEvent";
import type { EventWithOrganization, EventsFilter } from "@/lib/api/events.Fn";
import { EventCard } from "../card";
import { useEvents } from "@/hooks/useEvents";
import { EventFilters, EventFiltersRef } from "./eventFilters";
import { EventsGridSkeleton } from "./eventSkeleton";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { Pagination } from "@/components/ui/pagination";

export const AdminEventsPage: React.FC<{
  // events: EventWithOrganization[];
  // totalEvents: number;
  itemsPerPage: number;
}> = ({ itemsPerPage }) => {
  const filtersRef = useRef<EventFiltersRef>(null);
  const [filters, setFilters] = useState<EventsFilter>({
    sortBy: "date",
    sortOrder: "desc",
    page: 1,
    itemsPerPage,
  });

  const {
    data: eventsData,
    refetch: refetchEvents,
    isFetching: isLoading,
  } = useEvents<true>({
    withOrganization: true,
    filter: filters,
    // initialData: {
    //   data: initialEventData,
    //   total: totalEvents,
    // },
  });

  const events = eventsData?.data ?? [];
  const total = eventsData?.total ?? 0;
  const pageCount = Math.ceil(total / itemsPerPage);

  const hasActiveFilters = !!(
    filters.search ||
    filters.organizationUnitId ||
    filters.sortBy !== "date" ||
    filters.sortOrder !== "desc"
  );

  const clearFilters = () => {
    // Reset the filter state in this component
    setFilters({
      sortBy: "date",
      sortOrder: "desc",
      page: 1,
      itemsPerPage,
    });

    // Reset the filter inputs in the child component
    if (filtersRef.current) {
      filtersRef.current.resetFilters();
    }
  };

  // useEffect(() => {
  //   console.log("filters:", filters); // Debug log
  //   refetchEvents();
  // }, [filters]);

  if (!events && !isLoading) return null;

  return (
    <div className="px-5 py-4">
      <div className="flex justify-between items-center flex-row mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Manage Events</h1>
        <AddNewEvent refetchEvents={refetchEvents} mode="create" />
      </div>

      <EventFilters
        ref={filtersRef}
        onFilterChange={setFilters}
        filtersList={filters}
      />

      {isLoading ? (
        <EventsGridSkeleton />
      ) : events.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10">
          <div className="flex flex-col items-center max-w-md text-center">
            <div className="p-4 rounded-full bg-primary/10 mb-4">
              {hasActiveFilters ? (
                <Search className="h-8 w-8 text-primary" />
              ) : (
                <CalendarX2 className="h-8 w-8 text-primary" />
              )}
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {hasActiveFilters ? "No matches found" : "No Events Created Yet"}
            </h3>
            <p className="text-sm text-gray-500 mb-4 max-w-sm">
              {hasActiveFilters ? (
                <>
                  No events match your current filters. Try adjusting your
                  search criteria or clear the filters to see all events.
                </>
              ) : (
                "Get started by creating your first event. Events will be displayed here and can be managed from this dashboard."
              )}
            </p>
            {hasActiveFilters ? (
              <Button
                variant="outline"
                onClick={clearFilters}
                className="gap-2"
              >
                <X className="h-4 w-4" />
                Clear Filters
              </Button>
            ) : (
              <AddNewEvent refetchEvents={refetchEvents} />
            )}
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <EventCard
                key={event.id}
                event={event as EventWithOrganization}
              />
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            {pageCount > 1 && (
              <Pagination
                page={filters.page || 1}
                pageCount={pageCount}
                onPageChange={(page) => setFilters((f) => ({ ...f, page }))}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
};
