import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { contentSection, chartData } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  setupAuth(app);

  // Project preview routes with enhanced logging
  app.get("/projects/:projectId", async (req: Request, res: Response) => {
    try {
      const projectId = req.params.projectId;
      console.log('Received preview request for project:', projectId);

      const project = await storage.getProject(projectId);

      if (!project) {
        console.log('Project not found:', projectId);
        return res.status(404).send(`
          <html>
            <body>
              <h1>Project Not Found</h1>
              <p>The requested project "${projectId}" could not be found.</p>
            </body>
          </html>
        `);
      }

      console.log('Found project:', project);

      // Send an HTML preview page
      res.send(`
        <html>
          <head>
            <title>${project.name}</title>
          </head>
          <body>
            <h1>${project.name}</h1>
            <p>${project.description}</p>
            <div style="padding: 20px; border: 1px solid #ccc; margin: 20px;">
              ${project.components?.map(comp => `
                <div style="margin-bottom: 10px;">
                  <h3>${comp.name || 'Component'}</h3>
                  ${comp.content || ''}
                </div>
              `).join('') || 'No components added yet.'}
            </div>
          </body>
        </html>
      `);
    } catch (error) {
      console.error('Error serving project preview:', error);
      res.status(500).send(`
        <html>
          <body>
            <h1>Error</h1>
            <p>Failed to load project preview.</p>
          </body>
        </html>
      `);
    }
  });

  // AI Assistant endpoint
  app.post("/api/ai/generate", async (req: Request, res: Response) => {
    try {
      const { query } = req.body;
      if (!query) {
        return res.status(400).json({ error: "Query is required" });
      }

      console.log('Processing query with Web Buddy:', query);

      // Spawn a Python process to run the model
      const pythonProcess = spawn('python3', ['server/ai_service.py'], {
        stdio: ['pipe', 'pipe', 'pipe']
      });

      let output = '';
      let errorOutput = '';

      pythonProcess.stdout.on('data', (data) => {
        output += data.toString();
      });

      pythonProcess.stderr.on('data', (data) => {
        errorOutput += data.toString();
        console.error('Python error:', data.toString());
      });

      // Send the query as a JSON string to the Python process
      pythonProcess.stdin.write(JSON.stringify({ 
        messages: [{ role: "user", content: query }] 
      }));
      pythonProcess.stdin.end();

      await new Promise((resolve, reject) => {
        pythonProcess.on('close', (code) => {
          if (code === 0) {
            resolve(code);
          } else {
            reject(new Error(`Process exited with code ${code}`));
          }
        });
      });

      if (errorOutput) {
        console.error('AI service error:', errorOutput);
        throw new Error(errorOutput);
      }

      try {
        const parsedOutput = JSON.parse(output.trim());
        res.json(parsedOutput);
      } catch (parseError) {
        console.error('Error parsing AI response:', parseError);
        res.json({ response: output.trim() });
      }
    } catch (error: any) {
      console.error('AI generation error:', error);
      res.status(500).json({ 
        error: "Failed to generate AI response",
        details: error.message 
      });
    }
  });

  app.get("/api/content/:section", async (req: Request, res: Response) => {
    try {
      const section = z.string().parse(req.params.section);
      const content = await storage.getContent(section);
      if (!content) {
        return res.status(404).json({ error: "Content not found" });
      }
      res.json(content);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid section parameter" });
      }
      res.status(500).json({ error: "Failed to fetch content" });
    }
  });

  app.post("/api/content/:section", async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.isAuthenticated() || req.user?.username !== "admin") {
        return res.status(403).json({ error: "Unauthorized" });
      }

      const section = z.string().parse(req.params.section);
      const validatedContent = contentSection.parse(req.body);
      await storage.updateContent(section, validatedContent);
      res.status(200).json({ message: "Content updated successfully" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to update content" });
    }
  });

  app.get("/api/charts/:chartId", async (req: Request, res: Response) => {
    try {
      const chartId = z.string().parse(req.params.chartId);
      const data = await storage.getChartData(chartId);
      if (!data) {
        return res.status(404).json({ error: "Chart data not found" });
      }
      res.json(data);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid chart ID" });
      }
      res.status(500).json({ error: "Failed to fetch chart data" });
    }
  });

  app.post("/api/charts/:chartId", async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.isAuthenticated() || req.user?.username !== "admin") {
        return res.status(403).json({ error: "Unauthorized" });
      }

      const chartId = z.string().parse(req.params.chartId);
      const validatedData = chartData.parse(req.body);
      await storage.updateChartData(chartId, validatedData);
      res.status(200).json({ message: "Chart data updated successfully" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to update chart data" });
    }
  });

  return createServer(app);
}