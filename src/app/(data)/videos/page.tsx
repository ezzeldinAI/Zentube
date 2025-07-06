"use client";

import { Globe2Icon, LockIcon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

import { formatDuration, snakeCaseToTitle } from "@/lib/utils";
import { VideoSectionSkeleton } from "@/modules/studio/ui/sections/video-section";
import { trpc } from "@/trpc/client";

import type { Video } from "./columns";

import { columns } from "./columns";
import { DataTable } from "./data-table";

function VideoPageContent() {
  const searchParams = useSearchParams();
  const page = Number.parseInt(searchParams.get("page") || "0");
  const pageSize = Number.parseInt(searchParams.get("pageSize") || "20");

  const { data: videos, isLoading } = trpc.studio.getManyPaginated.useQuery({
    page,
    pageSize,
  });

  const transformed: Video[] = videos?.items.map(video => ({
    id: video.id,
    thumbnail: video.thumbnailUrl ?? "/placeholder.svg",
    duration: formatDuration(video.duration),
    title: video.title,
    description: video.description ?? "No description",
    visibility: [
      {
        type: video.visibility,
        label: snakeCaseToTitle(video.visibility),
        icon: video.visibility === "private"
          ? (
              <LockIcon className="size-4" />
            )
          : (
              <Globe2Icon className="size-4" />
            ),
      },
    ],
    status: snakeCaseToTitle(video.muxStatus || "error"),
    date: video.createdAt.toISOString(),
    views: 0, // add real data when available
    comments: 0,
    likes: 0,
  })) ?? [];

  if (isLoading) {
    return <VideoSectionSkeleton />;
  }

  return (
    <div className="space-y-4">
      <DataTable
        columns={columns}
        data={transformed}
        totalCount={videos?.total}
      />
    </div>
  );
}

export default function VideoPage() {
  return (
    <Suspense fallback={<VideoSectionSkeleton />}>
      <VideoPageContent />
    </Suspense>
  );
}
