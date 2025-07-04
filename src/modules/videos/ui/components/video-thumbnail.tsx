import Image from "next/image";

import { formatDuration } from "@/lib/utils";

type VideoThumbnailProps = {
  imageUrl?: string | null;
  previewUrl?: string | null;
  title: string;
  duration: number;
};

export function VideoThumbnail({ imageUrl, previewUrl, title, duration }: VideoThumbnailProps) {
  return (
    <div className="relative group">
      {/* Thumbnail Wrapper */}
      <div className="relative w-full overflow-hidden rounded-lg aspect-video">
        <Image src={imageUrl ?? "/placeholder.svg"} alt={title} fill className="size-full object-cover group-hover:opacity-0" />
        <Image unoptimized={!!previewUrl} src={previewUrl ?? "/placeholder.svg"} alt={title} fill className="size-full object-cover opacity-0 group-hover:opacity-100" />
      </div>

      {/* Video duration Box */}
      <div className="absolute bottom-2 right-2 px-1 py-0.5 rounded bg-black/80 text-white text-sm font-medium opacity-100 group-hover:opacity-0 transition-all duration-150">
        {formatDuration(duration)}
      </div>
    </div>
  );
}
