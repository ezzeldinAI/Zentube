"use client";

import { trpc } from "@/trpc/client";

export function PageClient() {
  const [data] = trpc.hello.useSuspenseQuery({ text: "John Doe" });

  return <div>{data.greeting}</div>;
}
