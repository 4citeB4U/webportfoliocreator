import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User roles enum
export const UserRole = {
  ADMIN: 'admin',
  EDITOR: 'editor',
  VIEWER: 'viewer'
} as const;

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull(),
  role: text("role", { enum: Object.values(UserRole) }).notNull().default('viewer'),
  isActive: boolean("is_active").notNull().default(true),
  canManageUsers: boolean("can_manage_users").notNull().default(false),
  canEditContent: boolean("can_edit_content").notNull().default(false),
  canPublish: boolean("can_publish").notNull().default(false),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  role: true,
  isActive: true,
  canManageUsers: true,
  canEditContent: true,
  canPublish: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Content schemas for admin updates
export const contentSection = z.object({
  title: z.string(),
  content: z.string(),
  audioScript: z.string(),
});

export const chartData = z.object({
  title: z.string(),
  data: z.array(z.record(z.string(), z.union([z.string(), z.number()]))),
  explanation: z.string(),
});

export type ContentSection = z.infer<typeof contentSection>;
export type ChartData = z.infer<typeof chartData>;