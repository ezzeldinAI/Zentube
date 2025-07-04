import { useUser } from "@clerk/nextjs";
import Link from "next/link";

import { UserAvatar } from "@/components/user-avatar";
import { SidebarHeader, SidebarMenuButton, SidebarMenuItem, useSidebar } from "zentube/ui/sidebar";
import { Skeleton } from "zentube/ui/skeleton";

export function StudioSidebarHeader() {
  const { user } = useUser();
  const { state } = useSidebar();

  if (!user) {
    return (
      <SidebarHeader className="flex items-center justify-center pb-4">
        <Skeleton className="size-[112px] rounded-full" />

        <div className="flex flex-col items-center mt-1 gap-y-2">
          <Skeleton className="h-4 w-[80px]" />
          <Skeleton className="h-4 w-[100px]" />
        </div>
      </SidebarHeader>
    );
  }

  if (state === "expanded") {
    return (
      <SidebarHeader className="flex items-center justify-center pb-4">
        <Link href="/users/current">
          <UserAvatar
            imageUrl={user?.imageUrl}
            name={user?.fullName ?? "User"}
            className="size-[112px] hover:opacity-80 ring-2 ring-black/85 ring-offset-0 hover:ring-offset-2 hover:ring-sky-500/50 transition-all"
          />
        </Link>

        <div className="flex flex-col items-center mt-1">
          <p className="text-xs text-muted-foreground">Your Profile</p>
          <p className="text-lg font-medium capitalize">{user.fullName}</p>
        </div>
      </SidebarHeader>
    );
  }
  else {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton tooltip="Profile" asChild>
          <Link href="/users/current">
            <UserAvatar imageUrl={user.imageUrl} name={user.fullName ?? "User"} size="xs" />
            <span className="text-sm">Your profile</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  }
}
