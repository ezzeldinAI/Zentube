import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { HydrateClient, trpc } from "@/trpc/server";

import { PageClient } from "./client";

export default async function Home() {
  void trpc.hello.prefetch({ text: "John Doe" });

  return (
    <HydrateClient>
      <Suspense fallback={<p>Loading...</p>}>
        <ErrorBoundary fallback={<p>Error</p>}>
          <PageClient />
        </ErrorBoundary>
      </Suspense>
    </HydrateClient>
  );
}
