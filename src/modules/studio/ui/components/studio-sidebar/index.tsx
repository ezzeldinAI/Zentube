"use client";

import { LogOutIcon, VideoIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { StudioSidebarHeader } from "@/modules/studio/ui/components/studio-sidebar/studio-sidebar-header";
import { Separator } from "zentube/ui/separator";
import { Sidebar, SidebarContent, SidebarGroup, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "zentube/ui/sidebar";

export function StudioSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar className="pt-16 z-40 border" collapsible="icon">
      <SidebarContent className="bg-background">

        <SidebarGroup>
          <SidebarMenu>
            <StudioSidebarHeader />

            <SidebarMenuItem>
              <SidebarMenuButton isActive={pathname === "/studio"} tooltip="Published Videos" asChild>
                <Link
                  href="/studio"
                >
                  <VideoIcon className="size-5" />
                  <span className="text-sm">Content</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <Separator />

            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Exit Studio" asChild>
                <Link
                  href="/"
                >
                  <LogOutIcon className="size-5" />
                  <span className="text-sm">Exit Studio</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
