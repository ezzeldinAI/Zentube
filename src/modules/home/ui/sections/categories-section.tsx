"use client";

import { useRouter } from "next/navigation";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { FilterCarousel } from "@/components/filter-carousel";
import { trpc } from "@/trpc/client";

type CategoriesSectionProps = {
  categoryId?: string;
};

export function CategoriesSection({ categoryId }: CategoriesSectionProps) {
  return (
    <Suspense fallback={<CategoriesSkeleton />}>
      {/* Improve the ErrorBoundary fallback to be more elegant */}
      <ErrorBoundary fallback={<p>Error</p>}>
        <CategoriesSectionSuspense categoryId={categoryId} />
      </ErrorBoundary>
    </Suspense>
  );
}

function CategoriesSkeleton() {
  return <FilterCarousel isLoading data={[]} onSelect={() => {}} />;
}

function CategoriesSectionSuspense({ categoryId }: {
  categoryId?: string;
}) {
  const router = useRouter();
  const [categories] = trpc.categories.getMany.useSuspenseQuery();

  const data = categories.map(({ name, id }) => ({
    value: id,
    label: name,
  }));

  function onSelect(value: string | null) {
    const url = new URL(window.location.href);

    if (value) {
      url.searchParams.set("categoryId", value);
    }
    else {
      url.searchParams.delete("categoryId");
    }

    router.push(url.toString());
  }

  return <FilterCarousel onSelect={onSelect} value={categoryId} data={data} />;
}
