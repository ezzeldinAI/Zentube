"use client";

import { Globe2Icon, LockIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import type { Video } from "@/app/(data)/videos/columns";

import { columns } from "@/app/(data)/videos/columns";
import { DataTable } from "@/app/(data)/videos/data-table";
import { DEFAULT_LIMIT } from "@/constants";
import { formatDuration, snakeCaseToTitle } from "@/lib/utils";
import { trpc } from "@/trpc/client";
import { Skeleton } from "zentube/ui/skeleton";

export function VideoSection() {
  return (
    <Suspense fallback={<VideoSectionSkeleton />}>
      <ErrorBoundary fallback={<p>Error</p>}>
        <VideoSectionSuspense />
      </ErrorBoundary>
    </Suspense>
  );
}

export function VideoSectionSkeleton() {
  return (
    <div className="space-y-4">
      <div className="border-y">
        <div className="p-4">
          <Skeleton className="h-8 w-[200px]" />
        </div>
        <div className="p-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 mb-4">
              <Skeleton className="h-20 w-36" />
              <div className="flex flex-col gap-2">
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-3 w-[150px]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function VideoSectionSuspense() {
  const router = useRouter();
  const [videos] = trpc.studio.getMany.useSuspenseInfiniteQuery({
    limit: DEFAULT_LIMIT,
  }, {
    getNextPageParam: lastPage => lastPage.nextCursor,
  });

  const transformed: Video[] = videos.pages.flatMap(page =>
    page.items.map(video => ({
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
    })),
  );

  const handleRowClick = (video: Video) => {
    router.push(`/studio/videos/${video.id}`);
  };

  return (
    <div className="space-y-4 p-6">
      <DataTable columns={columns} data={transformed} onRowClick={handleRowClick} />
      {/* <InfiniteScroll
        isManual
        hasNextPage={query.hasNextPage}
        isFetchingNextPage={query.isFetchingNextPage}
        fetchNextPage={query.fetchNextPage}
      /> */}
    </div>
  );
}
