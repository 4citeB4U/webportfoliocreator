import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { contentSection, chartData } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  setupAuth(app);

  // Content management endpoints
  app.get("/api/content/:section", (req, res) => {
    const section = req.params.section;
    const content = storage.getContent(section);
    res.json(content);
  });

  app.post("/api/content/:section", (req, res) => {
    if (!req.isAuthenticated() || req.user?.username !== "admin") {
      return res.sendStatus(403);
    }

    const section = req.params.section;
    const validatedContent = contentSection.parse(req.body);
    storage.updateContent(section, validatedContent);
    res.sendStatus(200);
  });

  // Chart data endpoints
  app.get("/api/charts/:chartId", (req, res) => {
    const chartId = req.params.chartId;
    const data = storage.getChartData(chartId);
    res.json(data);
  });

  app.post("/api/charts/:chartId", (req, res) => {
    if (!req.isAuthenticated() || req.user?.username !== "admin") {
      return res.sendStatus(403);
    }

    const chartId = req.params.chartId;
    const validatedData = chartData.parse(req.body);
    storage.updateChartData(chartId, validatedData);
    res.sendStatus(200);
  });

  const httpServer = createServer(app);
  return httpServer;
}
