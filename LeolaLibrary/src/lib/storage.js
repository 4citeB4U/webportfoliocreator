import { users, type User, type InsertUser, type ContentSection, type ChartData } from "@shared/schema";
import createMemoryStore from "memorystore";
import session from "express-session";
import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

const MemoryStore = createMemoryStore(session);

async function hashInitialPassword(password: string) {
  const salt = "0123456789abcdef";
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getContent(section: string): Promise<ContentSection>;
  updateContent(section: string, content: ContentSection): Promise<void>;
  getChartData(chartId: string): Promise<ChartData>;
  updateChartData(chartId: string, data: ChartData): Promise<void>;
  sessionStore: session.Store;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private content: Map<string, ContentSection>;
  private chartData: Map<string, ChartData>;
  sessionStore: session.Store;
  currentId: number;

  constructor() {
    this.users = new Map();
    this.content = new Map();
    this.chartData = new Map();
    this.currentId = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });

    // Initialize admin user with simpler credentials
    const initializeStorage = async () => {
      const adminUser: User = {
        id: this.currentId++,
        username: "admin",
        password: await hashInitialPassword("admin"), // Simpler password for development
        email: "admin@rapidwebdev.com",
        phoneNumber: null,
        role: "admin"
      };
      this.users.set(adminUser.id, adminUser);
      console.log("Admin user initialized with username:", adminUser.username);
    };

    // Call initialization
    initializeStorage().catch(console.error);

    // Initialize with default content
    this.content.set('executive-summary', {
      title: "Executive Summary",
      content: "Pro Driver Academy (PDA) is a Wisconsin-based nonprofit organization...",
      audioScript: "Pro Driver Academy is a Wisconsin-based nonprofit organization dedicated to addressing the critical shortage of qualified Class A Commercial Driver's License holders..."
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { 
      id, 
      ...insertUser,
      phoneNumber: insertUser.phoneNumber || null,
      role: insertUser.role || 'viewer'
    };
    this.users.set(id, user);
    return user;
  }

  async getContent(section: string): Promise<ContentSection> {
    return this.content.get(section) || {
      title: "",
      content: "",
      audioScript: ""
    };
  }

  async updateContent(section: string, content: ContentSection): Promise<void> {
    this.content.set(section, content);
  }

  async getChartData(chartId: string): Promise<ChartData> {
    return this.chartData.get(chartId) || {
      title: "",
      data: [],
      explanation: ""
    };
  }

  async updateChartData(chartId: string, data: ChartData): Promise<void> {
    this.chartData.set(chartId, data);
  }
}

export const storage = new MemStorage();