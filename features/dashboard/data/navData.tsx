import {
  BookOpen,
  Settings2,
  HomeIcon,
  Users,
  CalendarIcon,
  Building2,
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
  {
    title: "Settings",
    url: "/admin/settings",
    icon: Settings2,
  },
];
