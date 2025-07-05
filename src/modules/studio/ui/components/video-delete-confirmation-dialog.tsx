import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "zentube/ui/alert-dialog";
import { Button } from "zentube/ui/button";

type VideoDeleteConfirmationDialogProps = {
  onConfirm: () => void;
  onCancel: () => void;
  isOpen: boolean;
};

export function VideoDeleteConfirmationDialog({ onConfirm, onCancel, isOpen }: VideoDeleteConfirmationDialogProps) {
  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your account
            and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button type="button" onClick={onConfirm}>Confirm</Button>
          <AlertDialogCancel onClick={onCancel}>Cancel</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
