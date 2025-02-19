import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { insertChatSchema } from "@shared/schema";
import { setupAuth } from "./auth";

export async function registerRoutes(app: Express) {
  // Set up authentication routes (/api/register, /api/login, /api/logout, /api/user)
  setupAuth(app);

  // Create new chat
  app.post("/api/chats", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    try {
      const chatData = insertChatSchema.parse({
        ...req.body,
        userId: req.user.id,
        messages: req.body.messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date().toISOString()
        }))
      });

      const chat = await storage.createChat(chatData);

      // Create chat history entry
      await storage.createChatHistory({
        chatId: chat.id,
        title: req.body.title || `Chat ${chat.id}`,
        messageCount: chat.messages.length,
        summary: chat.messages[0].content.substring(0, 100) + "..."
      });

      res.json(chat);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Update existing chat
  app.patch("/api/chats/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    try {
      const chatId = parseInt(req.params.id);
      const chat = await storage.getChat(chatId);

      if (!chat) {
        return res.status(404).json({ error: "Chat not found" });
      }

      if (chat.userId !== req.user.id) {
        return res.status(403).json({ error: "Unauthorized" });
      }

      const updatedChat = await storage.updateChat(chatId, {
        ...req.body,
        messages: req.body.messages.map((msg: any) => ({
          ...msg,
          timestamp: msg.timestamp || new Date().toISOString()
        }))
      });

      res.json(updatedChat);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get chat history for user with pagination
  app.get("/api/chats", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const chats = await storage.getChatsByUserId(req.user.id, page, limit);
      res.json(chats);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get specific chat with full context
  app.get("/api/chats/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    try {
      const chat = await storage.getChat(parseInt(req.params.id));
      if (!chat) {
        return res.status(404).json({ error: "Chat not found" });
      }

      if (chat.userId !== req.user.id) {
        return res.status(403).json({ error: "Unauthorized" });
      }

      res.json(chat);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}