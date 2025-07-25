import { useEffect } from "react";

import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { cn } from "@/lib/utils";
import { Button } from "zentube/ui/button";

type InfiniteScrollProps = {
  isManual?: boolean;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
};

export function InfiniteScroll({ isManual = false, hasNextPage, isFetchingNextPage, fetchNextPage }: InfiniteScrollProps) {
  const { targetRef, isIntersecting } = useIntersectionObserver({
    threshold: 0.5,
    rootMargin: "100px",
  });

  useEffect(() => {
    if (isIntersecting && hasNextPage && !isFetchingNextPage && !isManual) {
      fetchNextPage();
    }
  }, [isIntersecting, hasNextPage, isFetchingNextPage, isManual, fetchNextPage]);

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <div ref={targetRef} className="h-1" />
      {hasNextPage
        ? (
            <>
              <Button isLoading={isFetchingNextPage} variant="secondary" disabled={!hasNextPage || isFetchingNextPage} onClick={() => fetchNextPage()} className={cn((!hasNextPage || isFetchingNextPage) ? "opacity-25" : "opacity-100")}>
                Load More
              </Button>
            </>
          )
        : (
            <>
              <p className="text-xs text-muted-foreground">You have reached the end of the list</p>
            </>
          )}
    </div>
  );
}
