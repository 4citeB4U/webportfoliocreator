import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Define UserRole as a proper readonly tuple for TypeScript
export const UserRole = {
  ADMIN: 'admin',
  EDITOR: 'editor',
  VIEWER: 'viewer'
} as const;

// Create a Zod enum for validation
export const userRoleEnum = z.enum(['admin', 'editor', 'viewer']);
export type UserRoleType = z.infer<typeof userRoleEnum>;

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull(),
  role: text("role", { enum: ['admin', 'editor', 'viewer'] }).notNull().default('viewer'),
  isActive: boolean("is_active").notNull().default(true),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  role: true,
  isActive: true,
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