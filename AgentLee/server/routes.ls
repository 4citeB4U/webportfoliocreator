import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { insertChatSchema, insertUserSchema } from "@shared/schema";
import { setupAuth } from "./auth";

export async function registerRoutes(app: Express) {
  // Set up authentication routes (/api/register, /api/login, /api/logout, /api/user)
  setupAuth(app);

  // Save chat history
  app.post("/api/chats", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    try {
      const chatData = insertChatSchema.parse({
        ...req.body,
        userId: req.user.id
      });
      const chat = await storage.createChat(chatData);
      res.json(chat);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  // Get chat history for user
  app.get("/api/chats", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    try {
      const chats = await storage.getChatsByUserId(req.user.id);
      res.json(chats);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get specific chat
  app.get("/api/chats/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    try {
      const chat = await storage.getChat(parseInt(req.params.id));
      if (!chat) {
        res.status(404).json({ error: "Chat not found" });
        return;
      }

      // Only allow access to own chats
      if (chat.userId !== req.user.id) {
        return res.status(403).json({ error: "Unauthorized" });
      }

      res.json(chat);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}