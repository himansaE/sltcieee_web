"use client";

import { ChevronRight } from "lucide-react";

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
import { navData, navLinks } from "../data/navData";
import Image from "next/image";
import { authClient } from "@/lib/auth/client";
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
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground shrink-0">
                  <Image
                    src="/yp_logo.png"
                    height={39}
                    width={39}
                    className="rounded-lg"
                    quality={100}
                    alt="YP Logo"
                  />
                </div>
                <div className="flex flex-col flex-1 text-left text-sm leading-tight pl-4">
                  <span className="truncate font-semibold whitespace-nowrap">
                    YPSL
                  </span>
                  <span className="truncate text-xs whitespace-nowrap">
                    Yearly NewsLetter
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
                <SidebarMenuButton tooltip={item.title} key={item.title}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
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
