"use client";

import { PlusIcon } from "lucide-react";
import { toast } from "sonner";

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
    onError: () => {
      toast.error("Something went wrong");
    },
  });

  return (
    <Button variant="secondary" onClick={() => create.mutate()} disabled={create.isPending} isLoading={create.isPending}>
      <PlusIcon className="size-4" />
      Create
    </Button>
  );
}
