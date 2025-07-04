"use client";

import { ChevronLeftIcon } from "lucide-react";
import { useRouter } from "next/navigation";

import { FormSection } from "@/modules/studio/ui/sections/form-section";
import { Button } from "zentube/ui/button";

type VideoViewProps = {
  videoId: string;
};

export function VideoView({ videoId }: VideoViewProps) {
  const router = useRouter();

  function goBack() {
    router.push("/studio");
  }

  return (
    <div className="px-4 pt-2.5 max-w-screen-xl">
      <Button variant="ghost" size="sm" className="mb-4" onClick={goBack}>
        <ChevronLeftIcon className="size-4" />
        Back
      </Button>
      <FormSection videoId={videoId} />
    </div>
  );
}
