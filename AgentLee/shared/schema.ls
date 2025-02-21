import { pgTable, text, serial, jsonb, varchar, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User table for authentication
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 100 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Chat history table
export const chats = pgTable("chats", {
  id: serial("id").primaryKey(),
  userId: serial("user_id").references(() => users.id),
  messages: jsonb("messages").$type<Array<{
    role: 'user' | 'assistant';
    content: string;
  }>>().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Notes table
export const notes = pgTable("notes", {
  id: serial("id").primaryKey(),
  userId: serial("user_id").references(() => users.id),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Voice settings table
export const settings = pgTable("settings", {
  id: serial("id").primaryKey(),
  userId: serial("user_id").references(() => users.id),
  selectedVoice: text("selected_voice"),
  particleSpeed: integer("particle_speed").default(4),
  particleColor: varchar("particle_color", { length: 7 }).default('#ffffff'),
});

// Create insert schemas
export const insertUserSchema = createInsertSchema(users).extend({
  email: z.string().email("Invalid email address"),
});
export const insertChatSchema = createInsertSchema(chats);
export const insertNoteSchema = createInsertSchema(notes);
export const insertSettingsSchema = createInsertSchema(settings);

// Export types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertChat = z.infer<typeof insertChatSchema>;
export type InsertNote = z.infer<typeof insertNoteSchema>;
export type InsertSettings = z.infer<typeof insertSettingsSchema>;

export type User = typeof users.$inferSelect;
export type Chat = typeof chats.$inferSelect;
export type Note = typeof notes.$inferSelect;
export type Settings = typeof settings.$inferSelect;