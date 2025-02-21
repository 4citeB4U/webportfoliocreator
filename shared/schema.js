import { pgTable, text, serial, jsonb, varchar, timestamp, integer, boolean } from "drizzle-orm/pg-core";
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

// Updated Chat history table with improved message structure
export const chats = pgTable("chats", {
  id: serial("id").primaryKey(),
  userId: serial("user_id").references(() => users.id),
  title: varchar("title", { length: 255 }).notNull(),
  messages: jsonb("messages").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Chat history table for tracking conversations
export const chatHistory = pgTable("chat_history", {
  id: serial("id").primaryKey(),
  chatId: serial("chat_id").references(() => chats.id),
  userId: serial("user_id").references(() => users.id),
  title: varchar("title", { length: 255 }).notNull(),
  summary: text("summary"),
  messageCount: integer("message_count").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  lastMessageAt: timestamp("last_message_at").defaultNow().notNull(),
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
export const insertChatHistorySchema = createInsertSchema(chatHistory);

// Export types
export const InsertUser = insertUserSchema;
export const InsertChat = insertChatSchema;
export const InsertNote = insertNoteSchema;
export const InsertSettings = insertSettingsSchema;
export const InsertChatHistory = insertChatHistorySchema;

export const User = users;
export const Chat = chats;
export const Note = notes;
// Portfolio table
export const portfolios = pgTable("portfolios", {
  id: serial("id").primaryKey(),
  userId: serial("user_id").references(() => users.id),
  title: varchar("title", { length: 255 }).notNull(),
  content: jsonb("content").notNull(), // Stores component layout and data
  isPublished: boolean("is_published").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  settings: jsonb("settings").default('{}'), // Theme, colors, etc.
});

// Portfolio components table
export const portfolioComponents = pgTable("portfolio_components", {
  id: serial("id").primaryKey(),
  portfolioId: serial("portfolio_id").references(() => portfolios.id),
  type: varchar("type", { length: 50 }).notNull(), // e.g., "text", "image", etc.
  content: jsonb("content").notNull(),
  position: jsonb("position").notNull(), // {x, y, z} coordinates
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Create insert schemas for portfolios
export const insertPortfolioSchema = createInsertSchema(portfolios);
export const insertPortfolioComponentSchema = createInsertSchema(portfolioComponents);

// Export types and tables
export const InsertPortfolio = insertPortfolioSchema;
export const InsertPortfolioComponent = insertPortfolioComponentSchema;
export const Portfolio = portfolios;
export const PortfolioComponent = portfolioComponents;

export const Settings = settings;
export const ChatHistory = chatHistory;
