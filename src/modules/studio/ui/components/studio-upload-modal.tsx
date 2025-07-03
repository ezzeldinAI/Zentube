"use client";

import { LoaderIcon, PlusIcon } from "lucide-react";
import { toast } from "sonner";

import { ResponsiveModal } from "@/components/responsive-modal";
import { StudioUploader } from "@/modules/studio/ui/components/studio-uploader";
import { trpc } from "@/trpc/client";
import { Button } from "zentube/ui/button";

export function StudioUploadModal() {
  const utils = trpc.useUtils();

  const create = trpc.videos.create.useMutation({
    onSuccess: () => {
      // refreshes the page when the button is clicked and successfully creates a video
      utils.studio.getMany.invalidate();
      toast.success("Video Created");
    },
    onError: (errors) => {
      // toast.error("Something went wrong");
      toast.error(errors.message);
    },
  });

  return (
    <>
      <ResponsiveModal title="Upload a video" open={!!create.data?.url} onOpenChange={() => create.reset()}>
        { create.data?.url ? <StudioUploader endpoint={create.data.url} onSuccess={() => create.reset()} /> : <LoaderIcon />}
      </ResponsiveModal>
      <Button variant="secondary" onClick={() => create.mutate()} disabled={create.isPending} isLoading={create.isPending}>
        <PlusIcon className="size-4" />
        Create
      </Button>
    </>
  );
}
