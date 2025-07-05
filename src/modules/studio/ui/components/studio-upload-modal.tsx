"use client";

import { LoaderIcon, PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { ResponsiveModal } from "@/components/responsive-modal";
import { StudioUploader } from "@/modules/studio/ui/components/studio-uploader";
import { trpc } from "@/trpc/client";
import { Button } from "zentube/ui/button";

export function StudioUploadModal() {
  const utils = trpc.useUtils();

  const router = useRouter();

  const create = trpc.videos.create.useMutation({
    onSuccess: () => {
      // refreshes the page when the button is clicked and successfully creates a video
      toast.success("Video Created");
      utils.studio.getMany.invalidate();
    },
    onError: () => {
      // toast.error("Something went wrong");
      toast.error("Something went wrong");
    },
  });

  const remove = trpc.videos.remove.useMutation({
    onSuccess: () => {
      // refreshes the page when the button is clicked and successfully creates a video
      toast.success("Video Removed");
      utils.studio.getMany.invalidate();
    },
    onError: () => {
      // toast.error("Something went wrong");
      toast.error("Something went wrong");
    },
  });

  function onSuccess() {
    if (!create.data?.video.id)
      return;

    create.reset();
    router.push(`/studio/videos/${create.data.video.id}`);
  }

  return (
    <>
      <ResponsiveModal
        title="Upload a video"
        open={!!create.data?.url}
        onOpenChange={() => {
          create.reset();
          remove.mutate({ id: create.data!.video.id });
        }}
      >
        { create.data?.url ? <StudioUploader endpoint={create.data.url} onSuccess={onSuccess} /> : <LoaderIcon />}
      </ResponsiveModal>
      <Button variant="secondary" onClick={() => create.mutate()} disabled={create.isPending} isLoading={create.isPending}>
        <PlusIcon className="size-4" />
        Create
      </Button>
    </>
  );
}
