"use client";

import { useQuery } from "@tanstack/react-query";
import type { Author } from "@prisma/client";

export interface AuthorsFilter {
  sortBy?: "name" | "createdAt";
  sortOrder?: "asc" | "desc";
  search?: string;
  page?: number;
  itemsPerPage?: number;
}

async function getAuthors(filter: AuthorsFilter): Promise<{ data: Author[]; total: number }> {
  const params = new URLSearchParams();
  if (filter.sortBy) params.append("sortBy", filter.sortBy);
  if (filter.sortOrder) params.append("sortOrder", filter.sortOrder);
  if (filter.search) params.append("search", filter.search);
  if (filter.page) params.append("page", filter.page.toString());
  if (filter.itemsPerPage) params.append("itemsPerPage", filter.itemsPerPage.toString());

  const response = await fetch(`/api/admin/authors?${params.toString()}`);
  if (!response.ok) {
    throw new Error("Failed to fetch authors");
  }
  return response.json();
}

export function useAuthors(filter: AuthorsFilter) {
  return useQuery({
    queryKey: ["authors", filter],
    queryFn: () => getAuthors(filter),
  });
}
