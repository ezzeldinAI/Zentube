import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle } from "zentube/ui/alert-dialog";

type ResponsiveModalProps = {
  children: React.ReactNode;
  open: boolean;
  title: string;
  onOpenChange: (open: boolean) => void;
};

export function ResponsiveModal({ children, open, title, onOpenChange }: ResponsiveModalProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
        </AlertDialogHeader>
        {children}
      </AlertDialogContent>
    </AlertDialog>
  );
}
