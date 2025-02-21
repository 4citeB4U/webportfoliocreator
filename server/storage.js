import { users, chats, chatHistory, notes, settings } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

const PostgresSessionStore = connectPg(session);

export class DatabaseStorage {
  constructor() {
    this.sessionStore = new PostgresSessionStore({
      pool,
      createTableIfMissing: true,
    });
  }

  async getUser(id) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username) {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser) {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getChat(id) {
    const [chat] = await db
      .select()
      .from(chats)
      .where(eq(chats.id, id));
    return chat;
  }

  async getChatsByUserId(
    userId,
    page = 1,
    limit = 10
  ) {
    const offset = (page - 1) * limit;
    return db
      .select()
      .from(chats)
      .where(eq(chats.userId, userId))
      .orderBy(desc(chats.updatedAt))
      .limit(limit)
      .offset(offset);
  }

  async createChat(insertChat) {
    // Ensure messages is an array before inserting
    const chatData = {
      ...insertChat,
      messages: Array.isArray(insertChat.messages) ? insertChat.messages : []
    };

    const [chat] = await db.insert(chats).values(chatData).returning();
    return chat;
  }

  async createChatHistory(insertHistory) {
    const [history] = await db
      .insert(chatHistory)
      .values(insertHistory)
      .returning();
    return history;
  }

  async updateChat(id, updateData) {
    // Ensure messages is an array before updating
    const chatData = {
      ...updateData,
      messages: Array.isArray(updateData.messages) ? updateData.messages : [],
      updatedAt: new Date()
    };

    const [chat] = await db
      .update(chats)
      .set(chatData)
      .where(eq(chats.id, id))
      .returning();
    return chat;
  }

  async getNote(id) {
    const [note] = await db.select().from(notes).where(eq(notes.id, id));
    return note;
  }

  async getNotesByUserId(userId) {
    return db.select().from(notes).where(eq(notes.userId, userId));
  }

  async createNote(insertNote) {
    const [note] = await db.insert(notes).values(insertNote).returning();
    return note;
  }

  async updateNote(id, updateData) {
    const [note] = await db
      .update(notes)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(notes.id, id))
      .returning();
    return note;
  }

  async getSettings(userId) {
    const [userSettings] = await db.select().from(settings).where(eq(settings.userId, userId));
    return userSettings;
  }

  async updateSettings(userId, newSettings) {
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
        .values({ ...newSettings, userId })
        .returning();
      return created;
    }
  }

  sessionStore;
}

export const storage = new DatabaseStorage();
