import { db } from "../db";
import { portfolios, portfolioComponents } from "@shared/schema";
import { eq } from "drizzle-orm";

export const portfolioController = {
  // Get a single portfolio by ID
  async getPortfolio(req, res) {
    try {
      const portfolio = await db.query.portfolios.findFirst({
        where: eq(portfolios.id, parseInt(req.params.id))
      });

      if (!portfolio) {
        return res.status(404).json({ error: "Portfolio not found" });
      }

      // Check if user has permission to view
      if (!portfolio.isPublished && portfolio.userId !== req.user?.id) {
        return res.status(403).json({ error: "Unauthorized" });
      }

      // Get components
      const components = await db.query.portfolioComponents.findMany({
        where: eq(portfolioComponents.portfolioId, portfolio.id)
      });

      res.json({ ...portfolio, components });
    } catch (error) {
      console.error("[Portfolio Error]:", error);
      res.status(500).json({ error: "Failed to fetch portfolio" });
    }
  },

  // Create a new portfolio
  async createPortfolio(req, res) {
    try {
      const { title, content, settings = {} } = req.body;

      if (!req.user) {
        return res.status(401).json({ error: "Authentication required" });
      }

      // Create the portfolio
      const [newPortfolio] = await db.insert(portfolios).values({
        userId: req.user.id,
        title,
        content,
        settings,
        isPublished: false
      }).returning();

      // If there are components in the content, create them
      if (content.components) {
        const componentValues = content.components.map(comp => ({
          portfolioId: newPortfolio.id,
          type: comp.type,
          content: comp.content,
          position: comp.position
        }));

        await db.insert(portfolioComponents).values(componentValues);
      }

      res.status(201).json(newPortfolio);
    } catch (error) {
      console.error("[Portfolio Error]:", error);
      res.status(500).json({ error: "Failed to create portfolio" });
    }
  },

  // Update a portfolio
  async updatePortfolio(req, res) {
    try {
      const { title, content, settings, isPublished } = req.body;
      const portfolioId = parseInt(req.params.id);

      // Check if portfolio exists and user owns it
      const existingPortfolio = await db.query.portfolios.findFirst({
        where: eq(portfolios.id, portfolioId)
      });

      if (!existingPortfolio) {
        return res.status(404).json({ error: "Portfolio not found" });
      }

      if (existingPortfolio.userId !== req.user?.id) {
        return res.status(403).json({ error: "Unauthorized" });
      }

      // Update portfolio
      await db.update(portfolios)
        .set({
          title,
          content,
          settings,
          isPublished,
          updatedAt: new Date()
        })
        .where(eq(portfolios.id, portfolioId));

      // If there are components, update them
      if (content.components) {
        // Delete existing components
        await db.delete(portfolioComponents)
          .where(eq(portfolioComponents.portfolioId, portfolioId));

        // Insert new components
        const componentValues = content.components.map(comp => ({
          portfolioId,
          type: comp.type,
          content: comp.content,
          position: comp.position
        }));

        await db.insert(portfolioComponents).values(componentValues);
      }

      res.json({ message: "Portfolio updated successfully" });
    } catch (error) {
      console.error("[Portfolio Error]:", error);
      res.status(500).json({ error: "Failed to update portfolio" });
    }
  },

  // Delete a portfolio
  async deletePortfolio(req, res) {
    try {
      const portfolioId = parseInt(req.params.id);

      // Check if portfolio exists and user owns it
      const existingPortfolio = await db.query.portfolios.findFirst({
        where: eq(portfolios.id, portfolioId)
      });

      if (!existingPortfolio) {
        return res.status(404).json({ error: "Portfolio not found" });
      }

      if (existingPortfolio.userId !== req.user?.id) {
        return res.status(403).json({ error: "Unauthorized" });
      }

      // Delete components first (due to foreign key constraint)
      await db.delete(portfolioComponents)
        .where(eq(portfolioComponents.portfolioId, portfolioId));

      // Delete the portfolio
      await db.delete(portfolios)
        .where(eq(portfolios.id, portfolioId));

      res.json({ message: "Portfolio deleted successfully" });
    } catch (error) {
      console.error("[Portfolio Error]:", error);
      res.status(500).json({ error: "Failed to delete portfolio" });
    }
  },

  // List user's portfolios
  async listPortfolios(req, res) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Authentication required" });
      }

      const userPortfolios = await db.query.portfolios.findMany({
        where: eq(portfolios.userId, req.user.id)
      });

      res.json(userPortfolios);
    } catch (error) {
      console.error("[Portfolio Error]:", error);
      res.status(500).json({ error: "Failed to fetch portfolios" });
    }
  }
};
