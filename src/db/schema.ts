import { relations } from "drizzle-orm";
import { boolean, integer, pgEnum, pgTable, text, timestamp, uniqueIndex, uuid } from "drizzle-orm/pg-core";
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";

export const userRoleEnum = pgEnum("user_role", ["admin", "user"]);

export const usersTable = pgTable("users", {
  isAdmin: boolean("is_admin").notNull(),
  id: uuid("id").primaryKey().defaultRandom(),
  clerkId: text("clerk_id").unique().notNull(),
  name: text("name").notNull(),
  imageUrl: text("image_url").notNull(),
  role: userRoleEnum("role").notNull().default("user"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, t => [uniqueIndex("clerk_id_idx").on(t.clerkId)]);

export const categoriesTable = pgTable("categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull().unique(),
  description: text("description").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, t => [uniqueIndex("name_idx").on(t.name)]);

export const videoVisibility = pgEnum("video_visibility", [
  "public",
  "private",
]);

export const videosTable = pgTable("videos", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").default("Zentube Review").notNull(),
  description: text("description").default("ZenTube is the best platform because not owned by Google").notNull(),
  muxStatus: text("mux_status"),
  muxAssetId: text("mux_asset_id").unique(),
  muxUploadId: text("mux_upload_id").unique(),
  muxPlaybackId: text("mux_playback_id").unique(),
  muxTrackId: text("mux_track_id").unique(),
  muxTrackStatus: text("mux_track_status"),
  thumbnailUrl: text("thumbnail_url"),
  thumbnailKey: text("thumbnail_key"),
  previewUrl: text("preview_url"),
  previewKey: text("preview_key"),
  duration: integer("duration").default(0).notNull(),
  visibility: videoVisibility("visibility").default("private").notNull(),
  userId: uuid("user_id").references(() => usersTable.id, {
    onDelete: "cascade",
  }).notNull(),
  categoryId: uuid("category_id").references(() => categoriesTable.id, {
    onDelete: "set null",
  }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const videoInsertSchema = createInsertSchema(videosTable);
export const videoUpdateSchema = createUpdateSchema(videosTable);
export const videoSelectSchema = createSelectSchema(videosTable);

export const videoRelations = relations(videosTable, ({ one }) => ({
  usersTable: one(usersTable, {
    fields: [videosTable.userId],
    references: [usersTable.id],
  }),
  categoriesTable: one(categoriesTable, {
    fields: [videosTable.categoryId],
    references: [categoriesTable.id],
  }),
}));

export const userRelations = relations(usersTable, ({ many }) => ({
  videosTable: many(videosTable),
}));

export const categoryRelations = relations(usersTable, ({ many }) => ({
  videosTable: many(videosTable),
}));
