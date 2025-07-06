import { TRPCError } from "@trpc/server";
import { and, count, desc, eq, lt, or } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db";
import { videosTable } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

export const studioRouter = createTRPCRouter({
  getOne: protectedProcedure.input(z.object({ id: z.string().uuid() })).query(async ({ ctx, input }) => {
    const { id: userId } = ctx.user;
    const { id } = input;

    const [video] = await db
      .select()
      .from(videosTable)
      .where(and(
        eq(videosTable.id, id),
        eq(videosTable.userId, userId),
      ));

    if (!video) {
      throw new TRPCError({ code: "NOT_FOUND" });
    }

    return video;
  }),
  getMany: protectedProcedure.input(
    z.object({
      cursor: z.object({
        id: z.string().uuid(),
        updatedAt: z.date(),
      }).nullish(),
      limit: z.number().min(1).max(100),
    }),
  ).query(async ({ ctx, input }) => {
    const { cursor, limit } = input;
    const { id: userId } = ctx.user;

    const data = await db
      .select()
      .from(videosTable)
      .where(and(
        eq(videosTable.userId, userId),
        cursor
          ? or(
              lt(videosTable.updatedAt, cursor.updatedAt),
              and(
                eq(videosTable.updatedAt, cursor.updatedAt),
                lt(videosTable.id, cursor.id),
              ),
            )
          : undefined,
      ))
      .orderBy(desc(videosTable.updatedAt), desc(videosTable.id))
      .limit(limit + 1);

    const hasMore = data.length > limit;

    const items = hasMore ? data.slice(0, -1) : data;

    const lastItem = items[items.length - 1];

    const nextCursor = hasMore
      ? {
          id: lastItem.id,
          updatedAt: lastItem.updatedAt,
        }
      : null;

    return {
      items,
      nextCursor,
    };
  }),
  getManyPaginated: protectedProcedure.input(
    z.object({
      page: z.number().min(0),
      pageSize: z.number().min(1).max(100),
    }),
  ).query(async ({ ctx, input }) => {
    const { page, pageSize } = input;
    const { id: userId } = ctx.user;
    const offset = page * pageSize;

    // Get total count
    const [{ value: total }] = await db
      .select({ value: count() })
      .from(videosTable)
      .where(eq(videosTable.userId, userId));

    // Get paginated data
    const items = await db
      .select()
      .from(videosTable)
      .where(eq(videosTable.userId, userId))
      .orderBy(desc(videosTable.updatedAt), desc(videosTable.id))
      .limit(pageSize)
      .offset(offset);

    return {
      items,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }),
});
