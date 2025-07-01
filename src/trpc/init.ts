import { auth } from "@clerk/nextjs/server";
import { initTRPC, TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { cache } from "react";
import superjson from "superjson";

import { db } from "@/db";
import { usersTable } from "@/db/schema";
import { ratelimit } from "@/lib/ratelimit";

export const createTRPCContext = cache(async () => {
  try {
    const { userId } = await auth();
    return { clerkUserId: userId };
  }
  catch {
    // If Clerk is not available (e.g. during static build), return empty context
    return { clerkUserId: null };
  }
});

export type TRPCContext = Awaited<ReturnType<typeof createTRPCContext>>;

const t = initTRPC.context<TRPCContext>().create({
  transformer: superjson,
});
export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(async (opts) => {
  const {
    ctx: { clerkUserId },
  } = opts;

  if (!clerkUserId) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  const [user] = await db.select().from(usersTable).where(eq(usersTable.clerkId, clerkUserId));

  if (!user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  const { success } = await ratelimit.limit(user.id);

  if (!success) {
    throw new TRPCError({ code: "TOO_MANY_REQUESTS" });
  }

  return opts.next({ ctx: { ...opts.ctx, user } });
});
