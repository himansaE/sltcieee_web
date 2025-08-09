import { useQuery } from "@tanstack/react-query";
import Request from "@/lib/http";
import type { Post, Author, OrganizationUnit } from "@prisma/client";

export type PostWithRelations = Post & {
  authors: Author[];
  organizationUnit: OrganizationUnit | null;
};

export interface PostsFilter {
  search?: string;
  authorId?: string;
  organizationUnitId?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  page?: number;
  itemsPerPage?: number;
}

interface UsePostsProps<T extends boolean> {
  withRelations: T;
  filter: PostsFilter;
  initialData?: any;
}

export const usePosts = <T extends boolean = false>({
  withRelations,
  filter,
  initialData,
}: UsePostsProps<T>) => {
  const queryParams = new URLSearchParams();

  if (withRelations) {
    queryParams.append("withRelations", "true");
  }

  for (const [key, value] of Object.entries(filter)) {
    if (value !== undefined && value !== null && value !== "") {
      if (key === "itemsPerPage") {
        queryParams.append("limit", String(value));
      } else {
        queryParams.append(key, String(value));
      }
    }
  }

  const queryString = queryParams.toString();

  return useQuery({
    queryKey: ["posts", queryString],
    queryFn: async () => {
      const response = await Request.get(`/api/admin/posts?${queryString}`);
      return response.data;
    },
    initialData,
  });
};
