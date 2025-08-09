
"use client";

import React, { useState, forwardRef, useImperativeHandle } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import Request from "@/lib/http";
import type { Author, OrganizationUnit } from "@prisma/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

async function getAuthors(): Promise<Author[]> {
  const res = await Request.get("/api/admin/authors");
  return res.data.data;
}

async function getOrganizationUnits(): Promise<OrganizationUnit[]> {
  const res = await Request.get("/api/admin/organization-units");
  return res.data;
}

export interface PostsFilter {
  search?: string;
  authorId?: string;
  organizationUnitId?: string;
}

interface PostFiltersProps {
  onFilterChange: (filters: PostsFilter) => void;
  filtersList: PostsFilter;
}

export interface PostFiltersRef {
  resetFilters: () => void;
}

export const PostFilters = forwardRef<PostFiltersRef, PostFiltersProps>(({ onFilterChange, filtersList }, ref) => {
  const [filters, setFilters] = useState<PostsFilter>(filtersList);

  const { data: authors } = useQuery({ queryKey: ["authors"], queryFn: getAuthors });
  const { data: orgUnits } = useQuery({ queryKey: ["org-units"], queryFn: getOrganizationUnits });

  const handleFilterChange = () => {
    onFilterChange(filters);
  };

  const resetFilters = () => {
    setFilters({});
    onFilterChange({});
  };

  useImperativeHandle(ref, () => ({
    resetFilters,
  }));

  return (
    <div className="flex items-center space-x-4 mb-6">
      <Input
        placeholder="Search by title..."
        value={filters.search || ""}
        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        onBlur={handleFilterChange}
      />
      <Select
        value={filters.authorId || ""}
        onValueChange={(value) => setFilters({ ...filters, authorId: value })}
      >
        <SelectTrigger>
          <SelectValue placeholder="Filter by author..." />
        </SelectTrigger>
        <SelectContent>
          {authors?.map((author) => (
            <SelectItem key={author.id} value={author.id}>
              {author.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        value={filters.organizationUnitId || ""}
        onValueChange={(value) => setFilters({ ...filters, organizationUnitId: value })}
      >
        <SelectTrigger>
          <SelectValue placeholder="Filter by organization..." />
        </SelectTrigger>
        <SelectContent>
          {orgUnits?.map((unit) => (
            <SelectItem key={unit.id} value={unit.id}>
              {unit.title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button onClick={handleFilterChange}>Filter</Button>
      <Button variant="ghost" onClick={resetFilters}>
        <X className="h-4 w-4 mr-2" />
        Clear
      </Button>
    </div>
  );
});

PostFilters.displayName = "PostFilters";
