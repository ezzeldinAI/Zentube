import type { FileRouter } from "uploadthing/next";

import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { createUploadthing } from "uploadthing/next";
import { UploadThingError, UTApi } from "uploadthing/server";
import { z } from "zod";

import { db } from "@/db";
import { usersTable, videosTable } from "@/db/schema";

const f = createUploadthing();

export const ourFileRouter = {
  thumbnailUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .input(z.object({
      videoId: z.string().uuid(),
    }))
    .middleware(async ({ input }) => {
      const { userId: clerkUserId } = await auth();

      if (!clerkUserId) {
        throw new UploadThingError("Unauthorized");
      }

      const [user] = await db.select().from(usersTable).where(eq(usersTable.clerkId, clerkUserId));

      if (!user) {
        throw new UploadThingError("Unauthorized");
      }

      const [existingVideo] = await db.select({
        thumbnailKey: videosTable.thumbnailKey,
      }).from(videosTable).where(and(
        eq(videosTable.id, input.videoId),
        eq(videosTable.userId, user.id),
      ));

      if (!existingVideo) {
        throw new UploadThingError("Not found");
      }

      if (existingVideo.thumbnailKey) {
        const utapi = new UTApi();

        await utapi.deleteFiles(existingVideo.thumbnailKey);
        await db.update(videosTable).set({ thumbnailKey: null, thumbnailUrl: null }).where(and(
          eq(videosTable.id, input.videoId),
          eq(videosTable.userId, user.id),
        ));
      }

      return { user, ...input };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      await db.update(videosTable).set({
        thumbnailUrl: file.url,
        thumbnailKey: file.key,
      }).where(
        and(
          eq(videosTable.id, metadata.videoId),
          eq(videosTable.userId, metadata.user.id),
        ),
      );

      return { uploadedBy: metadata.user.id };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
