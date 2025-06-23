import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Request from "@lib/http";
import { Role } from "@prisma/client";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
  image?: string;
}

export interface UserFilter {
  page?: number;
  limit?: number;
  search?: string;
  role?: Role;
}

export interface UserListResponse {
  users: User[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const useUsers = (filter: UserFilter = {}) => {
  const { page = 1, limit = 10, search = "", role } = filter;

  // Construct query params
  const params = new URLSearchParams();
  params.append("page", page.toString());
  params.append("limit", limit.toString());
  if (search) params.append("search", search);
  if (role) params.append("role", role);

  return useQuery<UserListResponse>({
    queryKey: ["users", { page, limit, search, role }],
    queryFn: async () => {
      const res = await Request<UserListResponse>({
        method: "get",
        url: `/api/admin/users?${params.toString()}`,
      });
      return res.data;
    },
  });
};

export const useUser = (userId: string) => {
  return useQuery<User>({
    queryKey: ["user", userId],
    queryFn: async () => {
      const res = await Request<User>({
        method: "get",
        url: `/api/admin/users/${userId}`,
      });
      return res.data;
    },
    enabled: !!userId,
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userData: {
      name: string;
      email: string;
      role: Role;
    }) => {
      const res = await Request<User>({
        method: "post",
        url: "/api/admin/users",
        data: userData,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      userData,
    }: {
      userId: string;
      userData: Partial<User>;
    }) => {
      const res = await Request<User>({
        method: "patch",
        url: `/api/admin/users/${userId}`,
        data: userData,
      });
      return res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user", variables.userId] });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      const res = await Request<{ message: string }>({
        method: "delete",
        url: `/api/admin/users/${userId}`,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};
