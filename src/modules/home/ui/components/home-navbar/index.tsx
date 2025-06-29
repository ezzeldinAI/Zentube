import Image from "next/image";
import Link from "next/link";

import { AuthButton } from "@/modules/auth/ui/components/auth-button";
import { SearchInput } from "@/modules/home/ui/components/home-navbar/search-input";
import { SidebarTrigger } from "zentube/ui/sidebar";

export function HomeNavbar() {
  return (
    <nav className="fixed inset-0 h-16 bg-white flex items-center px-2 pr-5 z-50 border">
      <div className="flex items-center gap-4 w-full">
        {/* Menu and Logo */}
        <div className="flex items-center flex-shrink-0">
          <SidebarTrigger />

          <Link href="/">
            <div className="p-4 flex items-center gap-1">
              <Image src="/logo.svg" alt="logo" width={25} height={25} />
              <p className="text-lg font-semibold tracking-tight">ZenTube</p>
            </div>
          </Link>
        </div>

        {/* Search bar */}
        <div className="flex-1 flex justify-center max-w-[720px] mx-auto">
          <SearchInput />
        </div>

        <div className="flex-shrink-0 items-center flex gap-4">
          <AuthButton />
        </div>
      </div>
    </nav>
  );
}
