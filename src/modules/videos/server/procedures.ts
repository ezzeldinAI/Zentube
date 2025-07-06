import { TRPCError } from "@trpc/server";
import { and, eq, inArray } from "drizzle-orm";
import { UTApi } from "uploadthing/server";
import { z } from "zod";

import { db } from "@/db";
import { videosTable, videoUpdateSchema } from "@/db/schema";
import { mux } from "@/lib/mux";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

export const videosRouter = createTRPCRouter({
  restoreThumbnail: protectedProcedure.input(z.object({ id: z.string().uuid() })).mutation(async ({ ctx, input }) => {
    const { id: userId } = ctx.user;

    const [existingVideo] = await db.select().from(videosTable).where(and(eq(videosTable.id, input.id), eq(videosTable.userId, userId)));

    if (!existingVideo)
      throw new TRPCError({ code: "NOT_FOUND" });

    if (existingVideo.thumbnailKey) {
      const utapi = new UTApi();

      await utapi.deleteFiles(existingVideo.thumbnailKey);
      await db.update(videosTable).set({ thumbnailKey: null, thumbnailUrl: null }).where(and(
        eq(videosTable.id, input.id),
        eq(videosTable.userId, userId),
      ));
    }

    if (!existingVideo.muxPlaybackId)
      throw new TRPCError({ code: "BAD_REQUEST" });

    const utapi = new UTApi();

    const tempThumbnailUrl = `https://image.mux.com/${existingVideo.muxPlaybackId}/thumbnail.jpg`;
    const uploadedThumbnail = await utapi.uploadFilesFromUrl(tempThumbnailUrl);

    if (!uploadedThumbnail.data) {
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
    }

    const { key: thumbnailKey, url: thumbnailUrl } = uploadedThumbnail.data;

    const [updatedVideo] = await db.update(videosTable).set({ thumbnailUrl, thumbnailKey }).where(and(eq(videosTable.id, input.id), eq(videosTable.userId, userId))).returning();

    return updatedVideo;
  }),
  remove: protectedProcedure.input(z.object({ id: z.string().uuid() })).mutation(async ({ ctx, input }) => {
    const { id: userId } = ctx.user;

    const [removedVideo] = await db.delete(videosTable).where(and(eq(videosTable.id, input.id), eq(videosTable.userId, userId))).returning();

    if (!removedVideo) {
      throw new TRPCError({ code: "NOT_FOUND" });
    }

    return removedVideo;
  }),
  removeMany: protectedProcedure.input(z.object({ ids: z.array(z.string().uuid()) })).mutation(async ({ ctx, input }) => {
    const { id: userId } = ctx.user;

    const removedVideos = await db.delete(videosTable).where(and(
      inArray(videosTable.id, input.ids),
      eq(videosTable.userId, userId),
    )).returning();

    return removedVideos;
  }),
  update: protectedProcedure.input(videoUpdateSchema).mutation(async ({ ctx, input }) => {
    const { id: userId } = ctx.user;

    if (!input.id) {
      throw new TRPCError({ code: "BAD_REQUEST" });
    }

    if (!input.title) {
      input.title = "ZenTube review";
    }

    if (!input.description) {
      input.description = "ZenTube is the best platform because not owned by Google";
    }

    const [updatedVideo] = await db.update(videosTable).set({
      title: input.title,
      description: input.description,
      categoryId: input.categoryId,
      visibility: input.visibility,
      updatedAt: new Date(),
    }).where(
      and(
        eq(videosTable.id, input.id),
        eq(videosTable.userId, userId),
      ),
    ).returning();

    if (!updatedVideo) {
      throw new TRPCError({ code: "NOT_FOUND" });
    }

    return updatedVideo;
  }),
  create: protectedProcedure.mutation(async ({ ctx }) => {
    const { id: userId } = ctx.user;

    const upload = await mux.video.uploads.create({
      new_asset_settings: {
        passthrough: userId,
        playback_policies: ["public"],
        input: [{
          generated_subtitles: [{
            language_code: "en",
            name: "English",
          }],
        }],
      },
      cors_origin: "*",
    });

    const [video] = await db.insert(videosTable).values({
      userId,
      title: "ZenTube review",
      description: "ZenTube is the best platform because not owned by Google",
      muxStatus: "waiting",
      muxUploadId: upload.id,
    }).returning();

    return {
      video,
      url: upload.url,
    };
  }),
});
