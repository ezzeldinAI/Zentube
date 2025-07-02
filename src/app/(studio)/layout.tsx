import { StudioLayout } from "@/modules/studio/ui/layouts/studio-layouts";

type LayoutProps = {
  children: React.ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <StudioLayout>
      {children}
    </StudioLayout>
  );
}
