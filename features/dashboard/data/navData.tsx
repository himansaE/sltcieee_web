import {
  BookOpen,
  Users,
  CalendarIcon,
  Building2,
  HomeIcon,
  PenToolIcon,
} from "lucide-react";

export const navLinks = [
  {
    title: "Dashboard",
    url: "/admin/dashboard",
    icon: HomeIcon,
  },
  {
    title: "Articles",
    url: "/admin/articles",
    icon: BookOpen,
  },
  {
    title: "Authors",
    url: "/admin/authors",
    icon: PenToolIcon,
  },
  {
    title: "Events",
    url: "/admin/events",
    icon: CalendarIcon,
  },
  {
    title: "Organization Units",
    url: "/admin/organization-units",
    icon: Building2,
  },
  {
    title: "Users",
    url: "/admin/users",
    icon: Users,
  },
];
