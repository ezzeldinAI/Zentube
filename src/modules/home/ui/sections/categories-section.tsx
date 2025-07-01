"use client";

import { useQueryState } from "nuqs";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { FilterCarousel } from "@/components/filter-carousel";
import { trpc } from "@/trpc/client";

export function CategoriesSection() {
  return (
    <Suspense fallback={<CategoriesSkeleton />}>
      {/* Improve the ErrorBoundary fallback to be more elegant */}
      <ErrorBoundary fallback={<p>Error</p>}>
        <CategoriesSectionSuspense />
      </ErrorBoundary>
    </Suspense>
  );
}

function CategoriesSkeleton() {
  return <FilterCarousel isLoading data={[]} onSelect={() => {}} />;
}

function CategoriesSectionSuspense() {
  const [currentFilterId, setCurrentFilterId] = useQueryState("filter_id", { defaultValue: "" });
  const [categories] = trpc.categories.getMany.useSuspenseQuery();

  const data = categories.map(({ name, id }) => ({
    value: id,
    label: name,
  }));

  return (
    <>
      <FilterCarousel
        onSelect={(value) => {
          setCurrentFilterId(value);
        }}
        value={currentFilterId}
        data={data}
      />
    </>
  );
}
