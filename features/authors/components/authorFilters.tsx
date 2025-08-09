"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDebounce } from "@/hooks/useDebounce";
import type { AuthorsFilter } from "@/hooks/useAuthors";
import { Search } from "lucide-react";
import { useEffect, useState, forwardRef, useImperativeHandle } from "react";

interface AuthorFiltersProps {
  onFilterChange: (filters: AuthorsFilter) => void;
  filtersList: AuthorsFilter;
}

export interface AuthorFiltersRef {
  resetFilters: () => void;
}

export const AuthorFilters = forwardRef<AuthorFiltersRef, AuthorFiltersProps>(
  ({ onFilterChange, filtersList }, ref) => {
    const [search, setSearch] = useState(filtersList.search || "");
    const debouncedSearch = useDebounce(search, 500);

    useEffect(() => {
      onFilterChange({ ...filtersList, search: debouncedSearch, page: 1 });
    }, [debouncedSearch]);

    useImperativeHandle(ref, () => ({
      resetFilters: () => {
        setSearch("");
      },
    }));

    return (
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or bio"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select
          value={filtersList.sortBy}
          onValueChange={(value) =>
            onFilterChange({ ...filtersList, sortBy: value as any, page: 1 })
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="createdAt">Created At</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={filtersList.sortOrder}
          onValueChange={(value) =>
            onFilterChange({ ...filtersList, sortOrder: value as any, page: 1 })
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort order" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="asc">Ascending</SelectItem>
            <SelectItem value="desc">Descending</SelectItem>
          </SelectContent>
        </Select>
      </div>
    );
  }
);

AuthorFilters.displayName = "AuthorFilters";
