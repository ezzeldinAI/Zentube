import { MainSection } from "@/modules/home/ui/components/home-sidebar/main-section";
import { PersonalSection } from "@/modules/home/ui/components/home-sidebar/personal-section";
import { Separator } from "zentube/ui/separator";
import { Sidebar, SidebarContent } from "zentube/ui/sidebar";

export function HomeSidebar() {
  return (
    <Sidebar className="pt-16 z-40 border" collapsible="icon">
      <SidebarContent className="bg-background">
        <MainSection />

        <Separator />

        <PersonalSection />
      </SidebarContent>
    </Sidebar>
  );
}
