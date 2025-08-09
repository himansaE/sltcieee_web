"use client";

import { useState, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PenSquare, Search, UserX, X } from "lucide-react";
import { useAuthors } from "@/hooks/useAuthors";
import type { AuthorsFilter } from "@/hooks/useAuthors";
import { AuthorFilters, AuthorFiltersRef } from "@/features/authors/components/authorFilters";
import { AuthorsGridSkeleton } from "@/features/authors/components/authorSkeleton";
import { Pagination } from "@/components/ui/pagination";
import type { Author } from "@prisma/client";
import { AddAuthorDialog } from "@/features/authors/components/addAuthorDialog";

const ITEMS_PER_PAGE = 9;

export default function AuthorsPage() {
  const queryClient = useQueryClient();
  const filtersRef = useRef<AuthorFiltersRef>(null);
  const [filters, setFilters] = useState<AuthorsFilter>({
    sortBy: "createdAt",
    sortOrder: "desc",
    page: 1,
    itemsPerPage: ITEMS_PER_PAGE,
  });

  const { data: authorsData, isFetching: isLoading } = useAuthors(filters);

  const authors = authorsData?.data ?? [];
  const total = authorsData?.total ?? 0;
  const pageCount = Math.ceil(total / ITEMS_PER_PAGE);

  const hasActiveFilters = !!(
    filters.search ||
    filters.sortBy !== "createdAt" ||
    filters.sortOrder !== "desc"
  );

  const clearFilters = () => {
    setFilters({
      sortBy: "createdAt",
      sortOrder: "desc",
      page: 1,
      itemsPerPage: ITEMS_PER_PAGE,
    });
    if (filtersRef.current) {
      filtersRef.current.resetFilters();
    }
  };

  const handleSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["authors"] });
  };

  return (
    <div className="px-5 py-4">
      <div className="flex justify-between items-center flex-row mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Manage Authors</h1>
        <AddAuthorDialog onSuccess={handleSuccess} />
      </div>

      <AuthorFilters ref={filtersRef} onFilterChange={setFilters} filtersList={filters} />

      {isLoading ? (
        <AuthorsGridSkeleton />
      ) : authors.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10">
          <div className="flex flex-col items-center max-w-md text-center">
            <div className="p-4 rounded-full bg-primary/10 mb-4">
              {hasActiveFilters ? (
                <Search className="h-8 w-8 text-primary" />
              ) : (
                <UserX className="h-8 w-8 text-primary" />
              )}
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {hasActiveFilters ? "No matches found" : "No Authors Created Yet"}
            </h3>
            <p className="text-sm text-gray-500 mb-4 max-w-sm">
              {hasActiveFilters
                ? "No authors match your current filters. Try adjusting your search criteria or clear the filters to see all authors."
                : "Get started by creating your first author. Authors will be displayed here and can be managed from this dashboard."}
            </p>
            {hasActiveFilters ? (
              <Button variant="outline" onClick={clearFilters} className="gap-2">
                <X className="h-4 w-4" />
                Clear Filters
              </Button>
            ) : (
              <AddAuthorDialog onSuccess={handleSuccess} />
            )}
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {authors.map((author: Author) => (
              <Card key={author.id}>
                <CardHeader className="flex flex-row items-center gap-4">
                  <div className="p-3 rounded-full bg-primary/10">
                    <PenSquare className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{author.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {author.bio}
                  </p>
                </CardContent>
              </Card>
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
}
