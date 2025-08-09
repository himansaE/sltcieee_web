"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { PlusIcon, Search, FileX, X } from "lucide-react";
import { usePosts, PostsFilter } from "@/hooks/usePosts";
import { PostFilters, PostFiltersRef } from "@/features/blog/components/PostFilters";
import { PostTable } from "@/features/blog/components/PostTable";
import { PostsGridSkeleton } from "@/features/blog/components/PostCardSkeleton";

const ITEMS_PER_PAGE = 12;

export default function BlogManagementClient() {
  const router = useRouter();
  const filtersRef = useRef<PostFiltersRef>(null);
  const [filters, setFilters] = useState<PostsFilter>({
    sortBy: "updatedAt",
    sortOrder: "desc",
    page: 1,
    itemsPerPage: ITEMS_PER_PAGE,
  });

  const { data: postsData, isLoading, isError } = usePosts({
    withRelations: true,
    filter: filters,
  });

  const posts = postsData?.data ?? [];
  const totalPosts = postsData?.total ?? 0;
  const pageCount = Math.ceil(totalPosts / ITEMS_PER_PAGE);

  const hasActiveFilters = !!(
    filters.search ||
    filters.authorId ||
    filters.organizationUnitId
  );

  const clearFilters = () => {
    setFilters({
      sortBy: "updatedAt",
      sortOrder: "desc",
      page: 1,
      itemsPerPage: ITEMS_PER_PAGE,
    });

    if (filtersRef.current) {
      filtersRef.current.resetFilters();
    }
  };

  return (
    <div className="px-5 py-4">
      <div className="flex justify-between items-center flex-row mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Manage Blog Posts</h1>
        <Button onClick={() => router.push("/admin/blog/create")}>
          <PlusIcon className="h-4 w-4 mr-2" />
          Create Post
        </Button>
      </div>

      <PostFilters
        ref={filtersRef}
        onFilterChange={setFilters}
        filtersList={filters}
      />

      {isLoading ? (
        <PostsGridSkeleton />
      ) : isError ? (
        <div className="text-center text-red-500">Failed to load posts.</div>
      ) : posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <div className="p-4 rounded-full bg-primary/10 mb-4">
            {hasActiveFilters ? (
              <Search className="h-8 w-8 text-primary" />
            ) : (
              <FileX className="h-8 w-8 text-primary" />
            )}
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {hasActiveFilters ? "No matches found" : "No Blog Posts Yet"}
          </h3>
          <p className="text-sm text-gray-500 mb-4 max-w-sm">
            {hasActiveFilters ? (
              <>
                No posts match your current filters. Try adjusting your
                search criteria or clear the filters to see all posts.
              </>
            ) : (
              "Get started by creating your first blog post. Posts will be displayed here and can be managed from this dashboard."
            )}
          </p>
          {hasActiveFilters && (
            <Button
              variant="outline"
              onClick={clearFilters}
              className="gap-2"
            >
              <X className="h-4 w-4" />
              Clear Filters
            </Button>
          )}
        </div>
      ) : (
        <>
          <PostTable
            posts={posts}
            page={filters.page || 1}
            pageCount={pageCount}
            onPageChange={(page) => setFilters((f) => ({ ...f, page }))}
          />
        </>
      )}
    </div>
  );
}
