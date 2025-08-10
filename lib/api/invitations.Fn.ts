import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Request from "@/lib/http";

export interface Invitation {
  id: string;
  email: string;
  name?: string | null;
  role: string;
  status: "PENDING" | "ACCEPTED" | "EXPIRED";
  createdAt: string;
  expiresAt: string;
}

export const useInvitations = () => {
  return useQuery<{ invitations: Invitation[] }>({
    queryKey: ["invitations"],
    queryFn: async () => {
      const res = await Request<{ invitations: Invitation[] }>({
        method: "get",
        url: "/api/admin/invitations",
      });
      return res.data;
    },
  });
};

export const useCancelInvitation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await Request<{ message: string }>({
        method: "delete",
        url: `/api/admin/invitations/${id}`,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invitations"] });
    },
  });
};

export const useResendInvitation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await Request<{ message: string }>({
        method: "post",
        url: "/api/admin/invitations/resend",
        data: { id },
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invitations"] });
    },
  });
};
