import { cn } from "@/lib/utils";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle } from "zentube/ui/alert-dialog";

type ResponsiveModalProps = {
  children: React.ReactNode;
  open: boolean;
  title: string;
  onOpenChange: (open: boolean) => void;
};

export function ResponsiveModal({ children, open, title, onOpenChange }: ResponsiveModalProps) {
  return (
    <div>
      <AlertDialog open={open} onOpenChange={onOpenChange}>
        <span className="relative">
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{title}</AlertDialogTitle>
            </AlertDialogHeader>
            {children}
          </AlertDialogContent>
        </span>
      </AlertDialog>
      <div className={cn("absolute top-0 left-0 w-[100vw] h-[100vh]", open ? "bg-black/85 backdrop-blur-lg" : "hidden")} />
    </div>
  );
}
