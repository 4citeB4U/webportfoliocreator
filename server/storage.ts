import { users, chats, notes, settings } from "@shared/schema";
import type { User, InsertUser, Chat, InsertChat, Note, InsertNote, Settings, InsertSettings } from "@shared/schema";
import { db } from "./db";
import { eq, desc, sql } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

const PostgresSessionStore = connectPg(session);

interface ChatHistory {
  id: number;
  chatId: number;
  message: string;
  timestamp: Date;
}

interface InsertChatHistory {
  chatId: number;
  message: string;
}


export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Chat operations
  getChat(id: number): Promise<Chat | undefined>;
  getChatsByUserId(userId: number, page?: number, limit?: number): Promise<Chat[]>;
  createChat(chat: InsertChat): Promise<Chat>;
  createChatHistory(history: InsertChatHistory): Promise<ChatHistory>;
  updateChat(id: number, chat: Partial<InsertChat>): Promise<Chat>;

  // Note operations
  getNote(id: number): Promise<Note | undefined>;
  getNotesByUserId(userId: number): Promise<Note[]>;
  createNote(note: InsertNote): Promise<Note>;
  updateNote(id: number, note: Partial<InsertNote>): Promise<Note>;

  // Settings operations
  getSettings(userId: number): Promise<Settings | undefined>;
  updateSettings(userId: number, settings: Partial<InsertSettings>): Promise<Settings>;

  // Session store
  sessionStore: session.Store;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({
      pool,
      createTableIfMissing: true,
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getChat(id: number): Promise<Chat | undefined> {
    const [chat] = await db
      .select()
      .from(chats)
      .where(eq(chats.id, id));
    return chat;
  }

  async getChatsByUserId(
    userId: number,
    page: number = 1,
    limit: number = 10
  ): Promise<Chat[]> {
    const offset = (page - 1) * limit;
    return db
      .select()
      .from(chats)
      .where(eq(chats.userId, userId))
      .orderBy(desc(chats.updatedAt))
      .limit(limit)
      .offset(offset);
  }

  async createChat(insertChat: InsertChat): Promise<Chat> {
    const [chat] = await db
      .insert(chats)
      .values(insertChat)
      .returning();
    return chat;
  }

  async createChatHistory(insertHistory: InsertChatHistory): Promise<ChatHistory> {
    const [history] = await db
      .insert(chatHistory)
      .values(insertHistory)
      .returning();
    return history;
  }

  async updateChat(id: number, updateData: Partial<InsertChat>): Promise<Chat> {
    const [chat] = await db
      .update(chats)
      .set({
        ...updateData,
        updatedAt: new Date()
      })
      .where(eq(chats.id, id))
      .returning();
    return chat;
  }

  async getNote(id: number): Promise<Note | undefined> {
    const [note] = await db.select().from(notes).where(eq(notes.id, id));
    return note;
  }

  async getNotesByUserId(userId: number): Promise<Note[]> {
    return db.select().from(notes).where(eq(notes.userId, userId));
  }

  async createNote(insertNote: InsertNote): Promise<Note> {
    const [note] = await db.insert(notes).values(insertNote).returning();
    return note;
  }

  async updateNote(id: number, updateData: Partial<InsertNote>): Promise<Note> {
    const [note] = await db
      .update(notes)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(notes.id, id))
      .returning();
    return note;
  }

  async getSettings(userId: number): Promise<Settings | undefined> {
    const [userSettings] = await db.select().from(settings).where(eq(settings.userId, userId));
    return userSettings;
  }

  async updateSettings(userId: number, newSettings: Partial<InsertSettings>): Promise<Settings> {
    const [existingSettings] = await db.select().from(settings).where(eq(settings.userId, userId));

    if (existingSettings) {
      const [updated] = await db
        .update(settings)
        .set(newSettings)
        .where(eq(settings.userId, userId))
        .returning();
      return updated;
    } else {
      const [created] = await db
        .insert(settings)
        .values({ ...newSettings, userId } as InsertSettings)
        .returning();
      return created;
    }
  }
}

export const storage = new DatabaseStorage();