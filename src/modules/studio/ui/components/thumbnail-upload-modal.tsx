"use client";

import { UploadButton } from "@/lib/uploadthing";
import { trpc } from "@/trpc/client";
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from "zentube/ui/alert-dialog";

type ThumbnailUploadModalProps = {
  videoId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function ThumbnailUploadModal({ videoId, open, onOpenChange }: ThumbnailUploadModalProps) {
  const utils = trpc.useUtils();

  function onUploadComplete() {
    onOpenChange(false);
    utils.studio.getMany.invalidate();
    utils.studio.getOne.invalidate({ id: videoId });
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>

          <AlertDialogTitle>Upload a thumbnail</AlertDialogTitle>
          <AlertDialogDescription>
            <p>Darg and drop any of</p>
          </AlertDialogDescription>

        </AlertDialogHeader>

        <UploadButton
          endpoint="thumbnailUploader"
          input={{ videoId }}
          className="[&_svg]:mt-12 [&_svg]:text-blue-500"
          onClientUploadComplete={onUploadComplete}
        />
      </AlertDialogContent>
    </AlertDialog>
  );
}
