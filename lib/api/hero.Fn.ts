import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export type CTAButton = { text: string; url: string; style: "PRIMARY" | "SECONDARY" };
export type HeroAnnouncement = {
  id: string;
  internalTitle: string;
  headline: string;
  subHeadline?: string;
  buttons: CTAButton[];
  backgroundType: "IMAGE";
  desktopImageUrl?: string;
  imageAlt?: string;
  overlay: "LIGHT" | "MEDIUM" | "DARK";
  contentLayout: "LEFT" | "CENTER";
  countdownEnabled: boolean;
  countdownTo?: string;
  countdownLabel?: string;
  badgeEnabled: boolean;
  badgeText?: string;
  scheduleEnabled: boolean;
  startAt?: string;
  endAt?: string;
  createdAt: string;
  updatedAt: string;
};

export function useHeroAnnouncements() {
  return useQuery<HeroAnnouncement[]>({ queryKey: ["hero"], queryFn: async () => {
    const res = await fetch("/api/admin/hero");
    if (!res.ok) throw new Error("Failed to fetch hero announcements");
    return res.json();
  }});
}

export function useCreateHero() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: Omit<HeroAnnouncement, "id" | "createdAt" | "updatedAt">) => {
      const res = await fetch("/api/admin/hero", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (!res.ok) throw new Error("Failed to create hero");
      return res.json();
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["hero"] }),
  });
}

export function useUpdateHero(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: Omit<HeroAnnouncement, "id" | "createdAt" | "updatedAt">) => {
      const res = await fetch(`/api/admin/hero/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (!res.ok) throw new Error("Failed to update hero");
      return res.json();
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["hero"] }),
  });
}

export function useDeleteHero() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/hero/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete hero");
      return res.json();
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["hero"] }),
  });
}
