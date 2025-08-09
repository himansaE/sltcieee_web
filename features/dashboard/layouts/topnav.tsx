import React from "react";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";

function titleCase(input: string) {
  return input
    .replace(/-/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

const segmentTitleMap: Record<string, string> = {
  dashboard: "Dashboard",
  blog: "Blogs",
  authors: "Authors",
  events: "Events",
  "organization-units": "Organization Units",
  users: "Users",
  "round-table": "Round Table",
  create: "Create",
  edit: "Edit",
};

export const TopNav: React.FC = () => {
  const pathname = usePathname() || "/";
  const segments = pathname.split("?")[0].split("/").filter(Boolean);

  const isAdmin = segments[0] === "admin";
  const adminSegments = isAdmin ? segments.slice(1) : segments;

  type Crumb = { label: string; href: string };
  const base: Crumb[] = isAdmin
    ? [{ label: "Admin", href: "/admin/dashboard" }]
    : [];
  const dynamicCrumbs: Crumb[] = adminSegments.map((seg, idx) => {
    const href = "/" + ["admin", ...adminSegments.slice(0, idx + 1)].join("/");
    const label = segmentTitleMap[seg] ?? titleCase(decodeURIComponent(seg));
    return { label, href };
  });
  const crumbs: Crumb[] = [...base, ...dynamicCrumbs];

  return (
    <header className="flex h-16 sticky top-0 bg-white z-50 border-b shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 py-5">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            {crumbs.length === 0 ? (
              <BreadcrumbItem>
                <BreadcrumbPage>Home</BreadcrumbPage>
              </BreadcrumbItem>
            ) : (
              crumbs.map((c, i) => (
                <React.Fragment key={c.href}>
                  <BreadcrumbItem className={i === 0 ? "hidden md:block" : undefined}>
                    {i < crumbs.length - 1 ? (
                      <BreadcrumbLink href={c.href}>{c.label}</BreadcrumbLink>
                    ) : (
                      <BreadcrumbPage>{c.label}</BreadcrumbPage>
                    )}
                  </BreadcrumbItem>
                  {i < crumbs.length - 1 && (
                    <BreadcrumbSeparator className={i === 0 ? "hidden md:block" : undefined} />
                  )}
                </React.Fragment>
              ))
            )}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
  );
};
