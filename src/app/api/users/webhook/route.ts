import type { NextRequest } from "next/server";

import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { usersTable } from "@/db/schema";

export async function POST(req: NextRequest) {
  try {
    // eslint-disable-next-line node/no-process-env
    const evt = await verifyWebhook(req, { signingSecret: process.env.CLERK_SIGNING_SECRET! });

    const eventType = evt.type;

    if (eventType === "user.created") {
      const { data: { id, first_name, last_name, image_url } } = evt;
      await db.insert(usersTable).values({
        clerkId: id,
        name: `${first_name} ${last_name !== null ? last_name : ""}`,
        imageUrl: image_url,
      });
    }

    if (eventType === "user.deleted") {
      const { data: { id } } = evt;
      if (!id) {
        return new Response("Missing user id", { status: 400 });
      }
      await db.delete(usersTable).where(eq(usersTable.clerkId, id));
    }

    if (eventType === "user.updated") {
      const { data: { id, first_name, last_name, image_url } } = evt;
      await db.update(usersTable).set({
        name: `${first_name} ${last_name}`,
        imageUrl: image_url,
      }).where(eq(usersTable.clerkId, id));
    }

    return new Response("Webhook received", { status: 200 });
  }
  catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error verifying webhook", { status: 400 });
  }
}
