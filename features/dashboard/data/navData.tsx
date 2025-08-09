import {
  BookOpen,
  Users,
  CalendarIcon,
  Building2,
  HomeIcon,
  PenToolIcon,
  UsersRound,
} from "lucide-react";
import type { Role } from "@prisma/client";

export const navLinks: Array<{
  title: string;
  url: string;
  icon: any;
  minRole?: Role;
}> = [
  {
    title: "Dashboard",
    url: "/admin/dashboard",
    icon: HomeIcon,
    minRole: "content" as unknown as Role,
  },
  {
    title: "Blogs",
    url: "/admin/blog",
    icon: BookOpen,
    minRole: "content" as unknown as Role,
  },
  {
    title: "Authors",
    url: "/admin/authors",
    icon: PenToolIcon,
    minRole: "content" as unknown as Role,
  },
  {
    title: "Events",
    url: "/admin/events",
    icon: CalendarIcon,
    minRole: "admin" as unknown as Role,
  },
  {
    title: "Organization Units",
    url: "/admin/organization-units",
    icon: Building2,
    minRole: "admin" as unknown as Role,
  },
  {
    title: "Users",
    url: "/admin/users",
    icon: Users,
    minRole: "admin" as unknown as Role,
  },
  {
    title: "Round Table",
    url: "/admin/round-table",
    icon: UsersRound,
    minRole: "admin" as unknown as Role,
  },
];
