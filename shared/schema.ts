import { pgTable, text, serial, integer, boolean, timestamp, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  uid: text("uid").notNull().unique(), // Firebase UID
  email: text("email").notNull().unique(),
  displayName: text("display_name"),
  photoURL: text("photo_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const folders = pgTable("folders", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  userId: integer("user_id").notNull(),
  parentId: integer("parent_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const files = pgTable("files", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  originalName: text("original_name").notNull(),
  mimeType: text("mime_type").notNull(),
  size: integer("size").notNull(),
  path: text("path").notNull(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  folderId: integer("folder_id").references(() => folders.id, { onDelete: "cascade" }),
  isPublic: boolean("is_public").default(false).notNull(),
  shareToken: text("share_token").unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const shares = pgTable("shares", {
  id: serial("id").primaryKey(),
  fileId: integer("file_id").notNull().references(() => files.id, { onDelete: "cascade" }),
  sharedByUserId: integer("shared_by_user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  sharedWithEmail: text("shared_with_email").notNull(),
  permission: text("permission").notNull().default("view"), // view, edit, full
  status: text("status").notNull().default("pending"), // pending, accepted, rejected
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  folders: many(folders),
  files: many(files),
  sharesCreated: many(shares),
}));

export const foldersRelations = relations(folders, ({ one, many }) => ({
  user: one(users, {
    fields: [folders.userId],
    references: [users.id],
  }),
  parent: one(folders, {
    fields: [folders.parentId],
    references: [folders.id],
  }),
  children: many(folders),
  files: many(files),
}));

export const filesRelations = relations(files, ({ one, many }) => ({
  user: one(users, {
    fields: [files.userId],
    references: [users.id],
  }),
  folder: one(folders, {
    fields: [files.folderId],
    references: [folders.id],
  }),
  shares: many(shares),
}));

export const sharesRelations = relations(shares, ({ one }) => ({
  file: one(files, {
    fields: [shares.fileId],
    references: [files.id],
  }),
  sharedByUser: one(users, {
    fields: [shares.sharedByUserId],
    references: [users.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertFolderSchema = createInsertSchema(folders).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertFileSchema = createInsertSchema(files).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertShareSchema = createInsertSchema(shares).omit({
  id: true,
  createdAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Folder = typeof folders.$inferSelect;
export type InsertFolder = z.infer<typeof insertFolderSchema>;
export type File = typeof files.$inferSelect;
export type InsertFile = z.infer<typeof insertFileSchema>;
export type Share = typeof shares.$inferSelect;
export type InsertShare = z.infer<typeof insertShareSchema>;
