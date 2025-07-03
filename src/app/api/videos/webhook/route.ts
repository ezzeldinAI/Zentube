import type {
  VideoAssetCreatedWebhookEvent,
  VideoAssetDeletedWebhookEvent,
  VideoAssetErroredWebhookEvent,
  VideoAssetReadyWebhookEvent,
  VideoAssetTrackReadyWebhookEvent,
} from "@mux/mux-node/resources/webhooks";

import { eq } from "drizzle-orm";
import { headers } from "next/headers";

import { db } from "@/db";
import { videosTable } from "@/db/schema";
import { mux } from "@/lib/mux";

// eslint-disable-next-line node/no-process-env
const SIGNING_SECRET = process.env.MUX_WEBHOOK_SECRET;

type WebhookEvent = VideoAssetCreatedWebhookEvent | VideoAssetErroredWebhookEvent | VideoAssetReadyWebhookEvent | VideoAssetTrackReadyWebhookEvent | VideoAssetDeletedWebhookEvent;

export async function POST(request: Request) {
  if (!SIGNING_SECRET) {
    throw new Error("MUX_WEBHOOK_SECRET is not set");
  }

  const headerPayload = await headers();
  const muxSignature = headerPayload.get("mux-signature");

  if (!muxSignature) {
    return new Response("Unauthorized", { status: 401 });
  }

  const payload = await request.json();
  const body = JSON.stringify(payload);

  mux.webhooks.verifySignature(body, {
    "mux-signature": muxSignature,
  }, SIGNING_SECRET);

  switch (payload.type as WebhookEvent["type"]) {
    case "video.asset.created": {
      const data = payload.data as VideoAssetCreatedWebhookEvent["data"];

      if (!data.upload_id) {
        // never should happen and if it does then it's a problem on mux side
        return new Response("Internal Error", { status: 400 });
      }

      await db.update(videosTable).set({
        muxAssetId: data.id,
        muxStatus: data.status,
      }).where(eq(videosTable.muxUploadId, data.upload_id));

      break;
    }
    case "video.asset.ready": {
      const data = payload.data as VideoAssetReadyWebhookEvent["data"];
      const playbackId = data.playback_ids?.[0].id;

      if (!data.upload_id) {
        return new Response("Missing upload ID", { status: 400 });
      }

      if (!playbackId) {
        return new Response("Missing playback ID", { status: 400 });
      }

      const thumbnailUrl = `https://image.mux.com/${playbackId}/thumbnail.jpg`;
      const previewUrl = `https://image.mux.com/${playbackId}/animated.gif`;

      const duration = data.duration ? Math.round(data.duration * 1000) : 0;

      await db.update(videosTable).set({
        muxStatus: data.status,
        muxPlaybackId: playbackId,
        muxAssetId: data.id,
        thumbnailUrl,
        previewUrl,
        duration,
      }).where(eq(videosTable.muxUploadId, data.upload_id));

      break;
    }
    case "video.asset.errored": {
      const data = payload.data as VideoAssetErroredWebhookEvent["data"];

      if (!data.upload_id) {
        return new Response("Missing upload ID", { status: 400 });
      }

      await db.update(videosTable).set({
        muxStatus: data.status,
      }).where(eq(videosTable.muxUploadId, data.upload_id));

      break;
    }
    case "video.asset.deleted":{
      const data = payload.data as VideoAssetDeletedWebhookEvent["data"];

      if (!data.upload_id) {
        return new Response("Missing upload ID", { status: 400 });
      }

      await db.delete(videosTable).where(eq(videosTable.muxUploadId, data.upload_id));

      break;
    }
    case "video.asset.track.ready": {
      const data = payload.data as VideoAssetTrackReadyWebhookEvent["data"] & {
        asset_id: string;
      };

      console.warn("Track ready");

      const assetId = data.asset_id;
      const trackId = data.id;
      const status = data.status;

      if (!assetId) {
        return new Response("Missing asset ID", { status: 400 });
      }

      await db.update(videosTable).set({
        muxTrackId: trackId,
        muxStatus: status,
      }).where(eq(videosTable.muxAssetId, assetId));

      break;
    }
  }

  return new Response("Webhook received", { status: 200 });
}
