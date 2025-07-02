import Image from "next/image";
import Link from "next/link";

import { StudioUploadModal } from "@/modules/studio/ui/components/studio-upload-modal";
import { SidebarTrigger } from "zentube/ui/sidebar";

export function StudioNavbar() {
  return (
    <nav className="fixed inset-0 h-16 bg-white flex items-center px-2 pr-5 z-50 border">
      <div className="flex items-center gap-4 w-full">
        {/* Menu and Logo */}
        <div className="flex items-center flex-shrink-0">
          <SidebarTrigger />

          <Link href="/studio">
            <div className="p-4 flex items-center gap-1">
              <Image src="/logo.svg" alt="logo" width={25} height={25} />
              <p className="text-lg font-semibold tracking-tight">Studio</p>
            </div>
          </Link>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        <div className="flex-shrink-0 items-center flex gap-4">
          <StudioUploadModal />
        </div>
      </div>
    </nav>
  );
}
