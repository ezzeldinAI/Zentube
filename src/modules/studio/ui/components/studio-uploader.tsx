import MuxUploader, { MuxUploaderDrop, MuxUploaderFileSelect, MuxUploaderProgress, MuxUploaderStatus } from "@mux/mux-uploader-react";
import { UploadIcon } from "lucide-react";

import { UPLOADER_ID } from "@/constants";
import { Button } from "zentube/ui/button";

type StudioUploaderProps = {
  endpoint?: string | null;
  onSuccess: () => void;
};

export function StudioUploader({ endpoint, onSuccess }: StudioUploaderProps) {
  return (
    <>
      <MuxUploader onSuccess={onSuccess} endpoint={endpoint} id={UPLOADER_ID} className="hidden group/uploader" />

      <MuxUploaderDrop muxUploader={UPLOADER_ID} className="group/drop">
        <div slot="heading" className="flex flex-col items-center gap-6">
          <div className="flex items-center justify-center gap-2 rounded-full bg-muted size-32">
            <UploadIcon className="size-10 text-muted-foreground group/drop-[&[active]]:animate-bounce transition-all duration-300" />
          </div>
          <div className="flex flex-col gap-2 text-center">
            <p className="text-sm">Drag and drop video files to upload</p>
            <p className="text-sm text-muted-foreground">Your videos will be private until you publish them</p>
          </div>
          <MuxUploaderFileSelect muxUploader={UPLOADER_ID}>
            <Button type="button" className="rounded-lg">
              Select File
            </Button>
          </MuxUploaderFileSelect>
        </div>
        <span slot="separator" className="hidden" />
        <MuxUploaderStatus muxUploader={UPLOADER_ID} className="text-sm" />
        <MuxUploaderProgress muxUploader={UPLOADER_ID} type="percentage" />
        <MuxUploaderProgress muxUploader={UPLOADER_ID} type="bar" />
      </MuxUploaderDrop>
    </>
  );
}
