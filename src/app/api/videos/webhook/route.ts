import type {
  VideoAssetCreatedWebhookEvent,
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

type WebhookEvent = VideoAssetCreatedWebhookEvent | VideoAssetErroredWebhookEvent | VideoAssetReadyWebhookEvent | VideoAssetTrackReadyWebhookEvent;

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
  }

  return new Response("Webhook received", { status: 200 });
}
