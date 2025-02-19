"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
} from "@/components/ui/sidebar";
import { TopNav } from "./topnav";
import { navLinks } from "../data/navData";
import Image from "next/image";
import { authClient } from "@/lib/auth/client";
import Link from "next/link";
// This is sample data.

type AdminSideNavProps = {
  children: React.ReactNode;
};
export const AdminSideNav: React.FC<AdminSideNavProps> = (props) => {
  const user = authClient.useSession();
  if (!user) return null;

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground gap-1 mt-2"
              >
                <div className="flex aspect-square size-10 items-center justify-center rounded-lg bg-transparent text-sidebar-primary-foreground shrink-0">
                  <Image
                    src="/sb-icon-color.webp"
                    height={56}
                    width={56}
                    className="rounded-lg"
                    quality={100}
                    alt="YP Logo"
                  />
                </div>
                <div className="flex flex-col flex-1 text-left text-sm leading-tight text-primary-500 ">
                  <span className="truncate font-semibold whitespace-nowrap">
                    SLTC
                  </span>
                  <span className="truncate text-xs whitespace-nowrap">
                    IEEE Student Branch Chapter
                  </span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup className="mt-4">
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarMenu>
              {navLinks.map((item) => (
                <SidebarMenuButton
                  tooltip={item.title}
                  key={item.title}
                  asChild
                >
                  <Link href={item.url}>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg shrink-0">
                  <AvatarImage
                    className="rounded-lg w-full"
                    src={user.data?.user.image}
                    alt={user.data?.user.name}
                  />
                  <AvatarFallback className="rounded-lg w-full">
                    CN
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col flex-1 text-left text-sm leading-tight min-w-32 p-2">
                  <span className="truncate font-semibold">
                    {user.data?.user.name}
                  </span>
                  <span className="truncate text-xs">
                    {user.data?.user.email}
                  </span>
                </div>
              </div>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <TopNav />
        {props.children}
      </SidebarInset>
    </SidebarProvider>
  );
};
